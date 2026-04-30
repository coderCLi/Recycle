<!--
 * @Description: 设置密码, 项目中未使用(未搜到跳转来源), 暂时废弃
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-30 14:38:22
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
        <text class="top-title">请设置密码</text>
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
                <input class="form-control" password placeholder="请输入密码" maxlength="16" v-model="passForm.password" />
                <image
                  class="login-icon-eye"
                  :src="staticBaseUrl + '/hbdimage/main/images/login/eye-close.png'"
                  mode="widthFix"
                  @click="hidePassword = !hidePassword"
                />
              </template>
              <!-- 密码显示 -->
              <template v-else>
                <input class="form-control" placeholder="请输入密码" maxlength="16" v-model="passForm.password" />
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
            <view class="login-form-input">
                <input :password="hideRepeatPassword" class="form-control" placeholder="请再次输入密码" maxlength="16" v-model="passForm.repeatPassword" />
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
  
          <!-- <button :disabled="passForm.password.length === 0 || passForm.repeatPassword.length === 0" class="login-btn" @click="confirmPass">确认</button> -->
          <button class="login-btn" @click="confirmPass">确认</button>
        </view> 
  
        <!-- 协议 -->
        <vc-proto v-model="protoChecked" />
      </view>
        <vc-safe-bottom />
    </view>
  </template>
  <script>
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
            passForm: {
                password: "",
                repeatPassword: ""
            },
            hideRepeatPassword: true,
            hidePassword: true,
          protoChecked: false,
        }
      },
      async onLoad(options) {
        await this.firstInit();
        // console.log('mounted', this.appConfig, this.reg);
        this.redirect = options.redirect ? decodeURIComponent(options.redirect) : '';
      },
      methods: {
        confirmPass() {
          console.log('确认修改密码');
          if(this.passForm.password !== this.passForm.repeatPassword) {
            uni.showToast({
              title: '两次输入的密码不一致',
              icon: 'none'
            });
            return
          }
          if(!this.protoChecked) {
            this.$refs.protoAlert.open("confirmPass");
            return
          }

          this.trackReport.trackCustom("设置密码");

          // 重定向
          if(this.redirect){
            isTabbar(this.redirect) ? uni.switchTab({
              url: this.redirect,
            }) : uni.navigateTo({
              url: this.redirect,
            });
          } else {
            console.log('没有重定向');
            // 回首页
            this.bridgeSdk.toFirstPage()
          }
        },
        agreeAction(openType) {
          this.protoChecked = true;
          if (openType && openType.length > 0) {
            this[openType]();
          }
        }
      }
    } 
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
      color: #FFFFFF;
      line-height: 84rpx;
      text-shadow: 0rpx 0rpx 44rpx #008D8A;
    }
  }
  
  .login-box {
    background: #FFFFFF;
    box-shadow: 0px -26rpx 36rpx 0px #65B6D1;
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
      background: #F0FAF9;
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
      background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
      border-radius: 42rpx;
      font-weight: 600;
      text-align: center;
      font-size: 32rpx;
      color: #FFFFFF;
      transition: opacity 0.3s ease;
      
      &.button-hover {
        opacity: 0.72;
      }
      
      &[disabled]  {
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