// 基础服务api 资讯 商家 地图 地址 
import { http } from '@/utils/http'
 

// 获取下拉框选项
export const getDataDic = (data:any) => {
	return http('/abpapp/CommonController/getDataDicList.do',data)
}

// 查询商家分类
export const getMctProTypeList = (data:any) => {
  return http('/abpapp/AddressByStoreProController/getMctProTypeList.do',data)
}
// 查询商家服务轮播图
export const getMctProServiceBannerList = (data:any) => {
  return http('/abpapp/AddressByStoreProController/getMctProServiceBannerList.do',data)
}
// 查询商家列表
export const getMctProList = (data:any) => {
  return http('/abpapp/AddressByStoreProController/getMctProList.do',data)
}
// 查询商家详情
export const getMctProDetailList = (data:any) => {
  return http('/abpapp/AddressByStoreProController/getMctProDetailList.do',data)
}
// 查询套餐详情
export const getMctProPackageInfo = (data:any) => {
  return http('/abpapp/AddressByStoreProController/getMctProPackageInfo.do',data)
}

// 查询地图信息
export const selFilterCategoryById = (data:any) => {
  return http('/abpapp/AddressByStoreProController/selFilterCategoryById.do',data)
}
// 查询地址信息
export const selBusCodeAndDisCode = (data:any) => {
  return http('/abpapp/AddressByStoreProController/selBusCodeAndDisCode.do',data)
}
// 根据条件筛选商户
export const selBusCodeAndDisCodeByCity = (data:any) => {
  return http('/abpapp/AddressByStoreProController/selBusCodeAndDisCodeByCity.do',data)
}

// 根据服务查询分类列表 
export const getMapProServiceInfo = (data:any) => {
  return http('/abpapp/MapProController/getMapProServiceInfo.do',data)
}
// 根据服务和类型查询地址地图列表
export const getMapProLocationList = (data:any) => {
  return http('/abpapp/MapProController/getMapProLocationList.do',data)
}

// 地址地图详情接口
export const getMapProLocationDetail = (data:any) => {
  return http('/abpapp/MapProController/getMapProLocationDetail.do',data)
}

// 新增搜索记录
export const addSearchRecord = (data:any) => {
  return http('/abpapp/SearchRecordController/addSearchRecord.do',data)
}
// 清空搜索记录
export const cleanSearchRecord = (data:any) => {
  return http('/abpapp/SearchRecordController/cleanSearchRecord.do',data)
}
// 获取搜索记录列表
export const getSearchRecordList = (data:any) => {
  return http('/abpapp/SearchRecordController/getSearchRecordList.do',data)
}
// 查询快筛项
export const getQuickFilterList = (data:any) => {
  return http('/abpapp/MapProController/getQuickFilterList.do',data)
}
// 地址详情栏目查询
export const selMapProColumn = (data:any) => {
  return http('/abpapp/MapProController/selMapProColumn.do',data)
}
// 查询栏目详情
export const selMapProColumnDetail = (data:any) => {
  return http('/abpapp/MapProController/selMapProColumnDetail.do',data)
}

// 地址导航类 // 1.服务信息列表
    export const getAddrServiceList =(data: any) => {
        return http('/abpapp/MctServiceController/getAddrServiceList',data,{  login: false})
    };

// 2.地址列表（分页）
export const getAddrInfoList =(data: any) => {
    return http('/abpapp/MctServiceController/getAddrInfoList',data,{ login: false})
};

// 百度来源地址信息
  // 服务信息及地址列表
  export const getMapList =(data: any) => {
      return http('/abpapp/MctServiceController/getMapList',data,{  login: false})
  };