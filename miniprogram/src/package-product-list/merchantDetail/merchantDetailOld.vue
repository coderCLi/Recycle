<!--
 * @Description: 门店详情
 * @Author: 陈保磊
 * @Date: 2025-01-15 16:00:00
-->
<template>
  <vc-container :props-data="propsData">
    <!-- <vc-login v-if="!isLogined" /> -->
    <view class="box">
      <view
        class=""
        ref="top"
        style="background-color: #fff; padding: 20rpx; border-radius: 10rpx">
        <view class="title">
          <view class="left-image">
            <image
              v-if="!merchant.listPicUrl"
              style="width: 100%; height: 100%"
              src="../static/uploadImg.png"
              mode="" >
            </image>
            <image
              v-else
              style="width: 100%; height: 100%"
              :src="this.minioBaseUrl + merchant.listPicUrl"
              mode="" >
            </image>
          </view>
          <view class="right-name">
            <view class="merchnt"> {{ merchant.storeName }} </view>
            <view class="right-phone">
              <!-- <view class=""> 手机号: {{ merchant.storePhone }} </view> -->
              <view class=""> {{ merchant.distance }}km </view>
            </view>
            <view class="" style="font-size: 28rpx; color: #999">
              地址: {{ merchant.provinceName }}{{ merchant.cityName
              }}{{ merchant.areaName }}{{ merchant.storeAddress }}
            </view>
          </view>
        </view>

        <view class="" style="margin-top: 20rpx">
          <up-tag
            v-for="item in merchant.storeTime"
            :key="item.storeId"
            :text="item.start + '-' + item.end"
            type="success"
            size="mini"
            style="margin: 0 5rpx 10rpx 0"></up-tag>
        </view>
      </view>
      <view class="cart-box" v-if="!couponList.length == 0">
        <scroll-view scroll-x>
          <view class="cart">
            <view
              class="cart-form"
              v-for="item in couponList"
              :key="item.couponBaseId"
              style="display: flex; margin-right: 20rpx; align-items: center">
              <view class="cart-item">
                <text style="font-size: 24rpx">¥</text>{{ item.disAmt }}
              </view>
              <view class="" style="width: 200rpx">
                <view class="cart-name"> {{ item.couponBaseName }} </view>
                <view class="cart-type"> {{ item.couponBaseTypeName }} </view>
              </view>
              <view class="" style="width: 100rpx">
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
        </scroll-view>
        <view class="gengduo" @click="jumpToAll()"> 查看全部 </view>
      </view>
      <view class="list">
        <u-input
          class="input"
          height="80rpx"
          style="border-radius: 100rpx"
          v-model="name"
          clearable
          placeholder="请输入商品名称"
          prefix-icon="search">
          <template #suffix>
            <text class="left-solt"> | </text>
            <text class="search-slot" @click="getMinShengPrice()"> 搜索 </text>
          </template>
        </u-input>
        <scroll-view
          ref="scroll"
          scroll-y
          @scrolltolower="scrolltolower"
          :style="{ height: height }">
          <view
            class=""
            v-for="item in Product"
            @click="handleClick(item)"
            :key="item.spuId">
            <productDetails :item="item"></productDetails>
          </view>
        </scroll-view>
      </view>
    </view>
    <vc-modal></vc-modal>
  </vc-container>
</template>

