<!--
 * @Description: 首页（废旧家电上门回收）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="home">

        <!-- 骨架屏 -->
        <vc-skeleton v-if="pageLoading" type="home" />

        <!-- 引导显示时禁止滚动：首页内容改由 scroll-view 承载 -->
        <scroll-view v-else class="home-scroll" scroll-y :scroll-y="!showGuide">
        <!-- 主视觉 -->
        <view class="hero">
          <view class="hero-title">旧家电 免费上门</view>
          <view class="hero-sub">冰箱 · 洗衣机 · 空调 · 电视 · 电脑</view>
          <view class="hero-tags">
            <text class="hero-tag">免费上门</text>
            <text class="hero-tag">免费拆机</text>
            <text class="hero-tag">当场结款</text>
          </view>
          <view class="hero-actions">
            <view id="guide-estimate" class="hero-btn primary" @click="goEstimate()">立即估价</view>
            <view class="hero-btn ghost" @click="callPhone">电话咨询</view>
          </view>
        </view>

        <!-- 回收品类 -->
        <view class="section-head">
          <text class="section-title">回收品类</text>
          <text class="section-more" @click="goEstimate()">全部 ›</text>
        </view>
        <view id="guide-category" class="cat-grid">
          <view
            v-for="c in categories"
            :key="c.key"
            class="cat-item"
            @click="goEstimate(c)"
          >
            <view class="cat-icon" :style="{ background: c.bg }">{{ c.icon }}</view>
            <view class="cat-name">{{ c.name }}</view>
            <view class="cat-price">{{ c.priceRange }}</view>
          </view>
        </view>

        <!-- 服务保障 -->
        <view class="section-title">服务保障</view>
        <view class="promise-grid">
          <view v-for="p in promises" :key="p.name" class="promise-item">
            <view class="promise-icon">{{ p.icon }}</view>
            <view class="promise-name">{{ p.name }}</view>
            <view class="promise-desc">{{ p.desc }}</view>
          </view>
        </view>

        <!-- 回收流程 -->
        <view class="section-title">回收流程</view>
        <view class="flow">
          <view v-for="(f, i) in flows" :key="f" class="flow-item">
            <view class="flow-dot">{{ i + 1 }}</view>
            <view class="flow-name">{{ f }}</view>
          </view>
        </view>

        <!-- 常见问题 -->
        <view class="section-title">常见问题</view>
        <view class="faq">
          <view
            v-for="(q, i) in faqs"
            :key="i"
            class="faq-item"
            @click="toggleFaq(i)"
          >
            <view class="faq-q">
              <text class="faq-q-text">{{ q.q }}</text>
              <text class="faq-arrow" :class="{ open: faqOpen === i }">▾</text>
            </view>
            <view v-if="faqOpen === i" class="faq-a">{{ q.a }}</view>
          </view>
        </view>

        <!-- 底部 CTA -->
        <view class="bottom-cta">
          <view class="cta-btn primary" @click="callPhone">一键拨号</view>
          <view id="guide-contact" class="cta-btn ghost" @click="showContact = true">加微信咨询</view>
        </view>

        <view class="footer-tip">服务范围：富区及周边 20 公里</view>

        <!-- 联系我们 -->
        <view v-if="showContact" class="mask" @click="showContact = false">
          <view class="contact-card" @click.stop>
            <view class="contact-title">联系我们</view>
            <image
              v-if="!qrError"
              class="contact-qr"
              :src="qrCodeUrl"
              mode="aspectFit"
              @error="qrError = true"
            />
            <view v-else class="contact-qr-placeholder">
              <text class="placeholder-line">请把微信二维码命名为</text>
              <text class="placeholder-line">weixin-qrcode.png</text>
              <text class="placeholder-line">放到 src/static/images/ 下</text>
            </view>
            <view class="contact-phone" @click="callPhone">电话：{{ phone }}</view>
            <view class="contact-close" @click="showContact = false">关闭</view>
          </view>
        </view>

        <vc-safe-bottom />

        </scroll-view>

        <!-- 首次进入引导（聚光灯压屏） -->
        <view v-if="showGuide" class="guide-layer" @touchmove.stop.prevent="noop">
          <!-- 挖洞高亮框：外面的 box-shadow 铺满全屏做压暗 -->
          <view class="spotlight" :style="spotlightStyle">
            <view class="spotlight-inner"></view>
          </view>

          <!-- 手指指向（仅最后一步） -->
          <view v-if="guideSteps[guideIndex].finger" class="guide-finger" :style="fingerStyle">
            <text class="finger-icon">👆</text>
          </view>

          <!-- 气泡提示 -->
          <view class="guide-bubble" :style="bubbleStyle">
            <view class="bubble-title">{{ guideSteps[guideIndex].title }}</view>
            <view class="bubble-desc">{{ guideSteps[guideIndex].desc }}</view>
            <view class="bubble-footer">
              <text class="bubble-step">{{ guideIndex + 1 }} / {{ guideSteps.length }}</text>
              <view class="bubble-btn" @click="nextGuide">{{ guideBtnText }}</view>
            </view>
          </view>

          <!-- 跳过 -->
          <view class="guide-skip" @click="closeGuide">
            <text>跳过引导</text>
          </view>
        </view>

      </view>
    </vc-container>

    <vc-tabbar current="home" />
  </view>
