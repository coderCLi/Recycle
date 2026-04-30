/*
 * @Description: 常用工具类封装（包含任何业务逻辑和请求）
 * @Author: chenyulong
 * @Date: 2024-12-20 08:37:12
 * @LastEditors: TF
 * @LastEditTime: 2025-09-03 09:03:58
 * @Remark: 该工具类作为bridgeSdk的扩展，包含了一些与请求相关的逻辑，如登录、退出登录、实名认证、人脸识别等，可以根据实际情况进行扩展和修改
 */
import { useBaseStore, useUserStore } from "@/store"
import * as trackReport from '@/utils/track';
import {
    aesEncrypt,
    aesDecrypt,
    setStorageSync,
    removeStorageSync,
    hi,
    getTabPage,
    scanCode,
    makePhoneCall,
    openOuterPage,
    jumpWxMiniProgram,
    getStorageSync,
    throwMsg,
    getUrlObj,
    isInHiApp,
    isDev,
    toFirstPage,
    getPageFromRouter,
    execPrePageMethod
} from "@/utils/bridge";

import * as loginApi from "@/api/login";
import * as beans from "@/utils/beans";
import { http } from '@/utils/http'

import { getInitCode } from "@/api/login";
import { wgs84tobd09 } from "./wgs84ToBd"

// 用户信息明文数据
let userInfo: any = null;

let _global: any = globalThis;

/**
 * 获取当前页面路由
 * @returns
 */
export const getCurrentRouter = (): {
    fullPath: string;
    currRouter: any;
    route: string;
    options: any;
    pageConf: any;
} => {
    const routes = getCurrentPages();
    // console.log("routes: ", routes);
    const currRouter: any = routes[routes.length - 1] || {};
    // console.log("currRouter: ", currRouter);
    // 拼接完整的参数
    let fullPath = currRouter?.route ? "/" + currRouter.route : "";
    let _params = "";
    const options = currRouter?.options || {};
    Object.keys(options).forEach((key) => {
      _params += `${key}=${options[key]}&`;
    });
    _params = _params.slice(0, -1);
    if(_params){
      fullPath = fullPath + "?" + _params;
      // console.log("完整的url地址：", fullPath);
    }
    const pageConf: any = useBaseStore().allPages.filter((page: any) => page.path === '/' + currRouter?.route)[0];
    // console.log("pageConf: ", pageConf);
    return {
      route: currRouter.route,
      options: currRouter.options,
      fullPath: fullPath,
      currRouter,
      pageConf
    };
};

// 设置上次登录类型 可选登录方式：'wx'、'phone'、'account'
export const setLastLoginType = (str: any) => {
  setStorageSync("lastLoginType", str);
}
// 清空上次登录类型
export const clearLastLoginType = () => {
  setStorageSync("lastLoginType", "");
}
// 获取上次登录类型
export const getLastLoginType = () => {
  return getStorageSync("lastLoginType");
}

// 更新用户信息
export const setUserInfo = (info: any) => {
  console.log("utils setUserInfo: ", JSON.stringify(info));
  
  if(typeof info !== 'object' || !(info instanceof Object)){
    throwMsg("用户信息格式错误");
    return;
  }

  let userinfo = info;
  
  // 删除空数据
  Object.keys(userinfo).forEach((key) => {
    userinfo[key] === undefined && delete userinfo[key];
  });

  if(Object.keys(userinfo).length === 0){
    return;
  }

  // 登录、注册成功后传递过来的用户信息明文，需要加密存储
  const { reqData: user } = aesEncrypt(userinfo);
  console.log("加密后的用户信息：", user);
  userInfo = null;
  setStorageSync("hbd_mini_userinfo", user);

  // 更新store中用户信息，不能存储任何敏感信息，完整信息只能通过专门的 getUserInfo 方法获取
  const storeUser: any = {
    isFace: userinfo.isFace,
    isRealname: userinfo.isRealname,
    isLogin: userinfo.isLogin,
    sex: userinfo.sex,
    head: userinfo.head,
    desMobile: userinfo.desMobile,
    desUserName: userinfo.desUserName,
    desIdCard: userinfo.desIdCard,
    desNickName: userinfo.desNickName,
  };
  // 删除空数据
  Object.keys(storeUser).forEach((key) => {
    storeUser[key] === undefined && delete storeUser[key];
  });
  if(Object.keys(storeUser).length === 0){
    return;
  }
  useUserStore().setUserInfo(storeUser);  
}

// 自动更新用户信息
export const updateUserInfo = async () => {
  const res: any = await loginApi.getUserInfo();
  res.isLogin = "1";
  // console.log("updateUserInfo res: ", res);
  setUserInfo(res);
}
  
// 退出登录
export const logout = (callback: Function, tip: boolean = true) => {
  // toLogin({ tips: false });
  if(isInHiApp()){
    hi.logout({
      success: res => {
        console.log("logout success: ", res);
        clearToken();
        clearUserInfo();
      },
      fail: error => {
        console.log("logout fail: ", error);
      },
      complete: () => {
        console.log("logout complete");
      }
    });
  }
  else {
    loginApi.loginOut().then((res: any)=> {
      console.log("------退出登录")
      console.dir(res)
      if (res.errcode == "0" || res.errcode == "2" || res.errcode == "-2") {
        clearToken();
        clearUserInfo();

        // 清空额外的数据，防止缓存无效的数据造成未知异常
        uni.removeStorageSync("jw_key");
        uni.removeStorageSync("jw_iv");
        uni.removeStorageSync("jw_uuid");
        uni.removeStorageSync("userProfile");

        callback && callback(true);
        uni.switchTab({
          url: "/pages/mine/mine"
        });
        if (tip) {
          setTimeout(() => {
            uni.showToast({
              title: "退出登录成功",  
              icon: "none"
            });
          }, 300);
        }
      } else {
        if (tip) {
          setTimeout(() => {
            uni.showToast({
              title: res.errmsg || res.respmsg,  
              icon: "none"
            });
          }, 300);
        } else {
          callback && callback(false);
        }
      }
    })
  }
}

/**
 * 清空用户信息
 */
export const clearUserInfo = () => {
  removeStorageSync("hbd_mini_userinfo");
  userInfo = null;
  useUserStore().clearUserInfo();
}

/**
 * 清空token
 */
export const clearToken = () => {
  removeStorageSync("app_jw_token");
}

/**
 * 按需清空缓存
 */
export const clearAppStorage = () => {
  removeStorageSync('job_position_list_cache');
  removeStorageSync('job_industry_list_cache');
  let { query, path } = getUrlObj(location.href)
  if(query.appToken) {
    removeStorageSync("appToken");
  }
  removeStorageSync("thirdInitCode");
  clearUserInfo();
  clearToken();
}

/**
 * 需要实名，未实名时拉起实名认证，已实名时跳过实名认证
 * 需要实时调用用户信息接口校验
 */
export const checkIdentityAuth = async () => {
  return new Promise(async (resolve, reject) => {
    // 实时获取用户信息时接口压力可能过大, 所以使用缓存的用户信息
    // const userInfo: any = await loginApi.getUserInfo();

    // 先校验登录，未登录时拉起登录，跳过后续的逻辑；已经登录时继续后续的逻辑
    // const user: any = await checkLogin();
    // let userInfo = user?.userInfo || {};
    let userInfo = getUserInfo()?.userInfo;
    console.log("checkIdentityAuth userInfo: ", userInfo);

    if(!userInfo){
      console.log("用户信息为空");
      const user: any = await checkLogin();
      userInfo = user?.userInfo;
      console.log("checkIdentityAuth userInfo retry: ", userInfo);
    }
    
    // 用户信息仍为空
    if(!userInfo){
      console.log("用户信息仍为空");
      reject();
      return;
    }

    // 已实名
    if (userInfo.isRealname === '1') {
      console.log("已实名");
      resolve(true);
      return
    }

    // 未实名逻辑

    const common = async ()=>{
      // 跳转实名认证页面
      uni.navigateTo({
        // url: "/pages/identity-auth/identity-auth"
        url: "/pages/identity-auth/renzheng-auth"
      });
      reject();
      // throwMsg("跳转实名认证");
    }
    
    // 小程序继续保持原逻辑
    // #ifdef MP
    await common();
    return;
    // #endif
  
    // #ifdef H5
    // app内
    if(isInHiApp()){

      // @ts-ignore
      // 检测api是否存在, 存在时优先使用
      hi.checkApi({
        api: "checkIdentityAuth",
        complete: async res => {
          console.log("checkApi success", res);

          // 存在检测的api
          if (res.errCode === "1") {
            // 调用实名校验
            // @ts-ignore
            hi.checkIdentityAuth({
              complete: async (result: any) => {
                console.log("checkIdentityAuth complete: ", result);

                // 成功
                if (result.errCode === "1") {
                  console.log("checkIdentityAuth complete success");

                  // 重新获取最新的用户信息, 防止实名状态与app未同步
                  // 实时获取用户信息时接口压力可能过大, 所以使用缓存的用户信息
                  // await updateUserInfo();

                  console.log("checkIdentityAuth complete success userInfo: ", userInfo);
                  // 更新实名状态为已实名
                  userInfo.isRealname = '1';
                  setUserInfo(userInfo);

                  resolve(true);
                }
                // 失败
                else {
                  console.log("checkIdentityAuth complete fail");
                  reject();
                  // uni.showToast({
                  //   title: result.errMsg || "实名失败，请稍后再试",  
                  //   icon: "none"
                  // });
                }
              }
            })
          }
          // 不存在检测的api, 则使用原逻辑
          else {
            await common();
          }
        }
      });
      // throwMsg("跳转实名认证");
      return;
    }
    // 非app内普通h5
    else {
      await common();
      return;
    }
    // #endif
    console.log("其他平台不兼容该实名api");
  })
}
  
/**
 * 需要高级认证，未高级认证时拉起高级认证，已高级认证时跳过高级认证
 * 需要实时调用用户信息接口校验
 */
export const checkFaceAuth = async () => {
  const res: any = await loginApi.getUserInfo();
  if (res.isFace != '0') {
    console.log("已高级认证");
    return true;
  }
  // 跳转高级认证页面
  // uni.navigateTo({
  //     url: "/pages/face-auth/face-auth"
  // });
  throwMsg("跳转高级认证");
  return false;
}

