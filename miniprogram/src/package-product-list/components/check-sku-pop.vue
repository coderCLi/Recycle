<!--
 * @Description: check-sku的popup组件
 * @Autor: TF
 * @Date: 2025-04-17 16:38:01
 * @LastEditors: TF
 * @LastEditTime: 2025-05-27 19:14:29
-->
<template>
    <!-- 弹出框 -->
    <up-popup class="check-sku-pop-cls" :show="show" @close="show = false" :safeAreaInsetBottom="false" round="10" mode="center">
        <view class="pop-block">
            <view class="pop-block_top">
                {{ spu.spuName }}
            </view>
            <view class="pop-block_mid">
                <view class="pop-block_mid--title">规格</view>
                <view style="display: flex;flex-wrap: wrap;">
                    <view v-for="(item, index) in skuList" :key="index" 
                        :class="['pop-block_mid--item', sku?.skuId == item.skuId? 'active' : '']" @click.stop="changeSku(item)">
                        {{ item.skuName }}
                    </view>
                </view>
            </view>
            <view class="pop-block_btm">
                <view class="pop-block_btm--amt">
                    <template v-if="sku">
                        ¥{{ toFixed(sku.price, 2) }}
                    </template>
                    <template v-else>
                        ¥{{ minAmt }}
                        <text style="font-size: 24rpx;">{{ skuList?.length > 1?'起':'' }}</text>
                    </template>
                </view>
                <number-step v-if="sku" :sku="{...sku, spuName: spu.spuName}"></number-step>
            </view>
        </view>
    </up-popup>
</template>

<script>
    import NumberStep from './number-step.vue'
    import { useMctStore } from "@/store/index"
    import { toFixed } from "@/utils/decimal";
    export default {
        components: { NumberStep },
        data() {
            return {
                toFixed,
                sku: {},//当前sku
                skuList: [],//当前sku的列表
                spu: {},//当前商品spu
                show: false,//当前pop状态
            }
        },
        watch: {
            skuList:{
                deep: true,
                immidiate: true,
                handler(val) {
                    this.sku = {...val[0]}
                }
            }
        },
        options: {
            "styleIsolation": "shared"
        },
        computed: {
            //购物车列表
            cartList() {
                return useMctStore().cartList
            },
            //最早金额
            minAmt () {
                return this.bridgeSdk.checkIsEmpty(this.skuList) ? toFixed(this.skuList[0].price, 2) : ''
            },
        },
        created() {
            const pages = getCurrentPages()
            let page = pages[pages.length - 1]
            console.log(page, page.route)
            uni.$on(`showPop${page.route}`,e => {
                this.show = e.show
                this.skuList = e.skuList
                this.spu = e.spu
            })
        },
        beforeDestroy() {
            this.show = false
            uni.$off('showPop')
        },
        methods: {
            //变更sku
            changeSku(item) {
                this.sku = {...item}
            }
        }
    }
</script>

<style lang="scss" scoped>
.check-sku-pop-cls{
    z-index: 9999;
    position: relative;
}
.active {
    border: none  !important;
    background: #00BCB8 !important;
    color: white !important;
}
.pop-block{
    background-color: white;
    border-radius: 20rpx;
    width: 500rpx;
    &_top{
        background-color: #f8f8f8;
        border-radius: 20rpx 20rpx 0 0;
        height: 80rpx;
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        font-size: 34rpx;
        font-weight: bold;
        color: #333;
    }
    &_mid{
        min-height: 300rpx;
        padding: 0 30rpx;
        &--title{
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 30rpx;
            margin-top: 30rpx;
        }
        &--item{
            padding: 10rpx 20rpx;
            font-size: 24rpx;
            color: #333;
            border-radius: 10rpx;
            margin: 0 20rpx 0 0;
            border: 1px solid #d0d0d0;
        }
    }
    &_btm{
        height: 100rpx;
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        justify-content: space-between;
        background-color: #f8f8f8;
        border-radius: 0 0 20rpx 20rpx;
        &--amt{
            font-size: 30rpx;
            font-weight: bold;
            color: #00BCB8;
            &::first-letter{
                font-size: 24rpx;
                margin-right: 10rpx;
            }
        }
    }
}
</style>