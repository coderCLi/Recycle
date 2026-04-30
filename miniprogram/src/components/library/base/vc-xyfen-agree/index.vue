<!--
 * @Description: 信用分服务授权
 * @Author: yuguangquan
 * @Date: 2025-01-07 10:05:23
 * @LastEditors: yuguangquan
 * @LastEditTime: 2025-01-07 10:05:23
 * @Remark: 
-->
<template>
<!-- xyfen-agree.png -->
    <view class="component">
      <u-overlay :show="show" @click="show = false">
        <view class="top-box">
          <view class="top-card" @tap.stop>
            <image style="width: 100%; display: block;" mode="widthFix" class="top-image" :src="staticBaseUrl + '/hbdimage/mine/xyfen-bg.png'" />
            <view class="container-box">
              <text class="title">授权信用保定获取以下信息为你服务</text>
              <view class="detail">获取你的身份信息（姓名、手机号、身份证号）</view>
              <view class="proto-box">
                <image style="width: 33rpx; height: 33rpx; flex-shrink: 0; margin-right: 12rpx;"
                       :src="`${staticBaseUrl}/hbdimage/main/images/login/${isAgree ? 'proto-checked.png' : 'proto-default.png'}`" model="aspectFit" 
                       @click="isAgree = !isAgree"/>
                <view class="proto-wrap">已阅读并同意<span class="proto" @click="toProto">《保定市个人诚信用分开通及查询授权协议》</span></view>
              </view>
              <view class="control-box">
                <view class="cancel" @click="show = false">不同意</view>
                <view class="agree" @click="agreeAction">确认授权</view>
              </view>
            </view>
          </view>
        </view>

      </u-overlay>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "信用分服务授权",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                show: false,
                isAgree: false,
                falseValue: false
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },

        methods: {
          open() {
            this.isAgree = false;
            this.show = true;
          },
          shutdown() {
            this.show = false;
          },
          agreeAction(){
            if (!this.isAgree) {
              uni.showToast({
                title: '请勾选同意',
                icon: 'none',
                duration: 2000
              })
              return;
            }
            this.$emit("agree");
            this.show = false;
          },
          toProto() {
            this.bridgeSdk.jumpPage({
              url: this.minioBaseUrl + 'hbdbucket/home/micro/hbd/agreement/protocolXYF-mini.html?title=保定市个人诚信用分开通及查询授权协议',
              title: '保定市个人诚信用分开通及查询授权协议'
            })
          }
        },
    }
</script>

<style lang="scss" scoped>
.top-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.top-card {
  display: block;
  width: 616rpx;
  // background: url("https://life.hihihi.com.cn/img/kapianbeijing.13052b1a.png") no-repeat;
  background-size: cover;
  box-sizing: border-box;
  border-radius: 36rpx;
  background-color: #ffffff;
  .container-box {
    padding: 40rpx 32rpx 44rpx 36rpx;
    .title {
      font-weight: 600;
      font-size: 32rpx;
      color: #333333;
    }
    .detail {
      margin-top: 20rpx;
      margin-right: -32rpx;
      font-weight: 400;
      font-size: 27rpx;
      color: #333333;
    }
    .proto-box {
      margin-top: 20rpx;
      padding-right: 12rpx;
      display: flex;
      .proto-wrap {
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        .proto {
          color: #00BDB8;
        }
      }
    }
    .control-box {
      margin-top: 44rpx;
      display: flex;
      justify-content: space-between;
      .cancel {
        width: 260rpx;
        height: 84rpx;
        line-height: 84rpx;
        background: #FFFFFF;
        border-radius: 42rpx;
        border: 2rpx solid #999999;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        text-align: center;
      }
      .agree {
        width: 260rpx;
        height: 84rpx;
        line-height: 84rpx;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
        border-radius: 42rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #FFFFFF;
        text-align: center;
      }
    }
  }
}
</style>
