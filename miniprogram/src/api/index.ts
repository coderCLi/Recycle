/*
 * @Description: api配置文件
 * @Author: chenyulong
 * @Date: 2024-10-11 10:52:52
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-24 10:41:00
 * @Remark: 
 */
import { http } from '@/utils/http'

// // 获取用户信息
// export const getUserInfo = (data: any) => {
//   return http('/userInfo/getUserInfo', data)
// }

// // 获取token
// export const getToken = (data: any) => {
// 	// return http('/jwgl/ScripSecureController/getToken.do', data, {
// 	return http('/abpapp/LoginController/getToken.do', data, {
// 		encrypt: false,
// 		// decrypt: false,
// 		catchRes: true
// 	})
// }

// 首页banner
export const getBannerList = (data: any) => {
	// return http('/jwgl/MartketADManagerController/getList.do', data)
	return http('/abpapp/LoginController/register.do', {
		// phone  checkCode  password  checkPassword
		phone: '13811111111',
		checkCode: '1234',
		password: '123456',
		checkPassword: '123456'
	})
}

// 服务订阅接口 误删
export const doDub =(data: any) => {
    return http('/abpapp/SubscriptionController/sub.do',data,{login: true })
};

// 主题服务类接口
export const getThemeModeList = (data:any) => {
	return http('/abpapp/ThemeManageController/getElderlyModeList.do',data, {login: false })
}

// 地址转换经纬度
export const getCoordsByAddress = (data:any, extra) => {
	return http('/abpapp/BaiduMapController/geocoding.do',data, extra)
}

// 获取JSON数据详情 
export const getJsonDetailById = (data: any) => {
	return http('/abpapp/JsonManageController/getDetail.do', data)
}

// 获取安卓app下载地址
export const getApkUrl = (data: any) => {
    return http('/abpapp/AppVersionController/getApkUrl.do', data)
}

// 获取省市区接口
export const getLinkAgeCity = (data: any) => {
    return http('/abpapp/CommonController/getLinkAgeCity.do', data)
}
