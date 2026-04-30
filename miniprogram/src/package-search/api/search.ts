import { http } from '@/utils/http'


// 获取初始化
export const getSearchInit = (data: any) => {
  return http('/abpapp/SearchController/init.do', data);
}

// 获取搜素List
export const getSearchList = (data: any) => {
  return http('/abpapp/SearchController/search.do', data);
}

// 字典
export const getDataDicList = (data: any) => {
  return http('/abpapp/CommonController/getDataDicList.do', data,)
}