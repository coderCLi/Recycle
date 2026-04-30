<template>
    <vc-modal ref="modal" />
    <vc-container>
        <view class="refund">
            <view class="refundTabs">
                <up-tabs :list="refundStatusList" @click="refundTabsClick" :scrollable="false"></up-tabs>
            </view>
            <scroll-view scroll-y @scrolltolower="scrolltolower" v-if="refundList && refundList.length" :style="{
                height:
                    'calc(100vh - ' +
                    (navigationBarInfo.statusBarHeight +
                        navigationBarInfo.navigationBarHeight) +
                    'px - 100rpx)',
            }">
                <view v-for="(item, index) in refundList" :key="index">
                    <view class="refund-item" v-if="refundStatus == '00'">
                        <view class="refund-item-row">{{ item.bizOrderId }}</view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                {{ item.bizSceneName }}
                            </view>
                            <view class="refund-item-row-right">
                                {{ item.goodsName }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                {{ item.payChnl }}
                            </view>
                            <view class="refund-item-row-right">
                                ￥{{ item.payAmt }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                购买时间：{{ item.createTime }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view> </view>
                            <view class="refund-item-row-btn" @click="refund(item)">申请退款</view>
                        </view>
                    </view>
                    <view class="refund-item" v-if="refundStatus == '02'">
                        <view class="refund-item-row">{{ item.bizOrderId }}</view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                {{ item.bizSceneName }}
                            </view>
                            <view class="refund-item-row-right">
                                {{ item.goodsName }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                {{ item.payChnl }}
                            </view>
                            <view class="refund-item-row-right">
                                <text class="refund-item-row-right-title">付款金额：</text>￥{{ item.payAmt }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                            </view>
                            <view class="refund-item-row-right">
                                <text class="refund-item-row-right-title">退款金额：</text>￥{{ item.refundAmt }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                购买时间：{{ item.createTime }}
                            </view>
                        </view>
                        <view class="refund-item-row">
                            <view class="refund-item-row-left">
                                退款时间：{{ item.refundTime }}
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <vc-empty v-else> </vc-empty>

        </view>
    </vc-container>
</template>

<script>
import { mapState } from 'pinia'
import { useBaseStore, useUserStore, useMctStore } from "@/store/index"
import { getOrderListToRefund, refundOrder } from "../api/index"
export default {
    computed: {
        ...mapState(useUserStore, {
            isLogined: "isLogined"
        }),
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            mctId: "",
            page: 1,
            rows: 10,
            refundStatus: "",
            refundStatusList: [
                {
                    name: "未退款",
                    value: "00"
                },
                {
                    name: "已退款",
                    value: "02"
                },
            ],
            refundList: [],
            total: 0,
        }
    },
    onLoad(options) {
        this.mctId = options.mctId
        this.getRefundList()
    },
    methods: {
        refundTabsClick(item) {
            if (this.refundStatus == item.value) {
                return
            }
            this.refundStatus = item.value
            this.page = 1
            this.getRefundList()
        },
        scrolltolower() {
            if (this.refundList.length >= this.total) return
            this.page += 1
            this.getRefundList()
        },
        async getRefundList() {
            if (this.page == 1) {
                this.refundList = []
                this.total = 0
            }
            if (!this.refundStatus) {
                this.refundStatus = "00"
            }
            const res = await getOrderListToRefund({
                mctId: this.mctId,
                page: this.page,
                rows: this.rows,
                refundStatus: this.refundStatus
            })
            console.log(res)
            this.total = res.total
            if (this.page == 1) {
                this.refundList = res.list
            }
            else {
                this.refundList = this.refundList.concat(res.list)
            }
        },
        async refund(item) {
            const res = await refundOrder({
                orderId: item.id,
                mctId: this.mctId,
            })
            console.log(res)
            this.$refs.modal.open({
                type: "alert",
                title: "退款成功",
                content: "退款成功",
                confirmText: "确定",
                confirmCallback: () => {
                    this.getRefundList()
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.refund {
    width: 750rpx;
    margin: 0 auto;

    .refundTabs {
        width: 100%;
        height: 100rpx;
        background: #ffffff;
    }

    .refund-item {
        width: 710rpx;
        background: #ffffff;
        box-sizing: border-box;
        padding: 20rpx 30rpx;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        margin: 0 auto 20rpx;

        .refund-item-row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 10rpx;
            color: #999999;
            font-size: 24rpx;

            .refund-item-row-left {
                font-size: 28rpx;
                color: #666666;
            }

            .refund-item-row-right {
                font-size: 32rpx;
                color: #333333;
                font-weight: 700;
                .refund-item-row-right-title{
                    font-size: 24rpx;
                    color: #666666;
                    font-weight: 400;
                }
            }

            .refund-item-row-btn {
                padding: 10rpx 20rpx;
                background: #ff5871;
                color: #ffffff;
                font-size: 24rpx;
                border-radius: 8rpx;

            }
        }
    }
}
</style>