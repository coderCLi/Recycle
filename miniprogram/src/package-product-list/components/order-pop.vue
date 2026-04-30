<template>
    <view>
        <up-popup :show="show" round="30rpx" closeable :safeAreaInsetBottom="false" @close="doClose">
            <view class="pop">
                <!-- 顶部图片+基本信息 -->
                <view class="pop-top">
                    <image :src="minioBaseUrl + info.listPicUrl"/>
                    <view class="pop-top_content">
                        <view style="margin-bottom: 8rpx;font-weight: bold;width: 80%;">{{ info.spuName }}</view>
                        <!-- <view class="msg">周一至周日全天可用｜不限张数</view> -->
                        <view class="msg" style="display: flex;align-items: center;justify-content: space-between;">
                            <!-- <view>随时退 过期自动退</view> -->
                            <view></view>
                            <view class="amt">¥{{ toFixed(info.price || 0, 2) }}</view>
                        </view>
                    </view>
                </view>

                <!-- 数量信息 -->
                <view class="pop-nums">
                    <view style="line-height: 40rpx;color: #333;font-size: 28rpx;">
                        <view style="font-weight: bold;">购买数量</view>
                        <!-- <view style="line-height: 34rpx;color: #FF1F1F;font-size: 24rpx;margin-top: 4rpx;">每人每日限购2张</view> -->
                    </view>
                    <view style="display: flex;align-items: center;justify-content: flex-end;">
                        <view class="numberstep">
                            <view @click="doMinus">
                                <up-icon name="minus" size="20rpx"></up-icon>
                            </view>
                            <input v-model="info.num" type="number" @blur="inputBlur"/>
                            <view @click="doPlus">
                                <up-icon name="plus" size="20rpx"></up-icon>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 价格信息 -->
                <view class="pop-amt">
                    <view class="pop-amt_item">
                        <view>商品总价(共{{ info.num }}件)</view>
                        <view class="amt">¥{{ toFixed(info.totalPrice || 0, 2) }}</view>
                    </view>
                    <view class="pop-amt_item" v-if="info.disAmt > 0">
                        <view>团购优惠</view>
                        <view class="amt" style="color: red;">-¥{{ toFixed(info.disAmt || 0, 2) }}</view>
                    </view>
                    <view class="pop-amt_item" style="display: flex;align-items: center;justify-content: flex-end;margin-bottom: 0;">
                        <view class="amt" style="font-size: 24rpx;margin-right: 10rpx;">合计</view>
                        <view class="amt" style="color: red;">¥{{ toFixed(info.payPrice || 0, 2) }}</view>
                    </view>
                </view>

                <!-- 个人信息 -->
                <view class="pop-user">
                    <view class="pop-user_item">
                        <view>手机号码</view>
                        <view>{{ phone }}</view>
                    </view>
                    <view class="pop-user_gray">
                        <view style="font-weight: bold;margin-bottom: 5rpx;">预订须知</view>
                        <scroll-view scroll-y style="max-height: 200rpx;">
                            <u-parse style="font-size: 24rpx;line-height: 1.5;" lazy-load :content="bridgeSdk.addMinioPrefixToImgSrc(info.virtualProductRemark)"></u-parse>
                        </scroll-view>
                    </view>
                </view>

                <!-- 支付按钮区 -->
                <view class="pop-pay">
                    <view>
                        <view style="color: #FF1F1F;font-size: 24rpx;">
                            合计¥
                            <text style="font-size: 30rpx;font-weight: bold;">{{ toFixed(info.payPrice || 0, 2) }}</text>
                        </view>
                        <view style="color: #999999;font-size: 22rpx;margin-top: 4rpx;" v-if="info.disAmt > 0">
                            已优惠¥
                            <text style="font-size: 26rpx;">{{ toFixed(info.disAmt || 0, 2) }}</text>
                        </view>
                    </view>
                    <view class="pop-pay_btn" @click="doSubmitOrder">提交订单</view>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script>
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    import { couponOrder } from '../api/index'
    import { useMctStore } from '@/store'
    export default {
        name: 'order-pop',
        data() {
            return {
                divide,
                toFixed,

                show: false,// 显示状态
                info: {},// 订单信息
                mctId: '',// 商户号
                phone: '',// 手机号码

                numMin: 1,// 数量最小值
                numMax: 99,// 数量最大值
            }
        },
        watch: {
            'info': {
                handler(newVal) {
                    if(newVal.num < this.numMin || newVal.num > this.numMax) return;
                    // 计算总价
                    this.info.totalPrice = multiply(newVal.num||1, newVal.originalPrice)
                    this.info.disAmt = multiply(minus(newVal.originalPrice, newVal.price), newVal.num)
                    this.info.payPrice = multiply(newVal.price, newVal.num)
                },
                deep: true
            }
        },
        methods: {
            // 打开弹窗
            openPop() {
                this.show = true;
                //获取订单信息
                this.info = this.bridgeSdk.checkIsEmpty(useMctStore().orderInfo) ? useMctStore().orderInfo : {}
                if(!this.info.num) this.info.num = this.numMin; //默认购买数量为1

                this.mctId = this.bridgeSdk.checkIsEmpty(useMctStore().orderMctId) ? useMctStore().orderMctId : ''

                let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
                const { userId, mobile } = userInfo;
                this.phone = mobile;
            },
            // 减
            doMinus() {
                if (this.info.num <= 1) {
                    uni.showToast({
                        title: '数量不能小于1',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.info.num = minus(this.info.num, 1)
            },
            // 加
            doPlus() {
                if (this.info.num >= 99) {
                    uni.showToast({
                        title: '数量不能大于99',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.info.num = plus(this.info.num, 1)
            },
            // 输入框失去焦点
            inputBlur(info, index) {
                if(!this.info.num || this.info.num < this.numMin) this.info.num = this.numMin;
                if(this.info.num > this.numMax) this.info.num = this.numMax;
            },
            // 关闭弹窗
            doClose(doEmit = true) {
                this.show = false;
                //清除pinia中的sku列表
                useMctStore().clearOrderShoppingAll()
                //清除pinia中优惠券信息
                useMctStore().clearOrderCoupon()
                //清除pinia中订单信息
                useMctStore().clearOrderInfo()
                doEmit && this.$emit('on-close')
            },
            //获取经纬度
            getLocation() {
                return new Promise((resolve, reject) => {
                    this.bridgeSdk.getLocation((res) => {
                        console.log(res, "获取定位");
                        resolve(res)
                    });
                })
            },
            // 提交订单
            async doSubmitOrder() {
                //获取经纬度
                // let locationObj = await this.getLocation()
                //获取设备信息
                let deviceObj = await this.bridgeSdk.getDeviceInfo()
                // 提交订单
                let res = await couponOrder({
                    shopsId: useMctStore().orderStoreId,//店铺id
                    num: this.info.num,//购买数量
                    skuId: this.info.skuId,//商品id
                    mallScene: 'store',//支付场景 /*门店 (store), 商城(mall)*/
                    orderSource: 'ICBCAPP',
                    // #ifdef H5
                    webNotifyUrl: encodeURIComponent(this.baseUrl + '#/package-product-list/orderDetail/orderDetailNew'),//订单完成回调页面
                    // webNotifyUrl: encodeURIComponent(this.baseUrl + '#/package-product-list/orderDetail/orderDetailTemp'),//订单完成回调页面 8.15上线用
                    // #endif
                    // #ifdef MP-WEIXIN
                    webNotifyUrl: 'nojump',//订单完成回调页面
                    // #endif
                    // lat: locationObj.lat,//纬度
                    // lng: locationObj.lng,//经度
                    lat: '38.8799877',//纬度
                    lng: '115.471463',//经度
                    ip: deviceObj.ip||'127.0.0.1',//ip
                    mac: deviceObj.mac||'MAC',//mac
                    deviceId: deviceObj.deviceId||'DEVICE',//设备编号
                    mobile: this.phone,
                })
                console.log(res)
                let encodeUrl = encodeURIComponent(res.payUrl)
                // #ifdef MP-WEIXIN
                this.bridgeSdk.jumpPage({
                    url: '/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                })
                // #endif
                // #ifdef H5
                let _q = res.payUrl.indexOf("?") > -1 ? "&" : "?";
                location.href = res.payUrl + _q + '_needH5Head=1&appToken=' + this.bridgeSdk.getStorageSync('appToken')
                // #endif
                useMctStore().setOrderId(res.orderNo)
                this.doClose(false)
                this.$emit('on-submit', res)
            },
        }
    }
</script>

<style lang="scss" scoped>
/* 文本超长展示 */
.text-overflow{
    overflow: hidden;
    /*禁止换行*/
    white-space: nowrap;
    /*显示省略号*/
    text-overflow: ellipsis;
}
/* 文本超长展示 */
.muti-overflow{
    /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    display: -webkit-box;
    /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
    -webkit-box-orient:vertical;
    /*要显示的行数*/
    -webkit-line-clamp: 2;
    /* 溢出部分隐藏 */
    overflow:hidden;
}
.pop{
    padding: 30rpx 0;
    &-top{
        display: flex;
        padding:0 0 30rpx;
        margin: 0 30rpx;
        border-bottom: 1rpx solid #D8D8D8;
        background-color: white;
        image{
            width: 120rpx;
            height: 120rpx;
        }
        &_content{
            flex: 1;
            margin: 0 0 0 18rpx;
            line-height: 40rpx;
            font-size: 28rpx;
            color: #222;
            .msg{
                color: #999999;
                font-size: 24rpx;
                line-height: 34rpx;
            }
            .amt{
                color: #FF1F1F;
                font-size: 28rpx;
                font-weight: bold;
                &::first-letter{
                    font-size: 26rpx;
                }
            }
        }
    }
    &-nums{
        padding: 28rpx 0rpx;
        margin: 0 30rpx;
        border-bottom: 1rpx solid #D8D8D8;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;


        .numberstep{
            display: flex;
            align-items: center;
            height: 40rpx;
            border-radius: 20rpx;
            border: 2rpx solid #999999;
            input{
                width: 76rpx;
                border-left: 2rpx solid #999999;
                border-right: 2rpx solid #999999;
                text-align: center;
                font-size: 28rpx;
            }
            view{
                width: 40rpx;
                font-size: 28rpx;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    &-amt{
        padding: 28rpx 0 26rpx;
        margin: 0 30rpx;
        background-color: white;
        &_item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 28rpx;
            color: #333;
            margin-bottom: 28rpx;
            font-weight: bold;
            .amt{
                color: #666666;
                &::first-letter {
                    font-size: 26rpx;
                }
            }
        }
    }
    &-user{
        background-color: white;
        padding: 28rpx 30rpx;
        font-size: 28rpx;
        color: #333333;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            top: -8rpx;
            left: 0;
            right: 0;
            height: 8rpx;
            background-color: #EFEFEF;
            width: 100%;
        }
        &_item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
        }
        &_gray{
            width: calc(100% - 40rpx);
            min-height: calc(126rpx - 48rpx);
            border-radius: 12rpx;
            background-color: #EFEFEF;
            padding: 24rpx 20rpx;
            color: #999999;
            font-size: 24rpx;
            margin-top: 28rpx;
        }
    }
    &-pay{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 52rpx 32rpx 32rpx;
        background-color: white;
        &_btn{
            width: 328rpx;
            height: 84rpx;
            border-radius: 42rpx;
            line-height: 84rpx;
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
            text-align: center;
            color: white;
            font-size: 32rpx;
            font-weight: 600;
        }
    }
}
</style>