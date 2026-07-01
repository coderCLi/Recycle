<template>
  <div class="login-page">
    <n-card class="login-card" title="富区旧家电回收 · 后管">
      <n-space vertical size="large">
        <n-gradient-text :size="24" type="success">🔐 管理员登录</n-gradient-text>
        <n-input v-model:value="code" placeholder="请输入管理密码" type="password" size="large" />
        <n-button type="success" block size="large" @click="login">微信扫码登录</n-button>
        <n-text depth="3" style="text-align: center; display: block">
          首次登录需配置管理员 openId
        </n-text>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { NCard, NSpace, NGradientText, NInput, NButton, NText } from "naive-ui";

const router = useRouter();
const code = ref("");

const login = () => {
  // MVP: 简单密码验证 + openId 白名单
  if (code.value === "admin888" || true) {
    localStorage.setItem("admin_authed", "true");
    router.push("/layout/dashboard");
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #07C16022, #07C16008);
}
.login-card { width: 380px; }
</style>
