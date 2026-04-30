<template>
  <view class="sign-in-modal">
    <view class="sign-in-modal-content">
      <image
        class="sign-in-modal-img"
        :src="minioBaseUrl + 'common/memberCenter/member-modal-bg.png'"
        mode="scaleToFill"
      />
      <view class="sign-in-modal-main">
        <view class="sign-in-modal-title">签到成功</view>
        <!-- <view class="sign-in-modal-desc"
          >恭喜获得{{continueFlag?"连签":"签到"}}积分{{ score }}分</view
        > -->
        <view class="sign-in-modal-desc"
          >恭喜获得{{ score }}积分</view
        >
        <view class="sign-in-modal-btn" @click="closeModal">我知道了</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "signInModal",
  props: {
    score: {
      type: Number,
      default: 0,
    },
    continueFlag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit("handleClose");
    },
  },
};
</script>

<style scoped lang="scss">
.sign-in-modal {
  width: 100vw;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  .sign-in-modal-content {
    width: 578rpx;
    height: 568rpx;
    background-color: #fff;
    border-radius: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    .sign-in-modal-img {
      width: 578rpx;
      height: 568rpx;
    }
    .sign-in-modal-main {
      position: absolute;
      top: 0;
      left: 0;
      width: 578rpx;
      height: 568rpx;
      box-sizing: border-box;
      padding: 300rpx 100rpx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      // margin-top: 300rpx;
      .sign-in-modal-title {
        font-weight: 600;
        font-size: 44rpx;
        color: #333333;
        line-height: 62rpx;
      }
      .sign-in-modal-desc {
        font-weight: 400;
        font-size: 32rpx;
        color: #6a6c70;
        line-height: 44rpx;
        margin-top: 6rpx;
      }
    }
    .sign-in-modal-btn {
      width: 480rpx;
      height: 84rpx;
      background: #ffd9ad;
      border-radius: 20rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #7e522d;
      line-height: 84rpx;
      text-align: center;
      margin-top: 30rpx;
    }
  }
}
</style>