import { http } from '@/utils/http'


// 获取科目List
export const getSubjectList = (data: any) => {
  return http('/abpapp/HomepageController/getSubjectList.do', data);
}

// 获取更多服务List 版本号
export const getOperateServiceVersion = (data: any) => {
  return http('/abpapp/OperateServiceController/getOperateServiceVersion.do', data, {catchError: true});
}
// 获取更多服务List
export const getServiceList = (data: any) => {
  return http('/abpapp/OperateServiceController/getOperateServiceList.do', data);
}

// 获取初始化
export const getSearchInit = (data: any, mask: boolean) => {
  return http('/abpapp/SearchController/init.do', data, {mask: mask});
}
// 获取搜素List
export const getSearchList = (data: any, extra: any) => {
  return http('/abpapp/SearchController/search.do', data, extra);
}