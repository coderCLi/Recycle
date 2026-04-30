<!--
 * @Description: 搜索组件 - 当前页面
 * @Author: zjw
 * @Date: 2025年1月2日16:28:30
 * @LastEditors: zjw
 * @LastEditTime: 2025年1月2日16:28:45
 * @Remark: 
-->
<template>
  <div class="vc-search-cur-page" :style="{height:124+spaceBottom.value*2+'rpx',}">
    <view class="vc-search-cur-page-box" :style="{position: position.value,zIndex: zIndex.value,height:124+spaceBottom.value*2+'rpx',borderBottom: spaceBottom.value*2+'rpx solid #eee'}">
      <u-search
        maxlength="20"
        height="40"
        :placeholder="placeholder.value"
        placeholderColor="#999"
        @search="getSearch('search')"
        @blur="getSearch('blur')"
        :showAction="false"
        v-model="keywords"
        shape="square"
        @change="inputChange"
      >
      </u-search>
    </view>
  </div>
</template>

<script>
import mixins from "../../mixins.js";
import props from "./props.js";
import belong from "../intro.json";
export default {
  belong,
  mixins: [mixins],
  title: "搜索框-当前页面",
  data() {
    return {
      keywords: "",
      ...JSON.parse(JSON.stringify(props)),
    };
  },
  methods: {
    getSearch(type) {
      if(this.time && new Date().getTime() - this.time < 1000){
        return
      }
      if (this.searchType.value.includes(type) == false) {
        return
      }
      this.time = new Date().getTime();
      console.log("this.keywords",this.keywords);
      this.$emit("toSearch", this.keywords);
    },
    inputChange() {
      this.$emit("inputChange", this.keywords);
    }
  },
};
</script>

<style scoped lang="scss">
.vc-search-cur-page {
  height: 124rpx;
  width: 100%;
  position: relative;
  // background: #ffffff;
  .vc-search-cur-page-box {
    position: fixed;
    // height: 124rpx;
    width: 750rpx;
    box-sizing: border-box;
    background: white;
    padding: 20rpx 40rpx;
    z-index: 1;
  }
}
</style>