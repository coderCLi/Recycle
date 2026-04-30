// 会员中心
import { http } from '@/utils/http'  // 导入http服务

// 字典
export const getDataDicList = (data: any) => {
  return http('/abpapp/CommonController/getDataDicList.do', data,)
}

// // 获取当前会员等级积分
// export const getUserFubaoPointsAndMemberLevel = (data: any) => {
//   return http('/abpapp/PointsUserController/getUserFubaoPointsAndMemberLevel.do', data,)
// }
// 获取全部会员等级积分
export const getUserFubaoPointsAndMemberLevels = (data: any) => {
  return http('/abpapp/PointsUserController/getUserFubaoPointsAndMemberLevels.do', data,)
}
// 获取活动
export const appVipChannelAll = (data: any) => {
  return http('/abpapp/PointsUserController/appVipChannelAll.do', data,)
}
// 获取任务
export const queryPointsTaskList = (data: any) => {
  return http('/abpapp/PointsUserController/queryPointsTaskList.do', data,)
}
// 领取积分
export const getTaskPoints = (data: any) => {
  return http('/abpapp/PointsUserController/getTaskPoints.do', data,)
}
// 浏览任务记录
export const recordBrowse = (data: any) => {
  return http("/abpapp/PointsUserController/recordBrowse.do", data, { mask: false })
}
// 积分明细头部获取
export const pointsToExpire = (data: any) => {
  return http('/abpapp/PointsUserController/pointsToExpire.do', data,)
}
// 积分明细
export const appPointsUserLogList = (data: any) => {
  return http('/abpapp/PointsUserController/appPointsUserLogList.do', data,)
}
// 全部权益
export const aPPgetUserMemberPrivilegesDetails = (data: any) => {
  return http('/abpapp/PointsUserController/aPPgetUserMemberPrivilegesDetails.do', data,)
}
// 领取权益
export const receivePrivileges = (data: any, extra: any) => {
  return http('/abpapp/PointsUserController/receivePrivileges.do', data, extra)
}
// 权益记录 入参 usageIs  是否被使用 0:否 1:是 ,2:过期
export const getVipPrivilegesUsageLogList = (data: any) => {
  return http('/abpapp/PointsUserController/getVipPrivilegesUsageLogList.do', data,)
}

// 签到记录
export const getCheckInsList = (data: any) => {
  return http('/abpapp/PointsUserController/queryCheckInsList.do', data,)
}
// 签到
export const checkIns = (data: any) => {
  return http('/abpapp/PointsUserController/checkIns.do', data,)
}
// 查询是否第一次进入
export const visitCheck = (data: any) => {
  return http('/abpapp/PointsUserController/visitCheck.do', data,)
}
// 今日是否签到
export const isCheckIns = (data: any) => {
  return http('/abpapp/PointsUserController/isCheckIns.do', data,)
}
// 获取签到规则
export const queryPointsCheckInRewardRule = (data: any) => {
  return http('/abpapp/PointsUserController/queryPointsCheckInRewardRule.do', data,)
}

// 卡券详情
export const getCouponBaseDetails = (data: any) => {
  return http('/abpapp/CouponController/getCouponBaseDetails.do', data,)
}




// 抽奖
// 初始化信息，获取积分信息
export const getNumOfPrizeDraw = (data: any) => {
  return http('/sceneactiv/IntegralWheelController/getNumOfPrizeDraw.do', data,)
}
// 兑换抽奖机会
export const redeemNumOfActivity = (data: any) => {
  return http('/sceneactiv/RedeemNumOfActivityController/redeemNumOfActivity.do', data,)
}

// 抽奖
export const raffle = (data: any) => {
  return http('/sceneactiv/RaffleActivController/raffle.do', data,)
}

// 查询活动信息
export const getRaffleActivDetail = (data: any) => {
  return http('/sceneactiv/RaffleActivController/getRaffleActivDetail.do', data,)
}
// 获取中奖奖品
export const queryWinningRecord = (data: any) => {
  return http('/sceneactiv/IntegralWheelController/queryWinningRecord.do', data,)
}

