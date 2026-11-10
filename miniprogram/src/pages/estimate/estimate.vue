<!--
 * @Description: 在线估价（自定义头部：返回 + 搜索框，左侧分类 + 右侧模块滚动联动）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view class="estimate">

    <!-- 自定义头部：状态栏 + 返回 + 搜索框（右侧让开微信胶囊） -->
    <view class="custom-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner" :style="{ paddingRight: headerRightSpace + 'px' }">
        <view class="back-btn" @click="goBack">
          <!-- CSS 绘制的返回箭头，比字符「‹」更精致、跨机型一致 -->
          <view class="back-arrow"></view>
        </view>

        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input
            v-model="keyword"
            class="search-input"
            placeholder="搜索品类，如洗衣机"
            placeholder-class="search-ph"
            confirm-type="search"
            @confirm="doSearch"
          />
          <text v-if="keyword" class="search-clear" @click="clearSearch">×</text>
        </view>
      </view>
    </view>

    <vc-loading v-if="loading" text="正在加载品类..." />

    <view v-else-if="visibleGroups.length === 0" class="tip">
      <view class="tip-main">暂无回收品类</view>
      <view class="tip-sub">请联系我们，或由管理员在管理端添加分类</view>
    </view>

    <!-- 左右布局 -->
    <view v-else class="layout">
      <!-- 左侧一级分类 -->
      <scroll-view class="sidebar" scroll-y>
        <view
          v-for="g in visibleGroups"
          :key="g._id"
          class="side-item"
          :class="{ active: currentId === g._id }"
          @click="selectGroup(g)"
        >
          {{ g.name }}
        </view>
      </scroll-view>

      <!-- 右侧：全部模块，上下滚动 -->
      <scroll-view
        class="content"
        scroll-y
        :scroll-into-view="scrollTarget"
        :scroll-with-animation="true"
        :scroll-anchoring="true"
        @scroll="onContentScroll"
      >
        <view
          v-for="g in visibleGroups"
          :key="g._id"
          :id="'group-' + g._id"
          class="section"
        >
          <view class="section-title">{{ g.name }}</view>

          <view class="product-grid">
            <view
              v-for="p in g.children"
              :id="'product-' + p._id"
              :key="p._id"
              class="product-item"
              :class="{ flash: highlightId === p._id }"
              @click="pickProduct(p, g)"
            >
              <view class="product-icon" :style="{ background: p.color || '#ecfdf5' }">
                {{ p.icon || (p.name || '?').slice(0, 1) }}
              </view>
              <view class="product-name">{{ p.name }}</view>
              <view v-if="p.price" class="product-price">¥{{ p.price }}</view>
            </view>
          </view>
        </view>

        <view class="list-bottom"></view>
      </scroll-view>
    </view>

    <vc-safe-bottom />
  </view>
</template>

<script>
import { getCategories } from "@/utils/cloud";
import vcLoading from "@/components/library/base/vc-loading/vc-loading.vue";

