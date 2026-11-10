/**
 * 云函数：提交预约单
 * 1. 将预约写入 appointments 集合
 * 2. 可选：通过企业微信群机器人 webhook 通知回收人员
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 企业微信群机器人 webhook（云函数可用时生效）
const WECOM_WEBHOOK = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=bf701599-9b27-4a07-8166-31dbd1265c09'

/**
 * 发送企业微信群机器人通知（文本消息）
 */
async function notifyWecom(order) {
  if (!WECOM_WEBHOOK) return null

  const item = order.item || {}
  const content = [
    '【新回收预约】',
    `物品：${item.brand || ''} ${item.model || ''}`,
    `成色：${item.condition || ''}`,
    `预估价格：¥${item.price || 0}`,
    `联系人：${order.name}`,
    `电话：${order.phone}`,
    `地址：${order.address}`,
    `时间：${order.date} ${order.time}`,
    order.remark ? `备注：${order.remark}` : '',
  ].filter(Boolean).join('\n')

  const https = require('https')
  const { URL } = require('url')
  const url = new URL(WECOM_WEBHOOK)
  const payload = JSON.stringify({
    msgtype: 'text',
    text: { content },
  })

  return new Promise((resolve) => {
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
        res.on('end', () => resolve(true))
      }
    )
    req.on('error', () => resolve(false))
    req.write(payload)
    req.end()
  })
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { order } = event

  try {
    const result = await db.collection('appointments').add({
      data: {
        ...order,
        openid: wxContext.OPENID,
        status: 'pending', // pending: 待处理 / done: 已完成 / canceled: 已取消
        createTime: db.serverDate(),
      },
    })

    // 通知（失败不影响主流程）
    await notifyWecom(order)

    return { success: true, id: result._id }
  } catch (err) {
    console.error('submitAppointment error', err)
    return { success: false, message: '预约提交失败，请稍后重试' }
  }
}
