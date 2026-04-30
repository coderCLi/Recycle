/* 
 * @Description: 开通支付接口
 * @Author: 陈保磊
 * @Date: 2024-12-13 14:50:58
 * @LastEditors: TF
 * @LastEditTime: 2025-09-03 08:55:39
 */

import { http } from '@/utils/http'
export const mctInfoApply = (params) => {
  return http('/mctapi/MctInfoBaseController/mctInfoApply.do', params)
}
// 获取JSON数据详情 
export const getJsonDetailById = (data) => {
  return http('/abpapp/JsonManageController/getDetail.do', data)
}
// 字典
export const getDataDicList = (params, ajaxSet) => {
  return http('/abpapp/CommonController/getDataDicList.do', params, ajaxSet)
}
// 省市区
export const getLinkAgeCity = (params) => {
  return http('/abpapp/CommonController/getLinkAgeCity.do', params)
}
// 上传图片
export const uploadFile = (params) => {
  return http('/abpapp/FileUploadController/uploadFile.do?type:mct', params)
}
// 经营类目
export const getBusinessCateGoryList = (params) => {
  return http('/mctapi/CommonController/getBusinessCateGoryList.do', params,)
}

// 商户列表
export const getMctInfoList = (params) => {
  return http('/mctapi/MctInfoBaseController/getMctInfoList.do', params,{login:true})
}
// 商户列表
export const getMctUserList = (params) => {
  return http('/mctapi/MctInfoBaseController/getMctUserList.do', params,{login:true})
}
// 商户详情
export const getMctInfo = (params) => {
  return http('/mctapi/MctInfoBaseController/getMctInfo.do', params)
}
// 角色列表
export const getUserInfoList = (params) => {
  return http('/mctapi/MctInfoBaseController/getUserInfoList.do', params)
}
// 当天订单汇总
export const getSumOrderlnfo = (params) => {
  return http('/mctapi/MallOrderController/getSumOrderInfo.do', params,{mask:false})
}
// 订单列表
export const getOrderList = (params) => {
  return http('/mctapi/MallOrderController/getOrderList.do', params)
}
// 子订单列表
export const getSubOrderList = (params) => {
  return http('/mctapi/MallOrderController/getSubOrderList.do', params)
}

// 用户订单列表
export const getOrderListByUserId = (params) => {
  return http('/mctapi/MallOrderController/getOrderListByUserId.do', params,)
}
// 用户子订单详情
export const getSubOrderInfo = (params) => {
  return http('/mctapi/MallOrderController/getSubOrderInfo.do', params,)
}
// 门店列表
export const getStoreList = (params) => {
  return http('/mctapi/StoreInfoController/getStoreList.do', params,)
}
// 门店详情
export const getStoreInfo = (params) => {
  return http('/mctapi/StoreInfoController/getStoreInfo.do', params,)
}
// 门店详情
export const getStore = (params) => {
  return http('/mctapi/StoreInfoController/getStore.do', params,)
}
// 代金券适用门店列表
export const getStoreByCoupon = (params) => {
  return http('/mctapi/StoreInfoController/getStoreByCoupon.do', params,)
}
// 收藏/取消收藏（门店/商品）
export const updateCollectionStatus = (params) => {
  return http('/mctapi/CollectionController/updateCollectionStatus.do', params,)
}
// 获取收藏状态
export const getCollectionStatus = (params, ajaxSet) => {
  return http('/mctapi/CollectionController/getCollectionStatus.do', params, ajaxSet)
}

// 立即购买
export const shoping = (params) => {
  return http('/mctapi/ProductController/shoping.do', params)
}
// 立即购买（卖券等虚拟商品）
export const shopingCoupon = (params) => {
  return http('/mctapi/ProductController/shopingCoupon.do', params)
}
//收货地址列表
export const getDeliveryAddressList = (params) => {
  return http('/mctapi/ProductController/getDeliveryAddressList.do', params)
}
//优惠券列表
export const getCouponList = (params) => {
  return http('/mctapi/ProductController/getCouponList.do', params)
}
//去支付
export const createOrder = (params) => {
  return http('/mctpay/payOrderController/createOrder.do', params)
}
//取消订单
export const closeInner = (params) => {
  return http('/mctpay/cancelApi/innerClose.do', params)
}
//支付虚拟商品订单
export const couponOrder = (params) => {
  return http('/mctpay/payOrderController/couponOrder.do', params)
}
//订单详情
//门店订单详情
export const usermOrderDetails = (params) => {
  return http('/mctapi/UserOrdersController/usermOrderDetails.do', params)
}

//再次支付
export const keepPayOrder = (params) => {
  return http('/mctpay/payOrderController/keepPayOrder.do', params)
}

// 商品列表
export const getProductList = (params) => {
  return http('/mctapi/ProductController/getProductList.do', params,)
}
// 商品详情
export const getProductInfo = (params) => {
  return http('/mctapi/ProductController/getProductInfo.do', params,)
}

//  收货地址列表
export const getDeliveryAddressPage = (data) => {
  return http('/abpapp/DeliveryAddressController/getDeliveryAddressPage.do', data)
}
// 优惠券列表
export const getCouponBaseList = (data) => {
  return http('/mctapi/CouponController/getCouponBaseList.do', data)
}
// 商家卡券列表getCpnTicketList
export const getCpnTicketList = (data, ajaxSet) => {
  return http('/mctapi/CpnTicketController/getCpnTicketList.do',data, ajaxSet)
}
// 获取商家商品分类列表
export const getCategoriesMct = (data, ajaxSet) => {
  return http('/mctapi/StoreInfoController/getCategoriesMct.do',data, ajaxSet)
}
// 优惠券列表
export const getCouponGetInfoByMctId = (data) => {
  return http('/mctapi/CouponController/getCouponGetInfoByMctId.do', data)
}
// 核销优惠券
export const mctapiuserCoupon = (data) => {
  return http('/mctapi/CouponController/userCoupon.do', data)
}
// 扫码核销
export const userCoupon = (data) => {
  return http('/abpapp/CouponController/userCoupon.do', data)
}

