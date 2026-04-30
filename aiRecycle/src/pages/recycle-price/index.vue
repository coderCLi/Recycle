<template>
  <view class="container">
    <view class="header safe-area-top">
      <text class="header-title">回收价格</text>
      <text class="header-sub">实时报价，透明公正</text>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input class="search-input" placeholder="搜索家电类型" v-model="searchKeyword" />
      </view>
    </view>

    <scroll-view class="category-tabs" scroll-x>
      <view class="category-tabs-inner">
        <view 
          class="category-tab" 
          :class="{ active: activeCategory === '' }"
          @click="activeCategory = ''"
        >
          全部
        </view>
        <view 
          class="category-tab" 
          v-for="category in categories" 
          :key="category.id"
          :class="{ active: activeCategory === category.name }"
          @click="activeCategory = category.name"
        >
          {{ category.name }}
        </view>
      </view>
    </scroll-view>

    <view class="products-list">
      <view class="product-card" v-for="product in filteredProducts" :key="product.id" @click="handleProductClick(product)">
        <image :src="product.image" class="product-image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-brand">{{ product.brand }}</text>
          <view class="product-condition">
            <text class="condition-item" v-for="(item, index) in product.condition.slice(0, 2)" :key="index">{{ item }}</text>
          </view>
          <view class="product-bottom">
            <view class="product-price">
              <text class="price-symbol">¥</text>
              <text class="price-range">{{ product.minPrice }}-{{ product.maxPrice }}</text>
              <text class="price-unit">{{ product.unit }}</text>
            </view>
            <view class="recycle-btn" @click.stop="handleQuickRecycle(product)">
              立即回收
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-if="filteredProducts.length === 0">
      <text class="empty-icon">📦</text>
      <text class="empty-text">暂无相关回收商品</text>
    </view>

    <view class="bottom-info safe-area-bottom">
      <text class="info-text">* 实际回收价格以上门检测为准</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categories, products } from '@/mock/data'
import { bridgeSdk } from '@/utils/bridge'

const searchKeyword = ref('')
const activeCategory = ref('')

const filteredProducts = computed(() => {
  let result = products
  
  if (activeCategory.value) {
    result = result.filter(p => p.category === activeCategory.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword) || 
      p.category.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

const handleProductClick = (product: any) => {
  bridgeSdk.showModal({
    title: product.name,
    content: `${product.description}\n\n回收价：¥${product.minPrice}-${product.maxPrice}/${product.unit}\n\n支持品牌：${product.brand}`,
    showCancel: false,
    confirmText: '我要回收',
    success: () => {
      bridgeSdk.showToast({
        title: '已提交回收申请',
        icon: 'success'
      })
    }
  })
}

const handleQuickRecycle = (product: any) => {
  bridgeSdk.showToast({
    title: `即将回收：${product.name}`,
    icon: 'none'
  })
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 160rpx;
}

.header {
  background: linear-gradient(135deg, #00a8ff 0%, #0080ff 100%);
  padding: 60rpx 32rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .header-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 12rpx;
  }
  
  .header-sub {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.search-bar {
  padding: 24rpx;
  background: #ffffff;
  
  .search-input-wrap {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 40rpx;
    padding: 0 24rpx;
    height: 80rpx;
    
    .search-icon {
      font-size: 32rpx;
      margin-right: 16rpx;
    }
    
    .search-input {
      flex: 1;
      font-size: 28rpx;
      background: transparent;
    }
  }
}

.category-tabs {
  white-space: nowrap;
  background: #ffffff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  .category-tabs-inner {
    display: inline-flex;
    padding: 0 24rpx;
    
    .category-tab {
      padding: 16rpx 32rpx;
      font-size: 28rpx;
      color: #666666;
      background: #f5f5f5;
      border-radius: 32rpx;
      margin-right: 20rpx;
      transition: all 0.3s ease;
      
      &.active {
        background: #00a8ff;
        color: #ffffff;
      }
    }
  }
}

.products-list {
  padding: 24rpx;
  
  .product-card {
    display: flex;
    background: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    
    .product-image {
      width: 240rpx;
      height: 240rpx;
      flex-shrink: 0;
    }
    
    .product-info {
      flex: 1;
      padding: 20rpx;
      display: flex;
      flex-direction: column;
      
      .product-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 12rpx;
      }
      
      .product-brand {
        font-size: 24rpx;
        color: #999999;
        margin-bottom: 12rpx;
      }
      
      .product-condition {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16rpx;
        
        .condition-item {
          font-size: 22rpx;
          color: #666666;
          background: #f5f5f5;
          padding: 6rpx 16rpx;
          border-radius: 8rpx;
          margin-right: 12rpx;
          margin-bottom: 8rpx;
        }
      }
      
      .product-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        
        .product-price {
          display: flex;
          align-items: baseline;
          
          .price-symbol {
            font-size: 24rpx;
            color: #ff4d4f;
            font-weight: bold;
          }
          
          .price-range {
            font-size: 36rpx;
            color: #ff4d4f;
            font-weight: bold;
          }
          
          .price-unit {
            font-size: 22rpx;
            color: #999999;
            margin-left: 8rpx;
          }
        }
        
        .recycle-btn {
          background: linear-gradient(135deg, #00a8ff 0%, #0080ff 100%);
          color: #ffffff;
          font-size: 24rpx;
          padding: 12rpx 24rpx;
          border-radius: 24rpx;
        }
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999999;
  }
}

.bottom-info {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 20rpx;
  text-align: center;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .info-text {
    font-size: 24rpx;
    color: #999999;
  }
}
</style>