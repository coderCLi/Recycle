<!--
 * @Description: 容器页
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-06-23 11:47:35
-->
<script setup lang="ts">
  import { onLaunch, onShow, onHide, onError, onUnhandledRejection, onThemeChange, onExit } from "@dcloudio/uni-app";

  import launchInit from '@/utils/launchInit'

  import { getEnvironment, toFirstPage, isInHiApp, hi, getUrlObj, removeStorageSync } from "@/utils/bridge";

  import { useBaseStore } from "./store";

  import { getAllPages } from '@/utils'

  import { clearAppStorage, jumpPage } from "@/utils/utils";

  import * as beans from "@/utils/beans";

  onLaunch(async () => {
    console.log("App Launch");

    if(isInHiApp()){
      // 防止app内h5用户登录态与app本身不一致
      clearAppStorage();
      document.querySelector('.uni-tabbar-bottom')?.remove();

      // 设置html高度为屏幕实际高度, 防止出现屏幕高度与视口高度不一致情况, 一般视口高度为屏幕高度去除了状态栏高度、底部安全区的高度的剩余高度, 但此项目中需要的是一个完整的全屏高度
      document.documentElement.style.height = window.screen.height + 'px';
    }

    // #ifdef H5
    // @ts-ignore
    let { query, path } = getUrlObj(location.href);
    console.log("query: ", query, "path: ", path);
    document.title = query.title ? decodeURIComponent(query.title) : "";
    // #endif

    await launchInit();

    const baseStore = useBaseStore();

    // 获取全部页面
    const allPages = getAllPages("");
    // console.log("全部页面", JSON.stringify(allPages, null, '\t'));
    baseStore.setAllPages(allPages);

    // 当前环境
    const _env: string = await getEnvironment();
    // console.log("当前环境", _env);
    // 设置当前环境
    baseStore.setRunEnv(_env);

    // #ifdef H5
    location?.href?.indexOf('channel=h5Iframe') > -1 && beans.setH5IframeChannel()
    // #endif

  });

  onShow(() => {
    // console.log("App Show");
  });

  onHide(() => {
    // console.log("App Hide");
  });
  
  onError((err) => {
    console.warn("App Error", err);
    // trackReport.trackError(err);
  });
  
  onUnhandledRejection((reason) => {
    console.warn("App Unhandled Rejection", reason);
    // trackReport.trackError(reason.reason);
  });

  onThemeChange((theme) => {
    console.log("App Theme Change", theme);
  });

  onExit(() => {
    console.log("App Exit");
  }); 

  // #ifdef MP
  // 更新管理器
  const updateManager = uni.getUpdateManager();
  // 监听向微信后台请求检查更新结果事件。微信在小程序每次启动（包括热启动）时自动检查更新
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })
  // 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
  updateManager.onUpdateReady(function () {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  // 监听小程序更新失败事件，下载失败（可能是网络原因等）后回调
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
    console.log('onUpdateFailed')
  })

  uni.onMemoryWarning(level=>{
    console.warn(level);
    // uni.showToast({
    //   title: `内存不足：${level}`,
    //   icon: 'none',
    //   duration: 2000
    // })
  });
  // #endif
  
  uni.onPageNotFound(res => {
    console.log("onPageNotFound", res);
    // trackReport.trackPageNotFound(res.path);

    uni.showModal({
      title: '温馨提示',
      content: "页面不存在，是否返回首页？",
      // showCancel: false,
      success: function (res) {
        if (res.confirm) {
          // 点击确定
          // toFirstPage();

          // #ifdef MP          
          uni.switchTab({
            url: '/pages/home/home',
            complete: function (res) {
              console.log("switchTab complete", res);
            } 
          })
          // #endif

          // #ifdef H5
          // uniapp的switchTab方法有bug，无法返回首页，只能用location.href跳转
          location.href = "/#/pages/home/home";
          // #endif

        }
        else {

        }
      }
    })

  });

</script>

<style lang="scss">
	/*每个页面公共css */
	// @import "uview-plus/index.scss";
	@import "@/uni_modules/uview-plus/index.scss";
  
  // 旧版app样式，直接改造使用，保证旧版项目不变类名也能使用
  @import url("@/style/index.scss");

  /* 隐藏所有页面的 navigationBar */
  // uni-page-head {
  //   display: none;
  // }

  .content-box-top {
    padding-top: 20rpx;
  }

  /* #ifdef H5 */
  /** 解决app端h5页面底部多余的空白 */
  uni-page-wrapper::after {
    height: 0 !important;
  }
  /* #endif */

  .uni-tabbar-bottom {
    /* #ifdef H5 */
    // display: none;
    /* #endif */
  }

  /** 批量解决u-search输入框组件disabled状态下，内部input区域无法触发click事件的bug */
  .u-search .uni-input-form .uni-input-input[disabled] {
    width: 0;
  }

  view, text {
    font-family: PingFangSC, PingFang SC;
  }

  #app, Page{
    background-color: #f5f6f8;
  }

  /**滚动条美化 */
  /* 滚动条的滑轨宽度 */
  ::-webkit-scrollbar{
    width: 3px;
    height: 3px;
  }
  /* 滚动条的滑轨背景颜色 */
  ::-webkit-scrollbar-track {
		  background-color: rgba(0, 0, 0, 0.1); 
	} 
  /* 滑块颜色 */
	::-webkit-scrollbar-thumb {
		  background-color: rgba(0, 0, 0, 0.32); 
	} 
  /* 滑轨两头的监听按钮颜色 */
	::-webkit-scrollbar-button {
		  background-color: rgba(0, 0, 0, 0); 
	}

  // 单行省略
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 两行省略
  .ellipsis-2 {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  // 三行省略
  .ellipsis-3 {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .huanhang {
    word-wrap: break-word;
    word-break: break-all;
    overflow-wrap: break-word;
    white-space: normal;
  }
</style>