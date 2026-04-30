<template>
  <view class="phone-item">
    <view class="" style="width: 90%">
      <view class="phone-title"> {{ item.title }}</view>
      <view class="phone-content">{{ item.content }}</view>
    </view>
    <view class="" style="flex:1; text-align: end" @click="call(item)">
      <image
        :src="minioBaseUrl + '/common/callPhone/lujingbeifen3.png'"
        class="phone-image"
        mode="scaleToFill"
      ></image>
    </view>
  </view>
  <callPhoneVue ref="callPhone" />
</template>

<script>
import callPhoneVue from "./callPhone.vue";

export default {
  components: { callPhoneVue },
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    call({ phone, title }) {
      console.log("phone: ", phone);
      if (phone.includes("、")) {
        let arr = phone.split("、").map((phoneNumber) => ({
          title: title,
          phoneNumber: phoneNumber,
        }));
        let obj = {
          phoneList: arr,
          popTitle: title,
          showPop: true,
        };
        this.$refs.callPhone.openPop(obj);
        return;
      }
      this.bridgeSdk.jumpPage({
        title: title,
        url: `tel://${phone}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.phone-item {
  margin: 0 30rpx 24rpx;
  padding: 28rpx 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  border-radius: 20rpx;

  .phone-title {
    font-weight: bold;
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }
  .phone-content {
    margin-top: 12rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
    text-align: left;
    font-style: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .phone-image {
    width: 30rpx;
    height: 30rpx;
  }
}
::v-deep() .uni-image {
  display: inline !important;
}
</style>
