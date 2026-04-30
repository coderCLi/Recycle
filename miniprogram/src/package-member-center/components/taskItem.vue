<template>
  <view class="task-item">
    <view class="task-info">
      <view class="task-info-icon">
        <image
          class="task-info-icon-img"
          :src="minioBaseUrl + info.imageUrl"
          mode="scaleToFill"
        />
      </view>
      <view class="task-info-content">
        <view class="task-info-title">
          {{ info.pointsTaskName }}
          <up-icon
            name="info-circle"
            @click="showInfo"
            size="24rpx"
            style="margin-left: 10rpx"
          ></up-icon>
        </view>
        <view class="task-info-desc" v-if="info.pointsTaskName == '消费下单'">
          <text >{{ info.remarks }}</text>
        </view>
        <view class="task-info-desc" v-else>
          <text 
            >积分<text class="color-E4955A">+{{ info.rewardValue }}</text></text
          >
          {{ info.remarks }}
        </view>
      </view>
      <view class="task-info-btn">
        <view
          v-if="btnText && info.flag === '3'"
          class="task-info-btn-item"
          @click="goComplate"
          >{{ btnText }}</view
        >
        <view
          v-else-if="btnText && info.flag === '1'"
          class="task-info-btn-success"
          >{{ btnText }}</view
        >
        <view
          v-else-if="info.flag === '3'"
          class="task-info-btn-item"
          @click="goComplate"
          >{{ info.category == "browse" ? "去浏览" : "去完成" }}</view
        >
        <view
          v-else-if="info.flag === '2'"
          class="task-info-btn-get"
          @click="getPoint"
          >领取奖励</view
        >
        <view v-else-if="info.flag === '1'" class="task-info-btn-success"
          >已完成</view
        >
        <view v-else-if="info.flag === '4'" class="task-info-btn-success"
          >未开始</view
        >
      </view>
    </view>
    <up-modal
      v-if="info.pointsTaskName == '邀请好友'"
      :show="showModal1"
      :showConfirmButton="true"
      :showCancelButton="false"
      @confirm="closeModal1"
      @cancel="closeModal1"
    >
      <view>
        <u-qrcode
          :needPreview="false"
          :size="200"
          :val="QRcodeContent"
          class="qrcode-img"
        />
      </view>
    </up-modal>
  </view>
</template>

