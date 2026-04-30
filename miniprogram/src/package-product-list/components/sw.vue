<!--
 * @Description: 轮播图
 * @Author: 陈保磊
 * @Date: 2025-01-04 10:05:23
 * @Remark: 
-->

<template>
  <uni-swiper-dot
    class="uni-swiper-dot-box"
    :info="info"
    :current="current"
    :mode="mode"
    :dots-styles="dotsStyles"
    field="content"
    style="width: 100%;height: 400rpx;"
  >
    <swiper class="swiper-box" @change="change" :current="swiperDotIndex" current-item-id="mediaUrl" autoplay>
      <swiper-item v-for="(item, index) in list" :key="index">
        <view class="swiper-item" :class="'swiper-item' + index">
          <image v-if="item.mediaType.includes('image')" :src="minioBaseUrl + item.mediaUrl" key=""
          style="width: 100%;height: 100%;" />
          <video
            v-else
            id="myVideo"
            :src="minioBaseUrl + item.mediaUrl"
            ref="myVideo"
            controls
            autoplay
            style="width: 100%;"></video>
        </view>
      </swiper-item>
    </swiper>
  </uni-swiper-dot>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  mouted () {
    console.log(this.list,'list');
    
  },
  methods:{

  }
}
</script>

<style scoped>
.swiper-box{
  height: 400rpx
}
</style>