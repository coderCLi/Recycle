<!--
 * @Description: 兑换成功页
 * @Autor: TF
 * @Date: 2025-08-02 13:12:38
 * @LastEditors: TF
 * @LastEditTime: 2025-08-18 21:25:07
-->
<template>
    <vc-modal ref="modal"/>
    <vc-container :props-data="containerProp" ref="container">
        <view style="position: relative;height: 100%;">
            <view class="top">
                <image :src="staticBaseUrl + '/hbdimage/package-intergral-mall/exchange_success.png'"/>
                <view style="font-size: 32rpx;color: #333;margin-top: 36rpx;">订单购买完成</view>
            </view>
            <view class="btns">
                <view class="btn-normal" @click="goMall">
                    返回商城
                </view>
                <view class="btn-confirm" @click="goOrder">
                    查看订单
                </view>
            </view>
        </view>
    </vc-container>
</template>

<script>
    export default {
        name: 'exchangeSuccess',
        data() {
            return {
                orderId: '',// 订单号
                containerProp: {
                    props: {
                        isFullScreen: {
                            value: true
                        },
                        containerBackground: {
                            value: 'white'
                        }
                    }
                }
            }
        },
        onLoad(options) {
            this.orderId = options.orderId
        },
        methods: {
            goMall() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/index/index`,
                    openType: 'reLaunch'
                })
            },
            goOrder() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/orderDetail?orderId=${this.orderId}`,
                    openType: 'reLaunch'
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
.top {
    padding: 96rpx 0 0;
    margin: 0 auto;
    text-align: center;
    image {
        width: 260rpx;
        height: 248rpx;
    }
}
.btns {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    bottom: 70rpx;
    left: 0;
    right: 0;
    .btn-normal {
        width: 328rpx;
        height: 84rpx;
        text-align: center;
        color: #999999;
        line-height: 84rpx;
        font-size: 32rpx;
        border-radius: 42rpx;
        border: 2rpx solid #999999;
    }
    .btn-confirm {
        width: 328rpx;
        height: 84rpx;
        text-align: center;
        color: white;
        line-height: 84rpx;
        font-size: 32rpx;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
        border-radius: 42rpx;
    }
}
</style>