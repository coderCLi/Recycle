<!--
 * @Description: 自定义底部导航（中间为突起的「回收」圆形按钮）
 * 用法：<vc-tabbar current="home" />  current: home | estimate | mine
-->
<template>
  <view class="vc-tabbar">
    <view class="tabbar-items">
      <view class="tab-item" :class="{ active: current === 'home' }" @click="go('home')">
        <image class="tab-icon" :src="homeIcon" mode="aspectFit" />
        <text class="tab-name">首页</text>
      </view>

      <view class="tab-center" @click="go('estimate')">
        <view class="center-btn">
          <text class="center-text">回收</text>
        </view>
      </view>

      <view class="tab-item" :class="{ active: current === 'mine' }" @click="go('mine')">
        <image class="tab-icon" :src="mineIcon" mode="aspectFit" />
        <text class="tab-name">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
const TAB_ROUTES = {
  home: "/pages/home/home",
  mine: "/pages/mine/mine",
};

// 使用项目原有的 tabBar 图标（普通 / 选中两套）
const ICONS = {
  home: {
    normal: "/static/images/tabBar/home_tabbar_icon_home_normal_img.png",
    active: "/static/images/tabBar/home_tabbar_icon_home_active_img.png",
  },
  mine: {
    normal: "/static/images/tabBar/home_tabbar_icon_mine_normal_img.png",
    active: "/static/images/tabBar/home_tabbar_icon_mine_active_img.png",
  },
};

export default {
  name: "vcTabbar",
  props: {
    current: { type: String, default: "home" },
  },
  computed: {
    homeIcon() {
      return this.current === "home" ? ICONS.home.active : ICONS.home.normal;
    },
    mineIcon() {
      return this.current === "mine" ? ICONS.mine.active : ICONS.mine.normal;
    },
  },
  methods: {
    go(key) {
      if (this.current === key) return;
      // 估价是独立流程页（不在 tabBar 中），用 navigateTo 进入
      if (key === "estimate") {
        uni.navigateTo({ url: "/pages/estimate/estimate" });
        return;
      }
      uni.switchTab({ url: TAB_ROUTES[key] });
    },
  },
};
</script>

<style lang="scss" scoped>
.vc-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  background: #fff;
  /* 极细分隔线，和页面内容轻微分开，不产生阴影带 */
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-items {
  height: 96rpx;
  display: flex;
  align-items: center;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 6rpx;

  .tab-icon {
    width: 44rpx;
    height: 44rpx;
  }

  .tab-name {
    margin-top: 6rpx;
    font-size: 19rpx;
    color: #9ca3af;
  }

  &.active {
    .tab-name {
      color: #111827;
      font-weight: bold;
    }
  }
}

.tab-center {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;

  .center-btn {
    position: absolute;
    bottom: -4rpx;
    width: 112rpx;
    height: 112rpx;
    box-sizing: border-box;
    border-radius: 50%;
    /* 纯色黄，和参考图一致 */
    background: #fbbf24;
    /* 白色粗环：在白色底栏上形成"从底栏穿出"的隔离效果 */
    border: 9rpx solid #fff;
    /* 外圈极淡描边 + 底部投影，勾出按钮轮廓 */
    box-shadow:
      0 0 0 2rpx rgba(0, 0, 0, 0.05),
      0 8rpx 18rpx rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;

    .center-text {
      font-size: 30rpx;
      font-weight: 900;
      color: #111827;
      letter-spacing: 2rpx;
    }
  }
}
</style>
