<!--
 * @Description: 门店详情（线下模式）
 * @Autor: TF
 * @Date: 2025-05-13 14:20:28
 * @LastEditors: TF
 * @LastEditTime: 2025-08-15 09:01:40
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="{props: {isFullScreen: {value: false}, customLeftBack: {value: true}}}" style="background-color: #f8f8f8;" @navBack="navBack">
        <!-- 顶部轮播/大图 -->
        <view class="banner">
            <up-swiper :list="bannerPicList" @click="previewImg" height="350rpx" @change="swiperChange"></up-swiper>
            <view class="banner-num" v-if="bannerPicList.length > 0">{{ current }}/{{ bannerPicList.length }}</view>
        </view>
        <!-- 门店详情 -->
        <view class="info">
            <up-skeleton rows="2" rowsHeight="16" :rowsWidth="['100%', '100%']" :loading="loading">
                <view style="display: flex;align-items: flex-start;justify-content: space-between;">
                    <view class="info-title muti-overflow">
                        {{ info.storeName || '' }}
                    </view>
                    
                    <image v-if="isFxxf" style="width: 64rpx;height: 42rpx;" :src="staticBaseUrl + '/hbdimage/package-product-list/fxxf.png'"/>
                    <view v-else></view>
                </view>
                <scroll-view v-if="storeTags.length > 0" scroll-x style="white-space: nowrap;margin-bottom: 20rpx;">
                    <view class="info-tags">
                        <view class="item" v-for="(item, index) in storeTags" :key="index">
                            {{ item }}
                        </view>
                    </view>
                </scroll-view>
                <view class="info-time">
                    <text style="margin-right: 10rpx;font-size: 28rpx;" :style="{color: info.isBusiness == '0' ? '#FF5871' : '#00BCB8'}">{{ info.isBusiness == '0' ? '休息中' : '营业中' }}</text>
                    {{ info.storeTimeText }}
                </view>
                <view class="info-address">
                    <view class="muti-overflow" style="margin-right: 40rpx;font-weight: bold;">{{ info.storeAddress }}</view>
                    <view style="display: flex; align-items: center;gap: 14rpx;">
                        <view class="flex flex_col" style="align-items: center;justify-content: center;margin-right: 28rpx;" @click="goMap">
                            <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/location.png'" mode="scaleToFill" />
                            <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">导航</view>
                        </view>
                        <view class="flex flex_col" style="align-items: center;justify-content: center;" @click="goPhone">
                            <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'" mode="scaleToFill" />
                            <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">电话</view>
                        </view>
                    </view>
                </view>
            </up-skeleton>
        </view>
        <up-sticky v-show="tabs.length > 0" bgColor="white" :style="{top: stickyTop + 'px'}" style="margin-top: 30rpx;">
            <scroll-view scroll-x style="white-space: nowrap;">
                <view id="sticky" class="tabs">
                    <view :class="['item', nowTab.key == item.key ? 'active' : '']" v-for="(item, index) in tabs" :key="index" @click="doTab(item)">
                        {{ item.name }}
                    </view>
                </view>
            </scroll-view>
        </up-sticky>
        <!-- 超值优惠 -->
        <template v-if="nowTab.key == 'coupon'">
            <!-- 套餐/代金券 -->
            <view class="combo" id="coupon">
                <!-- 超值优惠 -->
                <product-block :mctId="mctId" :storeId="storeId" :phone="info.storePhone" @on-finish="setTab"></product-block>
            </view>
            <!-- 评价 -->
            <!-- <view class="rate" id="rate" v-if="tabs.some(e => e.key == 'rate')">
                <view class="rate-title">
                    <view>
                        评价
                        <text style="font-size: 20rpx;">({{ rateInfo.total }})</text>
                    </view>
                    <view style="font-size: 24rpx;display: flex;align-items: center;" @click="goAllRate">
                        查看全部
                        <up-icon name="arrow-right" color="#333" size="10"></up-icon>
                    </view>
                </view>
                <view class="rate-list">
                    <vc-empty :props-data="{props: {text: {value: '暂无评价'}, marginTop: {value: '20'}}}" v-if="rateInfo.list.length == 0"></vc-empty>
                    <template v-if="rateInfo.list.length > 0">
                        <view class="item" v-for="(item, index) in rateInfo.list" :key="index">
                            <view class="item-title">
                                <image :src="minioBaseUrl + item.photoUrl" mode="scaleToFill"/>
                                <view class="item-title_content">
                                    <view style="font-weight: bold;">{{ item.userName }}</view>
                                    <view style="display: flex;align-items: center;margin-top: 7rpx;">
                                        <up-rate inactiveIcon="star-fill" :count="5" size="12" gutter="5rpx" inactiveColor="#CCCCCC" allowHalf activeColor="#FF8715" readonly v-model="item.rating"></up-rate>
                                        <view style="color: #FF8715;font-size: 20rpx;margin-left: 12rpx;">{{ item.rating }}分</view>
                                    </view>
                                </view>
                                <view class="item-title_time">
                                    {{ item.reviewTime }}
                                </view>
                            </view>
                            <view :class="['item-content']">
                                <view :id="'rate-' + index" :class="[item._isPop ? '' : 'muti-overflow']" :style="{'-webkit-line-clamp':'3'}">
                                    <text :id="'rate-text-' + index">
                                        {{ item.optimizedReviewContent }}
                                    </text>
                                    <view class="pop" @click="item._isPop = !item._isPop " v-if="item._needPop">
                                        <view class="ellips" v-if="!item._isPop">...</view>
                                        <view style="background: white;display: inline-flex;align-items: center;">
                                            {{item._isPop ? '收起' : '全文'}}
                                            <up-icon :name="item._isPop ? 'arrow-up' : 'arrow-down'" color="#00BCB8" size="12"></up-icon>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="item-imgs">
                                <image v-for="(img, index) in item.reviewsImagesAll" @click="previewRateImg(item.reviewsImagesAll, index)" :key="index" :src="minioBaseUrl + img.imageUi" mode="aspectFill"></image>
                            </view>
                        </view>

                        <view style="display: flex;align-items: center;justify-content: center;font-size: 24rpx;" @click="goAllRate">
                            查看全部
                            <up-icon name="arrow-right" color="#333" size="12"></up-icon>
                        </view>
                    </template>
                </view>
            </view> -->
            <!-- 商家信息 -->
            <!-- <view class="mct" id="mct" v-if="tabs.some(e => e.key == 'mct')">
                <view class="mct-title">商家信息</view>
                <view class="mct-list">
                    <view class="item">
                        <view>商家名称：</view>
                        <view>{{ info.storeName }}</view>
                    </view>
                    <view class="item">
                        <view>营业时间：</view>
                        <view>{{ info.storeTimeText }}</view>
                    </view>
                    <view class="item">
                        <view>商家地址：</view>
                        <view>{{ info.provinceName }}{{ info.cityName }}{{ info.areaName }}{{ info.storeAddress }}</view>
                    </view>
                    <view class="item" v-if="info.mctInfo && info.mctInfo.categoryParentName">
                        <view>服务类目：</view>
                        <view>{{ info.mctInfo.categoryParentName }}</view>
                    </view>
                </view>
            </view> -->
        </template>
        <!-- 其他（资质证照、承诺书、消费提醒） -->
        <template v-else> 
            <view v-for="(item, index) in mctShowInfoBOList" :key="index">
                <view class="flex" style="background-color:#fff;padding: 20rpx 20rpx ;" v-if="nowTab.mctEntryType != '1'">
                    <view style="border-radius: 4rpx;width: 8rpx;height: 25rpx;background-color: rgba(51, 51, 51, 1);margin: 4rpx 0 4rpx 0" class="flex_col"></view>
                    <text style="font-size: 24rpx;margin-left: 10rpx;">
                        {{ item[0].mctEntryName ? item[0].mctEntryName : mctEntryName }}
                    </text>
                </view>
                <view style="padding:10rpx 0 0;" v-if="mctEntryInfoBOList.length > 0">
                    <u-album v-if="mctEntryInfoBOArrRender != 0" singleMode="widthFix" singleSize="240" multipleSize="120"
                        :urls="urls2[item[0].mctEntryType]"></u-album>
                </view>
            </view>
        </template>
        
        <!-- 底部按钮 -->
        <view class="bottom">
            <!-- <view class="bottom-item" @click="doCollect">
                <image v-if="isCollection == '0'" :src="staticBaseUrl + '/hbdimage/package-product-list/shoucang.png'"/>
                <image v-else :src="staticBaseUrl + '/hbdimage/examination/shoucangnew.png'"/>
                <view style="margin-left: 8rpx;">{{isCollection == '0' ? '收藏' : '取消收藏'}}</view>
            </view> -->
            <view class="bottom-item" @click="shareBtn">
                <image :src="staticBaseUrl + '/hbdimage/package-product-list/fenxiang.png'"/>
                <view style="margin-left: 8rpx;">分享</view>
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

