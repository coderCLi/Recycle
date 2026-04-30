<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="payment_record">
        <view class="payment_record_bg"></view>
        <psd-header class="header" title="消费记录" desc="您可以查询消费记录"
            iconUrl="/common/mctImages/xiaofeijilu_top_icon_style03_img.png"></psd-header>
        <view class="record_box">
            <image class="record_header" :src="minioBaseUrl + 'common/mctImages/topimg_xiaofeijilu_img.png'"
                mode="scaleToFill" />
            <scroll-view scroll-y class="record_list" @scrolltolower="onScrollToLower">
                <vc-empty v-if="recordList.length == 0" text="暂无记录"></vc-empty>
                <view class="record_item" v-for="(item, index) in recordList" :key="index" @click="jumpDetail(item)">
                    <view class="record_item_header">
                        <view class="record_item_header_left">
                            <image class="record_item_header_img"
                                :src="minioBaseUrl + 'common/mctImages/icon_shanghu_img.png'" mode="scaleToFill" />
                            {{ item.mchName }}
                        </view>
                        <view class="record_item_header_right" v-if="item.refundStatus == '02'">已退款</view>
                    </view>
                    <view class="record_item_body">
                        <view class="record_item_body_left">
                            <text class="font_30 col_black">{{ item.goodsName }}</text>
                        </view>
                        <view class="record_item_body_right">
                            <text class="font_30">{{ item.bizSceneName }}</text>
                        </view>
                    </view>
                    <view class="record_item_body">
                        <view class="record_item_body_left">
                            订单金额：
                            <text class="font_24 col_black">￥</text>
                            <text class="font_30 col_black">{{ item.orderAmt }}</text>
                        </view>
                        <view class="record_item_body_right">
                            支付金额：
                            <text class="font_24 col_red">￥</text>
                            <text class="font_30 col_red">{{ item.payAmt }}</text>
                        </view>
                    </view>
                    <view class="record_item_footer">
                        <text>{{ item.createTime }}</text>
                        <text class="font_weight font_24">{{ item.payChnl }}</text>
                    </view>
                    <view class="record_item_line" v-if="index < recordList.length - 1"></view>
                </view>
            </scroll-view>
        </view>
    </view>


</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
import psdHeader from '../components/psdHeader.vue';
import { getUserOrderList } from "../api/index"
export default {
    components: { psdHeader },
    computed: {
        ...mapState(useUserStore, {
            isLogined: "isLogined",
            userInfo: "userInfo",
        }),
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            page: 1,
            rows: 10,
            recordList: [],
        }
    },
    onLoad() {
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
            return;
        }
        this.__loadData__();
        // if (!this.isLogined) {
        //     this.$refs.modal.open({
        //         title: '提示',
        //         content: '请先登录',
        //         showCancel: false,
        //         confirmText: '确定',
        //         confirmCallback: () => {
        //             uni.switchTab({
        //                 url: "/pages/mine/mine"
        //             })
        //         }
        //     })
        //     return;
        // }
        // this.getUserOrderList();
    },
    methods: {
        __loadData__() {
            this.getUserOrderList();
        },
        onScrollToLower() {
            console.log("onScrollToLower");
            if (this.total > 0 && this.recordList.length < this.total) {
                this.page += 1;
                this.getUserOrderList();
            }
        },
        getUserOrderList() {
            console.log("getUserOrderList");
            getUserOrderList({
                page: this.page,
                rows: this.rows,
            }).then(res => {
                console.log("getUserOrderList res", res);
                this.total = res.total;
                if (this.page == 1) {
                    this.recordList = res.list;
                } else {
                    this.recordList = this.recordList.concat(res.list);
                }
            })
        },
        jumpDetail(info) {
            console.log("jumpDetail", info);
            this.bridgeSdk.jumpPage({
                url: `/package-money-transactions/payment/detail?info=${JSON.stringify(info)}`,
            });
        }
    }

}
</script>

<style scoped lang="scss">
.payment_record {
    width: 750rpx;
    height: 100vh;
    background: linear-gradient(180deg, rgba(122, 152, 255, 0.35) 0%, rgba(80, 119, 255, 0) 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
        position: relative;
    }

    .bg {
        position: absolute;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        z-index: 0;
    }

    .tabbar {
        width: 682rpx;
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tabbar_item_active {
            width: 352rpx;
            height: 100rpx;
            text-align: center;
            position: relative;

        }

        .tabbar_item_normal {
            width: 352rpx;
            height: 88rpx;
            text-align: center;
            position: relative;

        }

        .tabbar_item_img_active {
            position: absolute;
            width: 352rpx;
            height: 100rpx;
            top: 0;
            z-index: 0;
        }

        .tabbar_item_img_normal {
            position: absolute;
            width: 318rpx;
            height: 88rpx;
            top: 0;
            z-index: 0;
        }

        .po_left {
            left: 0;
        }

        .po_right {
            right: 0;
        }

        .tabbar_item_text_active {
            font-weight: normal;
            font-size: 30rpx;
            color: #FFFFFF;
            line-height: 100rpx;
            position: relative;
        }

        .tabbar_item_text_normal {
            font-weight: normal;
            font-size: 24rpx;
            color: #6E90FE;
            line-height: 88rpx;
            position: relative;

        }
    }

    .record_box {
        width: 670rpx;
        height: calc(100vh - 620rpx);
        background: #FFFFFF;
        border-radius: 20rpx;

        .record_header {
            height: 182rpx;
            width: 670rpx;
            margin-top: -52rpx;
        }
    }

    .record_list {
        width: 670rpx;
        height: calc(100vh - 620rpx - 130rpx);
        border-radius: 20rpx;


        .record_item {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .record_item_header {
                width: 570rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 22rpx;

                .record_item_header_left {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    font-weight: 800;
                    font-size: 30rpx;
                    color: #0E0101;
                    line-height: 42rpx;
                }

                .record_item_header_right {
                    font-weight: 800;
                    font-size: 30rpx;
                    color: #999999;
                    line-height: 42rpx;
                }

                .record_item_header_img {
                    width: 52rpx;
                    height: 52rpx;
                    margin-right: 18rpx;
                }
            }

            .record_item_body {
                width: 570rpx;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 24rpx;

                .record_item_body_left {
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #999594;
                    vertical-align: bottom;

                    .font_24 {
                        font-size: 24rpx;
                    }

                    .col_black {
                        color: #535252;
                    }
                }

                .record_item_body_right {
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #999594;
                    vertical-align: bottom;
                    flex-shrink: 0;

                    .font_24 {
                        font-size: 24rpx;
                    }

                    .col_red {
                        color: #F64A09;
                    }
                }
            }

            .record_item_footer {
                width: 570rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 500;
                font-size: 22rpx;
                color: #969696;
                line-height: 36rpx;
                margin-bottom: 32rpx;

                .font_24 {
                    font-size: 24rpx;
                }

                .font_weight {
                    font-weight: bold;
                }

                .font_28 {
                    font-size: 28rpx;
                }
            }

            .record_item_line {
                width: 590rpx;
                height: 34rpx;
                border-top: 1px dashed #BBBBBB;
            }
        }
    }


}
</style>