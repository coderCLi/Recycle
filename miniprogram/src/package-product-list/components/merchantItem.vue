<!--
 * @Description: 商户组件
 * @Author: 陈保磊
 * @Date:  2025-01-15 16:00:00
-->
<template>
  <view class="card-item">
    <!-- 店铺图片 -->
    <view class="card-img">
      <image v-if="!item.listPicUrl" src="../static/uploadImg.png" />
      <image v-else :src="this.minioBaseUrl + item.listPicUrl" ></image>
    </view>
    <!-- 店铺信息 -->
    <view class="card-info">
      <view class="card-title">
        {{ item.storeName||'---' }}
      </view>

      <view class="card-freight">
        门店距离：{{ item.distance }}km
      </view>

      <view class="card-score">
        地址：{{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.storeAddress }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      errorImg: '/static/uView/load_error.png',
      merchantitem: {}
    }
  },
  props: {
    item: {
      type: Object,
      default: () => { }
    },

  },
  mounted () {
    console.log(this.item, ';item')
    this.merchantitem = this.item
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped >
.card-item {
  margin: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;

  .card-img {
    width: 180rpx;
    height: 180rpx;
    margin-right: 30rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 10rpx;
    }
  }
  .card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .card-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }

    .card-freight {
      margin-top: 20rpx;
      font-size: 23rpx;
      display: flex;
      justify-content: space-between;
    }

    .card-score {
      margin-top: 20rpx;
      font-size: 24rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }
}
</style>