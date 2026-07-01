<template>
  <div>
    <n-card title="用户管理" :bordered="false">
      <n-data-table :columns="columns" :data="users" :pagination="{ pageSize: 20 }" />
    </n-card>
    <n-card title="零单用户唤醒" :bordered="false" style="margin-top: 16px">
      <n-data-table :columns="wakeColumns" :data="dormantUsers" :pagination="false" />
      <n-button type="warning" style="margin-top: 12px" @click="wakeAll">一键推送唤醒消息</n-button>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCard, NDataTable, NButton, useMessage } from "naive-ui";

const message = useMessage();

const users = ref([
  { id: 1, nickname: "王姐", phone: "139****5678", orders: 3, lastActive: "2026-07-01" },
  { id: 2, nickname: "小张", phone: "186****9012", orders: 0, lastActive: "2026-06-28" },
]);

const dormantUsers = ref([
  { id: 2, nickname: "小张", estCount: 2, lastEstimate: "2026-06-28", wakeCount: 0 },
]);

const columns = [
  { title: "昵称", key: "nickname" },
  { title: "手机号", key: "phone" },
  { title: "订单数", key: "orders" },
  { title: "最后活跃", key: "lastActive" },
];

const wakeColumns = [
  { title: "用户", key: "nickname" },
  { title: "估价次数", key: "estCount" },
  { title: "最后估价", key: "lastEstimate" },
  { title: "已唤醒次数", key: "wakeCount" },
];

const wakeAll = () => message.success("唤醒消息已推送");
</script>