/**
 * 统一跳转逻辑，适配app环境h5项目内页面跳转、h5跳外域、h5打开小程序，微信小程序内部页面跳转、小程序webview打开外域、打电话等场景
 * @param parma 跳转参数
 * @param parma.permissionLevel 权限验证等级 1-无需登录 2-需要登录 3-实名认证 4-人脸识别
 * @param parma.miniAppGhId app打开微信小程序，微信小程序的原始id，如：gh_123456789abcdef，当该字段为空时，app内打开小程序时使用miniAPPID的值
 * @param parma.miniAPPID 微信小程序打开第三方小程序，第三方小程序的appid，如：wx1234567890
 * @param parma.miniAPPPath 小程序页面路径，如：pages/index/index 或 pages/index/index?needLogin=true&userId=$userId&userName=$nickName&phone=$phone（参数解析见dynamicParamsToStaticParams方法参数说明）
 * @param parma.title 页面标题
 * @param parma.isBuilding 功能建设中，敬请期待
 * @param parma.needLogin 是否需要登录
 * @param parma.openType 跳转类型，navigateTo、redirectTo、switchTab、reLaunch，默认navigateTo
 * @param parma.url 
 * 跳转外部h5页面时，传完整路径，如：https://life.hihihi.com.cn/dt/#/?needLogin=true&userId=$userId&userName=$nickName&phone=$mobile&activityId=643950a9-47dc-413b-bd70-6299b7cc8443，参数解析见dynamicParamsToStaticParams方法参数说明
 * 跳转系统内部页面时：传页面路由，如：pages/home/home && pages/home/home?needLogin=true&userId=$userId&userName=$nickName&phone=$phone，参数解析见dynamicParamsToStaticParams方法参数说明
 * url参数特殊协议设计：
 * 打电话：tel://10086
 * 扫码：scanCode://
 * 切换tab页：native://tab:1 最后一位是切换的tab顺序
 * 文案提示类：warn://活动已结束
 * 第三方跳转特殊处理: thirdParty://SF_Express, 根据协议及内容全匹配
 * ...
 */
export const jumpPage = async (parma: {
    permissionLevel?: string;
    url: string;
    miniAPPID?: string;
    miniAPPPath?: string;
    miniAppGhId?: string;
    title?: string;
    isBuilding?: boolean;
    needLogin?: boolean;
    openType?: string;
    extra_config?: any;
    pageType?: any;
    tabPageId?: string;
}) => {
    console.log("跳转页面parma: ", parma);
    

    // 太行步道
    // parma.url = "web/index.html#/pages/app-h5/third-h5?scene_url=https%3A%2F%2Fwww.bdthi.cn%2F%23%2Fpages%2Findex%3FneedLogin%3Dtrue%26__hbd__encryptData__%3Dtrue_name%3A%3A%24userName%2Cphone%3A%3A%24mobile%2Cid_no%3A%3A%24idCard%2CencryptMode%3A%3Aaes%2CencryptKey%3A%3A35f3609fe08824ef%2CencryptIv%3A%3Aabe8ab1234567890%2C__r__%3A%3A%24timestamp";

    // 保畅行
    // parma.url = "web/index.html#/pages/app-h5/third-h5?scene_url=https%3A%2F%2Fbaoding.ttpark.cn%2FMobileServer%2Fweb%2Fsdk%2Fbuttjoin%2Findex.html%3FuserGroupID%3D49996%26tAppID%3D105%26signType%3DDEP5%26needLogin%3Dtrue%26__hbd__encryptData__%3Dtel%3A%3Amobile%2Ctimestamp%3A%3A%24timestamp%2CencryptMode%3A%3Ades%2CencryptKey%3A%3A1FB0438CD0C7E0A2%2C__hbd__encryptData__replace%3A%3Asign";

    // 课后服务
    // parma.url = "web/index.html#/pages/app-h5/third-h5?scene_url=https%3A%2F%2Fbd-parents.h5.haoduo.vip%3FneedLogin%3Dtrue%26__hbd__encryptData__%3Dtrue_name%3A%3A%24userName%2Cphone%3A%3A%24mobile%2Cid_no%3A%3A%24idCard%2CencryptMode%3A%3Aaes%2CencryptKey%3A%3A35f3609fe08824ef%2CencryptIv%3A%3Aabe8ab1234567890%2C__r__%3A%3A%24timestamp";

    // 课后服务教师端
    // parma.url = "web/index.html#/pages/app-h5/third-h5?scene_url=https%3A%2F%2Fbd-teacher.h5.haoduo.vip%3FneedLogin%3Dtrue%26__hbd__encryptData__%3Dtrue_name%3A%3A%24userName%2Cphone%3A%3A%24mobile%2Cid_no%3A%3A%24idCard%2CencryptMode%3A%3Aaes%2CencryptKey%3A%3A35f3609fe08824ef%2CencryptIv%3A%3Aabe8ab1234567890%2C__r__%3A%3A%24timestamp";

    let title: string = "";
    let scene_url: string = "";
    if(parma.url){
      const { query: { title: _title, scene_url: _scene_url } } = getUrlObj(parma.url);
      title = _title || null;
      scene_url = _scene_url;
      console.log("title: ", title);
      console.log("scene_url: ", scene_url);
    }

    let tempUrl = parma.url || parma.miniAPPPath || "";

    tempUrl = getRealUrl(tempUrl);
    console.log("真实跳转路径tempUrl: ", tempUrl);

    if(scene_url){
      tempUrl = replaceThirdH5Url(tempUrl);
      console.log("第三方h5真实路径tempUrl: ", tempUrl);
    }

    // 未开放
    if(parma.isBuilding){
      trackReport.trackPageView(parma.title);
      uni.showToast({
        title: "功能建设中，敬请期待！",  
        icon: "none"
      });
      return;
    }
  
    // 需要登录
    if(parma.needLogin){
      parma.permissionLevel = '2';
    }
  
    // 需要登录时，先检查是否登录，未登录时拉起登录，跳过后续的逻辑；已经登录时继续后续的逻辑
    tempUrl.includes("needLogin=true") && await checkLogin();
  
    tempUrl = dynamicParamsToStaticParams({
      url: tempUrl,
    }) || "";
  
    // 校验登录状态
    if (parma.permissionLevel == '2') {
      let res = await checkLogin();
      if (!res) { return; }
    }
    // 校验实名状态
    else if (parma.permissionLevel == '3') {
      let res = await checkLogin();
      if (!res) { return; }
      let b = await checkIdentityAuth();
      if (!b) { return }
    } 
    // // 校验人脸认证状态
    // else if (parma.permissionLevel == '4') {
    //   // let b = await checkFaceAuth();
    //   // 临时替换未开发的人脸功能
    //   let b = await checkIdentityAuth();
    //   if (!b) { return }
    // }

    // 根据url、miniAPPID、miniAPPPath等关键参数自动判断跳转类型
    // 匹配特殊协议，如有其他扩充逻辑，都在第一个判断处添加
    // if(){ console.log('跳转特殊协议'); }
    // 跳转APP tab页
    if(parma.pageType && parma.pageType == "tab"){
      let tabPageId : string = parma.tabPageId? parma.tabPageId : "1"
      if(isInHiApp()){
        hi.showTab({
          "success": ()=>{},
          "fail": ()=>{},
          "complete": ()=>{},
          table_index: tabPageId, 
        })
      }else{
       let tabPage = getTabPage(parseInt(tabPageId));
        console.log("切换原生tab页 tabPage：", tabPage);
        if (!tabPage.startsWith("/")) {
          tabPage = "/" + tabPage;
        }
        
        uni.switchTab({
          url: tabPage
        });
      }
    }
    // 切换原生tab页
    else if(tempUrl.startsWith("native://tab:")){
      const tabIndex = parseInt(tempUrl.replace("native://tab:", ""));
      console.log("切换原生tab页：", tabIndex);
      let tabPage = getTabPage(tabIndex);
      console.log("切换原生tab页 tabPage：", tabPage);
      if (!tempUrl.startsWith("/")) {
        tabPage = "/" + tabPage;
      }
      
      uni.switchTab({
        url: tabPage
      });
    }
    // 单独定制处理
    // 顺丰快递地址来源于后台获取
    else if (tempUrl.startsWith("thirdParty://SF_Express")) {
      // console.log("单独定制处理: ", decodeURIComponent(parma.title))
      trackReport.trackPageView(parma.title);
      const user:any = await checkLogin();
      console.log("thirdParty user: ", user);
      const _url: any = await http('/abpapp/LogisticsController/getLogisticsUrl.do', { userId: user?.userInfo.userId });
      console.log("顺丰快递地址: ", _url)
      openOuterPage({
        url: _url,
        title: parma.title || title || "",
        extra_config: parma.extra_config || {}
      });
      return;
    }
    // 提示信息
    else if (tempUrl.startsWith("warn://")) {
      trackReport.trackPageView(parma.title);
      uni.showToast({
        title: tempUrl.replace("warn://", ""),  
        icon: "none"
      });
      return;
    }
    // 扫一扫
    else if(tempUrl.startsWith("scanCode://")){
      scanCode(()=>{});
    }
    // 打电话
    else if (tempUrl.startsWith("tel://")) {
      console.log("打电话 " + tempUrl);
      makePhoneCall({
        title: parma.title || title || "",
        phoneNumber: tempUrl.replace("tel://", ""),
      });
    }
    // 需要跳转h5页面
    else if (tempUrl.startsWith("http://") || tempUrl.startsWith("https://")) {
      // return;
      openOuterPage({
        url: tempUrl,
        title: parma.title || title || "",
        extra_config: parma.extra_config || {}
      });
    }
    // 打开小程序
    else if (parma.miniAppGhId || parma.miniAPPID) {
      jumpWxMiniProgram({
        title: parma.title || title || "",
        miniAppGhId: parma.miniAppGhId || "",
        miniAppId: parma.miniAPPID || "",
        miniAppPath: tempUrl
      });
    }
    // 项目内页面跳转
    else if (tempUrl) {
      let _trackTitle: string = "";
      
      // 转码title字段
      if (tempUrl && tempUrl.length > 0) {
        let { query, path } = getUrlObj(tempUrl);
        const paramsMap:Map<string, string> = getUrlParams(tempUrl, false);
        const _title = paramsMap.get("title");
        _trackTitle = _title || "";
        if ( _title && isPercentEncoded(_title)) {
          paramsMap.set("title", decodeURIComponent(_title));
          _trackTitle = decodeURIComponent(_title);
        }
        let paramsStr = '';
        if (paramsMap.size > 0) {
          [...paramsMap].forEach(([key, value]) => {
            if (value && value.length > 0) {
              paramsStr = paramsStr + `&${key}=${value}`;
            }
          });
          if (paramsStr.length > 0) {
            paramsStr = paramsStr.substring(1, paramsStr.length);
          }
        }
        tempUrl = path + (paramsStr.length > 0 ? `?${paramsStr}`: '')
      }

      const trackView = () => {
        setTimeout(() => {
          // 埋点统计
          const name = beans.getGlobalThis()?.options?.title || getCurrentRouter()?.pageConf?.style?.navigationBarTitleText;
          // console.log("_trackTitle name: ", name);

          // @ts-ignore
          let { query, path } = getUrlObj(tempUrl);
          // console.log("query: ", query, "path: ", path);

          _trackTitle = parma.title || _trackTitle || name || "项目内页面跳转";
          _trackTitle = decodeURIComponent(_trackTitle);
          // console.log("埋点统计 _trackTitle: ", _trackTitle);
          trackReport.trackPageView(_trackTitle);
        }, 500);
      }

      // 如果是App跳转h5时，跳转地址后台配置可能包含nginx二级路径，此时可能需要跳转项目内某页面，也可能跳转至同域下的别的工程页面
      const openType: string = parma.openType || "";
      switch (openType) {
        case "navigateTo":
          uni.navigateTo({
            url: tempUrl,
            success: (res) => {
              trackView();
            }
          });
          break;
        case "redirectTo":
          uni.redirectTo({
            url: tempUrl,
            success: (res) => {
              trackView();
            }
          });
          break;
        case "switchTab":
          uni.switchTab({
            url: tempUrl,
            success: (res) => {
              trackView();
            }
          });
          break;
        case "reLaunch":
          uni.reLaunch({
            url: tempUrl,
            success: (res) => {
              trackView();
            }
          });
          break;
        default:
          uni.navigateTo({
            url: tempUrl,
            success: (res) => {
              trackView();
            }
          });
          break;
      }
    }
    else {
      trackReport.trackPageView(parma.title || title || tempUrl);
      console.log("跳转参数不正确，请检查");
    }
};

