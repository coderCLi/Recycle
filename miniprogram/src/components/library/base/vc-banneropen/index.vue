<!--
 * @Description: 轮播图
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-24 18:44:58
 * @Remark: 
-->
<template>
  <view class="component">
    <!-- 轮播图 -->
    <swiper class="my-swipe" circular="true" autoplay="3000" indicator-color="white" :indicator-dots="false"
      easing-function="easeInOutCubic" :next-margin="nextMargin.value + 'rpx'" :style="{
        height:
          typeof height.value === 'number'
            ? `${height.value}rpx`
            : `${height.value}`,
        width:
          typeof width.value === 'number'
            ? `${width.value}rpx`
            : `${width.value}`,
      }" @change="swiperChange" preload-number="2" :lazy-load="true">
      <template v-if="
        (typeof height.value === 'number'
          ? height.value > 0
          : height.value.length > 0) && list.value.length > 0
      ">
        <swiper-item v-for="(item, index) in list.value" :key="index">
          <view class="swiper-item-box" :style="{
            height:
              typeof height.value === 'number'
                ? `${height.value}rpx`
                : `${height.value}`,
            width:
              typeof width.value === 'number'
                ? `${width.value}rpx`
                : `${width.value}`,
            paddingRight: `${nextMargin.value}rpx`,
          }">
            <image :src="item.imgurl" @click="toPage(item)" class="swiper-item"
              :class="[swiperType.value == 'banner'? 'borderBottom':borderRadius.value == 'none' ? '' : 'border-radius-none']" mode="aspectFill" :lazy-load="false"
              cache-control="no-cache" @error="imageError" @load="imageLoad"></image>
          </view>
          <!-- <view  @click="toPage(item)"
            class="swiper-item"
            :class="[borderRadius.value == 'none' ? '' : 'border-radius-none']"
            :style="`background-image: url(${item.imgurl}); background-size: cover; background-position: center; `"></view> -->
          <view v-if="item.isTips == '1'" class="tip-card1">
            <image :src="minioBaseUrl + huotippng" class="tip-card-image" mode="heightFix"></image>
            <view class="tip-text">{{ item.tipText }}</view>
          </view>
        </swiper-item>
      </template>
    </swiper>
    <view class="swiper-dots" v-if="list.value.length > 1 && type.value == 'dots'">
      <view class="swiper-dots-item default" :class="{ active: index === current }" v-for="(item, index) in list.value"
        :key="index" @click="current = index"></view>
    </view>
    <view v-if="type.value == 'indicator'" slot="indicator" class="indicator-num">
      <text class="indicator-num__text">{{ current + 1 }}/{{ list.value.length }}</text>
    </view>
  </view>
</template>

<script>
import mixins from "../../mixins.js";
import props from "./props.js";
import belong from "../intro.json";
export default {
  belong,
  mixins: [mixins],
  title: "轮播图",
  data() {
    return {
      ...JSON.parse(JSON.stringify(props)),
      current: 0,
      huotippng: "common/hbdbucket/static/huotip.png",
    };
  },
  watch: {
    props: {
      handler(newVal, oldVal) {
        console.log("props change: ", newVal, oldVal);
      },
      deep: true,
    },
  },

  mounted() { },

  methods: {
    toPage(item) {
      console.log("toPage: ", item);
      this.$emit("toPage", item);
    },
    swiperChange(e) {
      this.current = e.detail.current;
    },
    imageError(e) {
      console.log("banner imageError: ", e);
    },
    imageLoad(e) {
      // console.log("banner imageLoad: ", e, e.detail.width, e.detail.height);

      nextTick(() => {
        // console.log("this.$nextTick")
        this.$forceUpdate();
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.swiper-item {
  width: 100%;
  height: 100%;
  float: left;
  border-radius: 20rpx;
  z-index: 1;
  /* 新增：确保图片层级 */
}

.border-radius-none {
  border-radius: 0rpx;
}
.borderBottom{
  border-radius: 20rpx;
}

.swiper-item-box {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 0 0 20rpx 20rpx;
}

.tip-card1 {
  font-size: 9px;
  font-weight: bold;
  position: absolute;
  right: 4px;
  top: 4px;
  height: 20px;
  width: 20px;
  text-align: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.85);
  z-index: 0;

  .tip-card-image {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 20px;
    width: 20px;
    z-index: -1;
  }

  .tip-text {
    position: relative;
    top: 5.5px;
  }
}

.my-swipe {
  // height: fit-content;
  //width: 100%;
  // height: 288rpx !important;
   width: 520rpx !important;
  // margin-left: 30rpx !important;
  /* 强制固定高度计算，依赖模板绑定的 height */
  overflow: hidden;
}

.component {
  position: relative;
}

.swiper-dots {
  padding: 10rpx;
  display: flex;
  position: absolute;
  right: 12rpx;
  bottom: 12rpx;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;

  &-item {
    height: 6rpx;
    margin-right: 12rpx;
    border-radius: 6rpx;
    transition: width 0.3s;

    &.default {
      background-color: #f5f5f5;
      width: 6rpx;
    }

    &.active {
      width: 20rpx;
      background-color: #ffffff;
    }
  }
}

.indicator-num {
  position: absolute;
  bottom: 10px;
  right: 20px;
  padding: 2px 0;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 100px;
  width: 35px;
  @include flex;
  justify-content: center;

  &__text {
    color: #ffffff;
    font-size: 12px;
  }
}
</style>
