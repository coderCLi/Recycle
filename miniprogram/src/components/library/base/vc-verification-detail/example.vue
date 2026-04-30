<!--
 * @Description: 核销详情弹框示例
 * @Author: AI Assistant
 * @Date: 2026-04-01
-->
<template>
    <view class="example-container">
        <text class="example-title">核销详情弹框示例</text>
        <view class="example-button" @click="openVerificationDetail">
            打开核销详情弹框
        </view>
        
        <!-- 核销详情弹框组件 -->
        <vc-verification-detail ref="verificationDetail" />
    </view>
</template>

<script>
import vcVerificationDetail from './index.vue';
export default {
    components: {
        vcVerificationDetail
    },
    data() {
        return {
            // 核销详情数据
            verificationData: {
                productName: '进膳尽美【暖冬套餐】',
                detailItems: [
                    { label: '核销类型', value: '核销' },
                    { label: '核销时间', value: '2026-02-02 10:40:36' },
                    { label: '核销门店', value: '总店' },
                    { label: '领取时间', value: '2026-01-23 09:33:36' },
                    { label: '优惠券类型', value: '礼品券' },
                    { label: '优惠券核销数量', value: '1张' },
                    { label: '优惠券来源', value: '商户' },
                    { label: '领取方式', value: '免费领取' }
                ]
            }
        };
    },
    methods: {
        // 打开核销详情弹框
        openVerificationDetail() {
            this.$refs.verificationDetail.open(this.verificationData);
        }
    }
};
</script>

<style lang="scss" scoped>
.example-container {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.example-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 40rpx;
}

.example-button {
    width: 100%;
    height: 80rpx;
    background: linear-gradient(132deg, #58A1F6 0%, #6FA9F7 100%), #FF5871;
    color: #FFFFFF;
    font-size: 28rpx;
    font-weight: 600;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    
    &:active {
        opacity: 0.72;
    }
}
</style>