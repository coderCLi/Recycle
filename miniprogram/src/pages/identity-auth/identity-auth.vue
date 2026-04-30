<!--
 * @Description: 实名认证
 * @Author: yulongchen
 * @Date: 2024-12-12 12:54:41
 * @LastEditors: sy
 * @LastEditTime: 2025-6-17 13:13:03
 * @Remark: 
-->
<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="main">
    <view class="hint-page" :style="`height: ${maxAviHeightWithNav}px;`" v-if="showHintPage">
      <view class="item">
        <view class="title">安全保障</view>
        <view class="content">身份认证保障您的账户安全</view>
        <image class="rightImg" style="width: 100rpx; height: 100rpx;" :src="minioBaseUrl + identitySafePng" mode="aspectFit"/>
      </view>
      <view class="item">
        <view class="title">认证专享</view>
        <view class="content">一次认证，长期享受各类服务</view>
        <image class="rightImg" style="width: 100rpx; height: 100rpx;" :src="minioBaseUrl + identityAuthPng" mode="aspectFit"/>
      </view>
      <view class="item">
        <view class="title">创建实名身份</view>
        <view class="content">多场景下无需携带身份证等证件</view>
        <image class="rightImg" style="width: 100rpx; height: 100rpx;" :src="minioBaseUrl + identityCreatePng" mode="aspectFit"/>
      </view>
      <view class="start-box">
        <view class="start-btn" @click="toRenzheng">开启认证</view>
      </view>
    </view>
    <!-- 实名认证页面 -->
    <view class="identity-auth" v-else>
      <view class="auth-top">
        *认证功能全时间段开放
      </view>
      <view class="input-item">
        <text class="tit">真实姓名</text>
        <input class="form-input" placeholder="请保持与身份证上的姓名一致" v-model="loginFormByCode.realName" placeholder-class="form-input-ph"/>
      </view>
      <view class="input-item">
        <text class="tit">身份证号</text>
        <input class="form-input" placeholder="请输入身份证号" maxlength="18" v-model="loginFormByCode.idNumber" placeholder-class="form-input-ph"/>
      </view>

      
      <view @click="submitApplication" class="bottom-btn">
        开始认证
      </view>
    </view>
    <!-- 多语言自动适配：{{ t('home.title') }} -->
    <vc-safe-bottom v-if="!showHintPage"/>
  </vc-container>
  <!-- <view></view> -->
</template>

<script>
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
import { realName } from '@/api/login'
export default {
  name: "identity-auth1",
  data() {
    return {
      showHintPage: true,
      serviceId: "",
      loginFormByCode: {
        idNumber: "",
        realName: "",
      },
      identityAuthPng: "common/static/identity-auth/identity-auth.png",
      identityCreatePng: "common/static/identity-auth/identity-create.png",
      identitySafePng: "common/static/identity-auth/identity-safe.png",
    }
  },
  computed: {
    ...mapState(useBaseStore, {maxAviHeightWithNav: "maxAviHeightWithNav"})
    // ...mapActions(useBaseStore, ['setNavH']);
  },
  async onLoad(options) {
    this.propsData.props.title.value = options.title;
    await this.firstInit();
    // const environment = await this.bridgeSdk.getEnvironment();
    // console.log('当前环境是：', environment);
    // // this.bridgeSdk.setStorageSync('appToken', options.appToken);  // 已经全局处理了，不允许再写了，否则会用空值覆盖有效的值
    this.serviceId = options.serviceId;
    // // 监听登录成功事件，这里可以执行因登录被拦截掉的逻辑
    // uni.on('loginSuccess', res => {
    //   console.log('loginSuccess', res);
    // });
  },
  onUnload() {
    // uni.off('update')
  },
  methods: {
    toRenzheng() {
      // this.showHintPage = false
      this.bridgeSdk.jumpPage({
        url: '/pages/identity-auth/renzheng-auth'
      });
    },
    // jumpToH5(){
    //   this.bridgeSdk.jumpPage({
    //     url: '/pages/h5/h5?url=https://www.baidu.com&needLogin=flase'
    //   });
    // }   
    //  提交
    submitApplication() {
      if (!this.loginFormByCode.realName) {
        uni.showToast({
          title: "请输入真实姓名",
          icon: "none",
        });
        return;
      }
      if (!this.loginFormByCode.idNumber) {
        uni.showToast({
          title: "请输入身份证号",
          icon: "none",
        });
        return;
      } else {
        // 校验格式
        if (!this.reg.checkId(this.loginFormByCode.idNumber)) {
          uni.showToast({
            title: "请输入真实的身份证号",
            icon: "none",
          });
          return false;
        }
      };
      console.log('接口');
      this.bridgeSdk.showConfirm({
        content: "确认实名认证吗?",
        confirmCallback: () => {
          let data = {
            name: this.loginFormByCode.realName?this.loginFormByCode.realName:"",
            idCard: this.loginFormByCode.idNumber?this.loginFormByCode.idNumber:"",
          }
          realName(data).then(async (res)=>{
            setTimeout(()=> {
              uni.showToast({
                title: "实名认证成功",
                icon: "none",
              });
            }, 500);
            await this.bridgeSdk.updateUserInfo();
            this.bridgeSdk.toFirstPage()
          })
        }
      });
    },

  }
} 
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  background-color: #ffffff;
}
.identity-auth {
  background-color: white;

  .auth-top {
    height: 64rpx;
    line-height: 64rpx;
    background-color: rgba(0, 188, 184, 0.1);
    font-weight: bold;
    font-size: 24rpx;
    color: #00BCB8;
    padding-left: 36rpx;
  }
  .input-item {
    display: flex;
    align-items: center;
    height: 120rpx;
    margin: 0 40rpx;
    padding: 0 20rpx;
    color: #222222;
    border-bottom: 1px solid #F4F4F4;
    .tit {
        font-weight: 600;
        font-size: 28rpx;
        color: #222222;
    }
    .form-input {
        flex: 1;
        margin-left: 20rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #222222;
        text-align: right;
    }
    .form-input-ph {
        color: #999999;
    }
  }

  .bottom-btn {
    position: fixed;
    bottom: 100rpx;
    left: 40rpx;
    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
    border-radius: 42rpx;
    font-weight: 600;
    font-size: 32rpx;
    color: #FFFFFF;
    text-align: center;
    line-height: 80rpx;
    width: calc(100% - 80rpx);
  }
}
.hint-page {
  height: 100%;
  min-height: 70vh;
  background-color: #ffffff;
  padding-left: 40rpx;
  padding-right: 40rpx;
  padding-top: 36rpx;
  box-sizing: border-box;
  .item {
    margin-top: 28rpx;
    border-bottom: 2rpx solid #f4f4f4;
    padding-left: 40rpx;
    padding-right: 40rpx;
    padding-top: 24rpx;
    padding-bottom: 24rpx;
    background: #E5F8F8;
    border-radius: 20rpx;
    position: relative;
    &:first-child {
      margin-top: 0rpx;
    }
    .title {
      font-size: 28rpx;
      color: #02C0B9;
      font-weight: bold;
    }
    .content {
      margin-top: 6rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #00B6B1;
    }
    .rightImg {
        position: absolute;
        right: 32rpx;
        top: 50%;
        transform: translateY(-50%);
    }
  }
  .start-box {
    // margin-top: 78rpx;
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .start-btn {
    width: calc(100% - 80rpx);
    line-height: 80rpx;
    background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%);
    border-radius: 42rpx;
    font-weight: 600;
    text-align: center;
    font-size: 32rpx;
    color: #ffffff;
  }
}
</style>
