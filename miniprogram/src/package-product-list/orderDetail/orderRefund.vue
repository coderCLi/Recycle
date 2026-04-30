<!--
 * @Description: 退款页面
 * @Autor: TF
 * @Date: 2025-07-08 14:49:24
 * @LastEditors: TF
 * @LastEditTime: 2025-08-30 10:17:05
-->
<template>
    <vc-modal ref="modal"/>
    <vc-container>
        <!-- 商品信息 -->
        <view class="good">
            <view class="good-top" v-for="(item, index) in skuList" :key="index">
                <image :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
                <view class="good-top_content">
                    <view class="info" style="flex-wrap: wrap;align-items: flex-start;">
                        <view class="text-overflow" style="font-size: 28rpx;font-weight: bold;color: #333;width: 60%;text-align: left;">{{ item.spuName }}</view>
                        <view>¥{{ item.subPayAmt }}</view>
                    </view>
                    <view class="info">
                        <view class="text-overflow" style="flex: 1;width: 60%;text-align: left;margin-right: 20rpx;">商品规格：{{ item.skuName }}</view>
                        <view>x{{ item.number }}</view>
                    </view>
                </view>
            </view>
            <view class="good-bottom" style="margin-top: 25rpx;display: flex;align-items: flex-end;">
                <text style="margin-right: 5rpx;">实付</text>
                <text>¥{{ this.info.payAmt }}</text>
            </view>
        </view>
        <!-- 表单 -->
        <view class="form">
            <view class="form-item" v-if="isVirtualProduct == '1'">
                <view>
                    <view class="title">退款数量</view>
                    <view class="text" v-if="!singleRefund">最多可退{{ numMax }}张</view>
                </view>
                
                <view class="numberstep" v-if="!singleRefund">
                    <view @click="doMinus">
                        <up-icon name="minus" size="20rpx"></up-icon>
                    </view>
                    <input v-model="refundNum" type="number" @blur="inputBlur"/>
                    <view @click="doPlus">
                        <up-icon name="plus" size="20rpx"></up-icon>
                    </view>
                </view>
                <view style="font-size: 26rpx;" v-else>1张</view>
            </view>
            <view class="form-item">
                <view>
                    <view class="title">退款金额</view>
                    <view class="text">1-3个工作日退还至原支付方，以实际退款金额为准</view>
                </view>
                <view style="color: red;min-width: 40%;text-align: right;">
                    ¥{{ toFixed(refundAmt, 2) }}
                </view>
            </view>
            <view class="form-item">
                <view class="title required">退款原因</view>
                <view style="display: flex;align-items: center;justify-content: flex-end;font-size: 24rpx;flex: 1;width: 60%;" @click="goRefund">
                    <template v-if="!bridgeSdk.checkIsEmpty(refundReason)">
                        <view style="color: #d0d0d0;">请选择</view>
                        <up-icon size="12" name="arrow-right" color="#999"/>
                    </template>
                    <template v-else>
                        <view class="text-overflow" style="flex: 1;width: 40%;margin-left: 60rpx;text-align: right;">{{ refundReason.optName }}</view>
                        <up-icon size="12" name="arrow-right" color="#999"/>
                    </template>
                </view>
            </view>
            <!-- 退款原因为其他时需要输入退款说明 -->
            <view style="padding: 20rpx 0;">
                <view :class="['title', refundReason.optCode == '99' ? 'required' : '']">退款说明</view>
                <up-textarea style="margin-top: 20rpx;font-size: 24rpx;" v-model="description" placeholderStyle="font-size: 24rpx" placeholder="补充退款原因详情" maxlength="200" count></up-textarea>
            </view>
            <!-- 退款凭证 -->
            <view style="padding: 20rpx 0;">
                <view class="title" style="margin-bottom: 20rpx;">退款凭证</view>
                <vc-upload :props-data="{
                        props: {
                            previewFullImage: {
                                value: true
                            },
                            fileList: {
                                value: this.picList 
                            },
                            maxSize: {
                                value: 5 * 1024 * 1024
                            },
                            maxCount: {
                                value: 3
                            },
                            deletable: {
                                value: true
                            }
                        }
                    }" @delete="deletePic" @complete="upComplete">
                    <image :src="staticBaseUrl + '/hbdimage/package-product-list/shangchuan.png'" style="width: 160rpx; height: 160rpx;border: 2rpx dashed #f8f8f8"></image>
                </vc-upload>
            </view>
        </view>
        <!-- 操作按钮栏 -->
        <view class="bottom">
            <view class="bottom-amt">
                退款金额：<text>¥{{ toFixed(refundAmt, 2) }}</text>
            </view>
            <view class="bottom-btn" @click="doApply">
                {{ ['VIRTUAL_RETURNED_REASON', 'ENTITY_RETURNED_REASON'].includes(doType) ? '提交退货退款申请' : '提交退款申请' }}
            </view>
        </view>
    </vc-container>

