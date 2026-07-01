<template>
  <div>
    <n-card title="品类定价配置" :bordered="false">
      <template #header-extra>
        <n-button type="primary" @click="showAdd = true">新增品类</n-button>
      </template>
      <n-data-table :columns="columns" :data="categories" :pagination="false" />
    </n-card>

    <n-card title="估价偏差监控" :bordered="false" style="margin-top: 16px">
      <n-data-table :columns="devColumns" :data="deviations" :pagination="false" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { NCard, NDataTable, NButton, NTag, NInputNumber } from "naive-ui";

const showAdd = ref(false);

const categories = ref([
  { id: 1, name: "冰箱", basePrice: 150, unit: "台", depreciation: 0.15, enabled: true },
  { id: 2, name: "洗衣机", basePrice: 100, unit: "台", depreciation: 0.12, enabled: true },
  { id: 3, name: "电视", basePrice: 80, unit: "台", depreciation: 0.15, enabled: true },
  { id: 4, name: "空调", basePrice: 200, unit: "台", depreciation: 0.12, enabled: true },
  { id: 5, name: "电脑", basePrice: 120, unit: "台", depreciation: 0.2, enabled: true },
]);

const deviations = ref([
  { category: "冰箱", deviation: 5.2, status: "正常" },
  { category: "洗衣机", deviation: 22.1, status: "超标" },
]);

const columns = [
  { title: "品类", key: "name" },
  { title: "基准价(¥)", key: "basePrice" },
  { title: "单位", key: "unit" },
  { title: "年折旧率", key: "depreciation" },
  { title: "状态", key: "enabled", render: (r: any) => h(NTag, { type: r.enabled ? "success" : "default", size: "small" }, { default: () => r.enabled ? "启用" : "禁用" }) },
];

const devColumns = [
  { title: "品类", key: "category" },
  { title: "偏差率", key: "deviation", render: (r: any) => `${r.deviation}%` },
  { title: "状态", key: "status", render: (r: any) => h(NTag, { type: r.deviation > 20 ? "error" : "success", size: "small" }, { default: () => r.status }) },
];
</script>
