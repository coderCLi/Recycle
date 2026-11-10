<!--
 * @Description: 管理端 - 全部预约（openid 白名单，支持左滑/长按/批量删除）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="admin">

        <!-- 检查中 -->
        <view v-if="checking" class="tip">检查权限中...</view>

        <!-- 需要绑定 -->
        <view v-else-if="needBind" class="pwd-box">
          <view class="pwd-title">管理员绑定</view>
          <view class="pwd-desc">首次使用请输入绑定码，绑定后本微信免口令进入</view>
          <input class="pwd-input" v-model="bindCode" type="number" password placeholder="请输入绑定码" />
          <view class="pwd-btn" @click="bindAdmin">绑定并使用</view>
          <view class="pwd-tip">绑定码在云开发控制台 config 集合（key = admin_password）</view>
        </view>

        <!-- 读取失败 -->
        <view v-else-if="noPermission" class="no-perm">
          <view class="no-perm-icon">!</view>
          <view class="no-perm-text">读取失败</view>
          <view class="no-perm-desc">请检查云函数 adminGetAppointments 是否部署成功、appointments 集合是否存在</view>
        </view>

        <!-- 列表 -->
        <template v-else>
          <!-- 筛选 + 管理按钮 -->
          <view class="toolbar">
            <view class="tabs">
              <view
                v-for="t in tabs"
                :key="t.key"
                class="tab"
                :class="{ active: filter === t.key }"
                @click="filter = t.key"
              >
                <text class="tab-name">{{ t.name }}</text>
                <text class="tab-count">{{ countBy(t.key) }}</text>
              </view>
            </view>
            <view v-if="canManage" class="manage-btn" :class="{ active: managing }" @click="toggleManage">
              {{ managing ? "完成" : "管理" }}
            </view>
          </view>

          <scroll-view
            class="scroll-body"
            scroll-y
            :refresher-enabled="true"
            :refresher-triggered="refreshing"
            refresher-background="#f5f6f8"
            :lower-threshold="80"
            @refresherrefresh="onRefresh"
            @scrolltolower="loadMore"
          >
          <vc-loading v-if="loading" text="正在加载预约..." />

          <view v-else-if="filteredList.length === 0" class="tip">暂无预约，下拉刷新</view>

          <view v-else class="list">
            <view v-for="order in filteredList" :key="order._id" class="card-wrap">
              <!-- 左滑露出的删除按钮 -->
              <view
                class="swipe-delete"
                :class="{ restore: isRecycleBin }"
                @click.stop="onSwipeAction(order)"
              >
                {{ swipeActionText }}
              </view>

              <!-- 卡片 -->
              <view
                class="card"
                :class="{ selected: selectedIds.includes(order._id) }"
                :style="{ transform: 'translateX(' + (swipeOffset[order._id] || 0) + 'px)' }"
                @touchstart="onTouchStart(order, $event)"
                @touchmove="onTouchMove(order, $event)"
                @touchend="onTouchEnd(order)"
                @touchcancel="onTouchEnd(order)"
                @longpress="onLongPress(order)"
                @click="onCardClick(order)"
              >
                <view class="card-head">
                  <view class="name-row">
                    <view v-if="managing" class="checkbox" :class="{ checked: selectedIds.includes(order._id) }">✓</view>
                    <text class="name">{{ order.name }}</text>
                    <text class="status" :class="order.status">{{ statusText(order.status) }}</text>
                  </view>
                  <text class="price">¥{{ priceOf(order) }}</text>
                </view>

                <view class="row">
                  <text class="label">物品</text>
                  <text class="value">{{ itemText(order) }}</text>
                </view>
                <view class="row">
                  <text class="label">电话</text>
                  <text class="value link" @click.stop="call(order.phone)">{{ order.phone }}</text>
                </view>
                <view class="row">
                  <text class="label">地址</text>
                  <text class="value clamp2">{{ order.address }}</text>
                </view>

                <view v-if="!managing" class="actions">
                  <view class="btn call" @click.stop="call(order.phone)">拨打电话</view>
                  <view v-if="order.status !== 'done'" class="btn done" @click.stop="updateStatus(order, 'done')">标记完成</view>
                  <view v-else class="btn revert" @click.stop="updateStatus(order, 'pending')">恢复待处理</view>
                </view>
              </view>
            </view>
          </view>

            <!-- 加载更多状态 -->
            <view v-if="!loading && list.length > 0" class="load-more">
              {{ loadingMore ? "加载中..." : (hasMore ? "上拉加载更多" : "没有更多了") }}
            </view>

            <view v-if="managing" class="list-bottom-space"></view>
          </scroll-view>

          <!-- 批量删除栏 -->
          <view v-if="managing" class="batch-bar">
            <view class="select-all" @click="toggleSelectAll">
              <view class="checkbox" :class="{ checked: allSelected }">✓</view>
              <text class="select-all-text">{{ allSelected ? "取消全选" : "全选" }}</text>
            </view>
            <view class="batch-text">已选 {{ selectedIds.length }} 条</view>
            <view
              class="batch-btn"
              :class="{ disabled: selectedIds.length === 0, restore: isRecycleBin }"
              @click="onBatchAction"
            >
              {{ batchActionText }}
            </view>
          </view>

        </template>

        <vc-safe-bottom />
      </view>
    </vc-container>
  </view>
