/*
 * @Description: 请求拦截器
 * @Author: chenyulong
 * @Date: 2024-09-07 14:39:01
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-06-26 15:35:27
 * @Remark: 
 */
/* eslint-disable no-param-reassign */
import { platform } from '@/utils/platform'
// import { getChannel } from '@/utils'
import * as bridgeSdk from '@/utils/bridge'
// import * as utils from '@/utils/utils'
// import * as trackReport from '@/utils/track'
import { needLoginPages as _needLoginPages } from '@/utils'

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: any) {
    // console.log('请求拦截器: ', "，url = ", options.url, "，header = ", options.header);
    // 接口请求支持通过 query 参数配置 queryString
    // if (options.query) {
    //   const queryStr = qs.stringify(options.query)
    //   if (options.url.includes('?')) {
    //     options.url += `&${queryStr}`
    //   } else {
    //     options.url += `?${queryStr}`
    //   }
    // }
    // 非 http 开头需拼接地址
    // if (!options.url.startsWith('http')) {
    //   // #ifdef H5
    //   console.log(__VITE_APP_PROXY__)
    //   if (JSON.parse(__VITE_APP_PROXY__)) {
    //     // 啥都不需要做
    //   } else {
    //     options.url = baseUrl + options.url
    //   }
    //   // #endif
    //   // 非H5正常拼接
    //   // #ifndef H5
    //   options.url = baseUrl + options.url
    //   // #endif
    //   // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
      
    // }
    // 1. 请求超时
    // options.timeout = 10000 // 10s
    // 2. （可选）添加小程序端请求头标识
    // const uuid = bridgeSdk.getStorageSync('jw_uuid') || bridgeSdk.generateUUID("")
    const uuid = bridgeSdk.generateUUID();
    // console.log('http uuid', uuid)

    options.header = {
      platform,
      ...options.header,
      appid: __VITE_APP_ID__,
      token: bridgeSdk.getStorageSync('app_jw_token'),
      uuid: uuid
    }

		// console.log({
		// 	mobile: `${utils.getUserInfo()?.userInfo?.desMobile}`,
		// 	serviceUrl: options.url,
		// 	token: options.header.token,
		// 	uuid: options.header.uuid,
		// 	req: JSON.stringify(options.data),
    //   appid: options.header.appid,
		// });

    // #ifdef MP
    const baseInfo: any = bridgeSdk.getDeviceInfo();
    // 用户代理字符串不存在时，自行拼接
    options.header.userAgent = navigator ? navigator.userAgent : Object.keys(baseInfo).map(key => `${key} = ${baseInfo[key]}`).join(', ')
    // #endif

    // 记录接口名、页面路径
    // const res = utils.getCurrentRouter();
    // trackReport.trackCustom(options.url, res?.pageConf?.style?.navigationBarTitleText);
    
    // console.log('请求拦截器: ', "，url = ", options.url, "，header = ", options.header);
  }
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
