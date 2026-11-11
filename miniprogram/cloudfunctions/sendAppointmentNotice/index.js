/**
 * 云函数：预约通知
 *
 * 两种调用模式：
 *   1. 客户提交（默认）：商家提醒 —— 企业微信群机器人 + admins 集合中 noticeReady 的管理员订阅消息；
 *      此时不给客户发消息，客户在提交页的授权留到商家处理后使用。
 *   2. 商家处理（event.asAdmin = true）：管理员手动「通知客户」 —— 用客户提交时的授权，
 *      给预约的创建者发一条订阅消息，并标记 customerNotified 防止重复。
 *
 * 模板字段：
 *   thing1         姓名
 *   phone_number2  手机号码
 *   thing3         物品类型
 *   thing4         所在地址
 *
 * 说明：一次性订阅每次授权只能下发一条，授权不限制下发时间，因此可以留到商家处理时再发。
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 一次性订阅消息模板 ID（与小程序端 src/utils/subscribe.js 保持一致）
const TEMPLATE_ID = 'BphzTM8Pv1aq8O3tUXnYX1WfIlf8wZpWTHpP8Pax9DA'
// 点击通知打开的小程序版本：formal 正式版 / trial 体验版 / developer 开发版
const MINIPROGRAM_STATE = process.env.MINIPROGRAM_STATE || 'formal'
// 客户回执点击后跳转页面
const CUSTOMER_PAGE = 'pages/mine/mine'

/** thing 类型最长 20 个字，超出截断，避免 47003 参数错误 */
const clip = (value, max = 20) => {
  const text = String(value == null ? '' : value)
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// 企业微信群机器人 webhook（与小程序端 src/utils/wecom.js 一致）
const WECOM_WEBHOOK =
  'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=bf701599-9b27-4a07-8166-31dbd1265c09'

/**
 * 企业微信群机器人通知（服务端直连，不受小程序 request 合法域名限制）
 * 商家每单必达，不需要订阅授权
 */
const notifyWecom = (order, itemType) => {
  return new Promise((resolve) => {
    if (!WECOM_WEBHOOK) {
      resolve(false)
      return
    }
    const https = require('https')
    const { URL } = require('url')
    const url = new URL(WECOM_WEBHOOK)
    const item = order.item || {}
    const content = [
      '【新回收预约】',
      `物品：${itemType}`,
      `成色：${item.condition || '未填写'}`,
      `预估价格：¥${item.price || 0}`,
      `联系人：${order.name || ''}`,
      `电话：${order.phone || ''}`,
      `地址：${order.address || ''}`,
      `时间：${order.date || ''} ${order.time || ''}`,
      order.remark ? `备注：${order.remark}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    const payload = JSON.stringify({
      msgtype: 'text',
      text: { content },
    })

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        res.on('data', () => {})
        res.on('end', () => resolve(res.statusCode === 200))
      }
    )
    req.on('error', (err) => {
      console.error('企业微信通知失败', err)
      resolve(false)
    })
    req.write(payload)
    req.end()
  })
}

exports.main = async (event = {}) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { id } = event
  let order = event.order || null

  // 优先按 _id 读取数据库中的真实预约数据，避免客户端伪造
  if (id) {
    try {
      const doc = await db.collection('appointments').doc(id).get()
      if (doc && doc.data) {
        order = {
          ...doc.data,
          // 客户在成功页重新授权补发时，以客户端标记为准
          subscribeAccepted: !!(doc.data.subscribeAccepted || (event.order && event.order.subscribeAccepted)),
        }
      }
    } catch (e) {
      console.warn('读取预约数据失败，使用客户端数据', e)
    }
  }

  if (!order) {
    return { success: false, message: '预约数据不存在' }
  }

  const phone = String(order.phone || '').replace(/[^\d+]/g, '')
  if (!/^\+?\d{6,20}$/.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }

  const item = order.item || {}
  const itemType =
    item.category || [item.brand, item.model].filter(Boolean).join(' ') || '回收物品'

  const data = {
    thing1: { value: clip(order.name || '客户') },
    phone_number2: { value: phone },
    thing3: { value: clip(itemType) },
    thing4: { value: clip(order.address || '待确认') },
  }

  const send = (touser, page) =>
    cloud.openapi.subscribeMessage.send({
      touser,
      templateId: TEMPLATE_ID,
      page,
      lang: 'zh_CN',
      miniprogramState: MINIPROGRAM_STATE,
      data,
    })

  // ---------- 模式一：商家处理完，通知客户 ----------
  if (event.asAdmin) {
    // 只有管理员可以触发
    let isAdmin = false
    try {
      const adminRes = await db.collection('admins').where({ openid: OPENID }).limit(1).get()
      isAdmin = (adminRes.data || []).length > 0
    } catch (e) {
      isAdmin = false
    }
    if (!isAdmin) {
      return { success: false, message: '无管理权限' }
    }

    const owner = order._openid || order.openid
    if (!owner) {
      return { success: false, message: '缺少客户标识，无法通知' }
    }
    if (order.customerNotified) {
      return { success: true, customer: true, already: true }
    }

    try {
      await send(owner, CUSTOMER_PAGE)
      if (id) {
        await db.collection('appointments').doc(id).update({
          data: { customerNotified: true, customerNotifiedTime: db.serverDate() },
        })
      }
      return { success: true, customer: true }
    } catch (err) {
      console.error('通知客户失败', err)
      return {
        success: false,
        customer: false,
        errCode: err.errCode,
        message: '客户未订阅或授权已用完，请让客户重新开启通知',
      }
    }
  }

  // ---------- 模式二：客户刚提交，只通知商家 ----------
  let admins = 0
  let adminFailed = 0
  const adminPage = id
    ? `pages/admin/appointmentDetail?id=${id}&shared=1`
    : 'pages/admin/appointments'

  try {
    const res = await db.collection('admins').where({ noticeReady: true }).limit(20).get()
    for (const admin of res.data || []) {
      if (!admin.openid) continue
      try {
        await send(admin.openid, adminPage)
        admins++
        // 一次性授权已消耗，需要管理员重新点「开启提醒」
        await db.collection('admins').doc(admin._id).update({
          data: { noticeReady: false, lastNoticeTime: db.serverDate() },
        })
      } catch (err) {
        adminFailed++
        console.error('管理员预约提醒发送失败', err)
        // 43101：用户拒收/未订阅，清除标记，避免一直显示“已开启”
        if (err && (err.errCode === 43101 || err.errCode === 43102)) {
          try {
            await db.collection('admins').doc(admin._id).update({ data: { noticeReady: false } })
          } catch (e) {
            console.warn('重置管理员提醒状态失败', e)
          }
        }
      }
    }
  } catch (e) {
    console.error('查询管理员列表失败', e)
  }

  // 企业微信群机器人（商家必达，不依赖订阅授权）
  const wecom = await notifyWecom(order, itemType)

  return {
    success: admins > 0 || wecom,
    customer: false,
    admins,
    adminFailed,
    wecom,
  }
}
