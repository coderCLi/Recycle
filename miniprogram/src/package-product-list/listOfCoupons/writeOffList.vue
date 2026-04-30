<!--
 * @Description: 核销列表
 * @Author: 陈保磊
 * @Date:  2025-01-22
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="main">
<view class="timeSearch">
      查询日期：
      <text class="timeSearch_text" @click="showDatePicker('startDate')">
        {{ startDateFormat || '开始日期' }} 
        <up-icon name="arrow-bottom" size="24rpx"></up-icon>
      </text>
      至
      <text class="timeSearch_text" @click="showDatePicker('endDate')">
        {{ endDateFormat || '结束日期' }}
         <up-icon name="arrow-bottom" size="24rpx"></up-icon>
      </text>
      <view class="timeSearch_btn2" @click="reset">重置日期</view>
    </view>
    <up-datetime-picker
        :show="startDateShow"
        v-model="pickerStartDate"
        mode="date"
        @confirm="dateConfirm('startDate')"
        @cancel="dateCancel('startDate')"
    ></up-datetime-picker>
    <up-datetime-picker
        :show="endDateShow"
        v-model="pickerEndDate"
        mode="date"
        @confirm="dateConfirm('endDate')"
        @cancel="dateCancel('endDate')"
    ></up-datetime-picker>
    <view class="" style="text-align: center; padding-left: 20rpx">
      <u-input
        ref="input"
        class="input"
        height="80rpx"
        v-model="value"
        clearable
        placeholder="请输入优惠券名称"
        prefix-icon="search"
      >
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
            @click="getCouponVerList('search')"
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
    <vc-empty v-if="total == 0" :style="{ height:'70vh' }"></vc-empty>
    <scroll-view
      v-else
      scroll-y
      @scrolltolower="onScrollToLower"
      :style="{ height: (height - 100) + 'rpx' }"
    >
      <view class="container" v-for="(item, index) in couponList" :key="index" @click="jumpToList(item)">
        <view class="list-container">
          <view class="list-left">
            <image
              v-if="!item.photoUrl"
              style="width: 100%; height: 100%; border-radius: 10rpx"
              src="../static/uploadImg.png"
            />
            <image
              v-else
              style="width: 100%; height: 100%; border-radius: 10rpx"
              :src="this.minioBaseUrl + item.photoUrl"
            ></image>
          </view>
          <view class="list-right">
            <view class="list-item-title">
              <view class="list-title"> {{item.couponBaseName}} </view>
              <view class="list-icon"> {{item.couponBaseTypeName}} </view>
            </view>
            <view class="">
              <view class="list-vouchers">
                  <view class="" style="display: flex; justify-content: space-between; align-items: center">
                    <view class="list-type" v-if="item.fromSourceName">来源：{{item.fromSourceName}}</view>
                  </view>
              </view>
              <view class="list-numberbox">已核销数量:<text class="number-text">{{item.useNum}}</text>张</view>
            </view>
          </view>
        </view>
        <up-divider style="margin: 30rpx 0 0;color:#666"/>
      </view>
    </scroll-view>
  </vc-container>
</template>

