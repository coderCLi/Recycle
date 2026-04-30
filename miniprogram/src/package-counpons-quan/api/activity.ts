/**
 * 双十一活动领劵API
 */
import { http } from '@/utils/http'

// export const testCustomHeader = (data: any) => {
//   // 请求报文不加密，响应报文不解密，验证登录，POST请求，自定义请求头
//   return http('/foo3', data, {
//     encrypt: false,
//     decrypt: false,
//     login: true,
//     headers: { 'X-Custom-Header': 'custom-value' },
//   })
// }
// 领券列表
export const receiveRewards = (data: any) => {
  return http('/operation/ReceiveRewardsController/receiveRewards', data, {
    encrypt: false,
    decrypt: false,
    login: false,
    catchRes : true,
  })
}
// 领取奖券
export const getReceiveRewardsInfo = (data: any) => {
  return http(
    '/operation/ReceiveRewardsController/getReceiveRewardsInfo',
    data,
    {
      catchRes : true,
      encrypt: false,
      decrypt: false,
      login: false,
    }
  )
}
// 获取活动信息
export const getActivityRules = (data: any) => {
  return http('/operation/bdturntable/getActivityRules', data, {
    encrypt: false,
    decrypt: false,
    login: false,
    catchRes : true,
    headers: { 'X-Custom-Header': 'custom-value' },
  })
}
//  获取活动状态
export const getActivityState = (data: any) => {
  return http('/operation/ReceiveRewardsController/getActivityState', data, {
    encrypt: false,
    decrypt: false,
    login: false,
    catchRes : true,
    headers: { 'X-Custom-Header': 'custom-value' },
  })
}

  //查询优惠券列表
  export const getCouponActivPage = (data: any) => {
    return http('/sceneactiv/CouponActivController/getCouponActivPage.do', data, {catchError: true})
  }
  //领券用户初始化
  export const couinitUser = (data: any) => {
    return http('/sceneactiv/CouponActivController/initUser.do', data, {catchError: true})
  }
  //查询优惠券详情
  export const getCouponActivDetail = (data: any) => {
    return http('/sceneactiv/CouponActivController/getCouponActivDetail.do', data,{encrypt:false,catchRes:true})
  }
  //领取优惠券
  export const doCoupon = (data: any) => {
    return http('/sceneactiv/CouponActivController/coupon.do', data, {catchError: true})
  }