export default {
  name: "estimate",
  components: { vcLoading },
  data() {
    const sys = uni.getSystemInfoSync();
    // 计算右上角微信胶囊占位，避免搜索框被遮挡
    let headerRightSpace = 100;
    try {
      const menu = uni.getMenuButtonBoundingClientRect();
      if (menu && menu.left) {
        headerRightSpace = sys.windowWidth - menu.left + 8;
      }
    } catch (e) {
      // 非小程序环境兜底
    }
    return {
      statusBarHeight: sys.statusBarHeight || 20,
      headerRightSpace,
      loading: true,
      keyword: "",
      groups: [],
      currentId: "",
      highlightId: "",
      scrollTarget: "",
      flashTimer: null,
      sectionTops: [],
    };
  },
  computed: {
    /** 只展示有产品的分类，避免出现空的重复标题 */
    visibleGroups() {
      return this.groups.filter((g) => g.children && g.children.length > 0);
    },
  },
  onShow() {
    this.loadAll();
  },
  onUnload() {
    if (this.flashTimer) clearTimeout(this.flashTimer);
  },
  methods: {
    goBack() {
      const pages = getCurrentPages();
      if (pages && pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({ url: "/pages/home/home" });
      }
    },
    async loadAll() {
      this.loading = true;
      try {
        const res1 = await getCategories(1);
        const level1 = (res1 && res1.list) || [];
        const groups = [];
        for (const g of level1) {
          const res2 = await getCategories(2, g._id);
          groups.push({ ...g, children: (res2 && res2.list) || [] });
        }
        this.groups = groups;

        const visible = groups.filter((g) => g.children && g.children.length > 0);
        if (visible.length > 0) {
          const stillExist = visible.find((g) => g._id === this.currentId);
          this.currentId = stillExist ? stillExist._id : visible[0]._id;
        } else {
          this.currentId = "";
        }
      } catch (e) {
        console.warn("加载品类失败", e);
        this.groups = [];
        this.currentId = "";
      } finally {
        this.loading = false;
        this.measureSections();
      }
    },
    /** 测量每个分类区块相对内容顶部的偏移，用于滚动联动 */
    measureSections() {
      setTimeout(() => {
        try {
          const query = uni.createSelectorQuery().in(this);
          query.selectAll(".section").boundingClientRect();
          query.select(".content").boundingClientRect();
          query.select(".content").scrollOffset();
          query.exec((res) => {
            const sections = res[0] || [];
            const content = res[1];
            const offset = res[2] || { scrollTop: 0 };
            if (!content || sections.length === 0) return;
            this.sectionTops = sections.map((s, i) => ({
              id: this.visibleGroups[i] ? this.visibleGroups[i]._id : "",
              top: s.top - content.top + (offset.scrollTop || 0),
            }));
          });
        } catch (e) {
          console.warn("测量分类位置失败", e);
        }
      }, 320);
    },
    /** 右侧滚动时，左侧分类联动高亮 */
    onContentScroll(e) {
      const scrollTop = (e.detail && e.detail.scrollTop) || 0;
      if (this.sectionTops.length === 0) return;

      let activeId = this.sectionTops[0].id;
      for (const s of this.sectionTops) {
        if (scrollTop + 12 >= s.top) activeId = s.id;
        else break;
      }
      if (activeId && activeId !== this.currentId) {
        this.currentId = activeId;
      }
    },
    /** 点击左侧：右侧平滑滚动到对应模块 */
    selectGroup(g) {
      this.currentId = g._id;
      this.highlightId = "";
      this.scrollTarget = "";
      setTimeout(() => {
        this.scrollTarget = "group-" + g._id;
      }, 60);
    },
    doSearch() {
      const kw = String(this.keyword || "").trim();
      if (!kw) {
        this.bridgeSdk.showToast({ title: "请输入要搜索的品类" });
        return;
      }

      for (const g of this.visibleGroups) {
        const hit = g.children.find((p) => String(p.name || "").indexOf(kw) > -1);
        if (!hit) continue;

        this.currentId = g._id;
        this.highlightId = "";
        this.scrollTarget = "";

        // 等一帧后再设置，保证 scroll-into-view 能再次触发平滑滚动
        setTimeout(() => {
          this.scrollTarget = "product-" + hit._id;
          this.highlightId = hit._id;

          if (this.flashTimer) clearTimeout(this.flashTimer);
          this.flashTimer = setTimeout(() => {
            this.highlightId = "";
          }, 2600);
        }, 80);
        return;
      }

      this.bridgeSdk.showToast({ title: "没有找到「" + kw + "」" });
    },
    clearSearch() {
      this.keyword = "";
      this.highlightId = "";
      this.scrollTarget = "";
    },
    pickProduct(p, g) {
      const info = {
        category: g.name,
        brand: p.name,
        model: "",
        condition: "",
        price: p.price || 0,
      };
      this.bridgeSdk.jumpPage({
        url: `/pages/appointment/appointment?item=${encodeURIComponent(JSON.stringify(info))}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes flash {
  0%,
  100% {
    border-color: transparent;
    box-shadow: none;
  }
  50% {
    border-color: #ef4444;
    box-shadow: 0 0 0 8rpx rgba(239, 68, 68, 0.28);
  }
}

.estimate {
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6f8;
  box-sizing: border-box;
  overflow: hidden;
}

/* ---------- 自定义头部 ---------- */
.custom-header {
  flex-shrink: 0;
  background: #fff;
  padding-bottom: 14rpx;
}

.header-inner {
  height: 84rpx;
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  /* 右侧留白由内联样式动态控制（让开微信右上角胶囊） */
  box-sizing: border-box;
}

.back-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;

  /* 用两条边旋转 45° 画箭头，粗细均匀、边缘锐利 */
  .back-arrow {
    width: 20rpx;
    height: 20rpx;
    border-left: 4rpx solid #111827;
    border-bottom: 4rpx solid #111827;
    border-radius: 2rpx;
    transform: rotate(45deg);
    margin-left: 6rpx;
  }
}

.search-box {
  flex: 1;
  /* min-width:0 防止 flex 子项被内容撑破，导致溢出屏幕 */
  min-width: 0;
  height: 68rpx;
  background: #f3f4f6;
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  padding: 0 22rpx;
  box-sizing: border-box;

  .search-icon {
    font-size: 26rpx;
    margin-right: 10rpx;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    min-width: 0;
    font-size: 26rpx;
    color: #111827;
  }

  .search-clear {
    padding: 0 6rpx;
    font-size: 32rpx;
    color: #9ca3af;
    line-height: 1;
  }
}

.search-ph {
  color: #b0b4bb;
  font-size: 25rpx;
}

/* ---------- 提示 ---------- */
.tip {
  padding: 160rpx 60rpx;
  text-align: center;

  .tip-main {
    font-size: 32rpx;
    color: #374151;
    font-weight: bold;
  }
  .tip-sub {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #9ca3af;
    line-height: 40rpx;
  }
}

/* ---------- 左右布局 ---------- */
.layout {
  flex: 1;
  min-height: 0;
  display: flex;
  margin-top: 12rpx;
  overflow: hidden;
}

.sidebar {
  width: 190rpx;
  height: 100%;
  background: #f5f6f8;

  .side-item {
    padding: 30rpx 16rpx;
    font-size: 27rpx;
    color: #6b7280;
    text-align: center;
    position: relative;

    &.active {
      background: #fff;
      color: #16a34a;
      font-weight: bold;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 30rpx;
        bottom: 30rpx;
        width: 6rpx;
        border-radius: 3rpx;
        background: #16a34a;
      }
    }
  }
}

.content {
  flex: 1;
  height: 100%;
  background: #fff;
}

.section {
  padding: 26rpx 20rpx 6rpx;

  .section-title {
    font-size: 29rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 16rpx;
    padding-left: 4rpx;
  }

  .product-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -6rpx;

    .product-item {
      width: calc(33.33% - 12rpx);
      margin: 0 6rpx 16rpx;
      padding: 16rpx 6rpx 22rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      border: 2rpx solid transparent;
      border-radius: 16rpx;

      &.flash {
        animation: flash 0.6s ease-in-out 3;
      }

      .product-icon {
        width: 104rpx;
        height: 104rpx;
        border-radius: 20rpx;
        color: #16a34a;
        font-size: 38rpx;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ecfdf5;
      }
      .product-name {
        margin-top: 14rpx;
        font-size: 25rpx;
        color: #374151;
        text-align: center;
        line-height: 34rpx;
      }
      .product-price {
        margin-top: 6rpx;
        font-size: 22rpx;
        color: #f59e0b;
      }
    }
  }
}

.list-bottom {
  height: 60rpx;
}
</style>

<!-- 非 scoped：小程序各页面 wxss 独立，此规则只作用于估价页 -->
<style lang="scss">
page {
  height: 100vh;
  overflow: hidden;
}
</style>
