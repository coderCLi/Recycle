/**
 * 云函数：下发「预约回收通知」一次性订阅消息给客户
 *
 * 模板字段：
 *   thing1         姓名
 *   phone_number2  手机号码
 *   thing3         物品类型
 *   thing4         所在地址
 *
 * 调用前提：客户端在用户点击「提交预约」时已调用 wx.requestSubscribeMessage 并获得授权
 *          （order.subscribeAccepted === true）。
 * 说明：一次性订阅每次授权只能下发一条消息，下发失败不会影响已提交的预约单。
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 一次性订阅消息模板 ID（与小程序端 src/utils/subscribe.js 保持一致）
const TEMPLATE_ID = 'BphzTM8Pv1aq8O3tUXnYX1WfIlf8wZpWTHpP8Pax9DA'
// 点击通知卡片后跳转的页面
const TARGET_PAGE = 'pages/mine/mine'
// 点击通知打开的小程序版本：formal 正式版 / trial 体验版 / developer 开发版
// 未发布正式版时可改为 developer，或通过云函数环境变量 MINIPROGRAM_STATE 配置
const MINIPROGRAM_STATE = process.env.MINIPROGRAM_STATE || 'formal'

/** thing 类型最长 20 个字，超出截断，避免 47003 参数错误 */
const clip = (value, max = 20) => {
  const text = String(value == null ? '' : value)
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

exports.main = async (event = {}) => {
  const { OPENID } = cloud.getWXContext()
  const { order } = event

  if (!OPENID) {
    return { success: false, message: '缺少用户身份' }
  }
  if (!order || !order.subscribeAccepted) {
    return { success: false, message: '用户未授权订阅消息' }
  }

  const phone = String(order.phone || '').replace(/[^\d+]/g, '')
  if (!/^\+?\d{6,20}$/.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }

  const item = order.item || {}
  const itemType =
    item.category || [item.brand, item.model].filter(Boolean).join(' ') || '回收物品'

  try {
    const res = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      templateId: TEMPLATE_ID,
      page: TARGET_PAGE,
      lang: 'zh_CN',
      miniprogramState: MINIPROGRAM_STATE,
      data: {
        thing1: { value: clip(order.name || '客户') },
        phone_number2: { value: phone },
        thing3: { value: clip(itemType) },
        thing4: { value: clip(order.address || '待确认') },
      },
    })
    console.log('subscribeMessage.send 成功', res)
    return { success: true, errCode: res.errCode }
  } catch (err) {
    console.error('subscribeMessage.send 失败', err)
    return {
      success: false,
      errCode: err.errCode,
      message: err.errMsg || err.message || '订阅消息发送失败',
    }
  }
}
