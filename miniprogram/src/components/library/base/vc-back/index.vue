<!--
 * @Description: 回退组件
 * @Author: yulongchen
 * @Date: 2024-11-27 08:55:16
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-06-18 11:53:24
 * @Remark: 
-->
<template>
    <view class="component vc-back" @click="handleBack">
        <uni-icons class="arrow-back" :style="{ top: top.value !== null ? top.value : (navigationBarInfo.statusBarHeight + 10 || 20) + 'px' }" :color="color.value" type="left" size="24" ></uni-icons>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    import { mapState } from 'pinia'
    import { useBaseStore } from "@/store/index";
    export default {
        belong,
        mixins: [mixins],
        title: "回退",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },
        computed: {
            ...mapState(useBaseStore, {
                navigationBarInfo: "navigationBarInfo",
            }),
        },
        methods: {
            handleBack() {
                this.bridgeSdk.navigateBackTo({
                    delta: 1
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
.vc-back {
padding: 6rpx 10rpx;
}
.arrow-back {
    position: absolute;
    z-index: 1;
    // top: 60rpx;
    left: 30rpx;
    
}
</style>
