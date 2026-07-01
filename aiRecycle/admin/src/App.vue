<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider, NNotificationProvider, NMessageProvider } from "naive-ui";


const themeOverrides = {
  common: {
    primaryColor: "#07C160",
    primaryColorHover: "#06AD56",
    borderRadius: "12px",
  },
};
</script>
