<!--
 * @Description: 状态栏占位块
 * @Author: chenyulong
 * @Date: 2024-09-24 20:38:55
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-20 13:09:25
 * @Remark: 
-->
<template>
    <view class="vc-status-bar" :style="{ 'height': navigationBarInfo.statusBarHeight + 'px', 'background': barBgColor.value }"></view>
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
        title: "状态栏占位块",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        computed: {
		  ...mapState(useBaseStore, {
            navigationBarInfo: "navigationBarInfo",
        })
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
            // console.log("navigationBarInfo.statusBarHeight: ", this.navigationBarInfo.statusBarHeight);
        },

        methods: {

        },
    }
</script>

<style lang="scss">
    .vc-status-bar {
        // background: red !important;
    }
</style>
