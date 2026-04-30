<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="h-life-detail">
    <!-- banner 定制样式+点击预览大图组件统一处理 -->
    <!-- <vc-banner :props-data="bannerData"></vc-banner> -->
    <view class="h-life-detail-banner">
      <image
        :src="minioBaseUrl + dataInfo.pagePhotoUrl"
        class="h-life-detail-banner-img"
      ></image>
    </view>
    <pointCom :info="dataInfo" :locationInfo="locationInfo"></pointCom>
    <view v-if="dataInfo.showBoList?.length > 0">
      <view
        class="h-life-detail-box"
        v-for="(item, index) in dataInfo.showBoList"
        :key="index"
      >
        <view class="h-life-detail-title">{{ item.markersName }}</view>
        <view class="h-life-detail-content" v-if="item.showType === '0'">
          <view
            v-for="(im, ix) in item.termList"
            :key="ix"
            class="h-life-detail-item"
          >
            <image class="h-life-detail-item-img"
              :src="minioBaseUrl + im.pic"
              mode="aspectFill"
            ></image>
            <view>{{ im.termName }}</view>
          </view>
        </view>
        <view class="h-life-detail-content" v-if="item.showType === '1'">
          <view
            class="h-life-detail-item"
            v-for="(im, ix) in item.termList"
            :key="ix"
          >
            <view class="h-life-detail-item_num">{{ im.termNum }}</view>
            <view>{{ im.termName }}</view>
          </view>
        </view>
      </view>
    </view>

  </vc-container>
</template>

<script>
import vcBanner from "@/components/library/base/vc-banner/index"; //banner
import pointCom from "../components/pointCom";
import { getMapProLocationDetail } from "../api/base-services";

export default {
  name: "hLifeDetail",
  components: {
    vcBanner,
    pointCom,
  },
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: "",
          },
        },
      },
      bannerData: {
        props: {
          list: {
            value: [
              
            ],
          },
          height: {
            value: 360,
          },
          type: {
            value: "indicator",
          },
          borderRadius: {
            value: "border-radius",
          },
          preview: {
            value: true,
          },
        },
      },
      dataInfo: {},

      locationInfo: {}, // 定位信息,
      distance: "", // 距离,
    };
  },
  onLoad(options) {
    console.log(options);
    this.locationId = options.id;
    this.lat = options.lat;
    this.lng = options.lng;
    this.propsData.props.title.value = options.title;
    this.distance = options.distance;

    // 获取经纬度
    this.bridgeSdk.getLocation((res) => {
      console.log("getLocation获取经纬度", res);
      this.locationInfo = res;
      this.getData();
    }, "showModal");
    
  },
  methods: {
    getData() {
      getMapProLocationDetail({
        locationId: this.locationId,
        longitude: this.lng,
        latitude: this.lat,
      }).then((res) => {
        console.log(res);
        this.dataInfo = res;
        this.dataInfo.distance = res.distance || this.distance;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.h-life-detail {
  display: flex;
  align-items: center;
  flex-direction: column;
  .h-life-detail-banner {
    margin-top: 20rpx;
    width: 100%;
    height: 360rpx;
    margin-bottom: 20rpx;
    .h-life-detail-banner-img {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }
  .h-life-detail-box {
    width: 690rpx;
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 24rpx 24rpx 0rpx 24rpx;
    margin-top: 20rpx;
    .h-life-detail-title {
      width: 574rpx;
      height: 40rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
    }
    .h-life-detail-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .h-life-detail-item {
        width: 17%;
        margin: 24rpx 0 20rpx 0;
        font-size: 24rpx;
        text-align: center;
        flex-grow: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        .h-life-detail-item-img {
          width: 48rpx;
          height: 48rpx;
        }
        .h-life-detail-item-title {
          max-width: 4rpx;
          font-size: 24rpx;
          color: #000000;
          line-height: 28rpx;
        }
        .h-life-detail-item_num {
          height: 45rpx;
          font-weight: 600;
          font-size: 32rpx;
          color: #23baab;
          line-height: 45rpx;
        }
      }
    }
  }
}
</style>
