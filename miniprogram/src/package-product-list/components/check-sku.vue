<!--
 * @Description: 多规格选择sku组件
 * @Autor: TF
 * @Date: 2025-04-07 11:22:35
 * @LastEditors: TF
 * @LastEditTime: 2025-05-27 19:16:01
-->
<template>
    <view @click.stop="">
        <!-- 按钮部分 -->
        <view style="position: relative;" @click.stop="showPop">
            <view class="check-btn">选规格</view>
            <up-badge v-if="num > 0" :value="num" absolute :offset="[-5, -5]"></up-badge>
        </view>
        <!-- 弹出框 -->
        <up-popup class="pop" :show="show" @close="show = false" :safeAreaInsetBottom="false" round="10" mode="center">
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
    </view>
</template>

<script>
import { useMctStore } from "@/store/index"
import NumberStep from './number-step.vue'
import { toFixed } from "@/utils/decimal";
export default {
    name: 'check-sku',
    components: { NumberStep },
    data() {
        return {
            toFixed,
            show: false,//弹出框
            sku: null,//当前商品sku
            current: '',//当前选中sku
        }
    },
    props: {
        //当前商品spu
        spu: {
            type: Object,
            default: () => {}
        },
        //当前商品sku列表
        skuList: {
            type: Array,
            default: () => []
        },
        //当前商品数量
        num: {
            type: Number,
            default: 0
        }
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
    watch: {
        skuList:{
            deep: true,
            immidiate: true,
            handler(val) {
                this.sku = this.bridgeSdk.checkIsEmpty(this.sku) ? this.sku : {...val[0]}
            }
        }
    },
    mounted() {
        this.$nextTick(_=>{
            this.sku = {...this.skuList[0]}
        })
    },
    methods: {
        //变更sku
        changeSku(item) {
            this.sku = {...item}
        },
        //展开pop
        showPop(){
            const pages = getCurrentPages()
            let page = pages[pages.length - 1]
            uni.$emit(`showPop${page.route}`, {
                show: true,
                skuList: [...this.skuList],
                spu: {...this.spu}
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.check-btn{
    background-color: #00BCB8;
    border-radius: 10rpx;
    padding: 5rpx 15rpx;
    font-size: 24rpx;
    color: white;
    text-align: center;
}
.active {
    border: none  !important;
    background: #00BCB8 !important;
    color: white !important;
}
.pop{
    // z-index: 9999;
    // position: relative;
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