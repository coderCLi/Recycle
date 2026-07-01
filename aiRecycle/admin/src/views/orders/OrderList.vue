<template>
  <n-card :bordered="false" title="订单管理" size="small">
    <template #header-extra>
      <n-space align="center">
        <n-input v-model:value="keyword" placeholder="搜索订单..." clearable style="width:180px" @keyup.enter="loadOrders">
          <template #prefix><span style="color:#999">🔍</span></template>
        </n-input>
        <n-select v-model:value="statusFilter" :options="statusOptions" clearable placeholder="状态筛选" style="width:120px" size="small" @update:value="loadOrders" />
        <n-date-picker v-model:value="dateRange" type="daterange" clearable style="width:230px" size="small" @update:value="loadOrders" />
        <n-button size="small" @click="onReset">重置</n-button>
        <n-button size="small" type="primary" @click="onCreate">+ 新建</n-button>
        <n-button v-if="checkedKeys.length > 0" size="small" type="error" ghost @click="onDelete">删除 ({{ checkedKeys.length }})</n-button>
      </n-space>
    </template>
    <n-data-table
      :columns="columns"
      :data="orders"
      :loading="loading"
      :row-key="(r: any) => r._id"
      :checked-row-keys="checkedKeys"
      @update:checked-row-keys="checkedKeys = $event"
      :pagination="{ pageSize: 10, showSizePicker: true, pageSizes: [10, 20, 50] }"
    />
  </n-card>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { NCard, NDataTable, NTag, NSelect, NDatePicker, NButton, NInput, NSpace, useMessage } from "naive-ui";
import { getOrders } from "../../mock/orders";

const message = useMessage();
const USE_MOCK = true;

const orders = ref<any[]>([]);
const loading = ref(false);
const keyword = ref("");
const statusFilter = ref<string | null>(null);
const dateRange = ref<[number, number] | null>(null);
const checkedKeys = ref<string[]>([]);

const statusOptions = [
  { label: "全部", value: "" },
  { label: "待确认", value: "pending" }, { label: "已派单", value: "assigned" },
  { label: "已出发", value: "en_route" }, { label: "服务中", value: "serving" },
  { label: "已完成", value: "completed" }, { label: "已取消", value: "cancelled" },
];

const statusColors: Record<string,string> = { pending:"warning", assigned:"info", en_route:"info", serving:"success", completed:"success", cancelled:"default" };
const statusLabels: Record<string,string> = { pending:"待确认", assigned:"已派单", en_route:"已出发", serving:"服务中", completed:"已完成", cancelled:"已取消" };

// 操作列
function renderActions(row: any) {
  return h("div", { style: "display:flex;gap:4px;justify-content:flex-end;" }, [
    h(NButton, { text: true, size: "tiny", type: "primary", onClick: () => onEdit(row) }, () => "编辑"),
    h(NButton, { text: true, size: "tiny", type: "error", onClick: () => onDeleteOne(row) }, () => "删除"),
    h(NButton, { text: true, size: "tiny", quaternary: true }, { default: () => "更多 ▾" }),
  ]);
}

const columns = [
  { type: "selection", width: 48 },
  { title: "用户名", key: "category", width: 140,
    render: (r: any) => h("div", { style: "display:flex;align-items:center;gap:8px" }, [
      h("span", { style: `background:${categoryColor(r.category)};color:#fff;border-radius:50%;width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold` }, r.category[0]),
      h("div", {}, [h("div", { style: "font-weight:500;font-size:13px" }, `${r.category}${r.brand ? `·${r.brand}` : ""}`)]),
    ]),
  },
  { title: "手机号/账号", width: 150, ellipsis: { tooltip: true }, render: () => h("span", { style: "color:#666;font-family:monospace" }, "138****8888") },
  { title: "预估金额", key: "estPriceMin", width: 110, render: (r: any) => h("span", { style: "font-weight:500;color:#FAAD14" }, `¥${r.finalPrice || r.estPriceMin}`) },
  { title: "状态", key: "status", width: 90, render: (r: any) => h(NTag, { type: statusColors[r.status] as any, size: "small", bordered: false }, () => statusLabels[r.status]) },
  { title: "回收员", key: "recyclerName", width: 90, render: (r:any) => r.recyclerName || "-" },
  { title: "操作", key: "_action", width: 160, fixed: "right", render: (r:any) => renderActions(r) },
];

const categoryColorMap:Record<string,string> = { 冰箱:"#1890FF", 洗衣机:"#13C2C2", 电视:"#F5222D", 空调:"#FA8C16", 电脑:"#722ED1" };
function categoryColor(c:string){return categoryColorMap[c]||"#999"}

const loadOrders = async () => {
  loading.value = true;
  await new Promise(r=>setTimeout(r,300));
  if (USE_MOCK) {
    let data = getOrders();
    if (statusFilter.value) data=data.filter(o=>o.status===statusFilter.value);
    if (dateRange.value) {
      const[s,e]=dateRange.value;
      data=data.filter(o=>{const t=new Date(o.created).getTime();return t>=s&&t<=e;});
    }
    orders.value = data;
  }
  loading.value = false;
};

function onReset() {
  statusFilter.value=null; dateRange.value=null; keyword.value="";
  loadOrders();
}

function onCreate() { message.info("新建订单（演示）"); }
function onDelete() {
  if (!checkedKeys.value.length) return;
  const d = window.confirm(`确定删除选中的 ${checkedKeys.value.length} 条记录？`);
  if (d) { orders.value=orders.value.filter(o=>!checkedKeys.value.includes(o._id)); checkedKeys.value=[]; }
}
function onDeleteOne(row: any) {
  if (confirm(`确定删除该订单？`)) orders.value=orders.value.filter(o=>o._id!==row._id);
}
function onEdit(row: any) { message.info(`编辑订单：${row._id}`); }

onMounted(loadOrders);
</script>
