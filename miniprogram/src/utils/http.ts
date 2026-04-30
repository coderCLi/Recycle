/*
 * @Description: 交易模块封装
 * @Author: chenyulong
 * @Date: 2024-10-11 10:51:37
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-24 08:47:33
 */
import { getEvnBaseUrl } from './index';
import * as bridgeSdk from './bridge'
import * as beans from '@/utils/beans';
import * as utils from './utils';
import { requestToken } from '@/api/requestToken';

// 请求中的交易, 用于防止重复请求
const requestingMap: { [key: string]: boolean } = {};

// const errMsg = "网络有点调皮，请稍后再试~";
const errMsg = "网络有点调皮，请切换至Wi-Fi或4G/5G网络再试"

// 国密加解密封装
// import smTools from './sm.js'
// const {
// 	sm4Encrypt,
// 	sm4Decrypt
// } = smTools;

// 加载效果
export const loading = {
	showLoading({ title = "处理中", mask = true } = {}) {
		uni.showLoading({
			title: title,
			mask: mask
		});
	},
	hideLoading() {
		uni.hideLoading();
	}
}

// 定时关闭提示框
export const Toast = function (message : string, duration : number | undefined, icon : "none" | "success" | "loading" | undefined = "none") {
	if (typeof message != "string") {
		message = JSON.stringify(message);
	}
	if (!['success', 'loading', 'none'].includes(icon)) {
		bridgeSdk.throwMsg(`icon必须是success、loading、none中的一个，${icon}不合法`);
		return;
	}
	uni.showToast({
		icon: icon as "none" | "success" | "loading",
		mask: true,
		// 默认提示信息停留1.5s
		duration: duration || 2500,
		title: message || ''
	});
};

/*
 * @Description: 加解密交易封装
 * api 接口名 String 必传参数
 * data 请求参数对象 Object 默认空对象 非必传参数
 * title loading框显示文字 String 非必传参数
 * mask 是否显示loading蒙板 Boolean 默认false 非必传参数
 * catchRes 是否独立处理响应，非必传参数，默认统一处理
 * catchError 是否单独捕获异常，捕获时，接口调用处使用catch接受，否则会被全局处理 Boolean 默认false 非必传参数
 * showFailToast 当走fail时，是否提示toast
 * url 第三方接口url地址，有值时会替换api接口 String 非必传参数
 * encrypt 是否开启请求报文加密 Boolean 默认true 非必传参数
 * decrypt 是否开启响应报文解密 Boolean 默认true 非必传参数
 * login 是否需要登录态验证 Boolean 默认false 非必传参数
 * sign 是否需要验签处理，请求头设置签名字符串 Boolean 默认false 非必传参数
 * header 请求头参数 Object 默认空对象 非必传参数
 * method 请求方法 String 默认POST 非必传参数
 * timeout 交易超时时间 Number 默认60s 非必传参数
 */
