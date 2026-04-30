<template>
  <view class="benefit-tab-item">
    <view
      v-if="index == active"
      class="member-benefit-header-item"
      @click="changeActive()"
    >
      <image
        class="member-benefit-header-icon"
        :src="minioBaseUrl + info.privilegeIcon2Url"
      ></image>
      <view class="member-benefit-header-number-active">
        {{ (info.quantity ? info.quantity : 0) + (info.unit ? info.unit : "") }}
      </view>
      <view class="member-benefit-header-name-active">
        {{ info.privilegeName }}
      </view>
    </view>
    <view v-else class="member-benefit-header-item" @click="changeActive()">
      <image
        class="member-benefit-header-icon"
        :src="minioBaseUrl + info.privilegeIconUrl"
      ></image>
      <view
        v-if="pageName == 'meberCenter' && info.isGet == '0'"
        class="member-benefit-header-item-status"
        >待领取</view
      >
      <view class="member-benefit-header-number">{{
        (info.quantity ? info.quantity : 0) + (info.unit ? info.unit : "")
      }}</view>
      <view class="member-benefit-header-name">{{ info.privilegeName }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    actived: {
      type: Number,
      default: -1,
    },
    pageName: {
      type: String,
    },
  },
  data() {
    return {
      active: -1,
    };
  },
  watch: {
    actived(val) {
      this.active = val;
    },
  },
  mounted() {
    this.active = this.actived;
  },
  methods: {
    changeActive() {
      this.$emit("changeActive", this.index);
    },
  },
};
</script>

<style scoped lang="scss">
.benefit-tab-item {
  width: 160rpx;
  position: relative;
  .member-benefit-header-item {
    width: 160rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
    // margin-right: 40rpx;
    flex-shrink: 0;
    flex-grow: 0;

    .member-benefit-header-item-status {
      position: absolute;
      top: 0rpx;
      right: 18rpx;
      color: #fdcf7d;
      font-size: 18rpx;
      z-index: 1;
    }

    .member-benefit-header-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }

    .member-benefit-header-number-active {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      position: relative;
      z-index: 1;
    }

    .member-benefit-header-number {
      width: 58rpx;
      height: 32rpx;
      background: #756341;
      box-sizing: border-box;
      border-radius: 16rpx;
      border: 1px solid #fcce7b;
      font-weight: 400;
      font-size: 20rpx;
      color: #ffffff;
      line-height: 32rpx;
      text-align: center;
      margin-top: -26rpx;
      position: relative;
      z-index: 1;
    }

    .member-benefit-header-number-active {
      width: 58rpx;
      height: 32rpx;
      box-sizing: border-box;
      background: #000000;
      border-radius: 16rpx;
      border: 1px solid #fcce7b;
      font-weight: 400;
      font-size: 20rpx;
      color: #fcce7b;
      line-height: 32rpx;
      text-align: center;
      margin-top: -26rpx;
    }

    .member-benefit-header-name {
      width: 140rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #ffffff;
      line-height: 33rpx;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .member-benefit-header-name-active {
      width: 140rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #fdcf7e;
      line-height: 33rpx;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>