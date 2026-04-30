<!--
 * @Description: 积分商城-商品详情
 * @Autor: TF
 * @Date: 2025-06-25 09:11:50
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-17 09:19:24
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container>
        <!-- 商品Banner -->
        <view class="banner">
            <up-swiper :list="picList" @change="upSwiperChange" height="394rpx" :autoplay="true" :circular="true" @click="preImage"></up-swiper>
        </view>
        <view style="position:absolute;top:450rpx;width:100%;"> 
        <!-- 商品顶部描述 -->
        <view class="info">
            <view class="info-content">
                <view class="info-content--left">
                    <view class="price-container">
                        <view class="point">
                            <text v-if="Number(info._price) > 0 || Number(info.subPrice) > 0"> <text style="font-size:28rpx;">¥</text>{{ (Number(info._price || 0) - Number(info.subPrice || 0)).toFixed(2) }}</text>
                            <text v-if="Number(info._point) > 0 && (Number(info._price) > 0 || Number(info.subPrice) > 0)"> + </text>
                            <text v-if="Number(info._point) > 0">{{ info._point }}会员分</text>
                            <text style="font-size: 24rpx;">{{ skuList.length > 1 ? '起' : '' }}</text>
                        </view>
                        <!-- <view class="price">
                            原价：¥{{ Number(Number(info._originalPrice||'').toFixed(2)) }}
                        </view> -->
                    </view>
                    
                    <!-- 补贴展示 -->
                    <view class="subsidy-container" v-if="Number(info._price) > 0 || Number(info.subPrice) > 0">
                        <view class="subsidy-formula">
                            <text class="formula-symbol">=</text>
                            <view class="original-price">
                                <text class="original-price-label">原价</text>
                                <text class="formula-price">¥{{ Number(Number(info._originalPrice||'').toFixed(2)) }}</text>
                            </view>
                            <text class="formula-symbol">-</text>
                            <view class="subsidy-items">
                                <!-- 商家补贴 -->
                                <view class="subsidy-item" v-if="Number(info._price) > 0">
                                    <image style="width:110rpx;height:30rpx;" :src="minioBaseUrl + '/common/mctImages/icon-sjbt.png'" mode="aspectFit" class="subsidy-icon "/>
                                    <text class="subsidy-amount">¥{{ (Number(Number(info._originalPrice||'').toFixed(2)) - Number(info._price)).toFixed(2) }}</text>
                                </view>
                                
                                <!-- 减号 -->
                                <text class="formula-symbol" v-if="Number(info._price) > 0 && Number(info.subPrice) > 0">-</text>
                                
                                <!-- 平台补贴 -->
                                <view class="subsidy-item" v-if="Number(info.subPrice) > 0">
                                    <image :src="minioBaseUrl + '/common/mctImages/icon-ptbt.png'" mode="aspectFit" class="subsidy-icon"/>
                                    <text class="subsidy-amount">¥{{ Number(info.subPrice) }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- <view class="info-content--right">
                    已售{{ info.salesVolume }}件
                </view> -->
            </view>
            <view class="info-title muti-overflow flex">
                <view>
                    {{ info.spuName }}
                </view>
                <view class="info-content--right" style="margin-top: 5rpx;font-size: 22rpx; line-height:35rpx;">
                    已售 {{ info.salesVolume }}
                    件
                </view>
            </view>
            
            <view class="info-item" style="margin-top: 5rpx;">
                <view class="info-item--left">
                    规格
                </view>
                <view class="info-item--middle text-overflow" @click="checkAttr">
                    {{bridgeSdk.checkIsEmpty(nowSku)? '当前选择：' + nowSku.skuName : '请选择商品规格' }}
                </view>
                <up-icon name="arrow-right" size="12"></up-icon>
            </view>
            <!-- <view class="info-item">
                <view class="info-item--left">
                    发货
                </view>
                <view class="info-item--middle text-overflow">
                    湖南省长沙市 快递 包邮
                </view>
            </view> -->
        </view>

        <!-- 商品介绍 -->
        <view class="product-intro" v-if="introType">
            <view class="product-intro-title">商品介绍</view>
            
            <!-- 内容介绍 (introType为1) -->
            <view v-if="introType == '1'" class="content-intro">
                <view v-for="(category, index) in contentCategories" :key="index" class="content-category">
                    <view class="intro-tag">{{ category.title }}</view>
                    <view v-for="(product, productIndex) in category.products" :key="productIndex" class="intro-item">
                        <view class="intro-item-label ">{{ product.label }}</view>
                        <view class="intro-item-value">{{ product.value || '' }}</view>
                    </view>
                </view>
                <!-- 备注 -->
                <view v-if='this.remark' class="desc-category">
                    <view class="desc-category-title">· 备注</view>
                    <view class="desc-item">
                        <text style="font-weight: 400;font-size: 26rpx;color: #666666;">{{this.remark}}</text>
                    </view>
                </view>
            </view>
            
            <!-- 商品描述 (introType为2) -->
            <view v-else-if="introType == '2'" class="product-desc">
                <view v-for="(category, index) in descriptionCategories" :key="index" class="desc-category">
                    <view class="desc-category-title">· {{ category.title }}</view>
                    <view v-for="(item, itemIndex) in category.products" :key="itemIndex" class="desc-item">
                        <view class="desc-item-name">{{ item.label }}</view>
                        <view class="desc-item-info">
                            <span class="desc-item-num">({{ item.num }}份)</span>
                            <span class="desc-item-price">¥{{ item.price }}</span>
                        </view>
                    </view>
                    
                </view>
                <!-- 备注 -->
                <view v-if='this.remark' class="desc-category">
                    <view class="desc-category-title">· 备注</view>
                    <view class="desc-item">
                        <text style="font-weight: 400;font-size: 26rpx;color: #666666;">{{this.remark}}</text>
                    </view>
                </view>
                <!--  -->
            </view>
        </view>
        <!-- 商品图片 -->
        <view class="product-intro images" v-if="imageList && imageList.length > 0">
            <view class="product-intro-title">商品图片</view>
            <up-read-more :close-text="'查看更多'" color="#333" :open-text="'收起'">
                <view class="images-container">
                    <view v-for="(image, index) in imageList" :key="index" class="image-item">
                             <image  show-menu-by-longpress="{{true}}" :src="staticBaseUrl + '/' + image.url" mode="scaleToFill" class="product-image" />
                    </view>
                </view>
            </up-read-more>
        </view>
        <!-- 商品详情 -->
        <view class="content" v-if="info.details !=null && info.details!= ''">
            <image class="content-img" :src="staticBaseUrl + '/hbdimage/package-intergral-mall/product-top.png'" mode="widthFix"/>
            <u-parse :content="info.details" :tag-style="tagStyle" @imgTap="previewImage" :previewImg="false"></u-parse>
        </view>
        <!-- 购买须知 -->
        <Notice v-if="introType" :detailList="detailList" :otherRulesList="otherRulesList" :staticBaseUrl="staticBaseUrl"/>

        </view>
        <!-- 底部按钮 -->
        <view class="bottom">
            <!-- <view style="display: flex;flex-direction: column;align-items: center;justify-content: center;" @click="goKefu()">
                <image :src="staticBaseUrl + '/hbdimage/package-intergral-mall/kefu.png'"/>
                <view>客服</view>
            </view> -->
            <view class="bottom-btn" style="opacity: 0.8;pointer-events: none;cursor: none;" v-if="info.isbuyVip == '1'">{{ '等级不足' }}</view>
            <view class="bottom-btn" v-else @click="show = true">{{ Number(info._price) == 0 ? '立即兑换' : '立即购买' }}</view>
        </view>
    </vc-container>

    <!-- sku弹窗 -->
    <up-popup :show="show" round="32rpx" mode="bottom" bgColor="white" :closable="false" @close="show = false">
        <view class="pop">
            <view class="pop-title">商品参数</view>
            <view class="pop-spu">
                <view>
                    <image :src="minioBaseUrl + info.listPicUrl" mode="aspectFill"/>
                </view>
                <view class="pop-spu_content">
                    <view style="display: flex;align-items: center;flex-wrap: wrap;">
                        <template v-if="bridgeSdk.checkIsEmpty(nowSku)">
                            <view class="point">
                                <text v-if="nowSku.price > 0">
                                    <text style="font-size: 24rpx;">¥</text>{{ (Number(info._price || 0) - Number(info.subPrice || 0)).toFixed(2) }}
                                </text>
                                <text v-if="nowSku.exchangePoints > 0 && nowSku.price > 0"> + </text>
                                <text v-if="nowSku.exchangePoints > 0">
                                    {{ nowSku.exchangePoints }}<text style="font-size: 24rpx;">会员分</text>
                                </text>
                            </view>
                            <view class="price">
                                原价：¥{{ Number(Number(nowSku.originalPrice||'').toFixed(2)) }}
                            </view>
                        </template>
                        <template v-else>
                            <view class="point">
                                <text v-if="info._price > 0">
                                    <text style="font-size: 24rpx;">¥</text>{{ (Number(info._price || 0) - Number(info.subPrice || 0)).toFixed(2) }}
                                </text>
                                <text v-if="info._point > 0 && info._price > 0"> + </text>
                                <text v-if="info._point > 0">
                                    {{ Number(info._point) }}<text style="font-size: 24rpx;">会员分</text>
                                </text>
                            </view>
                            <view class="price">
                                原价：¥{{Number( Number(info._originalPrice||'').toFixed(2)) }}
                            </view>
                        </template>
                    </view>
                    <view style="font-size: 24rpx;color: #666;margin-top: 14rpx;line-height: 33rpx;">
                        已选择：{{ nowSku.skuName||'' }}
                    </view>
                </view>
            </view>

            <view class="pop-sku">
                <view class="pop-sku_title">规格</view>
                <view class="pop-sku_list">
                    <view v-for="(item, index) in skuList" :key="index" 
                        :class="['item', nowSku.skuId == item.skuId ? 'active' : '']" @click="doChoose(item)">
                        {{ item.skuName }}
                    </view>
                </view>
            </view>

            <view class="pop-step">
                <view class="pop-step_title">数量</view>

                <view class="numberstep">
                    <view @click="doMinus">
                        <up-icon name="minus" size="20rpx"></up-icon>
                    </view>
                    <input v-model="num" type="number" @blur="inputBlur"/>
                    <view @click="doPlus">
                        <up-icon name="plus" size="20rpx"></up-icon>
                    </view>
                </view>
            </view>

            <view v-if="bridgeSdk.checkIsEmpty(nowSku)" :class="['pop-btn', Number(nowSku.stockQuantity) == 0 ? 'disabled' : '']" @click="doPay">
                {{ Number(nowSku.stockQuantity || '0') > 0 ? (Number(nowSku.price || '0') > 0 ? '立即购买' : '立即兑换') : '暂无库存'}}
            </view>
            <view v-else :class="['pop-btn']" @click="doPay">
                {{ Number(info._price) == 0 ? '立即兑换' : '立即购买' }}
            </view>
        </view>
    </up-popup>
</template>

<script>
    import { minus, plus } from '@/utils/decimal'
    import { usePointsStore } from "@/store/index"
    import { toIntelligentService } from '@/utils/static.jump.ts'
    import {
        productDetails,// 商品详情
        productOrderDetails, //商品预下单
        getProductSpuSetail,//购买须知
        getDataDicList,
        queryBuyCount
    } from '../api/index'
    import Notice from './components/notice.vue'
    export default {
        name: 'productDetail',
        components: {
            Notice
        },
        data() {
            return {
                toIntelligentService,
                // toFixed,
                spuId: '',// 商品SPUID
                info: {},// 商品信息
                skuList: [],// SKU信息
                picList: [],// 商品banner图列表
                picListCurrent: 0,

                show: false,// 是否显示
                isRebuy: false,// 是否再来一单进入
                nowSku: {},// 当前选中的SKU信息
                num: 1,// 购买数量
                numMax: 99,// 最大数量
                userInfo: {},
                tagStyle: {
                    img: 'display: block;'
                },
                detailImgList: [],
                detailList: [],
                introType:'',
                categoryInfo:{},//
                contentCategories:[],//
                descriptionCategories:[],//
                imageList:[],//
                remark:'',//备注
                otherRules:[],//其他规则
                otherRulesList:[],//其他规则列表
                userId:''
            }
        },
        onLoad(options){
            this.spuId = options.spuId
            this.isRebuy = options.rebuy == '1'
            this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            this.getInfo().then(_=>{
                if(this.isRebuy) {
                    if(options.skuId) {
                        this.nowSku = this.skuList.find(item => item.skuId == options.skuId)
                    }
                    console.log(this.nowSku,'this.nowSku')
                    let sku = this.skuList.find(item => item.skuId == options.skuId)
                    // 再次购买的sku已下架
                    if(!sku) {
                        this.bridgeSdk.showToast({
                            title: `部分商品不可购买：${this.info.spuName + '-' + sku.skuName}（已下架）`,
                            duration: 3000
                        })
                        // this.nowSku = {}
                        this.show = true
                    }
                    // 再次购买的sku库存不足 && sku数量大于1
                    else if(Number(sku.stockQuantity) <= 0 && this.skuList.length > 1) {
                        this.bridgeSdk.showToast({
                            title: `部分商品不可购买：${this.info.spuName + '-' + sku.skuName}（库存不足）`,
                            duration: 3000
                        })
                        // this.nowSku = {}
                        this.show = true
                    } 
                    // 再次购买的sku库存不足 && sku数量为1
                    else if(Number(sku.stockQuantity) <= 0 && this.skuList.length == 1) {
                        this.bridgeSdk.showToast({
                            title: `商品不可购买：${this.info.spuName + '-' + sku.skuName}（库存不足）`,
                            duration: 3000
                        })
                        // this.nowSku = {}
                        this.show = true
                    }
                    else {
                        this.show = true
                    }
                }
                
            }).catch(err => {
                this.bridgeSdk.showConfirm({
                    showCancel: true,
                    content: err.code == '0059' ? `商品已下架，可选购其他相似商品` : `${err.message}，可选购其他商品`,
                    cancelText: '我再想想',
                    confirmText: '去选购',
                    cancelCallback: (res) => {
                        this.bridgeSdk.navigateBackTo({
                            delta: 1
                        })
                    },
                    confirmCallback: (res) => {
                        this.bridgeSdk.jumpPage({
                            url: '/package-intergral-mall/index/index',
                            openType: 'redirectTo'
                        })
                    }
                })
            })
        },
        onShow() {
            this.userId = this.bridgeSdk.getUserInfo()?.userInfo?.userId || "";
            // 解决安卓机从智能客服回退时出现app头问题
            this.bridgeSdk.hi.setNavigationBarTitle({
                showNavBar: '0'
            })
            this.bridgeSdk.hi.setShowStatusBar({
                showStatusBar: '0'
            })
        },
        methods: {
           async getDicList(){
                 await getDataDicList({
                    code: "OTHER_RULES",
                }).then((res) => {
                    this.otherRulesList = res.filter(item => this.otherRules.includes(item.optCode));
                    console.log(this.otherRulesList,'this.otherRulesList',this.otherRules,'this.otherRules');
                });
            },
            
            // 获取商品信息
            async getInfo() {
                 //大连海创嗨创生活杯匹克球报名参赛项目
               
                let res = await productDetails({
                    spuId: this.spuId
                })
                let resBy = await getProductSpuSetail({
                    spuId: this.spuId
                })
                if(resBy){
                    console.warn(resBy)
                    this.detailList = { ...resBy }
                    this.introType = resBy.introType
                    if(resBy.categoryInfo){
                        let dataParse= JSON.parse(resBy.categoryInfo)
                        this.contentCategories = dataParse.contentCategories || []
                        this.descriptionCategories = dataParse.descriptionCategories || []
                        this.imageList = dataParse.productInfoImages || []
                        this.remark = dataParse.remark || ''
                        this.otherRules = typeof resBy.otherRules === 'string' ? resBy.otherRules.split(',') : (resBy.otherRules ? [resBy.otherRules.toString()] : [])
                        this.getDicList()
                        console.log(this.otherRules,'this.otherRules', this.remark,dataParse,this.imageList,'this.imageList',this.contentCategories,this.descriptionCategories);
                    }
                    
                }
               
                
                this.info = {...res}
                console.log(this.info,"info.");
                this.skuList = res.keySpuAll.sort((a,b) => Number(a.sortOrder) - Number(b.sortOrder))
                this.detailImgList = this.extractImageUrlsFromRichText(res.details)
                // 只有一个商品规格情况
                if(res.keySpuAll.length == 1) {
                    this.info._point = this.skuList[0].exchangePoints
                    this.info._price = this.skuList[0].price
                    this.info._originalPrice = this.skuList[0].originalPrice
                } 
                // 多个商品规格情况
                else {
                    let list = this.skuList
                    this.info._point = list[0].exchangePoints
                    this.info._price = res.keySpuAll[0].price
                    this.info._originalPrice = list[0].originalPrice
                }
                let imgList = []
                res.keySpuAll.forEach(e => {
                    imgList = [...imgList, ...e.mediaAll.map(e => e.mediaUrl)]
                })
                this.picList = [
                    // this.minioBaseUrl + res.listPicUrl,
                    ...imgList.map(e => this.minioBaseUrl + e)
                ]
                // 默认第1个sku
                this.nowSku = this.skuList[0]
                return;
            },
            checkAttr() {
                if(this.info.isbuyVip == '1') {
                    this.bridgeSdk.showToast({
                        title: '会员等级不足不支持购买'
                    })
                    return
                }
                this.show = true
            },
            // 选择规格
            doChoose(e) {
                console.log(e)
                if(this.bridgeSdk.checkIsEmpty(this.nowSku)) {
                    if(this.nowSku.skuId == e.skuId) {
                        this.nowSku = {}
                        return
                    }
                    this.nowSku = e
                    return
                }
                this.nowSku = e
            },
            // 减
            doMinus() {
                if (this.num <= 1) {
                    uni.showToast({
                        title: '购买数量不能再减少了',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.num = minus(this.num, 1)
                
            },
            // 加
            doPlus() {
                if (this.num >= this.numMax) {
                    uni.showToast({
                        title: `最多可选${this.numMax}${this.info.isVirtualProduct == '1' ? '张' : '件'}`,
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                this.num = plus(this.num, 1)
                
            },
            // 输入框失去焦点
            inputBlur(info, index) {
                if(!this.num || this.num < 1) this.num = 1;
                if(this.num > this.numMax) this.num = this.numMax;
                this.num = Math.floor(this.num).toString()
            },
            // 立即兑换/立即购买
           async doPay() {
                this.getInfo().then(_=>{
                if(this.isRebuy) {
                    if(options.skuId) {
                        this.nowSku = this.skuList.find(item => item.skuId == options.skuId)
                    }
                    let sku = this.skuList.find(item => item.skuId == options.skuId)
                    // 再次购买的sku已下架
                    if(!sku) {
                        this.bridgeSdk.showToast({
                            title: `部分商品不可购买：${this.info.spuName + '-' + sku.skuName}（已下架）`,
                            duration: 3000
                        })
                        // this.nowSku = {}
                        this.show = true
                    }
                    // 再次购买的sku库存不足 && sku数量大于1
                    else if(Number(sku.stockQuantity) <= 0 && this.skuList.length > 1) {
                        this.bridgeSdk.showToast({
                            title: `部分商品不可购买：${this.info.spuName + '-' + sku.skuName}（库存不足）`,
                            duration: 3000
                        })
                        // this.nowSku = {}
                        this.show = true
                    } 
                    // 再次购买的sku库存不足 && sku数量为1
                    else if(Number(sku.stockQuantity) <= 0 && this.skuList.length == 1) {
                        this.bridgeSdk.showToast({
                            title: `商品不可购买：${this.info.spuName + '-' + sku.skuName}（库存不足）`,
                            duration: 3000
                        })
                        // this.nowSku = {}
                        this.show = true
                    }
                    else {
                        this.show = true
                    }
                }
            }).catch(err => {
                this.bridgeSdk.showConfirm({
                    showCancel: true,
                    content: err.code == '0059' ? `商品已下架，可选购其他相似商品` : `${err.message}，可选购其他商品`,
                    cancelText: '我再想想',
                    confirmText: '去选购',
                    cancelCallback: (res) => {
                        this.bridgeSdk.navigateBackTo({
                            delta: 1
                        })
                    },
                    confirmCallback: (res) => {
                        this.bridgeSdk.jumpPage({
                            url: '/package-intergral-mall/index/index',
                            openType: 'redirectTo'
                        })
                    }
                })
            })
                if(!this.bridgeSdk.checkIsEmpty(this.nowSku)) {
                    uni.showToast({
                        title: '请选择商品规格',
                        icon: 'none'
                    })
                    return;
                }
                let isBuy =  await this.queryBuyCount(this.num);//限购接口 userId: this.userId
              // 下单逻辑
                let skuList = [{
                    skuId: this.nowSku.skuId,
                    num: this.num
                }]
                productOrderDetails({
                    mallType : 'POINTS',
                    orderinfos: skuList
                }).then(res=>{
                    if(res.abnormalProductResqList && res.abnormalProductResqList.length > 0) {
                        this.bridgeSdk.showToast({
                            title: `商品${res.abnormalProductResqList.map(e => e.spuName + '-' + e.skuName + '不可购买，原因：' + e.abnormalProduct).join('、')}`,
                            duration: 3000
                        })
                    }
                    console.log(usePointsStore())
                    usePointsStore().setPointsOrderRes(res)
                    this.bridgeSdk.jumpPage({
                        url: '/package-intergral-mall/checkout/checkout?mctId=' + this.info.mctId
                    })
                })
            },
            
            queryBuyCount(buyNum){
                return new Promise((resolve,reject)=>{
                    queryBuyCount({
                        userId: this.userId,
                        mctId: this.info.mctId,
                        buyNum: buyNum,
                        spuId:this.spuId
                    },{
                        catchError: true
                    }).then(res=>{
                        resolve(res);
                        // this.$refs.modal.open({
                        //     title: '温馨提示',
                        //     content: res,
                        //     confirmText: '确定',
                        //     cancelText: '取消',
                        //     confirmCallback:async () => {
                        //         resolve(res);
                        //     }
                        // })
                        // this.bridgeSdk.showToast({
                        //     title: `11111111111`,
                        //     duration: 3000
                        // })
                        // this.bridgeSdk.showConfirm({
                        //     showCancel: true,
                        //     content: '11111',
                        //     cancelText: '我再想想',
                        //     confirmText: '去选购',
                        //     cancelCallback: (res) => {

                        //     },
                        //     confirmCallback: (res) => {

                        //     }
                        // })
                        
                    })
                    .catch(err=>{
                        this.num = 1;
                        console.log(err)
                        this.show = false;
                        if(err.code == '0009'){
                            this.$refs.modal.open({
                                title: '温馨提示',
                                content: err.message,
                                confirmText: '确定',
                                cancelText: '取消',
                                index: 999999999999,
                                confirmCallback:async () => {
                                    resolve(res);
                                }
                            })
                        }
                        // reject(err);
                    })
                });
            },
            // 跳转智能客服
            goKefu() {
                this.bridgeSdk.jumpPage({
                    // url: `/package-intel-service/intel-service/index?businessId=${this.info.mctId}&nickName=${this.userInfo.nickName}&shopUserId=${this.userInfo.userId}&isMine=false`,
                    url: `/package-intel-service/intel-service/index?businessId=444440000PM&nickName=${this.userInfo.isRealname == '1' ? this.userInfo.userName : this.userInfo.nickName}&shopUserId=${this.userInfo.userId}&isMine=false`,
                })
            },
            upSwiperChange(e){
                this.picListCurrent = e
            },
            preImage(){
                console.log(this.picListCurrent)
                uni.previewImage({
                    urls: this.picList,
                    current: this.picListCurrent
                })
            },
            extractImageUrlsFromRichText(richText) {
                // 定义正则表达式来匹配 <img> 标签中的 src 属性
                const regex = /<img[^>]+src="([^">]+)"/g;
                let matches = [];
                let match;

                // 使用正则表达式进行匹配
                while ((match = regex.exec(richText)) !== null) {
                    matches.push(match[1]);
                }

                return matches;
            },


// 调用函数并输出结果
// const imageUrls = extractImageUrlsFromRichText(richText);
// console.log(imageUrls);  // 输出: ["https://example.com/image1.jpg", "https://example.com/image2.png", "https://example.com/image3.gif"]

            previewImage(e){
                console.log(e)
                console.log(this.detailImgList)
                let index = this.detailImgList.findIndex(item => item == e.src)
                uni.previewImage({
                    urls: this.detailImgList,
                    current: index>-1?index:0
                })
            }
        },
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
.banner {
    width: 100%;
    height: 396rpx;
}
.info {
    padding: 25rpx 30rpx;
    background-color: white;
    border-radius: 30rpx;
    &-title {
        line-height: 45rpx;
        text-align: left;
        width: 100%;
        font-weight: 500;
        font-size: 32rpx;
        color: #000000;
        margin-top: 25rpx;
    }
    &-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #EDEDED;
        
        &--left {
            display: flex;
            align-items: flex-end;
            font-weight: 500;
            align-items: center;
            font-size: 28rpx;
            color: #000000;
            .point {
                color: #FF1F1F;
                font-size: 50rpx;
                font-weight: bold;
                
            }
            .price {
                color: #999999;
                font-size: 28rpx;
                font-weight: 400;
                margin-left: 14rpx;
                text-decoration: line-through;
            }
            
            /* 补贴样式 */
            .subsidy-container {

            }
            
            .subsidy-formula {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }
            
            
            .formula-symbol {
                font-size: 32rpx;
                color: #333333;
                margin: 0 10rpx;
                display: flex;
                align-items: center;
            }
            
            .formula-price {
                font-weight: 600;
                font-size: 24rpx;
                color: #999;
                line-height: 35rpx;
            }
            
            .original-price {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 8rpx;
                margin-left: 10rpx;
            }
            
            .original-price-label {
                font-weight: 400;
                font-size: 24rpx;
                color: #999;
                margin-bottom: 2rpx;
            }
            
            .subsidy-items {
                display: flex;
                align-items: center;
            }
            
            .subsidy-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 8rpx;
                padding: 8rpx 8rpx 0 8rpx;
            }
            
            .subsidy-icon {
                width: 116rpx;
                height: 36rpx;
                margin-bottom: 2rpx;
            }
            
            .subsidy-label {
                font-size: 28rpx;
                color: white;
                font-weight: 500;
                margin-bottom: 4rpx;
            }
            
            .subsidy-amount {
                font-weight: 600;
                font-size: 24rpx;
                color: #FF9500;
                margin-top: 2rpx;
            }
            

        }
        &--right {
            color: #999999;
            font-size: 24rpx;
            line-height: 33rpx;
            font-weight: bold;
        }
    }
    &-item {
        padding: 8rpx 0rpx;
        border-bottom: 2rpx solid #EDEDED;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        &:last-of-type {
            border-bottom: none;
        }
        &--left {
            width: 90rpx;
            color: #333;
            text-align: left;
            font-size: 28rpx;
            line-height: 40rpx;
            font-weight: 500;
        }
        &--middle {
            flex: 1;
            width: 60%;
            font-size: 24rpx;
            color: #666666;
            line-height: 33rpx;
        }
    }


}
.content {
    padding: 46rpx 30rpx calc(40rpx + 200rpx);
    background-color: white;
    margin-top: 20rpx;
    border-radius: 20rpx;
    &-img {
        width: 450rpx;
        margin: 0 auto 28rpx;
        display: block;
    }
}
.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    // justify-content: space-between;
    background-color: white;
    font-size: 32rpx;
    padding: 26rpx 32rpx calc(24rpx + constant(safe-area-inset-bottom)) 47rpx;
    padding: 26rpx 32rpx calc(24rpx + env(safe-area-inset-bottom)) 47rpx;
    background: #FFFFFF;
    box-shadow: 0rpx -2rpx 0rpx 0rpx #ECEDEE;
    image {
        width: 45rpx;
        height: 40rpx;
    }
    &-btn {
        // padding: 20rpx 190rpx;
        padding: 20rpx 0;
        width: 690rpx;
        text-align: center;
        background: linear-gradient( 90deg, #FE7D20 0%, #FF5210 100%);
        border-radius: 44rpx;
        font-weight: 500;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 42rpx;
    }
}

.pop {
    padding: 38rpx 28rpx 190rpx;
    position: relative;
    &-title {
        font-size: 32rpx;
        color: #333333;
        text-align: left;
        line-height: 45rpx;
        font-weight: bold;
        margin-bottom: 24rpx;
    }
    &-spu {
        display: flex;
        align-items: center;
        image {
            width: 140rpx;
            height: 140rpx;
        }
        &_content {
            flex: 1;
            margin-left: 24rpx;
            .point {
                color: #FF1F1F;
                font-size: 36rpx;
                font-weight: bold;
                margin-right: 16rpx;
            }
            .price {
                color: #999999;
                font-size: 26rpx;
                text-decoration: line-through;
            }
        }
    }
    &-sku {
        margin-top: 40rpx;
        &_title {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            text-align: left;
            margin-bottom: 24rpx;
        }
        &_list {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            gap: 15rpx;
            .item {
                padding: 11rpx 35rpx;
                border-radius: 27rpx;
                background-color: rgba(0, 188, 184, .05);
                color: #00BCB8;
                margin-bottom: 10rpx;
                font-size: 24rpx;
                line-height: 33rpx;
            }
            .active {
                background-color: #00BCB8;
                color: white;
            }
        }
    }
    &-step {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20rpx;
        &_title {
            font-size: 32rpx;
            font-weight: bold;
        }
        .numberstep{
            display: flex;
            align-items: center;
            height: 40rpx;
            border-radius: 20rpx;
            border: 2rpx solid #d0d0d0;
            input{
                width: 76rpx;
                border-left: 2rpx solid #d0d0d0;
                border-right: 2rpx solid #d0d0d0;
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
    &-btn {
        width: 666rpx;
        margin: 0 auto;
        bottom: 24rpx;
        left: 0;
        right: 0;
        position: absolute;
        height: 84rpx;
        line-height: 84rpx;
        color: white;
        font-size: 32rpx;
        border-radius: 42rpx;
        text-align: center;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
    }
    .disabled {
        pointer-events: none;
        cursor: none;
        opacity: .8;
    }
}

/* 商品介绍样式 */
.product-intro {
    margin-top: 20rpx;
    background-color: white;
    border-radius: 20rpx;
    padding: 30rpx;
    
    &-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #000000;
        margin-bottom: 24rpx;
        text-align: left;
    }
    
    .content-intro {
        .desc-category {
            margin-bottom: 18rpx;
            padding-left: 15rpx;
            &:last-child {
                margin-bottom: 0;
            }
            
            &-title {
                font-size: 28rpx;
                font-weight: 500;
                color: #000000;
                margin-bottom: 16rpx;
            }
        }
        .intro-tag {
            background: #F8F8F8;
            border-radius: 10rpx;
            padding: 12rpx 20rpx;
            display: block;
            font-weight: 500;
            font-size: 28rpx;
            color: #000000;
            margin-left: -30rpx;
            margin-bottom: 10rpx;
        }
        
        .content-category {
            margin-bottom: 32rpx;
            margin-left: 30rpx;
            &:last-child {
                margin-bottom: 0;
            }
            
            &-title {
                font-size: 28rpx;
                font-weight: 500;
                color: #333333;
                margin-bottom: 16rpx;
            }
        }
        
        .intro-item {
            display: flex;
            align-items: center;
            padding: 10rpx 0;
            margin-left: -5px;
            &-label {
                font-size: 26rpx;
                font-weight: 500;
                color: #000000;
                flex-shrink: 0;
                width: 150rpx;
            }
            
            &-value {
                font-size: 26rpx;
                font-weight: 400;
                color: #333333;
                flex-shrink: 1;
                text-align: left;
                margin-left: 30rpx;
            }
        }
    }
    
    .product-desc {
        .desc-category {
            margin-bottom: 18rpx;
            
            &:last-child {
                margin-bottom: 0;
            }
            
            &-title {
                font-size: 28rpx;
                font-weight: 500;
                color: #000000;
                margin-bottom: 16rpx;
            }
        }
        
        .desc-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12rpx 0 12rpx 22rpx;
            
            &-name {
                font-size: 26rpx;
                font-weight: 400;
                color: #333333;
                flex-shrink: 1;
            }
            
            &-info {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                 font-size: 26rpx;
                .desc-item-num {
                    font-size: 26rpx;
                    font-weight: 400;
                    color: #999;
                    margin-right: 24rpx;
                }
                
                .desc-item-price {
                    color: #333333;
                    font-weight: 400;
                    font-size: 26rpx;
                }
            }
        }
    }
    
    /* 商品图片样式 */
    .product-intro {
        &.images {
            padding: 0;
            
            .product-intro-title {
                padding: 30rpx 30rpx 0;
            }
            

            
            
            
            /* 图片容器样式 */
            .images-container {

                .image-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20rpx;
                    .product-image {
                        margin-bottom: 20rpx !important;
                        
                    }
                  
                }
            }
            
           
            
           
        }
    }
}

::v-deep .images-container {
    .image-item  {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20rpx;
        uni-image{
            width: 100% !important;
            max-height: 1000rpx !important;

        }
    }
} 

::v-deep .u-read-more {
    .u-read-more__content{
        text-indent: 0 !important; 
        .u-read-more__content__inner{
            .u-read-more__toggle{
        .u-read-more__toggle__text{
            background-color: #666666 !important; 
        }
        /* 查看更多按钮样式 */
            .u-read-more__toggle {
                background: rgba(0, 0, 0, 0.5);
                border-radius: 20rpx;
                padding: 10rpx 20rpx;
                margin-top: -40rpx;
                margin-bottom: 20rpx;
                text-align: center;
                color: white;
                position: relative;
                z-index: 10;
                width: 200rpx;
                margin-left: auto;
                margin-right: auto;
            }
            
            .u-read-more__toggle__text {
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24rpx;
            }
            
            .u-read-more__toggle__icon {
                margin-left: 5rpx;
            }
    } 
        }
    
    

}
}
</style>