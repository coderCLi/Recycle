<!--
 * @Description: 关于我们（富区回收）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="about">

        <!-- 品牌 -->
        <view class="brand">
          <view class="logo">富</view>
          <view class="brand-name">富区回收</view>
          <view class="brand-slogan">手机 · 电脑 · 家电 上门回收</view>
        </view>

        <!-- 简介 -->
        <view class="card">
          <view class="card-title">关于我们</view>
          <view class="card-text">
            富区回收专注于手机、电脑、家电等旧物回收。我们提供在线估价、免费上门、
            当面验机、当场结款的一站式服务，让闲置旧物快速变现，省心省力。
          </view>
        </view>

        <!-- 服务承诺 -->
        <view class="card">
          <view class="card-title">服务承诺</view>
          <view class="item"><text class="dot"></text>免费上门，无需出门</view>
          <view class="item"><text class="dot"></text>当面估价，价格透明</view>
          <view class="item"><text class="dot"></text>验机即付，当场结款</view>
          <view class="item"><text class="dot"></text>数据清除，隐私保密</view>
        </view>

        <!-- 联系方式 -->
        <view class="card">
          <view class="card-title">联系我们</view>
          <view class="item link" @click="call">电话：13130009661</view>
          <view class="item">微信：「我的」→「联系我们」→ 长按二维码图片识别添加</view>
        </view>

        <view class="version">富区回收 v1.0.0</view>

        <vc-safe-bottom />
      </view>
    </vc-container>
  </view>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "关于我们" },
          isFullScreen: { value: true },
          backgroundColor: { value: "#f5f6f8" },
        },
      },
    };
  },
  methods: {
    call() {
      this.bridgeSdk.makePhoneCall({ phoneNumber: "13130009661" });
    },
  },
};
</script>

<style lang="scss" scoped>
.about {
  width: 750rpx;
  min-height: 100vh;
  background: #f5f6f8;
  box-sizing: border-box;
  padding-bottom: 40rpx;
}

.brand {
  padding: 60rpx 0 50rpx;
  text-align: center;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

  .logo {
    width: 130rpx;
    height: 130rpx;
    margin: 0 auto 24rpx;
    border-radius: 30rpx;
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
    font-size: 64rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-size: 42rpx;
    font-weight: bold;
    color: #fff;
  }
  .brand-slogan {
    margin-top: 12rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

.card {
  margin: 24rpx;
  padding: 30rpx 28rpx;
  background: #fff;
  border-radius: 20rpx;

  .card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 18rpx;
  }
  .card-text {
    font-size: 27rpx;
    color: #4b5563;
    line-height: 46rpx;
  }
  .item {
    display: flex;
    align-items: center;
    padding: 12rpx 0;
    font-size: 27rpx;
    color: #374151;

    &.link {
      color: #2563eb;
    }
    .dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: #22c55e;
      margin-right: 16rpx;
      flex-shrink: 0;
    }
  }
}

.version {
  margin-top: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
