<template>
  <div class="layout">
    <div class="sidebar">
      <div class="sidebar-title">recycle</div>
      <div
        v-for="item in menuOptions"
        :key="item.key"
        class="sidebar-item"
        :class="{ active: route.path === item.key }"
        @click="nav(item.key)"
      >
        {{ item.label }}
      </div>
      <div class="sidebar-footer">
        <n-tag type="success" size="small">v1.0.0</n-tag>
        <n-button @click="logout" text size="small" style="margin-top:12px">退出</n-button>
      </div>
    </div>
    <div class="main">
      <div class="header">
        <n-gradient-text :size="16" type="success">{{ currentPage }}</n-gradient-text>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NTag, NButton, NGradientText } from "naive-ui";
import { useWatermark } from "../composables/useWatermark";

const router = useRouter();
const route = useRoute();

// 水印
useWatermark();

const menuOptions = [
  { label: "📊 数据看板", key: "/layout/dashboard" },
  { label: "📋 订单管理", key: "/layout/orders" },
  { label: "✏️ 线下录入", key: "/layout/data-entry" },
  { label: "📊 多端对比", key: "/layout/comparison" },
  { label: "👷 回收员管理", key: "/layout/recyclers" },
  { label: "💰 品类定价", key: "/layout/pricing" },
  { label: "👤 用户管理", key: "/layout/users" },
  { label: "🚀 发布管理", key: "/layout/publish" },
  { label: "⚙️ 系统设置", key: "/layout/settings" },
];

const currentPage = computed(() => {
  const m = menuOptions.find((m) => m.key === route.path);
  return m ? m.label : "管理后台";
});

const nav = (key: string) => router.push(key);
const logout = () => router.push({ name: "login" });
</script>

<style scoped>
.layout { display: flex; height: 100vh; }
.sidebar {
  width: 200px; background: #fff; border-right: 1px solid #eee;
  display: flex; flex-direction: column; flex-shrink: 0;
}
.sidebar-title { padding: 20px 16px; font-size: 16px; font-weight: bold; color: #07C160; border-bottom: 1px solid #eee; }
.sidebar-item {
  padding: 12px 16px; cursor: pointer; font-size: 15px; color: #333;
  border-left: 3px solid transparent; transition: all 0.2s;
}
.sidebar-item:hover { background: #f5f5f5; }
.sidebar-item.active { color: #07C160; background: #07C16010; border-left-color: #07C160; font-weight: bold; }
.sidebar-footer { margin-top: auto; padding: 16px; border-top: 1px solid #eee; }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.header { padding: 0 24px; height: 56px; display: flex; align-items: center; background: #fff; border-bottom: 1px solid #eee; }
.content { flex: 1; padding: 24px; background: #f5f5f5; overflow-y: auto; }
</style>
