<!--
 * @Description: 订单列表
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container :props-data="propsData">
    <!-- mallScene == "mall" 是商城订单 -->
    <!-- 合并支付标识 payTypeFlag 01-单订单支付, 02-多订单合并支付 -->
    <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;">
      <view class="top-bg2"></view>
    </view>
    <view class="true-content" style="position: relative;">
        <vc-login v-if="!isLogined" />
        <view v-else class="" style="height: 100%;">
          <view
            class=""
            style="background: #fff; border-radius: 20rpx; padding: 20rpx">
            <up-input
              placeholder="请输入订单号"
              prefixIcon="search"
              v-model="orderSearch"
              prefixIconStyle="font-size: 22px;color: #909399"
              @change="inputChange"
              @confirm="inputConfirm">
            </up-input>
            <up-tabs
              :list="list"
              @click="tabsClick"
              lineColor="#00BCB8"
              :scrollable="false">
            </up-tabs>
          </view>
          <vc-empty v-if="orderList.length === 0"></vc-empty>
          <scroll-view
            v-else
            scroll-y
            :style="{ height: screenHeight + 'rpx' }"
            style="background: #f5f6f8; padding-bottom: 20rpx"
            @scrolltolower="onScrollToLower">
            <view
              class=""
              v-for="item in orderList"
              :key="item.id"
              style="background: #fff; margin-left: 20rpx; margin-right: 20rpx"
              @click="itemClick(item)">
              <view class="card-item">
                <view class="card-text">
                  <view
                    class=""
                    style="display: flex; align-items: center; font-size: 28rpx">
                    <image
                      style="width: 28rpx; height: 28rpx; margin-right: 10rpx"
                      src="../static/detail.png"
                      mode="aspectFit"
                      lazy-load="false"
                    />
                    <view class=""> 单号:{{ item.orderId }} </view>
                  </view>
                  <view class="" style="color: red; font-weight: bold">
                    <!-- {{ item.orderStatusName }} -->
                  </view>
                </view>
                  <up-line color="#999999" style="margin-bottom: 20rpx"></up-line>
                <view
                  class=""
                  style="
                    font-size: 24rpx;

                    font-weight: bold;
                    display: flex;
                    justify-content: space-between; ">
                  <view class="">
                    <view class="" v-if="item.orderStatusName == '退款中'">
                      原支付单号: {{ item.orOrderId }}
                    </view>
                  </view>
                  <view class="" style="color: red">
                    {{ item.orderStatusName }}
                  </view>
                </view>
                <view v-for="(ziItem, index) in item.subOrderList" :key="index">
                  <!-- <productVue :item="item" /> -->
                  <view class="card-item-zi">
                    <view class="card-item-zi-icon">
                      <image v-if="item.mallScene =='mall'"  class="" mode="widthFix" style="width: 100%;" src="../static/shop.png" />
                    </view>
                    <!-- <up-row justify="space-between" gutter="10">
          <up-col span="4"> -->
                    <view class="left-box">
                      <image
                        v-if="!ziItem.listPicUrl"
                        style="height: 160rpx; widht: 160rpx"
                        src="../static/uploadImg.png"
                      />
                      <up-lazy-load
                        v-else
                        :height="80"
                        style="height: 160rpx; widht: 160rpx"
                        border-radius="15"
                        :error-img="errorImg"
                        img-mode="scaleTiFill"
                        :image="pickerUrl(ziItem.listPicUrl)">
                      </up-lazy-load>
                    </view>
                    <!-- </up-col>
          <up-col span="8"> -->
                    <view class="demo-layout bg-purple-light right-box">
                      <text class="right-text title"> {{ ziItem.spuName }}</text>
                      <view
                        class="right-text"
                        style="
                          display: flex;
                          justify-content: space-between;
                          align-items: flex-end;">
                        <view class="">
                          <text class="paidAmount" style="font-size: 28rpx">¥ {{ ziItem.subPayAmt }}</text>
                          <text
                            class="productAmount"
                            style="text-decoration-line: line-through">¥ {{ ziItem.subOrderAmt }}</text >
                        </view>

                        <view class="productAmount" style="text-align: right">
                          x{{ ziItem.number }}
                        </view>
                      </view>
                    </view>
                    <!-- </up-col>
        </up-row> -->
                  </view>
                </view>
                <view class="card-text" style="padding-bottom: 20rpx">
                  <view class="">
                    共
                    <text class="" style="color: #36d7c2">
                      {{ item.num }}
                    </text>
                    件
                  </view>
                  <view class="">
                    实付款:
                    <text style="color: red; font-weight: bold">
                      ¥{{ item.sumPayAmt }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
            <up-loadmore
              v-if="isLoadMore"
              :status="loadStatus"
              @loadmore="addRandomData"></up-loadmore>
          </scroll-view>
          <vc-login v-if="!isLogined" />
        </view>
    </view>
  </vc-container>
</template>

<script>
import cardVue from '../components/card.vue'
import { getOrderList, getOrderListByUserId, getDataDicList } from '../api/index'
import { mapState } from 'pinia'
import productVue from '../components/product.vue'
import { useBaseStore, useUserStore } from "@/store/index"
export default {
  components: {
    cardVue,
    productVue
  },
  data () {
    return {
      isLoadMore: false,
      propsData: {
        props: {
          title: {
            value: '我的订单'
          },
          // fixed: {
          //   value: false,
          // },
          // bgColor: {
          //   value: "#f5f6f8",
          // },
        }
      },
      loadStatus: 'loading',
      list: [{ name: '全部', value: '' },
      { name: '待付款', value: '98,00,01' },
      { name: '付款完成', value: '02' },
      { name: '退款', value: '01,02' },
      { name: '其他', value: '90,91,99,05,04,03' }],
      orderSearch: '',
      orderType: '',
      orderList: [],
      page: 1,
      total: 0,
      userType: '',
      userId: '',
      mctId: '',
      detailInfoUserId: '',
      dateType: null,
      screenHeight: 0
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  onLoad (options) {
    this.options = options
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
      return
    }
    this.__loadData__()
  },
  methods: {
    async __loadData__ () {
      this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
      console.log("userInfo: ", this.userInfo)
      if (!this.userInfo) {
        return
      }
      const { userType, mctId, userId, detailInfoUserId, dateType } = this.options
      if (this.bridgeSdk.checkIsEmpty(mctId)) {
        console.log('mctId', userType, mctId, detailInfoUserId, dateType)
        this.userType = userType
        this.mctId = mctId
        this.detailInfoUserId = detailInfoUserId
        this.userId = userId
        this.dateType = dateType
      }
      this.orderListInit()
      this.getDic()
      // // 获取屏幕高度
      // const height = this.bridgeSdk.getWindowInfo()
      // console.log(height, 'heightheightheight');
      // // 获取状态栏高度
      const { statusBarHeight, navBarHeight } = await this.bridgeSdk.getDeviceInfo()
      // // 获取状态栏高度
      // this.statusBarHeight = res.statusBarHeight 
      // // 获取导航栏高度
      // this.navBarHeight = res.navBarHeight
      const res = await this.bridgeSdk.getWindowInfo()
      console.log(statusBarHeight, navBarHeight, res.screenHeight)
      this.screenHeight = this.px2rpx(res.screenHeight - statusBarHeight - navBarHeight - 11 - 104)
    },
    pickerUrl (item) {
      if (item.includes('http://') || item.includes('https://')) return item
      return this.minioBaseUrl + item
    },
    //px换算rpx
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale
    },
    // 字典
    getDic () {
      getDataDicList({ code: 'ORDER_STATUS' }).then((res) => {
        console.log(res, '字典')
        res.forEach(item => {
          console.log(item, 'itemitemitem')
          // this.list.push({
          //   name: item.optName,
          //   value: item.optCode
          // })
        })
        //   // 全部
        //   let listAll = ['待付款','交易成功','交易失败','已取消','售后']
        //   let all = []
        //   // 待付款
        //   let listDue = ['待付款']
        //   let due = []
        //   // 待收货
        //   let listWaitToBeReceived = ['待收货']
        //   let waitToBeReceived = []
        //   // 退款/售后
        //   let listRefund = ['待商家审核','待退货','待退款','退款成功']
        //   let refund = []
        //   res.forEach(item => {
        //    console.log(item, 'itemitemitem');
        //    if(listAll.includes(item.optName)){
        //     all.push(item.optCode)
        //    }
        //    if(listDue.includes(item.optName)){
        //     due.push(item.optCode)
        //    }
        //    if(listWaitToBeReceived.includes(item.optName)){
        //     waitToBeReceived.push(item.optCode)
        //    }
        //    if(listRefund.includes(item.optName)){
        //     refund.push(item.optCode)
        //    }
        //   })
        //   this.list = [
        //     {
        //       name: '全部',
        //       value: all.join(','),
        //     },
        //     {
        //       name: '待付款',
        //       value: due.join(','),
        //     },
        //     // 目前没有待收货和退款状态 暂时注释
        //     // {
        //     //   name: '待收货',
        //     //   value:  waitToBeReceived.join(','),
        //     // },
        //     // {
        //     //   name: '退款/售后',
        //     //   value:  refund.join(','),
        //     // },
        //   ]
      })
    },
    onScrollToLower (e) {
      console.log('onScrollToLower', e, this.orderList.length, this.total)
      if (this.orderList.length < this.total) {
        this.loadStatus = 'loading'
        this.isLoadMore = true
        this.page = this.page + 1
        this.getOrderList()
      // this.orderListInit()
      } else {
        setTimeout(() => {
          this.loadStatus = 'loaded'
          this.isLoadMore = false
        }, 1000)
      }
    },
    inputChange (e) {
      let that = this
      this.$u.debounce(function () {
        console.log('inputChange', e)
        that.orderListInit()
      }, 1000)
    },
    inputConfirm (e) {
      console.log('inputConfirm', e)
      this.orderListInit()
    },
    tabsClick (e) {
      console.log(e, 'tabsClick')

      this.orderType = e.value
      let payType
      if (e.value == '98,00,01' || e.value == '02') {
        payType = '00'
      } else if (e.value == '01,02') {
        payType = '01'
      }
      this.orderListInit(payType)
    },
    async orderListInit (type) {
      console.log(type, 'typetypetype');
      let payType
      if(!type){
        if (this.orderType == '98,00,01' || this.orderType == '02') {
          payType = '00'
        } else if (this.orderType == '01,02') {
          payType = '01'
        }
      }
     
      this.page = 1
      getOrderListByUserId({
        page: 1,
        rows: 10,
        userId: this.userInfo.userId,//用户编号
        orderStatus: this.orderType,
        orderId: this.orderSearch,
        dateType: 2,// 日期类型  1 当天 2自定义时间
        payType: type ? type : payType
      }).then(async res => {
        console.log(res, 'dindgan')

        this.isLoadMore = false
        this.orderList = res.list
        this.total = res.total
        this.orderList.forEach(item => {
          let val
          if (item.payType == '00') {
            val = '付款'
          } else if (item.payType == '01') {
            val = '退款'
          } else {
            val = item.payTypeName
          }
          if (item.orderStatus == '01') {
            item.orderStatusName = val + '中'
          } else if (item.orderStatus == '02') {
            item.orderStatusName = val + '完成'
          } else if (item.orderStatus == '03') {
            item.orderStatusName = val + '失败'
          } else if (item.orderStatus == '04' || item.orderStatus == '99' || item.orderStatus == '05') {
            item.orderStatusName = '已取消'
          }

        })
      })
    },
    async getOrderList () {
      let payType
        if (this.orderType == '98,00,01' || this.orderType == '02') {
          payType = '00'
        } else if (this.orderType == '01,02') {
          payType = '01'
        }
      getOrderListByUserId({
        page: this.page,
        rows: 10,
        userId: this.bridgeSdk.getUserInfo().userInfo.userId,//用户编号
        orderStatus: this.orderType,
        orderId: this.orderSearch,
        dateType: 2,// 日期类型  1 当天 2自定义时间
        payType:payType
      }).then(async res => {
        this.isLoadMore = false
        this.orderList.push(...res.list)
        this.total = res.total
        this.orderList.forEach(item => {
          let val
          if (item.payType == '00') {
            val = '付款'
          } else if (item.payType == '01') {
            val = '退款'
          } else {
            val = item.payTypeName
          }
          if (item.orderStatus == '01') {
            item.orderStatusName = val + '中'
          } else if (item.orderStatus == '02') {
            item.orderStatusName = val + '成功'
          } else if (item.orderStatus == '03') {
            item.orderStatusName = val + '失败'
          } else if (item.orderStatus == '04' || item.orderStatus == '99' || item.orderStatus == '05') {
            item.orderStatusName = '已取消'
          }

        })
      })
    },
    itemClick (item) {
      console.log('itemClick', item)
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/orderDetail/orderDetail?productItem=${JSON.stringify(item)}&isMctId=${this.bridgeSdk.checkIsEmpty(this.mctId)}`
      })
    }
  }
}
</script>

<style scoped>
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
.card-item-zi {
  margin: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
  position: relative;
}
.card-item-zi-icon{
  position: absolute;
  width: 130rpx;
  height: 130rpx;
  right: -40rpx;
  top: 0;
  opacity:0.6
}
.left-box {
  position: relative;
  width: 160rpx;
  margin-right: 12rpx;
}
.left-icon {
  position: absolute;
  right: 0;
  top: 0;
}
.right-box {
  display: flex;
  height: 160rpx;
  flex-direction: column;
  justify-content: space-between;
}
.right-text {
  padding-left: 20rpx;
}
.title {
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 16px;
  font-weight: 600;
  font-size: 32rpx;
  color: #222222;
  line-height: 44rpx;
  text-align: left;
  font-style: normal;
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
  padding: 0rpx 0 20rpx;
}
.paidAmount {
  font-weight: bold;
  font-size: 24rpx;
  color: #ff1f1f;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
}
.productAmount {
  margin-left: 30rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #aaaaaa;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  /* text-decoration-line: line-through; */
}
</style>