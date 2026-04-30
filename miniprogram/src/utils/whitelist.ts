/*
 * @Descripttion: 白名单检测, 白名单开启时, 未登录时跳转到维护页面, 已登录但不在白名单内时跳转到维护页面, 已登录且在白名单内时正常访问
 * @Author: 陈玉龙
 * @Date: 2025-04-25 09:09:34
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-05-16 10:28:54
 */
import { checkWhiteList } from "@/api/whitelist";
import { getUserInfo, jumpPage, getCurrentRouter } from "./utils";
import { getDeviceInfo, getUrlObj } from "./bridge";

export const checkWhiteListPermission = ()=> {
    return new Promise(async (resolve, reject) => {
        let deviceInfo: any = await getDeviceInfo();
        // console.log("getAppVersion deviceInfo: ", deviceInfo);
        // 安卓系统: 1, 苹果系统: 2
        let type = 0;
        if(deviceInfo.osName == "android"){
            type = 1;
        }
        if(deviceInfo.osName == "ios"){
            type = 2;
        }
        const userInfo = await getUserInfo()?.userInfo;
        // console.log("getAppVersion userInfo: ", userInfo);

        const router = getCurrentRouter();
        console.log("getAppVersion router: ", router);
        // 服务池服务id
        const subId = router.options?.subId
        const param = {
            "serviceId": subId,
            "phone": userInfo?.mobile || "",
            "type": type,
            "publishStatus": "1"
        }
        console.log("getAppVersion param: ", param);
        checkWhiteList(param).then((res: any) => {
            console.log("getAppVersion res: ", res);
            // 已登录且未在白名单内或未登录，直接跳转到维护页面
            if(!res.data){
                // console.log("getAppVersion res.data.data is null");
                uni.redirectTo({
                    url: "/pages/building/building?showNav=1&tips=您不在白名单,无法使用该功能&title=白名单"
                })
                return;
            }
            // 已登录且在白名单内
            // if(res.code == 0){
                // console.log("getAppVersion in whiteList");
                resolve("success");
            // }
        })
    });
}