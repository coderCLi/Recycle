<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="contact-us">
    <view>
      <!-- 顶部banner -->
      <view class="banner">
        <view class="banner-content"></view>
      </view>

      <!-- 联系信息区域 -->
      <view class="contact-content">
        <!-- 客服热线 -->
        <view class="contact-item">
          <view class="item-left">
            <u-icon name="phone-fill" size="36" color="#2979ff"></u-icon>
            <view class="info">
              <text class="label">客服热线</text>
              <text class="value">{{ phoneNumber }}</text>
            </view>
          </view>
          <view class="action-btn" @click="handleCall">拨打电话</view>
        </view>

        <!-- 邮箱 -->
        <!-- <view class="contact-item">
          <view class="item-left">
            <u-icon name="email-fill" size="36" color="#ff9900"></u-icon>
            <view class="info">
              <text class="label">邮箱</text>
              <text class="value">{{ email }}</text>
            </view>
          </view>
          <view class="action-btn" @click="handleCopyEmail">复制邮箱</view>
        </view> -->

        <!-- 客服时间 -->
        <view class="service-hours">
          <text class="title">- 客服在线时间 -</text>
          <text class="time">周一至周五(节假日除外)</text>
          <text class="time">上午 8:30-12:00 下午13:30-17:30</text>
        </view>
      </view>
      <vc-safe-bottom />
    </view>
  </vc-container>
</template>

<script>
import {
  getGlobalCode,
} from "@/api/mine";
export default {
  name: "contact-us",
  data() {
    return {
      phoneNumber: '',//0411-39726666
      email: 'xiongan20240828@163.com'
    }
  },
  onLoad() {
    getGlobalCode({ code: "phoneNumber" }, { mask: false, catchError: true, encrypt: false, decrypt: false }).then(res => {
        console.log("getGlobalCode", res)
        this.phoneNumber = res.param
      })
  },
  methods: {
    
    handleCall() {
      this.bridgeSdk.makePhoneCall({
        phoneNumber: this.phoneNumber,
        success: () => {
          console.log('拨打电话成功')
        },
        fail: (err) => {
          console.error('拨打电话失败', err)
        }
      })
    },
    handleCopyEmail() {
      uni.setClipboardData({
        data: this.email,
        success: () => {
          uni.showToast({
            title: '邮箱已复制',
            icon: 'success'
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-us {
  .banner {
    width: 100%;
    height: 220rpx;
    background: #2979ff;
    position: relative;
    overflow: hidden;

    .banner-content {
      position: relative;
      height: 100%;
      padding: 40rpx;
      z-index: 1;
    }
  }

  .contact-content {
    padding: 30rpx;
    margin-top: -80rpx;
    position: relative;
  }

  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 32rpx;
    margin-bottom: 24rpx;
    border-radius: 12rpx;

    .item-left {
      display: flex;
      align-items: center;

      :deep(.u-icon) {
        margin-right: 20rpx;
      }

      .info {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 12rpx;
        }

        .value {
          font-size: 28rpx;
          color: #333;
        }
      }
    }

    .action-btn {
      min-width: 140rpx;
      height: 64rpx;
      line-height: 64rpx;
      text-align: center;
      color: #ffffff;
      font-size: 24rpx;
      background: #0084ff;
      border-radius: 32rpx;
    }
  }

  .service-hours {
    margin-top: 350rpx;
    text-align: center;
    padding-bottom: 40rpx;

    .title {
      display: block;
      font-size: 28rpx;
      color: #999;
      margin-bottom: 20rpx;
    }

    .time {
      display: block;
      font-size: 24rpx;
      color: #999;
      line-height: 2;
    }
  }
}
</style> 