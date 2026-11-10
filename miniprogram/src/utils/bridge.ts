/*
 * @Description: 常用工具类封装
 * @Author: chenyulong
 * @Date: 2024-10-29 15:02:03
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-06-20 14:38:30
 * @Remark: 集成了hi-js-sdk聚合入口，该工具类不包含任何业务逻辑、请求，只作为基础的工具类使用，否则可能会出现相互引用问题，造成莫名的错误，涉及到请求相关逻辑请在utils.ts中定义
 * 文档地址: https://open.huibaoding.com/hi-docs/#/
 */

// 当前运行环境
let _currentEnv: any = null;
let _currentDevice: any = null;
let _currentWindowInfo: any = null;

// 引入js sdk
import hiSdk from "./library/sdk/hi-js-sdk.js";
export const hi = hiSdk;

// @ts-ignore
import JSEncrypt from "./library/encrypt/rsa/jsencrypt.js";

import * as trackReport from '@/utils/track';

import { tabBar } from '@/pages.json'

// import * as coordinateTransform from "@/utils/coordinateTransform"

import * as wgs84ToBd from "@/utils/wgs84ToBd"

/**
 * 获取客户端环境信息
 * @returns 微信小程序原生环境（miniProgram）、微信公众号h5环境（officialAccount）、微信小程序webview h5环境（miniProgram_webview）、安卓客户端（android）、ios客户端（ios）、web端（web）
 */
export const getEnvironment = async (): Promise<string> => {
  return new Promise((resolve) => {
    if (_currentEnv) {
      resolve(_currentEnv);
      return;
    }
    try {
      // @ts-ignore
      hi.getEnvironment({
        success(res) {
          // console.log(res.data)
          _currentEnv = res.data.env;
          resolve(_currentEnv);
        },
        fail(res) {
          console.log("hi.getEnvironment fail: ", res);
          resolve("unknown");
        },
      });
    } catch (e) {
      console.warn("getEnvironment 调用异常（非 App 环境正常现象）", e);
      resolve("unknown");
    }
  });
};

/**
 * url解析
 * @param url 要解析的url
 * @returns 
 */
export const getUrlObj = (url: string) => {
  // @ts-ignore
  const res: any = hi.getUrlObj({
    url: url,
  });
  if (res?.data) {
    return res.data;
  }
  return null;
};

/**
 * 统一处理参数，对某些参数特殊处理
 * @param url 跳转路径
 */
export const handleOpenURLParams = (url: string) => {
  const urlOrigin = url + '';
  let obj: { [key: string]: any } = {};
  // @ts-ignore
  let { query, path } = getUrlObj(url);
  // console.log("query: ", query, "path: ", path);
  if (path) {
    obj.url = path;
  }
  let _params: { [key: string]: any } = {};
  if (query && "[object Object]" === Object.prototype.toString.call( query )) {
    if (query._titleColor_) {
      let index = query._titleColor_.indexOf('#');
      if (index > -1) {
        _params.titleColor = "#" + query._titleColor_.replace("#","");
      }
      query._titleColor_ = undefined;
    }
    if (query._showNavBar_) { 
      _params.showNavBar = query._showNavBar_;
      query._showNavBar_ = undefined;
    }
    if (query._setPullDownRefresh_) {
      _params.setPullDownRefresh = query._setPullDownRefresh_;
      query._setPullDownRefresh_ = undefined;
    }
    if (query._showStatusBar_) {
      _params.showStatusBar = query._showStatusBar_;
      query._showStatusBar_ = undefined;
    }
    if (query._setCapsule_) {
      _params.setCapsule = query._setCapsule_;
      query._setCapsule_ = undefined;
    }
  }
  if (Object.keys(_params).length > 0) {
    // _params = {...query, ..._params};
    let _dic = {...query};
    let paramsStr = '';
    for (const key in _dic) {
      if (_dic.hasOwnProperty(key) && _dic[key] && _dic[key].length > 0) {
        const _value = encodeURIComponent(_dic[key]);
        paramsStr = paramsStr + `&${key}=${_value}`;
      }
    }
    if (paramsStr.length > 0) {
      paramsStr = paramsStr.substring(1, paramsStr.length);
    }
    return {
      url: obj.url + (Object.entries(_dic).filter(([key, value]) => value !== null && value !== undefined).length > 0 ? `?${paramsStr}`: ''),
      ..._params
    };
  } else {
    return {url: urlOrigin};
  }
}

