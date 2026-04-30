<template>
  <view class="mct-com">

    <view class="scroll-img">
      <image :src="minioBaseUrl + info.listPicUrl" mode="scaleToFill" style="width: 200rpx;height: 200rpx;border-radius: 20rpx;"></image>
      <view v-if="info.isSafeConsumption == '1'" class="scroll-img-icon" :style="`background-image: url(${minioBaseUrl}common/fangxin/fxxflogo.png)`"></view>
    </view>
    <view class="scroll-box">

      <view class="scroll-info-title">
        <text class="scroll-info-title-text">{{ info.storeName }}</text>
      </view>

      <view class="scroll-info-category">
          <!-- <up-rate :modelValue="2" :minCount="1" active-color="#FF8715" gutter="0" readonly></up-rate> -->
          <view>暂无评分</view>
          <!-- <view style="margin-left: 10rpx;">重庆火锅</view> -->
      </view>
      <view class="scroll-info-address" :style="`${info.ticketList ? info.ticketList.length == 0 ? 'margin-top: 35rpx;' : '': 'margin-top: 0rpx;'}`">
        <view class="ellipsis scroll-info-address-view" :style="`${isLocationFail ? 'max-width: none;': ''}`"
          >{{ info.areaName }}{{ info.storeAddress}}
        </view>
        <view>{{info.distance >= 1000 ? '距您直线距离' + info.distance/1000 + '千米' : '距您直线距离' + info.distance + '米'}}</view>
        <!-- 定位成功显示 -->
        <!-- <text v-if="!isLocationFail" class="scroll-info-address-text"
          >距您直线距离{{ info.distance ? bridgeSdk.keepOneDecimalPlace(info.distance) : "--" }}km</text
        > -->
      </view>


      <view class="scroll-info-card" v-if="info.labelName">
        <text
          class="scroll-info-card-text"
          v-for="info in info.labelName.split(',')"
          :key="info"
          >{{ info }}</text
        >
      </view>

      <view class="scroll-info-Offer" v-if="info.ticketList">
        <view class="scroll-info-Offer-text" v-for="(item, index) in info.ticketList.slice(0, 2)" :key="index"><span class="offer-head">券</span><span style="color: #FF8715; padding: 0rpx 10rpx;width: 180rpx;" class="e">{{item.couponBaseName}}</span></view>
      </view>
      <!-- <view class="scroll-info-Offer" v-if="info.ticketList.length == 0">
        <view style="font-size: 20rpx; color: #FF8715;">暂无优惠券</view>
      </view> -->

    </view>

    <!-- <view class="scroll-timey" v-if="info.isBusiness == '0'">休息中</view> -->
    <view class="scroll-time">{{safeStoreName}}</view>
    <!-- <view class="scroll-timey" v-if="info.isBusiness == '0'">{{safeStoreName}}</view> -->
  </view>
</template>

<script>
import { getClosestTime } from './timeFun';
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
  },
  computed: {
    // 
    safeStoreName() {
      let nextStartTime = '';
      // let storeTime = JSON.parse(this.info.storeTime);
      if(this.info.isBusiness == '1'){
        nextStartTime = '';
        return nextStartTime;
      }else if(this.info.isBusiness == '0'){
        // const startTimes = [];
        // for (let i = 0; i < storeTime.length; i++) {
        //   // console.log(storeTime[i],'storeTime[i].start')
        //   // // startTimes.push(storeTime[i]);
        //   startTimes.push(storeTime[i].start);
        // }
        // const closestTime = getClosestTime(startTimes);
        // // console.log(`当前时间最接近：${closestTime}`);
        // isBusiness = closestTime + '营业';
        nextStartTime = this.info.nextStartTime + '营业';
        return nextStartTime;

      }
      // let isBusiness = '';
      // if (this.info.isBusiness == '1') {
      //   isBusiness = '';
      // } else if (this.info.isBusiness == '0') {
      //   isBusiness = '休息中';
      // }
      // return isBusiness;
    },
  },

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
    position: relative;
    .scroll-img-icon{
      position: absolute;
      display: inline-block;
      width: 64rpx;
      height: 42rpx;
      border-radius: 7rpx;
      background: #FF8715;
      bottom: 5rpx;
      right: 5rpx;
      background-size: 100% 100%;
    }
  }
  .scroll-box{
    .scroll-info-title {
      .scroll-info-title-text {
        width: 320rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; //显示几行
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 50rpx;
      }
    }

    .scroll-info-category {
      display: flex;
      font-size: 24rpx;
      color: #999;
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
      width: 410rpx;
      // display: flex;
      justify-content: space-between;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 45rpx;

      .scroll-info-address-view {
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
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
        display: flex;
        width:190rpx;
        height: 40rpx;
        border-radius: 9rpx;
        border: 1rpx solid #FF8714;
        font-size: 20rpx;
        margin-right: 10rpx;
        line-height: 40rpx;
        .offer-head{
          display: inline-block;
          border-radius: 9rpx 0 0 9rpx;
          padding: 0 10rpx;
          color: #fff;
          background: #FF8714;
          height: 40rpx;
        }
      }
    }

  }
  .scroll-time{
    position: absolute;
    top:-15rpx;
    right: 0rpx;
    color: #FF1D1D;
    font-size: 24rpx;
  }
  .scroll-timey{
    position: absolute;
    top:-15rpx;
    right: 0rpx;
    color: #00BCB8;
    font-size: 24rpx;
  }
  
  .e {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    color:#FF8714;
  }

}
</style>