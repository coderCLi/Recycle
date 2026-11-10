<!--
 * @Description: 我的（回收小程序）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="mine">
        <scroll-view class="mine-scroll" scroll-y>

        <!-- 用户区 -->
        <view class="user-card">
          <view class="user">
            <!-- 点击头像：调起微信头像（使用微信头像/相册/拍照） -->
            <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image class="avatar" :src="avatar" mode="aspectFill" @error="onAvatarError" />
              <view class="avatar-edit">改</view>
            </button>
            <view class="user-info">
              <view class="user-name-row">
                <!-- 点击名字：弹出微信昵称，选中后自动保存 -->
                <input
                  v-if="nameEditing"
                  class="user-name-input"
                  type="nickname"
                  v-model="nameDraft"
                  :focus="nameEditing"
                  :maxlength="20"
                  placeholder="点击使用微信昵称"
                  placeholder-style="color:#9ca3af"
                  @blur="saveNickName"
                  @confirm="saveNickName"
                />
                <template v-else>
                  <view class="user-name" @click="startEditName">{{ nickName }}</view>
                  <view class="user-name-edit" @click="startEditName">改</view>
                </template>
              </view>
              <view class="user-sub">欢迎使用富区回收</view>
              <view class="user-tip">点击头像或昵称，同步微信资料</view>
            </view>
          </view>
        </view>

        <!-- 我的预约 -->
        <view class="section">
          <view class="section-head">
            <view class="section-title">我的预约</view>
            <view v-if="isAdmin" class="section-more" @click="goAdmin">管理全部 ›</view>
          </view>
          <vc-skeleton v-if="ordersLoading && orders.length === 0" type="order" :rows="3" />
          <view v-else-if="orders.length === 0" class="empty">
            <view class="empty-text">暂无预约记录</view>
            <view class="empty-btn" @click="goEstimate">去估价预约</view>
          </view>
          <view v-else class="order-list">
            <view v-for="(o, i) in displayOrders" :key="i" class="order-item">
              <view class="order-main">
                <text class="order-name">{{ o.item ? o.item.brand + " " + o.item.model : "回收物品" }}</text>
                <text class="order-price">¥{{ o.item ? o.item.price : 0 }}</text>
              </view>
              <view class="order-sub">{{ o.date }} · {{ o.time }} · {{ o.address }}</view>
              <!-- 物品照片 -->
              <view v-if="o.images && o.images.length" class="order-images">
                <image
                  v-for="(img, idx) in o.images"
                  :key="idx"
                  class="order-image"
                  :src="img"
                  mode="aspectFill"
                  @click.stop="previewOrderImages(o.images, idx)"
                />
              </view>
            </view>
          </view>

          <view v-if="hasMoreOrders" class="order-more" @click="goAdmin">
            查看更多 ›
          </view>
        </view>

        <!-- 功能菜单 -->
        <view class="section">
          <view class="section-title">服务</view>
          <view class="grid">
            <view class="grid-item" @click="showContact = true">
              <view class="grid-icon icon-contact">联</view>
              <view class="grid-name">联系我们</view>
            </view>
            <view class="grid-item" @click="goAbout" @longpress="unlockAdmin">
              <view class="grid-icon icon-about">关</view>
              <view class="grid-name">关于我们</view>
            </view>
            <view class="grid-item" @click="goFeedback">
              <view class="grid-icon icon-feedback">反</view>
              <view class="grid-name">意见反馈</view>
            </view>
            <view v-if="isAdmin" class="grid-item" @click="goAdmin">
              <view class="grid-icon icon-admin">管</view>
              <view class="grid-name">预约管理</view>
            </view>
            <view v-if="isAdmin" class="grid-item" @click="goCategories">
              <view class="grid-icon icon-category">类</view>
              <view class="grid-name">分类管理</view>
            </view>
          </view>
        </view>

        <vc-safe-bottom />
        </scroll-view>
      </view>
    </vc-container>

    <vc-tabbar current="mine" />

    <!-- 联系弹窗 -->
    <view v-if="showContact" class="contact-mask" @click="showContact = false">
      <view class="contact-pop" @click.stop>
        <view class="contact-title">联系我们</view>
        <image
          v-if="!qrError"
          class="contact-qr"
          :src="qrCodeUrl"
          mode="aspectFit"
          :show-menu-by-longpress="true"
          @error="qrError = true"
          @click="previewQr"
        />
        <view v-else class="contact-qr-placeholder">
          <text class="placeholder-line">请把你的微信二维码图片</text>
          <text class="placeholder-line">命名为 weixin-qrcode.png</text>
          <text class="placeholder-line">放到 src/static/images/ 下</text>
        </view>
        <view class="contact-desc">长按上方图片识别二维码，添加微信</view>
        <view class="contact-phone" @click="call">拨打电话 {{ phone }}</view>
        <view class="contact-footer-tip">长按二维码图片，选择「识别图中二维码」即可添加微信</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore } from "@/store/index";
