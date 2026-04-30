<template>
  <vc-modal ref="modal"></vc-modal>
  <!-- <vc-login v-if="!isLogined" /> -->
  <view class="page-container">
    <!-- 顶部圆弧渐变背景和导航栏 -->
    <view class="top-arc-bg" :style="{
      paddingTop: navigationBarInfo.statusBarHeight + 'px',
      background:
        'url(' +
        minioBaseUrl +
        'common/memberCenter/member-nav-bg.png) no-repeat center center / cover',
    }">
      <view class="nav-bar">
        <vc-back :props-data="{
          props: { color: { value: '#fff' }, top: { value: '10px' } },
        }" />
        <view class="page-title" :style="{ lineHeight: navigationBarInfo.navigationBarHeight + 'px' }">积分明细</view>
      </view>
    </view>
    <view class="page-content" :style="'height: calc(100vh - ' +
      (navigationBarInfo.statusBarHeight +
        navigationBarInfo.navigationBarHeight) +
      'px);'
      ">
      <view class="page-content-header" :style="{
        background:
          'url(' +
          minioBaseUrl +
          'common/memberCenter/member-header-bg.png) no-repeat 0 0 / 750rpx 830rpx',
      }">
        <view class="page-content-header-left">
          <view class="page-content-header-left-point">
            <text class="page-content-header-left-point-num">
              {{
                // availablePoints
                totalPoints
              }}</text><text class="page-content-header-left-point-text">积分</text>
          </view>
          <view class="page-content-header-left-validaty" v-if="expire > 0">
            <!-- {{ expire }}积分将于{{ validaty }}后过期 -->
            {{ expire + "积分" + prompt }}
          </view>
          <view class="page-content-header-left-desc">
            <up-icon name="info-circle" size="24rpx" style="margin-right: 10rpx" color="#ffd9ad"></up-icon>
            <text>每笔积分从获取日起，有效期为1年。</text>
          </view>
        </view>

        <view class="page-content-header-right">
          <image class="page-content-header-right-img" :src="minioBaseUrl + 'common/memberCenter/member-guan.png'"
            mode="scaleToFill" />
        </view>
      </view>
      <view class="member-point-detail">
        <view class="member-point-detail-filter">
          <view class="member-point-detail-filter-item" @click="showPicker('time')">
            {{ yearVal }}年{{ monthVal }}月<up-icon name="arrow-down" size="24rpx" style="margin-right: 10rpx"></up-icon>
          </view>
          <view class="member-point-detail-filter-item" @click="showPicker('type')">{{ opTypeName
          }}<up-icon name="arrow-down" size="24rpx" style="margin-right: 10rpx"></up-icon></view>
        </view>
        <view class="member-point-detail-list" v-if="detaileList.length > 0">
          <scroll-view scroll-y="true" class="scroll-y" @scrolltolower="onReachBottomView" :style="'height:  calc(100vh - ' +
            (navigationBarInfo.statusBarHeight +
              navigationBarInfo.navigationBarHeight) +
            'px - 380rpx)'">
            <view v-for="(item, index) in detaileList" :key="index" class="member-point-detail-list-item">
              <view class="member-point-detail-list-item-left">
                <view class="member-point-detail-list-item-left-title">
                  {{ item.eventName }}
                  <view class="member-point-detail-list-item-left-title-state" v-if="item.eventBehavior">
                    {{ item.eventBehavior }}
                  </view>
                </view>
                <view class="member-point-detail-list-item-left-time">
                  {{ formatShowTime(item.createTime) }}
                </view>
                <view class="member-point-detail-list-item-left-time" v-if="
                  item.changeType == 'COST' ||
                  item.changeType == 'COSTOVERDUE' ||
                  item.changeType == 'RETURN'
                ">
                  订单号：{{ item.eventId }}
                </view>
              </view>
              <view class="member-point-detail-list-item-right">
                <view v-if="item.opType === 'add'" class="member-point-detail-list-item-right-in">
                  {{ "+" + item.changeAmount }}
                </view>
                <view v-else class="member-point-detail-list-item-right-out">
                  {{ "-" + item.changeAmount }}
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <vc-empty v-else />
      </view>
    </view>
    <up-picker :columns="columns" :show="pickerShow" keyName="text" @confirm="opTypeConfirm"
      @cancel="opTypeCancel"></up-picker>
    <up-datetime-picker v-model="deteTimeVal" :show="datePickerShow" mode="year-month" :maxDate="maxDate"
      :minDate="minDate" @confirm="monthConfirm" @cancel="monthCancel"></up-datetime-picker>
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";

