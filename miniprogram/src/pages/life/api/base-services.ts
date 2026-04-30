// 基础服务api 资讯 商家 地图 地址 
import { http } from '@/utils/http'
 
// 查询地址信息
export const selBusCodeAndDisCode = (data:any) => {
  return http('/abpapp/AddressByStoreProController/selBusCodeAndDisCode.do',data)
}
//商户列表
export const getMctProList = (data:any) => {
  return http('/mctapi/StoreInfoController/getStoreAll.do',data)
}
//模板状态查询
export const getLifeMctServiceInfo = (data:any) => {
  return http('/abpapp/AddressByStoreLifeController/getLifeMctServiceInfo.do',data)
}
//模板banner查询
export const getLifeMctServiceBannerList = (data:any) => {
  return http('/abpapp/AddressByStoreLifeController/getLifeMctServiceBannerList.do',data)
}
//查询模板商家分类
export const getLifeMctTypeList = (data:any) => {
  return http('/abpapp/AddressByStoreLifeController/getLifeMctTypeList.do',data)
}
