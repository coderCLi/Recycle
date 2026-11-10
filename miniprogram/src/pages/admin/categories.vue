<!--
 * @Description: 分类管理（管理员维护一级/二级回收品类，支持长按抖动、拖拽删除）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="cat-admin" :class="{ 'editing-pad': editing || sorting }">

        <view class="top-actions">
          <view class="top-btn primary" @click="addLevel1">+ 一级分类</view>
          <view class="top-btn ghost" @click="initDefault">初始化默认分类</view>
        </view>

        <vc-loading v-if="loading" text="正在加载分类..." />

        <view v-else-if="list.length === 0" class="tip">
          <view class="tip-main">暂无分类</view>
          <view class="tip-sub">点上方「初始化默认分类」可快速生成一套常用分类</view>
        </view>

        <view v-else class="group-list">
          <view
            v-for="(g, gi) in list"
            :key="g._id"
            class="group"
            :class="{
              'group-dragging': sorting && dragIndex === gi,
              'group-placeholder': sorting,
            }"
            :style="sorting && dragIndex === gi ? { transform: 'translateY(' + dragOffsetY + 'px) scale(1.04)' } : ''"
            @longpress="onGroupLongPress(g, gi, $event)"
            @touchmove.stop="onGroupTouchMove($event)"
            @touchend="onGroupTouchEnd"
            @touchcancel="onGroupTouchEnd"
          >
            <view class="group-head">
              <text class="group-name">{{ g.name }}</text>
              <view class="group-actions">
                <text class="group-act add" @click="addLevel2(g)">+ 二级</text>
                <text class="group-act" @click="editCategory(g)">编辑</text>
                <text class="group-act del" @click="delCategory(g)">删除</text>
              </view>
            </view>

            <view v-if="childrenMap[g._id] && childrenMap[g._id].length" class="children">
              <view
                v-for="c in childrenMap[g._id]"
                :key="c._id"
                class="child-item"
                :class="{
                  shaking: editing,
                  dragging: dragging && dragging.id === c._id,
                }"
                :style="dragging && dragging.id === c._id ? dragStyle : ''"
                @longpress.stop="enterEdit(c)"
                @touchstart="onDragStart(c, $event)"
                @touchmove.stop="onDragMove(c, $event)"
                @touchend="onDragEnd(c)"
                @touchcancel="onDragEnd(c)"
                @click="onChildClick(c)"
              >
                <text class="child-name">{{ c.name }}</text>
                <view v-if="editing" class="child-x" @click.stop="delCategory(c)">×</view>
              </view>
            </view>
            <view v-else class="children-empty">还没有二级分类</view>
          </view>
        </view>

        <view class="hint">
          {{ editing ? "编辑中：拖动分类可删除，点 × 删除，点名称可改名" : "提示：长按二级分类可编辑，长按一级分类可拖拽排序" }}
        </view>

        <view v-if="editing" class="exit-edit" @click="exitEdit">完成</view>

        <!-- 排序确认栏 -->
        <view v-if="sorting" class="sort-bar">
          <view class="sort-tip">{{ pendingSort ? "顺序已调整，保存后生效" : "长按并拖动模块调整顺序" }}</view>
          <view class="sort-actions">
            <view class="sort-btn cancel" @click="cancelSort">取消</view>
            <view class="sort-btn confirm" @click="confirmSort">确定</view>
          </view>
        </view>

        <!-- 拖拽删除区 -->
        <view v-if="editing" class="delete-zone" :class="{ active: overDelete }">
          {{ overDelete ? "松手删除「" + (dragging ? dragging.name : "") + "」" : "拖拽到底部删除" }}
        </view>

        <vc-safe-bottom />
      </view>
    </vc-container>
  </view>
</template>

<script>
import { getCategories, addCategory, updateCategory, removeCategory, withLoading } from "@/utils/cloud";
import vcLoading from "@/components/library/base/vc-loading/vc-loading.vue";

const DEFAULT_CATEGORIES = [
  {
    name: "生活电器",
    children: ["电风扇", "空气净化器", "吸尘器", "电视", "洗衣机", "冰箱", "空调", "热水器"],
  },
  {
    name: "厨房电器",
    children: ["微波炉", "油烟机", "燃气灶", "电饭煲"],
  },
  {
    name: "电脑办公",
    children: ["台式主机", "笔记本", "显示器", "电脑机箱"],
  },
  {
    name: "其他家电",
    children: ["其他小家电"],
  },
];

