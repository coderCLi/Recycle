import { http } from '@/utils/http'

// 消息中心
// 消息列表获取接口 入参:  page  rows
export const getNotifyList = (data: any) => {
  return http('/abpapp/NotifyManagerController/getNotifyList.do', data);
}
// 消息未读消息数量接口
export const getNotifyCount = () => {
  return http('/abpapp/NotifyManagerController/getNotifyCount.do', {
    catchError: true, showFailToast: false,
    mask: false,
    skipLogin: true
  });
}
// 获取消息详情接口 入参：notifyId (消息id)
export const getReadInfo = (data: any) => {
  return http('/abpapp/NotifyManagerController/getReadInfo.do', data );
}
// 标记已读接口 
export const readAllNotify = (data: any) => {
  return http('/abpapp/NotifyManagerController/readAll.do', data);
}


// 极光推送用户配置查询 
export const pushConfigurationQuery = (data: any) => {
  return http('/abpapp/JgConfigurationController/pushConfigurationQuery.do', data);
}

// 极光推送用户配置设置
export const pushConfigurationSettings = (data: any) => {
  return http('/abpapp/JgConfigurationController/pushConfigurationSettings.do', data);
}

// 获取积分
export const selUserPoints = (data: any) => {
  return http('/abpapp/UserRelatedController/selUserPoints.do', data, {mask:false});
}

// 极光推送-通用接口
export const sendPush = (data: any) => {
  return http('/abpbasic/JgPushCommonController/sendPush.do', data, {mask:false});
}
// 同意信用分获取协议接口：
export const updAgreeProtocol = (data: any) => {
  return http('/abpapp/UserRelatedController/updAgreeProtocol.do', data);
}


//  查询行业信息分类
export const getJobIndustryList = (data: any) => {
  return http("/abpapp/JobResumeController/getJobIndustryList.do", data);
};

// 获取JSON数据详情
export const getDetail = (data: any) => {
  return http("/abpapp/JsonManageController/getDetail.do", data, {
    catchError: true,
  });
};
// 获取字典
export const getDataDicList = (data: any) => {
  return http("/abpapp/CommonController/getDataDicList.do", data, {
    mask: false,
  });
};

// 修改昵称 /abpapp/UserSupplementController/nicknameModify.do
export const nicknameModify = (data: any) => {
  return http("/abpapp/UserSupplementController/nicknameModify.do", data);
};
// 获取省市区接口
export const getLinkAgeCity = (data: any) => {
  return http("/abpapp/CommonController/getLinkAgeCity.do", data);
};
// 用户补充信息编辑
export const editUserSubbly = (data: any) => {
  return http("/abpapp/UserSubblyController/editUserSubbly.do", data);
};
// 查询职业信息
export const getCareerInfo = (data: any) => {
  return http("/abpapp/UserSubblyController/getCareerInfo.do", data);
};
// 查询常住信息
export const getResidentInfo = (data: any) => {
  return http("/abpapp/UserSubblyController/getResidentInfo.do", data);
};
// 查询兴趣爱好
export const getInterestsInfo = (data: any) => {
  return http("/abpapp/UserSubblyController/getInterestsInfo.do", data);
};


// 获取JSON数据详情 
export const getJsonDetailById = (data: any) => {
	return http('/abpapp/JsonManageController/getDetail.do', data)
}

// // 是否签到
// export const isCheckIns = (data: any) => {
// 	return http('/abpapp/PointsUserController/isCheckIns.do', data)
// }
// 查询积分会员是否开启
export const getGlobalCode = (data: any,extra:any) => {
	return http('/abpapp/CommonParamController/getGlobalCode.do', data, extra)
}
// 获取会员等级积分
export const appgetUserFubaoPointsVip = (data:any,extra:any) => {
  return http('/abpapp/PointsUserController/appgetUserFubaoPointsVip.do',data,extra)
}
// 获取当前会员等级积分
export const getUserFubaoPointsAndMemberLevel = (data: any) => {
  return http('/abpapp/PointsUserController/getUserFubaoPointsAndMemberLevel.do', data,)
}

// 我的卡券
export const getCouponListSec = (data:any) => {
    return http('/abpapp/CouponController/getCouponInfoByUserId2.do',data)
}