<template>
  <view class="benefit-card-item">
    <view class="benefit-card-item-left">
      <!--  v-if="info.privilegeType == '3'" -->
      <!-- <image class="benefit-card-item-left-img" :src="minioBaseUrl + 'common/memberCenter/memberDrawIcon.png'"></image> -->
      <image class="benefit-card-item-left-img" :src="minioBaseUrl + info.roductUrl" mode="scaleToFill"></image>
    </view>
    <!-- <view v-else class="benefit-card-item-left">
      <view
        class="benefit-card-item-left-top"
        v-if="productTypeObj[info.productType]"
        >{{ productTypeObj[info.productType][0] }}</view
      >
      <view
        class="benefit-card-item-left-top"
        v-if="productTypeObj[info.productType]"
        >{{ productTypeObj[info.productType][1] }}</view
      >
    </view> -->
    <view class="benefit-card-item-center">
      <view class="benefit-card-item-center-top"></view>
      <view class="benefit-card-item-center-bottom"></view>
    </view>
    <view class="benefit-card-item-right">
      <view class="benefit-card-item-right-top" :style="{color: tabId == '0'? '#222222' : '#999999'}">
        <view class="benefit-card-item-right-top-main">{{ info.productName }}</view><view class="benefit-card-item-right-top-num" :style="{color: tabId == '0' ? '#946C37' : '#9D9D9D'}">x{{ info.privilegeValue }}</view>
      </view>
      <view class="benefit-card-item-right-middle" @click="showInfo"  :style="{color: tabId == '0'? '#222222' : '#999999'}">
        <view class="benefit-card-item-right-middle-text" v-if="page=='has'">{{ expreTimeFun(tabId == '1' ? info.usageTime : info.couponExpireTime) }}</view>
        <view class="benefit-card-item-right-middle-text" v-else>{{ info.rules }}</view>
        <up-icon
          name="info-circle"
          :color="tabId =='0' ? '#FFD9AD': '#999999'"
          size="24rpx"
          style="padding-left: 10rpx"
        ></up-icon
      ></view>
      <view v-if="page=='has'" class="benefit-card-item-right-bottom">
        <view
          v-if="tabId == '0'"
          class="benefit-card-item-right-bottom-btn"
          @click="handleClick"
        >
          去使用
        </view>
        <view v-if="tabId == '1'" class="benefit-card-item-right-bottom-btn2">
          已使用
        </view>
        <view v-if="tabId == '2'" class="benefit-card-item-right-bottom-btn2">
          已过期
        </view>
      </view>
      <view v-else class="benefit-card-item-right-bottom">
        <view
          v-if="info.isGet == '0'"
          class="benefit-card-item-right-bottom-btn"
          @click="handleClick"
        >
          立即领取
        </view>
        <view
          v-if="info.isGet == '1'"
          class="benefit-card-item-right-bottom-btn"
        >
          已领取
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { page } from '@/uni_modules/uview-plus';


export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    page: {
      type: String,
    },
    tabId: {
      type: String,
      default: '0',
    }
  },
  data() {
    return {
      productTypeObj: {
        "00": ["满减", "券"],
        "01": ["礼品", "券"],
        "02": ["折扣", "券"],
        "03": ["代金", "券"],
      },
    };
  },
  mounted() {
    console.log(this.info);
  },
  methods: {
    handleClick() {
      this.$emit("handleClick", this.info);
    },
    showInfo() {
      let htmlString = "<div style='text-align:left;font-size:14px;color:#333333;line-height:1.5;word-wrap: break-word;word-break: break-all;'>" + this.info.rulesExplanation + "</div>";
      this.$emit("showInfo", {
        title: this.info.productName,
        description: this.bridgeSdk.addMinioPrefixToImgSrc(htmlString),
      });
    },
    expreTimeFun(time){
      if(!time) return '';
      return time.substr(4,2) + "月" + time.substr(6,2) + "日" + time.substr(8,2) + ":" + time.substr(10,2) + (this.tabId == "1" ? " 使用" : "过期");
    }
  },
};
</script>

<style scoped lang="scss">
.benefit-card-item {
  width: 100%;
  height: 220rpx;
  padding: 0rpx 24rpx;
  margin-bottom: 24rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133, 133, 133, 0.09);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .benefit-card-item-left {
    width: 192rpx;
    height: 180rpx;
    // background: #ffd9ad;
    border-radius: 20rpx;
    // margin-right: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    .benefit-card-item-left-img{
      width: 100%;
      height: 100%;
    }
    .benefit-card-item-left-top {
      margin-bottom: 12rpx;
      .benefit-card-item-left-top-main {
        font-size: 32rpx;
        color: #ff8a4d;
        text-align: center;
        margin-bottom: 12rpx;
        display: flex;
        align-items: flex-end;
        .benefit-card-item-left-top-title {
          font-size: 60rpx;
        }
      }
    }
    .benefit-card-item-left-bottom {
      text-align: center;
      font-weight: 400;
      font-size: 24rpx;
      color: #946c37;
      line-height: 33rpx;
    }
  }
  .benefit-card-item-center {
    width: 24rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .benefit-card-item-center-top {
      width: 24rpx;
      height: 12rpx;
      border-radius: 0 0 24rpx 24rpx;
      background: #f5f5f5;
    }
    .benefit-card-item-center-bottom {
      width: 24rpx;
      height: 12rpx;
      border-radius: 24rpx 24rpx 0 0;
      background: #f5f5f5;
    }
  }
  .benefit-card-item-right {
    width: 406rpx;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .benefit-card-item-right-top {
      width: 100%;
      font-weight: 600;
      font-size: 32rpx;
      color: #222222;
      line-height: 45rpx;
      margin-bottom: 18rpx;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .benefit-card-item-right-top-main{
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .benefit-card-item-right-top-num {
        flex-shrink: 0;
      }
    }
    .benefit-card-item-right-middle {
      width: 100%;
      font-weight: 500;
      font-size: 24rpx;
      color: #777777;
      line-height: 33rpx;
      margin-bottom: 26rpx;
      display: flex;
      align-items: center;
      .benefit-card-item-right-middle-text{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .benefit-card-item-right-bottom {
      display: flex;
      justify-content: flex-end;
      .benefit-card-item-right-bottom-btn {
        width: 156rpx;
        height: 53rpx;
        background: #fff5e9;
        border-radius: 28rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #946c37;
        line-height: 53rpx;
        text-align: center;
      }
      .benefit-card-item-right-bottom-btn2{
        width: 156rpx;
        height: 53rpx;
        background: #F0F0F0;
        border-radius: 28rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #999999;
        line-height: 53rpx;
        text-align: center;
      }
    }
  }
}
</style>