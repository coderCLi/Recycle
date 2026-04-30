/*
 * @Description: 通用混入
 * @Author: chenyulong
 * @Date: 2024-11-25 13:28:36
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-20 12:02:09
 * @Remark: 
 */
import * as beans from '../utils/beans';

export default {
  data(){
    return {
      // // 自定义分享内容
      // mixinShareData: {
      //   // 分享标题
      //   title: {
      //     value: ""
      //   },
      //   // // 分享内容
      //   // content: {
      //   //   value: ""
      //   // },
      //   // 分享路径
      //   path: {
      //     value: ""
      //   },
      //   // 分享图片
      //   imageUrl: {
      //     value: ""
      //   }
      // }
    }
  },
  onLoad() {
    // console.log('global mixin onLoad');
    beans.setGlobalThis(this);

    // const trackView = () => {
    //   setTimeout(() => {
    //     // 埋点统计
    //     const routerObj = this.bridgeSdk.getCurrentRouter();
    //     // console.log("埋点统计 routerObj: ", routerObj);
    //     // 小程序webview页面自定义处理, 因为不是所有的第三方h5都有标题
    //     if(routerObj.route === "pages/h5/h5"){
    //       return;
    //     }
    //     const _trackTitle = routerObj.options?.title || beans.getGlobalThis()?.options?.title || routerObj?.pageConf?.style?.navigationBarTitleText;
    //     console.log("埋点统计 _trackTitle: ", _trackTitle);
    //     this.trackReport.trackPageView(_trackTitle);
    //   }, 500);
    // };
    // // 页面初始化埋点逻辑
    // trackView();

  },
  onUnload() {
    // console.log('global mixin onUnload');
    
    // 调用函数获取内存使用情况
    // console.log("onUnload before getBrowserMemoryUsage");
    // this.getBrowserMemoryUsage();

    // 移除页面时，移除地图实例 -- 防止内存不释放
    // console.log("onUnload getGlobalThis", beans.getGlobalThis());
    // const baiduMap = beans.getGlobalThis().vueBaiduMap;
    // if(baiduMap){
    // baiduMap.destroy();
    // 清除覆盖物
    // baiduMap.clearOverlays();
    // 移除所有控件
    // const controls = baiduMap.getControls();
    // controls.forEach(control => {
    //   baiduMap.removeControl(control);
    // });
    //   beans.getGlobalThis().vueBaiduMap = null;
    //   console.log("vueBaiduMap onUnload destroy");
    // }
    beans.removeGlobalThis(this);

    // console.log("onUnload after getBrowserMemoryUsage");
    // this.getBrowserMemoryUsage();

    // #ifdef H5    
    // // 尝试隐藏键盘
    // let activeElement = document?.activeElement;
    // console.log("document", document);
    // if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    //     console.log("尝试隐藏键盘");
    //     activeElement.blur();
    // }
    // #endif

  },
  methods: {
    // getBrowserMemoryUsage() {
    //   // #ifdef H5      
    //   // 安卓端、chrome浏览器支持，ios端、safari浏览器不支持
    //   if (window.performance && window.performance.memory) {
    //     const memory = window.performance.memory;
    //     const usedJSHeapSize = memory.usedJSHeapSize;
    //     const totalJSHeapSize = memory.totalJSHeapSize;
    //     const jsHeapSizeLimit = memory.jsHeapSizeLimit;

    //     const convertToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
    //     const convertToGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

    //     console.warn(`已使用的 JS 堆内存大小: ${convertToMB(usedJSHeapSize)} MB (${convertToGB(usedJSHeapSize)} GB)`);
    //     console.warn(`总的 JS 堆内存大小: ${convertToMB(totalJSHeapSize)} MB (${convertToGB(totalJSHeapSize)} GB)`);
    //     console.warn(`JS 堆内存大小限制: ${convertToMB(jsHeapSizeLimit)} MB (${convertToGB(jsHeapSizeLimit)} GB)`);
    //   } else {
    //       console.warn('当前浏览器不支持 performance.memory API');
    //   }
    //   // #endif
    // }
  },
  // // 小程序全局分享，仅当页面混入时有效，组件混入时无效
  // onShareAppMessage(res) {
  //   console.log("小程序好友分享: ", res);

  //   const route = this.bridgeSdk.getCurrentRouter();
  //   console.log("route: ", route);

  //   // 来自页面内分享按钮
  //   if (res.from === 'button') {
  //     console.log(res.target);
  //     // 由点击按钮发起的自定义分享，使用分享组件传递的参数
  //     const shareInfo = this.bridgeSdk.beans.getShareInfo();
  //     console.log("shareInfo: ", shareInfo);
  //     // this.bridgeSdk.beans.clearShareInfo();
  //     return {
  //       // 设置默认分享标题
  //       title: shareInfo.title || this.shareTitle,
  //       // 设置默认分享路径
  //       // path: shareInfo.path || "/pages/home/home",
  //       path: shareInfo.path || "/" + route.route,
  //       // 设置默认分享图片，当前页面屏幕截图
  //       // imageUrl: shareInfo.imageUrl || this.logoUrl || "",
  //       imageUrl: shareInfo.imageUrl || ""
  //     }
  //   }
  //   // 来自右上角菜单
  //   else {
  //     console.log("页面分享：", this.mixinShareData);
  //     return {
  //       // 设置默认分享标题
  //       title: this.mixinShareData?.title?.value || this.shareTitle,
  //       // 设置默认分享路径
  //       // path: this.mixinShareData?.path?.value || "/pages/home/home",
  //       path: this.mixinShareData?.path?.value || "/" + route.route,
  //       // 设置默认分享图片，当前页面屏幕截图
  //       // imageUrl: this.mixinShareData?.imageUrl?.value || this.logoUrl || "",
  //       imageUrl: this.mixinShareData?.imageUrl?.value || ""
  //     }
  //   }
  // },
  // // 小程序分享到朋友圈，仅当页面混入时有效，组件混入时无效
  // onShareTimeline(res) {
  //   consol.log('小程序分享到朋友圈', res);

  //   const route = this.bridgeSdk.getCurrentRouter();
  //   console.log("route: ", route);

  //   // 来自页面内分享按钮
  //   if (res.from === 'button') {
  //     console.log(res.target);
  //     // 由点击按钮发起的自定义分享，使用分享组件传递的参数
  //     const shareInfo = this.bridgeSdk.beans.getShareInfo();
  //     console.log("shareInfo: ", shareInfo);
  //     return {
  //       // 设置默认分享标题
  //       title: shareInfo.title || this.shareTitle,
  //       // 设置默认分享路径
  //       query: "share_path="+encodeURIComponent("/" + route.route)
  //     }
  //   }
  //   // 来自右上角菜单
  //   else {
  //     return {
  //       // 设置默认分享标题
  //       title: this.mixinShareData?.title?.value || this.shareTitle,
  //       // 设置默认分享路径
  //       query: "share_path="+encodeURIComponent("/" + route.route),
  //     }
  //   }
  // }
}
