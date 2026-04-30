<!--
 * @Description: 积分商城-首页
 * @Autor: TF
 * @Date: 2025-06-24 11:29:02
 * @LastEditors: TF
 * @LastEditTime: 2025-09-18 03:43:36
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="propsData">
        <view :style="{overflow: filterShow || sortShow ? 'hidden' : '', height: filterShow || sortShow ?  `calc(100vh - ${navigationBarInfo.totalHeight}${navigationBarInfo.unit})` : 'auto'}">
            <view class="top">
                <view class="top-left">
                    <image :src="staticBaseUrl + '/hbdimage/package-intergral-mall/jifen.png'" mode="aspectFill"/>
                    <view v-if="isLogined">可用积分：{{ info.usePoints }} 分</view>
                    <view v-else>--未登录--</view>
                </view>
                <view v-if="isLogined" class="top-right" @click="doFresh">
                    <image :class="[freshing ? 'animate' : '']" :src="staticBaseUrl + '/hbdimage/package-intergral-mall/shuaxin.png'" mode="aspectFill"/>
                    <view>刷新积分</view>
                </view>
                <view v-else></view>
                <view v-if="isLogined" class="top-right" @click="jumpRecord">购买记录</view>
            </view>
            <view class="mctChangeBox" @click="showChangeMct">
                <view style="flex-shrink: 0;">所属商户：</view>
                {{ selectMctName }}
                <up-icon name="arrow-down" size="28rpx" color="#946C37" style="flex-shrink: 0;"></up-icon>
            </view>
            <up-picker :show="changeMctShow" :columns="mctColumns" keyName="name" valueName="mctId" @confirm="selectMctConfirm" @cancel="selectMctCancel"></up-picker>
            <view class="search">
                <up-search height="80rpx" v-model="search" @search="doSearch" placeholder="请输入商品名称进行搜索" shape="round" bgColor="white" :showAction="false" :clearabled="false"></up-search>
            </view>
            <view class="banner" v-if="bannerList.length > 0">
                <up-swiper radius="30rpx" :list="bannerList" @click="swiperJump" keyName="imageUrl" height="265rpx"></up-swiper>
            </view>
            <view class="products" id="products">
                <view class="products-select" id="select" :style="{background: bannerList.length > 0 ? 'linear-gradient(#FEE3AA 10%, #FCE8BF 65%)' : 'linear-gradient(#FEE3AA 1%, #FBEFD5 70%)'}">
                    <view style="display: flex;align-items: center;" @click="openPop('type')">
                        <view class="text-overflow" style="margin-right: 4rpx;max-width: 200rpx;">分类：{{ nowType.name }}</view>
                        <up-icon :name="filterShow ? 'arrow-up' : 'arrow-down'" size="12"/>
                    </view>
                    <view style="display: flex;align-items: center;margin-left: 50rpx;" @click="openPop('sort')">
                        <view class="text-overflow" style="margin-right: 4rpx;max-width: 200rpx;">排序：{{ nowSort.name }}</view>
                        <up-icon :name="sortShow ? 'arrow-up' : 'arrow-down'" size="12"/>
                    </view>
                </view>
                <view class="products-list" :style="{ background: bannerList.length > 0 ? `linear-gradient(#FCE8BF 1%, #f5f6f8 70%)` : `linear-gradient(#FBEFD5 1%, #f5f6f8 70%)`}">
                    <template v-if="productList.length > 0">
                        <custom-waterfalls-flow ref="waterfallsFlowRef" :value="productList" imageKey="listPicUrl" :columnSpace="2.6" @loaded="waterfallsFlowLoaded" @imageClick="goDetail" @wapperClick="goDetail">
                            <!-- #ifdef MP-WEIXIN -->
                            <view class="item" v-for="(item,index) in productList" :key="index" slot="slot{{index}}">
                                <view class="item-title muti-overflow">{{item.spuName}}</view>
                                <view class="item-text">
                                    <!-- <view v-if="Number(item.salesVolume) > 0">已兑 {{ getSalesPlus(item.salesVolume) }}</view> -->
                                    <view v-if="Number(item.salesVolume) > 0">已售{{ item.salesVolume }}件</view>
                                    <view v-else></view>
                                    <view>¥{{ toFixed(item.originalPrice || '0', 2) }}</view>
                                </view>
                                <view class="item-points">
                                    <view style="margin-right: 4rpx;">
                                        <text v-if="item.price > 0">¥{{ item.price }}</text>
                                        <text v-if="item.exchangePoints > 0 && item.price > 0"> + </text>
                                        <text v-if="item.exchangePoints > 0">{{ item.exchangePoints }}积分</text>
                                    </view>
                                    <view class="item-points_tip" style="margin-right: auto;" v-if="item.redemptionTiersName">
                                        {{ item.redemptionTiersName }}以上
                                    </view>
                                    <view class="item-btn" v-if="Number(item.price) > 0">购买</view>
                                    <view class="item-btn" v-else>兑换</view>
                                </view>
                            </view>
                            <!-- #endif -->
                            <!-- #ifndef MP-WEIXIN -->
                            <template v-slot:default="item">
                                <view class="item">
                                    <view class="item-title muti-overflow">{{item.spuName}}</view>
                                    <view class="item-text">
                                        <!-- <view v-if="Number(item.salesVolume) > 0">已兑 {{ getSalesPlus(item.salesVolume) }}</view> -->
                                        <view v-if="Number(item.salesVolume) > 0">已兑{{ item.salesVolume }}件</view>
                                        <view v-else></view>
                                        <view>¥{{ toFixed(item.originalPrice || '0', 2) }}</view>
                                    </view>
                                    <view class="item-points">
                                        <view style="margin-right: 4rpx;">
                                            <text v-if="item.price > 0">¥{{ item.price }}</text>
                                            <text v-if="item.exchangePoints > 0 && item.price > 0"> + </text>
                                            <text v-if="item.exchangePoints > 0">{{ item.exchangePoints }}积分</text>
                                        </view>
                                        <view class="item-points_tip" style="margin-right: auto;" v-if="item.redemptionTiersName">
                                            {{ item.redemptionTiersName }}以上
                                        </view>
                                        <view class="item-btn" v-if="Number(item.price) > 0">购买</view>
                                        <view class="item-btn" v-else>兑换</view>
                                    </view>
                                </view>
                            </template>
                            <!-- #endif -->
                        </custom-waterfalls-flow>
                    </template>
                    <vc-empty v-else :props-data="{props:{text: {value: '没有找到相关商品～'}}}"/>
                </view>
            </view>
        </view>
    </vc-container>

    <!-- 分类弹窗 -->
    <up-popup @touchmove.prevent :show="filterShow" :zIndex="3" :safeAreaInsetBottom="false" :overlayStyle="{
        top: `calc(${fixedTop + 'px'})`
    }" :customStyle="{
        top: `calc(${fixedTop + 'px'})`
    }" :duration="300" round="20rpx" @close="filterShow = false" mode="top">
        <view class="pop">
            <view class="pop-left">
                <scroll-view scroll-y>
                    <view 
                        :class="['item', nowFilterType.parentCategoryId == item.categoryId || nowFilterType.categoryId == item.categoryId ? 'active' : '']" 
                        v-for="(item, index) in firstCategoryList" :key="index" 
                        @click="chooseFirstCategory(item)">
                        {{ item.name }}
                    </view>
                </scroll-view>
            </view>
            <view class="pop-right">
                <scroll-view scroll-y>
                    <view 
                        :class="['item', nowFilterType.categoryId == item.categoryId ? 'active' : '']" 
                        v-for="(item, index) in secondCategoryList" :key="index"
                        @click="chooseSecondCategory(item)">
                        {{ item.name }}
                    </view>
                </scroll-view>
            </view>

            <view class="pop-btns">
                <view class="pop-btns_left" @click="doReset('type')">
                    重置
                </view>
                <view class="pop-btns_right" @click="doFilter('type')"> 
                    确定
                </view>
            </view>
        </view>
    </up-popup>

    <!-- 排序弹窗 -->
    <up-popup @touchmove.prevent :show="sortShow" :zIndex="3" :safeAreaInsetBottom="false" :overlayStyle="{
        top: `calc(${fixedTop + 'px'})`
    }" :customStyle="{
        top: `calc(${fixedTop + 'px'})`
    }" :duration="300" round="20rpx" @close="sortShow = false" mode="top">
        <view class="pop">
            <view class="pop-block">
                <view :class="['item', item.key == nowFilterSort.key ? 'active' : '']" v-for="(item, index) in sortList" :key="index" @click="chooseSort(item)">
                    {{ item.name }}
                </view>
            </view>
            <view class="pop-btns">
                <view class="pop-btns_left" @click="doReset('sort')">
                    重置
                </view>
                <view class="pop-btns_right" @click="doFilter('sort')"> 
                    确定
                </view>
            </view>
        </view>
    </up-popup>
