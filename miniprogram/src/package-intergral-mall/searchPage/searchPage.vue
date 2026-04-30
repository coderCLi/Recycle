<!--
 * @Description: 积分商城-搜索页面
 * @Autor: TF
 * @Date: 2025-06-23 09:40:47
 * @LastEditors: TF
 * @LastEditTime: 2025-08-19 14:28:39
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="main">
        <!-- 全局组件： -->
        <view style="flex-shrink: 0; overflow: hidden;" id="navbar-search" :style="{paddingTop: `${safeTopDistance + 20}px`}">
            <vc-navbar :props-data="propsData" @navBack="navBack">
                <template #right>
                    <view style="display: flex; width: 650rpx; height: 80rpx">
                        <up-search
                            :placeholder="searchPlaceholder"
                            :actionStyle="{color: '#999'}"
                            v-model="search"
                            height="80rpx"
                            bgColor="#EFEEF3"
                            placeholderColor="#999999"
                            color="#333333"
                            @focus="onFocus = true"
                            @clear="onClear"
                            shape="square"
                            @search="doSearch"
                            @custom="doSearch">
                        </up-search>
                    </view>
                </template>
            </vc-navbar>
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
            <custom-waterfalls-flow v-show="list.length > 0" ref="waterfallsFlowRef" :value="list" imageKey="listPicUrl" :columnSpace="2.6" @loaded="waterfallsFlowLoaded" @imageClick="goDetail" @wapperClick="goDetail">
                <!-- #ifdef MP-WEIXIN -->
                <view class="item" v-for="(item,index) in list" :key="index" slot="slot{{index}}">
                    <view class="item-title muti-overflow">{{item.spuName}}</view>
                    <view class="item-text">
                        <view>已兑{{ item.salesVolume }}件</view>
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
                            <view>已兑{{ item.salesVolume }}件</view>
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
        </view>
        <view style="flex-shrink: 0">
            <vc-safe-bottom />
        </view>
    </view>
</template>

<script>
    import { mapState } from 'pinia'
    import { useBaseStore } from '@/store/index'
    import { toFixed } from '@/utils/decimal'
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
                toFixed,
                propsData: {
                    props: {
                        title: {
                            value: "搜索",
                        },
                        buttonType: {
                            value: "pop"
                        },
                        showMore: {
                            value: false
                        }
                    },
                },
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
            },
            ...mapState(useBaseStore, {
                safeTopDistance: 'safeTopDistance'
            }),
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
            // 返回行为
            navBack() {
                this.bridgeSdk.navigateBackTo({ delta: 1 });
            },
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
                            fieldNames: 'searchKeywords',
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
:deep(.u-border-bottom) {
    border: none;
}

#navbar-search{
    padding: 32rpx 0;
    background-color: white;
    ::v-deep .u-border-bottom {
        border-bottom: 0;
    }
}
::v-deep {
    .u-navbar {
        .u-navbar__content__right {
            padding: 0rpx;
            .u-search__content {
                width: 528rpx;
            }
        }
    }
    .u-search {
        .u-search__content__label {
            margin: 0rpx;
        }
        .u-search__content {
            padding: 0rpx 0rpx 0rpx 34rpx;
            box-sizing: border-box;
            position: relative;
        }
        .u-search__action--active {
            box-sizing: border-box;
            margin-left: 0rpx;
            text-align: left;
            padding-left: 26rpx;
            padding-right: 40rpx;
            width: 122rpx;
            font-weight: 400;
            font-size: 28rpx;
            color: #333333;
        }
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
.main {
    box-sizing: border-box;
    background: #f8f8f8;
    height: 100vh;
    display: flex;
    flex-direction: column;
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
    padding: 60rpx 40rpx 0;
    &-title{
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        display: flex;
        align-content: center;
        justify-content: space-between;
        margin-bottom: 20rpx;
    }
    &-list{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-left: -20rpx;
        .item {
            // padding: 10rpx 30rpx;
            // font-size: 24rpx;
            // color: #999;
            // background-color: #f8f8f8;
            // border-radius: 40rpx;
            // margin-right: 20rpx;
            // margin-bottom: 20rpx;

            box-sizing: border-box;
            max-width: 322rpx;
            height: 66rpx;
            padding: 16rpx 28rpx;
            text-align: center;
            background: #f7f8f9;
            border-radius: 12rpx;
            font-weight: 400;
            font-size: 24rpx;
            color: #999999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 20rpx;
            margin-left: 20rpx;
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
</style>