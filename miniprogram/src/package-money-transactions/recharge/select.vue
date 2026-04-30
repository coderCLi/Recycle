<template>
    <vc-modal></vc-modal>
    <vc-container :props-data="{ props: { title: { value: '付款' }, isFullScreen: { value: true } } }">
        <view class="recharge_select">
            <view class="header">
                <view class="header_title">
                    ￥<text class="header_title_num">{{ amount }}</text>
                </view>
                <view class="header_time">
                    剩余支付时间：{{ outTime }}
                </view>
            </view>
            <view class="main">
                <view class="main_title">请选择支付方式</view>
                <view class="main_list">
                    <view class="main_list_item" @click="choosePay">
                        <image src="" mode="scaleToFill" />
                        <view class="main_list_content">
                            <view class="main_list_content_title">微信支付</view>
                            <view class="main_list_content_desc">
                                微信支付
                            </view>
                        </view>
                        <view class="main_list_right">
                            <image class="main_list_right_select" src="" mode="scaleToFill" />
                            <image class="main_list_right_unselect" src="" mode="scaleToFill" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="footer">
                <view class="footer_btn" @click="pay">确认支付</view>
            </view>
        </view>
        
    </vc-container>
    <openWxPay ref="openWxPay" @success="wxPaySuccess" @fail="wxPayFail"></openWxPay>
</template>

<script>
import openWxPay from '../components/openWxPay.vue';
export default {
    name: 'RechargeConfirm',
    components: {
        openWxPay,
    },
    data() {
        return {
            outTime: '00:00:00',
            payType: 1,
        };
    },
    methods: {
        choosePay() {
            this.payType = 1;
        },
        pay() {
            console.log('pay');
            this.$refs.openWxPay.open({
                    mctId: this.mctId,
                    orderAmt: this.amount,
                    tradeType: '1',
                    ruleId:  this.ruleId,
                });
        },
        wxPaySuccess(res){
            console.log(res)
        },
        wxPayFail(){
             this.$refs.modal.open({
                title: "提示",
                content: "支付失败",
                showCancel: false,
                confirmText: "确定",
                confirmCallback: () => {
                }
            })
        }
    },
    created() {
        this.outTime = '00:00:00';
    },
}
</script>

<style scoped lang="scss">
.recharge_select {
    width: 750rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
        width: 710rpx;
        height: 280rpx;
        background: #FFFFFF;
        border-radius: 12rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .header_title {
            font-weight: 400;
            font-size: 30rpx;
            color: #212121;
            vertical-align: bottom;

            .header_title_num {
                font-weight: 400;
                font-size: 64rpx;
                color: #212121;
                line-height: 90rpx;
            }

        }

        .header_time {
            width: 318rpx;
            height: 58rpx;
            background: #F4F4F4;
            border-radius: 100rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 22rpx;
            color: #212121;
            line-height: 32rpx;
        }
    }

    .main {
        width: 710rpx;
        margin-top: 44rpx;

        .main_title {
            font-weight: 800;
            font-size: 30rpx;
            color: #212121;
            line-height: 42rpx;
        }

        .main_list {
            width: 710rpx;
            background: #FFFFFF;
            border-radius: 12rpx;
        }
    }
}
</style>