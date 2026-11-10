/**
 * 企业微信群机器人通知（客户端直连版）
 * 说明：小程序端直接 POST 到企业微信 webhook。
 * 需要在微信公众平台「开发管理 → 服务器域名 → request 合法域名」中添加：
 *   https://qyapi.weixin.qq.com
 * 开发调试时可在微信开发者工具「详情 → 本地设置」勾选「不校验合法域名」。
 *
 * 注意：webhook 地址会随小程序包发布，存在被提取的风险（个人使用可接受）。
 */

const WECOM_WEBHOOK =
  'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=bf701599-9b27-4a07-8166-31dbd1265c09'

/**
 * 发送新预约通知
 * @param {Object} order 预约数据
 */
export const notifyWecom = (order = {}) => {
  const item = order.item || {}
  const content = [
    '【新回收预约】',
    `物品：${[item.brand, item.model].filter(Boolean).join(' ') || item.category || '回收物品'}`,
    `成色：${item.condition || ''}`,
    `预估价格：¥${item.price || 0}`,
    `联系人：${order.name || ''}`,
    `电话：${order.phone || ''}`,
    `地址：${order.address || ''}`,
    `时间：${order.date || ''} ${order.time || ''}`,
    order.remark ? `备注：${order.remark}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return new Promise((resolve) => {
    uni.request({
      url: WECOM_WEBHOOK,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        msgtype: 'text',
        text: { content },
      },
      success: (res) => {
        console.log('企业微信通知结果', res.data)
        resolve(true)
      },
      fail: (err) => {
        console.warn('企业微信通知失败', err)
        resolve(false)
      },
    })
  })
}
