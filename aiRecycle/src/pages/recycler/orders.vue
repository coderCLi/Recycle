<template>
  <view class="page">
    <view class="header">
      <text class="greeting">{{ recyclerName }}，今天</text>
      <text class="stats">{{ orders.length }} 单 | ¥{{ totalAmount }}</text>
    </view>

    <view
      v-for="order in orders"
      :key="order._id"
      class="order-card"
      @click="startService(order)"
    >
      <view class="order-time">{{ order.timeWindow?.start }}-{{ order.timeWindow?.end }}</view>
      <view class="order-body">
        <text class="order-category">{{ order.category }}</text>
        <text class="order-price">¥{{ order.estPriceMin }}-{{ order.estPriceMax }}</text>
      </view>
      <view class="order-address">📍 {{ order.address }}</view>
    </view>

    <view class="empty" v-if="orders.length === 0">
      <text>今天没有待处理的订单</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const recyclerName = ref("");
const orders = ref<any[]>([]);
const totalAmount = ref(0);

onMounted(async () => {
  const res = await wx.cloud.callFunction({
    name: "recycler-orders",
    data: {},
  });
  if (res.result.code === 0) {
    orders.value = res.result.data;
    totalAmount.value = orders.value.reduce((s, o) => s + (o.estPriceMin || 0), 0);
  }
  recyclerName.value = (await wx.getStorageSync("recyclerName")) || "";
});

const startService = (order: any) => {
  uni.navigateTo({
    url: `/pages/recycler/signoff?id=${order._id}&category=${order.category}&priceMin=${order.estPriceMin}&priceMax=${order.estPriceMax}&address=${order.address}`,
  });
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--color-surface-gray); padding: 16px; }
.header { background: var(--color-primary); color: #fff; padding: 20px; border-radius: var(--radius-default); margin-bottom: 16px; }
.greeting { font-size: 16px; display: block; }
.stats { font-size: 24px; font-weight: bold; margin-top: 8px; display: block; }
.order-card { background: var(--color-surface); border-radius: var(--radius-default); padding: 16px; margin-bottom: 12px; }
.order-time { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px; }
.order-body { display: flex; justify-content: space-between; align-items: center; }
.order-category { font-size: 16px; font-weight: bold; }
.order-price { font-size: 16px; color: var(--color-accent-orange); font-weight: bold; }
.order-address { font-size: 14px; color: var(--color-text-secondary); margin-top: 6px; }
.empty { text-align: center; padding: 80px 0; color: var(--color-text-secondary); }
</style>
