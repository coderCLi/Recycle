<!--
 * @Description: 售后协商记录
 * @Autor: TF
 * @Date: 2025-07-24 11:39:35
 * @LastEditors: TF
 * @LastEditTime: 2025-08-30 10:13:22
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container" :props-data="{props: {isFullScreen: {value: true}}}">
        <template v-if="afterSaleFlow.length > 0">
            <view class="flow">
                <view class="flow-title">协商记录</view>
                <!-- <view class="flow-item" v-for="(item, index) in afterSaleFlow" :key="index">
                    <view class="flow-item_title">{{ item.nodeName }}</view>
                    <view class="flow-item_time">时间：{{ item.operateTime }}</view>
                    <view class="flow-item_time">备注：{{ item.remark }}</view>
                </view> -->
                <view class="flow-col" v-for="(item, index) in afterSaleFlow" :key="index">
                    <up-icon v-if="item.nodeType == 'REFUSE'" name="close-circle" size="30" style="z-index: 9;" color="#FF583A"/>
                    <up-icon v-else name="checkmark-circle" size="30" style="z-index: 9;" color="#00BCB8"/>
                    <view class="flow-col_content">
                        <view class="flow-col_content--top">
                            <view class="title">{{ item.nodeName }}</view>
                            <view class="time">{{ item.operateTime }}</view>
                        </view>
                        <view class="flow-col_content--bottom">
                            <!-- 提交申请/冲in需提交(退款、退货) -->
                            <template v-if="item.nodeType == 'APPLY' || item.nodeType == 'REAPPLY'">
                                <view class="desc">
                                    <view>退款原因</view>
                                    <view>{{ item._applyInfo.reason }}</view>
                                </view>
                                <view class="desc" v-if="item._applyInfo.description">
                                    <view>退款说明</view>
                                    <view>{{ item._applyInfo.description }}</view>
                                </view>
                                <view class="desc">
                                    <view>退款金额</view>
                                    <view>¥ {{ afterSaleInfo.refundAmount }}</view>
                                </view>
                                <view class="desc" v-if="item.imageShowUrls && item.imageShowUrls.length > 0">
                                    <view>退款凭证</view>
                                    <view style="color: #00BCB8;" @click="previewImg(item)">点击查看</view>
                                </view>
                            </template>
                            <!-- 驳回-->
                            <template v-if="item.nodeType == 'REFUSE'">
                                <view class="desc">
                                    <view>拒绝原因</view>
                                    <view>{{ item.remark }}</view>
                                </view>
                            </template>
                        </view>
                    </view>
                </view>
            </view>
        </template>
        <vc-empty v-else :props-data="{props: {text: {value: '暂无协商记录'}}}"></vc-empty>
    </vc-container>
</template>

<script>
    import {
        afterSaleDetail,// 售后单详情
    } from '../api/index'
    export default {
        name: 'afterSaleFlow',
        data() {
            return {
                afterSalesId: '',// 售后ID
                afterSaleInfo: {},// 售后信息
                afterSaleFlow: [],// 售后流水（协商记录）
                current: 0,// 当前步骤
            }
        },
        onLoad(options) {
            this.afterSalesId = options.afterSalesId
            this.getAfterSalesDetail()
        },
        onPullDownRefresh() {
            this.getAfterSalesDetail()
            setTimeout(() => {
                uni.stopPullDownRefresh()
            }, 500)
        },
        methods: {
            // 详情
            getAfterSalesDetail() {
                afterSaleDetail({
                    afterSalesId: this.afterSalesId
                }).then(res=>{
                    this.afterSaleInfo = {...res}
                    this.afterSaleFlow = [...res.afterSaleFlowsResqBos].reverse().map(e=>({
                        ...e,
                        _applyInfo: this.bridgeSdk.checkIsEmpty(e.applyInfo) ? JSON.parse(e.applyInfo) : {},
                    }))
                })
            },
            // 查看凭证
            previewImg(e) {
                if(!e.imageShowUrls || e.imageShowUrls.length == 0) {
                    this.bridgeSdk.showToast({
                        title: '无退款凭证'
                    })
                    return
                }
                uni.previewImage({
                    current: 0,
                    urls: [...e.imageShowUrls.map(e => this.minioBaseUrl + e)]
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
.flow {
    width: calc(690rpx - 60rpx);
    margin: 20rpx auto;
    padding: 20rpx 30rpx 20rpx;
    background-color: white;
    border-radius: 20rpx;
    &-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        padding:0 0 20rpx;
        border-bottom: 2rpx solid #d0d0d0;
        margin-bottom: 20rpx;
    }
    &-item {
        width: calc(690rpx - 60rpx);
        padding: 20rpx 30rpx;
        background-color: white;
        border-radius: 12rpx;
        margin: 20rpx auto 0;
        &_title {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
        }
        &_time {
            font-size: 26rpx;
            color: #999;
            margin-top: 10rpx;
        }
    }
    &-col {
        display: flex;
        align-items: flex-start;
        position: relative;
        &:last-of-type::before {
            content: '';
            border-left: none;
        }
        &::before {
            content: '';
            border-left: 2rpx solid #d0d0d0;
            position: absolute;
            left: 28rpx;
            top: 50rpx;
            bottom: 0;
            height: calc(100% - 48rpx);
            z-index: 1;
        }
        &:last-of-type &_content {
            padding-bottom: 20rpx;
        }
        &_content {
            flex: 1;
            margin-left: 10rpx;
            padding: 0 0 80rpx;
            margin-top: 8rpx;
            &--top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .title {
                    font-size: 26rpx;
                    color: #333;
                    font-weight: bold;
                }
                .time {
                    font-size: 24rpx;
                    color: #999;
                }
            }
            &--bottom {
                margin-top: 10rpx;
                .desc{
                    color: #999;
                    font-size: 24rpx;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    width: 100%;
                    line-height: 44rpx;
                    view:last-of-type{
                        margin-left: 20rpx;
                    }
                }
            }
        }
    }
}
</style>