/*
 * @Description: 入口文件
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-04-11 11:28:05
 */


// #ifdef MP_WEIXIN
// 百度移动统计已停用：它会请求 hmma.baidu.com，真机域名校验会失败报错，且本项目已不需要它
// import './utils/mtj-wx-sdk.config'
// import './utils/mtj-wx-sdk';
import { initCloud } from '@/utils/cloud'
initCloud()
// #endif


import { createSSRApp } from "vue";
// import { createI18n } from 'vue-i18n'

import App from "./App.vue";

import globalMixin from './mixins';

import store from './store'
// console.log('store', store)

import reg from '@/utils/reg'
// console.log('reg', reg)

import * as bridge from '@/utils/bridge'
import * as utils from '@/utils/utils'
import * as map from '@/utils/map'
import * as staticJump from "@/utils/static.jump"

import * as beans from "@/utils/beans";

import * as decimal from "@/utils/decimal"

import * as business from '@/utils/business'
// console.log('business', business)

import * as whitelist from "@/utils/whitelist"

import { apiInterceptor, routeInterceptor, requestInterceptor, prototypeInterceptor } from './interceptors'

import * as trackReport from './utils/track'

import '@/style/index.scss'

// 应用配置信息
import appConfig from "@/constant/app.config"


// #ifdef H5
import loadDebug from '@/utils/debug'
// console.log('process.env', JSON.stringify(process.env));
// 非生产环境始终显示调试按钮，这样方便本地开发、测试环境查看调试信息
// console.log('__DEPLOY_ENV__', __DEPLOY_ENV__);
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// if(__DEPLOY_ENV__ !== 'pro' && (process.env.NODE_ENV !== 'development' || process.env.NODE_ENV === 'development' && bridge.isInHiApp())) {
// 打包后部署的测试环境或app内访问本地开发环境，统一打开h5调试按钮
if((process.env.NODE_ENV !== 'development' && __DEPLOY_ENV__ === 'test') || (process.env.NODE_ENV === 'development' && bridge.isInHiApp())) {
  loadDebug();
}
// #endif

// 引入全局uview-plus
import uviewPlus from '@/uni_modules/uview-plus'
// // 设置uview-plus配置
// setConfig({
// 	// 修改$u.config对象的属性
// 	config: {
// 		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
// 		unit: 'rpx'
// 	},
// 	// 修改$u.props对象的属性
// 	props: {
// 		// 修改alert组件的type参数的默认值，相当于执行 uni.$u.props.alert.type = "error"
// 		alert: {
// 			type: 'error'
// 		}
// 		// 其他组件属性配置
// 	}
// })

// // i18n部分的配置
// // 引入语言包，注意路径
// import zhHans from '@/lang/locales/zh';
// import en from '@/lang/locales/en';
// const messages = {
// 	en,
// 	'zh-Hans': zhHans,
// }
// let i18nConfig = {
//   locale: uni.getLocale(),// 获取已设置的语言
//   messages
// }
// // console.log(`i18nConfig`, i18nConfig)
// const i18n = createI18n(i18nConfig)

// 引入uView对小程序分享的mixin封装
// import mpShare from '@/uni_modules/uview-plus/libs/mixin/mpShare.js'

// 全局组件引用
import vcContainer from '@/components/library/base/vc-container/vc-container.vue'
import vcStatusBar from '@/components/library/base/vc-status-bar/index.vue'
import vcSafeBottom from '@/components/library/base/vc-safe-bottom/index.vue'
import vcNavbar from '@/components/library/base/vc-navbar/index.vue'
import vcBack from '@/components/library/base/vc-back/index.vue'
import vcEmpty from '@/components/library/base/vc-empty/index.vue'; // 空提示全局
import vcShare from '@/components/library/base/vc-share/index.vue'; // 分享全局
import vcLogin from '@/components/library/base/vc-login/index.vue';
import vcModal from '@/components/library/base/vc-modal/index.vue';
import vcSearchCurPage from '@/components/library/base/vc-search-cur-page/index.vue'; // 当前页面搜索组件
import vcTabbar from '@/components/library/base/vc-tabbar/index.vue'; // 当前页面搜索组件

