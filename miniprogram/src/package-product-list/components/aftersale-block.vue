<!--
 * @Description: 售后列表订单组件
 * @Autor: TF
 * @Date: 2025-07-23 14:38:57
 * @LastEditors: TF
 * @LastEditTime: 2025-08-29 14:08:38
-->
<template>
    <view class="refund-block" @click="goDetail">
        <!-- 顶部 -->
        <view class="refund-block_top">
            <view style="display: flex;align-items: center;font-size: 28rpx;" @click.stop="goStore">
                <image :src="staticBaseUrl + '/hbdimage/package-product-list/mct-logo.png'"/>
                <view style="max-width: 80%;" class="text-overflow">
                    {{ info.shopsName }}
                </view>
                <up-icon name="arrow-right" size="12"/>
            </view>
            <view style="text-align: right;color: #999;font-weight: bold;">
                <view>{{ info.serviceTypeName }}</view>
                <view>{{ info.statusName }}</view>
            </view>
        </view>
        <!-- 商品信息 -->
        <view class="refund-block_good" v-for="(item, index) in goodsList" :key="index">
            <image :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
            <view class="refund-block_good--content">
                <view style="font-size: 24rpx;font-weight: bold;" class="text-overflow">{{ item.spuName }}</view>
                <view style="margin-top: 5rpx;font-size: 20rpx;color: #999;" v-if="item.useDesc">{{ item.useDesc }}</view>
                <view style="margin-top: 5rpx;font-size: 20rpx;color: #999;" v-else>{{ item.skuName }}</view>
                <view style="display: flex;justify-content: space-between;margin-top: 15rpx;font-size: 24rpx;">
                    <view>申请数量：{{ item.applyNum }}</view>
                    <view style="display: flex;align-items: center;justify-content: flex-end;flex-wrap: wrap;">
                        <view>原实付：</view>
                        <view>¥ {{ multiply(item.originalPrice, item.applyNum) }}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 售后信息展示 -->
        <view class="refund-block_info" :style="{background: bgColor,color: statusColor}">
            <!-- 退款完成 -->
            <up-icon v-if="[
                'REFUND_SUCCESS',
                'RETURN_SUCCESS',
                'EXPIRED_REFUNDED_SUCCESS',
                'EXPIRE_REFUND_SUCCESS',
                'EXPIRED_REFUND',
                'RETURN_PENDING_SUCCESS'
            ].includes(info.status)" name="checkmark-circle" color="#01BFB8" size="12"/>
            <!-- 退款失败 -->
            <up-icon v-else-if="info.status == 'MERCHANT_REFUSED'" name="close-circle" color="#FF1A1A" size="12"/>
            <!-- 审核中、退款中、过期退款中 -->
            <up-icon v-else name="clock" color="#FF1A1A" size="12"/>

            <view style="margin-left: 10rpx;margin-right: 10rpx;">
                {{ info.statusName }}
            </view>
            <!-- serviceStatus: 00初始申请 01 待买家退货 02 待商家收货 03 待商家发货 04 待买家确认收货 05 退款中 06 已完成 07已关闭-->
            <!-- checkStatus: 00待审核 01 审核中 02 已驳回 03 通过-->
            
            <!-- 流程中状态 -->
            <view v-if="[
                'REFUND_REVIEWING',
                'AFTER_SALE_PROCESSING',
                'RETURN_REVIEWING',
                'RETURN_REFUND_PROCESSING',
                'EXPIRED_REFUNDING_PROCESSING',
                'REFUND_PROCESSING',
                'PART_REFUND_PROCESSING',
                'AFTER_SALE_PROCESSING',
                'RETURN_REVIEWING',
                'RETURN_PROCESING',
                'PART_RETURN_PROCESING',
                'EXPIRE_REFUND_PROCESSING',
                'RETURN_PENDING_RETURN_SHIPMENT',
                'RETURN_PENDING_SELLER_RECEIPT',
                'RETURN_PENDING_CHECKING',
                'RETURN_PENDING_REFUNDING'
            ].includes(info.status)" class="text-overflow">
                预计退款
                <text>¥ {{ info.refundAmount }}</text>
            </view>
            <!-- 售后最终状态 -->
            <view v-else-if="[
                'REFUND_SUCCESS',
                'RETURN_SUCCESS',
                'EXPIRED_REFUNDED_SUCCESS',
                'EXPIRE_REFUND_SUCCESS',
                'EXPIRED_REFUND',
                'RETURN_PENDING_SUCCESS'
            ].includes(info.status)" class="text-overflow">
                原路退款
                <text>¥ {{ info.refundAmount }}</text>
            </view>
            <!-- 商家拒绝售后 -->
            <view v-else-if="info.status == 'MERCHANT_REFUSED'">
                您的申请未通过，点击查看原因
            </view>
            <up-icon name="arrow-right" :color="statusColor" size="12" style="position: absolute;top: 50%;right: 12rpx;transform: translateY(-50%);"/>
        </view>
        
        <view class="refund-block_bottom" style="position: relative;">
            <!-- 最终售后状态可删除订单 -->
            <view v-if="[
                'REFUND_SUCCESS',
                'RETURN_SUCCESS',
                'EXPIRED_REFUNDED_SUCCESS',
                'EXPIRE_REFUND_SUCCESS',
                'EXPIRED_REFUND',
                'RETURN_PENDING_SUCCESS'
            ].includes(info.status)" class="btn-normal" @click.stop="doDelete">删除订单</view>
            <!-- 审核中的状态不可再次购买 -->
            <view class="btn" @click.stop="doBuyAgain">再买一单</view>
        </view>
    </view>
