<!--
 * @Description: 下单
 * @Autor: TF
 * @Date: 2025-03-31 10:00:36
 * @LastEditors: TF
 * @LastEditTime: 2025-05-27 19:18:52
-->
<template>
    <view>
        <vc-modal ref="modal"></vc-modal>
        <vc-container ref="container" :props-data="containerProps" style="background-color: #f8f8f8;">
            
            <view style="width: 90%;margin: 40rpx auto 0;border-radius: 20rpx;">
                <!-- 取货方式 -->
                <!-- <view class="tab-block">
                    <view :class="['tab-block_item', tab == 1 ? 'active' : '' ]" @click="tab = 1">快递邮寄</view>
                    <view :class="['tab-block_item', tab == 2 ? 'active' : '' ]" @click="tab = 2">店铺自取</view>
                </view> -->
                <!-- 地址选择 -->
                <view class="address-block" v-if="tab == 1" :style="{padding: bridgeSdk.checkIsEmpty(addressInfo) ? '20rpx 40rpx' : '40rpx' }">
                    <template v-if="bridgeSdk.checkIsEmpty(addressInfo)">
                        <view @click="getAddress">
                            <view class="address-block_top">
                                <view>{{ addressInfo.name }}</view>
                                <view style="font-size: 30rpx;margin-left: 10rpx;">{{ addressInfo.mobile }}</view>
                            </view>
                            <view class="address-block_btm">
                                {{ addressInfo.provinceName }}
                                {{ addressInfo.cityName }}
                                {{ addressInfo.areaName }}
                                {{ addressInfo.address }}
                            </view>
                        </view>
                        <up-icon name="arrow-right" color="#999" size="15"  @click="getAddress"/>
                    </template>
                    <template v-else>
                        <view class="address-block_main" @click="getAddress">
                            <view>请选择收货地址</view>
                            <up-icon name="arrow-right" color="#999" size="15"/>
                        </view>
                    </template>
                </view>
                <!-- 自提信息 -->
                <view class="address-block" v-if="tab == 2">
                </view>
            </view>

            <!-- 订单信息 -->
            <view class="info-block">
                <view class="info-block_title"></view>

                <view :style="{height: info.productInfo.length > 3 ? (isOver ? 'auto' : '500rpx') : 'auto', overflow: 'hidden'}">
                    <view class="info-block_item" v-for="(item, index) in info.productInfo" :key="index">
                        <image :src="`${minioBaseUrl}${item.skuMediaList[0]}`"></image>
                        <view class="info-block_item--main">
                            <view style="display: flex;align-items: flex-end;justify-content: space-between;">
                                <view>{{ item.spuName }}</view>
                                <view class="gray amt">¥{{ item.price }}</view>
                            </view>
                            <view style="display: flex;align-items: flex-end;justify-content: space-between;">
                                <view style="font-size: 22rpx;color: #999;">{{ item.skuName }}</view>
                                <view class="gray">数量 x{{ item.num }}</view>
                            </view>
                            <view style="display: flex;align-items: flex-end;justify-content: flex-end;margin-top: 10rpx;">
                                <!-- 合计： -->
                                <view class="red amt">¥{{ item.skuTotalPrice }}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-if="info.productInfo.length > 3" class="info-block_over" @click="isOver=!isOver">
                    <view>{{ isOver ? '收起' : '展开' }}(共{{ allNum }}件商品)</view>
                    <up-icon :name="isOver ? 'arrow-up' : 'arrow-down'" size="22rpx" color="gray" style="margin-left: 10rpx;"/>
                </view>

                <view class="info-block_btm" style="margin-top: 60rpx;">
                    <view>商品总价</view>
                    <view class="amt">¥{{ toFixed(info.totalPrice, 2) }}</view>
                </view>

                <view class="info-block_btm">
                    <view>优惠券</view>
                    <view style="display: flex;align-items: center;justify-content: flex-end;" @click="getCoupons">
                        <view style="color: red;" v-if="bridgeSdk.checkIsEmpty(couponInfo)">
                            <text style="font-size: 24rpx;margin-right: 10rpx;">{{ couponInfo.couponBaseTypeName }}</text>
                            <text style="font-size: 24rpx;margin-right: 5rpx;">-¥</text>{{ couponInfo.disAmt }}
                        </view>
                        <view v-else style="color: gray;font-size: 24rpx;">选择优惠券</view>
                        <up-icon style="margin-left: 10rpx;" name="arrow-right" size="12"></up-icon>
                    </view>
                </view>
                
                <view class="info-block_btm">
                    <view>实付款</view>
                    <view class="amt">¥{{ toFixed(info.payPrice, 2) }}</view>
                </view>
            </view>

            <!-- 备注等 -->
            <view class="remark-block">
                <view>备注</view>
                <input v-model="remark" placeholder="请输入备注" placeholder-style="fontWeight: normal;fontSize: 28rpx"/>
            </view>

            <!-- 底部区域 -->
            <view class="btm-block">
                <view class="btm-block_amt">¥{{ toFixed(info.payPrice, 2) }}</view>
                <view class="btm-block_btn" @click="doPay">去付款</view>
            </view>
        </vc-container>


        <!-- 收货地址选择 -->
        <up-popup :show="addressShow" mode="bottom" round="20" closeable @close="addressShow = false">
            <view style="font-size: 34rpx;font-weight: bold;text-align: center;margin: 20rpx 0;">选择地址</view>
            <view class="pop-address">
                <template v-if="addressList.length > 0">
                    <view class="pop-address_item" v-for="(item, index) in addressList" :key="index" @click="setAddress(item)">
                        <view>
                            <view class="flex" style="align-items: center;font-size: 32rpx;color: #333;font-weight: bolder;">
                                <view>{{ item.name }}</view>
                                <view style="margin-left: 10rpx;">{{ item.mobile }}</view>
                            </view>
                            <view style="font-size: 28rpx;color: #999;">
                                {{ item.provinceName }}
                                {{ item.cityName }}
                                {{ item.areaName }}
                                {{ item.address }}
                            </view>
                        </view>

                        <up-icon style="float: right;" v-if="item.id == addressInfo.id" name="checkbox-mark" size="20" color="#00BCB8"></up-icon>
                    </view>
                </template>
                <template v-else>
                    <vc-empty  :props-data="emptyProps"></vc-empty>
                    <view @click="addAddress" class="button">新增收货地址</view>
                </template>
            </view>
        </up-popup>
        <!-- 优惠券选择 -->
        <up-popup :show="couponShow" mode="bottom" round="20" closeable bgColor="#f8f8f8" @close="couponShow = false">
            <view style="font-size: 34rpx;font-weight: bold;text-align: center;margin: 20rpx 0;">选择优惠券</view>
            <scroll-view scroll-y style="height: 500rpx;" class="pop-coupon">
                <view v-for="(item, index) in couponList" :key="index" :class="['pop-item', item._dis ? 'disabled' :'' ]">
                    <!-- 满减券 --> 
                    <template v-if="item.couponBaseType == '00'">
                        <view class="pop-item_left">
                            <view style="width: 30%;text-align: right;">
                                <view class="green amt" style="font-size: 30rpx;font-weight: bold;">¥{{ item.disAmt||'---' }}</view>
                                <view class="green" style="font-size: 22rpx;">{{ `满${item.disAllAmt}可用` }}</view>
                            </view>
                            <view style="margin:0rpx 10rpx 0 30rpx;flex: 1;max-width: calc(70% - 40rpx);">
                                <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                                <view style="font-size: 22rpx;color: #999;">{{ item.useEndTime.substring(5,7)+'月'+item.useEndTime.substring(8,10)+'日' }}前到期</view>
                                <view style="font-size: 20rpx;color: red;line-height: 24rpx;margin-top: 4rpx;" v-if="item._dis">不可用原因：{{ item._disTip }}</view>
                            </view>
                        </view>
                    </template>
                    <!-- 礼品券 -->
                    <template v-else-if="item.couponBaseType == '01'">
                        <view class="pop-item_left">
                            <view style="width: 30%;text-align: right;">
                                <view class="green" style="font-size: 40rpx;">{{ 礼品券 }}</view>
                            </view>
                            <view style="margin:0rpx 10rpx 0 30rpx;flex: 1;max-width: calc(70% - 40rpx);">
                                <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                                <view style="font-size: 22rpx;color: #999;">{{ item.useEndTime.substring(5,7)+'月'+item.useEndTime.substring(8,10)+'日' }}前到期</view>
                                <view style="font-size: 18rpx;color: red;line-height: 24rpx;margin-top: 4rpx;word-break: break-all;" v-if="item._dis">不可用原因：{{ item._disTip }}</view>
                            </view>
                        </view>
                    </template>
                    <!-- 折扣券 -->
                    <template v-else-if="item.couponBaseType == '02'">
                        <view class="pop-item_left">
                            <view style="width: 31%;text-align: right;">
                                <view class="green" style="font-size: 30rpx;font-weight: bold;">
                                    {{ divide(item.disAmt, 10)||'---' }}
                                    <text style="font-size: 22rpx;margin-left: -4rpx;">折</text>
                                </view>
                                <view class="green" style="font-size: 22rpx;">{{ `满${item.disAllAmt}可用` }}</view>
                                <view v-if="item.disMaxAmt" style="font-size: 18rpx;line-height: 30rpx;color: red;">{{ `最大折扣${item.disMaxAmt}元` }}</view>
                            </view>
                            <view style="margin:0rpx 10rpx 0 20rpx;flex: 1;max-width: calc(69% - 30rpx);">
                                <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                                <view style="font-size: 22rpx;color: #999;">{{ item.useEndTime.substring(5,7)+'月'+item.useEndTime.substring(8,10)+'日' }}前到期</view>
                                <view style="font-size: 20rpx;color: red;line-height: 24rpx;margin-top: 4rpx;" v-if="item._dis">不可用原因：{{ item._disTip }}</view>
                            </view>
                        </view>
                    </template>
                    <!-- 代金券 -->
                    <template v-else-if="item.couponBaseType == '03'">
                        <view class="pop-item_left">
                            <view style="width: 30%;text-align: right;">
                                <view class="green amt" style="font-size: 30rpx;font-weight: bold;">¥{{ item.disAmt||'---' }}</view>
                                <view class="green" style="font-size: 22rpx;">{{ `满${item.disAllAmt}可用` }}</view>
                            </view>
                            <view style="margin:0rpx 10rpx 0 30rpx;flex: 1;max-width: calc(70% - 40rpx);">
                                <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                                <view style="font-size: 22rpx;color: #999;">{{ item.useEndTime.substring(5,7)+'月'+item.useEndTime.substring(8,10)+'日' }}前到期</view>
                                <view style="font-size: 20rpx;color: red;line-height: 24rpx;margin-top: 4rpx;" v-if="item._dis">不可用原因：{{ item._disTip }}</view>
                            </view>
                        </view>
                    </template>

                    <view :class="['pop-item_right', item._dis ? 'dis' : '' ]" @click="item._dis ? '' : setCoupon(item)">立即使用</view>
                </view>
            </scroll-view>
            <view style="color: gray;font-size: 26rpx;padding: 20rpx 0;text-align: center;" @click="clearCoupon">不使用优惠券</view>
        </up-popup>

    </view>
