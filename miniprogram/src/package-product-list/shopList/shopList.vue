<!--
 * @Description: 订单列表
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
 * @editors: songjuncheng
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
              <!-- <up-input
                placeholder="请输入订单号"
                prefixIcon="search"
                v-model="orderSearch"
                prefixIconStyle="font-size: 22px;color: #909399"
                @change="inputChange"
                @confirm="inputConfirm">
              </up-input> -->
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
              :throttle="false"
              @scrolltolower="onScrollToLower">
<!-- 列表 -->
<view class="tui-order-list" v-if="orderList.length > 0">
			<view class="tui-order-list_item" v-for="(main, mainI) in orderList" :key="mainI">
				<!-- 店铺名 -->
				<view class="tui-order-list_item--title">
					<view>{{ main.shopsName||'---' }}</view>
					<view style="display: flex;align-items: center;">
						<view v-if="main.payStatus == '02'" style="font-size: 24rpx;font-weight: normal;color: gray;">{{payType == 'refund' ? orderMap[main.orderStatus] : orderPayMap[main.orderStatus] }}</view>
						<view v-else style="font-size: 24rpx;font-weight: normal;color: gray;">{{ payMap[main.payStatus] }}</view>							 
							<!-- 倒计时 -->
            <!-- <up-count-down v-if="main.totalSecond > 0" style="margin-left: 10rpx;" :time="main.totalSecond||0" format="HH:mm:ss" @change="changeTime">
                <view class="time">
                  <view class="time__custom">
                      <text class="time__custom__item">{{  String(timeData.minutes).padStart(2, '0') }}</text>
                  </view>
                  <text class="time__doc">:</text>
                  <view class="time__custom">
                      <text class="time__custom__item">{{  String(timeData.seconds).padStart(2, '0') }}</text>
                  </view>
                </view>
              </up-count-down>							 -->
					</view>
				</view>
				<!-- 商品列表 -->
      <view class="cardCont">
        <view class="card-item-zi-icon">
               <image v-if=" main.mallScene =='mall' " mode="widthFix" style="width: 100%;" src="../static/shop.png" />
        </view>
        <template v-if="main.orderImgAll.length == 1">
					<view class="tui-order-list_item--single" @click="itemClick(main)">
						<image :src="main.orderImgAll[0]"></image>
						<view style="flex: 1;">
							<view class="single-title">{{ main.goodsName }}</view>
						</view>
            <view class="right-price" v-if="main.orderTotalNumber > 0">
                  <view>
                    <view class="txt">¥{{ main.orderTotalPrice }}</view>
                  </view>
                  <view style="font-size: 24rpx;color: gray;text-align: right;">共{{ main.orderTotalNumber }}件</view>
            </view>
					</view>
				</template>
				<template v-else-if="main.orderImgAll.length > 1">
					<scroll-view scroll-x class="tui-order-list_item--multiple">
						<image :class="{ 'show-more': main.orderImgAll.length > '5' }" v-for="(img, imgI) in main.orderImgAll.filter((ig,ii) => ii < 5)" :key="imgI" :src="img"  @click="itemClick(main)"></image>
					</scroll-view>
             <view class="right-price right-price-more" v-if="main.orderTotalNumber > 0">
                  <view>
                    <view class="txt">¥{{ main.orderTotalPrice }}</view>
                  </view>
                  <view style="font-size: 24rpx;color: gray;text-align: right;">共{{ main.orderTotalNumber }}件</view>
            </view>
				</template>

      </view>
			</view>
		</view>
          <u-loadmore v-if="showIsmore" marginTop="30" :status="loadStatus"></u-loadmore>
            </scroll-view>
            <vc-login v-if="!isLogined" />
          </view>
      </view>
    </vc-container>
  </template>
  
  <script>
  import { userOrdersAll, getDataDicList } from '../api/index'
  import { mapState } from 'pinia'
  import { useBaseStore, useUserStore } from "@/store/index"
  import { expireTime } from '../utils/util'

  export default {
    components: {
    },
    data () {
      return {
        timeData: {},
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
        showIsmore: false,
        loadStatus: 'loadmore',
        list: [{ name: '全部', value: 'all' },
        { name: '待付款', value: 'obl' },
        { name: '付款完成', value: 'pay' },
        { name: '退款', value: 'refund' },
        { name: '其他', value: 'order' }],
        orderSearch: '',
        orderType: '',
        payType:'all',
        orderList: [],
        total: 0,
        userType: '',
        userId: '',
        mctId: '',
        detailInfoUserId: '',
        dateType: null,
        screenHeight: 0,
        scrollTop: 0, //滚动高度
				orderStatus: -2, //默认订单状态：全部
				page: 1,//总页数
			  rows: 10,//每页显示条数
        current: 1, // 分页总页数
        pages: 1, // 当前页
				//订单状态 0:订单创建成功等待付款 100:订单超时已过期 101:订单已取消 102:订单已删除 201:订单已付款,等待发货 300:订单已发货 301:用户确认收货 400:申请退款 401:没有发货，退款 402:已收货，退款退货
			  //交易状态 00：待付款  01：处理中 02：交易成功 03：交易失败  04：已关闭  05：已撤销  90:超时 91:异常  98：预下单  99：日终失效
        //订单状态 0000 未退款  0100 退款已受理 0200 退款成功 0300 退款失败 (后两位00 标识全额退款 01标识部分退款) 
        orderMap: {
					'0000': '未退款',
					'0100': '退款中', //全额
          '0101': '退款中', //部分
					'0200': '退款成功',
					'0300': '退款失败',
				},//订单状态码表
        payMap:{
          '00': '待付款',
          '01': '待付款',
          '02': '交易成功',
          '03': '交易失败',
          '04': '已关闭',
          '05': '已关闭',
          '90': '超时',
          '91': '异常',
          '98': '预下单',
          '99': '日终失效'
        },
        //付款完成tab订单状态码表
        orderPayMap :{
          '0000': '已付款',
          '0100': '退款中', //全额
          '0101': '退款中', //部分
					'0200': '退款成功',
					'0300': '退款失败',
        }
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
    // 下拉刷新
    onPullDownRefresh() {
        this.page = 1
        //调用获取数据方法
        this.orderListInit(this.payType)
        //结束下拉刷新
        uni.stopPullDownRefresh();

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
        this.orderListInit(this.payType)
        // // 获取状态栏高度
        const { statusBarHeight, navBarHeight } = await this.bridgeSdk.getDeviceInfo()
        const res = await this.bridgeSdk.getWindowInfo()
        console.log(statusBarHeight, navBarHeight, res.screenHeight)
        this.screenHeight = this.px2rpx(res.screenHeight - statusBarHeight - navBarHeight - 11 - 104)
      },
      //px换算rpx
      px2rpx (px) {
        let scale = uni.upx2px(100) / 100
        return px / scale
      },
      // 倒计时时间事件
      changeTime (e){ 
        this.timeData = e
      },
      onScrollToLower (e) {
        console.log('加载更多');  
        this.showIsmore = true   
        console.log(this.pageNum,'666666666666666666');
        
        if (this.pageNum < this.current) {
          this.loadStatus = 'loading'
          this.page = this.page + 1
          this.orderListInit(this.payType)
        } else {
            this.loadStatus = 'nomore'
        }
      },
      inputChange (e) {
        let that = this
        this.$u.debounce(function () {
          console.log('inputChange', e)
          that.page = 1
          this.orderList = []
          that.orderListInit('all')
        }, 1000)
      },
      inputConfirm (e) {
        console.log('inputConfirm', e)
        this.page = 1
        this.orderList = []
        this.orderListInit('all')
      },
      tabsClick (e) {
        console.log(e, 'tabsClick')
        this.showIsmore = false
        this.orderType = e.value
        this.orderList = []
        this.page = 1
        this.payType = e.value
        this.orderListInit(this.payType)
      },
      async orderListInit (type) {
        userOrdersAll({
          page: this.page,
          rows: this.rows,
          userId: this.userInfo.userId,//用户编号
          // orderStatus: this.orderType,
          orderId: this.orderSearch,
          type: type
        }).then(async res => {
          console.log(res, 'dindgan')
  
          this.isLoadMore = false
          this.total = res.total
          this.pageNum = res.pageNum
          this.current = res.pages
          let dataList = res.list.map(e=>{
            if(e.mallScene == 'mall'){
             // 商城订单
            }else{
              //门店订单
              e.orderImgAll = e.orderImgAll.map(img => this.minioBaseUrl + img)
            }
							return {
								...e,
								totalSecond: (e.payStatus == '00' || e.payStatus == '01')&& e.orderStatus == '00' ? expireTime(e.payEndTime) : 0
							}
						})
          if (this.page == 1){
            this.orderList = dataList
          }else{
            this.orderList = [...this.orderList, ...dataList]
          }
          
            console.log(this.orderList, 'orderList');   
        })
      },
      itemClick (item) {
        console.log('itemClick', item)
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/orderDetail/orderDetail?orderId=${item.orderId}&isMctId=${this.bridgeSdk.checkIsEmpty(this.mctId)}&mallScene=${item.mallScene}`
        })
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
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
  .card-item-zi-icon{
    position: absolute;
    width: 130rpx;
    height: 130rpx;
    right: 0;
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
          font-size: 28rpx;
					color: #333;
					margin-left: 20rpx;
					.txt{
						font-size: 28rpx;
						font-weight: bolder;
					}
					.txt::first-letter{
						font-size: 24rpx;
						font-weight: normal;
					}
  }
  .right-price-more {
          position: absolute;
          right:0;
          top:0;
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
  .cardCont{
    width: 100%;
    position: relative;
  }
  .tui-order-list {
		margin-top: 40rpx;
		&_item{
			width: 85%;
			background-color: white;
			border-radius: 20rpx;
			margin: 20rpx auto 0;
			padding: 20rpx 30rpx;
			&--title{
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32rpx;
				color: #333;
				font-weight: bolder;
				margin-bottom: 20rpx;
			}
			&--single{
				display: flex;
				// align-items: center;
				image{
					width: 150rpx;
					height: 150rpx;
					border-radius: 10rpx;
					margin-right: 10rpx;
				}
				.single-title{
					word-break: break-all;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #333;
					margin-left: 10rpx;
				}
				.single-price{
					min-width: 10%;
					font-size: 28rpx;
					color: #333;
					margin-left: 20rpx;
					.txt{
						font-size: 28rpx;
						font-weight: bolder;
					}
					.txt::first-letter{
						font-size: 24rpx;
						font-weight: normal;
					}
				}
			}
			
			&--multiple{
        width: 478rpx;
				display: flex;
				white-space: nowrap;
				image{
					width: 150rpx;
					height: 150rpx;
					border-radius: 10rpx;
					margin-right: 10rpx;
					position: relative;
				}
				.show-more:last-of-type::after{
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					background-color: rgba(0, 0, 0, .4);
					width: 150rpx;
					height: 150rpx;
					border-radius: 10rpx;
					content: "查看全部";
					font-size: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
				}
			}
			&--btns{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				margin-top: 20rpx;
				.btn{
					margin-left: 20rpx;
				}
			}
		}
	}
  .time {
    display: flex;
    align-items: center;
    justify-content: center;

    &__custom {
         margin-top: 4px;
         width: 22px;
         height: 22px;
         background-color: #01BFB9;
         border-radius: 4px;
         /* #ifndef APP-NVUE */
         display: flex;
         /* #endif */
         justify-content: center;
         align-items: center;
    
        &__item {
             color: #fff;
             font-size: 12px;
             text-align: center;
         }
    }
    
    &__doc {
         color: #01BFB9;
         padding: 0px 4px;
     }
    
    &__item {
         color: #606266;
         font-size: 15px;
         margin-right: 4px;
     }
}
  </style>