<!--
 * @Description: 建设中页面
 * @Author: yulongchen
 * @Date: 2025-03-03 13:41:09
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-04-10 15:44:55
 * @Remark: 
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <template v-if="showNav">
    <vc-container :props-data="{ props: { title: { value: title }, isFullScreen: { value: true } } }">
      <view class="main main-nav">
        <image class="loading-icon" :src="staticBaseUrl + '/hbdimage/loading.gif'" />
        <view class="tips">
          {{ tips || '功能建设中,敬请期待!' }}
        </view>
      </view>
    </vc-container>
  </template>
  <template v-else>
    <view class="main main-without-nav">
        <image class="loading-icon" :src="staticBaseUrl + '/hbdimage/loading.gif'" />
        <view class="tips">
          {{ tips || '功能建设中,敬请期待!' }}
        </view>
      </view>
  </template>
</template>
<script>
  import { mapState } from 'pinia'
  import { useBaseStore } from "@/store/index";
  export default {
    name: "building",
    data() {
      return {
        tips: '',
        title: "",
        showNav: false
      }
    },  
    computed: {
      ...mapState(useBaseStore, ['navH'])
    },
    onLoad(options) {
      // 如果参数showNav为1时则表示显示导航头, 否则不显示导航头
      this.showNav = options.showNav === '1';
      this.tips = options.tips ? decodeURIComponent(options.tips) : "";
      this.title = options.title ? decodeURIComponent(options.title) : "";
    },
    methods: {
 
    }
  } 
</script>

<style lang="scss" scoped>
  .main {
    text-align: center;
    padding: 50rpx 50rpx 100rpx;
    margin: 0 auto;
    display: block;
    color: #444;
    background: #ffffff;
    box-sizing: border-box;

    &.main-nav {
      height: 100%;
    }

    &.main-without-nav {
      min-height: calc(100vh);
    }
  }
  .loading-icon {
    width: 260rpx;
    height: 248rpx;
    // padding-bottom: 20rpx;
    margin: 0 auto;
    display: block;
  }
  // .tips {
  //   padding: 0 50rpx;
  // }
</style>
