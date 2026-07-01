<template>
  <div class="dashboard">
    <!-- 顶部4个统计卡片 + 迷你折线图 -->
    <div class="stat-grid">
      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <span class="stat-icon icon-orders">订单</span>
          <div class="stat-info">
            <div class="stat-label">今日订单</div>
            <div class="stat-value">{{ todayOrders }}</div>
          </div>
          <div ref="sparkOrders" class="sparkline"></div>
        </div>
        <div class="stat-trend" :class="{ up: orderTrend > 0 }">
          {{ orderTrend > 0 ? "+" : "" }}{{ orderTrend }}%
        </div>
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <span class="stat-icon icon-amount">金额</span>
          <div class="stat-info">
            <div class="stat-label">预估金额</div>
            <div class="stat-value">¥{{ todayAmount }}</div>
          </div>
          <div ref="sparkAmount" class="sparkline"></div>
        </div>
        <div class="stat-trend" :class="{ up: amountTrend > 0 }">
          {{ amountTrend > 0 ? "+" : "" }}{{ amountTrend }}%
        </div>
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <span class="stat-icon icon-recycler">回收</span>
          <div class="stat-info">
            <div class="stat-label">在岗回收员</div>
            <div class="stat-value">{{ activeRecyclers }}</div>
          </div>
          <div ref="sparkRecyclers" class="sparkline"></div>
        </div>
        <div class="stat-trend">共 {{ totalRecyclers }} 人</div>
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <div class="stat-body">
          <span class="stat-icon icon-user">用户</span>
          <div class="stat-info">
            <div class="stat-label">注册用户</div>
            <div class="stat-value">{{ totalUsers }}</div>
          </div>
          <div ref="sparkUsers" class="sparkline"></div>
        </div>
        <div class="stat-trend up">本月 +{{ newUsers }}</div>
      </n-card>
    </div>

    <!-- ====== 下半区：左图表 + 右表格 ====== -->
    <div class="bottom-area">
      <!-- 左侧：回收趋势图（柱状+折线双轴） -->
      <n-card title="回收趋势" :bordered="false" size="small" class="chart-card">
        <template #header-extra>
          <n-radio-group v-model:value="trendRange" size="small" type="button">
            <n-radio-button value="week">本周</n-radio-button>
            <n-radio-button value="month">本月</n-radio-button>
          </n-radio-group>
        </template>
        <div style="height:320px" ref="trendChartRef"></div>
      </n-card>

      <!-- 右侧：多模块信息 -->
      <div class="right-col">
        <!-- 品类分布 -->
        <n-card title="品类分布" :bordered="false" size="small" style="margin-bottom:16px">
          <div style="height:160px" ref="categoryChartRef"></div>
        </n-card>

        <!-- 回收员排行 -->
        <n-card title="回收员排行" :bordered="false" size="small" style="margin-bottom:16px">
          <div class="rank-list">
            <div
              v-for="(r, i) in recyclerRank"
              :key="r.name"
              class="rank-row"
              :class="{ 'rank-top': i < 3 }"
            >
              <span class="rank-num">{{ i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : i + 1 }}</span>
              <span class="rank-name">{{ r.name }}</span>
              <n-progress
                type="line"
                :percentage="r.points"
                :show-indicator="false"
                :color="i === 0 ? '#52C41A' : i === 1 ? '#FA8C16' : '#1890FF'"
                style="flex:1; margin:0 12px"
                height="6px"
              />
              <span class="rank-score">{{ r.completed }}单 · {{ r.points }}分</span>
            </div>
          </div>
        </n-card>

        <!-- 最近预约 -->
        <n-card title="最近预约" :bordered="false" size="small">
          <div class="order-mini" v-for="o in recentOrders" :key="o._id">
            <div class="om-left">
              <n-avatar round :size="36" :style="{ background: categoryColor(o.category) }">{{ o.category[0] }}</n-avatar>
              <div class="om-info">
                <div class="om-title">{{ o.category }}{{ o.brand ? `·${o.brand}` : "" }}</div>
                <div class="om-addr">{{ o.address.replace(/富拉尔基区/, "") }}</div>
              </div>
            </div>
            <div class="om-right">
              <n-tag :type="statusType(o.status)" size="small" :bordered="false">{{ statusLabels[o.status] }}</n-tag>
              <span class="om-time">{{ formatTime(o.created) }}</span>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { NCard, NTag, NRadioGroup, NRadioButton, NProgress, NAvatar } from "naive-ui";
import { getOrders } from "../mock/orders";
import * as echarts from "echarts";

// ====== 统计数据 ======
const todayOrders = ref(8);
const orderTrend = ref(33);
const todayAmount = ref(1050);
const amountTrend = ref(18.5);
const activeRecyclers = ref(3);
const totalRecyclers = ref(4);
const totalUsers = ref(47);
const newUsers = ref(12);
const trendRange = ref("week");

// ====== 状态映射 ======
const statusLabels: Record<string, string> = {
  pending: "待确认", assigned: "已派单", en_route: "已出发",
  serving: "服务中", completed: "已完成", cancelled: "已取消",
};
const statusType = (s: string) =>
  ({ pending: "warning", assigned: "info", en_route: "info", serving: "success", completed: "success", cancelled: "default" }[s] || "default") as any;
