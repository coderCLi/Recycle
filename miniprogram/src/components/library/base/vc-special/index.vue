<!--
 * @Description: 特色专区
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-11-27 12:55:00
 * @Remark: 
-->
<template>
    <view class="component" style="margin-top: 40rpx;">
      <view class="top-tese">
        <view class="cpa-font-16 cpa-weight-blod">{{ title.value }}</view>
        <view class="top-card-scroll-x">
          <view class="item" v-for="(item, index) in list.value" :key="index" :class="`${item.tagClass ? item.tagClass : ''}`">
            <image
              :src="item.imgurl"
              class="top-card-img"
              mode="widthFix"
              @click="toPage(item)"
            ></image>
            <view v-if="item.isTips == '1'" class="tip-card">{{ item.tipText }}</view>
          </view>
        </view>
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
        title: "特色专区",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },

        methods: {
          toPage(item){
            console.log("toPage: ", item);
            this.$emit("toPage", item);
          },
          toOpenNewWin(item){
            console.log("toOpenNewWin: ", item);
            this.$emit("toPage", item);
          },
          getThat() {
            return this;
          }
        },
    }
</script>

<style lang="scss" scoped>
.top-tese {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx 20rpx 0;

  .top-tese-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0 20rpx;
  }
}

.top-card-scroll-x {
  padding-top: 14rpx;
  overflow-x: auto;
  width: 100%;
  white-space: nowrap;
  padding-bottom: 10rpx;
  -webkit-overflow-scrolling: touch;
}

.top-card-scroll-x .activity-img {
  width: 170rpx;
  height: 318rpx;
  margin-right: 24rpx;
}

.top-card-img {
  width: 100%;
  height: 158rpx;
}

.item {
  display: inline-block;
  position: relative;
  width: calc(25% - 12rpx);
  height: 158rpx;
  margin-right: 16rpx;
}
.tip-card {
  font-size: 7px;
  position: absolute;
  right: -3.5px;
  top: -4px;
  height: 12px;
  line-height: 12px;
  width: 12px;
  text-align: center;
  border-radius: 6px;
  overflow: hidden;
  background-color: red;
  color: rgba(255, 255, 255, 0.85);
}
</style>