</template>

<script>
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    import vcUpLoad from '@/components/library/base/vc-upload/index.vue';
    import {
        usermOrderDetailsNew,// 订单详情
        afterSaleApply,// 售后申请
    } from '../api/index'
    export default {
        name: 'orderRefund',
        components: {
            'vc-upload': vcUpLoad
        },
        data() {
            return {
                toFixed,

                orderId: '',// 订单编号
                info: {},// 订单信息
                skuList: [],// 商品列表
                isVirtualProduct: '0',// 是否虚拟商品，0-否，1-是

                numMax: 99,// 退款最大数
                price: '',// 单商品实付价格
                refundNum: 1,// 退款商品数
                refundAmt: 0,// 退款金额
                refundReason: {},// 退款原因对象
                description: '',// 退款说明
                picList: [],// 退款凭证
                doType: '',// 退款类型

                singleRefund: false,// 单商品退款
                singleRefundSubId: '',// 单商品退款子单ID

                reAfterSaleInfo: {},
            }
        },
        onLoad(options) {
            this.orderId = options.orderId
            this.doType = options.doType

            // 如果是从查看券码进入则仅对该子订单进行售后
            this.singleRefund = options.singleRefund == '1'
            this.singleRefundSubId = options.singleRefundSubId
            this.getOrderInfo()
        },
        onShow() {

        },
        methods: {
            // 获取订单详情
            async getOrderInfo() {
                let res = await usermOrderDetailsNew({
                    orderId: this.orderId
                })
                this.info = { ...res }
                // 是否虚拟商品
                this.isVirtualProduct = res.isVirtualProduct
                // 虚拟商品
                if(this.isVirtualProduct == '1') {
                    this.skuList = [
                        {
                            ...this.info.subOrderList[0],
                            number: this.info.subOrderList.map(e => e.number).reduce((sum, current) => plus(sum, current), 0)
                        }
                    ]
                    this.price = this.skuList[0].subPayAmt
                    // 实付款
                    this.info.payAmt = this.info.subOrderList.map(e => e.subPayAmt).reduce((sum, current) => plus(sum, current), 0)
                    
                    // 查看券码单券退款时
                    if(this.singleRefund) {
                        this.numMax = 1
                        this.refundNum = 1
                        this.refundAmt = this.info.subOrderList
                            .filter(e => e.subOrderId == this.singleRefundSubId)
                            .map(e => e.subPayAmt)
                            .reduce((sum, current) => plus(sum, current), 0)
                    }
                    // 正常退款时
                    else {
                        // 已售后、售后中以及已使用数量
                        this.info.hasRefundNum = this.info.subOrderList.filter(e => [
                                            'COMPLETED', 
                                            'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
                                            'REFUND_REVIEWING', // 退款审核中
                                            'REFUND_PROCESSING', // 退款中
                                            'PART_REFUND_PROCESSING', // 部分退款中
                                            'REFUND_SUCCESS', // 已退款
                                            'EXPIRED_REFUNDED_SUCCESS', // 过期退款成功
                                            'EXPIRED_REFUND',// 过期退款
                                        ].includes(e.status) || e.virtualProductIsWhetherUse == '1').length
                        // 最大数量
                        this.numMax = this.skuList[0].number - this.info.hasRefundNum
                        // 退款数量
                        this.refundNum = this.skuList[0].number - this.info.hasRefundNum
                        // 退款金额
                        this.refundAmt = this.info.subOrderList
                            .filter(e => !([
                                            'COMPLETED', 
                                            'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
                                            'REFUND_REVIEWING', // 退款审核中
                                            'REFUND_PROCESSING', // 退款中
                                            'PART_REFUND_PROCESSING', // 部分退款中
                                            'REFUND_SUCCESS', // 已退款
                                            'EXPIRED_REFUNDED_SUCCESS', // 过期退款成功
                                            'EXPIRED_REFUND',// 过期退款
                                        ].includes(e.status) || e.virtualProductIsWhetherUse == '1'))
                            .map(e => e.subPayAmt)
                            .reduce((sum, current) => plus(sum, current), 0)
                    }
                } else {
                    this.skuList = this.info.subOrderList
                }
            },
            // 减
            doMinus() {
                if (this.refundNum <= 1) {
                    uni.showToast({
                        title: '退款数量不能再减少了',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.refundNum = minus(this.refundNum, 1)
                this.refundAmt = minus(this.refundAmt, this.price)
            },
            // 加
            doPlus() {
                if (this.refundNum >= this.numMax) {
                    uni.showToast({
                        title: `最多可退${this.numMax}张`,
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.refundNum = plus(this.refundNum, 1)
                this.refundAmt = plus(this.refundAmt, this.price)
            },
            // 选择退款原因
            goRefund() {
                if(!this.bridgeSdk.checkIsEmpty(this.doType)) return
                this.bridgeSdk.jumpPage({
                    url: '/package-product-list/orderDetail/refundReason?type=' + this.doType + '&reason=' + this.refundReason.optCode + '&reasonText=' + this.refundReason.optName
                })
            },
            // 设置理由
            setReason(e) {
                this.refundReason = {...e}
                this.$forceUpdate()
                console.log(this.refundReason)
            },
            // 输入框失去焦点
            inputBlur(info, index) {
                if(!this.refundNum || this.refundNum < 1) this.refundNum = 1;
                if(this.refundNum > this.numMax) this.refundNum = this.numMax;
            },
            //删除图片
            deletePic(event) {
                console.log(event)
                this.picList.splice(event.index, 1);
            },
            //获取完成上传后图片id
            upComplete(imageData) {
                let index = imageData.index;
                this.picList.splice(index, 1, { ...imageData, url: this.minioBaseUrl + imageData.showUrl });
            },
            // 提交申请
            doApply() {
                if(!this.bridgeSdk.checkIsEmpty(this.refundReason)) {
                    this.bridgeSdk.showToast({
                        title: '请选择退款原因'
                    })
                    return;
                }
                if(this.refundReason.optCode == '99' && !this.bridgeSdk.checkIsEmpty(this.description)) {
                    this.bridgeSdk.showToast({
                        title: '请输入退款说明'
                    })
                    return;
                }
                // 驳回售后子订单信息
                if(this.singleRefund) {
                    this.reAfterSaleInfo = this.info.subOrderList.find(e => e.onAfterSales == '3' && e.pointsSubOrderId == this.singleRefundSubId)
                } else {
                    this.reAfterSaleInfo = this.info.subOrderList.find(e => e.onAfterSales == '3')
                }
                // 售后子单列表
                let itemIds;
                if(this.isVirtualProduct == '1') {
                    itemIds = this.singleRefund ? this.info.subOrderList.filter(e => e.subOrderId == this.singleRefundSubId).map(e =>({
                        itemId: e.itemId,
                        afterSaleNum: 1,
                        subOrderId: e.subOrderId
                    })) : this.info.subOrderList.filter(e => !([
                                            'COMPLETED', 
                                            'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
                                            'REFUND_REVIEWING', // 退款审核中
                                            'REFUND_PROCESSING', // 退款中
                                            'PART_REFUND_PROCESSING', // 部分退款中
                                            'REFUND_SUCCESS', // 已退款
                                            'EXPIRED_REFUNDED_SUCCESS', // 过期退款成功
                                            'EXPIRED_REFUND',// 过期退款
                                        ].includes(e.status) || e.virtualProductIsWhetherUse == '1')).map(e =>({
                        itemId: e.itemId,
                        afterSaleNum: 1,
                        subOrderId: e.subOrderId
                    })).slice(0, Number(this.refundNum))
                } else {
                    itemIds = this.info.subOrderList.filter(e => !([
                                            'COMPLETED', 
                                            'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
                                            'REFUND_REVIEWING', // 退款审核中
                                            'REFUND_PROCESSING', // 退款中
                                            'PART_REFUND_PROCESSING', // 部分退款中
                                            'REFUND_SUCCESS', // 已退款
                                            'EXPIRED_REFUNDED_SUCCESS', // 过期退款成功
                                            'EXPIRED_REFUND',// 过期退款
                                        ].includes(e.status) || e.virtualProductIsWhetherUse == '1')).map(e =>({
                        itemId: e.itemId,
                        afterSaleNum: 1,
                        subOrderId: e.subOrderId
                    })).slice(0, Number(this.refundNum))
                }

                afterSaleApply({
                    orderId: this.orderId,
                    mallScene: 'store',
                    afterSaleType: ['VIRTUAL_RETURNED_REASON', 'ENTITY_RETURNED_REASON'].includes(this.doType) ? 'RETURN' : 'REFUND',
                    afterSaleDealType: ['VIRTUAL_RETURNED_REASON', 'ENTITY_RETURNED_REASON'].includes(this.doType) ? 'SELF_DEAL' : 'NO_DEAL',
                    itemIds: itemIds,
                    afterSalesId: this.reAfterSaleInfo ? this.reAfterSaleInfo.afterSalesId : 0,// 无则传0，因为afterSalesId从1开始
                    reason: this.refundReason.optName,
                    description: this.description,
                    images: this.picList.map(e => e.id)
                }).then(res=>{
                    this.bridgeSdk.showConfirm({
                        content: ['VIRTUAL_RETURNED_REASON', 'ENTITY_RETURNED_REASON'].includes(this.doType) ? '您的售后申请已提交成功！请耐心等待商家审核。' : '您的售后申请已提交成功！请耐心等待商家审核。',
                        showCancel: false,
                        confirmCallback: () => {
                            uni.$emit('getOrderList')
                            this.bridgeSdk.navigateBackTo({
                                delta: 1
                            });
                        }
                    });
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
.good {
    padding: 20rpx 30rpx;
    width: 610rpx;
    margin: 30rpx auto 0;
    border-radius: 20rpx;
    background-color: white;
    &-top {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 10rpx;
        }
        &_content {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-left: 20rpx;
            flex: 1;
            width: 40%;
            .info {
                width: 100%;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                font-size: 24rpx;
                color: #999;
                font-weight: normal;
                text-align: right;
            }
        }
    }
    &-bottom {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: red;
        font-size: 28rpx;
    }
}

.form {
    padding: 20rpx 30rpx;
    width: 610rpx;
    margin: 30rpx auto 0;
    border-radius: 20rpx;
    background-color: white;
    .title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
    }
    .text {
        font-size: 20rpx;
        color: #999;
    }
    .required {
        &::after {
            content: "*";
            color: red;
        }
    }
    &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #f8f8f8;
        padding: 20rpx 0;
        &:last-child {
            border-bottom: none;
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
.bottom {
    position: fixed;
    padding: 20rpx 30rpx calc(20rpx + constant(safe-area-inset-bottom));
    padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-amt {
        font-size: 28rpx;
        color: #333;
        text {
            color: red;
        }
    }
    &-btn {
        line-height: 84rpx;
        border-radius: 42rpx;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #D8D8D8;
        padding: 0 50rpx;
        text-align: center;
        color: white;
        font-size: 28rpx;
        font-weight: bold;
    }
}
</style>