</template>

<script>
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    import { getCouponList, getDeliveryAddressPage, createOrder  } from '../api/index'
    import { useMctStore } from '@/store'
    export default {
        data() {
            return {
                divide: divide,
                toFixed,
                mctId: '',//商户号

                info: {}, //订单信息
                couponInfo: {},//优惠券信息
                addressInfo: {},//地址信息
                tab: 1,//配送方式

                addressShow: false,//地址选择弹出层
                addressList: [],//地址选择弹出层列表
                couponShow: false,//优惠券选择弹出层
                couponList: [],//优惠券选择弹出层列表

                emptyProps: {
                    props: {
                        marginTop: {
                            value: '50'
                        }
                    }
                },//vc-empty的props
                containerProps: {
                    props:{
                        isFullScreen:{
                        value: true
                        }
                    }
                },//container的props

                remark: '',// 备注
                isOver: false,// 是否展开
                hasDoPay: false,// 是否已经拉起支付
            }
        },
        computed: {
            //总数量
            allNum() {
                return this.info.productInfo.map(e=>e.num).reduce((sum, current) => plus(sum, current), 0)
            }
        },
        onLoad(options) {
            //获取订单信息
            this.info = this.bridgeSdk.checkIsEmpty(useMctStore().orderInfo) ? useMctStore().orderInfo : {}
            this.mctId = this.bridgeSdk.checkIsEmpty(useMctStore().orderMctId) ? useMctStore().orderMctId : ''
            this.couponInfo = {...this.info.couponInfo}
            
        },
        onShow() {
            //若跳转新增地址页面返回时自动刷新地址列表
            if(this.addressShow)
                this.getAddress()
            //若已拉起支付返回本页面时，跳转立即支付页面
            if(this.hasDoPay){
                useMctStore().setOrderAddress({
                    ...this.addressInfo
                })
                useMctStore().setOrderCoupon({
                    ...this.couponInfo
                })
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/checkout/repayPage?remark=${this.remark}`,
                    openType: 'redirectTo'
                })
            }
        },
        methods: {
            //打开收货地址选择
            getAddress() {
                getDeliveryAddressPage({
                    page: 1,
                    rows: 20
                }).then(res=>{
                    console.log(res)
                    this.addressList = [...res.list]
                    this.addressShow = true
                })
            },
            //优惠券列表
            couponsList() {
                return new Promise((resolve, reject) => {
                    getCouponList({
                        mctId: this.mctId
                    }).then(res=>{
                        console.log(res)
                        this.couponList = [...res.map(e=>{
                            return {
                                ...e,
                                _dis: Number(e.disAllAmt) > this.info.totalPrice,
                                _disTip: `订单金额需满${e.disAllAmt}元`
                            }
                        })].sort((a,b)=>a._dis - b._dis).filter(e => e.getStatus == '0')
                        resolve(res)
                    })
                })
            },
            //打开优惠券选择
            getCoupons() {
                this.couponsList().then(res=>{
                    this.couponShow = true
                })
            },
            //选择优惠
            setCoupon(e) {
                console.warn(e)
                this.couponInfo = {...e}
                this.couponShow = false
                // 折扣券情况
                if(this.couponInfo.couponBaseType == '02') {
                    // 实付金额/子订单数量 < 0.01券不可用
                    if( divide(multiply(this.info.totalPrice, divide(e.disAmt, 100)), this.info.productInfo.length) < 0.01) {
                        uni.showToast({
                            title: '该优惠券暂不可用',
                            icon: 'none',
                            duration: 2000
                        })
                        this.couponInfo = {}
                        return
                    }
                    // 最大折扣金额时要判断是否超过最大折扣
                    if ( (Number(multiply(this.info.totalPrice, minus(1, divide(e.disAmt, 100)) ) ) > Number(e.disMaxAmt)) && e.disMaxAmt) {
                        this.info.payPrice = minus(this.info.totalPrice, e.disMaxAmt)
                    } else {
                        this.info.payPrice = multiply(this.info.totalPrice, divide(e.disAmt, 100))
                    }
                    this.couponInfo.disAmt = toFixed(minus(this.info.totalPrice, this.info.payPrice) , 2)
                } 
                // 礼品券不可选
                else if (this.couponInfo.couponBaseType == '01') {
                    this.couponInfo = {}
                    return;
                }
                // 满减券、代金券
                else {
                    // 实付金额/子订单数量 < 0.01券不可用
                    if( divide(minus(this.info.totalPrice, e.disAmt), this.info.productInfo.length) < 0.01) {
                        uni.showToast({
                            title: '该优惠券暂不可用',
                            icon: 'none',
                            duration: 2000
                        })
                        this.couponInfo = {}
                        return
                    }
                    this.info.payPrice = minus(this.info.totalPrice, e.disAmt)
                }
            },
            //不使用优惠
            clearCoupon(){
                this.couponInfo = {}
                this.couponShow = false
                this.info.payPrice = this.info.totalPrice
            },
            //新增地址
            addAddress() {
                this.bridgeSdk.jumpPage({
                    url: `/package-address/pages/addAddress`,
                    title: '添加收货地址'
                })
            },
            //选择地址
            setAddress(e){
                this.addressInfo = {...e}
                this.addressShow = false
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
            //去付款
            async doPay() {
                if(!this.bridgeSdk.checkIsEmpty(this.addressInfo)) {
                    uni.showToast({
                        title: '请选择收货地址',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                //获取经纬度
                let locationObj = await this.getLocation()
                //获取设备信息
                let deviceObj = await this.bridgeSdk.getDeviceInfo()
                createOrder({
                    couponId: this.couponInfo.userGetId,//用户领取优惠券id
                    shoppingAll: JSON.parse(useMctStore().orderShoppingAll),//购物车信息
                    shopsId: useMctStore().orderStoreId,//店铺id
                    consignee: this.addressInfo.name,//收货人
                    country: '中国',//国家
                    consignee: this.addressInfo.name,//收货人
                    province: this.addressInfo.provinceName,//省
                    city: this.addressInfo.cityName,//市
                    district: this.addressInfo.areaName,//区
                    address: this.addressInfo.address,//详细地址
                    mobile: this.addressInfo.mobile,//手机号
                    postalcode: '',//邮政编码
                    postscript: this.remark,//备注
                    mallscene: 'store',//支付场景 /*门店 (store), 商城(mall)*/
                    orderSource: 'ICBCAPP',
                    // webNotifyUrl: encodeURIComponent(location.origin + '/#/package-product-list/checkout/buyResult'),//订单完成回调页面
                    webNotifyUrl: 'nojump',//订单完成回调页面
                    lat: locationObj.lat,//纬度
                    lng: locationObj.lng,//经度
                    ip: deviceObj.ip||'123',//ip
                    mac: deviceObj.mac||'123',//mac
                    deviceId: deviceObj.deviceId||'123',//设备编号
                }).then(res=>{
                    console.log(res)
                    let encodeUrl = encodeURIComponent(res.payUrl)
                    this.bridgeSdk.jumpPage({
                        url: 'web/index.html#/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                    })
                    this.hasDoPay = true
                    useMctStore().setOrderId(res.orderNo)
                    //清除pinia中优惠券信息
                    useMctStore().clearOrderCoupon()
                    //清除pinia中订单编号
                    useMctStore().clearOrderInfo()
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
$font-black: #333;
$font-red: red;
$font-gray: #999;
$font-12: 24rpx;
$font-14: 28rpx;
$font-16: 32rpx;
.flex{
    display: flex;
}
.tab-block{
    display: flex;
    align-items: flex-end;
    border-radius: 20rpx;
    &_item{
        text-align: center;
        color: white;
        font-size: $font-14;
        line-height: 70rpx;
        width: 50%;
        background-color: #00BCB8;
        border-radius: 20rpx 20rpx 0 0;
        height: 70rpx;
    }
    .active{
        background-color: white;
        color: $font-black;
    }
}
.address-block{
    padding: 20rpx 40rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    line-height: 45rpx;
    border-radius: 0 0 20rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_top{
        font-size: 30rpx;
        display: flex;
        align-items: center;
        font-weight: bold;
        color: $font-black;
    }
    &_main{
        width: 100%;
        font-size: 32rpx;
        color: #999;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &_btm{
        font-size: 26rpx;
        color: $font-gray;
    }
}
.info-block{
    width: 90%;
    margin: 20rpx auto 0;
    padding: 20rpx 0 10rpx;
    border-radius: 20rpx;
    background-color: white;
    &_item{
        display: flex;
        padding: 20rpx 40rpx;
        image{
            width: 120rpx;
            height: 120rpx;
            border-radius: 10rpx;
        }
        &--main{
            flex: 1;
            line-height: 40rpx;
            font-size: 30rpx;
            margin-left: 20rpx;
            .amt{
                &::first-letter{
                    font-size: 20rpx;
                    margin-right: 10rpx;
                }
            }
            .gray{
                color: #999;
                font-size: 24rpx;
            }
            .red{
                font-size: 30rpx;
                // color: red;
                font-weight: bold;
            }
        }
    }
    &_over{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        color: gray;
    }
    &_btm{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 30rpx;
        color: $font-black;
        font-weight: bold;
        background-color: white;
        padding: 15rpx 40rpx;
        .amt{
            &::first-letter{
                font-size: 24rpx;
                margin-right: 10rpx;
            }
        }
    }
}

.remark-block{
    width: 80%;
    margin: 20rpx auto 200rpx;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    color: $font-black;
    font-weight: bold;
    input{
        text-align: right;
    }
}

.btm-block{
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0 20rpx 40rpx;
    background-color: #333;
    bottom: 30rpx;
    left: 0;
    right: 0;
    border-radius: 50rpx;
    height: 60rpx;
    width: 85%;
    margin: 0 auto;
    &_amt{
        font-size: 38rpx;
        font-weight: bold;
        color: white;
        &::first-letter{
            font-size: 24rpx;
            margin-right: 10rpx;
        }
    }
    &_btn{
        border-radius: 0 50rpx 50rpx 0;
        width: 150rpx;
        text-align: center;
        height: 100rpx;
        font-size: 32rpx;
        line-height: 100rpx;
        color: white;
        font-weight: bold;
        background-color: #00BCB8;
    }
}
.pop-address{
    height: 500rpx;
    &_item{
        line-height: 50rpx;
        padding: 20rpx 40rpx;
        border-bottom: 2rpx solid #f8f8f8;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .button {
        position: fixed;
        left: 4%;
        bottom: 40rpx;
        width: 92%;
        height: 84rpx;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
        border-radius: 42rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 32rpx;
        color: #FFFFFF;
        text-align: center;
        font-style: normal;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.pop-coupon{
    .disabled{
        color: #999 !important;
        filter: opacity(.5);
    }
    .green{
        color: #00BCB8;
    }
    .amt{
        &::first-letter{
            font-size: 24rpx;
            margin-right: 5rpx;
        }
    }
    .pop-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 20rpx 20rpx 30rpx;
        position: relative;
        background: radial-gradient(circle at 70% top, transparent 20rpx,white 0) center top / 100% 50% no-repeat,
                    radial-gradient(circle at 70% bottom, transparent 20rpx, white 0) center bottom / 100% 50% no-repeat;
        font-size: 28rpx;
        border-radius: 10rpx;
        width: 87%;
        margin: 20rpx auto 0;
        &_left{
            line-height: 45rpx;
            width: calc(70% + 5rpx);
            display: flex;
            align-items: center;
            border-right: 2rpx dashed #d0d0d0;
            &--name{
                font-size: 28rpx;
                font-weight: bold;
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow-x: hidden;
            }
        }
        .dis{
            color: #999;
            border-color: #999;
        }
        &_right{
            padding: 0 30rpx;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 25rpx;
            text-align: center;
            color: white;
            font-size: 24rpx;
            border: 2rpx solid #00BCB8;
            color: #00BCB8;
        }
    }
}
</style>