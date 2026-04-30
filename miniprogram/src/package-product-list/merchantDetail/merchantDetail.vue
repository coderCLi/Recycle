<!--
 * @Description: 商户详情
 * @Autor: chenbaolei
 * @Date: 2025-05-14 10:59:27
 * @LastEditors: TF
 * @LastEditTime: 2025-06-10 09:10:49
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container style="background-color: #f8f8f8;">
        <!-- 顶部大图 -->
        <image id="img" :src="minioBaseUrl + merchant.listPicUrl" class="top-img" @click="previewImg"></image>
        <!-- 顶部门店信息展示 -->
        <view class="top-block">
            <!-- 门店信息 -->
            <up-skeleton rows="5" :loading="isLoading">
                <view class="top-block_info">
                    <view class="top-block_info-title">
                        {{ merchant.storeName || '' }}
                    </view>
                    <view class="top-block_info-time">
                        <text style="margin-right: 10rpx;" :style="{color: merchant.isRelax ? 'red' : 'green'}">{{ merchant.isRelax ? '休息中' : '营业中' }}</text>{{ merchant.storeTimeText }}
                    </view>
                    <view class="top-block_info-address">
                        <view>
                            <view>{{ merchant.provinceName }} {{ merchant.cityName }} {{ merchant.areaName }}</view>
                            <view style="color: gray;">{{ merchant.storeAddress }}（距当前位置{{ merchant.distance }}km）</view>
                        </view>
                        <view style="display: flex; align-items: center;gap: 14rpx;">
                            <up-icon name="map" size="40rpx" color="#00bcb8" @click="goMap"></up-icon>
                            <up-icon name="phone" size="40rpx" color="#00bcb8" @click="goPhone"></up-icon>
                        </view>
                    </view>
                </view>
            </up-skeleton>
            <!-- 优惠券 -->
            <template v-if="couponList.length > 0">
                <scroll-view scroll-x="true" style="white-space: nowrap;width: 100%;margin-top: 20rpx;">
                    <view class="top-block_coupons">
                        <view v-for="item in couponList" :key="item.couponBaseId" class="item" @click="show = true">
                            <!-- 满减券 -->
                            <template v-if="item.couponBaseType == '00'">
                                <view class="item-amt">¥{{ item.disAmt }}</view>
                            </template>
                            <!-- 礼品券 -->
                            <template v-else-if="item.couponBaseType == '01'">
                                <view style="font-size: 18rpx;color: white;margin-left: 5rpx;">礼品券</view>
                            </template>
                            <!-- 折扣券 -->
                            <template v-else-if="item.couponBaseType == '02'">
                                <view style="font-size: 20rpx;color: white;margin-left: 5rpx;font-weight: bold;">
                                    {{ divide(item.disAmt, 10) }}
                                    <text style="font-size: 14rpx;">折</text>
                                </view>
                            </template>
                            <!-- 代金券 -->
                            <template v-else-if="item.couponBaseType == '03'">
                                <view class="item-amt">¥{{ item.disAmt }}</view>
                            </template>
                            <view style="color: white;font-size: 20rpx;">领</view>
                        </view>
                    </view>
                </scroll-view>
            </template>
        </view>
        <!-- 商品 -->
        <view class="list-block" :style="{ paddingBottom: (cartList.length > 0 ? 140 : 0) + 'rpx', transition: 'all 0.3s ease-out' }">
            <template v-if="bridgeSdk.checkIsEmpty(virtualList)">
                <!-- 超值券 -->
                <view style="font-size: 32rpx;font-weight: bold;padding-left: 20rpx;">超值券</view>
                <scroll-view scroll-x class="list-block_coupon">
                    <view class="list">
                        <view class="item" v-for="(item, index) in virtualList" :key="index" @click="goVirtualDetail(item)">
                            <!-- 展示 -->
                            <view class="item-left">
                                <image :src="minioBaseUrl + item.listPicUrl"/>
                                <view>
                                    <view style="color: #333;font-size: 30rpx;font-weight: bold;">{{ item.spuName||'--' }}</view>
                                    <view class="item-left_amt">¥{{ item.skuAll[0].price||'--' }}</view>
                                </view>
                            </view>
                            <!-- 抢购 -->
                            <view class="item-btn">抢购</view>
                        </view>
                    </view>
                </scroll-view>
            </template>
            <!-- 商品列表 -->
            <view style="font-size: 32rpx;font-weight: bold;padding-left: 20rpx;">商品列表</view>
            <productDetails :id="`s${item.spuId}`" v-for="item in productList" @on-click="handleClick" :key="item.spuId" :item="item"></productDetails>
        </view>
    </vc-container>
    <!-- 领取优惠券弹出层 -->
    <up-popup class="pop-coupon" :show="show" round="15" closeable bgColor="#f8f8f8" @close="show = false">
        <view style="font-size: 34rpx;font-weight: bold;text-align: center;margin: 20rpx 0;">领取优惠券</view>
        <scroll-view scroll-y style="height: 600rpx;padding-bottom: 30rpx;">
            <view v-for="(item, index) in couponListAll" :key="index" class="pop-item">
                <!-- 满减券 -->
                <template v-if="item.couponBaseType == '00'">
                    <view class="pop-item_left">
                        <view style="text-align: right;width: 30%;">
                            <view class="green amt" style="font-size: 32rpx;font-weight: bold;">¥{{ item.disAmt||'---' }}</view>
                            <view class="green" style="font-size: 22rpx;">{{ `满${item.disAllAmt}可用` }}</view>
                        </view>
                        <view style="margin-left: 20rpx;width: calc(70% - 20rpx);">
                            <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                            <view class="green" style="font-size: 22rpx;margin-top: 2rpx;">满减券</view>
                        </view>
                    </view>
                </template>
                <!-- 礼品券 -->
                <template v-else-if="item.couponBaseType == '01'">
                    <view class="pop-item_left" style="display: block;">
                        <view>
                            <view class="pop-item_left--name">{{ item.couponBaseName }}</view>
                            <view style="font-size: 22rpx;" class="green">礼品券</view>
                        </view>
                    </view>
                </template>
            <!-- 折扣券 -->
                <template v-else-if="item.couponBaseType == '02'">
                    <view class="pop-item_left">
                        <view style="text-align: right;width: 30%;">
                            <view class="green" style="font-size: 32rpx;font-weight: bold;">
                            {{ divide(item.disAmt, 10)||'---' }}
                            <text style="font-size: 22rpx;">折</text>
                            </view>
                            <view class="green" style="font-size: 22rpx;">{{ `满${item.disAllAmt}可用` }}</view>
                        </view>
                        <view style="margin-left: 20rpx;flex: 1;">
                            <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                            <view class="green" style="font-size: 22rpx;margin-top: 2rpx;">折扣券</view>
                        </view>
                    </view>
                </template>
                <!-- 代金券 -->
                <template v-else-if="item.couponBaseType == '03'">
                    <view class="pop-item_left">
                        <view style="text-align: right;width: 30%;">
                            <view class="green amt" style="font-size: 32rpx;font-weight: bold;">¥{{ item.disAmt||'---' }}</view>
                            <view class="green" style="font-size: 22rpx;">{{ `满${item.disAllAmt}可用` }}</view>
                        </view>
                        <view style="margin-left: 20rpx;flex: 1;">
                            <view class="pop-item_left--name">{{ item.couponBaseName||'---' }}</view>
                            <view class="green" style="font-size: 22rpx;margin-top: 2rpx;">代金券</view>
                        </view>
                    </view>
                </template>

                <view class="pop-item_right disabled" v-if="item._dis">已领完</view>
                <view class="pop-item_right" v-else @click="drawDownClick(item)">立即领取</view>
            </view>
        </scroll-view>
    </up-popup>
    <!-- 购物车 -->
    <cart ref="cart" :visiable="cartList.length > 0" :storeId="storeId" :mctId="mctId"></cart>
    <!-- 多规格选择弹窗 -->
    <check-sku-pop></check-sku-pop>