/**
 * 统一跳转逻辑，目前，主页和更多服务在使用
 * @param path 跳转路径
 * @param item 点击的服务data，有需要的字段则拼接
 * @param subjectId 服务大的类别
 */
export const toServicePage = async (path: string, item: any, subjectId: string) => {
  console.log("toServicePage--{" + path + "}");
  console.log("item ",item);
  let isKong = !path || path.length == 0
  let isHttp = (path || "").indexOf("http://") == 0 || (path || "").indexOf("https://") == 0

  // 处理url
  // * url参数特殊协议设计：
  // * 打电话：tel://10086
  // * 扫码：scanCode://
  // * 提示信息：warn://
  // * 切换tab页：native://tab:1 最后一位是切换的tab顺序
  let specialUrls = ["tel://", "scanCode://", "native://tab:", "warn://"];
  let _specialUrls = specialUrls.filter((str) => {
    return path && path.indexOf(str) > -1;
  });

  let title: string = "";
  if (_specialUrls.length > 0 || isKong) { // 特殊的，不拼接参数
    
  } else if (isHttp) {
    const { query: { title: _title } } = getUrlObj(path);
    // 不存在title，则设置
    if (!_title) {
      if (item.serviceName) {
        let fuhao: string = path.indexOf('?') > -1 ? '&' : '?'
        // path = `${path}${fuhao}title=${encodeURIComponent(item.serviceName)}`;
          title = encodeURIComponent(item.serviceName);
      }
    }
  } else {
    const paramsMap:Map<string, string> = getUrlParams(path);
    if (subjectId && !paramsMap.get("subjectId")) { // 不存在，则覆盖
      let fuhao: string = path.indexOf('?') > -1 ? '&' : '?'
      path = `${path}${fuhao}subjectId=${subjectId}`
    } else if (path.indexOf('?') == -1) {
      path = `${path}?xx=xx`
    }
    
    if (item.selfServiceId && !paramsMap.get("serviceId")) {
      path = `${path}&serviceId=${item.selfServiceId}`;
    }
    if (item.serviceExampleId && !paramsMap.get("serviceExampleId")) {
      path = `${path}&serviceExampleId=${item.serviceExampleId}`;
    }
    if (item.serviceName && !paramsMap.get("title")) {
      path = `${path}&title=${encodeURIComponent(item.serviceName)}`;
        title = encodeURIComponent(item.serviceName);
    }
    if (item.serviceId && !paramsMap.get("subId")) {
      path = `${path}&subId=${item.serviceId}`;
    }

    if (item.type && !paramsMap.get("type")) {
      path = `${path}&type=${item.type}`;
    }
  }

  
  // 请求参数
  let data: any = {};
  // type和appid -- 微信小程序，type类型 0-h5 1-小程序
  if (item.type == 1) {
    // if (item.appid) {
    //   path = `${path}&appid=${item.appid}`;
    // }
    data = {
      permissionLevel: item.permissionLevel, // 访问限制等级
      miniAPPID: item.appid,
      miniAPPPath: path
    };
  } else if (item.type == 0) {
    if (item.skipType == 7) {
      data = {
        url: path,
        permissionLevel: item.permissionLevel, // 访问限制等级
        title
      };
    } else {
      data = {
        url: path,
        permissionLevel: item.permissionLevel, // 访问限制等级
        title
      };
    }
  } else {
    data = {
      url: path,
      permissionLevel: item.permissionLevel, // 访问限制等级
      title
    };
  }
  console.log("跳转服务 ", data);
  await jumpPage({
    ...data,
    title: title || item.serviceName,
  });
};

const getUrlParams = (url: string, isdecode: boolean = true) => {
  let paramString = "";
  if (url.includes('?')) {
    if (url.split('?').length > 1) {
      paramString = url.split('?')[1];
    }
  }
  const paramsMap = new Map();
  const pairs = paramString.split('&');

  // 遍历每个键值对
  pairs.forEach(pair => {
    if (pair.includes('=')) {
      const [key, value] = pair.split('=');
      const decodedKey = isdecode ? decodeURIComponent(key) : key;
      const decodedValue = isdecode ? decodeURIComponent(value) : value;
      paramsMap.set(decodedKey, decodedValue);
    }
  });
  return paramsMap;
};

/**
 * 获取真实跳转路径
 * @param path 示例：web/index.html#/package-charm/charm/charm 或 hbdhtml/index.html#/login 或 /pages/login/index?redirect=%252F
 * @returns 真实跳转路径，示例：/pages/login/index?redirect=%252F 或 https://life.hihihi.com.cn/hbdhtml/index.html#/login
 */
const getRealUrl = (path: string) => {
    // console.log("getRealUrl path: ", path);
    
    if(!path){
      return path;
    }

    const origin = location?.origin || "";
    console.log("origin: ", origin);
    
    // 不同域，直接返回
    if(path.startsWith("http://") || path.startsWith("https://")){
      return path;
    }
    
    if(!path.includes("/index.html#/")){
      return path;
    }
  
    // 本地开发环境
    if(isDev()){
      return path.split("/index.html#")[1];
    }
  
    // #ifdef H5
    // 路径示例：https://life.hihihi.com.cn/web/#/pages/login/index?redirect=%252F，此时pathname：二级路径：/web/index.html
    // 路径示例：https://life.hihihi.com.cn/web/index.html#/pages/home/home，此时pathname：二级路径：/web/index.html
    const pathname = location.pathname.slice(1).replace("index.html", "");
    console.log("pathname: ", pathname);
  
    // 域：https://life.hihihi.com.cn
    // const origin = location.origin;
    // console.log("origin: ", origin);
  
    // 哈希值：#/pages/login/index?redirect=%252F
    // const hash = location.hash;
  
    // 包含二级路径，比如：web/index.html#/package-charm/charm/charm，如果跳转路径与当前页面所在的二级路径一致，同域跳转，剔除前缀，仅保留：/pages/login/index?redirect=%252F
    // if(path.split("/#/")[0] + "/" === pathname){
    if(path.startsWith(pathname)){
      const newPath = path.replace(pathname + "index.html#", '');
      console.log("同域跳转，剔除前缀：", newPath);
      return newPath;
    }
    // 包含二级路径，比如：/hbdhtml/#/login，非同域跳转，拼接完整地址，可能存在同域下部署多个项目，存在多个二级代理，但相互跳转交互的情况
    else {
      let otherProjectUrl = origin + "/" + path;
      console.log("其他项目跳转：", otherProjectUrl);
      if(otherProjectUrl.includes("?")){
        otherProjectUrl += "&appToken=" + getStorageSync('appToken');
      } else {
        otherProjectUrl += "?appToken=" + getStorageSync('appToken');
      }
      return otherProjectUrl
    }
    // #endif
  
    return path;
};

const isPercentEncoded = (str:string) => {
  try {
      // 尝试解码字符串
      const decodedStr = decodeURIComponent(str);
      // 重新编码解码后的字符串
      const reencodedStr = encodeURIComponent(decodedStr);
      // 如果重新编码后的字符串与原始字符串相同，则认为它是百分比编码的
      return str === reencodedStr;
  } catch (e) {
      // 如果解码失败，说明字符串不是有效的百分比编码
      return false;
  }
}

/**
 * 管理端可能配置了第三方h5跳转过渡页用户转换动态参数，如果该地址是uniApp项目内的跳转，无需经过此过渡页，直接跳转到目标页面即可
 * @param url 
 * @returns 真实跳转地址
 */
const replaceThirdH5Url = (url: string) => {
  if(!url){
    return url;
  }
  const thirdH5Base = "/pages/app-h5/third-h5?scene_url=";
  // 非过渡页跳转，直接返回
  if(!url.includes(thirdH5Base)){
    return url;
  }
  // 过渡页跳转，取出真实跳转地址
  let scene_url = url.replace(thirdH5Base, "");
  console.log("原始跳转地址: ", scene_url);
  // 解码
  scene_url = decodeURIComponent(scene_url);
  console.log("解码后的真实跳转地址: ", scene_url);
  // 解码后的真实跳转地址
  return scene_url;
}

/**
 * 获取用户信息，可用于判断用户是否已登录，登录的用户返回用户信息和token，未登录的用户返回null
 * @returns
 */
