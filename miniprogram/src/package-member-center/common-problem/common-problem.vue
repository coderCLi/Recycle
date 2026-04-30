<!--
 * @Description: 常见问题
 * @Author: donghongxia
 * @Date: 2025-07-17 
 * @LastEditors: TF
 * @LastEditTime: 2025-09-05 18:06:22
 * @Remark: 
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData">
    <view class="wrap" v-if="!isEmpty">
        <view v-for="(item, index) in data" :key="index" class="question-box">
            <view class="question-title-box">
                <view class="question-icon"></view>
                <text class="question-title">{{item.question}}</text>
            </view>
            <rich-text :nodes="bridgeSdk.addMinioPrefixToImgSrc(item.answer)"></rich-text>
        </view>
    </view>
    <vc-empty v-else></vc-empty>
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import { getQuestionList } from '../api/question'  
export default {
    data() {
        return {
            propsData: {
                props: {
                    title: {
                        value: ''
                    },
                    isFullScreen: {
                        value: true
                    }
                }
            },
            data: [],
            isEmpty: false
        }
    },
    mounted() {
        this.getQuestionList();
    },
    methods: {
        async getQuestionList() {
            const res = await getQuestionList({});
            console.log("getQuestionList", res);
            this.data = res;
            if(this.data.length == 0){
                this.isEmpty = true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    padding: 30rpx 24rpx;
    box-sizing: border-box;
    .question-box{
        margin-bottom: 24rpx;
        background: #fff;
        border-radius: 28rpx;
        padding: 30rpx;
        box-sizing: border-box;
        .question-title-box{
            display: flex;
            align-items: center;
            margin-bottom: 16rpx;
            .question-icon{
                width: 8rpx;
                height: 27rpx;
                background: #946C37;
                border-radius: 4rpx;
                margin-right: 8rpx;
            }
            .question-title{
                font-weight: 600;
                font-size: 28rpx;
                color: #333333;
            }
        }
    }
}

</style>