/**
 * 获取随机数
 * @param bit 随机数长度
 * @param charTypeArr 随机数字符类型数组
 * @returns 
 */
export const keyStr = function (bit: number, charTypeArr: string[]) {
  // @ts-ignore
  const {
    data: { key },
  } = hi.generateRandomKey({
    bit: bit,
    charTypeArr: charTypeArr,
    success: (res) => {},
    fail: (err) => {},
    complete: (res) => {},
  });
  // console.log("keyStr: ", key);
  return key;
};

/**
 * 生成generateUUID
 * @returns 
 */
export const generateUUID = (replacer?: string) => {
  // @ts-ignore
  const res = hi.generateUUID({
    replacer: replacer || "",
  });
  return res.data.uuid;
};

/**
 * 是否在大连海创嗨创生活App内，大连海创嗨创生活App用户代理字符串存在特定标识（客户端注入的）
 */
export const isInHiApp = () => {
  const isHiApp = navigator?.userAgent?.indexOf("HUIBAODING_1.0.0") >= 0;
  // console.log("是否在大连海创嗨创生活App内：", isHiApp);
  return !!isHiApp;
}

/**
 * 是否是大连海创嗨创生活域名
 * @returns 
 */
export const isHbdDomain = (url: string) => {
  return url.includes("huibaoding.com");
}

/**
 * 获取设备信息
 * @returns
 */
export const getDeviceInfo = async () => {
  return new Promise(async (resolve, reject) => {
    const _env: string = await getEnvironment();

    const winInfo: any = getWindowInfo();
    // console.log("winInfo:", winInfo);

    const deviceInfo: any = uni.getDeviceInfo() || {};
    // console.log("deviceInfo:", deviceInfo);

    // 获取系统名称
    const getSys = (osName: string) => {
      osName = osName.toLowerCase();
      // console.log("osName: ", osName);
      if(osName.indexOf("android") > -1){
        return "android";
      }
      if(osName.indexOf("ios") > -1){
        return "ios";
      }
      return "unknown"
    };
    
    // 通用信息
    const getInfo = () => {
      const appInfo = uni.getAppBaseInfo() || {};
      // console.log("appInfo:", appInfo);

      // 默认为起始版本2.0.0
      let appVersion = "1.0.0";
      if(uni.getAccountInfoSync){
        // 仅当线上版本小程序version字段才有值, 否则为空
        const { miniProgram: { version="", appId, envVersion }} = uni.getAccountInfoSync() || {};
        version && (appVersion = version);
      }
    
      // const deviceInfo: any = uni.getDeviceInfo() || {};
      // // console.log("deviceInfo:", deviceInfo);

      // const winInfo: any = getWindowInfo();
      // // console.log("winInfo:", winInfo);

      // 需要开放给调用者的信息
      const baseInfo: any = {
        // 运行环境 
        runtimeEnv: _env,
        // 操作系统，比如：android 14、ios 14
        system: deviceInfo.system,
        // 屏幕宽度，单位px
        width: winInfo.windowWidth,
        //屏幕高度，单位px
        height: winInfo.windowHeight,
        // 手机顶部状态栏高度，单位px
        statusBarHeight: winInfo.statusBarHeight,
        // 导航栏高度，单位px，h5、小程序默认44px
        navBarHeight: 44,
        // 手机型号
        model: deviceInfo.deviceModel,
        // 制造商
        manufacturer: "",
        // 品牌
        brand: deviceInfo.deviceBrand,
        // 产品名称
        product: "",
        // 设备
        device: "",
        // 版本
        version: deviceInfo.system,
        // 设备像素比
        devicePixelRatio: winInfo.pixelRatio,
        // 设备 id 。由 uni-app 框架生成并存储，清空 Storage 会导致改变
        deviceId: deviceInfo.deviceId,

        // 微信客户端基础库版本
        wx_sdk_version: appInfo.hostSDKVersion,
        // App、小程序宿主版本。如：微信版本号
        wx_version: appInfo.hostVersion,

        // app版本 "1.2.0"
        // appVersion: appInfo.hostVersion
        appVersion: appVersion,

        // 系统名称
        osName: getSys(deviceInfo.system),
      };
      // console.log("baseInfo:", baseInfo);
    
      // 删除空字段
      Object.keys(baseInfo).forEach((key) => {
        if (baseInfo[key] === undefined) {
          delete baseInfo[key];
        }
      });
      
      return baseInfo;
    }

    // 客户端
    if(isInHiApp()) {
      if(_currentDevice){
        // console.log("客户端 _currentDevice: ", _currentDevice);
        resolve(_currentDevice);
        return;
      }
      hi.getDeviceInfo({
        success(res) {
          // console.log('客户端设备信息: ', JSON.stringify(res.data));
          const baseInfo = {
            // 运行环境 
            runtimeEnv: _env,
            // 操作系统，比如：android 14、ios 14
            system: deviceInfo.system,
            // 屏幕宽度，单位px
            width: res.data.width,
            //屏幕高度，单位px
            height: res.data.height,
            // 手机顶部状态栏高度，单位px, 设置默认值, 防止值为0时高度塌陷造成布局被状态栏遮挡
            statusBarHeight: res.data.statusBarHeight || "50",
            // 导航栏高度，单位px
            navBarHeight: res.data.navBarHeight,
            // 手机型号
            model: res.data.model,
            // 制造商
            manufacturer: res.data.manufacturer,
            // 品牌
            brand: res.data.brand,
            // 产品名称
            product: res.data.product,
            // 设备
            device: res.data.device,
            // 版本
            version: res.data.version,
            // 设备像素比
            devicePixelRatio: winInfo.pixelRatio,
            // 设备id
            deviceId: res.data.deviceId,
            // app版本 "1.2.0"
            appVersion: res.data.appVersion,
            // ip地址
            ip: res.data.ip,
            // mac地址
            mac: res.data.mac,

            // 系统名称
            osName: getSys(deviceInfo.system),
          }
          
          _currentDevice = baseInfo;

          resolve(_currentDevice);
        },
        fail(res) {
          console.log("hi.getDeviceInfo fail: ", res);

          const defaultInfo = getInfo();
          console.log("设置默认的设备信息，防止调用处异常:", defaultInfo);

          _currentDevice = defaultInfo;

          resolve(_currentDevice);
        },
        complete(res) {}
      });
    }
    // web端、小程序
    else {
      if(_currentDevice){
        // console.log("web端、小程序 _currentDevice: ", _currentDevice);
        resolve(_currentDevice)
        return;
      }

      _currentDevice = getInfo();

      resolve(_currentDevice);
    }
  });
};

