/**
 * 此文件定义页面中跳转某些自定义页面的函数，方便维护
 */
import { selAppRobotUrl } from "@/api/home";
import { getUserInfo, jumpPage, toLogin } from './utils';
// import { isInHiApp } from "@/utils/bridge";
/**
 * 跳转智能客服（需要登录）
 */
export const toIntelligentService = () => {
  const loginInfo = getUserInfo();
  // 用户未登录
  if (!loginInfo) {
    toLogin();
    return;
  }
  // @ts-ignore
  // userId、mobile、loginName、userName、idCard、nickName、isLogin、isRealname、isFace
  selAppRobotUrl({parameterValue: "ICS_HOMEPAGE_BOT"}).then((res: string) => {
    console.log("跳转智能客服: ", res);
    res = replaceUserNameAuto(res, loginInfo);
    console.log("智能客服替换用户信息后: ", res);
    if (res && res.length > 0) {
      // #ifdef H5
      // uni.navigateTo({
      //   url: res
      // });
      jumpPage({
        url: res,
        title: '智能客服'
      })
      // #endif
      // #ifdef MP
      // 跳转智能客服h5
      jumpPage({
        url: res,
        title: '智能客服'
      })
      // #endif
    }
  });
}
/**
 * 已实名的传真实姓名, 未实名的传昵称
 */
export const replaceUserNameAuto = (url: string, loginInfo: any) => {
  let realUrl = decodeURIComponent(url);
  console.log("智能客服真实url: ", realUrl);
  console.log("loginInfo: ", loginInfo.userInfo);
  // 已认证, 传递真实姓名
  if(loginInfo.userInfo.isRealname == '1') {
    // userName=$nickName
    realUrl = realUrl.replace('userName=$nickName', "userName=$userName");
  } 
  // 未认证, 传递昵称
  else {
    // realUrl = realUrl.replace('userName=$nickName', "userName=$nickName");
  }
  console.log("智能客服真实url替换用户信息后: ", realUrl);
  return realUrl;
}

/**
 * 速停车
 */
export const toParking = () => {
  // #ifdef H5
  // 跳转大连海创嗨创生活小程序更多服务，引导用户手动点击速停车功能
  // @ts-ignore
  jumpPage({
    title: "速停车-小程序-更多服务",
    miniAppGhId: __VITE_HUIBAODING_MINI_ORIGIN_ID__,
    // miniAPPID: __VITE_HUIBAODING_MINI_APPID__,
    miniAPPPath: 'package-more/more/more?pageType=2&orderFlag=2&subjectId=SJ20241031215928'
  });
  // #endif
  // #ifdef MP
  // 跳转速停车h5
  jumpPage({
    url: 'https://cloud.keytop.cn/stcfront/Parking/Query?source=1', 
    title: '速停车'
  })
  // #endif
}
