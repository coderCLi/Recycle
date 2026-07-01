<template>
  <div>
    <n-card title="发布管理" :bordered="false">
      <n-descriptions bordered :column="2">
        <n-descriptions-item label="当前版本">v1.0.0</n-descriptions-item>
        <n-descriptions-item label="审核状态">
          <n-tag type="default">未提交</n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="上次发布">-</n-descriptions-item>
        <n-descriptions-item label="下次版本">v1.0.1</n-descriptions-item>
      </n-descriptions>

      <n-space style="margin-top: 24px">
        <n-button type="primary" @click="submitReview" :loading="submitting">
          🚀 提交审核
        </n-button>
        <n-button type="success" @click="publishRelease" :disabled="!reviewPassed">
          发布上线
        </n-button>
      </n-space>
    </n-card>

    <n-card title="发布历史" :bordered="false" style="margin-top: 16px">
      <n-timeline>
        <n-timeline-item type="info" title="v1.0.0" time="2026-07-01" content="初始版本" />
      </n-timeline>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCard, NDescriptions, NDescriptionsItem, NTag, NSpace, NButton, NTimeline, NTimelineItem, useMessage } from "naive-ui";

const message = useMessage();
const submitting = ref(false);
const reviewPassed = ref(false);

const submitReview = async () => {
  submitting.value = true;
  message.info("正在编译并提交审核...");
  // 调用云函数: compile uni-app → miniprogram-ci upload → submit review
  setTimeout(() => {
    message.success("已提交审核，等待微信审核通过");
    submitting.value = false;
  }, 3000);
};

const publishRelease = () => {
  message.success("已发布上线");
};
</script>