// 查询核销的优惠券
export const getCouponInfoByUserId = (data) => {
  return http('/abpapp/CouponController/getCouponInfoByUserId.do', data)
}
// 领取优惠券
export const userGetCoupon = (data, ajaxSet) => {
  return http('/abpapp/CouponController/userGetCoupon.do', data, ajaxSet)
}
// 切换门店列表
export const mctGetStoreList = (data) => {
  return http('/mctapi/MctInfoBaseController/getStoreList.do', data)
}
// 获取虚拟商品列表
export const getVirtualProductProductList = (data, ajaxSet) => {
  return http('/mctapi/ProductController/getVirtualProductProductList.do', data, ajaxSet)
}
// 获取虚拟商品详情
export const getVirtualProductInfo = (data, ajaxSet) => {
  return http('/mctapi/ProductController/getVirtualProductInfo.do', data, ajaxSet)
}
// 核销前获取核销人信息
export const getVerifyUserInfo = (data) => {
  return http('/mctapi/PayController/getVerifyUserInfo.do', data)
}

// 核销列表
export const getCouponVerList = (data) => {
  return http('/mctapi/CouponController/getMctCouponVerList.do', data)
}
// 卡券核销列
export const getCouponVerInfoList = (data) => {
  return http('/mctapi/CouponController/getMctCouponVerInfoList.do', data)
}
// 核销详情
export const getCouponVerInfo = (data) => {
  return http('/mctapi/CouponController/getCouponVerInfo.do', data)
}
// 获取评价列表
export const getReviews = (data, ajaxSet) => {
  return http('/mctapi/ReviewsPublicController/getReviews.do', data, ajaxSet)
}
// 评价
export const addReview = (data) => {
  return http('/mctapi/ReviewsPublicController/addReview.do', data)
}
// 删除评价
export const delReview = (data) => {
  return http('/mctapi/ReviewsPublicController/delReview.do', data)
}
// 获取卡券详情
export const getComponentBaseInfo = (data, ajaxSet) => {
  return http('/mctapi/CouponController/getComponentBaseInfo.do',data , ajaxSet)
}
// 领取优惠券
export const receiveCpnTicket = (data, ajaxSet) => {
  return http('/mctapi/CpnTicketController/receiveCpnTicket.do',data,ajaxSet)
}
// 查询商户放心消费信息
export const getMctBusinessInfos = (data, ajaxSet) => {
  return http('/abpapp/MctServiceController/getMctBusinessInfos.do',data, ajaxSet)
}
// 卡券核销列表
export const getCouponUseList = (data) => {
    return http('/abpapp/CouponController/getCouponInfoByUserId2.do',data)
}

// 当日核销列表查询
export const getMctCouponVerInfoListDate = (data) => {
  return http('/mctapi/CouponController/getMctCouponVerInfoListDate.do', data)
}
// 订单列表查询(新)
export const userOrdersAll = (data) => {
  return http('/mctapi/UserOrdersController/userOrdersAll.do', data)
}
// 订单列表查询(新)
export const userOrdersAllNew = (data) => {
  return http('/mctapi/UserOrdersController/userOrdersAllNew.do', data)
}
// 售后列表查询
export const afterSaleOrder = (data) => {
  return http('/mctapi/AfterSaleController/afterSaleOrder.do', data)
}
// 售后详情查询
export const afterSaleDetail = (data) => {
  return http('/mctapi/AfterSaleController/afterSaleDetail.do', data)
}
// 客户退货
export const updateAfterState = (data) => {
  return http('/mctapi/AfterSaleController/updateAfterState.do', data)
}
// 客户取消售后 
export const cacelAfterSaleApply = (data) => {
  return http('/mctapi/AfterSaleController/cacelAfterSaleApply.do', data)
}
//门店订单详情
export const usermOrderDetailsNew = (params) => {
  return http('/mctapi/UserOrdersController/usermOrderDetailsNew.do', params)
}
// 删除订单
export const removeStoreOrder = (params) => {
  return http('/mctpay/removeApi/removeStoreOrder', params)
}
// 删除订单/售后单
export const removeOrder = (param) => {
    return http('/mctpay/removeApi/remove', param)
};
//售后申请
export const afterSaleApply = (params) => {
  return http('/mctapi/AfterSaleController/afterSaleApply.do', params)
}
// 开通线下收款功能
export const offlineCollectionApply = (params) => {
  return http('/mctapi/MctInfoBaseController/offlineCollectionApply.do', params)
}
// 商家数据
export const getMctData = (params) => {
  return http('/abpapp/BalancePayController/getMctData.do', params)
}
// 当日订单
export const getOrderListNew = (params) => {
  return http('/abpapp/BalancePayController/getOrderList.do', params)
}

// 查询退款订单
export const getOrderListToRefund = (params) => {
  return http('/abpapp/BalancePayController/getOrderListToRefund.do', params)
}
// 退款
export const refundOrder = (params) => {
  return http('/abpapp/BalancePayController/refundOrder.do', params)
}