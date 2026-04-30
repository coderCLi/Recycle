<!--
 * @Description: 商品详情
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <vc-container :props-data="containerProps" style="background-color: #f8f8f8;">
    <view>
      <view class="top-block">
        <!-- 图片sku背景预览轮播 --> 
        <up-swiper :list="imgList" height="400rpx" :autoplay="false" @click="preview"></up-swiper>
        <view class="top-block_info">
          <view class="top-block_info--title">{{ detail.spuName }}</view>
          <view style="display: flex;align-items: center;margin: 10rpx 0;">
            <up-tag v-if="detail.isNew == '1'" type="success" size="mini" style="margin-right: 20rpx;">新品</up-tag>
            <up-tag v-if="detail.isHotsale == '1'" type="warning" size="mini">热销</up-tag>
          </view>
          <view style="display: flex;align-items: center;justify-content: space-between;">
            <view class="top-block_info--tip">销量：{{ detail.salesVolume }}</view>
            <number-step v-if="skuList.length == 1" :sku="{...skuList[0], spuName: detail.spuName}"></number-step>
            <check-sku v-else :spu="{...detail}" :skuList="[...skuList]" :num="nowSkuNum"></check-sku>
          </view>
        </view>
      </view>

      <view class="mid-block">
        <up-tabs :list="tabs" keyName="name" @change="tabChange"></up-tabs>
        <view style="padding: 30rpx 20rpx 100rpx;" v-if="current == 0">
          <up-parse :content="detail.detailDescription"></up-parse>
        </view>
        <view style="padding: 30rpx 20rpx;" v-if="current == 1">
          <view class="mid-block_item">
            <view class="mid-block_item--left">
              商品描述：
            </view>
            <view class="mid-block_item--right">
              {{ detail.description }}
            </view>
          </view>
          <view class="mid-block_item">
            <view class="mid-block_item--left">
              商品分类：
            </view>
            <view class="mid-block_item--right">
              {{ detail.categoryName }}
            </view>
          </view>
          <view class="mid-block_item">
            <view class="mid-block_item--left">
              商品品牌：
            </view>
            <view class="mid-block_item--right">
              {{ detail.brand }}
            </view>
          </view>
          <view class="mid-block_item">
            <view class="mid-block_item--left">
              商品单位：
            </view>
            <view class="mid-block_item--right">
              {{ detail.unit }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </vc-container>

  <!-- 购物车 -->
  <cart :visiable="cartList.length > 0" :storeId="storeId" :mctId="mctId"></cart>
  <!-- 多规格选择弹窗(需搭配check-sku组件出现) -->
  <check-sku-pop></check-sku-pop>
  <!-- 预览图片 -->
  <up-popup mode="center" overlayOpacity="0.7" :show="previewShow" round="15" @close="previewShow = false" bgColor="transparent">
    <image :src="previewUrl" :style="{aspectRatio: imgRatio, width: 'calc(100vw)', height: 'auto'}"/>
  </up-popup>
</template>

<script>
import { mapState } from 'pinia'
import { getProductInfo } from '../api'
import { useUserStore, useMctStore } from "@/store/index"
import sw from '../components/sw'
import Cart from '../components/cart.vue'
import NumberStep from '../components/number-step.vue'
import CheckSku from '../components/check-sku.vue'
import CheckSkuPop from '../components/check-sku-pop.vue'
export default {
  components: { sw, Cart, NumberStep, CheckSku, CheckSkuPop },
  data () {
    return {
      spuId: '',//spuId
      storeId: '',//门店Id
      mctId: '',//商户Id

      detail: {},//商品详情
      skuList: [],//sku列表

      tabs: [
        { name: '详情',key: 1 },
        { name: '规格',key: 2 }
      ],// tab列表
      current: 0,//当前tab
      previewUrl: '',//预览图片地址
      previewShow: false,//预览图片
      imgRatio: 1/1,//pop图片宽纵比

      containerProps: {
        props:{
            isFullScreen:{
                value: true
            },
            overflowY: {
                value: 'auto'
            }
        }
      },//container的props
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    }),
    //顶部轮播图片列表
    imgList () {
      return [
        this.minioBaseUrl + this.detail.listPicUrl,
        ...this.skuList.filter(item => item.skuMediaList).map(item => this.minioBaseUrl + item.skuMediaList[0])
      ]
    },
    //购物车列表
    cartList() {
        return useMctStore().cartList
    },
    //当前商品在购物车数量
    nowSkuNum() {
      if(this.skuList.length == 1) 
        return this.cartList.filter(f => f.skuId == this.skuList[0].skuId).length
      else 
        return this.cartList.filter(f => f.spuId == this.detail.spuId).length
    }
  },
  onLoad (options) {
    this.spuId = options.spuId
    this.storeId = options.storeId
    this.mctId = options.mctId
    this.getDetail()
  },
  methods: {
    //获取商品详情
    async getDetail () {
      let res = await getProductInfo({
        spuId: this.spuId,
        loginFlag: 0
      })
      console.log(res, 'res')
      this.detail = res
      this.skuList = [...res.skuList].sort((a,b) => Number(a.sortOrder) - Number(b.sortOrder))
    },
    // tab切换
    tabChange ({index, item}) {
      console.log(index, item)
      this.current = index
    },
    //预览图片
    preview(e){
      let val = this.imgList[e]
      console.warn(val)
      const ext = val.split('.').pop().toLowerCase()
      if(['jpg','png','jpeg','gif'].includes(ext)){
        let that = this
        that.previewShow = true
        uni.getImageInfo({
          src: val,
          success(e){
            console.warn(e)
            that.imgRatio = e.width/e.height
            that.previewUrl = val
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.uni-video-bar){
  bottom: 10px;
}
:deep(.u-tag__text--mini){
  font-size: 20rpx;
}
:deep(.u-tag--mini){
  height: 36rpx;
}
.top-block{

  &_info{
    border-radius: 30rpx 30rpx 0 0;
    background-color: white;
    padding: 30rpx 40rpx 40rpx;
    margin: -30rpx 0 0 0;
    position: relative;
    z-index: 2;
    &--title{
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
    }
    &--tip{
      font-size: 24rpx;
      color: gray;
      margin-top: 10rpx;
    }
  }
}


.mid-block{
  margin-top: 40rpx;
  background-color: white;
  border-radius: 30rpx 30rpx 0 0;
  padding: 10rpx 20rpx 30rpx;
  position: relative;
  &_item{
    display: flex;
    align-items: flex-start;
    font-size: 26rpx;
    line-height: 40rpx;
    margin-bottom: 20rpx;
    &--left{
      color: gray;
      width: 20%;
    }
    &--right{
      color: #333;
      flex: 1;
      word-break: break-all;
    }
  }
}
</style>