/**
 * 获取屏幕尺寸信息
 * @returns
 */
export const getWindowInfo = () => {
  if(_currentWindowInfo){
    // console.log("_currentWindowInfo: ", _currentWindowInfo);
    return _currentWindowInfo;
  }

  if (uni.getWindowInfo) {
    _currentWindowInfo = uni.getWindowInfo();
    // console.log("getWindowInfo", _currentWindowInfo);
  } else if (uni.getSystemInfoSync) {
    _currentWindowInfo = uni.getSystemInfoSync();
    // console.log("getSystemInfoSync", _currentWindowInfo);
  }
  
  return _currentWindowInfo;
};

/**
 * 存储中获取信息
 * @param key 要获取的key
 * @returns
 */
export const getStorageSync = (key: any) => {
  return uni.getStorageSync(key);
};

/**
 * 存储信息
 * @param key 要存储的key
 * @param value 要存储的value
 */
export const setStorageSync = (key: any, value: any) => {
  // console.log("getStorageInfoSync key: ", uni.getStorageInfoSync());
  // const keys = uni.getStorageInfoSync().keys;
  // console.log("getStorageInfoSync keys: ", keys);
  // for (const v of keys) {
  //   console.log("getStorageSync: ", v, "value: ", uni.getStorageSync(v));
  // }
  uni.setStorageSync(key, value);
};

/**
 * 删除存储的信息
 * @param key 要删除的key
 */
export const removeStorageSync = (key: any) => {
  uni.removeStorageSync(key);
};

/**
 * 清除所有存储的信息
 */
export const clearStorageSync = () => {
  uni.clearStorageSync();
};

/**
 * 获取系统信息
 * @returns
 */
export const getSystemInfoSync = async () => {
  return await getDeviceInfo();
};

/**
 * 抛出警告信息阻止后续逻辑执行
 * @param msg 要抛出的警告信息
 */
export const throwMsg = (msg: string) => {
  console.warn(msg);
}

/**
 * 获取两坐标点间距离
 * @param  
 * @returns 
 */
export const getDistanceFromTowPoints = ({
  startPoint = { lat: 0, lng: 0 },
  endPoint = { lat: 0, lng: 0 },
}) => {
  const {
    // @ts-ignore
    data: { distance },
  } = hi.getDistanceFromTowPoints({
    startPoint,
    endPoint,
    success: (res) => {},
    fail: (err) => {},
    complete: (res) => {},
  });
  return distance;
};

