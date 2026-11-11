<!--
 * @Description: 预约上门回收
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="appointment">

        <!-- 提交成功 -->
        <view v-if="submitted" class="success">
          <view class="success-icon">✓</view>
          <view class="success-title">预约提交成功</view>
          <view class="success-desc">我们会在 2 小时内与您联系，请保持电话畅通</view>
          <!-- #ifdef MP-WEIXIN -->
          <view v-if="subscribeStatus === 'accept'" class="success-notice">
            已开启预约通知，商家处理后会在微信通知你
          </view>
          <view v-else-if="subscribeBlocked" class="success-warn">
            未开启「预约回收通知」，商家处理后无法通知你
            <text class="success-link" @click="showSubscribeHelp">如何开启</text>
          </view>
          <view v-if="subscribeStatus !== 'accept'" class="btn-ghost" @click="retrySubscribe">
            {{ retrying ? "申请中..." : "开启预约通知" }}
          </view>
          <!-- #endif -->
          <view class="btn-primary" @click="backHome">返回首页</view>
        </view>

        <!-- 表单（仅在表单区域内滚动，页面本身不滚） -->
        <scroll-view v-else class="form-scroll" scroll-y>
          <!-- 估价信息 -->
          <view v-if="item" class="card">
            <view class="card-title">回收物品</view>
            <view class="info-row">
              <text class="info-label">物品</text>
              <text class="info-value">{{ item.brand }} {{ item.model }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">成色</text>
              <text class="info-value">{{ item.condition }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">预估价格</text>
              <text class="info-value price">{{ priceText }}</text>
            </view>
            <view class="price-note">* 以上为预估价格，实际以师傅上门验机为准</view>
          </view>

          <!-- 联系人 -->
          <view class="card">
            <view class="card-title">联系方式</view>
            <view class="form-row">
              <text class="form-label">联系人</text>
              <input class="form-input" v-model="form.name" placeholder="请输入姓名" placeholder-class="ph" />
            </view>
            <view class="form-row">
              <text class="form-label">手机号<text class="required">*</text></text>
              <input
                class="form-input"
                v-model="form.phone"
                type="number"
                maxlength="11"
                placeholder="请输入手机号"
                placeholder-class="ph"
                @blur="onPhoneBlur"
              />
              <!-- #ifdef MP-WEIXIN -->
              <button class="phone-wx-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
                获取微信手机号
              </button>
              <!-- #endif -->
            </view>
            <view v-if="phoneTouched && !form.phone" class="form-error">请输入手机号</view>
            <view v-else-if="phoneTouched && !phoneValid" class="form-error">手机号格式不正确，请检查</view>
          </view>

          <!-- 上门地址 -->
          <view class="card">
            <view class="card-title">上门地址</view>
            <view class="form-row">
              <text class="form-label">详细地址</text>
              <input class="form-input" v-model="form.address" placeholder="小区/街道/门牌号" placeholder-class="ph" />
            </view>
          </view>

          <!-- 预约时间 -->
          <view class="card">
            <view class="card-title">预约时间</view>
            <picker mode="date" :value="form.date" @change="onDateChange">
              <view class="form-row">
                <text class="form-label">日期</text>
                <text class="form-value">{{ form.date }}</text>
              </view>
            </picker>
            <view class="form-row">
              <text class="form-label">时段</text>
              <view class="time-slots">
                <view
                  v-for="t in timeSlots"
                  :key="t"
                  class="time-slot"
                  :class="{ active: form.time === t }"
                  @click="form.time = t"
                >{{ t }}</view>
              </view>
            </view>
          </view>

          <!-- 物品照片 -->
          <view class="card">
            <view class="card-title">物品照片（选填，最多 {{ maxImages }} 张）</view>
            <view class="image-list">
              <view v-for="(img, i) in images" :key="img" class="image-item">
                <image class="image-thumb" :src="img" mode="aspectFill" @click="previewImages(i)" />
                <view class="image-del" @click.stop="removeImage(i)">×</view>
              </view>
              <view v-if="images.length < maxImages" class="image-add" @click="chooseImages">
                <view class="image-add-icon">+</view>
                <view class="image-add-text">上传照片</view>
              </view>
            </view>
            <view class="image-tip">可拍摄物品外观、故障位置，方便师傅提前准备</view>
          </view>

          <!-- 备注 -->
          <view class="card">
            <view class="card-title">备注（选填）</view>
            <textarea class="form-textarea" v-model="form.remark" placeholder="补充说明，如设备数量、故障情况等" placeholder-class="ph" />
          </view>

          <view class="btn-primary" :class="{ disabled: submitting }" @click="submit">
            {{ submitting ? "提交中..." : "提交预约" }}
          </view>
          <view class="tip">提交即表示同意上门回收服务</view>
          <view class="tip tip-sub">提交时申请「预约回收通知」授权，商家处理后会通知你</view>
          <vc-safe-bottom />
        </scroll-view>
      </view>
    </vc-container>
  </view>
</template>

<script>
import { submitAppointment, sendAppointmentNotice, isCloudAvailable, callFunction } from "@/utils/cloud";
import { requestAppointmentSubscribe } from "@/utils/subscribe";
import { notifyWecom } from "@/utils/wecom";

export default {
  name: "appointment",
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "预约上门" },
          isFullScreen: { value: true },
          backgroundColor: { value: "#f5f6f8" },
        },
      },
      item: null,
      submitted: false,
      // 本次订阅授权结果：accept / reject / ban / filter / invalid / error / unsupported
      subscribeStatus: "",
      retrying: false,
      timeSlots: ["上午 9:00-12:00", "下午 13:00-17:00", "晚上 18:00-20:00"],
      // 物品照片（最多 4 张）
      images: [],
      maxImages: 4,
      // 已上传照片缓存：本地路径 -> 云文件ID，避免重试提交时重复上传
      uploadCache: {},
      // 手机号是否已输入过（失焦后才提示格式错误）
      phoneTouched: false,
      // 提交中（防重复点击）
      submitting: false,
      form: {
        name: "",
        phone: "",
        address: "",
        date: "",
        time: "",
        remark: "",
      },
    };
  },
  computed: {
    phoneValid() {
      return this.reg.checkPhone(String(this.form.phone || "").trim());
    },
    // 用户拒绝过 / 关闭了总开关 / 模板异常：需要引导去设置
    subscribeBlocked() {
      return ["reject", "ban", "filter", "invalid", "error"].includes(this.subscribeStatus);
    },
    priceText() {
      const p = this.item && this.item.price;
      return p ? "¥" + p : "待师傅评估";
    },
  },
  onLoad(options) {
    if (options && options.item) {
      try {
        this.item = JSON.parse(decodeURIComponent(options.item));
      } catch (e) {
        this.item = null;
      }
    }
    // 默认日期为明天
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    this.form.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },
  methods: {
    onDateChange(e) {
      this.form.date = e.detail.value;
    },
    // 手机号失焦：去掉非数字字符并提示校验结果
    onPhoneBlur() {
      this.form.phone = String(this.form.phone || "").replace(/\D/g, "").slice(0, 11);
      this.phoneTouched = true;
    },
    // ---------- 物品照片 ----------
    chooseImages() {
      const left = this.maxImages - this.images.length;
      if (left <= 0) return;
      uni.chooseImage({
        count: left,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const paths = res.tempFilePaths || [];
          this.images = this.images.concat(paths).slice(0, this.maxImages);
        },
        fail: (err) => console.warn("选择照片失败", err),
      });
    },
    removeImage(index) {
      this.images.splice(index, 1);
    },
    previewImages(index) {
      uni.previewImage({ urls: this.images, current: this.images[index] });
    },
    /** 上传照片到云存储，返回 fileID 数组；失败返回 null */
    async uploadImages() {
      if (this.images.length === 0) return [];
      // #ifndef MP-WEIXIN
      // 非小程序环境不支持云存储，直接保留本地临时路径
      return this.images.slice();
      // #endif
      // #ifdef MP-WEIXIN
      if (!isCloudAvailable()) return this.images.slice();
      uni.showLoading({ title: "上传照片中...", mask: true });
      const fileIDs = [];
      try {
        for (let i = 0; i < this.images.length; i++) {
          const path = this.images[i];
          // 已经上传过的直接复用，避免提交失败重试时重复上传
          if (this.uploadCache[path]) {
            fileIDs.push(this.uploadCache[path]);
            continue;
          }
          const extMatch = String(path).match(/\.([a-zA-Z0-9]+)(\?|$)/);
          const ext = extMatch ? extMatch[1] : "jpg";
          const cloudPath = `appointments/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const res = await wx.cloud.uploadFile({ cloudPath, filePath: path });
          if (!res || !res.fileID) throw new Error("上传失败");
          this.uploadCache[path] = res.fileID;
          fileIDs.push(res.fileID);
        }
        return fileIDs;
      } catch (e) {
        console.warn("照片上传失败", e);
        this.bridgeSdk.showToast({ title: "照片上传失败，请重试" });
        return null;
      } finally {
        uni.hideLoading();
      }
      // #endif
    },
    // ---------- 获取微信手机号 ----------
    async onGetPhoneNumber(e) {
      const code = e && e.detail && e.detail.code;
      if (!code) {
        this.bridgeSdk.showToast({ title: "未获取到微信手机号，请手动填写" });
        return;
      }
      if (!isCloudAvailable()) {
        this.bridgeSdk.showToast({ title: "当前环境不支持，请手动填写" });
        return;
      }
      uni.showLoading({ title: "获取中...", mask: true });
      try {
        const res = await callFunction("getPhoneNumber", { code });
        const phoneNumber = res && (res.purePhoneNumber || res.phoneNumber);
        if (res && res.success && phoneNumber) {
          this.form.phone = String(phoneNumber).replace(/\D/g, "").slice(-11);
          this.phoneTouched = true;
          this.bridgeSdk.showToast({ title: "已自动填写手机号" });
        } else {
          this.bridgeSdk.showToast({ title: (res && res.message) || "获取失败，请手动填写" });
        }
      } catch (err) {
        console.warn("获取微信手机号失败", err);
        this.bridgeSdk.showToast({ title: "获取失败，请手动填写" });
      } finally {
        uni.hideLoading();
      }
    },
    async submit() {
      const { name, phone, address, date, time } = this.form;
      const mobile = String(phone || "").trim();
      if (!name.trim()) {
        this.bridgeSdk.showToast({ title: "请填写联系人" });
        return;
      }
      if (!mobile) {
        this.phoneTouched = true;
        this.bridgeSdk.showToast({ title: "请填写手机号" });
        return;
      }
      if (!this.reg.checkPhone(mobile)) {
        this.phoneTouched = true;
        this.bridgeSdk.showToast({ title: "手机号格式不正确，请检查" });
        return;
      }
      if (!address.trim()) {
        this.bridgeSdk.showToast({ title: "请填写上门地址" });
        return;
      }
      if (!time) {
        this.bridgeSdk.showToast({ title: "请选择预约时段" });
        return;
      }

      if (this.submitting) return;
      this.submitting = true;
      try {
        // 一次性订阅消息：必须在点击事件中发起授权，拒绝或失败都不影响预约
        const subscribeResult = await requestAppointmentSubscribe();
        const subscribeAccepted = subscribeResult === "accept";
        this.subscribeStatus = subscribeResult;
        console.log("订阅消息授权结果", subscribeResult);

        // 上传物品照片（失败则中止，避免丢失照片）
        const images = await this.uploadImages();
        if (images === null) return;

        const order = {
          ...this.form,
          phone: mobile,
          images,
          item: this.item,
          subscribeAccepted,
          subscribeStatus: subscribeResult,
        };

        // 优先走云开发云函数提交
        try {
          const res = await submitAppointment(order);
          if (res && res.success) {
            if (res.id) order._id = res.id;
            this.finish(order);
            return;
          }
          this.bridgeSdk.showToast({ title: (res && res.message) || "预约提交失败" });
          return;
        } catch (e) {
          console.warn("云开发提交失败，降级为本地存储", e);
        }

        // 降级：本地存储（未开通云开发时也能跑通）
        order.createTime = Date.now();
        this.finish(order);
      } finally {
        this.submitting = false;
      }
    },
    finish(order) {
      if (!order.createTime) order.createTime = Date.now();
      const list = this.bridgeSdk.getStorageSync("recycle_orders") || [];
      list.unshift(order);
      this.bridgeSdk.setStorageSync("recycle_orders", list);

      // 提交时只通知商家（企业微信 + 已开启提醒的管理员），客户此时不收消息；
      // 客户的订阅授权留到商家在管理端点「通知客户」时使用
      sendAppointmentNotice(order)
        .then((res) => {
          console.log("商家预约通知发送结果", res);
          // 云函数没能推送企业微信时，客户端兜底再试一次
          if (!res || !res.wecom) notifyWecom(order);
        })
        .catch((e) => {
          console.warn("商家预约通知发送失败，客户端兜底通知企业微信", e);
          notifyWecom(order);
        });

      this.trackReport.trackCustom("提交预约", JSON.stringify({ item: this.item && this.item.model }));
      this.submitted = true;
    },
    /** 成功页补充开启订阅授权（授权留到商家处理后接收通知） */
    async retrySubscribe() {
      if (this.retrying) return;
      this.retrying = true;
      try {
        const status = await requestAppointmentSubscribe();
        this.subscribeStatus = status;
        console.log("重新申请订阅结果", status);
        if (status === "accept") {
          this.bridgeSdk.showToast({ title: "已开启，商家处理后会通知你" });
        } else {
          this.showSubscribeHelp();
        }
      } catch (e) {
        console.warn("重新申请订阅失败", e);
        this.showSubscribeHelp();
      } finally {
        this.retrying = false;
      }
    },
    /** 微信已记住「不通知」时，引导用户去小程序设置里手动开启 */
    showSubscribeHelp() {
      uni.showModal({
        title: "开启预约通知",
        content:
          "微信已记住你上次选择的「不通知」。请点击右上角「···」→「设置」→ 打开「订阅消息」中的「预约回收通知」，开启后商家处理完你的预约会通过微信通知你。",
        showCancel: false,
        confirmText: "知道了",
      });
    },
    backHome() {
      this.bridgeSdk.toFirstPage();
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment {
  width: 750rpx;
  height: 100%;
  background: #f5f6f8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 表单滚动容器：页面本身不滚动，只有表单区域可滚 */
.form-scroll {
  flex: 1;
  height: 0;
  padding-bottom: 40rpx;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 24rpx 24rpx;
  padding: 28rpx;

  .card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 16rpx;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 0;

  .info-label {
    font-size: 28rpx;
    color: #6b7280;
  }
  .info-value {
    font-size: 28rpx;
    color: #1f2937;

    &.price {
      color: #f59e0b;
      font-weight: bold;
    }
  }
}

/* 预估价格下方的红字说明 */
.price-note {
  padding: 4rpx 0 12rpx;
  text-align: right;
  font-size: 22rpx;
  color: #ef4444;
  line-height: 32rpx;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 2rpx solid #f3f4f6;

  .form-label {
    width: 160rpx;
    font-size: 28rpx;
    color: #374151;
    flex-shrink: 0;

    .required {
      margin-left: 4rpx;
      color: #ef4444;
    }
  }
  .phone-wx-btn {
    flex-shrink: 0;
    margin: 0 0 0 16rpx;
    padding: 0 18rpx;
    height: 56rpx;
    border-radius: 28rpx;
    background: #ecfdf5;
    color: #16a34a;
    font-size: 22rpx;
    font-weight: normal;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      border: none;
    }
  }
  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #1f2937;
  }
  .form-value {
    flex: 1;
    font-size: 28rpx;
    color: #1f2937;
  }
  .time-slots {
    flex: 1;
    display: flex;
    flex-wrap: wrap;

    .time-slot {
      margin: 0 12rpx 12rpx 0;
      padding: 10rpx 20rpx;
      border-radius: 12rpx;
      background: #f3f4f6;
      font-size: 24rpx;
      color: #374151;

      &.active {
        background: #ecfdf5;
        color: #16a34a;
        border: 2rpx solid #22c55e;
      }
    }
  }
}

.form-error {
  margin: -8rpx 0 8rpx 160rpx;
  font-size: 22rpx;
  color: #ef4444;
  line-height: 32rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8rpx;
}

.image-item,
.image-add {
  position: relative;
  width: 148rpx;
  height: 148rpx;
  margin: 0 14rpx 14rpx 0;
  border-radius: 12rpx;
  overflow: hidden;
}

.image-thumb {
  display: block;
  width: 100%;
  height: 100%;
}

.image-del {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  line-height: 36rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 30rpx;
  border-bottom-left-radius: 12rpx;
}

.image-add {
  border: 2rpx dashed #d1d5db;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .image-add-icon {
    font-size: 48rpx;
    line-height: 1;
    color: #9ca3af;
  }
  .image-add-text {
    margin-top: 10rpx;
    font-size: 22rpx;
    color: #9ca3af;
  }
}

.image-tip {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 32rpx;
}

.form-textarea {
  width: 100%;
  height: 140rpx;
  font-size: 28rpx;
  color: #1f2937;
  box-sizing: border-box;
}

.ph {
  color: #c0c4cc;
}

.btn-ghost {
  margin: 0 24rpx 20rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #ecfdf5;
  color: #16a34a;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  margin: 8rpx 24rpx 0;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    opacity: 0.6;
  }
}

.tip {
  margin-top: 16rpx;
  text-align: center;
  font-size: 24rpx;
  color: #9ca3af;

  &.tip-sub {
    margin-top: 8rpx;
    color: #c0c4cc;
  }
}

.success {
  flex: 1;
  text-align: center;
  padding: 120rpx 40rpx;
  box-sizing: border-box;

  .success-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: #22c55e;
    color: #fff;
    font-size: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 32rpx;
  }
  .success-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #111827;
  }
  .success-desc {
    margin: 20rpx 0 40rpx;
    font-size: 28rpx;
    color: #6b7280;
  }
  .success-notice {
    margin: -24rpx 0 40rpx;
    font-size: 26rpx;
    color: #16a34a;
  }
  .success-warn {
    margin: -24rpx 0 32rpx;
    font-size: 24rpx;
    color: #d97706;
    line-height: 34rpx;
  }
  .success-link {
    color: #2563eb;
    text-decoration: underline;
  }
}
</style>

<!-- 非 scoped：小程序各页面 wxss 独立，此规则只作用于预约页 -->
<style lang="scss">
page {
  height: 100vh;
  overflow: hidden;
}
</style>
