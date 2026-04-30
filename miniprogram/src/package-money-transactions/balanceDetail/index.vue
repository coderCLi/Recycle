<template>
    <vc-modal ref="modal"> </vc-modal>
    <vc-container :props-data="{ props: { title: { value: '余额明细' }, isFullScreen: { value: true } } }">
        <scroll-view scroll-y class="balance_detail" :style="{ height: '100%' }" @scrolltolower="onScrollToLower">
            <vc-empty v-if="balanceDetailList.length == 0"></vc-empty>
            <view v-else class="list">
                <view v-for="(item, index) in balanceDetailList" :key="index" class="item">
                    <view class="item_left">
                        <image class="item_left_img"
                            :src="minioBaseUrl + 'common/mctImages/' + (item.bizType == 1 ? 'yuemingxi_icon_weixinpayment_img.png' : 'yuemingxi_icon_hipayment_img.png')"
                            mode="scaleToFill" />
                    </view>
                    <view class="item_right">
                        <view class="item_right_top">
                            <view class="item_right_top_left">{{ item.bizType == 1 ? '充值' : '消费' }}</view>
                            <view class="item_right_top_right" v-if="item.bizType == 1">+{{ (Number(item.origAmtInc) +
                                Number(item.giftAmtInc)).toFixed(2) }}</view>
                            <view class="item_right_top_right" v-if="item.bizType == 2">-{{ (Number(item.origAmtDec) +
                                Number(item.giftAmtDec)).toFixed(2) }}</view>
                        </view>
                        <view class="item_right_bottom">
                            <view class="item_right_bottom_left">{{ item.createTime }}</view>
                            <view class="item_right_bottom_right">零钱余额：{{ item.finalTotalBal }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </vc-container>
</template>

<script>
import { getBalanceDetail } from "../api/index"
export default {
    data() {
        return {
            balanceDetailList: [],
            page: 1,
            rows: 20,
            bizType: '', // 业务类型 充值1消费2
            total: 0,
        }
    },
    onLoad() {
        this.getBalanceDetail()
    },
    methods: {
        onScrollToLower(){
            if(this.balanceDetailList.length < this.total){
                this.page += 1
                this.getBalanceDetail()
            }
        },
        getBalanceDetail() {
            getBalanceDetail({
                page: this.page,
                rows: this.rows,
                bizType: this.bizType,

            }).then(res => {
                if(this.page == 1){
                    this.balanceDetailList = res.list
                }else{
                    this.balanceDetailList = this.balanceDetailList.concat(res.list)
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.balance_detail {
    width: 750rpx;
    padding: 26rpx 20rpx 60rpx;
    box-sizing: border-box;

    .list {
        width: 100%;
        border-radius: 12rpx;
        overflow: hidden;

        .item {
            width: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 36rpx 48rpx 32rpx 46rpx;
            margin-bottom: 2rpx;
            background: #fff;


            .item_left {
                width: 76rpx;
                height: 76rpx;
                margin-right: 22rpx;
                border-radius: 50%;
                overflow: hidden;

                .item_left_img {
                    width: 100%;
                    height: 100%;
                }
            }

            .item_right {
                flex: 1;

                .item_right_top {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .item_right_top_left {
                        font-weight: 800;
                        font-size: 28rpx;
                        color: #0E0101;
                        line-height: 40rpx;
                    }

                    .item_right_top_right {
                        font-weight: 400;
                        font-size: 26rpx;
                        color: #110901;
                        line-height: 36rpx;
                    }
                }

                .item_right_bottom {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .item_right_bottom_left {
                        font-weight: bold;
                        font-size: 20rpx;
                        color: #919090;
                        line-height: 28rpx;
                    }

                    .item_right_bottom_right {
                        font-weight: bold;
                        font-size: 22rpx;
                        color: #919090;
                        line-height: 32rpx;
                    }
                }
            }
        }
    }
}
</style>