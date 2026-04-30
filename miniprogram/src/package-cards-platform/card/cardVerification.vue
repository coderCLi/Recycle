<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main">
        <view style="padding:30rpx;">
            <view class="qrCode-title flex flex_ac flex_col flex_jc">
                <text>{{cardList.couponBaseName}}</text>
                <text>有效期至：{{cardList.useEndTime}}</text>
            </view>
            <view class="qrCode-box">
                <view class="flex">
                    <view class="user-icon">
                        <view class="phone">券码：{{cardList.couponBaseId}}</view>
                    </view>
                </view>
                <view class="qrCode-corner">
                    <template v-if="true">
                        <view class="qrCode-container" @click="createQrCode">
                            <view class="qrCode-box-inner">
                                <!-- <canvas id="qrcode" canvas-id="qrcode" class="qrCode" @click="createQrCode"></canvas> -->
                                <u-qrcode :size="200" :val="QRcodeContent" class="qrCode"/>
                            </view>
                        </view>
                        <view class="tips" @click="createQrCode">
                            <uni-icons type="reload" size="16" color="#32cbc6"></uni-icons> 点击二维码区域可刷新
                        </view>
                    </template>

                </view>
            </view>
            <view class="rich-box" v-if="cardList.remark">
                <view style="margin-bottom: 10rpx;">使用说明:</view>
                <up-parse :content="bridgeSdk.addMinioPrefixToImgSrc(cardList.remark)" class="rich-text"></up-parse>
            </view>
        </view>

        <vc-safe-bottom />
    </vc-container>
</template>
<script>
import { mapState } from 'pinia'
import { useBaseStore, useUserStore } from "@/store/index";
import { userCoupon, getCouponDetails } from '../api/cardApi';//详情接口
// import UQRCode from 'uqrcodejs';
export default {
    name: "cardVerification",
    data() {
        return {
            propsData: {//标题数据
                props: {
                    title: {
                        value: '卡券核销'
                    },
                }
            },
            couponBaseId: '',
            qrCodeSource: "",
            cardList: {},
            couponFlowInfoById:'',
            QRcodeContent: "",
            userInfo: {},
        }
    },
    onLoad(options) {
        this.couponBaseId = options.couponBaseId;//卡券id
        this.couponFlowInfoById = options.userGetId;
 if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
      return
    }
    this.__loadData__()
        // this.trackReport.trackPageView("卡券码");
        this.getList();
    },
    onUnload() {
    // 获取当前页面栈
    const pages = getCurrentPages();
    // 获取前一个页面的实例（即 cardList.vue）
    const prevPage = pages[pages.length - 2]; 
    // 检查前一个页面是否存在
    if (prevPage) {
      // 设置前一个页面的刷新标志
      prevPage.$vm.needRefresh = true;
    }
  },
    computed: {
        ...mapState(useBaseStore, {
            safeTopDistance: 'safeTopDistance'
        }),
    },
    onReady() {
        
    },
    methods: {
        async __loadData__ () {
            // 获取用户信息，可能为空
            this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            // 用户信息为空时，不执行后续逻辑，组件vc-login会提示登录
        },
        getList() {
            // 获取卡券详情
            getCouponDetails({ couponBaseId: this.couponBaseId ,couponFlowInfoById:this.couponFlowInfoById}).then(res => {
                console.log(res, "resresresres1111");
                this.cardList = res;
                this.createQrCode();
            })
        },
        toggle() {
            console.log(this.cardList, "this.cardList");
            // 获取卡券详情
            // let params = {
            //     userGetId: this.cardList.userGetId,
            //     goodsId: '',
            //     sceneId: '',
            //     countNum: '1',
            // }

            let json = [
                {
                    userGetId: this.cardList.userGetId,
                    goodsId: '',
                    sceneId: '',
                    countNum: '1',
                }
            ]
            let params = JSON.stringify(json);
            userCoupon({ jsonList: params }).then(res => {
                console.log(res, "核销成功");
            })
        },
        createQrCode() { 
            if(!this.cardList.couponBaseId || !this.cardList.userGetId) {
                this.bridgeSdk.showToast({
                    title: '生成二维码的信息不完整'
                });
                return;
            }
            //  this.cardList.couponBaseId + "," +this.cardList.userGetId + Date.now();
            const s = this.cardList.couponBaseId + "," + this.cardList.userGetId + "," + this.userInfo.userId + ',' + Date.now();
            this.QRcodeContent = s;
            // // 获取uQRCode实例
            // var qr = new UQRCode();
            // // 设置二维码内容
            // // qr.data = "https://uqrcode.cn/doc";
            // qr.data = s;
            // // 设置二维码大小，必须与canvas设置的宽高一致
            // qr.size = 200;
            // // 调用制作二维码方法
            // qr.make();
            // // 获取canvas上下文
            // // 如果是组件，this必须传入
            // var canvasContext = uni.createCanvasContext('qrcode', this);
            // // 设置uQRCode实例的canvas上下文
            // qr.canvasContext = canvasContext;
            // // 调用绘制方法将二维码图案绘制到canvas上
            // qr.drawCanvas();
        }

    }
}
</script>

<style lang="scss" scoped>
.main {
    background: #fff;
    height: 100vh;
}



.qrCode {

    width: 200px;
    height: 200px;
    //     width: 480rpx;
    //     height: 480rpx;
    //     float: left;
    z-index: 1;
}

.qrCode-container {
    position: relative;
}
.qrCode-box-inner {
    position: relative;
    pointer-events: none;
}

.logo {
    width: 64rpx;
    height: 64rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 888888;
}

.qrCode-title {
    padding: 20rpx 0;

    text:first-child {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        line-height: 70rpx;
    }

    text:last-child {
        font-size: 24rpx;
        color: #333;
    }
}
.rich-box{
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    background: white;
    padding: 20rpx;
    margin-top: 20rpx;
    .rich-text{
        font-size: 24rpx;
        width: 100%;
    }
}
.qrCode-box {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    background: white;
    padding-top: 20rpx;
    background: linear-gradient(to right, #00bcb9, #11ffbd);

    .name,
    .phone {
        color: #fff;
        line-height: 60rpx;
    }

    .name {
        font-size: 32rpx;
        margin-bottom: 22rpx;
    }

    .phone {
        font-size: 28rpx;
    }
}

.flex {
    display: flex;
    align-items: center;
    padding-bottom: 20rpx;
}

.user-icon {
    margin-left: 24rpx;
    margin-right: 32rpx;
}

.qrCode-corner {
    padding: 32rpx 0 72rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    position: relative;
    min-height: 624rpx;

    .tips {
        // pointer-events: none;
        font-size: 28rpx;
        color: #32cbc6;
        padding-top: 24rpx;
    }

    .toLogin {
        font-size: 28rpx;
        // color: #32cbc6;
    }
}

.login-box {
    padding-bottom: 20rpx;
    padding-left: 48rpx;
    font-size: 28rpx;
    color: white;
}
</style>