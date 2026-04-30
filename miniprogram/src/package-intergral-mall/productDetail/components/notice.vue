<!--
 * @Description: 购买须知组件
 * @Autor: TF
 * @Date: 2025-06-25 09:11:50
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-16 10:15:45
-->
<template>
    <view class="purchase-notice" v-if="detailList">
        <view class="purchase-notice-title">购买须知</view>
        
        <!-- 有效期 -->
        <view class="notice-item" v-if="detailList.validityPeriod">
            <view class="notice-item-header">
                <image class="notice-icon" :src="minioBaseUrl + '/common/mctImages/icon-yxq.png'" mode="aspectFit"/>
                <text class="notice-item-title">有效期</text>
            </view>
            <view class="notice-item-content">{{detailList.validityPeriod.indexOf('~') < 0? "购买之后":""}}{{ detailList.validityPeriod =='0'?'当':detailList.validityPeriod }}{{detailList.validityPeriod.indexOf('~') < 0? "天有效":""}}</view>
        </view>
        
        <!-- 可用时间 -->
        <view class="notice-item" v-if="detailList.availableTime">
            <view class="notice-item-header">
                <image class="notice-icon" :src="minioBaseUrl + '/common/mctImages/icon-kysj.png'" mode="aspectFit"/>
                <text class="notice-item-title">可用时间</text>
            </view>
            <view class="notice-item-content">{{ detailList.availableTimeName }}</view>
        </view>
        
        <!-- 适用人群 -->
        <view class="notice-item" v-if="detailList.targetAudience">
            <view class="notice-item-header">
                <image class="notice-icon" :src="minioBaseUrl + '/common/mctImages/icon-syrq.png'" mode="aspectFit"/>
                <text class="notice-item-title">适用人群</text>
            </view>
            <view class="notice-item-content">{{ detailList.targetAudienceName }}</view>
        </view>
        
        <!-- 预约规则 -->
        <view class="notice-item" v-if="detailList.bookingRules">
            <view class="notice-item-header">
                <image class="notice-icon" :src="minioBaseUrl + '/common/mctImages/icon-yygz.png'" mode="aspectFit"/>
                <text class="notice-item-title">预约规则</text>
            </view>
            <view class="notice-item-content">{{ detailList.bookingRulesName }}</view>
        </view>
        
        <!-- 使用方式 -->
        <view class="notice-item" v-if="detailList.usageMethod">
            <view class="notice-item-header">
                <image class="notice-icon" :src="minioBaseUrl + '/common/mctImages/icon-syfs.png'" mode="aspectFit"/>
                <text class="notice-item-title">使用方式</text>
            </view>
            <view class="notice-item-content">{{ detailList.usageMethodName }}</view>
        </view>
        
        <!-- 其他规则 -->
        <view class="notice-item" v-if="otherRulesList">
            <view class="notice-item-header">
                <image class="notice-icon" :src="minioBaseUrl + '/common/mctImages/icon-qtgz.png'" mode="aspectFit"/>
                <text class="notice-item-title">其他规则</text>
            </view>
            <view v-for="(item, index) in otherRulesList" :key="index" class="notice-item-content">
               {{index+1}}.<text>{{ item.optName }}</text> 
            </view>
        </view>
    </view>
</template>

<script>

export default {
    name: 'Notice',
    props: {
        detailList: {
            type: Object,
            default: () => ({})
        },
        staticBaseUrl: {
            type: String,
            default: ''
        },
        otherRulesList: {
            type: Array,
            default: () => []
        },
    }
}
</script>

<style lang="scss" scoped>
/* 购买须知样式 */
.purchase-notice {
    padding: 30rpx 30rpx;
    background-color: white;
    margin-top: 20rpx;
    border-radius: 20rpx;
    margin-bottom: 140rpx;
    
    &-title {
        font-weight: 600;
        font-size: 32rpx;
        color: #000000;
        margin-bottom: 5rpx;
        text-align: left;
    }
    
    .notice-item {
        padding: 28rpx 0;
        position: relative;
        &:not(:last-child)::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 40rpx;
            right: 0;
            height: 2rpx;
            background-color: #F1F1F1;
        }
        
        &-header {
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;
        }
        
        &-title {
            font-weight: 500;
            font-size: 28rpx;
            color: #000000;
            line-height: 28rpx;
            margin-left: 12rpx;
        }
        
        &-content {
            font-weight: 400;
            font-size: 26rpx;
            color: #666666;
            line-height: 36rpx;
            margin-left: 40rpx;
            margin-bottom: 5rpx;
        }
        
        .notice-icon {
            width: 28rpx;
            height: 28rpx;
            flex-shrink: 0;
        }
    }
}
</style>
