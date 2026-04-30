<!--
 * @Description: 积分商城-搜索页面
 * @Autor: TF
 * @Date: 2025-06-23 09:40:47
 * @LastEditors: TF
 * @LastEditTime: 2025-08-14 15:27:37
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="{props: {isFullScreen: {value: true}}}" style="background-color: #f8f8f8;">
        <view class="search">
            <up-search v-model.trim="search" @focus="onFocus = true" @clear="onClear" :placeholder="searchPlaceholder" shape="square" :showAction="false"></up-search>
            <view class="search-btn" @click="doSearch">
                搜索
            </view>
        </view>
        <view class="history" v-show="showList">
            <view class="history-title">
                <view>搜索历史</view>
                <up-icon v-if="history.length > 0" name="trash-fill" size="20" @click="clearHistory"/>
                <view v-else></view>
            </view>
            <view class="history-list">
                <view class="item" v-for="(item, index) in history" :key="index" @click="(search = item.keyword, doSearch())">{{ item.keyword }}</view>
            </view>
        </view>
        <view class="result" v-show="!showList">
            <template v-if="list.length == 0">
                <vc-empty/>
            </template>
            <custom-waterfalls-flow v-show="list.length > 0" ref="waterfallsFlowRef" :value="list" imageKey="listPicUrl" :columnSpace="2.5" @loaded="waterfallsFlowLoaded" @imageClick="goDetail" @wapperClick="goDetail">
                <!-- #ifdef MP-WEIXIN -->
                <view class="item" v-for="(item,index) in list" :key="index" slot="slot{{index}}">
                    <view class="item-title muti-overflow">{{item.spuName}}</view>
                    <view class="item-text">
                        <view>已兑{{ item.salesVolume }}件</view>
                        <view>¥{{ item.originalPriceMax }}</view>
                    </view>
                    <view class="item-points">
                        <view style="margin-right: 4rpx;">
                            <text v-if="item.price > 0">¥{{ item.price }}</text>
                            <text v-if="item.exchangePoints > 0 && item.price > 0"> + </text>
                            <text v-if="item.exchangePoints > 0">{{ item.exchangePoints }}积分</text>
                        </view>
                        <view class="item-points_tip" v-if="item.redemptionTiersName">
                            {{ item.redemptionTiersName }}以上
                        </view>
                    </view>
                    <view style="display: flex;justify-content: flex-end;">
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
                            <view>已兑{{ item.salesVolume }}件</view>
                            <view>¥{{ item.originalPriceMax }}</view>
                        </view>
                        <view class="item-points">
                            <view style="margin-right: 4rpx;">
                                <text v-if="item.price > 0">¥{{ item.price }}</text>
                                <text v-if="item.exchangePoints > 0 && item.price > 0"> + </text>
                                <text v-if="item.exchangePoints > 0">{{ item.exchangePoints }}积分</text>
                            </view>
                            <view class="item-points_tip" v-if="item.redemptionTiersName">
                                {{ item.redemptionTiersName }}以上
                            </view>
                        </view>
                        <view style="display: flex;justify-content: flex-end;">
                            <view class="item-btn" v-if="Number(item.price) > 0">购买</view>
                            <view class="item-btn" v-else>兑换</view>
                        </view>
                    </view>
                </template>
                <!-- #endif -->
            </custom-waterfalls-flow>
        </view>
    </vc-container>
</template>