/**
 * 根据页面路径查找路由与delta层级，如果存在就直接返回，不存在就返回null
 */
export const getPageFromRouter = (pageName: string | undefined) => {
  const routes = getCurrentPages();
  // 如果查询的页面在路由栈中存在多个时，返回最后一个，因为正常的返回层级时逐级返回的，防止跳过太多的页面造成为止的错误
  for (let curr = routes.length - 1, max = curr; curr >= 0; curr--) {
    console.log("currRouter: ", routes[curr].route, pageName);
    if (routes[curr].route == pageName) {
      return {
        // 获取最后一级页面到指定页面的层级数
        delta: max - curr,
        page: routes[curr],
      };
    }
  }
  return null;
};

/**
 * 跳转首页，支持App、小程序
 */
export const toFirstPage = async ({
  success,
  fail
} = {
  success: (res: any) => {},
  fail: (err: any) => {}
}) => {
  const _env: string = await getEnvironment();
  // console.log("当前环境: ", _env);

  // 小程序环境回退失败时，跳转小程序首页
  if(_env === "miniProgram") {
    uni.switchTab({
      url: "/pages/home/home",
      success: (res) => {
        // console.log('miniProgram res: ', res);
        success && success(res);
      },
      fail: (err) => {
        console.error('miniProgram err: ', err);
        fail && fail(err);
      }
    });
  } 
  // 小程序webview环境回退失败时，跳转小程序首页
  else if(_env === "miniProgram_webview") {
    // @ts-ignore
    wx.miniProgram.switchTab({
      url: "/pages/home/home",
      success: (res: any) => {
        // console.log('miniProgram_webview res: ', res);
        success && success(res);
      },
      fail: (err: any) => {
        console.error('miniProgram_webview err: ', err);
        fail && fail(err);
      }
    }); 
  } 
  // 客户端关闭所有webview，即回到App首页
  else if(isInHiApp()) {
    isDev() ? 
    uni.switchTab({
      url: "/pages/home/home"
    }) : 
    hi.closeWebview({
      success: (res) => {
        console.log('客户端关闭所有webview，回退到来源页 success res: ', res);
        success && success(res);
      },
      fail: (err) => {
        console.error('客户端关闭所有webview，回退到来源页 fail err: ', err);
        fail && fail(err);
      },
      complete: (res) => {
        console.log('客户端关闭所有webview，回退到来源页 complete res: ', res);
        success && success(res);
        fail && fail(res);
      }
    });
  }
  else {
    uni.switchTab({
      url: "/pages/home/home",
      success: (res) => {
        // console.log('miniProgram res: ', res);
        success && success(res);
      },
      fail: (err) => {
        console.error('miniProgram err: ', err);
        fail && fail(err);
      }
    });
    // history.back();
    // uni.navigateBack({
    //  delta: 1
    // });
  }
};

/**
 * 跳转本项目首页，支持H5、小程序
 */
export const toUniAppFirstPage = () => {
  uni.switchTab({
    url: "/pages/home/home"
  });
}

/**
 * 打开外部链接，app内h5打开新窗口，微信小程序打开webview，其他h5环境打开iframe
 * @param url: 要打开的外部链接
 * @param title: 页面标题
 * @param extra_config: 额外参数, 如：{ showNavBar: "0", showStatusBar: "0", setCapsule: "0" }
 */
export const openOuterPage = async (params: { url: string; title: string; extra_config?: any }) => {
  const extra_config = params.extra_config || {};

  trackReport.trackPageView(decodeURIComponent(params.title));

  if(!params.url.startsWith("http://") && !params.url.startsWith("https://")) {
    console.error("url格式错误，请检查");
    return;
  }

  const _env: string = await getEnvironment();
  if (
    _env === "miniProgram" ||
    _env === "officialAccount" ||
    _env === "miniProgram_webview"
  ) {
    // 跳转内部h5页面
    uni.navigateTo({
      url:
        "/pages/h5/h5?url=" +
        encodeURIComponent(params.url) +
        "&title=" +
        encodeURIComponent(params.title),
    });
  } 
  // 大连海创嗨创生活App内
  else if (isInHiApp()) {
    let {url:_url, ..._params} = handleOpenURLParams(params.url);
    // @ts-ignore
    hi.openURLByParams({
      url: _url,
      title: decodeURIComponent(params.title),
      ...extra_config,
      ..._params,
      complete: (res) => {
        console.log("hi.openURLByParams res: ", res);
      },
    });
  } 
  // 一般web端调试用
  else {
    // // 跳转内部h5页面
    // uni.navigateTo({
    //   url:
    //     "/pages/h5/h5?url=" +
    //     encodeURIComponent(params.url) +
    //     "&title=" +
    //     encodeURIComponent(params.title),
    // });
    // 小程序真机没有 window，必须判断
    if (typeof window !== "undefined") {
      window.open(params.url, "_blank");
    }
    // 打开新页面
    // window.location.href = params.url;
  }
};

