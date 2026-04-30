<template>
    <view class="open_wx_pay"></view>
</template>

<script>
import { prePayNew, payForBal } from '../api/index'

export default {
    name: 'OpenWxPay',
    data() {
        return {
            id: '',
            code: '',
            isIos: false,
        }
    },
    mounted() {
        // #ifdef MP-WEIXIN
        this.isIos = !!(uni.getSystemInfoSync().platform === 'ios')
        // #endif
    },
    methods: {
        open(info) {
            console.log(info)

            uni.login({
                success: (res) => {
                    console.log(res)
                    if (res.code) {
                        this.code = res.code
                        this.makeWxOrder(info)
                    }
                },
                fail: (res) => {
                    console.log(res)
                }
            })
            // this.id = info.id
            // this.getRequestParams()
        },
        // 生成微信订单
        makeWxOrder(info) {
            let params = {
                ...info,
                code: this.code,
            }
            payForBal(params, { catchError: true }).then(res => {
                console.log("payForBal", res)
                this.orderId = res.orderId
                this.openWxPay(res.dealParams)
            }).catch(err => {
                console.log(err)
                this.$emit('fail', {
                    errMsg: err.errMsg || '支付失败'
                })
            })
        },
        //获取请求参数
        // getRequestParams() {
        //     //进行老微信的公众号支付
        //     prePayNew({
        //         id: this.id || '',
        //         payMethod: 'wx',//wx - 微信公众号发起支付 icbc-工行 默认固定icbc,
        //         pmt: 'wx',
        //         iosFlag: this.isIos ? '1' : '0',// iosFlag 1-ios 0-android
        //     }).then(res => {
        //         console.log("prePayNew", res.result)
        //         if (res) {
        //             // location.replace(res.result.dealParams.h5Url)
        //             // IOS系统支付后即弹出确认框
        //             // this.isIos && this.setWeixinDialog()

        //             this.orderId = res.result.orderId
        //             // sessionStorage.setItem('hasWxToPay', true)
        //             // sessionStorage.setItem('cashierOrderId', res.result.orderId)
        //             this.openWxPay(res.result.dealParams)
        //         } else {
        //             this.$toast(res.respmsg)
        //         }
        //     })
        // },
        openWxPay(info) {
            console.log("openWxPay", info)
            let that = this;
            uni.getProvider({
                service: "payment",
                success: function (getProviderRes) {
                    console.log("getProviderRes", getProviderRes)
                    uni.requestPayment({
                        "provider": getProviderRes.provider,
                        'timeStamp': info.timeStamp,
                        'nonceStr': info.nonceStr,
                        'package': info.packageName,
                        'signType': info.signType,
                        'paySign': info.paySign,
                        success: function (res) {
                            console.log("openWxPay success", res)
                            that.$emit('success', {orderId: that.orderId, ...res,disAllAmt:info.disAllAmt,disAmt:info.disAmt})
                        },
                        fail: function (res) {
                            console.log("openWxPay fail", res)
                            that.$emit('fail', res)
                        }
                    })
                }
            })

        },
        //微信弹窗设置
        setWeixinDialog() {
            this.dialogTitle = '确认支付'
            this.dialogMsg = '请确认已在微信中完成支付'
            this.dialogCancelTxt = '取消'
            this.dialogConfirmTxt = '已完成'
            this.checkPayShow = true
            sessionStorage.removeItem('hasWxToPay')
        },
    }
}
</script>

<style></style>