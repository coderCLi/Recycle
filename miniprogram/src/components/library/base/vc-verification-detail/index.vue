<!--
 * @Description: 核销详情弹框
 * @Author: AI Assistant
 * @Date: 2026-04-01
 * @Remark: 底部弹出的核销详情弹框
-->
<template>
    <u-popup :show="show.value" mode="bottom" round="15" @close="close" :closeable="true" :lock-scroll="true">
        <view class="verification-detail-container">
            <!-- 标题 -->
            <view class="pop-title flex flex_ac flex_jc">
                核销详情
            </view>
            
            <!-- 内容区域 -->
            <view class="detail-content">
                <!-- 商品信息 -->
                <view class="product-info">
                    {{detailData.productName}}
                </view>
                
                <!-- 详情列表 -->
                <view class="detail-list">
                    <view class="detail-item" v-for="(item, index) in detailData.detailItems" :key="index">
                        <view class="detail-label">{{item.label}}</view>
                        <view class="detail-value">{{item.value}}</view>
                    </view>
                </view>
            </view>
        </view>
    </u-popup>
</template>

<script>
import mixins from "../../mixins.js"
import props from "./props.js";
import belong from "../intro.json";
export default {
    emits: ['close'],
    belong,
    mixins: [mixins],
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
        close() {
            this.show.value = false;
            this.$emit("close", this.show.value);
        },
        // 打开弹框
        open(data) {
            this.detailData = {
                productName: data.productName || '',
                detailItems: data.detailItems || []
            };
            this.show.value = true;
        }
    },
}
</script>

<style lang="scss" scoped>
.verification-detail-container {
    width: 100%;
    padding-bottom: 30rpx;
}

.pop-title {
    padding-top: 20rpx;
    line-height: 80rpx;
    justify-content: center;
    text-align: center;
    width: 100%;
    font-weight: 600;
    font-size: 32rpx;
    color: #222222;
    line-height: 53rpx;
    border-bottom: 1rpx solid #f0f0f0;
    padding-bottom: 20rpx;
    margin-bottom: 30rpx;
    background: #F7F7F7;
    border-radius: 30rpx 30rpx 0 0;
}

.detail-content {
    padding: 0 40rpx;
}

.product-info {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 30rpx;
    line-height: 40rpx;
}

.detail-list {
    width: 100%;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    &:last-child {
        border-bottom: none;
    }
}

.detail-label {
    font-size: 28rpx;
    color: #000;
    font-weight: 400;
    flex: 1;
}

.detail-value {
    font-size: 28rpx;
    color: #333333;
    text-align: right;
    flex: 1;
}
</style>