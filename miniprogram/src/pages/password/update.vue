<!--
 * @Description: 重设密码
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-30 14:39:03
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-proto-alert ref="protoAlert" @agree-action="agreeAction"></vc-proto-alert>
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
          密码
        </view>
        <view class="login-form-input">
          <!-- 密码隐藏 -->
          <template v-if="hidePassword">
            <input
              class="form-control"
              password
              placeholder="请输入密码（包含数字、字母、特殊字符）"
              maxlength="16"
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
              placeholder="请输入密码（包含数字、字母、特殊字符）"
              maxlength="16"
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
            placeholder="请再次输入密码"
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
            passForm.password.length === 0 ||
            passForm.repeatPassword.length === 0
          "
          class="login-btn"
          @click="confirmPass"
        >
          确认
        </button> -->
        <button
          class="login-btn"
          @click="confirmPass"
        >
          确认
        </button>
      </view>

    </view>
    <view class="bottom-box">
        <!-- 协议 -->
        <view class="proto-box"><vc-proto v-model="protoChecked" /></view>
        <vc-safe-bottom />
    </view>
  </view>
</template>
  <script>
import { forgetPassword } from "@/api/login";
import vcProto from "@/components/library/base/vc-proto/index.vue";
import vcProtoAlert from "@/components/library/base/vc-proto-alert/index.vue";
import { isTabbar } from "@/utils";
export default {
  name: "login",
  components: {
    vcProto,
    vcProtoAlert
  },
  data() {
    return {
      passwordtippng: 'common/hbdbucket/static/passwordtip.png',
      passForm: {
        password: "",
        repeatPassword: "",
      },
      hidePassword: true,
      hideRepeatPassword: true,
      protoChecked: false,
      phone: null,
      code: null,
      fromType: null,
    };
  },
  async onLoad(options) {
    await this.firstInit();
    // console.log('mounted', this.appConfig, this.reg);
    this.redirect = options.redirect
      ? decodeURIComponent(options.redirect)
      : null;
    this.code = options.code || "";
    this.passCode = options.passcode || "";
    this.fromType = options.fromtype
      ? decodeURIComponent(options.fromtype)
      : null;
    this.phone = options.phone || "";
  },
  methods: {
    confirmPass() {
      console.log("路由");
      console.dir(this.$route);
      console.dir(this.$router);
      console.log("确认修改密码");
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
      if (!this.protoChecked) {
        this.$refs.protoAlert.open("confirmPass");
        return;
      }

      this.trackReport.trackCustom("修改密码");
      // this.trackReport.trackCustom("修改密码-确认修改");

      uni.showLoading({
        title: "修改密码...",
      });
      forgetPassword({
        mobile: this.phone,
        passCode: this.passCode,
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
            if (this.fromType === "forgetpassword") {
              setTimeout(()=> {
                uni.showToast({title: "重置密码成功", duration: 2000, icon: "none"});
              }, 300);
              this.bridgeSdk.navigateBackTo({
                delta: 2,
              });
            } else {
              this.bridgeSdk.toFirstPage()
            }
          }
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    agreeAction(openType) {
      this.protoChecked = true;
      if (openType && openType.length > 0) {
        this[openType]();
      }
    }
  },
};
</script>
  
  <style lang="scss" scoped>
.bottom-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  // .proto-box {
  //   display: flex;
  //   justify-content: center;
  // }
}
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
  box-shadow: 0px -26rpx 36rpx 0px #65b6d1;
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