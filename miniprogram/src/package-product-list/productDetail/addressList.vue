<!--
 * @Description: 收货地址列表
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container>
    <vc-empty v-if="addressList.length === 0"></vc-empty>
    <view class="main" v-else>
      <!-- <vc-status-bar />
        <vc-navbar :props-data="propsData" /> -->
      <view>
        <up-cell-group
          v-for="(item, index) in addressList"
          :key="index"
          class="list"
        >
          <up-cell center>
            <template #title>
              <view
                @click="ReturnToUpperLevel(item)"
                :class="[
                  item.isDefault == '1' ? 'default-style' : 'no-default-style',
                ]" >
                <view v-if="item.isDefault == '1'" class="default">默认</view>
                <text class="name">{{ item.name }}</text>
                <text class="mobile">{{ item.mobile }}</text>
              </view>
            </template>
            <template #label>
              <view class="label">
                <up-image
                  :src="isDefaultImge"
                  width="40rpx"
                  height="40rpx"
                  v-if="item.isDefault == '1'"
                ></up-image>
                <text
                  :class="['address',item.isDefault == '1' ? 'address-value' : '',]">
                  {{
                    item.provinceName +
                    item.cityName +
                    item.areaName +
                    item.address
                  }}
                </text>
              </view>
            </template>
            <template #value>
              <view class="u-slot-title">
                <view
                  class=""
                  style="
                    width: 100rpx;
                    height: 100rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;" >
                  <up-image
                    :src="editorImge"
                    width="28rpx"
                    height="28rpx"
                    @click="toEditor(item.id)"
                  ></up-image>
                </view>
              </view>
            </template>
          </up-cell>
        </up-cell-group>
      </view>
      <u-loadmore :status="status" v-if="addressList.length !== 0"></u-loadmore>
      <view style="flex-shrink: 0">
        <vc-safe-bottom />
      </view>
    </view>
    <view class="button" @click="toAdd"> 添加新地址 </view>
  </vc-container>
</template>
<script>
import vcContainer from '@/components/library/base/vc-container/vc-container.vue'
import { getDeliveryAddressPage } from '../api/index'
export default {
  components: { vcContainer },
  name: "addressList",
  data () {
    return {
      propsData: {
        props: {
          title: {
            value: '选择收货地址',
          },
        }
      },
      addressList: [],
      total: null,
      pageCurrent: 1,
      pageSize: 10,
      status: 'loadmore',
      isDefaultImge: this.staticBaseUrl + '/hbdimage/address/default.png',
      editorImge: this.staticBaseUrl + '/hbdimage/address/editor.png'
    }
  },
  onShow (options) {
    this.getList()
  },
  // mounted() {
  //     this.getList()
  // },
  onReachBottom () {
    let allTotal = this.pageCurrent * this.pageSize
    if (allTotal < this.total) {
      this.status = 'loading'
      this.pageCurrent++
      this.getList()
    } else {
      // console.log('已加载全部数据')
      this.status = 'nomore'
    }
  },
  onPullDownRefresh () {
    this.pageCurrent = 1
    //调用获取数据方法
    this.getList()
    setTimeout(() => {
      //结束下拉刷新
      uni.stopPullDownRefresh()
    }, 1000)
  },
  computed: {

  },
  methods: {
    ReturnToUpperLevel (item) {
      console.log(item, 'trigger back')
      this.bridgeSdk.navigateBackTo({
        delta: 1
      })
      uni.$emit('updateData', { ...item })

    },
    getList () {
      getDeliveryAddressPage({
        page: this.pageCurrent,
        rows: this.pageSize
      }).then(res => {
        if (this.pageCurrent === 1) {
          this.addressList = res.list
        } else {
          this.addressList = [...this.addressList, ...res.list]
        }
        this.total = res.total
        let allTotal = this.pageCurrent * this.pageSize
        if (allTotal < this.total) {
          this.status = 'loadmore'
        } else {
          this.status = 'nomore'
        }
      })
    },
    toEditor (id) {
      this.bridgeSdk.jumpPage({
        url: `/package-address/pages/editorAddress?id=${id}`,
        title: '编辑收货地址'
      })
    },
    toAdd () {
      this.bridgeSdk.jumpPage({
        url: `/package-address/pages/addAddress`,
        title: '添加收货地址'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #fff;
  height: 100vh;
}

.list {
  width: 670rpx;
  margin: 0 40rpx;
}

.default-style {
  margin-bottom: 8rpx;
  margin-left: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.no-default-style {
  margin-bottom: 8rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.default {
  width: 68rpx;
  height: 32rpx;
  background: #00bcb8;
  border-radius: 4rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 20rpx;
  color: #ffffff;
  line-height: 32rpx;
  text-align: center;
  font-style: normal;
  margin-right: 12rpx;
}

.name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 28rpx;
  color: #222222;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  margin-right: 24rpx;
}

.mobile {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 28rpx;
  color: #222222;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
}

.label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.address {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 28rpx;
  color: #777777;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  margin-right: 38rpx;
}

.address-value {
  margin-left: 40rpx;
}

.button {
  margin: auto;
  position: fixed;
  left: 4%;
  bottom: 96rpx;
  width: 92%;
  height: 84rpx;
  background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #ff5871;
  border-radius: 42rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 32rpx;
  color: #ffffff;
  line-height: 84rpx;
  text-align: center;
  font-style: normal;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
</style>