</template>

<script>
    import { multiply } from '@/utils/decimal'
    import { 
        removeOrder,// 删除订单
    } from '../api/index'
    export default {
        name: 'afterSale-block',
        data() {
            return {
                multiply,

                colorMap: {
                    'EXPIRED_REFUNDING_PROCESSING': '#FF1A1A',// 过期退款中
                    'RETURN_REVIEWING': '#FF1A1A',
                    'RETURN_PROCESING': '#FF1A1A',
                    'REFUND_REVIEWING': '#FF1A1A',
                    'REFUND_PROCESSING': '#FF1A1A',
                    'PART_REFUND_PROCESSING': '#FF1A1A',
                    'PART_RETURN_PROCESING': '#FF1A1A',
                    'EXPIRE_REFUND_PROCESSING': '#FF1A1A',
                    'RETURN_PENDING_RETURN_SHIPMENT': '#FF1A1A',
                    'RETURN_PENDING_SELLER_RECEIPT': '#FF1A1A',
                    'RETURN_PENDING_CHECKING': '#FF1A1A',
                    'RETURN_PENDING_REFUNDING': '#FF1A1A',
                    'AFTER_SALE_PROCESSING': '#FF1A1A',
                    'MERCHANT_REFUSED': '#FF1A1A',

                    'REFUND_SUCCESS': '#00BCB8',
                    'RETURN_SUCCESS': '#00BCB8',
                    'EXPIRED_REFUNDED_SUCCESS': '#00BCB8',
                    'RETURN_PENDING_SUCCESS': '#00BCB8',
                    'EXPIRE_REFUND_SUCCESS': '#00BCB8',
                    'EXPIRED_REFUNDED_SUCCESS': '#00BCB8',
                    'EXPIRED_REFUND': '#00BCB8',
                },
            }
        },
        props: {
            info: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        computed: {
            // 商品信息列表
            goodsList() {
                return this.info.afterSaleResqBos ? this.info.afterSaleResqBos.map(e=>({
                    ...e,
                    attr: e.attributes ? JSON.parse(e.attributes) : {}
                })) : []
            },
            statusColor() {
                return this.colorMap[this.info.status]
            },
            bgColor() {
                if(this.info.checkStatus == '01' || this.info.serviceStatus == '05' || this.info.checkStatus == '02') {
                    return '#FFE7E7'
                }
                else if(this.info.serviceStatus == '06') {
                    return '#C6FFF6'
                }
                return '#FFE7E7'
            }
        },
        methods: {
            // 售后详情
            goDetail() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/orderDetail/afterSaleDetail?afterSalesId=` + this.info.afterSalesId,
                })
            },
            // 跳转门店
            goStore() {
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/merchantDetail/merchantDetailCoupon?storeId=' + this.info.shopsId + '&mctId=' + this.info.mctId
                })
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
                            afterSaleId: this.info.afterSalesId
                        }).then(res=>{
                            this.bridgeSdk.showToast({title: '删除成功'})
                            uni.$emit('getOrderList')
                        })
                    },
                });
            },
            // 再次购买
            doBuyAgain() {
                let couponInfo = this.goodsList[0].attr
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/productDetail/productDetailCoupon?mctId=${this.info.mctId}&storeId=${this.info.shopsId}&spuId=${this.info.afterSaleResqBos[0].spuId}&skuId=${this.info.afterSaleResqBos[0].skuId}&virtualProductType=${couponInfo.couponBaseType}&rebuy=1`,
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
.refund-block {
    width: 630rpx;
    padding: 24rpx 20rpx 16rpx;
    margin: 0 auto 24rpx;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    border-radius: 20rpx;
    background-color: white;
    &_top {
        display: flex;
        align-items: flex-start;
        line-height: 36rpx;
        font-size: 24rpx;
        justify-content: space-between;
        image {
            width: 50rpx;
            height: 50rpx;
            margin-right: 13rpx;
        }
    }
    &_good {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10rpx;
        image {
            width: 120rpx;
            height: 108rpx;
            border-radius: 12rpx;
        }
        &--content {
            flex: 1;
            width: 50%;
            margin-left: 20rpx;
            font-size: 24rpx;
        }
    }
    &_info {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        line-height: 46rpx;
        border-radius: 8rpx;
        // font-weight: bold;
        padding: 10rpx;
        margin-top: 20rpx;
        position: relative;
    }
    &_bottom {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 26rpx;
        padding-top: 16rpx;
        border-top: 1rpx solid #D8D8D8;
        margin-top: 20rpx;
        &:empty {
            border-top: none;
        }
        .menu {
            min-width: 120rpx;
            background-color: white;
            box-shadow: 0 2rpx 1rpx 1rpx rgba(0, 0, 0, 0.1),
                        2rpx 0 1rpx 1rpx rgba(0, 0, 0, 0.1);
            border-radius: 10rpx;
            padding: 0rpx 30rpx;
            font-size: 26rpx;
            color: #333;
            text-align: center;
            line-height: 60rpx;
            z-index: 5;
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