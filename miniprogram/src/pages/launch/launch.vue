<!--
 * @Description: 开屏启动页（首次进入需点击「开启富区回收」才进入首页）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view class="launch">
    <!-- 物品漂浮区 -->
    <view class="stage">
      <view
        v-for="(item, i) in floats"
        :key="i"
        class="float-item"
        :class="'item-' + i"
      >
        {{ item }}
      </view>
      <view class="box">📦</view>
    </view>

    <view class="brand">富区回收</view>
    <view class="slogan">旧家电 · 免费上门 · 当场结款</view>

    <view class="start-btn" @click="start">
      <text class="btn-text">开启富区回收</text>
      <text class="arrow">→</text>
    </view>

    <view class="tips">点击开启，30 秒估价，免费上门回收</view>
  </view>
</template>

<script>
export default {
  name: "launch",
  data() {
    return {
      // 用 emoji 呈现回收品类，零体积且彩色
      floats: ["🧊", "🧺", "❄️", "📺", "💻", "🔌", "📻", "🖥️"],
    };
  },
  onLoad() {
    // 已开启过 → 直接进入首页，不再停留
    if (this.bridgeSdk.getStorageSync("app_launched")) {
      // 延后一帧，避免页面栈未就绪时跳转失败
      setTimeout(() => {
        uni.switchTab({ url: "/pages/home/home" });
      }, 0);
    }
  },
  methods: {
    start() {
      // 记录已开启状态，后续启动直接进首页
      this.bridgeSdk.setStorageSync("app_launched", true);
      uni.switchTab({ url: "/pages/home/home" });
    },
  },
};
</script>

<style lang="scss" scoped>
.launch {
  width: 750rpx;
  height: 100vh;
  background: linear-gradient(180deg, #fef9e7 0%, #f0fdf4 55%, #ecfdf5 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 60rpx;
}

.stage {
  position: relative;
  width: 560rpx;
  height: 560rpx;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 48rpx;
  box-shadow: 0 20rpx 60rpx rgba(22, 163, 74, 0.08);
  margin-bottom: 56rpx;

  .float-item {
    position: absolute;
    font-size: 66rpx;
    animation: float 3s ease-in-out infinite;
  }

  .item-0 {
    top: 46rpx;
    left: 70rpx;
    animation-delay: 0s;
  }
  .item-1 {
    top: 66rpx;
    left: 250rpx;
    animation-delay: 0.4s;
  }
  .item-2 {
    top: 52rpx;
    right: 74rpx;
    animation-delay: 0.8s;
  }
  .item-3 {
    top: 192rpx;
    left: 52rpx;
    animation-delay: 1.2s;
  }
  .item-4 {
    top: 184rpx;
    left: 248rpx;
    animation-delay: 0.6s;
  }
  .item-5 {
    top: 200rpx;
    right: 62rpx;
    animation-delay: 1s;
  }
  .item-6 {
    top: 326rpx;
    left: 92rpx;
    animation-delay: 1.4s;
  }
  .item-7 {
    top: 336rpx;
    right: 100rpx;
    animation-delay: 0.2s;
  }

  .box {
    position: absolute;
    bottom: 34rpx;
    left: 50%;
    font-size: 138rpx;
    animation: box-bounce 2.4s ease-in-out infinite;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-16rpx);
  }
}

@keyframes box-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-12rpx);
  }
}

.brand {
  font-size: 62rpx;
  font-weight: bold;
  color: #111827;
  letter-spacing: 6rpx;
}

.slogan {
  margin-top: 20rpx;
  font-size: 27rpx;
  color: #6b7280;
  letter-spacing: 2rpx;
}

.start-btn {
  margin-top: 76rpx;
  width: 560rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(22, 163, 74, 0.28);

  .btn-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    letter-spacing: 2rpx;
  }

  .arrow {
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #fff;
  }
}

.tips {
  margin-top: 30rpx;
  font-size: 22rpx;
  color: #9ca3af;
}
</style>
