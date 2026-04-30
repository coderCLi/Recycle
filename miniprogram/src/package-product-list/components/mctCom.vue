<template>
    <view class="mct-com">

    <image :src="minioBaseUrl + info.listPicUrl" mode="scaleToFill"></image>
    <view class="scroll-box">
        <view class="scroll-info-title">
            <text class="scroll-info-title-text">{{ info.storeName }}</text>
        </view>
        <view class="scroll-info-category">
            <view>暂无评分</view>
        </view>
        <view class="scroll-info-address" :style="`${info.ticketList ? info.ticketList.length == 0 ? 'margin-top: 60rpx;' : '' : 'margin-top: 0rpx;'}`">
            <view class="ellipsis scroll-info-address-view" :style="`${isLocationFail ? 'max-width: none;' : ''}`">
                {{ info.provinceName }}{{ info.cityName }}{{ info.areaName }}{{ info.storeAddress}}
            </view>
        </view>

        <view class="scroll-info-card" v-if="info.labelName">
            <text class="scroll-info-card-text" v-for="info in info.labelAll" :key="info">{{ info }}</text>
        </view>

        <view class="scroll-info-Offer" v-if="info.ticketList">
            <view class="scroll-info-Offer-text" v-for="(item, index) in info.ticketList.slice(0, 2)" :key="index"><span class="offer-head">券</span><span style="color: #FF8715; padding: 0rpx 10rpx;width: 180rpx;" class="e">{{item.couponBaseName}}</span></view>
        </view>
    </view>

        <!-- <view class="scroll-timey" v-if="info.isBusiness == '0'">休息中</view> -->
        <view class="scroll-time" v-if="info.isBusiness == '1'">营业中</view>
        <view class="scroll-timey" v-if="info.isBusiness == '0'">休息中</view>
    </view>
</template>

<script>
export default {
    name: "mctCom",
    props: {
        info: {
            type: Object,
            default: () => ({}),
        },
        // 外界不传值，默认是要显示的
        isLocationFail: {
            type: Boolean,
            default: () => (false)
        }
    }
};
</script>

<style scoped lang="scss">
.mct-com {
    display: flex;
    position: relative;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.1);
    background-color: white;
    padding: 28rpx 10rpx 28rpx 24rpx;
    border-radius: 20rpx;
    image{
        width: 200rpx;
        height: 180rpx;
        margin-right: 24rpx;
        background: #ccc;
        border-radius: 20rpx;
        flex-shrink: 0;
    }
    .scroll-box{
        .scroll-info-title {
            .scroll-info-title-text {
                width: 320rpx;
                font-weight: bold;
                font-size: 28rpx;
                color: #333333;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1; //显示几行
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 50rpx;
            }
        }

        .scroll-info-category {
            display: flex;
            font-size: 24rpx;
            color: #FF8715;
            // font-weight: 400;
            // font-size: 24rpx;
            // color: #999999;

            // .scroll-info-category-text {
            //   line-height: 45rpx;
            //   display: -webkit-box;
            //   -webkit-box-orient: vertical;
            //   -webkit-line-clamp: 1; //显示几行
            //   overflow: hidden;
            //   text-overflow: ellipsis;
            // }
        }

        .scroll-info-address {
            width: 410rpx;
            display: flex;
            justify-content: space-between;
            font-weight: 400;
            font-size: 24rpx;
            color: #999999;
            line-height: 45rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            .scroll-info-address-view {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #999999;
                    // max-width: 60%!important;
            }

            .scroll-info-address-text {
                font-weight: 400;
                font-size: 24rpx;
                color: #999999;
            }
        }

        .scroll-info-card {
            margin: 2rpx;
            .scroll-info-card-text {
                background: #ffffff;
                border-radius: 6rpx;
                border: 2rpx solid #FF8715;
                font-weight: 400;
                font-size: 20rpx;
                color: #FF8715;
                margin-left: 16rpx;
                padding: 2rpx 10rpx;
                display: inline-block;
            }

            .scroll-info-card-text:first-child {
                margin-left: 0 !important;
            }
        }


        .scroll-info-Offer{
            margin-top: 12rpx;
            display: flex;
            .scroll-info-Offer-text{
                display: flex;
                width:190rpx;
                height: 40rpx;
                border-radius: 9rpx;
                border: 1rpx solid #FF8714;
                font-size: 20rpx;
                margin-right: 10rpx;
                line-height: 40rpx;
                .offer-head{
                    display: inline-block;
                    border-radius: 9rpx 0 0 9rpx;
                    padding: 0 10rpx;
                    color: #fff;
                    background: #FF8714;
                    height: 40rpx;
                }
            }
        }

    }
    .scroll-time{
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        color: #00BCB8;
        font-size: 24rpx;
    }
    .scroll-timey{
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        color: #FF1D1D;
        font-size: 24rpx;
    }
    .e {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        color:#FF8714;
    }

}
</style>