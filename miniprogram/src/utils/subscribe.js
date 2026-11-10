/**
 * 微信一次性订阅消息
 * 模板：预约回收通知（模板编号 30295）
 *   姓名 thing1 / 手机号码 phone_number2 / 物品类型 thing3 / 所在地址 thing4
 *
 * 注意：
 * 1. wx.requestSubscribeMessage 必须在用户点击事件中调用，一次授权仅可下发一条消息；
 * 2. 实际发送在云函数 sendAppointmentNotice 中完成（客户端无法直接调用订阅消息接口）。
 */

// 一次性订阅消息模板 ID（微信公众平台 → 订阅消息 → 我的模板）
export const APPOINTMENT_TMPL_ID = 'BphzTM8Pv1aq8O3tUXnYX1WfIlf8wZpWTHpP8Pax9DA'

/**
 * 申请「预约回收通知」订阅授权
 * @returns {Promise<'accept'|'reject'|'ban'|'filter'|'unsupported'|'error'>}
 */
export const requestAppointmentSubscribe = () => {
  // #ifdef MP-WEIXIN
  return new Promise((resolve) => {
    if (typeof wx === 'undefined' || !wx.requestSubscribeMessage) {
      resolve('unsupported')
      return
    }
    wx.requestSubscribeMessage({
      tmplIds: [APPOINTMENT_TMPL_ID],
      success: (res) => {
        resolve((res && res[APPOINTMENT_TMPL_ID]) || 'unknown')
      },
      fail: (err) => {
        console.warn('订阅消息授权失败', err)
        // 20004：用户关闭了「订阅消息」总开关；20001：模板 ID 无效
        const code = err && err.errCode
        if (code === 20004) resolve('ban')
        else if (code === 20001) resolve('invalid')
        else resolve('error')
      },
    })
  })
  // #endif
  // #ifndef MP-WEIXIN
  return Promise.resolve('unsupported')
  // #endif
}
