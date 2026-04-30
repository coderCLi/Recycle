import { http } from '@/utils/http'

// 惠多多分类
export const getHDDTypeList = (data: any) => {
  return http('/abpapp/HDDManageController/getHDDTypeList.do', data);
}
// 惠多多首页配置获取
export const getHddversion = (data: any) => {
    return http('/abpapp/HDDManageController/getHddversion.do', data);
}
// 惠多多首页获取门店列表
export const gethddStoreAll = (data: any) => {
    return http('/mctapi/StoreInfoController/gethddStoreAll.do', data);
}
// 惠多多活动资讯列表
export const getHDDEntryList = (data: any) => {
    return http('/abpapp/HDDManageController/getHDDEntryList.do', data);
}