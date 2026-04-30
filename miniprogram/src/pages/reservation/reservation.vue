<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="reservation">
    <vcCalendar @select="handleDateSelect"></vcCalendar>
    <view v-if="dataList.length" class="reservation-box">
      <view class="reservation-box-title">今日预约</view>
      <view
        class="reservation-box-item"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <view class="reservation-box-item-left">
          <image :src="item.img" class="reservation-box-item-img"></image>
        </view>
        <view class="reservation-box-item-right">
          <view class="reservation-box-item-right-name">{{ item.name }}</view>
          <view class="reservation-box-item-right-time">{{ item.time }}</view>
          <view class="reservation-box-item-right-point">{{ item.point }}</view>
          <view class="reservation-box-item-right-price">{{ item.price }}</view>
        </view>
      </view>
    </view>
    <vc-empty v-else />
  </vc-container>
</template>

<script>
import vcCalendar from "@/components/library/base/vc-calendar/index";
export default {
  name: "reservation",
  components: {
    vcCalendar,
  },
  data() {
    return {
      selectDate: "",
      dataList: [
        {
          img: "https://img.yzcdn.cn/vant/apple-1.jpg",
          name: "苹果10",
          time: "10:00-12:00",
          point: "北京市朝阳区",
          price: "100",
        },
        {
          img: "https://img.yzcdn.cn/vant/apple-2.jpg",
          name: "苹果11",
          time: "14:00-16:00",
          point: "北京市海淀区",
          price: "120",
        },
      ],
    };
  },
  methods: {
    getData(){
        console.log("getData", this.selectDate);
    },
    handleDateSelect(date) {
      console.log("hadnleDateSelect", date);
      this.selectDate = date;
    },
  },
};
</script>

<style lang="scss" scoped>
.reservation {
  .reservation-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .reservation-box-title {
      width: 100%;
      padding: 40rpx 0 30rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #222222;
      line-height: 44rpx;
    }
    .reservation-box-item {
      width: 100%;
      box-sizing: border-box;
      padding: 24rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 30rpx;
      background: #fff;
      border-radius: 10rpx;
      .reservation-box-item-left {
        width: 280rpx;
        height: 210rpx;
        border-radius: 10rpx;
        flex-shrink: 0;
        .reservation-box-item-img {
          width: 100%;
          height: 100%;
        }
      }
      .reservation-box-item-right {
        margin-left: 24rpx;
        .reservation-box-item-right-name {
          height: 80rpx;
          font-weight: bold;
          font-size: 28rpx;
          color: #333333;
          line-height: 40rpx;
          margin-bottom: 10rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .reservation-box-item-right-time {
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 34rpx;
          margin-bottom: 10rpx;
        }
        .reservation-box-item-right-point {
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 34rpx;
        }
        .reservation-box-item-right-price {
          font-weight: 600;
          font-weight: bold;
          font-size: 28rpx;
          color: #00bcb8;
          line-height: 40rpx;
        }
      }
    }
  }
}
</style>