</template>

<script>
import { minus, plus, divide, multiply } from '@/utils/decimal.ts'
import { getStoreInfo, getProductList, userGetCoupon, getCouponBaseList, getVirtualProductProductList } from '../api'
import { useMctStore } from "@/store/index"
import productDetails from '../components/productDetails.vue'
import Cart from '../components/cart.vue'
import CheckSkuPop from '../components/check-sku-pop.vue'
export default {
    data () {
        return {
            divide: divide,
            storeId: '',//门店id
            couponList: [],//优惠券列表
            couponListAll: [],//优惠券全量列表
            mctId: '',//商户id
            merchant: {},//商户信息
            name: '',//搜索商品名称
            productList: [],//商品列表
            total: 0,//合计
            page: 1,//分页-页
            longitude: 0,//经度
            latitude: 0,//纬度

            show: false,//领取优惠券弹出
            isLoading: true,

            scrollViewId: '',//滚动元素

            virtualList: [],// 虚拟券列表
        }
    },
    components: { productDetails, Cart, CheckSkuPop },
    provide() {
        return {
            scrollToView: this.scrollToView
        }
    },
    computed: {
        //购物车列表
        cartList() {
            return useMctStore().cartList
        }
    },
    onLoad (options) {
        console.log('options:',options)
        this.storeId = options.storeId
        this.mctId = options.mctId
    },
    async onReady() {
        await this.getLat()
        //获取门店信息
        this.getStoreDetail()
        //获取商品列表
        this.getProductList()
        //获取优惠券列表
        this.getUserGetCoupon()
        // 获取虚拟商品
        this.getVirtualList()
    },
    onReachBottom() {
        console.log('onReachBottom')
        if (this.productList.length < this.total) {
            this.page++
            this.getProductList()
        }
    },
    methods: {
        //获取门店信息
        async getStoreDetail () {
            const res = await getStoreInfo({
                storeId: this.storeId, 
                loginFlag: 0,
                latitude: this.latitude,
                longitude: this.longitude,
            })
            this.merchant = res
            this.merchant.storeTime = JSON.parse(this.merchant.storeTime)
            this.merchant.distance = (Number(this.merchant.distance) / 1000).toFixed(1)
            this.merchant.storeTimeText = this.merchant.storeTime.map(e => e.start + '-' + e.end).join('，')
            let now = (new Date().getHours() >= 10 ? new Date().getHours() : '0' + new Date().getHours())
                + '' 
                + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : '0' + new Date().getMinutes())
                
            console.log('now:', now)
            this.merchant.isRelax = !this.merchant.storeTime.some(e => {
                return now <= e.end.replace(':', '') && now >= e.start.replace(':', '')
            })
            this.isLoading = false
        },
        //获取商品列表
        async getProductList () {
            const res = await getProductList({
                mctId: this.mctId,
                page: this.page,
                rows: 10,
                loginFlag: 0
            })
            this.productList = [...this.productList, ...res.list]
            this.total = res.total
        },
        // 获取虚拟商品列表
        async getVirtualList () {
            const res = await getVirtualProductProductList({
                mctId: this.mctId,
                page: this.page,
                rows: 10,
                loginFlag: 0
            })
            this.virtualList = res.list
        },
        //获取优惠券列表
        async getUserGetCoupon () {
            const res = await getCouponBaseList({ mctId: this.mctId, couponBaseStatus: 1 })
            this.couponList = res.total > 5 ? res.list.slice(0, 5) : res.list
            this.couponListAll = res.list
        },
        //领取优惠券
        drawDownClick (item) {
            let that = this
            userGetCoupon({
                jsonList: JSON.stringify({
                    couponBaseId: item.couponBaseId,
                    couponGetNum: 1
                }),
                chnlFlag: 0
            }, {
                catchError: true
            }).then(res=>{
                uni.showToast({
                    title: '领取成功',
                    icon: 'none',
                    duration: 2000
                })
            }).catch(err=>{
                uni.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000
                })
                if(err.code == '0009'){
                    that.couponListAll = that.couponListAll.map(e=>{
                        return {
                            ...e,
                            _dis: e.couponBaseId == item.couponBaseId
                        }
                    })
                }
            })
        },
        //获取经纬度
        getLat () {
            return new Promise((resolve, reject) => {
                this.bridgeSdk.getLocation(res => {
                    console.log(res, 'getLocation')
                    this.longitude = Number(res.lng)
                    this.latitude = Number(res.lat)
                    resolve(res)
                })
            })
        },
        //跳转商品详情
        handleClick (item) {
            console.log(item, 'item')
            this.bridgeSdk.jumpPage({
                url: `/package-product-list/productDetail/productDetail?spuId=${item.spuId}&mctId=${this.mctId}&storeId=${this.storeId}`
            })
        },
        goVirtualDetail (item) {
            console.log(item, 'item')
            this.bridgeSdk.jumpPage({
                url: `/package-product-list/productDetail/productDetailCoupon?spuId=${item.spuId}&mctId=${this.mctId}&storeId=${this.storeId}`
            })
        },
        //滚动至页面位置
        scrollToView(e){
            this.$refs.cart.popShow = false
            this.scrollViewId = 's' + e
            console.log('scrollToView:', 's' + e)
            uni.pageScrollTo({
                selector: `#${this.scrollViewId}`,
                duration: 300,
                complete: (e) => {
                    console.log('scrollToView:', e)
                }
            })
        },
        // 打开地图
        goMap() {
            this.bridgeSdk.hi.openMap({
                name: this.merchant.storeName,
                latitude: this.merchant.latitude,
                longitude: this.merchant.longitude,
                success: (res) => {
                    console.log('openMap:', res)
                },
                fail: (err) => {
                    console.error('openMap err:', err)
                }
            })
        },
        // 打电话
        goPhone() {
            this.bridgeSdk.makePhoneCall({
                title: '商家电话',
                phoneNumber: this.merchant.storePhone
            })
        },
        // 预览图片
        previewImg(e) {
            uni.previewImage({
                current: 0,
                urls: [this.minioBaseUrl + this.merchant.listPicUrl]
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.green{
    color: #00BCB8;
}
.amt{
    font-weight: bold;
    &::first-letter{
        font-size: 24rpx;
        margin-right: 5rpx;
    }
}
// 顶部大图
.top-img{
    width: 100%;
    height: 396rpx;
    z-index: 1;
}
// 顶部门店信息等
.top-block{
    background-color: white;
    padding: 30rpx 30rpx;
    margin: 0rpx auto 0;
    z-index: 2;
    position: relative;
    &_coupons{
        display: flex;
        .item{
            margin-right: 10rpx;
            height: 40rpx;
            min-width: 110rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10rpx 0 10rpx;
            border-radius: 10rpx;
            border: none;
            position: relative;
            background: radial-gradient(circle at 65% top, transparent 6rpx,#FFA800 0) center top / 100% 50% no-repeat,
                        radial-gradient(circle at 65% bottom, transparent 6rpx, #FFA800 0) center bottom / 100% 51% no-repeat;
            &-amt{
                font-weight: bold;
                font-size: 20rpx;
                color: white;
                &::first-letter{
                    font-size: 16rpx;
                    margin-right: 2rpx;
                }
            }
        }
    }
    &_info {
        background-color: white;
        border-radius: 0rpx 0rpx 20rpx 20rpx;
        &-title {
            font-size: 36rpx;
            color: #333;
            font-weight: bolder;
            padding: 10rpx 0 20rpx;
        }
        &-time {
            padding: 20rpx 0;
            font-size: 24rpx;
            color: #333;
            border-top: 2rpx solid #f8f8f8;
            border-bottom: 2rpx solid #f8f8f8;
        }
        &-address {
            padding: 10rpx 0 0;
            font-size: 24rpx;
            color: #333;
            line-height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
}
// 列表信息
.list-block {
    margin-top: 10rpx;
    background-color: #fff;
    padding: 30rpx 10rpx 0;
    min-height: 800rpx;
    &_coupon {
        white-space: nowrap;
        height: 200rpx;
        width: 100%;
        .list{
            display: inline-flex;
            align-items: center;
            flex-wrap: nowrap;
            .item{
                width: 640rpx;
                height: 150rpx;
                margin: 20rpx 0 0 20rpx;
                border-radius: 10rpx;
                background: radial-gradient(circle at 70% top, transparent 15rpx, rgba(255, 168, 0, 0.1) 0) center top / 100% 70% no-repeat,
                            radial-gradient(circle at 70% bottom, transparent 15rpx, rgba(255, 168, 0, 0.1) 0) center bottom / 100% 30% no-repeat;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 30rpx;
                &-left{
                    line-height: 50rpx;
                    display: flex;
                    image{
                        width: 100rpx;
                        height: 100rpx;
                        margin-right: 10rpx;
                    }
                    &_amt{
                        color: #00BCB8;
                        font-size: 28rpx;
                        &::first-letter{
                            font-size: 20rpx;
                            margin-right: 5rpx;
                        }
                    }
                }
                &-btn{
                    font-size: 24rpx;
                    color: white;
                    width: 120rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    border-radius: 40rpx;
                    text-align: center;
                    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
                }
            }
        }
    }
}
// 弹出优惠券
.pop-coupon{
    z-index: 10000;
    position: relative;
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
    width: calc(87vw);
    margin: 20rpx auto 0;
    &_left{
        line-height: 45rpx;
        width: calc(71 * 0.87vw - 2.5rpx);
        display: flex;
        border-right: 2rpx dashed #d0d0d0;
        &--name{
            // margin-left: 10rpx;
            font-size: 28rpx;
            font-weight: bold;
            width: 90%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-x: hidden;
        }
    }
    .disabled{
        opacity: .5;
        padding: 0 40rpx;
    }
    &_right{
        padding: 0 30rpx;
        height: 50rpx;
        line-height: 50rpx;
        border-radius: 25rpx;
        text-align: center;
        color: white;
        font-size: 24rpx;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
    }
}
</style>