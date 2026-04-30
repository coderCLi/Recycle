/*
 * @Description: 积分商城API
 * @Autor: TF
 * @Date: 2025-06-23 09:39:24
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-16 13:58:44
 */
import { http } from '@/utils/http'

// 字典
export const getDataDicList = (data: any, ajaxSet: any) => {
    return http('/abpapp/CommonController/getDataDicList.do', data, ajaxSet)
}
// 积分商城-搜索
export const searchProducts =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointProductController/searchProducts.do', data, ajaxSet)
};
// 积分商城-历史搜索
export const queryAllSearch =(data: any, ajaxSet: any) => {
    return http('/mctapi/PurchaseUserSearchHistoryController/queryAll.do', data, ajaxSet)
};
// 积分商城-清空历史
export const clearSearch =(data: any, ajaxSet: any) => {
    return http('/mctapi/PurchaseUserSearchHistoryController/clear.do', data, ajaxSet)
};
// 积分商城-商品分类查询
export const getPointMallCategories =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointProductController/getPointMallCategories.do', data, ajaxSet)
};
// 积分商城-商品详情
export const productDetails =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointProductController/productDetails.do', data, ajaxSet)
};
// 积分商城-查询积分
export const selFbUserPoints =(data: any, ajaxSet: any) => {
    return http('/abpapp/PointsUserController/selFbUserPoints.do', data, ajaxSet)
};
// 积分商城-查询积分
export const appgetUserFubaoPointsVip =(data: any, ajaxSet: any) => {
    return http('/abpapp/PointsUserController/appgetUserFubaoPointsVip.do', data, ajaxSet)
};
// 积分商城-首页轮播
export const getBannerAll =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointProductController/getBannerAll.do', data, ajaxSet)
};
// 积分商城-地址列表
export const getDeliveryAddressPage =(data: any, ajaxSet: any) => {
    return http('/abpapp/DeliveryAddressController/getDeliveryAddressPage.do', data, ajaxSet)
};
// 积分商城-预下单接口
export const productOrderDetails =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointProductController/productOrderDetails.do', data, ajaxSet)
};

//限购接口新增
 export const queryBuyCount =(data: any, ajaxSet: any) => {
    return http('/mctapi/BuyCountController/queryBuyCount.do', data, ajaxSet)
};

// 购买须知
export const getProductSpuSetail =(data: any, ajaxSet: any) => {
    return http('/abpapp/ProductSpuSetailController/getProductSpuSetailBySpuId.do', data, ajaxSet)
};


// 数据字典
export const getDataDic = (data:any) => {
	return http('/abpapp/CommonController/getDataDicList.do',data)
}
// 积分商城-订单列表（非售后）
export const pointsUserOrders =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointsUserOrdersController/pointsUserOrders.do', data, ajaxSet)
};
//积分商城-订单详情(非售后)
export const pointsUserOrderDetail =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointsUserOrdersController/pointsUserOrderDetail.do', data, ajaxSet)
};
// 积分商城-订单列表（售后）
export const afterSaleOrder =(data: any, ajaxSet: any) => {
    return http('/mctapi/AfterSaleController/afterSaleOrder.do', data, ajaxSet)
};
//积分商城-订单详情(售后)
export const afterSaleDetail =(data: any, ajaxSet: any) => {
    return http('/mctapi/AfterSaleController/afterSaleDetail.do', data, ajaxSet)
};
// 积分商城-积分商品下单
export const integralMallOrder =(data: any, ajaxSet: any) => {
    return http('/mctpay/PayPointsOrderController/integralMallOrder.do', data, ajaxSet)
};
// 积分商城-积分商品售后申请
export const afterSaleApply =(data: any, ajaxSet: any) => {
    return http('/mctapi/AfterSaleController/afterSaleApply.do', data, ajaxSet)
};
//积分商城-关闭订单
export const pointsCancel =(data: any, ajaxSet: any) => {
    return http('/mctpay/cancelApi/pointsCancel.do', data, ajaxSet)
};
//积分商城-继续支付
export const keepPayOrder =(data: any, ajaxSet: any) => {
    return http('/mctpay/payOrderController/keepPayOrder.do', data, ajaxSet)
};
// 积分商城-确认收货
export const pointsMallRecipt =(data: any, ajaxSet: any) => {
    return http('/mctpay/receiveApi/pointsMallRecipt', data, ajaxSet)
};
// 积分商城-退货
export const updateAfterState =(data: any, ajaxSet: any) => {
    return http('/mctapi/AfterSaleController/updateAfterState.do', data, ajaxSet)
};
// 积分商城-退款运费计算
export const afterSaleAmt =(data: any, ajaxSet: any) => {
    return http('/mctapi/AfterSaleController/afterSaleAmt.do', data, ajaxSet)
};
// 积分商城-删除订单
export const removeOrder =(data: any, ajaxSet: any) => {
    return http('/mctpay/removeApi/remove', data, ajaxSet)
};
// 积分商城-修改订单地址
export const modifyIntegralMallOrder =(data: any, ajaxSet: any) => {
    return http('/mctpay/PayPointsOrderController/modifyIntegralMallOrder.do', data, ajaxSet)
};
// 积分商城-卡券核销列表
export const getCouponUseList = (data: any, ajaxSet: any) => {
    return http('/abpapp/CouponController/getCouponInfoByUserId2.do',data)
}


// 主扫 客户扫商户码 账户余额支付
export const userMakeOrder = (data: any) => {
  return http("/abpapp/BalancePayController/userMakeOrder.do", data);
};
// 完成订单
export const completeOrder = (data: any, extra: any = {}) => {
  return http("/abpapp/BalancePayController/completeOrder.do", data, extra);
};
// 生成微信订单/uts/DealController/payForBal.do
export const payForBal = (data: any, extra: any = {}) => {
  return http("/uts/DealController/payForBal.do", data, extra);
};
// 获取用户余额和积分
// /abpapp/RechargeTheWalletController/getBalanceAndScore.do
export const getBalanceAndScore = (data: any) => {
  return http(
    "/abpapp/RechargeTheWalletController/getBalanceAndScore.do",
    data
  );
};
// 获取商户列表 /mctapi/PayMctInfoController/getList.do
export const getMctList = (data: any) => {
  return http(
    "/mctapi/PayMctInfoController/getList.do",
    data
  );
};

// 获取商户折扣率 
export const getMctDiscountRate = (data: any) => {
  return http(
    "/mctapi/MctInfoBaseController/getMctDiscountRate.do",
    data
  );
};


