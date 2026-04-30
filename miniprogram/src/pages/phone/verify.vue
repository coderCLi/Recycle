<!--
 * @Description: 验证手机号
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-21 13:52:58
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <!-- <vc-proto-alert ref="protoAlert" @agree-action="agreeAction"></vc-proto-alert> -->
  <view class="main">
    <!-- <vc-status-bar /> -->

    <view class="login-bg">
      <vc-back />
      <image
        class="top-bg-img"
        :src="staticBaseUrl + '/hbdimage/main/images/login/top-bg.png'"
        mode="widthFix"
      />
      <text class="top-title">请验证您的身份</text>
    </view>

    <view class="login-box">
      <view class="login-form">
        <view class="login-input">
          <image
            :src="staticBaseUrl + '/hbdimage/main/images/login/phone.png'"
            mode="widthFix"
            class="login-icon"
          />
          手机号码
        </view>
        <view class="login-form-input">
          <input
            class="form-control"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号码"
            v-model="loginFormByCode.phone"
          />
        </view>

        <view class="login-input">
          <image
            :src="staticBaseUrl + '/hbdimage/main/images/login/sms.png'"
            mode="widthFix"
            class="login-icon"
          />
          验证码
        </view>
        <view class="login-form-input">
          <input
            class="form-control"
            type="number"
            placeholder="请输入验证码"
            maxlength="4"
            v-model="loginFormByCode.code"
          />
          <text v-if="codeText" class="send-code code-text">{{
            codeText
          }}</text>
          <text v-else class="send-code" @click="sendCode">{{ sendCodeText }}</text>
        </view>

        <!-- <button
          :disabled="
            loginFormByCode.phone.length === 0 ||
            loginFormByCode.code.length === 0
          "
          class="login-btn"
          @click="loginByPhone"
        >
          下一步
        </button> -->
        <button
          class="login-btn"
          @click="loginByPhone"
        >
          下一步
        </button>
      </view>

      <!-- 协议 -->
      <view class="bottom-box">
        <!-- <vc-proto v-model="protoChecked" class="proto" /> -->
        <vc-safe-bottom />
      </view>
    </view>
  </view>
