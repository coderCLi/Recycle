<!--
 * @Description: 底部安全高度，防止底部横条盖住内容
 * @Author: chenyulong
 * @Date: 2024-09-24 20:38:55
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-10-11 15:46:10
 * @Remark: 
-->
<template>
    <view class="vc-safe-bottom safe-bottom"></view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "底部安全高度",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },
        methods: {

        },
    }
</script>

<style lang="scss">
    /* iphone系列底部安全距离 */
    .safe-bottom {
      padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
      padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
    }
</style>
