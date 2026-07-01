<template>
  <div>
    <n-card title="多端数据对比" :bordered="false">
      <template #header-extra>
        <n-radio-group v-model:value="period" size="small">
          <n-radio-button value="day">日</n-radio-button>
          <n-radio-button value="week">周</n-radio-button>
          <n-radio-button value="month">月</n-radio-button>
        </n-radio-group>
      </template>
      <n-grid :cols="2" :x-gap="16">
        <n-grid-item><div ref="chart1" style="height:300px"></div></n-grid-item>
        <n-grid-item><div ref="chart2" style="height:300px"></div></n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NCard, NGrid, NGridItem, NRadioGroup, NRadioButton } from "naive-ui";
import * as echarts from "echarts";

const period = ref("month");
const chart1 = ref();
const chart2 = ref();

onMounted(() => {
  const opt1 = {
    tooltip: { trigger: "axis" },
    legend: { data: ["线上", "线下"] },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
    yAxis: { type: "value", name: "单量" },
    series: [
      { name: "线上", type: "bar", data: [0, 0, 0, 0, 0, 0], itemStyle: { color: "#07C160" } },
      { name: "线下", type: "bar", data: [20, 20, 20, 20, 20, 20], itemStyle: { color: "#ddd" } },
    ],
  };
  const opt2 = {
    tooltip: { trigger: "axis" },
    legend: { data: ["线上金额", "线下金额"] },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
    yAxis: { type: "value", name: "金额(¥)" },
    series: [
      { name: "线上金额", type: "line", data: [0, 0, 0, 0, 0, 0], itemStyle: { color: "#07C160" } },
      { name: "线下金额", type: "line", data: [8000, 8000, 8000, 8000, 8000, 8000], itemStyle: { color: "#ddd" } },
    ],
  };

  if (chart1.value) echarts.init(chart1.value).setOption(opt1);
  if (chart2.value) echarts.init(chart2.value).setOption(opt2);
});
</script>
