/**
* @description: 商家扫会员码收款页面
*/
<template>
    <vc-modal ref="modal"> </vc-modal>
    <vc-container :props-data="{ props: { title: { value: '扫码收款' }, isFullScreen: { value: true } } }">
        <view class="scan_get_money">
            <view class="scan_get_money_box">

                <view class="scan_get_money_title">收款金额</view>
                <view class="scan_get_money_content">
                    <view class="font_60">￥</view>
                    <input class="amtInput" type="digit" placeholder="请输入金额" v-model="amount" />
                </view>
            </view>
            <view class="scan_get_money_btn" @click="getMoney">确认收款</view>
        </view>
    </vc-container>
</template>

<script>
import { mctMakeOrder } from "../api/index"
export default {
    name: "scanGetMoney",
    data() {
        return {
            mctId: '',
            amount: '',
            userId: '',
            orderAmt: '',
            nostr: '',
        }
    },
    onLoad(options) {
        this.mctId = options.mctId;
    },
    methods: {
        getMoney() {
            if(!this.amount){
                uni.showToast({
                    title: '请输入金额',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            if(!this.reg.checkMoney(this.amount)){
                uni.showToast({
                    title: '请输入正确金额',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            this.bridgeSdk.scanCode(async (res) => {
                console.log(res, '扫码结果')
                // #ifdef H5
                this.nostr = res.data.code.split("||")[0]
                this.userId = res.data.code.split("||")[1]
                // #endif
                // #ifdef MP-WEIXIN
                this.nostr = res.result.split("||")[0]
                this.userId = res.result.split("||")[1]
                // #endif
                this.openCollection()
            })
        },
        openCollection() {
            // 发起收款
            mctMakeOrder({
                userId: this.userId,
                mctId: this.mctId,
                orderAmt: Number(this.amount),
                nostr: this.nostr,
            }).then(res => {
                console.log(res, '发起收款成功')
                uni.redirectTo({
                    url: "/package-money-transactions/scanGetMoney/finish?pwdFlag=" + res.pwdFlag + "&orderId=" + res.id
                })
            }).catch(err => {
                console.log(err, '发起收款失败')
                uni.showToast({
                    title: '发起收款失败',
                    icon: 'none',
                    duration: 2000
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.scan_get_money {
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .scan_get_money_box {
        width: 750rpx;
        height: 914rpx;
        background: #FFFFFF;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        box-sizing: border-box;
        padding: 56rpx 54rpx;

        .scan_get_money_title {
            font-weight: 800;
            font-size: 30rpx;
            color: #191919;
            line-height: 42rpx;
        }

        .scan_get_money_content {
            font-weight: bold;
            font-size: 60rpx;
            line-height: 60rpx;
            color: #111;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 46rpx;
            padding-bottom: 26rpx;
            border-bottom: 2rpx solid #E8E8E8;
            // color: crimson;


            // .font_60 {
            //     font-size: 60rpx;
            //     line-height: 60rpx;
            // }
            .amtInput{
                height: 70rpx;
                font-size: 60rpx;
                line-height: 60rpx;
                // font-weight: 400;
                color: #000;
            }
        }
    }

    .scan_get_money_btn {
        width: 660rpx;
        height: 98rpx;
        background: #41C753;
        margin-top: 116rpx;
        font-weight: normal;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 98rpx;
        text-align: center;
        border-radius: 50rpx;
    }
}
</style>