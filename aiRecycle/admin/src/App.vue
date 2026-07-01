<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { zhCN, dateZhCN, NConfigProvider, NNotificationProvider, NMessageProvider, darkTheme } from "naive-ui";

// 全局主题状态（与 Layout.vue 共享 via localStorage）
const isDark = ref(localStorage.getItem("admin_dark") === "true");
const theme = ref(isDark.value ? darkTheme : null);

watch(isDark, (v) => {
  theme.value = v ? darkTheme : null;
  localStorage.setItem("admin_dark", String(v));
});

// 暴露到 window 供 Layout 调用
(window as any).__setAdminDark = (v: boolean) => { isDark.value = v; };

const themeOverrides = {
  common: {
    primaryColor: "#07C160",
    primaryColorHover: "#06AD56",
    borderRadius: "12px",
  },
};
</script>

<style>
body, html { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
</style>
