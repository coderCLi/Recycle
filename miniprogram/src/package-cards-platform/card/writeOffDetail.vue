<!--
  User: songjuncheng
  Date: 2025-04-22 10:19:22
  Description: 核销详情
  Lasteditors:songjuncheng
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

          <up-cell>
            <template #title>
              <view class="info-title">
                核销门店
              </view>
            </template>
            <template #value>
              <view class="info-value">
                {{couponDetail.storeName}}
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
          <up-cell>
            <template #title>
              <view class="info-title">
                优惠券核销数量
              </view>
            </template>
            <template #value>
              <view class="info-value">
                1张
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
import { getCouponDetailSec } from '../api/cardApi';//详情接口
  export default {
    data () {
      return {
        screenHeight:0,
        couponDetail:{},
        userInfo:{},
        verificationFlowId: '',
       
      }
    },
    async onLoad (options) {
      this.verificationFlowId = options.verificationFlowId;//卡券核销id
      this.getCouponVerInfo()
    },
    unmounted(){
      useMctStore().setCouponDetailInfo({})
    },
    methods: {
    async  getCouponVerInfo(){
        let res = await getCouponDetailSec({ verificationFlowId: this.verificationFlowId})
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
      width: 230rpx;
    }
    .info-value {
      width: calc(100% - 200rpx);
      text-align: right;
    }
  }
  </style>