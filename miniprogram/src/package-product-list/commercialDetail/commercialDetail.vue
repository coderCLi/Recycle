<!--
 * @Description: 商户详情页
 * @Author: 陈保磊
 * @Date: 2025-01-15 10:00:00

-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container :props-data="propsData">
    <vc-login v-if="!isLogined" />
    <view v-else class="content">
      <image class="page_bg_img" :src="minioBaseUrl + '/common/tabbarImages/mine_bg_img.png'" mode="scaleToFill" />
      <view class="commerical_detail_top">

        <view class="avatar_box demo-layout bg-purple left_image">
          <up-avatar v-if="!detailInfo.shopUrlShowUrl" style="width: 100%; height: 100%" size="58" class="left_image"
            src="../static/uploadImg.png">
          </up-avatar>
          <image v-else class="left_image" style="width: 100%; height: 100%"
            :src="this.minioBaseUrl + detailInfo.shopUrlShowUrl" mode="aspectFill" lazy-load="false">
          </image>
        </view>

        <view class="demo-layout bg-purple-light right_content">
          <view class="right_content_layout">
            <view class="mctName" @click="jumpToUser('商户')">
              {{ detailInfo.name }}
            </view>
            <view class="card">
              <view class="">
                <image style="width: 28rpx; height: 28rpx; margin-right: 10rpx" src="../static/tubiao.png"
                  mode="aspectFit" lazy-load="false" />
              </view>
              <view style="font-size: 16rpx" @click="jumpToShon"><text>商户信息></text></view>
            </view>
          </view>
          <view class="right_content_layout right_text">
            <!-- <view class=""> 商户编号:{{ detailInfo.mctId }} </view> -->
            <view class="" @click="jumpToUser('门店')" v-if="cashierType == '000'">
              {{
                cashierType == "000" && storeId == null
                  ? "总店"
                  : storeInfo.storeName
              }}
            </view>
            <view v-else>
              {{
                cashierType == "000" && storeId == null
                  ? "总店"
                  : storeInfo.storeName
              }}
            </view>
            <view v-if="cashierType == '000'">
              <text class="right_text_small" @click="jumpToUser('角色')">
                当前登录:{{ userMenu[cashierType] }}
              </text>
            </view>
            <view v-else>
              <text class="right_text_small">
                当前登录:{{ userMenu[cashierType] }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view class="detail_content" v-if="isShowCollection == '1'">
        <view class="detail_content_top">
          <!-- <image class="detail_content_img" :src="minioBaseUrl + '/common/tabbarImages/mine_bg_img.png'"
            mode="scaleToFill" /> -->
          <view class="detail_content_top_title">商家数据</view>
          <text class="detail_content_refund" v-if="cashierType == '000'" @click="jumpRefndPage">退款管理 ></text>
        </view>
        <view class="detail_content_main">
          <view class="detail_content_item">
            <view class="detail_content_top_text" @click="jumpToshopList(1)">
              <text class="font_44">{{ orderCount }}</text>笔
            </view>
            <view class="detail_content_bottom_text"> 今日订单数 </view>
          </view>
          <view class="detail_content_line"></view>
          <view class="detail_content_item">
            <view class="detail_content_top_text" @click="jumpToshopList(1)">
              ¥<text class="font_44">{{ sumAmt }}</text>
            </view>
            <view class="detail_content_bottom_text"> 今日总营业额 </view>
          </view>
          <view class="detail_content_line"></view>
          <view class="detail_content_item">
            <view class="detail_content_top_text" @click="jumpToCouponList('sameDay')">
              <text class="font_44">{{ orderObj.writeOffNum }}</text>单
            </view>
            <view class="detail_content_bottom_text"> 今日核销单数 </view>
          </view>
        </view>
      </view>

      <view class="collection_content" v-if="isShowCollection == '1'">
        <view class="collection_content_item" @click="scanGetMoney">
          <image class="collection_content_item_img" :src="minioBaseUrl + '/common/mctImages/woshishangjia_icon_sweep_img.png'"
            mode="scaleToFill" />
          <view class="collection_content_item_text">扫码收款</view>
        </view>
        <!-- <view class="collection_content_line"></view> -->
        <view class="collection_content_item" @click="qrCodeGetMoney">
          <image class="collection_content_item_img" :src="minioBaseUrl + '/common/mctImages/woshishangjia_icon_shoukuan_img.png'"
            mode="scaleToFill" />
          <view class="collection_content_item_text">二维码收款</view>
        </view>
      </view>

      <view class="writeoff_content">
        <view class="writeoff_content_item" style="" @click="scanCode">
          <image class="writeoff_content_item_img" :src="minioBaseUrl + '/common/mctImages/icon_saomahexiao_img.png'" mode="aspectFit" lazy-load="false" />
          <view class="writeoff_content_item_text" style=""> 扫码核销 </view>
        </view>
        <view class="writeoff_content_item" style="" @click="jumpToCouponList">
          <image class="writeoff_content_item_img" :src="minioBaseUrl + '/common/mctImages/icon_hexiaojilu_img.png'" mode="aspectFit" lazy-load="false" />
          <view class="writeoff_content_item_text" style=""> 核销记录 </view>
        </view>
      </view>
      <!-- <view class="icon_content_item" style="" @click="jumpToshopList(2)">
            <image
              style="width: 60rpx; height: 60rpx"
              src="../static/dingdan.png"
              mode="aspectFit"
              lazy-load="false"
            />
            <view class="icon_content_item_text" style=""> 全部订单 </view>
          </view> -->
      <!-- <view class="icon_content">
        <up-row justify="space-between" gutter="10">
          <up-col span="6">
            <view class="icon_content_item" style="" @click="jumpToCouponList">
              <image
                style="width: 60rpx; height: 60rpx"
                src="../static/hexiao.png"
                mode="aspectFit"
                lazy-load="false"
              />
              <view class="icon_content_item_text" style=""> 核销记录 </view>
            </view>
          </up-col>
       
        </up-row>
      </view> -->
      <view class="detail_order_content" v-if="isShowCollection == '1'">
        <view class="detail_order_content_header icon_content">
          <view class="detail_left"> 当日订单 </view>
          <view class="detail_right" @click="jumpToshopList(1)"> 查看全部> </view>
        </view>
        <!-- <view class="icon_content" style="background: #fff; border-radius: 20rpx">
          <up-tabs :list="list" @click="tabsClick" lineColor="#00BCB8" :scrollable="true">
          </up-tabs>
        </view> -->
        <view class="tabs_list">
          <view v-for="(item,index) in list" :key="index" :class="this.orderType == item.value ? 'tabs_item_active' : 'tabs_item'" @click="tabsClick(item)">
            <image class="tabs_item_img"
              :src="minioBaseUrl+ item.iconUrl"
              mode="scaleToFill"
            />
            <view class="tabs_item_text">{{ item.name }}</view>
          </view>
        </view>
        <view v-if="orderList.length === 0" class="order_today" style="height: calc(100vh - 500rpx); ">
          <vc-empty :props-data="propsDataEmpty" text="暂无数据">
          </vc-empty>
        </view>
        <scroll-view v-else scroll-y class="order_today" style="height: calc(100vh - 500rpx); "
          @scrolltolower="onScrollToLower">
          <view class="icon_content detail_content2" style="height: auto; padding: 0" v-for="(item,index) in orderList"
            :key="index" @click="jumpToDetail(item)">
            <card-vue :item="item" />
          </view>
        </scroll-view>
      </view>
      <view v-if="isShowCollection == '2' || isShowCollection == '0'" class="open_down_line_payment" @click="openDownLinePayment">
        申请开通线下收款场景
      </view>
      <view v-if="isShowCollection == '3'" class="open_down_line_payment" >
        申请开通线下收款场景正在审核
      </view>
    </view>
    <vc-modal ref="modal"></vc-modal>
    <vc-modal ref="modal1">
      <template #content>
        <view class="card-list" style="height: auto; font-size: 16rpx; color: #999; padding: 10rpx 0">
          <up-cell-group :border="false">
            <up-cell style="font-size: 16rpx" size="large" title="券码编号" :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
              'text-align': 'left',
            }">
              <template #value>
                <text class="u-slot-value">{{ couponList.couponBaseId }}</text>
              </template>
            </up-cell>
            <up-cell size="large" title="券码名称" :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }">
              <template #value>
                <text class="u-slot-value">{{
                  couponList.couponBaseName
                }}</text>
              </template>
            </up-cell>
            <up-cell size="large" title="券码类型" :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }">
              <template #value>
                <text class="u-slot-value">{{
                  couponList.couponBaseTypeName
                }}</text>
              </template>
            </up-cell>
            <up-cell size="large" v-if="couponList.disAllAmt" :title="quanName(couponList.couponBaseType)" :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }">
              <template #value>
                <text class="u-slot-value">{{ couponList.disAllAmt }}</text>
              </template>
            </up-cell>
            <up-cell v-if="couponList.disAmt" :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" size="large" :title="couponList.couponBaseTypeName == '折扣券' ? '折扣率' : '优惠金额'">
              <template #value>
                <text class="u-slot-value">{{ couponList.disAmt }}</text>
                <text class="u-slot-value" v-if="couponList.couponBaseTypeName == '折扣券'">折</text>
              </template>
            </up-cell>
            <up-cell :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" v-if="couponList.disAmtAfter" size="large" title="优惠后金额">
              <template #value>
                <text class="u-slot-value">{{ couponList.disAmtAfter }}</text>
              </template>
            </up-cell>
            <up-cell :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" v-if="couponList.disMaxAmt" size="large" title="最高优惠金额" :value="couponList.disMaxAmt">
              <template #value>
                <text class="u-slot-value">{{ couponList.disMaxAmt }}</text>
              </template>
            </up-cell>
            <up-cell :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" size="large" title="核销日期">
              <template #value>
                <text class="u-slot-value">{{
                  couponList.useStartTime + "至" + couponList.useEndTime
                }}</text>
              </template>
            </up-cell>
            <!-- <up-cell
              :titleStyle="{
                color: '#333',
                'font-size': '24rpx',
                'white-space': 'nowrap',
              }"
              size="large"
              title="是否可叠加使用"
            >
              <template #value>
                <text class="u-slot-value">{{
                  couponList.isSuperpositionName
                }}</text>
              </template>
            </up-cell>
         
            <up-cell
            v-if="couponList.isSuperposition == '1'"
              :titleStyle="{
                color: '#333',
                'font-size': '24rpx',
                'white-space': 'nowrap',
              }"
              size="large"
              title="叠加张数"
            >
              <template #value>
                <text class="u-slot-value">{{
                  couponList.superpositionMaxNum
                }}</text>
              </template>
            </up-cell> -->
            <up-cell :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" v-if="couponList.fromSourceName" size="large" title="优惠券来源">
              <template #value>
                <text class="u-slot-value">
                  {{ couponList.fromSourceName }}
                </text>
              </template>
            </up-cell>
            <up-cell v-if="couponList.isRefundName" :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" size="large" title="是否可退款">
              <template #value>
                <text class="u-slot-value">{{ couponList.isRefundName }}</text>
              </template>
            </up-cell>
            <up-cell :titleStyle="{
              color: '#333',
              'font-size': '24rpx',
              'white-space': 'nowrap',
            }" v-if="couponList.isRefund == '1'" size="large" title="退款方式">
              <template #value>
                <text class="u-slot-value">{{
                  couponList.refundTypeName
                }}</text>
              </template>
            </up-cell>
          </up-cell-group>
        </view>
      </template>
    </vc-modal>
  </vc-container>
