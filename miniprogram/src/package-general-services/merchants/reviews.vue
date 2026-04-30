<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <!-- 筛选 u-tabs -->
    <view class="filter-wrap">
      <u-tabs
        :list="filterTabs"
        :keyName="'label'"
        :scrollable="false"
        :current="activeFilter"
        lineColor="#FF6634"
        lineHeight="6"
        lineWidth="30"
        :activeStyle="{
          color: '#FF6634',
          fontWeight: '600',
        }"
        :inactiveStyle="{
          color: '#666666',
          fontWeight: '400',
          transform: 'scale(1)',
        }"
        @click="switchFilter"
      ></u-tabs>
    </view>

    <!-- 评价列表 -->
    <scroll-view scroll-y class="review-scroll">
      <view
        v-for="item in reviewList"
        :key="item.id"
        class="review-item"
        @click="goDetail(item)"
      >
        <!-- 用户名 + 日期 -->
        <view class="review-item-top">
          <text class="review-nickname">{{ item.nickname }}</text>
          <text class="review-date">{{ item.date }}</text>
        </view>
        <!-- 星星 -->
        <view class="review-stars">
          <image
            v-for="s in 5"
            :key="s"
            :src="s <= Math.floor(item.star || 5) ? `${minioBaseUrl}common/mctImages/icon-star.png` : `${minioBaseUrl}common/mctImages/icon-dark.png`"
            mode="scaleToFill"
            style="width: 24rpx; height: 24rpx; margin-right: 4rpx;"
          />
        </view>
        <!-- 评价内容 -->
        <view class="review-content">{{ item.content }}</view>
        <!-- 图片 -->
        <view v-if="item.images && item.images.length > 0" class="review-images">
          <view
            v-for="(img, imgIdx) in item.images.slice(0, 3)"
            :key="imgIdx"
            class="review-img-wrap"
            @click.stop="previewImages(item.images, imgIdx)"
          >
            <image :src="img" mode="aspectFill" class="review-img" />
            <view v-if="imgIdx === 2 && item.images.length > 3" class="review-img-more">
              共{{ item.images.length }}张
            </view>
          </view>
        </view>
      </view>
      <view class="list-bottom">
        <text>已加载全部评价</text>
      </view>
    </scroll-view>
  </vc-container>
</template>

<script>
const mockAllReviews = [
  {
    id: 1,
    nickname: '我是吃货一枚',
    date: '2026-10-11',
    star: 4,
    content: '大连必吃的海鲜烧烤天花板!金碧辉煌名不虚传，海鲜新鲜个头大，生办大虾很喜欢，辣炒蛏子无沙超入味味...',
    images: [],
    reply: null,
    type: 'good',
  },
  {
    id: 2,
    nickname: '驴乖乖',
    date: '2026-06-02',
    star: 2,
    content: '沈阳炸鸡架好吃的 贡菜竹笋好吃的 鸡肉和猪肉卷都好吃的烤地瓜也好吃的 牛乳冰淇淋好吃的',
    images: ['https://picsum.photos/200/200?random=1'],
    reply: null,
    type: 'bad',
  },
  {
    id: 3,
    nickname: '匿名',
    date: '2025-10-11',
    star: 1,
    content: '沈阳炸鸡架好吃的 贡菜竹笋好吃的 鸡肉和猪肉卷都好吃的烤地瓜也好吃的 牛乳冰淇淋好吃的 草莓木瓜哈...',
    images: [
      'https://picsum.photos/200/200?random=2',
      'https://picsum.photos/200/200?random=3',
      'https://picsum.photos/200/200?random=4',
      'https://picsum.photos/200/200?random=5',
      'https://picsum.photos/200/200?random=6',
    ],
    reply: null,
    type: 'bad',
  },
  {
    id: 4,
    nickname: '美食达人',
    date: '2026-09-05',
    star: 5,
    content: '强烈推荐！环境很好，菜品新鲜，服务热情，下次还会来！',
    images: [],
    reply: null,
    type: 'good',
  },
  {
    id: 5,
    nickname: '路过的旅人',
    date: '2026-07-20',
    star: 3,
    content: '整体还可以，口味中规中矩，价格稍微偏高，但环境不错。',
    images: ['https://picsum.photos/200/200?random=10'],
    reply: '感谢您的评价，我们会继续改进！',
    type: 'mid',
  },
]

export default {
  name: 'merchantReviews',
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: '全部评论',
          },
        },
      },
      mctId: '',
      total: 2739,
      activeFilter: 0,
      filterTabs: [
        { label: '全部' },
        { label: '最新' },
        { label: '差评 4' },
        { label: '中评 15' },
        { label: '带图 165' },
      ],
      allReviews: mockAllReviews,
    }
  },
  computed: {
    reviewList() {
      if (this.activeFilter === 0) return this.allReviews
      if (this.activeFilter === 1) {
        return [...this.allReviews].sort((a, b) => new Date(b.date) - new Date(a.date))
      }
      if (this.activeFilter === 2) return this.allReviews.filter(r => r.type === 'bad')
      if (this.activeFilter === 3) return this.allReviews.filter(r => r.type === 'mid')
      if (this.activeFilter === 4) return this.allReviews.filter(r => r.images && r.images.length > 0)
      return this.allReviews
    },
  },
  onLoad(options) {
    this.mctId = options.mctId || ''
    const total = Number(options.total)
    if (total) {
      this.total = total
      this.propsData.props.title.value = `全部评论`
    }
  },
  methods: {
    switchFilter(e) {
      this.activeFilter = e.index
    },
    goDetail(item) {
      this.bridgeSdk.jumpPage({
        url: `/package-general-services/merchants/reviewDetail?id=${item.id}`,
      })
    },
    previewImages(list, index) {
      uni.previewImage({
        current: index,
        urls: list,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  background: #fff;
}

.filter-wrap {
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
}

.review-scroll {
  flex: 1;
  height: calc(100vh - 200rpx);
  background: #fff;
}

.review-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
  background: #fff;

  .review-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;

    .review-nickname {
      font-weight: 600;
      font-size: 30rpx;
      color: #333;
    }

    .review-date {
      font-size: 24rpx;
      color: #999;
    }
  }

  .review-stars {
    display: flex;
    align-items: center;
    margin-bottom: 14rpx;
  }

  .review-content {
    font-size: 28rpx;
    color: #333;
    line-height: 44rpx;
    margin-bottom: 18rpx;
  }

  .review-images {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;

    .review-img-wrap {
      position: relative;
      width: 200rpx;
      height: 200rpx;
      border-radius: 10rpx;
      overflow: hidden;

      .review-img {
        width: 200rpx;
        height: 200rpx;
      }

      .review-img-more {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 50rpx;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 22rpx;
      }
    }
  }
}

.list-bottom {
  padding: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #ccc;
}
</style>
