/*
 * @Description: 埋点工具类，兼容微信小程序、app端
 * @Author: chenyulong
 * @Date: 2024-12-09 14:48:00
 * @LastEditors: 陈玉龙
 * @LastEditTime: 2025-04-25 10:37:44
 * @Remark: 
 */
// 鉴于该文件会被bridgeSdk.ts引用，为避免文件之间交叉引用问题造成死循环等未知问题，改为单独抽出来需要的工具类
import hi from "./library/sdk/hi-js-sdk.js";
import * as bridgeSdk from "./bridge";

/**
 * 获取统计sdk参数
 * @returns {serviceUrl: string, appKey: string}
 */
export const getStatistParams = () => {
	return {
		// serviceUrl: __VITE_STATISTICS_BASEURL__,
    serviceUrl: __VITE_SERVER_BASEURL__ + "/abpdata",
		appKey: __VITE_STATISTICS_APP_KEY__
	}
}

// 调用客户端sdk进行统计
const trackApi = (eventExtra : { [key: string] : any } = {})=> {
  console.log('trackApi eventExtra', eventExtra);
  const _env = eventExtra.env;
  delete eventExtra.env;
  return new Promise((resolve, reject) => {
    // @ts-ignore
    // 检测api是否存在, 存在时优先使用track
    hi.checkApi({
      api: "track",
      complete: function(res) {
        // console.log("checkApi success", res);
        // 存在检测的api
        if (res.errCode === "1") {
          // @ts-ignore
          hi.track({
            ...eventExtra,
            success: () => {},
            fail: () => {},
            complete: (res: any) => {
              // console.log('hi track complete', res);
              resolve(res);
            }
          })
        }
        // 不存在检测的api
        else {
          if(_env === 'ios') {
            // 由于ios客户端(2.0.3以下版本)存在js sdk参数与原生参数不匹配的情况, 旧版屏蔽sdk的调用, 防止造成客户端崩溃情况
            const baseInfo: any = bridgeSdk.getDeviceInfo();
            const appVersion = baseInfo.appVersion;
            // @ts-ignore
            const res = hi.compareVersion({
              v1: appVersion,
              v2: '2.0.2'
            });
            // console.log("trackApi compareVersion: ", res);
            // 高于2.0.2版本, 可以调用埋点api, 理论上不可能高于2.0.3版本还不支持track api, 这个判断不会走
            if(res?.data.code == 1) {
              resolve(null);
            }
            // 2.0.2及以下版本, 跳过埋点api调用
            else {
              console.log('trackApi version too low, skip statistics api');
              resolve(null);
            }
          }
          else {
            // @ts-ignore
            hi.statistics({
              ...eventExtra,
              success: () => {},
              fail: () => {},
              complete: (res) => {
                // console.log('hi statistics complete', res);
                resolve(res);
              }
            })
          }
        }
      }
    })
    // // 暂时先开启安卓埋点, 等2.0.3版本开始再使用上述动态监测的逻辑同时开启ios埋点
    // if(_env == 'android') {
    //   // @ts-ignore
    //   hi.statistics({
    //     ...eventExtra,
    //     success: () => {},
    //     fail: () => {},
    //     complete: (res) => {
    //       console.log('hi statistics complete', res);
    //       resolve(res);
    //     }
    //   })
    // }
  })
}

// #ifdef MP
// const courtlyLibMP = require('../static/mp-weixin/library/sdk/countly.wx.js');
// console.log('courtlyLibMP', courtlyLibMP);
// #endif

let _env: string = ''
// let courtlyLib: any = null;
let sdkInitStatus = false;

const { serviceUrl, appKey } = getStatistParams();
// console.log('serviceUrl: ', serviceUrl, ', appKey: ', appKey);

// 初始化sdk
// const initSdk = () => {
//   courtlyLib.app_key = appKey;
//   courtlyLib.url = serviceUrl;
//   // courtlyLib.debug = true;
//   // 异步方式上报数据
//   courtlyLib.q = courtlyLib.q || [];
//   courtlyLib.init();
//   // courtlyLib.q.push(['track_pageview', "应用首次加载"]);
//   courtlyLib.q.push(['track_sessions']);
//   courtlyLib.q.push(['track_errors']);
//   // courtlyLib.q.push(['track_clicks']);

//   // #ifdef MP  
//   // courtlyLib.q.push(['add_event', {
//   //   // key: "[CLY]_view",
//   //   key: "打开应用" + "_wx_mini_recordEvent",
//   //   // segmentation: {
//   //     // name: "打开应用" + "_wx_mini_recordEvent",
//   //     // '[CLY]_label': eventName
//   //   // }
//   // }])
//   // #endif

// }

