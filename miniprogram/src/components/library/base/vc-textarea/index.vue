<!--
 * @Description: textarea 组件
-->
<template>
    <view>
        <view class="article fs32" style="margin-bottom: 20rpx;font-size:32rpx;">
            {{title.value}}
        </view>
        <u--textarea
            height="100" 
            class="textarea" 
            :style="[{ background: '#F6F6F6', borderRadius: '12rpx' }]"
            border="none" 
            v-model="content.value"
            :placeholder="placeholder.value"
            count
            :maxlength="500">
        </u--textarea>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";

    export default {
        belong,
        mixins: [mixins],
        title: "textarea",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
            }
        },
        computed: {
            
        },
        mounted() {

        },
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
    .article {
        margin-top: 10rpx;
        line-height: 50rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #222222;

        text {
            font-size: 28rpx;
            color: #999999;
        }
    }
    .u-textarea ::v-deep .u-textarea__count {
        background-color: #F6F6F6 !important;
    }
    
    .u-textarea ::v-deep textarea {
        font-size: 28rpx !important;
    }
</style>