<template>
    <view>
        <scroll-view scroll-x style="white-space: nowrap;margin: 10rpx 0 40rpx;" v-if="ticketPlatList.length > 0">
            <view class="combo-ticket">
                <view class="combo-ticket_item" v-for="(item, index) in ticketPlatList" :key="index" @click="show = true">
                    <view class="left text-overflow">{{ item.couponBaseName }}</view>
                    <view class="right">领</view>
                </view>
            </view>
        </scroll-view>
        <view class="combo-coupon" v-if="ticketMctList.length > 0">
            <view class="combo-coupon_title">
                <view class="titleBg">领</view>
                优惠券
            </view>
            <view class="combo-coupon_list">
                <view class="item" v-for="(item, index) in mctTicketList" :key="index" @click="couponDetail(item)">
                    <view style="flex: 1;">
                        <view style="color: #333333;font-size: 28rpx;font-weight: bold;">{{ item.couponBaseName }}</view>
                        <!-- 相对时间 -->
                        <view style="margin-top: 12rpx;color: #999999;font-size: 24rpx;" v-if="item.useTimeMode == '1'">
                            自领取日起{{ item.useTimeout }}天内有效
                        </view>
                        <!-- 绝对时间 -->
                        <view style="margin-top: 12rpx;color: #999999;font-size: 24rpx;" v-if="item.useTimeMode == '2'">
                            {{ item.useEndTime }}前有效
                        </view>
                    </view>
                    <view class="item-btn" :style="{opacity: item._dis ? '0.5' : '1' }" @click.stop="drawDownClick(item)">
                        {{item._dis ? '已领取' : '领券'}}
                    </view>
                </view>
                <view class="more" v-if="ticketMctList.length > 2" @click="isPop = !isPop">
                    {{ isPop ? '收起' : '查看全部' }}
                    <up-icon size="12" :name="isPop ? 'arrow-up' : 'arrow-down'"></up-icon>
                </view>
            </view>
        </view>
        <view class="combo-coupon" v-if="djCouponList.length > 0">
            <view class="combo-coupon_title">
                <view class="titleBg">购</view>
                代金券
            </view>
            <view class="combo-coupon_list">
                <view class="item" v-for="(item, index) in djCouponList" :key="index" @click="goDetail(item, '03', '代金券')">
                    <view style="flex: 1;width: 50%;">
                        <view style="color: #333333;font-size: 28rpx;font-weight: bold;">{{ item.spuName }}</view>
                        <view style="margin-top: 12rpx;color: #999999;font-size: 24rpx;width: 100%;" class="muti-overflow">
                            {{ item.skuAll[0].skuName }}
                        </view>
                        <!-- 相对时间 -->
                        <!-- <view style="margin-top: 12rpx;color: #999999;font-size: 24rpx;" v-if="item.skuAll[0].couponByMctUserResp.useTimeMode == '1'">
                            购买之后{{ item.skuAll[0].couponByMctUserResp.useTimeout }}天有效
                        </view> -->
                        <!-- 绝对时间 -->
                        <!-- <view style="margin-top: 12rpx;color: #999999;font-size: 24rpx;" v-if="item.skuAll[0].couponByMctUserResp.useTimeMode == '2'">
                            购买之后{{ item.skuAll[0].couponByMctUserResp.useEndTime }}前有效
                        </view> -->
                    </view>
                    <view class="item-btn" @click.stop="doBuy(item)">
                        {{item.isNew == '1' ? '抢购' : '电话咨询'}}
                    </view>
                </view>
            </view>
        </view>
        <view class="combo-menu" v-if="hasMenu">
            <view class="combo-menu_title">
                <view class="titleBg">团</view>
                优惠套餐
            </view>
            <scroll-view scroll-x class="combo-menu_tags">
                <view class="combo-menu_tags--list">
                    <view :class="['item',item.categoryId == nowCategoryId ? 'active' : '']" 
                        v-for="(item, index) in mctCategoryList" :key="index" @click="changeCategory(item)">
                        {{ item.name }}
                    </view>
                </view>
            </scroll-view>
            <view class="combo-menu_list">
                <vc-empty :props-data="{props: {text: {value: '等待商家上新～'}, marginTop: {value: '40'}}}" v-if="menuList.length == 0"></vc-empty>
                <template v-else> 
                    <view class="item" v-for="(item, index) in menuList" :key="index" @click="goDetail(item, '01','套餐')">
                        <image :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
                        <view class="item-title">
                            <view class="muti-overflow" style="font-size: 28rpx;font-weight: bold;">{{ item.spuName }}</view>
                            <view style="display: flex;align-items: flex-start;justify-content: space-between;width: 100%;">
                                <view style="flex: 1;line-height: 33rpx;font-size: 24rpx;color: #999999;margin-top: 4rpx;">
                                    <!-- <view >{{ item.skuAll[0].skuName }}</view> -->
                                    <!-- 相对时间 -->
                                    <view style="margin-top: 4rpx;" v-if="item.skuAll[0].couponByMctUserResp.useTimeMode == '1'">
                                        购买之后{{ item.skuAll[0].couponByMctUserResp.useTimeout }}天有效
                                    </view>
                                    <!-- 绝对时间 -->
                                    <view style="margin-top: 4rpx;" v-if="item.skuAll[0].couponByMctUserResp.useTimeMode == '2'">
                                        购买之后{{ item.skuAll[0].couponByMctUserResp.useEndTime }}前有效
                                    </view>
                                    <view style="font-size: 28rpx;margin-top: 10rpx;color: #FF1F1F">
                                        ¥{{ item.skuAll[0].price }} 
                                        <text v-if="item.skuAll[0].originalPrice" style="text-decoration: line-through;color: #AAAAAA;font-size: 20rpx;">¥{{ item.skuAll[0].originalPrice }}</text>
                                    </view>
                                </view>
                                <view class="item-btn" @click.stop="doBuy(item)">
                                    {{item.isNew == '1' ? '抢购' : '电话咨询'}}
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
        </view>

        <!-- 领取优惠券弹出层 -->
        <up-popup class="pop-coupon" :show="show" round="15" closeable bgColor="#f8f8f8" @close="show = false">
            <view style="font-size: 34rpx;font-weight: bold;text-align: center;margin: 20rpx 0;">平台补贴优惠</view>
            <scroll-view scroll-y style="height: 600rpx;padding-bottom: 30rpx;">
                <view v-for="(item, index) in ticketPlatList" :key="index" class="pop-item" @click="couponDetail(item)">
                    <view class="pop-item_left">
                        <view>
                            <view class="pop-item_left--name">{{ item.couponBaseName }}</view>
                            <!-- 相对时间 -->
                            <view style="font-size: 22rpx;" class="green" v-if="item.useTimeMode == '1'">
                                自领取日起{{ item.useTimeout }}天内有效
                            </view>
                            <!-- 绝对时间 -->
                            <view style="font-size: 22rpx;" class="green" v-if="item.useTimeMode == '2'">
                                {{ item.useEndTime }}前有效
                            </view>
                        </view>
                    </view>
                    <view class="pop-item_right" :style="{opacity: item._dis ? '0.5' : '1' }" @click.stop="drawDownClick(item)">
                        {{item._dis ? '已领取' : '领券'}}
                    </view>
                </view>
            </scroll-view>
        </up-popup>
        <!-- 提交订单弹窗 -->
        <order-pop ref="orderPop" @on-submit="doSubmitOrder"></order-pop>
    </view>
