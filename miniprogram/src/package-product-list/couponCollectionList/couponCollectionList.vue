<!--
 * @Description: 优惠券领取列表
 * @Author: 陈保磊
 * @Date:  2025-01-17 16:00:00
-->

<template>
  <vc-container :props-data="propsData">
    <scroll-view
      scroll-y
      @scrolltolower="getUserGetCoupon(true)"
      :style="{ height: height }">
      <view
        class="collection-list"
        v-for="item in couponList"
        :key="item.couponBaseId">
        <view class="collection-item">
          <view class="collection-left">
            <image
              v-if="!item.photoUrl"
              style="height: 100%; widht: 100%"
              mode="heightFix"
              src="../static/uploadImg.png" />
            <image
              v-else
              style="height: 100%; width: 100%"
              mode="heightFix"
              :src="minioBaseUrl + item.photoUrl" />
          </view>
          <view class="collection-right">
            <view class="">
              <view
                class=""
                style="font-size: 32rpx; color: #000; font-weight: bold" >
                {{ item.couponBaseName }}
              </view>
              <view class="" style="font-size: 26rpx; color: #999">
                优惠金额: {{ item.disAmt }}
              </view>
              <view class="" style="font-size: 26rpx; color: #999">
                {{ quanType(item.couponBaseType) }}: {{ item.disAllAmt }}
              </view>
              <view class="" style="font-size: 26rpx; color: #999">
                最高优惠金额: {{ item.disMaxAmt }}
              </view>
              <view
                class=""
                style="font-size: 26rpx; color: #999; z-index: 99"
                @click="expandMore(item)" >
                展开更多
              </view>
            </view>
            <view class="">
              <up-button
                type="primary"
                text="领取"
                style="height: 40rpx"
                color="#00bcb9"
                shape="circle"
                @click="drawDownClick(item)">
              </up-button>
            </view>
          </view>
        </view>
        <!-- <Transition name="fade" mode="out-in" appear>
        <view class="" v-if="show" style="height: 100rpx;background-color: #fff;"> 4444 </view>
      </Transition> -->
        <up-transition
          :show="show['show' + item.couponBaseId]"
          mode="slide-right"
          :duration="990">
          <view
            class=""
            style="
              display: flex;
              flex-direction: column;
              padding: 20rpx;
              background-color: #fff;">
            <view class="gengduo">
              <text class=""> 是否限制最高优惠 </text>
              <text class=""> {{ item.isDisMaxAmtName }} </text>
            </view>
            <view class="gengduo">
              <text class=""> 是否限制发放数量 </text>
              <text class=""> {{ item.isMaxNumberName }} </text>
            </view>
            <view class="gengduo">
              <text class=""> 是否限制最高优惠 </text>
              <text class=""> {{ item.isDisMaxAmtName }} </text>
            </view>
            <view class="gengduo">
              <text class=""> 券码有效期 </text>
              <text class="">  {{ timefunc(item) }} </text>
            </view>
          </view>
        </up-transition>
      </view>
    </scroll-view>
  </vc-container>
</template>

<script>
import { getStoreInfo, getProductList, userGetCoupon, getCouponBaseList } from '../api'
export default {
  data () {
    return {
      propsData: {
        title: '优惠券领取列表',

      },
      mctId: '',
      show: {},
      couponList: [],
      page: 1,
      height: 0
    }
  },
  async onLoad (options) {
    this.mctId = options.mctId
    this.getUserGetCoupon(false)
    const { statusBarHeight, navBarHeight } = await this.bridgeSdk.getDeviceInfo()
    const res = await this.bridgeSdk.getWindowInfo()
    this.height = this.px2rpx(res.screenHeight - statusBarHeight - navBarHeight) + 'rpx'
  },
  methods: {
    //px换算rpx
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale
    },
    expandMore (item) {
      console.log(this.show)

      if (this.show['show' + item.couponBaseId]) {
        this.show['show' + item.couponBaseId] = false
      } else {
        this.show['show' + item.couponBaseId] = true
      }
    },
    async getUserGetCoupon (type) {
      // getStatus: 
      if (type) {
        this.page += 1
      }
      let res = await getCouponBaseList({
        mctId: this.mctId,
        couponBaseStatus: 1,
        page: this.page,
        rows: 10
      })
      console.log(res, 'userGetCoupon')
      this.total = res.total
      if (res.total == this.couponList.length && res.total != 0) return
      this.couponList.push(...res.list)
    },
    timefunc(item){
      let time = ''
      if(item.useTimeout ==null || item.useTimeout ==''){
        time = item.useStartTime + '-' + item.useEndTime
      }else {
        time = item.useTimeout + '天后到期'
      }
      return time
    },
    quanType (type) {
      let name = ''
      if (type == '00') {
        name = '满减前金额'
      } else if (type == '02' || type == '03') {
        name = '最低消费金额'
      }
      return name
    },
    async drawDownClick (item) {

      let res = await userGetCoupon({
        jsonList: JSON.stringify({
          couponBaseId: item.couponBaseId,
          couponGetNum: 1
        }),
        chnlFlag: 0
      })
      if (res != null) {
        uni.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000
        })
      }


      // this.bridgeSdk.showToast({
      //   title: '领取成功',
      //   icon: 'none'
      // })
    },
  }
}
</script>

<style scoped lang="scss">
.collection-list {
  padding: 20rpx 20rpx 0;
  .collection-item {
    z-index: 9999999;
    border-radius: 10rpx;
    background-color: #fff;
    padding: 20rpx;
    display: flex;
    align-items: stretch;
    .collection-left {
      width: 200rpx;
      // background-color: #f2f2f2;
      margin-right: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20rpx;
      font-size: 50rpx;
      flex-direction: column;
      .left {
        .left-icon {
          font-size: 28rpx;
          color: #00bcb9;
        }
      }
    }
    .collection-right {
      padding-left: 20rpx;
      border-left: 1px dashed #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
    }
  }
}
.gengduo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20rpx;
  color: #999;
}
</style>