<template>
  <view class="container safe-area-top">
    <view class="header">
      <view class="header-left" @click="handleBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">二维码</text>
      <view class="header-right"></view>
    </view>

    <view class="member-code-container">
      <view class="member-code-box">
        <view class="member-code-body">
          <view class="member-code-body-title">
            添加微信，了解更多回收信息
          </view>
          <view class="member-code-body-code">
            <image class="member-code-body-code-image" :src="qrCodeUrl" mode="aspectFit">
            </image>
          </view>
          <view class="member-code-body-desc">
            <text>联系人微信二维码</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-tip">
      <text class="tip-text">长按识别二维码，关注公众号获取更多优惠</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { bridgeSdk } from '@/utils/bridge'

const qrCodeUrl = ref('https://neeko-copilot.bytedance.net/api/text_to_image?prompt=QR%20code%20simple%20clean%20white%20background%20professional%20design&image_size=square')

const handleBack = () => {
  bridgeSdk.navigateBack()
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #aae1f5 0%, #ffffff 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background: rgba(255, 255, 255, 0.8);
  
  .header-left {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back-icon {
      font-size: 48rpx;
      color: #333333;
    }
  }
  
  .header-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333333;
  }
  
  .header-right {
    width: 80rpx;
  }
}

.member-code-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80rpx;
}

.member-code-box {
  width: 658rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0rpx 8rpx 24rpx rgba(0, 0, 0, 0.1);
  padding: 40rpx;

  .member-code-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .member-code-body-title {
      font-size: 28rpx;
      color: #333333;
      font-weight: 500;
      margin-bottom: 30rpx;
    }

    .member-code-body-code {
      width: 300rpx;
      height: 300rpx;
      background: #f5f5f5;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20rpx;

      .member-code-body-code-image {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
      }
    }

    .member-code-body-desc {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

.bottom-tip {
  padding: 40rpx 32rpx;
  text-align: center;
  
  .tip-text {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.6;
  }
}
</style>