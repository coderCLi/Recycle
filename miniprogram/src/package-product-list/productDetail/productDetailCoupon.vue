<!--
 * @Description: 商品详情（卖券）
 * @Autor: TF
 * @Date: 2025-05-14 10:59:27
 * @LastEditors: TF
 * @LastEditTime: 2025-08-09 13:11:25
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="propsData" style="background-color: #f8f8f8;" @navBack="navBack">
        <!-- 优惠套餐（礼品券） -->
        <template v-if="virtualProductType == '01'">
            <!-- 大图 -->
            <view class="banner">
                <up-swiper :list="picList" @click="previewImg" height="388rpx" @change="swiperChange"></up-swiper>
                <view class="banner-num" v-if="picList.length > 0">{{ current }}/{{ picList.length }}</view>
            </view>
            <!-- 券信息 -->
            <view class="info">
                <up-skeleton rows="1" :title="false" rowsHeight="18" :rowsWidth="['50%']" :loading="loading">
                    <view style="display: flex;align-items: flex-start;justify-content: space-between;">
                        <view class="info-title muti-overflow" style="flex: 1;">{{ info.spuName }}</view>
                        <view class="amt" style="margin-left: 20rpx;">¥{{ info.skuAll[0].price }}</view>
                    </view>
                    <view class="info-text" v-if="false">
                        <view style="flex: 1;">
                            <!-- <view>限购说明 每人每日限购{{ info.skuAll[0].couponByMctUserResp }}张</view> -->
                            <view class="info-text_item">
                                <view>退款说明</view> 
                                <view>随时退 过期自动退</view>
                            </view>
                            <template v-if="info.skuAll[0].couponByMctUserResp">
                                <!-- 相对时间 -->
                                <view class="info-text_item" v-if="info.skuAll[0].couponByMctUserResp.useTimeMode == '1'">
                                    <view>
                                        有效期
                                    </view>
                                    <view>
                                        购买之后{{ info.skuAll[0].couponByMctUserResp.useTimeout }}天有效
                                    </view>
                                </view>
                                <!-- 绝对时间 -->
                                <view class="info-text_item" v-if="info.skuAll[0].couponByMctUserResp.useTimeMode == '2'">
                                    <view>
                                        有效期
                                    </view>
                                    <view>
                                        购买之后{{ info.skuAll[0].couponByMctUserResp.useEndTime }}前有效
                                    </view>
                                </view>
                            </template>
                        </view>
                        <view class="amt">¥{{ info.skuAll[0].price }}</view>
                    </view>
                </up-skeleton>
            </view>
        </template>
        <!-- 代金券 -->
        <template v-if="virtualProductType == '03'">
            <view class="topbg">
                <up-skeleton rows="1" rowsHeight="18" :rowsWidth="['50%']" :loading="loading">
                    <view class="topbg-title">{{ info.spuName }}</view>
                    <view class="topbg-text">
                        <view>{{ storeInfo.storeName }}</view>
                        <view style="color: #999999;font-size: 24rpx;" v-if="info.salesVolume > 0">已售{{ info.salesVolume }}</view>
                        <view v-else></view>
                    </view>
                </up-skeleton>
            </view>
            <view class="topinfo">
                <up-skeleton :title="false" rows="1" :rowsHeight="[40]" :rowsWidth="['80%']" :loading="loading">
                    <view class="topinfo-amt">
                        <view class="topinfo-amt_price">¥ {{ info.skuAll[0].price }}</view>
                        <view class="topinfo-amt_discount">{{ info.discount }}折</view>
                        <view style="margin: 0 20rpx;font-size: 24rpx;font-weight: bold;">=</view>
                        <view class="topinfo-amt_item">
                            <view>零售价</view>
                            <view style="font-size: 24rpx;font-weight: bold;">¥{{ info.skuAll[0].originalPrice }}</view>
                        </view>
                        <view style="margin: 0 20rpx;font-size: 24rpx;font-weight: bold;">-</view>
                        <view class="topinfo-amt_item">
                            <view>团购优惠</view>
                            <view style="font-size: 24rpx;font-weight: bold;">¥{{ toFixed(info.disPrice, 2) }}</view>
                        </view>
                    </view>
                    <template v-if="false">
                        <view class="topinfo-item" style="margin-top: 20rpx;">
                            <view>退款说明</view> 
                            <view>随时退 过期自动退</view>
                        </view>
                        <template v-if="info.skuAll[0].couponByMctUserResp">
                            <!-- 相对时间 -->
                            <view class="topinfo-item" v-if="info.skuAll[0].couponByMctUserResp.useTimeMode == '1'">
                                <view>
                                    有效期
                                </view>
                                <view>
                                    购买之后{{ info.skuAll[0].couponByMctUserResp.useTimeout }}天有效
                                </view>
                            </view>
                            <!-- 绝对时间 -->
                            <view class="topinfo-item" v-if="info.skuAll[0].couponByMctUserResp.useTimeMode == '2'">
                                <view>
                                    有效期
                                </view>
                                <view>
                                    购买之后{{ info.skuAll[0].couponByMctUserResp.useEndTime }}前有效
                                </view>
                            </view>
                        </template>
                    </template>
                </up-skeleton>
            </view>
        </template>

        <!-- 购买须知 -->
        <view class="content">
            <template v-if="virtualProductType != '03'">
                <view style="font-size: 28rpx;color: #333;font-weight: bold;margin-bottom: 20rpx;">团购详情</view>
                <u-parse style="font-size: 24rpx;" lazy-load :content="bridgeSdk.addMinioPrefixToImgSrc(info.detailDescription)"></u-parse>
            </template>
            <template v-if="bridgeSdk.checkIsEmpty(info.skuAll[0].virtualProductRemark)">
                <view style="font-size: 28rpx;color: #333;font-weight: bold;margin: 20rpx 0;">购买须知</view>
                <u-parse style="font-size: 24rpx;" lazy-load :content="bridgeSdk.addMinioPrefixToImgSrc(info.skuAll[0].virtualProductRemark)"></u-parse>
            </template>

            <view v-if="virtualProductType == '03'">
                <view class="content-title" style="margin-bottom: 24rpx;">
                    <view>适用门店</view>
                    <view style="display: flex;align-items: center;font-size: 24rpx;color: #333" @click="goSuitableStore">
                        {{ total }}家门店通用
                        <up-icon name="arrow-right" color="#333" size="8"/>
                    </view>
                </view>
                <mct-com :info="storeInfo" @click="goStore"/>
            </view>
        </view>


        <!-- 底部按钮 -->
        <view class="bottom" v-show="!loading">
            <!-- 优惠套餐 -->
            <view style="display: flex;align-items: center;">
                <!-- <view style="display: flex;flex-direction: column;align-items: center;" @click="doCollect">
                    <image v-if="isCollection == '0'" :src="staticBaseUrl + '/hbdimage/package-product-list/shoucang.png'"/>
                    <image v-else :src="staticBaseUrl + '/hbdimage/examination/shoucangnew.png'"/>
                    <view style="margin-top: 4rpx;color:#666666;">{{isCollection == '0' ? '收藏' : '取消收藏'}}</view>
                </view> -->
                <view style="display: flex;flex-direction: column;align-items: center;margin:0 40rpx;color: #666666;" @click="shareBtn">
                    <image :src="staticBaseUrl + '/hbdimage/package-product-list/fenxiang.png'"/>
                    <view style="margin-top: 4rpx;color:#666666;">分享</view>
                </view>
                <view style="display: flex;flex-direction: column;align-items: center;" @click="goStore" v-if="needStore">
                    <image :src="staticBaseUrl + '/hbdimage/package-product-list/mendian.png'"/>
                    <view style="margin-top: 4rpx;color:#666666;">门店</view>
                </view>
            </view>
            <!-- 代金券 -->
            <!-- <view v-if="virtualProductType == '03'">
                <view style="display: flex;flex-direction: column;align-items: center;" @click="goStore">
                    <image :src="staticBaseUrl + '/hbdimage/package-product-list/mendian.png'"/>
                    <view style="margin-top: 4rpx;color:#666666;">门店</view>
                </view>
            </view> -->
            <view class="btn" @click="doBuy">
                {{ info.isNew == '1' ? '立即抢购' : '电话咨询' }}
                <text v-if="info.isNew == '1'" style="font-size: 28rpx;margin-left: 2rpx;">¥{{ info.skuAll[0].price }}</text>
            </view>
        </view>
    </vc-container>


    <!-- 分享弹层 -->
    <up-popup :show="showShare" :round="10" mode="bottom" @close = "showShare=false">
        <view class="share-box">
            <vc-share :props-data="shareFriendData">
                <view class="share-title box">
                    <image :src="staticBaseUrl+'/hbdimage/recommendHbd/wx.png'" mode="widthFix" class="imgdom"></image>
                    微信
                </view>
            </vc-share>
            <!-- 仅App支持分享到朋友圈，微信小程序暂不支持 -->    
            <!-- <vc-share :props-data="shareTimeLineData">
                <view class="share-title box">
                    <image :src="staticBaseUrl+'/hbdimage/recommendHbd/pyq.png'" mode="widthFix" class="imgdom"></image>
                    朋友圈
                </view>
            </vc-share> -->
        </view>        
        <view class="cancel-btn" @click="showShare=false">取消</view>
    </up-popup>

    <order-pop ref="orderPop" @on-submit="doSubmitOrder"></order-pop>
