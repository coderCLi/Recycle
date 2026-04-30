<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="logoff">
    <view class="logoffBox">
      <view class="title"> 注销账号前请您仔细阅读以下重要信息! </view>
      <view class="title"> 提交账号注销申请为不可逆的操作! </view>
      <view class="content">
        为保证您的账号安全，并保障正常的的社会公共秩序，在您提交大连海创嗨创生活账号注销前，请先确认以下信息:
      </view>
      <view class="content"> 1、您提交账号注销请求的为您本人。 </view>
      <view class="content">
        2、您是通过常用的安全设备向我方提交账号注销申请。
      </view>
      <view class="content">
        3、您的账号不处于国家机关调查或正处于诉讼仲裁程序中。
      </view>
      <view class="content">
        <view class="proto-box">
          <view
            class="proto"
            :class="{ active: modelValue }"
            :style="`background: url(${staticBaseUrl}/hbdimage/main/images/login/${modelValue ? 'proto-checked.png' : 'proto-default.png'}) no-repeat left top; background-size: 32rpx 32rpx`"
            @click="protoClick"
            >我已知悉并接受以上账号注销的说明</view
          >
        </view>
      </view>
      <view class="bottomBox">
        <view class="buttonBox">
          <up-button
            class="confirmbtn"
            type="primary"
            text="确定"
            @click="submitForm"
            shape="circle"
          ></up-button>
        </view>
        <view class="tipsBox" @click="cancel">我再想想</view>
      </view>
    </view>
  </vc-container>
</template>

<script>
import { logoff } from "@/api/login";
export default {
  name: "logoff",
  data() {
    return {
      modelValue: false,
    };
  },
  methods: {
    protoClick() {
      this.modelValue = !this.modelValue;
    },
    submitForm() {
      console.log("提交注销申请");
      if (!this.modelValue) {
        uni.showToast({
          title: "请确认已知悉并接受以上账号注销的说明",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      this.trackReport.trackCustom("提交注销申请");

      uni.showLoading({
        title: "请求中...",
      });
      logoff({})
        .then(() => {
          uni.hideLoading();
          this.bridgeSdk.jumpPage({
            url: "/pages/logoff/logoffResult",
            openType: "redirectTo"
          });
        })
        .catch(() => {
          uni.hideLoading();
          uni.showToast({
            title: "网络异常，请稍后重试",
            icon: "none",
          });
        });
    },
    cancel() {
      console.log("取消注销申请");
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.logoff {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  .logoffBox {
    width: 100%;
    // height: 100vh;
    box-sizing: border-box;
    padding: 20rpx 40rpx 0;
    // background: #ffffff;

    .title {
      width: 100%;
      font-size: 28rpx;
      font-weight: 600;
      padding: 10rpx 0;
    }
    .content {
      width: 100%;
      font-size: 28rpx;
      padding: 10rpx 0;
    }
    .proto-box {
      display: flex;
      // justify-content: center;
      padding-bottom: 40rpx;
      // margin-top: 246rpx;
      margin-top: 50rpx;
    }

    .proto {
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 36rpx;
      padding-left: 44rpx;
      // background: url("@/static/images/login/proto-default.png") no-repeat left top;
      background-size: 32rpx 32rpx;

      &.active {
        // background: url("@/static/images/login/proto-checked.png") no-repeat left top;
        background-size: 32rpx 32rpx;
      }
    }
    .bottomBox {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 750rpx;
      box-sizing: border-box;
      padding: 0 40rpx;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      .buttonBox {
        width: 100%;
      }
      .tipsBox {
        padding: 20rpx 40rpx;
        font-size: 24rpx;
        color: #666666;
      }
    }
  }
  .confirmbtn {
    background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #ff5871;
    border-radius: 10px;
    color: #fff;
    border-color: transparent;
  }
}
</style>
