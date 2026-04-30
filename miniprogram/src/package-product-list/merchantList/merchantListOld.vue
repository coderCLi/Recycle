<!--
 * @Description: 商户列表
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container :props-data="propsData">
    <view class="">
      <view class="" style="text-align: center; padding-left: 20rpx">
        <u-input
          ref="input"
          class="input"
          height="80rpx"
          v-model="value"
          clearable
          placeholder="请输入商品名称"
          prefix-icon="search"
          @change="onChange">
          <template #suffix>
            <text
              class=""
              style="
                color: #d8d8d8;
                float: left;
                font-size: 38rpx;
                padding-right: 30rpx;">
              |
            </text>
            <text
              class=""
              @click="getMinShengPrice({ goodName: value })"
              style="
                color: #00bcb8;
                font-size: 28rpx;
                line-height: 54rpx;
                font-weight: bold;
                margin-right: 20rpx;">
              搜索
            </text>
          </template>
        </u-input>
      </view>
      <scroll-view
        scroll-y
        @scrolltolower="onScrollToLower"
        :style="{ height: height + 'rpx' }">
        <view
          v-for="item in merchantList"
          :key="item.storeId"
          @click="toDetail(item)">
          <merchant-item :item="item"></merchant-item>
        </view>
      </scroll-view>
    </view>
  </vc-container>
</template>

<script>
import merchantItem from '../components/merchantItem.vue'
import { getStoreList } from '../api'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore } from "@/store/index"
import { hbd } from "@/utils/bridge"
export default {
  data () {
    return {
      needOpenLocation: true,
      value: '',
      height: 0,
      page: 1,
      rows: 10,
      total: 0,
      // 纬度
      latitude: '',
      // 精度
      longitude: '',
      merchantList: []
    }
  },

  components: {
    merchantItem
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad () {
    // await this.firstInit()

  },
  async mounted () {
    this.merchantList = []
    this.getLat()
    const res = await this.bridgeSdk.getWindowInfo()
    const { statusBarHeight, navBarHeight, height } = await this.bridgeSdk.getDeviceInfo()
    console.log(res, this.$refs.input.$el.offsetHeight, 'res')
    this.height = this.px2rpx(height - statusBarHeight - navBarHeight - this.$refs.input.$el.offsetHeight - 30)
    // this.height = height - statusBarHeight - navBarHeight -this.$refs.input.$el.offsetHeight - 30
    this.getmerchantList()

  },
  methods: {
    //px换算rpx
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale - 40
    },
    getLat () {
      // // #ifdef MP-WEIXIN
      // uni.getLocation({
      //   type: 'bd09ll',
      //   success: function (res) {
      //     console.log(res, 'getLocation')
      //     console.log('当前位置的经度：', res, res.longitude)
      //     console.log('当前位置的纬度：' + res.latitude)
      //     if (res.errMsg.includes('ok')) {
      //       this.latitude = res.latitude
      //       this.longitude = res.longitude
      //     }
      //   }
      // })
      // // #endif      
      // // #ifdef H5
      // hi.getLatLng({
      //   type: 'bd09ll',
      //   success: function (res) {
      //     console.log(res, 'hbd')
      //     console.log('当前位置的经度：' + res.data.longitude)
      //     console.log('当前位置的纬度：' + res.data.latitude)
      //     if (res.errCode == 1) {
      //       this.latitude = res.data.latitude
      //       this.longitude = res.data.longitude
      //     }

      //   }
      // })
      // // #endif

      this.bridgeSdk.getLocation(res => {
        this.needOpenLocation = res.locationFail === true;
        console.log(res, 'getLocation')
        this.longitude = Number(res.lng);
        this.latitude = Number(res.lat);
      });
      
    },
    async getmerchantList () {
      let res = await getStoreList({
        storeName: this.value,
        page: this.page,
        rows: this.rows,
        latitude: this.latitude,
        longitude: this.longitude,
        loginFlag :0
      })
      console.log(res, 'res')
      if (this.total != this.merchantList.length && this.total > 0) {
        this.merchantList.push(...res.list)
      } else if (this.total == 0) {
        this.merchantList = res.list
        this.merchantList.forEach(item => {
          item.distance = (Number(item.distance)/1000).toFixed(1)
        })
      }
      this.total = res.total
    },
    onScrollToLower () {
      this.page += 1
      this.getmerchantList()
    },
    onChange (value) {
      this.merchantList = []
      this.getmerchantList()
    },
    getMinShengPrice () {
      this.merchantList = []
      this.getmerchantList()
    },
    toDetail (item) {
      console.log(item, 'item')
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/merchantDetail/merchantDetail?storeId=${item.storeId}&mctId=${item.mctId}`
      })
    }
  }
}
</script>

<style scoped>
.merchant {
  height: 100%;
}
.input {
  margin-top: 24rpx;
  margin-bottom: 24rpx;
  background: #fff;
  border-radius: 42rpx;
  width: 670rpx;
}
</style>