import { getAppointments, callFunction, toTempFileURLs } from "@/utils/cloud";
import vcLoading from "@/components/library/base/vc-loading/vc-loading.vue";
import vcSkeleton from "@/components/library/base/vc-skeleton/vc-skeleton.vue";
import vcTabbar from "@/components/library/base/vc-tabbar/vc-tabbar.vue";

export default {
  components: { vcLoading, vcSkeleton, vcTabbar },
  name: "mine",
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "我的" },
          isFullScreen: { value: true },
          backgroundColor: { value: "#f5f6f8" },
        },
      },
      // TODO: 替换成你自己的微信号二维码图片 URL
      phone: "13130009661",
      defaultAvatar: "static/images/tabBar/home_tabbar_icon_mine_normal_img.png",
      orders: [],
      ordersLoading: false,
      showContact: false,
      qrError: false,
      isAdmin: false,
      // 当前微信用户的头像、昵称（本地持久化）
      profileAvatar: "",
      profileNickName: "",
      nameEditing: false,
      nameDraft: "",
    };
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined",
      userInfo: "userInfo",
    }),
    avatar() {
      if (this.profileAvatar) return this.profileAvatar;
      if (this.userInfo && this.userInfo.head) {
        return this.minioBaseUrl + this.userInfo.head;
      }
      return this.defaultAvatar;
    },
    nickName() {
      if (this.profileNickName) return this.profileNickName;
      if (this.userInfo && this.userInfo.desUserName) return this.userInfo.desUserName;
      if (this.userInfo && this.userInfo.nickName) return this.userInfo.nickName;
      return "回收用户";
    },
    /** 只展示部分预约：无图片显示 3 条，有图片显示 2 条（露出「查看更多」） */
    displayOrders() {
      const hasImages = this.orders.some((o) => o.images && o.images.length);
      const limit = hasImages ? 2 : 3;
      return this.orders.slice(0, limit);
    },
    hasMoreOrders() {
      return this.orders.length > this.displayOrders.length;
    },
    qrCodeUrl() {
      // 本地二维码图片：src/static/images/weixin-qrcode.png
      return "/static/images/weixin-qrcode.png";
    },
  },
  onLoad() {
    this.loadProfile();
  },
  onShow() {
    // 隐藏原生 tabBar，改用自定义底栏（中间突起「回收」按钮）
    try {
      uni.hideTabBar({ animation: false });
    } catch (e) {
      console.warn("隐藏原生 tabBar 失败", e);
    }

    this.loadOrders();
    this.loadAdminStatus();
  },
  methods: {
    // 读取本地保存的微信头像、昵称
    loadProfile() {
      const saved = this.bridgeSdk.getStorageSync("recycle_user_profile") || {};
      this.profileAvatar = saved.avatar || "";
      this.profileNickName = saved.nickName || "";
      // 兼容已登录用户的微信昵称
      if (!this.profileNickName) {
        try {
          const info = (this.bridgeSdk.getUserInfo() || {}).userInfo || {};
          this.profileNickName = info.nickName || "";
        } catch (e) {
          console.warn("读取微信昵称失败", e);
        }
      }
    },
    persistProfile() {
      this.bridgeSdk.setStorageSync("recycle_user_profile", {
        avatar: this.profileAvatar,
        nickName: this.profileNickName,
      });
    },
    // 点击头像：微信头像选择回调
    onChooseAvatar(e) {
      const tempPath = e && e.detail && e.detail.avatarUrl;
      if (!tempPath) return;
      let savedPath = tempPath;
      // 微信返回的是临时文件，转存到本地用户目录，避免重启后失效
      // #ifdef MP-WEIXIN
      try {
        const fs = wx.getFileSystemManager();
        const oldPath = this.profileAvatar;
        const destPath = `${wx.env.USER_DATA_PATH}/recycle-avatar-${Date.now()}.png`;
        fs.copyFileSync(tempPath, destPath);
        savedPath = destPath;
        if (oldPath && oldPath.indexOf(wx.env.USER_DATA_PATH) === 0) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.warn("删除旧头像失败", err);
          }
        }
      } catch (err) {
        console.warn("保存微信头像失败，使用临时路径", err);
      }
      // #endif
      this.profileAvatar = savedPath;
      this.persistProfile();
      this.bridgeSdk.showToast({ title: "微信头像已更新" });
    },
    onAvatarError() {
      // 本地缓存的头像文件失效时，回退到默认头像
      if (this.profileAvatar) {
        this.profileAvatar = "";
        this.persistProfile();
      }
    },
    // 点击名字：切换为微信昵称输入，键盘上方会出现「使用微信昵称」
    startEditName() {
      this.nameDraft = "";
      this.nameEditing = true;
    },
    saveNickName(e) {
      if (!this.nameEditing) return;
      this.nameEditing = false;
      const value = ((e && e.detail && e.detail.value) || this.nameDraft || "").trim();
      this.nameDraft = "";
      if (!value || value === this.nickName) return;
      this.profileNickName = value;
      this.persistProfile();
      this.bridgeSdk.showToast({ title: "微信昵称已更新" });
    },
    async loadOrders() {
      // 本地记录兜底
      this.orders = this.bridgeSdk.getStorageSync("recycle_orders") || [];
      // 优先从云开发读取（按 openid 隔离）
      this.ordersLoading = true;
      try {
        const res = await getAppointments();
        if (res && res.success && Array.isArray(res.list)) {
          this.orders = res.list;
        }
      } catch (e) {
        console.warn("云端读取预约失败，使用本地记录", e);
      } finally {
        this.ordersLoading = false;
      }
    },
    async previewOrderImages(images, index) {
      if (!images || images.length === 0) return;
      // 云文件ID需要先换成临时链接，previewImage 才能打开
      const urls = await toTempFileURLs(images);
      uni.previewImage({ urls, current: urls[index] });
    },
    toLogin() {
      this.bridgeSdk.toLogin();
    },
    goEstimate() {
      this.bridgeSdk.jumpPage({ url: "/pages/estimate/estimate" });
    },
    goAbout() {
      this.bridgeSdk.jumpPage({ url: "/pages/about/about" });
    },
    goFeedback() {
      this.bridgeSdk.jumpPage({ url: "/pages/feedback/feedback" });
    },
    async loadAdminStatus() {
      let cloudAdmin = false;
      try {
        const res = await callFunction("adminGetAppointments", { action: "me" });
        cloudAdmin = !!(res && res.success && res.isAdmin);
      } catch (e) {
        console.warn("查询管理员状态失败", e);
      }
      // 已绑定管理员 或 本地长按解锁（用于首次绑定）
      this.isAdmin = cloudAdmin || !!this.bridgeSdk.getStorageSync("admin_entry_unlocked");
    },
    unlockAdmin() {
      this.isAdmin = true;
      this.bridgeSdk.setStorageSync("admin_entry_unlocked", true);
      this.bridgeSdk.showToast({ title: "管理入口已开启" });
    },
    goAdmin() {
      this.bridgeSdk.jumpPage({ url: "/pages/admin/appointments" });
    },
    goCategories() {
      this.bridgeSdk.jumpPage({ url: "/pages/admin/categories" });
    },
    call() {
      this.bridgeSdk.makePhoneCall({ phoneNumber: this.phone });
    },
    // 点击二维码可放大查看，长按识别添加微信
    previewQr() {
      if (this.qrError) return;
      uni.previewImage({
        urls: [this.qrCodeUrl],
        current: this.qrCodeUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mine {
  width: 750rpx;
  height: 100%;
  background: #f5f6f8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 「我的」内容滚动容器：内容不超出时不会产生滚动/回弹 */
.mine-scroll {
  flex: 1;
  height: 0;
  /* 留白高度 = 底栏内容高(96rpx) + 底部安全区，避免露出灰底 */
  padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.user-card {
  margin: 24rpx;
  padding: 40rpx 32rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

  .user {
    display: flex;
    align-items: center;

    // 头像按钮（微信 chooseAvatar 只能挂在 button 上）
    .avatar-btn {
      position: relative;
      width: 120rpx;
      height: 120rpx;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      line-height: 1;
      flex-shrink: 0;
      overflow: visible;

      &::after {
        border: none;
      }

      .avatar {
        display: block;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background: #fff;
      }
      .avatar-edit {
        position: absolute;
        right: -6rpx;
        bottom: -6rpx;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #fff;
        color: #16a34a;
        font-size: 20rpx;
        line-height: 40rpx;
        text-align: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
      }
    }

    .user-info {
      margin-left: 28rpx;
      color: #fff;
      flex: 1;
      min-width: 0;

      .user-name-row {
        display: flex;
        align-items: center;
      }
      .user-name {
        max-width: 320rpx;
        font-size: 36rpx;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-name-edit {
        margin-left: 16rpx;
        padding: 0 14rpx;
        height: 36rpx;
        line-height: 32rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.7);
        border-radius: 18rpx;
        font-size: 20rpx;
        color: #fff;
        flex-shrink: 0;
      }
      .user-name-input {
        width: 340rpx;
        height: 60rpx;
        padding: 0 20rpx;
        border-radius: 30rpx;
        background: rgba(255, 255, 255, 0.95);
        color: #111827;
        font-size: 30rpx;
        box-sizing: border-box;
      }
      .user-sub {
        margin-top: 10rpx;
        font-size: 26rpx;
        opacity: 0.9;
      }
      .user-tip {
        margin-top: 6rpx;
        font-size: 22rpx;
        opacity: 0.8;
      }
    }
  }
}

.section {
  margin: 0 24rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 16rpx;
  }

  .section-more {
    font-size: 26rpx;
    color: #16a34a;
    margin-bottom: 16rpx;
  }
}

.empty {
  text-align: center;
  padding: 40rpx 0;

  .empty-text {
    font-size: 26rpx;
    color: #9ca3af;
  }
  .empty-btn {
    margin: 20rpx auto 0;
    width: 220rpx;
    height: 64rpx;
    border-radius: 32rpx;
    background: #ecfdf5;
    color: #16a34a;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.order-more {
  margin-top: 16rpx;
  padding: 16rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #16a34a;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8rpx;

  .grid-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
    box-sizing: border-box;
  }

  .grid-icon {
    width: 88rpx;
    height: 88rpx;
    border-radius: 22rpx;
    color: #fff;
    font-size: 34rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;

    &.icon-contact {
      background: #22c55e;
    }
    &.icon-about {
      background: #fbbf24;
    }
    &.icon-feedback {
      background: #f59e0b;
    }
    &.icon-admin {
      background: #8b5cf6;
    }
    &.icon-category {
      background: #f97316;
    }
  }

  .grid-name {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #374151;
    text-align: center;
  }
}

.order-list {
  .order-item {
    padding: 20rpx 0;
    border-bottom: 2rpx solid #f3f4f6;

    .order-main {
      display: flex;
      justify-content: space-between;

      .order-name {
        font-size: 28rpx;
        color: #1f2937;
        font-weight: 500;
      }
      .order-price {
        font-size: 28rpx;
        color: #f59e0b;
        font-weight: bold;
      }
    }
    .order-sub {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: #9ca3af;
    }

    .order-images {
      display: flex;
      flex-wrap: wrap;
      margin-top: 12rpx;

      .order-image {
        width: 120rpx;
        height: 120rpx;
        margin-right: 12rpx;
        margin-top: 8rpx;
        border-radius: 8rpx;
        background: #f3f4f6;
      }
    }
  }
}

.menu {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 2rpx solid #f3f4f6;

    .menu-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #fff;
      flex-shrink: 0;
    }
    .icon-contact { background: #22c55e; }
    .icon-setting { background: #60a5fa; }
    .icon-about { background: #fbbf24; }
    .icon-feedback { background: #f59e0b; }
    .icon-admin { background: #8b5cf6; }

    .menu-name {
      flex: 1;
      margin-left: 24rpx;
      font-size: 30rpx;
      color: #1f2937;
    }
    .menu-arrow {
      font-size: 40rpx;
      color: #d1d5db;
    }
  }
}

.contact-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .contact-pop {
    width: 560rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 48rpx 40rpx;
    text-align: center;

    .contact-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #111827;
    }
    .contact-qr {
      display: block;
      width: 320rpx;
      height: 320rpx;
      margin: 32rpx auto 20rpx;
      background: #f3f4f6;
      border-radius: 16rpx;
    }
    .contact-qr-placeholder {
      width: 320rpx;
      height: 320rpx;
      margin: 32rpx auto;
      background: #f3f4f6;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .placeholder-line {
        font-size: 20rpx;
        color: #9ca3af;
        line-height: 34rpx;
      }
    }
    .contact-desc {
      font-size: 26rpx;
      color: #16a34a;
      font-weight: 500;
    }
    .contact-phone {
      margin-top: 24rpx;
      height: 76rpx;
      border-radius: 38rpx;
      background: #22c55e;
      color: #fff;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .contact-footer-tip {
      margin-top: 24rpx;
      padding-top: 20rpx;
      border-top: 2rpx dashed #e5e7eb;
      font-size: 24rpx;
      color: #16a34a;
      line-height: 34rpx;
    }
  }
}
</style>

<!-- 非 scoped：小程序各页面 wxss 相互独立，此规则只作用于「我的」页面 -->
<style lang="scss">
page {
  height: 100vh;
  overflow: hidden;
}
</style>
