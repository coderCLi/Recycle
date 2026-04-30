<!--
 * @Description: 登录、注册
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-21 13:49:36
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-proto-alert ref="protoAlert" @agree-action="agreeAction"></vc-proto-alert>
  <view class="main">
    <!-- <vc-status-bar /> -->

    <view class="login-bg">
      <image class="top-bg-img" :src="minioBaseUrl + 'common/tabbarImages/login_bg_imgnew.jpg'" mode="widthFix" />
      <vc-back :propsData="{ props: { color: { value: '#FFFFFF' } } }"></vc-back>
      <!-- <text class="top-title">欢迎登录大连海创嗨创生活</text> -->
       <image class="top-title-image" :src="minioBaseUrl + 'common/tabbarImages/login_title_font_img.png'" mode="widthFix"></image>
    </view>

    <!-- 登录、注册切换 -->
    <view class="login-box">
      <!-- 登录、注册表单 -->
      <view class="login-form">
        <!-- 登录表单 -->
        <template v-if="currentType === 'login'">
          <view class="login_image">
            <image class="image" :src="minioBaseUrl + 'common/tabbarImages/login_icon_img.png'" mode="widthFix" />
          </view>
          <!-- 手机号和验证码登录 -->
          <template v-if="loginType === 'phone'">
            <view class="login-input">
              <image :src="staticBaseUrl + '/hbdimage/main/images/login/phone.png'" mode="widthFix"
                class="login-icon" />
              手机号码
            </view>
            <view class="login-form-input">
              <input class="form-control" type="tel" maxlength="11" placeholder="请输入手机号码"
                v-model="loginFormByCode.phone" />
            </view>

            <view class="login-input">
              <image :src="staticBaseUrl + '/hbdimage/main/images/login/sms.png'" mode="widthFix" class="login-icon" />
              验证码
            </view>
            <view class="login-form-input">
              <input class="form-control" type="number" maxlength="4" placeholder="请输入验证码"
                v-model="loginFormByCode.code" />
              <text v-if="codeTextLogin" class="send-code code-text">{{
                codeTextLogin
              }}</text>
              <text v-else class="send-code" @click="sendCode('login')">{{ sendCodeTextLogin }}</text>
            </view>
            <button class="login-btn" @click="loginByCode">
              登录
            </button>
          </template>

          <template v-if="loginType === 'account'">
            <button v-if="protoChecked" class="get-phone-btn" open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumber" hover-class="button-hover">
              手机号快捷登录
            </button>
            <button v-else class="get-phone-btn" @click="showTips" hover-class="button-hover">
              手机号快捷登录
            </button>
          </template>
        </template>
      </view>
      <view class="other-login">
        <template v-if="currentType === 'login'">
          <view class="login-btns">
            <view v-if="loginType === 'phone'" class="other-login-btn login-account" @click="loginByAccount">
              <!-- <image class="login-icon" :src="staticBaseUrl + '/hbdimage/main/images/login/account.png'"
                mode="widthFix" /> -->
              手机号快捷登录
            </view>
            <view v-if="loginType === 'account'" class="other-login-btn login-account" @click="loginByPhone">
              <!-- <image class="login-icon" :src="staticBaseUrl + '/hbdimage/main/images/login/sms-toggle.png'"
                mode="widthFix" /> -->
              短信验证码登录
            </view>
          </view>
        </template>
      </view>
      <view class="bottom-box">
        <!-- 协议 -->
        <vc-proto v-model="protoChecked" />
        <vc-safe-bottom />
      </view>
    </view>
  </view>
