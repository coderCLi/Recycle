import { http } from '@/utils/http'

// 获取收货地址列表接口
export const getDeliveryAddressPage = (data: any) => {
  return http('/abpapp/DeliveryAddressController/getDeliveryAddressPage.do', data)
}

// 获取省市区接口
export const getLinkAgeCity = (data: any) => {
    return http('/abpapp/CommonController/getLinkAgeCity.do', data)
  }

// 新增收货地址接口
export const addDeliveryAddress = (data: any) => {
    return http('/abpapp/DeliveryAddressController/addDeliveryAddress.do', data)
}

// 获取收货地址详情接口
export const getDeliveryAddressDetail = (data: any) => {
    return http('/abpapp/DeliveryAddressController/getDeliveryAddressDetail.do', data)
}

// 编辑收货地址接口
export const editDeliveryAddress = (data: any) => {
    return http('/abpapp/DeliveryAddressController/editDeliveryAddress.do', data)
}

// 删除收货地址接口
export const deleteDeliveryAddress = (data: any) => {
    return http('/abpapp/DeliveryAddressController/deleteDeliveryAddress.do', data)
}