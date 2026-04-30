<!--
 * @Description: 订单详情
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->

<template>
  <vc-container :props-data="propsData">
    <vc-login v-if="!isLogined" />
    <view v-else class="product-detail">
      <view class="product-status"> 订单状态: 
        <text v-if="productItem.refundStatus == '02'">已退款</text>  
        <text v-else>{{ productItem.status }}</text>
      </view>
      <view class="row">
        <view>
          <text class="row-title">订单编号:
            <text class="row-text">{{ productItem.id }}</text></text>
        </view>
        <view>
          <text class="row-title">
            下单时间:
            <text class="row-text">
              {{ productItem.createTime }}
              </text>
            </text>
        </view>
      </view>
     
      <view class="row">
        <!-- <view v-for="item in productItem.subOrderList" :key="item.id">
          <product :item="item" />
        </view> -->
        <view style="text-align: right" class="">
          <view class="price">
            <view style="margin-right: 10rpx">订单金额</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ <text class="font36">{{ productItem.orderAmt }}</text></view>
          </view>
        </view>
        <view style="text-align: right" class="">
          <view class="price">
            <view style="margin-right: 10rpx">支付金额</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ <text class="font36">{{ productItem.payAmt }}</text></view>
          </view>
        </view>
        <view style="text-align: right" class="">
          <view class="price">
            <view style="margin-right: 10rpx">优惠金额</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ <text class="font36">{{ productItem.discAmt||0 }}</text></view>
          </view>
        </view>
        <view style="text-align: right" class="" v-if="productItem.discountRate && productItem.discountRate != 100">
          <view class="price">
            <view style="margin-right: 10rpx">商户折扣率</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              <text class="font36">{{ formatDiscount(productItem.discountRate) }}</text></view>
          </view>
        </view>
        <view style="text-align: right" class="">
          <view class="price">
            <view style="margin-right: 10rpx">待结算金额</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ <text class="font36">{{ productItem.pendStlAmt || 0 }}</text></view>
          </view>
        </view>
        <view style="text-align: right" class="">
          <view class="price">
            <view style="margin-right: 10rpx">待补贴金额</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ <text class="font36">{{ productItem.pendSubAmt || 0 }}</text></view>
          </view>
        </view>
        <view style="text-align: right" class="" v-if="productItem.refundStatus == '02'">
          <view class="price">
            <view style="margin-right: 10rpx">退款金额</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ <text class="font36">{{ productItem.refundAmt || 0 }}</text></view>
          </view>
        </view>
      </view>
      <view class="row">
        <view>
          <text class="row-title" v-if="productItem.bizScene == 'POINTS_MALL'">
            商品名称:
            <text class="row-text">{{ productItem.goodsName }}</text>
          </text>
        </view>
        <view>
          <text class="row-title" v-if="productItem.bizScene == 'POINTS_MALL'">
            消费类型:
            <text class="row-text">{{ productItem.bizSceneName }}</text>
          </text>
        </view>
        <view>
          <text class="row-title">
            是否使用优惠券:
            <text class="row-text">{{ productItem.isUseCoupon }}</text>
          </text>
        </view>
        <view>
          <text class="row-title">
            优惠券编号:
            <text class="row-text">{{ productItem.couponId }}</text>
          </text>
        </view>
        <view>
          <text class="row-title">
            备注:
            <text class="row-text">{{ productItem.remark }}</text>
          </text>
        </view>
      </view>
    </view>
  </vc-container>
</template>

<script>
import product from '../components/product.vue'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore ,useMctStore} from "@/store/index"
export default {
  components: { product },
  data () {
    return {
      propsData: {
        props: {
          title: {
            value: '商品详情'
          },
          // fixed: {
          //   value: true,
          // },
          bgColor: {
            value: "#bcffe3",
          },
          barBgColor: {
            value: "#bcffe3",
          },

        }
      },
      productItem: {},
      isMct: false
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    //  await this.firstInit();   
    console.log('onLoad', options.productItem)
    this.productItem = useMctStore().productItem
    console.log('productItem', this.productItem)

    this.isMct = options.isMctId
  },
  methods: {
    /**
     * 格式化折扣率显示
     * @param {number} rate - 折扣率（如90表示90%）
     * @returns {string} 格式化后的折扣字符串（如9折、87折）
     */
    formatDiscount(rate) {
        // 处理以0结尾的折扣率，去掉末尾的0
        let formattedRate = rate;
        if (rate % 10 === 0 && rate >= 10) {
            formattedRate = rate / 10;
        }
        return `${formattedRate}折`;
    },
    onScrollToLower (e) {
      console.log('onScrollToLower')

    },
    dataFamte (item, type) {
      if(!item) return ''
      let data = ''
      if (type == 'yyyy-mm-dd') {
        let y = item.slice(0, 4)
        let m = item.slice(4, 6)
        let d = item.slice(6)
        data = y + '-' + m + '-' + d
      } else if (type == 'hh:mm:ss') {
        let h = item.slice(0, 2)
        let m = item.slice(2, 4)
        let s = item.slice(4)
        data = h + ':' + m + ':' + s
      }
      return data
    },
  }
}
</script>

<style scoped lang="scss">
.product-detail {
  height: 100%;
  background: linear-gradient(180deg, #baffe1 0%, #d8f7e3 45%, #f5f6f8 100%);
  padding: 30rpx 40rpx;
  .product-status {
    font-size: 36rpx;
    color: #333;
    line-height: 50rpx;
    font-weight: bold;
  }
  .row {
    margin-top: 30rpx;
    background: #fff;
    border-radius: 20rpx;
    min-height: 100rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .row-title {
      color: #222;
      font-size: 28rpx;
    }
    .row-text {
      color: #777;
      font-size: 28rpx;
      line-height: 40rpx;
    }
    .price {
      font-weight: 600;
      font-size: 28rpx;
      color: #222222;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20rpx;
      .font36{
        font-size: 36rpx;
        line-height: 50rpx;
        vertical-align: bottom;
      }
    }
  }
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent; /* 左边的透明边框 */
  border-right: 10rpx solid transparent; /* 右边的透明边框 */
  border-top: 15rpx solid #aaa;
}
</style>