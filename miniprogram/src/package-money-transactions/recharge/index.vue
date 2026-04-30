/**
* 充值页面
*/
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="{ props: { title: { value: '充值' }, isFullScreen: { value: true } } }">
        <view class="recharge">
            <view class="header_card">
                <image class="header_card_bg" :src="minioBaseUrl + 'common/mctImages/qianbaochongzhi_top_card_img.png'"
                    mode="scaleToFill" />
                <view class="header_card_main">
                    <view class="header_card_title">
                        账户余额（元）
                    </view>
                    <view class="header_card_num">
                        {{ balance }}
                    </view>
                </view>
                <view class="header_card_footer">
                    <view class="header_card_footer_btn" @click="balanceDetail">
                        <image class="header_card_footer_btn_icon"
                            :src="minioBaseUrl + 'common/mctImages/icon_yuemingxi_img.png'" mode="scaleToFill" />
                        余额明细
                    </view>
                    <view class="line"></view>
                    <view class="header_card_footer_btn" @click="passwordManage">
                        <image class="header_card_footer_btn_icon"
                            :src="minioBaseUrl + 'common/mctImages/icon_mimaguanli_img.png'" mode="scaleToFill" />
                        密码管理
                    </view>
                </view>
            </view>
            <view class="recharge_main">
                <view class="recharge_main_header">
                    <view class="recharge_main_header_title">
                        <view class="blue_line"></view>
                        <view class="recharge_main_header_title_text">
                            充值金额
                        </view>
                    </view>
                    <view class="recharge_main_header_action" @click="jumpRecord">
                        充值记录
                        <u-icon name="arrow-right" size="24rpx" color="#999" class="arrow-right"></u-icon>
                    </view>
                </view>
                <view class="recharge_main_list">
                    <view v-for="(item, index) in rechargeRulesList" :key="index" @click="selectItem(index)">
                        <view class="recharge_main_list_item_active" v-if="selected == index">
                            <view class="recharge_main_list_item_tips" v-if="item.giftAmt&&item.giftAmt!='0'">充值特惠</view>
                            <view class="recharge_main_list_item_price col_red">
                                <view class="currency">￥</view>
                                <view class="amount">{{ item.rcgAmt }}</view>
                            </view>
                            <view class="recharge_main_list_item_reward" v-if="item.giftAmt&&item.giftAmt!='0'&&item.type == '1'">赠送{{ item.giftAmt }}元
                            </view>
                            <view class="recharge_main_list_item_reward" v-if="item.couponNum&&item.couponNum!='0'&&item.type == '2'">赠送优惠券x{{ item.couponNum
                                }}</view>
                            <view class="recharge_main_list_item_selected">
                                <u-icon name="checkbox-mark" size="24rpx" color="#fff"></u-icon>
                            </view>
                        </view>
                        <view v-else class="recharge_main_list_item">
                            <view class="recharge_main_list_item_price colo_red">
                                <view class="currency">￥</view>
                                <view class="amount">{{ item.rcgAmt }}</view>
                            </view>
                            <view class="recharge_main_list_item_reward" v-if="item.giftAmt&&item.giftAmt!='0'&&item.type == '1'">赠送{{ item.giftAmt }}元
                            </view>
                            <view class="recharge_main_list_item_reward" v-if="item.couponNum&&item.couponNum!='0'&&item.type == '2'">赠送优惠券x{{ item.couponNum
                                }}</view>
                        </view>
                    </view>
                </view>
                <view class="recharge_main_box">
                    <view class="recharge_main_row">
                        <view class="red_dot"></view>充值只可选择以上固定档位金额
                    </view>
                    <view class="recharge_main_row">
                        <view class="red_dot"></view>充值金额无法提现，无法找零
                    </view>
                    <view class="recharge_main_row">
                        <view class="red_dot"></view>充值金额永久有效
                    </view>
                </view>

                <view class="confirm_recharge_btn" @click="confiremRecharge">确认充值</view>
                <view class="recharge_main_protocol" @click="agreeProtocolChange">
                    <view class="checkbox_select" v-if="agreeProtocol">
                        <u-icon name="checkbox-mark" size="24rpx" color="#ffffff" class="checkbox-mark"></u-icon>
                    </view>
                    <view class="checkbox_no_select" v-else>
                        <u-icon name="checkbox-mark" size="24rpx" color="#dddddd" class="checkbox-mark"></u-icon>
                    </view>

                    阅读并同意<text class="font_weight_bold" @click.stop="jumpPage">《用户服务协议》</text>
                </view>
            </view>

        </view>
    </vc-container>
    <openWxPay ref="openWxPay" @success="wxPaySuccess" @fail="wxPayFail"></openWxPay>

