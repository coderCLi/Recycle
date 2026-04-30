<!--
 * @Description: 修改密码
 * @Author: yuguangquan
 * @Date: 2024-12-24 13:20
-->
<template>
    <vc-modal ref="modal"></vc-modal>
  <view class="main">
    <!-- <vc-status-bar /> -->

    <view class="login-bg">
      <vc-back />
      <image
        class="top-bg-img"
        :src="staticBaseUrl + '/hbdimage/main/images/login/top-bg.png'"
        mode="widthFix"
      />
      <text class="top-title">请为您的账号重设密码</text>
    </view>

    <view class="login-box">
      <view class="login-form">
        <view class="login-input">
          <image
            :src="staticBaseUrl + '/hbdimage/main/images/login/password.png'"
            mode="widthFix"
            class="login-icon"
          />
          旧密码
        </view>
        <view class="login-form-input">
          <!-- 密码隐藏 -->
          <template v-if="hideOldPassword">
            <input
              class="form-control"
              password
              placeholder="请输入旧密码"
              maxlength="16"
              v-model="passForm.oldPassword"
            />
            <image
              class="login-icon-eye"
              :src="staticBaseUrl + '/hbdimage/main/images/login/eye-close.png'"
              mode="widthFix"
              @click="hideOldPassword = !hideOldPassword"
            />
          </template>
          <!-- 密码显示 -->
          <template v-else>
            <input
              class="form-control"
              placeholder="请输入旧密码"
              maxlength="16"
              v-model="passForm.oldPassword"
            />
            <image
              class="login-icon-eye"
              :src="staticBaseUrl + '/hbdimage/main/images/login/eye-open.png'"
              mode="widthFix"
              @click="hideOldPassword = !hideOldPassword"
            />
          </template>
        </view>
        <view class="login-input">
          <image
            :src="staticBaseUrl + '/hbdimage/main/images/login/password.png'"
            mode="widthFix"
            class="login-icon"
          />
          新密码
        </view>
        <view class="login-form-input">
          <!-- 密码隐藏 -->
          <template v-if="hidePassword">
            <input
              class="form-control"
              password
              maxlength="16"
              placeholder="请输入新密码（包含数字、字母、特殊字符）"
              v-model="passForm.password"
            />
            <image
              class="login-icon-eye"
              :src="staticBaseUrl + '/hbdimage/main/images/login/eye-close.png'"
              mode="widthFix"
              @click="hidePassword = !hidePassword"
            />
          </template>
          <!-- 密码显示 -->
          <template v-else>
            <input
              class="form-control"
              maxlength="16"
              placeholder="请输入新密码（包含数字、字母、特殊字符）"
              v-model="passForm.password"
            />
            <image
              class="login-icon-eye"
              :src="staticBaseUrl + '/hbdimage/main/images/login/eye-open.png'"
              mode="widthFix"
              @click="hidePassword = !hidePassword"
            />
          </template>
        </view>

        <view class="login-input">
          <image
            :src="staticBaseUrl + '/hbdimage/main/images/login/password.png'"
            mode="widthFix"
            class="login-icon"
          />
          确认密码
        </view>
        <view class="login-form-input" style="margin-bottom: 16rpx;">
          <input
            :password="hideRepeatPassword"
            class="form-control"
            maxlength="16"
            placeholder="请再次输入新密码"
            v-model="passForm.repeatPassword"
          />
          <!-- 密码隐藏 -->
          <template v-if="hideRepeatPassword">
            <image
              class="login-icon-eye"
              :src="staticBaseUrl + '/hbdimage/main/images/login/eye-close.png'"
              mode="widthFix"
              @click="hideRepeatPassword = !hideRepeatPassword"
            />
          </template>
          <!-- 密码显示 -->
          <template v-else>
            <image
              class="login-icon-eye"
              :src="staticBaseUrl + '/hbdimage/main/images/login/eye-open.png'"
              mode="widthFix"
              @click="hideRepeatPassword = !hideRepeatPassword"
            />
          </template>
        </view>
        <view class="password-tip">
          <view style="display: inline-flex; align-items: center; height: 34rpx;">
            <image :src="minioBaseUrl + passwordtippng" class="tip-image"></image>
          </view>
          密码长度8-16位，包含数字、字母、符号至少2种或以上元素
        </view>
        <!-- <button
          :disabled="
            passForm.oldPassword.length === 0 ||
            passForm.password.length === 0 ||
            passForm.repeatPassword.length === 0
          "
          class="login-btn"
          @click="confirmPass"
        >
          提交
        </button> -->
        <button
          class="login-btn"
          @click="confirmPass"
        >
          提交
        </button>
      </view>

      <!-- 协议 -->
      <!-- <vc-proto v-model="protoChecked" /> -->
    </view>
    <vc-safe-bottom />
  </view>
