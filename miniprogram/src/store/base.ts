import { defineStore } from 'pinia'

export default defineStore('base', {
    state: () => ({
      // 天气
      weatherInfo: {
        temperature: "",
        weather: ""
      },
      // 当前导航栏高度
      navH: 0,
      // 当前运行环境
      runEnv: '',
      // 屏幕信息
      windowInfo: {} as any,
      // #ifdef MP-WEIXIN
      // @ts-ignore
      // 导航条信息(为防止有时顶部位置显示错乱，赋默认值)
      navigationBarInfo: {
        barHeight: 32,
        navigationBarHeight: 44,
        pill: {
          bottom: 80,
          height: 32,
          left: 278,
          right: 365,
          top: 48,
          width: 87
        },
        pillBottom: 8,
        pillRight: 97,
        pillTop: 48,
        statusBarHeight: 44,
        totalHeight: 76
      },
      // #endif
      // #ifdef H5
      // @ts-ignore
      // 导航条信息(为防止有时顶部位置显示错乱，赋默认值)
      navigationBarInfo: {
        barHeight: 44,
        navigationBarHeight: 44,
        pill: {
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0
        },
        pillBottom: 26.4,
        pillRight: 375,
        pillTop: 4.4,
        statusBarHeight: 0,
        totalHeight: 88
      },
      // #endif
      // 当前页面信息
      // currPageInfo: {
      //   path: '',
      //   title: ''
      // },
      // 所有页面信息
      allPages: []
    }),
    getters: {
      // customNavH: state => state.navH,
      // customRunEnv: state => state.runEnv,
      safeTopDistance: state => {
          console.log("state.runEnv", state.runEnv);
          console.log("state.navigationBarInfo", state.navigationBarInfo);
          // 客户端，无导航栏时，安全区域为状态栏底部以下区域
          if(state.runEnv == 'ios' || state.runEnv == 'android'){
            return state.navigationBarInfo.statusBarHeight;
          }
          // 微信小程序，胶囊底部以下区域
          else if(state.runEnv == 'miniProgram'){
            return state.navigationBarInfo.totalHeight;
          } 
          // 普通h5
          else {
            return 0;
          }
      },
      // 可用高度（去除状态栏、导航栏高度后）
      maxAviHeightWithNav: state => {
        // 客户端，无导航栏时，安全区域为状态栏底部以下区域
        if(state.runEnv == 'ios' || state.runEnv == 'android'){
          return state.windowInfo.screenHeight - state.navigationBarInfo.statusBarHeight - state.navigationBarInfo.navigationBarHeight;
        }
        // 微信小程序，胶囊底部以下区域
        else if(state.runEnv == 'miniProgram'){
          return state.windowInfo.screenHeight - state.navigationBarInfo.totalHeight;
        } 
        // 普通h5
        else {
          return state.windowInfo.screenHeight;
        }
      },
      // 全屏高度（无状态栏、导航栏）
      maxAviHeightFull: state => {
        return state.windowInfo.screenHeight;
      }
    },
    actions: {
      updateWeather(val: { temperature: string; weather: string }) {
        // console.log("weatherInfo: ", val);
        this.weatherInfo = val;
      },
      // 更新导航栏高度
      setNavH(val: number) {
        this.navH = val
        // console.log('导航栏高度：', val)
      },
      // 更新导航条信息
      setNavigationBarInfo(val: any){
        this.navigationBarInfo = Object.assign(this.navigationBarInfo, val);
      },
      // setNavigationBarHeight(val: number) {
      //   this.navigationBarInfo.navigationBarHeight = val;
      // },
      setStatusBarHeight(val: number) {
        this.navigationBarInfo.statusBarHeight = val;
      },
      setRunEnv(val: string) {
        this.runEnv = val
        // console.log('当前运行环境：', val)
      },
      setWindowInfo(val: any) {
        this.windowInfo = val
        // console.log('屏幕信息：', val)
      },
      // setCurrPageInfo(val: any) {
      //   this.currPageInfo = val
      //   // console.log('当前页面信息：', val)
      // },
      setAllPages(val: any) {
        this.allPages = val;
        // console.log('所有页面信息：', val)
      },
      // setNavTitle(val: string) {
      //   this.currPageInfo.title = val;
      //   // console.log('当前页面标题：', val)
      // },
    },
    persist: true,
  }
)
