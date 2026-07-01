<template>
  <div>
    <n-card title="回收员管理" :bordered="false">
      <template #header-extra>
        <n-button type="primary" @click="showAdd = true">添加回收员</n-button>
      </template>
      <n-data-table :columns="columns" :data="recyclers" :pagination="{ pageSize: 20 }" />
    </n-card>

    <n-card title="积分排行" :bordered="false" style="margin-top: 16px">
      <n-data-table :columns="rankColumns" :data="rankings" :pagination="false" />
    </n-card>

    <n-modal v-model:show="showAdd" title="添加回收员">
      <n-form :model="newRecycler" label-placement="left" label-width="80">
        <n-form-item label="姓名"><n-input v-model:value="newRecycler.name" /></n-form-item>
        <n-form-item label="手机号"><n-input v-model:value="newRecycler.phone" /></n-form-item>
        <n-form-item label="区域"><n-input v-model:value="newRecycler.area" /></n-form-item>
      </n-form>
      <template #action><n-button type="primary" @click="addRecycler">确认</n-button></template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { NCard, NDataTable, NButton, NTag, NModal, NForm, NFormItem, NInput, useMessage } from "naive-ui";

const message = useMessage();
const showAdd = ref(false);
const newRecycler = ref({ name: "", phone: "", area: "富拉尔基" });

const recyclers = ref([
  { id: 1, name: "老李", phone: "138****1234", area: "富拉尔基", status: "在岗", todayOrders: 6 },
]);

const rankings = ref([
  { rank: "🥇", name: "老李", points: 95, orders: 42, satisfaction: 4.8, response: "12min" },
]);

const columns = [
  { title: "姓名", key: "name" },
  { title: "手机号", key: "phone" },
  { title: "区域", key: "area" },
  { title: "状态", key: "status", render: (r: any) => h(NTag, { type: r.status === "在岗" ? "success" : "default", size: "small" }, { default: () => r.status }) },
  { title: "今日单量", key: "todayOrders" },
];

const rankColumns = [
  { title: "排名", key: "rank", width: 60 },
  { title: "姓名", key: "name" },
  { title: "积分", key: "points" },
  { title: "单量", key: "orders" },
  { title: "满意度", key: "satisfaction" },
  { title: "响应", key: "response" },
];

const addRecycler = () => {
  message.success("回收员已添加");
  showAdd.value = false;
};
</script>
