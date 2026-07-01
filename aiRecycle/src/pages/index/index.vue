<template>
  <view class="page">
    <!-- 相机区域 -->
    <view class="camera-section">
      <view class="camera-button" @click="takePhoto">
        <text class="camera-icon">📷</text>
      </view>
      <text class="camera-label">拍照估价</text>
      <text class="camera-sub">或从相册选择</text>
    </view>

    <!-- 最近估价记录 -->
    <view class="recent-section" v-if="recentItems.length">
      <text class="section-title">最近估价</text>
      <view
        class="estimate-card"
        v-for="item in recentItems"
        :key="item._id"
        @click="goEstimate(item)"
      >
        <image :src="item.imageUrl" mode="aspectFill" class="item-thumb" />
        <view class="item-info">
          <text class="item-category">{{ item.category }}</text>
          <text class="item-brand">{{ item.brand }}</text>
        </view>
        <view class="item-price">
          <text class="price">¥{{ item.estPriceMin }}-{{ item.estPriceMax }}</text>
          <text class="price-hint">预估</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">♻️</text>
      <text class="empty-text">拍张照片，看看值多少钱</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface EstimateItem {
  _id: string;
  imageUrl: string;
  category: string;
  brand: string;
  estPriceMin: number;
  estPriceMax: number;
}

const recentItems = ref<EstimateItem[]>([]);

const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["camera", "album"],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uni.navigateTo({
        url: `/pages/estimate/estimate?imagePath=${encodeURIComponent(tempFilePath)}`,
      });
    },
    fail: (err) => {
      if (err.errMsg.includes("cancel")) return;
      uni.showToast({ title: "拍照失败，请重试", icon: "none" });
    },
  });
};

const goEstimate = (item: EstimateItem) => {
  uni.navigateTo({
    url: `/pages/estimate/estimate?itemId=${item._id}`,
  });
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: var(--spacing-page);
}

.camera-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 40px;
}

.camera-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.15s;
}
.camera-button:active {
  transform: scale(0.95);
}

.camera-icon {
  font-size: 36px;
  color: #fff;
}

.camera-label {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.camera-sub {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.estimate-card {
  background: var(--color-surface);
  border-radius: var(--radius-default);
  padding: 16px;
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-card);
}

.item-thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: var(--color-surface-gray);
}

.item-info {
  flex: 1;
  margin-left: 12px;
}

.item-category {
  font-size: 16px;
  font-weight: bold;
  display: block;
}

.item-brand {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.item-price {
  text-align: right;
}

.price {
  font-size: 16px;
  color: var(--color-accent-orange);
  font-weight: bold;
}

.price-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
  display: block;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-secondary);
}
</style>
