<!--
 * @Description: 下单（虚拟商品）卖券
 * @Autor: TF
 * @Date: 2025-03-31 10:00:36
 * @LastEditors: TF
 * @LastEditTime: 2025-05-28 10:02:32
-->
<template>
    <view>
        <vc-modal ref="modal"></vc-modal>
        <vc-container ref="container" :props-data="containerProps" style="background-color: #f8f8f8;">
        
            <!-- 订单信息 -->
            <view class="info-block">
                <view class="info-block_title"></view>

                <view class="info-block_item">
                    <image :src="`${minioBaseUrl}${info.listPicUrl}`"></image>
                    <view class="info-block_item--main">
                        <view style="display: flex;align-items: flex-end;justify-content: space-between;">
                            <view>{{ info.spuName }}</view>
                            <view class="amt" style="font-size: 26rpx;">¥{{ info.price }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: flex-end;">
                            <view class="numberstep">
                                <view @click="doMinus">
                                    <up-icon name="minus" size="20rpx"></up-icon>
                                </view>
                                <input v-model="info.num" type="number" @blur="inputBlur"/>
                                <view @click="doPlus">
                                    <up-icon name="plus" size="20rpx"></up-icon>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="info-block_btm" style="margin-top: 60rpx;">
                    <view>总价</view>
                    <view class="amt">¥{{ toFixed(info.totalPrice || 0, 2) }}</view>
                </view>
            </view>
            <!-- 底部区域 -->
            <view class="btm-block">
                <view class="btm-block_amt">¥{{ toFixed(info.totalPrice || 0, 2) }}</view>
                <view class="btm-block_btn" @click="doPay">去付款</view>
            </view>
        </vc-container>
    </view>
</template>

<script>
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    import {  couponOrder  } from '../api/index'
    import { useMctStore } from '@/store'
    export default {
        data() {
            return {
                divide,
                toFixed,
                mctId: '',//商户号
                info: {}, //订单信息
                numMin: 1,// 最小购买数量
                numMax: 99,// 最大购买数量

                emptyProps: {
                    props: {
                        marginTop: {
                            value: '50'
                        }
                    }
                },//vc-empty的props
                containerProps: {
                    props:{
                        isFullScreen:{
                        value: true
                        }
                    }
                },//container的props
                hasDoPay: false,// 是否已经拉起支付
            }
        },
        watch: {
            'info': {
                handler(newVal) {
                    if(newVal.num < this.numMin || newVal.num > this.numMax) return;
                    // 计算总价
                    this.info.totalPrice = multiply(newVal.num||1, newVal.price)
                },
                deep: true
            }
        },
        onLoad(options) {
            //获取订单信息
            this.info = this.bridgeSdk.checkIsEmpty(useMctStore().orderInfo) ? useMctStore().orderInfo : {}
            if(!this.info.num) this.info.num = this.numMin; //默认购买数量为1

            this.mctId = this.bridgeSdk.checkIsEmpty(useMctStore().orderMctId) ? useMctStore().orderMctId : ''
        },
        onShow() {
            //若已拉起支付返回本页面时，跳转立即支付页面
            if(this.hasDoPay){
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/checkout/repayPage?isVirtual=1`,
                    openType: 'redirectTo'
                })
            }
        },
        methods: {
            // 减
            doMinus() {
                if (this.info.num <= 1) {
                    uni.showToast({
                        title: '数量不能小于1',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.info.num = minus(this.info.num, 1)
            },
            // 加
            doPlus() {
                if (this.info.num >= 99) {
                    uni.showToast({
                        title: '数量不能大于99',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.info.num = plus(this.info.num, 1)
            },
            // 输入框失去焦点
            inputBlur(info, index) {
                if(!this.info.num || this.info.num < this.numMin) this.info.num = this.numMin;
                if(this.info.num > this.numMax) this.info.num = this.numMax;
            },
            //获取经纬度
            getLocation() {
                return new Promise((resolve, reject) => {
                    this.bridgeSdk.getLocation((res) => {
                        console.log(res, "获取定位");
                        resolve(res)
                    });
                })
            },
            //去付款
            async doPay() {
                //获取经纬度
                let locationObj = await this.getLocation()
                //获取设备信息
                let deviceObj = await this.bridgeSdk.getDeviceInfo()
                couponOrder({
                    shopsId: useMctStore().orderStoreId,//店铺id
                    num: this.info.num,//购买数量
                    skuId: this.info.skuId,//商品id
                    mallScene: 'store',//支付场景 /*门店 (store), 商城(mall)*/
                    orderSource: 'ICBCAPP',
                    // webNotifyUrl: encodeURIComponent(location.origin + '/#/package-product-list/checkout/buyResult'),//订单完成回调页面
                    webNotifyUrl: 'nojump',//订单完成回调页面
                    lat: locationObj.lat,//纬度
                    lng: locationObj.lng,//经度
                    ip: deviceObj.ip||'123',//ip
                    mac: deviceObj.mac||'123',//mac
                    deviceId: deviceObj.deviceId||'123',//设备编号
                    orderSource: '',
                }).then(res=>{
                    console.log(res)
                    let encodeUrl = encodeURIComponent(res.payUrl)
                    this.bridgeSdk.jumpPage({
                        url: 'web/index.html#/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                    })
                    this.hasDoPay = true
                    useMctStore().setOrderId(res.orderNo)
                    //清除pinia中优惠券信息
                    useMctStore().clearOrderCoupon()
                    //清除pinia中订单信息
                    useMctStore().clearOrderInfo()
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
.info-block{
    width: 90%;
    margin: 20rpx auto 0;
    padding: 20rpx 0 10rpx;
    border-radius: 20rpx;
    background-color: white;
    &_item{
        display: flex;
        padding: 20rpx 40rpx;
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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
                font-size: 30rpx;
                // color: red;
                font-weight: bold;
            }
            .numberstep{
                display: flex;
                align-items: center;
                height: 40rpx;
                border-radius: 20rpx;
                border: 2rpx solid #f3f3f3;
                input{
                    width: 60rpx;
                    border-left: 2rpx solid #f3f3f3;
                    border-right: 2rpx solid #f3f3f3;
                    text-align: center;
                    font-size: 23rpx;
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
        font-size: 30rpx;
        color: $font-black;
        font-weight: bold;
        background-color: white;
        padding: 15rpx 40rpx;
        .amt{
            &::first-letter{
                font-size: 24rpx;
                margin-right: 10rpx;
            }
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
    font-size: 30rpx;
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
        width: 150rpx;
        text-align: center;
        height: 100rpx;
        font-size: 32rpx;
        line-height: 100rpx;
        color: white;
        font-weight: bold;
        background-color: #00BCB8;
    }
}
</style>