 <!--
 * @Description: 优惠券列表组件
 * @Author: 陈保磊
 * @Date: 2025-01-15 16:00:00
-->
<template>
  <view class="card-list">
    <up-row justify="space-between" gutter="10">
      <up-col span="3">
        <view
          class="demo-layout bg-purple"
          style="width: 160rpx; height: 160rpx">
          <image
            v-if="!items.photoUrl"
            style="width: 100%; height: 100%"
            class=""
            src="../static/uploadImg.png">
          </image>
          <image
            v-else
            style="width: 100%; height: 100%"
            class=""
            :src="minioBaseUrl + items.photoUrl">
          </image>
        </view>
      </up-col>
      <up-col span="9">
        <view class="demo-layout bg-purple-light right-box">
          <view class="card-title">
            <view class="" style="width: 80%">
              {{ items.couponBaseName }}
            </view>
          </view>
          <view
            class=""
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
            <view class="card-price"> ¥ {{ items.disAmt }} </view>
            <view v-if="items.couponBaseStatus ==1 && items.getStatus != 1 && type == '2' ">
              <up-button
              style="height: 40rpx;background-color: #00BCB8;"
                type="primary"
                shape="circle"
                text="去使用">
              </up-button>
            </view>
          </view>

          <view class="quanType">
            {{ items.couponBaseTypeName }}
          </view>
        </view>
      </up-col>
    </up-row>
    <up-line dashed></up-line>
    <view class="card-time" v-if="type == '1'"> 核销日期: {{ items.verificationTime }} </view>
    <view class="card-time" v-else>使用日期 : {{ items.useStartTime }} - {{ items.useEndTime }} </view>
  </view>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    items: {
      type: Object,
      default: {}
    },
    // 1: 已核销  2： 未核销 3： 正在核销
    type:{
      type: String,
      default: ''
    }
  },
  mounted () {
    // {{items.isSuperposition }}
    console.log(this.items.isSuperposition)

  }
}
</script>

<style lang="scss" scoped>
.card-list {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  .card-title {
    font-size: 28rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-time {
    font-size: 28rpx;
    padding-top: 20rpx;
  }
  .card-price {
    color: red;
    font-size: 36rpx;
    font-weight: bold;
    padding: 10rpx 0;
  }
}
.right-box {
  position: relative;
  .quanType {
    position: absolute;
    top: -36rpx;
    right: -20rpx;
    background: #3be87b;
    font-size: 24rpx;
    padding: 10rpx 10rpx 5rpx;
    border-radius: 5rpx;
  }
}
</style>