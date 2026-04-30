<template>
  <vc-modal ref="modal"></vc-modal>
  <!-- <vc-login v-if="!isLogined" /> -->
  <view class="page-container">
    <!-- 顶部圆弧渐变背景和导航栏 -->
    <view
      class="top-arc-bg"
      :style="{
        paddingTop: navigationBarInfo.statusBarHeight + 'px',
        background:
          'url(' +
          minioBaseUrl +
          'common/memberCenter/member-nav-bg.png) no-repeat center center / cover',
      }"
    >
      <view class="nav-bar">
        <vc-back
          :props-data="{
            props: { color: { value: '#fff' }, top: { value: '10px' } },
          }"
        />
        <view
          class="page-title"
          :style="{ lineHeight: navigationBarInfo.navigationBarHeight + 'px' }"
          >会员中心</view
        >
      </view>
    </view>
    <view
      :style="{
        height:
          'calc(100vh - ' +
          (navigationBarInfo.statusBarHeight +
            navigationBarInfo.navigationBarHeight) +
          'px)',
        overflowY: 'scroll',
      }"
    >
    <scroll-view
      class="member-benefit-header-box"
      scroll-y
      :scroll-into-view="scrollIntoViewId"
      :enable-flex="true"
    >
      <view
        class="memberHeaderBox"
        :style="{
          background:
            'url(' +
            minioBaseUrl +
            'common/memberCenter/member-header-bg.png) repeat 0 0  / 750rpx 100%',
        }"
      >
        <swiper :current="swiperIndex" @change="swiperChange" style="height: 480rpx;">
          <swiper-item v-for="(memberInfo, memberIndex) in memberList">
            <view>
              <view class="member-center-header">
                <image v-if="memberIndex>0 && memberIndex-1>currentMemberIndex"
                  class="member-center-header-prep-image"
                  :src="minioBaseUrl + 'common/memberCenter/memberLevel' + (memberIndex+1) + 'Lock.png'"
                  mode="scaleToFill"
                />
                <image  v-if="memberIndex>currentMemberIndex &&memberIndex>currentMemberIndex"
                  class="member-center-header-current-image"
                  :src="minioBaseUrl + 'common/memberCenter/memberLevel' + (swiperIndex+1) + 'Lock.png'"
                  mode="scaleToFill"
                />
                <image v-if="memberIndex<memberList.length-1 && memberIndex+1>currentMemberIndex"
                  class="member-center-header-next-image"
                  :src="minioBaseUrl + 'common/memberCenter/memberLevel' + (memberIndex+1) + 'Lock.png'"
                  mode="scaleToFill"
                />
                <image
                  class="member-center-header-image"
                  :src="minioBaseUrl + memberInfo.advancedUrl"
                  mode="scaleToFill"
                />
              </view>
              <member-card
                v-if="memberInfo"
                :info="memberInfo"
                @showInfo="showModalInfo"
                :memberIndex="memberIndex"
                :currentMemberIndex="currentMemberIndex"
                :allLevel="memberList.length"
              ></member-card>
            </view>
          </swiper-item>
        </swiper>
        <view class="hasBenefitBox" v-if="hasVipPrivileges">
          <view class="hasBenefitBoxItem" @click="jumpHasBenefit('3')">
            <text class="hasBenefitBoxItemNum">{{ quantityOfPrizeDraw }}</text><text class="hasBenefitBoxItemDesc">次 免积分抽奖</text>
          </view>
          <view class="hasBenefitBoxItem" @click="jumpHasBenefit('1')">
            <text class="hasBenefitBoxItemNum">{{ quantityOfValidCoupons }}</text><text class="hasBenefitBoxItemDesc">张 我的券包</text>
          </view>
        </view>
        <view class="enjoy-good" v-if="vipPrivileges.length">
          <view class="enjoy-good-title"
            >可享{{ vipPrivileges.length }}项权益</view
          >
            <scroll-view scroll-x  class="good-box" :enable-flex="true">
                <view
                  class="good-item"
                  v-for="(item, index) in vipPrivileges"
                  :key="index"
                  :id="'good'+item.id"
                >
                  <benefit-tab-item :info="item" pageName="meberCenter" :index="index" @changeActive="changeActive"></benefit-tab-item>
                </view>
            </scroll-view>
        </view>
      </view>
      <view class="page-content">
        <member-title
          v-if="activities.length"
          big-text="活动福利"
          small-text="用积分兑好礼"
          style="width: 100%"
        ></member-title>
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
          v-show="taskData.length"
          big-text="会员任务"
          small-text="做任务涨等级"
          style="width: 100%"
        ></member-title>
        <view class="task-box" id="taskBox" v-if="taskData.length">
          <view v-for="(item, index) in taskData" :key="index">
            <view class="task-box-title">{{ item.groupName }}</view>
            <view
              class="task-item"
              v-for="(chiid, childIndex) in item.taskAllshow"
              :key="childIndex"
            >
              <task-item
                :info="chiid"
                v-if="childIndex < 3 || item.show"
                @showInfo="showTaskInfo"
                @getPoints="getPoints"
              ></task-item>
            </view>
            <view
              v-if="item.taskAllshow && item.taskAllshow.length > 3"
              class="more-btn"
              @click="showMore(index)"
              >更多任务<up-icon v-if="item.show" name="arrow-up" color="#999999"></up-icon
              ><up-icon v-else name="arrow-down" color="#999999"></up-icon
            ></view>
          </view>
        </view>
      </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";

