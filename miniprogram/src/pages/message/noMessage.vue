<!--
 * @Description: 消息设置
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container>
    <!-- 页面内容 -->
     <view class="title">
      开启免打扰，您将不再接收该账号的推送通知
    </view>
    <view class="page-container">
      <!-- 活动消息 -->
      <view v-for="(item, index) in list" :key="index" class="flex content flex_sb" style="border-bottom: 1px solid #F4F4F4;">
        <view class="flex flex_col ">
          <view class="fontStyle">{{item.messageTypeIdName}}</view>
        </view>
        <view class="flex flex_ac flex_jc">
          <up-switch :modelValue="item.receivingStatus === '1'" size="20" asyncChange inactiveColor="rgb(230, 230, 230)" @change="(value) => change(value,item)" activeColor="#00BCB8"></up-switch>
          <!-- <switch :checked="item.receivingStatus === '1'" color="#00BCB8"  @change="(value) => change(value,item)" style="transform:scale(0.7)"/> -->
        </view>
      </view>
      <!-- 活动消息 -->
      <!-- <view class="flex content flex_sb" style="border-bottom: 1px solid #F4F4F4;">
        <view class="flex flex_col ">
          <view class="fontStyle">接收消息推送</view>
          <text class="tips">参加赛事、线下活动动态和时间行程提醒</text>
        </view>
        <view class="flex flex_ac flex_jc">
          <up-switch v-model="messageValue" size="20" asyncChange inactiveColor="rgb(230, 230, 230)" @change="change('message')" activeColor="#00BCB8"></up-switch>
        </view>
      </view> -->
      <!-- 促销优惠 -->
      <!-- <view class="flex content flex_sb" style="border-bottom: 1px solid #F4F4F4;">
        <view class="flex flex_col ">
          <view class="fontStyle">促销优惠</view>
          <text class="tips">优惠资讯</text>
        </view>
        <view class="flex flex_ac flex_jc">
          <up-switch v-model="freeValue" size="20" asyncChange inactiveColor="rgb(230, 230, 230)" @change="change('free')" activeColor="#00BCB8"></up-switch>
        </view>
      </view> -->
      <!-- 我的订阅 -->
      <!-- <view class="flex content flex_sb" style="border-bottom: 1px solid #F4F4F4;">
        <view class="flex flex_col ">
          <view class="fontStyle">我的订阅</view>
          <text class="tips">订阅内容最新动态</text>
        </view>
        <view class="flex flex_ac flex_jc">
          <up-switch v-model="subValue" size="20" asyncChange inactiveColor="rgb(230, 230, 230)" @change="change('sub')" activeColor="#00BCB8"></up-switch>
        </view>
      </view> -->
      
    </view>
  </vc-container>
</template>

<script>

import { pushConfigurationQuery,pushConfigurationSettings } from "@/api/mine";
import { mapState } from "pinia";
import { useBaseStore, useUserStore } from "@/store/index";
export default {
  name: "noMessage",
  data() {
    return {
      orderValue: false,
      messageValue: false,
      freeValue: false,
      subValue: false,
      list:[],
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
    // pushConfigurationSettings 推送配置设置
    __loadData__(){
      this.getStatus()
    },
    getStatus(){
      //  推送配置查询
      pushConfigurationQuery({}).then((res) => {
        console.log('推送配置查询',res);
        this.list = res;
      })
    },
    change(v,e){
      this.bridgeSdk.showConfirm({
          content: e.receivingStatus=='0' ? `确定要打开${e.messageTypeIdName}吗` : `确定要关闭${e.messageTypeIdName}吗`,
          confirmText: "确定",
          cancelText: "再想想",
          confirmCallback: (res) => {
              console.log('点击确定',e)
              this.changeStatus(e.receivingStatus,e.messageTypeId);
          },
          cancelCallback: (res) => {
            console.log("点击取消", res);
          }
        });
    },
    changeStatus(receivingStatus,messageTypeId){
      console.log(receivingStatus,messageTypeId,'changeStatus')
      pushConfigurationSettings({receivingStatus:receivingStatus==0?1:0,messageTypeId:messageTypeId}).then((res) => {
        console.log('推送配置查询',res);
        this.getStatus();//更新状态
      })
    }
  },
};
</script>

<style scoped lang="scss">
    .title{
      width: 100%;
      font-weight: bold;
      font-size: 24rpx;
      color: #00BCB8;
      text-align: center;
      background-color: #E6F8F8;
      line-height: 64rpx;
    }
  .page-container{
    background-color: #fff;
    padding: 20rpx 30rpx;
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
