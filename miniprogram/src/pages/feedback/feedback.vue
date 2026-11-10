<!--
 * @Description: 意见反馈（接入云开发 feedbacks 集合）
 * @Author: chilei gchilei0815@gmail.com
-->
<template>
  <view>
    <vc-container :props-data="containerProps">
      <view class="feedback">

        <view class="form-card">
          <view class="label">问题类型</view>
          <view class="types">
            <view
              v-for="t in types"
              :key="t.key"
              class="type-item"
              :class="{ active: form.type === t.key }"
              @click="form.type = t.key"
            >
              {{ t.name }}
            </view>
          </view>
        </view>

        <view class="form-card">
          <view class="label">反馈内容</view>
          <textarea
            v-model="form.content"
            class="textarea"
            placeholder="请描述你遇到的问题或建议，我们会尽快处理"
            placeholder-class="ph"
            maxlength="500"
          />
          <view class="count">{{ form.content.length }}/500</view>
        </view>

        <view class="form-card">
          <view class="label">联系方式（选填）</view>
          <input
            v-model="form.contact"
            class="input"
            placeholder="手机号或微信号，方便我们回复你"
            placeholder-class="ph"
          />
        </view>

        <view class="submit-btn" :class="{ disabled: submitting }" @click="submit">
          {{ submitting ? "提交中..." : "提交反馈" }}
        </view>

        <view class="tip">你的反馈会直接发送给我们，感谢支持</view>

        <vc-safe-bottom />
      </view>
    </vc-container>
  </view>
</template>

<script>
import { submitFeedback } from "@/utils/cloud";

export default {
  name: "feedback",
  data() {
    return {
      containerProps: {
        props: {
          title: { value: "意见反馈" },
          isFullScreen: { value: true },
          containerBackground: { value: "#f5f6f8" },
        },
      },
      types: [
        { key: "功能建议", name: "功能建议" },
        { key: "价格问题", name: "价格问题" },
        { key: "服务问题", name: "服务问题" },
        { key: "其他", name: "其他" },
      ],
      form: {
        type: "",
        content: "",
        contact: "",
      },
      submitting: false,
    };
  },
  methods: {
    async submit() {
      if (!this.form.type) {
        this.bridgeSdk.showToast({ title: "请选择问题类型" });
        return;
      }
      if (!this.form.content.trim()) {
        this.bridgeSdk.showToast({ title: "请填写反馈内容" });
        return;
      }
      if (this.submitting) return;

      this.submitting = true;
      try {
        await submitFeedback({
          type: this.form.type,
          content: this.form.content.trim(),
          contact: this.form.contact.trim(),
        });
        this.bridgeSdk.showToast({ title: "提交成功，感谢反馈" });
        setTimeout(() => {
          this.bridgeSdk.navigateBackTo({ delta: 1 });
        }, 1200);
      } catch (e) {
        console.warn("提交反馈失败", e);
        this.bridgeSdk.showToast({ title: "提交失败，请稍后重试" });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback {
  width: 750rpx;
  min-height: 100vh;
  background: #f5f6f8;
  box-sizing: border-box;
  padding: 24rpx 24rpx 40rpx;
}

.form-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;

  .label {
    font-size: 28rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 20rpx;
  }

  .types {
    display: flex;
    flex-wrap: wrap;

    .type-item {
      padding: 16rpx 28rpx;
      margin: 0 16rpx 16rpx 0;
      border-radius: 12rpx;
      background: #f3f4f6;
      font-size: 26rpx;
      color: #4b5563;

      &.active {
        background: #ecfdf5;
        border: 2rpx solid #16a34a;
        color: #16a34a;
        font-weight: bold;
      }
    }
  }

  .textarea {
    width: 100%;
    height: 240rpx;
    padding: 20rpx;
    box-sizing: border-box;
    background: #f6f7f8;
    border-radius: 12rpx;
    font-size: 28rpx;
    line-height: 40rpx;
  }

  .count {
    margin-top: 10rpx;
    text-align: right;
    font-size: 22rpx;
    color: #9ca3af;
  }

  .input {
    height: 80rpx;
    padding: 0 20rpx;
    background: #f6f7f8;
    border-radius: 12rpx;
    font-size: 28rpx;
  }
}

.ph {
  color: #b0b4bb;
  font-size: 26rpx;
}

.submit-btn {
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rpx;

  &.disabled {
    opacity: 0.6;
  }
}

.tip {
  margin-top: 24rpx;
  text-align: center;
  font-size: 22rpx;
  color: #9ca3af;
}
</style>
