<!--
 * @Description: 订单组件（订单列表）
 * @Autor: TF
 * @Date: 2025-07-02 15:06:37
 * @LastEditors: TF
 * @LastEditTime: 2025-08-30 11:52:07
-->
<template>
    <view class="order-block">
        <view class="order-block_top">
            <view class="left" @click.stop="goStore">
                <image :src="staticBaseUrl + '/hbdimage/package-product-list/mct-logo.png'"/>
                <view style="max-width: 60%;" class="text-overflow">
                    {{ item.shopsName }}
                </view>
                <up-icon name="arrow-right" size="12" v-if="item.virtualProductSource?.toLowerCase() == 'cop'"/>
            </view>
            <!-- 订单状态 -->
            <view class="right" :style="{color: item.statusColor, fontSize: '24rpx', fontWeight: 'bold'}">
                <view>{{ item.statusName }}</view>
            </view>
        </view>
        <!-- 商品信息 -->
        <view class="order-block_content" v-for="(itm, idx) in item.subOrderList" :key="idx" @click="goDetail">
            <image :src="minioBaseUrl + itm.listPicUrl" mode="aspectFill"/>
            <view style="flex: 1;width: 60%;">
                <view style="font-weight: bold;font-size: 24rpx;line-height: 33rpx;">{{ itm.spuName }}</view>
                <view v-if="item.isVirtualProduct == '1'" style="font-size: 20rpx;color: #999;margin-top: 4rpx;">{{ itm.useDesc }}</view>
                <view style="display: flex;align-items: flex-start;justify-content: space-between;flex-wrap: wrap;">
                    <view style="margin-top: 12rpx;white-space: nowrap;">
                        共 {{ itm.number }} 件 | 需付款 ¥{{ itm.subPayAmt }}
                    </view>
                    <view style="text-align: right;margin-top: 5rpx;margin-top: 12rpx;margin-left: auto;">
                        <view v-if="!['CANCELLED', 'PENDING_PAYMENT'].includes(item.status)" style="color: #FB1839;font-size: 24rpx;line-height: 33rpx;">
                            <text style="margin-right: 10rpx;white-space: nowrap;">实付</text> 
                            <text style="white-space: nowrap;">¥{{ itm.subPayAmt }}</text>
                        </view>
                        <view v-else-if="item.status == 'PENDING_PAYMENT'" style="color: #FB1839;font-size: 24rpx;line-height: 33rpx;">
                            <text style="margin-right: 10rpx;white-space: nowrap;">待付款</text> 
                            <text style="white-space: nowrap;">¥{{ itm.subPayAmt }}</text>
                        </view>
                        <!-- 无退款中并且有退款完成 -->
                        <view v-if="refundOverSize > 0" style="font-size: 18rpx;color: #999;line-height: 30rpx;margin-top: 4rpx;">
                            <view style="display: flex;align-items: flex-start;justify-content: flex-end;font-size: 20rpx;">
                                <view style="margin-right: 10rpx;">已退款</view>
                                <view>¥{{ _refundOverAmt }}</view>
                            </view> 
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 售后信息提示区(存在部分退款或退款情况) -->
        <view class="order-block_tip" v-if="hasRefund || hasRefundOver">
            <view class="order-block_tip--block" 
                :style="{backgroundColor: refundSize > 0 ? '#FFE7E7' : '#C6FFF6', color: refundSize > 0 ? '#FF1A1A' : '#01BFB8'}"  
                @click.stop="goAfterDetail">
                <!-- 有退款中并且退款中子订单数量等于子订单数量 -->
                <template v-if="hasRefund && refundSize == item.subSize">
                    <up-icon name="clock" color="#FF1A1A" size="12"/>
                    <text>退款中 {{ refundSize }}件</text>
                    预计退款
                    <text>¥{{ _refundAmt }}</text>
                </template>
                <!-- 有退款中并且退款中子订单数量小于子订单数量 -->
                <template v-else-if="hasRefund && refundSize < item.subSize">
                    <up-icon name="clock" color="#FF1A1A" size="12"/>
                    <text>退款中 {{ refundSize }}件</text>
                    预计退款
                    <text>¥{{ _refundAmt }}</text>
                </template>
                <!-- 有退款中并且退款中子订单数量小于子订单数量 -->
                <template v-else-if="refundOverSize < item.subSize">
                    <up-icon name="checkmark-circle" color="#01BFB8" size="12"/>
                    <text>退款完成 {{ refundOverSize }}件</text>
                    原路退款
                    <text>¥{{ _refundOverAmt }}</text>
                </template>
                <!-- 有退款中并且退款中子订单数量小于子订单数量 -->
                <template v-else-if="refundOverSize == item.subSize">
                    <up-icon name="checkmark-circle" color="#01BFB8" size="12"/>
                    <text>退款完成 {{ refundOverSize }}件</text>
                    原路退款
                    <text>¥{{ _refundOverAmt }}</text>
                </template>
                    
                <up-icon style="position: absolute;right: 20rpx;top: 50%;transform: translateY(-50%);" name="arrow-right" :color="refundSize > 0 ? '#FF1A1A' : '#01BFB8'" size="12"/>
            </view>
        </view>
        <!-- 底部操作按钮区 -->
        <view class="order-block_bottom" style="position: relative;">
            <!-- 非本地生活(文旅一卡通) -->
            <template v-if="item.virtualProductSource && item.virtualProductSource?.toLowerCase() != 'cop'">
                <view v-if="item.status == 'PENDING_PAYMENT'" class="btn" @click.stop="doPay">
                    ¥{{ payAmt }}<text style="margin-left: 5rpx;">去支付</text>
                </view>
            </template>
            <!-- 本地生活（虚拟、实体）-->
            <template v-else>
                <!-- 左侧扩展按钮（退款、申请售后、删除订单） -->
                <template  v-if="[
                    'PENDING_RECEIPT_USE',
                    'PENDING_USE',
                    'PENDING_SHIPMENT',
                    'PENDING_RECEIPT',
                    'COMPLETED',
                    'REFUND_SUCCESS',
                    'EXPIRED_REFUNDED_SUCCESS',
                    'RETURN_PENDING_SUCCESS'
                ].includes(item.status) && refundOverSize != item.subSize">
                    <view style="position: absolute;left: 10rpx;bottom: 10rpx;" class="act">
                        <up-icon name="more-circle" size="22" color="gray"/>
                        <view class="menu">
                            <view v-if="['PENDING_RECEIPT_USE', 'PENDING_USE', 'PENDING_SHIPMENT'].includes(item.status) && refundOverSize != item.subSize" @click.stop="doRefund">退款</view>
                            <!-- 实物商品（交易成功、待收货可以售后） -->
                            <view v-if="(item.status == 'COMPLETED' || item.status == 'PENDING_RECEIPT') && item.isVirtualProduct == '0'  && refundOverSize != item.subSize" @click.stop="doAfterSale">申请售后</view>
                            <view v-if="['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'RETURN_PENDING_SUCCESS', 'COMPLETED'].includes(item.status)" @click.stop="doDelete">删除订单</view>
                        </view>
                    </view>
                </template>
                <!-- 待付款 -->
                <template v-if="item.status == 'PENDING_PAYMENT'">
                    <view v-if="item.isVirtualProduct == '0'" class="btn-normal" @click.stop="editAddress">修改地址</view>
                    <view class="btn-normal" @click.stop="doCancel">取消订单</view>
                    <view class="btn" @click.stop="doPay">
                        ¥{{ payAmt }}<text style="margin-left: 5rpx;">去支付</text>
                    </view>
                </template>
                <!-- 待使用 -->
                <template v-if="item.status == 'PENDING_RECEIPT_USE' || item.status == 'PENDING_USE'">
                    <view class="btn-normal" @click.stop="doBuyAgain">再买一单</view>
                    <view v-if="item.virtualProductSource?.toLowerCase() == 'cop' && refundOverSize != item.subSize" class="btn" @click.stop="goCoupon">查看券码</view>
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
        removeStoreOrder,// 删除订单
        usermOrderDetailsNew,// 详情(校验实时订单状态（券状态）)
    } from '../api/index'
    import { plus, multiply } from '@/utils/decimal'
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
                return this.item.isVirtualProduct == '1' && this.item.virtualProductSource?.toLowerCase() == 'cop' && this.bridgeSdk.checkIsEmpty(this.item.subOrderList[0].attributes) ? JSON.parse(this.item.subOrderList[0].attributes) : {}
            },
            // 支付价格
            payAmt() {
                return this.item.subOrderList.map(e => e.subPayAmt).reduce((sum, current) => plus(sum, current), 0)
            },
            // 售后中的数据
            nowAfterSaleId() {
                return this.item.subList.find(e => ['REFUND_REVIEWING', 'REFUND_PROCESSING', 'EXPIRED_REFUNDING_PROCESSING'].includes(e.status))?.afterSalesId || this.item.subList.find(e => ['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(e.status))?.afterSalesId
            },
            // 是否存在售后中数据
            hasRefund() {
                return this.item.subList.some(e => ['REFUND_REVIEWING', 'REFUND_PROCESSING', 'EXPIRED_REFUNDING_PROCESSING'].includes(e.status))
            },
            // 进行中售后单数
            refundSize() {
                return this.item.subList.filter(e => ['REFUND_REVIEWING', 'REFUND_PROCESSING', 'EXPIRED_REFUNDING_PROCESSING'].includes(e.status)).length
            },
            // 售后完成数
            refundOverSize() {
                return this.item.subList.filter(e => ['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(e.status)).length
            },
            // 全部售后完成
            allRefundOver() {
                return this.item.subList.every(e => ['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(e.status))
            },
            // 是否有售后完成
            hasRefundOver() {
                return this.item.subList.some(e => ['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(e.status))
            },
            // 已使用数量
            hasUseNum() {
                return this.item.subList.filter(e => e.virtualProductIsWhetherUse == '1').length
            },
            // 售后中金额
            _refundAmt() {
                return this.item.subList.filter( e => ['REFUND_REVIEWING', 'REFUND_PROCESSING',  'EXPIRED_REFUNDING_PROCESSING'].includes(e.status) ).reduce((a, b) => plus(a, multiply(b.subPayAmt, b.number)), 0)
            },
            // 售后完成金额
            _refundOverAmt() {
                return this.item.subList.filter( e => ['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(e.status) ).reduce((a, b) => plus(a, multiply(b.subPayAmt, b.number)), 0)
            },
        },
        methods: {
            // 跳转门店
            goStore() {
                if(this.item.isVirtualProduct == '1' && this.item.virtualProductSource?.toLowerCase() != 'cop') return;
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/merchantDetail/merchantDetailCoupon?storeId=' + this.item.subOrderList[0].shopsId + '&mctId=' + this.item.subOrderList[0].mctId
                })
            },
            // 跳转详情
            goDetail() {
                // 文旅一卡通
                if(this.item.isVirtualProduct == '1' && this.item.virtualProductSource?.toLowerCase() == 'hbb') {
                    this.bridgeSdk.jumpPage({
                        url: '/package-one-card/pages/orderDetailNew?orderId=' + this.item.orderId
                    })
                    return;
                }
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/orderDetailNew?orderId=' + this.item.orderId
                })
            },
            // 取消订单
            doCancel() {
                // emit方法触发shopListNew页面的取消按钮，取消操作在shopListNew页面完成
                uni.$emit('orderCancel', this.item.orderId)
            },
            // 退款
            // 1、一笔多个商品订单，仅允许同一时间有一个售后处理的申请进行，只有售后处理中的订单处理完成后才能对剩下的商品进行售后操作。
            // 也就是说：若已有发起退款/售后处理中的商品，则“退款”按钮点击后toast提示“您有一笔退款正在处理中，请完成后重新操作”。
            doRefund() {
                // 若存在退款中的订单
                if(this.hasRefund) {  
                    this.bridgeSdk.showToast({
                        title: "您有一笔退款正在处理中，请完成后重新操作"
                    })
                    return
                }
                let doType;
                 // 虚拟商品待发货/待使用（虚拟商品退款）
                if((this.item.status == 'PENDING_RECEIPT_USE' || this.item.status == 'PENDING_USE' || this.item.status == 'PENDING_SHIPMENT') && this.item.isVirtualProduct == '1') {
                    doType = 'VIRTUAL_REFUND_REASON'
                } 
                // 虚拟商品待收货（虚拟商品退货退款）
                else if(this.item.status == 'PENDING_RECEIPT' && this.item.isVirtualProduct == '1') {
                    doType = 'VIRTUAL_RETURNED_REASON'
                }
                // 实体商品待发货（实体商品退款）
                else if(this.item.status == 'PENDING_SHIPMENT' && this.item.isVirtualProduct == '0') {
                    doType = 'ENTITY_REFUND_REASON'
                }
                // 实体商品待收货（实体商品退货退款）
                else if(this.item.status == 'PENDING_RECEIPT' && this.item.isVirtualProduct == '0') {
                    doType = 'ENTITY_RETURNED_REASON'
                } 
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/orderRefund?orderId=' + this.item.orderId + '&doType=' + doType
                })
            },
            // 再买一单
            doBuyAgain() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/productDetail/productDetailCoupon?mctId=${this.item.subOrderList[0].mctId}&storeId=${this.item.subOrderList[0].shopsId}&spuId=${this.item.subOrderList[0].spuId}&skuId=${this.item.subOrderList[0].skuId}&virtualProductType=${this.couponInfo.couponBaseType}&rebuy=1`,
                })
            },
            // 修改地址（本地生活暂时没有实物商品流程，暂时不处理）
            editAddress() {
                
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
                        removeStoreOrder({
                            orderId: this.item.orderId
                        }).then(res=>{
                            this.bridgeSdk.showToast({title: '删除成功'})
                            uni.$emit('getOrderList')
                        })
                    },
                });
            },
            // 申请售后（本地生活暂时没有实物商品流程，暂时不处理）
            doAfterSale() {
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/refundCheck?orderId=' + this.item.orderId
                })
            },
            // 跳转售后详情
            goAfterDetail() {
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/afterSaleDetail?afterSalesId=' + this.nowAfterSaleId
                })
            },
            // 确认收货（本地生活暂时没有实物商品流程，暂时不处理）
            doConfirm() {
                this.bridgeSdk.showConfirm({
                    title: '请确认已收到货物',
                    content: '确认收货后，平台仍将保障您的权益',
                    confirmText: '取消',
                    confirmText: '确认收货',
                    confirmCallback: (res) => {
                        uni.$emit('getOrderList')
                    }
                });
            },
            // 查看券码
            goCoupon() {
                // 退款中 + 退款完成 + 已使用数量相加 = 子单数量 （无券可看）
                if((this.hasUseNum + this.refundOverSize + this.refundSize) == this.item.subSize) {
                    this.bridgeSdk.showToast({
                        title: "订单所有券均已退款、退款中或已使用"
                    })
                    return
                }
                // 获取订单详情（判断订单实际状态：若为过期已取消、过期退款中、过期退款、过期退款完成状态则为过期状态）
                usermOrderDetailsNew({
                    orderId: this.item.orderId
                }).then(res=>{
                    if(['CANCELLED', 'EXPIRED_REFUNDING_PROCESSING', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(res.status)) {
                        this.bridgeSdk.showToast({
                            title: "订单已过期，正在为你处理自动退款"
                        })
                        uni.$emit('getOrderList')
                        return
                    }
                    this.bridgeSdk.jumpPage({
                        url: '/package-product-list/orderDetail/getCouponDetail?orderId=' + this.item.orderId
                    })
                })
            },
            doRate() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/ratePage/doRatePage?orderNo=${ this.item.orderId }&spuName=${ this.item.subOrderList[0].spuName }`
                })
            },
            // 去支付
            doPay() {
                keepPayOrder({
                    orderId: this.item.orderNo
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
            padding: 10rpx 0;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10rpx;
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