<script>
    import { 
        searchProducts,// 搜索商品
        queryAllSearch,// 搜索历史
        clearSearch,// 删除搜索历史
    } from '../api/index'
    import customWaterfallsFlow from '@/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue'
    export default {
        name: 'searchPage',
        components: {
            customWaterfallsFlow
        },
        data() {
            return {
                page: 1,// 页码
                rows: 10,// 每页行数
                list: [],// 搜索结果
                waterfallLoaded: false,// 瀑布流加载完毕标识位
                total: 0,// 总数

                history: [],// 搜索历史
                onFocus: false,// 输入框聚焦
                searchPlaceholder: '请输入搜索内容',
                search: '',// 搜索项
                searchOld: '',// 搜索存储
                isLogin: false,// 是否登录

            }
        },
        computed: {
            // 是否展示列表
            showList() {
                return this.onFocus || !this.bridgeSdk.checkIsEmpty(this.search)
            }
        },
        onLoad(options) {
            let userInfo = this.bridgeSdk.getUserInfo()?.userInfo;
            console.log('用户信息：', userInfo)
            this.isLogin = userInfo?.isLogin == '1' || false
            if(options.keyword) {
                this.search = options.keyword
                this.searchOld = this.search
                this.searchPlaceholder = this.search
                this.getSearchList()
            }
        },
        onReachBottom() {
            console.log('触底了')
            if(this.total <= this.list.length || !this.waterfallLoaded) return
            this.page += 1
            this.getSearchList()
        },
        methods: {
            // 获取搜索记录
            getSearchRecord() {
                queryAllSearch({},{mask: false}).then(res=>{
                    this.history = res
                })
            },
            // 获取搜索结果
            getSearchList() {
                this.waterfallLoaded = false
                searchProducts({
                    page: this.page,
                    size: this.rows,
                    keyword: this.search,
                    searchFieldsList: [
                        {
                            fieldNames: 'spuName',
                            boost: '1'
                        },
                        {
                            fieldName: 'searchKeywords',
                            boost: '2'
                        }
                    ],// 搜索字段列表
                    ruleSortingList: [
                        {
                            sortBy: 'salesVolume',//根据销量降序
                            order: 'desc'
                        }
                    ],// 排序规则
                }).then(res=>{
                    let productList = [...this.list, ...res.data.map(e=>({
                        ...e,
                        listPicUrl: this.minioBaseUrl + e.listPicUrl
                    }))]
                    this.list = productList
                    // this.$refs.waterfallsFlowRef.refresh()
                    this.total = res.total
                    // 搜索后获取历史记录
                    this.getSearchRecord()
                })
            },
            // 瀑布流加载完毕
            waterfallsFlowLoaded(e) {
                this.waterfallLoaded = true
            },
            // 清空搜索历史
            clearHistory() {
                this.bridgeSdk.showConfirm({
                    title: '温馨提示',
                    content: '确定清空搜索记录？',
                    confirmCallback: (res) => {
                        clearSearch({}).then(res=>{
                            this.getSearchRecord()
                        })
                    },
                })
            },
            //搜索
            doSearch() {
                this.onFocus = false
                if(!this.bridgeSdk.checkIsEmpty(this.search)) {
                    this.search = this.searchOld
                }
                this.page = 1
                this.list = []
                this.$refs.waterfallsFlowRef.refresh()
                this.getSearchList()
            },
            // 清空
            onClear() {
                this.search = ''
            },
            // 商品详情
            goDetail(e) {
                console.log(e)
                this.bridgeSdk.jumpPage({
                    url: '/package-intergral-mall/productDetail/productDetail?spuId=' + e.spuId,
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.column-value-show) {
    border-radius: 20rpx !important;
}
:deep(.column-value .img) {
    margin: 20rpx;
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
.search{
    background-color: white;
    padding: 30rpx 20rpx;
    display: flex;
    align-items: center;
    &-btn {
        background-color: #FEDE2C;
        border-radius: 8rpx;
        padding: 10rpx 30rpx;
        font-size: 28rpx;
        color: #333;
        margin-left: 30rpx;
    }
}
.history{
    background-color: white;
    padding: 0 20rpx;
    &-title{
        font-size: 24rpx;
        color: #333;
        font-weight: bold;
        display: flex;
        align-content: center;
        justify-content: space-between;
    }
    &-list{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 20rpx;
        padding-bottom: 20rpx;
        .item {
            padding: 10rpx 30rpx;
            font-size: 24rpx;
            color: #999;
            background-color: #f8f8f8;
            border-radius: 40rpx;
            margin-right: 20rpx;
            margin-bottom: 20rpx;
        }
    }
}
.result {
    padding: 0 36rpx;
    margin-top: 36rpx;
    position: relative;
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
                justify-content: flex-start;
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
            }
        }
}
</style>