<template>
  <div class="page-toolbar">
    <div class="pt-left">
      <!-- 筛选插槽（搜索框等） -->
      <slot name="filters">
        <n-input
          v-if="showSearch"
          :value="searchValue"
          @update:value="$emit('update:searchValue', $event)"
          placeholder="请输入关键词..."
          clearable
          style="width:220px"
        >
          <template #prefix><span style="color:#bbb">🔍</span></template>
        </n-input>
      </slot>
    </div>
    <div class="pt-right">
      <!-- 操作按钮组 -->
      <slot name="actions">
        <template v-if="showCreate">
          <n-button type="primary" @click="$emit('create')">
            <span class="btn-icon">＋</span> 新建
          </n-button>
        </template>
        <template v-if="showDelete">
          <n-button type="error" ghost size="small" @click="$emit('delete')" :disabled="!hasSelection">
            删除
          </n-button>
        </template>
        <template v-if="showImport">
          <n-button size="small" quaternary @click="$emit('import')">📥 导入</n-button>
        </template>
      </slot>
      <!-- 查询/重置 -->
      <n-button type="primary" secondary size="small" @click="$emit('search')" v-if="showSearch">查询</n-button>
      <n-button size="small" quaternary @click="$emit('reset')" v-if="showSearch">重置</n-button>

      <!-- 工具图标 -->
      <div class="pt-tools">
        <button class="tool-btn" title="刷新数据" @click="$emit('refresh')">↻</button>
        <button class="tool-btn" title="内容全屏" @click="$emit('fullscreen')">⛶</button>
        <button class="tool-btn" title="列设置" @click="$emit('columnSetting')">☰</button>
        <button class="tool-btn" title="更多操作" @click="showMore = !showMore">•••</button>
      </div>

      <!-- 展开收起 -->
      <n-button text size="small" @click="expanded = !expanded">{{ expanded ? "收起" : "展开" }} ▾</n-button>
    </div>

    <!-- 更多操作下拉 -->
    <transition name="fade">
      <div v-if="showMore" class="more-panel">
        <slot name="moreActions">
          <div class="more-item" @click="handleMore('export')">📤 导出数据</div>
          <div class="more-item" @click="handleMore('print')">🖨️ 打印</div>
          <div class="more-item" @click="handleMore('batchEdit')">✏️ 批量编辑</div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { NButton, NInput } from "naive-ui";

withDefaults(defineProps<{
  showSearch?: boolean;
  showCreate?: boolean;
  showDelete?: boolean;
  showImport?: boolean;
  hasSelection?: boolean;
  searchValue?: string;
}>(), {
  showSearch: true,
  showCreate: false,
  showDelete: true,
  showImport: false,
  hasSelection: false,
  searchValue: "",
});

defineEmits<{
  (e: "update:searchValue", val: string): void;
  (e: "search"): void;
  (e: "reset"): void;
  (e: "create"): void;
  (e: "delete"): void;
  (e: "import"): void;
  (e: "refresh"): void;
  (e: "fullscreen"): void;
  (e: "columnSetting"): void;
}>();

const expanded = ref(true);
const showMore = ref(false);

function handleMore(action: string) {
  // 点击外部关闭
  setTimeout(() => { showMore.value = false; }, 200);
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest(".pt-tools") && !target.closest(".more-panel")) {
    showMore.value = false;
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>

<style scoped>
.page-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: #fff; border-radius: 8px;
  margin-bottom: 16px; flex-wrap: wrap; gap: 12px;
  position: relative;
}
.pt-left, .pt-right {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.btn-icon { margin-right: 4px; }
.pt-tools {
  display: flex; align-items: center; gap: 2px; margin-left: 8px;
  padding-left: 8px; border-left: 1px solid #f0f0f0;
}
.tool-btn {
  width: 28px; height: 28px; border: none; background: transparent;
  border-radius: 5px; cursor: pointer; font-size: 14px; color: #666;
  display: inline-flex; align-items: center; justify-content: center; transition: all .15s;
}
.tool-btn:hover { background: #f5f5f5; color: #333; }

.more-panel {
  position: absolute; right: 20px; top: 100%;
  margin-top: 4px; background: #fff; border: 1px solid #e8e8e8;
  border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,.08);
  z-index: 100; min-width: 140px; padding: 4px 0; overflow: hidden;
}
.more-item {
  padding: 8px 16px; font-size: 13px; color: #555; cursor: pointer;
  transition: background .15s;
}
.more-item:hover { background: #f5f5f5; }

.fade-enter-active,.fade-leave-active{transition:all .15s ease}
.fade-enter-from,.fade-leave-to{opacity:0;transform:translateY(-4px)}
</style>
