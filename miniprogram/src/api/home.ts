import { http } from '@/utils/http'
// 获取首页数据
export const getHomeData = (data: any) => {
  return http('/abpapp/HomepageController/homepageInfo.do', data, {login: false});
}

// 获取首页Version
export const getHomeVersion = (data: any) => {
  return http('/abpapp/HomepageController/homepageVersion.do', data, {login: false});
}

// 获取初始化
export const getSearchInit = (data: any, extra: any) => {
  return http('/abpapp/SearchController/init.do', data, {catchError: true, ...(extra ? extra : {}) });
}

// 首页右上角消息未读消息数量接口
export const getNotifyCount = (data: any, extra: any) => {
  return http('/abpapp/NotifyManagerController/getNotifyCount.do', data, {
    catchError: true, showFailToast: false,
    mask: false,
    skipLogin: true
  });
}

// 首页右上角消息未读消息数量接口
export const adList = (data: any) => {
  return http('/abpapp/AdvertisementController/adList', data, {catchError: true, showFailToast: false});
}

// 首页左上角天气
export const getHomeWeather = (data: any, extra: any) => {
  return http('/abpapp/WeatherController/getHomeWeather.do', data, {catchError: true, showFailToast: false, ...(extra ? extra : {}) });
}

// 首页获取智能客服url
export const selAppRobotUrl = (data: any) => {
  return http('/abpapp/AiCustomerController/selAppRobotUrl.do', data);
}

// 首页引导
export const checkTips = (data: any) => {
  return http('/abpapp/CommonController/checkTips.do', data, {catchError: true, showFailToast: false});
}

