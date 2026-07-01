<template>
  <div>
    <n-card title="线下数据录入" :bordered="false">
      <n-form :model="form" label-placement="left" label-width="80">
        <n-grid :cols="3" :x-gap="16">
          <n-form-item-gi label="品类">
            <n-select v-model:value="form.category" :options="categoryOptions" />
          </n-form-item-gi>
          <n-form-item-gi label="重量/数量">
            <n-input-number v-model:value="form.quantity" :min="0" />
          </n-form-item-gi>
          <n-form-item-gi label="金额(¥)">
            <n-input-number v-model:value="form.amount" :min="0" />
          </n-form-item-gi>
          <n-form-item-gi label="来源">
            <n-select v-model:value="form.source" :options="[{label:'门店',value:'门店'},{label:'电话',value:'电话'},{label:'熟人',value:'熟人'}]" />
          </n-form-item-gi>
          <n-form-item-gi label="回收员">
            <n-select v-model:value="form.recyclerId" :options="recyclerOptions" />
          </n-form-item-gi>
          <n-form-item-gi label="日期">
            <n-date-picker v-model:value="form.date" type="date" />
          </n-form-item-gi>
        </n-grid>
        <n-button type="primary" @click="submit" :loading="submitting">保存</n-button>
      </n-form>

      <n-divider />

      <n-upload accept=".xlsx,.xls" :max="1">
        <n-button>批量导入 Excel</n-button>
      </n-upload>
      <n-button style="margin-left:12px" @click="downloadTemplate">下载模板</n-button>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCard, NForm, NFormItemGi, NGrid, NSelect, NInputNumber, NDatePicker, NButton, NUpload, NDivider, useMessage } from "naive-ui";

const message = useMessage();
const submitting = ref(false);

const form = ref({ category: "", quantity: 1, amount: 0, source: "门店", recyclerId: "", date: Date.now() });
const categoryOptions = [{ label: "冰箱", value: "冰箱" }, { label: "洗衣机", value: "洗衣机" }, { label: "电视", value: "电视" }, { label: "空调", value: "空调" }, { label: "电脑", value: "电脑" }, { label: "废纸", value: "废纸" }, { label: "废金属", value: "废金属" }, { label: "塑料", value: "塑料" }];
const recyclerOptions = [{ label: "老李", value: "1" }];

const submit = async () => {
  submitting.value = true;
  // 调用云函数 admin-create-order
  message.success("录入成功");
  submitting.value = false;
};

const downloadTemplate = () => message.info("模板下载功能开发中");
</script>
