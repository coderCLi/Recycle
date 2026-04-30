<!--
 * @Description: Empty 警告提示  
 * @Author: chenyulong
 * @Date: 2024-09-24 20:38:55
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-09 10:35:37
 * @Remark: 
-->
<template>
    <view class="vc-empty">
        <u-empty :marginTop="marginTop.value" :textColor="textColor.value" :width="width.value" :height="height.value" :text="text.value" :textSize="textSize.value"
        :icon="minioBaseUrl + icon.value">
      </u-empty>    
    </view>    
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.propsData);
        },

        methods: {

        },
    }
</script>

<style lang="scss">
    .vc-empty {
        overflow: hidden;
        //    padding-top: 100rpx;
    }
</style>