import memberHeader from "../components/memberHeader";
import memberCard from "../components/memberCard";
import memberTitle from "../components/memberTitle";
import taskItem from "../components/taskItem";
import activeItem from "../components/activeItem";
import benefitTabItem from "../components/benefitTabItem";

import {
  // getUserFubaoPointsAndMemberLevel,
  getUserFubaoPointsAndMemberLevels,
  appVipChannelAll,
  queryPointsTaskList,
  getTaskPoints,
} from "../api/index";
export default {
  name: "MemberCenter",
  components: {
    memberHeader,
    memberCard,
    memberTitle,
    taskItem,
    activeItem,
    benefitTabItem,
  },
  data() {
    return {
      // memberInfo: {},
      activities: [],
      // 已领取未使用权益
      hasVipPrivileges: false, // 是否拥有权益
      quantityOfPrizeDraw: 0, // 免积分抽奖次数
      quantityOfValidCoupons: 0, // 有效优惠券数量
      // 权益列表
      vipPrivileges: [],
      // 任务列表
      taskData: [],
      taskVal: false,

      currentMemberIndex: 0,
      swiperIndex: 0,
      memberList: [],
      totalPoints: null,
      scrollIntoViewId: "",
    };
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
  // watch: {
  //   taskData: {
  //     handler(newVal, oldVal) {
  //       console.log("taskData", newVal);
  //     },
  //     deep: true,
  //   },
  // },
  async onLoad(options) {
    if(options.scrollTask) this.scrollTask = true
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onShow() {
    // this.getLevel();
    this.getAllLevel();
    this.getTasks();
  },
  methods: {
    __loadData__() {
      this.getUserInfo();
      this.getActivities();
    },
    getUserInfo() {
      this.userInfo = this.bridgeSdk.getUserInfo();
      console.log("用户信息", this.userInfo);

      if (!this.userInfo) {
        this.bridgeSdk.toLogin();
      } else {
        this.userId = this.userInfo.userInfo.userId;
      }
    },
    refresh() {
      // this.getLevel();
      this.getAllLevel();
      // this.getActivities();
      this.getTasks();
    },
    // getLevel() {
    //   this.memberInfo = {};
    //   getUserFubaoPointsAndMemberLevel({ privilegeType: "FB" }).then((res) => {
    //     console.log("getUserFubaoPointsAndMemberLevel", res);
    //     console.log(JSON.stringify(res));
    //     let memberInfo = {};
    //     memberInfo = res.vip;
    //     memberInfo.totalPoints = res.points.totalPoints;
    //     memberInfo.availablePoints = res.points.availablePoints;
    //     memberInfo.currentPoint = Number(
    //       res.points.totalPoints - res.vip.growthMin
    //     );
    //     memberInfo.levelPoint = Number(res.vip.growthMax);

    //     this.memberInfo = memberInfo;
    //     this.vipPrivileges = res.vipPrivileges;
    //     this.quantityOfPrizeDraw = res.quantityOfPrizeDraw;
    //     this.quantityOfValidCoupons = res.quantityOfValidCoupons;
    //   });
    // },
    getAllLevel() {
      // this.memberList = [];
      // this.swiperIndex = 0;
      getUserFubaoPointsAndMemberLevels({ privilegeType: "FB" }).then((res) => {
        console.log("getUserFubaoPointsAndMemberLevels", res);
        let totalPoints = this.totalPoints;
        let currentMemberIndex = this.currentMemberIndex;
        res.vipAll.forEach((item, index) => {
          let ret = item;
          ret.totalPoints = res.points.totalPoints;
          ret.availablePoints = res.points.availablePoints;
          
          if (item.isUserVip == "1") {
            this.swiperIndex = index;
            this.currentMemberIndex = index;
            this.totalPoints = res.points.totalPoints;
            this.vipPrivileges = item.vipPrivileges;
            this.hasVipPrivileges = item.vipPrivileges&&item.vipPrivileges.length>0;
            this.quantityOfPrizeDraw = item.quantityOfPrizeDraw;
            this.quantityOfValidCoupons = item.quantityOfValidCoupons;
          }
          return ret;
        });
        // if(this.totalPoints == totalPoints && this.currentMemberIndex == currentMemberIndex){return}
        this.memberList = res.vipAll
        console.log("memberList", this.memberList);

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
        this.activities = res||[];
      });
    },

    getTasks() {
      // let taskData = [];
      let channel = "WX";
      if (this.bridgeSdk.isInHiApp()) {
        channel = "APP";
      }
      queryPointsTaskList({ privilegeType: "FB", channel: channel }).then(
        (res) => {
          console.log("queryPointsTaskList", res);
          // console.log(JSON.stringify(res))
          res.forEach((item, index) => {
            // item.show = false;
            item.show = this.taskData[index]
              ? this.taskData[index].show
              : false;

            // if(item.groupName == "日常任务"){
            //   item.taskAllshow.unshift({

            //   })
            // }
          });
          this.$nextTick(() => {
            this.taskData = res;
            // if(this.scrollTask) {
            //   this.$nextTick(() => {
            //     console.log("scrollTask", this.scrollTask)
            //     this.scrollIntoViewId = "taskBox"
            //     this.scrollTask = false
            //   })
            // }
          });
        }
      );
    },

    swiperChange(e) {
      this.swiperIndex = e.detail.current;
      this.vipPrivileges = this.memberList[e.detail.current].vipPrivileges;
      // this.quantityOfPrizeDraw =
      //   this.memberList[e.detail.current].quantityOfPrizeDraw;
      // this.quantityOfValidCoupons =
      //   this.memberList[e.detail.current].quantityOfValidCoupons;
    },
    showMore(index) {
      this.taskData[index].show = !this.taskData[index].show;
    },
    showModalInfo(info) {
      console.log("showModalInfo", info);
      if(this.swiperIndex !== this.currentMemberIndex)return
      this.$refs.modal.open({
        title: info.title,
        content: info.content,
        confirmText: "确认",
        showCancel: false,
      });
    },
    showTaskInfo(info) {
      console.log("showTaskInfo", info);
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
    changeActive(index) {
      if(this.swiperIndex < this.currentMemberIndex){
        uni.showToast({
          title: "不支持领取非当前等级内的权益",
          icon: "none",
          duration: 1000,
        });
        return;
      }
      if(this.swiperIndex > this.currentMemberIndex){
        uni.showToast({
          title: "赚积分可升级解锁更多权益哦~",
          icon: "none",
          duration: 1000,
        });
        return;
      }
      uni.navigateTo({
        url:
          "/package-member-center/memberBenefit/memberBenefit?activedId=" +
          this.vipPrivileges[index].id,
      });
    },
    jumpHasBenefit(typeId){
      uni.navigateTo({
        url:
          "/package-member-center/memberHasBenefit/memberHasBenefit?typeId=" +
          typeId,
      });
    }
  },
};
</script>

<style scoped lang="scss">
.page-container {
  background-color: #ffffff;
  margin: 0 auto;

  .memberHeaderBox {
    padding-bottom: 40rpx;

    // background: #000;
    .member-center-header {
      width: 100%;
      height: 134rpx;
      position: relative;

      .member-center-header-image {
        width: 100%;
        height: 100%;
      }

        .member-center-header-prep-image{
        position: absolute;
        top: 56rpx;
        left: 180rpx;
        width: 10rpx;
        height: 14rpx;
         }

        .member-center-header-current-image{
        position: absolute;
        top: 78rpx;
        left: 388rpx;
        width: 14rpx;
        height: 18rpx;
         }

        .member-center-header-next-image{
        position: absolute;
        top: 56rpx;
        left: 586rpx;
        width: 10rpx;
        height: 14rpx;
         }
    }
    .hasBenefitBox{
      width: 620rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
      .hasBenefitBoxItem{
        flex: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        box-sizing: border-box;
        padding: 22rpx 0 40rpx;
        .hasBenefitBoxItemNum{
          font-weight: 500;
          font-size: 48rpx;
          color: #FFFFFF;
          line-height: 48rpx;
        }
        .hasBenefitBoxItemDesc{
          font-weight: 500;
          font-size: 28rpx;
          color: #FFFFFF;
          line-height: 36rpx;
        }
      }
    }

    .enjoy-good {
      width: 100%;
      box-sizing: border-box;
      padding: 4rpx 40rpx 20rpx;

      .enjoy-good-title {
        font-weight: 600;
        font-size: 32rpx;
        color: #fdcf7d;
        line-height: 44rpx;
        // margin-bottom: 24rpx;
      }

      .good-box {
        width: 100%;
        // height: 146rpx;
        padding-top: 24rpx;
        display: flex;
        align-items: flex-start;
        // flex-wrap: nowrap;
        // justify-content: flex-start;
        // overflow-x: scroll;
        white-space:nowrap;

        .good-item {
          width: 160rpx;
          display: flex;
          align-items: center;
          flex-direction: column;
          // margin-right: 40rpx;
          flex-shrink: 0;
          flex-grow: 0;
          display: inline-block;

          .good-icon {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            position: relative;
            z-index: 0;
          }

          .good-number {
            width: 58rpx;
            height: 32rpx;
            background: #756341;
            border-radius: 16rpx;
            border: 1px solid #fcce7b;
            font-weight: 400;
            font-size: 20rpx;
            color: #ffffff;
            line-height: 28rpx;
            text-align: center;
            margin-top: -26rpx;
            position: relative;
            z-index: 1;
          }

          .good-name {
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
        }
      }
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
      padding: 20rpx 40rpx 40rpx;
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
      .activity-item-line{
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
      color: #fff;
      font-size: 38rpx;
      font-weight: bold;
      // margin-left: -44rpx; // 让标题居中
      letter-spacing: 2rpx;
    }
  }

  .resume-summary-card {
    // position: absolute;
    // left: 50%;
    // top: 150rpx;
    // transform: translateX(-50%);
    width: 690rpx;
    background: #fff;
    border-radius: 32rpx;
    background: linear-gradient(136deg, #ffffff 0%, #f5fffe 100%);
    box-shadow: 0px 4rpx 28rpx 0px rgba(1, 192, 185, 0.5);
    border-radius: 28rpx;
    display: flex;
    // flex-direction: column;
    align-items: flex-start;
    padding: 36rpx 32rpx 28rpx 28rpx;
    box-sizing: border-box;
    margin: 40rpx auto 40rpx;

    .resume-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;

      .resume-header {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .resume-username {
          font-size: 28rpx;
          font-weight: bold;
          color: #222;
          margin-right: 16rpx;
          max-width: 260rpx;
          word-break: break-word;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .identity-tag {
          display: flex;
          align-items: center;
          border: 2rpx solid #00c6b1;
          color: #00c6b1;
          font-size: 22rpx;
          border-radius: 10rpx;
          padding: 0 12rpx;
          height: 36rpx;
          margin-top: 2rpx;
          margin-right: 8rpx;
          background: #e6f9f7;
        }
      }
    }
  }
}
</style>