const categoryColorMap: Record<string, string> = {
  "冰箱": "#1890FF", "洗衣机": "#13C2C2", "电视": "#F5222D",
  "空调": "#FA8C16", "电脑": "#722ED1", "手机": "#52C41A",
};
const categoryColor = (cat: string) => categoryColorMap[cat] || "#999";

// ====== 数据列表 ======
const recentOrders = ref<any[]>([]);
const recyclerRank = ref([
  { name: "老王", completed: 126, points: 92 },
  { name: "老张", completed: 98, points: 85 },
  { name: "老李", completed: 73, points: 78 },
  { name: "小刘", completed: 45, points: 60 },
]);

const formatTime = (t: string) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// ====== 图表 Refs ======
const sparkOrders = ref<HTMLDivElement>();
const sparkAmount = ref<HTMLDivElement>();
const sparkRecyclers = ref<HTMLDivElement>();
const sparkUsers = ref<HTMLDivElement>();
const trendChartRef = ref<HTMLDivElement>();
const categoryChartRef = ref<HTMLDivElement>();
let trendChart: echarts.ECharts | null = null;
let categoryChart: echarts.ECharts | null = null;
let sparkCharts: echarts.ECharts[] = [];

// ====== 迷你折线图数据 ======
function genSparkData(base: number, variance: number, len = 14): number[] {
  const arr: number[] = [];
  let val = base;
  for (let i = 0; i < len; i++) {
    val += (Math.random() - 0.45) * variance;
    val = Math.max(base * 0.5, Math.min(base * 1.5, val));
    arr.push(Math.round(val));
  }
  return arr;
}

function createSparkLine(el: HTMLElement, data: number[], color: string) {
  const chart = echarts.init(el, null, { renderer: "canvas", width: data.length * 10, height: 40 });
  const gradColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: color + "20" },
    { offset: 1, color: color + "00" },
  ]);
  chart.setOption({
    grid: { top: 2, bottom: 2, left: 2, right: 2 },
    xAxis: { type: "category", show: false, boundaryGap: false, data: data.map((_, i) => String(i)) },
    yAxis: { type: "value", show: false, min: Math.min(...data) * 0.9, max: Math.max(...data) * 1.1 },
    series: [{ type: "line", data, smooth: true, symbol: "none", lineStyle: { color, width: 1.5 }, areaStyle: { color: gradColor } }],
  });
  sparkCharts.push(chart);
}

// ====== 趋势柱状+折线双轴图 ======
const weekLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const monthLabels = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
const weekOrderData = [5, 3, 8, 6, 9, 11, 8];
const weekAmountData = [520, 310, 920, 650, 1100, 1380, 950];
const monthOrderData = [3,5,4,7,6,8,9,5,6,8,7,9,11,8,10,12,9,13,11,14,10,15,12,16,13,17,14,18,15,19];
const monthAmountData = [...monthOrderData].map(v => Math.round(v * 115));

