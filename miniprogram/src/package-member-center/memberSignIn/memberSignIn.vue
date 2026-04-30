<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-login v-if="!isLogined" />
  <view v-else class="page-container">
    <!-- 顶部圆弧渐变背景和导航栏 -->
    <view
      class="top-arc-bg"
      :style="{
        paddingTop: navigationBarInfo.statusBarHeight + 'px',
        background: 'F5F7FB',
      }"
    >
      <view class="nav-bar">
        <vc-back
          :props-data="{
            props: { color: { value: '#333' }, top: { value: '10px' } },
          }"
        />
        <view
          class="page-title"
          :style="{ lineHeight: navigationBarInfo.navigationBarHeight + 'px' }"
          >签到</view
        >
      </view>
    </view>
    <view
      :style="
        'height: calc(100vh - ' +
        (navigationBarInfo.statusBarHeight +
          navigationBarInfo.navigationBarHeight) +
        'px);overflow-y: scroll;'
      "
    >
      <view
        class="member-sign-in-header"
        :style="{
          background: 'F5F7FB',
        }"
      >
        <view class="member-sign-in-header-box" @click="jumpMyPoint">
          <view class="member-sign-in-header-my-point">
            我的积分
          </view>
          <view class="member-sign-in-header-point-content"
            ><text class="member-sign-in-header-point-content-big">{{
              totalPoints
            }}</text
            >积分<up-icon name="arrow-right"></up-icon
          ></view>
        </view>
        <view class="member-sign-in-header-img">
          <image
            class="member-sign-in-header-image"
            :src="
              minioBaseUrl + 'common/memberCenter/member-sign-header-icon.png'
            "
            mode="scaleToFill"
          ></image>
        </view>
        <view class="member-sign-in-header-rules" @click="jumpRules">
          签到规则
        </view>
      </view>

      <view class="page-content">
        <checkinCalendar
          style="width: 100%"
          @signInCallback="signInCallback"
        ></checkinCalendar>
        <view class="activity-list" v-if="activities.length == 2">
          <view
            class="activity-item"
            v-for="(item, index) in activities"
            :key="index"
          >
            <active-item :info="item">
              <image
                class="activity-item-icon"
                :src="minioBaseUrl + item.iconUrl"
                mode="scaleToFill"
              />
            </active-item>
          </view>
        </view>

        <view class="activity-list" v-if="activities.length == 1">
          <view
            class="activity-item-line"
            v-for="(item, index) in activities"
            :key="index"
          >
            <active-item :info="item">
              <image
                class="activity-item-line-image"
                :src="minioBaseUrl + item.imageUrl"
                mode="scaleToFill"
              />
            </active-item>
          </view>
        </view>
        <member-title
          big-text="会员任务"
          small-text="做任务涨等级"
          style="width: 100%"
        ></member-title>
        <view class="task-box">
          <view v-for="(item, index) in tasks" :key="index">
            <view class="task-box-title">{{ item.groupName }}</view>
            <view
              class="task-item"
              v-for="(chiid, childIndex) in item.taskAllshow || []"
              :key="childIndex"
            >
              <task-item
                :info="chiid"
                v-if="
                  (childIndex < 3 || item.show) &&
                  chiid.pointsTaskName !== '每日签到'
                "
                @showInfo="showModalInfo"
                @getPoints="getPoints"
              ></task-item>
            </view>
            <view
              v-if="item.taskAllshow && item.taskAllshow.length > 3"
              class="more-btn"
              @click="showMore(index)"
              >更多任务<up-icon
                v-if="item.show"
                name="arrow-up"
                color="#999999"
              ></up-icon
              ><up-icon v-else name="arrow-down" color="#999999"></up-icon
            ></view>
          </view>
        </view>
      </view>
      <firstInModal
        v-if="isFirstIn && ruleList.length > 0"
        @close="isFirstIn = false"
        :ruleList="ruleList"
      ></firstInModal>
      <signInModal
        v-if="signSuccess"
        :score="signInScore"
        :continueFlag="continueFlag"
        @handleClose="signSuccess = false"
      ></signInModal>
    </view>
  </view>
</template>
<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";

import memberTitle from "../components/memberTitle";
import taskItem from "../components/taskItem";
import checkinCalendar from "../components/checkinCalendar";
import firstInModal from "../components/firstInModal";
import signInModal from "../components/signInModal";
import activeItem from "../components/activeItem";

