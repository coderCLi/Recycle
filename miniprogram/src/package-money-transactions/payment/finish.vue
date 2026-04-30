<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="{ props: { title: { value: '付款' }, isFullScreen: { value: true } } }" @navBack="navBack">
        <view class="scan_get_finish">
            <view class="scan_get_finish_box">
                <view class="scan_get_finish_box_date">
                    {{ yearNow }}年{{ monthNow }}月{{ dateNow }}日
                </view>
                <view class="scan_get_finish_box_time">
                    {{ hourNow }}:{{ minutesNow }}:{{ secondsNow }}
                </view>
                <view class="scan_get_finish_box_title">支付成功</view>
                <view class="scan_get_finish_box_row">
                    <text>商户名称</text>
                    <text class="scan_get_finish_box_row_content">{{ payInfo.mchName }}</text>
                </view>
                <view class="scan_get_finish_box_row">
                    <text>订单金额</text>
                    <text class="scan_get_finish_box_row_content">{{ payInfo.orderAmt }}元</text>
                </view>
                <!-- <view v-if="userGetId" class="scan_get_finish_box_row">
                    <text>优惠券</text>
                    <text class="scan_get_finish_box_row_content">满{{disAllAmt}}元减{{disAmt}}元</text>
                </view> -->
                <view v-if="payInfo.couponBaseName" class="scan_get_finish_box_row">
                    <text>优惠券</text>
                    <text class="scan_get_finish_box_row_content">{{payInfo.couponBaseName}}</text>
                </view>
                <view class="scan_get_finish_box_row">
                    <text>付款金额</text>
                    <text class="scan_get_finish_box_row_content">{{ payInfo.payAmt }}元</text>
                </view>
                <view v-if="payInfo.discAmt &&payInfo.discAmt !=0" class="scan_get_finish_box_row">
                    <text>优惠金额</text>
                    <text class="scan_get_finish_box_row_content">{{ payInfo.discAmt }}元</text>
                </view>
                <view v-if="payInfo.discountRate&&payInfo.discountRate!=100" class="scan_get_finish_box_row">
                    <text>商户折扣率</text>
                    <text class="scan_get_finish_box_row_content">{{formatDiscount(payInfo.discountRate) }}</text>
                </view>
                <view class="scan_get_finish_box_row">
                    <text>付款时间</text>
                    <text class="scan_get_finish_box_row_content">{{ payInfo.payEndTime }}</text>
                </view>
            </view>
            <view class="scan_get_finish_btn" @click="closeModal">返回首页</view>
        </view>
    </vc-container>
</template>

<script>
import {
    getPayResultInfo
} from "../api/index"
export default {
    name: "scanGetFinish",
    data() {
        return {
            payInfo: {},
            orderId: '',
            yearNow: 0,
            monthNow: 0,
            dayNow: 0,
            hourNow: 0,
            minutesNow: 0,
            secondsNow: 0,
            timer: null,
            userGetId : '',//主动扫码 付款 成功后，获取的券id 然后自己拼接券名称
            disAllAmt : '',
            disAmt : '',
        }
    },
    onLoad(options) {
        this.orderId = options.orderId;
        this.userGetId = options.userGetId
        this.disAllAmt = options.disAllAmt;
        this.disAmt = options.disAmt;
        this.startClock()
        this.getData()
    },
    methods: {
        navBack(){
            this.closeModal()
        },
        /**
         * 格式化折扣率显示
         * @param {number} rate - 折扣率（如90表示90%）
         * @returns {string} 格式化后的折扣字符串（如9折、87折）
         */
        formatDiscount(rate) {
            // 处理以0结尾的折扣率，去掉末尾的0
            let formattedRate = rate;
            if (rate % 10 === 0 && rate >= 10) {
                formattedRate = rate / 10;
            }
            return `${formattedRate}折`;
        },
        getData() {
            getPayResultInfo({ orderId: this.orderId }).then(res => {
                console.log(res)
                this.payInfo = res;
                // this.couponBaseName = res.couponBaseName;
                // {
                //     mchId    商户id
                //     mchName    商户名称
                //     mctLogoUrl    商户logo
                //     payEndTime    支付完成时间
                //     payAmt    支付金额
                // }
            })
        },
        closeModal() {
            uni.switchTab({
                url: "/pages/home/home"
            })
        },
        startClock() {
            this.timer = setInterval(() => {
                let now = new Date()
                this.yearNow = now.getFullYear()
                this.monthNow = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
                this.dateNow = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
                this.hourNow = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
                this.minutesNow = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
                this.secondsNow = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
            }, 1000)
        },
        endClock() {
            clearInterval(this.timer)
        }
    },
    onShow() {
        this.startClock()
    },
    onHide() {
        this.endClock()
    }
}
</script>

<style scoped lang="scss">
    .bg_image{

    }
.scan_get_finish {
    width: 750rpx;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .scan_get_finish_box {
        width: 620rpx;
        height: 620rpx;
        margin-top: 40rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .scan_get_finish_icon {
            width: 200rpx;
            height: 200rpx;
        }

        .scan_get_finish_title {
            font-size: 32rpx;
            margin-top: 40rpx;
            font-weight: bold;

            .scan_get_finish_title_success {
                color: #41C753;
            }

            .scan_get_finish_title_fail {
                color: #FF4949;
            }

            .scan_get_finish_title_pwd {
                color: #5BA4F3;
            }

            .scan_get_finish_title_wait {
                color: #5BA4F3;
            }
        }

        .scan_get_finish_box_date {
            font-size: 32rpx;
            font-weight: bold;
        }

        .scan_get_finish_box_time {
            font-size: 30rpx;
            font-weight: bold;
        }

        .scan_get_finish_box_title {
            color: #41C753;
            font-size: 30rpx;
            margin-top: 60rpx;
            margin-bottom: 40rpx;
        }

        .scan_get_finish_box_row {
            width: 100%;
            box-sizing: border-box;
            padding: 10rpx 30rpx;
            color: #666666;
            font-size: 24rpx;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            .scan_get_finish_box_row_content{
                display: block;
                width: 420rpx;
                text-align: right;
            }
        }
    }

    .scan_get_finish_btn {
        width: 620rpx;
        height: 98rpx;
        background: #5BA4F3;
        margin-top: 100rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: #ffffff;
        line-height: 98rpx;
        text-align: center;
        border-radius: 50rpx;
    }

    .scan_get_finish_fresh {
        width: 620rpx;
        height: 98rpx;
        color: #5BA4F3;
        margin-top: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
        line-height: 98rpx;
        text-align: center;
        border-radius: 50rpx;
    }
}
</style>