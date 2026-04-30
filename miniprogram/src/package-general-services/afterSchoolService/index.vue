<!--
 * @Description: 课后服务
 已废除,改为了采用课后服务新聚合页
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="container">
    <view class="top-box">
      <image class="img" :src="backgroundImg"></image>
    </view>

    <view class="service">
      <view class="service-list" v-for="(item, index) in list" :key="index">
        <view style="display: flex; height: 100%; align-items: center">
          <image class="imgleft" :src="item.icon"></image>
          <view class="service-title">{{ item.name }}</view>
        </view>
        <image class="imgright" :src="icon" @click="jumpTo(item, index)"></image>
      </view>
    </view>
    <vc-safe-bottom />

  </vc-container>
</template>
<script>
export default {
  name: "afterSchoolService",
  data () {
    return {
      backgroundImg: this.staticBaseUrl + '/hbdimage/baseImage/after_school_banner.png',
      icon: `${this.staticBaseUrl}/hbdimage/baseImage/after_school_more.png`,
      list: [{
        name: '教师端',
        icon: `${this.staticBaseUrl}/hbdimage/baseImage/after_school_teacher.png`,
        url: ''
      }, {
        name: '家长端',
        icon: `${this.staticBaseUrl}/hbdimage/baseImage/after_school_student.png`,
        url: ''
      }]
    }
  },
  async onLoad (options) {


  },
  computed: {

  },
  methods: {
    jumpTo () {

    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #30d6cf 0%, #ffffff 100%);
  position: relative;
  .top-box {
    position: relative;
    overflow: hidden;
    height: 361rpx;
    .img {
      width: 100%;
      height: 465rpx;
    }
  }
  .service {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .service-list {
      height: 120rpx;
      width: 670rpx;
      margin-bottom: 30rpx;
      background: linear-gradient(180deg, #e1fffd 0%, #ffffff 79%);
      box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(0, 0, 0, 0.24),
        inset 0rpx 4rpx 8rpx 0rpx #ffffff;
      border-radius: 20rpx 20rpx 60rpx 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      .imgleft {
        width: 70rpx;
        height: 70rpx;
        margin-left: 40rpx;
        margin-right: 32rpx;
      }
      .imgright {
        width: 48rpx;
        height: 48rpx;
        margin-right: 40rpx;
      }
      .service-title {
        height: 45rpx;
        font-weight: bold;
        font-size: 32rpx;
        color: #333333;
        line-height: 45rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }
}
::v-deep .u-border-bottom,
.up-border-bottom {
  border-bottom: 0;
}
</style>