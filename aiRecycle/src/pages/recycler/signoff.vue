<template>
  <view class="page">
    <view class="info-card">
      <text class="category">{{ category }}</text>
      <text class="address">📍 {{ address }}</text>
    </view>

    <view class="price-section">
      <text class="section-title">最终回收价格</text>
      <input class="price-input" v-model="finalPrice" type="digit" placeholder="输入实际成交价" />
      <text class="estimate-ref">预估: ¥{{ priceMin }}-{{ priceMax }}</text>

      <view class="reason-section" v-if="showReason">
        <text class="section-title">修改原因（用户可见）</text>
        <input class="reason-input" v-model="reason" placeholder="如：压缩机已坏" />
      </view>
    </view>

    <view class="confirm-section">
      <text class="confirm-hint">请让用户当面确认价格</text>
      <view class="submit-btn" @click="completeOrder">
        <text>确认签收并支付</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const orderId = ref("");
const category = ref("");
const priceMin = ref(0);
const priceMax = ref(0);
const address = ref("");
const finalPrice = ref("");
const reason = ref("");
const showReason = ref(false);

onMounted(() => {
  const q = getCurrentPages().pop()?.options || {};
  orderId.value = q.id || "";
  category.value = q.category || "";
  priceMin.value = Number(q.priceMin) || 0;
  priceMax.value = Number(q.priceMax) || 0;
  address.value = q.address || "";
});

const completeOrder = async () => {
  if (!finalPrice.value) {
    uni.showToast({ title: "请输入成交价", icon: "none" });
    return;
  }

  try {
    await wx.cloud.callFunction({
      name: "order-complete",
      data: {
        orderId: orderId.value,
        finalPrice: Number(finalPrice.value),
        note: reason.value,
        recyclerId: wx.getStorageSync("recyclerId") || "",
      },
    });

    uni.showToast({ title: "签收成功", icon: "success" });
    setTimeout(() => uni.navigateBack(), 1500);
  } catch (e) {
    uni.showToast({ title: "签收失败，请重试", icon: "none" });
  }
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--color-surface-gray); padding: 16px; }
.info-card { background: var(--color-surface); border-radius: var(--radius-default); padding: 20px; margin-bottom: 16px; text-align: center; }
.category { font-size: 22px; font-weight: bold; display: block; }
.address { font-size: 14px; color: var(--color-text-secondary); margin-top: 8px; display: block; }
.price-section { background: var(--color-surface); border-radius: var(--radius-default); padding: 20px; margin-bottom: 16px; }
.section-title { font-size: 16px; font-weight: bold; margin-bottom: 12px; display: block; }
.price-input { font-size: 32px; font-weight: bold; color: var(--color-accent-orange); border-bottom: 2px solid var(--color-primary); padding: 8px 0; width: 100%; }
.estimate-ref { font-size: 14px; color: var(--color-text-secondary); margin-top: 8px; display: block; }
.reason-section { margin-top: 16px; }
.reason-input { border: 1px solid var(--color-divider); border-radius: 8px; padding: 10px; width: 100%; font-size: 15px; margin-top: 8px; }
.confirm-section { text-align: center; margin-top: 32px; }
.confirm-hint { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 16px; display: block; }
.submit-btn { background: var(--color-primary); padding: 16px; border-radius: var(--radius-default); }
.submit-btn text { color: #fff; font-size: 18px; font-weight: bold; }
</style>
