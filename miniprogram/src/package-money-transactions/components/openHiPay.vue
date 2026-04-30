<template>
    <view class="open_hi_pay">
        <up-modal :show="show" title="嗨创生活余额支付">
            <view class="modal-content">
                <view class="password_manage_input_item">
                    <input class="form-control" :password="!showP" placeholder="请输入密码" maxlength="16"
                        v-model="password" />
                    <view class="password_manage_input_item_eye" @click="showP = !showP">
                        <image v-if="showP" class="visible_img"
                            :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'" mode="scaleToFill" />
                        <image v-else class="visible_img"
                            :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'" mode="scaleToFill" />
                    </view>
                </view>
            </view>
            <template #confirmButton>
                <view class="modal-footer">
                    <view class="cancel-btn" @click="cancel">取消支付</view>
                    <view class="confirm-btn" @click="confirm">确认支付</view>
                </view>
            </template>
        </up-modal>
    </view>
</template>

<script>
import { userMakeOrder, completeOrder } from "../api/index"
export default {
    data() {
        return {
            show: false,
            password: '',
            showP: false,
            orderId: '',
            userGetId:'',//优惠券id
        }
    },
    methods: {
        open(info) {
            console.log(info);
            // 嗨创生活余额支付
            userMakeOrder({
                orderAmt: info.amount,
                mctId: info.mctId,
                userGetId:info.userGetId
            },{
                catchError: true,
            }).then(res => {
                console.log("userMakeOrder", res);
                this.orderId = res.id
                this.userGetId = info.userGetId;
                if (res.pwdFlag == '1') {
                    // 跳转到输入支付密码页面
                    this.show = true;
                } else if (res.pwdFlag == '0') {
                    this.$emit('success', {orderId: res.id,userGetId:info.userGetId,disAllAmt:info.disAllAmt,disAmt:info.disAmt});
                }
            }).catch(err => {
                console.log("userMakeOrder err", err);
                this.$emit('fail', err);
            })
        },
        cancel() {
            this.show = false;
            let params = {
                orderId: this.orderId,
                status: "2",
                userGetId:this.userGetId
            }
            this.completeOrder(params)
            this.$emit('cancel');
        },
        confirm() {
            if (!this.password) {
                uni.showToast({
                    title: '请输入密码',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            this.show = false;
            // let inputPwd = this.bridgeSdk.aesEncrypt(this.password).reqData
            let params = {
                orderId: this.orderId,
                // inputPwd: encodeURIComponent(inputPwd),
                inputPwd: this.password,
                status: "1",
                userGetId:this.userGetId
            }
            this.completeOrder(params)
        },
        completeOrder(params) {
            let extra = {
                mask: false, catchError: true,
            }

            completeOrder(params, params.status == '0' ? extra : {}).then(res => {
                console.log("completeOrder", res);
                if(params.status == '1'){
                    this.$emit('success', {orderId: res.id});
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.open_hi_pay {
    .password_manage_input_item {
        width: 600rpx;
        height: 114rpx;
        margin: 56rpx auto 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 54rpx;
        border-radius: 110rpx;
        background: #F6F6F6;
        position: relative;
    }

    .password_manage_input_item_eye {
        padding: 20rpx;
    }

    .visible_img {
        width: 48rpx;
        height: 48rpx;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20rpx;
        padding: 0 54rpx;
    }

    .cancel-btn {
        width: 150rpx;
        height: 60rpx;
        background: #eeeeee;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #2A57EC;
        line-height: 60rpx;
        text-align: center;
    }

    .confirm-btn {
        width: 150rpx;
        height: 60rpx;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
        box-shadow: 0rpx 6rpx 12rpx 2rpx rgba(98, 168, 243, 0.35);
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #FFFFFF;
        line-height: 60rpx;
        text-align: center;
    }
}
</style>