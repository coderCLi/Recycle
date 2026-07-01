<template>
  <view class="page">
    <view class="summary-card">
      <text class="summary-category">{{ category }}</text>
      <text class="summary-price">¥{{ priceMin }}-{{ priceMax }}</text>
    </view>

    <view class="section">
      <text class="section-title">选择上门时间</text>
      <view class="date-scroll">
        <view
          v-for="(day, i) in dateOptions"
          :key="i"
          class="date-chip"
          :class="{ active: selectedDate === day.value }"
          @click="selectedDate = day.value"
        >
          <text class="date-day">{{ day.label }}</text>
          <text class="date-desc">{{ day.desc }}</text>
        </view>
      </view>
      <view class="time-grid">
        <view
          v-for="slot in timeSlots"
          :key="slot"
          class="time-chip"
          :class="{
            active: selectedTime === slot,
            disabled: bookedSlots.includes(slot),
          }"
          @click="!bookedSlots.includes(slot) && (selectedTime = slot)"
        >
          {{ slot }}
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">回收地址</text>
      <view class="address-row" @click="chooseLocation">
        <text>{{ address || "点击选择地址" }}</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="footer">
      <button class="submit-btn" open-type="getPhoneNumber" @getphonenumber="submitOrder">
        确认预约
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createOrder } from "../../mock/store";

// ====== 演示 Mock 模式 ======
const USE_MOCK = true;
// 富拉尔基本地 mock 地址
const MOCK_ADDRESS = "富拉尔基区向阳大街100号";

const category = ref("");
const priceMin = ref(0);
const priceMax = ref(0);
const selectedDate = ref("");
const selectedTime = ref("");
const address = ref("");
const bookedSlots = ref<string[]>([]);

const dateOptions: { label: string; desc: string; value: string }[] = [];
const timeSlots = [
  "08:00-08:30", "08:30-09:00", "09:00-09:30", "09:30-10:00",
  "10:00-10:30", "10:30-11:00", "11:00-11:30",
  "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00",
  "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00",
];

onMounted(() => {
  const q = getCurrentPages().pop()?.options || {};
  category.value = q.category || "";
  priceMin.value = Number(q.priceMin) || 0;
  priceMax.value = Number(q.priceMax) || 0;

  // 生成未来3天日期
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const labels = ["今天", "明天", "后天"];
    dateOptions.push({
      label: labels[i],
      desc: `${d.getMonth() + 1}月${d.getDate()}日`,
      value: d.toISOString().slice(0, 10),
    });
  }
  selectedDate.value = dateOptions[0]?.value || "";
});

const chooseLocation = () => {
  if (USE_MOCK) {
    // Mock 模式：直接使用预设地址
    address.value = MOCK_ADDRESS;
    uni.showToast({ title: "已选择演示地址", icon: "success" });
    return;
  }
  uni.chooseLocation({
    success: (res) => {
      address.value = res.address || res.name;
    },
  });
};

const submitOrder = async () => {
  if (!selectedTime.value) {
    uni.showToast({ title: "请选择时间", icon: "none" });
    return;
  }
  if (!address.value) {
    uni.showToast({ title: "请选择地址", icon: "none" });
    return;
  }

  // ---- Mock 模式 ----
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    createOrder({
      category: category.value,
      brand: "",
      fileID: "",
      priceMin: priceMin.value,
      priceMax: priceMax.value,
      date: selectedDate.value,
      timeSlot: selectedTime.value,
      address: address.value,
    });
    uni.showToast({ title: "预约成功", icon: "success" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/orders/orders" });
    }, 1500);
    return;
  }
  // ---- 正式模式 ----

  const res = await wx.cloud.callFunction({
    name: "order-create",
    data: {
      category: category.value,
      brand: "",
      priceMin: priceMin.value,
      priceMax: priceMax.value,
      date: selectedDate.value,
      timeSlot: selectedTime.value,
      address: address.value,
    },
  });

  if (res.result.code === 0) {
    uni.showToast({ title: "预约成功", icon: "success" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/orders/orders" });
    }, 1500);
  }
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--color-surface-gray); padding-bottom: 80px; }
.summary-card {
  background: var(--color-surface);
  padding: 20px 16px;
  text-align: center;
  margin-bottom: 12px;
}
.summary-category { font-size: 18px; font-weight: bold; display: block; }
.summary-price { font-size: 28px; color: var(--color-accent-orange); font-weight: bold; margin-top: 8px; display: block; }
.section { background: var(--color-surface); padding: 16px; margin-bottom: 12px; }
.section-title { font-size: 16px; font-weight: bold; margin-bottom: 12px; display: block; }
.date-scroll { display: flex; gap: 12px; margin-bottom: 16px; }
.date-chip { padding: 10px 16px; border-radius: var(--radius-default); border: 1px solid var(--color-divider); text-align: center; min-width: 80px; }
.date-chip.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.date-day { font-size: 15px; font-weight: bold; display: block; }
.date-desc { font-size: 12px; opacity: 0.8; display: block; margin-top: 4px; }
.time-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.time-chip { padding: 8px 14px; border-radius: 20px; font-size: 14px; background: var(--color-surface-gray); border: 1px solid var(--color-divider); }
.time-chip.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.time-chip.disabled { opacity: 0.3; }
.address-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.arrow { font-size: 20px; color: var(--color-text-secondary); }
.footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: var(--color-surface); border-top: 1px solid var(--color-divider); }
.submit-btn { background: var(--color-primary); padding: 14px; border-radius: var(--radius-default); text-align: center; }
.submit-btn text { color: #fff; font-size: 16px; font-weight: bold; }
</style>