</template>

<script>
import openWxPay from "../components/openWxPay.vue";
import {
    getRechargeRules,
    getBalanceAndScore
} from "../api/index"
import {
    getMemberCodeId
} from "@/api/memberCode"
export default {
    name: "recharge",
    components: {
        openWxPay,
    },
    data() {
        return {
            balance: "0",
            rechargeRulesList: [],
            selected: 0,
            agreeProtocol: false,
        }
    },
    methods: {
        initData() {
            this.getRechargeRules();
            this.getBalanceAndScore();
            this.getMemberCodeId();
        },
        getBalanceAndScore() {
            getBalanceAndScore().then(res => {
                console.log("getBalanceAndScore", res);
                if (res.balance) {
                    this.balance = res.balance
                }
            })
        },
        getMemberCodeId(){
            getMemberCodeId({}, { catchError: true, showFailToast: false }).then(res => {
            }).catch(err => {
                if (err.code === "0009") {
                    this.$refs.modal.open({
                        title: "提示",
                        content: "您还未设置支付密码，请设置支付密码后再使用会员码",
                        confirmText: "去设置",
                        confirmCallback: () => {
                            this.bridgeSdk.jumpPage({
                                url: "/package-money-transactions/password/setPassword?pageType=new"
                            })
                        },
                        cancelCallback: (res) => {
                           this.bridgeSdk.toFirstPage()
                        }
                    });

                } else {
                    this.$refs.modal.open({
                        title: "提示",
                        content: err.message,
                        confirmText: "确定",
                    })
                }
            });
        },
        
        getRechargeRules() {
            getRechargeRules({
                page: 1,
                rows: 1000
            }).then(res => {
                console.log("getRechargeRules", res);
                if (res.list) {
                    this.rechargeRulesList = res.list
                }
            })
        },
        selectItem(index) {
            this.selected = index;
        },
        balanceDetail() {
            uni.navigateTo({
                url: "/package-money-transactions/balanceDetail/index"
            })
        },
        passwordManage() {
            uni.navigateTo({
                url: "/package-money-transactions/password/passwordManage"
            })
        },
        getBalance() {
        },
        confiremRecharge() {
            if (!this.agreeProtocol) {
                uni.showToast({
                    title: "请阅读并同意协议",
                    icon: "none"
                })
                return
            }
            // 发起支付前交易请求
            let ruleId = this.rechargeRulesList[this.selected].id;
            let orderAmt = this.rechargeRulesList[this.selected].rcgAmt;
            this.$refs.openWxPay.open({
                orderAmt: orderAmt,
                tradeType: '1',
                ruleId: ruleId,
            });
        },

        agreeProtocolChange() {
            this.agreeProtocol = !this.agreeProtocol;
        },
        jumpPage() {
            console.log("jumpPage")
            this.bridgeSdk.jumpPage({
                url: this.minioBaseUrl + 'hbdbucket//home/micro/hbd/agreement/user_agree-mini.html',
                title: '用户服务协议'
            })
        },
        jumpRecord() {
            uni.navigateTo({
                url: "/package-money-transactions/recharge/record"
            })
        },
        wxPaySuccess(res) {
            console.log("wxPaySuccess", res);
            this.$refs.modal.open({
                title: "提示",
                content: "支付成功",
                showCancel: false,
                confirmText: "确定",
                confirmCallback: () => {
                    this.getBalanceAndScore();
                }
            })
        },
        wxPayFail(res) {
            console.log("wxPayFail", res);
            this.$refs.modal.open({
                title: "提示",
                content: "支付失败",
                showCancel: false,
                confirmText: "确定",
            })
        },
    },
    onLoad() {
        this.initData();
        this.getBalance();
    },
    onShow() {
        this.getBalance();
    },

}
</script>