import { appPointsUserLogList, pointsToExpire } from "../api/index";
export default {
  name: "memberPointDetail",
  computed: {
    ...mapState(useUserStore, {
      // isLogined: "isLogined",
    }),
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
  },
  data() {
    return {
      opType: "all",
      yearVal: "",
      monthVal: "",
      deteTimeVal: null,
      opTypeName: "全部",
      columns: [
        [
          { text: "全部", value: "all" },
          { text: "获取", value: "get" },
          { text: "消耗", value: "consume" },
          { text: "过期", value: "expire" },
        ],
      ],
      availablePoints: 0,
      totalPoints: 0,
      expire: 0,
      prompt: "",
      validaty: "",
      pickerShow: false,
      datePickerShow: false,
      detaileList: [],
      maxDate: "",
      minDate: "",
      total: 0,
      page: 1,
      rows: 10,
    };
  },
  onLoad() {
    let timeNow = new Date();
    this.yearVal = timeNow.getFullYear();
    this.monthVal = timeNow.getMonth() + 1;
    this.deteTimeVal = new Date(this.yearVal, this.monthVal - 1, 1).getTime();
    this.maxDate = this.deteTimeVal;
    this.minDate = new Date(this.yearVal - 1, this.monthVal - 1, 1).getTime();
    this.getList();
    this.getHeader();
  },
  methods: {
    getHeader() {
      pointsToExpire({}).then((res) => {
        console.log("pointsToExpire", res);
        this.availablePoints = res.points.availablePoints;
        this.totalPoints = res.points.totalPoints;
        this.prompt = res.prompt;
        this.expire = res.pointsToExpire.expire;
      });
    },
    getList() {
      let params = {
        opType: this.opType,
        createTime: this.yearVal + "" + (this.monthVal < 10 ? "0" + this.monthVal : this.monthVal),
        page: this.page,
        rows: this.rows,
      };
      console.log(params);
      if (this.page == 1) {
        this.detaileList = [];
        this.total = 0;
      }
      appPointsUserLogList(params).then((res) => {
        console.log("appPointsUserLogList", res);
        if (this.page == 1) {
          this.detaileList = res.list || [];
        } else {
          this.detaileList = this.detaileList.concat(res.list || []);
        }
        this.total = res.total || 0;
      });
    },
    onReachBottomView() {
      console.log("触底");
      let allTotal = this.page * this.rows;
      if (allTotal < this.total) {
        this.page += 1;
        this.getList();
      }
    },
    showPicker(type) {
      if (type === "time") {
        this.datePickerShow = true;
      } else {
        this.pickerShow = true;
      }
    },
    opTypeConfirm(e) {
      console.log(e);
      this.opType = e.value[0].value;
      this.opTypeName = e.value[0].text;
      this.page = 1;
      this.pickerShow = false;
      this.getList();
    },
    opTypeCancel() {
      this.pickerShow = false;
    },
    monthConfirm(e) {
      console.log(e);
      this.yearVal = new Date(e.value).getFullYear();
      this.monthVal = new Date(e.value).getMonth() + 1;
      this.deteTimeVal = e.value;
      this.page = 1;
      this.datePickerShow = false;
      this.getList();
    },
    monthCancel() {
      this.datePickerShow = false;
    },
    formatShowTime(time) {
      return (
        time.substring(0, 4) +
        "-" +
        time.substring(4, 6) +
        "-" +
        time.substring(6, 8) +
        " " +
        time.substring(8, 10) +
        ":" +
        time.substring(10, 12) +
        ":" +
        time.substring(12, 14)
      );
    },
  },
};
</script>

<style scoped lang="scss">
.top-arc-bg {
  // position: relative;
  width: 100vw;
  // height: 360rpx;
  background: linear-gradient(135deg, #19e2c2 0%, #00c6b1 100%);
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
}

.page-container {
  .page-content {
    width: 100%;

    .page-content-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .page-content-header-left {
        padding: 50rpx 0 80rpx 60rpx;
        color: #ffd9ad;

        .page-content-header-left-point {
          // display: flex;
          // align-items: flex-end;

          vertical-align: bottom;

          .page-content-header-left-point-num {
            font-size: 70rpx;
            font-weight: bold;
            margin-right: 4rpx;
            line-height: 70rpx;
          }

          .page-content-header-left-point-text {
            font-size: 28rpx;
            line-height: 32rpx;
          }
        }

        .page-content-header-left-validaty {
          font-weight: bold;
          font-size: 28rpx;
          color: #ffd9ad;
          line-height: 38rpx;
          margin-bottom: 20rpx;
        }

        .page-content-header-left-desc {
          display: flex;
          align-items: center;
          font-weight: 300;
          font-size: 20rpx;
          color: #ffd9ad;
          line-height: 28rpx;
        }
      }

      .page-content-header-right {
        width: 290rpx;
        height: 290rpx;

        .page-content-header-right-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }

    .member-point-detail {
      width: 100%;
      background: #f5f5f5;
      border-radius: 40rpx 40rpx 0 0;
      overflow: hidden;
      margin-top: -40rpx;

      .member-point-detail-filter {
        display: flex;
        width: 100%;
        align-items: center;
        padding: 28rpx 50rpx;
        background: #f5f5f5;
        position: sticky;
        top: 0;

        .member-point-detail-filter-item {
          font-size: 28rpx;
          // width: 200rpx;
          display: flex;
          align-items: center;
          margin-right: 20rpx;
        }
      }

      .member-point-detail-list {
        width: 700rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        margin: auto;
        background: #fff;

        .member-point-detail-list-item {
          width: 100%;
          // background: #ffffff;
          // border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28rpx 30rpx;
          box-sizing: border-box;

          .member-point-detail-list-item-left {
            .member-point-detail-list-item-left-title {
              font-size: 28rpx;
              font-weight: bold;
              line-height: 40rpx;
              color: #333;
              margin-right: 20rpx;
              display: flex;
              align-items: flex-start;

              .member-point-detail-list-item-left-title-state {
                margin-left: 8rpx;
                padding: 4rpx 8rpx;
                font-size: 20rpx;
                line-height: 30rpx;
                color: #999999;
                border-radius: 6px;
                border: 2px solid #979797;
                flex-shrink: 0;
              }
            }

            .member-point-detail-list-item-left-time {
              font-size: 24rpx;
              color: #999;
            }
          }

          .member-point-detail-list-item-right {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .member-point-detail-list-item-right-in {
              font-size: 24rpx;
              color: #e4955a;
            }

            .member-point-detail-list-item-right-out {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }
      }
    }
  }
}
</style>