<template>
  <view class="container">
    <view class="header safe-area-top">
      <view class="header-content">
        <view class="logo">
          <text class="logo-text">家电回收</text>
          <text class="logo-sub">专业 · 高价 · 环保</text>
        </view>
      </view>
    </view>

    <swiper class="banner" indicator-dots autoplay circular indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff">
      <swiper-item v-for="banner in banners" :key="banner.id">
        <image :src="banner.image" class="banner-image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="categories">
      <view class="category-item" v-for="category in categories" :key="category.id" @click="handleCategoryClick(category)">
        <view class="category-icon" :style="{ background: category.color }">
          <text class="icon-text">{{ category.name.charAt(0) }}</text>
        </view>
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>

    <view class="services">
      <view class="service-item" v-for="service in services" :key="service.id">
        <view class="service-icon">
          <view class="icon-inner" :class="'icon-' + service.icon"></view>
        </view>
        <text class="service-title">{{ service.title }}</text>
        <text class="service-desc">{{ service.desc }}</text>
      </view>
    </view>

    <view class="products-section">
      <view class="section-header">
        <text class="section-title">热门回收</text>
        <view class="more" @click="goToRecyclePrice">
          <text>查看更多</text>
          <text class="arrow">→</text>
        </view>
      </view>
      <view class="products-list">
        <view class="product-card" v-for="product in hotProducts" :key="product.id" @click="handleProductClick(product)">
          <image :src="product.image" class="product-image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-brand">{{ product.brand }}</text>
            <view class="product-price">
              <text class="price-symbol">¥</text>
              <text class="price-range">{{ product.minPrice }}-{{ product.maxPrice }}</text>
              <text class="price-unit">{{ product.unit }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-btn safe-area-bottom">
      <view class="btn btn-primary btn-lg btn-block" @click="handleRecycle">
        立即预约回收
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categories, products, banners, services } from '@/mock/data'
import { bridgeSdk } from '@/utils/bridge'

const hotProducts = computed(() => products.slice(0, 4))

const handleCategoryClick = (category: any) => {
  bridgeSdk.switchTab({
    url: '/pages/recycle-price/index'
  })
}

const handleProductClick = (product: any) => {
  bridgeSdk.showToast({
    title: `即将回收：${product.name}`,
    icon: 'none'
  })
}

const goToRecyclePrice = () => {
  bridgeSdk.switchTab({
    url: '/pages/recycle-price/index'
  })
}

const handleRecycle = () => {
  bridgeSdk.showToast({
    title: '正在跳转预约页面...',
    icon: 'loading'
  })
  setTimeout(() => {
    bridgeSdk.switchTab({
      url: '/pages/recycle-price/index'
    })
  }, 1000)
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #00a8ff 0%, #e8f4fc 30%, #f5f5f5 100%);
  padding-bottom: 180rpx;
}

.header {
  padding: 20rpx 32rpx;
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    display: flex;
    flex-direction: column;
    
    .logo-text {
      font-size: 40rpx;
      font-weight: bold;
      color: #ffffff;
    }
    
    .logo-sub {
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 4rpx;
    }
  }
}

.banner {
  margin: 0 24rpx;
  border-radius: 20rpx;
  overflow: hidden;
  height: 320rpx;
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
}

.categories {
  display: flex;
  flex-wrap: wrap;
  padding: 32rpx 24rpx;
  justify-content: space-between;
  
  .category-item {
    width: calc(100% / 6 - 16rpx);
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .category-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
      box-shadow: 0 8rpx 24rpx rgba(0, 168, 255, 0.2);
      
      .icon-text {
        color: #ffffff;
        font-size: 36rpx;
        font-weight: bold;
      }
    }
    
    .category-name {
      font-size: 24rpx;
      color: #333333;
    }
  }
}

.services {
  margin: 0 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .service-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .service-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8f4fc 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      border: 2rpx solid #e8f4fc;
      
      .icon-inner {
        width: 40rpx;
        height: 40rpx;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        
        &.icon-truck {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300a8ff'%3E%3Cpath d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E");
        }
        
        &.icon-wallet {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300a8ff'%3E%3Cpath d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 16l-5-2.18L7 19V5h10v14z'/%3E%3C/svg%3E");
        }
        
        &.icon-check {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300a8ff'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
        }
        
        &.icon-recycle {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300a8ff'%3E%3Cpath d='M19.02 4.92c-.13-.46-.56-.77-1.06-.72l-.13.02c-.47.05-.85.41-.97.87l-.01.12c-.18.71-.49 1.37-.9 1.95l-1.44 1.44c-.76-.38-1.6-.61-2.5-.61h-3.5c-.9 0-1.74.23-2.5.61l-1.44-1.44c-.41-.58-.72-1.24-.9-1.95l-.01-.12c-.12-.46-.5-.82-.97-.87l-.13-.02c-.5-.05-.93.26-1.06.72l-.02.13c-.18.72-.28 1.46-.28 2.22 0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-.76-.1-1.5-.28-2.22l.02-.13zM12 18c-3.31 0-6-2.69-6-6 0-.85.14-1.66.39-2.41l1.59 1.59c.44-.22.94-.35 1.48-.41.13 1.39 1.34 2.5 2.73 2.5 1.17 0 2.15-.78 2.5-1.82.45.06.95.19 1.48.41l1.59-1.59c.25.75.39 1.56.39 2.41 0 3.31-2.69 6-6 6z'/%3E%3C/svg%3E");
        }
      }
    }
    
    .service-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 6rpx;
    }
    
    .service-desc {
      font-size: 22rpx;
      color: #999999;
    }
  }
}

.products-section {
  margin-top: 32rpx;
  padding: 0 24rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
    
    .more {
      display: flex;
      align-items: center;
      color: #00a8ff;
      font-size: 26rpx;
      
      .arrow {
        margin-left: 8rpx;
      }
    }
  }
  
  .products-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .product-card {
      width: calc(50% - 16rpx);
      background: #ffffff;
      border-radius: 16rpx;
      overflow: hidden;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
      
      .product-image {
        width: 100%;
        height: 200rpx;
      }
      
      .product-info {
        padding: 20rpx;
        
        .product-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .product-brand {
          font-size: 22rpx;
          color: #999999;
          display: block;
          margin-bottom: 12rpx;
        }
        
        .product-price {
          display: flex;
          align-items: baseline;
          
          .price-symbol {
            font-size: 24rpx;
            color: #ff4d4f;
            font-weight: bold;
          }
          
          .price-range {
            font-size: 32rpx;
            color: #ff4d4f;
            font-weight: bold;
          }
          
          .price-unit {
            font-size: 22rpx;
            color: #999999;
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}

.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .btn {
    height: 96rpx;
    font-size: 32rpx;
    border-radius: 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 168, 255, 0.3);
  }
}
</style>