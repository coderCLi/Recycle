<!--
 * @Description: 购物商品数量步进器
 * @Autor: TF
 * @Date: 2025-04-07 11:22:35
 * @LastEditors: TF
 * @LastEditTime: 2025-04-14 16:39:10
-->
<template>
    <view>
        <template v-if="!sku.stockQuantity||sku.stockQuantity == 0">
            <up-tag text="暂无库存" type="error" plain plainFill></up-tag>
        </template>
        <template v-else-if="value == 0">
            <view @click.stop="addCart">
                <up-icon size="22" name="plus-circle-fill" color="#00BCB8"></up-icon>
            </view>
        </template>
        <template v-else-if="value > 0">
            <up-number-box :step="1">
                <template #minus>
                    <view class="minus" @click.stop="minusCart">
                        <up-icon name="minus" color="#00BCB8" size="12"></up-icon>
                    </view>
                </template>
                <template #input>
                    <text style="width: 20px;text-align: center;" class="input">{{ value }}</text>
                </template>
                <template #plus>
                    <view class="plus" @click.stop="addCart">
                        <up-icon size="22" name="plus-circle-fill" color="#00BCB8"></up-icon>
                    </view>
                </template>
            </up-number-box>
        </template>
    </view>
</template>

<script>
import { useMctStore } from "@/store/index"
export default {
    name: 'number-step',
    props: {
        // 商品数量
        num: {
            type: Number,
            default: 1
        },
        // 最小值
        min: {
            type: Number,
            default: 1
        },
        // 最大值
        max: {
            type: Number,
            default: 99
        },
        //当前商品sku
        sku: {
            type: Object,
            default: () => {}
        },
    },
    model: {
        prop: 'num',
        event: 'input'
    },
    data() {
        return {
            value: 0
        }
    },
    watch: {
        // 监听父组件传入的值
        num: {
            immidiate: true,
            handler(val){
                this.value = val
            }             
        },
        // 监听sku设置value
        sku:{
            immidiate: true,
            deep: true,
            handler(val) {
                const isSkuList = this.cartList.filter(item => item.skuId == val.skuId)
                this.value = [...isSkuList].length
                console.warn('当前商品数量',this.sku.spuName, this.sku.skuName ,this.value)
            }
        },
        //当前商品数量
        nowGoodsList: {
            immidiate: true,
            deep: true,
            handler(val) {
                this.value = [...val].length
            }
        },
    },
    computed: {
        //购物车列表
        cartList() {
            return useMctStore().cartList
        },
        //当前商品的购物车列表信息
        nowGoodsList() {
            return this.cartList.filter(item => item.skuId == this.sku.skuId)
        }
    },
    mounted() {
        const isSkuList = this.cartList.filter(item => item.skuId == this.sku.skuId)
        this.value = [...isSkuList].length
        console.warn('$attr', this.$attrs)
    },
    methods: {
        // 点击减号
        minusCart() {
            console.log('减号', this.value);
            this.value -= 1;
            useMctStore().reduceCartList({
                ...this.sku
            });
            this.$emit('do-minus', this.sku)
        },
        // 点击加号
        addCart() {
            console.log('加号');
            this.value += 1;
            let obj = this.cartList.find(e=>e.skuId == this.sku.skuId)
            useMctStore().addCartList({
                ...this.sku,
                _addTime: this.bridgeSdk.checkIsEmpty(obj) ? obj._addTime : new Date().getTime(),
            });
            this.$emit('do-plus', this.sku)
        },
    }
}
</script>

<style lang="scss" scoped>
.minus {
    width: 20px;
    height: 20px;
    border-width: 1px;
    border-color: #E6E6E6;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;
    @include flex;
    justify-content: center;
    align-items: center;
}

.input {
    padding: 0 10px;
}

</style>