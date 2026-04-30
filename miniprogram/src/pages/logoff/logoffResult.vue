<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="logoff-result">
    <view class="logoff-result-box">
        <up-icon
        name="checkmark-circle-fill"
        size="120rpx"
        color="#09DCBA"
        ></up-icon>
        <view class="title">已成功提交注销申请</view>
        <view class="desc"
        >您的账号已成功提交注销申请，15天内不再进行登录操作，账号将自动注销。若您在15天内使用该账号重新登录，注销申请将自动失效，需重新提交。</view
        >
        <view class="buttonBox">
            <up-button
                class="confirmbtn"
                type="primary"
                text="确定"
                @click="submitForm"
                shape="circle"
            ></up-button>
        </view>
    </view>
  </vc-container>
</template>

<script>
export default {
  name: "logoffResult",
  data() {
    return {
      
    };
  },
  methods: {
    submitForm() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.logoff-result {
  width: 100%;
  .logoff-result-box {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 40rpx 0;
    box-sizing: border-box;
    background: #fff;

    .title{
        font-size: 32rpx;
        font-weight: 600;
        margin: 30rpx 0 0;
    }
    .desc{
        font-size: 28rpx;
        margin: 20rpx 0 0;
    }
    .buttonBox{
        width: 100%;
        margin-top: 100rpx;
    }
    .confirmbtn{
        width: 100%;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
        border-radius: 10px;
        color: #fff;
    }
  }
}
</style>
