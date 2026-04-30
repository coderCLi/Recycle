
import { http } from '@/utils/http'

// 获取会员码id
export const getMemberCodeId = (data: any, extra: any = {}) => {
  return http('/abpapp/BalancePayController/getQrCode.do', data, extra);
}
// 获取用户余额和积分
export const getBalanceAndScore = (data: any, extra: any = {}) => {
  return http('/abpapp/RechargeTheWalletController/getBalanceAndScore.do', data, extra);
}


// 轮训查询 获取用户订单
export const getUserOrder = (data: any, extra: any = {}) => {
  return http('/abpapp/BalancePayController/userGetOrder.do', data, extra);
}

// 完成订单
export const completeOrder = (data: any, extra: any = {}) => {
  return http('/abpapp/BalancePayController/completeOrder.do', data, extra);
}