</template>
<script>
import { getCode, registerAccount, accountLogin, wxPhoneQuickLogin } from "@/api/login";
import vcProto from "@/components/library/base/vc-proto/index.vue";
import vcProtoAlert from "@/components/library/base/vc-proto-alert/index.vue";
import { mapState, mapActions } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
import { getUserProfile } from "@/utils/wxLogin";
export default {
  name: "login",
  components: {
    vcProto,
    vcProtoAlert
  },
  data() {
    return {
      passwordtippng: 'common/hbdbucket/static/passwordtip.png',
      sendCodeText: "获取验证码",
      sendCodeTextLogin: "获取验证码",
      currentType: "login",
      codeTextLogin: "",
      codeText: "",
      hidePassword: true,
      hideRepeatPassword: true,
      loginFormByCode: {
        phone: "",
        code: "",
        isGet: false
      },
      loginFormByPass: {
        phone: "",
        password: "",
      },
      registerForm: {
        phone: "",
        code: "",
        password: "",
        repeatPassword: "",
        isGet: false
      },
      lastLoginType: "wx",
      // 可选登录方式：'wx'、'phone'、'account'
      loginType: "account",
      protoChecked: false,
    };
  },
  computed: {
    ...mapState(useBaseStore, {
      userInfo: "userInfo",
    }),
  },
  async onLoad(options) {
    await this.firstInit();
    // console.log('mounted', this.appConfig, this.reg);
    console.log("onLoad", options);
    const _parma = this.bridgeSdk.getUrlObj(options.redirect);
    console.log("_parma", _parma);
    this.lastLoginType = this.bridgeSdk.getLastLoginType();
  },
  methods: {
    toggle(type) {
      this.currentType = type;
    },
    // 发送验证码倒计时
    sendCode(type) {
      let _phone = "";
      //01-其他验证码 02-登录短信 03-注册短信 04-忘记密码短信
      let _msgType = type === "register" ? "03" : "02";
      if (type === "register") {
        if (this.codeText.length > 0) { return; }
        _phone = this.registerForm.phone;
      } else {
        if (this.codeTextLogin.length > 0) { return; }
        _phone = this.loginFormByCode.phone;
      }
      if (_phone.length === 0) {
        uni.showToast({
          title: "请输入手机号码",
          icon: "none",
          duration: 2000,
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
      if (!this.protoChecked) {
        this.$refs.protoAlert.open(`sendCode,${type}`);
        return;
      }
      if (type === "register") {
        this.registerForm.isGet = true;
      } else {
        this.loginFormByCode.isGet = true;
      }
      getCode({ phone: _phone, msgType: _msgType })
        .then((res) => {
          let count = 60;
          // uni.showModal({
          //   title: '获取验证码成功',
          //   content: res,
          //   showCancel: false,
          // })
          this.updateCodeText(type, count + "秒");
          let timer = setInterval(() => {
            count--;
            this.updateCodeText(type, count + "秒");
            if (count === 0) {
              clearInterval(timer);
              this.updateCodeText(type, "");
              this.updateSendCodeText(type, "再次获取验证码");
            }
          }, 1000);
        })
        .catch(() => { });
    },
    updateCodeText(type, str) {
      if (type === "register") {
        this.codeText = str;
      } else {
        this.codeTextLogin = str;
      }
    },
    updateSendCodeText(type, str) {
      if (type === "register") {
        this.sendCodeText = str;
      } else {
        this.sendCodeTextLogin = str;
      }
    },
    async loginByWx() {
      console.log("微信登录");
      // this.loginType = 'wx';
      if (!this.protoChecked) {
        this.$refs.protoAlert.open("loginByWx");
        return;
      }
      const loginUserInfo = await getUserProfile();
      console.log('---- loginUserInfo', loginUserInfo);

      this.trackReport.trackCustom("微信登录");

      if (loginUserInfo.isLogin == "0") {
        uni.navigateTo({
          url: "/pages/phone/bind?type=wxlogin",
        });
      } else if (loginUserInfo.isLogin && loginUserInfo.isLogin.length > 0) {
        this.loginSuccessHandle(loginUserInfo, "login");
      }
    },
    // 手机和验证码登录
    loginByPhone() {
      this.loginType = "phone";
    },
    // 账号密码登录
    loginByAccount() {
      this.loginType = "account";
    },
    forgetPassword() {
      // 先验证手机号，验证通过后跳转到修改密码页面
      uni.navigateTo({
        url:
          "/pages/phone/verify?redirect=" +
          encodeURIComponent("/pages/password/update") + "&fromtype=forgetpassword",
      });
    },
    loginByCode() {
      console.log("手机号和验证码登录");
      console.log("协议：", this.protoChecked);
      if (
        !this.loginFormByCode.phone ||
        this.loginFormByCode.phone.length === 0
      ) {
        uni.showToast({
          title: "请输入手机号码",
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkPhone(this.loginFormByCode.phone)) {
        uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
        return;
      }
      if (
        !this.loginFormByCode.code ||
        this.loginFormByCode.code.length === 0
      ) {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkCode(this.loginFormByCode.code)) {
        uni.showToast({
          title: "请输入正确的验证码",
          icon: "none",
        });
        return;
      }
      if (!this.protoChecked) {
        this.$refs.protoAlert.open("loginByCode");
        return;
      }
      if (!this.loginFormByCode.isGet) {
        uni.showToast({
          title: "请点击获取验证码",
          icon: "none",
        });
        return;
      }

      this.trackReport.trackCustom("验证码登录");

      this.login({
        mobile: this.loginFormByCode.phone,
        loginType: "2",
        checkCode: this.loginFormByCode.code,
      });
    },
    showTips() {
      if (!this.protoChecked) {
        this.$refs.protoAlert.open("");
        return;
      }
    },
    loginByPass() {
      console.log("账号密码登录");
      if (
        !this.loginFormByPass.phone ||
        this.loginFormByPass.phone.length === 0
      ) {
        uni.showToast({
          title: "请输入手机号码",
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkPhone(this.loginFormByPass.phone)) {
        uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
        return;
      }
      if (
        !this.loginFormByPass.password ||
        this.loginFormByPass.password.length === 0
      ) {
        uni.showToast({
          title: "请输入密码",
          icon: "none",
        });
        return;
      }
      if (!this.protoChecked) {
        this.$refs.protoAlert.open("loginByPass");
        return;
      }

      this.trackReport.trackCustom("密码登录");

      this.login({
        mobile: this.loginFormByPass.phone,
        loginType: "1",
        password: this.loginFormByPass.password,
      });
    },
    register() {
      console.log("注册");

      if (this.registerForm.phone.length === 0) {
        uni.showToast({
          title: "请输入手机号码",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (!this.reg.checkPhone(this.registerForm.phone)) {
        uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
        return;
      }
      if (
        !this.registerForm.code ||
        this.registerForm.code.length === 0
      ) {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkCode(this.registerForm.code)) {
        uni.showToast({
          title: "请输入正确的验证码",
          icon: "none",
        });
        return;
      }
      if (
        !this.registerForm.password ||
        this.registerForm.password.length === 0
      ) {
        uni.showToast({
          title: "请输入密码",
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkPass(this.registerForm.password)) {
        console.log("调用 this.bridgeSdk.showToast({title");
        this.bridgeSdk.showToast({ title: this.reg.passHint + this.reg.passRule, duration: 3000 });
        return;
      }
      if (
        !this.registerForm.repeatPassword ||
        this.registerForm.repeatPassword.length === 0
      ) {
        uni.showToast({
          title: "请再次输入密码",
          icon: "none",
        });
        return;
      }
      if (this.registerForm.password !== this.registerForm.repeatPassword) {
        uni.showToast({
          title: "两次输入的密码不一致",
          icon: "none",
        });
        return;
      }
      if (!this.protoChecked) {
        this.$refs.protoAlert.open("register");
        return;
      }
      if (!this.registerForm.isGet) {
        uni.showToast({
          title: "请点击获取验证码",
          icon: "none",
        });
        return;
      }
      this.bridgeSdk.getSetting((auth) => {
        console.log("-是否授权--- ", auth);
        if (auth) {
          this.bridgeSdk.getLocation((res) => {
            console.log(res, "获取定位", res.locationFail);
            if (res.locationFail || !res.lat || res.lat.length == 0 || !res.lng || res.lng.length == 0) {
              this.coreRegister();
              return;
            }
            let location = res.lat + "," + res.lng;
            this.coreRegister(location);
          });
        } else {
          this.coreRegister();
        }
      })
    },
    coreRegister(location) {
      this.trackReport.trackCustom("注册");

      uni.showLoading({
        title: "注册中...",
      });
      let params = {
        mobile: this.registerForm.phone,
        checkCode: this.registerForm.code,
        password: this.registerForm.password,
        checkPassword: this.registerForm.repeatPassword,
      }
      if (location) {
        params = { ...params, location };
      }
      registerAccount(params)
        .then((res) => {
          uni.hideLoading();
          // if (res) {
          // this.loginSuccessHandle(res, "register");
          this.registerForm = {
            phone: "",
            code: "",
            password: "",
            repeatPassword: ""
          };
          this.toggle('login');
          setTimeout(() => {
            uni.showToast({
              title: "注册成功",
              icon: "none",
            });
          }, 30)
          // }
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    login(params) {
      // uni.showLoading({
      //   title: "登录中...",
      // });

      let deviceInfo = this.bridgeSdk.getDeviceInfo();
      let loginParam = {
        deviceType: deviceInfo.deviceType || "",
        deviceSystem: deviceInfo.system,
        deviceCode: deviceInfo.deviceId,
        loginIp: "",
        loginVersion: deviceInfo.appVersion || "",
        netType: "",
        netSupply: "",
        ...params,
      };
      // phone手机号
      // loginType登录方式   1 是密码  2是验证码
      // password登录密码
      // checkCode验证短信验证码

      wxPhoneQuickLogin({
        ...loginParam,
      },{
        // encrypt: false,
        // decrypt: false,
      })
        .then((res) => {
          // uni.hideLoading();
          if (res) {
            this.loginSuccessHandle(res);
          }
        })
        .catch(() => {
          // uni.hideLoading();
        });
    },
    loginSuccessHandle(userInfo, type) {
      console.log("登录成功 userInfo", userInfo);
      if (Object.prototype.toString.call(userInfo) !== "[object Object]") {
        return;
      }

      this.bridgeSdk.setUserInfo(userInfo);
      this.bridgeSdk.setLastLoginType(this.loginType);
      setTimeout(() => {
        uni.showToast({
          title: "登录成功",
          icon: "none",
        });
      }, 30)

      // 全局通知登录成功
      // uni.$emit("loginSuccess", userInfo);

      this.navigateBackPage();
    },
    // 跳转回上一页
    navigateBackPage() {
      const routes = getCurrentPages();
      const prevRoute = routes.length > 1 ? routes[routes.length - 2] : null;
      console.log("prevRoute", prevRoute);

      this.bridgeSdk.navigateBackTo({
        delta: 1,
        success: res => {
          console.log("navigateBack success", res);
          this.bridgeSdk.retryFailedRequest();
          // 调用来源页的逻辑，一般是定义的是初始化的逻辑，请确保每个页面都定义该方法
          prevRoute && prevRoute.$vm && prevRoute.$vm.__loadData__ && prevRoute.$vm.__loadData__();
        }
      });
    },
    agreeAction(openType) {
      this.protoChecked = true;
      if (openType && openType.length > 0) {
        let arr = openType.split(",");
        let method = arr[0];
        arr.length > 1 ? this[method](arr[1]) : this[method]();
      }
    },
    getPhoneNumber(e) {
      console.log("getPhoneNumber", e);
      // e = {
      //   detail: {
      //     code: "e13cd4053a305ede675b2a3813c156140fe9c375f5ba3ca1497aae22c973c3f1",
      //     encryptedData: "NGZPPCoiE06hwEVbyGqh0RlmW5Fr8r6+9H9XhxhTa07edvZ5lgDPIIB3KnZw/IT8huWimqUS5f1MIamIO7qcrNCnhWdDw6vtb7lBlWY5vdt57Zi7GPsGe7tK82cX16x2zr7TbLg44Cz+obvNKJDTqV/O2yWw887Gi+HJ5SU3eiBk/PVXu2Oj4JpBhwy1HCR6YummK5bD2uWc9moNlz14bQ==",
      //     errMsg: "getPhoneNumber:ok",
      //     iv: "+9eEnEplC1xEgkcy6+/0sA==",
      //   }
      // }
      if(e&&e.detail&&e.detail.code){
        let code = e.detail.code;
        let params = {
          loginType: "1",
          code: code,
        }
        this.login(params)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.main {
  background: #ffffff;
  min-height: 100vh;
}

.login-bg {
  position: relative;
  height: 510rpx;

  .top-bg-img {
    width: 100%;
  }
  .top-title-image{
    width: 390rpx;
    position: absolute;
    top: 160rpx;
    left: 86rpx;
    z-index: 1;
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
    text-shadow: 0rpx 0rpx 44rpx #58A1F6;
  }
}

.password-tip {
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  display: flex;
  margin-bottom: 128rpx;
  margin-right: -10rpx;

  .tip-image {
    width: 24rpx;
    height: 24rpx;
    margin-right: 4rpx;
  }
}

.login-box {
  background: #ffffff;
  box-shadow: 0px -1rpx 6rpx 0px #65b6d1;
  border-radius: 60rpx 60rpx 0rpx 0rpx;
  backdrop-filter: blur(10rpx);
  padding-top: 8rpx;
  min-height: calc(100vh - 510rpx);
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

  .login-menus {
    display: flex;
  }

  .login-menu {
    width: 367rpx;
    height: 137rpx;
    line-height: 94rpx;
    text-align: center;
    font-weight: bold;
    font-size: 36rpx;
    position: relative;
    color: #82d0d3;
    transition: all 0.3s ease;

    &.login,
    &.register {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    // &.login {
    // background: url("@/static/images/login/login-bg.png'") no-repeat center;
    // background-size: cover;
    // }

    // &.register {
    // background: url("@/static/images/login/register-bg.png'") no-repeat center;
    // background-size: cover;
    // }

    &::after {
      content: "";
      position: absolute;
      bottom: 50rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      width: 40rpx;
      height: 9rpx;
      background: transparent;
      border-radius: 5rpx;
    }

    &.active {
      color: #222222;
      background: transparent;
      background-image: none !important;

      &::after {
        background: linear-gradient(132deg, #00bcb8 0%, #6FA9F7 100%), #ff5871;
      }
    }

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
    z-index: 2;
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
      // color: #666666;
      color: #58A1F6;
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

  .forget-password {
    text-align: center;
    font-size: 28rpx;
    color: #58a1f6;
    padding: 0 0 60rpx;
    display: flex;
    justify-content: center;
  }

  .login-btn {
    width: 672rpx;
    line-height: 84rpx;
    background: linear-gradient(132deg, #58A1F6 0%, #6FA9F7 100%);
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
      // background: rgba(0, 0, 0, 0.3);
    }
  }

  // .register-btn {
  //   margin-bottom: 300rpx;
  // }
}

.other-login {
  .line-or {
    width: 468rpx;
    height: 40rpx;
    position: relative;
    text-align: center;
    font-size: 28rpx;
    color: #aaaaaa;
    margin: 0 auto 40rpx;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      z-index: 1;
      height: 1px;
      background: #e4e4e4;
    }

    &::before {
      left: 0;
      right: 60%;
    }

    &::after {
      right: 0;
      left: 60%;
    }
  }

  .login-btns {
    display: flex;
    justify-content: space-around;
  }

  .other-login-btn {
    width: 324rpx;
    line-height: 84rpx;
    border-radius: 20rpx;
    text-align: center;
    font-weight: 600;
    font-size: 28rpx;
    color: #222222;
    // border: 2rpx solid #cccccc;
    // margin-bottom: 300rpx;

    .login-icon {
      vertical-align: middle;
      width: 32rpx;
      height: 32rpx;
      margin-right: 12rpx;
    }

    &.active {
      // background: url("@/static/images/login/last.png'") no-repeat left top;
      // background-size: 58rpx 46rpx;
      border-color: #f38c28;
      position: relative;

      &::before {
        content: "上次";
        font-size: 20rpx;
        color: white;
        position: absolute;
        top: -28rpx;
        left: 12rpx;
        z-index: 2;
      }
    }
  }
}

.main ::v-deep .safe-bottom {
  background: #ffffff;
  position: relative;
  z-index: 2;
  margin-top: -3rpx;
}

.login_image {
  width: 212rpx;
  padding: 90rpx 0 40rpx;
  margin: auto;

  .image {
    width: 212rpx;
  }
}

.get-phone-btn {
  width: 530rpx;
height: 88rpx;
background: linear-gradient( 90deg, #8FBAFF 0%, #438AFB 100%);
box-shadow: 0rpx 14rpx 12rpx 2rpx rgba(118,170,253,0.26);
  border-radius: 50rpx;
  text-align: center;
font-weight: bold;
font-size: 30rpx;
  color: #ffffff;
  line-height: 100rpx;
  margin-top: 50rpx;
}
</style>