/**
 * 打开微信小程序，app内借助sdk，小程序内直接调起小程序，首选半屏小程序
 * @param title 要打开的小程序名称
 * @param miniAPPID 要打开的小程序appId
 * @param miniAppPath 要打开的小程序path
 * @param miniAppGhId 要打开的小程序ghId
 */
export const jumpWxMiniProgram = async (params: {
  title: string;
  miniAppId: string;
  miniAppPath: string;
  miniAppGhId: string;
}) => {
  // #ifdef MP-WEIXIN
  trackReport.trackPageView(decodeURIComponent(params.title) || params.miniAppId);
  // 打开半屏小程序，使用限制：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/openEmbeddedMiniProgram.html
  uni.openEmbeddedMiniProgram({
    // 示例：wx123456789abcdefg
    appId: params.miniAppId,
    // 示例：pages/index/index?needLogin=true&userId=$id&userName=$nickname&phone=$phone
    path: params.miniAppPath,
    fail(res) {
      console.log("uni.openEmbeddedMiniProgram res: ", res);
    },
  });
  // #endif
  // #ifdef H5
  trackReport.trackPageView(decodeURIComponent(params.title) || params.miniAppId);
  // @ts-ignore
  hi.openMiniProgram({
    // 考虑到管理端配置的跳转小程序字段始终是miniAppId，该字段作为备选项，miniAppGhId是为了方便开发者代码中能同时实现app内、小程序内跳转小程序的逻辑，而不用写条件编译代码
    miniAPPID: params.miniAppGhId || params.miniAppId,
    miniAPPPath: params.miniAppPath,
    // 仅大连海创嗨创生活小程序支持跳转到指定的版本，比如：体验版，其他小程序一律跳转正式版，防止无权限访问
    type: __VITE_HUIBAODING_MINI_ORIGIN_ID__ === params.miniAppGhId ? __VITE_ENV_VERSION__ : "0",
    complete(res) {
      // console.log("hi.openMiniProgram res: ", res);
    },
    fail(err) {
      console.error('hi.openMiniProgram err: ', err);
      uni.showToast({
        title: '打开小程序失败，请App内打开',
        icon: 'none',
        duration: 2000
      });
    }
  });
  // #endif
};

/**
 * 判断指定页面是否是tabbar页 
 * @param currPath 指定页面路径
 * @returns 
 */
export const isTabbar = (currPath: string) => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  // console.log('currPath:', currPath)
  // console.log('tabBar.list:', tabBar.list)
  return !!tabBar.list.find((e) => ('/' + e.pagePath) === currPath)
}

/**
 * 通过tabbar索引获取tabbar页面路径
 * @param tabIndex 
 * @returns 
 */
export const getTabPage = (tabIndex: number) => {
  if (!tabBar) {
    return ''
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return ''
  }
  const tab = tabBar.list[tabIndex - 1]
  if (!tab) {
    return ''
  }
  return tab.pagePath;
}

/**
 * 打电话
 * @param phoneNumber 电话号码
 */
export const makePhoneCall = function ({
  phoneNumber,
  title
}: {
  phoneNumber: string;
  title: string;
}) {
  trackReport.trackCustom("打电话-" + (title || phoneNumber));
  
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
  });
};

/**
 * 扫一扫，支持App、微信小程序
 * @param callback 
 */
export const scanCode = function (callback: (res: any) => void) {
  trackReport.trackCustom("扫一扫");

  // #ifdef MP
  uni.scanCode({
    success: (res) => {
      console.log(res);
      callback && callback(res);
    },
  });
  // #endif
  // #ifdef H5
  // @ts-ignore
  hi.scanCode({
    success: (res) => {
      console.log(res);
      callback && callback(res);
    },
    fail: (err) => {
      console.error(err);
    },
    complete: (res) => {
      console.log("hi.scanCode complete res: ", res);
    },
  });
  // #endif
};

/**
 * 获取渠道标识
 * 安卓端：android，苹果端：ios，微信小程序端(含webview)：mini
 */
