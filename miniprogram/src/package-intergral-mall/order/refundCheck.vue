<!--
 * @Description: 实物商品售后前置页
 * @Autor: TF
 * @Date: 2025-07-21 16:07:51
 * @LastEditors: TF
 * @LastEditTime: 2025-08-16 14:40:58
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container" :props-data="{props: {isFullScreen: {value: true}}}">
        <view class="aftersale">
            <view class="aftersale-type" v-if="isAfterSale">
                <!-- 选择售后方式 -->
                <view class="aftersale-type_title">选择售后类型：</view>
                <view class="aftersale-type_choose" v-if="isAfterSale">
                    <view v-for="(item, index) in chooseList" :class="['item', current == item.key ? 'active' : '']" :key="index" @click="current = item.key">
                        {{ item.name }}
                    </view>
                </view>
            </view>

            <view class="aftersale-items">
                <view class="aftersale-items_title" v-if="['ENTITY_REFUND_REASON', 'VIRTUAL_REFUND_REASON'].includes(doType)">选择退款商品：</view>
                <view class="aftersale-items_title" v-else>选择售后商品：</view>
                <!-- 商品列表 -->
                <view class="aftersale-items_goods">
                    <up-radio-group v-model="nowSubId">
                        <view v-for="(item, index) in goodsList" :key="index" class="item">
                            <view class="item-top">
                                <up-radio :name="item.pointsShopOrderId" size="16" activeColor="#00BCB8"></up-radio>
                                <view style="flex: 1;display: flex;margin-left: 20rpx;">
                                    <view style="position: relative;width: 120rpx;height: 108rpx;">
                                        <image :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
                                        <view class="status">
                                            {{ item.statusName }}
                                        </view>
                                    </view>
                                    <view class="item-top_content">
                                        <view class="muti-overflow" style="font-size: 24rpx;color: #333;font-weight: bold;">{{ item.spuName }}</view>
                                        <view class="text-overflow" style="font-size: 20rpx;color: #999;margin-top: 4rpx;">{{ item.skuName }}</view>
                                        <view style="margin-top: 12rpx;font-size: 24rpx;color: #333;display: flex;">
                                            <view>x {{ item.quantity }}</view>
                                            <text style="margin: 0 10rpx;">|</text>
                                            <view style="display: flex;justify-content: flex-start;flex-wrap: wrap;">
                                                <view>付款金额:</view>
                                                <view v-if="plus(item.subPayAmt, item.freight) > 0">¥ {{ plus(item.subPayAmt, item.freight) }}</view>
                                                <view style="margin: 0 5rpx;" v-if="plus(item.subPayAmt, item.freight) > 0 && item.subOrderPonints > 0">+</view>
                                                <view v-if="item.subOrderPonints > 0">{{ item.subOrderPonints }} 会员分</view>
                                            </view>
                                        </view>
                                        <view v-if="item.isSupportRefund == '0'" style="font-size: 20rpx;color: #999;margin-top: 6rpx;">{{ item.isSupportRefundDesc }}</view>
                                    </view>
                                </view>
                            </view>
                            <!-- 商品数量 > 1 && （售后 || 退款（待发货））&& 支持部分退  -->
                            <view class="item-bottom" v-if="item.quantity > 1 && !(!isAfterSale && doType == 'ENTITY_REFUND_REASON') && item.supportPartialRefund == '1'">
                                <view>
                                    <view style="font-size: 26rpx;color: #333;">售后数量</view>
                                    <view style="font-size: 22rpx;color: #999;margin-top: 10rpx;">最多退{{ item.quantity }}件</view>
                                </view>
                                <view class="numberstep">
                                    <view @click="doMinus(item)">
                                        <up-icon name="minus" size="20rpx"></up-icon>
                                    </view>
                                    <input v-model="item.refundNum" type="number" @blur="inputBlur(item)"/>
                                    <view @click="doPlus(item)">
                                        <up-icon name="plus" size="20rpx"></up-icon>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </up-radio-group>
                </view>
            </view>
            <!-- 下一步按钮 -->
            <view :class="['aftersale-btn', !bridgeSdk.checkIsEmpty(nowSubId) || (!bridgeSdk.checkIsEmpty(current) && isAfterSale) ? 'disabled' : '']" @click="nextStep">
                下一步
            </view>
        </view>
    </vc-container>