export default {
  name: "adminCategories",
  components: { vcLoading },
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "分类管理" },
          isFullScreen: { value: true },
          containerBackground: { value: "#f5f6f8" },
        },
      },
      loading: true,
      list: [],
      childrenMap: {},
      // 编辑模式
      editing: false,
      longPressed: false,
      // 拖拽
      dragging: null,
      dragOffset: { x: 0, y: 0 },
      overDelete: false,
      // 一级分类拖拽排序
      sorting: false,
      dragIndex: -1,
      dragStartY: 0,
      dragOffsetY: 0,
      originList: [],
      pendingSort: false,
    };
  },
  computed: {
    dragStyle() {
      return {
        transform: `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px) scale(1.08)`,
        zIndex: 99,
        opacity: 0.92,
      };
    },
  },
  onShow() {
    this.loadAll();
  },
  methods: {
    async loadAll() {
      this.loading = true;
      try {
        const res1 = await getCategories(1);
        this.list = (res1 && res1.list) || [];
        const map = {};
        for (const g of this.list) {
          const res2 = await getCategories(2, g._id);
          map[g._id] = (res2 && res2.list) || [];
        }
        this.childrenMap = map;
      } catch (e) {
        console.warn("加载分类失败", e);
        this.list = [];
      } finally {
        this.loading = false;
      }
    },

    // ---------- 编辑模式 ----------
    enterEdit(c) {
      if (this.sorting) return; // 排序模式下不进入二级编辑
      this.longPressed = true;
      this.editing = true;
    },
    exitEdit() {
      this.editing = false;
      this.dragging = null;
      this.dragOffset = { x: 0, y: 0 };
      this.overDelete = false;
    },
    onChildClick(c) {
      if (this.longPressed) {
        this.longPressed = false;
        return;
      }
      if (this.editing) this.editCategory(c);
    },

    // ---------- 一级分类拖拽排序 ----------
    onGroupLongPress(g, index, e) {
      if (this.editing) return; // 二级编辑模式下不触发排序
      if (!this.sorting) {
        // 首次长按：进入排序模式，记录原始顺序用于取消
        this.sorting = true;
        this.originList = this.list.slice();
        this.pendingSort = false;
      }
      this.dragIndex = index;
      this.dragStartY = e.touches[0].clientY;
      this.dragOffsetY = 0;
    },
    onGroupTouchMove(e) {
      if (!this.sorting || this.dragIndex < 0 || this.dragging) return;
      const t = e.touches[0];
      const dy = t.clientY - this.dragStartY;
      this.dragOffsetY = dy;

      // 估算每个一级分类模块高度（约 110px），按位移计算目标位置
      const step = 110;
      const moveSteps = Math.round(dy / step);
      if (moveSteps === 0) return;

      const from = this.dragIndex;
      const to = Math.max(0, Math.min(this.list.length - 1, from + moveSteps));
      if (to === from) return;

      const arr = this.list.slice();
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      this.list = arr;

      this.dragIndex = to;
      this.dragStartY = t.clientY;
      this.dragOffsetY = 0;
      this.pendingSort = true;
    },
    onGroupTouchEnd() {
      if (!this.sorting) return;
      this.dragIndex = -1;
      this.dragOffsetY = 0;
      // 保持在排序模式，等用户点「确定」或「取消」
    },
    cancelSort() {
      // 恢复原始顺序
      this.list = this.originList.slice();
      this.sorting = false;
      this.dragIndex = -1;
      this.dragOffsetY = 0;
      this.pendingSort = false;
      this.bridgeSdk.showToast({ title: "已取消，顺序已还原" });
    },
    async confirmSort() {
      try {
        await withLoading(async () => {
          for (let i = 0; i < this.list.length; i++) {
            const g = this.list[i];
            if (g.sort !== i) {
              await updateCategory(g._id, { sort: i }, true);
              g.sort = i;
            }
          }
        }, "保存中...");
        this.bridgeSdk.showToast({ title: "排序已保存" });
      } catch (e) {
        console.warn("保存排序失败", e);
        this.bridgeSdk.showToast({ title: "排序保存失败" });
      }
      this.sorting = false;
      this.dragIndex = -1;
      this.dragOffsetY = 0;
      this.pendingSort = false;
    },

    // ---------- 拖拽 ----------
    onDragStart(c, e) {
      if (!this.editing) return;
      const t = e.touches[0];
      this.dragging = { id: c._id, name: c.name, startX: t.clientX, startY: t.clientY };
      this.dragOffset = { x: 0, y: 0 };
    },
    onDragMove(c, e) {
      if (!this.dragging || this.dragging.id !== c._id) return;
      const t = e.touches[0];
      this.dragOffset = {
        x: t.clientX - this.dragging.startX,
        y: t.clientY - this.dragging.startY,
      };
      const sys = uni.getSystemInfoSync();
      const windowHeight = sys.windowHeight || 600;
      this.overDelete = t.clientY > windowHeight - 110;
    },
    onDragEnd(c) {
      if (!this.dragging || this.dragging.id !== c._id) return;
      const shouldDelete = this.overDelete;
      this.dragging = null;
      this.dragOffset = { x: 0, y: 0 };
      this.overDelete = false;
      if (shouldDelete) this.delCategory(c);
    },

    // ---------- 增删改 ----------
    addLevel1() {
      this.inputName("添加一级分类", "如：生活电器", async (name) => {
        await addCategory({ level: 1, parentId: "", name, icon: "", color: "", sort: 0 });
        this.bridgeSdk.showToast({ title: "已添加" });
        this.loadAll();
      });
    },
    addLevel2(g) {
      this.inputName(`在「${g.name}」下添加`, "如：空调", async (name) => {
        await addCategory({
          level: 2,
          parentId: g._id,
          name,
          icon: "",
          color: "",
          price: 0,
          sort: 0,
        });
        this.bridgeSdk.showToast({ title: "已添加" });
        this.loadAll();
      });
    },
    editCategory(c) {
      uni.showModal({
        title: "修改名称",
        editable: true,
        content: c.name, // 反显当前名称，方便直接修改
        placeholderText: c.name,
        success: async (res) => {
          if (!res.confirm) return;
          // 低版本微信基础库不支持 editable，res.content 会是 undefined
          if (res.content === undefined) {
            this.bridgeSdk.showToast({ title: "当前微信版本不支持重命名" });
            return;
          }
          const name = String(res.content || "").trim();
          if (!name || name === c.name) return;
          try {
            await updateCategory(c._id, { name });
            this.bridgeSdk.showToast({ title: "已修改" });
            this.loadAll();
          } catch (e) {
            console.warn("修改分类失败", e);
            this.bridgeSdk.showToast({ title: "修改失败" });
          }
        },
      });
    },
    inputName(title, placeholder, onOk) {
      uni.showModal({
        title,
        editable: true,
        placeholderText: placeholder,
        success: async (res) => {
          if (!res.confirm) return;
          const name = String(res.content || "").trim();
          if (!name) {
            this.bridgeSdk.showToast({ title: "名称不能为空" });
            return;
          }
          try {
            await onOk(name);
          } catch (e) {
            console.warn("添加分类失败", e);
            this.bridgeSdk.showToast({ title: "添加失败" });
          }
        },
      });
    },
    delCategory(c) {
      uni.showModal({
        title: "确认删除",
        content: `确定删除「${c.name}」吗？删除后不可恢复`,
        confirmColor: "#ef4444",
        success: async (res) => {
          if (!res.confirm) return;
          try {
            await removeCategory(c._id);
            this.bridgeSdk.showToast({ title: "已删除" });
            this.loadAll();
          } catch (e) {
            console.warn("删除分类失败", e);
            this.bridgeSdk.showToast({ title: "删除失败" });
          }
        },
      });
    },
    initDefault() {
      uni.showModal({
        title: "初始化默认分类",
        content: "将写入 4 个一级分类和对应二级分类，确定继续？",
        success: async (res) => {
          if (!res.confirm) return;
          uni.showLoading({ title: "写入中...", mask: true });
          try {
            for (const g of DEFAULT_CATEGORIES) {
              const r = await addCategory(
                {
                  level: 1,
                  name: g.name,
                  parentId: "",
                  icon: "",
                  color: "",
                  sort: 0,
                },
                true
              );
              const parentId = r.id;
              for (let i = 0; i < g.children.length; i++) {
                await addCategory(
                  {
                    level: 2,
                    name: g.children[i],
                    parentId,
                    icon: "",
                    color: "",
                    price: 0,
                    sort: i,
                  },
                  true
                );
              }
            }
            uni.hideLoading();
            this.bridgeSdk.showToast({ title: "初始化完成" });
            this.loadAll();
          } catch (e) {
            uni.hideLoading();
            console.warn("初始化失败", e);
            this.bridgeSdk.showToast({ title: "初始化失败" });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes shake {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

.cat-admin {
  width: 750rpx;
  min-height: 100vh;
  background: #f5f6f8;
  box-sizing: border-box;
  padding: 24rpx 24rpx 40rpx;

  &.editing-pad {
    padding-bottom: 260rpx;
  }
}

.top-actions {
  display: flex;
  margin-bottom: 24rpx;

  .top-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;

    &.primary {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #fff;
      margin-right: 20rpx;
    }
    &.ghost {
      background: #fff;
      color: #16a34a;
      border: 2rpx solid #16a34a;
    }
  }
}

.tip {
  padding: 120rpx 40rpx;
  text-align: center;

  .tip-main {
    font-size: 30rpx;
    color: #374151;
    font-weight: bold;
  }
  .tip-sub {
    margin-top: 16rpx;
    font-size: 25rpx;
    color: #9ca3af;
    line-height: 38rpx;
  }
}

.group-list {
  .group {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;

    &.group-dragging {
      position: relative;
      z-index: 30;
      box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.22);
      border: 2rpx solid rgba(22, 163, 74, 0.45);
    }
    &.group-placeholder {
      transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1);
    }

    .group-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .group-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #111827;
      }
      .group-actions {
        display: flex;
        align-items: center;

        .group-act {
          font-size: 24rpx;
          color: #6b7280;
          margin-left: 20rpx;

          &.add {
            color: #16a34a;
          }
          &.del {
            color: #ef4444;
          }
        }
      }
    }

    .children {
      display: flex;
      flex-wrap: wrap;
      margin-top: 16rpx;
      padding-top: 6rpx;

      .child-item {
        position: relative;
        padding: 14rpx 26rpx;
        margin: 0 16rpx 18rpx 0;
        border-radius: 10rpx;
        background: #f3f4f6;
        font-size: 26rpx;
        color: #374151;
        transition: transform 0.15s;

        &.shaking {
          animation: shake 0.28s infinite;
        }
        &.dragging {
          animation: none;
          box-shadow: 0 10rpx 26rpx rgba(0, 0, 0, 0.22);
        }

        .child-name {
          font-size: 26rpx;
          color: #374151;
        }

        .child-x {
          position: absolute;
          top: -14rpx;
          right: -14rpx;
          width: 38rpx;
          height: 38rpx;
          border-radius: 50%;
          background: #ef4444;
          color: #fff;
          font-size: 30rpx;
          line-height: 34rpx;
          text-align: center;
          box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.4);
        }
      }
    }

    .children-empty {
      margin-top: 14rpx;
      font-size: 24rpx;
      color: #c0c4cc;
    }
  }
}

.hint {
  margin-top: 10rpx;
  text-align: center;
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 34rpx;
}

.exit-edit {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200rpx;
  height: 76rpx;
  padding: 0 56rpx;
  border-radius: 38rpx;
  background: #16a34a;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.delete-zone {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 170rpx;
  background: rgba(239, 68, 68, 0.06);
  border-top: 2rpx dashed #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #ef4444;
  z-index: 50;

  &.active {
    background: rgba(239, 68, 68, 0.2);
    font-weight: bold;
  }
}

.sort-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -6rpx 24rpx rgba(0, 0, 0, 0.08);
  z-index: 100;

  .sort-tip {
    text-align: center;
    font-size: 24rpx;
    color: #9ca3af;
    margin-bottom: 16rpx;
  }

  .sort-actions {
    display: flex;

    .sort-btn {
      flex: 1;
      height: 84rpx;
      border-radius: 42rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      font-weight: bold;

      &.cancel {
        background: #f3f4f6;
        color: #4b5563;
        margin-right: 20rpx;
      }
      &.confirm {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: #fff;
      }
    }
  }
}
</style>
