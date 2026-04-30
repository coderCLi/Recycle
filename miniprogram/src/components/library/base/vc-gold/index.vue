<!--
 * @Description: 特色专区
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-11-27 12:55:00
 * @Remark: 
-->
<template>
  <view class="component">
    <view class="gold-box" :style="'background: url(' + minioBaseUrl + '/common/tabbarImages/home_top_tabbar_bg_img.png) no-repeat center center;'">
      <!-- <view class="cpa-font-16 cpa-weight-blod">黄金区</view> -->
      <view class="gold-content">
        <view
          class="gold-item"
          v-for="(item, index) in list.value"
          :key="index"
          @click="toPage(item)"
        >
          <image :src="item.imgurl" class="gold-img" mode="widthFix"></image>
          <text class="gold-title">{{ item.name }}</text>
          <text class="gold-desc">{{ item.serviceDes }}</text>
        </view>
      </view>
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
  title: "黄金区",
  data() {
    return {
      ...JSON.parse(JSON.stringify(props)),
    };
  },

  mounted() {
    // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
  },

  methods: {
    toPage(item) {
      console.log("toPage: ", item);
      this.$emit("toPage", item);
    },
    toOpenNewWin(item) {
      console.log("toOpenNewWin: ", item);
      this.$emit("toPage", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.gold-box {
  width: 704rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  padding: 28rpx 50rpx;
  margin-top: -40rpx;
  position: relative;

  .gold-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.gold-item {
  width: 140rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .gold-img {
    width: 84rpx;
    height: 84rpx;
  }

  .gold-title {
    font-weight: bold;
    font-size: 26rpx;
    color: #090000;
    line-height: 36rpx;
    margin-top: 14rpx;
  }
  .gold-desc {
    text-align: center;
    font-weight: bold;
    font-size: 18rpx;
    color: #090000;
    line-height: 26rpx;
    letter-spacing: 1px;
  }
}
</style>
