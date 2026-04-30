<!--
 * @Description: 未登录提示
 * @Author: yulongchen
 * @Date: 2024-12-19 08:38:32
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-19 14:39:04
 * @Remark: 
-->
<template>
    <view class="component" @click="bridgeSdk.toLogin">
        <!-- <u-empty /> -->
        <text class="toLogin" v-if="loaded">未登录，点击登录</text>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "未登录提示",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                loaded: false,
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
            // this.loaded = true;
            if(this.bridgeSdk.isTokenValid()){
                this.loaded = true;
                return;
            }
            this.bridgeSdk.beans.setTokenGetCallback(() => {
                this.loaded = true;
            });
        },

        methods: {

        },
    }
</script>

<style lang="scss" scoped>
  .toLogin {
    display: block;
    font-size: 28rpx;
    color: #444;
    line-height: 360rpx;
    text-align: center;
  }
</style>
