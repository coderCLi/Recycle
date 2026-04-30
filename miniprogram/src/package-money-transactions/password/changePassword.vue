<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="password_manage">
        <image class="password_manage_bg" :src="minioBaseUrl + '/common/mctImages/bg_img_style02.png'"
            mode="scaleToFill" />
        <psd-header class="password_manage_header" title="修改密码" desc="修改密码，保障资金安全"
            iconUrl="/common/mctImages/mimaguanli_top_icon_style03_img.png"></psd-header>

        <view class="password_manage_input_item">
            <input class="form-control" :password="!showPOld" placeholder="请输入原密码" maxlength="16"
                    v-model="passwordOld" />
            <view class="password_manage_input_item_eye" @click="showPOld = !showPOld">
                <image v-if="showPOld" class="visible_img"
                    :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'" mode="scaleToFill" />
                <image v-else class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'"
                    mode="scaleToFill" />
            </view>
        </view>
        <view class="password_manage_input_item">
            <input class="form-control" :password="!showP1" placeholder="请输入密码" maxlength="16"
                    v-model="password1" />
            <view class="password_manage_input_item_eye" @click="showP1 = !showP1">
                <image v-if="showP1" class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'"
                    mode="scaleToFill" />
                <image v-else class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'"
                    mode="scaleToFill" />
            </view>
        </view>
        <view class="password_manage_input_item">
            <input class="form-control" :password="!showP2" placeholder="请再次输入密码" maxlength="16"
                    v-model="password2" />
            <view class="password_manage_input_item_eye" @click="showP2 = !showP2">
                <image v-if="showP2" class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'"
                    mode="scaleToFill" />
                <image v-else class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'"
                    mode="scaleToFill" />
            </view>
        </view>
        <view class="password_manage_input_btn" @click="nextStep">
            下一步
        </view>
    </view>

</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
import psdHeader from '../components/psdHeader.vue';
import { updatePayPwd } from '../api/index';
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
            stepType: 0,
            phone: "",
            code: "",
            codeMsg: "获取验证码",
            passwordOld: "",
            password1: "",
            password2: "",
            showPOld: false,
            showP1: false,
            showP2: false,
        }
    },
    methods: {
        nextStep() {
            if (!this.passwordOld) {
                uni.showToast({
                    title: "请输入原密码",
                    icon: "none"
                });
                return;
            }
            if (!this.password1) {
                uni.showToast({
                    title: "请输入新密码",
                    icon: "none"
                });
                return;
            }
            if (!this.password2) {
                uni.showToast({
                    title: "请再次输入新密码",
                    icon: "none"
                });
                return;

            }
            if (this.password1 !== this.password2) {
                uni.showToast({
                    title: "两次输入新密码不一致",
                    icon: "none"
                });
                return;
            }

            // let oldPwd = this.bridgeSdk.aesEncrypt(this.passwordOld).reqData;
            // let newPwd = this.bridgeSdk.aesEncrypt(this.password1).reqData;
            let params = {
                // oldPwd: encodeURIComponent(oldPwd),
                // newPwd: encodeURIComponent(newPwd)
                oldPwd: this.passwordOld,
                newPwd: this.password1,
            }

            updatePayPwd(params).then((res) => {
                this.$refs.modal.open({
                    title: "修改成功",
                    content: "密码修改成功",
                    showCancel: false,
                    confirmText: "确定",
                    confirmCallback: (res) => {
                        uni.navigateBack({
                            delta: 1
                        });
                    }
                })
            })
        },
    }
}
</script>

<style scoped lang="scss">
.password_manage {
    width: 750rpx;
    height: 100vh;
    background: linear-gradient(to bottom, #f5f5f5 0%, #fff 40%, #fff 100%);
    position: relative;
}

.password_manage_header {
    position: relative;
}

.password_manage_bg {
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 0;
}

.password_manage_input_item {
    width: 644rpx;
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

.password_manage_input_item {
    width: 644rpx;
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

.password_manage_input_item_code {
    font-weight: bold;
    font-size: 30rpx;
    color: #2A57EC;
    line-height: 42rpx;
}

.password_manage_input_item_eye {
    padding: 20rpx;
}

.visible_img {
    width: 48rpx;
    height: 48rpx;
}

.password_manage_input_btn {
    width: 614rpx;
    height: 94rpx;
    background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
    box-shadow: 0rpx 6rpx 12rpx 2rpx rgba(98, 168, 243, 0.35);
    opacity: 0.78;
    border-radius: 100rpx;
    margin: 350rpx auto 0;
    text-align: center;
    font-weight: normal;
    font-size: 30rpx;
    color: #FFFFFF;
    line-height: 94rpx;
}
</style>