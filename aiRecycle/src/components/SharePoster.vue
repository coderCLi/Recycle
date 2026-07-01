<template>
  <view class="poster-overlay" v-if="visible" @click="close">
    <view class="poster" @click.stop>
      <view class="poster-bg">
        <text class="poster-title">♻️ 旧物重生</text>
        <text class="poster-category">{{ category }}</text>
        <text class="poster-carbon">减碳 {{ carbon }} 克</text>
        <text class="poster-amount">回收价值 ¥{{ amount }}</text>
        <view class="poster-qr">
          <image :src="qrCode" mode="widthFix" style="width:100px;height:100px" />
        </view>
        <text class="poster-brand">富区旧家电回收</text>
        <text class="poster-slogan">拍照估价 · 上门回收</text>
      </view>
      <view class="poster-actions">
        <button class="save-btn" @click="savePoster">保存图片</button>
        <button class="share-btn" open-type="share">分享给朋友</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ visible: boolean; category: string; amount: number; carbon: number; qrCode: string }>();
const emit = defineEmits(["close"]);

const close = () => emit("close");

const savePoster = () => {
  uni.showToast({ title: "长按海报保存", icon: "none" });
};
</script>

<style scoped>
.poster-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6); z-index: 999;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.poster { width: 300px; }
.poster-bg {
  background: linear-gradient(135deg, #07C160, #06AD56);
  border-radius: 16px; padding: 32px 24px; text-align: center; color: #fff;
}
.poster-title { font-size: 22px; font-weight: bold; display: block; }
.poster-category { font-size: 32px; font-weight: bold; margin: 16px 0; display: block; }
.poster-carbon { font-size: 18px; margin-bottom: 8px; display: block; }
.poster-amount { font-size: 24px; font-weight: bold; color: #FA8C16; background: #fff; display: inline-block; padding: 4px 16px; border-radius: 12px; }
.poster-qr { margin: 20px 0; display: flex; justify-content: center; }
.poster-brand { font-size: 16px; font-weight: bold; display: block; }
.poster-slogan { font-size: 13px; opacity: 0.8; margin-top: 4px; display: block; }
.poster-actions { display: flex; gap: 12px; margin-top: 16px; }
.save-btn, .share-btn { flex: 1; padding: 12px; border-radius: 24px; border: none; font-size: 15px; }
.save-btn { background: #fff; color: #07C160; }
.share-btn { background: #07C160; color: #fff; }
</style>
