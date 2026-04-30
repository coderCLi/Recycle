<!--
 * @Description: 购物车浮窗组件
 * @Autor: TF
 * @Date: 2025-04-02 11:33:32
 * @LastEditors: TF
 * @LastEditTime: 2025-05-27 19:13:32
-->
<template>
    <Transition mode="out-in" appear>
        <view class="cart" v-if="visiable">
            <view style="display: flex;align-items: center;">
                <view style="position: relative;" @click="popupCart">
                    <up-badge style="z-index: 9;" shape="circle" absolute :value="cartList.length"></up-badge>
                    <up-icon name="shopping-cart" color="#00BCB8" size="43"></up-icon>
                </view>
                <view style="margin-left: 20rpx;font-weight: bold;">合计：¥{{ toFixed(totalAmt, 2) }}</view>
            </view>
            <view class="cart-btn" @click="doBuy">立即购买</view>
        </view>
    </Transition>
    <up-popup class="cart-pop-cls" :customStyle="{'paddingBottom': '130rpx'}" :safeAreaInsetBottom="false" :duration="300" :show="popShow" round="15" closeable bgColor="white" @close="popShow = false">
        <view class="pop-title">加购商品</view>
        <view style="height: 500rpx;background-color: white;overflow-y: auto;">
            <view v-for="(item, index) in popCartList" :key="index" class="pop-item" @click="goScroll(item)">
                <image :src="minioBaseUrl + (bridgeSdk.checkIsEmpty(item.mediaAll) ? item.mediaAll[0].mediaUrl : item.skuMediaList[0])"></image>
                <!-- <video :src="minioBaseUrl + (bridgeSdk.checkIsEmpty(item.mediaAll) ? item.mediaAll[0].mediaUrl : item.skuMediaList[0])"></video> -->
                <view style="line-height: 40rpx;flex: 1;margin-left: 30rpx;">
                    <view style="font-size: 30rpx;font-weight: bold;color: #333;">{{ item.spuName }}</view>
                    <view style="font-size: 24rpx;color: gray;">{{ item.skuName }}</view>
                    <view class="price-block">¥{{ toFixed(multiply(item.price, item.skuNum), 2) }}</view>
                </view>
                <number-step :key="index" :sku="{...item}" :num="item.skuNum" @do-minus="doMinus"></number-step>
            </view>
        </view>
    </up-popup>
</template>

<script>
import { useMctStore } from "@/store/index"
import NumberStep from './number-step.vue';
import { shoping } from "../api/index"
import { toast } from '@/uni_modules/uview-plus'
import { plus, multiply, toFixed } from "@/utils/decimal";
export default {
    name: 'cart',
    components: { NumberStep },
    inject: ['scrollToView'],
    props: {
         //是否展示
        visiable: {
            type: Boolean,
            default: false
        },
        //商户号
        mctId: {
            type: String,
            default: ''
        },
        //门店号
        storeId: {
            type: String,
            default: ''
        },
    },
    options: {
        "styleIsolation": 'shared'
    },
    data() {
        return {
            multiply,
            toFixed,
            popShow: false,//购物车列表
        }
    },
    model: {
        prop: 'visiable',
        event: 'change'
    },
    computed: {
        //购物车列表
        cartList() {
            console.log(useMctStore().cartList)
            return useMctStore().cartList
        },
        //总金额
        totalAmt() {
            return useMctStore().cartList.map(e=>e.price).reduce((sum, current) => plus(sum, current), 0);
        },
        // 弹出购物车列表
        popCartList() {
            const skuIdList = Array.from(new Set(this.cartList.sort((a,b)=>b._addTime - a._addTime).map(e=>e.skuId)))
            return skuIdList.map(e=>{
                const s = this.cartList.filter(f => f.skuId == e).sort((a,b)=>a._addTime - b._addTime)
                return {
                    ...s[0],
                    skuNum: s.length,
                }
            })
        }
    },
    watch: {
        cartList:{
            deep: true,
            immidiate: true,
            handler(val){
                if(val.length == 0) this.popShow = false
            }
        }
    },
    methods: {
        //弹出购物车列表
        popupCart() {
            this.popShow = !this.popShow
        },
        //跳转商品详情 (暂时不用)
        goDetail(item) {
            this.bridgeSdk.jumpPage({
                url: `/package-product-list/productDetail/productDetail?spuId=${item.spuId}&mctId=${this.mctId}&storeId=${this.storeId}`
            })
        },
        // 滚动商品位置
        goScroll(e) {
            this.scrollToView(e.spuId)
        },
        //减数监听
        doMinus() {
            if(this.cartList.length == 0) this.popShow = false
        },
        //立即购买
        doBuy(){
            if(this.popCartList.length == 0){
                toast("请选择商品")
                return;
            }
            console.warn(this.popCartList.map(e=>({
                    skuId: e.skuId,
                    num: e.skuNum,
                })))
                console.warn(this.cartList)
                
            let param = {
                mctId: this.mctId,
                shoppingAll: this.popCartList.map(e=>({
                    skuId: e.skuId,
                    num: e.skuNum,
                }))
            }
            shoping({
                ...param
            }).then(res=>{
                console.log(res)
                useMctStore().setOrderShoppingAll(JSON.stringify(param.shoppingAll))
                useMctStore().setOrderStoreId(this.storeId)
                useMctStore().setOrderMctId(this.mctId)
                useMctStore().setOrderInfo(res)
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/checkout/checkout`,
                })
                
            })
        },
    },
};
</script>
<style lang="scss" scoped>
.v-enter-active {
    animation: bounce-in 0.3s linear reverse;
}
.v-leave-active {
    animation: bounce-in 0.3s linear;
}

@keyframes bounce-in {
    0% {
        transform: translateY(0)
    }
    100% {
        transform: translateY(100%);
    }
}
.price-block{
    font-size: 30rpx;
    font-weight: bold;
    color: #00BCB8;
    &::first-letter{
        font-size: 24rpx;
        margin-right: 10rpx;
    }
}
.cart-pop-cls{
    z-index: 9998;
    position: relative;
}
.cart{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 130rpx;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    border-radius: 30rpx 30rpx 0 0;
    box-shadow: 0 -10rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 9999;
    &-btn{
        background-color: #00BCB8;
        border-radius: 30rpx;
        height: 60rpx;
        line-height: 60rpx;
        color: white;
        text-align: center;
        font-size: 28rpx;
        padding: 0 30rpx;
    }
}
.pop-title{
    background-color: white;
    font-size: 38rpx;
    font-weight: bold;
    text-align: center;
    margin: 20rpx 0;
}
.pop-item{
    padding: 20rpx 40rpx;
    display: flex;
    align-items: center;
    image{
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
    }
}
</style>