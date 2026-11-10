/**
 * 云函数：获取微信手机号
 *
 * 客户端用 <button open-type="getPhoneNumber"> 拿到 e.detail.code 后调用本函数，
 * 由云函数调用 phonenumber.getPhoneNumber 换取手机号并回传，供表单自动填写。
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event = {}) => {
  const { code } = event

  if (!code) {
    return { success: false, message: '缺少手机号凭证 code' }
  }

  try {
    const res = await cloud.openapi.phonenumber.getPhoneNumber({ code })
    const info = (res && res.phoneInfo) || {}

    if (!info.phoneNumber && !info.purePhoneNumber) {
      return { success: false, message: '未获取到手机号' }
    }

    return {
      success: true,
      phoneNumber: info.phoneNumber,
      purePhoneNumber: info.purePhoneNumber,
      countryCode: info.countryCode,
    }
  } catch (err) {
    console.error('getPhoneNumber 失败', err)
    return {
      success: false,
      errCode: err.errCode,
      message: err.errMsg || err.message || '获取手机号失败',
    }
  }
}
