<!--
 * @Description: 菜单组件
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-08 10:45:05
 * @Remark: 
-->
<template>
    <view class="component">
      <view class="top-menu">
        <view
          v-for="(item, index) in list.value.slice(0, 9)"
          :key="index"
          @click="toPage(item)"
          class="cpa-flex cpa-column cpa-align-center top-menu-item"
          :class="`${item.tagClass ? item.tagClass : ''}`"
        >
          <view class="menu-icon">
            <image
              v-if="item.staticUrl"
              class="menu-icon"
              :src="item.staticUrl"
              mode="contain"
            ></image>
            <image
              v-else
              class="menu-icon"
              :src="item.iconMinio"
              mode="contain"
            ></image>
            <view v-if="item.isTips == '1'" class="tip-card">{{ item.tipText }}</view>
          </view>
          <view class="top-menu-item-text">{{ item.name }}</view>
        </view>

        <view
          class="cpa-flex cpa-column cpa-align-center top-menu-item"
          :class="`${moreItem.value.tagClass ? moreItem.value.tagClass : ''}`"
          @click="toOpenNewWin(moreitem)"
        >
            <!-- :src="staticBaseUrl + '/hbdimage/main/images/home/gengduofuwu.png'" -->
        
          <image
            :src="minioBaseUrl + '/common/tabbarImages/home_icon_moreserve_img.png'"
            class="menu-icon"
            mode="contain"
          ></image>
          <view class="cpa-font-14 top-menu-item-text">更多服务</view>
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
        title: "菜单组件",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                moreitem: {
                  title: "更多服务",
                  url: "/package-more/more/more"
                }
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },

        methods: {
          toPage(item){
            console.log("toPage: ", item);
            this.$emit('toPage', item);
          },
          toOpenNewWin(item){
            console.log("toOpenNewWin: ", item);
            this.$emit('toPage', item);
          },
          getThat() {
            return this;
          }
        },
    }
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 84rpx;
  height: 84rpx;
}

.top-menu {
  width: 704rpx;
  // background: linear-gradient( 180deg, #DBE2FF 0%, #E4E9FF 4%, #FFFFFF 33%, #FFFFFF 100%);;
  // border-radius: 20rpx;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20rpx 0px;
  box-sizing: border-box;
  // padding: 38rpx 40rpx;
  margin-top: 20rpx;

  .top-menu-item-text {
    text-align: center;
    font-weight: 800;
    font-size: 24rpx;
    color: #090000;
    line-height: 34rpx;
    margin-top: 16rpx;
  }

  .menu-icon {
    position: relative;
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
}
</style>
