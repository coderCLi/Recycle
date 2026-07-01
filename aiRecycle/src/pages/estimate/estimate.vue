<template>
  <view class="page">
    <!-- 照片区域 -->
    <view class="photo-section">
      <image :src="imagePath" mode="aspectFit" class="photo" />
      <view class="retake-btn" @click="retakePhoto">
        <text>重新拍摄</text>
      </view>
    </view>

    <!-- 识别中 -->
    <view class="loading-section" v-if="status === 'loading'">
      <view class="loading-spinner"></view>
      <text class="loading-text">识别中...</text>
    </view>

    <!-- 识别失败 -->
    <view class="error-section" v-if="status === 'error'">
      <text class="error-icon">😕</text>
      <text class="error-text">{{ errorMsg }}</text>
      <view class="retry-btn" @click="recognize">
        <text>重试</text>
      </view>
    </view>

    <!-- 手动选择品类（识别失败后） -->
    <view class="manual-section" v-if="status === 'manual'">
      <text class="section-title">手动选择品类</text>
      <view class="category-grid">
        <view
          v-for="cat in categories"
          :key="cat"
          class="category-chip"
          :class="{ active: selectedCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </view>
      </view>
    </view>

    <!-- 识别结果 + 估价 -->
    <view class="result-section" v-if="status === 'success'">
      <view class="result-card">
        <text class="result-category">{{ result.category }}</text>
        <text class="result-brand" v-if="result.brand">{{ result.brand }}</text>
      </view>

      <!-- 估价展示 -->
      <view class="price-card" v-if="price.loaded">
        <text class="price-value">¥{{ price.min }}-{{ price.max }}</text>
        <text class="price-hint">预估区间，最终价格以回收员上门确认为准</text>
      </view>
      <view class="price-loading" v-else>
        <text>计算价格中...</text>
      </view>

      <view class="next-btn" @click="goBooking">
        <text>预约上门回收</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// ====== 演示 Mock 模式（后端配好后删掉下面这行就行） ======
const USE_MOCK = true;

const imagePath = ref("");
const status = ref<"loading" | "success" | "error" | "manual">("loading");
const errorMsg = ref("");
const result = ref({ category: "", brand: "", confidence: 0, fileID: "" });
const price = ref({ min: 0, max: 0, loaded: false });

const categories = [
  "冰箱", "洗衣机", "电视", "空调", "电脑",
  "手机", "废纸", "废金属", "塑料", "其他",
];
const selectedCategory = ref("");

// ====== Mock 数据 ======
const MOCK_RECOGNIZE = [
  { category: "冰箱", brand: "海尔", confidence: 0.92 },
  { category: "洗衣机", brand: "小天鹅", confidence: 0.89 },
  { category: "电视", brand: "海信", confidence: 0.85 },
  { category: "空调", brand: "格力", confidence: 0.91 },
  { category: "电脑", brand: "联想", confidence: 0.78 },
  { category: "手机", brand: "华为", confidence: 0.83 },
  { category: "冰箱", brand: "美的", confidence: 0.87 },
  { category: "洗衣机", brand: "海尔", confidence: 0.94 },
  { category: "空调", brand: "美的", confidence: 0.88 },
  { category: "电视", brand: "TCL", confidence: 0.86 },
  { category: "微波炉", brand: "格兰仕", confidence: 0.90 },
  { category: "热水器", brand: "史密斯", confidence: 0.84 },
];

const MOCK_PRICES: Record<string, { min: number; max: number }> = {
  "冰箱": { min: 110, max: 190 },
  "洗衣机": { min: 90, max: 150 },
  "电视": { min: 70, max: 130 },
  "空调": { min: 150, max: 250 },
  "电脑": { min: 55, max: 105 },
  "手机": { min: 40, max: 80 },
  "微波炉": { min: 20, max: 40 },
  "热水器": { min: 70, max: 130 },
  "废纸": { min: 10, max: 20 },
  "废金属": { min: 17, max: 33 },
  "塑料": { min: 7, max: 13 },
  "其他": { min: 10, max: 30 },
};

let mockIndex = 0; // 每次识别轮换品类，方便演示

onMounted(() => {
  const query = getCurrentPages().pop()?.options || {};
  imagePath.value = decodeURIComponent(query.imagePath || "");
  if (imagePath.value) recognize();
});

