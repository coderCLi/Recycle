<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main">
        <view style="padding:30rpx;">
            <view class="qrCode-title flex flex_ac flex_col flex_jc">
                <text>{{ waitUseCopList[nowCop]?.spuName }}</text>
                <text>{{ waitUseCopList[nowCop]?.useDesc }}</text>
            </view>
            <!-- 券码展示 -->
            <view class="qrCode-box">
                <view class="title">
                    待使用券码
                    <text style="color: red;">{{ waitUseCopList.length }}</text>
                    张
                </view>
                <view class="qrCode-corner" style="position: relative;">
                    <template v-if="true">
                        <up-icon v-if="nowCop != 0" @click="changeCop('prev')" name="arrow-left" style="position: absolute;left: 10rpx;top: 45%;transform: translateY(-50%);"/>
                        <view class="qrCode-container" @click="createQrCode">
                            <view class="qrCode-box-inner">
                                <u-qrcode :size="200" :val="QRcodeContent" class="qrCode"/>
                            </view>
                        </view>
                        <up-icon v-if="nowCop != waitUseCopList.length - 1" @click="changeCop('next')" name="arrow-right" style="position: absolute;right: 10rpx;top: 45%;transform: translateY(-50%);"/>
                        <view class="tips" @click="createQrCode">
                            <uni-icons type="reload" size="16" color="#32cbc6"></uni-icons> 点击二维码区域可刷新
                        </view>
                    </template>
                </view>
                <view class="flex" v-for="(item, index) in waitUseCopList" :key="index">
                    <view class="user-icon">
                        <view class="phone" style="display: flex;justify-content: space-between;">
                            <view style="display: flex;align-items: center;justify-content: flex-start;">
                                券码：{{ item.virtualProductHoldId }}
                                <view style="color: rgb(0, 188, 184);margin-left: 10rpx;" @click="doCopy(item)">复制</view>
                            </view>
                            <!-- <text style="color: rgb(0, 188, 184);" @click="doCopy(item)">复制</text> -->
                            <text style="color: rgb(0, 188, 184);margin-left: 10rpx;" @click="applyRefund(item)">申请退款</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 使用说明 -->
            <view class="rich-box" v-if="couponInfo.remark">
                <view style="margin-bottom: 10rpx;">使用说明:</view>
                <rich-text :nodes="bridgeSdk.addMinioPrefixToImgSrc(couponInfo.remark)" class="rich-text"></rich-text>
            </view>
        </view>

        <vc-safe-bottom />
    </vc-container>
</template>
<script>
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
import { 
    usermOrderDetailsNew 
} from '../api/index'
export default {
    name: "getCouponDetail",
    data() {
        return {
            propsData: {//标题数据
                props: {
                    title: {
                        value: '券码'
                    },
                }
            },
            orderId: '',// 订单编号
            QRcodeContent: "",// 二维码内容
            userInfo: {},// 用户信息
            couponInfo: {},// 卡券信息
            waitUseCopList: [],// 卡券列表
            nowCop: 0,// 当前券索引
            subList: [],//子订单列表

        }
    },
    onLoad(options) {
        this.orderId = options.orderId;
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
            return
        }
        this.__loadData__()
        // this.getOrderDetail();
    },
    computed: {
        ...mapState(useBaseStore, {
            safeTopDistance: 'safeTopDistance'
        }),
    },
    onShow() {
        this.getOrderDetail();
    },
    methods: {
        async __loadData__ () {
            // 获取用户信息，可能为空
            this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
        },
        getOrderDetail() {
            usermOrderDetailsNew({
                orderId: this.orderId
            }).then(res=>{
                // 虚拟商品为卡券时，券码展示（默认第1张券码）
                const subList = res.subOrderList
                this.subList = [...subList]
                this.waitUseCopList = subList.filter(e => e.status == 'PENDING_USE')
                if(this.waitUseCopList.length > 0) {
                    this.nowCop = 0
                    this.QRcodeContent = this.waitUseCopList[0].virtualProductId + "," + this.waitUseCopList[0].virtualProductHoldId + "," + this.userInfo.userId + ',' + Date.now();
                } else {
                    this.bridgeSdk.showConfirm({
                        title: '提示',
                        content: '没有可使用的卡券',
                        confirmText: '确定',
                        showCancel: false,
                        confirmCallback: (res) => {
                            this.bridgeSdk.navigateBackTo({
                                delta: 1
                            })
                        },
                    })
                }
                // 卡券信息
                let attr = JSON.parse(res.subOrderList[0].attributes)
                if(!attr) return
                this.couponInfo = attr
            })
        },
        // 刷新二维码
        createQrCode() { 
            if(!this.waitUseCopList[this.nowCop].virtualProductId || !this.waitUseCopList[this.nowCop].virtualProductHoldId) {
                this.bridgeSdk.showToast({
                    title: '生成二维码的信息不完整'
                });
                return;
            }
            const s = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," + this.userInfo.userId + ',' + Date.now();
            this.QRcodeContent = s;
        },
        // 卡券切换
        changeCop(type) {
            if(type == 'prev') {
                this.nowCop -= 1
                this.QRcodeContent = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," + this.userId + ',' + Date.now();
            } else {
                this.nowCop += 1
                this.QRcodeContent = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," +  this.userId + ',' + Date.now();
            }
        },
        // 拷贝
        doCopy(e) {
            uni.setClipboardData({
                data: e.virtualProductHoldId, 
                success: function () {
                    uni.showToast({
                        title:'复制成功',
                        icon:'none'
                    })
                }
            })
        },
        // 申请退款
        applyRefund(e) {
            let hasRefund = this.subList.some(e => ['REFUND_REVIEWING', 'REFUND_PROCESSING', 'EXPIRED_REFUNDING_PROCESSING'].includes(e.status))
            if(hasRefund) {
                this.bridgeSdk.showToast({
                    title: "您有一笔退款正在处理中，请完成后重新操作"
                })
                return;
            }
            this.bridgeSdk.jumpPage({
                url: '/package-product-list/orderDetail/orderRefund?singleRefund=1&singleRefundSubId=' + e.subOrderId + '&orderId=' + this.orderId + '&doType=VIRTUAL_REFUND_REASON'
            })
        },
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
    margin-bottom: 20rpx;

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
    }
}
.qrCode-box {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    background: white;
    padding: 20rpx 30rpx 10rpx;
    .title {
        font-size: 30rpx;
        margin-bottom: 10rpx;
        font-weight: bold;
    }
}

.flex {
    display: flex;
    align-items: center;
    padding-bottom: 20rpx;
}

.user-icon {
    font-size: 24rpx;
    width: 100%;
}

.qrCode-corner {
    padding: 10rpx 0 10rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    position: relative;
    min-height: 524rpx;

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