</template>

<script>
import {
  adminMe,
  adminListPage,
  adminBind,
  adminRemoveAppointment,
  adminBatchRemoveAppointments,
  adminRestoreAppointment,
  adminBatchRestoreAppointments,
  adminUpdateAppointmentStatus,
} from "@/utils/cloud";
import vcLoading from "@/components/library/base/vc-loading/vc-loading.vue";

export default {
  name: "adminAppointments",
  components: { vcLoading },
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "预约管理" },
          isFullScreen: { value: true },
          disableScroll: { value: true },
          containerBackground: { value: "#f5f6f8" },
        },
      },
      refreshing: false,
      checking: true,
      needBind: false,
      isAdmin: false,
      bindCode: "",
      loading: false,
      noPermission: false,
      list: [],
      filter: "all",
      page: 1,
      pageSize: 20,
      hasMore: true,
      loadingMore: false,
      counts: { all: 0, pending: 0, done: 0, deleted: 0 },
      showFilterMenu: false,
      tabs: [
        { key: "all", name: "全部" },
        { key: "pending", name: "待处理" },
        { key: "done", name: "已完成" },
        { key: "deleted", name: "回收站" },
      ],
      // 多选
      managing: false,
      selectedIds: [],
      // 左滑
      swipeOffset: {},
      touchStartX: 0,
      touchStartY: 0,
      touchingId: "",
      longPressed: false,
    };
  },
  computed: {
    // 云函数已按状态筛选，这里直接返回列表
    filteredList() {
      return this.list;
    },
    allSelected() {
      if (this.list.length === 0) return false;
      return this.list.every((o) => this.selectedIds.includes(o._id));
    },
    isRecycleBin() {
      return this.filter === "deleted";
    },
    swipeActionText() {
      return this.isRecycleBin ? "恢复" : "删除";
    },
    batchActionText() {
      return this.isRecycleBin ? "恢复选中" : "删除选中";
    },
    // 只有「已完成」（可删除）和「回收站」（可恢复）才需要管理按钮
    canManage() {
      return this.filter === "done" || this.filter === "deleted";
    },
    currentTabName() {
      const t = this.tabs.find((x) => x.key === this.filter);
      return t ? t.name : "全部";
    },
  },
  watch: {
    filter() {
      // 切换筛选：重置左滑、选择状态，并从第一页重新加载
      this.swipeOffset = {};
      this.selectedIds = [];
      this.managing = false;
      this.loadList(true);
    },
  },
  onShow() {
    this.checkAdmin();
  },
  methods: {
    async checkAdmin() {
      this.checking = true;
      this.noPermission = false;
      try {
        const res = await adminMe();
        if (res && res.success && res.isAdmin) {
          this.isAdmin = true;
          this.needBind = false;
          await this.loadList();
        } else {
          this.isAdmin = false;
          this.needBind = true;
        }
      } catch (e) {
        console.warn("检查管理员权限失败", e);
        this.needBind = true;
      } finally {
        this.checking = false;
      }
    },
    async bindAdmin() {
      if (!this.bindCode) {
        this.bridgeSdk.showToast({ title: "请输入绑定码" });
        return;
      }
      try {
        const res = await adminBind(this.bindCode);
        if (res && res.success) {
          this.isAdmin = true;
          this.needBind = false;
          this.bridgeSdk.showToast({ title: "绑定成功" });
          await this.loadList();
        } else {
          this.bridgeSdk.showToast({ title: (res && res.message) || "绑定失败" });
        }
      } catch (e) {
        console.warn("绑定失败", e);
        this.bridgeSdk.showToast({ title: "云函数不可用，请检查部署" });
      }
    },
    async onRefresh() {
      this.refreshing = true;
      try {
        await this.loadList();
      } finally {
        this.refreshing = false;
        // #ifdef MP
        uni.stopPullDownRefresh && uni.stopPullDownRefresh();
        // #endif
      }
    },
    async loadList(reset = true) {
      if (reset) {
        this.page = 1;
        this.hasMore = true;
        this.loading = true;
        this.swipeOffset = {}; // 重置左滑状态
      } else {
        if (this.loadingMore || !this.hasMore) return;
        this.loadingMore = true;
      }
      this.noPermission = false;
      try {
        const res = await adminListPage({
          page: this.page,
          pageSize: this.pageSize,
          status: this.filter,
        });
        if (res && res.success) {
          const list = res.list || [];
          this.list = reset ? list : [...this.list, ...list];
          this.hasMore = !!res.hasMore;
          this.page += 1;
          if (res.counts && res.counts.all > 0) {
            this.counts = res.counts;
          } else if (reset) {
            this.loadCounts();
          }
        } else {
          this.noPermission = true;
        }
      } catch (e) {
        console.warn("加载预约失败", e);
        this.noPermission = true;
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },
    loadMore() {
      if (this.loadingMore || !this.hasMore) return;
      this.loadList(false);
    },
    /** 客户端直连统计各状态数量（云函数未返回 counts 时兜底） */
    async loadCounts() {
      try {
        const db = wx.cloud.database();
        const _ = db.command;
        const coll = db.collection("appointments");
        const [all, pending, done, deleted] = await Promise.all([
          coll.where({ status: _.neq("deleted") }).count(),
          coll.where({ status: "pending" }).count(),
          coll.where({ status: "done" }).count(),
          coll.where({ status: "deleted" }).count(),
        ]);
        this.counts = {
          all: (all && all.total) || 0,
          pending: (pending && pending.total) || 0,
          done: (done && done.total) || 0,
          deleted: (deleted && deleted.total) || 0,
        };
      } catch (e) {
        console.warn("统计数量失败", e);
      }
    },
    async updateStatus(o, status) {
      try {
        const res = await adminUpdateAppointmentStatus(o._id, status);
        if (res && res.success) {
          o.status = status;
          this.bridgeSdk.showToast({ title: status === "done" ? "已标记完成" : "已恢复待处理" });
        } else {
          this.bridgeSdk.showToast({ title: (res && res.message) || "操作失败" });
        }
      } catch (e) {
        console.warn("更新状态失败", e);
        this.bridgeSdk.showToast({ title: "操作失败" });
      }
    },

    // ---------- 左滑/批量按钮分发 ----------
    onSwipeAction(o) {
      if (this.isRecycleBin) this.confirmRestore(o);
      else this.confirmDelete(o);
    },
    onBatchAction() {
      if (this.isRecycleBin) this.batchRestore();
      else this.batchDelete();
    },

    // ---------- 恢复（回收站）----------
    confirmRestore(o) {
      if (o.status !== "deleted") {
        this.bridgeSdk.showToast({ title: "该预约不在回收站" });
        return;
      }
      uni.showModal({
        title: "确认恢复",
        content: `确定恢复「${o.name || "该"}」的预约吗？恢复后会回到「已完成」`,
        success: (res) => {
          if (res.confirm) this.doRestore(o);
        },
      });
    },
    async doRestore(o) {
      try {
        const res = await adminRestoreAppointment(o._id);
        if (res && res.success) {
          this.selectedIds = this.selectedIds.filter((id) => id !== o._id);
          this.bridgeSdk.showToast({ title: "已恢复" });
          await this.loadList(true);
        } else {
          this.bridgeSdk.showToast({ title: (res && res.message) || "恢复失败" });
        }
      } catch (e) {
        console.warn("恢复失败", e);
        this.bridgeSdk.showToast({ title: "恢复失败" });
      }
    },
    batchRestore() {
      const count = this.selectedIds.length;
      if (count === 0) {
        this.bridgeSdk.showToast({ title: "请先选择预约" });
        return;
      }
      uni.showModal({
        title: "批量恢复",
        content: `确定恢复选中的 ${count} 条预约吗？恢复后回到「已完成」`,
        success: async (res) => {
          if (!res.confirm) return;
          try {
            const r = await adminBatchRestoreAppointments(this.selectedIds);
            if (r && r.success) {
              this.selectedIds = [];
              this.managing = false;
              this.bridgeSdk.showToast({ title: `已恢复 ${r.count || count} 条` });
              await this.loadList(true);
            } else {
              this.bridgeSdk.showToast({ title: (r && r.message) || "批量恢复失败" });
            }
          } catch (e) {
            console.warn("批量恢复失败", e);
            this.bridgeSdk.showToast({ title: "批量恢复失败" });
          }
        },
      });
    },

    // ---------- 删除（软删除，进回收站）----------
    confirmDelete(o) {
      if (o.status !== "done") {
        this.bridgeSdk.showToast({ title: "只能删除已完成的预约，请先标记完成" });
        return;
      }
      uni.showModal({
        title: "确认删除",
        content: `确定删除「${o.name || "该"}」的预约吗？删除后不可恢复`,
        confirmColor: "#ef4444",
        success: (res) => {
          if (res.confirm) this.doDelete(o);
        },
      });
    },
    async doDelete(o) {
      try {
        const res = await adminRemoveAppointment(o._id);
        if (res && res.success) {
          this.selectedIds = this.selectedIds.filter((id) => id !== o._id);
          this.bridgeSdk.showToast({ title: "已删除" });
          // 重新拉取，确保列表与数据库一致
          await this.loadList();
        } else {
          this.bridgeSdk.showToast({ title: (res && res.message) || "删除失败" });
        }
      } catch (e) {
        console.warn("删除失败", e);
        this.bridgeSdk.showToast({ title: "删除失败" });
      }
    },
    batchDelete() {
      const count = this.selectedIds.length;
      if (count === 0) {
        this.bridgeSdk.showToast({ title: "请先选择预约" });
        return;
      }
      // 二次确认：要求输入条数，防止误删
      uni.showModal({
        title: "批量删除",
        content: `即将删除 ${count} 条预约（不可恢复），请输入 ${count} 确认`,
        editable: true,
        placeholderText: `请输入 ${count}`,
        confirmColor: "#ef4444",
        success: async (res) => {
          if (!res.confirm) return;
          // 低版本基础库不支持输入框时 res.content 为 undefined，降级为普通确认
          if (res.content !== undefined && String(res.content).trim() !== String(count)) {
            this.bridgeSdk.showToast({ title: "输入不匹配，已取消" });
            return;
          }
          await this.doBatchDelete();
        },
      });
    },
    async doBatchDelete() {
      try {
        const r = await adminBatchRemoveAppointments(this.selectedIds);
        if (r && r.success) {
          const count = this.selectedIds.length;
          this.selectedIds = [];
          this.managing = false;
          const msg =
            r.skipped > 0
              ? `已删除 ${r.count || 0} 条，跳过 ${r.skipped} 条未完成`
              : `已删除 ${r.count || count} 条`;
          this.bridgeSdk.showToast({ title: msg });
          // 重新拉取，确保列表与数据库一致
          await this.loadList();
        } else {
          this.bridgeSdk.showToast({ title: (r && r.message) || "批量删除失败" });
        }
      } catch (e) {
        console.warn("批量删除失败", e);
        this.bridgeSdk.showToast({ title: "批量删除失败" });
      }
    },
    toggleManage() {
      this.managing = !this.managing;
      if (!this.managing) this.selectedIds = [];
      this.swipeOffset = {};
    },
    selectFilter(key) {
      this.showFilterMenu = false;
      if (this.filter !== key) {
        this.filter = key; // 触发 watch 重新加载
      }
    },
    toggleSelectAll() {
      // 全选只选当前模式下可操作的数据（回收站=已删除，其他=已完成）
      const okStatus = this.isRecycleBin ? "deleted" : "done";
      const ids = this.filteredList.filter((o) => o.status === okStatus).map((o) => o._id);
      if (this.allSelected) {
        this.selectedIds = this.selectedIds.filter((id) => !ids.includes(id));
      } else {
        const set = new Set([...this.selectedIds, ...ids]);
        this.selectedIds = Array.from(set);
      }
    },

    // ---------- 触摸（左滑） ----------
    onTouchStart(o, e) {
      if (this.managing) return;
      // 回收站：只允许左滑「恢复」；正常列表：只允许左滑「删除」已完成
      if (this.isRecycleBin) {
        if (o.status !== "deleted") return;
      } else {
        if (o.status !== "done") return;
      }
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchingId = o._id;
    },
    onTouchMove(o, e) {
      if (this.managing || this.touchingId !== o._id) return;
      const dx = e.touches[0].clientX - this.touchStartX;
      const dy = e.touches[0].clientY - this.touchStartY;
      // 纵向滑动优先（页面滚动）
      if (Math.abs(dx) < Math.abs(dy)) return;
      const maxOffset = -uni.upx2px(140); // 删除按钮宽度
      const offset = Math.max(maxOffset, Math.min(0, dx));
      this.swipeOffset = { ...this.swipeOffset, [o._id]: offset };
    },
    onTouchEnd(o) {
      const offset = this.swipeOffset[o._id] || 0;
      const maxOffset = -uni.upx2px(140);
      // 超过一半就吸附打开，否则回弹
      this.swipeOffset = {
        ...this.swipeOffset,
        [o._id]: offset < maxOffset / 2 ? maxOffset : 0,
      };
      this.touchingId = "";
    },
    onLongPress(o) {
      if (this.managing) return;
      if (this.isRecycleBin) {
        this.longPressed = true;
        this.confirmRestore(o);
        return;
      }
      if (o.status !== "done") {
        this.bridgeSdk.showToast({ title: "只能删除已完成的预约" });
        return;
      }
      this.longPressed = true;
      this.confirmDelete(o);
    },
    onCardClick(o) {
      // 长按已处理，忽略这次点击
      if (this.longPressed) {
        this.longPressed = false;
        return;
      }
      if (this.managing) {
        const okStatus = this.isRecycleBin ? "deleted" : "done";
        if (o.status !== okStatus) {
          this.bridgeSdk.showToast({
            title: this.isRecycleBin ? "只能选择回收站内的预约" : "只能选择已完成的预约",
          });
          return;
        }
        const idx = this.selectedIds.indexOf(o._id);
        if (idx > -1) this.selectedIds.splice(idx, 1);
        else this.selectedIds.push(o._id);
        return;
      }
      // 左滑已打开时，点击先收起
      if ((this.swipeOffset[o._id] || 0) !== 0) {
        this.swipeOffset = { ...this.swipeOffset, [o._id]: 0 };
        return;
      }
      this.goDetail(o._id);
    },

    goDetail(id) {
      this.bridgeSdk.jumpPage({ url: "/pages/admin/appointmentDetail?id=" + id });
    },
    call(phone) {
      if (phone) this.bridgeSdk.makePhoneCall({ phoneNumber: phone });
    },
    countBy(key) {
      // 优先用云函数返回的统计（准确）；云函数未返回时用本地已加载数据兜底
      const c = this.counts && this.counts[key];
      if (typeof c === "number" && c > 0) return c;
      if (key === "all") return this.list.length;
      return this.list.filter((o) => o.status === key).length;
    },
    statusText(status) {
      const map = { pending: "待处理", done: "已完成", canceled: "已取消", deleted: "已删除" };
      return map[status] || "待处理";
    },
    itemText(o) {
      const item = o.item || {};
      return [item.brand, item.model].filter(Boolean).join(" ") || item.category || "回收物品";
    },
    priceOf(o) {
      const item = o.item || {};
      return item.price || 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.admin {
  width: 750rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f6f8;
  box-sizing: border-box;
}

.scroll-body {
  flex: 1;
  height: 0;
  overflow: hidden;
}

.list-bottom-space {
  height: 140rpx;
}

.load-more {
  padding: 24rpx 0 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #9ca3af;
}

.pwd-box {
  padding: 100rpx 60rpx;
  text-align: center;

  .pwd-title {
    font-size: 38rpx;
    font-weight: bold;
    color: #111827;
  }
  .pwd-desc {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #9ca3af;
    line-height: 40rpx;
  }
  .pwd-input {
    margin: 40rpx 0;
    height: 88rpx;
    border-radius: 16rpx;
    background: #fff;
    text-align: center;
    font-size: 32rpx;
  }
  .pwd-btn {
    height: 88rpx;
    border-radius: 44rpx;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pwd-tip {
    margin-top: 24rpx;
    font-size: 22rpx;
    color: #c0c4cc;
    line-height: 34rpx;
  }
}

.no-perm {
  padding: 160rpx 60rpx;
  text-align: center;

  .no-perm-icon {
    width: 100rpx;
    height: 100rpx;
    margin: 0 auto 30rpx;
    border-radius: 50%;
    background: #fef2f2;
    color: #ef4444;
    font-size: 52rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .no-perm-text {
    font-size: 34rpx;
    font-weight: bold;
    color: #111827;
  }
  .no-perm-desc {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #9ca3af;
    line-height: 40rpx;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10rpx 20rpx;
  position: sticky;
  top: 0;
  z-index: 5;

  .tabs {
    flex: 1;
    display: flex;

    .tab {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 14rpx 0;
      border-radius: 12rpx;

      .tab-name {
        font-size: 24rpx;
        color: #6b7280;
      }
      .tab-count {
        margin-left: 6rpx;
        font-size: 20rpx;
        color: #9ca3af;
      }

      &.active {
        background: #ecfdf5;

        .tab-name {
          color: #16a34a;
          font-weight: bold;
        }
        .tab-count {
          color: #16a34a;
        }
      }
    }
  }

  .manage-btn {
    flex-shrink: 0;
    margin-left: 12rpx;
    padding: 14rpx 26rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #16a34a;
    background: #ecfdf5;

    &.active {
      color: #fff;
      background: #16a34a;
    }
  }
}

.tip {
  text-align: center;
  padding: 100rpx 0;
  font-size: 28rpx;
  color: #9ca3af;
}

.list {
  padding: 24rpx;
}

.card-wrap {
  position: relative;
  margin-bottom: 24rpx;
  border-radius: 20rpx;
  overflow: hidden;

  .swipe-delete {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 140rpx;
    background: #ef4444;
    color: #fff;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.restore {
      background: #16a34a;
    }
  }
}

.card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  transition: transform 0.2s ease;
  border: 3rpx solid transparent;

  &.selected {
    border-color: #ef4444;
    background: #fffaf9;
  }

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16rpx;
    border-bottom: 2rpx solid #f3f4f6;

    .name-row {
      display: flex;
      align-items: center;

      .checkbox {
        width: 40rpx;
        height: 40rpx;
        margin-right: 16rpx;
        border-radius: 50%;
        border: 2rpx solid #d1d5db;
        color: transparent;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &.checked {
          background: #16a34a;
          border-color: #16a34a;
          color: #fff;
        }
      }

      .name {
        font-size: 32rpx;
        font-weight: bold;
        color: #111827;
      }
      .status {
        margin-left: 16rpx;
        padding: 4rpx 14rpx;
        border-radius: 8rpx;
        font-size: 22rpx;
        background: #fef3c7;
        color: #d97706;

        &.done {
          background: #ecfdf5;
          color: #16a34a;
        }
        &.canceled {
          background: #f3f4f6;
          color: #9ca3af;
        }
        &.deleted {
          background: #fee2e2;
          color: #ef4444;
        }
      }
    }

    .price {
      font-size: 32rpx;
      font-weight: bold;
      color: #f59e0b;
    }
  }

  .row {
    display: flex;
    padding: 12rpx 0;

    .label {
      width: 90rpx;
      flex-shrink: 0;
      font-size: 26rpx;
      color: #9ca3af;
    }
    .value {
      flex: 1;
      font-size: 27rpx;
      color: #374151;
      line-height: 40rpx;

      &.link {
        color: #2563eb;
      }

      // 长文本（地址/备注）最多两行，超出省略
      &.clamp2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  .actions {
    display: flex;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 2rpx solid #f3f4f6;

    .btn {
      flex: 1;
      height: 72rpx;
      border-radius: 36rpx;
      font-size: 27rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 16rpx;

      &:first-child {
        margin-left: 0;
      }
      &.call {
        background: #eff6ff;
        color: #2563eb;
      }
      &.done {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: #fff;
      }
      &.revert {
        background: #f3f4f6;
        color: #6b7280;
      }
    }
  }
}

.batch-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 110rpx;
  padding: 0 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;

  .select-all {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .checkbox {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 2rpx solid #d1d5db;
      color: transparent;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.checked {
        background: #16a34a;
        border-color: #16a34a;
        color: #fff;
      }
    }
    .select-all-text {
      margin-left: 12rpx;
      font-size: 26rpx;
      color: #374151;
    }
  }

  .batch-text {
    font-size: 26rpx;
    color: #6b7280;
  }
  .batch-btn {
    height: 72rpx;
    padding: 0 40rpx;
    border-radius: 36rpx;
    background: #ef4444;
    color: #fff;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.disabled {
      background: #fca5a5;
    }
    &.restore {
      background: #16a34a;
    }
    &.restore.disabled {
      background: #86efac;
    }
  }
}

.refresh {
  margin: 10rpx 24rpx 0;
  height: 80rpx;
  border-radius: 40rpx;
  background: #fff;
  color: #16a34a;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
