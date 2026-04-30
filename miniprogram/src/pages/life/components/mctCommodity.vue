<template>
  <view class="mct-com">

    <view class="scroll-img">
      <image :src="minioBaseUrl + info.listPicUrl" mode="scaleToFill" style="width: 200rpx;height: 200rpx;border-radius: 20rpx;"></image>
    </view>

    <view class="scroll-box">

      <view class="scroll-info-title">
        <text class="scroll-info-title-text">{{info.spuName}}</text>
      </view>
      <view class="scroll-info-title">
        <text class="scroll-info-title-text2">{{info.description}}</text>
      </view>
      <view class="scroll-info-category">
        <view>
          <!-- <span style="margin-right: 10rpx;">可预约</span>
          <span>竞秀TOP1</span> -->
        </view>
        <view>
          <span style="color: #FF1F1F; font-size: 28rpx; margin-right: 10rpx;font-weight: 600;">￥{{ info.price }}</span>
          <!-- <span style="text-decoration: line-through;">￥150</span> -->
        </view>
      </view>
    </view>
  </view>

  <view class="mct-com-bottom">
    <view class="mct-bottom-left">
      <span class="mct-bottom-left-text">{{info.storeName}}</span>
      <!-- <span style="color: #FF8715; font-weight: 500">4.0分</span> -->
    </view>
    <view style="display: flex;">
      <view style=" width: 80rpx;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{info.areaName}}</view>
      <view style=" width: 180rpx;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 12rpx;">{{info.businessName}}</view>
      <view style=" width: 130rpx;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{info.distance >= 1000 ? info.distance/1000 + '千米' : info.distance + '米'}}</view>
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
  display: flex;
  position: relative;
  .scroll-img{
    width: 200rpx;
    height: 200rpx;
    margin-right: 24rpx;
    background: #ccc;
    border-radius: 20rpx;
    flex-shrink: 0;
  }
  .scroll-box{
    .scroll-info-title {
      margin-top: 10rpx;
      .scroll-info-title-text {
        width: 400rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; //显示几行
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 40rpx;
      }
      .scroll-info-title-text2{
        width: 400rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; //显示几行
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 33rpx;
        margin-top: 10rpx;
      }
    }

    .scroll-info-category {
      display: flex;
      font-size: 24rpx;
      color: #999999;
      margin-top: 22rpx;
      justify-content: space-between;
      margin-right: 22rpx;
      // font-weight: 400;
      // font-size: 24rpx;
      // color: #999999;

      // .scroll-info-category-text {
      //   line-height: 45rpx;
      //   display: -webkit-box;
      //   -webkit-box-orient: vertical;
      //   -webkit-line-clamp: 1; //显示几行
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      // }
    }

    .scroll-info-address {
      width: 418rpx;
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 45rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      .scroll-info-address-view {
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        // max-width: 60%!important;
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
        border: 2rpx solid #FF8715;
        font-weight: 400;
        font-size: 20rpx;
        color: #FF8715;
        margin-left: 16rpx;
        padding: 2rpx 10rpx;
        display: inline-block;
      }

      .scroll-info-card-text:first-child {
        margin-left: 0 !important;
      }
    }
    .scroll-info-Offer{
      margin-top: 12rpx;
      display: flex;
      .scroll-info-Offer-text{
        border-radius: 9rpx;
        border: 1rpx solid #FF8714;
        font-size: 20rpx;
        .offer-head{
          display: inline-block;
          border-radius: 9rpx 0 0 9rpx;
          padding: 0 10rpx;
          color: #fff;
          background: #FF8714;
        }
      }

    }
  }
  .scroll-time{
    position: absolute;
    top:-15rpx;
    right: -15rpx;
    color: #FF1D1D;
    font-size: 24rpx;
  }

}
.mct-com-bottom{
  display: flex;
  font-size: 24rpx;
  color: #999999;
  justify-content: space-between;
  margin-top: 18rpx;
  .mct-bottom-left{
    display: flex;
    .mct-bottom-left-text{
      width: 180rpx;
      font-weight: bold;
      font-size: 24rpx;
      color: #333333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; //显示几行
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 12rpx;
    }
  }

}
</style>