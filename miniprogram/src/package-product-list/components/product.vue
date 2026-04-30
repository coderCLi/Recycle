<!--
 * @Description: 子订单卡片组件
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <view class="card-item-zi">
    <!-- <up-row justify="space-between" gutter="10">
      <up-col span="4"> -->
    <view class="left-box">
      <image
        v-if="!item.listPicUrl"
        style="height: 160rpx; widht: 160rpx"
        src="../static/uploadImg.png" />
      <up-lazy-load
        v-else
        :height="80"
        style="height: 160rpx; widht: 160rpx"
        border-radius="15"
        :error-img="errorImg"
        img-mode="scaleTiFill"
        :image="pickerUrl(item.listPicUrl)">
      </up-lazy-load>
    </view>
    <!-- </up-col>
      <up-col span="8"> -->
    <view class="demo-layout bg-purple-light right-box">
      <text class="right-text title"> {{ item.spuName }}</text>
      <view
        class="right-text"
        style="
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        ">
        <view class="">
          <text class="paidAmount" style="font-size: 28rpx">¥ {{ item.subPayAmt }}</text>
          <text class="productAmount" style="text-decoration-line: line-through">
            ¥ {{ item.subOrderAmt }}
          </text>
        </view>

        <view class="productAmount" style="text-align: right">
          x{{ item.number }}
        </view>
      </view>
    </view>
    <!-- </up-col>
    </up-row> -->
  </view>
</template>

<script>
export default {
  data () {
    return {
      errorImg: '/static/uView/load_error.png',
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

  },
  methods: {
    pickerUrl (item) {
      if (item.includes('http://') || item.includes('https://')) return item
      return this.minioBaseUrl + item
    }
  }
}
</script>

<style scoped >
.card-item-zi {
  margin: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
}
.left-box {
  position: relative;
  width: 160rpx;
  margin-right: 12rpx;
}
.left-icon {
  position: absolute;
  right: 0;
  top: 0;
}
.right-box {
  display: flex;
  height: 160rpx;
  flex-direction: column;
  justify-content: space-between;
}
.right-text {
  padding-left: 20rpx;
}
.title {
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 16px;
  font-weight: 600;
  font-size: 32rpx;
  color: #222222;
  line-height: 44rpx;
  text-align: left;
  font-style: normal;
}
.right-tag {
  border-radius: 10rpx;
  font-size: 24rpx;
  padding: 5rpx;
  background: #ccc;
  margin-right: 20rpx;
}
.right-price {
  color: red;
}
.right-sales {
  color: #999;
  font-size: 24rpx;
}
.card-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  padding: 20rpx 0;
}
.paidAmount {
  font-weight: bold;
  font-size: 24rpx;
  color: #ff1f1f;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
}
.productAmount {
  margin-left: 30rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #aaaaaa;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  /* text-decoration-line: line-through; */
}
</style>