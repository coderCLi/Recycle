<!--
 * @Description: 订单列表
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container  :props-data="propsData">
    <vc-login v-if="!isLogined" />

   <view v-else class="" style="height: 100%;">
     <!-- <view
      class=""
      style="background-color: #fff; border-radius: 20rpx; padding: 20rpx">
      <up-input
        placeholder="请输入订单号"
        prefixIcon="search"
        v-model="orderSearch"
        prefixIconStyle="font-size: 22px;color: #909399"
        @change="inputChange"
        @confirm="inputConfirm"></up-input>
      <up-tabs :list="list" @click="tabsClick" lineColor="#00BCB8" :scrollable="true"></up-tabs>
    </view> -->
    <view class="timeSearch">
      查询日期：
      <text class="timeSearch_text" @click="startDateShow = true">
        {{ startDateFormat }} 
        <up-icon name="arrow-bottom" size="24rpx"></up-icon>
      </text>
      至
      <text class="timeSearch_text" @click="endDateShow = true">
        {{ endDateFormat }}
         <up-icon name="arrow-bottom" size="24rpx"></up-icon>
      </text>
    </view>
    <up-datetime-picker
        :show="startDateShow"
        v-model="startDate"
        mode="date"
        @confirm="dateConfirm('startDate')"
        @cancel="dateCancel('startDate')"
    ></up-datetime-picker>
    <up-datetime-picker
        :show="endDateShow"
        v-model="endDate"
        mode="date"
        @confirm="dateConfirm('endDate')"
        @cancel="dateCancel('endDate')"
    ></up-datetime-picker>
    <view class="tabs_list">
      <view v-for="(item,index) in list" :key="index" :class="this.orderType == item.value ? 'tabs_item_active' : 'tabs_item'" @click="tabsClick(item)">
        <image class="tabs_item_img"
          :src="minioBaseUrl+ item.iconUrl"
          mode="scaleToFill"
        />
        <view class="tabs_item_text">{{ item.name }}</view>
      </view>
    </view>
    <vc-empty v-if="orderList.length === 0"></vc-empty>
    <scroll-view
      v-else
      scroll-y
      :style="{ height: (screenHeight - 30 - 132 - 80) + 'rpx' }"
      style="
        background: #f5f6f8;
        padding-bottom: 20rpx;
        padding-top: 10rpx;
        box-sizing: border-box;
      "
      @scrolltolower="onScrollToLower">
      <view
        class=""
        v-for="item in orderList"
        :key="item.id"
        style="background: #fff; margin-left: 20rpx; margin-right: 20rpx"
        @click="itemClick(item)">
        <card-vue :item="item"></card-vue>
      </view>
      <up-loadmore
        v-if="isLoadMore"
        :status="loadStatus"
        @loadmore="addRandomData"></up-loadmore>
    </scroll-view>
    
    <vc-login v-if="!isLogined" />
   </view>
  </vc-container>
</template>

