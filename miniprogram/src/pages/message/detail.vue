<!--
 * @Description: 
 * @Author: chenyulong
 * @Date: 2024-12-18 19:23:24
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-27 16:03:03
 * @Remark: 
-->
 
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container @navBack="navBack"  class="message-detail">
    <div class="message-detail-container">
      <view class="title">{{ info.title }}</view>
      <view class="time">{{ info.pushTime }}</view>
      <view class="content">
        <rich-text class="content" :nodes="bridgeSdk.addMinioPrefixToImgSrc(info.content)"></rich-text>
      </view>
    </div>
  </vc-container>
</template>

<script>
import { getReadInfo } from "@/api/mine";

export default {
  data() {
    return {
      info: {},
      index: '',
    }
  },
  async onLoad(options) {
    this.index = options.activeIndex;
    await this.firstInit();
    console.log("onload", options);
    // const notifyId = options.id;
    let msg = {
      notifyId: options.id,
      readTranceId: options.readTranceId,
    }
    getReadInfo(msg).then(res => {
      console.log(res);
      this.info = res;
    });
  },
  methods: {
    navBack() {
      console.log('navBack',this.index);
      this.bridgeSdk.navigateBackTo({
          delta: 1,
          success(page) {
            // 这里调用上个页面的方法，注意可能为空，onBack是上个页面methods中定义的方法
            page && page.onBack && page.onBack(this.index);
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.message-detail {
  .message-detail-container {
    margin-top: 24rpx;
    width: 100%;
    background: #fff;
    padding: 30rpx 24rpx;
    box-sizing: border-box;

    .time {
      width: 100%;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 34rpx;
      margin-bottom: 28rpx;
    }

    .title {
      width: 100%;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      margin-bottom: 10rpx;
    }

    .content {
      width: 100%;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 34rpx;
    }
  }
}
</style>