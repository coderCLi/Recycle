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

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      activeCategory: '',
      categories: [
        { id: '1', name: '空调', icon: 'air-conditioner', color: '#00a8ff' },
        { id: '2', name: '洗衣机', icon: 'washing-machine', color: '#ff6b6b' },
        { id: '3', name: '彩电', icon: 'tv', color: '#4ecdc4' },
        { id: '4', name: '冰箱', icon: 'refrigerator', color: '#ffe66d' },
        { id: '5', name: '电脑', icon: 'computer', color: '#95e1d3' },
        { id: '6', name: '其他', icon: 'other', color: '#a29bfe' }
      ],
      products: [
        { id: '1', name: '挂式空调', category: '空调', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20wall%20mounted%20air%20conditioner%20white%20background%20product%20photography&image_size=square', brand: '格力、美的、海尔等', minPrice: 200, maxPrice: 1500, unit: '元/台', condition: ['使用年限', '匹数', '品牌', '功能是否正常'], description: '专业回收各类品牌挂式空调' },
        { id: '2', name: '柜式空调', category: '空调', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20floor%20standing%20air%20conditioner%20white%20background%20product%20photography&image_size=square', brand: '格力、美的、海尔等', minPrice: 500, maxPrice: 3000, unit: '元/台', condition: ['使用年限', '匹数', '品牌', '功能是否正常'], description: '专业回收各类品牌柜式空调' },
        { id: '3', name: '滚筒洗衣机', category: '洗衣机', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20front%20loading%20washing%20machine%20white%20background%20product%20photography&image_size=square', brand: '海尔、美的、小天鹅等', minPrice: 150, maxPrice: 1200, unit: '元/台', condition: ['使用年限', '容量', '品牌', '功能是否正常'], description: '专业回收各类品牌滚筒洗衣机' },
        { id: '4', name: '波轮洗衣机', category: '洗衣机', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20top%20loading%20washing%20machine%20white%20background%20product%20photography&image_size=square', brand: '海尔、美的、小天鹅等', minPrice: 100, maxPrice: 800, unit: '元/台', condition: ['使用年限', '容量', '品牌', '功能是否正常'], description: '专业回收各类品牌波轮洗衣机' },
        { id: '5', name: '液晶电视', category: '彩电', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20flat%20screen%20smart%20tv%20white%20background%20product%20photography&image_size=square', brand: '三星、索尼、海信等', minPrice: 100, maxPrice: 2000, unit: '元/台', condition: ['使用年限', '尺寸', '品牌', '屏幕是否完好'], description: '专业回收各类品牌液晶电视' },
        { id: '6', name: '曲面电视', category: '彩电', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20curved%20screen%20smart%20tv%20white%20background%20product%20photography&image_size=square', brand: '三星、索尼、LG等', minPrice: 300, maxPrice: 3000, unit: '元/台', condition: ['使用年限', '尺寸', '品牌', '屏幕是否完好'], description: '专业回收各类品牌曲面电视' },
        { id: '7', name: '双门冰箱', category: '冰箱', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20double%20door%20refrigerator%20white%20background%20product%20photography&image_size=square', brand: '海尔、美的、西门子等', minPrice: 200, maxPrice: 1500, unit: '元/台', condition: ['使用年限', '容量', '品牌', '制冷是否正常'], description: '专业回收各类品牌双门冰箱' },
        { id: '8', name: '多门冰箱', category: '冰箱', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20multi%20door%20refrigerator%20white%20background%20product%20photography&image_size=square', brand: '海尔、美的、西门子等', minPrice: 500, maxPrice: 3000, unit: '元/台', condition: ['使用年限', '容量', '品牌', '制冷是否正常'], description: '专业回收各类品牌多门冰箱' },
        { id: '9', name: '台式电脑', category: '电脑', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20desktop%20computer%20set%20white%20background%20product%20photography&image_size=square', brand: '联想、戴尔、惠普等', minPrice: 100, maxPrice: 1500, unit: '元/台', condition: ['使用年限', '配置', '品牌', '功能是否正常'], description: '专业回收各类品牌台式电脑' },
        { id: '10', name: '笔记本电脑', category: '电脑', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20laptop%20computer%20white%20background%20product%20photography&image_size=square', brand: '联想、戴尔、惠普等', minPrice: 200, maxPrice: 3000, unit: '元/台', condition: ['使用年限', '配置', '品牌', '功能是否正常'], description: '专业回收各类品牌笔记本电脑' },
        { id: '11', name: '显示器', category: '电脑', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20computer%20monitor%20white%20background%20product%20photography&image_size=square', brand: '三星、AOC、戴尔等', minPrice: 50, maxPrice: 800, unit: '元/台', condition: ['使用年限', '尺寸', '品牌', '屏幕是否完好'], description: '专业回收各类品牌显示器' },
        { id: '12', name: '空调外机', category: '其他', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=air%20conditioner%20outdoor%20unit%20white%20background%20product%20photography&image_size=square', brand: '各类品牌', minPrice: 100, maxPrice: 500, unit: '元/台', condition: ['使用年限', '匹数', '功能是否正常'], description: '专业回收空调外机' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let result = this.products
      
      if (this.activeCategory) {
        result = result.filter(p => p.category === this.activeCategory)
      }
      
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        result = result.filter(p => 
          p.name.toLowerCase().includes(keyword) || 
          p.category.toLowerCase().includes(keyword)
        )
      }
      
      return result
    }
  },
  methods: {
    handleProductClick(product) {
      this.bridgeSdk.showModal({
        title: product.name,
        content: `${product.description}\n\n回收价：¥${product.minPrice}-${product.maxPrice}/${product.unit}\n\n支持品牌：${product.brand}`,
        showCancel: false,
        confirmText: '我要回收',
        success: () => {
          this.bridgeSdk.showToast({
            title: '已提交回收申请',
            icon: 'success'
          })
        }
      })
    },
    handleQuickRecycle(product) {
      this.bridgeSdk.showToast({
        title: `即将回收：${product.name}`,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
  bottom: 100rpx;
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

.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>