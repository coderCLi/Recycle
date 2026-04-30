<template>
  <view class="member-header">
    <view class="member-header-line member-header-line1"></view>
    <view class="member-header-line member-header-line2"></view>
    <view class="member-header-main"></view>
    <view class="member-header-line member-header-line3"></view>
    <view class="member-header-line member-header-line4"></view>
    <view class="member-header-container">
      <view class="member-header-container-left">
        <view v-if="level > 0" class="small-dot"></view>
      </view>
      <view class="member-header-container-center">
        <view class="member-header-container-center-title">会员</view>
        <view class="default-dot"></view>
      </view>
      <view class="member-header-container-right">
        <view v-if="level < allLevel" class="small-dot">
          <view class="small-dot-lock"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "memberHeader",
  data() {
    return {};
  },
  props: {
    level: {
      type: Number,
      default: 0,
    },
    allLevel: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped lang="scss">
.member-header {
  width: 750rpx;
  height: 130rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .member-header-main {
    width: 1000rpx;
    height: 260rpx;
    border-bottom: 4px solid;
    border-color: #e7f1f9;
    border-radius: 100%;
    position: absolute;
    bottom: 34rpx;
  }
  .member-header-line {
    width: 1000rpx;
    height: 260rpx;
    border-bottom: 2px solid;
    border-color: #e7f1f9;
    border-radius: 100%;
  }
  .member-header-line1 {
    position: absolute;
    bottom: 60rpx;
  }
  .member-header-line2 {
    position: absolute;
    bottom: 50rpx;
  }
  .member-header-line3 {
    position: absolute;
    bottom: 20rpx;
  }
  .member-header-line4 {
    position: absolute;
    bottom: 10rpx;
  }

  .member-header-container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .small-dot{
      width: 20rpx;
      height: 20rpx;
      border-radius: 100%;
      background: #ff0000;
      position: relative;
      .small-dot-lock{
          width: 20rpx;
          height: 20rpx;
          border-radius: 100%;
          background: #fff;
          position: absolute;
          top: -20rpx;
          right: -10rpx;
      }
    }
    .member-header-container-left{
      width: 40rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .member-header-container-center{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .member-header-container-center-title{
        padding: 10rpx 20rpx;
        border-radius: 60rpx;
        background: #ff0000;
        position: relative;
      }
      .member-header-container-center-title::after{
        border-top: #ff0000 solid 2rpx;
        border-left: transparent solid 20rpx;
        border-right: transparent solid 20rpx;
        position: absolute;
        bottom: -20rpx;
        left: 50%;

      }
      .default-dot{
        width: 40rpx;
        height: 40rpx;
        border-radius: 100%;
        background: #ff0000;
        position: relative;
      }
    }
  }
}
</style>
