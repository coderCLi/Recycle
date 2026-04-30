<!--
 * @Description: 搜索框组件 跳转页面
 * @Author: yulongchen
 * @Date: 2024-11-26 18:06:20
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-30 14:54:52
 * @Remark: 
-->
<template>
    <view class="component">
        <view class="cpa-px-12-5 search-box">
          <view class="top-search cpa-flex cpa-align-center" @click="onSearch">
            <image
              class="service-icon-search"
              mode="widthFix"
              :src="staticBaseUrl + '/hbdimage/main/images/home/sousuo.png'"
            ></image>
            <view class="cpa-font-12 cpa-color-info cpa-ml-10">{{ placeholder.value }}</view>
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
        title: "搜索框",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },

        methods: {
            onSearch(){
              console.log("点击搜索");
              this.$emit("toSearch");
            }
        },
    }
</script>

<style lang="scss" scoped>
.search-box {
  background-color: #c9fde7;
  top: 120rpx;
  padding-bottom: 16px;//28rpx;
}   
.top-search {
  background: #ffffff;
  width: 100%;
  height: 36px;//64rpx;
  padding: 0px 20rpx;//12rpx 20rpx;
  border-radius: 40rpx;
  box-sizing: border-box;
}
.service-icon-search {
  width: 32rpx;
  height: 30rpx;
}   
</style>