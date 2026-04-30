<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view v-if="review" class="detail-body">
      <!-- 用户名 + 日期 -->
      <view class="detail-header">
        <text class="detail-nickname">{{ review.nickname }}</text>
        <text class="detail-date">{{ review.date }}</text>
      </view>

      <!-- 星星 -->
      <view class="detail-stars">
        <image
          v-for="s in 5"
          :key="s"
          :src="s <= Math.floor(review.star || 5) ? `${minioBaseUrl}common/mctImages/icon-star.png` : `${minioBaseUrl}common/mctImages/icon-dark.png`"
          mode="scaleToFill"
          style="width: 24rpx; height: 24rpx; margin-right: 4rpx;"
        />
      </view>

      <!-- 评价内容 -->
      <view class="detail-content">{{ review.content }}</view>

      <!-- 图片九宫格 -->
      <view v-if="review.images && review.images.length > 0" class="detail-images">
        <view
          v-for="(img, imgIdx) in review.images"
          :key="imgIdx"
          class="detail-img-wrap"
          @click="previewImages(review.images, imgIdx)"
        >
          <image :src="img" mode="aspectFill" class="detail-img" />
        </view>
      </view>

      <!-- 商家回复 -->
      <view v-if="review.reply" class="merchant-reply">
        <view class="reply-header">
          <text class="reply-title">商家回复</text>
          <text class="reply-date">{{ review.replyDate }}</text>
        </view>
        <view class="reply-content">{{ review.reply }}</view>
      </view>
    </view>
  </vc-container>
</template>

<script>
const mockReviewsMap = {
  1: {
    id: 1,
    nickname: '我是吃货一枚',
    date: '2026-10-11',
    star: 4,
    content: '大连必吃的海鲜烧烤天花板!金碧辉煌名不虚传，海鲜新鲜个头大，生办大虾很喜欢，辣炒蛏子无沙超入味味...',
    images: [],
    reply: null,
    replyDate: '',
  },
  2: {
    id: 2,
    nickname: '驴乖乖',
    date: '2026-06-02',
    star: 2,
    content: '沈阳炸鸡架好吃的 贡菜竹笋好吃的 鸡肉和猪肉卷都好吃的烤地瓜也好吃的 牛乳冰淇淋好吃的',
    images: ['https://picsum.photos/400/400?random=1'],
    reply: null,
    replyDate: '',
  },
  3: {
    id: 3,
    nickname: '匿名',
    date: '2025-10-11',
    star: 1,
    content: '终于在大高新开分店啦，下班就冲过去啦，5:05到达空座不少，吃完的时候就已经排队啦。想这个肉丸汤很久了，太远了，终于吃上了。土猪肉和小排骨的组合香气四溢啊。阴冷的天气真满足。呼吁好吃的馆子们都在大高新开店啊，美食荒漠这一块，来一家就满园儿。',
    images: [
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6',
    ],
    reply: '亲爱的顾客，感谢您的支持和喜爱！意是我们最大的动力听到您喜欢我们的肉丸汤真是太开心了！',
    replyDate: '2026-10-11',
  },
  4: {
    id: 4,
    nickname: '美食达人',
    date: '2026-09-05',
    star: 5,
    content: '强烈推荐！环境很好，菜品新鲜，服务热情，下次还会来！',
    images: [],
    reply: null,
    replyDate: '',
  },
  5: {
    id: 5,
    nickname: '路过的旅人',
    date: '2026-07-20',
    star: 3,
    content: '整体还可以，口味中规中矩，价格稍微偏高，但环境不错。',
    images: ['https://picsum.photos/400/400?random=10'],
    reply: '感谢您的评价，我们会继续改进！',
    replyDate: '2026-07-21',
  },
}

export default {
  name: 'merchantReviewDetail',
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: '评价详情',
          },
        },
      },
      reviewId: '',
      review: null,
    }
  },
  onLoad(options) {
    this.reviewId = options.id || ''
    this.review = mockReviewsMap[this.reviewId] || null
  },
  methods: {
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

.detail-body {
  padding: 30rpx;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;

  .detail-nickname {
    font-weight: 600;
    font-size: 32rpx;
    color: #333;
  }

  .detail-date {
    font-size: 24rpx;
    color: #999;
  }
}

.detail-stars {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .star-icon {
    font-size: 30rpx;
    margin-right: 4rpx;
  }

  .star-on {
    color: #FF6634;
  }

  .star-off {
    color: #CCCCCC;
  }
}

.detail-content {
  font-size: 28rpx;
  color: #333;
  line-height: 48rpx;
  margin-bottom: 24rpx;
  word-break: break-all;
}

.detail-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 30rpx;

  .detail-img-wrap {
    width: 222rpx;
    height: 222rpx;
    border-radius: 10rpx;
    overflow: hidden;
    flex-shrink: 0;

    .detail-img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}

.merchant-reply {
  background: #F7F7F7;
  border-radius: 16rpx;
  padding: 24rpx 26rpx;
  margin-top: 10rpx;

  .reply-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14rpx;

    .reply-title {
      font-weight: 600;
      font-size: 28rpx;
      color: #333;
    }

    .reply-date {
      font-size: 24rpx;
      color: #999;
    }
  }

  .reply-content {
    font-size: 26rpx;
    color: #666;
    line-height: 44rpx;
    word-break: break-all;
  }
}
</style>
