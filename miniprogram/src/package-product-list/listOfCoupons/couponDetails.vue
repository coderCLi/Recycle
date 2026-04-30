<!--
 * @Description: 核销优惠券详情
 * @Author: 陈保磊
 * @Date:  2025-01-15 16:00:00
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="main">
    <view class="coupon-details" ref="couponDetails"> {{couponDetail.couponBaseName}} </view>
    <view class="coupon-info">
        <up-cell>
          <template #title>
            <view class="info-title">
              核销类型
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.verificationTypeName}}
            </view>
          </template>
        </up-cell>
        <up-cell>
          <template #title>
            <view class="info-title">
              核销时间
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.verificationTime}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.payOrderId">
          <template #title>
            <view class="info-title">
              支付订单号
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.payOrderId}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.verDisAmt">
          <template #title>
            <view class="info-title">
              实际优惠金额
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.verDisAmt}}
            </view>
          </template>
        </up-cell>
        <!-- <up-cell v-if="couponDetail.investmentWay">
          <template #title>
            <view class="info-title">
              出资方式
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.investmentWayName}}
            </view>
          </template>
        </up-cell> -->
        <!-- <up-cell>
          <template #title>
            <view class="info-title">
              商户出资
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.verMctInvestment}}
            </view>
          </template>
        </up-cell> -->
        <!-- <up-cell>
          <template #title>
            <view class="info-title">
              平台出资
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.verPlatformInvestment}}
            </view>
          </template>
        </up-cell> -->
        <up-cell>
          <template #title>
            <view class="info-title">
              门店名称
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.storeName}}
            </view>
          </template>
        </up-cell>
           <!-- <up-cell>
          <template #title>
            <view class="info-title">
              商户部门
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.mctDeptName}}
            </view>
          </template>
        </up-cell> -->
        <up-cell v-if="couponDetail.cashierName">
          <template #title>
            <view class="info-title">
              收银员姓名
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.cashierName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.orderAmt">
          <template #title>
            <view class="info-title">
              汇总订单金额
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.orderAmt}}
            </view>
          </template>
        </up-cell>
        <up-cell>
          <template #title>
            <view class="info-title">
              领取时间
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.getTime}}
            </view>
          </template>
        </up-cell>
        <up-cell>
          <template #title>
            <view class="info-title">
              优惠券类型
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.couponBaseTypeName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.disAllAmt">
          <template #title>
            <view class="info-title">
              优惠总金额
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.disAllAmt}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.disAmt">
          <template #title>
            <view class="info-title">
              优惠券的优惠金额
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.disAmt}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.sellAmt">
          <template #title>
            <view class="info-title">
              支付金额
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.sellAmt}}
            </view>
          </template>
        </up-cell>
        <up-cell>
          <template #title>
            <view class="info-title">
              优惠券来源
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.fromSourceName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.isBala">
          <template #title>
            <view class="info-title">
              是否对账
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isBalaName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.isDisMinAmt">
          <template #title>
            <view class="info-title">
              是否限制最低消费
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isDisMinAmtName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.disMaxAmt">
          <template #title>
            <view class="info-title">
              最大优惠金额
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.disMaxAmt}}
            </view>
          </template>
        </up-cell>
        <!-- <up-cell v-if="couponDetail.isMaxNumber">
          <template #title>
            <view class="info-title">
              是否限制发放数量
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isMaxNumberName}}
            </view>
          </template>
        </up-cell> -->
        <!-- <up-cell v-if="couponDetail.isDisMinAmt">
          <template #title>
            <view class="info-title">
              是否限制最低消费
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isDisMinAmtName}}
            </view>
          </template>
        </up-cell> -->
        <!-- <up-cell  v-if="couponDetail.isDelete">
          <template #title>
            <view class="info-title">
              是否删除
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isDeleteName}}
            </view>
          </template>
        </up-cell> -->
        <up-cell v-if="couponDetail.isDisMaxAmt">
          <template #title>
            <view class="info-title">
              是否限制最高优惠
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isDisMaxAmtName}}
            </view>
          </template>
        </up-cell>
       <up-cell v-if="couponDetail.isRefund">
          <template #title>
            <view class="info-title">
              是否可退款
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isRefundName}}
            </view>
          </template>
        </up-cell> 
        <up-cell v-if="couponDetail.isRefund == '1'">
          <template #title>
            <view class="info-title">
              退款方式
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.refundTypeName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.isCouponRefund">
          <template #title>
            <view class="info-title">
              订单退款是否退券
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isCouponRefundName}}
            </view>
          </template>
        </up-cell>
        <up-cell v-if="couponDetail.isSell">
          <template #title>
            <view class="info-title">
              领取方式
            </view>
          </template>
          <template #value>
            <view class="info-value">
              {{couponDetail.isSellName}}
            </view>
          </template>
        </up-cell>
    </view>
  </vc-container>
</template>
<script>
import { getCouponVerInfo} from '../api/index'
import { useBaseStore, useUserStore, useMctStore } from "@/store/index"
export default {
  data () {
    return {
      screenHeight:0,
      couponDetail:{},
      couponDetailInfo:{}
    }
  },
  async onLoad () {
    this.couponDetailInfo = useMctStore().couponDetailInfo
    // // // 获取状态栏高度
    // const { statusBarHeight, navBarHeight } = await this.bridgeSdk.getDeviceInfo()
    // const res = await this.bridgeSdk.getWindowInfo()
    // this.screenHeight = this.px2rpx(res.screenHeight - statusBarHeight - navBarHeight - this.$refs.couponDetails.$el.offsetTop)
    this.getCouponVerInfo()
  },
  unmounted(){
    useMctStore().setCouponDetailInfo({})
  },
  methods: {
    //px换算rpx
    // px2rpx (px) {
    //   let scale = uni.upx2px(100) / 100
    //   return px / scale
    // },
    onScrollToLower () {
      console.log('scroll to lower')
    },
  async  getCouponVerInfo(){
      let res = await getCouponVerInfo({verificationFlowId: this.couponDetailInfo.verificationFlowId,})
      console.log(res,'resss');
      this.couponDetail = res
    }
  }

}
</script>

<style lang="scss" scoped>
.coupon-details {
  padding: 20rpx;
  text-align: center;
  font-size: 36rpx;
  color: #333;
  background-color: #fff;
}
.coupon-info {
  background-color: #fff;
  .info-title {
    width: 200rpx;
  }
  .info-value {
    width: calc(100% - 200rpx);
    text-align: right;
  }
}
</style>