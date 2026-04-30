<!--
 * @Description: 评价列表
 * @Autor: TF
 * @Date: 2025-06-12 18:05:50
 * @LastEditors: TF
 * @LastEditTime: 2025-06-17 21:07:02
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="propsData" style="background-color: white;">
        <view class="rate">
            <view class="rate-list" v-if="list.length > 0">
                <view class="item" v-for="(item, index) in list" :key="index">
                    <view class="item-title">
                        <image :src="item.isAnonymous == '1' || !bridgeSdk.checkIsEmpty(item.userHeadurl) ? (minioBaseUrl + '/common/static/mine/mine-nologin-head.png') : (minioBaseUrl + item.userHeadurl)" mode="scaleToFill"/>
                        <view class="item-title_content">
                            <view style="font-weight: bold;">{{ item.isAnonymous == '1' ? '匿名用户' : item.anonymousName }}</view>
                            <view style="display: flex;margin-top: 7rpx;">
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
                        <image v-for="(img, index) in item.reviewsImagesAll" @click="previewRateImg(item.reviewsImagesAll, index)" :key="index" :src="img.imageUi" mode="aspectFill"></image>
                    </view>
                </view>
            </view>
            <vc-empty v-else :props-data="emptyPropsData"/>
        </view>
    </vc-container>
</template>

<script>
    import {
        getReviews,// 获取评论列表
    } from '../api/index'
    export default {
        name: 'ratePage',
        data() {
            return {
                propsData: {
                    props: {
                        isFullScreen: {
                            value: true
                        }
                    }
                },
                emptyPropsData: {
                    props: {
                        text: {
                            value: '暂无评价'
                        }
                    }
                },
                list: [],// 列表
                listCommon: [],// 公共评价列表，分页用
                page: 1,// 分页
                rows: 10,// 分页
                total: 0,// 总数
                storeId: "",// 门店ID
                userId: '',// 用户ID

            }
        },
        onLoad(options) {
            this.storeId = options.storeId
            // 用户信息
            const userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            this.userId = userInfo?.userId
        },
        async onReady() {
            this.page = 1;
            await this.getReviewsList();

            this.calcRatePop()
        },
        onReachBottom() {
            if(this.total <= this.listCommon.length) return;

            this.page += 1;
            this.getReviewsList()
        },
        methods: {
            // 计算评论是否展示展开
            calcRatePop() {
                const query = uni.createSelectorQuery().in(this);
                this.list = this.list.map((e, i)=>{
                    let height = 0;
                    let dom = `#rate-text-${i}`
                    query.select(dom).boundingClientRect((data) => {
                        height = data.height
                    }).exec()
                    return {
                        ...e,
                        _needPop: height >= uni.upx2px(33 * 4)
                    }
                })
                console.log(this.list)
            },
            // 获取评论列表
            async getReviewsList() {
                let res = await getReviews({
                    page: this.page,
                    rows: this.rows,
                    storeId: this.storeId,
                    spuId: '',// 暂时无用传空即可
                    userId: this.userId || '',
                })
                console.log(res)
                this.list = Array.from(new Set([...this.list, ...(res.listUser ? res.listUser : []).map(e=>{
                    let time = e.reviewTime.substring(0,4) + '/' 
                                + e.reviewTime.substring(4,6) + '/'
                                +  e.reviewTime.substring(6,8)
                
                    return {
                        ...e,
                        reviewTime: time
                    }
                }), ...res.list.map(e=>{
                    let time = e.reviewTime.substring(0,4) + '/' 
                                + e.reviewTime.substring(4,6) + '/'
                                +  e.reviewTime.substring(6,8)
                
                    return {
                        ...e,
                        reviewTime: time
                    }
                })]))
                this.listCommon = [...this.listCommon, ...res.list]
                this.total = res.total

                console.log(this.list)

                return res;
            },
            // 预览图片
            previewRateImg(urls, index) {
                uni.previewImage({
                    current: index,
                    urls: urls
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
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
.rate {
    padding: 20rpx 0rpx 100rpx;
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
</style>