</template>

<script>
    import {
        getVirtualProductProductList,// 获取虚拟商品列表
        getCpnTicketList, // 获取领券列表
        receiveCpnTicket, // 领券
        shopingCoupon,// 买券预下单接口
        getCategoriesMct,// 获取商户商品分类别表
    } from '../api'
    import orderPop from '../components/order-pop.vue'
    import { useMctStore } from '@/store'
    import { minus, plus, divide, multiply } from '@/utils/decimal.ts'
    export default {
        name: 'product-block',
        data() {
            return {
                ticketPlatList: [],// 平台领券数据
                ticketMctList: [],//商户领券
                djCouponList: [],// 代金券列表
                yhCouponList: [],// 折扣券列表
                menuList: [],// 套餐列表
                mctCategoryList: [],// 商户商品分类列表
                nowCategoryId: '',// 当前分类id

                isPop: false,// 是否展开
                show: false,//领取优惠券弹出
                hasMenu: false,// 是否有套餐    

                // #ifdef H5
                hasFinish: [false, false, false, false],// 列表请求完成
                // #endif
                // #ifndef H5
                hasFinish: [false, false],// 列表请求完成
                // #endif
            }
        },
        props: {
            mctId: {
                type: String,
                default: ''
            },
            storeId: {
                type: String,
                default: ''
            },
            phone: {
                type: String,
                default: ''
            },
        },
        components: {
            orderPop,
        },
        computed: {
            mctTicketList() {
                if(!this.isPop) return this.ticketMctList.slice(0, 2)
                else return this.ticketMctList
            }
        },
        watch: {
            hasFinish: {
                deep: true,
                handler(newVal, oldVal){
                    if(newVal.every(e => e)) {
                        console.warn('获取券列表完成')
                        this.$emit('on-finish', {
                            ticketPlatList: this.ticketPlatList,
                            ticketMctList: this.ticketMctList,
                            djCouponList: this.djCouponList,
                            menuList: this.menuList
                        })
                    }
                }
            }
        },
        mounted() {
            // 获取领券列表(平台+商户)
            this.getTicketList('platform')
            this.getTicketList('mct')
            // #ifdef H5
            // 获取商户商品分类别表
            this.getMctCategoryList()
            // 获取代金券列表
            this.getVoucherList()
            // 获取套餐列表
            this.getProductList().then(res=>{
                this.hasMenu = res.length > 0
            })
            // #endif
        },
        methods: {
            // 获取优惠券 type：platform - 平台，mct-商户
            getTicketList(type) {
                getCpnTicketList({ 
                    mctId: this.mctId,
                    shopsId: this.storeId,
                    fromSource: type
                }).then(res=>{
                    if(type == 'platform')
                        this.ticketPlatList = res ? [...res] : []
                    else 
                        this.ticketMctList = res ? [...res] : []
                    this.hasFinish[type == 'platform' ? 0 : 1] = true
                })
            },
            // 获取商户商品分类列表
            getMctCategoryList() {
                getCategoriesMct({
                    mctId: this.mctId
                }).then(res=>{
                    let list = res ? JSON.parse(res) : []
                    if(list.length > 0) {
                        this.mctCategoryList = [
                                {
                                    name: '全部',
                                    categoryId: ''
                                }
                            , ...list]
                    } else {
                        this.mctCategoryList = []
                    }
                })
            },
            // 切换分类
            changeCategory(e) {
                this.nowCategoryId = e.categoryId
                this.menuList = []
                this.getProductList()
            },
            // 获取折扣券列表
            getDiscountList() {
                getVirtualProductProductList({
                    mctId: this.mctId,
                    virtualProductType: '02',
                    virtualProductSource: 'cop',
                    loginFlag: 0
                }).then(res=>{
                    this.yhCouponList = [...this.yhCouponList, ...res.list]
                })
            },
            // 获取代金券列表
            getVoucherList() {
                getVirtualProductProductList({
                    mctId: this.mctId,
                    virtualProductType: '03',
                    virtualProductSource: 'cop',
                    loginFlag: 0
                }).then(res=>{
                    this.djCouponList = [...this.djCouponList, ...res.list]
                    this.hasFinish[2] = true
                })
            },
            //获取套餐列表
            getProductList () {
                return new Promise((resolve, reject) => { 
                    getVirtualProductProductList({
                        mctId: this.mctId,
                        mctCategoryId: this.nowCategoryId,
                        virtualProductType: '01',
                        virtualProductSource: 'cop',
                        loginFlag: 0
                    }).then(res=>{
                        this.menuList = [...this.menuList, ...res.list]
                        this.hasFinish[3] = true
                        resolve(res.list)
                    })
                })
            },
            // 券详情
            couponDetail(item) {
                console.log(item)
                this.bridgeSdk.jumpPage({
                    title: '优惠券详情',
                    url: `/package-product-list/productDetail/couponDetail?couponBaseId=${item.couponBaseId}&mctId=${this.mctId}&storeId=${this.storeId}&displayId=${item.displayId}`, // 目标页面的路径
                })
            },
            //领取优惠券
            drawDownClick (item) {
                if(item._dis) return
                receiveCpnTicket({
                    couponBaseId: item.couponBaseId,//优惠券编号
                    displayId: item.displayId,
                    chnlFlag:'0',
                    mctId: this.mctId,
                    shopsId: this.storeId
                },{
                    catchError: true
                }).then(res=>{
                    uni.showToast({
                        title: '领取成功',
                        icon: 'none',
                        duration: 2000
                    })
                }).catch(error=>{
                    console.log('领券返回的结果', error);
                    if(error.code == '0054') {
                        this.ticketPlatList = this.ticketPlatList.map(e=>{
                            return {
                                ...e,
                                _dis: e.couponBaseId == item.couponBaseId ? true : e._dis
                            }
                        })
                        this.ticketMctList = this.ticketMctList.map(e=>{
                            return {
                                ...e,
                                _dis: e.couponBaseId == item.couponBaseId ? true : e._dis
                            }
                        })
                    }
                    uni.showToast({
                        title: `${error.message}`,
                        icon: 'none',
                        duration: 2000
                    });
                })
            },
            // 商品详情
            goDetail(e, virtualProductType, name) {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/productDetail/productDetailCoupon?virtualProductType=${virtualProductType}&spuId=${e.spuId}&mctId=${this.mctId}&storeId=${this.storeId}&title=${name}详情`,
                    title: name + '详情'
                })
            },
            // 买商品
            doBuy(e) {
                if(e.isNew == '0') {
                    this.bridgeSdk.makePhoneCall({
                        title: '商家电话',
                        phoneNumber: this.phone
                    })
                    return
                }
                let param = {
                    mctId: this.mctId,
                    shopsId: this.storeId,
                    skuId: e.skuAll[0].skuId,
                    num: 1,
                }
                shopingCoupon({
                    ...param
                }).then(res=>{
                    useMctStore().setOrderStoreId(this.storeId)
                    useMctStore().setOrderMctId(this.mctId)
                    useMctStore().setOrderInfo(res)
                    this.$refs.orderPop.openPop()
                    // this.bridgeSdk.jumpPage({
                    //     url: `/package-product-list/checkout/checkoutVirtual`,
                    // })
                })
            },
            // 订单提交完毕跳转
            doSubmitOrder() {
                console.log('订单提交完毕跳转')
                // this.bridgeSdk.jumpPage({
                //     url: `/package-product-list/orderDetail/orderDetailNew?orderNo=${useMctStore().orderId}`,
                // })
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
.titleBg {
    width: 48rpx;
    height: 38rpx;
    line-height: 38rpx;
    text-align: center;
    color: white;
    font-size: 24rpx;
    font-weight: bold;
    background-color: #FF9240;
    border-radius: 8rpx;
    margin-right: 8rpx;
}
.combo-ticket {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &_item{
        background-color: white;
        height: 42rpx;
        border-radius: 10rpx;
        border: 3rpx solid #00BCB8;
        padding: 6rpx 0;
        display: flex;
        align-items: center;
        margin-right: 28rpx;
        .left {
            padding-left: 16rpx;
            padding-right: 6rpx;
            font-size: 28rpx;
            color: #00BCB8;
            min-width: 120rpx;
            max-width: 180rpx;
        }
        .right {
            font-size: 28rpx;
            color: #00BCB8;
            padding: 0 18rpx 0 8rpx;
            border-left: 2rpx solid #00BCB8;
        }
    }
}
.combo-coupon {
    margin-bottom: 32rpx;
    &_title {
        font-size: 28rpx;
        color: #333;
        font-weight: bolder;
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
    }
    &_list {
        .item {
            width: calc(690rpx - 20rpx - 18rpx);
            min-height: calc(126rpx - 20rpx - 20rpx);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20rpx 18rpx 20rpx 20rpx;
            border-radius: 12rpx;
            background-color: rgba(1, 188, 184, .1);
            margin: 16rpx auto 0;
            &-btn {
                padding:0 18rpx;
                height: 42rpx;
                font-size: 24rpx;
                color: white;
                background-color: #00bcb8;
                border-radius: 22rpx;
                text-align: center;
                line-height: 42rpx;
            }
        }
        .more{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            color: #333;
            margin-top: 20rpx;
        }
    }
}
.combo-menu {
    margin-top: 0rpx;
    // margin-top: 32rpx;
    padding-bottom: 30rpx;
    &_title {
        font-size: 28rpx;
        color: #333;
        font-weight: bolder;
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
    }
    &_tags {
        white-space: nowrap;
        margin: 18rpx 0;
        &--list {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .item{
                padding: 0 18rpx;
                height: 48rpx;
                border-radius: 42rpx;
                font-size: 20rpx;
                line-height: 48rpx;
                text-align: center;
                margin-right: 8rpx;
                background-color: #F7F7F7;
                color: #333;
            }
            .active{
                background-color: #F3FCFC;
                color: #00BCB8;
            }
        }
    }
    &_list {
        .item{
            padding: 10rpx 0rpx;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin: 10rpx 0 0;;
            image {
                width: 200rpx;
                height: 180rpx;
                border-radius: 10rpx;
            }
            &-title {
                flex: 1;
                margin-left: 28rpx;
                margin-right: 14rpx;
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
                flex-direction: column;
            }
            &-btn {
                padding:0 18rpx;
                height: 42rpx;
                font-size: 24rpx;
                color: white;
                background-color: #00bcb8;
                border-radius: 22rpx;
                text-align: center;
                line-height: 42rpx;
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
    padding: 20rpx 20rpx 18rpx 20rpx;
    position: relative;
    font-size: 28rpx;
    border-radius: 10rpx;
    width: 650rpx;
    margin: 20rpx auto 0;
    background-color: rgba(1, 188, 184, .05);
    &_left{
        flex: 1;
        display: flex;
        &--name{
            // margin-left: 10rpx;
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-x: hidden;
            flex: 1;
        }
        .green {
            color: #999999;
            font-size: 24rpx;
            margin-top: 12rpx;
        }
    }
    .disabled{
        opacity: .5;
        padding: 0 40rpx;
    }
    &_right{
        padding: 4rpx 18rpx;
        border-radius: 25rpx;
        text-align: center;
        color: white;
        font-size: 24rpx;
        line-height: 34rpx;
        background: #00BCB8;
    }
}
</style>