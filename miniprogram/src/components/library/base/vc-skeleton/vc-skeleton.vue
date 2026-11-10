<!--
 * @Description: 骨架屏（shimmer 流光动效，无图片资源）
 * 用法：
 *   <vc-skeleton type="home" />          首页骨架
 *   <vc-skeleton type="order" :rows="3"/> 订单列表骨架
-->
<template>
  <view class="vc-skeleton">
    <!-- 首页骨架 -->
    <view v-if="type === 'home'" class="sk-home">
      <view class="sk-hero sk-block"></view>

      <view class="sk-section-title sk-block"></view>
      <view class="sk-grid">
        <view v-for="i in 6" :key="i" class="sk-grid-item">
          <view class="sk-icon sk-block"></view>
          <view class="sk-line sk-block" style="width: 64%"></view>
          <view class="sk-line sk-block short"></view>
        </view>
      </view>

      <view class="sk-section-title sk-block"></view>
      <view class="sk-promise sk-block"></view>

      <view class="sk-section-title sk-block"></view>
      <view class="sk-card sk-block"></view>
    </view>

    <!-- 订单列表骨架 -->
    <view v-else class="sk-order">
      <view v-for="i in rows" :key="i" class="sk-order-item">
        <view class="sk-row">
          <view class="sk-line sk-block" style="width: 44%"></view>
          <view class="sk-line sk-block" style="width: 20%"></view>
        </view>
        <view class="sk-line sk-block" style="width: 88%; margin-top: 18rpx"></view>
        <view class="sk-line sk-block" style="width: 62%; margin-top: 12rpx"></view>
        <view class="sk-thumb sk-block"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "vcSkeleton",
  props: {
    // home：首页；order：订单列表
    type: { type: String, default: "order" },
    // order 类型的行数
    rows: { type: Number, default: 3 },
  },
};
</script>

<style lang="scss" scoped>
@keyframes sk-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.sk-block {
  background: linear-gradient(90deg, #f1f3f5 25%, #e6e9ed 37%, #f1f3f5 63%);
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  border-radius: 8rpx;
}

.sk-line {
  height: 26rpx;
  border-radius: 6rpx;

  &.short {
    width: 40%;
    height: 22rpx;
  }
}

/* ---------- 首页骨架 ---------- */
.sk-home {
  padding: 24rpx;

  .sk-hero {
    height: 300rpx;
    border-radius: 28rpx;
  }

  .sk-section-title {
    width: 180rpx;
    height: 32rpx;
    margin: 40rpx 0 24rpx;
    border-radius: 8rpx;
  }

  .sk-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -6rpx;

    .sk-grid-item {
      width: calc(33.33% - 12rpx);
      margin: 0 6rpx 16rpx;
      padding: 26rpx 0 22rpx;
      background: #fff;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;

      .sk-icon {
        width: 76rpx;
        height: 76rpx;
        border-radius: 20rpx;
        margin-bottom: 16rpx;
      }

      .sk-line {
        margin-bottom: 10rpx;
      }
    }
  }

  .sk-promise {
    height: 170rpx;
    border-radius: 20rpx;
  }

  .sk-card {
    height: 260rpx;
    border-radius: 20rpx;
  }
}

/* ---------- 订单列表骨架 ---------- */
.sk-order {
  .sk-order-item {
    padding: 24rpx 0;
    border-bottom: 2rpx solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .sk-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sk-thumb {
      width: 150rpx;
      height: 150rpx;
      margin-top: 18rpx;
      border-radius: 12rpx;
    }
  }
}
</style>