</template>

<script>
import cardVue from '../components/card2.vue'
import { getMctInfo, getSumOrderlnfo, getUserInfoList, getOrderList, getSubOrderList, getDataDicList, mctapiuserCoupon, getCouponInfoByUserId, getVerifyUserInfo, getStoreInfo, offlineCollectionApply,getOrderListNew,getMctData } from '../api/index'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore, useMctStore } from "@/store/index"
import coupons from '../components/coupons.vue'
export default {
  components: { cardVue, coupons },
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: '我的商户'
          },
          // fixed: {
          //   value: true,
          // },
          // bgColor: {
          //   value: "#bcffe3",
          // },
          // barBgColor: {
          //   value: "#bcffe3",
          // },

        }
      },
      propsDataEmpty: {
        props: {
          marginTop: { value: '30' },
        }
      },
      mctId: '',
      userInfo: {},
      userId: '',
      userType: '000',
      userMenu: {
        '000': '管理员',
        '001': '店长',
        '002': '店员',
      },
      list: [
        { name: '全部', value: '', iconUrl: '/common/mctImages/woshishangjia_dingdan_quanbu_img.png' },
        { name: '处理中', value: '3', iconUrl: '/common/mctImages/woshishangjia_dingdan_chulizhong_img.png' },
        { name: '交易成功', value: '1', iconUrl: '/common/mctImages/woshishangjia_dingdan_jiaoyichenggong_img.png' },
        { name: '失败', value: '2', iconUrl: '/common/mctImages/woshishangjia_dingdan_yuxiadan_img.png' },
      ],
      couponList: {},
      detailInfo: {},
      userList: [],
      orderObj: {
        writeOffNum: "--"
      },
      orderList: [],
      page: 1,
      total: 0,
      orderType: '',
      cashierType: "",
      storeId: '',
      storeInfo: {},

      isShowCollection: '', // 收款标识
      orderCount: "--", // 订单数量
      sumAmt: "--", // 订单总金额

      showRefund: false, // 展示退款功能入口  仅管理员展示
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(to, from) {
        // 判断当前页面和返回页面是不是都是详情页面,清理pinia
        if (to.fullPath === from.fullPath) {
          const pages = getCurrentPages()
          console.log(pages, 'pagessss');
          let index = pages.findIndex(page => page.route === 'package-product-list/commercialDetail/commercialDetail')
          if (index === -1) return
          useMctStore().setDataCleaning()
          uni.navigateBack({
            delta: pages.length - index,
          })
        }
      }
    }
  },
  onBackPress() {
    console.log('back', getCurrentPages())
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad({ userType }) {
    console.log("mctInfo" , useMctStore().mctInfo)
    this.mctId = useMctStore().mctInfo.mctId
    this.cashierType = useMctStore().mctInfo.cashierType
    this.storeId = useMctStore().mctInfo.storeId
    // console.log(this.mctId, useMctStore().mctInfo, 'mctIdmctIdmctIdmctId')

    // console.log(this.bridgeSdk.checkIsEmpty(userType))

    // this.userType = this.bridgeSdk.checkIsEmpty(userType) ? userType : '000'
    this.userId = useMctStore().mctUserId

  },

  async mounted() {
    // 获取当日日期
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = (nowDate.getMonth() + 1)>9?(nowDate.getMonth() + 1):'0'+(nowDate.getMonth() + 1)
    let day = nowDate.getDate()>9?nowDate.getDate():'0'+nowDate.getDate()
    this.todayValue = year + '' + month + '' + day

    let address_block = this.bridgeSdk.getUserInfo()
    this.userInfo = address_block?.userInfo
    console.log(this.userInfo, address_block, '___________this.userInfo')
    await this.detaiObj()
    console.log(this.detailInfo, '商户详情')
    this.isShowCollection = this.detailInfo.payFlag?this.detailInfo.payFlag:'0'
    if(this.isShowCollection == '1'){
      this.dailyOrderSummary()
      this.getOrderList()
      this.getMctData()
      this.orderListInit(this.list[0].value)
    }
    // this.getDic()
    if (this.storeId) {
      this.getStoreInfo()
    }
  },
  onShow() {
    if(this.isShowCollection == '1'){
      this.getMctData()
      this.orderListInit()
    }
  },
  unmounted() {
    const pages = getCurrentPages()
    console.log(pages, '商户详情页销毁_______________________________________________')
    let index = pages.findIndex(page => page.route === 'package-product-list/commercialDetail/commercialDetail')
    if (index === -1) return
    useMctStore().setDataCleaning()
    uni.navigateBack({
      delta: pages.length - index,
    })
  },
  methods: {
    async getStoreInfo() {
      this.storeId = useMctStore().mctInfo.storeId
      this.cashierType = useMctStore().mctInfo.cashierType
      this.mctId = useMctStore().mctInfo.mctId
      if (!this.storeId) return
      let res = await getStoreInfo({ storeId: this.storeId })
      console.log(res, '门店详情')
      this.storeInfo = res
    },
    userTypeChange(e) {
      console.log(e, 'eeee');
      this.userType = this.bridgeSdk.checkIsEmpty(e) ? e : '000'
      this.userId = useMctStore().mctUserId
    },
    // 字典
    getDic() {
      getDataDicList({ code: 'ORDER_STATUS' }).then((res) => {
        console.log(res, '字典')
        res.forEach(item => {
          console.log(item, 'itemitemitem')

          this.list.push({
            name: item.optName,
            value: item.optCode
          })
        })
        // this.list = res
        // // 全部
        // let listAll = ['待付款', '交易成功', '交易失败', '已取消', '售后']
        // let all = []
        // // 待付款
        // let listDue = ['待付款']
        // let due = []
        // // 待收货
        // let listWaitToBeReceived = ['待收货']
        // let waitToBeReceived = []
        // // 退款/售后
        // let listRefund = ['待商家审核', '待退货', '待退款', '退款成功']
        // let refund = []
        // res.forEach(item => {
        //   console.log(item, 'itemitemitem')
        //   if (listAll.includes(item.optName)) {
        //     all.push(item.optCode)
        //   }
        //   if (listDue.includes(item.optName)) {
        //     due.push(item.optCode)
        //   }
        //   if (listWaitToBeReceived.includes(item.optName)) {
        //     waitToBeReceived.push(item.optCode)
        //   }
        //   if (listRefund.includes(item.optName)) {
        //     refund.push(item.optCode)
        //   }
        // })
        // this.list = [
        //   {
        //     name: '全部',
        //     value: all.join(','),
        //   },
        //   {
        //     name: '待付款',
        //     value: due.join(','),
        //   },
        // 目前没有待收货和退款状态 暂时注释
        // {
        //   name: '待收货',
        //   value:  waitToBeReceived.join(','),
        // },
        // {
        //   name: '退款/售后',
        //   value:  refund.join(','),
        // },
        // ]
      })
    },
    quanName(type) {
      if (type == '00') return '满减前金额'
      if (type == '02' || type == '03') return '最低消费金额'
      return false
    },
    jumpToUser(name) {
      if (name == '角色') {
        console.log(this.detailInfo, useMctStore(), this.userType, this.userId, 'this.detailInfo')
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/handoff/handoffUser`
        })
      } else if (name == '商户') {
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/handoff/handoff`,
        })
      } else if (name == '门店') {
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/handoff/handoffStore`
        })
      }
    },
    jumpToShon() {
      useMctStore().setDetailInfo({ ...this.detailInfo })
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/shonInformation/shonInformation`
      })
    },

    jumpToshopList(num) {
      useMctStore().setOrder({
        mctId: this.mctId,
        userId: this.userId,
        detailInfoUserId: this.detailInfo.userId,
        userType: this.userType,
        dateType: num
      })

      this.bridgeSdk.jumpPage({
        url: `/package-product-list/shopList/mctOrderList`
      })
    },
    jumpToDetail(item) {
      useMctStore().setProductItem({ ...item })
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/orderDetail/mctOrderDetail`
      })
    },
    jumpToCouponList(type) {
      if (type == 'sameDay') {
        useMctStore().setCouponInfo({ mctId: this.mctId })
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/listOfCoupons/listOfCoupons?type=${type}`
        })
      } else {
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/listOfCoupons/writeOffList`
        })
      }

    },
    tabsClick(e) {
      console.log(e, 'eee')
      this.orderType = e.value
      this.orderListInit(e.value)
    },
    scanCode() {
      this.bridgeSdk.scanCode(async (res) => {
        console.log(res, '扫码结果')
        let info = await getVerifyUserInfo({
          cashierType: this.cashierType,
          phone: this.userInfo.mobile,
          mctId: this.mctId,
          storeId: this.storeId
        })
        console.log(info, '核销用户信息')
        let userGetId, userId
        // #ifdef H5
        userGetId = res.data.code.split(",")[1]
        userId = res.data.code.split(",")[2]
        // #endif
        // #ifdef MP-WEIXIN
        userGetId = res.result.split(",")[1]
        userId = res.result.split(",")[2]
        // #endif
        let isUserGetId = this.bridgeSdk.checkIsEmpty(userGetId)
        let isUserId = this.bridgeSdk.checkIsEmpty(userId)
        console.log(isUserGetId, isUserId, '扫码变量赋值');

        if (!isUserGetId && !isUserId) {
          return uni.showToast({
            title: '该券不支持核销',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(userGetId, userId, '核销id')
        console.log(info, '核销用户信息')
        console.log(userGetId, '核销id', info.cashierId, { couponBaseId: '', getStatus: 0, })
        let ress = await getCouponInfoByUserId(
          {
            storeId: this.storeId,
            // couponBaseId: couponBaseId,
            getStatus: 0,
            storeId: this.storeId,
            cashierId: info.cashierId,
            userGetId: userGetId,
            userId: userId,
            mctId: this.mctId
          })
        console.log(ress, '扫码成功')
        if (ress.total == 0) return uni.showToast({
          title: '该券不支持核销',
          icon: 'none',
          duration: 2000
        })
        this.couponList = ress.list[0]
        // console.log(res, '核销成功',this.couponList );
        this.$refs.modal1.open({
          type: 'alert',
          duration: 2000,
          title: '温馨提示',
          confirmText: '确认核销',
          cancelText: '取消',
          showCancel: true,
          confirmCallback: async () => {
            console.log("点击确认", this.userId)
            let res = await mctapiuserCoupon({
              mctId: this.mctId,
              storeId: info.storeId,
              storeName: info.storeName,
              mctDeptName: info.mctDeptName,
              couponBaseId: this.couponList.couponBaseId,
              userGetId: this.couponList.userGetId,
              userId: this.couponList.userId,
              cashierId: info.cashierId,
              cashierName: info.cashierName,
              // cashierId: this.userId
              // payOrderId: this.couponList.payOrderId,
            })
            if (res) {
              this.dailyOrderSummary()  //获取订单数量
              uni.showToast({
                title: '核销成功',
                icon: 'none',
                duration: 2000
              })
            }
            // this.bridgeSdk.showToast('核销成功')
          },
        })

      })
    },
    async detaiObj(row) {
      let res = await getMctInfo({
        storeId: this.storeId, userId: this.userInfo.userId,
        mctId: this.mctId
      })
      console.log(res, '商户详情')

      this.detailInfo = res
    },
    // 角色列表
    async getUserList() {
      let res = await getUserInfoList({ storeId: this.storeId, userId: this.bridgeSdk.getUserInfo().userInfo.userId, mctId: this.mctId })
      return res
    },
    // 订单汇总查询
    async dailyOrderSummary() {
      // if (!this.bridgeSdk.checkIsEmpty(this.userId)) {
      //   Promise.all([this.getUserList()]).then(async (res) => {
      //     console.log(res[0], '角色列表')
      //     let userId = res[0].find(item => item.type == '000')
      //     console.log(userId.userId, '管理员id')
      //     let Order = await getSumOrderlnfo({
      //       roleType: this.userType, //000 商户，001 店长 002 店员
      //       mctId: this.userType == '000' ? this.mctId :'', //商户号
      //       cashierId: userId.userId, //店员号
      //       shopsId: this.detailInfo.userId  //门店号
      //     })
      //     this.orderObj = Order.result
      //     console.log(Order, '订单汇总')
      //   })
      // } else {
      let params = {
        roleType: this.cashierType, //000 商户，001 店长 002 店员
        mctId: this.mctId, //商户号
        shopsId: this.storeId ? this.storeId : '',//门店号
        cashierId: useMctStore().mctInfo.cashierId ? useMctStore().mctInfo.cashierId : '', //店员号
      }
      if (this.cashierType == '001') { //店长  不传cashierId
        delete params.cashierId
      }
      if (this.cashierType == '000') { //管理员  不传shopsId
        // delete params.shopsId
      }
      let Order = await getSumOrderlnfo({
        ...params
      })
      this.orderObj = Order
      // }


    },
    async orderListInit(type) {
      this.page = 1
      getOrderListNew({
        page: 1,
        rows: 10,
        // storeId: this.storeId,
        // orderStatus: type,
        // roleType: this.userType, //000 商户，001 店长 002 店员
        // mctId: this.userType == '000' ? this.mctId : '', //商户号
        // shopsId: this.userType == '001' ? this.detailInfo.userId : '',//门店号
        // cashierId: this.userType == '002' ? this.userId : '', //店员号
        // dateType: 1,// 日期类型  1 当天 2自定义时间
        mctId: this.mctId,
        status: type,
        startTime: this.todayValue + '000000',
        endTime: this.todayValue + '235959',
      }).then(async res => {
        console.log(res, '订单列表')

        this.orderList = res.list
      })
    },
    async getOrderList() {
      getOrderListNew({
        page: this.page,
        rows: 10,
        // orderStatus: this.orderType,
        // roleType: this.userType, //000 商户，001 店长 002 店员
        // mctId: this.userType == '000' ? this.mctId : '', //商户号
        // shopsId: useMctStore().mctInfo.storeId,//门店号
        // cashierId: this.userType == '002' ? this.userId : '', //店员号
        // dateType: 1,// 日期类型  1 当天 2自定义时间
        mctId: this.mctId,
        status: this.orderType,
        startTime: this.todayValue + '000000',
        endTime: this.todayValue + '235959',
      }).then(async res => {
        this.total = res.total
        if (this.orderList.length < this.total) {
          this.orderList.push(...res.list)
        }
      })
    },
    onScrollToLower() {
      if (this.orderList.length < this.total) {
        this.page = this.page + 1
        this.getOrderList()
      }

    },

    getMctData(){
      getMctData({
        mctId: this.mctId,
      }).then(res => {
        console.log(res, '获取商户营业数据')
        this.orderCount = res.orderCount
        this.sumAmt = res.sumAmt
      })
    },

    // 扫码收款
    scanGetMoney() {
      this.bridgeSdk.jumpPage({
        url: `/package-money-transactions/scanGetMoney/index?mctId=${this.mctId}`
      })
    },
    // 二维码收款
    qrCodeGetMoney() {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/displayCode/displayCode?mctId=${this.mctId}&header=${this.detailInfo.shopUrlShowUrl}&name=${this.detailInfo.name}&address=${this.detailInfo.address}`
      })
    },
    openDownLinePayment(){
      // this.isShowCollection = true;
      // return;
      if(this.isShowCollection == '1'){
        uni.showToast({
          title: '已开通线下收款',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if(this.isCollection == '3'){
        uni.showToast({
          title: '审批进行中，请耐心等待',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      this.$refs.modal.open({
        title: "确认开通",
        content: "确认开通将发起线下收款申请，需等待管理员审批，是否确认？",
        confirmText: "确认",
        cancelText: "取消",
        showCancel: true,
        confirmCallback: async () => {
          let res = await offlineCollectionApply({
            mctId: this.mctId,
          })
          if (res) {
            // this.isShowCollection = true
            uni.showToast({
              title: '开通申请已发送，请等待审批',
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    },
    jumpRefndPage(){
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/refund/refund?mctId=${this.mctId}`
      })
    },
  }
}
</script>

<style scoped>
.content {
  height: 100%;
  /* background: linear-gradient(132deg, #58A1F6 0%, #6FA9F7 100%), #FF5871; */
  /* background: linear-gradient( 180deg, #BAFFE1 0%, #D8F7E3 45%, #F5F6F8 100%); */
  padding: 50rpx 30rpx;
  position: relative;
  box-sizing: border-box;

}

.page_bg_img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.commerical_detail_top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar_box {
  padding: 0 32rpx 0 26rpx;

}

.left_image {
  /* background: #ccc; */
  height: 120rpx;
  width: 120rpx;
  border-radius: 50%;
}

.right_content {
  display: flex;
  height: 120rpx;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 20rpx;
  flex-grow: 1;
}

.right_content_layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right_text {
  font-weight: bold;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 34rpx;
}

.right_text_small {
  font-size: 20rpx;
  color: #FFFFFF;
  line-height: 30rpx;
}

.mctName {
  font-weight: 800;
  font-size: 36rpx;
  color: #060000;
  line-height: 50rpx;
}

.card {
  width: 154rpx;
  height: 42rpx;
  border-radius: 25rpx;
  display: flex;
  background: linear-gradient(270deg, #FBBD67 0%, #F29515 100%);
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
}

.order_today{
  width: 100%;
  box-sizing: border-box;
  /* background: #fff; */
  border-radius: 20rpx;
  margin-top: 20rpx;
}

.detail_content {
  background: linear-gradient(180deg, #FFFFFF 0%, #DADADA 100%);
  /* height: 230rpx; */
  /* padding: 30rpx 20rpx 20rpx; */
  border-radius: 20rpx;
  margin-top: 50rpx;
  position: relative;
  overflow: hidden;
}

.detail_content2 {
  background: linear-gradient(180deg, #FFFFFF 0%, #DADADA 100%);
  ;
  height: 230rpx;
  /* padding: 30rpx 20rpx 20rpx; */
  border-radius: 20rpx;
  margin-top: 50rpx;
  position: relative;
}

.detail_content_img {
  position: absolute;
  right: 46rpx;
  top: 0;
  width: 191rpx;
  height: 180rpx;
  z-index: -1;
}

.detail_content_top {
  width: 100%;
  /* padding: 32rpx 0 24rpx 40rpx; */
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  font-weight: bold;
  background: linear-gradient( 180deg, #FFFFFF 0%, #DADADA 100%);
}
.detail_content_top_title{
  padding: 24rpx 0 24rpx 40rpx;
  position: relative;
}
.detail_content_refund {
  padding: 24rpx 0;
  color: #5ba4f3;
  padding-right: 20rpx;
  position: relative;
}

.detail_content_main {
  width: 100%;
  height: 152rpx;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;

}

.detail_content_item {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.detail_content_line {
  width: 2rpx;
  background: #DEDEDE;
  height: 32rpx;
}

.detail_content_top_text {
  text-align: center;
  /* color: #00b8b5; */
  color: #000000;
  font-size: 26rpx;
  vertical-align: bottom;
}

.font_44 {
  font-size: 44rpx;
}

.detail_content_bottom_text {
  font-weight: 800;
  font-size: 20rpx;
  color: #A2A2A2;
  line-height: 28rpx;
  margin-top: 14rpx;
}

.collection_content {
  width: 100%;
  height: 226rpx;
  border-radius: 20rpx;
  background: #fff;
  box-sizing: border-box;
  padding: 0 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.collection_content_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.collection_content_item_img {
  width: 148rpx;
  height: 146rpx;
}

.collection_content_item_text {
  font-weight: 800;
  font-size: 26rpx;
  color: #000000;
  line-height: 36rpx;
}

.collection_content_line {
  width: 2rpx;
  height: 48rpx;
  background: #DEDEDE;
}

.writeoff_content {
  width: 100%;
  height: 218rpx;
  border-radius: 20rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10rpx;
}

.writeoff_content_item {
  width: 281rpx;
  height: 158rpx;
  background: linear-gradient(180deg, #FFD798 0%, #FEEFDA 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
}

.writeoff_content_item_img {
  width: 60rpx;
  height: 60rpx;
}

.writeoff_content_item_text {
  font-weight: 800;
  font-size: 26rpx;
  color: #E07727;
  line-height: 36rpx;
}

.icon_content {
  margin-top: 30rpx;
}

.icon_content_item {
  text-align: center;
  background: #fff;
  height: 150rpx;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.icon_content_item_text {
  margin-top: 20rpx;
  color: #283e54;
  text-align: center;
  font-size: 28rpx;
}

.detail_order_content {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  flex-direction: column;
}
.detail_order_content_header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail_left {
  font-size: 32rpx;
}

.detail_right {
  font-size: 24rpx;
}

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

.card-list {
  font-size: 28rpx;
  line-height: 30rpx;
}

.card-title {
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-time {
  font-size: 28rpx;
  padding-top: 20rpx;
}

.card-price {
  color: red;
  font-size: 30rpx;
  font-weight: bold;
  padding: 10rpx 0;
}

/deep/ .u-cell__title-text--large {
  font-size: 24rpx;
}

/deep/ .cell--u-cell__value--large {
  font-size: 24rpx;
}

.u-slot-value {
  font-size: 24rpx;
  white-space: wrap;
  text-align: end;
}

/deep/ .u-cell__body {
  padding: 18rpx 0 !important;
}

/deep/ .u-cell-group__wrapper .u-cell:last-child .u-line {
  display: none;
}

.open_down_line_payment{
  width: 614rpx;
  height: 94rpx;
  background: linear-gradient( 90deg, #90BEF4 0%, #4195F0 100%);
  box-shadow: 0rpx 6rpx 12rpx 2rpx rgba(98,168,243,0.35);
  border-radius: 50rpx;
  font-weight: bold;
  font-size: 30rpx;
  color: #FFFFFF;
  line-height: 94rpx;
  text-align: center;
  margin: 680rpx auto 0;
}
</style>