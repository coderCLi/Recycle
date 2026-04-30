<!--
 * @Description: 商品组件
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <view class="card-item" @click.stop="emitClick">
    <!-- 商品图片 -->
    <view class="card-img">
      <image v-if="!productInfo.listPicUrl" :src="`${staticBaseUrl}/static/uploadImg.png`" style="width: 100%; height: 100%"/>
      <image v-else-if="productInfo.isImg" :src="this.minioBaseUrl + productInfo.listPicUrl" style="width: 100%; height: 100%"/>
      <video v-else :src="this.minioBaseUrl + productInfo.listPicUrl" style="width: 100%; height: 100%" 
        muted autoplay :show-center-play-btn="false" :show-play-btn="false" :controls="false"/>

      <image class="card-img-New" v-if="productInfo.isNew == 1" :src="`${staticBaseUrl}/static/new.png`" ></image>
    </view>
    <!-- 商品信息 -->
    <view class="card-info">

      <view class="card-title">
        <view class="card-name">{{ productInfo.spuName }}</view>
        <view v-if="productInfo.isHotsale == 1">
          <up-tag text="热销" type="warning"  plain size="mini" plainFill></up-tag>
        </view>
      </view>

      <view class="card-freight">
        <view style="margin-right: 10rpx;">销量：<text style="color: red">{{ productInfo.salesVolume }}</text></view>
        <up-tag v-if="productInfo.skuAll.length == 1" bgColor="#f8f8f8" borderColor="#f8f8f8" color="#333" size="mini">{{ productInfo.skuAll[0].skuName }}</up-tag>
      </view>

      <view style="display: flex;align-items: center;justify-content: space-between;margin-top: 5rpx;">
        <view class="card-amt">
          ¥{{ minAmt }}
          <text style="font-size: 24rpx;">{{ productInfo.skuAll?.length > 1?'起':'' }}</text>
        </view>
        <number-step v-if="productInfo.skuAll.length == 1" :sku="{...productInfo.skuAll[0], spuName: productInfo.spuName}" :num="nowSkuNum"></number-step>
        <check-sku v-else :spu="{...productInfo}" :skuList="[...productInfo.skuAll]" :num="nowSkuNum"></check-sku>
      </view>
    </view>
  </view>
</template>

<script>
import NumberStep from './number-step.vue'
import productVue from './product.vue'
import checkSku from './check-sku.vue'
import { toFixed } from "@/utils/decimal";
import { useMctStore } from "@/store/index"
export default {
  components: { productVue, NumberStep, checkSku },
  data () {
    return {
      errorImg: '/static/uView/load_error.png',
      productInfo: {},//商品信息
    }
  },
  props: {
    item: {
      type: Object,
      default: () => { }
    },
  },
  watch: {
    item: {
      handler (newVal) {
        this.productInfo = newVal
        let extension = this.productInfo.listPicUrl.split('.').pop().toLowerCase();
        this.productInfo.isImg = ['jpg', 'jpeg', 'gif', 'png'].includes(extension)
        this.productInfo.skuAll = this.productInfo.skuAll.sort((a, b) => {
          return a.price - b.price
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    //最早金额
    minAmt () {
      return this.bridgeSdk.checkIsEmpty(this.productInfo.skuAll) ? toFixed(this.productInfo.skuAll[0].price, 2) : ''
    },
    //购物车列表
    cartList (){
      return useMctStore().cartList
    },
    //当前商品在购物车数量
    nowSkuNum() {
      if(this.productInfo.skuAll.length == 1) 
        return this.cartList.filter(f => f.skuId == this.productInfo.skuAll[0].skuId).length
      else 
        return this.cartList.filter(f => f.spuId == this.productInfo.spuId).length
    }
  },
  methods: {
    //点击方法穿透
    emitClick(){
      this.$emit('on-click', this.item)
    },
    //增加购物车
    doAdd() {
      console.log(this.item, '增加购物车')
      this.$emit('on-add', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.u-tag__text--mini){
  font-size: 20rpx;
}
:deep(.u-tag--mini){
  height: 36rpx;
}
.card-item {
  margin: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;
}
.card-info {
  flex: 1;
  margin-left: 10rpx;
}
.card-img {
  width: 150rpx;
  height: 150rpx;
  margin-right: 20rpx;
  position: relative;
  image{
    border-radius: 10rpx;
  }
  video{
    border-radius: 10rpx;
  }
}
.card-amt {
  font-size: 30rpx;
  font-weight: bold;
  color: #00BCB8;
  &::first-letter{
    font-size: 24rpx;
    margin-right: 10rpx;
  }
}
.card-img-New {
  width:50rpx;
  height:50rpx;
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 10rpx;
}
.card-img-host {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 10rpx;
  padding: 5rpx 10rpx;
  background-color: coral;
}
.card-title {
  display: flex;
  align-items: flex-start;
}
.card-name {
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 显示的行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal; /* 允许换行 */
  font-size: 32rpx;
  line-height: 40rpx;
  font-weight: bold;
}
.card-score {
  margin-top: 10rpx;
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
}
.card-score-num {
  font-size: 26rpx;
  font-weight: bold;
}
.card-score-tag {
  font-size: 21rpx;
  border-radius: 4rpx;
  /* color: #a4a5a4; */
  padding: 0 10rpx;
  background-image: linear-gradient(90deg, #d8f7e3 0%, #baffe1 100%);
}
.card-freight {
  /* color: #a4a5a4; */
  font-size: 23rpx;
  display: flex;
  align-items: center;
  height: 50rpx;
  // justify-content: space-between;
}
.card-label {
  font-size: 23rpx;
  margin-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
}
.card-label-item {
  padding: 0 10rpx;
  border: 1rpx solid #a4a5a4;
  border-radius: 4rpx;
  margin: 0rpx 20rpx 20rpx 0;
}
.card-coupons {
  margin-top: 10rpx;
  font-size: 23rpx;
}
.card-text {
  font-size: 24rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 显示的行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>