export const getChannel = async () => {
	let channel = '';

  const _env = await getEnvironment();
  // console.log('getChannel environment: ', _env);

  switch (_env) {
    // pc端运行环境识别为web，非模拟器时默认渠道mini，保证调用接口无问题，但是如果用户在页面加载完后切换到了模拟器模式，渠道号会从mini变为ios或android，因为渠道号的变化造成进入更多服务空白，故取消mini默认值
    // case 'web':

    // 小程序
    case 'miniProgram':
    // 小程序webview
    case 'miniProgram_webview':
    // 公众号
    case 'officialAccount':
      channel = 'mini';
      break;
    case 'android':
      channel = 'android';
      break;
    case 'ios':
      channel = 'ios';
  }

  // console.log('channel: ', channel);

	return channel;
}

/**
 * 当前所处环境是否开发环境
 * @returns 
 */
export const isDev = () => {
  return process.env.NODE_ENV === 'development';
}

/**
 * 获取static静态资源，解决该项目中图片资源路径问题，替换require引入方式
 * @param url  静态资源在images中的短路径，例如：static/images/home/test.png，直接传home/test.png即可
 * @returns 
 */
export const importMainStatic = (url: string) => {
  // #ifdef H5
  return new URL(`../static/images/${url}`, import.meta.url).href;
  // #endif
  // #ifdef MP-WEIXIN
  return `/static/images/${url}`;
  // #endif
};

/**
 * aes加密
 * @param data 待加密的原始数据
 * @returns
 */
export const aesEncrypt = (data: object) => {
  // console.warn('加密前请求报文: ', JSON.stringify(data));

  const skey = getStorageSync("jw_key");
  const siv = getStorageSync("jw_iv");
  // console.log('加密的skey:', skey)
  // console.log('加密的siv:', siv)

  const uuid = generateUUID();
  // console.log('加密的uuid:', uuid)
  setStorageSync("jw_uuid", uuid);
  
  const {
    // @ts-ignore
    data: { encryptData: _secureData },
  } = hi.aesEncrypt({
    data: data,
    key: skey,
    iv: siv,
    success: (res) => {},
    fail: (err) => {},
    complete: (res) => {
      // console.log("aesEncrypt complete res: ", res);
    },
  });
  // console.log('加密后请求报文:', _secureData)

  var result: any = {
    signType: "MD5",
    version: __VITE_APP_VERSION__,
    encType: "aes",
    noceStr: uuid,
    // noceStr: 'db91d09d10ca4802baa850e6b7b9cf8d',
    timestamp: new Date().getTime(),
  };
  // console.log('result:', result)

  // result.sysInfo = getDeviceInfo();

  // 签名顺序是固定的，不能随意更改
  // const parma: any = {
  //     appid: __VITE_APP_ID__,
  //     // encType: result.encType,
  //     noceStr: result.noceStr,
  //     reqData: _secureData,
  //     signType: result.signType,
  //     timestamp: result.timestamp,
  //     token: getStorageSync('app_jw_token'),
  //     version: result.version,
  //     key: skey,

  //     // ...baseInfo
  // }
  // console.log('parma:', parma);
  // let str = Object.keys(parma).map(key => [key] + '=' + parma[key]).join('&');

  // 固定签名顺序
  let str = `appid=${__VITE_APP_ID__}&encType=${result.encType}&noceStr=${
    result.noceStr
  }&reqData=${_secureData}&signType=${result.signType}&timestamp=${
    result.timestamp
  }&token=${getStorageSync("app_jw_token")}&version=${result.version}&key=${skey}`;
  // console.log('parma str:', str)

  const {
    // @ts-ignore
    data: { signData },
  } = hi.md5({
    data: str,
    success: (res) => {},
    fail: (err) => {},
    complete: (res) => {},
  });

  let encStr = signData.toUpperCase();
  // console.log('encStr:', encStr)

  result.sign = encStr;
  result.reqData = _secureData;
  // console.log("result final:", result);

  return result;
};

/**
 *
 * @param encryptData 加密后密文数据
 * @returns
 */