export const getUserInfo = () => {
  // let app_jw_token = getStorageSync("app_jw_token");
  // console.log("app_jw_token: ", app_jw_token);

  // 获取中读取的是密文
  let info = getStorageSync("hbd_mini_userinfo");
  // console.log("hbd_mini_userinfo: ", info);

  // let appToken = getStorageSync("appToken");
  // console.log("appToken: ", appToken);

  // 用户未登录
  // if (!app_jw_token || !info) {
  if (!info) {
    // 可能某些时候userinfo为空，此时同步清理下状态
    clearUserInfo();
    return null;
  }
  
  // 首次解密时
  if (!userInfo) {
    // 密文数据解密成明文
    /**
      isLogin	用户是否登录	0-未登录  1-登录
      userId	用户ID	用户登录则存在
      mobile	用户手机号	用户登录则存在
      userName	用户真实姓名	用户登录则存在
      nickName	用户昵称	用户登录则存在
      idCard	身份证号	用户登录则存在
      isRealname	是否实名认证(0:未认证;1:已认证)	用户登录则存在
      isFace	是否人脸认证(0:未认证;1:已认证)	用户登录则存在
      userType	用户类型:0:自然用户 1:管理员 2:商户	用户登录则存在
  */
    try {
      userInfo = aesDecrypt(info);
      userInfo = JSON.parse(userInfo);
    } catch (error) {
      console.error("解密用户信息失败: ", error);
      clearUserInfo();
      return null;
    }
  }
  console.log("getUserInfo userInfo: ", userInfo);

  // 未登录时，清空用户信息
  if (userInfo.isLogin == "0") {
    console.log("用户登录过期");
    clearUserInfo();
    // app_jw_token = null;
    return null;
  }

  // 已登录
  return {
    // authorization: app_jw_token,
    userInfo: userInfo,
  };
};

/**
 * 获取第三方平台appid
 * @returns 第三方平台appid
 */
export const getThirdPartyInitCode = async () => {
  let thirdInitCode = getStorageSync('thirdInitCode');
  // console.log("thirdInitCode: ", thirdInitCode);
  // 仅获取一次，后续直接使用本地缓存的code，仅当失效时才重新获取
  if(!thirdInitCode){
    thirdInitCode = await getInitCode();
    // console.log("fetch thirdInitCode: ", thirdInitCode);
    setStorageSync("thirdInitCode", thirdInitCode);
  }
  // const thirdPartyAppid = thirdInitCode.appid;
  // console.log("thirdPartyAppid: ", thirdPartyAppid);
  return thirdInitCode;
};

/**
 * 跳转App端登录
 * @returns 
 */
const appLogin = () => {
  return new Promise(async (resolve, reject) => {
    const thirdPartyInitCode = await getThirdPartyInitCode();
    console.log("appLogin thirdPartyInitCode: ", thirdPartyInitCode);
    hi.login({
      // @ts-ignore
      appId: thirdPartyInitCode.appid,  
      // 返回authCode调用后台接口换取真实的用户信息
      success: async (res: any) => {
        console.log("hi.login success: ", res);
        const { authCode: accessCode } = res.data;

        // 移除旧的token，更新新的token，否则登录状态还是无效的
        removeStorageSync("app_jw_token");

        const info = await loginApi.getUserInfoByAuthCode({
          accessCode: accessCode,
          appid: thirdPartyInitCode.appid
        });
        console.log("getUserInfoByAuthCode info: ", info);
  
        // setStorageSync("loginFail", false);

        // 存储用户信息
        setUserInfo(info);

        // 重试机制
        retryFailedRequest();
          
        resolve({
          userInfo: info
        });

      },
      fail: (res: any) => {
        console.log("hi.login fail: ", res);
        
        // 如果用户拒绝了一次授权，会走该回调，需要使用login方法重新登录拉取授权
        // setStorageSync("loginFail", true);

        reject(res);

      },
      complete: (res: any) => {}
    });
  });
}

/**
 * 重试失败的请求
 */
export const retryFailedRequest = async () => {
  return new Promise((resolve, reject) => {
    const failRequests = beans.getInterceptedRequests();
    // console.log("failRequests: ", failRequests);
    for(let req of failRequests){
      const {
        api, 
        data, 
        extra,
        resolve,
        reject,
        needLogin
      } = req;
      console.log("retryFailedRequest req: ", "，api = ", api, "，data = ", data, "，extra = ", extra, "，needLogin = ", needLogin);
      // 无需登录 或 需要登录且已登录
      if(!needLogin || (needLogin && getUserInfo())){
        // 重试失败的请求
        http(api, data, extra).then(resolve).catch(reject);
        // 移除已重试的请求
        beans.removeInterceptedRequest(req);
      }
    }
    // 清空请求, 无论成功或失败
    // beans.clearInterceptedRequests();
    resolve(null);
  });
};

/**
 * 检测是否登录过，未登录时会跳转登录页面，已登录时返回用户信息
 * 需要实时调用用户信息接口校验
 * @returns
 */
export const checkLogin = async () => {
  return new Promise(async (resolve, reject) => {
    const uniAppLogin = () => {
      const loginInfo = getUserInfo();
      console.log("uniAppLogin loginInfo: ", loginInfo);
      // 用户未登录
      if (!loginInfo) {
        console.log("checkLogin uniAppLogin 提示跳转登录页面");
        toLogin();
        return;
      }
      console.log("loginInfo: ", loginInfo);
      resolve(loginInfo);
    }

    // #ifdef MP
    console.log("checkLogin isInMP");
    uniAppLogin();
    // #endif

    // #ifdef H5
    if(isInHiApp()){
      const _login = () => {
        // clearToken();
        // clearUserInfo();
        appLogin().then(resolve).catch(reject);
      }

      const thirdPartyInitCode = await getThirdPartyInitCode();
      console.log("checkLogin isInHiApp thirdPartyInitCode: ", thirdPartyInitCode);
      // const loginFail = getStorageSync("loginFail");
      // console.log("loginFail: ", loginFail);
      // 登录失败，重新拉起登录
      // loginFail ? _login() : 
      hi.checkLogin({
        // @ts-ignore
        appId: thirdPartyInitCode.appid,  
        success: async (res: any) => {
          console.log("hi.checkLogin success: ", res.data, res);
          
          // 登录状态有效，还用原来的用户信息
          if(res.data.loginStatus == '1') {
            const user = getUserInfo();
            // 说明对于h5来说，实际登录未成功，因为缓存中无用户信息，正常来说，在login成功回调中已经换取用户信息并放到缓存中了
            if(!user){
              // 重新拉取登录吧，否则也没有用户信息可用啊
              _login();
              return;
            }
            resolve(user);
          }
          // 失效状态，重新拉起App登录，获取新的用户信息
          else {
            _login();
          }
        },
        fail: async (res: any) => {
          console.log("hi.checkLogin fail: ", res);
          appLogin().then(resolve).catch(reject);
        },
        complete: (res: any) => {}
      });

    }
    // web端、小程序webview内等h5环境
    else {
      console.log("checkLogin isInH5");
      uniAppLogin();
    }
    // #endif
  });
};


/**
 * 去登录页面
 * @returns
 */
export const toLogin = ({ tips } : { tips?: string | boolean | undefined } = { tips: true }) => {
  let { fullPath: targetUrl } = getCurrentRouter();

  if (targetUrl.indexOf("/pages/login/index") >= 0) {
    console.log("当前页面为登录页面，无需跳转");
    return;
  }
  
  // console.log("targetUrl: ", targetUrl);

  const uniAppLogin = () => {
    uni.navigateTo({
      url: "/pages/login/index?redirect=" + encodeURIComponent(targetUrl)
    });
  }

  const toPage = () => {
    // #ifdef MP
    // 跳转小程序登录页
    uniAppLogin();
    throwMsg("跳转小程序登录页");
    // #endif
    
    // #ifdef H5
    if(isInHiApp()){
      // app返回原生登录页
      // appLogin();
      appLogin().then(res=>{
        console.log("appLogin res: ", res);
        // 登录成功后，执行被拦截的逻辑
        const routes = getCurrentPages();
        const currRoute = routes[routes.length - 1];
        console.log("currRoute", currRoute);
        // 调用来源页的逻辑，一般是定义的是初始化的逻辑，请确保每个页面都定义该方法
        currRoute && currRoute.$vm && currRoute.$vm.__loadData__ && currRoute.$vm.__loadData__();
      }).catch(err=>{
        console.log("appLogin err: ", err);
      });
      return;
    }
    // web端、小程序webview内等h5环境
    else {
      // 跳转h5登录页
      uniAppLogin();
      throwMsg("跳转h5登录页");
      return;
    }
    // #endif
  }

  // 取消登录确认提示
  if(tips === false || tips === undefined){
    toPage();
    return;
  }

  // 提示弹窗确认登录，外界如果已经弹出过modal时，因为关闭动画的存在，造成实际关闭时机较晚，会导致这里的modal弹出来立刻被关闭，像是没弹出来一样。
  setTimeout(() => {
    showConfirm({
      // title: '温馨提示',
      content: '您还未登录，是否去登录？',
      confirmText: '去登录',
      cancelText: '否',
      confirmCallback: (res: any) => {
        toPage();
      },
      cancelCallback: (res: any) => {
        console.log("取消登录");
        // #ifdef H5
        // 调用app端清空用户信息方法
        // @ts-ignore
        // hi.tokenClear({
        //   complete: (res: any) => {
        //     console.log("hi.tokenClear complete: ", res);
        //   }
        // });
        // #endif
      }
    });
  }, 50);
  
};

/**
 *
 * @param url 待解析的url 示例：https://www.baidu.com?needLogin=true&userId=$userId&userName=$nickName&phone=$mobile&__hbd__encryptData__=true_name::$userName,phone::$mobile,id_no::$idCard,encryptMode::aes,encryptKey::1234567890123456,encryptIv::567890
 * url参数说明：needLogin=true 表示需要登录，未登录时会自动跳转登录页面，$开头的参数值是动态参数，跳转时会自动替换成对应的动态值（缓存中的用户信息），比如这里使用的id、nickname、phone均为动态参数、activityId为静态参数，$参数值对应的key为url跳转后接受的参数
 * @param userInfo 用户信息
 * @returns 处理后的url
 */
