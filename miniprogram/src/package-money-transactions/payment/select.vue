/**
* @description: 用户扫商家码选择支付方式页面
*/
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container @navBack="navBack"  :props-data="{ props: { title: { value: '付款' }, isFullScreen: { value: true }, customLeftBack: { value: true }  } }">
        <view class="payment_select">
            <view class="header">
                <view class="header_title">
                    ￥
                    <text class="header_title_num" v-if="payType == 'hiPay' && discountRate && discountRate != 100">{{
                        formatAmount(discountAmt) }}</text>
                    <text class="header_title_num" v-else>{{ formatAmount(amount) }}</text>
                </view>
                <!-- <view class="header_time">
                    剩余支付时间：{{ outTime }}
                </view> -->
                 <view v-if="userGetId" class="header_time">
                    满{{disAllAmt}}元减{{disAmt}}元
                </view>
                 <view v-if="userGetId" class="header_tips">
                   <text>*</text> 满减券自动核销
                </view>
            
            </view>
            <view class="main">
                <view class="main_title">请选择支付方式</view>
                <view class="main_list">
                    <view class="main_list_tips">
                        订单金额：<text class="red_col">￥<text class="font_42">{{ formatAmount(amount) }}</text></text>
                    </view>
                    <view class="main_list_item" @click="choosePay('wxPay')">
                        <view class="main_list_item_left">
                            <image class="main_list_item_img"
                                :src="minioBaseUrl + 'common/mctImages/yuemingxi_icon_weixinpayment_img.png'"
                                mode="heightFix" />
                        </view>
                        <view class="main_list_content" style="border-bottom: 1px solid #F4F4F4;">
                            <view class="main_list_content_left">
                                <view class="main_list_content_title">微信支付</view>
                                <view class="main_list_content_desc">
                                    亿万用户的选择, 更快更安全
                                </view>
                            </view>
                            <view class="main_list_content_right">
                                <view v-if="payType == 'wxPay'" class="main_list_right_select">
                                    <u-icon name="checkbox-mark" size="32rpx" color="#ffffff"
                                        class="checkbox-mark"></u-icon>
                                </view>
                                <view v-else class="main_list_right_unselect"></view>
                            </view>
                        </view>
                    </view>
                    <view class="main_list_item" @click="choosePay('hiPay')">
                        <view class="main_list_item_left">
                            <image class="main_list_item_img"
                                :src="minioBaseUrl + 'common/mctImages/yuemingxi_icon_hipayment_img.png'"
                                mode="heightFix" />
                        </view>
                        <view class="main_list_content">
                            <view class="main_list_content_left">
                                <view class="main_list_content_title">余额支付 
                                    <!-- <text class="main_list_content_balance">账户余额：{{ balance }}元</text> -->
                                    </view>
                                <view v-if="discountRate && discountRate != 100" style="font-size: 24rpx;">商户余额支付折扣: {{
                                    discountRate }}%</view>
                                <view class="main_list_content_desc">
                                    <view class="" v-for="(item, index) in rechargeRulesList" :key="index">
                                        <view class="main_list_content_desc_item"
                                            v-if="item.type == '1' && item.giftAmt > 0">
                                            <text>充值{{ item.rcgAmt }}元赠送{{ item.giftAmt }}元</text>
                                        </view>
                                        <view class="main_list_content_desc_item"
                                            v-if="item.type == '2' && item.couponNum > 0">
                                            <text>充值{{ item.rcgAmt }}元赠送优惠券x{{ item.couponNum }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="main_list_content_right">
                                <view v-if="payType == 'hiPay'" class="main_list_right_select">
                                    <u-icon name="checkbox-mark" size="24rpx" color="#ffffff"
                                        class="checkbox-mark"></u-icon>
                                </view>
                                <view v-else class="main_list_right_unselect"></view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="footer">
                <view class="footer_btn" @click="pay">确认支付</view>
            </view>
        </view>
    </vc-container>
    <openHiPay ref="openHiPay" @success="hiPaySuccess" @fail="hiPayFail"></openHiPay>
    <openWxPay ref="openWxPay" @success="wxPaySuccess" @fail="wxPayFail"></openWxPay>
</template>

<script>
import { getRechargeRules, cancelOrderInfo, getBalanceAndScore, getMctDiscountRate } from "../api/index";
import openHiPay from "../components/openHiPay.vue";
import openWxPay from "../components/openWxPay.vue";
export default {
    name: 'RechargeConfirm',
    components: {
        openHiPay,
        openWxPay
    },
    data() {
        return {
            amount: 0,
            mctId: "",
            outTime: '00:00:00',
            payType: "hiPay",
            timer: null,
            hour: "00",
            minute: "00",
            second: "00",
            rechargeRulesList: [],
            balance: "0",
            discountRate: 100,
            discountAmt: 0,
            callbackUrl: "", // 外部调用回调地址
            userId:'',
            isOne: false, // 标记字段，默认false，一分钟后改为true
            isOneTimer: null, // 定时器实例
        };
    },
    async onLoad(options) {
        console.log("RechargeConfirm onLoad", options);
        this.amount = options.amount;//优惠后金额
        this.mctId = options.mctId;//商户id
        this.userGetId = options.userGetId;//卡券领取id
        
        this.disAllAmt =  options.disAllAmt;
        this.disAmt = options.disAmt;
        this.callbackUrl = options.callbackUrl;
        if(this.callbackUrl.indexOf("?") > -1){
            this.hasParams = true
        }else{
            this.hasParams = false
        }
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
            return;
        }
        this.__loadData__();
    },
    methods: {
        __loadData__() {
            this.outTime = "00:02:00"
            this.startTimer();
            this.getRechargeRules();
            this.getBalanceAndScore()
            this.getDiscountRate()
        },
        choosePay(type) {
            this.payType = type;
        },
        pay() {
            if(this.isOne){
               this.$refs.modal.open({
                    title: "提示",
                    content: "下单超时，请重新下单",
                    showCancel: false,
                    confirmText: "确定",
                    confirmCallback: () => {
                        this.navBack(3);
                    }
                })
                return;
            }
            console.log('pay');
            if (this.payType == 'wxPay') {
                // 微信支付
                this.$refs.openWxPay.open({
                    mctId: this.mctId,
                    orderAmt: this.amount,
                    userGetId:this.userGetId,
                    tradeType: '2',
                    disAllAmt: this.disAllAmt,
                    disAmt: this.disAmt
                });
            }
            if (this.payType == 'hiPay') {
                this.$refs.openHiPay.open({
                    amount: this.amount,
                    mctId: this.mctId,
                    userGetId:this.userGetId,
                    discountPayAmt: this.discountAmt,
                    disAllAmt: this.disAllAmt,
                    disAmt: this.disAmt
                });
            }
        },
        startTimer() {
            this.timer = setInterval(() => {
                let time = this.outTime.split(":");
                let hour = parseInt(time[0]);
                let minute = parseInt(time[1]);
                let second = parseInt(time[2]);
                if (second > 0) {
                    second--;
                } else if (minute > 0) {
                    minute--;
                    second = 59;
                } else if (hour > 0) {
                    hour--;
                    minute = 59;
                    second = 59;
                } else {
                    this.pageBack()
                    return;
                }
                this.hour = hour < 10 ? "0" + hour : hour;
                this.minute = minute < 10 ? "0" + minute : minute;
                this.second = second < 10 ? "0" + second : second;
                this.outTime = `${this.hour}:${this.minute}:${this.second}`;
                // console.log(this.outTime);
                if (this.outTime === "00:00:00") {
                    // clearInterval(this.timer);
                    this.$refs.modal.open({
                        title: "提示",
                        content: "支付超时",
                        showCancel: false,
                        confirmText: "确定",
                        confirmCallback: () => {
                            this.pageBack()
                        }
                    });
                }
                console.log(this.outTime);
            }, 1000);
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

        hiPaySuccess(res) {
            console.log("hiPaySuccess", res);
            // this.$refs.modal.open({
            //     title: "提示",
            //     content: "支付成功",
            //     showCancel: false,
            //     confirmText: "确定",
            //     confirmCallback: () => {
            //         // this.pageBack()
            clearInterval(this.timer);
            //         uni.switchTab({
            //             url: "/pages/home/home"
            //         })
            //     }
            // })
            if(this.callbackUrl){
                if(this.callbackUrl == "back"){
                    this.pageBack()
                }
                else{
                    let url= this.callbackUrl  + (this.hasParams ? "&" : "?") + ("orderId=" + res.orderId )
                    url = encodeURIComponent(url)
                    uni.redirectTo({
                        url: "/pages/h5/h5?url=" + url
                    })
                }
            }else{
                console.log(res);
                uni.navigateTo({
                    url: '/package-money-transactions/payment/finish?orderId=' + res.orderId + '&userGetId='+ this.userGetId + '&disAllAmt=' + this.disAllAmt + '&disAmt=' + this.disAmt + "&delta=3"
                })
            }
        },
        hiPayFail(res) {
            console.log("hiPayFail", res);
            this.$refs.modal.open({
                title: "提示",
                content: "支付失败: " + res.msg,
                showCancel: false,
                confirmText: "确定",
                confirmCallback: () => {
                    this.pageBack()
                }
            })
        },
        wxPaySuccess(res) {
            console.log("wxPaySuccess", res);
            // this.$refs.modal.open({
            //     title: "提示",
            //     content: "支付成功",
            //     showCancel: false,
            //     confirmText: "确定",
            //     confirmCallback: () => {
            clearInterval(this.timer);
            //         uni.switchTab({
            //             url: "/pages/home/home"
            //         })
            //     }
            // })
            if(this.callbackUrl){
                if(this.callbackUrl == "back"){
                    this.pageBack()
                }
                else{
                    let url= this.callbackUrl  + (this.hasParams ? "&" : "?") + ("orderId=" + res.orderId )
                    url = encodeURIComponent(url)
                    uni.redirectTo({ 
                        url: "/pages/h5/h5?url=" + url
                    })
                }
            }else{
                uni.redirectTo({
                    url: '/package-money-transactions/payment/finish?orderId=' + res.orderId + '&userGetId='+ this.userGetId + '&disAllAmt=' + this.disAllAmt + '&disAmt=' + this.disAmt + "&delta=3"
                })
            }
        },
        wxPayFail(res) {
            console.log("wxPayFail", res);
            this.$refs.modal.open({
                title: "提示",
                content: "支付失败",
                showCancel: false,
                confirmText: "确定",
                confirmCallback: () => {
                    this.pageBack()
                }
            })
        },
        pageBack() {
            clearInterval(this.timer);
            
            uni.navigateBack({
                delta: 1
            });
        },
        getBalanceAndScore() {
            getBalanceAndScore().then(res => {
                console.log("getBalanceAndScore", res);
                if (res.balance) {
                    this.balance = res.balance
                }
            })
        },
        getDiscountRate() {
            
            getMctDiscountRate({ mctId: this.mctId }).then(res => {
                console.log("getMctDiscountRate", res);
                this.discountRate = Number(res);
                this.discountAmt = (this.amount * this.discountRate / 100).toFixed(2);
            })
        },
        navBack(num) {
            num = num || 1;
            this.userId = this.bridgeSdk.getUserInfo().userInfo.userId
            if(this.userGetId){
                cancelOrderInfo({
                    userId: this.userId,
                    mctId: this.mctId,
                    userGetId:this.userGetId
                }).then(res=>{
                    console.log('调用了卡券退回接口---cancelOrderInfo')
                    num !=3?this.bridgeSdk.navigateBackTo({ delta: 1 }):this.bridgeSdk.toFirstPage();
                })
            } else {
                // this.bridgeSdk.navigateBackTo({ delta: num });
                 num !=3 ?this.bridgeSdk.navigateBackTo({ delta: 1 }):this.bridgeSdk.toFirstPage();
            }
             
        },
        /**
         * 格式化金额，确保显示两位小数
         * @param {number|string} value - 金额值
         * @returns {string} 格式化后的金额字符串
         */
        formatAmount(value) {
            return Number(value).toFixed(2);
        },
        /**
         * 启动定时器，一分钟后将 isOne 改为 true
         */
        startIsOneTimer() {
            console.log('isOne 启动了')
            if (this.isOneTimer) {
                clearTimeout(this.isOneTimer);
            }
            this.isOneTimer = setTimeout(() => {
                this.isOne = true;
                console.log('isOne 已改为 true');
            }, 180 * 1000);
        }
    },
    onShow() {
        if (this.isOne === false && !this.isOneTimer) {
            this.startIsOneTimer();
        }
    },
    onUnload() {
        if (this.isOneTimer) {
            clearTimeout(this.isOneTimer);
        }
    }
}
</script>

<style scoped lang="scss">
.payment_select {
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
        margin-top: 18rpx;

        .header_title {
            font-weight: 400;
            font-size: 30rpx;
            color: #212121;
            vertical-align: bottom;

            .header_title_num {
                font-weight: bold;
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
        .header_tips {
            width: 318rpx;
            height: 58rpx;
            border-radius: 100rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 20rpx;
            color: #212121;
            line-height: 32rpx;
            text{
                color: red;
            }
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
            padding-bottom: 18rpx;
        }

        .main_list {
            width: 710rpx;
            background: #FFFFFF;
            border-radius: 12rpx;

            .main_list_tips {
                padding: 30rpx 40rpx 36rpx;
                vertical-align: bottom;
                font-weight: bold;
                font-size: 26rpx;
                color: #212121;
                line-height: 36rpx;

                .red_col {
                    color: #EB5149;
                }

                .font_42 {
                    font-size: 42rpx;
                    color: #EB5149;
                    line-height: 58rpx;
                }
            }

            .main_list_item {
                width: 710rpx;
                box-sizing: border-box;
                padding: 28rpx 0 22rpx;
                display: flex;
                align-items: flex-start;

                .main_list_item_left {
                    width: 115rpx;
                    flex-shrink: 0;
                    display: flex;
                    justify-content: center;

                    .main_list_item_img {
                        height: 48rpx;
                    }
                }

                .main_list_content {
                    width: auto;
                    flex-grow: 1;
                    padding-right: 56rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 28rpx;

                    .main_list_content_left {
                        flex-grow: 1;

                        .main_list_content_title {
                            font-weight: bold;
                            font-size: 28rpx;
                            color: #343434;
                            line-height: 48rpx;

                            .main_list_content_balance {
                                font-size: 24rpx;
                                color: #EB5149;
                                margin-left: 46rpx;
                                font-weight: 400;
                            }
                        }

                        .main_list_content_desc {
                            font-weight: 500;
                            font-size: 22rpx;
                            color: #C4C4CA;
                            line-height: 32rpx;
                            margin-top: 14rpx;
                            display: flex;
                            flex-wrap: wrap;

                            .main_list_content_desc_item {
                                margin-right: 10rpx;
                                margin-bottom: 10rpx;
                                font-size: 22rpx;
                                color: #E85530;
                                padding: 4rpx 14rpx;
                                border-radius: 4rpx;
                                border: 2rpx solid #E85530;
                            }
                        }
                    }

                    .main_list_content_right {
                        width: 44rpx;
                        height: 48rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .main_list_right_select {
                            width: 38rpx;
                            height: 38rpx;
                            border-radius: 50%;
                            background: #68D8C6;
                            border: 1px solid #68D8C6;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                        }

                        .main_list_right_unselect {
                            width: 38rpx;
                            height: 38rpx;
                            border-radius: 50%;
                            border: 2rpx solid #C4C4CA;
                            background: transparent;
                        }
                    }
                }
            }
        }
    }

    .footer {
        margin: 226rpx auto 0;
        width: 660rpx;
        height: 98rpx;

        .footer_btn {
            width: 660rpx;
            height: 98rpx;
            background: #41C753;
            border-radius: 50rpx;
            font-weight: normal;
            font-size: 30rpx;
            color: #FFFFFF;
            line-height: 98rpx;
            text-align: center;
        }
    }
}
</style>