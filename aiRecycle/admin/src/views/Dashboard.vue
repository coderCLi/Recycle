<template>
  <div>
    <!-- 顶部统计卡片 -->
    <div class="stat-grid">
      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <div class="stat-icon" style="background:#E6F7FF">📋</div>
          <div class="stat-info">
            <div class="stat-value">{{ todayOrders }}</div>
            <div class="stat-label">今日订单</div>
          </div>
        </div>
        <div class="stat-trend up">较昨日 {{ todayTrend }}</div>
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <div class="stat-icon" style="background:#FFF7E6">💰</div>
          <div class="stat-info">
            <div class="stat-value">¥{{ todayAmount }}</div>
            <div class="stat-label">今日预估金额</div>
          </div>
        </div>
        <div class="stat-trend up">线上 ¥{{ onlineAmount }} 线下 ¥{{ offlineAmount }}</div>
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <div class="stat-icon" style="background:#F6FFED">👷</div>
          <div class="stat-info">
            <div class="stat-value">{{ activeRecyclers }}</div>
            <div class="stat-label">在岗回收员</div>
          </div>
        </div>
        <div class="stat-trend">共 {{ totalRecyclers }} 人</div>
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <div class="stat-icon" style="background:#FFF1F0">👤</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalUsers }}</div>
            <div class="stat-label">注册用户</div>
          </div>
        </div>
        <div class="stat-trend up">本月新增 {{ newUsers }}</div>
      </n-card>
    </div>

    <!-- 订单状态分布 + 近期订单 -->
    <div class="two-col">
      <n-card title="订单概览" :bordered="false" size="small">
        <div style="height:220px" ref="chartRef"></div>
      </n-card>

      <n-card title="近期订单" :bordered="false" size="small">
        <n-table :single-line="false" size="small">
          <thead>
            <tr><th>品类</th><th>金额</th><th>状态</th><th>地址</th><th>时间</th></tr>
          </thead>
          <tbody>
            <tr v-for="o in recentOrders" :key="o._id">
              <td>{{ o.category }} {{ o.brand }}</td>
              <td>¥{{ o.finalPrice || o.estPriceMin }}</td>
              <td><n-tag :type="statusType(o.status)" size="small">{{ statusLabels[o.status] }}</n-tag></td>
              <td>{{ o.address }}</td>
              <td>{{ formatDate(o.created) }}</td>
            </tr>
          </tbody>
        </n-table>
      </n-card>
    </div>

    <!-- 回收员排行榜 -->
    <n-card title="回收员排行" :bordered="false" size="small" style="margin-top:16px">
      <div class="rank-row rank-header">
        <span class="rank-num">#</span>
        <span class="rank-name">姓名</span>
        <span class="rank-count">完成单数</span>
        <span class="rank-score">积分</span>
      </div>
      <div
        v-for="(r, i) in recyclerRank"
        :key="r.name"
        class="rank-row"
        :class="{ 'rank-top': i < 3 }"
      >
        <span class="rank-num">{{ ['🥇','🥈','🥉'][i] || i + 1 }}</span>
        <span class="rank-name">{{ r.name }}</span>
        <span class="rank-count">{{ r.completed }}</span>
        <span class="rank-score">{{ r.points }}</span>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { NCard, NTable, NTag } from "naive-ui";
import { getOrders } from "../mock/orders";
import * as echarts from "echarts";

// ====== Mock 统计数据 ======
const todayOrders = ref(8);
const todayTrend = ref("+33%");
const todayAmount = ref(1050);
const onlineAmount = ref(680);
const offlineAmount = ref(370);
const activeRecyclers = ref(3);
const totalRecyclers = ref(4);
const totalUsers = ref(47);
const newUsers = ref(12);

const statusLabels: Record<string, string> = {
  pending: "待确认", assigned: "已派单", en_route: "已出发",
  serving: "服务中", completed: "已完成", cancelled: "已取消",
};
const statusType = (s: string) =>
  ({ pending: "warning", assigned: "info", en_route: "info", serving: "success", completed: "success", cancelled: "default" }[s] || "default") as any;

const recentOrders = ref<any[]>([]);
const recyclerRank = ref([
  { name: "老王", completed: 126, points: 92 },
  { name: "老张", completed: 98, points: 85 },
  { name: "老李", completed: 73, points: 78 },
  { name: "小刘", completed: 45, points: 60 },
]);

const formatDate = (t: string) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const chartRef = ref<HTMLDivElement>();

onMounted(async () => {
  const all = getOrders();
  recentOrders.value = all.slice(0, 5);

  await nextTick();
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  const statusCount: Record<string, number> = {};
  all.forEach((o) => {
    statusCount[o.status] = (statusCount[o.status] || 0) + 1;
  });
  chart.setOption({
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [{
      type: "pie",
      radius: ["50%", "75%"],
      center: ["50%", "45%"],
      label: { show: true, formatter: "{b}\n{d}%" },
      data: [
        { value: statusCount.pending || 2, name: "待确认", itemStyle: { color: "#FA8C16" } },
        { value: statusCount.assigned || 1, name: "已派单", itemStyle: { color: "#1890FF" } },
        { value: statusCount.en_route || 0, name: "已出发", itemStyle: { color: "#13C2C2" } },
        { value: statusCount.serving || 0, name: "服务中", itemStyle: { color: "#07C160" } },
        { value: statusCount.completed || 2, name: "已完成", itemStyle: { color: "#52C41A" } },
        { value: statusCount.cancelled || 1, name: "已取消", itemStyle: { color: "#8C8C8C" } },
      ],
    }],
  });
});
</script>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.stat-card :deep(.n-card__content) { padding: 16px 20px; }
.stat-body { display: flex; align-items: center; gap: 14px; }
.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 22px;
}
.stat-value { font-size: 26px; font-weight: bold; color: #333; }
.stat-label { font-size: 13px; color: #999; margin-top: 2px; }
.stat-trend { margin-top: 10px; font-size: 12px; color: #999; }
.stat-trend.up { color: #52C41A; }

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.rank-row { display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.rank-header { font-weight: bold; color: #666; font-size: 13px; }
.rank-top { background: #FFFBE6; }
.rank-num { width: 40px; text-align: center; }
.rank-name { flex: 1; }
.rank-count, .rank-score { width: 100px; text-align: center; }
</style>