<script>
import cardVue from '../components/card2.vue'
import { getOrderList, getOrderListByUserId, getDataDicList, getOrderListNew  } from '../api/index'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore,useMctStore } from "@/store/index"
import { start } from 'repl';
import { date } from '@/uni_modules/uview-plus/libs/function/test';
export default {
  components: {
    cardVue
  },
  data () {
    return {
      isLoadMore: false,
      propsData: {
        props: {
          title: {
            value: '订单'
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
      list: [
        { name: '全部', value: '', iconUrl: '/common/mctImages/woshishangjia_dingdan_quanbu_img.png' },
        { name: '处理中', value: '3', iconUrl: '/common/mctImages/woshishangjia_dingdan_chulizhong_img.png' },
        { name: '交易成功', value: '1', iconUrl: '/common/mctImages/woshishangjia_dingdan_jiaoyichenggong_img.png' },
        { name: '失败', value: '2', iconUrl: '/common/mctImages/woshishangjia_dingdan_yuxiadan_img.png' },
      ],
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
      screenHeight:0,
      storeId:'',
      // 筛选时间
      startDate: '',
      endDate: '',
      startDateShow: false,
      endDateShow: false,
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    }),
    
      startDateFormat(){
        if(this.startDate){
          return this.formatDate(this.startDate)
        }
      },
      endDateFormat(){
        if(this.endDate){
          return this.formatDate(this.endDate)
        }
      },
  },

  onLoad () {
    this.order = useMctStore().order;
    this.storeId = useMctStore().mctInfo.storeId

    this.startDate = new Date().getTime();
    this.endDate = new Date().getTime();
    
    if(!this.bridgeSdk.isTokenValid()){
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
 },
  methods: {
    async __loadData__() {
      this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo;
      console.log("userInfo: ", this.userInfo);
      if(!this.userInfo){
        return;
      }
      const { userType, mctId, userId, detailInfoUserId, dateType } = this.order;
      if (this.bridgeSdk.checkIsEmpty(mctId)) {
        console.log('mctId', userType, mctId, detailInfoUserId, dateType)
        this.userType = userType
        this.mctId = mctId
        this.detailInfoUserId = detailInfoUserId
        this.userId = userId
        this.dateType = dateType
      }
      this.orderListInit()
      // this.getDic()
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
      this.screenHeight = this.px2rpx(res.screenHeight - statusBarHeight - navBarHeight)
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
          this.list.push({
            name: item.optName,
            value: item.optCode
          })
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
      console.log('onScrollToLower', e)
      if (this.orderList.length < this.total) {
        this.loadStatus = 'loading'
        this.isLoadMore = true
        this.page = this.page + 1
        this.getOrderList()
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
      this.orderType = e.value
      this.orderListInit(e.value)
    },
    async orderListInit (type) {
      if(this.startDate > this.endDate){
        uni.showToast({
          title: '查询开始日期不能大于结束日期',
          icon: 'none'
        });
        return;
      }
      this.page = 1
      this.orderList = []
      if (this.bridgeSdk.checkIsEmpty(this.mctId)) {
        let params = {
          page: 1,
          rows: 10,
          // orderStatus: type,
          // storeId: this.storeId,
          orderId: this.orderSearch,
          // roleType: this.userType, //000 商户，001 店长 002 店员
          // mctId: this.userType == '000' ? this.mctId : '', //商户号
          // shopsId: this.userType == '001' ? this.detailInfoUserId : '',//门店号
          // cashierId: this.userType == '002' ? this.userId : '', //店员号
          // dateType: this.dateType,// 日期类型  1 当天 2自定义时间
          mctId: this.mctId,
          status: type,
          startTime: this.startDateFormat.replace(/-/g, '') + '000000',
          endTime: this.endDateFormat.replace(/-/g, '') + '235959',
        }
        getOrderListNew(params).then(async res => {
          this.isLoadMore = false
          this.orderList = res.list
          this.total = res.total
        })
      } else {
        let params = {
          page: 1,
          rows: 10,
          userId: this.userInfo.userId,//用户编号
          orderStatus: this.orderType,
          storeId: this.storeId,
          orderId: this.orderSearch,
          dateType: 2,// 日期类型  1 当天 2自定义时间
          startTime: this.startDateFormat.replace(/-/g, '') + '000000',
          endTime: this.endDateFormat.replace(/-/g, '') + '235959',
        }
        getOrderListByUserId(params).then(async res => {
          this.isLoadMore = false
          this.orderList = res.list
          this.total = res.total
        })
      }

    },
    async getOrderList () {
      if(this.startDate > this.endDate){
        uni.showToast({
          title: '查询开始日期不能大于结束日期',
          icon: 'none'
        });
        return;
      }
      if (this.bridgeSdk.checkIsEmpty(this.mctId)) {
        let parame = {
          page: this.page,
          rows: 10,
          orderId: this.orderSearch,
          // storeId: this.storeId,
          // orderStatus: this.orderType,
          // roleType: this.userType, //000 商户，001 店长 002 店员
          // mctId: this.userType == '000' ? this.mctId : '', //商户号
          // shopsId: this.userType == '001' ? this.detailInfoUserId : '',//门店号
          // cashierId: this.userType == '002' ? this.userId : '', //店员号
          // dateType: this.dateType,// 日期类型  1 当天 2自定义时间
          mctId: this.mctId,
          status: this.orderType,
          startTime: this.startDateFormat.replace(/-/g, '') + '000000',
          endTime: this.endDateFormat.replace(/-/g, '') + '235959',
        }
        console.log(parame, 'getOrderListNew parameparameparame')
        getOrderListNew(parame).then(async res => {
          this.total = res.total
          this.isLoadMore = false
          if (this.orderList.length < this.total) {
            this.orderList.push(...res.list)
          }
        })
      } else {
        let params = {
          page: this.page,
          rows: 10,
          userId: this.bridgeSdk.getUserInfo().userInfo.userId,//用户编号
          orderStatus: this.orderType,
          storeId: this.storeId,
          orderId: this.orderSearch,
          dateType: 2,// 日期类型  1 当天 2自定义时间
          startTime: this.startDateFormat.replace(/-/g, '') + '000000',
          endTime: this.endDateFormat.replace(/-/g, '') + '235959',
        }
        console.log(params, 'getOrderListByUserId paramsparamsparams')
        getOrderListByUserId(params).then(async res => {
          this.isLoadMore = false
          this.orderList.push(...res.list)
        })
      }

    },
    itemClick (item) {
      console.log('itemClick', item);
      useMctStore().setProductItem({ ...item })
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/orderDetail/mctOrderDetail?productItem=${JSON.stringify(item)}&isMctId=${this.bridgeSdk.checkIsEmpty(this.mctId)}`
      });
    },
    dateConfirm(type){
      console.log(type, 'typetypetype');
      if(type == 'endDate'){
        this.endDateShow = false;
      }else{
        this.startDateShow = false;
      }
      this.orderListInit();
    },
    dateCancel(type){
      console.log(type, 'dateCanceldateCancel');
      if(type == 'endDate'){
        this.endDateShow = false;
      }else{
        this.startDateShow = false;
      }
    },
    formatDate(data){
      console.log(data);
      let date = new Date(data);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1)>9?(date.getMonth() + 1):'0'+(date.getMonth() + 1);
      let day = date.getDate()>9?date.getDate():'0'+date.getDate();
      return year + '-' + month + '-' + day;
    },
  }
}
</script>

<style scoped >
.tabs_list{
  width: 100%;
  display: flex;
  /* justify-content: flex-start; */
  justify-content: space-around;
  align-items: center;
  margin-top: 20rpx;
}

.tabs_item,
.tabs_item_active{
  width: 128rpx;
  height: 132rpx;
  background: #FEFEFE;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.tabs_item_active::after{
  content: "";
  position: absolute;
  bottom: -16rpx;
  left: 50%;
  transform: translateX(-50%);
  border-top: 16rpx solid #FEFEFE;
  border-right: 16rpx solid transparent;
  border-left: 16rpx solid transparent;
}
.tabs_item_img{
  width: 90rpx;
  height: 90rpx;
}
.tabs_item_text{
  font-weight: 800;
  font-size: 20rpx;
  color: #000000;
  line-height: 28rpx;
}

.timeSearch{
  width: 100%;
  height: 80rpx;
  box-sizing: border-box;
  padding: 0 30rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24rpx;
  color: #666666;
  background: #ffffff;
}
.timeSearch_text{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180rpx;
  color: #5ba4f3;
  font-size: 24rpx;
}
</style>