const recognize = async () => {
  if (!imagePath.value) {
    status.value = "error";
    errorMsg.value = "未获取到照片，请重新拍摄";
    return;
  }

  status.value = "loading";

  // ---- Mock 模式 ----
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
    const mock = MOCK_RECOGNIZE[mockIndex % MOCK_RECOGNIZE.length];
    mockIndex++;
    result.value = { ...mock, fileID: imagePath.value };
    status.value = "success";
    calculatePrice();
    return;
  }
  // ---- 正式模式 ----

  try {
    const uploadRes = await wx.cloud.uploadFile({
      cloudPath: `photos/${Date.now()}.jpg`,
      filePath: imagePath.value,
    });

    const res = await wx.cloud.callFunction({
      name: "recognize-item",
      data: { fileID: uploadRes.fileID },
    });

    if (res.result.code === 0) {
      result.value = { ...res.result.data, fileID: uploadRes.fileID };
      status.value = "success";
      calculatePrice();
    } else {
      errorMsg.value = res.result.message || "AI 识别失败，请手动选择品类";
      status.value = "manual";
    }
  } catch (err: any) {
    status.value = "error";
    const errMsg = err?.errMsg || err?.message || "";
    if (errMsg.includes("cloud function") || errMsg.includes("timeout")) {
      errorMsg.value = "识别服务繁忙，请稍后重试";
    } else if (errMsg.includes("upload")) {
      errorMsg.value = "照片上传失败，请检查网络后重试";
    } else {
      errorMsg.value = "没拍清楚，换个角度再试一次？";
    }
  }
};

const calculatePrice = async () => {
  // ---- Mock 模式 ----
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    const p = MOCK_PRICES[result.value.category] || MOCK_PRICES["其他"];
    const brandBonus = result.value.brand ? Math.round(p.min * 0.1) : 0;
    price.value = {
      min: p.min + brandBonus,
      max: p.max + brandBonus,
      loaded: true,
    };
    return;
  }
  // ---- 正式模式 ----

  const res = await wx.cloud.callFunction({
    name: "price-calculate",
    data: { category: result.value.category, brand: result.value.brand },
  });
  if (res.result.code === 0) {
    price.value = { ...res.result.data, loaded: true };
  }
};

const selectCategory = (cat: string) => {
  selectedCategory.value = cat;
  result.value.category = cat;
  result.value.brand = "";
  status.value = "success";
  calculatePrice();
};

const retakePhoto = () => {
  uni.navigateBack();
};

const goBooking = () => {
  uni.navigateTo({
    url: `/pages/booking/booking?category=${result.value.category}&brand=${result.value.brand || ""}&fileID=${result.value.fileID}&priceMin=${price.value.min}&priceMax=${price.value.max}`,
  });
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--color-surface-gray);
}

.photo-section {
  position: relative;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 360px;
}

.photo {
  max-width: 100%;
  max-height: 100%;
}

.retake-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
}
.retake-btn text {
  color: #fff;
  font-size: 14px;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-divider);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: var(--color-text-secondary);
}

.error-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 16px;
}

.error-icon { font-size: 48px; margin-bottom: 12px; }

.error-text {
  font-size: 16px;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 24px;
}

.retry-btn {
  background: var(--color-primary);
  padding: 12px 32px;
  border-radius: 24px;
}
.retry-btn text { color: #fff; font-size: 16px; }

.section-title {
  font-size: 16px;
  font-weight: bold;
  padding: 16px;
  display: block;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 16px;
  gap: 12px;
}

.category-chip {
  padding: 10px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: 24px;
  font-size: 15px;
}

.category-chip.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.result-section {
  padding: 16px;
}

.result-card {
  background: var(--color-surface);
  border-radius: var(--radius-default);
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
}

.result-category {
  font-size: 22px;
  font-weight: bold;
  display: block;
}

.result-brand {
  font-size: 16px;
  color: var(--color-text-secondary);
  display: block;
  margin-top: 8px;
}

.next-btn {
  background: var(--color-primary);
  padding: 14px;
  border-radius: var(--radius-default);
  text-align: center;
  margin-top: 16px;
}
.next-btn text {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.price-card {
  background: var(--color-surface);
  border-radius: var(--radius-default);
  padding: 24px;
  text-align: center;
}

.price-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-accent-orange);
  display: block;
}

.price-hint {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 12px;
  display: block;
}

.price-loading {
  text-align: center;
  padding: 24px;
  color: var(--color-text-secondary);
}

.manual-section {
  padding: 0 16px;
}
</style>