</template>

<script>
import vcSkeleton from "@/components/library/base/vc-skeleton/vc-skeleton.vue";
import vcTabbar from "@/components/library/base/vc-tabbar/vc-tabbar.vue";

export default {
  name: "home",
  components: { vcSkeleton, vcTabbar },
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "富区回收" },
          isFullScreen: { value: true },
          containerBackground: { value: "#f5f6f8" },
        },
      },
      phone: "13130009661",
      categories: [
        { key: "fridge", name: "冰箱", icon: "箱", priceRange: "100-800元", bg: "#3b82f6" },
        { key: "washer", name: "洗衣机", icon: "洗", priceRange: "80-600元", bg: "#06b6d4" },
        { key: "aircon", name: "空调", icon: "空", priceRange: "200-1000元", bg: "#8b5cf6" },
        { key: "tv", name: "电视", icon: "视", priceRange: "50-500元", bg: "#f59e0b" },
        { key: "computer", name: "电脑", icon: "脑", priceRange: "200-7000元", bg: "#10b981" },
        { key: "other", name: "其他家电", icon: "他", priceRange: "50-400元", bg: "#6b7280" },
      ],
      promises: [
        { icon: "免", name: "免费上门", desc: "大件不收费" },
        { icon: "拆", name: "免费拆机", desc: "专业师傅" },
        { icon: "款", name: "当面结款", desc: "验完即付" },
        { icon: "保", name: "环保处理", desc: "正规拆解" },
      ],
      flows: ["在线估价", "预约上门", "当面验机", "当场付款"],
      faqs: [
        { q: "大件家电怎么搬走？", a: "我们免费上门，拆机、搬运都由师傅负责，你不用动手。" },
        { q: "价格怎么算的？", a: "按品类、品牌、使用年限和成色综合估价，最终以当面验机为准。" },
        { q: "上门收费吗？", a: "免费上门，不满意可以不卖，不收任何费用。" },
      ],
      faqOpen: -1,
      showContact: false,
      qrError: false,
      // 首屏骨架屏（仅冷启动首次展示）
      pageLoading: true,
      // 首次进入引导
      showGuide: false,
      guideIndex: 0,
      guideSteps: [
        {
          target: "#guide-category",
          title: "这些都能回收",
          desc: "冰箱、洗衣机、空调、电视、电脑，点一下直接预约",
          position: "top",
          finger: false,
        },
        {
          target: "#guide-estimate",
          title: "点击这里开始估价",
          desc: "选好品类和成色，30 秒看到预估价格，不满意不收费",
          position: "bottom",
          finger: true,
        },
      ],
      spotlight: { top: 0, left: 0, width: 0, height: 0 },
      bubblePos: { top: 0, left: 0 },
    };
  },
  computed: {
    qrCodeUrl() {
      return "/static/images/weixin-qrcode.png";
    },
    guideBtnText() {
      return this.guideIndex < this.guideSteps.length - 1 ? "下一步" : "我知道了";
    },
    /** 手指指向位置：高亮框下方居中 */
    fingerStyle() {
      const s = this.spotlight;
      const size = 64;
      return {
        top: s.top + s.height + 6 + "px",
        left: s.left + s.width / 2 - size / 2 + "px",
      };
    },
    spotlightStyle() {
      const s = this.spotlight;
      return {
        top: s.top + "px",
        left: s.left + "px",
        width: s.width + "px",
        height: s.height + "px",
      };
    },
    bubbleStyle() {
      return {
        top: this.bubblePos.top + "px",
      };
    },
  },
  onShow() {
    // 隐藏原生 tabBar，改用自定义底栏（中间突起「回收」按钮）
    try {
      uni.hideTabBar({ animation: false });
    } catch (e) {
      console.warn("隐藏原生 tabBar 失败", e);
    }

    // 骨架屏：仅冷启动首次展示，之后进入直接显示内容
    if (this.bridgeSdk.getStorageSync("home_warmed")) {
      this.pageLoading = false;
    } else {
      setTimeout(() => {
        this.pageLoading = false;
        this.bridgeSdk.setStorageSync("home_warmed", true);
      }, 450);
    }

    // 首次进入引导（一个设备只显示一次）
    if (!this.bridgeSdk.getStorageSync("guide_shown")) {
      setTimeout(() => {
        this.showGuide = true;
        this.updateGuidePosition();
      }, 800);
    }
  },
  methods: {
    goEstimate(item) {
      const url =
        item && item.key
          ? "/pages/estimate/estimate?category=" + item.key
          : "/pages/estimate/estimate";
      this.bridgeSdk.jumpPage({ url });
    },
    callPhone() {
      this.bridgeSdk.makePhoneCall({ phoneNumber: this.phone });
    },
    toggleFaq(i) {
      this.faqOpen = this.faqOpen === i ? -1 : i;
    },
    // 引导层用：占位方法，配合 @touchmove.stop.prevent 锁住页面滚动
    noop() {},
    measureTarget(selector) {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this);
        query.select(selector).boundingClientRect();
        query.exec((res) => {
          resolve(res && res[0] ? res[0] : null);
        });
      });
    },
    async updateGuidePosition() {
      const step = this.guideSteps[this.guideIndex];
      if (!step) return;

      const rect = await this.measureTarget(step.target);
      if (!rect) {
        this.closeGuide();
        return;
      }

      const pad = 8;
      this.spotlight = {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      };

      // 气泡位置：优先目标下方，空间不足则放到上方
      const sys = uni.getSystemInfoSync();
      const winH = sys.windowHeight || 667;
      const bubbleH = 210;
      const gap = 24;
      let top;

      if (step.position === "top") {
        top = rect.top - bubbleH - gap;
        if (top < 110) top = rect.bottom + gap;
      } else {
        top = rect.bottom + gap;
        if (top + bubbleH > winH - 100) {
          top = rect.top - bubbleH - gap;
        }
      }

      // 兜底：无论上下都保证气泡落在可视区内
      const maxTop = winH - bubbleH - 100;
      this.bubblePos = {
        top: Math.max(110, Math.min(top, maxTop)),
        left: 24,
      };
    },
    async nextGuide() {
      if (this.guideIndex < this.guideSteps.length - 1) {
        this.guideIndex += 1;
        await this.updateGuidePosition();
      } else {
        this.closeGuide();
      }
    },
    closeGuide() {
      this.showGuide = false;
      this.bridgeSdk.setStorageSync("guide_shown", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 750rpx;
  height: 100%;
  background: #f5f6f8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 首页内容滚动容器：引导显示时 scroll-y=false，彻底锁住滚动 */
.home-scroll {
  flex: 1;
  height: 0;
  /* 留白高度 = 底栏内容高(96rpx) + 底部安全区，避免露出灰底 */
  padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.hero {
  margin: 24rpx;
  padding: 40rpx 32rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

  .hero-title {
    font-size: 46rpx;
    font-weight: bold;
    color: #fff;
    letter-spacing: 2rpx;
  }
  .hero-sub {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
  .hero-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;

    .hero-tag {
      padding: 6rpx 18rpx;
      margin: 0 12rpx 12rpx 0;
      border-radius: 20rpx;
      background: rgba(255, 255, 255, 0.2);
      font-size: 22rpx;
      color: #fff;
    }
  }
  .hero-actions {
    display: flex;
    margin-top: 20rpx;

    .hero-btn {
      height: 76rpx;
      padding: 0 44rpx;
      border-radius: 38rpx;
      font-size: 30rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      &.primary {
        background: #fff;
        color: #16a34a;
      }
      &.ghost {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        border: 2rpx solid rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30rpx 24rpx 16rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #111827;
    margin: 0;
  }
  .section-more {
    font-size: 26rpx;
    color: #16a34a;
  }
}

.section-title {
  margin: 30rpx 24rpx 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
}

.cat-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 18rpx;

  .cat-item {
    width: calc(33.33% - 12rpx);
    margin: 0 6rpx 12rpx;
    padding: 24rpx 0 20rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .cat-icon {
      width: 76rpx;
      height: 76rpx;
      border-radius: 20rpx;
      color: #fff;
      font-size: 32rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cat-name {
      margin-top: 14rpx;
      font-size: 27rpx;
      color: #1f2937;
      font-weight: 500;
    }
    .cat-price {
      margin-top: 6rpx;
      font-size: 22rpx;
      color: #f59e0b;
    }
  }
}

.promise-grid {
  display: flex;
  margin: 0 24rpx;
  padding: 24rpx 0;
  background: #fff;
  border-radius: 20rpx;

  .promise-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .promise-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: #ecfdf5;
      color: #16a34a;
      font-size: 28rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .promise-name {
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #1f2937;
    }
    .promise-desc {
      margin-top: 4rpx;
      font-size: 20rpx;
      color: #9ca3af;
    }
  }
}

.flow {
  display: flex;
  align-items: flex-start;
  margin: 0 24rpx;
  padding: 28rpx 12rpx;
  background: #fff;
  border-radius: 20rpx;

  .flow-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .flow-dot {
      width: 52rpx;
      height: 52rpx;
      border-radius: 50%;
      background: #16a34a;
      color: #fff;
      font-size: 26rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flow-name {
      margin-top: 12rpx;
      font-size: 22rpx;
      color: #4b5563;
      text-align: center;
    }
  }
}

.faq {
  margin: 0 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 0 24rpx;

  .faq-item {
    padding: 26rpx 0;
    border-bottom: 2rpx solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .faq-q {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .faq-q-text {
        font-size: 27rpx;
        color: #1f2937;
        font-weight: 500;
      }
      .faq-arrow {
        font-size: 22rpx;
        color: #9ca3af;
        transition: transform 0.2s;

        &.open {
          transform: rotate(180deg);
        }
      }
    }
    .faq-a {
      margin-top: 14rpx;
      font-size: 25rpx;
      color: #6b7280;
      line-height: 40rpx;
    }
  }
}

.bottom-cta {
  display: flex;
  margin: 32rpx 24rpx 0;

  .cta-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
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

.footer-tip {
  margin-top: 24rpx;
  text-align: center;
  font-size: 22rpx;
  color: #9ca3af;
}

/* ---------- 首次进入引导（聚光灯压屏）---------- */
.guide-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
}

.spotlight {
  position: fixed;
  border-radius: 20rpx;
  /* 用超大外阴影压暗整屏，中间留透明区域，实现"挖洞"效果 */
  box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.76);
  transition: all 0.32s cubic-bezier(0.22, 0.9, 0.3, 1);
  z-index: 301;

  .spotlight-inner {
    position: absolute;
    top: -3rpx;
    left: -3rpx;
    right: -3rpx;
    bottom: -3rpx;
    border: 3rpx solid rgba(34, 197, 94, 0.85);
    border-radius: 24rpx;
    animation: spotlight-pulse 1.8s ease-in-out infinite;
  }
}

@keyframes spotlight-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.guide-bubble {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx 30rpx 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.32);
  z-index: 302;
  transition: top 0.32s cubic-bezier(0.22, 0.9, 0.3, 1);

  .bubble-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #111827;
  }

  .bubble-desc {
    margin-top: 12rpx;
    font-size: 25rpx;
    color: #6b7280;
    line-height: 40rpx;
  }

  .bubble-footer {
    margin-top: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .bubble-step {
      font-size: 24rpx;
      color: #9ca3af;
    }

    .bubble-btn {
      height: 68rpx;
      padding: 0 44rpx;
      border-radius: 34rpx;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #fff;
      font-size: 27rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.guide-skip {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 70rpx;
  display: flex;
  justify-content: center;
  z-index: 302;

  text {
    padding: 14rpx 44rpx;
    border-radius: 30rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.45);
    font-size: 25rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 手指指向 */
.guide-finger {
  position: fixed;
  z-index: 303;
  animation: finger-bounce 1.2s ease-in-out infinite;

  .finger-icon {
    font-size: 68rpx;
    line-height: 1;
    text-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.4);
  }
}

@keyframes finger-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-16rpx);
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

  .contact-card {
    width: 560rpx;
    padding: 40rpx 30rpx 30rpx;
    background: #fff;
    border-radius: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .contact-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #111827;
    }
    .contact-qr {
      width: 320rpx;
      height: 320rpx;
      margin: 28rpx 0;
      border-radius: 16rpx;
      background: #f3f4f6;
    }
    .contact-qr-placeholder {
      width: 320rpx;
      height: 320rpx;
      margin: 28rpx 0;
      border-radius: 16rpx;
      background: #f3f4f6;
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
    .contact-phone {
      font-size: 28rpx;
      color: #2563eb;
    }
    .contact-close {
      margin-top: 24rpx;
      height: 76rpx;
      padding: 0 60rpx;
      border-radius: 38rpx;
      background: #f3f4f6;
      color: #4b5563;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

<!-- 非 scoped：小程序各页面 wxss 相互独立，此规则只作用于首页 -->
<style lang="scss">
page {
  height: 100vh;
  overflow: hidden;
}
</style>
