<!--
 * @Description: app跳转第三方h5过渡页，仅供app原生页面跳转第三方h5使用，本uniApp项目内跳转h5不会走此页面，即时管理端配置了，也不会走此页面。
 * @Author: yulongchen
 * @Date: 2024-11-23 17:36:22
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-07-09 14:24:39
 * @Remark: 某些场景app原生页跳转到第三方h5需要携带用户信息、验证登录等处理逻辑，为了实现尽可能统一的处理逻辑，管理端会把第三方h5的跳转作为一个自建应用的场景接入，每个h5对应一个场景id，进入此页面时会带上场景id，通过场景id可以换取具体的跳转链接，前端解析生成最终的跳转地址。
 * 也可以支持别的逻辑处理，需要什么在里面扩展什么。
 * app跳转第三方h5过渡页根据参数检验登录状态，未登录时提示登录，登录后自动跳转
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="{ props: { title: { value: title }, isFullScreen: { value: true } } }">
    <view class="main">
      <!-- <image class="loading-icon" :src="staticBaseUrl + '/hbdimage/loading.gif'" />
      <view v-if="isInner" class="info">页面跳转中，请稍后… </view>
      <view v-else class="info">正在准备跳转第三方应用，请稍后… </view>
      <view class="flex-box">
        <view class="home-btn" @click="toHome">返回首页>></view>
        <view class="home-btn" @click="dealScene">继续前往</view>
      </view> -->
    </view>
  </vc-container>
</template>
<script>
  import { mapState } from 'pinia'
  import { useBaseStore } from "@/store/index";
  export default {
    name: "third-h5",
    data() {
      return {
        title: "",
        isInner: ""
      }
    },  
    onLoad(options) {
      // scene_url=https%3A%2F%2Fwww.bdthi.cn%2F%23%2Fpages%2Findex%3FneedLogin%3Dtrue%26__hbd__encryptData__%3Dtrue_name%3A%3A%24realName%2Cphone%3A%3A%24phone%2Cid_no%3A%3A%24idCard%2CencryptMode%3A%3Aaes%2CencryptKey%3A%3A35f3609fe08824ef%2CencryptIv%3A%3Aabe8ab1234567890%2C__r__%3A%3A%24timestamp
      console.log("options: ", options);
      this.scene_url = options.scene_url;

      // 如果参数存在is_inner，为1时则表示是内部系统跳转，否则是外部系统h5跳转,方便进行该页面显示提示文案
      this.is_inner = options.is_inner == "1";

      // this.scene_url = "https://www.bdthi.cn/%23/pages/index?needLogin=true&__hbd__encryptData__=true_name::$userName,phone::$mobile,id_no::$idCard,encryptMode::aes,encryptKey::35f3609fe08824ef,encryptIv::abe8ab1234567890,__r__::$timestamp&subjectId=SJ20241031217014&title=太行步道&subId=FW20241211298583&type=0";
      console.log("this.scene_url: ", this.scene_url);

      // 智能客服
      this.isIntelligentService = this.scene_url.includes("im.huibaoding.com") || this.scene_url.includes("test.huibaoding.com/aicc-im-base-web");

      // 智能客服或指定了系统外应用标识时
      this.isInner = this.isIntelligentService || this.is_inner;
      console.log("isInner: ", this.isInner);

      this.title = options.title;
      console.log("title: ", this.title);
      console.log("isTokenValid: ", this.bridgeSdk.isTokenValid());
      // token有效时直接调用方法，否则方法放到token回调函数里，等待token获取成功后一次性执行
      this.bridgeSdk.isTokenValid() ? this._tokenCallback() : this.bridgeSdk.beans.setTokenGetCallback(this._tokenCallback);
    },
    onReady() {

    },
    onUnload() {
      
    },
    computed: {
      ...mapState(useBaseStore, {
        navigationBarInfo: "navigationBarInfo"
      }),
    },
    methods: {
      __loadData__(){
        console.log("__loadData__ third-h5");
        this.dealScene();
      },
      _tokenCallback() {
        // 本地开发环境，等sdk初始化完毕后再跳转
        if(this.bridgeSdk.isDev()){
          if(this.bridgeSdk.isInHiApp()){
            this.bridgeSdk.hi.ready({
              success: (res) => {
                console.log("bridgeSdk.hi.ready res: ", res);
                this.dealScene();
              }
            });
          }
          else {
            this.dealScene();
          }
        }
        // 线上环境，直接跳转，无需sdk初始化
        else {
          this.dealScene();
        }
      },
       // 比如：https://www.bdthi.cn/#/pages/index?needLogin=true&__hbd__encryptData__=true_name::$realName,phone::$phone,id_no::$idCard,encryptMode::aes,encryptKey::35f3609fe08824ef,encryptIv::abe8ab1234567890,__r__::$timestamp
       async dealScene() {
          console.log("dealScene scene_url: ", this.scene_url);
          // 校验登录状态
          // needLogin=true
          // 需要登录时，先检查是否登录，未登录时拉起登录，跳过后续的逻辑；已经登录时继续后续的逻辑
          this.scene_url.includes("needLogin=true") && await this.bridgeSdk.checkLogin();

          const loginInfo = this.bridgeSdk.getUserInfo();
          if(this.isIntelligentService) {
            this.scene_url = this.bridgeSdk.replaceUserNameAuto(this.scene_url, loginInfo);
            console.log("智能客服替换用户信息后: ", this.scene_url);
          }

          this.scene_url = this.bridgeSdk.dynamicParamsToStaticParams({
            url: this.scene_url,
          }) || "";
          console.log("dealScene dynamicParamsToStaticParams url: ", this.scene_url);
          this.toPage();
        },
        toHome() {
          if(this.bridgeSdk.isInHiApp()){
            this.bridgeSdk.hi.webviewBack();
          }
          else {
            this.bridgeSdk.toUniAppFirstPage();
          }
        },
        toPage() {
          let {url:_url, ..._params} = this.bridgeSdk.handleOpenURLParams(this.scene_url);
          console.log("toPage _url: ", _url, "_params: ", _params);
          // app内生效
          if(this.bridgeSdk.isInHiApp()){
            this.bridgeSdk.hi.openURLByParams({
              url: _url,
              title: this.title,
              ..._params
            });
            // 关闭当前页面所在的webview
            this.bridgeSdk.hi.closeWebview();
          }
          // 非App内，例：微信小程序、小程序webview h5、浏览器内等
          else {
            this.bridgeSdk.jumpPage({
              url: this.scene_url,
              title: this.title
            });
          }
        }
    }
  } 
</script>

<style lang="scss" scoped>
  .main {
    height: 100%;
    padding: 60rpx;
    color: #666;
    background: white;
    box-sizing: border-box;

    .info {
      font-size: 28rpx;
      color: #222222;
      line-height: 40rpx;
      text-align: center;
      padding-top: 20rpx;
      padding-bottom: 12rpx;
    }

    .home-btn {
      font-weight: 400;
      font-size: 28rpx;
      color: #01BDB8;
      line-height: 40rpx;
      text-align: center;
      margin: 0 20rpx;
    }

    .loading-icon {
      width: 260rpx;
      height: 248rpx;
      padding-top: 100rpx;
      margin: 0 auto;
      display: block;
    }

    .flex-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }

  }
</style>
