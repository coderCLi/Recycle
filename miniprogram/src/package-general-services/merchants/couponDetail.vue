<!--
 * @Description: 优惠券详情
 * @Autor: TF
 * @Date: 2025-05-15 15:35:22
 * @LastEditors: TF
 * @LastEditTime: 2025-05-23 10:07:51
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="propsData" style="background-color: #f8f8f8;">
        <!-- <view v-if="bridgeSdk.checkIsEmpty(couponInfo.photoUrl)" style="width: 100%;height: 400rpx;"></view> -->
        <image :src="minioBaseUrl + couponInfo.photoUrl" @click="previewImg" mode="aspectFill"/>
        <!-- 优惠券信息 -->
        <view class="coupon" :style="{marginTop: '-80rpx'}">
            <up-skeleton rows="1" :loading="isLoading">
                <view style="padding-bottom: 10rpx;">
                    <view class="coupon-title">{{ couponInfo.couponBaseName }}</view>
                    <view class="coupon-amt" v-if="couponInfo.couponBaseType && couponInfo.couponBaseType != '01'">¥{{ couponInfo.disAmt }}</view>
                </view>
                <view class="coupon-item" style="padding-top: 10rpx;border-top: 2rpx dashed #f8f8f8;">
                    <!-- <view class="coupon-item_title">优惠力度</view> -->
                    <view class="coupon-item_text" v-if="couponInfo.couponBaseType && couponInfo.couponBaseType != '01'">
                            满{{ couponInfo.disAllAmt }}元可用，优惠{{ couponInfo.disAmt }}元
                    </view>
                </view>
                <view class="coupon-item">
                    <!-- <view class="coupon-item_title">限制</view> -->
                    <view class="coupon-item_text" v-if="couponInfo.isSuperposition == '0'">
                        不可叠加使用
                        <text v-if="couponInfo.couponBaseType != '01'">（最高优惠{{ couponInfo.disMaxAmt }}元）</text>
                    </view>
                    <view class="coupon-item_text" v-if="couponInfo.isSuperposition == '1'">
                        商品单次可叠加{{ couponInfo.superpositionMaxNum }}张
                        <text v-if="couponInfo.couponBaseType != '01'">（最高优惠{{ couponInfo.disMaxAmt }}元）</text>
                    </view>
                </view>
            </up-skeleton>
        </view>
        <!-- 使用说明 -->
        <view class="info">
            <view class="info-title">使用规则</view>
            <view class="info-content">
                <view class="info-content_item">
                    <view class="info-content_item--title">
                        <up-icon name="calendar" style="margin-right: 8rpx"/>有效期
                    </view>
                    <up-skeleton :title="false" rows="1" :loading="isLoading">
                        <view class="info-content_item--value" v-if="couponInfo.useTimeMode == '1'">
                            自领取日起 {{ couponInfo.useTimeout }} 天有效
                        </view>
                        <view class="info-content_item--value" v-if="couponInfo.useTimeMode == '2'">
                            {{ couponInfo.useStartTime }} 至 {{ couponInfo.useEndTime }}
                        </view>
                    </up-skeleton>
                </view>
                <!-- <view class="info-content_item">
                    <view class="info-content_item--title">
                        <up-icon name="clock" style="margin-right: 8rpx"/>使用时间
                    </view>
                    <view class="info-content_item--value">
                        {{ mctInfo.businessHoursChange }}
                    </view>
                </view> -->
                <!-- <view class="info-content_item">
                    <view class="info-content_item--title">
                        <up-icon name="info-circle" style="margin-right: 8rpx"/>领取限制
                    </view>
                    <view class="info-content_item--value">
                        单日领取上限 {{ couponInfo.getDayNum }} 张，累计领取上限 {{ couponInfo.getMaxNum }} 张
                    </view>
                </view> -->
                <view class="info-content_item" v-if="couponInfo.isUseMax == '1'">
                    <view class="info-content_item--title">
                        <up-icon name="info-circle" style="margin-right: 8rpx"/>使用限制
                    </view>
                    <view class="info-content_item--value">
                        单用户仅限使用 {{ couponInfo.useMaxNum }} 张
                    </view>
                </view>
                <!-- <view class="info-content_item">
                    <view class="info-content_item--title">
                        <up-icon name="info-circle" style="margin-right: 8rpx"/>优惠力度
                    </view>
                    <view class="info-content_item--value">
                        满 {{ couponInfo.disAllAmt }} 元可用，优惠 {{ couponInfo.disAmt }} 元，最高优惠 {{ couponInfo.disMaxAmt }} 元
                    </view>
                </view> -->
                <view class="info-content_item">
                    <view class="info-content_item--title">
                        <up-icon name="question-circle" style="margin-right: 8rpx"/>使用说明
                    </view>
                    <up-skeleton :title="false" rows="3" :loading="isLoading">
                        <u-parse style="font-size: 24rpx;" :content="bridgeSdk.addMinioPrefixToImgSrc(couponInfo.remark)"></u-parse>
                    </up-skeleton>
                </view>
            </view>
        </view>
        <!-- 底部操作按钮 -->
        <view class="btn" @click="getCoupon">立即领取</view>
        <!-- <vc-safe-bottom /> -->
    </vc-container>
