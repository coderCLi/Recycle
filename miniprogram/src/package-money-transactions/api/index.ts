/*
 * @Author: chilei gchilei0815@gmail.com
 * @Date: 2026-04-21 14:21:04
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-22 16:33:41
 * @FilePath: /miniprogram/src/package-money-transactions/api/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from "@/utils/http";

// 修改密码
export const getMemberCodeId = (data: any) => {
  return http("/abpapp/BalancePayController/getQrCode.do", data);
};

// /abpapp/RechargeTheWalletController/getRules.do 获取充值规则
export const getRechargeRules = (data: any) => {
  return http("/abpapp/RechargeTheWalletController/getRules.do", data);
};


// 获取余额明细
// /abpapp/RechargeTheWalletController/getBalanceDetail.do
export const getBalanceDetail = (data: any) => {
  return http("/abpapp/RechargeTheWalletController/getBalanceDetail.do", data);
};

// getCouponForOrder
export const getCouponForOrder = (data: any) => {
  return http("/abpapp/BalancePayController/getCouponForOrder", data);
}
// /abpapp/BalancePayController/cancelOrderInfo 支付取消，调用下接口，不用管接口返回成功还是失败

export const cancelOrderInfo = (data: any) => {
  return http("/abpapp/BalancePayController/cancelOrderInfo", data);
}
//   订单详情  入参 id， 返回  couponDisAmt --优惠券优惠金额， couponBaseName--优惠券名称
export const getUserOrderInfo = (data: any) => {
  return http("/abpapp/BalancePayController/getUserOrderInfo", data);
}
// 获取充值记录
// /abpapp/RechargeTheWalletController/getRechargeRecord.do
export const getRechargeRecord = (data: any) => {
  return http("/abpapp/RechargeTheWalletController/getRechargeRecord.do", data);
};

// 获取用户余额和积分
// /abpapp/RechargeTheWalletController/getBalanceAndScore.do
export const getBalanceAndScore = (data: any) => {
  return http(
    "/abpapp/RechargeTheWalletController/getBalanceAndScore.do",
    data
  );
};

// /abpapp/BalancePayController/updatePayPwd.do	修改密码
export const updatePayPwd = (data: any) => {
  return http("/abpapp/BalancePayController/updatePayPwd.do", data);
};

// 设置/重设密码
// /abpapp/BalancePayController/setPassword.do
export const setPassword = (data: any) => {
  return http("/abpapp/BalancePayController/reSetPwd.do", data);
};

// 主扫 客户扫商户码 账户余额支付
export const userMakeOrder = (data: any) => {
  return http("/abpapp/BalancePayController/userMakeOrder.do", data);
};

// 被扫 商户扫客户会员码 账户余额支付
export const mctMakeOrder = (data: any) => {
  return http("/abpapp/BalancePayController/mctMakeOrder.do", data);
};

// 完成订单
export const completeOrder = (data: any, extra: any = {}) => {
  return http("/abpapp/BalancePayController/completeOrder.do", data, extra);
};
// 商户查询订单
export const mctGetOrder = (data: any) => {
  return http("/abpapp/BalancePayController/mctGetOrder.do", data);
};

//统一预下单后续下单接口
export const prePayNew = (data: any, extra: any = {}) => {
  return http(`/uts/DealController/prePayNew.do`, data, extra);
};

// 生成微信订单/uts/DealController/payForBal.do
export const payForBal = (data: any, extra: any = {}) => {
  return http("/uts/DealController/payForBal.do", data, extra);
};

// 交易记录
export const getUserOrderList = (data: any) => {
  return http("/abpapp/BalancePayController/getUserOrderList.do", data);
};

// 获取订单性情 /abpapp/BalancePayController/getPayResultInfo.do
export const getPayResultInfo = (data: any) => {
  return http("/abpapp/BalancePayController/getPayResultInfo.do", data);
};
// 

// 获取商户折扣率
export const getMctDiscountRate = (data: any) => {
  return http(
    "/mctapi/MctInfoBaseController/getMctDiscountRate.do",
    data
  );
};