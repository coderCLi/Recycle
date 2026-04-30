<!--
 * @Description: 使用商家列表
 * @Autor: TF
 * @Date: 2025-06-16 16:36:09
 * @LastEditors: TF
 * @LastEditTime: 2025-06-24 15:22:01
-->
<template>
    <vc-modal ref="modal"/>
    <vc-container>
        <template v-if="storeList.length > 0">
            <view v-for="(item, index) in storeList" :key="index" class="item" @click="goStore(item)">
                <image class="item-img" :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
                <view style="flex: 1;margin-right: 10rpx;width: 40%">
                    <view class="item-title text-overflow">{{ item.storeName }}</view>
                    <view class="item-tip">暂无评分</view>
                    <view class="item-text muti-overflow">{{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.storeAddress }}</view>
                </view>
                <view style="display: flex; align-items: center;gap: 14rpx;">
                    <view class="flex flex_col" style="align-items: center;justify-content: center;margin-right: 28rpx;" @click.stop="goMap(item)">
                        <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/location.png'" mode="scaleToFill" />
                        <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">导航</view>
                    </view>
                    <view class="flex flex_col" style="align-items: center;justify-content: center;" @click.stop="goPhone(item)">
                        <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'" mode="scaleToFill" />
                        <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">电话</view>
                    </view>
                </view>
            </view>
        </template>
        <vc-empty v-else :props-data="{props: {text: {value: '暂无商家'}}}"/>
    </vc-container>
</template>

<script>
    import mctCom from '../components/mctCom.vue'
    import { getStoreByCoupon } from '../api/index'
    export default {
        name: 'suitableStoreList',
        components: {
            mctCom
        },
        data() {
            return {
                storeList: [],// 门店列表
                page: 1,
                rows: 10,
                total: 0,
                couponBaseId: '',
                mctId: ''
            }
        },
        onLoad(options) {
            this.mctId = options.mctId;
            this.couponBaseId = options.couponBaseId;
            this.getStoreList();
        },
        onReachBottom() {
            if(this.total <= this.storeList.length) return
            this.page += 1
            this.getStoreList()
        },
        methods: {
            // 获取适用门店列表
            getStoreList() {
                getStoreByCoupon({
                    couponBaseId: this.couponBaseId,
                    mctId: this.mctId,
                    page: this.page,
                    rows: this.rows,
                }).then(res=>{
                    this.total = res.total;
                    this.storeList = [...this.storeList, ...res.list];
                })
            },
            // 跳转门店详情
            goStore(e) {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/merchantDetail/merchantDetailCoupon?storeId=${e.storeId}&mctId=${e.mctId}`,
                })
            },
            // 打开地图
            goMap(item) {
                this.bridgeSdk.getLocation(res => {
                    let longitude = Number(res.lng);
                    let latitude = Number(res.lat);
                    let s = `${Number(longitude)},${Number(latitude)}`;
                    let e = `${Number(item.longitude)},${Number(item.latitude)}`;
                    console.log("开始坐标：", s, "终点坐标：", item);
                    // 调用sdk 
                    this.bridgeSdk.routePlan(s, e, item.storeName, item.storeAddress);
                });
            },
            // 打电话
            goPhone(e) {
                this.bridgeSdk.makePhoneCall({
                    title: '商家电话',
                    phoneNumber: e.storePhone
                })
            },
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
.item {
    display: flex;
    padding: 20rpx 30rpx;
    width: calc(100vw - 60rpx);
    background-color: white;
    border-bottom: 1rpx solid #f8f8f8;
    align-items: center;
    justify-content: space-between;
    &-img {
        width: 160rpx;
        height: 150rpx;
        border-radius: 10rpx;
        margin-right: 10rpx;
        background-color: #999;
    }
    &-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        line-height: 34rpx;
    }
    &-tip {
        font-size: 24rpx;
        color: #FF8715;
        line-height: 30rpx;
        margin-top: 10rpx;
    }
    &-text {
        font-size: 24rpx;
        color: #999;
        line-height: 30rpx;
        margin-top: 10rpx;
    }

    .icon-img {
        height: 50rpx;
        width: 50rpx;
    }
}
</style>