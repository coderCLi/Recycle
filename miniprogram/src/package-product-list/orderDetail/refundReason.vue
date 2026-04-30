<!--
 * @Description: 售后原因选择页面
 * @Autor: TF
 * @Date: 2025-07-21 16:07:51
 * @LastEditors: TF
 * @LastEditTime: 2025-08-18 20:05:15
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container>
        <view class="main">
            <up-radio-group v-model="nowReason" iconPlacement="right" placement="column">
                <up-radio v-for="(item, index) in reasonList" activeColor="#00BCB8" :key="index" :name="item.optCode" :label="item.optName"></up-radio>
            </up-radio-group>
            <view class="textarea" v-if="nowReason == '99' && reasonList.length > 0">
                <up-textarea v-model="reason" maxlength="200" count placeholderStyle="font-size: 24rpx;" placeholder="请输入原因描述（200字）"/>
            </view>
        </view>
        <view class="btn" @click="doConfirm">
            确认
        </view>
    </vc-container>
</template>

<script>
    import { 
        getDataDicList
    } from '../api/index'
    export default {
        name: 'refundReason',
        data() {
            return {
                type: '',// 类型（实物商品退款、实物商品退货退款、虚拟商品退款、虚拟商品退货退款）
                nowReason: '',// 当前理由
                reasonList: [],// 理由列表
                reason: '',// 理由 （其他情况）
            }
        },
        onLoad(options) {
            this.type = options.type
            if(options.reason){
                this.nowReason = options.reason
                if(this.nowReason == '99') {
                    this.reason = options.reasonText
                }
            }
            this.getReasonList()
        },
        methods: {
            // 获取理由列表
            getReasonList() {
                getDataDicList({
                    code: this.type
                }).then(res=>{
                    this.reasonList = res
                })
            },
            // 确认
            doConfirm() {
                if(!this.nowReason) {
                    this.bridgeSdk.showToast({
                        title: "请选择理由",
                        duration: 2000
                    })
                    return;
                }
                if(this.nowReason == '99' && !this.bridgeSdk.checkIsEmpty(this.reason)) {
                    this.bridgeSdk.showToast({
                        title: "请输入原因描述",
                        duration: 2000
                    })
                    return;
                }
                let nowReason = this.reasonList.find(item=>item.optCode == this.nowReason)
                if(nowReason.optCode == '99') {
                    nowReason.optName = this.reason
                }
                this.bridgeSdk.navigateBackTo({
                    delta: 1,
                    success: page=>{
                        page && page.setReason && page.setReason(nowReason);
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
:deep(.u-radio-label--right) {
    padding: 10rpx 20rpx;
    &:first-of-type {
        padding-top: 5rpx;
    }
    &:last-of-type {
        padding-bottom: 5rpx;
    }
}
:deep(.u-textarea) {
    background-color: #f8f8f8;
    padding-bottom: 40rpx;
}
:deep(.u-textarea__count) {
    background-color: #f8f8f8 !important;
}
.main {
    width: calc(670rpx - 40rpx);
    padding: 30rpx 20rpx;
    margin: 30rpx auto;
    border-radius: 20rpx;
    background-color: white;
}
.btn {
    position: absolute;
    bottom: 100rpx;
    left: 0;
    right: 0;
    width: 670rpx;
    line-height: 84rpx;
    border-radius: 42rpx;
    margin: 0 auto;
    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #00BDB8;
    text-align: center;
    color: white;
    font-size: 28rpx;
    font-weight: bold;
}
.textarea {
    height: 180rpx;
    width: calc(100% - 60rpx);
    // background-color: #f8f8f8;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    margin: 20rpx auto;
}
</style>