<style scoped lang="scss">
.recharge {
    width: 750rpx;
    height: 100%;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-top: 40rpx;


    .header_card {
        width: 690rpx;
        // height: 240rpx;
        border-radius: 20rpx;
        box-sizing: border-box;
        position: relative;

        .header_card_bg {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
        }

        .header_card_main {
            width: 100%;
            height: 240rpx;
            position: relative;
        }

        .header_card_title {
            padding: 60rpx 0 0 32rpx;
            font-size: 32rpx;
            color: #9F7131;
        }

        .header_card_num {
            padding: 20rpx 0 0 32rpx;
            font-size: 60rpx;
            color: #682A14;
        }

        .header_card_footer {
            width: 100%;
            height: 80rpx;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-top: 1px solid #FBF6E8;
            position: relative;

            .header_card_footer_btn {
                width: 40%;
                height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28rpx;
                color: #926322;

                .header_card_footer_btn_icon {
                    width: 20rpx;
                    height: 20rpx;
                    margin-right: 10rpx;
                }
            }

            .line {
                width: 1px;
                height: 40rpx;
                background: #ffffff;
            }
        }
    }

    .recharge_main {
        width: 100%;
        border-radius: 40rpx 40rpx 0 0;
        background: #ffffff;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;


        .recharge_main_header {
            width: 662rpx;
            padding: 36rpx 0 24rpx 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;

            .recharge_main_header_title {
                display: flex;
                align-items: center;

                .blue_line {
                    width: 8rpx;
                    height: 30rpx;
                    background: #2979ff;
                    margin-right: 10rpx;
                }

                .recharge_main_header_title_text {
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #000000;
                    line-height: 40rpx;
                }
            }

            .recharge_main_header_action {
                font-weight: bold;
                font-size: 28rpx;
                color: #999999;
                line-height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .arrow-right {
                    margin-left: 10rpx;
                }
            }
        }

        .recharge_main_list {
            width: 672rpx;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: flex-start;

            .recharge_main_list_item {
                width: 204rpx;
                height: 148rpx;
                box-sizing: border-box;
                border-radius: 16rpx;
                border: 1px solid #e5e5e5;
                margin: 10rpx;
                position: relative;
            }

            .recharge_main_list_item_active {
                width: 204rpx;
                height: 148rpx;
                box-sizing: border-box;
                border-radius: 20rpx;
                border: 1px solid #F01732;
                background: #FFF3F3;
                margin: 0 10rpx;
                position: relative;
            }

            .recharge_main_list_item_tips {
                position: absolute;
                top: 0;
                left: 0;
                width: 108rpx;
                border-radius: 20rpx 0 20rpx 0;
                background: linear-gradient(to bottom, #F01732 0%, #f57445 100%);
                height: 30rpx;
                line-height: 30rpx;
                text-align: center;
                color: #ffffff;
                font-size: 20rpx;
            }

            .recharge_main_list_item_price {
                width: 100%;
                box-sizing: border-box;
                padding-top: 32rpx;
                padding-left: 20rpx;
                padding-right: 20rpx;
                vertical-align: bottom;
                display: flex;
                align-items: flex-end;
                justify-content: center;

                .currency {
                    font-size: 24rpx;
                }

                .amount {
                    font-size: 44rpx;
                }

            }

            .col_red {
                color: #F01732;
            }

            .recharge_main_list_item_reward {
                font-weight: bold;
                font-size: 20rpx;
                color: #999999;
                line-height: 28rpx;
                text-align: center;
            }

            .recharge_main_list_item_selected {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 34rpx;
                height: 34rpx;
                border-radius: 20rpx 0 20rpx 0;
                background: #F01732;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24rpx;
                color: #ffffff;
            }
        }

        .recharge_main_box {
            width: 100%;
            margin-top: 58rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .recharge_main_row {
            width: 620rpx;
            height: 80rpx;
            display: flex;
            align-items: center;
            font-size: 28rpx;
            color: #333333;

            .red_dot {
                width: 20rpx;
                height: 20rpx;
                background: #F01732;
                border-radius: 50%;
                margin-right: 20rpx;
            }

        }

        .confirm_recharge_btn {
            width: 620rpx;
            height: 94rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50rpx;
            background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
            font-size: 32rpx;
            color: #ffffff;
            margin-top: 40rpx;
            line-height: 94rpx;
        }

        .recharge_main_protocol {
            width: 662rpx;
            height: 80rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 500;
            font-size: 22rpx;
            color: #7F7F7F;
            line-height: 32rpx;

            .checkbox_select {
                width: 24rpx;
                height: 24rpx;
                border-radius: 50%;
                background: #2979ff;
                border: 1px solid #2979ff;
                margin-right: 20rpx;
            }

            .checkbox_no_select {
                width: 24rpx;
                height: 24rpx;
                border-radius: 50%;
                background: #eeeeee;
                border: 1px solid #eeeeee;
                margin-right: 20rpx;
            }

            .font_weight_bold {
                font-weight: bold;
                color: #333333;
            }
        }
    }
}
</style>