<!--
 * @Description: 消息设置
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container>
    <!-- 页面内容 -->
    <view class="page-container">
      <!-- 消息通知设置 -->
      <view class="title">消息通知设置</view> 
      <view class="flex content flex_sb" style="border-bottom: 1px solid #F4F4F4;">
        <view class="flex flex_col ">
          <view class="fontStyle">接收消息推送</view>
          <text class="tips">请在手机同“设置-通知-大连海创嗨创生活-权限”中修改</text>
        </view>
        <view class="flex flex_ac flex_jc">
          <!-- <up-switch v-model="value" size="20" asyncChange inactiveColor="rgb(230, 230, 230)" @change="change" activeColor="#00BCB8"></up-switch> -->
        </view>
      </view>
       <!-- 消息通知设置 -->
       <view class="title">消息提示设置</view>
       <view class="flex flex_sb content" @click="goNomessage">
          <text class="fontStyle">消息免打扰</text>
          <up-icon name="arrow-right"></up-icon>
       </view>
    </view>
  </vc-container>
</template>

<script>
import { getNotifyList, getNotifyCount, readAllNotify, getReadInfo } from "@/api/mine";
import { mapState } from "pinia";
import { useBaseStore, useUserStore } from "@/store/index";
export default {
  name: "setMessage",
  data() {
    return {
      value: false,
    };
  },
  async onLoad(options) {
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onShow() {

  },
  
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
    ...mapState(useUserStore, {
      isLogined: "isLogined",
    }),
    
  },
  methods: {
    __loadData__(){

    },
    goNomessage(){
      this.bridgeSdk.jumpPage({
          url: '/pages/message/noMessage',
        })
    },
  },
};
</script>

<style scoped lang="scss">
  .page-container{
    background-color: #fff;
    padding: 20rpx 30rpx;
    
    .title{
      margin-top: 20rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #222222;
    }
    .content{
      padding: 20rpx;
    }
  }
  .fontStyle{
    font-weight: bold;
    font-size: 28rpx;
    color: #222222;
  }
  .tips{
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
  }
</style>
