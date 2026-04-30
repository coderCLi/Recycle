<!--
 * @Description: 图片卡片
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-11-25 11:32:54
 * @Remark: 
-->
<template>
  <view class="component">
    <view class="top-card-four-wrapper">
      <view class="cpa-font-16 cpa-weight-blod padding-left-5 title-box">
        <view class="title">{{ title.value }}</view>
        <view class="right-box" v-if="moreContent">
          更多
          <image
            :src="minioBaseUrl + 'common/pages-home/right-arrow.png'"
            class="right-img"
            mode="widthFix"
          ></image>
          <view class="more" @click.stop="toPage(moreContent)"></view>
        </view>
      </view>
      <view class="top-card">
        <view class="image-box" v-for="(item, index) in list5" :class="{ pointThird: index >= 2, half: index <= 1 }" :key="index">
          <view class="item">
            <image
              :src="item.imgurl"
              @click="toPage(item)"
              class="distinct-img"
              style="width: 100%;"
              mode="widthFix"
            ></image>
            <view v-if="item.isTips == '1'" class="tip-card1">
              <image :src="minioBaseUrl + huotippng" class="tip-card-image" mode="heightFix"></image>
              <view class="tip-text">{{ item.tipText }}</view>
            </view>
          </view>
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
  title: "图片卡片",
  data() {
    return {
      ...JSON.parse(JSON.stringify(props)),
      huotippng: 'common/hbdbucket/static/huotip.png'
    };
  },
  computed: {
    list5() {
      let _arr = [];
      if (this.list.value) {
        _arr = this.list.value.filter((e)=> {
          return e.orderFlag != 0 && e.orderFlag != '0'
        })
      }
      if (_arr.length > 5) {
        return _arr.slice(0, 5);
      }
      return _arr;
    },
    moreContent() {
      return this.list.value.find((e)=> {
        return e.orderFlag == 0 || e.orderFlag == '0'
      })
    }
  },
  mounted() {
    // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
  },

  methods: {
    toPage(item) {
      console.log("toPage: ", item);
      this.$emit("toPage", item);
    }
  },
};
</script>

<style lang="scss" scoped>
.top-card-four-wrapper {
  padding: 20rpx 20rpx;
  background: white;
  border-radius: 20rpx;
  margin: 20rpx auto 0;
  box-sizing: border-box;
  width: 100%;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .right-box {
    position: relative;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 24rpx;
    color: #34495E;
    .right-img {
      margin-left: 7rpx;
      width: 9rpx;
      height: 16rpx;
    }
  }
  .more {
    position: absolute;
    font-size: 26rpx;
    color: #66717c;
    align-items: center;
    margin-right: -36rpx;
    width: calc(100% + 36rpx);
    height: 100%;
    top: 0;
    left: 0;
  }
}

.top-card {
  padding-top: 14rpx;
  display: flex;
  flex-wrap: wrap;
}
.image-box {
  padding: 10rpx;
  box-sizing: border-box;
  &.pointThird {
    width: 33.33%;
  }

  &.half {
    width: 50%;
  }
}
.distinct-img {
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 20rpx;
}
.item {
  position: relative;
}
.tip-card1 {
  font-size: 9px;
  font-weight: bold;
  position: absolute;
  right: -8px;
  top: -8px;
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
</style>