<script>
import { mapState } from 'pinia'
import { getStoreInfo, getProductList, userGetCoupon, getCouponBaseList } from '../api'
import { useBaseStore, useUserStore } from "@/store/index"
import productDetails from '../components/productDetails.vue'
export default {
  data () {
    return {
      storeId: '',
      couponList: [],
      mctId: '',
      merchant: {},
      Product: [],
      totle: 0,
      page: 1,
      height: '100rpx',
      longitude: 0,
      latitude: 0,
    }
  },
  components: { productDetails },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    console.log(options)
    this.storeId = options.storeId
    this.mctId = options.mctId
    await this.getLat()
    this.getStoreDetail()
    this.getProduct()
    this.getUserGetCoupon()
    const { statusBarHeight, navBarHeight } = await this.bridgeSdk.getDeviceInfo()
    const res = await this.bridgeSdk.getWindowInfo()
    console.log(res, 'getWindowInfo', this.$refs.scroll.$el.getBoundingClientRect().top, this.$refs.top.$el.offsetHeight)
    this.height = this.px2rpx(res.screenHeight - statusBarHeight - navBarHeight - this.$refs.scroll.$el.getBoundingClientRect().top - 30) + 'rpx'
  },
  methods: {
    //px换算rpx
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale
    },
    jumpToAll () {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/couponCollectionList/couponCollectionList?mctId=${this.mctId}`
      })
    },
    async drawDownClick (item) {
      /* 	jsonList:{
    couponBaseId;//优惠券编号
    couponGetNum;//领取数量
  }
  chnlFlag：0 */
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
    async getUserGetCoupon () {
      // getStatus: 
      let res = await getCouponBaseList({ mctId: this.mctId, couponBaseStatus: 1 })
      console.log(res, 'userGetCoupon')
      if (res.total > 3) {
        this.couponList = res.list.slice(0, 3)
      } else {
        this.couponList = res.list
      }
    },
    getDomHeight (className) {
      const query = uni.createSelectorQuery().in(this)
      let height = 0
      query
        .select(className)
        .boundingClientRect((data) => {
          console.log("得到布局位置信息" + JSON.stringify(data))
          console.log("节点离页面顶部的距离为" + data.height)

          height = data.height
        })
        .exec()
      return height ? height : 0
    },
    getLat () {
      this.bridgeSdk.getLocation(res => {
        this.needOpenLocation = res.locationFail === true
        console.log(res, 'getLocation')
        this.longitude = Number(res.lng)
        this.latitude = Number(res.lat)
      })

    },
    async getStoreDetail () {
      const res = await getStoreInfo({
        storeId: this.storeId, loginFlag: 0,
        latitude: this.latitude,
        longitude: this.longitude,
      })
      console.log(res, 'res')
      this.merchant = res
      this.merchant.storeTime = JSON.parse(this.merchant.storeTime)
      this.merchant.distance = (Number(this.merchant.distance) / 1000).toFixed(1)

    },
    getMinShengPrice () {
      this.page = 1
      this.Product = []
      this.getProduct()
    },
    async getProduct () {
      const res = await getProductList({
        mctId: this.mctId,
        page: this.page,
        rows: 10,
        name: this.name,
        loginFlag: 0
      })
      console.log(res, 'getProduct')

      if (this.Product.length == 0) {
        this.Product = res.list
      } else if (this.Product.length < res.total) {
        this.Product.push(...res.list)
      }
      this.totle = res.total
      console.log(this.Product, ' this.Product')

    },
    scrolltolower () {
      this.page += 1
      this.getProduct()
    },
    handleClick (item) {
      console.log(item, 'item')
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/productDetail/productDetail?spuId=${item.spuId}&mctId=${this.mctId}&storeId=${this.storeId}`
      })
    }
  }
}
</script>

<style  scoped>
.box {
  padding: 20rpx;
}
.left-image {
  width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;
}
.title {
  display: flex;
  align-items: center;
}
.merchnt {
  font-size: 30rpx;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  line-clamp: 3;
}
.list {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 10rpx;
}
.right-name {
  flex: 1;
  height: 180rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.right-phone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26rpx;
  color: #999;
}
.left-solt {
  color: #d8d8d8;
  float: left;
  font-size: 38rpx;
  padding-right: 30rpx;
}
.search-slot {
  color: #00bcb8;
  font-size: 28rpx;
  line-height: 54rpx;
  font-weight: bold;
  margin-right: 20rpx;
}
.cart {
  display: flex;
  padding: 10rpx;
  height: 100rpx;
  align-items: center;
}
.cart-item {
  margin-right: 10rpx;
}
.cart-name {
  font-size: 26rpx;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 在溢出的文字末尾显示省略号 */
  width: 200rpx; /* 设置容器的宽度 */
  font-weight: bold;
}
.cart-type {
  font-size: 28rpx;
}
.cart .cart-form:last-child {
  padding-right: 70rpx !important;
}
.cart-box {
  position: relative;
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
}
.gengduo {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  font-size: 26rpx;
  width: 60rpx;
  border-radius: 20rpx;
}
</style>