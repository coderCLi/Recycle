<template>
      <vc-modal ref="modal"></vc-modal>
  <view class="discountPackageItem">
      <image class="image" :src="minioBaseUrl + info.picUrl" alt="" />
    <view class="content">
      <view class="title">{{ info.name }}</view>
      <view class="desc">{{ info.desc }}</view>
      <view class="features">
        <text v-for="item in info.labelName.split(',')" :key="item" class="feature">{{ item }}</text>

      </view>
      <view class="price">
        <view class="discount">
          {{ info.newPrice }}
        </view>
        <view class="original">
          {{ info.oldPrice }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "discountPackageItem",
  props: {
    // 这里放置props
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 这里放置数据
    };
  },
  methods: {
    jumpDetail() {

    },
  },
};
</script>

<style lang="scss" scoped>
.discountPackageItem {
  // 这里放置样式
  width: 690rpx;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  border-radius: 20rpx;
  box-sizing: border-box;
  padding: 24rpx;
  display: flex;
  margin: 20rpx auto 0rpx;

  .image {
    width: 160rpx;
    height: 220rpx;
    flex-shrink: 0;
    border-radius: 10rpx;

  }
  .content {
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .title {
      width: 471rpx;
      height: 80rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin-bottom: 10rpx;
    }
    .desc {
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      margin-bottom: 10rpx;
    }
    .features {
      margin-bottom: 10rpx;
      display: flex;
      align-items: center;
      .feature {
        font-size: 20rpx;
        color: #00bcb8;
        border: 1px solid #00bcb8;
        padding: 4rpx 12rpx;
        margin-right: 10rpx;
      }
    }
    .price {
      display: flex;
      align-items: center;
      .discount {
        font-weight: 600;
        font-size: 28rpx;
        color: #ff1f1f;
        line-height: 40rpx;
        margin-right: 10rpx;
      }
      .original {
        font-weight: 400;
        font-size: 20rpx;
        color: #aaaaaa;
        line-height: 28rpx;
        text-decoration-line: line-through;
      }
    }
  }
}
</style>
