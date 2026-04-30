/*
 * @Description: setter 与 getter 方法
 * @Author: chenyulong
 * @Date: 2024-12-26 10:46:10
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-05-09 09:27:03
 * @Remark: 
 */
let _global: any = globalThis;
let pageInstance: any = {};

_global.interceptedRequests = null;

_global.interceptedLogics = null;

interface req { api: string, data: object, extra: object, resolve: any, reject: any, needLogin?: boolean };

// 记录拦截的所有请求
export const setInterceptedRequests = (request: req) => {
    _global.interceptedRequests = _global.interceptedRequests || {};
    // 唯一标识，方式记录重复的请求
    const requestKey = JSON.stringify({
        api: request.api, 
        data: request.data, 
        extra: request.extra,
        needLogin: request.needLogin
    });
    console.log('set interceptedRequests requestKey', requestKey);
    const existRequest = _global.interceptedRequests[requestKey];
    if(existRequest){
        console.log('exist request', request);
        return;
    }
    // 记录新的请求
    _global.interceptedRequests[requestKey] = request;
    console.log('set interceptedRequests', JSON.stringify(_global.interceptedRequests));
};

// 获取拦截的所有请求
export const getInterceptedRequests = (): req[] => {
    console.log('get interceptedRequests', JSON.stringify(_global.interceptedRequests));
    if(_global.interceptedRequests){
        return Object.values(_global.interceptedRequests);
    }
    return [];
};

// 清空拦截的所有请求
export const clearInterceptedRequests = () => {
    _global.interceptedRequests = null;
};

/**
 * 删除指定的请求
 * @param request 请求对象
 */
export const removeInterceptedRequest = (request: req) => {
    if(!_global.interceptedRequests){
        return;
    }
    Object.keys(_global.interceptedRequests).forEach(key => {
        const { api, data, extra, needLogin } = JSON.parse(key);
        // 相同特性的api剔除，防止某些情况下接口重复请求
        if(api === request.api && JSON.stringify(data) === JSON.stringify(request.data) && JSON.stringify(extra) === JSON.stringify(request.extra)){
            console.log('remove intercepted request', JSON.stringify(request));
            delete _global.interceptedRequests[key];
        }
    });
}

const getRouteName = (_this: any) => {
    let route = "";
    // #ifdef H5
    route = _this?.route || "";
    // #endif
    // #ifdef MP
    // @ts-ignore
    route = _this?.__route__ || "";
    // #endif
    // console.log('getRouteName', route);
    return route;
}

// 设置全局 this 对象
export const setGlobalThis = (_this: any) => {
    // console.log('set globalThis', _this);
    let route = getRouteName(_this);
    pageInstance[route] = _this;
};

// 移除全局 this 对象
export const removeGlobalThis = (_this: any) => {
    let route = getRouteName(_this);
        pageInstance[route] = null;
        delete pageInstance[route];
};

// 获取全局 this 对象
export const getGlobalThis = () => {
    // console.log('get globalThis', pageInstance);
    const pages = getCurrentPages();
    const _this = pages[pages.length - 1];
    let route = getRouteName(_this);
    // console.log('getGlobalThis route', route);
    return pageInstance[route];
};

// 设置 token 获取回调
export const setTokenGetCallback = (callback: any) => {
    _global.interceptedLogics = _global.interceptedLogics || [];
    _global.interceptedLogics.push(callback);
}

// 获取 token 获取回调
export const getTokenGetCallback = () => {
    return _global.interceptedLogics || [];
}

// 清空 token 获取回调
export const clearTokenGetCallback = () => {
    _global.interceptedLogics = null;
};

// 设置分享信息
export const setShareInfo = (shareInfo: { title: string, content: string, path: string, imageUrl: string }) => {
    _global.shareInfo = shareInfo || {};
}

// 获取分享信息
export const getShareInfo = (): { title: string, content: string, path: string, imageUrl: string } => {
    return _global.shareInfo || {};
}

// 清空分享信息
export const clearShareInfo = () => {
    _global.shareInfo = null;
}

// 记录渠道来源, pc端模拟真机预览时, 需要一个默认的渠道号用于正常渲染
export const setH5IframeChannel = () => {
    // 默认ios
    _global.h5IframeChannel = "ios";
    console.log("set h5IframeChannel", _global.h5IframeChannel);
}

// 获取渠道来源
export const getH5IframeChannel = () => {
    return _global.h5IframeChannel || "";
}
