<!--
 * @Description: 全局加载组件（纯 CSS 品牌动效，无图片资源）
 * 用法：
 *   <vc-loading />                      区域内居中加载
 *   <vc-loading fullscreen />           全屏遮罩加载
 *   <vc-loading text="正在加载..." />    带文字
-->
<template>
  <view class="vc-loading" :class="{ fullscreen }">
    <view class="loading-box">
      <view class="loader">
        <view class="ring"></view>
        <view class="ring ring-2"></view>
        <view class="core">
          <text class="core-text">回</text>
        </view>
      </view>
      <view v-if="text" class="loading-text">{{ text }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "vcLoading",
  props: {
    // 是否全屏遮罩
    fullscreen: { type: Boolean, default: false },
    // 提示文字（为空则不显示）
    text: { type: String, default: "加载中..." },
  },
};
</script>

<style lang="scss" scoped>
.vc-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 140rpx 0;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    background: rgba(255, 255, 255, 0.96);
    z-index: 999;
  }
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 5rpx solid #dcfce7;
    border-top-color: #16a34a;
    border-right-color: #22c55e;
    animation: vc-spin 0.9s linear infinite;
  }

  .ring-2 {
    width: 88%;
    height: 88%;
    border: 4rpx solid transparent;
    border-bottom-color: rgba(22, 163, 74, 0.45);
    animation: vc-spin-reverse 1.4s linear infinite;
  }

  .core {
    width: 68rpx;
    height: 68rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 18rpx rgba(22, 163, 74, 0.32);
    animation: vc-pulse 1.6s ease-in-out infinite;

    .core-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      line-height: 1;
    }
  }
}

.loading-text {
  margin-top: 26rpx;
  font-size: 26rpx;
  color: #9ca3af;
  letter-spacing: 2rpx;
}

@keyframes vc-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes vc-spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes vc-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
</style>
