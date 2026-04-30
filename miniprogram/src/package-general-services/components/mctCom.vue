<template>
  <view class="flex flex_col">
    <view class="mct-com">
      <view class="scroll-img flex flex_ac flex_jc">
        <image
          :src="minioBaseUrl + info.mctIconPhotoUrl"
          mode="widthFix‌"
          style="height: 160rpx; border-radius: 8rpx"
        ></image>
      </view>

      <view class="scroll-box">
        <view class="scroll-info-title">
          <!-- <view class="scroll-info-title-image">
          <image class="scroll-info-title-img" :src="minioBaseUrl + 'common/mctImages/icon_label_img.png'"
            mode="scaleToFill" />
        </view> -->
          <view class="scroll-info-title-text">{{ info.mctName }}</view>
          <!-- <view class="scroll-info-status">
          <view class="status-box">
            <text v-if="isAllDay">24小时营业</text>
            <text v-else-if="isOpen">营业中</text>
            <text v-else>休息中</text>
          </view>
        </view> -->
        </view>
        <!-- 评价 甄选商家  -->
        <view class="scroll-info-pingjia">
          <view v-if="false" class="flex flex_ac">
            <image
              :src="`${minioBaseUrl}common/mctImages/icon-zhenxuan.png`"
              mode="scaleToFill"
              style="width: 172rpx; height: 32rpx; margin-right: 10rpx"
            />
          </view>
          <!-- 星星评价逻辑 -->
          <view v-if="true" class="flex flex_ac" style="margin-right: 10rpx">
            <image
              v-for="star in stars"
              :key="star"
              :src="
                star <= Math.floor(info.score || 5)
                  ? `${minioBaseUrl}common/mctImages/icon-star.png`
                  : `${minioBaseUrl}common/mctImages/icon-dark.png`
              "
              mode="scaleToFill"
              style="width: 24rpx; height: 24rpx; margin-right: 4rpx"
            />
            <text
              style="
                font-size: 24rpx;
                color: #ff6634;
                margin-left: 8rpx;
                font-weight: 600;
              "
              >{{ info.score || "5.0" }}</text
            >
          </view>
          <view v-if="info.commentCount" class="scroll-info-pingjia-open">
            {{ info.commentCount || 0 }}条
          </view>
        </view>
        <view class="scroll-info-category" v-if="isAllDay">
          <view v-if="isOpen" class="yingye">营业中</view>
          <view v-if="!isOpen" class="xiuxi">休息中</view>
          <view class="scroll-info-category-open" v-if="info.mctTypeName">
            <!-- <image :src="`${minioBaseUrl}common/mctImages/icon_sport_style0${isOpen ? '2' : '1'}_img.png`"
            mode="scaleToFill" style="width: 20rpx;height: 20rpx;margin-right: 10rpx;" /> -->
            {{ info.mctTypeName }}
          </view>
           <view class="scroll-info-category-open">
            {{ info.businessHours }}
          </view>
        </view>

        <view class="scroll-info-category" v-else>
          <view v-if="isOpen" class="yingye">营业中</view>
          <view v-if="!isOpen" class="xiuxi">休息中</view>
          <view
            :class="`scroll-info-category-${isOpen ? 'open' : 'close'}`"
            v-if="info.mctTypeName"
          >
            <!-- <image :src="`${minioBaseUrl}common/mctImages/icon_sport_style0${isOpen ? '2' : '1'}_img.png`"
            mode="scaleToFill" style="width: 20rpx;height: 20rpx;margin-right: 10rpx;" /> -->
            {{ info.mctTypeName }}
          </view>
          <view
            :class="`scroll-info-category-${isOpen ? 'open' : 'close'}`"
            v-for="(item, index) in info.businessHours
              ? info.businessHours.split('|')
              : []"
            :key="index"
          >
            <!-- <up-icon name="clock-fill" size="16rpx" :color="isOpen ? '#FD893D' : '#29A2E8'"
            style="margin-right: 10rpx;"></up-icon> -->
            {{ item }}
          </view>
        </view>

        <view class="scroll-info-address">
          <!-- :style="`${info.ticketList ? info.ticketList.length == 0 ? 'position: absolute;bottom: 0;' : '' : 'position: absolute;bottom : 0;'}`" -->
          <view
            class="e scroll-info-address-view"
            :style="`${isLocationFail ? 'max-width: none;' : ''}`"
          >
            <!-- <u-icon name="map-fill" color="#FD893D" size="24rpx" style="margin-right: 10rpx;"></u-icon> -->
            地址：{{ info.address }}
          </view>
        </view>
        <!-- 原券逻辑 -->
        <!-- <view class="scroll-info-card" v-if="true">
        <text class="scroll-info-card-text" v-for="info in info.labelName.split(',')" :key="info">{{ info }}12</text>
      </view>

      <view class="scroll-info-Offer" v-if="true">
        <view class="scroll-info-Offer-text" v-for="(item, index) in info.ticketList.slice(0, 2)" :key="index"><span
            class="offer-head">券</span><span style="color: #FF8715; padding: 0rpx 10rpx;width: 150rpx;" class="e">{{
              item.couponBaseName }}12</span></view>
      </view> -->
      </view>

      <!-- <view class="scroll-time">
      <view v-if="info.isTimeShow == '1'" style="margin-bottom: 6rpx;">
        <text>{{ info.alertWord }}</text>
      </view>
    </view> -->
    </view>
    <!-- <view class="scroll-info-card" v-if="info.labelName">
        <text class="scroll-info-card-text" v-for="info in info.labelName.split(',')" :key="info">{{ info }}</text>
      </view>

      <view class="scroll-info-Offer" v-if="info.ticketList">
        <view class="scroll-info-Offer-text" v-for="(item, index) in info.ticketList.slice(0, 2)" :key="index"><span
            class="offer-head">券</span><span style="color: #FF8715; padding: 0rpx 10rpx;width: 150rpx;" class="e">{{
              item.couponBaseName }}</span></view>
      </view>-->
    <view v-if="info.spuName" class="card-line flex flex_ac flex_jc">
      <view style="width: 36%; min-width: 26%"></view>
      <view class="flex flex_ac flex_row flex_jc card-line-box">
        <view class="flex flex_row flex_ac">
          <image
            v-if="true"
            :src="`${minioBaseUrl}common/mctImages/icon-quan.png`"
            mode="scaleToFill"
            style="width: 26rpx; height: 28rpx"
          ></image>
          <image
            v-else
            :src="`${minioBaseUrl}common/mctImages/icon-tuan.png`"
            mode="scaleToFill"
            style="width: 26rpx; height: 28rpx"
          ></image>
          <!--v-if="true"  -->
          <image
             v-if="info.subPrice !=0"
            :src="`${minioBaseUrl}common/mctImages/icon-ptbt.png`"
            mode="scaleToFill"
            style="width: 90rpx; height: 26rpx;margin-left:10rpx;"
          ></image>
          <view class="card-line-left-text">{{ info.spuName }}</view>
        </view>
        <view class="flex flex_row flex_ac card-line-right-text">
          <text class="card-line-right-text-price">￥{{ (Number(info.price) - Number(info.subPrice || 0)).toFixed(2) }}</text>
          <view class="card-line-right-text-price-old"
            >￥{{ info.originalPrice }}</view
          >
          <image
            :src="`${minioBaseUrl}common/mctImages/icon-goLeft.png`"
            mode="scaleToFill"
            style="width: 24rpx; height: 24rpx"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import fxxflogoPng from "../static/fxxflogo.png";
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
      default: () => false,
    },
    pageHide: {
      type: Boolean,
    },
    pageShow: {
      type: Boolean,
    },
  },
  data() {
    return {
      fxxflogoPng: fxxflogoPng,
      isAllDay: false,
      isOpen: false,
      stars: [1, 2, 3, 4, 5], // 星星数量
    };
  },
  watch: {
    pageShow(newVal, oldVal) {
      if (newVal) {
        this.getStatus();
      }
    },
  },
  mounted() {
    this.getStatus();
  },
  methods: {
    getStatus() {
      console.log("getStatus");
      this.isAllDay =
        this.info.businessHours && this.info.businessHours == "00:00-23:59";
      let isOpen = false;
      if (this.isAllDay) {
        isOpen = true;
      } else if (this.info.businessHours) {
        try {
          let businessHours = this.info.businessHours.split("|");
          let now = new Date();
          let nowHours = now.getHours();
          let nowMinutes = now.getMinutes();
          let nowTotalMinutes = nowHours * 60 + nowMinutes;

          for (let i = 0; i < businessHours.length; i++) {
            let businessHour = businessHours[i].split("-");
            if (businessHour.length === 2) {
              let [startHour, startMinute] = businessHour[0]
                .split(":")
                .map(Number);
              let [endHour, endMinute] = businessHour[1].split(":").map(Number);

              if (
                !isNaN(startHour) &&
                !isNaN(startMinute) &&
                !isNaN(endHour) &&
                !isNaN(endMinute)
              ) {
                let startTotalMinutes = startHour * 60 + startMinute;
                let endTotalMinutes = endHour * 60 + endMinute;

                if (startTotalMinutes < endTotalMinutes) {
                  // 当日营业
                  if (
                    nowTotalMinutes >= startTotalMinutes &&
                    nowTotalMinutes <= endTotalMinutes
                  ) {
                    isOpen = true;
                    break;
                  }
                } else {
                  // 跨天营业
                  if (
                    nowTotalMinutes >= startTotalMinutes ||
                    nowTotalMinutes <= endTotalMinutes
                  ) {
                    isOpen = true;
                    break;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("解析营业时间失败:", error);
        }
      }
      this.isOpen = isOpen;
    },
  },
};
</script>

<style scoped lang="scss">
.mct-com {
  width: 100%;
  display: flex;
  position: relative;
  // padding: 23rpx 10rpx 27rpx 21rpx;
  // background: #FFFFFF;
  // border-radius: 14rpx;
  // border: 1rpx solid #707070;

  .scroll-img {
    width: 160rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
    padding-bottom: 15rpx;
  }

  .scroll-box {
    width: 100%;
    .scroll-info-title {
      display: flex;
      align-items: flex-start;

      .scroll-info-title-image {
        width: 34rpx;
        height: 34rpx;
        flex-shrink: 0;
        margin-right: 10rpx;

        .scroll-info-title-img {
          width: 100%;
          height: 100%;
        }
      }

      .scroll-info-title-text {
        font-weight: 500;
        font-size: 30rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; //显示几行
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 36rpx;
      }

      .scroll-info-status {
        height: 34rpx;
        position: relative;

        .scroll-info-status-img {
          position: absolute;
          top: -16rpx;
          left: -6rpx;
          z-index: 0;
          width: 141rpx;
          height: 54rpx;
        }
      }
    }

    .scroll-info-category {
      display: flex;
      font-size: 18rpx;
      color: #ff8715;
      flex-wrap: wrap;
      margin-top: 3rpx;
      min-height: 30rpx;
      width: 100%;
      align-items: center;
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
      .scroll-info-category-open {
        margin-right: 5rpx;
        display: flex;
        align-items: center;
        background: #fff;
        color: #333;
        line-height: 16rpx;
        margin-top: 8rpx;
        font-weight: 400;
        font-size: 24rpx;
        border-radius: 5rpx;
        margin-right: 10rpx;
        padding: 6rpx 0rpx 6rpx 12rpx;
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 24rpx;
        line-height: 24rpx;
        margin-top: 3rpx;
      }

      .scroll-info-category-close {
        margin-right: 10rpx;
        padding: 6rpx 0rpx 6rpx 12rpx;
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 24rpx;
        margin-top: 8rpx;
      }
    }

    .scroll-info-address {
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      font-size: 20rpx;
      color: #999999;
      line-height: 50rpx;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 1;
      margin-top: 5rpx;

      .scroll-info-address-view {
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;

        display: flex;
        align-items: flex-start;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
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
        border: 2rpx solid #ff8715;
        font-weight: 400;
        font-size: 20rpx;
        color: #ff8715;
        margin-left: 16rpx;
        padding: 2rpx 10rpx;
        display: inline-block;
      }

      .scroll-info-card-text:first-child {
        margin-left: 0 !important;
      }
    }

    .scroll-info-Offer {
      margin-top: 12rpx;
      display: flex;

      .scroll-info-Offer-text {
        display: flex;
        width: 200rpx;
        height: 40rpx;
        border-radius: 9rpx;
        border: 1rpx solid #ff8714;
        font-size: 20rpx;
        margin-right: 25rpx;
        line-height: 40rpx;

        .offer-head {
          display: inline-block;
          border-radius: 9rpx 0 0 9rpx;
          padding: 0 10rpx;
          color: #fff;
          background: #ff8714;
          height: 40rpx;
        }
      }
    }
  }

  .scroll-time {
    position: absolute;
    top: -5rpx;
    right: -5rpx;
    color: #ff1d1d;
    font-size: 24rpx;
  }
}

.e {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  color: #ff8714;
}
.yingye {
  width: 80rpx;
  height: 32rpx;
  font-size: 22rpx;
  background: #FFEDDF;
  border-radius: 5rpx;
  color: #9a6a4c;
  line-height: 32rpx;
  text-align: center;
  margin-top: 5rpx;
  padding: 2rpx 3rpx;
}
.xiuxi {
  width: 80rpx;
  height: 32rpx;
  font-size: 22rpx;
  background: #ebebeb;
  border-radius: 5rpx;
  color: #999999;
  line-height: 32rpx;
  text-align: center;
  margin-top: 5rpx;
  padding: 2rpx 3rpx;
}
.scroll-info-pingjia {
  margin-top: 8rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  .image {
    width: 172rpx;
    height: 32rpx;
  }
  .scroll-info-pingjia-open {
    font-weight: 400;
    font-size: 24rpx;
    color: #333333;
    line-height: 24rpx;
  }
}
.card-line {
  width: 100%;
  margin-top: 10rpx;

  .card-line-box {
    padding-top: 15rpx;
    justify-content: space-between;
    width: 100%;
    border-top: 2rpx solid #f1f1f1;
    view {
      // width: 100%;
      display: flex;
      align-items: center;
      .card-line-left-text {
        margin-left: 10rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #000000;
        line-height: 34rpx;
        width: 200rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .card-line-right-text-price {
        font-weight: 600;
        font-size: 24rpx;
        color: #ff6634;
        line-height: 33rpx;
        margin-right: 10rpx;
      }
      .card-line-right-text-price-old {
        font-weight: 400;
        font-size: 20rpx;
        color: #999999;
        line-height: 28rpx;
        text-align: center;
        font-style: normal;
        text-decoration-line: line-through;
        margin-right: 10rpx;
      }
    }
  }
}


</style>
