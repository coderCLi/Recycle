<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main">
        <view style="position: relative;width:100%;height: 130rpx;">
            <view class="search-box" style="position: fixed;z-index: 1;width: 750rpx;box-sizing: border-box; ">
                <u-search  maxlength="20" height="40" placeholder="请输入搜索关键词" bgColor="#fff" borderColor="#FF6634" placeholderColor="#999" :showAction="false"
                  @search="doSearch" searchIconSize="36" @clear="inputBlur" @blur="inputBlur" v-model="search" :clearabled="true" shape="round"></u-search>
                <view @click="doSearch" class="search-right">搜索</view>
            </view>
        </view>

        <view class="scroll-block" v-if="productList.length > 0">
            <view class="scroll-item" v-for="(item, index) in productList" :key="index" @click="goDetail(item)">
                <view class="flex flex_ac ">
                    <view class="flex flex_ac flex_jc">
                        <image
                          :src="item.listPicUrl"
                          mode="widthFix‌"
                          style="height: 160rpx; border-radius: 8rpx"
                        ></image>
                    </view>
                    <view style="width:50%; flex: 1; margin-left: 24rpx;" class="flex flex_col flex-sb">
                        <view class="flex flex_ac">
                            <view
                              style="line-height:48rpx; font-size: 30rpx;font-weight: 500;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:100%">
                              {{ item.spuName }}</view>
                        </view>
                        <view>
                            <view class="ellipsis" style="font-size: 24rpx;color: #999;line-height:50rpx;">{{ item.mctName }}
                            </view>
                            <view class="flex flex_ac card" style="font-size: 24rpx;height:auto; flex-wrap: wrap;color:#FF6634;">
                                <view class="flex flex_row flex_ac">
                                    <text class="card-line-right-text-price">￥{{ item.price }}</text>
                                    <view class="card-line-right-text-price-old"
                                      >￥{{ item.originalPrice }}</view
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="buyBtn">去抢购</view>
                </view>
                
            </view>
        </view>
        <vc-empty v-else :props-data="{ props: { text: { value: '没有找到相关商品～' } } }" />
    </vc-container>

</template>

<script>
import { mapState } from 'pinia';
import { useBaseStore, useUserStore } from "@/store/index.ts";
import {
    searchProducts,// 商品列表
    getBannerAll,// 轮播图
    appgetUserFubaoPointsVip,// 获取个人积分数
    getPointMallCategories,// 获取分类信息
    getMctList, // 获取商户列表
} from '../api/index'
export default {
    name: "sellSecurities",

    data() {
        return {
            search: "",
            productList: [],
            total: 0,
            page: 1,
            rows: 10,
            selectMctId: '',
            nowType: {
                name: '全部',
                categoryId: '',
                parentCategoryId: '',
            },
            nowSort: {
                key: 'default',
                name: '默认'
            },
        }
    },
    computed: {
        // 只读状态
        ...mapState(useBaseStore, ['navigationBarInfo']),
        ...mapState(useUserStore, {
            isLogined: "isLogined",
        }),
    },
    onLoad(options) {
        this.getProductList()
    },
    onReachBottom() {
        if(this.productList.length < this.total){
            this.page += 1
            this.getProductList()
        }
    },
    methods: {
        // 搜索
        doSearch(e) {
            // if (!this.bridgeSdk.checkIsEmpty(e)) return
            
            this.page = 1
            this.getProductList()
        },
        inputBlur() {
            if (!this.bridgeSdk.checkIsEmpty(this.search)) {
                this.doSearch();
            }
        },
        // 获取商品列表
        getProductList() {
            this.waterfallLoaded = false
            if (this.page == 1) {
                this.productList = []
                this.total = 0
            }
            searchProducts({
                page: this.page,
                size: this.rows,
                keyword: this.search,
                data: {
                    payType: "CASH"
                },
                // keyword: this.nowType.categoryId,
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
                    ],// 排序规则
            }, {
                // mask: false
            }).then(res => {
                let productList = [...this.productList, ...res.data.map(e => ({
                    ...e,
                    listPicUrl: this.minioBaseUrl + e.listPicUrl
                }))]
                this.productList = productList
                // this.$refs.waterfallsFlowRef && this.$refs.waterfallsFlowRef.refresh()
                this.total = res.total
            })
        },
        // 跳转商品详情
        goDetail(e) {
            this.bridgeSdk.jumpPage({
                title: `${e.title}`,
                url: '/package-intergral-mall/productDetail/productDetail?spuId=' + e.spuId,
                needLogin: true,
            })
        },
    }
}
</script>

<style scoped lang="scss">
.main {
  background: #F0F0F4;
  height: auto;
  min-height: 100vh;
}

.search-box {
  background: white;
  height: 130rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ::v-deep .u-search__content__input {
    flex-basis: 68%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  ::v-deep .u-search__content {
    justify-content: flex-start;
  }

  .search-right {
    position: absolute;
    right:38rpx;
    color: #999999;
    font-weight: 400;
    z-index: 999;
    font-weight: 400;
    font-size: 28rpx;
    color: #FFFFFF;
    background: linear-gradient( 90deg, #FE7D20 0%, #FF5210 100%);
    border-radius: 34rpx;
    width: 120rpx;
    height: 68rpx;
    line-height: 68rpx;
    text-align: center;
  }
}

.scroll-block {
  overflow: hidden;
  width: 100%;
  margin: 12rpx auto 0;

  .scroll-item {
    width: calc(100% - 60rpx);
    margin: 20rpx auto 0;
    margin-top: 20rpx;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 30rpx 15rpx 30rpx;
    background: #FFFFFF;

    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
    }
  }
}

.card {
    line-height: 50rpx;
  view {
    font-size: 24rpx;
  }
}

.card-line-right-text-price {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF6634;
  margin-right: 10rpx;
}

.card-line-right-text-price-old {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}
:deep(.u-border-bottom) {
    border-bottom-width:0rpx !important;
}
::v-deep .u-search {
  .u-search__content{
    .u-search__content__input{
        height: 80rpx !important;
      .uni-input-wrapper{
    .u-search__content__input--placeholder{
        font-weight: 400;
        font-size: 30rpx !important;
      }
      }
  } 
  }
  
}
.buyBtn {
    width: 112rpx;
    height: 50rpx;
    background: linear-gradient( 90deg, #FE7D20 0%, #FF5210 100%);
    border-radius: 25rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #FFFFFF;
    line-height: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10rpx;

}
</style>