</template>

<script>
    import { mapState } from 'pinia';
    import { useBaseStore } from "@/store/index.ts";
    import { 
        getStore,// 获取门店信息
        getMctBusinessInfos, // 获取商户信息
        getCollectionStatus,// 获取收藏状态
        updateCollectionStatus,// 收藏/取消收藏
        getReviews,// 获取评论列表
    } from '../api'
    import { minus, plus, divide, multiply } from '@/utils/decimal.ts'
    import ProductBlock from '../components/product-block.vue'
    export default {
        name: 'merchantDetailCoupon',
        components: {
            ProductBlock
        },   
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
        },     
        data() {
            return {
                divide,
                storeId: '',// 门店id
                mctId: '',// 商户id
                latitude: '',// 纬度
                longitude: '',// 经度
                storeTags: [],// 标签列表
                from: '',// 来源 collect-收藏进入

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
                
                bannerPicList: [],// 轮播图数据
                info: {},// 门店信息
                nowTab: {
                    key: 'coupon'
                },// 当前tab
                tabs: [
                    // {
                    //     name: '超值优惠',
                    //     key: 'coupon'
                    // },
                    // {
                    //     name: '评价',
                    //     key: 'rate'
                    // },
                    // {
                    //     name: '商家信息',
                    //     key: 'mct'
                    // }
                ],// tab列表
                mctEntryInfoBOList: [],// 放心消费商家页签列表

                rateInfo: {
                    total: 0,
                    list: [],
                },// 评价信息
                scrollTop: 0,
                stikcyNode: {},
                comboNode: {},
                mctNode: {},
                rateNode: {},

                urltext: '',// 收藏地址
                url: '',
                userId: '',// userId
                isLogin: '0',// 登录状态
                collectionId: '',// 收藏ID
                isCollection: '0',// 是否收藏

                loading: true,// 加载
                clock: null,
                canScroll: true,// 是否可滚动
                stickyTop: 0,// stickyTop
                current: 1,// 当前图片号

                isFxxf: false,// 是否是放心消费
                mctShowInfoBOList: [],// 放心消费材料对应每一页的材料列表
                urls2: [],// 材料图片列表
                // 0 表示未渲染时，1 表示强制更新的时机
                mctEntryInfoBOArrRender: 1,
                mctEntryName: '',//
            }
        },
        onLoad (options) {
            console.log('productDetailCoupon', this.baseUrl)
            console.log('options:',options)
            this.storeId = options.storeId
            this.mctId = options.mctId
            this.from = options._from

            //获取当前页面路由
            let url = this.bridgeSdk.getCurrentRouter();
            this.url = url.fullPath;
            console.log(this.url,"this.url")

            // this.nowTab = this.tabs[0]

            // console.warn('this.navigationBarInfo:',this.navigationBarInfo)
            // sticky的top位置
            this.stickyTop = this.navigationBarInfo.statusBarHeight + this.navigationBarInfo.navigationBarHeight
            console.log(this.stickyTop,"this.stickyTop")
        },
        async onReady() {
            await this.getLat()
            // 查询放心消费信息
            this.getFxxfInfo()
            //获取门店信息
            await this.getStoreDetail()

            //包含评价模块
            if(this.tabs.find(e => e.key == 'rate')) {
                // 获取评价列表
                await this.getReviewsList()
                // 计算各模块位置信息
                this.calcComponentsPos()
                // 设置评价每条展开
                this.calcRatePop()
            }
            this.$nextTick(_=>{
                // 用户信息
                const userInfo = this.bridgeSdk.getUserInfo()?.userInfo
                this.userId = userInfo?.userId
                this.isLogin = userInfo?.isLogin
                console.log('用户信息', userInfo);
                // 收藏用地址
                let urlMsg = this.bridgeSdk.getCurrentRouter().route
                this.urltext ='/'+ urlMsg + "?storeId=" + this.storeId + '&mctId=' + this.mctId

                // 获取门店收藏状态(已登录情况调用)
                this.isLogin == '1' && this.getCollection()
            })
        },
        onPageScroll(e) {
            return;
            // 暂时废弃
            this.scrollTop = e.scrollTop
            if(!this.canScroll) return;
            if(this.clock) {
                clearTimeout(this.clock)
                this.clock = null
            }
            let comboTop = this.comboNode.top - this.stikcyNode.height - 40, 
            rateTop = this.rateNode.top - this.stikcyNode.height - 40, 
            mctTop = this.mctNode.top - this.stikcyNode.height - 40

            this.clock = setTimeout(() => {
                // 滚动高度>优惠券节点高度
                if(e.scrollTop < rateTop) {
                    this.nowTab.key = 'coupon'
                }
                // 滚动高度>评价节点高度
                if(e.scrollTop >= rateTop && e.scrollTop <= mctTop) {
                    this.nowTab.key = 'rate'
                }
                // 滚动高度>商家节点高度
                if(e.scrollTop >= mctTop) {
                    this.nowTab.key = 'mct'
                }
            }, 100)
        },
        onShareAppMessage(res) {
            return this.bridgeSdk.onShareAppMessage(this.onShareAppMessageData);
        },    
        methods: {
            setTab(e) {
                if(e.ticketPlatList.length == 0 && e.ticketMctList.length == 0 && e.djCouponList.length == 0 && e.menuList.length == 0){
                    this.tabs = this.tabs.filter(e => e.key != 'coupon')
                    this.nowTab = this.tabs[0] ? this.tabs[0] : {}
                    this.$forceUpdate()
                } else {
                    if(this.tabs.some(e => e.key=='coupon')) return
                    this.tabs = [
                        {
                            name: '超值优惠',
                            key: 'coupon'
                        },
                        ...this.tabs
                    ]
                    this.nowTab = this.tabs[0]
                }
            },
            //px转rpx
            pxToRpx(px){
                let scale = uni.upx2px(100)/100;
                return px/scale 
            },
            // 计算各模块位置信息
            calcComponentsPos() {
                const query = uni.createSelectorQuery().in(this);
                query.select("#sticky").boundingClientRect((data) => {
                    this.stikcyNode = data
                }).exec()
                this.tabs.some(e => e.key == 'coupon') && query.select("#coupon").boundingClientRect((data) => {
                    this.comboNode = data
                }).exec()
                this.tabs.some(e => e.key == 'rate') && query.select("#rate").boundingClientRect((data) => {
                    this.rateNode = data
                }).exec()
                this.tabs.some(e => e.key == 'mct') && query.select("#mct").boundingClientRect((data) => {
                    this.mctNode = data
                }).exec()
            },
            // 计算评论是否展示展开
            calcRatePop() {
                const query = uni.createSelectorQuery().in(this);
                this.rateInfo.list = this.rateInfo.list.map((e, i)=>{
                    let height = 0;
                    query.select(`#rate-text-${i}`).boundingClientRect((data) => {
                        height = data.height
                    }).exec()
                    return {
                        ...e,
                        _needPop: height >= uni.upx2px(33 * 4)
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
            //获取门店信息
            async getStoreDetail() {
                const res = await getStore({
                    storeId: this.storeId, 
                    loginFlag: 0,
                    latitude: this.latitude,
                    longitude: this.longitude,
                })
                this.info = res
                this.info.storeTime = JSON.parse(res.storeTime)
                // 判断次日情况展示
                this.info.storeTime = this.info.storeTime.map(e=>{
                    let end = e.end
                    if(Number(e.end.replace(':','')) < Number(e.start.replace(':',''))) {
                        end = end + '(次日)'
                    }
                    return {
                        ...e,
                        end: end
                    }
                })
                this.info.storeTimeText = this.info.storeTime.map(e => e.start + '-' + e.end).join(' ')
                this.storeTags = res.labelAll
                
                this.info.distance = (Number(this.info.distance) / 1000).toFixed(1)
                this.bannerPicList = [
                    this.minioBaseUrl + this.info.listPicUrl,
                    ...res.storeMediaAll.map(e => this.minioBaseUrl + e.mediaUrl)
                ]
                console.log(this.bannerPicList)
                this.loading = false

                this.shareFriendData.props.title.value = this.info.storeName
                this.shareFriendData.props.content.value = this.info.provinceName + this.info.cityName + this.info.areaName + this.info.storeAddress
                // this.shareFriendData.props.miniAPPPath.value = this.urltext
                this.shareFriendData.props.path.value = this.baseUrl + `#/pages/browser-to-app/browser-to-app?url=${encodeURIComponent(this.urltext.slice(1))}&title=商家详情`

                return res;
            },
            // 获取放心消费信息
            getFxxfInfo() {
                getMctBusinessInfos({
                    payStoreId: this.storeId,
                    payMctId: this.mctId
                },{
                    mask: false
                }).then(res=>{
                    console.warn(res)
                    if(this.bridgeSdk.checkIsEmpty(res)) {
                        this.isFxxf = true
                        // 过滤其中有材料的页签
                        this.mctEntryInfoBOList = res.mctEntryInfoBOList
                            .filter(ele => ele.mctEntryName != '超值优惠' && ele.mctEntryType != '1'  && ele.mctShowInfoBOList && ele.mctShowInfoBOList.length > 0)
                            .map(e => ({
                                ...e,
                                name: e.mctEntryName,
                                key: e.mctEntryId,
                            }))
                        this.tabs = [...this.tabs, ...this.mctEntryInfoBOList]
                        if(!this.bridgeSdk.checkIsEmpty(this.nowTab)) {
                            this.nowTab = this.tabs[0]
                        }

                        if (this.mctEntryInfoBOList.length > 0) {

                            this.mctShowInfoBOList = this.mctEntryInfoBOList[0].mctShowInfoBOList;
                            this.mctEntryName = this.mctEntryInfoBOList[0].mctEntryName;
                            
                            this.mctShowInfoBOList.forEach(group => {
                                if (group.length === 0) return;
                                const entryType = group[0].mctEntryType;
                                this.urls2[entryType] = group.map(item => this.minioBaseUrl + item.mctEntryTypeUrl);
                            });
                        }
                    } else {
                        this.isFxxf = false
                    }
                })
            },
            // 获取评价列表
            async getReviewsList() {
                let res = await getReviews({
                    page: 1,
                    rows: 5,
                    storeId: this.storeId,
                    spuId: '',// 暂时无用传空即可
                    userId: this.userId || '',
                },{
                    mask: false
                })
                console.log(res)
                this.rateInfo.list = [...(res.listUser ? res.listUser : []), ...res.list].map(e=>{
                    let time = e.reviewTime.substring(0,4) + '/' 
                                + e.reviewTime.substring(4,6) + '/'
                                +  e.reviewTime.substring(6,8)
                
                    return {
                        ...e,
                        reviewTime: time
                    }
                }).splice(0, 5)
                this.rateInfo.total = res.totalAll
                return res;
            },
            // 预览图片
            previewImg(e) {
                uni.previewImage({
                    current: this.current - 1,
                    urls: this.bannerPicList
                })
            },
            swiperChange(e) {
                this.current = e.current + 1
            },
            // 预览图片
            previewRateImg(urls, index) {
                uni.previewImage({
                    current: index,
                    urls: urls
                })
            },
            // 打开地图
            goMap() {
                this.bridgeSdk.getLocation(res => {
                    let longitude = Number(res.lng);
                    let latitude = Number(res.lat);
                    let s = `${Number(longitude)},${Number(latitude)}`;
                    let e = `${Number(this.info.longitude)},${Number(this.info.latitude)}`;
                    console.log("开始坐标：", s, "终点坐标：", e);
                    // 调用sdk 
                    this.bridgeSdk.routePlan(s, e, this.info.storeName, this.info.storeAddress);
                });
            },
            // 打电话
            goPhone() {
                this.bridgeSdk.makePhoneCall({
                    title: '商家电话',
                    phoneNumber: this.info.storePhone
                })
            },
            // 全部评价
            goAllRate() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/ratePage/ratePage?storeId=${this.storeId}&mctId=${this.mctId}`
                })
            },
            // 获取收藏状态
            getCollection() {
                getCollectionStatus({
                    _userId: this.userId,
                    collectionUrl: this.urltext,
                },{
                    mask: false
                }).then(res => {
                    if(!res) this.isCollection = '0'
                    else {
                        this.isCollection = res.isCollection
                        this.collectionId = res.collectionId
                    }
                })
            },
            // 收藏
            doCollect() {
                let _this = this;
                const isCollection = this.isCollection
                //收藏接口
                let params = {
                    _userId: this.userId,
                    collectionUrl:this.urltext,
                    collectionId: this.collectionId,
                    collectionType: '2',//0-考试助手用 2-门店 3-商品
                    isCollection: this.isCollection == '0' ? '1' : '0',
                    title: this.info.storeName,
                    showType: '2',//0-考试助手用 2-门店 3-商品
                    collectionDis: this.info.storeName,
                    remark:'',
                    photo:'',
                    collectionData:'',
                    collectionSource:'',
                    collectionMsgId: this.info.storeId
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
            shareBtn(){
                this.showShare=true;
                // 微信分享好友
                this.onShareAppMessageData = {
                    title: this.info.storeName,
                    path: this.urltext,
                    content: this.info.provinceName + this.info.cityName + this.info.areaName + this.info.storeAddress,
                };
            },        
            // 点击页签
            doTab(e) {
                console.log('点击页签：', e)
                //当前选择的tab页签
                this.nowTab = {...e}
                // 如果是超值优惠页签不使用切换页签后续放心消费的逻辑
                if(e.key == 'coupon') return;

                this.mctEntryName = e.mctEntryName;
                this.mctEntryInfoBOArrRender = 0;
                setTimeout(() => {
                    this.mctEntryInfoBOArrRender = 1;
                }, 10);
                
                this.urls2 = [];//清空前置数据 
                let index = this.mctEntryInfoBOList.findIndex(item => item.mctEntryId == e.key);

                this.mctShowInfoBOList = this.mctEntryInfoBOList[index].mctShowInfoBOList
                console.log('this.mctShowInfoBOList',this.mctShowInfoBOList)
                this.mctShowInfoBOList.forEach(group => {
                    if (group.length === 0) return;
                    const entryType = group[0].mctEntryType;
                    this.urls2[entryType] = group.map(item => this.minioBaseUrl + item.mctEntryTypeUrl);
                });
                return;

                // 此处逻辑为老设计可以上下滚动定位用
                const query = uni.createSelectorQuery().in(this)
                let top = 0;
                let selector = `#${e}`
                query.select(selector).boundingClientRect((data) => {
                    console.warn(data)
                    top = data.top + this.scrollTop;
                    console.log(e, top)
                    this.canScroll = false
                    uni.pageScrollTo({
                        scrollTop: top - this.stikcyNode.height - this.navigationBarInfo.statusBarHeight - this.navigationBarInfo.navigationBarHeight,
                        duration: 300,
                        complete: (e) => {
                            let time = setTimeout(() => {
                                this.canScroll = true
                                clearTimeout(time)
                            }, 600)
                        }
                    })
                }).exec()
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
:deep(.page-content) {
    overflow-y: inherit !important;
    padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
:deep(.share-btn) {
    margin: 0 0 !important;
    padding: 0 0 !important;
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
.info {
    background-color: white;
    padding: 40rpx 30rpx 30rpx;
    &-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bolder;
        margin: 0 0 20rpx 0;
        line-height: 44rpx;
    }
    &-tags {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .item {
            padding: 2rpx 12rpx;
            font-size: 20rpx;
            text-align: center;
            color: #00BCB8;
            border-radius: 6rpx;
            border: 2rpx solid #00BCB8;
        }
    }
    &-time {
        padding: 0rpx 0 16rpx;
        font-size: 24rpx;
        color: #333;
        border-bottom: 2rpx solid #f8f8f8;
    }
    &-address {
        margin: 24rpx 0 0;
        font-size: 28rpx;
        color: #333;
        line-height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .icon-img {
        height: 50rpx;
        width: 50rpx;
    }
}
.tabs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: white;
    padding: 38rpx 30rpx 10rpx;
    .item {
        position: relative;
        font-size: 28rpx;
        color: #333333;
        margin-right: 50rpx;
        line-height: 40rpx;
        padding-bottom: 12rpx;
    }
    .active {
        font-weight: bold;
        &::before {
            content: '';
            position: absolute;
            bottom: 0rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 8rpx;
            border-radius: 4rpx;
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #00BCB9;
        }
    }
}
.combo {
    background-color: white;
    padding: 32rpx 30rpx 12rpx;
}

.rate {
    padding: 20rpx 16rpx 20rpx;
    background-color: white;
    &-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 28rpx 18rpx 23rpx;
        color: #333333;
        font-size: 28rpx;
        font-weight: bold;
    }
    &-list {
        padding: 24rpx 18rpx 42rpx 22rpx;
        .item {
            margin: 18rpx auto 33rpx;
            &-title {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                font-size: 24rpx;
                image {
                    width: 63rpx;
                    height: 63rpx;
                    border-radius: 50%;
                    background: #f8f8f8;
                }
                &_content {
                    flex: 1;
                    margin-left: 7rpx;
                }
                &_time{
                    color: #999999;
                }
            }
            &-content {
                font-size: 24rpx;
                color: #333;
                line-height: 33rpx;
                margin-top: 28rpx;
                position: relative;
                .pop {
                    display: inline-flex;
                    color: #00BCB8;
                    font-size: 24rpx;
                    position: absolute;
                    right: 0;                 /* 定位到右下角 */
                    bottom: 0;                /* 对齐文本底部 */
                    padding-left: 4rpx;        /* 与省略号间隔 */
                    .ellips{
                        color: #333333;
                        padding: 0 10rpx 0 150rpx;
                        text-align: right;
                        background: linear-gradient(to left, white, rgba(255, 255, 255, 0));
                    }
                }
            }
            &-imgs {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-top: 20rpx;
                image {
                    width: 200rpx;
                    height: 144rpx;
                    background: #f8f8f8;
                    margin-right: 28rpx;
                }
            }
        }
    }
}
.mct {
    background-color: white;
    padding: 40rpx 30rpx calc(150rpx + constant(safe-area-inset-bottom));
    padding: 40rpx 30rpx calc(150rpx + env(safe-area-inset-bottom));
    &-title {
        color: #333333;
        font-size: 28rpx;
        font-weight: bold;
    }
    &-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 20rpx;
        gap: 14rpx;
        .item {
            display: flex;
            align-items: flex-start;
            font-size: 24rpx;
            line-height: 30rpx;
            
            view:first-child {
                width: 120rpx;
                font-weight: bold;
                color: #333;
            }
            view:last-child {
                flex: 1;
                color: #999999;
            }
        }
    }
}
.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 28rpx 0 calc(28rpx + constant(safe-area-inset-bottom));
    padding: 28rpx 0 calc(28rpx + env(safe-area-inset-bottom));
    background-color: white;
    &-item {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #666666;
        image {
            width: 26rpx;
            height: 26rpx;
        }
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