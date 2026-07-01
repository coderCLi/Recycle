<template>
  <div>
    <n-card title="系统设置" :bordered="false">
      <n-form label-placement="left" label-width="120">
        <n-form-item label="小程序 AppID">
          <n-input value="wx3d3c2d5d5ac27f26" readonly />
        </n-form-item>
        <n-form-item label="云环境 ID">
          <n-input value="cloudbase-d3grlc95lbad62753" readonly />
        </n-form-item>
        <n-form-item label="订阅消息模板ID">
          <n-input placeholder="输入模板ID" />
        </n-form-item>
        <n-form-item label="竞品监控">
          <n-dynamic-input v-model:value="competitors" placeholder="竞品名称+URL" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="save">保存设置</n-button>
        </n-form-item>
      </n-form>
    </n-card>
    <n-card title="数据导出" :bordered="false" style="margin-top: 16px">
      <n-space>
        <n-button @click="exportData('orders')">导出订单数据</n-button>
        <n-button @click="exportData('users')">导出用户数据</n-button>
        <n-button @click="exportData('recyclers')">导出回收员数据</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCard, NForm, NFormItem, NInput, NDynamicInput, NButton, NSpace, useMessage } from "naive-ui";

const message = useMessage();
const competitors = ref([]);

const save = () => message.success("设置已保存");
const exportData = (type: string) => message.info(`${type} 数据导出中...`);
</script>
