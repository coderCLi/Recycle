/*
 * @Description: 获取token、iv
 * @Author: chenyulong
 * @Date: 2024-11-28 22:15:16
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-25 13:22:11
 * @Remark: 
 */

import { getEvnBaseUrl } from '@/utils/index';
import * as bridgeSdk from '@/utils/bridge'
import * as utils from '@/utils/utils'
import * as beans from '@/utils/beans';

// 记录请求状态，防止重复请求
let fetching = false;

/**
 * 获取token、iv
 * 如果个别页面逻辑依赖于token和实时用户信息（接口请求token拦截无需单独处理，已经统一处理），页面中methods直接定义callFun方法即可
 */
export function requestToken(_httParams?: any) {
    // 云开发方案：小程序端不再使用旧后端 token，直接返回，避免相对路径请求在真机上报 invalid url
    // #ifdef MP
    return Promise.resolve(null);
    // #endif
    // #ifndef MP
    return new Promise(async (resolve, reject) => {     
        const { keyStr, encryptString, setStorageSync, getStorageSync, isInHiApp, aesDecrypt } = bridgeSdk;
        const { setUserInfo } = utils;
        const appToken: any = getStorageSync('appToken') || "";
        const app_jw_token = getStorageSync('app_jw_token');
        // console.log("requestToken app_jw_token: ", app_jw_token);
        // console.log("requestToken appToken: ", appToken);
        // 为空时调用，只请求一次，仅当token失效时才重新登录
        if(!utils.isTokenValid()){
            // console.log("requestToken appToken: ", appToken);
            // console.log("token不存在，请求token");
            
            // console.log("requestToken _httParams: ", JSON.stringify(_httParams));
            _httParams &&  beans.setInterceptedRequests(_httParams);

            if(fetching){
                return;
            }
            fetching = true;
            const info: any = uni.getDeviceInfo();
            // console.log("info: ", info);
            let deviceId = info ? info.deviceId : "";
            // console.log("deviceId: ", deviceId);
            let aeskey = keyStr(16, ['num', 'en']);
            console.log("aeskey: ", aeskey);
            var params = {
                encType: 'aes',
                key: aeskey,
                appToken
            };
            console.log("getToken params: ", JSON.stringify(params));
            uni.request({
                url: getEvnBaseUrl() + '/abpapp/LoginController/getToken.do',
                data: {
                    reqData: JSON.stringify({
                      encData: encryptString(JSON.stringify(params))
                    })
                },
                method: 'POST',
                timeout: 30000,
                header: {
                    deviceId
                },
                success: async function (res: { data: any, statusCode: number }) {
                    // console.log('getToken', JSON.stringify(res));
                    const { data, statusCode } = res
                    console.log("getToken rdata: ", JSON.stringify(data.result));
                    if (data.respcode === '0000') {
                        if (data.result && data.result.token) {
                            setStorageSync('jw_key', aeskey);
                            data.result.token && setStorageSync('app_jw_token', data.result.token);
                            data.result.iv && setStorageSync('jw_iv', data.result.iv);
                       
                            // 仅限大连海创嗨创生活App内才有该字段，大多数二级服务都是来源于App的跳转，会带过来appToken                       
                            if(isInHiApp()){
                                // 通过appToken获取用户信息成功
                                if(data.result.userinfo) {
                                    try {
                                        // @ts-ignore
                                        let userInfo = aesDecrypt(data.result.userinfo);
                                        userInfo = JSON.parse(userInfo);
                                        console.log("getToken userInfo: ", JSON.stringify(userInfo));
                                        setUserInfo(userInfo);    
                                    } catch (error) {
                                        console.error("getToken 解密用户信息失败: ", error);
                                        utils.clearUserInfo();
                                    }
                                    callFun();
                                }
                                else {
                                    callFun();
                                }
                            }
                            else {
                                callFun();
                            }
                            
                            await utils.retryFailedRequest();

                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: 'token为空'
                            })
                        }
                        resolve(data);
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: data?.respmsg || 'token请求失败'
                        })
                        reject();
                    }
                },
                fail: function (res) {
                    console.log('getToken', res);
                    uni.showToast({
                        icon: 'none',
                        title: '请求失败'
                    })
                    reject();
                },
                complete: function () {
                    fetching = false;
                }
            })
        } else {
            console.log("检测到token已存在，跳过请求", app_jw_token);
            callFun();
            resolve(null);
        }
    });
    // #endif
}

export const callFun = () => {
    const callbacks = beans.getTokenGetCallback();
    // console.log("callFun callbacks: ", callbacks);
    callbacks.forEach((callback: Function) => {
        callback();
    });
    // console.log("callFun 回调执行完毕, 清空回调");
    beans.clearTokenGetCallback();
}
