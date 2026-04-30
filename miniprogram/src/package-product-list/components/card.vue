<!--
 * @Description: 订单卡片组件
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
    <vc-modal ref="modal"></vc-modal>
  <view class="card-item">
    <view class="card-text">
      <view class="" style="display: flex; align-items: center;font-size:28rpx">
        <image
          style="width: 28rpx; height: 28rpx; margin-right: 10rpx"
          src="../static/detail.png"
          mode="aspectFit"
          lazy-load="false"
        />
        <view class=""> 订单号:{{ item.orderId }} </view>
      </view>
      <view class="" style="color: red; font-weight: bold">
        {{ item.orderStatusName }} {{item.payType == '00' ?'支付' : '退款'}}
      </view>
    </view>

    <view v-for="(item, index) in item.subOrderList" :key="index">
    <productVue :item="item" />
    </view>
    <!-- <up-row justify="space-between" gutter="10">
      <up-col span="4">
        <view class="left-box">
          <up-lazy-load :height="75" style="height:130rpx"   border-radius="15"  :error-img="errorImg" image="../static/shangpin.png"></up-lazy-load>
          <view class="left-icon" v-if="type !='goods'"> 热销 </view>
        </view>
      </up-col>
      <up-col span="8" >
        <view class="demo-layout bg-purple-light right-box">
          <text class="right-text title"> 商品名 </text>
          <view class="right-text" v-if="type !='goods'">
            <text class="right-tag"> 标签 </text>
            <text class="right-tag"> 标签 </text>
          </view>
          <view class="right-text right-sales" v-if="type !='goods'"> 月销售</view>
          <view class="right-text"> ¥ {{item.sumOrderAmt}}</view>
        </view>
      </up-col>
    </up-row> -->
    <view class="card-text " style=" padding-bottom: 20rpx">
      <view class="">
        共
        <text class="" style="color: #36d7c2">
          {{ item.num }}
        </text>
        件
      </view>
      <view class="">
        实付款:
        <text style="color: red; font-weight: bold">¥{{ item.sumPayAmt }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import  productVue from './product.vue'
export default {
  components:{productVue},
  data () {
    return {
      errorImg: '/static/uView/load_error.png'
    }
  },
  props: {
    item: {
      type: Object,
      default: () => { }
    },
 
  },
  mounted () {
    console.log(this.item, ';item')
  },
  methods: {

  }
}
</script>

<style scoped >
.card-item {
  margin: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 0;
}
.left-box {
  position: relative;
}
.left-icon {
  position: absolute;
  right: 0;
  top: 0;
}
.right-box {
  display: flex;
  height: 120rpx;
  flex-direction: column;
  justify-content: space-between;
}
.right-text {
  padding-left: 20rpx;
}
.title {
  font-size: 36rpx;
  font-weight: 500;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.2;
  font-size: 16px;
}
.right-tag {
  border-radius: 10rpx;
  font-size: 24rpx;
  padding: 5rpx;
  background: #ccc;
  margin-right: 20rpx;
}
.right-price {
  color: red;
}
.right-sales {
  color: #999;
  font-size: 24rpx;
}
.card-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  padding: 10rpx 20rpx 0;
}

</style>