function renderTrendChart() {
  if (!trendChartRef.value) return;
  trendChart?.dispose();
  trendChart = echarts.init(trendChartRef.value);
  const isMonth = trendRange.value === "month";
  const labels = isMonth ? monthLabels : weekLabels;
  const orderData = isMonth ? monthOrderData : weekOrderData;
  const amountData = isMonth ? monthAmountData : weekAmountData;

  // 提前创建渐变色，避免内联 new 导致解析问题
  const blueGrad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#1890FF" }, { offset: 1, color: "#69C0FF" }]);
  const greenGrad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#07C160" }, { offset: 1, color: "#95DE64" }]);

  trendChart.setOption({
    tooltip: { trigger: "axis" },
    legend: {
      data: ["订单数(个)", "金额(百元)", "完成率(%)"],
      top: 4,
      textStyle: { fontSize: 12 }
    },
    grid: { top: 50, right: 60, bottom: 24, left: 56 },
    xAxis: { type: "category", data: labels, axisLabel: { fontSize: 11 }, boundaryGap: true },
    yAxis: [
      { type: "value", name: "订单数", position: "left", min: 0, splitNumber: 4 },
      { type: "value", name: "金额", position: "right", min: 0, splitNumber: 4 },
    ],
    series: [
      {
        name: "订单数(个)", type: "bar", data: orderData,
        itemStyle: { color: blueGrad, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 28,
      },
      {
        name: "金额(百元)", type: "bar", data: isMonth ? monthOrderData.map(v => Math.round(v / 10)) : weekAmountData.map(v => Math.round(v / 100)),
        itemStyle: { color: greenGrad, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 28,
      },
      {
        name: "完成率(%)", type: "line", yAxisIndex: 1,
        data: isMonth ? monthOrderData.map(() => Math.round(70 + Math.random() * 25)) : [85, 72, 90, 80, 88, 95, 82],
        smooth: true, symbol: "circle", symbolSize: 6, lineStyle: { width: 2, color: "#FA8C16" },
        itemStyle: { color: "#FA8C16" },
      },
    ],
  });
}

// ====== 品类饼图 ======
function renderCategoryChart() {
  if (!categoryChartRef.value) return;
  categoryChart?.dispose();
  categoryChart = echarts.init(categoryChartRef.value);

  // 从 mock 订单统计品类
  const all = getOrders();
  const catCount: Record<string, number> = {};
  const catColors: Record<string, string> = {
    "冰箱": "#1890FF", "洗衣机": "#13C2C2", "电视": "#F5222D",
    "空调": "#FA8C16", "电脑": "#722ED1",
  };
  all.forEach(o => catCount[o.category] = (catCount[o.category] || 0) + 1);
  Object.keys(catCount).forEach(k => { if (!catColors[k]) catColors[k] = "#999"; });

  const pieData = Object.entries(catCount).map(([k, v]) => ({ value: v, name: k, itemStyle: { color: catColors[k] } }));
  if (!pieData.length) {
    pieData.push({ value: 2, name: "冰箱", itemStyle: { color: "#1890FF" } });
    pieData.push({ value: 2, name: "洗衣机", itemStyle: { color: "#13C2C2" } });
    pieData.push({ value: 1, name: "电视", itemStyle: { color: "#F5222D" } });
    pieData.push({ value: 1, name: "空调", itemStyle: { color: "#FA8C16" } });
  }

  categoryChart.setOption({
    tooltip: { trigger: "item", formatter: "{b}: {c}件 ({d}%)" },
    legend: { orient: "vertical", right: 8, top: "center", textStyle: { fontSize: 12 } },
    series: [{
      type: "pie", radius: ["42%", "68%"], center: ["35%", "50%"],
      label: { show: true, formatter: "{b}\n{d}%", fontSize: 11 },
      data: pieData,
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,.2)" } },
    }],
  });
}

// ====== 初始化 ======
onMounted(async () => {
  const all = getOrders();
  recentOrders.value = all.slice(0, 5);

  await nextTick();

  // 迷你折线图
  if (sparkOrders.value) createSparkLine(sparkOrders.value, genSparkData(6, 3), "#1890FF");
  if (sparkAmount.value) createSparkLine(sparkAmount.value, genSparkData(900, 200), "#FAAD14");
  if (sparkRecyclers.value) createSparkLine(sparkRecyclers.value, genSparkData(3, 1), "#52C41A");
  if (sparkUsers.value) createSparkLine(sparkUsers.value, genSparkData(38, 10), "#722ED1");

  renderTrendChart();
  renderCategoryChart();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  sparkCharts.forEach(c => c.dispose());
  trendChart?.dispose();
  categoryChart?.dispose();
  window.removeEventListener("resize", handleResize);
});

watch(trendRange, () => renderTrendChart());

const handleResize = () => {
  sparkCharts.forEach(c => c.resize());
  trendChart?.resize();
  categoryChart?.resize();
};
</script>

<style scoped>
.dashboard { padding: 0; }

/* ====== 统计卡片网格 ====== */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.stat-card :deep(.n-card__content) { padding: 16px 20px; }
.stat-body {
  display: flex; align-items: center; gap: 14px;
}
.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #fff; flex-shrink: 0;
}
.icon-orders { background: #1890FF; }
.icon-amount { background: #FAAD14; }
.icon-recycler { background: #52C41A; }
.icon-user { background: #722ED1; }
.stat-info { flex: none; }
.stat-label { font-size: 13px; color: #999; line-height: 1.4; }
.stat-value { font-size: 26px; font-weight: bold; color: #333; line-height: 1.2; }
.sparkline {
  flex: 1; min-width: 100px; max-width: 140px; height: 44px;
}
.stat-trend {
  margin-top: 8px; font-size: 13px; color: #8C8C8C;
}
.stat-trend.up { color: #52C41A; }

/* ====== 底部双栏 ====== */
.bottom-area {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 16px;
  min-width: 0;
}
.chart-card { min-width: 0; }

/* ====== 右侧栏 ====== */
.right-col { display: flex; flex-direction: column; min-width: 0; }

/* 排行榜 */
.rank-list {}
.rank-row {
  display: flex; align-items: center; padding: 8px 4px;
  border-bottom: 1px solid #f5f5f5;
}
.rank-row:last-child { border-bottom: none; }
.rank-top { background: linear-gradient(90deg, #FFFBE6 0%, transparent 100%); border-radius: 6px; }
.rank-num { width: 32px; text-align: center; font-size: 16px; flex-shrink: 0; }
.rank-name { width: 48px; font-weight: 500; font-size: 13px; flex-shrink: 0; }
.rank-score { font-size: 12px; color: #666; text-align: right; width: 100px; flex-shrink: 0; }

/* 最近预约 */
.order-mini {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid #f5f5f5;
}
.order-mini:last-child { border-bottom: none; }
.om-left { display: flex; align-items: center; gap: 10px; }
.om-info {}
.om-title { font-size: 14px; font-weight: 500; }
.om-addr { font-size: 12px; color: #999; margin-top: 2px; }
.om-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.om-time { font-size: 11px; color: #bbb; }
</style>
