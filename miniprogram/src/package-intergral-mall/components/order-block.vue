<!--
 * @Description: 订单组件（积分商城）
 * @Autor: TF
 * @Date: 2025-07-02 15:06:37
 * @LastEditors: TF
 * @LastEditTime: 2025-08-30 14:04:14
-->
<template>
    <view class="order-block">
        <view class="order-block_top">
            <view class="left">
                <image :src="staticBaseUrl + '/hbdimage/package-product-list/mct-logo.png'"/>
                <view style="max-width: 60%;" class="text-overflow">
                    {{ item.mallScene }}
                </view>
            </view>
            <!-- 订单状态 -->
            <view class="right" :style="{color: item.statusColor, fontSize: '24rpx', fontWeight: 'bold'}">
                <view>{{ item.statusName }}</view>
            </view>
        </view>
        <!-- 商品信息 -->
        <view class="order-block_content" style="display: block;" v-for="(itm, idx) in item.pointsOrderItems" :key="idx"  @click="goDetail">
            <view style="display: flex;">
                <image :src="minioBaseUrl + itm.listPicUrl" mode="aspectFill"/>
                <view style="flex: 1;width: 60%;">
                    <view style="font-weight: bold;font-size: 24rpx;line-height: 33rpx;">{{ itm.spuName }}</view>

                    <view v-if="item.isVirtualProduct == '1'" style="font-size: 20rpx;color: #999;margin-top: 4rpx;">{{ itm.useDesc }}</view>
                    <view v-else-if="item.isVirtualProduct != '1' || (item.isVirtualProduct == '1' && !itm.useDesc)" style="font-size: 20rpx;color: #999;margin-top: 4rpx;">{{ itm.skuName }}</view>

                    <view style="display: flex;align-items: flex-start;justify-content: space-between;flex-wrap: wrap;">
                        <view style="margin-top: 12rpx;white-space: nowrap;">
                            共 {{ itm.quantity }} 件 | 需支付
                            <text style="white-space: nowrap;" v-if="Number(plus(itm.subPayAmt, itm.freight || '0')) > 0">¥ {{ plus(itm.subPayAmt, itm.freight || '0') }}</text>
                            <text style="white-space: nowrap;" v-if="Number(plus(itm.subPayAmt, itm.freight || '0')) > 0 && Number(itm.subOrderPonints) > 0"> + </text>
                            <text style="white-space: nowrap;" v-if="Number(itm.subOrderPonints) > 0">{{ itm.subOrderPonints }} 会员分</text>
                        </view>
                        <view style="text-align: right;margin-top: 5rpx;margin-top: 12rpx;margin-left: auto;">
                            <!-- 非取消和待支付状态，展示实付 -->
                            <view v-if="!['CANCELLED', 'PENDING_PAYMENT'].includes(item.status)" style="color: #FB1839;font-size: 24rpx;line-height: 33rpx;">
                                <text style="margin-right: 10rpx;white-space: nowrap;">实付</text> 
                                <text style="white-space: nowrap;" v-if="Number(plus(item.payAmt, itm.freight || '0')) > 0">¥ {{ plus(item.payAmt, itm.freight || '0') }}</text>
                                <text style="white-space: nowrap;" v-else-if="Number(plus(itm.subPayAmt, itm.freight || '0')) > 0">¥ {{ plus(itm.subPayAmt, itm.freight || '0') }}</text>
                                <text style="white-space: nowrap;" v-else-if="Number(plus(itm.subPayAmt, itm.freight || '0')) > 0 && Number(itm.subOrderPonints) > 0"> + </text>
                                <text style="text-align: right;white-space: nowrap;" v-if="Number(itm.subOrderPonints) > 0">{{ itm.subOrderPonints }} 会员分</text>
                            </view>
                            <!-- 待支付状态，展示待付款 -->
                            <view v-else-if="item.status == 'PENDING_PAYMENT'" style="color: #FB1839;font-size: 24rpx;line-height: 33rpx;">
                                <text style="margin-right: 10rpx;white-space: nowrap;">待付款</text> 
                                <text style="white-space: nowrap;" v-if="Number(plus(itm.subPayAmt, itm.freight || '0')) > 0">¥ {{ plus(itm.subPayAmt, itm.freight || '0') }}</text>
                                <text style="white-space: nowrap;" v-if="Number(plus(itm.subPayAmt, itm.freight || '0')) > 0 && Number(itm.subOrderPonints) > 0"> + </text>
                                <text style="text-align: right;white-space: nowrap;" v-if="Number(itm.subOrderPonints) > 0">{{ itm.subOrderPonints }} 会员分</text>
                            </view>
                            <!-- 有退款完成 -->
                            <view v-if="itm.refundOverSize > 0" style="font-size: 18rpx;color: #999;line-height: 30rpx;margin-top: 4rpx;">
                                <view style="display: flex;align-items: flex-start;justify-content: flex-end;font-size: 20rpx;">
                                    <view style="margin-right: 10rpx;">已退款</view>
                                    <view v-if="Number(itm.refundOverAmt) > 0">¥ {{ itm.refundOverAmt }}</view>
                                    <view style="margin: 0 10rpx;" v-if="Number(itm.refundOverAmt) > 0 && Number(itm.refundOverPoints) > 0">+</view>
                                    <view v-if="Number(itm.refundOverPoints) > 0">{{ itm.refundOverPoints }} 会员分</view>
                                </view> 
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 售后信息提示区(存在部分退款或退款情况) -->
            <view class="order-block_tip" v-if="itm.refundSize > 0 || itm.refundOverSize > 0">
                <view class="order-block_tip--block" 
                    :style="{backgroundColor: itm.refundSize > 0 ? '#FFE7E7' : '#C6FFF6', color: itm.refundSize > 0 ? '#FF1A1A' : '#01BFB8'}" 
                    @click.stop="goAfterDetail(itm)">

                    <!-- 全部售后中 -->
                    <template v-if="itm.refundSize > 0 && itm.refundSize == itm.quantity">
                        <up-icon name="clock" color="#FF1A1A" size="12"/>
                        <text>{{ itm.afterSalesType == 'REFUND' || itm.afterSalesType == 'AUTO_REFUND' ? '退款中' : '退货中' }} {{ itm.refundSize }} 件</text>
                        <template v-if="itm.status == 'RETURN_REVIEWING'">
                            <text>退货申请处理中</text>
                        </template>
                        <template v-else-if="itm.status == 'RETURN_PENDING_RETURN_SHIPMENT'">
                            <text>待买家寄回退货商品</text>
                        </template>
                        <template v-else-if="itm.status == 'RETURN_PENDING_SELLER_RECEIPT'">
                            <text>买家已寄回待商家确认收货</text>
                        </template>
                        <template v-else>
                            预计退款
                            <text v-if="Number(itm.refundAmt) > 0">¥ {{ itm.refundAmt }}</text>
                            <text v-if="Number(itm.refundAmt) > 0 && Number(itm.refundPoints) > 0"> + </text>
                            <text v-if="Number(itm.refundPoints) > 0">{{ itm.refundPoints }} 会员分</text>
                        </template>
                    </template>
                    <!-- 部分退款中 -->
                    <template v-else-if="itm.refundSize > 0 && itm.refundSize < itm.quantity">
                        <up-icon name="clock" color="#FF1A1A" size="12"/>
                        <text>{{ itm.afterSalesType == 'REFUND' || itm.afterSalesType == 'AUTO_REFUND' ? '退款中' : '退货中' }} {{ itm.refundSize }} 件</text>
                        <template v-if="itm.status == 'RETURN_REVIEWING'">
                            <text>退货申请处理中</text>
                        </template>
                        <template v-else-if="itm.status == 'RETURN_PENDING_RETURN_SHIPMENT'">
                            <text>待买家寄回退货商品</text>
                        </template>
                        <template v-else-if="itm.status == 'RETURN_PENDING_SELLER_RECEIPT'">
                            <text>买家已寄回待商家确认收货</text>
                        </template>
                        <template v-else>
                            预计退款
                            <text v-if="Number(itm.refundAmt) > 0">¥ {{ itm.refundAmt }}</text>
                            <text v-if="Number(itm.refundAmt) > 0 && Number(itm.refundPoints) > 0"> + </text>
                            <text v-if="Number(itm.refundPoints) > 0">{{ itm.refundPoints }} 会员分</text>
                        </template>
                    </template>
                    <!-- 部分退款成功 -->
                    <template v-else-if="itm.refundOverSize < itm.quantity">
                        <up-icon name="checkmark-circle" color="#01BFB8" size="12"/>
                        <text>{{ itm.afterSalesType == 'REFUND' || itm.afterSalesType == 'AUTO_REFUND' ? '退款成功' : '退货成功' }} {{ itm.refundOverSize }} 件</text>
                        原路退款
                        <text v-if="Number(itm.refundOverAmt) > 0">¥ {{ itm.refundOverAmt }}</text>
                        <text v-if="Number(itm.refundOverPoints) > 0 && Number(itm.refundOverAmt) > 0"> + </text>
                        <text v-if="Number(itm.refundOverPoints) > 0">{{ itm.refundOverPoints }} 会员分</text>
                    </template>
                    <!-- 全部退款完成 -->
                    <template v-else-if="itm.refundOverSize == itm.quantity">
                        <up-icon name="checkmark-circle" color="#01BFB8" size="12"/>
                        <text>{{ itm.afterSalesType == 'REFUND' || itm.afterSalesType == 'AUTO_REFUND' ? '退款成功' : '退货成功' }} {{ itm.refundOverSize }} 件</text>
                        原路退款
                        <text v-if="Number(itm.refundOverAmt) > 0">¥ {{ itm.refundOverAmt }}</text>
                        <text v-if="Number(itm.refundOverPoints) > 0 && Number(itm.refundOverAmt) > 0"> + </text>
                        <text v-if="Number(itm.refundOverPoints) > 0">{{ itm.refundOverPoints }} 会员分</text>
                    </template>

                    <up-icon style="position: absolute;right: 20rpx;top: 50%;transform: translateY(-50%);" name="arrow-right" :color="itm.refundSize > 0 ? '#FF1A1A' : '#01BFB8'" size="12"/>
                </view>
            </view>
        </view>
        <!-- 底部操作按钮区 -->
        <view class="order-block_bottom" style="position: relative;">
            <!-- 非本地生活(文旅一卡通) -->
            <template v-if="item.virtualProductSource && item.virtualProductSource != 'cop'">
                <view v-if="item.status == 'PENDING_PAYMENT'" class="btn" @click.stop="doPay">
                    ¥{{ payAmt }}<text style="margin-left: 5rpx;">去支付</text>
                </view>
            </template>
            <!-- 本地生活（虚拟、实体）-->
            <template v-else>
                <!-- 左侧扩展按钮（退款、申请售后、删除订单） -->
                <!--  (item.status == 'PENDING_PAYMENT' && item.isVirtualProduct != '1')  暂时隐藏修改地址功能-->
                <template  v-if="([
                    // 'PENDING_RECEIPT_USE',
                    // 'PENDING_USE',
                    // 'PENDING_SHIPMENT',
                    // 'PENDING_RECEIPT',
                    'COMPLETED'
                ].includes(item.status) && !noAfterSale)">
                    <view style="position: absolute;left: 10rpx;bottom: 10rpx;" class="act">
                        <up-icon name="more-circle" size="22" color="gray"/>

                        <view class="menu">
                            <!-- <view v-if="['PENDING_RECEIPT_USE', 'PENDING_USE', 'PENDING_SHIPMENT'].includes(item.status) && !noAfterSale" @click.stop="doRefund">退款</view> -->
                            <!-- 实物商品（交易成功、待收货可以售后） -->
                            <!-- <view v-if="item.isVirtualProduct != '1' 
                                && ( (item.status == 'PENDING_RECEIPT' && !noAfterSale) || (item.status == 'COMPLETED' && !noAfterSale && !completeOutTime) )" @click.stop="doAfterSale">申请售后</view> -->
                            <view v-if="['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'RETURN_PENDING_SUCCESS', 'COMPLETED'].includes(item.status)" @click.stop="doDelete">删除订单</view>

                            <!-- 修改地址 -->
                            <!-- <view v-if="item.status == 'PENDING_PAYMENT' && item.isVirtualProduct != '1'" @click.stop="chooseAddress">修改地址</view> -->
                        </view>
                    </view>
                </template>
                <!-- 待付款 -->
                <template v-if="item.status == 'PENDING_PAYMENT'">
                    <view class="btn-normal" @click.stop="doCancel">取消订单</view>
                    <view class="btn" @click.stop="doPay">
                        ¥{{ payAmt }}<text style="margin-left: 5rpx;">去支付</text>
                    </view>
                </template>
                <!-- 待使用 -->
                <template v-if="item.status == 'PENDING_RECEIPT_USE' || item.status == 'PENDING_USE'">
                    <view class="btn-normal" @click.stop="doBuyAgain">再买一单</view>
                    <view v-if="item.virtualProductSource == 'cop' && !noAfterSale" class="btn" @click.stop="goCoupon">查看券码</view>
                </template>
                <!-- 待发货 -->
                <template v-if="item.status == 'PENDING_SHIPMENT'">
                    <view class="btn-normal" @click.stop="doBuyAgain">再买一单</view>
                    <view class="btn" @click.stop="doHurry">催发货</view>
                </template>
                <!-- 待收货 -->
                <template v-if="item.status == 'PENDING_RECEIPT'">
                    <view class="btn-normal" @click.stop="doBuyAgain">再买一单</view>
                    <view class="btn" @click.stop="doConfirm">确认收货</view>
                </template>
                <!-- 交易完成 -->
                <template v-if="item.status == 'COMPLETED'">
                    <view class="btn" @click.stop="doBuyAgain">再买一单</view>
                    <!-- <view class="btn" @click.stop="doRate">评价</view> -->
                </template>
                <!-- 已取消 -->
                <template v-if="item.status == 'CANCELLED'">
                    <view class="btn-normal" @click.stop="doDelete">删除订单</view>
                    <view class="btn" @click.stop="doBuyAgain">再买一单</view>
                </template>

                <!-- 售后相关状态 -->
                <template v-if="REFUND_STATUS.includes(item.status)">
                    <view class="btn" @click.stop="doBuyAgain">再买一单</view>
                </template>
            </template>
        </view>
    </view>