export const http = async function (api : string, data : any = {}, extra : any = {}) {
	let {
		title = "",
		mask = true,
		skipLogin = false,
		catchRes = false,
		catchError = false,
		showFailToast = true,
		url = "",
		encrypt = true,
		decrypt = true,
		login = false,
		sign = false,
		header = {},
		method = "POST",
		timeout = 60000,
	} = extra;
	return new Promise(async (resolve, reject) => {

		const _httParams = {
			api,
			data: JSON.parse(JSON.stringify(data)),
			extra,
			resolve,
			reject
		};

		const app_jw_token = bridgeSdk.getStorageSync('app_jw_token');
        const isValid = !!app_jw_token;
		if(!isValid){
			await requestToken(_httParams);
			// 防止最后一次请求被多试一次
			return;
		}
		// token有效时
		else {

		}

		// try {			
		// 	// 获取token，小程序端如果在App.vue中调用该方法时，总异步返回，即使是同步调用，会造成具体的功能页调用接口时因token、iv缺失报错，h5端不存在该问题。
		// 	await requestToken();
		// } catch (error) {
		// 	const errorMessage = typeof error === 'string' ? error : JSON.stringify(error);
		// 	throw new Error(errorMessage);
		// }

		// 需要登录，如果未登录，跳转到登录页面
		if (login && !utils.getUserInfo()) {
			console.log("需要登录，如果未登录，提示跳转到登录页面", api);
			// 记录拦截的请求，待登录后重新请求
			beans.setInterceptedRequests({
				..._httParams,
				needLogin: true
			});
			utils.toLogin();
			return;
		}

		mask && loading.showLoading(title);
		if (!api && !url) {
			const message = `请求接口${api}不能为空`;
			reject(message)
			return;
		}

		// 请求参数不符合对象格式
		if (typeof data !== "object") {
			const message = `请求参数data不是对象格式`;
			reject(message)
			return;
		}

		// 解决接口401参数缺失问题
		api = api.indexOf("_msg=json") > -1 ? api : (api.indexOf("?") > -1 ? api + "&_msg=json" : api + "?_msg=json");

		// 后台接口地址，使用第三方接口url地址 或 基础地址 + api拼接成完整地址
		const serviceUrl = url && (url.startsWith("http://") || url.startsWith("https://")) ? url : getEvnBaseUrl() + api;
		// console.log('后台接口 ' + serviceUrl);
		// 请求头
		header = header && header instanceof Object ? header : {}
		// 用户登录状态token
		header.token = bridgeSdk.getStorageSync('app_jw_token')
		// 请求报文格式
		header['Content-Type'] = "application/json"
		// 渠道标识
		// header['channelType'] = (await bridgeSdk.getChannel()) || beans.getH5IframeChannel();
		header['channelType'] = 'mini';
		// 扫码核销，问题修复，如果是ios或android
		if ((serviceUrl || '').includes('/mctapi/CouponController/userCoupon.do') && ('android'== header['channelType'] || ('ios' == header['channelType']))) {
			header['channelType'] = 'app';
		}
		
		// if(!header['channelType']){
		// 	uni.hideLoading();
		// 	uni.showModal({
		// 		title: '提示',
		// 		// content: '获取渠道标识失败，请在模拟器或真机环境下运行',
		// 		content: '获取渠道标识失败，请在大连海创嗨创生活App内运行',
		// 		showCancel: false
		// 	})
		// 	reject("获取渠道标识失败");
		// 	return;
		// }
		// 客户端标识
		data.appid = data.appid || __VITE_APP_ID__;
		data.timestamp = new Date().getTime().toString()
		// 请求方法
		method = method ? method.toUpperCase() : "POST"
		// 交易超时时间
		timeout = timeout ? timeout : 60000
		// console.log("当前请求信息：", serviceUrl, data)
		// 需要验签处理，请求头设置签名字符串
		if (sign) {
			// 按字母排序数据，防止后台接收时的参数顺序发生变更，造成签名结果不一致
			const dataSortByLetter = function (data : any) {
				var keys = [];
				// 记录key
				for (var k in data) {
					keys.push(k);
				}
				// 按升序方式排序
				keys.sort(function (v1, v2) {
					return v1.charCodeAt(0) - v2.charCodeAt(0);
				});
				var newData : any = {};
				// 记录key
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					// 值为对象时递归进行内层排序
					if (typeof data[key] === "object") {
						newData[key] = dataSortByLetter(data[key]);
					} else {
						newData[key] = data[key];
					}
				}
				return newData;
			};
			const sortData = dataSortByLetter(data);

			// @ts-ignore
			const { data: { signData } } = bridgeSdk.hi.md5({
				data: JSON.stringify(sortData)
			});
			header.sign = signData;
		
			data = JSON.parse(JSON.stringify(sortData));
			// console.log(data,)
		}
		// 请求报文需要加密处理
		if (encrypt) {
			// const sm4EncryptString: any = sm4Encrypt(JSON.stringify(data));
			// data = {
			// 	_seciv: sm4EncryptString.skey,
			// 	_encryptData: sm4EncryptString.encryptData
			// };
			// console.log("---国密加密后的数据---", JSON.stringify(data));
			// console.log("---国密加密后的数据自解密---", sm4Decrypt(data._encryptData));
			console.warn("加密前数据: " + " 请求地址= " + serviceUrl + " ,请求参数= " + JSON.stringify(data) + " ,请求token= " + header.token);
			const encryptData = bridgeSdk.aesEncrypt(data);
			data = encryptData;
			// console.log("加密后数据：", data);
		}

		let requestingKey = JSON.stringify({
			api,
			data: JSON.parse(JSON.stringify(data)),
			extra
		});
		console.warn("当前待发起的请求：", requestingKey);
		console.log("当前请求队列：", requestingMap);
		if(requestingMap[requestingKey]){
			console.log("当前请求已在请求队列中，请勿重复请求");
			return;
		}
		// 放到队列中
		requestingMap[requestingKey] = true;
		// console.log("新请求放入队列后：", requestingMap);

		// console.log("最终数据：", data);
		const requestTask: any = uni.request({
			url: serviceUrl,
			data,
			header,
			method,
			timeout,
			success: async function (res: { data: any, statusCode: number }) {
				// console.log("response: ", serviceUrl, JSON.stringify(res));
				// 移除拦截的请求
				beans.removeInterceptedRequest(_httParams);
				const { data, statusCode } = res
				// 通讯失败，本地使用vite代理时，会报错：Cannot read properties of null (reading 'split')
				// if(statusCode == 500){
				// 	console.log("response: ", serviceUrl, JSON.stringify(res));
				// 	setTimeout(() => {
				// 		// Toast('服务器错误，请稍后再试', 2000);
				// 		Toast(errMsg, 2000);
				// 	// }, 300);
				// 	}, 50);
				// 	reject("服务器错误："+JSON.stringify(data));
				// 	return
				// }
				// else 
				if(statusCode != 200){
					console.log("response: ", serviceUrl, JSON.stringify(res));
					
					if(catchError){
						reject({
							data: null,
							message: "接口调用异常",
							code: statusCode
						});
					} else {
						setTimeout(() => {
							// Toast(data, 2000);
							Toast(errMsg, 2000);
						// }, 300);
						}, 50);
						reject("通讯失败："+JSON.stringify(data));
					}
					return
				}
				let result = data
				// 外部独立处理响应
				if(catchRes){
					resolve(result);
					return;
				}
				/**
				 * result响应报文无需解密时, 格式:
				 * {
				 *  // 异常时非0000
					respcode: "0000",
					// 具体报错原因
					respmsg: "操作成功",
					// 响应数据: null | {} | [] | ''
					result: {} 
				 * }
				 */
				// 响应报文无需解密时
				if(!decrypt) {
					if(result.respcode == "0000"){
						resolve(result.result);
					}
					// 交易失败，如果开发者指定catchError: true时，抛出异常到catch中，开发者可在对应的交易中单独处理交易失败情况
					else if(catchError){
						reject({
							data: result || null,
							message: result.respmsg,
							code: result.respcode
						});
					}
					// 交易失败，如果开发者未指定catchError: true时，使用默认的错误处理方式，不抛出异常
					else{
						setTimeout(() => {
							// Toast(result.respmsg, 2000);
							Toast(result.respmsg?.includes("系统异常") ? errMsg : result.respmsg, 2000);
						// }, 300);
						}, 50);
					}
					return;
				}
				/** 
				 * 响应报文需要解密时
				  errcode	说明
					0	成功
					-1	请求报文不正确、系统繁忙、系统异常等
					-2	Token失效或者token无效
					2	用户需要登录，用户未登录
					SIGN_ERROR	验签失败
					9	报文解密失败
				 */
				// 通讯成功
				if(result.errcode == "0"){
					// 响应报文需要解密处理
					// if(decrypt) {
						// result = sm4Decrypt(result.rspData).decryptData;
						result = bridgeSdk.aesDecrypt(result.rspData);
						// 第一层一般都是json字符串
						if(typeof result === "string") {
							result = JSON.parse(result);
						}
						// 第二层一般也是json字符串，2层json字符串基本能覆盖自有系统场景了
						if(typeof result === "string") {
							result = JSON.parse(result);
						}
					// } 
					// else {
					// 	result = result.rspData;
					// }
					// console.log(JSON.stringify({
					// 	serviceUrl,
					// 	header
					// }, null, 2), result);

					console.warn('解密后响应报文: ', serviceUrl, result);

					if(result.respcode == "0000"){
						resolve(result.result);
					}
					// 交易失败，如果开发者指定catchError: true时，抛出异常到catch中，开发者可在对应的交易中单独处理交易失败情况
					else if(catchError){
						reject({
							data: result || null,
							message: result.respmsg,
							code: result.respcode
						});
					}
					// 交易失败，如果开发者未指定catchError: true时，使用默认的错误处理方式，不抛出异常
					else{
						setTimeout(() => {
							// Toast(result.respmsg, 2000);
							Toast(result.respmsg?.includes("系统异常") ? errMsg : result.respmsg, 2000);
						// }, 300);
						}, 50);
					}
				}
				// 某些功能用户需要登录，用户未登录
				else if(result.errcode == "2"){
					console.log("某些功能用户需要登录，用户未登录", serviceUrl);
					console.log("清空用户信息");
					utils.clearUserInfo();
					console.log("记录拦截的请求，待登录后重新请求");
					// 记录拦截的请求，待登录后重新请求
					beans.setInterceptedRequests({
						..._httParams,
						needLogin: true
					});
					console.log("提示用户登录");
					// 提示用户登录
					!skipLogin && utils.toLogin({ tips: true });
				}
				// Token失效或者token无效
				else if(result.errcode == "-2"){
					console.log("Token失效或者token无效，清空token和用户信息", serviceUrl);
					utils.clearToken();
					utils.clearUserInfo();
					console.log("重新拉取token");
					// 重新拉取token
					await requestToken(_httParams);
					// // 记录拦截的请求，待登录后重新请求
					// beans.setInterceptedRequests({
					// 	..._httParams,
					// 	needLogin: true
					// });
					// utils.toLogin({ tips: true});
				}
				// 交易失败，如果开发者指定catchError: true时，抛出异常到catch中，开发者可在对应的交易中单独处理交易失败情况
				else if(catchError){
					reject({
						data: result || null,
						message: result.errmsg,
						code: result.errcode
					});
				}
				// 交易失败，如果开发者未指定catchError: true时，使用默认的错误处理方式，不抛出异常
				else{
					setTimeout(() => {
						// Toast(result.errmsg || result.respmsg, 2000);
						Toast(errMsg, 2000);
					}, 50);
				}
			},
			fail: function (res) {
				console.log("fail", res);
				if (showFailToast) {
					setTimeout(() => {
						// Toast(JSON.stringify(res), 2000)
						Toast(errMsg, 2000);
					}, 50);
				}
				reject(res)
			},
			complete: function (res) {
				console.warn("当前请求完成：", requestingKey);
				console.log("complete", res);

				// 移除请求队列
				if(requestingMap[requestingKey]){
					delete requestingMap[requestingKey];
					// console.warn("请求队列移除请求后：", requestingMap)
				}

				mask && loading.hideLoading();
			}
		})
		// 区分交易的key
		// requestTask.requestKey = requestingKey;
		// 记录接口请求，页面切换时需要终止切换前页面已发送的接口
		// console.log("requestTask: ", requestTask)
	})
}