</template>
<script>
import { 
    getComponentBaseInfo, //优惠券详情
    receiveCpnTicket,// 领取优惠券
    getMctBusinessInfo,// 商家信息
} from '../api/baseServices'
export default {
    name: "couponDetail",
    data() {
        return {
            // 层级是固定写法
            propsData: {
                props: {
                    isFullScreen:{
                        value: true
                    }
                },
            },
            couponBaseId: '',// 优惠券ID
            mctId: '',//放心消费商家id
            displayId: '',//券规则ID
            couponInfo: {},// 优惠券信息
            mctInfo: {},// 商家信息
            isLoading: true
        }
    },
    onLoad(options) {
        this.couponBaseId = options.couponBaseId;
        this.mctId = options.mctId;//商家id
        this.displayId = options.displayId;//券规则ID
        this.getInfo();
        this.getMctInfo()
    },
    methods: {
        //获取卡券信息
        getInfo() {
            // 获取卡券详情
            getComponentBaseInfo({ 
                couponBaseId: this.couponBaseId 
            },{
                catchError: true
            }).then(res => {
                this.couponInfo = res
                this.isLoading = false
            }).catch(error=>{
                console.log('领券返回的结果', error);
                let _clock = setTimeout(_=>{
                    this.bridgeSdk.navigateBackTo({
                        delta: 1
                    });
                    clearTimeout(_clock)
                }, 2100)
                uni.showToast({
                    title: `${error.message}`,
                    icon: 'none',
                    duration: 2000
                });
            })
        },
        // 获取商家信息
        getMctInfo() {
            getMctBusinessInfo({
                mctId: this.mctId,
            }).then(res=>{
                this.mctInfo = res[0]
            })
        },
        // 领取优惠券
        getCoupon() {
            receiveCpnTicket({
                couponBaseId: this.couponInfo.couponBaseId,//优惠券编号
                displayId: this.displayId,
                chnlFlag:'0',
                mctId: this.mctInfo.payMctId,
                shopsId: this.mctInfo.payStoreId
            }).then(res => {
                this.bridgeSdk.showToast({
                    title: '领取成功'
                })
                setTimeout(_=>{
                    this.bridgeSdk.navigateBackTo({
                        delta: 1
                    });
                }, 2000)
            })
        },
        //查看图片
        previewImg() {
            uni.previewImage({
                urls: [this.minioBaseUrl + this.couponInfo.photoUrl],
                current: 0
            })
        }
    }
}
</script>

<style lang="scss" scoped>
image{
    width:  100%;
    height: 400rpx;
}
.coupon {
    width: 640rpx;
    margin: -80rpx auto 20rpx;
    padding: 20rpx 30rpx;
    border-radius: 10rpx;
    background-color: white;
    z-index: 9;
    position: relative;
    // background: radial-gradient(circle at 0%, transparent 15rpx, white 0) center top / 100% 0% no-repeat,
    //             radial-gradient(circle at 100%, transparent 15rpx, white 0) center bottom / 100% 100% no-repeat;
    line-height: 55rpx;
    &-title{
        font-size: 34rpx;
        font-weight: bold;
    }
    &-amt{
        font-size: 32rpx;
        font-weight: bold;
        color: #10c2b7;
        &::first-letter {
            font-size: 24rpx;
            margin-right: 5rpx;
        }
    }
    &-item{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 24rpx;
        line-height: 45rpx;
        &_title{
            width: 20%;
        }
        &_text{
            color: gray;
        }
    }
}
.info {
    width: 700rpx;
    margin: 20rpx auto 200rpx;
    &-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-left: 30rpx;
        margin: 0 0 20rpx 10rpx;
    }
    &-content {
        background-color: white;
        border-radius: 20rpx;
        padding: 0rpx 30rpx;

        &_item{
            line-height: 50rpx;
            border-bottom: 2rpx dashed #f8f8f8;
            padding: 20rpx 0;
            &--title{
                font-size: 28rpx;
                font-weight: bold;
                display: flex;
                align-items: center;
                margin-left: -8rpx;
            }
            &--value{
                font-size: 24rpx;
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
}
.btn {
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    border-radius: 40rpx;
    width: 650rpx;
    height: 80rpx;
    color: white;
    text-align: center;
    line-height: 80rpx;
    margin: 0 auto;
    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
}
</style>