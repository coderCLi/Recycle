<!--
 * @Author: songjuncheng
 * @Date: 2025-05-23 20:08:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-06-17 11:49:04
 * @Description: 求职者实名认证
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="page-wrap">
      <view class="bgbox">
    <view class="titleBox" :style="{'paddingTop': safeBoxHeight + 'rpx'}">
      <vc-back :propsData="{ props: { color: { value: '#222222' } } }" />
        <view class="title">
          <view class="tt">实名认证</view>
        </view>
        <view class="subTitle-cont">
            <up-icon name="info-circle" :size="14" color="#00BCB8" style="display: inline-block;"></up-icon>
            认证功能全时间段开放
          </view>
        <!-- <view class="subtitle">为保证你的信息准确，需要完成实名认证</view> -->
        <view class="formBox">
        <view class="form-item">
          <view class="label">姓名</view>
          <u-input v-model="loginFormByCode.realName" placeholder="请输入真实姓名" border="none" input-align="left"></u-input>
        </view>

        <view class="form-item">
          <view class="label">身份证号</view>
          <u-input v-model="loginFormByCode.idNumber" maxlength="18" placeholder="请输入身份证号" border="none" input-align="left"></u-input>
        </view>
      </view>
    </view>
 </view>

      <view class="warning-section">
        <text class="warning-text">温馨提示：请务必使用本人真实信息进行实名认证！若代他人认证，该账号产生的一切风险将由实际使用者承担，详见</text>
        <text class="link-text" @click="toxieyi()">《大连海创嗨创生活用户协议》</text>
        <text class="warning-text">及</text>
        <text class="link-text" @click="toprivacy()">《大连海创嗨创生活隐私政策》</text>
      </view>

      <button class="submit-button" @click="submitApplication">提交认证</button>
    </view>
</template>

<script>
import { realName } from '@/api/login'
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";
export default {
  name: 'renzheng-auth',
  data() {
    return {
      loginFormByCode: {
        idNumber: "",
        realName: "",
        channelType: ""
      },
    };
  },
 async onLoad(options){
    this.channelType = await this.bridgeSdk.getChannel()
    console.log('channelType',this.channelType);
  },
  computed:{
      ...mapState(useBaseStore, {
          navigationBarInfo: "navigationBarInfo",
          safeTopDistance: 'safeTopDistance',
          }),
      // 页面高度
      safeBoxHeight() {
          console.log('安全距离',this.safeTopDistance);
          let val = this.safeTopDistance;
          const rpxVal = this.px2rpx(val)
          return rpxVal;
          }
  },
  methods: {
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
        if (!this.reg.checkIdNew(this.loginFormByCode.idNumber)) {
          uni.showToast({
            title: "请输入正确的身份证号",
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
            console.log('==认证成功，开始更新用户信息==');   
            await this.bridgeSdk.updateUserInfo();
            console.log('==更新用户信息结束==');
            this.bridgeSdk.toFirstPage()
          }).catch(error=>{
            console.log(error,'返回错误信息');        
            this.bridgeSdk.showAlert({
              content: error.message,
              confirmText: "我知道了",
              confirmCallback: (res) => {
                console.log("点击确认", res);
              }
            });
          })
        }
      });
    },
    toprivacy() {
            if (this.channelType == 'mini') {
                this.bridgeSdk.jumpPage({
                    url: this.minioBaseUrl+ 'hbdbucket/home/micro/hbd/agreement/privacy-mini.html',
                    title: '隐私政策'
                })
            } else {
                this.bridgeSdk.openOuterPage({
                    url: this.minioBaseUrl+ 'hbdbucket/home/micro/hbd/agreement/privacy-mini.html',
                    title: '隐私政策'
                })
            }

        },
        toxieyi() {
            if (this.channelType == 'mini') {
                this.bridgeSdk.jumpPage({
                    url: this.minioBaseUrl+ 'hbdbucket//home/micro/hbd/agreement/user_agree-mini.html',
                    title: '用户服务协议'
                })
            } else {
                this.bridgeSdk.openOuterPage({
                    url: this.minioBaseUrl+ 'hbdbucket//home/micro/hbd/agreement/user_agree-mini.html',
                    title: '用户服务协议'
                })
            }

        },
      // 转换px为rpx
      px2rpx (px) {
          let scale = uni.upx2px(100) / 100;
          return px / scale;
      },
  },
}
</script>

<style lang="scss" scoped>
.page-wrap {
  height: calc(100vh);
  background-color: #F6F7FB ;
  overflow: auto;
  position:relative;
}
.bgbox {
  background: linear-gradient( 180deg, #C6EEF6 0%, #F6F7FB 100%);
}
.titleBox {
  width: 100%;
  padding:0 60rpx;
  box-sizing: border-box;
  overflow: hidden;
}
 .title {
  font-size: 64rpx;
  color: #333333;
  font-style: normal;
  font-weight:600;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  margin-top: 76rpx;
  
  .tt{
    text-align: left;
  }
}

.subtitle {
  font-weight: bold;
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
  text-align: left;
  margin-top: 12rpx;
}
.subTitle-cont{
  font-weight: bold;
  font-size: 28rpx;
  color: #00BCB8;
  margin-top: 12rpx;
}
.formBox{
  overflow: hidden;
}
.form-item {
  margin-top: 60rpx;
  border-bottom: 2rpx solid #E3E3E3;
  padding-bottom: 30rpx;

  .label {
    font-weight: 600;
    font-size: 36rpx;
    color: #222222;
    margin-bottom:28rpx;
  }

  .u-input {
    flex: 1;
  }
}

.warning-section {
  padding: 0 62rpx;
  margin-top: 34rpx;
  font-size: 24rpx;
  color: #999; // Adjust color to match screenshot if different
  line-height: 1.5; // Improve readability

  .warning-text {
      display: inline;
  }

  .link-text {
    color: #00BCB8 ; // Assuming a standard link color
    display: inline;
  }
}

.submit-button {
  width: 668rpx;
  height: 84rpx;
  background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
  border-radius: 42rpx;
  color:#fff;
  position: fixed;
  bottom: 70rpx;
  left: 50%;
  transform: translateX(-50%);
}
</style> 