export const dynamicParamsToStaticParams = (
    { url }: { url: string } = { url: "" }
  ) => {
    console.log("dynamicParamsToStaticParams url: ", url);
    if (!url) {
      return url;
    }
  
    const userInfo = getUserInfo();
    // 用户信息字段：userId、mobile、loginName、userName、idCard、nickName、isLogin、isRealname、isFace
    const info = userInfo?.userInfo || {};
    // console.log("dynamicParamsToStaticParams info: ", info);
  
    // @ts-ignore
    let { query, path } = getUrlObj(url);
    // console.log("query: ", query, "path: ", path);
  
    // $开头的参数值替换成真实的值
    const replaceParams = (query: any) => {
      const temp = { ...query };
      Object.keys(query).forEach((key) => {
        const value = query[key];
        // 根据管理端配置的url参数添加对应的详细参数信息，$开头的参数值替换成真实的值，这里先从用户信息中获取，后续会扩大取值范围，甚至作为可配范围
        if (typeof value === 'string' && value.startsWith('$')) {
          temp[key] = info[value.slice(1)] || '';
        }
        // console.log("key: ", key, "value: ", temp[key]);
      });
      return temp;
    }
  
    delete query.needLogin;
    // console.log("删除needLogin后query: ", query);
  
    // 替换第一层的参数
    query = replaceParams(query);
    // console.log("替换第一层参数后query: ", JSON.stringify(query));
  
    // 处理加密层的参数
    if (query.__hbd__encryptData__) {
      let _data: any = {};
      const __hbd__encryptData__ = query.__hbd__encryptData__;
      delete query.__hbd__encryptData__;
      __hbd__encryptData__.split(",").forEach((_p: string) => {
        const [_k, _v] = _p.split("::");
        // 动态时间戳
        if (_v === "$timestamp") {
          // _data[_k] = new Date().getTime();
          _data[_k] = 0;
        } else {
          _data[_k] = _v;
        }
      });
      // console.log("__hbd__encryptData__ _data：", _data);
  
      const _mode = _data.encryptMode;
      delete _data.encryptMode;
      console.log("__hbd__encryptData__ _mode：", _mode);
  
      const __hbd__encryptData__replace = _data.__hbd__encryptData__replace;
      delete _data.__hbd__encryptData__replace;
      // console.log("__hbd__encryptData__replace: ", __hbd__encryptData__replace);
      // 密文对应的key替换成真实的key，比如：__hbd__encryptData__替换成__hbd__encryptData__replace的值sign
      const __hbd__encryptData__real = __hbd__encryptData__replace || "__hbd__encryptData__";
      // console.log("__hbd__encryptData__real: ", __hbd__encryptData__real);
  
      // 替换加密层的参数
      _data = replaceParams(_data);
      console.log("替换加密层参数后_data：", _data);
  
      const _key = _data.encryptKey || "1234567890123456";
      delete _data.encryptKey;
      console.log(`${__hbd__encryptData__real} _key：`, _key);
  
      // aes加密
      if (_mode === "aes") {
        const _iv = _data.encryptIv || "567890";
        delete _data.encryptIv;

        console.log(`${__hbd__encryptData__real} _iv：`, _iv);
        console.log(`${__hbd__encryptData__real}：`, _data);
  
        const {
          // @ts-ignore
          data: { encryptData: _secureData },
        } = hi.aesEncrypt({
          data: _data,
          key: _key,
          iv: _iv,
          success: (res) => {},
          fail: (err) => {},
          complete: (res) => {
            // console.log(`${__hbd__encryptData__real} encryptData：`, res);
          },
        });
        
        // @ts-ignore
        const { data: { hexData: _hexData } } = hi.base64ToHex({ base64Data: _secureData });

        query[__hbd__encryptData__real] = _hexData;
        
        console.log(
          `aes加密后query.${__hbd__encryptData__real}：`,
          query[__hbd__encryptData__real]
        );
  
        // 测试aes解密
        // @ts-ignore
        const { data: { base64Data: _base64 }} = hi.hexToBase64({ hexData: query[__hbd__encryptData__real] });

        const {
          // @ts-ignore
          data: { decryptedData: decrypted },
        } = hi.aesDecrypt({
          encryptData: _base64,
          key: _key,
          iv: _iv,
          success: (res) => {},
          fail: (err) => {},
          complete: (res) => {
            // console.log(`${__hbd__encryptData__real} decryptedData：`, res);
          },
        });
        const aes_decrypted = decrypted;
        console.log("aes解密后_decrypted：", JSON.parse(aes_decrypted));

      }
      // des加密
      else if (_mode === "des") {
        console.log(`${__hbd__encryptData__real}：`, _data);

        const {
          // @ts-ignore
          data: { encryptData: _secureData },
        } = hi.desEncrypt({
          data: _data,
          key: _key,
          success: (res) => {},
          fail: (err) => {},
          complete: (res) => {
            // console.log(`${__hbd__encryptData__real} encryptData：`, res);
          },
        });

        const _encodeUrl = encodeURIComponent(_secureData);
        
        query[__hbd__encryptData__real] = _encodeUrl;
        
        console.log(
          `des加密后query.${__hbd__encryptData__real}：`,
          query[__hbd__encryptData__real]
        );
  
        // 测试des解密
        const _decodeUrl = decodeURIComponent(query[__hbd__encryptData__real]);

        const {
          // @ts-ignore
          data: { utf8Data: decrypted },
        } = hi.desDecrypt({
          encryptData: _decodeUrl,
          key: _key,
          success: (res) => {},
          fail: (err) => {},
          complete: (res) => {
            // console.log(`${__hbd__encryptData__real} decryptedData：`, res);
          }
        });
        const des_decrypted = decrypted;
        console.log("des解密后_decrypted：", JSON.parse(des_decrypted));
        
      }
    }
  
    console.log("处理后的url：", query, path);
    if(query.title){
      query.title = encodeURIComponent(query.title);
    }
    const _params = Object.keys(query)
      .map((key) => key + "=" + query[key])
      .join("&");
    // console.log("_params: ", _params);
    if (_params) {
      url = path + "?" + _params;
    } else {
      url = path;
    }
    console.log("处理动态参数后的完整url：", url);
  
    return url;
};

/**
 * 指定返回级数或页面名称返回页面
 * @param delta 要返回的层级数，默认1层
 * @param pageName 要返回的页面名称
 * @param success 成功回调
 * @param fail 失败回调
 * @returns
 */
export const navigateBackTo = ({
  delta = 0,
  pageName = "",
  success = (res: any) => {},
  fail = (err: any) => {},
}) => {
  const routes = getCurrentPages();
  // 上个页面路由栈
  const prevRoute = routes.length > 1 ? routes[routes.length - 2] : null;
  // console.log("prevRoute", prevRoute);
  const lastPageInstance = prevRoute && prevRoute.$vm;
  const navigateBackSuccess = (res: any) => {
    // console.log("navigateBackTo success: ", res);
    // 可能为空
    success && success(lastPageInstance);
  };

  // 指定返回层级
  if (delta) {
    // 如果已经是第一个路由栈页面时，点击回退会刷新当前页面，估计是uni-app的bug
    const currentPagesLength = getCurrentPages().length;
    // 只有一个页面了，没办法继续回退了
    if (currentPagesLength <= 1) {
      toFirstPage({
        success: navigateBackSuccess,
        fail,
      });
    } 
    // 正常回退
    else {
      uni.navigateBack({
        delta: delta,
        success: (res) => {
          navigateBackSuccess && navigateBackSuccess(res);
        },
        fail: (err) => {
          console.error(err);
          fail && fail(err);
        }
      });
    }
    return;
  }
  if (!pageName) {
    throwMsg("页面名称不能为空");
    return;
  }
  // 指定页面返回
  const match = getPageFromRouter(pageName);
  console.log("match: ", match);
  // 页面不存在时
  if (!match) {
    showConfirm({
      content: "页面不存在，是否返回首页？",
      confirmCallback: () => {
        toFirstPage({
          success: navigateBackSuccess,
          fail
        });
      }
    });
    return;
  }
  // 页面存在，返回指定页面
  uni.navigateBack({
    delta: match?.delta,
    complete: (res) => {
      navigateBackSuccess && navigateBackSuccess(res);
    },
    fail: (err) => {
      console.error(err);
      fail && fail(err);
    },
  });
};

/**
 * 执行上级页面方法并回退
 * @param delta 要返回的层级数，默认1层
 * @param pagePath 要返回的页面路径
 * @param methodName 要执行的方法名
 * @param params 方法参数
 */
export const navigateBackWithMethodExecution = ({
  delta = 1,
  pagePath = "",
  methodName = "",
  params = {}
}) => {
  // 执行上级页面方法
  execPrePageMethod({
    delta,
    pagePath,
    methodName,
    params
  });
  // 回退
  navigateBackTo({
    delta,
    pageName: pagePath
  });
}

/**
 * confirm弹窗，建议统一调用，方便后续全局调整
 */
export const showConfirm = ({
  title,
  content,
  htmlString,
  confirmText,
  cancelText ,
  showCancel,
  confirmCallback,
  cancelCallback,
} = {
  title: '温馨提示',
  content: '默认内容',
  htmlString: '',
  confirmText: '确定',
  cancelText: '取消',
  showCancel: true,
  confirmCallback: () => {},
  cancelCallback: () => {},
} as any) => {
  beans.getGlobalThis().$refs.modal.open({
    title,
    content,
    htmlString,
    confirmText,
    cancelText,
    showCancel,
    confirmCallback,
    cancelCallback,
  });
}

/**
 * alert弹窗，建议统一调用，方便后续全局调整
 */
export const showAlert = ({
  title,
  content,
  htmlString,
  confirmText,
  confirmCallback
} = {
  title: '温馨提示',
  content: '默认内容',
  htmlString: '',
  confirmText: '确定',
  confirmCallback: () => {}
} as any) => {
  beans.getGlobalThis().$refs.modal.open({
    title,
    content,
    htmlString,
    confirmText,
    showCancel: false,
    confirmCallback
  });
}

/**
 * toast弹窗，建议统一调用，方便后续全局调整
 */
export const showToast = ({
  title,
  duration,
} = {
  title: '',
  duration: 2000
} as any) => {
  beans.getGlobalThis().$refs.modal.open({
    type: 'toast',
    title,
    duration
  });
}

/**
 * 网络图片转base64字符串
 * @param url 网络图片url
 * @returns 
 */
