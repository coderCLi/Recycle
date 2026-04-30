<!--
 * @Description: 订单详情
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
 * @editors: songjuncheng
-->

<template>
    <vc-container :props-data="propsData">
    	<vc-login v-if="!isLogined" />
    	<!-- 商品详情列表 -->
		<view class="tui-order-container">
			<template v-if="suAll.length > 0">
				<view class="tui-order-container_item" v-for="(sub, subIndex) in suAll" :key="subIndex">
					<view class="tui-order-container_item--shop">
						{{ sub.shopsName }}
					</view>
					<!-- 商城订单 -->
				  <view v-if="sub.mallScene == 'mall'">
					 <view class="tui-order-container_item--goods" v-for="(goods, goodsI) in sub.goodsList" :key="goodsI">
						<image :src="goods.listPicUrl"></image>
						<view style="flex: 1;">
							<view class="goods-title">{{ goods.goodsName }}</view>
							<view class="goods-sku">数量 X {{ goods.number }}，{{ goods.goodsSpecifitionNameValue }}</view>
						</view>
						<view style="text-align: right;margin-left: 20rpx;">
							<view class="txt">¥{{ goods.retailPrice }}</view>
							<view class="txt-through">¥{{ goods.marketPrice }}</view>
						</view>
					</view>
				  </view>
				  <!-- 商户订单 -->
                  <view v-else>
					<view class="tui-order-container_item--goods">
						<image :src="this.minioBaseUrl + sub.listPicUrl"></image>
						<view style="flex: 1;">
							<view class="goods-title">{{ sub.spuName }}</view>
							<view class="goods-sku">数量 X {{ sub.number }}</view>
						</view>
						<view style="text-align: right;margin-left: 20rpx;">
							<view class="txt">¥{{ sub.subPayAmt }}</view>
							<view class="txt-through" v-if="sub.mallScene != 'storeYKT'">¥{{ sub.subOrderAmt }}</view>
						</view>
					</view>
				  </view>
				</view>
			</template>
		</view>
    	<!-- 订单参数 -->
		<view class="tui-order-container_info">
			<view class="tui-order-container_info--item">
				<view>合计金额</view>
				<view style="font-size: 36rpx;font-weight: bold;color: #333;">¥{{ payInfo.payAmt }}</view>
			</view>
			<view class="tui-order-container_info--item" v-if="mallScene == 'mall'">
				<view>商城订单号</view>
				<view>{{ payInfo.shoppingOrderId }}<text style="margin-left: 10rpx;color: #5677fc;" @click="doCopy(payInfo.shoppingOrderId)">复制</text></view>
			</view>
			<view class="tui-order-container_info--item">
				<view>订单编号</view>
				<view>{{ payInfo.orderId }}<text style="margin-left: 10rpx;color: #5677fc;" @click="doCopy(payInfo.orderId)">复制</text></view>
			</view>
			<view class="tui-order-container_info--item">
				<view>下单时间</view>
				<view>{{ payInfo.payStartTime }}</view>
			</view>
			<view class="tui-order-container_info--item" v-if="payInfo.payEndTime">
				<view>支付时间</view>
				<view>{{ payInfo.payEndTime }}</view>
			</view>
			
			<!-- 收货信息 -->
			<template v-if="addressInfo && isVirtualProduct=='0'">
				<view class="tui-order-container_info--item" style="margin-top: 30rpx;">
					<view>收货信息</view>
					<view>{{ addressInfo.consignee }}</view>
				</view>
				<view class="tui-order-container_info--item">
					<view>收货地址</view>
					<view>{{ addressInfo.province + addressInfo.city + addressInfo.district +addressInfo.address }}</view>
				</view>
			</template>
		</view>

		<view class="btn" v-if="payInfo.orderStatus == '01'" @click="goPay">去支付</view>
    </vc-container>
  </template>
  
  <script>
  import product from '../components/product.vue'
  import { mapState } from 'pinia'
  import { usermOrderDetails,keepPayOrder } from '../api/index'
  import { useBaseStore, useUserStore } from "@/store/index"
  import { formatDate } from '../utils/util'
  export default {
    components: { product },
    data () {
      return {
        orderList: [],
        propsData: {
          props: {
            title: {
              value: '订单详情'
            }
  
          }
        },
        addressInfo: {},
        payInfo: {},
        suAll:[],
        orderId: '',
		mallScene: 'mall',
		isVirtualProduct: '0',// 是否虚拟商品
		virtualProductSource: '',// 虚拟商品渠道
        isMct: false
      }
    },
    computed: {
      ...mapState(useUserStore, {
        isLogined: "isLogined"
      })
    },
    async onLoad (options) {
      //  await this.firstInit();   
      this.orderId = options.orderId
	  this.mallScene = options.mallScene
      await this.getOrder()
      this.isMct = options.isMctId
    },
    methods: {
      getOrderProvince (item) {
        if (item.mallScene == 'mall') {
          return item.province + item.city + item.district + item.address
        } else {
          return item.provinceName + item.cityName + item.districtName + item.addressName
        }
      },
      async getOrder () {
        let res = await usermOrderDetails({ orderId: this.orderId })
        const { addressInfo, payInfo, suAll } = res
        this.addressInfo = addressInfo  //地址信息
        this.payInfo = payInfo    //支付信息
		this.payInfo.payStartTime = formatDate(payInfo.payDate + payInfo.payTime)
		if(this.bridgeSdk.checkIsEmpty(this.payInfo.payEndTime)){
		   this.payInfo.payEndTime = formatDate(payInfo.payEndTime)
		}
		suAll.forEach(item => {
			if(item.mallScene == 'mall'){
			   item.goodsList = JSON.parse(item.attributes).orderGoodsAll	
			}
		})
        this.suAll = suAll  //商品信息
		this.isVirtualProduct = res.isVirtualProduct
		this.virtualProductSource = res.virtualProductSource
      },
    //复制
        doCopy(text) {
            uni.setClipboardData({
                data: text, 
                success: function () {
                    uni.showToast({
                        title:'复制成功',
                        icon:'none'
                    })
                }
            })
        },
		// 去支付
		goPay() {
			keepPayOrder({
				orderId: this.orderId
			}).then(res=>{
				console.log(res)
				if(res) {
					let encodeUrl = encodeURIComponent(res.payUrl)
					// #ifdef MP-WEIXIN
					this.bridgeSdk.jumpPage({
						url: '/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
					})
					// #endif
					// #ifdef H5
					if(this.virtualProductSource == 'hbb') {
						let _q = res.payUrl.indexOf("?") > -1 ? "&" : "?";
						location.replace(res.payUrl + _q + '_needH5Head=1?appToken=' + this.bridgeSdk.getStorageSync('appToken'))
					} else {
						let _q = res.payUrl.indexOf("?") > -1 ? "&" : "?";
						location.replace(res.payUrl + _q + '_needH5Head=1?appToken=' + this.bridgeSdk.getStorageSync('appToken'))
					}
					// #endif
				}
			})
		},
    }
  }
  </script>
  
  <style scoped lang="scss">
 	.tui-order-header {
		width: 85%;
		padding: 30rpx 30rpx;
		border-radius: 20rpx;
		margin: 30rpx auto 0;
		background-color: white;
		position: relative;
		.tui-reason {
			font-size: 24rpx;
			line-height: 24rpx;	
			padding-top: 15rpx;
			display: flex;
			align-items: center;
			text-align: center;
			margin: 20rpx auto 0;
			display: flex;
			align-items: center;
			justify-content: center;
			&-text {
				padding-right: 12rpx;
			}
		}
		.tui-status-img {
			width: 60rpx;
			height: 60rpx;
			display: block;
			margin-right: 20rpx;
		}
	}
	.tui-order-container {
		background-color: white;
		width: 85%;
		padding: 30rpx 30rpx;
		margin: 20rpx auto 0;
		border-radius: 20rpx;
		&_item{
			margin-bottom: 20rpx;
			&--shop{
				font-size: 32rpx;
				font-weight: bold;
				text-align: left;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
			}
			&--goods{
				display: flex;
				align-items: center;
				justify-content: space-between;
				line-height: 45rpx;
				margin-bottom: 20rpx;
				.txt{
					font-size: 28rpx;
					color: #333;
				}
				.txt::first-letter{
					font-size: 24rpx;
				}
				.txt-through{
					font-size: 24rpx;
					color: gray;
					text-decoration: line-through;
				}
				image{
					width: 130rpx;
					height: 118rpx;
					border-radius: 20rpx;
					margin-right: 20rpx;
				}
				.goods-title{
					font-size: 28rpx;
					font-weight: bolder;
					color: #333;
					word-break: break-all;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
				.goods-sku{
					font-size: 24rpx;
					color: gray;
				}
			}
			&--btn{
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
		&_info{
			margin: 20rpx auto 0;
			padding: 30rpx 30rpx;
			width: 85%;
			background-color: white;
			border-radius: 20rpx;
			&--item{
				display: flex;
				// align-items: center;
				font-size: 26rpx;
				justify-content: space-between;
				line-height: 50rpx;
				// view:first-child{
				// }
				view:last-child{
					width: 500rpx;
					text-align: right;
					color: gray;
				}
				&:first-of-type{
					view:last-child::first-letter{
						font-size: 26rpx;
						margin-right: 5rpx;
					}
				}
			}
		}
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-order-btns {
		padding: 0 20rpx;
		height: 140rpx;
		background: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
		z-index: 999;
		.tui-order-btn{
			margin-left: 10rpx;
		}
	}
	.btn{
		position: fixed;
		bottom: calc(20rpx + constant(safe-area-inset-bottom));
		bottom: calc(20rpx + env(safe-area-inset-bottom));
		left: 0;
		right: 0;
		width: 670rpx;
		padding: 20rpx 0;
		margin: 0 auto;
		text-align: center;
		border-radius: 42rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: white;
		background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #00BDB8;
	}
  </style>