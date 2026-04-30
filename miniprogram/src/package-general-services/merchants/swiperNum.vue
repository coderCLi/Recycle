<!--
 * @Author: chilei gchilei0815@gmail.com
 * @Date: 2026-04-02 17:35:09
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-03 10:16:07
 * @FilePath: /miniprogram/src/package-general-services/merchants/swiperNum.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <view class="image-slider">
    <!-- 横向滑动图片列表 -->
    <scroll-view
      scroll-x
      class="scroll-box"
      show-scrollbar="false"
      :scroll-with-animation="true"
    >
      <view class="img-list">
        <view
          class="img-item"
          v-for="(url, idx) in imageList"
          :key="idx"
          @click="preview(idx)"
        >
          <image :src="minioBaseUrl + (typeof url === 'object' && url.value ? url.value : url)" mode="aspectFill" class="img" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
/**
 * 图片横向滑动组件（支持预览）
 * @param {Array} imageList - 图片地址数组，元素可以是字符串或包含 value 属性的对象
//  * @param {String} minioBaseUrl - 图片基础URL
 */
export default {
  name: "ImageSlider",
  props: {
    imageList: {
      type: Array,
      default: () => [],
    },
    // minioBaseUrl: {
    //   type: String,
    //   default: '',
    // },
  },
  methods: {
    // 预览图片
    preview(index) {
      if (!this.imageList || this.imageList.length === 0 || index < 0 || index >= this.imageList.length) return;
      
      const fullUrls = this.imageList.map(url => this.minioBaseUrl + (typeof url === 'object' && url.value ? url.value : url));
      
      uni.previewImage({
        current: index,
        urls: fullUrls
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.image-slider {
  width: 96%;
  padding: 30rpx 0 30rpx 30rpx;
}

.scroll-box {
  width: 96%;
  white-space: nowrap;
}

.img-list {
  display: flex;
  flex-wrap: nowrap;
}

.img-item {
  width: 257rpx;
  height: 192rpx;
  margin-right: 11rpx;
  border-radius: 10rpx;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>