</template>

<script>
    import { 
        getVirtualProductInfo, // 获取虚拟商品详情
        shopingCoupon, // 下单
        getStore,
        getCpnTicketList,// 获取领券列表
        getStoreByCoupon,// 获取适用门店列表
        getCollectionStatus,
        updateCollectionStatus
    } from '../api/index'
    import { useMctStore } from '@/store'
    import orderPop from '../components/order-pop.vue'
    import mctCom from '../components/mctCom.vue'
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    export default {
        name: 'productDetailCoupon',
        components: {
            orderPop, mctCom
        },
        data() {
            return {
                toFixed,
                from: '',// 来源 collect-收藏
                propsData: {
                    props: {
                        isFullScreen: {
                            value: false,
                        },
                        title: {
                            value: "商品详情"
                        },
                        customLeftBack: {
                            value: true
                        }
                    }
                },
                spuId: '',// 商品ID
                mctId: '',// 商户ID
                storeId: '',// 门店ID
                storeInfo: {},// 门店信息
                virtualProductType: '01',// 券类型 01-礼品券 02-折扣券 03-代金券
                info: {
                    skuAll: [{
                        mediaAll: [{}]
                    }],
                    detailDescription: ''
                }, // 商品信息
                picList: [],// 图片列表
                current: 1,// 当前图片索引

                urltext: '',// 收藏地址
                userId: '',// userId
                isLogin: '0',// 登录状态
                collectionId: '',// 收藏ID
                isCollection: '0',// 是否收藏
                isRebuy: false,// 是否再次购买
                isStoreService: false,// 是否商家服务类进入
                total: 1,// 共多少家适用门店

                // 微信分享好友
                shareFriendData: { 
                    props: {
                        title: {
                            value: ''
                        },
                        content: {
                            value: ''
                        },
                        type: { 
                            value: '0'
                        }, 
                        shareType: { 
                            value: 'url'
                        },
                        path: {
                            value: ""
                        }
                    }
                },
                showShare: false,
                needStore: false,

                loading: true,// 加载中
            }
        },
        async onLoad(options) {
            // 捕获错误避免未捕获的reject错误
            try {
                console.log(options)
                this.spuId = options.spuId
                this.mctId = options.mctId
                this.storeId = options.storeId
                this.from = options._from // 来源页面
                this.isStoreService = options.isStoreService // 是否商家服务类进入该页面
                this.virtualProductType = options.virtualProductType // 虚拟商品类型（券类型）
                this.needStore = options._needStore // 判断是否需要展示门店按钮
                this.isRebuy = options.rebuy == '1'
                this.propsData.props.title.value = options.title ? options.title : '商品详情'
                this.propsData.props.customLeftBack.value = true
                this.propsData = {...this.propsData}

                await this.getInfo()
                this.getStoreInfo()

                if(this.virtualProductType == '03') {
                    this.getStoreList()
                    this.getTicketList()
                }

                // 用户信息
                const userInfo = this.bridgeSdk.getUserInfo()?.userInfo
                this.userId = userInfo?.userId
                this.isLogin = userInfo?.isLogin
                // 收藏用地址
                let urlMsg = this.bridgeSdk.getCurrentRouter().route
                this.urltext ='/'+ urlMsg + "?storeId=" + this.storeId + '&mctId=' + this.mctId + '&spuId=' + this.spuId + '&virtualProductType=' + this.virtualProductType

                // 获取收藏状态(已登录情况调用)
                this.isLogin == '1' && this.getCollection()
                
            } catch (error) {
                console.error(error)
            }
        },
        onShareAppMessage(res) {
            return this.bridgeSdk.onShareAppMessage(this.onShareAppMessageData);
        },     
        methods: {
            //获取详情
            async getInfo() {
                let res = await getVirtualProductInfo({
                    spuId: this.spuId,
                    virtualProductType: this.virtualProductType
                }, {
                    catchError: true
                }).catch(err => {
                    console.error(err)
                    if(err.code == '0054') {
                        this.bridgeSdk.showConfirm({
                            title: '提示',
                            showCancel: true,
                            content: err.message,
                            cancelText: '我再想想',
                            confirmText: '选购其他商品',
                            cancelCallback: (res) => {
                                this.bridgeSdk.navigateBackTo({
                                    delta: 1
                                })
                            },
                            confirmCallback: (res) => {
                                this.bridgeSdk.jumpPage({
                                    url: '/package-product-list/merchantDetail/merchantDetailCoupon?storeId=' + this.storeId + '&mctId=' + this.mctId,
                                    openType: 'redirectTo'
                                })
                            }
                        })
                        return Promise.reject(err)
                    }
                    uni.showToast({
                        title: `${err.message}`,
                        icon: 'none'
                    });
                })
                if(!this.bridgeSdk.checkIsEmpty(res)) return
                this.info = {...res}
                // 判断团购详情（商品详情）内容文本是否为空
                this.info.detailDescriptionText = this.info.detailDescription.replace(/<[^>]*>/g, '')
                console.log(this.info.detailDescriptionText)
                // 图片列表
                this.picList = res.skuAll[0] ? res.skuAll[0].mediaAll.map(e => this.minioBaseUrl + e.mediaUrl) : []
                // 折扣
                this.info.discount = toFixed(multiply(divide(res.skuAll[0].price, res.skuAll[0].originalPrice), 10), 1)
                // 优惠价
                this.info.disPrice = minus(res.skuAll[0].originalPrice, res.skuAll[0].price)

                this.loading = false
                // 如果为再次购买则默认拉起购买操作
                if(this.isRebuy) {
                    console.log('再次购买')
                    if(Number(this.info.skuAll[0].stockQuantity) <= 0) {
                        this.bridgeSdk.showConfirm({
                            title: '提示',
                            showCancel: true,
                            content: "当前商品暂无库存，请选择其他商品",
                            cancelText: '我再想想',
                            confirmText: '选购其他商品',
                            cancelCallback: (res) => {
                                this.bridgeSdk.navigateBackTo({
                                    delta: 1
                                })
                            },
                            confirmCallback: (res) => {
                                this.bridgeSdk.jumpPage({
                                    url: '/package-product-list/merchantDetail/merchantDetailCoupon?storeId=' + this.storeId + '&mctId=' + this.mctId,
                                    openType: 'redirectTo'
                                })
                            }
                        })
                        return
                    }
                    this.doBuy()
                }

                return res;
            },
            // 获取商户详情
            getStoreInfo() {
                getStore({ 
                    storeId: this.storeId
                }).then(res => {
                    this.storeInfo = res
                    this.shareFriendData.props.title.value = this.info.spuName
                    this.shareFriendData.props.content.value = this.storeInfo.provinceName + this.storeInfo.cityName + this.storeInfo.areaName + this.storeInfo.storeAddress
                    // this.shareFriendData.props.miniAPPPath.value = this.urltext
                    this.shareFriendData.props.path.value = this.baseUrl + `#/pages/browser-to-app/browser-to-app?url=${encodeURIComponent(this.urltext.slice(1))}&title=商品详情`
                })
            },
            // 获取优惠券
            getTicketList() {
                getCpnTicketList({ 
                    mctId: this.mctId,
                    shopsId: this.storeId
                }).then(res=>{
                    this.storeInfo.ticketList = [...res]
                })
            },
            // 获取适用门店列表(取总数)
            getStoreList() {
                getStoreByCoupon({
                    couponBaseId: this.info.skuAll[0].virtualProductId,
                    mctId: this.mctId,
                    page: 1,
                    rows: 10,
                }).then(res=>{
                    this.total = res.total
                })
            },
            // 查看图片
            previewImg() {
                uni.previewImage({
                    urls: this.picList,
                    current: this.current - 1
                })
            },
            swiperChange(e) {
                this.current = e.current + 1
            },
            // 购买
            doBuy() {
                if(this.info.isNew == '0') {
                    this.bridgeSdk.makePhoneCall({
                        title: '商家电话',
                        phoneNumber: this.storeInfo.storePhone
                    })
                    return
                }
                let param = {
                    mctId: this.mctId,
                    shopsId: this.storeId,
                    skuId: this.info.skuAll[0].skuId,
                    num: 1,
                }
                shopingCoupon({
                    ...param
                }).then(res=>{
                    useMctStore().setOrderStoreId(this.storeId)
                    useMctStore().setOrderMctId(this.mctId)
                    useMctStore().setOrderInfo(res)
                    this.$refs.orderPop.openPop()
                })
            },
            doClose() {
                console.log('关闭')
            },
            // 订单提交完毕跳转
            doSubmitOrder() {
                console.log('订单提交完毕跳转')
                // this.bridgeSdk.jumpPage({
                //     url: `/package-product-list/orderDetail/orderDetailNew?orderId=${useMctStore().orderId}`,
                // })
            },
            // 获取收藏状态
            getCollection() {
                getCollectionStatus({
                    _userId: this.userId,
                    collectionUrl: this.urltext,
                }).then(res => {
                    if(!res) this.isCollection = '0'
                    else {
                        this.isCollection = res.isCollection
                        this.collectionId = res.collectionId
                    }
                })
            },
            // 门店
            goStore() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/merchantDetail/merchantDetailCoupon?storeId=${this.storeId}&mctId=${this.mctId}`
                })
            },
            // 跳转适用门店
            goSuitableStore() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/merchantList/suitableStoreList?mctId=${this.mctId}&couponBaseId=${this.info.skuAll[0].virtualProductId}`
                })
            },
            shareBtn(){
                this.showShare=true;
                // 微信分享好友
                this.onShareAppMessageData = {
                    title: this.info.spuName,
                    path: this.urltext,
                    content: this.storeInfo.provinceName + this.storeInfo.cityName + this.storeInfo.areaName + this.storeInfo.storeAddress,
                };
            },
            // 收藏
            doCollect() {
                let _this = this
                const isCollection = this.isCollection
                //收藏接口
                let params = {
                    _userId: this.userId,
                    collectionUrl:this.urltext,
                    collectionId: this.collectionId,
                    collectionType: '3',//0-考试助手用 2-门店 3-商品
                    isCollection: this.isCollection == '0' ? '1' : '0',
                    title: this.info.spuName,
                    showType: '3',//0-考试助手用 2-门店 3-商品
                    collectionDis: this.info.spuName,
                    remark:'',
                    photo:'',
                    collectionData:'',
                    collectionSource:'',
                    collectionMsgId: this.info.spuId
                }
                updateCollectionStatus({
                    ...params
                }).then(res=>{
                    _this.getCollection()
                    uni.showToast({
                        title: isCollection == '0' ? '收藏成功' : '取消收藏成功',
                        icon: 'none',
                    });
                })
            },
            // 返回事件
            navBack(e) {
                console.log('返回');
                if(this.from == 'collect') {
                    this.bridgeSdk.navigateBackTo({ 
                        delta: 1,
                        success(page){
                            page && page.__loadData__ && page.__loadData__();
                        }
                    });
                } else {
                    this.bridgeSdk.navigateBackTo({ delta: 1 });
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.share-btn) {
    margin: 0 0 !important;
    padding: 0 0 !important;
}
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
.images{
    width: 100%;
    height: 388rpx;
}

.banner{
    height: auto;
    position: relative;
    &-num {
        position: absolute;
        bottom: 12rpx;
        right: 28rpx;
        width: 80rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        font-size: 24rpx;
        color: white;
        background-color: rgba(0,0,0,0.5);
        border-radius: 23rpx;
    }
}
.info {
    padding: 40rpx 30rpx;
    background-color: white;
    line-height: 60rpx;
    font-size: 28rpx;
    position: relative;
    .amt{
        font-size: 28rpx;
        color: #FF1F1F;
        font-weight: bold;
    }
    &-title{
        font-size: 32rpx;
        line-height: 44rpx;
        font-weight: bold;
        color: #333;
    }
    &-text{
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        font-size: 24rpx;
        color: #333333;
        line-height: 34rpx;
        margin-top: 16rpx;
        font-weight: bold;
        &_item {
            margin-top: 6rpx;
            display: flex;
            align-items: center;
            flex: 1;
            view:first-child {
                width: 20%;
            }
            view:last-child{
                flex: 1;
            }
        }
    }
}
.topbg {
    background-color: #F3FCFC;
    padding: 40rpx 30rpx 42rpx 36rpx;
    &-title {
        font-size: 36rpx;
        line-height: 50rpx;
        font-weight: bold;
    }
    &-text {
        font-size: 28rpx;
        line-height: 40rpx;
        margin-top: 12rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.topinfo {
    margin-top: -20rpx;
    background-color: white;
    border-radius: 32rpx 32rpx 0 0;
    padding: 20rpx 32rpx;
    &-amt {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &_price {
            font-size: 48rpx;
            color: #FF1F1F;
            line-height: 66rpx;
            font-weight: bold;
        }
        &_discount {
            font-size: 24rpx;
            color: #FF1F1F;
            line-height: 34rpx;
            background-color: rgba(255, 31, 31, 0.1);
            min-width: 88rpx;
            text-align: center;
            padding: 2rpx 0;
            border-radius: 19rpx;
            margin-left: 6rpx;
        }
        &_item {
            font-size: 28rpx;
            line-height: 40rpx;
            text-align: center;
        }
    }
    &-item {
        font-size: 24rpx;
        line-height: 34rpx;
        font-weight: bold;
        margin-bottom: 6rpx;
        display: flex;
        align-items: center;
        view:first-child {
            width: 20%;
        }
        view:last-child{
            flex: 1;
        }
    }
}


.content {
    margin: 20rpx 0 0;
    margin: 20rpx 0 0;
    padding: 38rpx 30rpx calc(180rpx + constant(safe-area-inset-bottom));
    padding: 38rpx 30rpx calc(180rpx + env(safe-area-inset-bottom));
    background-color: white;
    font-size: 28rpx;
    &-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 56rpx;
    }
    &-store {
        width: 590rpx;
        padding: 28rpx 10rpx 28rpx 24rpx;
        background-color: white;
        box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.1);
        display: flex;
        image {
            width: 200rpx;
            height: 180rpx;
            margin-right: 24rpx;

        }
    }
}
.bottom {
    display: flex;
    padding: 26rpx 40rpx calc(26rpx + constant(safe-area-inset-bottom)) 32rpx;
    padding: 26rpx 40rpx calc(26rpx + env(safe-area-inset-bottom)) 32rpx;
    background-color: white;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    color: #666666;
    font-size: 22rpx;
    image {
        width: 26rpx;
        height: 26rpx;
    }
    .btn {
        padding: 20rpx 50rpx;
        font-size: 32rpx;
        border-radius: 42rpx;
        text-align: center;
        color: white;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
    }
}


//分享朋友圈样式
.share-box{
        padding: 20rpx;
        display: flex;
        justify-content: center;
        .box{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20rpx;
            .imgdom{
                width: 96rpx;
                margin-bottom: 20rpx;
            }
        }
}
.share-title{
    color: #646566;
    font-size: 24rpx;
}
.cancel-btn{
    text-align: center;
    font-size: 32rpx;
    padding: 30rpx 0;
    border-top: 12rpx solid #f7f8fa;
}
</style>