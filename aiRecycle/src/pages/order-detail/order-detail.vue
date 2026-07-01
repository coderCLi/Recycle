<template>
  <view class="page">
    <view class="status-bar" :style="{ background: statusColor }">
      <text class="status-icon-large">{{ statusIcon }}</text>
      <text class="status-text-large">{{ statusLabel }}</text>
    </view>

    <view class="info-card">
      <view class="info-row"><text class="label">品类</text><text class="value">{{ order.category }}</text></view>
      <view class="info-row"><text class="label">预估</text><text class="value price">¥{{ order.estPriceMin }}-{{ order.estPriceMax }}</text></view>
      <view class="info-row" v-if="order.finalPrice"><text class="label">成交价</text><text class="value price final">¥{{ order.finalPrice }}</text></view>
      <view class="info-row"><text class="label">预约</text><text class="value">{{ timeStr }}</text></view>
      <view class="info-row"><text class="label">地址</text><text class="value">{{ order.address }}</text></view>
      <view class="info-row" v-if="order.recyclerName"><text class="label">回收员</text><text class="value">{{ order.recyclerName }}</text></view>
    </view>

    <view class="cancel-btn" v-if="order.status === 'pending'" @click="cancelOrder">
      <text>取消订单</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getOrder, cancelOrder as mockCancel } from "../../mock/store";

// ====== 演示 Mock 模式 ======
const USE_MOCK = true;

const order = ref<any>({});

const statusMap: Record<string, { icon: string; label: string; color: string }> = {
  pending: { icon: "🗓", label: "待确认", color: "#FA8C16" },
  assigned: { icon: "👷", label: "已派单", color: "#1890FF" },
  en_route: { icon: "🚚", label: "回收员已出发", color: "#1890FF" },
  serving: { icon: "🔧", label: "服务中", color: "#07C160" },
  completed: { icon: "✅", label: "已完成", color: "#52C41A" },
  cancelled: { icon: "❌", label: "已取消", color: "#8C8C8C" },
};

const statusIcon = ref("");
const statusLabel = ref("");
const statusColor = ref("#07C160");
const timeStr = ref("");

onMounted(async () => {
  const q = getCurrentPages().pop()?.options || {};
  if (!q.id) return;

  if (USE_MOCK) {
    const o = getOrder(q.id);
    if (!o) {
      uni.showToast({ title: "订单不存在", icon: "none" });
      uni.navigateBack();
      return;
    }
    order.value = o;
    const s = statusMap[o.status];
    statusIcon.value = s?.icon || "🗓";
    statusLabel.value = s?.label || "";
    statusColor.value = s?.color || "#07C160";
    timeStr.value = `${o.timeWindow.date} ${o.timeWindow.start}-${o.timeWindow.end}`;
    return;
  }

  const res = await wx.cloud.callFunction({
    name: "order-detail",
    data: { orderId: q.id },
  });
  if (res.result.code === 0) {
    order.value = res.result.data;
    const s = statusMap[order.value.status];
    statusIcon.value = s?.icon || "🗓";
    statusLabel.value = s?.label || "";
    statusColor.value = s?.color || "#07C160";
    if (order.value.timeWindow) {
      timeStr.value = `${order.value.timeWindow.date} ${order.value.timeWindow.start}-${order.value.timeWindow.end}`;
    }
  }
});

const cancelOrder = async () => {
  const res = await uni.showModal({ title: "确定取消订单吗？" });
  if (!res.confirm) return;

  if (USE_MOCK) {
    mockCancel(order.value._id);
    uni.showToast({ title: "已取消", icon: "success" });
    setTimeout(() => uni.navigateBack(), 1000);
    return;
  }

  await wx.cloud.callFunction({
    name: "order-cancel",
    data: { orderId: order.value._id },
  });
  uni.navigateBack();
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--color-surface-gray); }
.status-bar { padding: 32px 16px; text-align: center; color: #fff; }
.status-icon-large { font-size: 40px; display: block; }
.status-text-large { font-size: 18px; font-weight: bold; margin-top: 8px; display: block; }
.info-card { background: var(--color-surface); margin: 12px 16px; border-radius: var(--radius-default); padding: 16px; }
.info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-divider); }
.label { font-size: 15px; color: var(--color-text-secondary); }
.value { font-size: 15px; font-weight: bold; }
.price { color: var(--color-accent-orange); }
.final { font-size: 18px; }
.cancel-btn { margin: 20px 16px; padding: 14px; border: 1px solid var(--color-accent-red); border-radius: var(--radius-default); text-align: center; }
.cancel-btn text { color: var(--color-accent-red); font-size: 16px; }
</style>
