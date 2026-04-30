<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="password_manage">
        <image class="password_manage_bg" :src="minioBaseUrl + '/common/mctImages/bg_img_style02.png'"
            mode="scaleToFill" />
        <psd-header class="password_manage_header" :title="title" :desc="desc"
            iconUrl="/common/mctImages/mimaguanli_top_icon_style03_img.png"></psd-header>

        <view v-if="stepType === 1">
            <view class="password_manage_input_item">
                <input v-model="userInfo.desMobile" type="number" placeholder="请输入手机号" maxlength="11" border="none"
                    disabled />
            </view>
            <view class="password_manage_input_item">
                <input v-model="code" type="number" placeholder="请输入验证码" maxlength="6" border="none" />
                <text class="password_manage_input_item_code" @click="getCode">{{ codeMsg }}</text>
            </view>
            <view class="password_manage_input_btn" @click="setPassword">
                确认
            </view>
        </view>
        <view v-if="stepType === 0">
            <view class="password_manage_input_item">
                <!-- <up-input v-model="password1" :type="showP1 ? 'text' : 'password'" placeholder="请输入密码" border="none"
                    :passwordVisibilityToggle="true"></up-input> -->
                <input class="form-control" :password="!showP1" :placeholder="`请输入${pageType == 'new' ? '' : '新'}密码`"
                    maxlength="16" v-model="password1" />
                <view class="password_manage_input_item_eye" @click="showP1 = !showP1">
                    <image v-if="showP1" class="visible_img"
                        :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'" mode="scaleToFill" />
                    <image v-else class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'"
                        mode="scaleToFill" />
                </view>
            </view>
            <view class="password_manage_input_item">
                <!-- <up-input v-model="password2" :type="showP2 ? 'text' : 'password'" placeholder="请再次输入密码" border="none"
                    :passwordVisibilityToggle="true"></up-input> -->
                <input class="form-control" :password="!showP2" :placeholder="`请再次输入${pageType == 'new' ? '' : '新'}密码`"
                    maxlength="16" v-model="password2" />
                <view class="password_manage_input_item_eye" @click="showP2 = !showP2">
                    <image v-if="showP2" class="visible_img"
                        :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'" mode="scaleToFill" />
                    <image v-else class="visible_img" :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'"
                        mode="scaleToFill" />
                </view>
            </view>
            <view class="password_manage_input_btn" @click="nextStep">
                下一步
            </view>
        </view>
    </view>

</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
import psdHeader from '../components/psdHeader.vue';
import { getCode, getUserInfo } from "@/api/login";

import { setPassword } from "../api/index"
export default {
    components: { psdHeader },
    computed: {
        ...mapState(useUserStore, {
            // isLogined: "isLogined",
            // userInfo: "userInfo",
        }),
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            pageType: "",
            stepType: 0,
            phone: "",
            code: "",
            codeMsg: "获取验证码",
            password1: "",
            password2: "",
            showP1: false,
            showP2: false,
            title: "忘记密码",
            desc: "忘记密码，找回密码",
        }
    },
    async onLoad(options) {
        console.log("setPassword onLoad", options);
        this.pageType = options.pageType;
        if (this.pageType === "new") {
            this.title = "设置密码";
            this.desc = "设置交易密码，请牢记";
            this.stepType = 0;
        }
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
            return;
        }
        this.__loadData__();
    },
    methods: {
        __loadData__() {
            this.getUserInfo();
        },
        getUserInfo() {
            getUserInfo().then((res) => {
                console.log("getUserInfo", res);
                this.userInfo = res;
                this.isLogined = true;
            }).catch(() => {
                this.bridgeSdk.toLogin();
            });
        },
        getCode() {
            console.log("getCode", this.codeMsg);
            console.log("userInfo", this.userInfo);
            if (this.codeMsg !== "获取验证码") return;
            let _phone = this.userInfo.mobile;
            let _msgType = "01"
            getCode({ phone: _phone, msgType: _msgType })
                .then((res) => {
                    let count = 60;
                    // uni.showModal({
                    //     title: '获取验证码成功',
                    //     content: res,
                    //     showCancel: false,
                    // })
                    this.codeMsg = count + "秒";
                    let timer = setInterval(() => {
                        count--;
                        this.codeMsg = count + "秒";
                        if (count === 0) {
                            clearInterval(timer);
                            this.codeMsg = "获取验证码";
                        }
                    }, 1000);
                })
                .catch(() => { });
        },
        nextStep() {
            if (!this.password1) {
                uni.showToast({
                    title: `请输入${this.pageType == 'new' ? '' : '新'}密码`,
                    icon: "none"
                });
                return;
            }
            if (!this.password2) {
                uni.showToast({
                    title: `请再次输入${this.pageType == 'new' ? '' : '新'}密码`,
                    icon: "none"
                });
                return;

            }
            if (this.password1 !== this.password2) {
                uni.showToast({
                    title: "两次输入密码不一致",
                    icon: "none"
                });
                return;
            }
            this.stepType = 1;
        },
        setPassword() {
            console.log("setPassword");
            if (!this.code) {
                uni.showToast({
                    title: "请输入验证码",
                    icon: "none"
                });
                return;

            }
            if (!this.reg.checkCode(this.code)) {
                uni.showToast({
                    title: "请输入正确的验证码",
                    icon: "none",
                });
                return;
            }
            // let inputPwd = this.bridgeSdk.aesEncrypt(this.password1).reqData;
            let params = {
                // inputPwd: encodeURIComponent(inputPwd),
                inputPwd: this.password1,
                checkCode: this.code,
                mobile: this.userInfo.mobile,
                msgType: "01"
            }
            console.log("params", params);
            setPassword(params).then(() => {
                this.$refs.modal.open({
                    title: `${this.pageType === "new" ? "设置" : "重置"}成功`,
                    content: `密码${this.pageType === "new" ? "设置" : "重置"}成功`,
                    showCancel: false,
                    confirmText: "确定",
                    confirmCallback: (res) => {
                        uni.navigateBack({
                            delta: 1
                        });
                    }
                })

            }).catch((err) => {
                console.log("setPassword err", err);
            });
        }
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