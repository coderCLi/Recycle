<!--
 * @Description: 券码使用记录
 * @Autor: TF
 * @Date: 2025-07-26 10:05:58
 * @LastEditors: TF
 * @LastEditTime: 2025-07-26 11:19:25
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container">
        <view class="cop-use">
            <template v-if="list.length > 0">
                <view class="item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
                    <view class="flex">
                        <view style="font-weight: bold;width: 20%;">使用时间</view>
                        <view>{{ item.updateTime }}</view>
                    </view>
                    <view class="flex">
                        <view style="font-weight: bold;width: 20%;">使用门店</view>
                        <view>{{ item.storeName }}</view>
                    </view>
                    <view class="flex">
                        <view style="font-weight: bold;width: 20%;">使用券数</view>
                        <view>1张</view>
                    </view>
                    <view class="flex">
                        <view style="font-weight: bold;width: 20%;">使用券码</view>
                        <view>{{ item.userGetId }}</view>
                    </view>
                </view>
            </template>
            <vc-empty v-else></vc-empty>
        </view>
    </vc-container>
</template>

<script>
    import { 
        getCouponUseList,// 券码使用记录
    } from '../api/index'
    export default {
        name: 'copUseFlow',
        data() {
            return {
                list: [],// 列表
                total: 0,// 总数
                page: 1,// 页
                rows: 10,// 行
            }
        },
        onPullDownRefresh() {
            this.page = 1
            this.list = []
            this.getList()
            setTimeout(_=>{
                uni.stopPullDownRefresh()
            }, 1000)
        },
        onReachBottom() {
            console.log('onReachBottom')
            if(this.total <= this.list.length) return
            this.page += 1
            this.getList()
        },
        onLoad(options) {
            this.couponBaseId = options.couponBaseId
            this.getList()
        },
        methods: {
            //获取列表
            getList(){
                getCouponUseList({
                    couponBaseId: this.couponBaseId,
                    getStatus: '1',
                    page: this.page,
                    rows: this.rows
                }).then(res => {
                    this.list = res.list;
                    this.total = res.total;
                })
            },
            // 跳转详情
            goDetail(item) {
                this.bridgeSdk.jumpPage({
                    url: `/package-cards-platform/card/writeOffDetail?verificationFlowId=${item.verificationFlowId}`
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
:deep(.page-content) {
    background-color: #f5f6f8;
}
.cop-use {
    padding: 20rpx 0;
    .item {
        border-radius: 12rpx;
        background-color: white;
        margin: 0 auto 20rpx;
        width: calc(690rpx - 60rpx);
        padding: 20rpx 30rpx;
        font-size: 26rpx;
        line-height: 40rpx;
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    }
}
</style>