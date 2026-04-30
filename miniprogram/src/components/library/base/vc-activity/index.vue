<!--
 * @Description: 活动专区
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-02-19 12:07:47
 * @Remark: 
-->
<template>
    <view class="component">
      <view class="top-card">
        <view class="cpa-font-16 cpa-weight-blod padding-left-5" v-if="title && !/^.{4}[0-9]{1,2}$/.test(title.value)"><text class="hf-title-img"></text>{{ title.value }}</view>
        <view class="top-card-scroll-x">
          <view class="item" v-for="(item, index) in listContent" :key="index">
            <image
              :src="item.imgurl"
              @click="toPage(item)"
              class="activity-img"
              :class="!item.imgurl ? 'height0' : ''"
              mode="scaleToFill"
            ></image>
            <view v-if="item.isTips == '1'" class="tip-card1">
              <image :src="minioBaseUrl + huotippng" class="tip-card-image" mode="heightFix"></image>
              <view class="tip-text">{{ item.tipText }}</view>
            </view>
          </view>
          <view class="more-item" v-if="moreContent" @click.stop="toPage(moreContent)">
              <image :src="minioBaseUrl + 'common/pages-home/right-radius.png'" class="right-arrow" mode="heightFix"></image>
              <text class="txt">查看更多</text>
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
        title: "活动专区",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                huotippng: 'common/hbdbucket/static/huotip.png'
            }
        },
        computed: {
          listContent() {
            let _arr = [];
            if (this.list.value) {
              _arr = this.list.value.filter((e)=> {
                return e.orderFlag != 0 && e.orderFlag != '0'
              })
            }
            // if (_arr.length > 7) {
            //   return _arr.slice(0, 7);
            // }
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
          toPage(item){
            console.log("toPage: ", item);
            this.$emit("toPage", item);
          }
        },
    }
</script>

<style lang="scss" scoped>
.top-card {
  // padding: 20rpx 20rpx;
  // background: url("https://life.hihihi.com.cn/hbdimage/img/kapianbeijing.13052b1a.png") no-repeat;
  background-size: cover;
  width: 100%;
  box-sizing: border-box;
  // border-radius: 20rpx;
}

.top-card-scroll-x {
  padding-top: 14rpx;
  overflow-x: auto;
  width: 100%;
  white-space: nowrap;
  padding-bottom: 10rpx;
  -webkit-overflow-scrolling: touch;
  display: inline-flex;
}
.item {
  position: relative;
}
.top-card-scroll-x .item {
  flex-shrink: 0;
  width: 200rpx;
  height: 140rpx !important;
  border-radius: 18rpx;
  overflow: hidden;
  margin-right: 35rpx;
  display: inline-flex;
  .activity-img {
    width: 200rpx !important;
    height: 140rpx !important;
    border-radius: 18rpx;
  }
  .height0 {
    height: 0;
  }
}
.hf-title-img{
  display: inline-block;
  width: 6rpx;
  height: 29rpx;
  background: #FF6634;
  border-radius: 3rpx;
  margin-right: 16rpx;
}
.top-card-scroll-x .more-item {
  flex-shrink: 0;
  // width: 126rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    .right-arrow {
      width: 40rpx;
      height: 40rpx;
      margin: 0 auto;
    }
    .txt {
      margin-top: 6rpx;
      display: block;
      text-align: center;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
    }
}
.tip-card1 {
  font-size: 9px;
  font-weight: bold;
  position: absolute;
  left: 2px;
  top: 2px;
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
