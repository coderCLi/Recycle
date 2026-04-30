<!--
 * @Description: 支付结果
 * @Autor: TF
 * @Date: 2025-04-17 15:01:08
 * @LastEditors: TF
 * @LastEditTime: 2025-04-22 11:35:37
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container" :props-data="{props: { customLeftBack: { value: true } }}" @navBack="navBack">
        <view style="margin: 100rpx auto 0;display: flex;flex-direction: column;align-items: center ;">
            <up-icon name="checkmark-circle" size="150rpx" color="#00BCB8"></up-icon>
            <view style="margin-top: 40rpx;">支付成功</view>
        </view>
        <!-- <view class="btn" @click="goDetail">订单详情</view> -->
    </vc-container>
</template>

<script>
    export default {
        name: 'buyResult',
        data() {
            return {

            }
        },
        methods: {
            //关闭页面
            navBack(){
                this.bridgeSdk.hi.closeWebview()
            },
            //订单详情
            goDetail(){
                this.bridgeSdk.jumpPage({
                    url: ''
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.btn{
    width: 80%;
    height: 80rpx;
    line-height: 80rpx;
    margin: 150rpx auto 0;
    border-radius: 40rpx;
    text-align: center;
    color: white;
    background-color: #00BCB8;
}
</style>