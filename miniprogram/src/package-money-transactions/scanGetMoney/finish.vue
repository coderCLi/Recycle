<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="{ props: { title: { value: '扫码收款' }, isFullScreen: { value: true } } }">
        <view class="scan_get_finish">
            <view class="scan_get_finish_box">
                <view class="scan_get_finish_icon">
                    <up-icon v-if="status == '1'" name="checkmark-circle-fill" size="200rpx" color="#41C753"></up-icon>
                    <up-icon v-else-if="status == '2'" name="close-circle-fill" size="200rpx" color="#FF4949"></up-icon>
                    <up-icon v-else-if="pwdFlag == '1'" name="lock-fill" size="200rpx" color="#5BA4F3"></up-icon>
                    <up-icon v-else name="clock-fill" size="200rpx" color="#5BA4F3"></up-icon>
                </view>
                <view class="scan_get_finish_title">
                    <view v-if="status == '1'" class="scan_get_finish_title_success">收款成功</view>
                    <view v-else-if="status == '2'" class="scan_get_finish_title_fail">收款失败</view>
                    <view v-else-if="pwdFlag == '1'" class="scan_get_finish_title_pwd">请等待用户输入支付密码</view>
                    <view v-else class="scan_get_finish_title_wait">正在处理中</view>
                </view>
            </view>
            <view class="scan_get_finish_btn" @click="closeModal">返回</view>
            <view v-if="status == '3'" class="scan_get_finish_fresh" @click="refreshPage">刷新</view>
        </view>
    </vc-container>
</template>

<script>
import {
    mctGetOrder
} from "../api/index"
export default {
    name: "scanGetFinish",
    data() {
        return {

            status: 0,
            pwdFlag: '',
            orderId: '',

        }
    },
    onLoad(options) {
        this.pwdFlag = options.pwdFlag;
        this.orderId = options.orderId;
        if (this.pwdFlag == '1') {
            this.status = 3;
        } else {
            this.status = 1;
        }
    },
    methods: {
        closeModal() {
            uni.navigateBack({
                delta: 1
            });
        },
        refreshPage() {
            mctGetOrder({
                orderId: this.orderId,
            }).then(res => {
                console.log("mctGetOrder",res)
                this.status = res.status
            })
        },
    }
}
</script>

<style scoped lang="scss">
.scan_get_finish {
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
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
        .scan_get_finish_icon{
            width: 200rpx;
            height: 200rpx;
        }
        .scan_get_finish_title{
            font-size: 32rpx;
            margin-top: 40rpx;
            font-weight: bold;
            .scan_get_finish_title_success{
                color: #41C753;
            }
            .scan_get_finish_title_fail{
                color: #FF4949;
            }
           .scan_get_finish_title_pwd{
                color: #5BA4F3;
           }
           .scan_get_finish_title_wait{
                color: #5BA4F3;
           }
        }
    }
    .scan_get_finish_btn{
        width: 620rpx;
        height: 98rpx;
        background: #eee;
        margin-top: 100rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
        line-height: 98rpx;
        text-align: center;
        border-radius: 50rpx;
    }
    .scan_get_finish_fresh{
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