<template>
  <view class="container">
    <view class="header safe-area-top">
      <view class="user-info">
        <view class="avatar" @click="handleAvatarClick">
          <image :src="userAvatar" class="avatar-image" mode="aspectFill" />
          <view class="avatar-edit">
            <text class="edit-icon">📷</text>
          </view>
        </view>
        <view class="user-detail">
          <text class="user-name">用户昵称</text>
          <text class="user-desc">欢迎使用家电回收服务</text>
        </view>
      </view>
      
      <view class="stats">
        <view class="stat-item">
          <text class="stat-value">0</text>
          <text class="stat-label">回收订单</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">¥0</text>
          <text class="stat-label">累计收益</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">0</text>
          <text class="stat-label">优惠券</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" v-for="item in menuList" :key="item.id" @click="handleMenuClick(item)">
        <view class="menu-icon">{{ item.icon }}</view>
        <text class="menu-text">{{ item.title }}</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <view class="menu-section mt-lg">
      <view class="menu-item" @click="handlePrivacy">
        <view class="menu-icon">📜</view>
        <text class="menu-text">隐私协议</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="handleTerms">
        <view class="menu-icon">📋</view>
        <text class="menu-text">服务条款</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @click="handleAbout">
        <view class="menu-icon">ℹ️</view>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <view class="qrcode-section">
      <view class="qrcode-card">
        <view class="qrcode-header">
          <text class="qrcode-title">扫码关注</text>
          <text class="qrcode-desc">关注公众号获取更多优惠</text>
        </view>
        <view class="qrcode-content">
          <image :src="qrcodeUrl" class="qrcode-image" mode="widthFix" />
          <text class="qrcode-tip">长按识别二维码</text>
        </view>
      </view>
    </view>

    <view class="version safe-area-bottom">
      <text class="version-text">版本 v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { bridgeSdk } from '@/utils/bridge'

const userAvatar = ref('https://neeko-copilot.bytedance.net/api/text_to_image?prompt=default%20user%20avatar%20icon%20simple%20clean%20design&image_size=square')
const qrcodeUrl = ref('https://neeko-copilot.bytedance.net/api/text_to_image?prompt=QR%20code%20simple%20clean%20white%20background&image_size=square')

const menuList = [
  { id: '1', title: '我的订单', icon: '📦', path: '/pages/mine/order' },
  { id: '2', title: '预约记录', icon: '📝', path: '/pages/mine/record' },
  { id: '3', title: '回收价格', icon: '💰', path: '/pages/recycle-price/index' },
  { id: '4', title: '常见问题', icon: '❓', path: '/pages/mine/help' },
  { id: '5', title: '联系客服', icon: '💬', path: '/pages/mine/service' },
  { id: '6', title: '二维码', icon: '📱', path: '/pages/memberCode/index' }
]

const handleAvatarClick = () => {
  bridgeSdk.showToast({
    title: '头像设置',
    icon: 'none'
  })
}

const handleMenuClick = (item: any) => {
  if (item.path === '/pages/recycle-price/index') {
    bridgeSdk.switchTab({
      url: item.path
    })
  } else if (item.path === '/pages/memberCode/index') {
    bridgeSdk.navigateTo({
      url: item.path
    })
  } else {
    bridgeSdk.showToast({
      title: `即将打开：${item.title}`,
      icon: 'none'
    })
  }
}

const handlePrivacy = () => {
  bridgeSdk.showModal({
    title: '隐私协议',
    content: `尊敬的用户，感谢您使用我们的家电回收服务。

我们重视您的隐私保护，承诺严格遵守相关法律法规，保护您的个人信息安全。

1. 信息收集：我们仅收集必要的个人信息用于服务提供
2. 信息使用：您的信息仅用于为您提供回收服务
3. 信息保护：我们采用加密技术保护您的信息安全

如需了解详情，请查看完整隐私协议。`,
    showCancel: false,
    confirmText: '我已知悉'
  })
}

const handleTerms = () => {
  bridgeSdk.showModal({
    title: '服务条款',
    content: `欢迎使用家电回收服务！

1. 服务内容：我们提供专业的二手家电回收服务
2. 服务流程：在线预约 → 上门检测 → 现场付款 → 环保处理
3. 价格说明：报价仅供参考，实际价格以上门检测为准
4. 用户义务：请确保提供的家电信息真实准确

使用本服务即表示您同意以上条款。`,
    showCancel: false,
    confirmText: '我已知悉'
  })
}

const handleAbout = () => {
  bridgeSdk.showModal({
    title: '关于我们',
    content: `家电回收 v1.0.0

专业的二手家电回收平台，致力于环保回收事业。

服务特色：
✓ 免费上门服务
✓ 专业检测评估
✓ 即时付款结算
✓ 正规环保处理

客服热线：400-123-4567
服务时间：9:00-21:00`,
    showCancel: false,
    confirmText: '知道了'
  })
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #00a8ff 0%, #0080ff 100%);
  padding: 60rpx 32rpx 40rpx;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    
    .avatar {
      position: relative;
      width: 140rpx;
      height: 140rpx;
      
      .avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 6rpx solid rgba(255, 255, 255, 0.5);
      }
      
      .avatar-edit {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 48rpx;
        height: 48rpx;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4rpx solid #ffffff;
        
        .edit-icon {
          font-size: 24rpx;
        }
      }
    }
    
    .user-detail {
      margin-left: 28rpx;
      
      .user-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #ffffff;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .user-desc {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .stats {
    display: flex;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    padding: 32rpx;
    
    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 8rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .stat-divider {
      width: 2rpx;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 20rpx;
    }
  }
}

.menu-section {
  margin: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .menu-icon {
      font-size: 40rpx;
      margin-right: 24rpx;
    }
    
    .menu-text {
      flex: 1;
      font-size: 30rpx;
      color: #333333;
    }
    
    .menu-arrow {
      font-size: 28rpx;
      color: #cccccc;
    }
  }
}

.qrcode-section {
  padding: 0 24rpx;
  
  .qrcode-card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    
    .qrcode-header {
      text-align: center;
      margin-bottom: 24rpx;
      
      .qrcode-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .qrcode-desc {
        font-size: 24rpx;
        color: #999999;
      }
    }
    
    .qrcode-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .qrcode-image {
        width: 240rpx;
        height: 240rpx;
        background: #f5f5f5;
        border-radius: 16rpx;
        padding: 20rpx;
        box-sizing: border-box;
      }
      
      .qrcode-tip {
        font-size: 24rpx;
        color: #999999;
        margin-top: 16rpx;
      }
    }
  }
}

.version {
  padding: 32rpx;
  text-align: center;
  
  .version-text {
    font-size: 24rpx;
    color: #999999;
  }
}

.mt-lg {
  margin-top: 24rpx;
}
</style>