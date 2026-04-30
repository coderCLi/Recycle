<template>
    <vc-modal></vc-modal>
    <view class="recharge_record">
        <!-- <image class="bg" :src="minioBaseUrl + '/common/mctImages/bg_img_style02.png'" mode="scaleToFill" /> -->
        <view class="recharge_record_bg"></view>
        <psd-header class="header" title="充值记录" desc="您可以查询充值记录"
            iconUrl="/common/mctImages/mimaguanli_top_icon_style04_img.png"></psd-header>
        <!-- <view class="tabbar">
            <view :class="active == 0 ? 'tabbar_item_active' : 'tabbar_item_normal'" @click="changeActive(0)">
                <image v-if="active == 0" class="tabbar_item_img_active po_left"
                    :src="minioBaseUrl + 'common/mctImages/tabbar_sel_left_img.png'" mode="scaleToFill" />
                <image v-else class="tabbar_item_img_normal po_left"
                    :src="minioBaseUrl + 'common/mctImages/tabbar_normal_left_img.png'" mode="scaleToFill" />
                <text :class="active == 0 ? 'tabbar_item_text_active' : 'tabbar_item_text_normal'">充值金额赠送金额</text>
            </view>
            <view :class="active == 1 ? 'tabbar_item_active' : 'tabbar_item_normal'" @click="changeActive(1)">
                <image v-if="active == 1" class="tabbar_item_img_active po_right"
                    :src="minioBaseUrl + 'common/mctImages/tabbar_sel_right_img.png'" mode="scaleToFill" />
                <image v-else class="tabbar_item_img_normal po_right"
                    :src="minioBaseUrl + 'common/mctImages/tabbar_normal_right_img.png'" mode="scaleToFill" />
                <text :class="active == 1 ? 'tabbar_item_text_active' : 'tabbar_item_text_normal'">充值金额赠送优惠券</text>
            </view>
        </view> -->
        <scroll-view scroll-y class="record_list" @scrolltolower="onScrollToLower">
            <vc-empty v-if="recordList.length == 0" text="暂无记录"></vc-empty>
            <view v-else-if="active == 0" class="record_item">
                <view v-for="(item, index) in recordList" :key="index" class="record_item_amt">
                    <view class="record_item_amt_header">
                        <image class="record_item_amt_header_img"
                            :src="minioBaseUrl + 'common/mctImages/topimg_zengsongjine_img.png'" mode="scaleToFill" />
                    </view>
                    <view class="record_item_amt_body">
                        <view class="record_item_amt_body_title">
                            <view class="record_item_amt_body_title_title">总价值<text class="font_44 red_col">{{
                                item.totalAmt }}</text><text class="red_col">元</text></view>
                            <view class="record_item_amt_body_title_date">{{ item.createTime }}</view>
                        </view>
                        <view class="record_item_amt_body_desc">已充值<text class="font_34 black_col font_bold">{{
                            item.rcgAmt }}</text>元</view>
                        <view class="record_item_amt_body_card">
                            <image class="record_item_amt_body_card_bg"
                                :src="minioBaseUrl + 'common/mctImages/chongzhijilu_bg_img.png'" mode="scaleToFill" />
                            <view class="record_item_amt_body_card_num">￥<text class="font_46">{{ item.rcgAmt }}</text>
                            </view>
                            <view class="record_item_amt_body_card_desc">赠送{{ item.giftAmt }}元</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else-if="active == 1" class="record_item">
                <view v-for="(item, index) in recordList" :key="index" class="record_item_amt">
                    <view class="record_item_amt_header">
                        <!-- 00满减券  01礼品券  02折扣券  03代金券 -->
                        <image class="record_item_amt_header_img" v-if="item.giftCouponBaseType == '00'"
                            :src="minioBaseUrl + 'common/mctImages/topimg_manjianyouhuiquan_img.png'"
                            mode="scaleToFill" />
                        <image class="record_item_amt_header_img" v-if="item.giftCouponBaseType == '02'"
                            :src="minioBaseUrl + 'common/mctImages/topimg_zhekouyouhuiquan_img.png'"
                            mode="scaleToFill" />
                        <image class="record_item_amt_header_img" v-if="item.giftCouponBaseType == '01'"
                            :src="minioBaseUrl + 'common/mctImages/topimg_lipinyouhuiquan_img.png'"
                            mode="scaleToFill" />
                    </view>
                    <view class="record_item_amt_body">
                        <view class="record_item_amt_body_title">
                            <view class="record_item_amt_body_title_title">共<text class="font_44 red_col">{{
                                item.giftCouponNum }}</text><text class="red_col">张</text></view>
                            <view class="record_item_amt_body_title_date">{{ item.createTime }}</view>
                        </view>
                        <view class="record_item_amt_body_desc">已充值<text class="font_34 black_col font_bold">{{
                            item.rcgAmt }}</text>元</view>
                        <view class="record_item_card_body" v-if="item.giftCouponBaseType == '00'">
                            <image class="record_item_card_body_bg"
                                :src="minioBaseUrl + 'common/mctImages/youhuiquan_bg_img.png'" mode="scaleToFill" />
                            <view class="record_item_card_body_left">
                                ￥<text class="font_46">{{ item.giftCouponDisAmt }}</text>
                            </view>
                            <view class="record_item_card_body_middle">
                                满{{ item.giftCouponDisAllAmt }}元可用
                            </view>
                            <view class="record_item_card_body_right">
                                满减
                            </view>
                        </view>
                        <view class="record_item_card_body" v-if="item.giftCouponBaseType == '01'">
                            <image class="record_item_card_body_bg"
                                :src="minioBaseUrl + 'common/mctImages/img_lipinquan.png'" mode="scaleToFill" />
                        </view>
                        <view class="record_item_card_body" v-if="item.giftCouponBaseType == '02'">
                            <image class="record_item_card_body_bg"
                                :src="minioBaseUrl + 'common/mctImages/youhuiquan_bg_img.png'" mode="scaleToFill" />
                            <view class="record_item_card_body_left">
                                <text class="font_46">{{ item.giftCouponDisAmt }}</text>折
                            </view>
                            <view class="record_item_card_body_middle">
                                最高折扣{{ item.giftCouponDisMaxAmt }}元
                            </view>
                            <view class="record_item_card_body_right">
                                折扣
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>


