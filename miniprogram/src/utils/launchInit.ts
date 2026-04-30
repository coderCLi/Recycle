import { useBaseStore } from "@/store";
// import { getInitCode } from "@/api/login";
import { requestToken } from '@/api/requestToken';
import * as trackReport from '@/utils/track'
import * as bridge from '@/utils/bridge'
import sdkInit from "./sdkInit";
let firstInitSuccess = false;

// import loadDebug from '@/utils/debug'

export default async function launchInit () {
    return new Promise(async (resolve, reject) => {
      const { getWindowInfo, getDeviceInfo, hbd, isInHiApp, getStorageSync, setStorageSync, removeStorageSync, getUrlObj, getEnvironment, updateAppToken } = bridge;

      // 防止缓存中appToken被清空造成取值出问题, 这里更新下缓存中的appToken值
      updateAppToken();

      const baseStore = useBaseStore();

      // 通用初始化逻辑
      const initCommon = async () => {

        const windowInfo: any = await getWindowInfo();
        // console.log("windowInfo: ", windowInfo);
        baseStore.setWindowInfo(windowInfo);
  
        // #ifdef H5
        const deviceInfo: any = await getDeviceInfo();
        // console.log("deviceInfo: ", deviceInfo);

        // @ts-ignore
        // 对比版本号大小，返回结果，1 表示 v1 大于 v2，-1 表示 v1 小于 v2，0 表示相等
        // 为了方便调试，ios端会添加1.2.0版本，小于2.0.0版本添加调试按钮，安卓端未适配，使用chrome调试即可
        // hi.compareVersion({
        //   v1: deviceInfo.appVersion,
        //   v2: '2.0.0',
        //   // 成功，可选参数
        //   success: function(res) {
        //     console.log(res);
        //     if(res.data.code == -1) {
        //       loadDebug();
        //     }
        //   }
        // });

        const h5StatusBarHeight = parseInt(deviceInfo.statusBarHeight);
        let h5NavBarHeight = parseInt(deviceInfo.navBarHeight);

        // 非大连海创嗨创生活app内webview，状态栏高度为0，导航栏组件高度44px
        if(!isInHiApp()){
          h5NavBarHeight = 44;
        }

        const h5NavigationBar = {
          unit: 'px',
          // 状态栏高度
          statusBarHeight: h5StatusBarHeight,
          // 胶囊尺寸
          pill: {},
          // 标题距离顶部间距，按胶囊高度占导航栏高度的80%算
          pillTop: h5NavBarHeight / 2 - h5NavBarHeight * 0.8 / 2 + h5StatusBarHeight,
          // 头部总高度
          totalHeight: h5NavBarHeight + h5StatusBarHeight,
          // 导航栏理想设计高度
          barHeight: h5NavBarHeight,
          // 胶囊左侧边界距页面右侧边界距离
          pillRight: deviceInfo.width,
          // 胶囊底部边界距页面标题栏底部边界距离
          pillBottom: h5NavBarHeight + h5StatusBarHeight - h5NavBarHeight * 0.8 / 2,
          // 导航栏总高度
          navigationBarHeight: h5NavBarHeight
        };
        // console.log("---h5自定义导航栏信息，单位px---", JSON.stringify(h5NavigationBar, null, '\t'));

        baseStore.setNavigationBarInfo(h5NavigationBar);
        baseStore.setNavH(h5NavigationBar.navigationBarHeight);
        // #endif

        // #ifdef MP
        // 胶囊尺寸
        const pill = uni.getMenuButtonBoundingClientRect();
        const { height, top, left } = pill;
        // console.log('---胶囊尺寸---', pill);
        // 状态栏高度
        const statusBarHeight = windowInfo.statusBarHeight;
        const pillTop = statusBarHeight + (top - statusBarHeight);
        // console.log('---标题距离顶部间距---', pillTop);
        // 导航栏高度 = 胶囊顶部到状态栏底部 * 2 + 胶囊高度
        const navBarHeight = (top - statusBarHeight) * 2 + height;
        // console.log('---导航栏高度---', navBarHeight);
        // 头部总高度 = 状态栏高度 + 导航栏高度
        const totalHeight = statusBarHeight + navBarHeight;
        // console.log('---头部总高度---', totalHeight);
        // 胶囊高度
        const barHeight = height;
        // console.log('---胶囊高度---', barHeight);
        const pillRight = windowInfo.screenWidth - left;
        // console.log('---胶囊左侧边界距页面右侧边界距离---', pillRight);
        // 为了美观，预留2倍间距
        const pillBottom = (top - statusBarHeight) * 2;
        // console.log('---胶囊底部边界距页面标题栏底部边界距离---', pillBottom);
        const navigationBar = {
          unit: 'px',
          // 状态栏高度
          statusBarHeight,
          // 胶囊尺寸
          pill,
          // 标题距离顶部间距
          pillTop: pillTop,
          // 头部总高度
          totalHeight,
          // 导航栏理想设计高度
          barHeight: barHeight,
          // 胶囊左侧边界距页面右侧边界距离
          pillRight: pillRight,
          // 胶囊底部边界距页面标题栏底部边界距离
          pillBottom: pillBottom,
          // 导航栏高度
          navigationBarHeight: navBarHeight
        };
        // console.log("---mp自定义导航栏信息，单位px---", JSON.stringify(navigationBar, null, '\t'));
        
        baseStore.setNavigationBarInfo(navigationBar);
        baseStore.setNavH(navigationBar.navigationBarHeight);
        // #endif

        // 记录初始化成功
        firstInitSuccess = true;
      };

      if(isInHiApp()){
        await sdkInit();
      }

      // 优先级提高，有效避免页面导航头塌陷
      initCommon();
      
      // 仅调用一次此初始化方法
      if(firstInitSuccess){
        // 先获取token，防止后续存在并发接口造成报错，只会获取一次，后续直接使用本地缓存的token，失效时接口会自动重试
        // await requestToken();
        resolve(null);
        return;
      }

      // App环境特殊处理逻辑
      if(isInHiApp()) {
        const _env = await getEnvironment();
        let defaultStatusBarHeight = 0;
        if(_env == "android"){
          defaultStatusBarHeight = 46;
        }
        else if(_env == "ios"){
          defaultStatusBarHeight = 44;
        }
        // 设置状态栏默认高度，防止塌陷
        baseStore.setStatusBarHeight(defaultStatusBarHeight);
      }

      // 获取交易凭证
      await requestToken();

      trackReport.initTrack();
      
      resolve(null);
    }); 
};
