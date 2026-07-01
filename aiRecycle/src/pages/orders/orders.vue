<template>
  <view class="page">
    <view class="empty-state" v-if="orders.length === 0">
      <text class="empty-icon">📋</text>
      <text class="empty-text">还没有订单</text>
      <text class="empty-sub">拍张照片试试吧</text>
    </view>

    <view
      v-for="order in orders"
      :key="order._id"
      class="order-card"
      @click="goDetail(order._id)"
    >
      <view class="order-header">
        <text class="status-icon">{{ statusIcon(order.status) }}</text>
        <text class="status-text">{{ statusLabel(order.status) }}</text>
      </view>
      <view class="order-body">
        <text class="order-category">{{ order.category }}</text>
        <text class="order-price">¥{{ order.finalPrice || `${order.estPriceMin}-${order.estPriceMax}` }}</text>
      </view>
      <view class="order-footer">
        <text class="order-time">{{ formatTime(order.created) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"; import { onShow } from "@dcloudio/uni-app";
import { getOrders } from "../../mock/store";

// ====== 演示 Mock 模式 ======
const USE_MOCK = true;

const orders = ref<any[]>([]);

const statusIcon = (s: string) =>
  ({ pending: "🗓", assigned: "👷", en_route: "🚚", serving: "🔧", completed: "✅", cancelled: "❌" }[s] || "🗓");

const statusLabel = (s: string) =>
  ({ pending: "待确认", assigned: "已派单", en_route: "已出发", serving: "服务中", completed: "已完成", cancelled: "已取消" }[s] || s);

const formatTime = (t: string) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const fetchOrders = async () => {
  if (USE_MOCK) {
    orders.value = getOrders();
    return;
  }
  const res = await wx.cloud.callFunction({
    name: "order-list",
    data: {},
  });
  if (res.result.code === 0) {
    orders.value = res.result.data;
  }
};

onShow(() => fetchOrders());

const goDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
};
</script>

<style scoped>
.page { min-height: 100vh; padding: 16px; background: var(--color-surface-gray); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 100px 0; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-text { font-size: 18px; color: var(--color-text-primary); font-weight: bold; }
.empty-sub { font-size: 14px; color: var(--color-text-secondary); margin-top: 6px; }
.order-card { background: var(--color-surface); border-radius: var(--radius-default); padding: 16px; margin-bottom: 12px; }
.order-header { display: flex; align-items: center; margin-bottom: 10px; }
.status-icon { font-size: 18px; margin-right: 8px; }
.status-text { font-size: 15px; font-weight: bold; color: var(--color-primary); }
.order-body { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.order-category { font-size: 17px; font-weight: bold; }
.order-price { font-size: 18px; color: var(--color-accent-orange); font-weight: bold; }
.order-footer { }
.order-time { font-size: 13px; color: var(--color-text-secondary); }
</style>
