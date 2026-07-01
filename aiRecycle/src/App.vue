<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";

onLaunch(() => {
  // 初始化微信云开发
  if (wx.cloud) {
    wx.cloud.init({
      env: "cloudbase-d3grlc95lbad62753",
      traceUser: true,
    });
    console.log("Cloud SDK initialized");
  }
});
</script>

<style>
/* 全局样式 — 遵循 DESIGN.md 设计规范 */
page {
  --color-primary: #07C160;
  --color-primary-dark: #06AD56;
  --color-surface: #FFFFFF;
  --color-surface-gray: #F5F5F5;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #8C8C8C;
  --color-accent-orange: #FA8C16;
  --color-accent-red: #FF4D4F;
  --color-divider: #EEEEEE;
  --radius-default: 12px;
  --spacing-page: 16px;
  --spacing-card: 12px;
  --button-min-height: 48px;

  font-family: "PingFang SC", -apple-system, sans-serif;
  font-size: 16px;
  color: var(--color-text-primary);
  background-color: var(--color-surface-gray);
}
</style>
