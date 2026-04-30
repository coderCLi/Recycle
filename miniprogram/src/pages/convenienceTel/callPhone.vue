<template>
  <up-popup
    :show="showPop"
    @close="close"
    mode="bottom"
    round="15"
    @open="open"
    :closeable="true"
    @touchmove.stop.prevent="stopRoll"
  >
    <view class="pop-title flex flex_ac flex_jc">
      {{ popTitle }}
    </view>
    <view class="phone-list">
      <view class="" v-for="item in phoneList" :key="item.phoneNumber">
        <up-cell
          @click="makePhoneCall(item)"
          :border="false"
          :title="item.phoneNumber"
        >
        </up-cell>
      </view>
    </view>
  </up-popup>
</template>

<script>
import { platform, isH5, isApp, isMp } from "@/utils/platform";
export default {
  data() {
    return {
      showPop: false,
      popTitle: "",
      phoneList: [],
    };
  },
  props: {},
  watch: {
    showPop(newVal) {
      if (newVal) {
        // 弹窗打开时禁用页面滚动
        if (isH5) {
          document.body.style.overflow = "hidden";
        }
      } else {
        // 弹窗关闭时恢复页面滚动
        if (isH5) {
          document.body.style.overflow = "auto";
        }
      }
    },
  },
  methods: {
    stopRoll() {
      // 禁止页面滚动
    },
    makePhoneCall(item) {
      console.log("makePhoneCall ", item);
      this.bridgeSdk.makePhoneCall({
        title: item.title,
        phoneNumber: item.phoneNumber,
      });
      this.close();
    },
    openPop(obj) {
      this.showPop = obj.showPop;
      this.popTitle = obj.popTitle;
      this.phoneList = obj.phoneList;
    },
    close() {
      this.showPop = false;
    },
  },
};
</script>

<style scoped lang="scss">
.pop-title {
  margin-top: 30rpx;
  line-height: 80rpx;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-weight: 600;
  font-size: 32rpx;
  color: #222222;
  line-height: 53rpx;
}

.card-list {
  padding: 40rpx 60rpx 60rpx 60rpx;
  border-radius: 28rpx;

  text {
    font-weight: 400;
    font-size: 28rpx;
    color: #222222;
  }
}

.phone-list {
  padding: 40rpx 60rpx 60rpx 60rpx;
  border-radius: 28rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text {
    line-height: 50rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #222222;
  }
}
</style>