</template>
<script>
import { getCode, checkVeryCode } from "@/api/login";
// import vcProto from "@/components/library/base/vc-proto/index.vue";
// import vcProtoAlert from "@/components/library/base/vc-proto-alert/index.vue";
import { isTabbar } from "@/utils";
export default {
  name: "login",
  components: {
    // vcProto,
    // vcProtoAlert
  },
  data() {
    return {
      sendCodeText: "获取验证码",
      codeText: "",
      loginFormByCode: {
        phone: "",
        code: "",
        isGet: false
      },
      // protoChecked: false,
    };
  },
  async onLoad(options) {
    await this.firstInit();
    // console.log('mounted', this.appConfig, this.reg);
    this.redirect = options.redirect
      ? decodeURIComponent(options.redirect)
      : "";
      this.fromtype = options.fromtype
      ? decodeURIComponent(options.fromtype)
      : "";
  },
  methods: {
    // 发送验证码倒计时
    sendCode() {
      if (this.codeText.length > 0) {
        return;
      }
      let _phone = this.loginFormByCode.phone || "";
      //01-其他验证码 02-登录短信 03-注册短信 04-忘记密码短信
      let _msgType = this.fromtype == "forgetpassword" ? "04" : "01";
      if (_phone.length === 0) {
        uni.showToast({
          title: "请输入手机号码",
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkPhone(_phone)) {
        uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
        return;
      }
      // if (!this.protoChecked) {
      //   this.$refs.protoAlert.open("sendCode");
      //   return;
      // }
      this.loginFormByCode.isGet = true;
      getCode({ phone: _phone, msgType: _msgType })
        .then((res) => {
          let count = 60;
          this.codeText = count + "秒";
          let timer = setInterval(() => {
            count--;
            this.codeText = count + "秒";
            if (count === 0) {
              clearInterval(timer);
              this.codeText = "";
              this.sendCodeText = "再次获取验证码";
            }
          }, 1000);
        })
        .catch(() => {});
    },
    loginByPhone() {
      console.log("手机和验证码登录");
      //01-其他验证码 02-登录短信 03-注册短信 04-忘记密码短信
      let _msgType = this.fromtype == "forgetpassword" ? "04" : "01";
      let _phone = this.loginFormByCode.phone || "";
      let _code = this.loginFormByCode.code || "";
      if (
          !_phone ||
          _phone.length === 0
        ) {
          uni.showToast({
            title: "请输入手机号码",
            icon: "none",
          });
          return;
        }
      if (!this.reg.checkPhone(_phone)) {
        uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
        return;
      }
      if (
          !_code ||
          _code.length === 0
        ) {
          uni.showToast({
            title: "请输入验证码",
            icon: "none",
          });
          return;
        }
      if (!this.reg.checkCode(_code)) {
        uni.showToast({
          title: "请输入正确的验证码",
          icon: "none",
        });
        return;
      }
      // if (!this.protoChecked) {
      //   this.$refs.protoAlert.open("loginByPhone");
      //   return;
      // }
      if (!this.loginFormByCode.isGet) {
        uni.showToast({
          title: "请点击获取验证码",
          icon: "none",
        });
        return;
      }
      if (this.fromtype == "forgetpassword") {
        
        this.trackReport.trackCustom("修改密码-验证手机号");

        checkVeryCode({ mobile: _phone, checkCode: _code, msgType: _msgType })
        .then((res) => {
          console.log("校验验证码（忘记密码） ")
          let passcode = res.passCode || "";
          // 重定向
          if (this.redirect && passcode.length > 0) {
            
            let _redirect = this.redirect + `?phone=${_phone}&code=${_code}&fromtype=${this.fromtype}&passcode=${passcode}`
            isTabbar(this.redirect)
              ? uni.switchTab({
                  url: _redirect,
                })
              : uni.navigateTo({
                  url: _redirect,
                });
          } else {
            console.log("没有重定向或没有passcode");
          }
        })
        .catch(() => {});
      } else {
        // 重定向
        if (this.redirect) {

          this.trackReport.trackCustom("修改密码-验证手机号");
          
          let _redirect = this.redirect + `?phone=${_phone}&code=${_code}&fromtype=${this.fromtype}`
          isTabbar(this.redirect)
            ? uni.switchTab({
                url: _redirect,
              })
            : uni.navigateTo({
                url: _redirect,
              });
        } else {
          console.log("没有重定向");
        }
      }
      
    },
    // agreeAction(openType) {
    //   this.protoChecked = true;
    //   if (openType && openType.length > 0) {
    //     this[openType]();
    //   }
    // }
  },
};
</script>
  
  <style lang="scss" scoped>
.login-bg {
  position: relative;
  height: 380rpx;

  .top-bg-img {
    width: 100%;
  }

  .top-title {
    position: absolute;
    top: 220rpx;
    left: 30rpx;
    z-index: 1;
    font-weight: bold;
    font-size: 60rpx;
    color: #ffffff;
    line-height: 84rpx;
    text-shadow: 0rpx 0rpx 44rpx #008d8a;
  }
}

.login-box {
  background: #ffffff;
  box-shadow: 0px -26rpx 36rpx 0px #65b6d1;
  border-radius: 60rpx 60rpx 0rpx 0rpx;
  backdrop-filter: blur(10rpx);
  padding-top: 40rpx;
  min-height: calc(100vh - 380rpx);
  position: relative;
  padding-bottom: 100rpx;
  box-sizing: border-box;
  .bottom-box {
    position: absolute;
    bottom: 0rpx;
  }
  &::v-deep .component {
    display: flex;
    justify-content: center;
    width: 100vw;
  }
}

.login-form {
  padding: 8rpx 40rpx 40rpx;

  .login-icon {
    width: 28rpx;
    height: 32rpx;
    margin-right: 12rpx;
  }

  .login-icon-eye {
    width: 44rpx;
    height: 44rpx;
    position: absolute;
    right: 26rpx;
    top: 26rpx;
    z-index: 10;
  }

  .login-input {
    font-weight: bold;
    font-size: 28rpx;
    color: #222222;
    line-height: 40rpx;
    display: flex;
    align-items: center;
  }

  .login-form-input {
    width: 670rpx;
    height: 96rpx;
    background: #f0faf9;
    border-radius: 47rpx;
    padding: 28rpx 40rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
    margin-bottom: 40rpx;
    position: relative;

    .form-control {
      font-size: 28rpx;
      color: #999999;
    }

    .send-code {
      font-size: 28rpx;
      color: #00bcb8;
      line-height: 40rpx;
      position: absolute;
      top: 28rpx;
      right: 38rpx;
      bottom: 28rpx;
      z-index: 2;
    }

    .code-text {
      color: #999999;
    }
  }

  .login-btn {
    width: 672rpx;
    line-height: 84rpx;
    background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%);
    border-radius: 42rpx;
    font-weight: 600;
    text-align: center;
    font-size: 32rpx;
    color: #ffffff;
    transition: opacity 0.3s ease;

    &.button-hover {
      opacity: 0.72;
    }

    &[disabled] {
      opacity: 0.32;
    }
  }
}
.main {
  background: #ffffff;
  min-height: 100vh;
}
.main ::v-deep .safe-bottom {
  background: #ffffff;
  position: relative;
  z-index: 2;
  margin-top: -3rpx;
}
</style>