</template>
  <script>
import { requestToken } from "@/api/requestToken";
import { resetPassword } from "@/api/login";
// import vcProto from "@/components/library/base/vc-proto/index.vue";
import { isTabbar } from "@/utils";
export default {
  name: "loginedit",
  components: {
    // vcProto,
  },
  data() {
    return {
      passwordtippng: 'common/hbdbucket/static/passwordtip.png',
      passForm: {
        oldPassword: "",
        password: "",
        repeatPassword: "",
      },
      hideOldPassword: true,
      hidePassword: true,
      hideRepeatPassword: true
    //   protoChecked: false,
    };
  },
  async onLoad(options) {
    await this.firstInit();
    // console.log('mounted', this.appConfig, this.reg);
    this.redirect = options.redirect
      ? decodeURIComponent(options.redirect)
      : null;
    
  },
  methods: {
    confirmPass() {
      console.log("路由");
      console.dir(this.$route);
      console.dir(this.$router);
      console.log("确认修改密码");
    //   if (!this.protoChecked) {
    //     uni.showToast({
    //       title: "请同意用户协议",
    //       icon: "none",
    //     });
    //     return;
    //   }
      if (!this.passForm.oldPassword || this.passForm.oldPassword.length == 0) {
        uni.showToast({
          title: "请输入旧密码",
          icon: "none",
        });
        return;
      }
      if (!this.passForm.password || this.passForm.password.length == 0) {
        uni.showToast({
          title: "请输入新密码",
          icon: "none",
        });
        return;
      }
      if (!this.passForm.repeatPassword || this.passForm.repeatPassword.length == 0) {
        uni.showToast({
          title: "请输入确认密码",
          icon: "none",
        });
        return;
      }
      if (this.passForm.password !== this.passForm.repeatPassword) {
        uni.showToast({
          title: "两次输入的密码不一致",
          icon: "none",
        });
        return;
      }
      if (!this.reg.checkPass(this.passForm.password)) {
        this.bridgeSdk.showToast({title: this.reg.passHint + this.reg.passRule, duration: 3000});
        return;
      }

      this.trackReport.trackCustom("修改密码");

      uni.showLoading({
        title: "修改密码...",
      });
      resetPassword({
        oldPassword: this.passForm.oldPassword,
        password: this.passForm.password,
        checkPassword: this.passForm.repeatPassword,
      })
        .then((res) => {
          uni.hideLoading();
          // 重定向
          if (this.redirect) {
            isTabbar(this.redirect)
              ? uni.switchTab({
                  url: this.redirect,
                })
              : uni.navigateTo({
                  url: this.redirect,
                });
          } else {
            this.bridgeSdk.clearToken();
            this.bridgeSdk.clearUserInfo();
            this.bridgeSdk.logout((b) => {
              if (b) { requestToken(); }
              setTimeout(res=> {
                uni.showToast({
                    icon: 'none',
                    title: "修改密码成功"
                })
              }, 300);
            }, false)
          }
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
  },
};
</script>
  
<style lang="scss" scoped>
.main {
    min-height: 100vh;
    background: #ffffff;
}

.login-bg {
  position: relative;
  height: 380rpx;

  .top-bg-img {
    width: 100%;
  }

  .top-title {
    position: absolute;
    top: 219rpx;
    left: 30rpx;
    z-index: 1;
    font-weight: bold;
    font-size: 60rpx;
    color: #ffffff;
    line-height: 84rpx;
    text-shadow: 0rpx 0rpx 44rpx #008d8a;
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
  box-shadow: 0px -26rpx 26rpx 0px #65b6d1;
  border-radius: 60rpx 60rpx 0rpx 0rpx;
  backdrop-filter: blur(10rpx);
  padding-top: 40rpx;
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
  }

  .login-btn {
    margin-top: 129rpx;
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
</style>