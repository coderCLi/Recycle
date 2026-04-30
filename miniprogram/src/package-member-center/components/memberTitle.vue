<template>
  <div class="member-title">
    <view class="member-title-left">
      <view class="member-title-big">{{ bigText }}</view>
      <view class="member-title-middle"></view>
      <view class="member-title-small">{{ smallText }}</view>
    </view>
    <view class="member-title-right" v-if="rightText">
      <view class="member-title-content">{{ rightText + ">" }}</view>
    </view>
  </div>
</template>

<script>
export default {
  props: {
    bigText: {
      type: String,
      default: "",
    },
    smallText: {
      type: String,
      default: "",
    },
    rightText: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss">
.member-title {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 40rpx;
  .member-title-left {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    flex-wrap: wrap;
    .member-title-big {
      font-size: 36rpx;
      color: #333333;
      font-weight: bold;
      margin-right: 10rpx;
      line-height: 36rpx;
    }
    .member-title-middle {
      width: 4rpx;
      height: 36rpx;
      background-color: #333333;
      margin-right: 10rpx;
    }
    .member-title-small {
      font-size: 28rpx;
      color: #333333;
      font-weight: 600;
      line-height: 28rpx;
    }
  }
  .member-title-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: #999999;
    font-size: 24rpx;
  }
}
</style>