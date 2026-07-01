<template>
  <div>
    <n-card title="订单管理" :bordered="false">
      <template #header-extra>
        <n-space>
          <n-select v-model:value="statusFilter" :options="statusOptions" clearable placeholder="状态" style="width:120px" />
          <n-date-picker v-model:value="dateRange" type="daterange" clearable />
          <n-button type="primary" @click="loadOrders">查询</n-button>
        </n-space>
      </template>
      <n-data-table :columns="columns" :data="orders" :loading="loading" :pagination="{ pageSize: 20 }" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { NCard, NDataTable, NButton, NTag, NSelect, NDatePicker, NSpace, useMessage } from "naive-ui";
import { getOrders } from "../../mock/orders";

// ====== 演示 Mock 模式 ======
const USE_MOCK = true;

const message = useMessage();
const orders = ref<any[]>([]);
const loading = ref(false);
const statusFilter = ref<string | null>(null);
const dateRange = ref<[number, number] | null>(null);

const statusOptions = [
  { label: "全部", value: "" },
  { label: "待确认", value: "pending" }, { label: "已派单", value: "assigned" },
  { label: "已出发", value: "en_route" }, { label: "服务中", value: "serving" },
  { label: "已完成", value: "completed" }, { label: "已取消", value: "cancelled" },
];

const statusColors: Record<string, string> = { pending: "warning", assigned: "info", en_route: "info", serving: "success", completed: "success", cancelled: "default" };
const statusLabels: Record<string, string> = { pending: "待确认", assigned: "已派单", en_route: "已出发", serving: "服务中", completed: "已完成", cancelled: "已取消" };

const columns = [
  { title: "来源", key: "source", width: 80, render: (r: any) => h(NTag, { type: r.source === "online" ? "success" : "default", size: "small" }, { default: () => r.source === "online" ? "线上" : "线下" }) },
  { title: "品类", key: "category", width: 100 },
  { title: "金额", key: "estPriceMin", width: 120, render: (r: any) => `¥${r.finalPrice || `${r.estPriceMin}-${r.estPriceMax}`}` },
  { title: "状态", key: "status", width: 100, render: (r: any) => h(NTag, { type: statusColors[r.status] as any, size: "small" }, { default: () => statusLabels[r.status] }) },
  { title: "回收员", key: "recyclerName", width: 100 },
  { title: "地址", key: "address", ellipsis: { tooltip: true } },
  { title: "时间", key: "created", width: 160, render: (r: any) => new Date(r.created).toLocaleString() },
];

const loadOrders = async () => {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 300));

  if (USE_MOCK) {
    orders.value = getOrders();
    // 应用筛选
    if (statusFilter.value) {
      orders.value = orders.value.filter((o) => o.status === statusFilter.value);
    }
    if (dateRange.value) {
      const [s, e] = dateRange.value;
      orders.value = orders.value.filter((o) => {
        const t = new Date(o.created).getTime();
        return t >= s && t <= e;
      });
    }
  }

  loading.value = false;
};

onMounted(loadOrders);
</script>
