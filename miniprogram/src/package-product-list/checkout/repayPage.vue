<!--
 * @Description: 立即支付页面
 * @Autor: TF
 * @Date: 2025-03-31 10:00:36
 * @LastEditors: TF
 * @LastEditTime: 2025-05-27 19:09:56
-->
<template>
    <view>
        <vc-modal ref="modal"></vc-modal>
        <vc-container ref="container" :props-data="containerProps" style="background-color: #f8f8f8;" @navBack="navBack">
            <!-- 倒计时 -->
            <view class="countdown-block">
                <!-- 未支付情况下orderStatus为01/00 -->
                <template v-if="payInfo.orderStatus == '01' || payInfo.orderStatus == '00'">
                    <text>请在</text>
                    <up-count-down
                        :time="countTime"
                        format="HH:mm:ss"
                        autoStart
                        @change="onChange"
                        @finish="onFinish">
                        <view class="time">
                            <view class="time__custom">
                                <text class="time__custom__item">{{ timeData.minutes >= 10 ? timeData.minutes : '0' + timeData.minutes }}</text>
                            </view>
                            <text class="time__doc">:</text>
                            <view class="time__custom">
                                <text class="time__custom__item">{{ timeData.seconds >= 10 ? timeData.seconds : '0' + timeData.seconds }}</text>
                            </view>
                        </view>
                    </up-count-down>
                    <text>内付款</text>
                </template>
                <!-- 交易成功 -->
                <template v-else-if="payInfo.orderStatus == '02'">
                    <up-icon name="checkmark-circle" size="60rpx" color="#00BCB8"></up-icon>
                    <view style="margin-left: 15rpx;margin-bottom: 5rpx;">交易成功</view>
                </template>
                <!-- 交易失败 -->
                <template v-else-if="payInfo.orderStatus == '03'">
                    <up-icon name="close-circle" size="60rpx" color="red"></up-icon>
                    <text style="margin-left: 15rpx;margin-bottom: 5rpx;">交易失败</text>
                </template>
                <!-- 交易关闭 -->
                <template v-else-if="payInfo.orderStatus == '04'">
                    <up-icon name="minus-circle" size="60rpx" color="gray"></up-icon>
                    <text style="margin-left: 15rpx;margin-bottom: 5rpx;">交易已关闭</text>
                </template>
            </view>
            <!-- 地址 -->
            <view style="width: 90%;margin: 40rpx auto 0;border-radius: 20rpx;" v-if="!isVirtual">
                <!-- 配送情况 -->
                <view class="address-block" v-if="tab == 1" :style="{padding: bridgeSdk.checkIsEmpty(addressInfo) ? '20rpx 40rpx' : '40rpx' }">
                    <up-skeleton :title="false" rows="2" rowsHeight="14" :rowsWidth="['50%', '60%']" :loading="isLoading">
                        <view class="address-block_top">
                            <view>{{ addressInfo.consignee }}</view>
                            <view style="font-size: 30rpx;margin-left: 10rpx;">{{ addressInfo.mobile }}</view>
                        </view>
                        <view class="address-block_btm">
                            {{ addressInfo.province }}
                            {{ addressInfo.city }}
                            {{ addressInfo.area }}
                            {{ addressInfo.address }}
                        </view>
                    </up-skeleton>
                </view>
                <!-- 自提信息 -->
                <view class="address-block" v-if="tab == 2">
                </view>
            </view>

            <!-- 订单信息 -->
            <view class="info-block">
                <up-skeleton style="padding: 20rpx 40rpx;" rows="2" avatarShape="quare" :title="false" rowsHeight="14" :rowsWidth="['40%', '40%']" avatarSize="120rpx" avatar :loading="isLoading">
                    <view :style="{height: info.productInfo.length > 3 ? (isOver ? 'auto' : '500rpx') : 'auto', overflow: 'hidden'}">
                        <view class="info-block_item" v-for="(item, index) in info.productInfo" :key="index">
                            <image :src="`${minioBaseUrl}${item.listPicUrl}`"></image>
                            <view class="info-block_item--main">
                                <view style="display: flex;align-items: flex-end;justify-content: space-between;">
                                    <view>{{ item.spuName }}</view>
                                    <view class="gray amt">¥{{ toFixed(item.price, 2) }}</view>
                                </view>
                                <view style="display: flex;align-items: flex-end;justify-content: space-between;" :style="{'justify-content': isVirtual ? 'flex-end' : 'space-between'}">
                                    <view style="font-size: 22rpx;color: #999;" v-if="!isVirtual">{{ item.skuName }}</view>
                                    <view class="gray">数量 x{{ item.number }}</view>
                                </view>
                                <view style="display: flex;align-items: flex-end;justify-content: flex-end;margin-top: 10rpx;">
                                    <view class="red amt">¥{{ toFixed(item.subOrderAmt, 2) }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-if="info.productInfo.length > 3" class="info-block_over" @click="isOver=!isOver">
                        <view>{{ isOver ? '收起' : '展开' }}(共{{ allNum }}件商品)</view>
                        <up-icon :name="isOver ? 'arrow-up' : 'arrow-down'" size="22rpx" color="gray" style="margin-left: 10rpx;"/>
                    </view>

                    <view class="info-block_btm" style="margin-top: 60rpx;">
                        <view>商品总价</view>
                        <view class="amt">¥{{ toFixed(info.totalPrice, 2) }}</view>
                    </view>

                    <view class="info-block_btm" v-if="Number(info.rebatPrice) > 0">
                        <view>优惠金额</view>
                        <view style="color: red;">
                            <text style="font-size: 24rpx;margin-right: 10rpx;">-¥</text>{{ toFixed(info.rebatPrice, 2) }}
                        </view>
                    </view>
                    
                    <view class="info-block_btm" v-if="!isVirtual">
                        <view>实付款</view>
                        <view class="amt">¥{{ toFixed(info.payPrice, 2) }}</view>
                    </view>
                </up-skeleton>
            </view>

            <!-- 订单信息展示 -->
            <view class="pay-block">
                <view class="pay-block_item">
                    <view>订单编号</view>
                    <view>{{ payInfo.orderId }}</view>
                </view>
                <view class="pay-block_item">
                    <view>下单时间</view>
                    <view>{{ payInfo.payTimeFmt }}</view>
                </view>
            </view>

            <!-- 备注 -->
            <view class="remark-block" v-if="!isVirtual">
                <view>备注</view>
                <input v-model="remark" 
                    :disabled="payInfo.orderStatus != '01'&&payInfo.orderStatus != '00'" 
                    :placeholder="(payInfo.orderStatus == '01' || payInfo.orderStatus == '00') ? '请输入备注' : ''" 
                    placeholder-style="fontWeight: normal;fontSize: 28rpx"/>
            </view>

            <!-- 底部区域 -->
            <view class="btm-block"  v-if="payInfo.orderStatus == '01' || payInfo.orderStatus == '00'">
                <view class="btm-block_amt">¥{{ toFixed(info.payPrice, 2) }}</view>
                <view class="btm-block_btn" @click="doPay">立即支付</view>
            </view>
        </vc-container>
    </view>
</template>

<script>
    import { plus, multiply, toFixed } from '@/utils/decimal.ts'
    import { usermOrderDetails, keepPayOrder  } from '../api/index'
    import { useMctStore } from '@/store'
    export default {
        name: 'repayPage',
        data() {
            return {
                toFixed,
                info: {}, //订单信息
                
                addressInfo: {},//地址信息
                tab: 1,//配送方式
                payInfo: {},//支付状态信息
                //orderStatus: 00-待付款，01-处理中，02-交易成功，03-交易失败，04-交易关闭，05-已撤销
                
                containerProps: {
                    props:{
                        isFullScreen:{
                            value: true
                        },
                        customLeftBack: {
                            value: true
                        }
                    }
                },//container的props

                remark: '',//备注
                isOver: false,//是否展开
                countTime: 15 * 60 * 1000,
                timeData: {},// 倒计时对象
                isLoading: false,

                isVirtual: false, // 是否虚拟商品
            }
        },
        computed: {
            //总数量
            allNum() {
                return this.info.productInfo.map(e=>e.number).reduce((sum, current) => plus(sum, current), 0)
            }
        },
        onLoad(options) {
            this.remark = options.remark
            this.isVirtual = options.isVirtual == '1'
            this.info = {
                orderNo: useMctStore().orderId
            }
            this.isLoading = true
        },
        onShow() {
            // this.addressInfo = useMctStore().orderAddress
            this.getOrderInfo()
        },
        methods: {
            //返回
            navBack(){
                let _this = this
                this.$refs.modal.open({
                    title: "确定放弃付款？",
                    content: "您的订单还未支付，确定放弃付款？",
                    confirmText: '继续支付',
                    cancelText: '放弃支付',
                    cancelCallback: (res) => {
                        this.bridgeSdk.hi.closeWebview()
                    },
                });
            },
            // 倒计时
            onChange(e) {
                this.timeData = e
            },
            //倒计时结束
            onFinish() {
                this.payInfo.orderStatus = '04'
            },
            //获取详情
            getOrderInfo() {
                usermOrderDetails({
                    orderId: this.info.orderNo
                }).then(res=>{
                    let time = res.payInfo.payDate.substring(0, 4) + '-' + 
                                res.payInfo.payDate.substring(4, 6) + '-' + 
                                res.payInfo.payDate.substring(6, 8) + ' ' +
                                res.payInfo.payTime.substring(0, 2) + ':' +
                                res.payInfo.payTime.substring(2, 4) + ':' +
                                res.payInfo.payTime.substring(4, 6)
                    let timestamp = new Date(time).getTime() + 15 * 60 * 1000 - new Date().getTime()
                    this.countTime = timestamp
                    //支付信息
                    this.payInfo = {
                        ...res.payInfo,
                        payTimeFmt: time  
                    }
                    //商品信息
                    if(this.isVirtual) {
                        this.info.productInfo = [{
                            ...res.suAll[0],
                            number: res.suAll.length,
                            subOrderAmt: multiply(res.suAll[0].price, res.suAll.length)
                        }]
                        this.info.totalPrice = res.suAll.map(e=>e.subOrderAmt).reduce((sum, current) => plus(sum, current), 0)
                        this.info.payPrice = res.suAll.map(e=>e.subOrderAmt).reduce((sum, current) => plus(sum, current), 0)
                    } else {
                        this.info.productInfo = [...res.suAll]
                        //地址信息
                        this.addressInfo = res.addressInfo
                        //金额
                        this.info.totalPrice = res.suAll.map(e=>e.subOrderAmt).reduce((sum, current) => plus(sum, current), 0)
                        this.info.payPrice = res.suAll.map(e=>e.subPayAmt).reduce((sum, current) => plus(sum, current), 0)
                        this.info.rebatPrice = res.suAll.map(e=>e.subRebateAmt).reduce((sum, current) => plus(sum, current), 0)
                    }
                    console.warn(this.info.productInfo)
                    this.isLoading = false
                })
            },
            //去付款
            async doPay() {
                keepPayOrder({
                    orderId: this.info.orderNo
                }).then(res=>{
                    console.log(res)
                    let encodeUrl = encodeURIComponent(res.payUrl)
                    this.bridgeSdk.jumpPage({
                        url: 'web/index.html#/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
$font-black: #333;
$font-red: red;
$font-gray: #999;
$font-12: 24rpx;
$font-14: 28rpx;
$font-16: 32rpx;
.flex{
    display: flex;
}
.countdown-block{
    width: 90%;
    margin: 20rpx auto 0;
    padding: 20rpx 0 0rpx 20rpx;
    border-radius: 20rpx;
    font-size: 38rpx;
    display: flex;
    align-items: center;
    font-weight: bold;
    // background-color: white;
    .time {
        display: flex;
        align-items: center;
        margin: 0 10rpx;
        &__custom {
            width: 50rpx;
            height: 50rpx;
            background-color: #00BCB8;
            border-radius: 8rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            &__item {
                color: #fff;
                font-size: 28rpx;
                text-align: center;
            }
        }
        &__doc {
            color: #00BCB8;
            padding: 0 4rpx;
        }
        
        &__item {
            color: #606266;
            font-size: 30rpx;
            margin-right: 8px;
        }
    }
}
.address-block{
    padding: 20rpx 40rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    line-height: 45rpx;
    border-radius: 20rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_top{
        font-size: 30rpx;
        display: flex;
        align-items: center;
        font-weight: bold;
        color: $font-black;
    }
    &_main{
        width: 100%;
        font-size: 32rpx;
        color: #999;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &_btm{
        font-size: 26rpx;
        color: $font-gray;
    }
}
.info-block{
    width: 90%;
    margin: 20rpx auto 0;
    padding: 20rpx 0 10rpx;
    border-radius: 20rpx;
    background-color: white;
    &_item{
        display: flex;
        padding: 20rpx 0rpx;
        image{
            width: 120rpx;
            height: 120rpx;
            border-radius: 10rpx;
        }
        &--main{
            flex: 1;
            line-height: 40rpx;
            font-size: 30rpx;
            margin-left: 20rpx;
            .amt{
                &::first-letter{
                    font-size: 20rpx;
                    margin-right: 10rpx;
                }
            }
            .gray{
                color: #999;
                font-size: 24rpx;
            }
            .red{
                font-size: 28rpx;
                // color: red;
                font-weight: bold;
            }
        }
    }
    &_over{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        color: gray;
    }
    &_btm{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: $font-black;
        font-weight: bold;
        background-color: white;
        padding: 10rpx 0rpx;
        .amt{
            &::first-letter{
                font-size: 24rpx;
                margin-right: 10rpx;
            }
        }
    }
}
.pay-block{
    width: 80%;
    margin: 20rpx auto 0rpx;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    background-color: white;
    font-size: 28rpx;
    color: $font-black;
    font-weight: bold;
    line-height: 60rpx;
    &_item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        & view:last-child{
            color: gray;
            font-weight: normal;
        }
    }
}
.remark-block{
    width: 80%;
    margin: 20rpx auto 200rpx;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: $font-black;
    font-weight: bold;
    input{
        text-align: right;
    }
}

.btm-block{
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0 20rpx 40rpx;
    background-color: #333;
    bottom: 30rpx;
    left: 0;
    right: 0;
    border-radius: 50rpx;
    height: 60rpx;
    width: 85%;
    margin: 0 auto;
    &_amt{
        font-size: 38rpx;
        font-weight: bold;
        color: white;
        &::first-letter{
            font-size: 24rpx;
            margin-right: 10rpx;
        }
    }
    &_btn{
        border-radius: 0 50rpx 50rpx 0;
        width: 200rpx;
        text-align: center;
        height: 100rpx;
        font-size: 32rpx;
        line-height: 100rpx;
        color: white;
        font-weight: bold;
        background-color: #00BCB8;
    }
}
.pop-address{
    height: 500rpx;
    &_item{
        line-height: 50rpx;
        padding: 20rpx 40rpx;
        border-bottom: 2rpx solid #f8f8f8;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .button {
        position: fixed;
        left: 4%;
        bottom: 40rpx;
        width: 92%;
        height: 84rpx;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
        border-radius: 42rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 32rpx;
        color: #FFFFFF;
        text-align: center;
        font-style: normal;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.pop-coupon{
    .disabled{
        color: #999 !important;
        filter: opacity(.5);
    }
    .green{
        color: #00BCB8;
    }
    .amt{
        &::first-letter{
            font-size: 24rpx;
            margin-right: 5rpx;
        }
    }
    .pop-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 20rpx 20rpx 30rpx;
        position: relative;
        background: radial-gradient(circle at 70% top, transparent 20rpx,white 0) center top / 100% 50% no-repeat,
                    radial-gradient(circle at 70% bottom, transparent 20rpx, white 0) center bottom / 100% 50% no-repeat;
        font-size: 28rpx;
        border-radius: 10rpx;
        width: 87%;
        margin: 20rpx auto 0;
        &_left{
            line-height: 45rpx;
            width: calc(70% + 5rpx);
            display: flex;
            align-items: center;
            border-right: 2rpx dashed #d0d0d0;
            &--name{
                font-size: 28rpx;
                font-weight: bold;
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow-x: hidden;
            }
        }
        .dis{
            color: #999;
            border-color: #999;
        }
        &_right{
            padding: 0 30rpx;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 25rpx;
            text-align: center;
            color: white;
            font-size: 24rpx;
            border: 2rpx solid #00BCB8;
            color: #00BCB8;
        }
    }
}
</style>