function createApp() {
  const app = createSSRApp(App);
  // console.log(`app实例：`, app);

  app.mixin(globalMixin);
  
  // 全局组件注册
  app.component('vc-container', vcContainer);
  app.component('vc-status-bar', vcStatusBar);
  app.component('vc-safe-bottom', vcSafeBottom);
  app.component('vc-navbar', vcNavbar);
  app.component('vc-back', vcBack);
  app.component('vc-empty', vcEmpty);
  app.component('vc-share', vcShare);
  app.component('vc-login', vcLogin);
  app.component('vc-modal', vcModal);
  app.component('vc-search-cur-page', vcSearchCurPage);
  app.component('vc-tabbar', vcTabbar);

  app
  .use(apiInterceptor)
  .use(routeInterceptor)
  .use(requestInterceptor)
  .use(prototypeInterceptor)
  .use(store)
  // .use(i18n)
  .use(uviewPlus)

  app.config.globalProperties.appConfig = appConfig;

  app.config.globalProperties.reg = reg;

  // 统一工具类入口，页面中还是使用this.bridgeSdk调用具体的方法
  app.config.globalProperties.bridgeSdk = {
    ...bridge,
    ...utils,
    ...map,
    ...staticJump,
    decimal,
    beans,
    whitelist
  };

  app.config.globalProperties.businessTool = business;

  // 项目访问基础地址，https://xxx.xxx.xxx.xxx/h5/
  // 注意：微信小程序真机没有 location 全局变量，必须用 typeof 判断，否则会抛 ReferenceError 导致白屏
  app.config.globalProperties.baseUrl =
    typeof location !== "undefined" && location ? location.origin + location.pathname : "";

  // 项目静态资源地址，用于存放项目中用到的图片一类的资源，可通过web管理端或ftp上传至静态资源服务器指定目录下，一般是hbd
  // app.config.globalProperties.staticBaseUrl = __VITE_SERVER_BASEURL__;
  app.config.globalProperties.staticBaseUrl = __VITE_SERVER_OTHERURL__;

  // 项目minio地址，minio服务端地址
  // app.config.globalProperties.minioBaseUrl = __VITE_SERVER_BASEURL__ + "/minio/";
  app.config.globalProperties.minioBaseUrl = __VITE_SERVER_OTHERURL__ + "/minio/";


  // __VITE_SERVER_BASEURL__
  // app.config.globalProperties.trackReportBaseUrl = "https://apartment9-3bcc6a1560a12.flex.countly.com";

  // app.config.globalProperties.uniAppStaticBaseUrl = __VITE_UNIAPP_STATIC_BASE_URL__;

  app.config.globalProperties.trackReport = trackReport;

  // 保定市中心坐标
  app.config.globalProperties.centerCoords = __VITE_BAODING_CENTER_COORDS__.split(',');

  app.config.globalProperties.firstInit = () => {
    // 设想页面初始化时，执行一些业务逻辑，因为项目中有些页面调用了，有些页面未调用，很不统一，目前此方法废除，请勿继续使用。
    return true;
  };

  app.config.globalProperties.logoUrl = __VITE_LOGO_URL__;

  app.config.globalProperties.logoBase64 = __VITE_LOGO_BASE64__;

  app.config.globalProperties.shareTitle = __VITE_SHARE_TITLE__;

  app.config.globalProperties.shareContent = __VITE_SHARE_CONTENT__;

  app.config.globalProperties.huiMiniOriginId = __VITE_HUIBAODING_MINI_ORIGIN_ID__;

  app.config.globalProperties.huiMiniAppId = __VITE_HUIBAODING_MINI_APPID__;

  // #ifdef MP
  // app.mixin(mpShare)
  // #endif

  return {
    app
  };
}

export default createApp;