import {
  appVipChannelAll,
  queryPointsTaskList,
  visitCheck,
  pointsToExpire,
  queryPointsCheckInRewardRule,
  getTaskPoints,
} from "../api/index";
export default {
  name: "MemberSignIn",
  components: {
    memberTitle,
    taskItem,
    checkinCalendar,
    firstInModal,
    signInModal,
    activeItem,
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined",
    }),
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
  },
  data() {
    return {
      checkInDate: "", // 签到日期
      checkList: [], // 签到日历列表
      availablePoints: 0,
      totalPoints: 0,
      activities: [],
      tasks: [],

      isFirstIn: false, // 是否首次进入
      signSuccess: false, // 签到成功
      signInScore: 0, // 签到获得积分
      continueFlag: false, // 连续签到标识
      totalSignedDays: 0,
      ruleList: [],
    };
  },
  onShow() {
    this.getActivities();
    this.getTasks();
    this.getHeader();
  },
  onLoad() {
    visitCheck({}, { mask: false }).then((res) => {
      console.log("visitCheck", res);
      if (res) {
        this.isFirstIn = true;
      }
    });
    // queryPointsCheckInRewardRule({ enableStatus: "1" }).then((res) => {
    //   console.log("queryPointsCheckInRewardRule", res);
    //   this.ruleList = res.list;
    // });
  },
  methods: {
    refresh() {
      this.getHeader();
      this.getTasks();
    },
    getHeader() {
      pointsToExpire({}).then((res) => {
        console.log("pointsToExpire", res);
        this.availablePoints = res.points.availablePoints;
        this.totalPoints = res.points.totalPoints;
        this.prompt = res.prompt;
        this.expire = res.pointsToExpire.expire;
      });
    },
    getActivities() {
      this.activities = [];
      let channel = "WX";
      if (this.bridgeSdk.isInHiApp()) {
        channel = "APP";
      }
      appVipChannelAll({ privilegeType: "FB", scene: channel }).then((res) => {
        console.log("appVipChannelAll", res);
        this.activities = res;
      });
    },
    getTasks() {
      let channel = "WX";
      if (this.bridgeSdk.isInHiApp()) {
        channel = "APP";
      }
      queryPointsTaskList({ privilegeType: "FB", channel: channel }).then(
        (res) => {
          console.log("queryPointsTaskList", res);
          // this.tasks = res;
          res.forEach((item, index) => {
            // item.show = false;
            item.show = this.tasks[index] ? this.tasks[index].show : false;
            // taskData.push({
            //   groupName: item.groupName,
            //   taskAllshow: [],
            //   show: false,
            // });
          });
          this.$nextTick(() => {
            this.tasks = res;
          });
        }
      );
    },
    showMore(index) {
      this.tasks[index].show = !this.tasks[index].show;
    },
    jumpMyPoint() {
      uni.navigateTo({
        url: "/package-member-center/memberPointDetail/memberPointDetail",
      });
    },
    // 签到成功回调
    signInCallback(info) {
      console.log("signInCallback", info);
      this.continueFlag = info.continueFlag;
      this.signInScore = info.score;
      this.signSuccess = true;
      this.getHeader();
      this.getTasks();
      this.bridgeSdk.updateUserInfo();
    },
    showModalInfo(info) {
      console.log("showModalInfo", info);
      this.$refs.modal.open({
        title: info.title,
        content: info.content,
        confirmText: "确认",
        showCancel: false,
      });
    },
    getPoints(info) {
      let _this = this;
      this.$refs.modal.open({
        title: "确认",
        content: "确认领取积分",
        confirmText: "确认",
        cancelText: "取消",
        confirmCallback: (res) => {
          getTaskPoints({ pointsTaskId: info.pointsTaskId }).then((res) => {
            console.log(res);
            uni.showToast({
              title: "领取成功",
              icon: "none",
            });
            _this.refresh();
          });
        },
      });
    },
    jumpRules() {
      // this.isFirstIn = true;
      let htmlString = "";
      htmlString +=
        "<div style='width: 100%;font-size: 28rpx;line-height: 36rpx;margin-bottom: 20rpx;text-align: left;word-wrap: break-word;word-break: break-all;'>";
      htmlString += "<p> 每天签到奖励</p>";
      htmlString += "<p> 每日登录APP，完成签到任务获得1积分。</p>";
      // htmlString += "<p>2. 连续签到奖励</p>";

      // this.ruleList.forEach((item) => {
      //   htmlString +=
      //     "<p> " +
      //     item.ruleTypeName +
      //     item.triggerDays +
      //     "天," +
      //     "额外奖励" +
      //     (item.rewardType == "MAGNIFICATION"
      //       ? item.magnificationValue
      //       : item.rewardValue) +
      //     item.rewardTypeName +
      //     ";</p>";
      // });
      // htmlString += "<p>3. 断签机制</p>";
      // htmlString += "<p> 若中途断签，连续天数从0重新计算。</p>";

      htmlString += "</div>";
      this.$refs.modal.open({
        title: "签到规则",
        htmlString: htmlString,
        confirmText: "确认",
        showCancel: false,
      });
    },
  },
};
</script>
<style scoped lang="scss">
.top-arc-bg {
  // position: relative;
  width: 100vw;
  // height: 360rpx;
  // background: linear-gradient(135deg, #19e2c2 0%, #00c6b1 100%);
  // border-bottom-left-radius: 60rpx;
  // border-bottom-right-radius: 60rpx;
  // margin-bottom: 120rpx;

  // z-index: 1;
  // overflow: visible;

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // height: 100rpx;
    // padding: 0 30rpx;
    // padding-top: 44rpx; // 适配状态栏
    position: relative;
    z-index: 2;

    .page-title {
      flex: 1;
      text-align: center;
      color: #333333;
      font-size: 38rpx;
      font-weight: bold;
      // margin-left: -44rpx; // 让标题居中
      letter-spacing: 2rpx;
    }
  }
}

