<template>
  <view class="mct-com">
    <view class="scroll-info-title">
      <text class="scroll-info-title-text">{{ info.mctName }}</text>
    </view>
    <view class="scroll-info-category">
      省重点科室：<text class="scroll-info-category-text">{{
        info.description
      }}</text>
    </view>
    <view class="scroll-info-address">
      <view class="ellipsis scroll-info-address-view" :style="`${isLocationFail ? 'max-width: none;': ''}`"
        >地址：{{ info.address }}
      </view>
      <!-- 定位成功显示 -->
      <text v-if="!isLocationFail" class="scroll-info-address-text"
        >距您直线距离{{ info.distance ? bridgeSdk.keepOneDecimalPlace(info.distance) : "--" }}km</text
      >
    </view>

    <view class="scroll-info-card" v-if="info.labelName">
      <text
        class="scroll-info-card-text"
        v-for="info in info.labelName.split(',')"
        :key="info"
        >{{ info }}</text
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "mctCom",
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    // 外界不传值，默认是要显示的
    isLocationFail: {
      type: Boolean,
      default: () => (false)
    }
  }
};
</script>

<style scoped lang="scss">
.mct-com {
  width: 100%;

  .scroll-info-title {
    .scroll-info-title-text {
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; //显示几行
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 50rpx;
    }
  }

  .scroll-info-category {
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;

    .scroll-info-category-text {
      line-height: 45rpx;
      margin-left: 10rpx;
    }
  }

  .scroll-info-address {
    display: flex;
    justify-content: space-between;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    line-height: 45rpx;
    .scroll-info-address-view {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      max-width: 60%;
    }

    .scroll-info-address-text {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
    }
  }

  .scroll-info-card {
    margin: 2rpx;
    .scroll-info-card-text {
      background: #ffffff;
      border-radius: 6rpx;
      border: 2rpx solid #00bcb8;
      font-weight: 400;
      font-size: 20rpx;
      color: #00bcb8;
      margin-left: 16rpx;
      padding: 2rpx 10rpx;
      display: inline-block;
    }

    .scroll-info-card-text:first-child {
      margin-left: 0 !important;
    }
  }
}
</style>