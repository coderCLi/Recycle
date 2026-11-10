<!--
 * @Description: 预约详情（支持单项复制 / 全部复制 / 分享转发只读）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="detail">

        <vc-loading v-if="loading" text="正在加载详情..." />

        <view v-else-if="!order" class="tip">预约不存在或已删除</view>

        <template v-else>
          <!-- 头部：姓名 / 状态 / 报价 -->
          <view class="header-card">
            <view class="name-row">
              <text class="name">{{ order.name || "客户" }}</text>
              <text class="status" :class="order.status">{{ statusText(order.status) }}</text>
            </view>
            <view class="price-row">
              <text class="price-label">预估报价</text>
              <text class="price">¥{{ price }}</text>
            </view>
          </view>

          <!-- 物品信息（每行可单独复制） -->
          <view class="card">
            <view class="card-title">物品信息</view>
            <view class="row" @click="copyRow('物品', itemText)">
              <text class="label">物品</text>
              <text class="value">{{ itemText }}</text>
              <text class="copy">复制</text>
            </view>
            <view class="row" @click="copyRow('成色', condition)">
              <text class="label">成色</text>
              <text class="value">{{ condition || "-" }}</text>
              <text class="copy">复制</text>
            </view>
            <view class="row" @click="copyRow('报价', '¥' + price)">
              <text class="label">报价</text>
              <text class="value price-text">¥{{ price }}</text>
              <text class="copy">复制</text>
            </view>
          </view>

          <!-- 联系信息（每行可单独复制） -->
          <view class="card">
            <view class="card-title">联系信息</view>
            <view class="row" @click="copyRow('联系人', order.name)">
              <text class="label">联系人</text>
              <text class="value">{{ order.name || "-" }}</text>
              <text class="copy">复制</text>
            </view>
            <view class="row" @click="copyRow('电话', order.phone)">
              <text class="label">电话</text>
              <text class="value link">{{ order.phone || "-" }}</text>
              <text class="copy">复制</text>
            </view>
            <view class="row">
              <text class="label">地址</text>
              <view class="value-wrap">
                <text class="value" :class="{ clamp3: !expanded.address && isLongText(order.address) }">{{ order.address || "-" }}</text>
                <text v-if="isLongText(order.address)" class="expand-btn" @click.stop="toggleExpand('address')">
                  {{ expanded.address ? "收起" : "查看更多" }}
                </text>
              </view>
              <text class="copy" @click.stop="copyRow('地址', order.address)">复制</text>
            </view>
            <view class="row" @click="copyRow('时间', (order.date || '') + ' ' + (order.time || ''))">
              <text class="label">时间</text>
              <text class="value">{{ order.date }} {{ order.time }}</text>
              <text class="copy">复制</text>
            </view>
            <view v-if="order.remark" class="row">
              <text class="label">备注</text>
              <view class="value-wrap">
                <text class="value" :class="{ clamp3: !expanded.remark && isLongText(order.remark) }">{{ order.remark }}</text>
                <text v-if="isLongText(order.remark)" class="expand-btn" @click.stop="toggleExpand('remark')">
                  {{ expanded.remark ? "收起" : "查看更多" }}
                </text>
              </view>
              <text class="copy" @click.stop="copyRow('备注', order.remark)">复制</text>
            </view>
          </view>

          <!-- 物品照片 -->
          <view v-if="photos.length" class="card">
            <view class="card-title">物品照片</view>
            <view class="photos">
              <image
                v-for="(p, i) in photos"
                :key="p"
                class="photo"
                :src="p"
                mode="aspectFill"
                @click="previewPhoto(i)"
              />
            </view>
          </view>

          <!-- 操作 -->
          <view class="actions">
            <view class="btn primary" @click="copyAll">复制全部信息</view>
            <view class="btn call" @click="call">拨打电话</view>
          </view>
        </template>

        <!-- 分享按钮始终显示（无论是否加载到数据），支持对方二次转发 -->
        <button v-if="!loading" class="share-btn" open-type="share">分享给他人查看</button>
        <view v-if="!loading" class="share-tip">对方打开后仅可查看和复制，无法修改</view>

        <vc-safe-bottom />
      </view>
    </vc-container>
  </view>
</template>

<script>
import { toTempFileURLs } from "@/utils/cloud";
import vcLoading from "@/components/library/base/vc-loading/vc-loading.vue";