.page-container {
  .member-sign-in-header {
    width: 100%;
    // color: #ffd9ad;
    font-size: 28rpx;
    padding: 24rpx 44rpx 34rpx 68rpx;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .member-sign-in-header-rules {
      width: 132rpx;
      height: 52rpx;
      background: #fbe5cb;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 24rpx;
      color: #333333;
      line-height: 52px;
      text-align: center;
      flex-shrink: 0;
    }
    .member-sign-in-header-box {
      padding-top: 20rpx;
      flex-grow: 1;
    }
    .member-sign-in-header-img {
      width: 230rpx;
      height: 152rpx;
      flex-shrink: 0;
      .member-sign-in-header-image {
        width: 230rpx;
        height: 152rpx;
      }
    }

    .member-sign-in-header-point-content {
      margin-bottom: 12rpx;
      display: flex;
      align-items: flex-end;
      font-size: 28rpx;
      line-height: 36rpx;
      font-weight: 600;

      .member-sign-in-header-point-content-big {
        font-size: 70rpx;
        font-weight: bold;
        margin-right: 10rpx;
        line-height: 70rpx;
      }
    }

    .member-sign-in-header-my-point {
      display: flex;
      align-items: center;
    }
  }

  .page-content {
    width: 100%;
    box-sizing: border-box;
    padding: 36rpx 0 40rpx;
    background: #f5f7fb;
    border-radius: 40rpx 40rpx 0 0;
    margin-top: -40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .activity-list {
      width: 100%;
      box-sizing: border-box;
      padding: 40rpx 40rpx 40rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .activity-item {
        // background: linear-gradient(136deg, #1d3b81 0%, #8e6fcb 100%);
        border-radius: 28px;

        // opacity: 0.83;
        .activity-item-icon {
          width: 320rpx;
          height: 180rpx;
          border-radius: 20rpx;
        }
      }
      .activity-item-line {
        width: 670rpx;
        height: 180rpx;
        border-radius: 20rpx;
        .activity-item-line-image {
          width: 670rpx;
          height: 180rpx;
          border-radius: 20rpx;
        }
      }
    }

    .task-box {
      width: 700rpx;
      margin-top: 20rpx;
      background: #fff;
      border-radius: 20rpx;
      box-sizing: border-box;
      padding: 0rpx 30rpx 0;

      .task-box-title {
        font-weight: bold;
        font-size: 32rpx;
        color: #333333;
        line-height: 45rpx;
        margin-bottom: 16rpx;
        margin-top: 30rpx;
      }

      .more-btn {
        width: 100%;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;
        font-size: 28rpx;
        border-radius: 20rpx;
        padding: 10rpx 0 20rpx;
      }
    }
  }
}
</style>