</template>

<script>
    import { mapState } from 'pinia';
    import { useBaseStore, useUserStore } from "@/store/index.ts";
    import { toFixed } from '@/utils/decimal'
    import customWaterfallsFlow from '@/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue'
    import { 
        searchProducts,// 商品列表
        getBannerAll,// 轮播图
        appgetUserFubaoPointsVip,// 获取个人积分数
        getPointMallCategories,// 获取分类信息
        getMctList, // 获取商户列表
    } from '../api/index'
    const getSalesPlus = (num) => {
        let plusNum = Number(Number(num) / 10).toFixed(0)
        return plusNum + '0+'
    }
    export default {
        name: 'index',
        components: {
            customWaterfallsFlow

        },
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
            ...mapState(useUserStore, {
                isLogined: "isLogined",
            }),
        },  
        data() {
            return {
                getSalesPlus,
                toFixed,
                propsData: {
                    props: {
                        barBgColor: {
                            value: '#FEE3AA'
                        },
                        bgColor: {
                            value: 'transparent'
                        },
                        isFullScreen: {
                            value: false
                        }
                    }
                },
                fixedTop: 0,// 吸顶灯距离
                info: {
                    usePoints: 0
                },// 首页信息
                freshing: false,// 刷新中
                bannerList: [],// banner列表
                categoryList: [
                    {
                        categoryId: '',
                        name: "全部",
                    }
                ],// 分类列表
                firstCategoryList: [],// 一级分类列表
                secondCategoryList: [],// 二级分类列表
                nowType: {
                    name: '全部',
                    categoryId: '',
                    parentCategoryId: '',
                },// 当前分类
                nowSort: {
                    key: 'default',
                    name: '默认'
                },// 当前排序方式
                sortList: [
                    {
                        name: '默认',
                        key: 'default'
                    },
                    {
                        name: '热卖',
                        key: 'hot'
                    }
                ],// 排序方式

                page: 1,// 分页
                rows: 10,// 分页
                total: 0,// 总数
                productList: [],// 商品列表
                waterfallLoaded: false,// 瀑布流加载完毕标识位
                search: '',

                filterShow: false,// 筛选弹窗
                sortShow: false,// 排序弹窗
                nowFilterType: {},// 当前筛选类型
                nowFilterSort: {},// 当前筛选排序
                
                // 商户筛选
                changeMctShow: false,
                selectMctName: "全部商户",
                selectMctId: "",
                mctColumns: [[{mctId: "", name: "全部商户"}]],
            }
        },
        watch: {
            isLogined: {
                deep: true,
                immidiate: true,
                handler(val){
                    val && this.getPoints()
                }
            },
        },
        onLoad(options) {
            console.log("/package-intergral-mall/index/index", options)
            this.selectMctId = options.id
            this.getMctColumns()
        },
        onReady(options) {
            // 获取轮播图
            this.getBannerList()
            // 获取商品列表
            this.getProductList()
            // 获取商品分类
            this.getCategoryList()

            console.log(this.navigationBarInfo)
        },
        onShow() {
            this.isLogined && this.getPoints()
        },
        onHide() {
            this.search = ''
        },
        onPullDownRefresh() {
            this.page = 1
            this.productList = []
            this.getProductList()
            setTimeout(() => {
                uni.stopPullDownRefresh()
            }, 500)
        },
        onReachBottom() {
            console.log('触底了')
            if(this.total <= this.productList.length || !this.waterfallLoaded) return
            this.page += 1
            this.getProductList()
        },
        methods: {
            // 获取积分数
            async getPoints() {
                let res = await appgetUserFubaoPointsVip({},{mask: false})
                this.info.usePoints = res.points.availablePoints
                return
            },
            // 刷新积分
            doFresh() {
                this.freshing = true
                this.getPoints({}).then(_=>{
                    this.freshing = false
                    this.info.usePoints = res.points.availablePoints
                    this.bridgeSdk.showToast({
                        title: '积分已刷新'
                    })
                }).catch(_=>{
                    this.freshing = false
                })
            },
            // 获取轮播图信息
            getBannerList() {
                getBannerAll({}).then(res=>{
                    console.log(res)
                    this.bannerList = res.map(e=>{
                        return {
                            ...e,
                            imageUrl: this.minioBaseUrl + e.imageUrl
                        }
                    })
                    // 等待轮播图加载完成获取吸顶距离
                    this.$nextTick(_=>{
                        const query = uni.createSelectorQuery().in(this);
                        query.select('#products').boundingClientRect((data) => {
                            this.fixedTop = data.top
                            console.log('吸顶距离：', this.fixedTop)
                        }).select('#select').boundingClientRect((data) => {
                            this.fixedTop += data.height
                            console.log('吸顶距离：', this.fixedTop)
                        }).exec()
                    })
                })
            },
            // 获取分类信息
            getCategoryList() {
                getPointMallCategories({}).then(res => {
                    this.categoryList = [
                        {
                            name: '全部',
                            parentName: '全部',
                            categoryId: '',
                            categoryParentId: '',
                        },
                        ...res.map(e => ({
                            ...e,
                            children: [
                                {
                                    name: '全部',
                                    parentName: '全部',
                                    categoryId: e.categoryId,
                                    categoryParentId: e.categoryId,
                                },
                                ...e.children
                            ]
                        }))
                    ]
                })
            },
            // 搜索
            doSearch(e) {
                if(!this.bridgeSdk.checkIsEmpty(e)) return
                this.bridgeSdk.jumpPage({
                    url: '/package-intergral-mall/searchPage/searchPage?keyword=' + e
                })
            },
            // 打开弹窗
            openPop(type) {
                if(type == 'type') {
                    this.filterShow = !this.filterShow
                    this.sortShow = false
                    this.firstCategoryList = [...this.categoryList]
                    this.nowFilterType = {
                        ...this.nowType
                    }
                    this.secondCategoryList = this.categoryList.find(e=>e.categoryId == this.nowFilterType.parentCategoryId).children
                } else {
                    this.sortShow = !this.sortShow
                    this.filterShow = false
                    this.nowFilterSort = {...this.nowSort}

                }
            },
            // 选择分类
            chooseFirstCategory(e) {
                console.log(e);
                this.nowFilterType = {
                    name: e.name,
                    parentCategoryName: e.name,
                    categoryId: e.categoryId,
                    parentCategoryId: e.categoryId
                }
                console.log(this.nowFilterType);
                this.secondCategoryList = this.categoryList.find(e=>e.categoryId == this.nowFilterType.parentCategoryId).children
            },
            // 选择二级分类
            chooseSecondCategory(e) {
                this.nowFilterType = {
                    ...this.nowFilterType,
                    name: e.name,
                    categoryId: e.categoryId
                }
            },
            // 排序选择
            chooseSort(e) {
                this.nowFilterSort = {...e}
            },
            // 重置
            doReset(type) {
                if(type == 'type'){
                    this.nowFilterType = {
                        parentCategoryName: '全部',
                        name: '全部',
                        categoryId: '',
                        parentCategoryId: ''
                    }
                    this.secondCategoryList = []
                }
                else
                    this.nowFilterSort = {
                        name: '默认',
                        key: 'default'
                    }
            },
            // 确定
            doFilter(type) {
                if(type == 'type') {
                    if(this.nowFilterType.categoryId == this.nowFilterType.parentCategoryId) {
                        this.nowFilterType.name = this.nowFilterType.parentCategoryName
                    }
                    this.nowType = {...this.nowFilterType}
                    this.filterShow = false
                } else {
                    this.nowSort = {...this.nowFilterSort}
                    this.sortShow = false
                }
                this.page = 1
                this.productList = []
                this.getProductList()
            },
            // 获取商品列表
            getProductList() {
                this.waterfallLoaded = false
                if(this.page==1){
                    this.productList = []
                    this.total = 0
                }
                let data = {}
                if( this.selectMctId){
                    data = {
                        mctId: this.selectMctId
                    }
                }
                searchProducts({
                    page: this.page,
                    size: this.rows,
                    data: data,
                    // keyword: this.nowType.categoryId,
                    // searchFieldsList: [
                    //     {
                    //         fieldNames: 'categoryId',
                    //         boost: '1'
                    //     },
                    // ],
                    includeAll: [
                        {
                            cludekName: 'category',
                            cludeValues: this.nowType.parentCategoryId ? [this.nowType.parentCategoryId] : []
                        },
                        {
                            cludekName: 'categoryId',
                            cludeValues: this.nowType.categoryId && (this.nowType.parentCategoryId != this.nowType.categoryId) ? [this.nowType.categoryId] : []
                        }
                    ],
                    ruleSortingList:this.nowSort.key == 'hot' ? [
                        {
                            sortBy: 'salesVolume',//根据销量降序
                            order: 'desc'
                        }
                    ] : [
                        {
                            sortBy: 'sortOrder',//根据序号升序
                            order: 'asc'
                        }
                        //{
                        //    sortBy: 'salesVolume',//根据销量降序
                        //    order: 'desc'
                        //},
                        //{
                        //    sortBy: 'price',// 根据所需金额最大值
                        //    order: 'desc'
                        //},
                        //{
                        //    sortBy: 'exchangePoints',// 根据所需积分最大值
                        //    order: 'desc'
                        //},
                        //{
                        //    sortBy: 'originalPrice',// 根据原价最大值
                        //    order: 'desc'
                        //}
                    ],// 排序规则
                },{
                    mask: false
                }).then(res=>{
                    let productList = [...this.productList, ...res.data.map(e=>({
                        ...e,
                        listPicUrl: this.minioBaseUrl + e.listPicUrl
                    }))]
                    this.productList = productList
                    // this.$refs.waterfallsFlowRef && this.$refs.waterfallsFlowRef.refresh()
                    this.total = res.total
                })
            },
            // 瀑布流加载完毕
            waterfallsFlowLoaded(e) {
                this.waterfallLoaded = true
            },
            // Banner跳转
            async swiperJump(e) {
                const item = this.bannerList[e]
                // 图片形式
                if(item.mediaType == '0') return
                // 跳转形式
                let plat = await this.bridgeSdk.getEnvironment()
                let url = ''
                switch(plat) {
                    case 'miniProgram':
                        url = item.application.miniUrl
                        break;
                    case 'web':
                        url = item.application.androidUrl || item.application.iosUrl
                        break;
                    case 'ios':
                        url = item.application.iosUrl
                        break;
                    case 'andriod':
                        url = item.application.androidUrl
                        break;
                    default:
                        url = item.application.androidUrl
                        break;
                }
                this.bridgeSdk.toServicePage(url, item.application)
            },
            // 跳转商品详情
            goDetail(e) {
                this.bridgeSdk.jumpPage({
                    title: `${e.title}`,
                    url: '/package-intergral-mall/productDetail/productDetail?spuId=' + e.spuId,
                    needLogin: true,
                })
            },
            // 拉起登录
            doLogin() {
                this.bridgeSdk.toLogin()
            },
            // 跳转兑换记录
            jumpRecord(){
                this.bridgeSdk.jumpPage({
                    url: "/package-intergral-mall/order/orderList"
                })
            },
            getMctColumns(){
                if(this.isLogined){
                    getMctList({
                        page: 1,
                        rows: 1000,
                        status: '0',
                    }).then(res=>{
                        console.log(res)
                        this.mctColumns = [[{mctId: "", name: "全部商户"}]];
                        if(res.total>0){
                            this.mctColumns = [this.mctColumns[0].concat(res.list)];
                            console.log(this.mctColumns);
                            if(this.selectMctId){
                                let selectIndex = res.list.findIndex(el=> el.mctId == this.selectMctId);
                                if(selectIndex>-1){
                                    this.selectMctName = res.list[selectIndex].name;
                                }else{
                                    this.selectMctId = "";
                                    this.selectMctName = "全部商户";
                                    this.getProductList();
                                }
                            }
                        }
                    })
                }
            },
            showChangeMct(){
                if(this.mctColumns&&this.mctColumns.length){
                    this.changeMctShow = true;
                }
            },
            selectMctConfirm(e){
                console.log("selectMctConfirm",e);
                this.selectMctId = e.value[0].mctId;
                this.selectMctName = e.value[0].name;
                this.page = 1;
                this.changeMctShow = false;
                this.getProductList()
            },
            selectMctCancel(){
                this.changeMctShow = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
@keyframes rotate {
    from{ 
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
:deep(.page-header) {
    background-color: #FEE3AA;
}
:deep(.page-content) {
    // background: linear-gradient(#FEE3AA 10%, #f8f8f8 65%);
}
:deep(.container.full-screen) {
    min-height: 100vh;
    height: auto;
}
:deep(.column-value-show) {
    border-radius: 20rpx !important;
}
:deep(.column-value .img) {
    // margin: 20rpx;
    width: 280rpx;
    border-radius: 20rpx;
    height: 280rpx;
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
.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36rpx;
    padding-top: 39rpx;
    z-index: 10;
    position: relative;
    background-color: #FEE3AA;
    &-left {
        display: flex;
        align-items: center;
        color: #946C37;
        font-size: 27rpx;
        image {
            width: 32rpx;
            height: 32rpx;
            margin-right: 12rpx;
        }
    }
    &-right {
        display: flex;
        align-items: center;
        color: #946C37;
        font-size: 27rpx;
        .animate {
            animation: rotate 1s linear infinite;
        }
        image {
            width: 30rpx;
            height: 30rpx;
            margin-right: 16rpx;
        }
    }
}
.mctChangeBox{
    display: flex;
    align-items: center;
    // justify-content: flex-end;
    padding: 0 36rpx;
    padding-top: 20rpx;
    z-index: 10;
    position: relative;
    background-color: #FEE3AA;
    color: #946C37;
    font-size: 27rpx;

}
.search {
    padding: 18rpx 36rpx 24rpx;
    z-index: 10;
    position: relative;
    background-color: #FEE3AA;
}
.banner{
    padding: 0 36rpx;
    z-index: 10;
    position: relative;
    background-color: #FEE3AA;
}
.products {
    &-select {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #333;
        z-index: 10;
        position: relative;
        // background-color: #FEE3AA;
        // background: linear-gradient(#FEE3AA 1%, #FBEFD5 70%);
        padding: 36rpx;
    }
    &-list {
        padding: 1rpx 36rpx 0;
        position: relative;
        background:linear-gradient(#FBEFD5 10%, #f8f8f8 75%) ;
        .item {
            margin: 9rpx 20rpx 20rpx;
            font-size: 28rpx;
            &-title {
                color: #333;
                font-size: 28rpx;
                font-weight: bold;
                width: 100%;
            }
            &-text {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 24rpx;
                color: #999999;
                margin-top: 8rpx;
            }
            &-points{
                color: #946C37;
                font-size: 28rpx;
                font-weight: bold;
                margin-top: 11rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                &_tip {
                    border-radius: 6rpx;
                    border: 2rpx solid #946C37;
                    font-size: 20rpx;
                    color: #946C37;
                    line-height: 28rpx;
                    padding: 3rpx 7rpx;
                    max-width: 120rpx;
                }
            }
            &-btn {
                background-color: #FFF5E9;
                color: #946C37;
                font-size: 28rpx;
                line-height: 40rpx;
                padding: 6rpx 30rpx;
                margin-top: 7rpx;
                border-radius: 27rpx;
                font-weight: bold;
                margin-left: auto;
            }
        }
    }
}

.pop {
    display: flex;
    position: relative;
    max-height: 680rpx;
    &-left {
        width: 35%;
        background-color: white;
        scroll-view {
            height: 600rpx;
            .item {
                padding: 0 30rpx;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 26rpx;
            }
            .active {
                background-color: #f8f8f8;
            }
        }
    }
    &-right {
        flex: 1;
        background-color: #f8f8f8;
        scroll-view {
            height: 600rpx;
            .item {
                padding: 0 30rpx;
                height: 80rpx;
                font-size: 26rpx;
                line-height: 80rpx;
            }
            .active {
                color: #00BCB8;
            }
        }
    }
    &-block {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 20rpx;
        height: 120rpx;
        padding-bottom: 80rpx;
        padding-left: 20rpx;
        .item {
            padding: 10rpx 30rpx;
            border: 1rpx solid #d0d0d0;
            background: white;
            font-size: 26rpx;
            color: #333;
            border-radius: 5rpx;
        }
        .active {
            color: #00BCB8;
            background: rgba(0, 188, 184, 0.1);
            border: 1rpx solid #00BCB8;
        }
    }
    &-btns{
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80rpx;
        line-height: 80rpx;
        &_left {
            flex: 1;
            background-color: white;
            font-size: 28rpx;
            text-align: center;
            border-top: 1rpx solid #d0d0d0;
        }
        &_right {
            flex: 1;
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
            font-size: 28rpx;
            text-align: center;
            color: white;
        }
    }
}
</style>