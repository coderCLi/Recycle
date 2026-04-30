<template>
  <vc-modal ref="modal"></vc-modal>
  <div class="point-com">
    <div class="point-com-left">
      <div class="point-com-title">
        {{ info.locationName || "" }}
        <text v-if="comType == 'toilets'" :class="`${info.timeStatus == 1
            ? 'point-com-title-open'
            : 'point-com-title-close'
          }`">{{ info.timeStatus == 1 ? "开放中" : "暂未开放" }}</text>
      </div>
      <div class="point-com-content">
        {{ (info.districtCodeName?info.districtCodeName  + "-" : "")+ (info.address || "") }}
      </div>
      <div class="point-com-footer" v-if="comType == 'toilets'">
        <image class="point-com-footer-image" mode="widthFix" :src="staticBaseUrl +
          '/hbdimage/main/images/package-services/shijian.png'
          "></image>
        开放时间{{ info.timeValue }}
      </div>
      <div v-if="!needOpenLocation" class="point-com-footer">
        <image class="point-com-footer-image" mode="widthFix" :src="staticBaseUrl +
          '/hbdimage/main/images/package-services/dingwei.png'
          "></image>
        距您直线距离{{ bridgeSdk.convertDistance(info.distance) }}
      </div>
    </div>
    <div class="point-com-right" @click.stop="toNav">
      <image class="point-com-right-image" :src="staticBaseUrl +
        '/hbdimage/main/images/package-services/luxian.png'
        "></image>
        <view class="point-com-bot-text" v-if="!needOpenLocation">{{ bridgeSdk.convertDistance(info.distance) }}</view>
      <!-- <view>{{ info.route }}</view> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "pointCom",
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    comType: {
      type: String,
      default: "", // toilets: 公厕  point：网点
    },
    locationInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    locationInfo: {
      handler(newVal, oldVal) {
        console.log("locationInfo change", newVal);
        this.needOpenLocation = newVal.locationFail === true;
      },
      immediate: true,
    }
  },
  data() {
    return {
      needOpenLocation: true
    };
  },
  methods: {
    toNav() {
      // this.bridgeSdk.getLocation((res) => {
      const res = this.locationInfo;
      // this.needOpenLocation = res.locationFail === true;
      this.bridgeSdk.routePlan(
        res.lng + "," + res.lat,
        this.info.longitude + "," + this.info.latitude,
        this.info.districtCodeName,
        this.info.address
      );
      // }, "showModal");
    },
  },
};
</script>

<style scoped lang="scss">
.point-com {
  width: 690rpx;
  box-sizing: border-box;
  padding: 28rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20rpx;
  background: #fff;

  .point-com-left {
    width: 400rpx;

    .point-com-title {
      width: 100%;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      margin-bottom: 10rpx;

      .point-com-title-open {
        display: inline-block;
        padding: 4rpx 10rpx;
        font-size: 20rpx;
        color: #fff;
        background: #23baab;
        border-radius: 10rpx;
        margin-left: 20rpx;
      }

      .point-com-title-close {
        display: inline-block;
        padding: 4rpx 10rpx;
        font-size: 20rpx;
        color: #fff;
        background: #f1f1f1;
        border-radius: 10rpx;
        margin-left: 20rpx;
      }
    }

    .point-com-content {
      width: 100%;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      margin-bottom: 6rpx;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }

    .point-com-footer {
      width: 100%;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 24rpx;
      margin-top: 10rpx;

      .point-com-footer-image {
        width: 18rpx;
        height: 24rpx;
        margin-right: 10rpx;
        flex-shrink: 0;
      }
    }
  }

  .point-com-right {
    width: 120rpx;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #23baab;

    .point-com-right-image {
      width: 48rpx;
      height: 48rpx;
    }
  }
}
  .point-com-bot-text{
    width: 110rpx;
    margin-top: 2rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
