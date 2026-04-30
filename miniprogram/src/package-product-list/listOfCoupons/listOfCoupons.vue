<!--
 * @Description: 核销记录
 * @Author: 陈保磊
 * @Date:  2025-01-15 16:00:00
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="main">
    <!-- 时间筛选 -->
    <view class="timeSearch" v-if="type != 'sameDay'">
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
      <view class="timeSearch_btn1" @click="search">搜索</view>
      <view class="timeSearch_btn2" @click="reset">重置</view>
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
    <!-- 列表 -->
    <scroll-view scroll-y class="card-list" :style="{'height': (height - (type == 'sameDay'? 0 : 100)) + 'rpx'}" @scrolltolower="scrolltolower">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="card-item"
        @click="jumpToDetail(item)"
      > 
   <!-- 礼品券 -->
      <view v-if="item.couponBaseType == '01'" class="lp-card-left" :class="[item.getStatus == '0' ? '' : 'F5']">
              <view class="lp-text">礼品券</view>
      </view>
   <!-- 非礼品券 -->
        <view
          v-else
          class="card-item-left"
          :class="[item.getStatus == '0' ? '' : 'F5']"
        >
          <view class="" v-if="item.couponBaseType != '02'">
            <view
              class="card-item-left-top"
              :class="[item.getStatus == '0' ? '' : 'c52']"
            >
              <text>￥{{ item.realDisAmt ? item.realDisAmt : item.disAmt }}</text>
            </view>
          </view>
          <view class="" v-else>
            <view
              class="card-item-left-top"
              :class="[item.getStatus == '0' ? '' : 'c52']"
            >
              <text>
                {{ item.disAmt}}{{ item.couponBaseType == "02" ? "折" : "" }}
              </text>
            </view>
          </view>
        </view>
        <view :class="item.couponBaseType == '01' ? 'lp-card-right' : 'card-item-right'" class="flex">
          <view
            class="flex flex_col"
            style="align-items: flex-start; margin-left: 40rpx"
          >
            <view
              style="
                font-weight: 800;
                font-size: 30rpx;
                color: #000000;
                line-height: 50rpx;
              ">
              {{ item.couponBaseName }}
            </view>
            <view class="flex flex_ac lineH40">
              <u-icon
                name="checkmark-circle"
                color="#525252"
                size="10"
              ></u-icon>
              <text>核销时间: {{ item.verificationTime }} </text>
            </view>
            <view class="flex flex_ac lineH40">
              <u-icon
                name="checkmark-circle"
                color="#525252"
                size="10"
              ></u-icon>
              <text>核销门店: {{ item.storeName || '总店' }} </text>
            </view>
            <view class="flex flex_ac lineH40">
              <u-icon
                name="checkmark-circle"
                color="#525252"
                size="10"
              ></u-icon>
              <text class=""> 核销店员: {{ item.cashierName ||'管理员' }} </text>
            </view>
            <view class="flex flex_ac lineH40">
              <u-icon
                name="checkmark-circle"
                color="#525252"
                size="10"
              ></u-icon>
              <text class=""> 核销用户: {{ item.userMobile }} </text>
            </view>
          </view>
        </view>
      </view>
      <vc-empty v-if="list.length === 0"></vc-empty>
    </scroll-view>
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import coupinsVue from '../components/coupons.vue'
import { getCouponBaseList, getCouponGetInfoByMctId ,getCouponVerInfoList,getMctCouponVerInfoListDate} from '../api/index'
import store, { useBaseStore, useUserStore, useMctStore } from "@/store/index"
import { ellipsisPhone } from "@/utils/business";
export default {
  components: { coupinsVue },
  data () {
    return {
      propsData: {
        props: {
          title: {
            value: '核销记录'
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
          disableScroll: {
            value: true
          }
        }
      },
      height: 0,
      page: 1,
      rows: 10,
      total: 0,
      list: [],
      mctId: '',
      couponInfo:{},
      type:"",
      mctInfo:{},
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
  async onLoad (options) {
    this.couponInfo = useMctStore().couponInfo
    this.mctInfo = useMctStore().mctInfo
    this.type = options.type
    if(options.startDate && options.endDate){
      // this.lockTime = true
      this.startDate = options.startDate
      this.endDate = options.endDate
      this.pickerStartDate = options.startDate
      this.pickerEndDate = options.endDate
    }else{
      this.pickerStartDate = new Date().getTime()
      this.pickerEndDate = new Date().getTime()
    }
    this.getList()
    let { height, navBarHeight, statusBarHeight } = await this.bridgeSdk.getDeviceInfo()
    console.log(height, navBarHeight, statusBarHeight)
    this.height = this.px2rpx(height - navBarHeight - statusBarHeight - 30)
  },
  unmounted(){
    useMctStore().setCouponInfo({})
  },
  methods: {
    //px换算rpx
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale
    },
    jumpToDetail (item) {
      useMctStore().setCouponDetailInfo({...item})
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/listOfCoupons/couponDetails`
      })
    },
    getDay(){
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
      let day = String(currentDate.getDate()).padStart(2, '0'); 
      let formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    async getList () {
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
      let obj = {
        page: this.page,
        rows: this.rows,
        couponBaseId:this.type == 'sameDay' ? '' : this.couponInfo.couponBaseId,
        mctId: this.couponInfo.mctId,
        storeId: this.mctInfo.storeId,
        verDate: this.type == 'sameDay' ? this.getDay() : '',
        cashierId: useMctStore().mctInfo.cashierId,
        verificationStartTime: this.startDateFormat + (this.startDateFormat ? ' 00:00:00':''),
        verificationEndTime: this.endDateFormat + (this.endDateFormat ? ' 23:59:59' : ''),
      }
      let nowObj = {   //当日核销单查询条件(需单独处理)
        page: this.page,
        rows: this.rows,
        couponBaseId:this.type == 'sameDay' ? '' : this.couponInfo.couponBaseId,
        mctId: this.couponInfo.mctId,
        storeId: this.mctInfo.storeId,
        cashierId: useMctStore().mctInfo.cashierId
      }
      if(this.page == 1){
        this.list = []
      }
      if(useMctStore().mctInfo.cashierType == '001'){  //店长不传cashierId
            delete obj.cashierId
            delete nowObj.cashierId
      }
      if(useMctStore().mctInfo.cashierType == '000'){ //管理员只传mctId
            // delete nowObj.storeId
            delete nowObj.cashierId
      }
      let res;   //接口数据变量
      if(this.type == 'sameDay'){  //当日核销单查询
        res = await getMctCouponVerInfoListDate({...nowObj})
      }else{
         res = await getCouponVerInfoList({ ...obj})
      }

      this.total = res.total
      res.list.forEach(item => {
        if(item.userMobile !== ''){
          item.userMobile = ellipsisPhone(item.userMobile)
        }
      })
      if(this.list.length === 0){
        this.list = res.list
        }else if(this.list.length < res.total){
          this.list = [...this.list,...res.list]
        }else if (this.list.length === res.total){
         this.page-=1
        }
    },
    scrolltolower () {
      console.log("scrolltolower")
      if(this.list.length < this.total){
        this.page += 1
        this.getList()
      }
    },
    search(){
      this.page = 1
      this.list = []
      this.getList()
    },
    reset(){
      this.startDate = ''
      this.endDate = ''
      this.pickerStartDate = new Date().getTime()
      this.pickerEndDate = new Date().getTime()
      this.page = 1
      this.list = []
      this.getList()
    },
    showDatePicker(type){
      // if(this.lockTime){
      //   return
      // }
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
      // this.getList();
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
      if(/^\d+$/.test(data)){
        data = Number(data);
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

<style scoped lang="scss">
.coupon-list {
  padding: 20rpx;
}
</style>
<style lang="scss" scoped>
.main {
  background: #f0f0f4;
  min-height: 100vh;

  .menus {
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    font-size: 32rpx;
    color: #999999;
    line-height: 100rpx;

    .active {
      font-weight: bold;
      color: #333333;
    }

    .menu-item {
      position: relative;

      .line {
        display: block;
        width: 32rpx;
        height: 6rpx;
        background: linear-gradient(to right, #00bcb9, #11ffbd);
        position: absolute;
        bottom: 16rpx;
        left: 50%;
        z-index: 1;
        transform: translateX(-50%);
        border-radius: 10rpx;
      }
    }
  }

  .F5 {
    background-color: #FF856E !important;
  }

  .c52 {
    color: #525252 !important;
  }

  .b52 {
    border: 1rpx solid #525252 !important;
  }

  .card-list {
    padding: 30rpx;

    .card-item {
      width: 100%;
      display: flex;
      margin-bottom: 30rpx;
      .lp-card-left {
          padding: 10rpx 0;
          border-radius: 20rpx 0 0 20rpx;
          display: flex;
          width: 15%;
          background-color: #FFF3F3;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          .lp-text {
              
              font-size: 34rpx;
              font-weight: 600;
              color: #ffffff;
              writing-mode: vertical-rl; /* 文字从上到下竖向排列 */
              text-orientation: upright; /* 文字保持直立 */
              letter-spacing: 20rpx;
          }
            }
      .card-item-left {
        padding: 10rpx 0;
        border-radius: 20rpx 0 0 20rpx;
        display: flex;
        width: 25%;
        background-color: #fff3f3;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .card-item-left-top {
          font-size: 27rpx;
          color: #ff1e00;

          text {
            font-size: 50rpx;
            font-weight: bold;
            color: #fff;
          }
        }

        .card-item-left-bottom {
          text {
            color: #ff1e00;
            border-radius: 6rpx 6rpx 6rpx 6rpx;
            border: 1rpx solid #ff1e00;
            font-weight: bold;
            font-size: 27rpx;
            padding: 4rpx 12rpx;
          }
        }
      }

      .card-item-right {
        padding: 20rpx 0;
        border-radius: 0 20rpx 20rpx 0;
        width: 75%;
        background-color: #fff;
        font-size: 20rpx;
      }

      .lp-card-right{
        padding: 20rpx 0;
        border-radius: 0 20rpx 20rpx 0;
        width: 85%;
        background-color: #fff;
        font-size: 20rpx;
            }
    }
  }

  .lineH40 {
    line-height: 40rpx;

    text {
      margin-left: 10rpx;
    }
  }

  .icon-image {
    height: 80rpx;
    width: 80rpx;
    position: absolute;
    right: 0;
    top: -20rpx;
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
}
</style>