</template>

<script>
    import {
        keepPayOrder,// 去支付
        removeOrder,// 删除订单
        pointsUserOrderDetail,// 详情(校验实时订单状态（券状态）)
        pointsMallRecipt,// 确认收货
    } from '../api/index'
    import { plus } from '@/utils/decimal'
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
        name: 'order-block',
        data() {
            return {
                REFUND_STATUS,
                plus,

                showMenu: false,// 打开扩展按钮组

            }
        },
        props: {
            // 订单信息
            item: {
                type: Object,
                default: () => {
                    return {
                        orderImgAll: []
                    }
                }
            }
        },
        computed: {
            // 卡券信息
            couponInfo() {
                return this.item.isVirtualProduct == '1' && this.item.virtualProductSource == 'cop' && this.bridgeSdk.checkIsEmpty(this.item.pointsOrderItems[0].attributes) ? JSON.parse(this.item.pointsOrderItems[0].attributes) : {}
            },
            // 支付价格
            payAmt() {
                return this.item.pointsOrderItems.map(e => Number(plus(e.subPayAmt, e.freight))).reduce((sum, current) => plus(sum, current), 0)
            },
            // 是否所有子订单全部已售后 || 实物商品所有子单都有售后数量并且非售后驳回
            noAfterSale() {
                return this.item.pointsOrderItems.every(e => e.refundOverSize == e.quantity) || this.item.isVirtualProduct != '1' && this.item.pointsOrderItems.every(e => Number(e.afterSalesNum) > 0 && e.onAfterSales != '3')
            },
            // 是否交易完成超过售后窗口期
            completeOutTime() {
                return (this.item.isVirtualProduct == '1' && this.item.pointsOrderItems[0].isSupportRefund == '0')
                || (this.item.isVirtualProduct != '1' && this.item.pointsOrderItems.every(e => e.isSupportRefund == '0'))
            },
        },
        methods: {
            // 跳转详情
            goDetail() {
                this.bridgeSdk.jumpPage({
                    url: '/package-intergral-mall/order/orderDetail?orderId=' + this.item.pointsOrderId + '&pointsShopOrderId=' + this.item.pointsShopOrderId
                })
            },
            // 取消订单
            doCancel() {
                // emit方法触发shopListNew页面的取消按钮，取消操作在shopListNew页面完成
                uni.$emit('orderCancel', {
                    isVirtualProduct: this.item.isVirtualProduct,
                    pointsOrderId: this.item.pointsOrderId
                })
            },
            // 退款
            // 1、一笔多个商品订单，仅允许同一时间有一个售后处理的申请进行，只有售后处理中的订单处理完成后才能对剩下的商品进行售后操作。
            // 也就是说：若已有发起退款/售后处理中的商品，则“退款”按钮点击后toast提示“您有一笔退款正在处理中，请完成后重新操作”。
            doRefund() {
                // 若存在退款中的订单
                if(this.item.pointsOrderItems.some(e => e.refundSize > 0)) {  
                    this.bridgeSdk.showToast({
                        title: "您有一笔退款正在处理中，请完成后重新操作"
                    })
                    return
                }
                // 实物商品情况，所有子单都已经进行过售后
                if(this.item.isVirtualProduct != '1' && this.item.pointsOrderItems.every(e => e.refundOverSize > 0)) {  
                    this.bridgeSdk.showToast({
                        title: "该订单商品已进行过售后，若仍要售后请联系客服"
                    })
                    return
                }
                // 虚拟商品订单退款，如果不支持退款提示
                if(this.item.isVirtualProduct == '1' && this.item.pointsOrderItems[0].isSupportRefund == '0') {
                    this.bridgeSdk.showToast({
                        title: this.item.pointsOrderItems[0].isSupportRefundDesc
                    })
                    return
                }
                // 实物商品多子单，如果不支持退款提示
                if(this.item.isVirtualProduct != '1' && this.item.pointsOrderItems.every(e => e.isSupportRefund == '0')) {
                    this.bridgeSdk.showToast({
                        title: this.item.pointsOrderItems[0].isSupportRefundDesc
                    })
                    return
                }
                let doType;
                 // 虚拟商品待发货/待使用（虚拟商品退款）
                if((this.item.status == 'PENDING_RECEIPT_USE' || this.item.status == 'PENDING_USE' || this.item.status == 'PENDING_SHIPMENT') && this.item.isVirtualProduct == '1') {
                    doType = 'VIRTUAL_REFUND_REASON'
                } 
                // 实体商品待发货（实体商品退款）
                else if(this.item.status == 'PENDING_SHIPMENT' && this.item.isVirtualProduct != '0') {
                    doType = 'ENTITY_REFUND_REASON'
                }
                
                // 虚拟商品直接跳转售后页面
                if(this.item.isVirtualProduct == '1') {
                    this.bridgeSdk.jumpPage({
                        url: '/package-intergral-mall/order/orderRefund?orderId=' + this.item.pointsOrderId + '&pointsShopOrderId=' + this.item.pointsShopOrderId + '&doType=' + doType
                    })
                } 
                // 实物商品跳转选择商品页面
                else {
                    this.bridgeSdk.jumpPage({
                        url: '/package-intergral-mall/order/refundCheck?orderId=' + this.item.pointsOrderId + '&pointsShopOrderId=' + this.item.pointsShopOrderId + '&doType=' + doType
                    })
                }
            },
            // 再买一单
            doBuyAgain() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/productDetail/productDetail?spuId=${this.item.pointsOrderItems[0].spuId}&skuId=${this.item.pointsOrderItems[0].skuId}&rebuy=1`,
                })
            },
            // 催发货（仅作提醒用）
            doHurry() {
                this.bridgeSdk.showToast({
                    title: '商家已收到您的催发货申请，将加快处理'
                });
            },
            // 删除订单
            doDelete() {
                this.bridgeSdk.showConfirm({
                    title: "删除订单",
                    content: "确定删除该订单吗？删除后将不再展示该订单",
                    confirmText: '确定',
                    cancelText: '取消',
                    confirmCallback: (res) => {
                        removeOrder({
                            pointsOrderId: this.item.pointsOrderId,
                            pointsShopOrderId: this.item.pointsShopOrderId || '',
                            afterSaleId: this.item.afterSaleId || ''
                        }).then(res=>{
                            this.bridgeSdk.showToast({title: '删除成功'})
                            uni.$emit('getOrderList')
                        })
                    },
                });
            },
            // 申请售后（本地生活暂时没有实物商品流程，暂时不处理）
            doAfterSale() {
                // 实物商品多子单，如果不支持退款提示
                if(this.item.isVirtualProduct != '1' && this.item.pointsOrderItems.every(e => e.isSupportRefund == '0')) {
                    this.bridgeSdk.showToast({
                        title: this.item.pointsOrderItems[0].isSupportRefundDesc
                    })
                    return
                }
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/refundCheck?orderId=${ this.item.pointsOrderId }&pointsShopOrderId=${this.item.pointsShopOrderId}&isAfterSale=1`
                })
            },
            // 跳转售后详情
            goAfterDetail(itm) {
                this.bridgeSdk.jumpPage({
                    url: '/package-intergral-mall/order/afterSaleDetail?afterSalesId=' + itm.afterSalesId
                })
            },
            // 确认收货（本地生活暂时没有实物商品流程，暂时不处理）
            doConfirm() {
                this.bridgeSdk.showConfirm({
                    title: '请确认已收到货物',
                    content: '确认收货后，平台仍保障您的权益',
                    confirmText: '取消',
                    confirmText: '确认收货',
                    confirmCallback: (res) => {
                        pointsMallRecipt({
                            orderId: this.item.pointsShopOrderId,
                            mallScene: 'POINTS_MALL',
                            itemIds: this.item.pointsOrderItems.map(e => e.pointsSubItemId )
                        }).then(res => {
                            this.bridgeSdk.showToast({
                                title: '确认收货成功'
                            })
                            uni.$emit('getOrderList')
                        })
                    }
                });
            },
            // 查看券码
            goCoupon() {
                let obj = this.item.pointsOrderItems[0]
                // 退款中 + 退款完成 + 已使用数量相加 = 子单数量 （无券可看）
                if((this.item.hasUseNum + obj.refundOverSize + obj.refundSize) == obj.quantity) {
                    this.bridgeSdk.showToast({
                        title: "订单所有券均已退款、退款中或已使用"
                    })
                    return
                }
                // 获取订单详情（判断订单实际状态：若为过期已取消、过期退款中、过期退款、过期退款完成状态则为过期状态）
                pointsUserOrderDetail({
                    pointsOrderId: this.item.pointsOrderId,
                    pointsShopOrderId: this.item.pointsShopOrderId || ''
                }).then(res=>{
                    if(['CANCELLED', 'EXPIRED_REFUNDING_PROCESSING', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(res.status)) {
                        this.bridgeSdk.showToast({
                            title: "订单已过期，正在为你处理自动退款"
                        })
                        uni.$emit('getOrderList')
                        return
                    }
                    this.bridgeSdk.jumpPage({
                        url: '/package-intergral-mall/order/getCouponDetail?orderId=' + this.item.pointsOrderId + '&pointsShopOrderId=' + this.item.pointsShopOrderId
                    })
                })
            },
            // 去支付
            doPay() {
                keepPayOrder({
                    pointsOrderId: this.item.pointsOrderId
                }).then(res=>{
                    console.log(res)
                    if(res) {
                        if(!res.payUrl) {
                            this.bridgeSdk.showToast({
                                title: '该订单已自动过期，请重新下单'
                            })
                            return
                        }
                        let encodeUrl = encodeURIComponent(res.payUrl)
                        // #ifdef MP-WEIXIN
                        this.bridgeSdk.jumpPage({
                            url: '/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                        })
                        // #endif
                        // #ifdef H5
                        let _q = res.payUrl.indexOf("?") > -1 ? "&" : "?";
                        location.replace(res.payUrl + _q + '_needH5Head=1&appToken=' + this.bridgeSdk.getStorageSync('appToken'))
                        // #endif
                    } else {
                        this.bridgeSdk.showToast({
                            title: '该订单已自动过期，请重新下单'
                        })
                    }
                })
            },
            // 选择地址
            chooseAddress() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/addressList?pointsOrderId=${this.item.pointsOrderId}&address=${this.item.address}&mobile=${this.item.mobile}&consignee=${this.item.consignee}&district=${this.item.district}`
                })
            },
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
.act {
    &:hover .menu {
        display: block;
    }
    &:focus-within .menu {
        display: none;
    }
}
.order-block {
    width: 630rpx;
    padding: 24rpx 20rpx 16rpx;
    margin: 0 auto 34rpx;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    border-radius: 20rpx;
    background-color: white;
    &_top {
        display: flex;
        align-items: center;
        position: relative;
        .left {
            flex: 1;
            width: 60%;
            display: flex;
            align-items: center;
            font-size: 28rpx;
            color: #222;
            image {
                width: 50rpx;
                height: 50rpx;
                margin-right: 13rpx;

            }
        }
        .right {
            position: absolute;
            top: 50%;
            transform: translateY(-15rpx);
            right: 0;
            text-align: right;
        }
    }
    &_content {
        margin: 16rpx 0 0;
        display: flex;
        align-items: flex-start;
        line-height: 33rpx;
        color: #333;
        font-size: 24rpx;
        image {
            width: 120rpx;
            height: 108rpx;
            border-radius: 12rpx;
            margin-right: 20rpx;
        }
    }
    &_tip {
        margin-top: 25rpx;
        &--block {
            background-color: #FFE7E7;
            color: #FF1A1A;
            font-size: 24rpx;
            line-height: 33rpx;
            border-radius: 8rpx;
            padding: 10rpx 30rpx 10rpx 20rpx;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10rpx;
            flex-wrap: wrap;
        }
    }
    &_bottom {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 26rpx;
        padding-top: 16rpx;
        margin-top: 20rpx;
        border-top: 1rpx solid #D8D8D8;
        &:empty {
            border-top: none;
        }
        .menu {
            min-width: 120rpx;
            background-color: white;
            box-shadow: 0rpx 4rpx 16rpx 4rpx rgba(133,133,133,0.2);
            border-radius: 10rpx;
            padding: 0rpx 30rpx;
            font-size: 26rpx;
            color: #333;
            text-align: center;
            line-height: 60rpx;
            z-index: 5;
            position: absolute;
            display: none;
            left: -5rpx;
            top: 50rpx;
            &::before {
                content: '';
                position: absolute;
                top: -10rpx;
                left: 10rpx;
                border-style: solid;
                border-width: 0 15rpx 15rpx;
                border-color: transparent transparent white;
            }
            view {
                border-bottom: 1rpx solid #d0d0d0;
                &:last-of-type {
                    border-bottom: none;
                }
            }
        }
        .btn {
            padding:13rpx 32rpx;
            border-radius: 33rpx;
            color: white;
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #D8D8D8;
            font-size: 28rpx;
            line-height: 34rpx;
        }
        .btn-normal {
            padding:13rpx 32rpx;
            border-radius: 33rpx;
            color: #666666;
            background-color: white;
            border: 1rpx solid #999;
            font-size: 28rpx;
            line-height: 34rpx;
        }
    }
}
</style>