export const convertImageUrlToBase64 = (url: string) => {
  return new Promise((resolve, reject) => {
    console.log("convertImageUrlToBase64 url: ", url);
    uni.request({
      url,
      method: 'GET',
      // 以二进制流的形式获取数据
      responseType: 'arraybuffer', 
      success: (res: any) => {
        console.log("convertImageUrlToBase64 res: ", res);
        if (res.statusCode === 200) {
          // 转换为Base64
          const base64 = uni.arrayBufferToBase64(res.data);
          // console.log("convertImageUrlToBase64 base64: ", base64);
          // 根据需求修改MIME类型
          const mimeType = 'image/jpeg'; 
          resolve(`data:${mimeType};base64,${base64}`);
        } else {
          reject(new Error('网络图片加载失败'));
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: (res) => {
        console.log("convertImageUrlToBase64 complete: ", res);
      }
    });
  });
}

/**
 * 获取当前经纬度，如果获取失败，则返回默认经纬度（大連市市人民政府坐标）
 * @param success 成功回调
 * @param permission 授权引导弹窗，取值：showModal-弹窗提示授权、openSetting-直接跳转设置页
 */
export const getLocation = (success: Function, permission: string) => {
  console.log("getLocation 进入方法");

  const [lng, lat] = __VITE_BAODING_CENTER_COORDS__.split(',');
  // const { lat: baiduLat, lng: baiduLng } = wgs84tobd09(Number(lat), Number(lng));
  const result = wgs84tobd09([{ lat: Number(lat), lng: Number(lng) }]);
  const [ { lat: baiduLat, lng: baiduLng } ] = result;
  console.log('getLocation default', { baiduLat, baiduLng });

  // #ifdef MP-WEIXIN
  const openSetting = () => {
    uni.openSetting({
      success: (res) => {
        console.log("uni.openSetting complete", res);
        const systemSetting = uni.getSystemSetting();
        // 检测定位权限是否开启
        if(systemSetting.locationEnabled){
          getLocation(success, permission);
        } 
        else {
          // console.log("定位权限未开启");
          uni.showToast({
            icon: 'none',
            mask: true,
            title: '定位权限未开启',
          });
        }
      }
    })
  }
  uni.getLocation({
    // type: 'wgs84',
    type: 'gcj02',
    success: (res) => {
      console.log("uni.getLocation success",res)
      // const { lat, lng } = wgs84tobd09(res.latitude, res.longitude );
      // const result = wgs84tobd09([{ lat: res.latitude, lng: res.longitude }]);
      // const [ { lat, lng } ] = result;
      const lat = res.latitude;
      const lng = res.longitude;
      console.log('getLocation success', { lat, lng });
      
      success && success({
        lng: lng,
        lat: lat
      });

    },
    fail: (err) => {
      console.error("uni.getLocation fail",err);
      
      success && success({
        lng: baiduLng,
        lat: baiduLat,
        // 未开启定位时，使用默认坐标，该字段为true
        locationFail: true
      });
      let isWxReject = "getLocation:fail auth deny" == err.errMsg;
      let isPhoneReject = "getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF" == err.errMsg || "getLocation:fail system permission denied" == err.errMsg;
      if((permission === 'showModal' || !permission) && (isWxReject || isPhoneReject)){
        uni.showModal({
          title: '温馨提示',
          content: isWxReject ? "定位未授权，请在位置信息中开启定位权限" : "定位失败，请在手机设置中开启定位权限",
          success: (res: any) => {
            console.log("uni.showModal confirmCallback",res);
            if(res.confirm && isWxReject){
              openSetting();
            }
          }
        })
      }
      else if(permission === 'openSetting' && (isWxReject || isPhoneReject)){
        if (isWxReject) {
          openSetting();
        } else {
          uni.showModal({
            title: '温馨提示',
            content: "定位失败，请在手机设置中开启定位权限",
            success: (res: any) => {
              console.log("uni.showModal confirmCallback",res);
              if(res.confirm){
                openSetting();
              }
            }
          })
        }
      }
    },
    complete: (res) => {
      trackReport.trackCustom("获取位置权限");
      
      console.log("uni.getLocation complete", res);
    },
  });
  // #endif

  // #ifdef H5
  const name = beans.getGlobalThis()?.options?.title || getCurrentRouter()?.pageConf?.style?.navigationBarTitleText;
  console.log("getLocation name: ", name);
  // let hasLocated = false;
  // 临时解决ios app 2.0.0版本因获取定位api无回调造成的闪退问题，下个版本修复后可删除
  const hasLocatedTimer = setTimeout(() => {
    // // 仅当定位一直无响应时才触发后续的逻辑
    // if(hasLocated){
    //   return;
    // }
    console.log('定位失败，可能是ios app 2.0.0版本因获取定位api无回调，使用默认的经纬度');

    success && success({
      lng: baiduLng,
      lat: baiduLat,
      // 未开启定位时，使用默认坐标，该字段为true
      locationFail: true
    });

  }, 8000);
  // @ts-ignore
  hi.getLatLng({
    // name: name,
    name: "导航",
    // 成功，可选参数
    success: function (res) {
      console.log("hi.getLatLng success",res );
      // errCode	String	是	错误码，成功时返回 1
      // errMsg	String	是	错误信息，成功时返回 '成功'
      // data	String	是	结果 { latitude: 'xxx.xxx', longitude: 'xxx.xxx' }
      const { latitude: lat, longitude: lng, adName: _addrName } = res.data;
      console.log('getLocation success', { lat, lng, _addrName });

      success && success({
        lng: lng,
        lat: lat,
        _addrName: _addrName,
      });
    },
    // 失败，可选参数
    fail: function (res) {
      console.log("hi.getLatLng fail",res);

      success && success({
        lng: baiduLng,
        lat: baiduLat,
        // 未开启定位时，使用默认坐标，该字段为true
        locationFail: true
      });

      // errCode	String	是	错误码，失败时返回 0
      // errMsg	String	是	错误信息，0：定位开关未打开
      if(res.errMsg == "0"){
        console.log("定位开关未打开");
      }
    },
    // 无论成功、失败都会回调，可选参数
    complete: function (res) {
      clearTimeout(hasLocatedTimer);
      console.log("hi.getLatLng complete",res, 'complete');
      // 成功
      if (res.errCode === 1) {

      }
      // 失败
      else {

      }
    }
  });
  // #endif
}

/**
 * 获取默认的经纬度
 * @returns 经纬度对象
 */
export const getDefaultLatLng = () => {
  const [lng, lat] = __VITE_BAODING_CENTER_COORDS__.split(',');
  // const { lat: baiduLat, lng: baiduLng } = wgs84tobd09(Number(lat), Number(lng));
  const result = wgs84tobd09([{ lat: Number(lat), lng: Number(lng) }]);
  const [ { lat: baiduLat, lng: baiduLng } ] = result;
  return {
    lng: baiduLng,
    lat: baiduLat
  }
}

/**
 * 打开系统设置页面，仅小程序端有效，App无效
 * @returns 
 */
export const openSetting = (success: Function, permission: string) => {
  // #ifdef MP
  uni.openSetting({
    success: (res) => {
      console.log("uni.openSetting complete", res);
      const systemSetting = uni.getSystemSetting();
      // 检测定位权限是否开启
      if(systemSetting.locationEnabled){
        getLocation(success, permission);
      } else {
        // console.log("定位权限未开启");
        uni.showToast({
          icon: 'none',
          mask: true,
          title: '定位权限未开启',
        });
      }
    }
  })
  // #endif
}

/**
 * 获取定位是否授权，仅小程序端有效，App无效
 * @returns 
 */
export const getSetting = (callback: Function) => {
  // #ifdef MP
  uni.getSetting({
    success: (res) => {
      console.log("uni.getSetting complete", res);
      callback && callback(res.authSetting['scope.userLocation']);      
    },
    fail: () => {
      callback && callback(false);
    }
  })
  // #endif
  // #ifdef H5
  callback && callback(false);
  // #endif
}

/**
 * 判断token是否有效
 * @returns 
 */
export const isTokenValid = () => {
  const app_jw_token = getStorageSync('app_jw_token');
  return !!app_jw_token;
}

/**
 * 
 * @param url 下载的文件地址
 * @param fileName 下载的文件名
 */
export const downloadFile = async ({url, fileName}: { url: string, fileName: string }) => {
  console.log("downloadFile url: ", url);
  console.log("downloadFile fileName: ", fileName);
  // #ifdef MP
  uni.showToast({
    title: '小程序端不支持下载，请App端查看',
    icon: 'none',
    mask: true,
  });
  // uni.downloadFile({
  //   url: url,//下载地址接口返回
  //   // responseType: 'buffer', //返回格式为arraybuffer
  //   method: 'GET',
  //   success: (data) => {
  //     console.log(data, "data");
  //     if (data.statusCode === 200) {
  //       //文件保存到本地
  //       uni.saveFile({
  //         tempFilePath: data.tempFilePath, //临时路径
  //         success: function(res) {
  //           uni.showToast({
  //             icon: 'none',
  //             mask: true,
  //             title: '文件已保存：' + res.savedFilePath, //保存路径
  //             duration: 3000,
  //           });
  //           setTimeout(() => {
  //             //打开文档查看
  //             uni.openDocument({
  //                 filePath: res.savedFilePath,
  //                 success: function(res) {
  //                   // console.log('打开文档成功');
  //                 }
  //             });
  //           }, 3000)
  //         }
  //       });
  //     }
  //   },
  //   fail: (err) => {
  //       console.log(err);
  //       uni.showToast({
  //           icon: 'none',
  //           mask: true,
  //           title: '失败请重新下载',
  //       });
  //   },
  // });
  // #endif
  // #ifdef H5
  const name = fileName || url.split('/').pop();
  console.log("downloadFile name: ", name);
  // 文件必须有扩展名，比如：.pdf,.doc,.docx
  if(!name || !name.split('.')[1]){
    uni.showToast({
      icon: 'none',
      mask: true,
      title: '文件扩展名不能为空',
    });
    return;
  }

  // @ts-ignore
  hi.downloadFile({
    url: url,
    name: name,
    complete: (res) => {
      console.log("hi.downloadFile complete", res);
    }
  });

  // // 使用 a 标签下载文件
  // const downloadLink = document.createElement('a');
  // // 文件下载地址
  // downloadLink.href = url; 
  // // 设置下载的文件名
  // downloadLink.download = fileName || url.split('/').pop() || 'download';
  // document.body.appendChild(downloadLink);
  // // 触发下载
  // downloadLink.click(); 
  // // 移除 a 标签
  // document.body.removeChild(downloadLink); 

  // app下载报错，暂时不使用
  // const response = await fetch(url);
  // const blob = await response.blob();
  // const link = document.createElement('a');
  // link.href = URL.createObjectURL(blob);
  // link.download = fileName || url.split('/').pop() || 'download';
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
    // #endif
}

/**
 * 富文本html字符串img相对路径转为完整的mino地址
 * @param html html字符串
 * @returns 处理后的html字符串
 */
export const addMinioPrefixToImgSrc = (html: string, maxWidth: string | null = null) => {
  // console.log("addMinioPrefixToImgSrc html: ", html);

  if(!html){
    html = "";
  }

  const prefix = __VITE_SERVER_BASEURL__ + "/minio";

  // 正则表达式匹配<img>标签和src属性
  const pattern = /(<img\s+[^>]*src=")([^"]*)(")/g;

  // 替换为带前缀的src地址
  let htmlstr = html.replace(pattern, (match, p1, p2, p3) => {
    // console.log("match: ", match);
    // console.log("p1: ", p1);
    // console.log("p2: ", p2);
    // console.log("p3: ", p3);
    if(p2.startsWith("http") || p2.startsWith("https")) {
      return match;
    }
    // console.log("addMinioPrefixToImgSrc res: ", `${p1}${prefix}${p2}${p3}`);
    return `${p1}${prefix}${p2}${p3}`;
  });
  console.log('-------htmlstr1---' + htmlstr)
  htmlstr = maxWidth ? addMaxWidthToImages(htmlstr, maxWidth) : addMaxWidthToImages(htmlstr);
  htmlstr = addLineFeedToA(htmlstr);
  htmlstr = addInlineFlexToA(htmlstr);
  console.log('-------htmlstr2---' + htmlstr)
  return htmlstr;
}
export const addMaxWidthToImages = (htmlString: string, value: string = '100%') => {
  // 定义正则表达式以匹配<img>标签及其属性
  const imgRegex = /<img\s+([^>]+)>/gi;
  // 定义正则表达式以检查style属性中的max-width
  const maxWidthTest = /\bmax-width:\s*[\d.]+/;

  // 替换函数用于处理每个匹配到的<img>标签
  return htmlString.replace(imgRegex, (match, p1) => {
      // 检查是否已有style属性
      const styleMatch = p1.match(/\bstyle="([^"]*)"/i);
      if (styleMatch && styleMatch.length > 0) {
          // 如果存在style属性，检查是否已包含max-width
          if (!maxWidthTest.test(styleMatch[0])) {
              // 添加max-width: 100%; 到现有的style属性中
              let result = match.replace(/style="([^"]*)"/i, `style="max-width: ${value}; $1"`);
              return result;
          }
      } else {
          // 如果没有style属性，则添加一个新的style属性
          let result = match.replace(/(<img\s+)([^>]*?)(\/?>)/, `$1$2 style="max-width: ${value};"$3`);
          return result;
      }
      // 已有max-width，则不作任何更改
      return match;
  });
}