export const aesDecrypt = (encryptData: string) => {
  // console.group('---解密前响应报文---', encryptData)

  const skey = getStorageSync("jw_key");
  const siv = getStorageSync("jw_iv");
  // console.log('解密的skey:', skey)
  // console.log('解密的siv:', siv)

  const {
    // @ts-ignore
    data: { decryptedData: decrypted },
  } = hi.aesDecrypt({
    encryptData: encryptData,
    key: skey,
    iv: siv,
    success: (res) => {},
    fail: (err) => {},
    complete: (res) => {
      // console.log("aesDecrypt complete res: ", res);
    },
  });
  // console.log('---解密后响应报文字符串---', decrypted);

  // 不确定加密的数据是不是json字符串，取消parse逻辑，直接返回字符串
  // const res = JSON.parse(JSON.parse(decrypted));
  // const res = JSON.parse(decrypted);
  // console.log('---解密后响应报文对象---', res);

  return decrypted;
};

/**
 * rsa加密
 * text 需要加密的文本
 */
export const encryptString = (text: any) => {
  // console.log("rsa加密前数据: ", text);
  var encrypt = new JSEncrypt();
  // console.log("__VITE_APP_PUBLIC_KEY__: ", __VITE_APP_PUBLIC_KEY__);
  // publicKey 加密需要的公钥  pkcs1 类型的公钥
  encrypt.setPublicKey(__VITE_APP_PUBLIC_KEY__);
  return encrypt.encrypt(text);
};

/**
 * 动态加载js脚本
 * @param url 脚本地址
 * @returns
 */
export const loadScript = (url: string) => {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = () => {
      resolve(null);
    };
    script.onerror = (e) => {
      reject(e);
    };
    document.head.appendChild(script);
    // #endif
    // #ifndef H5
    reject("该方法仅支持H5环境，请在H5环境下调用！");
    // #endif
  });
};

/**
 * 动态加载css样式
 * @param url 样式地址
 * @returns 
 */
export const loadlink = (url: string) => {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    const link = document.createElement("link");
    link.type = "text/css";
    link.href = url;
    link.rel = "stylesheet";
    link.onload = () => {
      resolve(null);
    };
    link.onerror = (e) => {
      reject(e);
    };
    document.head.appendChild(link);
    // #endif
    // #ifndef H5
    reject("该方法仅支持H5环境，请在H5环境下调用！");
    // #endif
  });
};

/**
 * 非空校验
 * @data 需要校验的值
 */
export const checkIsEmpty = (value: string | any[] | null) => {
	if (typeof(value) === 'undefined') {
		return false;
	} else if (typeof(value) !== 'boolean') {
		if (typeof(value) === 'object') {
			if (value === null) {
				return false;
			} else if (Object.prototype.toString.call(value) === '[object Array]') {
				return value.length > 0;
			} else if (Object.prototype.toString.call(value) === '[object Date]') {
				return true;
			} else {
				return Object.keys(value).length > 0;
			}
		} else {
			if (value === '' || value.toString().replace(/\s*/g, '') === '' || value === 'null' || value ===
				'undefined') {
				return false;
			} else {
				return true;
			}
		}
	} else {
		return value;
	}
};


/**
 * 打开地图，这里使用百度坐标点
 * @data 需要校验的值 lat 纬度 lng 经度 address 
 */
export const openMap = (lat:any, lng:any, name:string, address:string) => {
  // #ifdef H5
  // 打开百度地图
  // @ts-ignore
  hi.openMap({
    name: name,
    latitude: lat,
    longitude: lng,
    // 成功，可选参数
    success: function (res) {
      // console.log(res);
    },
    // 失败，可选参数
    fail: function (res) {
      console.log(res);
    },
    // 无论成功、失败都会回调，可选参数
    complete: function (res) {
      // 成功
      if (res.errCode === 1) {
          
      }
      // 失败
      else {

      }
    }
  });
  // #endif
  // #ifdef MP
  // 百度经纬度转为腾讯坐标
  const { lat: _lat, lng: _lng } = wgs84ToBd.bd09ToGcj02(lng, lat);
  uni.openLocation({
    name: name,
    address: address,
    latitude: _lat,
    longitude: _lng,
    complete: function (res) {
      console.log(res);
    },
  });
  // #endif
};

/**
 * 路线规划导航，这里使用百度坐标点
 * @param startPoint 起始经纬度，格式为：经度,纬度 116.481028,39.99025
 * @param endPoint 终止经纬度，格式为：经度,纬度 121.472644,31.231706
 */