</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
import psdHeader from '../components/psdHeader.vue';
import { getRechargeRecord } from "../api/index"
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
            active: 0,
            page: 1,
            rows: 10,
            recordList: [],
        }
    },
    onLoad() {
        this.getRecordList();
    },
    methods: {
        onScrollToLower() {
            console.log("onScrollToLower");
            if (this.total > 0 && this.recordList.length < this.total) {
                this.page += 1;
                this.getRecordList();
            }
        },
        getRecordList() {
            console.log("getRecordList");
            let type = this.active == 0 ? '1' : '2';
            getRechargeRecord({
                page: this.page,
                rows: this.rows,
                type: type
            }).then(res => {
                console.log("getRecordList res", res);
                this.total = res.total;
                if (this.page == 1) {
                    this.recordList = res.list;
                } else {
                    this.recordList = this.recordList.concat(res.list);
                }
            })
        },
        changeActive(index) {
            this.active = index;
            this.page = 1;
            this.recordList = [];
            this.total = 0;
            this.getRecordList();
        }

    }

}
</script>

<style scoped lang="scss">
.recharge_record {
    width: 750rpx;
    height: 100vh;
    background: linear-gradient(180deg, rgba(122, 152, 255, 0.35) 0%, rgba(80, 119, 255, 0) 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .recharge_record_bg {}

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

    .record_list {
        width: 670rpx;
        height: calc(100vh - 620rpx );
        border-radius: 20rpx;

        .record_item {
            width: 100%;

            .record_item_amt {
                width: 100%;

                .record_item_amt_header {
                    width: 100%;
                    height: 182rpx;

                    .record_item_amt_header_img {
                        width: 100%;
                        height: 182rpx;
                    }
                }

                .record_item_amt_body {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0 44rpx 38rpx 40rpx;
                    border-radius: 0 0 20rpx 20rpx;
                    background: #FFFFFF;

                    .record_item_amt_body_title {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;


                        .font_44 {
                            font-size: 44rpx;
                        }

                        .red_col {
                            color: #F64A09;
                        }

                        .record_item_amt_body_title_title {
                            vertical-align: bottom;
                            font-size: 30rpx;
                            color: #535252;
                            line-height: 40rpx;
                        }

                        .record_item_amt_body_title_date {
                            font-weight: 500;
                            font-size: 20rpx;
                            color: #999594;
                            line-height: 36rpx;
                        }
                    }

                    .record_item_amt_body_desc {
                        font-weight: 800;
                        font-size: 24rpx;
                        color: #BFBDBD;
                        line-height: 40rpx;
                        margin-top: 14rpx;
                        vertical-align: bottom;

                        .font_34 {
                            font-size: 34rpx;
                        }

                        .black_col {
                            color: #535252;
                        }

                        .font_bold {
                            font-weight: bold;
                        }
                    }

                    .record_item_amt_body_card {
                        width: 198rpx;
                        height: 160rpx;
                        margin-top: 40rpx;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;

                        .record_item_amt_body_card_bg {
                            width: 198rpx;
                            height: 160rpx;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 0;
                        }

                        .record_item_amt_body_card_num {
                            width: 100%;
                            padding-top: 38rpx;
                            text-align: center;
                            vertical-align: bottom;
                            font-size: 18rpx;
                            color: #FF250A;
                            position: relative;

                            .font_46 {
                                font-size: 46rpx;
                            }
                        }

                        .record_item_amt_body_card_desc {
                            padding-bottom: 8rpx;
                            font-weight: 500;
                            font-size: 20rpx;
                            color: #FFFFFF;
                            line-height: 36rpx;
                            text-align: center;
                            position: relative;
                        }
                    }

                    .record_item_card_body {
                        width: 612rpx;
                        height: 152rpx;
                        margin-top: 28rpx;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;

                        .record_item_card_body_bg {
                            width: 612rpx;
                            height: 152rpx;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 0;
                        }

                        .record_item_card_body_left {
                            width: 166rpx;
                            text-align: center;
                            vertical-align: bottom;
                            font-size: 24rpx;
                            color: #FF250A;
                            position: relative;

                            .font_46 {
                                font-size: 46rpx;
                            }
                        }

                        .record_item_card_body_middle {
                            flex-grow: 1;
                            padding-left: 30rpx;
                            text-align: left;
                            font-weight: bold;
                            font-size: 26rpx;
                            color: #FF250A;
                            line-height: 32rpx;
                        }

                        .record_item_card_body_right {
                            margin-right: 36rpx;
                            padding: 0 20rpx;
                            text-align: center;
                            font-weight: bold;
                            font-size: 44rpx;
                            color: #FFFFFF;
                            line-height: 47rpx;
                            position: relative;
                            border-radius: 0 0 20rpx 0;
                            border-bottom: 2rpx solid #FFFFFF;
                        }
                    }

                }
            }
        }
    }


}
</style>