/**
 * 富文本html字符串a标签，换行
 * @param html html字符串
 * @returns 处理后的html字符串
 */
export const addLineFeedToA = (htmlString: string) => {
  // 定义正则表达式以匹配<img>标签及其属性
  const aRegex = /<a\s*([^>]*)>(.*?)<\/a>/gi;
  // 定义正则表达式以检查style属性中的max-width
  const wordBreakTest = /\bword-break:\s*/;
  const orverflowWrapTest = /\boverflow-wrap:\s*/;
  const whiteSpaceTest = /\bwhite-space:\s*/;
  
  // 替换函数用于处理每个匹配到的<img>标签
  return htmlString.replace(aRegex, (match, p1) => {
    console.log('111 ',match);
    console.log('222 ',p1);
      // 检查是否已有style属性
      const styleMatch = p1.match(/\bstyle="([^"]*)"/i);
      console.log("333 ", styleMatch);
      if (styleMatch && styleMatch.length > 0) {
          // 如果存在style属性，检查是否已包含
          if (!wordBreakTest.test(styleMatch[0]) && !orverflowWrapTest.test(styleMatch[0]) && !whiteSpaceTest.test(styleMatch[0])) {
              // 添加; 到现有的style属性中
              let result = match.replace(/style="([^"]*)"/i, `style="word-break: break-all;overflow-wrap: break-word;white-space: normal; $1"`);
              return result;
          }
      } else {
          // 如果没有style属性，则添加一个新的style属性
          let result = match.replace(/(<a\s*)([^>]*?)(>.*?<\/a>)/, `$1$2 style="word-break: break-all;overflow-wrap: break-word;white-space: normal;"$3`);
          return result;
      }
      // 已有max-width，则不作任何更改
      return match;
  });
}

/**
 * 富文本html字符串，改变外层p标签为a标签
 * @param html html字符串
 * @returns 处理后的html字符串
 */
export const changePtoSpan = (htmlString: string) => {
  const pRegex = /^<p(\s*)([^>]*)>(.*?)<\/p>$/gi;
  let result = htmlString.replace(pRegex, `<span$1$2>$3</span>`);
  console.log('-----changePtoSpan---', result);
  return result
}
// display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     text-overflow: ellipsis;

/**
 * 富文本html字符串a标签，点击事件的方法
 * @param e 有链接
 */
export const hrefJump = (e:any) => {
  const path = e.href;
  const httpTest = /^https?:\/\//;
  if (path && path.length >0 && httpTest.test(path)) {
    // #ifdef H5
    let data = {
      // url: `/pages/h5/h5?needLogin=flase&url=${path}`
      url: `${path}`
    };
    jumpPage(data);
    // #endif
    // #ifdef MP
    uni.setClipboardData({
      data: path,
      success: () =>
        uni.showToast({
          title: '链接已复制'
        })
    })
    // #endif
  }
}


/**
 * 预览文件
 * @param e 有链接
 */
export const previewFile = (url:string, name: string) => {
  const path = url;
  const httpTest = /^https?:\/\//;
  if (path && path.length >0 && httpTest.test(path)) {
    // #ifdef H5
    if(isInHiApp()){
      hi.downloadFile({
        url: path,
        name: name,
        success: (res) => {},
        fail: (err) => {},
        complete: (res) => {
          console.log("hi.downloadFile complete", res);
        }
      });
    }
    // #endif
    // #ifdef MP
    uni.setClipboardData({
      data: path,
      success: () =>
        uni.showToast({
          title: '链接已复制'
        })
    })
    // #endif
  }
}

export const addVerticalAlignToImages = (htmlString: string) => {
  // 定义正则表达式以匹配<img>标签及其属性
  const imgRegex = /<img\s+([^>]+)>/gi;
  // 定义正则表达式以检查style属性中的vertical-align
  const verticalAlignTest = /\bvertical-align:\s*[\d.]+/;
  
  // 替换函数用于处理每个匹配到的<img>标签
  return htmlString.replace(imgRegex, (match, p1) => {
      // 检查是否已有style属性
      const styleMatch = p1.match(/\bstyle="([^"]*)"/i);
      if (styleMatch && styleMatch.length > 0) {
          // 如果存在style属性，检查是否已包含vertical-align
          if (!verticalAlignTest.test(styleMatch[0])) {
              // 添加vertical-align: top; 到现有的style属性中
              let result = match.replace(/style="([^"]*)"/i, `style="vertical-align: top; $1"`);
              return result;
          }
      } else {
          // 如果没有style属性，则添加一个新的style属性
          let result = match.replace(/(<img\s+)([^>]*?)(\/?>)/, `$1$2 style="vertical-align: top;"$3`);
          return result;
      }
      // 已有vertical-align，则不作任何更改
      return match;
  });
}

/**
 * 富文本html字符串a标签，修复a标签换行的问题
 * @param html html字符串
 * @returns 处理后的html字符串
 */
export const addInlineFlexToA = (htmlString: string) => {
  // 定义正则表达式以匹配<img>标签及其属性
  const aRegex = /<a\s*([^<>]*)>(.*?)<\/a>/gi;
  // 定义正则表达式以检查style属性中的display
  const displayTest = /\bdisplay:\s*/;
  
  // 替换函数用于处理每个匹配到的<img>标签
  return htmlString.replace(aRegex, (match, p1, p2) => {
    if (p2 && p2.length > 0) {
        // 检查是否已有style属性
        const styleMatch = p1.match(/\bstyle="([^"]*)"/i);
        console.log("333 ", styleMatch);
        if (styleMatch && styleMatch.length > 0) {
            // 如果存在style属性，检查是否已包含
            if (!displayTest.test(styleMatch[0])) {
                // 添加; 到现有的style属性中
                let result = match.replace(/style="([^"]*)"/i, `style="display: inline-flex; $1"`);
                return result;
            }
        } else {
            // 如果没有style属性，则添加一个新的style属性
            let result = match.replace(/(<a\s*)([^>]*?)(>.*?<\/a>)/, `$1$2 style="display: inline-flex;"$3`);
            return result;
        }
        // 已有max-width，则不作任何更改
    }
      return match;
  });
}

/**
 * 转换一个距离（不带单位，默认是m），转换后是有单位的
 */
export const convertDistance = (str: string) => {
  str = str || "";
  // 使用正则表达式匹配数字后跟"米"的模式，并替换为相应的格式化值
  return str.replace(/(\d+(\.\d+)?)/g, function(match, number) {
      const distance = parseFloat(number);
      let result;
      
      if (distance >= 1000) {
          // 当距离大于等于1000米时，转换为千米并保留1位小数
          result = (distance / 1000.0).toFixed(1) + "km";
      } else {
          // 当距离小于1000米时，保留整数部分，单位为米
          result = Math.floor(distance) + "m";
      }
      
      return result;
  });
}
/**
 * 如果是小数，则保留1位小数
 */
export const keepOneDecimalPlace = (value: any) => {
  value = value || 0;
  // 首先尝试将输入值转换为浮点数
  let number = parseFloat(value);
  
  // 检查转换是否成功（即结果不是NaN）
  if (!isNaN(number)) {
      // 使用 toFixed 方法保留一位小数
      return number.toFixed(1);
  } else {
      // 如果转换失败，返回原始值或者抛出错误
      console.error("无法将提供的值转换为数字。");
      return value;
  }
}

/**
 * px 转换为 rpx
 * @param px px
 * @returns 
 */
export const px2rpx = (px: number) => {
  let scale = uni.upx2px(100) / 100;
  return px / scale;
}

/**
 * 拼接url地址及额外参数
 * @param url url地址
 * @param queryParams 额外参数 如：a=1&b=2
 * @returns 
 */