export const initTrack = async () => {
    return new Promise(async (resolve, reject) => {
        // console.log('track init')
    
        if(!_env) {
            _env = await bridgeSdk.getEnvironment();
        }
    
        // 客户端
        if(_env === 'android' || _env === 'ios') {
            // console.log('track init client');
            resolve("客户端埋点初始化成功");
            sdkInitStatus = true;
            return;
        } 
        // 微信小程序
        else if (_env === 'miniProgram'){
            // console.log('track init miniProgram')
            // courtlyLib = courtlyLibMP;
            // initSdk();
            resolve("微信小程序埋点初始化成功");
            sdkInitStatus = true;
            return;
        }
        // web端
        else {
          // console.log('track event web not support');
          // console.log('track init web');
          // web端加载统计sdk
          // courtlyLib = (window as any).Countly;
          // // sdk文件已经加载
          // if (courtlyLib) {
          //     console.log('track sdk already loaded');
          //     resolve("web sdk 初始化成功");
          //     sdkInitStatus = true;
          //     return;
          // }
          // // sdk文件未加载
          // else {
          //     try {
          //         // 加载sdk文件
          //         await bridgeSdk.loadScript('../static/web/library/sdk/countly.web.js');
          //         console.log('web sdk loaded');
          //         // web端统计sdk初始化
          //         courtlyLib = (window as any).Countly || {};
          //         console.log('courtlyLib', courtlyLib);
          //         initSdk();
          //         resolve("web sdk 初始化成功");
          //         sdkInitStatus = true;
          //     } catch (error) {
          //         reject("web sdk初始化失败");
          //         sdkInitStatus = false;
          //     }
          // }
        }
    })
}

// 调用客户端sdk进行统计
const callClientSdk = async ({ eventName, pageName, env } : { eventName?: string; pageName?: string; env?: string } = {}) => {
  // console.log('eventName', eventName);
  // console.log('pageName', pageName);
  // console.log('env', env);
  const eventExtra: { [key: string] : any } = {};
  if(pageName && pageName !== 'undefined') {
    // 页面名称, 比如太行步道、惠多多, 与eventName二选一, 如果都传的话, serviceName优先
    // eventExtra.serviceName = pageName + `_h5_${env}_recordView`;
    eventExtra.serviceName = pageName;
  } else if(eventName && eventName !== 'undefined') {
    // 事件名称, 比如: 扫一扫, 打电话, 与serviceName二选一, 如果都传的话, serviceName优先
    // eventExtra.eventId = eventName + `_h5_${env}_recordEvent`;
    eventExtra.eventId = eventName;
  }
  // console.log('eventExtra', eventExtra);
  if(Object.keys(eventExtra).length > 0) {
    await trackApi({ ...eventExtra, env: _env });    
  } else {
    console.log('statistics params is empty');
  }
}

/**
 * 自定义事件上报
 * @param eventName 事件名, 比如: 扫一扫、打电话
 */
export const trackCustom = async (eventName = "") => {
  // console.log('trackCustom eventName: ', eventName);

  // sdk未初始化，先初始化sdk
  if(!sdkInitStatus) {
    await initTrack();
  }

  if(!_env) {
    _env = await bridgeSdk.getEnvironment();
  }

  // 客户端
  if(_env === 'android' || _env === 'ios'){
    callClientSdk({ eventName, env: _env });
    return;
  }
  // 微信小程序
  else if (_env === 'miniProgram'){
    // courtlyLib.q.push(['add_event', {
    //   // key: "[CLY]_view",
    //   key: eventName + "_wx_mini_recordEvent",
    //   // segmentation: {
    //   //   name: eventName + "_wx_mini_recordEvent",
    //   //   // '[CLY]_label': eventName
    //   // }
    // }])
    // console.log('courtlyLib.q', courtlyLib.q)
    return;
  }
  // web端
  else {
    // console.log('track event web not support');
    // courtlyLib.q.push(['add_event', {
    //     key: eventName + "_web_recordEvent",
    //     segmentation: {
    //         name: eventName + "_wx_mini_recordEvent",
    //         // '[CLY]_label': eventName
    //     }
    // }])
  }
}

/**
 * 页面浏览事件上报
 * @param pageCnName 
 */
export const trackPageView = async (pageCnName = "") => {
  // const eventName = "page_view";
  const pageName = pageCnName;
  // console.log('trackPageView pageName', pageName);

  // sdk未初始化，先初始化sdk
  if(!sdkInitStatus) {
    await initTrack();
  }

  if(!_env) {
    _env = await bridgeSdk.getEnvironment();
  }

  // 客户端
  if(_env === 'android' || _env === 'ios'){
    // console.log('track event client');
    callClientSdk({ pageName, env: _env });
    return;
  }
  // 微信小程序
  else if (_env === 'miniProgram'){
    // courtlyLib.q.push(['track_pageview', pageName + `_${_env}_recordView`]);
    return;
  }
  // web端
  else {
    // console.log('track event web not support');
    // // courtlyLib.q.push(['track_pageview', pageName + `_${_env}_recordView`]);
  }
}
