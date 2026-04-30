<!--
 * @Description: 搜索组件 - 当前页面
 * @Author: zjw
 * @Date: 2025年1月2日16:28:30
 * @LastEditors: zjw
 * @LastEditTime: 2025年1月2日16:28:45
 * @Remark: 
-->
<template>
    <view class="vc-tabbar">
        <view class="tabbar-box" :style="{position: position.value,zIndex: zIndex.value}">
        <u-tabs @click="handleClick" :list="list.value" :lineWidth="lineWidth.value"
          lineColor="linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%)" :activeStyle="{
            color: '#333333',
            fontWeight: 'bold',
          }" :inactiveStyle="{
            color: '#999',
            transform: 'scale(1)'
          }" :current="current.value"
          :keyName="'optName'"
          ></u-tabs>
      </view>
    </view>
  </template>
  
  <script>
  import mixins from "../../mixins.js"
  import props from "./props.js";
  import belong from "../intro.json";
  export default {
    belong,
    mixins: [mixins],
    title: "tabbar",
    data() {
      return {
        ...JSON.parse(JSON.stringify(props)),
        current: 0
      }
    },
  
    mounted() {
  
    },
  
    methods: {
      handleClick(e) {
        console.log(this.lineWidth.value,'lineWidth.valuelineWidth.valuelineWidth.valuelineWidth.value');
        this.current = e.index;
        this.$emit("handleClick", e);   // 触发父组件的change事件      
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
.vc-tabbar {
    width: 100%;
  height: 104rpx;
  position: relative;
//   background: #FFFFFF;
  .tabbar-box{
    width: 750rpx;
    box-sizing: border-box;
    padding:0 15rpx 15rpx;
    //box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.1);
    background:#fff;
    position: fixed;
    z-index: 1;
  }
}
  </style>
  