export const linkUrlWithParams = (url: string, queryParams: any) => {
  console.log("linkUrlWithParams url: ", url, "，queryParams: ", queryParams);
  const { query, path } = getUrlObj(url);
  let _params = Object.keys(query).map((key) => key + "=" + query[key]).join("&") || "";
  // console.log("_params: ", _params);
  if (_params) {
    _params += "&" + queryParams;
  } else {
    _params = queryParams;
  }
  console.log("处理动态参数后的完整_params：", _params);
  return path + "?" + _params;
}

/**
 * 键盘输入，保留数字
 * @param value 输入的值
 * @returns 
 */
export const handleNumberInput = (value: any) => {
  console.log("值1 " + value);
  let numStr = '';
  const isKong = value === undefined || value === null || (Object.prototype.toString.call(value) == '[object String]' && value.length === 0);
  if (!isKong ) { // 数字类型，或者有值
    numStr = (value || 0).toString()
  }
  // 过滤掉非数字
  const matches = numStr.match(/[-0-9.,]+/g);
  if (matches) {
    // 去除千位分隔符并合并结果
    numStr = matches.join('').replace(/,/g, '');
  }
  // 去掉整数部分 多余的0
  let dotIndex = numStr.indexOf('.');
  if (dotIndex == -1) { // 不存在
    const oldLength = numStr.length;
    numStr = numStr.replace(/^0+/, '');
    if (numStr.length === 0 && oldLength > 0) { numStr = '0' };
  } else {
    const sArr = numStr.split(".");
    let zStr = sArr[0];
    let xStr = sArr[1];
    zStr = zStr.replace(/^0+/, '');
    if (zStr.length === 0) { zStr = '0' }
    numStr = zStr + '.' + xStr;
  }
  // 小数位数，超过两位，直接截断
  dotIndex = numStr.indexOf('.');
  dotIndex = dotIndex === -1 ? 0 : numStr.length - dotIndex - 1;
  if (dotIndex > 2) {
    const number = Number(numStr);            
    const factor = Math.pow(10, 2);  // 如 10、100、1000
    const cutNum = Math.trunc(number * factor) / factor;
    console.log("超过2位 cutNum " + cutNum);
    // const cutStr = (cutNum || 0).toString();
    const cutStr = (cutNum || 0).toFixed(2);
    console.log("超过2位 cutStr " + cutStr);
    if (number != cutNum) {
      numStr = cutStr;
    } else { // 小数位数，超过两位，直接截取字符串
      console.log("超过2位 numStr1 " + numStr);
      numStr = numStr.substring(0, numStr.length - (dotIndex - 2));
      console.log("超过2位 numStr2 " + numStr);
    }
  }
  console.log("值2 " + numStr);
  return numStr;
}

/**
 * 格式化多段工作时间显示
 * @param workHours 工作时间字符串，支持多种格式：
 * 1. 单段时间：'09:00,18:00' -> '09:00-18:00'
 * 2. 多段时间逗号分隔：'09:00-12:00,14:00-18:00' -> '09:00-12:00, 14:00-18:00'
 * 3. 多段时间分号分隔：'09:00,12:00;14:00,18:00' -> '09:00-12:00, 14:00-18:00'
 * 4. 带次日标识：'09:00,18:00,1' -> '09:00-18:00(次日)'
 * @param options 格式化选项
 * @param options.separator 时间段之间的分隔符，默认为', '
 * @param options.showNextDay 是否显示次日标识，默认为true
 * @param options.nextDayText 次日标识文本，默认为'(次日)'
 * @returns 格式化后的工作时间字符串
 */
export const formatWorkHours = (
  workHours: string, 
  options: {
    separator?: string;
    showNextDay?: boolean;
    nextDayText?: string;
  } = {}
): string => {
  if (!workHours || typeof workHours !== 'string') {
    return '';
  }

  const {
    separator = ', ',
    showNextDay = true,
    nextDayText = '(次日)'
  } = options;

  // 处理分号分隔的多段时间（如：'09:00,12:00;14:00,18:00'）
  if (workHours.includes(';')) {
    const segments = workHours.split(';').filter(segment => segment.trim());
    const formattedSegments: string[] = segments.map(segment => {
      return formatWorkHours(segment.trim(), options);
    });
    return formattedSegments.join(separator);
  }

  // 处理逗号分隔的时间段
  const parts = workHours.split(',').filter(part => part.trim());
  
  if (parts.length === 0) {
    return '';
  }

  // 如果只有两个部分，可能是单段时间（开始时间,结束时间）
  if (parts.length === 2) {
    const [startTime, endTime] = parts;
    let result = `${startTime.trim()}-${endTime.trim()}`;
    
    // 检查是否有次日标识（第三个参数为1表示次日）
    if (showNextDay && endTime.trim() === '1') {
      result = `${startTime.trim()}-${endTime.trim()}${nextDayText}`;
    }
    
    return result;
  }

  // 如果有多于两个部分，可能是多段时间
  if (parts.length > 2) {
    const segments: string[] = [];
    
    // 每两个部分组成一个时间段
    for (let i = 0; i < parts.length - 1; i += 2) {
      const startTime = parts[i].trim();
      const endTime = parts[i + 1].trim();
      
      if (startTime && endTime) {
        let segment = `${startTime}-${endTime}`;
        
        // 检查下一个部分是否为次日标识
        if (i + 2 < parts.length && parts[i + 2].trim() === '1' && showNextDay) {
          segment += nextDayText;
          i++; // 跳过次日标识
        }
        
        segments.push(segment);
      }
    }
    
    return segments.join(separator);
  }

  // 如果只有一个部分，直接返回
  return parts[0].trim();
};

/**
 * 解析工作时间字符串为结构化数据
 * @param workHours 工作时间字符串
 * @returns 解析后的工作时间数组
 */
export const parseWorkHours = (workHours: string) => {
  if (!workHours || typeof workHours !== 'string') {
    return [];
  }

  const result: Array<{
    startTime: string;
    endTime: string;
    isNextDay: boolean;
  }> = [];

  // 处理分号分隔的多段时间
  if (workHours.includes(';')) {
    const segments = workHours.split(';').filter(segment => segment.trim());
    segments.forEach(segment => {
      const parsed = parseWorkHours(segment.trim());
      result.push(...parsed);
    });
    return result;
  }

  // 处理逗号分隔的时间段
  const parts = workHours.split(',').filter(part => part.trim());
  
  if (parts.length === 0) {
    return result;
  }

  // 如果只有两个部分，可能是单段时间
  if (parts.length === 2) {
    const [startTime, endTime] = parts;
    const isNextDay = endTime.trim() === '1';
    
    result.push({
      startTime: startTime.trim(),
      endTime: isNextDay ? '' : endTime.trim(),
      isNextDay
    });
    
    return result;
  }

  // 如果有多于两个部分，可能是多段时间
  if (parts.length > 2) {
    for (let i = 0; i < parts.length - 1; i += 2) {
      const startTime = parts[i].trim();
      const endTime = parts[i + 1].trim();
      
      if (startTime && endTime) {
        let isNextDay = false;
        
        // 检查下一个部分是否为次日标识
        if (i + 2 < parts.length && parts[i + 2].trim() === '1') {
          isNextDay = true;
          i++; // 跳过次日标识
        }
        
        result.push({
          startTime,
          endTime,
          isNextDay
        });
      }
    }
  }

  return result;
};

/**
 * 分享埋点
 * @param 无
 * @returns 无
 */
let shareTrackTimer: any = null
export const shareTrack = (params: any) => {
  if(shareTrackTimer && new Date().getTime() - shareTrackTimer < 2000){
    return
  }
  shareTrackTimer = new Date().getTime()
  const {title, content} = params
  http('/abpapp/UserSharingController/shareRecord.do',{
    title: title,
    content: content,
  }, {mask: false,catchError: true}).catch(() => {
    
  });
}

/** 
 * 小程序分享生命周期方法封装  分享时间埋点
 * @param {object} shareParams   分享参数 
 * @returns {object} shareParams   原分享参数 
 */
export const onShareAppMessage = (shareParams: any) => {
  console.log("onShareAppMessage", shareParams)
  shareTrack({
    title:shareParams.title?shareParams.title:"小程序分享",
    content: shareParams.content?shareParams.content:"小程序分享内容",
  })
  return shareParams;
}
export const isCurrentYear = (beginTime: string, endTime: string) => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let currentDay = year + "-" + padZero(month) + "-" + padZero(day);

  let dataShow
  if (beginTime.substring(0, 4) === endTime.substring(0, 4)) {//不跨年
    if (beginTime.substring(0, 4) === year.toString()) {//当年
      if ((beginTime.substring(0, 10) === endTime.substring(0, 10)) && (currentDay === beginTime.substring(0, 10))) {//当天
        dataShow = beginTime.substring(5, 10) + '(' + getWeekday(beginTime) + ')' +
          beginTime.substring(10, beginTime.length - 3) + ' ~' + endTime.substring(10, endTime.length - 3)
      } else if (beginTime.substring(0, 10) !== endTime.substring(0, 10)) {//跨天
        dataShow = beginTime.substring(0, 10) + '(' + getWeekday(beginTime) + ')' +
          beginTime.substring(10, beginTime.length - 3) + ' ~ ' + endTime.substring(5, endTime.length - 3)
      } else if(beginTime.substring(0, 10) === endTime.substring(0, 10)) {//不跨天 但不是当天
        dataShow = beginTime.substring(5, 10) + '(' + getWeekday(beginTime) + ')' +
          beginTime.substring(10, beginTime.length - 3) + ' ~ ' + endTime.substring(5, endTime.length - 3)
      }
    } else {
      dataShow = beginTime.substring(0, 10) + '(' + getWeekday(beginTime) + ')' +
        beginTime.substring(10, beginTime.length - 3) + '~' + endTime.substring(0, endTime.length - 3)
    }

  } else {
    dataShow = beginTime.substring(0, 10) + '(' + getWeekday(beginTime) + ')' +
      beginTime.substring(10, beginTime.length - 3) + '~' + endTime.substring(0, endTime.length - 3)
  }

  dataShow = dataShow?.replace(/-/g, '/')


  return dataShow;

};
export const padZero = (num: number) => {
  return num.toString().padStart(2, '0');
}
export const getWeekday = (dateStr: string) => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  const weekday = date.getDay();
  return weekDays[weekday];
};
