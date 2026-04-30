<template>
    <vc-modal ref="modal"></vc-modal>
  <div class="tabbar">
    <view class="tabbarBox" :style="{ 'justify-content': tabbarList.length < 5 ? 'space-around' : 'flex-start' }">
      <view
        v-for="(item, index) in tabbarList"
        :key="index"
        class="tabbarBoxItem"
      >
        <view
          class="content"
          :class="{ active: activeIndex === index }"
          @click="tabChange(index)"
        >
          {{ item.name }}<text v-if="item.dotShow" class="dot"></text>
        </view>
        <view v-if="activeIndex === index" class="activeLine"></view>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  name: "tabbar",
  emits: ["change"],
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    tabbarList() {
      return this.list.map((item, index) => {
        return {
          ...item,
        };
      });
    }
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  mounted() {
    console.log("tabbar mounted")
    console.log(this.list)
    // this.tabbarList = this.list
    // if (this.defaultIndex) {
      // this.activeIndex = this.defaultIndex;
      this.tabChange(this.defaultIndex);
    // }
  },
  methods: {
    tabChange(index) {
      this.activeIndex = index;
      this.$emit("change", index, this.tabbarList[index]);
    },
  },
};
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
  .tabbarBox {
    width: 100%;
    // height: 100rpx;
    box-sizing: border-box;
    // padding: 0 30rpx;
    overflow-x: auto;
    background: #fff;
    display: flex;
    align-items: center;
    //justify-content: flex-start;
    justify-content: space-around;
    white-space: nowrap;
    .tabbarBoxItem {
      width: auto;
    //   padding: 0 20rpx;
    margin-right: 30rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      .content {
        min-width: 60rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        text-align: center;
        // padding-top: 22rpx;
        padding-bottom: 8rpx;
        color: #999;
        position: relative;
      }
      .active {
        font-weight: bold;
        color: #333;
      }
      .activeLine {
        width: 60rpx;
        height: 8rpx;
        background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #00bcb9;
        border-radius: 4rpx;
      }
      .dot {
        position: absolute;
        top: 22rpx;
        right: -16rpx;
        width: 16rpx;
        height: 16rpx;
        background: red;
        display: block;
        z-index: 1;
        border-radius: 20rpx;
      }
    }
  }
}
</style>