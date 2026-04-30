/*
 * @Author: chilei gchilei0815@gmail.com
 * @Date: 2026-04-21 15:39:14
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-23 16:30:21
 * @FilePath: /miniprogram/src/package-cards-platform/api/cardApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 卡券服务接口地址信息

import { http } from '@/utils/http'
 

// 获取下拉框选项
export const getDataDic = (data:any) => {
    return http('/abpapp/CommonController/getDataDicList.do',data)
}
// 获取JSON数据详情
export const getJsonDetailById = (data:any) => {
  return http('/abpapp/JsonManageController/getDetail.do', data)
}

// 我的卡券
export const getCouponList = (data:any) => {
    return http('/abpapp/CouponController/getCouponInfoByUserId.do',data)
}

// 我的卡券 （2）
export const getCouponListSec = (data:any) => {
    return http('/abpapp/CouponController/getCouponInfoByUserId2.do',data)
}

// 卡券核销详情 
export const getCouponDetailSec = (data:any) => {
    return http('/abpapp/CouponController/getCouponVerInfo2.do',data)
}

// 卡券详情 
export const getCouponDetails = (data:any) => {
    return http('/abpapp/CouponController/getCouponBaseDetails.do',data)
}

// 卡券使用门店查询
export const getCouponMerchants = (data:any) => {
    return http('/abpapp/CouponController/getCouponBaseBuffById.do',data)
}

// 卡券详情

export const getCouponInfoById = (data:any) => {
    return http('/abpapp/CouponController/getCouponBaseInfoById.do',data)
}

// 用户领取优惠卷

export const userGetCoupon = (data:any) => {
    return http('/abpapp/CouponController/userGetCoupon.do',data)
}
// 核销优惠券
export const mctapiuserCoupon = (data:any) => {
  return http('/mctapi/CouponController/userCoupon.do', data)
}
// 根据用户和卡卷信息核销当前优惠卷
export const userCoupon = (data:any) => {
    return http('/abpapp/CouponController/userCoupon.do',data)
}

// 核销停车券
export const userCouponForParking = (data:any) => {
    return http('/mctapi/CouponController/userCouponForParking.do',data)
}

// 商户查询
export const getMctInfoList = (data:any) => {
    return http('/abpapp/CouponController/getMctInfoList.do',data)
}


// 商品查询
export const getProductInfoList = (data:any) => {
    return http('/abpapp/CouponController/getProductInfoList.do',data)
}