export default {
  name: "appointmentDetail",
  components: { vcLoading },
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "预约详情" },
          isFullScreen: { value: true },
          backgroundColor: { value: "#f5f6f8" },
        },
      },
      id: "",
      order: null,
      loading: true,
      expanded: { address: false, remark: false },
    };
  },
  computed: {
    itemText() {
      const item = (this.order && this.order.item) || {};
      return [item.brand, item.model].filter(Boolean).join(" ") || item.category || "回收物品";
    },
    condition() {
      return (this.order && this.order.item && this.order.item.condition) || "";
    },
    price() {
      return (this.order && this.order.item && this.order.item.price) || 0;
    },
    photos() {
      const list = (this.order && this.order.images) || [];
      return Array.isArray(list) ? list.filter(Boolean) : [];
    },
  },
  onLoad(options) {
    this.id = options.id || "";
    this.loadDetail();
  },
  onShareAppMessage() {
    return {
      title: "回收预约详情",
      path: `/pages/admin/appointmentDetail?id=${this.id}`,
    };
  },
  methods: {
    async loadDetail() {
      if (!this.id) {
        this.loading = false;
        return;
      }
      try {
        const db = wx.cloud.database();
        const res = await db.collection("appointments").doc(this.id).get();
        this.order = res.data || null;
      } catch (e) {
        console.warn("加载预约详情失败", e);
        this.bridgeSdk.showToast({ title: "加载失败" });
      } finally {
        this.loading = false;
      }
    },
    copyRow(label, text) {
      // 复制时带上标题，例如：电话：13130000000
      uni.setClipboardData({
        data: `${label}：${text || ""}`,
        success: () => this.bridgeSdk.showToast({ title: label + "已复制" }),
      });
    },
    copyAll() {
      const o = this.order || {};
      const item = o.item || {};
      const text = [
        "【回收预约】",
        `物品：${this.itemText}`,
        `成色：${item.condition || ""}`,
        `报价：¥${item.price || 0}`,
        `联系人：${o.name || ""}`,
        `电话：${o.phone || ""}`,
        `地址：${o.address || ""}`,
        `时间：${o.date || ""} ${o.time || ""}`,
        o.remark ? `备注：${o.remark}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      uni.setClipboardData({
        data: text,
        success: () => this.bridgeSdk.showToast({ title: "全部信息已复制" }),
      });
    },
    call() {
      if (this.order && this.order.phone) {
        this.bridgeSdk.makePhoneCall({ phoneNumber: this.order.phone });
      }
    },
    /** 长文本判断（约 3 行 ≈ 60 个字符） */
    isLongText(text) {
      return String(text || "").length > 60;
    },
    toggleExpand(key) {
      this.expanded = { ...this.expanded, [key]: !this.expanded[key] };
    },
    async previewPhoto(index) {
      // 云文件ID需要先换成临时链接，previewImage 才能打开
      const urls = await toTempFileURLs(this.photos);
      uni.previewImage({ urls, current: urls[index] });
    },
    statusText(status) {
      const map = { pending: "待处理", done: "已完成", canceled: "已取消", deleted: "已删除" };
      return map[status] || "待处理";
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  width: 750rpx;
  min-height: 100vh;
  background: #f5f6f8;
  box-sizing: border-box;
  padding-bottom: 40rpx;
}

.tip {
  text-align: center;
  padding: 120rpx 0;
  font-size: 28rpx;
  color: #9ca3af;
}

.header-card {
  margin: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

  .name-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }
    .status {
      padding: 6rpx 18rpx;
      border-radius: 10rpx;
      font-size: 24rpx;
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
  }

  .price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 24rpx;

    .price-label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.85);
    }
    .price {
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
    }
  }
}

.card {
  margin: 24rpx;
  padding: 12rpx 28rpx;
  background: #fff;
  border-radius: 20rpx;

  .card-title {
    padding: 20rpx 0 12rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #111827;
  }


  .photos {
    display: flex;
    flex-wrap: wrap;
    padding: 12rpx 0;

    .photo {
      width: 150rpx;
      height: 150rpx;
      margin: 0 14rpx 14rpx 0;
      border-radius: 12rpx;
      background: #f3f4f6;
    }
  }

  .row {
    display: flex;
    align-items: center;
    padding: 22rpx 0;
    border-top: 2rpx solid #f3f4f6;

    .label {
      width: 100rpx;
      flex-shrink: 0;
      font-size: 26rpx;
      color: #9ca3af;
    }
    .value {
      flex: 1;
      font-size: 28rpx;
      color: #374151;
      line-height: 40rpx;
      word-break: break-all;

      &.link {
        color: #2563eb;
      }
      &.price-text {
        color: #f59e0b;
        font-weight: bold;
      }

      &.clamp3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .value-wrap {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .expand-btn {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: #16a34a;
    }
    .copy {
      flex-shrink: 0;
      margin-left: 16rpx;
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #16a34a;
      background: #ecfdf5;
    }
  }
}

.actions {
  display: flex;
  margin: 24rpx;

  .btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;

    &:first-child {
      margin-left: 0;
    }
    &.primary {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #fff;
      font-weight: bold;
    }
    &.call {
      background: #fff;
      color: #2563eb;
    }
  }
}

.share-btn {
  margin: 0 24rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: #fff;
  color: #16a34a;
  font-size: 30rpx;
  font-weight: bold;
  border: none;

  &::after {
    border: none;
  }
}

.share-tip {
  margin-top: 20rpx;
  text-align: center;
  font-size: 22rpx;
  color: #9ca3af;
}
</style>
