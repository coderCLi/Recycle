<!--
 * @Description: 售后单详情
 * @Autor: TF
 * @Date: 2025-07-23 14:12:44
 * @LastEditors: TF
 * @LastEditTime: 2025-09-05 13:54:47
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container">
        <!-- 顶部步骤区 -->
        <view class="top">
            <view class="top-second" style="display: block;">
                <view :style="{color: statusColor}" style="font-weight: bold;padding: 0 0 20rpx 0;border-bottom: 1rpx solid #d0d0d0;">
                    <text v-if="afterSaleInfo.checkStatus == '03' && afterSaleInfo.serviceStatus != '06'" style="margin-right: 10rpx;">商家同意退款</text>{{ afterSaleInfo.statusName }}
                </view>
                <view style="display: flex;align-items: center;justify-content: space-between;color: #333;margin-top: 20rpx;margin-bottom: 10rpx;" @click="goFlow">
                    <view style="font-weight: bold;display: flex;flex-wrap: wrap;justify-content: flex-start;">
                        <view>退款金额：</view>
                        <view v-if="afterSaleInfo.refundAmount > 0">¥ {{ afterSaleInfo.refundAmount }}</view>
                        <view style="margin: 0 5rpx;" v-if="afterSaleInfo.refundAmount > 0 && afterSaleInfo.pointsRefund > 0">+</view>
                        <view v-if="afterSaleInfo.pointsRefund > 0">{{ afterSaleInfo.pointsRefund }} 会员分</view>
                    </view>
                    <view style="display: flex;justify-content: flex-end;">
                        协商记录
                        <up-icon name="arrow-right" size="12"/>
                    </view>
                </view>
            </view>
            <!-- 审核中 -->
            <view v-if="afterSaleInfo.checkStatus == '01'" style="margin: 10rpx 0;line-height: 44rpx;">
                <view style="font-size: 24rpx;font-weight: bold;color: #00BCB8;">您的退款申请已提交</view>
                <view style="font-size: 24rpx;color: #999;">等待商家确认您的退款申请~</view>
            </view>
            <!-- 已驳回 -->
            <view v-else-if="afterSaleInfo.checkStatus == '02'" style="margin: 10rpx 0;line-height: 44rpx;">
                <view style="font-size: 24rpx;font-weight: bold;color: #FF1A1A;">商家拒绝了您的退款申请</view>
                <view style="font-size: 24rpx;color: #999;">备注：{{ afterSaleInfo.refuseDescription }}</view>
            </view>
            <!-- 正常进度 -->
            <template v-else>
                <up-steps :current="currentStep" activeColor="#00BCB8">
                    <up-steps-item v-for="(item, index) in steps" :error="item.error" :itemStyle="{textAlign: 'center'}" :key="index" :title="item.title">
                        <template v-if="item.desc" #desc>
                            <view style="font-size: 18rpx;color: #999;text-align: center;">
                                {{ item.desc }}
                            </view>
                        </template>
                    </up-steps-item>
                </up-steps>
            </template>

            <!-- 黄色说明区域 -->
            <view class="top-tip" v-if="['REFUND_PROCESSING', 'PART_REFUND_PROCESSING', 'RETURN_PENDING_REFUNDING'].includes(afterSaleInfo.status)">
                您的退款正在退回中，请注意查收
            </view>
            <view class="top-tip" v-else-if="['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND', 'RETURN_PENDING_SUCCESS'].includes(afterSaleInfo.status)">
                付款单号：{{ afterSaleInfo.pointsShopOrderId }} 
                <image :src="staticBaseUrl + '/hbdimage/examination/fuzhi1.png'" @click="doCopy(afterSaleInfo.pointsShopOrderId)"/>
            </view>
        </view>
        <!-- 商品信息 -->
        <view class="good">
            <view class="good-title">退款商品</view>
            <view class="good-info" v-for="(item, index) in goodsList" :key="index">
                <view class="good-info_top">
                    <image :src="minioBaseUrl + item.listPicUrl" mode="scaleToFill"/>
                    <view class="good-info_top--content">
                        <view style="font-size: 26rpx;font-weight: bold;" class="text-overflow">{{ item.spuName }}</view>

                        <view v-if="bridgeSdk.checkIsEmpty(item.useDesc)" style="margin-top: 5rpx;font-size: 22rpx;color: #999;">{{ item.useDesc }}</view>
                        <view v-else style="margin-top: 5rpx;font-size: 22rpx;color: #999;">{{ item.skuName }}</view>

                        <view style="display: flex;justify-content: space-between;margin-top: 15rpx;">
                            <view>申请数量：{{ item.applyNum }}</view>
                            <view style="display: flex;justify-content: flex-end;flex-wrap: wrap;">
                                <view>原实付：</view>
                                <view>¥ {{ item.originalPrice }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-if="item.virtualList" class="good-info_bottom">
                    <view v-for="(itm, idx) in item.virtualList" :key="idx" style="line-height: 44rpx;">
                        退款券码：{{ itm.virtualId }}
                        <text style="color: rgb(0, 188, 184);margin-left: 10rpx;" @click="doCopy(itm.virtualId)">复制</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- 售后说明 -->
        <view class="reason">
            <view class="reason-item" v-if="afterSaleInfo.refundAmount > 0">
                <view>退款金额</view>
                <view style="color: red;">¥ {{ afterSaleInfo.refundAmount }}</view>
            </view>
            <view class="reason-item">
                <view>退款原因</view>
                <view class="text-overflow" style="flex: 1;margin-left: 50rpx;width: 40%;">{{ afterSaleInfo.reason }}</view>
            </view>
            <view class="reason-item" style="display: block;">
                <view>退款说明</view>
                <view style="color: #999;margin-top: 10rpx;text-align: left;width: 100%">{{ afterSaleInfo.description }}</view>
            </view>
            <view class="reason-item" style="justify-content: flex-start;" v-if="afterSaleInfo.imageShowUrls && afterSaleInfo.imageShowUrls.length > 0">
                <image @click="previewImg(index)" v-for="(item, index) in afterSaleInfo.imageShowUrls" :key="index" :src="minioBaseUrl + item" mode="scaleToFill"/>
            </view>
        </view>
        <!-- 订单信息 -->
        <view class="order">
            <view class="order-title">订单信息</view>
            <view style="display: flex;flex-direction: column;gap: 15rpx;">
                <view class="order-item">
                    <view>售后单号：</view>
                    <view style="display: flex;align-items: center;">
                        {{ afterSaleInfo.afterSalesApplyId }}
                        <image style="width: 20rpx;height: 20rpx;margin-left: 5rpx;" @click="doCopy(afterSaleInfo.afterSalesApplyId)" :src="staticBaseUrl + '/hbdimage/examination/fuzhi1.png'"/>
                    </view>
                </view>
                <view class="order-item">
                    <view>原订单号：</view>
                    <view>
                        {{ afterSaleInfo.pointsOrderId }}
                        <image style="width: 20rpx;height: 20rpx;margin-left: 5rpx;" @click="doCopy(afterSaleInfo.pointsOrderId)" :src="staticBaseUrl + '/hbdimage/examination/fuzhi1.png'"/>
                    </view>
                </view>
                <view class="order-item">
                    <view>申请时间：</view>
                    <view>{{ afterSaleInfo.applyTime }}</view>
                </view>
                <view class="order-item" v-if="afterSaleInfo.finishTime">
                    <view>退款时间：</view>
                    <view>{{ afterSaleInfo.finishTime }}</view>
                </view>
            </view>
        </view>


        <view v-if="afterSaleInfo.status == 'RETURN_PENDING_RETURN_SHIPMENT'" class="return-btn" @click="doReturn">退货</view>
        <view v-else-if="afterSaleInfo.status == 'MERCHANT_REFUSED'" class="return-btn" @click="doAppreal">申诉</view>
    </vc-container>

    <!-- 退货弹窗 -->
    <up-popup :show="returnShow" mode="center" :safeAreaInsetBottom="false" round="20rpx" @close="returnShow = false">
        <view class="popup">
            <view class="popup-title">退货快递</view>
            <view class="popup-content">
                <view>快递单号</view>
                <input placeholder="请输入快递单号" v-model="returnExpress" maxlength="20"/>
            </view>
                
            <view class="popup-btn" @click="doSubmitReturn">
                确认
            </view>
        </view>
    </up-popup>

    <!-- 退货弹窗 -->
    <up-popup :show="apprealShow" mode="center" :safeAreaInsetBottom="false" round="20rpx" @close="apprealShow = false">
        <view class="popup" style="width: calc(600rpx - 80rpx);">
            <view class="popup-title" style="font-size: 28rpx;">发起申诉</view>
            <view class="popup-content" style="align-items: flex-start;">
                <view style="margin-right: 20rpx;margin-top: 15rpx;">申诉说明</view>
                <up-textarea placeholderStyle="font-size: 24rpx" count placeholder="请输入申诉说明" v-model="description" maxlength="100"/>
            </view>
                
            <view class="popup-btn" @click="doSubmitAppreal">
                确认
            </view>
        </view>
    </up-popup>
</template>

<script>
    import {
        afterSaleDetail,// 售后单详情
        updateAfterState,// 退货信息
    } from '../api/index'
    import { useMctStore } from '@/store/index'
    import { plus } from '@/utils/decimal'
    const STEPS = [
        {
            title: '同意退款'
        },
        {
            title: '处理中'
        },
        {
            title: '到账成功'
        }
    ]
    export default {
        name: 'afterSaleDetail',
        data() {
            return {
                isAgree: false,// 商家同意退款
                orderInfo: {},// 订单信息
                afterSalesId: '',// 售后单ID
                afterSaleInfo: {},// 售后信息
                goodsList: [],// 商品列表
                currentStep: -1,// 当前步骤
                steps: JSON.parse(JSON.stringify(STEPS)),
                returnShow: false,// 退货弹窗
                returnExpress: '',// 退货单号

                apprealShow: false,// 申诉弹窗
                description: '',// 申诉说明

                colorMap: {
                    'EXPIRED_REFUNDING_PROCESSING': '#FF1A1A',// 过期退款中
                    'RETURN_REVIEWING': '#FF1A1A',
                    'RETURN_PROCESING': '#FF1A1A',
                    'REFUND_REVIEWING': '#FF1A1A',
                    'REFUND_PROCESSING': '#FF1A1A',
                    'PART_REFUND_PROCESSING': '#FF1A1A',
                    'PART_RETURN_PROCESING': '#FF1A1A',
                    'RETURN_PENDING_RETURN_SHIPMENT': '#FF1A1A',
                    'RETURN_PENDING_SELLER_RECEIPT': '#FF1A1A',
                    'RETURN_PENDING_CHECKING': '#FF1A1A',
                    'RETURN_PENDING_REFUNDING': '#FF1A1A',
                    'AFTER_SALE_PROCESSING': '#FF1A1A',
                    'EXPIRE_REFUND_PROCESSING': '#FF1A1A',
                    'MERCHANT_REFUSED': '#FF1A1A',

                    'REFUND_SUCCESS': '#00BCB8',
                    'RETURN_PENDING_SUCCESS': '#00BCB8',
                    'EXPIRED_REFUNDED_SUCCESS': '#00BCB8',
                    'EXPIRE_REFUND_SUCCESS': '#00BCB8',
                    'EXPIRED_REFUND': '#00BCB8',
                },
            }
        },
        computed: {
            statusColor() {
                return this.colorMap[this.afterSaleInfo.status]
            },
            // 是否还可申诉
            canAppreal() {
                return this.afterSaleInfo.afterSaleFlowsResqBos.filter(e => e.nodeType == 'REFUSE').length < 2
            }
        },
        onLoad(options) {
            this.afterSalesId = options.afterSalesId
            this.getAfterSaleDetail()
        },
        onPullDownRefresh() {
            this.getAfterSaleDetail()
            setTimeout(() => {
                //结束下拉刷新
                uni.stopPullDownRefresh();
            }, 500);
        },
        methods: {
            // 售后单详情
            getAfterSaleDetail() {
                afterSaleDetail({
                    afterSalesId: this.afterSalesId
                }).then(res=>{
                    this.steps = JSON.parse(JSON.stringify(STEPS))
                    this.afterSaleInfo = {...res}
                    if(this.afterSaleInfo.isVirtualProduct == '1') {
                        let obj = res.afterSaleResqBos ? res.afterSaleResqBos[0] : {}
                        this.goodsList = obj ? [{
                            ...obj,
                            applyNum: res.afterSaleResqBos.map(e => e.applyNum).reduce((sum, current) => plus(sum, current), 0),
                            originalPrice: res.afterSaleResqBos.map(e => e.originalPrice).reduce((sum, current) => plus(sum, current), 0),
                            attr: obj.attributes ? JSON.parse(obj.attributes) : {},
                            virtualList: res.afterSaleResqBos.map(e => ({
                                virtualId: e.virtualId
                            }))
                        }] : []
                    } else {
                        this.goodsList = res.afterSaleResqBos ? [...res.afterSaleResqBos].map(e=>({
                            ...e,
                            attr: e.attributes ? JSON.parse(e.attributes) : {}
                        })) : []
                    }
                    // 审核中未进行到step中
                    if(this.afterSaleInfo.checkStatus == '01') {
                        this.currentStep = -1
                    } 
                    // 驳回
                    else if(this.afterSaleInfo.checkStatus == '02') {
                        this.currentStep = 0
                        this.steps[0] = {
                            title: '申请驳回',
                            desc: '驳回原因：' + this.afterSaleInfo.refuseDescription,
                            error: true,
                            icon: 'close-circle'
                        }
                    }
                    // 审核通过
                    else if(this.afterSaleInfo.checkStatus == '03' && this.afterSaleInfo.serviceStatus != '06') {
                        this.currentStep = 1
                        const successNode = this.afterSaleInfo.afterSaleFlowsResqBos.find(e => e.nodeType == 'APPROVE')
                        if(this.afterSaleInfo.status == 'EXPIRE_REFUND_SUCCESS' || this.afterSaleInfo.status == 'EXPIRE_REFUND_PROCESSING') {
                            this.steps[0].title = '过期退款'
                        }
                        this.steps[0].desc = successNode?.operateTime || ''
                    } 
                    // 退款到账
                    else if(this.afterSaleInfo.serviceStatus == '06') {
                        this.currentStep = 3
                        const successNode = this.afterSaleInfo.afterSaleFlowsResqBos.find(e => e.nodeType == 'APPROVE')
                        if(this.afterSaleInfo.status == 'EXPIRE_REFUND_SUCCESS' || this.afterSaleInfo.status == 'EXPIRE_REFUND_PROCESSING') {
                            this.steps[0].title = '过期退款'
                        }
                        this.steps[0].desc = successNode?.operateTime || ''
                        const refundNode = this.afterSaleInfo.afterSaleFlowsResqBos.find(e => e.nodeType == 'COMPLETE')
                        this.steps[2].desc = refundNode?.operateTime || ''
                    } 

                    console.log(this.steps)
                })
            },
            // 查看协商记录
            goFlow() {
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/afterSaleFlow?afterSalesId=' + this.afterSaleInfo.afterSalesId
                })
            },
            // 退货
            doReturn() {
                this.returnShow = true
                this.returnExpress = ''
            },
            // 退货提交
            doSubmitReturn() {
                if(!this.bridgeSdk.checkIsEmpty(this.returnExpress)) {
                    this.bridgeSdk.showToast({title: '请填写快递单号'})
                    return
                }
                updateAfterState({
                    afterSalesId: this.afterSaleInfo.afterSalesId,
                    collectExpressNo: this.returnExpress,
                    state: 'SHIP',
                }).then(res=>{
                    this.bridgeSdk.showToast({title: '提交成功'})
                    this.returnShow = false
                    this.getAfterSaleDetail()
                })
            },
            // 预览图片
            previewImg(i) {
                uni.previewImage({
                    current: i,
                    urls: this.afterSaleInfo.imageShowUrls.map(e => this.minioBaseUrl + e)
                })
            },
            // 复制
            doCopy(e) {
                uni.setClipboardData({
                    data: e,
                    success: function () {
                        uni.showToast({
                            title: '复制成功',
                            icon: 'none'
                        });
                    }
                })
            },
            // 申诉
            doAppreal() {
                useMctStore().setApprealInfo({
                    ...this.afterSaleInfo
                })
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/appealPage'
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.u-steps-item__content--row .u-text) {
    justify-content: center !important;
}
:deep(.page-content) {
    background-color: #f8f8f8;
}
/* 文本超长展示 */
.text-overflow{
    overflow: hidden;
    /*禁止换行*/
    white-space: nowrap;
    /*显示省略号*/
    text-overflow: ellipsis;
}
.top {
    background-color: white;
    padding: 20rpx 30rpx;
    border-radius: 20rpx;
    width: calc(670rpx - 60rpx);
    margin: 20rpx auto 0;
    &-first {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 26rpx;
        color: #FF583A;
    }
    &-second {
        font-size: 24rpx;
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &-tip {
        background-color: #C6FFF6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        padding: 20rpx 0;
        width: 100%;
        border-radius: 10rpx;
        margin-top: 20rpx;
        color: #00BCB8;
        font-weight: bold;
        image {
            width: 22rpx;
            height: 24rpx;
            margin-left: 10rpx;
        }
    }
}
.good {
    background-color: white;
    padding: 20rpx 30rpx;
    border-radius: 20rpx;
    width: calc(670rpx - 60rpx);
    margin: 20rpx auto 0;
    &-title {
        font-weight: bold;
        font-size: 30rpx;
        margin-bottom: 10rpx;
    }
    &-info {
        &_top {
            display: flex;
            align-items: flex-start;
            image {
                width: 120rpx;
                height: 120rpx;
                border-radius: 10rpx;
            }
            &--content {
                flex: 1;
                width: 50%;
                margin-left: 20rpx;
                font-size: 24rpx;
            }
        }
        &_bottom {
            border-top: 1rpx solid #d0d0d0;
            margin-top: 20rpx;
            padding: 20rpx 0 0;
            font-size: 24rpx;
        }
    }
}
.reason {
    background-color: white;
    padding: 20rpx 30rpx;
    border-radius: 20rpx;
    width: calc(670rpx - 60rpx);
    margin: 20rpx auto 0;
    &-item {
        border-bottom: 2rpx solid #f8f8f8;
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 26rpx;
        line-height: 36rpx;
        &>view:first-of-type {
            max-width: 80%;
        }
        &>view:last-of-type {
            flex: 1;
            text-align: right;
            width: 20%;
            color: #999;
        }
        &:last-child {
            border-bottom: none;
        }
        image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 10rpx;
            margin-right: 10rpx;
        }
    }
}
.order {
    background-color: white;
    padding: 20rpx 30rpx;
    border-radius: 20rpx;
    width: calc(670rpx - 60rpx);
    margin: 20rpx auto 180rpx;
    &-title {
        font-weight: bold;
        font-size: 30rpx;
        margin-bottom: 20rpx;
    }
    &-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 24rpx;
        color: #333;
    }
}
.return-btn {
    position: fixed;
    bottom: 50rpx;
    left: 0;
    right: 0;
    margin: 20rpx auto;
    width: calc(670rpx - 80rpx);
    padding:0rpx 40rpx;
    color: white;
    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #D8D8D8;
    font-size: 28rpx;
    line-height: 84rpx;
    text-align: center;
    border-radius: 42rpx;
}
.popup {
    background-color: white;
    border-radius: 20rpx;
    padding: 30rpx 40rpx;
    width: calc(480rpx - 80rpx);
    &-title {
        font-weight: bold;
        font-size: 28rpx;
        text-align: center;
    }
    &-content {
        margin-top: 40rpx;
        display: flex;
        align-items: center;
        font-size: 24rpx;
        input {
            font-size: 24rpx;
            margin-left: 20rpx;
        }
    }
    &-btn {
        margin-top: 80rpx;
        padding:20rpx 40rpx;
        border-radius: 33rpx;
        color: white;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #D8D8D8;
        font-size: 24rpx;
        line-height: 34rpx;
        text-align: center;
    }
}
</style>