<script>
import { recordBrowse } from "../api/index";
export default {
  name: "taskItem",
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isHBD: false,
      btnText: "",
      QRcodeContent: "",
      showModal1: false,
    };
  },
  watch: {
    info: {
      handler(newVal, oldVal) {
        if (this.info.category == "Impossible") {
          // 任务为持续任务 无完成状态
          newVal.flag = "3";
        }
        if (newVal.pointsTaskName == "每日签到") {
          if (newVal.flag == "2") {
            newVal.flag = "1";
          }
          if (newVal.flag == "3") {
            this.btnText = "立即签到";
          }
          if (newVal.flag == "1") {
            this.btnText = "明日继续";
          }
        }
        if (
          this.info.pointsTaskName == "首次消费" ||
          this.info.pointsTaskName == "消费下单"
        ) {
          if (this.info.flag == "3") this.btnText = "去下单";
          if (this.info.flag == "2") this.btnText = "";
          if (this.info.flag == "1") this.btnText = "";
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (this.info.category == "Impossible") {
      // 任务为持续任务 无完成状态
      this.info.flag = "3";
    }
    if (this.info.pointsTaskName == "每日签到") {
      if (this.info.flag == "2") {
        this.info.flag = "1";
      }
      if (this.info.flag == "3") {
        this.btnText = "立即签到";
      }
      if (this.info.flag == "1") {
        this.btnText = "明日继续";
      }
    }

    if (
      this.info.pointsTaskName == "首次消费" ||
      this.info.pointsTaskName == "消费下单"
    ) {
      if (this.info.flag == "3") this.btnText = "去下单";
      if (this.info.flag == "2") this.btnText = "";
      if (this.info.flag == "1") this.btnText = "";
    }
  },
  methods: {
    showInfo() {
      let info = {};
      info.title = "任务详情";
      info.content = this.bridgeSdk.addMinioPrefixToImgSrc(
        this.info.description
      );
      this.$emit("showInfo", info);
    },
    async goComplate() {
      // this.goActivity(this.info);
      if (this.info.flag !== "3") {
        return;
      }
      if (this.info.isAuthentication == "1") {
        let res = await this.bridgeSdk.checkIdentityAuth();
        if (!res) return;
      }
      if (this.info.category == "browse") {
        recordBrowse({ pointsTaskId: this.info.pointsTaskId });
      }
      if (this.info.pointsTaskName == "邀请好友") {
        this.recommendFriends();
        return;
      }
      if (this.info.pointsTaskName == "实名认证") {
        this.checkIdentityAuth();
        return;
      }
      let params = {};
      if (this.bridgeSdk.isInHiApp()) {
        params.url = this.info.jumpUrl;
      } else {
        params.url = this.info.jumpUrlWx;
      }
      if (this.info.isTabPage && this.info.isTabPage == "Y") {
        params.pageType = "tab";
        params.tabPageId = this.info.tabPageId;
      }
      this.bridgeSdk.jumpPage(params);
    },
    getPoint() {
      this.$emit("getPoints", this.info);
    },
    // 推荐好友
    recommendFriends() {
      let userInfo = this.bridgeSdk.getUserInfo();
      console.log("用户信息", userInfo);
      let userId = userInfo.userInfo.userId;
      let s = __VITE_SERVER_OTHERURL__ + "/share/#/login?inviteCode=" + userId;
      this.QRcodeContent = s;
      this.showModal1 = true;
    },
    closeModal1() {
      this.showModal1 = false;
    },
    async checkIdentityAuth() {
      const isIdentityAuth = await this.bridgeSdk.checkIdentityAuth();
      console.log("实名认证", isIdentityAuth);
      // if (isIdentityAuth) {
      //   this.bridgeSdk.toast("实名认证成功");
      //   this.info.flag = "1";
      // } else {
      //   this.bridgeSdk.toast("实名认证失败");
      // }
    },
  },
};
</script>
<style scoped lang="scss">
.task-info {
  width: 100%;
  padding: 16rpx 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .task-info-icon {
    width: 80rpx;
    height: 80rpx;
    flex-shrink: 0;
    margin-right: 16rpx;

    .task-info-icon-img {
      width: 100%;
      height: 100%;
    }
  }

  .task-info-content {
    flex: 1;

    .task-info-title {
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      display: flex;
      align-items: center;

      .member-card-validity-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 18rpx;
        height: 18rox;
        border-radius: 20rpx;
        border: 1px solid #e4955a;
        margin-left: 4rpx;

        .member-card-validity-icon-top {
          width: 2rpx;
          height: 2rpx;
          background: #e4955a;
        }

        .member-card-validity-icon-bottom {
          width: 2rpx;
          height: 10rpx;
          background: #e4955a;
        }
      }
    }

    .task-info-desc {
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      line-height: 33rpx;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;

      .color-E4955A {
        color: #e4955a;
      }
    }
  }

  .task-info-btn {
    flex-shrink: 0;

    .task-info-btn-item {
      padding: 6rpx 30rpx;
      border-radius: 50rpx;
      border: 1px solid #e4955a;
      background: #ffffff;
      font-weight: 500;
      font-size: 24rpx;
      color: #e4955a;
      line-height: 38rpx;
      text-align: center;
    }

    .task-info-btn-get {
      padding: 6rpx 30rpx;
      border-radius: 50rpx;
      border: 1px solid #ffd9ad;
      background: #ffd9ad;
      font-weight: 500;
      font-size: 24rpx;
      color: #7e522d;
      line-height: 38rpx;
      text-align: center;
    }

    .task-info-btn-success {
      padding: 6rpx 30rpx;
      border-radius: 50rpx;
      border: 1px solid #ffd9ad;
      background: #ffd9ad;
      font-weight: 500;
      font-size: 24rpx;
      color: #7e522d;
      line-height: 38rpx;
      text-align: center;
      opacity: 0.6;
    }
  }
}
.qrcode-btn {
  width: 100%;
  padding: 20rpx 0;
  margin: 40rpx auto 0;
  background: #e4955a;
  color: #fff;
  border-radius: 50rpx;
  font-size: 24rpx;
  text-align: center;
  line-height: 38rpx;
  cursor: pointer;
}
</style>