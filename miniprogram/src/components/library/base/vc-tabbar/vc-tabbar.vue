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
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  /* 允许中间按钮凸出到栏外显示 */
  overflow: visible;
}

.tabbar-items {
  height: 108rpx;
  display: flex;
  align-items: center;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .tab-icon {
    width: 44rpx;
    height: 44rpx;
  }

  .tab-name {
    margin-top: 8rpx;
    font-size: 20rpx;
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
  /* 父级 align-items:center 会让子项高度变 0，必须撑满，否则按钮定位错位 */
  align-self: stretch;
  display: flex;
  justify-content: center;
  position: relative;

  .center-btn {
    position: absolute;
    bottom: 12rpx;
    width: 108rpx;
    height: 108rpx;
    box-sizing: border-box;
    border-radius: 50%;
    /* 参考图：纯黄实心圆 */
    background: #fcd34d;
    /* 参考图：一圈细白环，与白色底栏融合 */
    border: 4rpx solid #fff;
    /* 参考图：极淡外圈勾边 + 轻微投影 */
    box-shadow:
      0 0 0 2rpx rgba(0, 0, 0, 0.03),
      0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    .center-text {
      font-size: 28rpx;
      font-weight: 700;
      color: #111827;
      letter-spacing: 0;
    }
  }
}
</style>
