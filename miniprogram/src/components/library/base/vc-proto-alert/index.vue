<!--
 * @Description: 登录页面，我已同意《用户协议》《隐私政策》，alert弹窗
 * @Author: yuguangquan
 * @Date: 2024-12-31 09:11:13
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-21 15:06:46
 * @Remark: 
-->
<template>
    <view class="vc-proto-alert">
        <u-overlay :show="show">
            <view class="container-box">
                <view class="container-con">
                    <view class="title">用户协议和隐私政策</view>
                    <view class="content">
                        我已阅读并同意<text class="proto" @click.stop="checkUserProtocol">《用户协议》</text>和<text class="proto" @click.stop="checkPrivacyProtocol">《隐私政策》</text>
                    </view>
                    <view class="agree-btn" @click="agreeAction">同意</view>
                    <view class="no-agree-btn" @click="show = false">不同意</view>
                </view>
            </view>
        </u-overlay>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "用户协议和隐私政策",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                show: false,
                openType: ''
            }
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },
        methods: {
            open(openType) {
                this.openType = openType;
                this.show = true;
            },
            agreeAction() {
                this.show = false;
                this.$emit("agree-action", this.openType);
            },
            checkUserProtocol() {
              this.trackReport.trackPageView("用户服务协议");

              this.bridgeSdk.jumpPage({
                url: this.minioBaseUrl + 'hbdbucket//home/micro/hbd/agreement/user_agree-mini.html',
                title: '用户服务协议'
              })
            },
            checkPrivacyProtocol() {
              this.trackReport.trackPageView("隐私政策");

              this.bridgeSdk.jumpPage({
                url: this.minioBaseUrl + 'hbdbucket/home/micro/hbd/agreement/privacy-mini.html',
                title: '隐私政策'
              })
            },
        },
    }
</script>

<style lang="scss">
.container-box {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .container-con {
        padding: 40rpx 40rpx 30rpx;
        background-color: #ffffff;
        border-radius: 30rpx;
    }
}
.title {
    font-weight: bold;
    font-size: 36rpx;
    color: #222222;
    text-align: center;
    font-style: normal;
    padding-bottom: 42rpx;
}
.content {
    color: rgb(91, 91, 91);
    font-size: 28rpx;
    text-align: center;
    font-style: normal;
    padding-bottom: 48rpx;
    .proto {
        color: #6FA9F7;
    }
}
.agree-btn {
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 36rpx;
    text-align: center;
    background: linear-gradient( 132deg,  #58A1F6 0%, #6FA9F7 100%), #FF5871;
    height: 84rpx;
    line-height: 84rpx;
    border-radius: 42rpx;
}
.no-agree-btn {
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
    text-align: center;
    height: 84rpx;
    line-height: 84rpx;
    margin-top: 12rpx;
}
</style>