<script>
import { mapState } from 'pinia'
import store, { useBaseStore, useUserStore, useMctStore } from "@/store/index"
import { getCouponVerList } from '../api/index'
export default {
  data () {
    return {
      height: 0,
      page: 1,
      size: 10,
      total: 0,
      value: '',
      couponList: [],
       // 筛选时间
      startDate: '',
      endDate: '',
      pickerStartDate: '',
      pickerEndDate: '',
      startDateShow: false,
      endDateShow: false,
      lockTime: false,
    }
  },
  computed: {
    startDateFormat(){
      if(this.startDate){
        return this.formatDate(this.startDate)
      }else{
        return ''
      }
    },
    endDateFormat(){
      if(this.endDate){
        return this.formatDate(this.endDate)
      }else{
        return ''
      }
    },
  },
  onLoad () {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = (nowDate.getMonth() + 1)>9?(nowDate.getMonth() + 1):'0'+(nowDate.getMonth() + 1);
    this.startDate = new Date(year, month - 1, 1).getTime();
    this.endDate = nowDate.getTime();
    this.pickerStartDate = this.startDate;
    this.pickerEndDate = this.endDate;

    this.getCouponVerList()
  },
  async mounted () {
    const { statusBarHeight, navBarHeight, height } = await this.bridgeSdk.getDeviceInfo()
    this.height = this.px2rpx(height - statusBarHeight - navBarHeight - this.$refs.input.$el.offsetHeight)
  },
  methods: {
    //px换算rpx
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale - 40
    },
   async getCouponVerList(type){
     if(this.startDate && !this.endDate){
        uni.showToast({
          title: '请选择结束日期',
          icon: 'none'
        })
        return
      }
      if(!this.startDate && this.endDate){
        uni.showToast({
          title: '请选择开始日期',
          icon: 'none'
        })
        return
      }
      if(this.startDate > this.endDate){
        uni.showToast({
          title: '开始日期不能大于结束日期',
          icon: 'none'
        })
        return
      }
      if(this.startDate && this.endDate){
        this.lockTime = true
      }else{
        this.lockTime = false
      }
    let params = {
      page: this.page,
      rows: this.size,
      couponBaseName: this.value,
      mctId: useMctStore().mctInfo.mctId,
      cashierId: useMctStore().mctInfo.cashierId,
      storeId: useMctStore().mctInfo.storeId,
      verificationStartTime: this.startDateFormat + (this.startDateFormat ? ' 00:00:00':''),
      verificationEndTime: this.endDateFormat + (this.endDateFormat ? ' 23:59:59' : ''),
    }
    console.warn(params)
    if(this.page == 1){
      this.couponList = []
    }
    if(useMctStore().mctInfo.cashierType == '000'){ //管理员只传mctId
      // delete params.storeId
      delete params.cashierId
    }
    if(useMctStore().mctInfo.cashierType == '001'){ //店长不传cashierId
      delete params.cashierId
    }
    let res = await getCouponVerList({...params})
    this.total = res.total
    if(this.couponList.length === 0 || type == 'search'){
      this.couponList = res.list
    }else if(this.couponList.length < res.total){
      this.couponList = [...this.couponList,...res.list]
    }else if (this.couponList.length === res.total){
      this.page-=1
    }
    },
    onScrollToLower () {
      if(this.couponList.length < this.total){
        this.page+=1
        this.getCouponVerList()
      }
    },
    jumpToList (item) {
      useMctStore().setCouponInfo({...item,mctId: useMctStore().mctInfo.mctId,})
      console.log(this.startDate, this.endDate, this.lockTime)
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/listOfCoupons/listOfCoupons` + (this.lockTime ? `?startDate=${this.startDate}&endDate=${this.endDate}` : '')
      })
    },
    reset(){
      this.startDate = ''
      this.endDate = ''
      this.pickerStartDate = new Date().getTime();
      this.pickerEndDate = new Date().getTime();
      this.value = ''
      this.page = 1
      this.couponList = []
      this.getCouponVerList()
    },
    showDatePicker(type){
      if(type == 'endDate'){
        this.endDateShow = true;
      }else{
        this.startDateShow = true;
      }
    },
    dateConfirm(type){
      console.log(type, 'typetypetype');
      if(type == 'endDate'){
        this.endDate = this.pickerEndDate;
        this.endDateShow = false;
      }else{
        this.startDate = this.pickerStartDate;
        this.startDateShow = false;
      }
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
      if(!data){
        return ''
      }
      let date = new Date(data);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1)>9?(date.getMonth() + 1):'0'+(date.getMonth() + 1);
      let day = date.getDate()>9?date.getDate():'0'+date.getDate();
      return year + '-' + month + '-' + day;
    },
  }

}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background: #fff;
  .list-container {
    display: flex;

    .list-left {
      width: 160rpx;
      height: 160rpx;
    }
    .list-right {
      flex: 1;
      padding-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .list-item-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
 .list-title {
        width: 382rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; /* 设置行数 */
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .list-icon{
        font-size: 24rpx;
        color: #fff;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%);
        padding:5rpx 10rpx;
        border-radius: 10rpx;
      }
      }
     
      .list-vouchers {
        font-size: 20rpx;
        color: #999;
        margin: 10rpx 0;
      }
      .list-numberbox{
        width: 100%;
        font-size: 24rpx;
        color: #999;
        .number-text{
          display: inline-block;
          font-size: 26rpx;
          color: #01BFB9;
        }
      }
      .list-number {
        font-size: 20rpx;
        color: #999;
      }
      .list-type {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  .list-foootTime {
    font-size: 26rpx;
    text-align: center;
    padding-top: 20rpx;
    margin-top: 20rpx;
    border-top: 1px solid #ccc;
  }
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
.timeSearch_btn1{
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  background: #5ba4f3;
  color: #ffffff;
  font-size: 24rpx;
  margin: 0 8rpx;
}
.timeSearch_btn2{
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  background: #eaeaea;
  color: #333333;
  font-size: 24rpx;
  margin: 0 8rpx;
}
</style>