</template>

<script>
    import { usePointsStore } from "@/store/index"
    import { plus, minus } from "@/utils/decimal"
    import {
        pointsUserOrderDetail,// 订单详情
    } from '../api/index'
    // 售后状态列表
    const REFUND_STATUS = [
        'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
        'REFUND_REVIEWING', // 退款审核中
        'REFUND_PROCESSING', // 退款中
        'PART_REFUND_PROCESSING', // 部分退款中
        'REFUND_SUCCESS', // 已退款
        'EXPIRED_REFUNDED_SUCCESS', // 过期退款成功
        'EXPIRED_REFUND',// 过期退款
        'AFTER_SALE_PROCESSING', // 售后中
        'MERCHANT_REFUSED', // 商家拒绝售后
        'RETURN_REVIEWING',// 退货审核中
        'RETURN_PROCESING',// 退货处理中
        'PART_RETURN_PROCESING',// 部分退货处理中
        'RETURN_PENDING_RETURN_SHIPMENT',// 待退货
        'RETURN_PENDING_SELLER_RECEIPT',// 待商家收货
        'RETURN_PENDING_CHECKING',// 退货验货中
        'RETURN_PENDING_REFUNDING',// 退货退款中
        'RETURN_PENDING_SUCCESS',// 退货成功
    ]
    export default {
        name: 'refundCheck',
        data() {
            return {
                plus,
                orderId: '',// 订单ID
                pointsShopOrderId: '',// 分单订单号
                doType: '',// 售后类型
                isAfterSale: false,// 是否售后（控制是否展示售后方式选择）
                chooseList: [
                    {
                        name: '退款',
                        key: '1'
                    },
                    {
                        name: '退货退款',
                        key: '2',
                    }
                ],// 售后类型
                goodsList: [],// 子订单列表
                current: '',// 当前售后类型
                nowSubId: '',// 当前售后子订单ID

                statusColorMap: {
                    'PENDING_PAYMENT': '#FF5871',// 待付款
                    'PENDING_RECEIPT_USE': '#00BCB8',// 可使用
                    'PENDING_USE': '#00BCB8',// 可使用
                    'PENDING_SHIPMENT': '#00BCB8',// 待发货
                    'PENDING_RECEIPT': '#00BCB8',// 待收货
                    'COMPLETED': '#999999',// 交易成功
                    'CANCELLED': '#999999',// 已取消
                    // 退款、售后相关状态
                    'EXPIRED_REFUNDING_PROCESSING': '#FF583A',// 过期退款中
                    'REFUND_REVIEWING': '#FF583A',// 退款审核中
                    'REFUND_PROCESSING': '#FF583A',// 退款中
                    'PART_REFUND_PROCESSING': '#FF583A',// 部分退款中
                    
                    'REFUND_SUCCESS': '#999999',// 已退款
                    'EXPIRED_REFUNDED_SUCCESS': '#999999',// 过期退款成功
                    'EXPIRED_REFUND': '#999999',// 过期退款
                    
                    'AFTER_SALE_PROCESSING': '#FF583A',// 售后中
                    'MERCHANT_REFUSED': '#FF5871',// 商家拒绝售后
                    // 退货相关状态
                    'RETURN_REVIEWING': '#FF583A',// 退货审核中
                    'RETURN_PROCESING': '#FF583A',// 退货处理中
                    'PART_RETURN_PROCESING': '#FF583A',// 部分退货处理中
                    'RETURN_PENDING_RETURN_SHIPMENT': '#FF583A',// 待退货
                    'RETURN_PENDING_SELLER_RECEIPT': '#FF583A',// 待商家收货
                    'RETURN_PENDING_CHECKING': '#FF583A',// 退货验货中
                    'RETURN_PENDING_REFUNDING': '#FF583A',// 退货退款中
                    'RETURN_PENDING_SUCCESS': '#999999',// 退货完成
                    // 换货相关状态
                    'EXCHANGE_REVIEWING': '#FF583A',// 换货审核中
                    'EXCHANGE_PROCESSING': '#FF583A',// 换货处理中
                    'PART_EXCHANGE_PROCESSING': '#FF583A',// 部分换货处理中
                    'EXCHANGE_CHECKING_PROCESSING': '#FF583A',// 换货验货中
                    'EXCHANGE_SENDED': '#FF583A',// 换货已发货
                    'EXCHANGE_SUCCESS': '#999999',// 换货完成
                },// 订单状态颜色
            }
        },
        watch: { 
            nowSubId(val) {
                console.warn('nowSubId', val)
            },
        },
        onLoad(options) {
            // 订单号
            this.orderId = options.orderId
            // 分单订单号
            this.pointsShopOrderId = options.pointsShopOrderId
            // 售后类型
            this.doType = options.doType
            // 判断是否需要选择售后类型
            this.isAfterSale = options.isAfterSale == '1'
            // 获取详情     
            this.getInfo()
        },
        onReady() {
            if(['ENTITY_REFUND_REASON', 'VIRTUAL_REFUND_REASON'].includes(this.doType)) {
                this.$refs.container.setNavPropsData({
                    title:{ value:'选择退款商品' }
                })
            } else if(!['ENTITY_REFUND_REASON', 'VIRTUAL_REFUND_REASON'].includes(this.doType) && this.isAfterSale) {
                this.$refs.container.setNavPropsData({
                    title:{ value:'选择售后商品' }
                })
            } else {
                this.$refs.container.setNavPropsData({
                    title:{ value:'选择售后商品' }
                })
            }
        },
        methods: {
            // 获取订单详情
            getInfo() {
                pointsUserOrderDetail({
                    pointsOrderId: this.orderId,
                    pointsShopOrderId: this.pointsShopOrderId || ''
                }).then(res=>{
                    this.goodsList = [...res.pointsOrderItems].filter(e => !REFUND_STATUS.includes(e.status)).map(e => ({
                        ...e,
                        refundNum: e.quantity// 赋值默认退款数量 = 订单商品数量
                    }))
                })
            },
            // 减
            doMinus(item) {
                if (item.refundNum <= 1) {
                    uni.showToast({
                        title: '退款数量不能再减少了',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                item.refundNum = minus(item.refundNum, 1)
            },
            // 加
            doPlus(item) {
                if (item.refundNum >= item.quantity) {
                    uni.showToast({
                        title: `最多可退${item.quantity}张`,
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                item.refundNum = plus(item.refundNum, 1)
            },
            // 输入框失去焦点
            inputBlur(item) {
                if(!item.refundNum || item.refundNum < 1) item.refundNum = 1;
                if(item.refundNum > item.quantity) item.refundNum = item.quantity;
            },

            // 下一步
            nextStep() {
                if(!this.bridgeSdk.checkIsEmpty(this.current) && this.isAfterSale) {
                    this.bridgeSdk.showToast({
                        title: '请选择售后类型'
                    })
                    return
                }
                if(!this.bridgeSdk.checkIsEmpty(this.nowSubId)) {
                    this.bridgeSdk.showToast({
                        title: '请选择售后商品',
                    })
                    return
                }
                let nowSub = this.goodsList.find(e => e.pointsShopOrderId == this.nowSubId)
                if(nowSub.isSupportRefund == '0') {
                    this.bridgeSdk.showConfirm({
                        title: '联系商家',
                        content: nowSub.isSupportRefundDesc + '，请联系商家协商处理！',
                        confirmText: '我知道了',
                        showCancel: false
                    })
                    return
                }
                let doType
                // 已有售后类型
                if(this.bridgeSdk.checkIsEmpty(this.doType)) {
                    doType = this.doType
                }
                // 实物商品退款
                else if(this.current == '1') {
                    doType = 'ENTITY_REFUND_REASON'
                }
                // 实物商品退货退款
                else if(this.current == '2') {
                    doType = 'ENTITY_RETURNED_REASON'
                }

                usePointsStore().setAfterSaleInfo({
                    ...this.goodsList.find(e => e.pointsShopOrderId == this.nowSubId)
                })
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/orderRefund?orderId=${ this.orderId }&pointsShopOrderId=${this.pointsShopOrderId}&doType=${doType}`,
                    openType: 'redirectTo'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
/* 文本超长展示 */
.text-overflow{
    overflow: hidden;
    /*禁止换行*/
    white-space: nowrap;
    /*显示省略号*/
    text-overflow: ellipsis;
}
/* 文本超长展示 */
.muti-overflow{
    /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    display: -webkit-box;
    /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
    -webkit-box-orient:vertical;
    /*要显示的行数*/
    -webkit-line-clamp: 2;
    /* 溢出部分隐藏 */
    overflow:hidden;
}
.aftersale {
    &-type {
        width: calc(670rpx - 60rpx);
        padding: 30rpx;
        margin: 40rpx auto 0;
        background-color: white;
        border-radius: 16rpx;
        &_title {
            font-size: 32rpx;
            color: #222;
            font-weight: bold;
            text-align: left;
            margin-bottom: 18rpx;
        }
        &_choose {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 35rpx;
            .item {
                width: 180rpx;
                text-align: center;
                border-radius: 10rpx;
                padding: 11rpx 0;
                font-size: 28rpx;
                color: #999999;
                border: 2rpx solid #979797;
            }
            .active {
                background: rgba(0,188,184, .8);
                color: white;
                border: 2rpx solid rgba(0,188,184, .8);
            }
        }
    }

    &-items {
        width: calc(670rpx - 60rpx);
        padding: 30rpx;
        margin: 26rpx auto 0;
        background-color: white;
        border-radius: 16rpx;
        &_title {
            font-size: 32rpx;
            color: #222;
            font-weight: bold;
            text-align: left;
            margin-bottom: 24rpx;
        }
        &_goods {
            .item {
                margin: 0 auto 42rpx;
                width: 100%;
                &:last-of-type {
                    margin-bottom: 0;
                }
                &-top {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .status {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        left: 0;
                        height: 36rpx;
                        line-height: 36rpx;
                        text-align: center;
                        color: white;
                        font-size: 20rpx;
                        background: rgba(0, 0, 0, .5);
                        border-radius: 0 0 12rpx 12rpx;
                    }
                    image {
                        width: 120rpx;
                        height: 108rpx;
                        border-radius: 12rpx;
                        margin-right: 20rpx;
                    }
                    &_content {
                        flex: 1;
                        width: 60%;
                        margin-left: 10rpx;
                    }
                }
                &-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 10rpx;
                    border-top: 1rpx solid #d0d0d0;
                    margin-left: 70rpx;
                    margin-top: 20rpx;
                }
            }
            .numberstep{
                display: flex;
                align-items: center;
                height: 40rpx;
                border-radius: 20rpx;
                border: 2rpx solid #999999;
                input{
                    width: 76rpx;
                    border-left: 2rpx solid #999999;
                    border-right: 2rpx solid #999999;
                    text-align: center;
                    font-size: 28rpx;
                }
                view{
                    width: 40rpx;
                    font-size: 28rpx;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
    &-btn {
        position: absolute;
        bottom: 100rpx;
        left: 0;
        right: 0;
        width: 670rpx;
        line-height: 84rpx;
        border-radius: 42rpx;
        margin: 0 auto;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #00BDB8;
        text-align: center;
        color: white;
        font-size: 28rpx;
        font-weight: bold;
    }
    .disabled {
        background: #999;
        pointer-events: none;
        cursor: none;
    }
}
</style>