export const routePlan = (startPoint:any, endPoint:any, name: string, address: string) => {
  uni.showLoading({
    title: '路线规划中...',
  });
  // #ifdef H5
  // 百度地图导航
  hi.routePlan({
    startPoint: startPoint,
    endPoint: endPoint,
    // 成功，可选参数
    success: function (res) {
      // console.log(res);
    },
    // 失败，可选参数
    fail: function (res) {
      console.log(res);
    },
    // 无论成功、失败都会回调，可选参数
    complete: function (res) {
      uni.hideLoading();
      // 成功
      if (res.errCode === 1) {
          
      }
      // 失败
      else {

      }
    }
  });
  // #endif
  // #ifdef MP
  const lngLat = endPoint.split(",");
  // 百度坐标转换为腾讯坐标
  // const { lat, lng } = coordinateTransform.baiduToTencentCoord(lngLat[1], lngLat[0]);
  const { lat: _lat, lng: _lng } = wgs84ToBd.bd09ToGcj02(lngLat[0], lngLat[1]);
  uni.openLocation({
    name,
    address,
    latitude: _lat,
    longitude: _lng,
    complete: function (res) {
      console.log(res);
      uni.hideLoading();
    },
  });
  // #endif
};

/**
 * 根据url参数更新appToken, 某些情况下缓存中的appToken值可能被清空造成解析用户信息异常问题
 * @returns 
 **/
export const updateAppToken = () => {
  // 防止缓存中appToken被清空造成取值出问题, 这里更新下缓存中的appToken值
  if(isInHiApp()){
    // app跳转到h5功能时会携带appToken参数，保存到本地
    const appToken = getUrlObj(location?.href || "")?.query?.appToken;
    console.log("query appToken: ", appToken);
    appToken && setStorageSync('appToken', appToken);
  }
}

/**
 * 获取系统本身的版本号(小程序线上运行版本号、客户端本地版本号)
 * @returns 版本号
 */
export const getAppVersion = async () => {
  const deviceInfo: any = await getDeviceInfo();
  console.log("当前应用版本号: ", deviceInfo.appVersion);
  return deviceInfo.appVersion;
}

/**
 * 执行指定返回层级数或页面路径的上级页面方法
 * @param pagePath 页面路径, 与delta二选一, 例如：pagePath='package-recruitment/pages/recruitment-dashboard', 表示返回招聘管理页面, 前提是该页面必须存在于路由历史记录里
 * @param delta 返回层级数, 与pagePath二选一 例如：delta=1, 表示返回上一级页面
 * @param methodName 方法名 执行的上级页面方法名
 * @param params 方法参数
 */
export const execPrePageMethod = ({ pagePath, delta, methodName, params }: { pagePath: string, delta: number, methodName: string, params: any }) => {
  console.log(`execPrePageMethod 页面路径=${pagePath}, 返回层级=${delta}, 方法名=${methodName}, 参数=${JSON.stringify(params)}`);
  params = params || {};
  const routes = getCurrentPages();
  console.log("routes: ", routes);
  // 指定返回层级
  if (delta) {
    // 如果已经是第一个路由栈页面时，点击回退会刷新当前页面，估计是uni-app的bug
    const currentPagesLength = routes.length;
    // 只有一个页面了，没办法继续回退了
    if (currentPagesLength <= 1) {
      // 跳过方法执行
      console.log("不存在执行方法的页面了, 当前页面已经是最后一个了");
    }
    // 存在上级页面
    else {
      // 指定层级的页面路由栈
      const prevRoute = routes[routes.length - 1 - delta];
      console.log("指定层级的页面路由栈", prevRoute);
      const lastPageInstance = prevRoute?.$vm;
      if(!lastPageInstance) {
        console.log("指定层级的页面路由栈不存在, 跳过方法执行");
        return;
      }
      console.log("找到上一级的页面了, 开始执行方法");
      lastPageInstance[methodName] && lastPageInstance[methodName](params);
    }
    return;
  }
  // 指定页面返回路径，不指定层级
  if (!pagePath) {
    throwMsg("页面路径不能为空");
    return;
  }
  // 指定页面返回
  const match = getPageFromRouter(pagePath);
  console.log("根据页面路径: ", pagePath, " 找到的页面: ", match);
  // 页面不存在时
  if (!match) {
    console.log("根据页面路径: ", pagePath, " 找到的页面不存在, 跳过方法执行");
    return;
  }
  // 页面存在，返回指定页面
  const prevRoute = match?.page;
  const lastPageInstance = prevRoute?.$vm;
  if(!lastPageInstance) {
    console.log("根据页面路径: ", pagePath, " 找到的页面不存在, 跳过方法执行");
    return;
  }
  console.log("找到上一级的页面了, 开始执行方法");
  lastPageInstance[methodName] && lastPageInstance[methodName](params);
}

