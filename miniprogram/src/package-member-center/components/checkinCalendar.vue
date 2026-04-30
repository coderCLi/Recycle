/**
* @ 签到日历
*/
<template>
  <vc-modal ref="modal"></vc-modal>
  <view class="checkinCalendar">
    <view class="checkinCalendar-header">
      <view v-if="totalDays" class="checkinCalendar-header2"
        >已经连续签到
        <text class="checkinCalendar-header2-text">{{ totalDays }}</text>
        天</view
      >
      <view v-else class="checkinCalendar-header2"
        >今日未签到，快来签到领积分吧～</view
      >
    </view>
    <!-- <view v-if="todaySingFlag" class="checkinCalendar-header3"
      >明天继续点，积分蹭蹭涨! 别断签哦!</view
    > -->
    <view class="calendar-title">
      <view class="calendar-title-left" @click="prep()">
        <image
          class="calendar-title-left-img"
          :src="minioBaseUrl + 'common/memberCenter/member-left.png'"
          mode="scaleToFill"
        />
      </view>
      <view class="calendar-title-center">{{ month }}月</view>
      <view class="calendar-title-right" @click="next()">
        <image
          class="calendar-title-right-img"
          :src="minioBaseUrl + 'common/memberCenter/member-right.png'"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="calendar-week">
      <view
        class="calendar-week-item"
        v-for="(week, indexWeek) in weeks"
        :key="indexWeek"
      >
        <view
          class="calendar-week-item-container"
          v-if="show || week.currentWeek"
        >
          <view
            class="calendar-day-box"
            v-for="(day, indexDay) in week.days"
            :key="indexDay"
          >
            <view
              v-if="
                checkInDateList[day.value] &&
                checkInDateList[day.value].extraType == 'POINTS'
              "
              class="calendar-day-box-tip"
            >
              <view class="calendar-day-box-tip2">
                +{{ checkInDateList[day.value].extraPoint }}
              </view>
            </view>
            <view
              v-if="
                checkInDateList[day.value] &&
                checkInDateList[day.value].extraType == 'MAGNIFICATION'
              "
              class="calendar-day-box-tip"
            >
              <view class="calendar-day-box-tip2">
                <!-- x{{ Number(checkInDateList[day.value].extraPoint) + 1 }} -->
                积分翻倍
              </view>
            </view>
            <view class="calendar-day-date"> {{ day.date }}</view>
            <view
              class="calendar-day-item"
              :style="{
                background:
                  checkInDateList[day.value] &&
                  checkInDateList[day.value].signed
                    ? '#FCEDD3'
                    : day.date
                    ? '#E1E6EE'
                    : 'transparent',
              }"
            >
              <view class="sign-status" v-if="day.date">
                <up-icon
                  v-if="
                    checkInDateList[day.value] &&
                    checkInDateList[day.value].signed
                  "
                  name="checkmark-circle-fill"
                  size="36rpx"
                  color="#E4955A"
                ></up-icon>
                <image
                  v-else
                  class="sign-status-img"
                  :src="
                    minioBaseUrl + 'common/memberCenter/member-weiwancheng.png'
                  "
                  mode="scaleToFill"
                ></image>
              </view>

              <view
                class="calendar-day-item-point"
                v-if="day.date"
                :style="{
                  color:
                    checkInDateList[day.value] &&
                    checkInDateList[day.value].signed
                      ? '#E4955A'
                      : '#333',
                }"
                >+{{
                  checkInDateList[day.value]
                    ? checkInDateList[day.value].basePoint
                    : "0"
                }}</view
              >
            </view>
          </view>
        </view>
      </view>
      <view class="calendar-more-btn" @click="showMore()">
        <up-icon v-if="show" name="arrow-up"></up-icon>
        <up-icon v-else name="arrow-down"></up-icon>
      </view>
    </view>
    <view v-if="!todaySingFlag" class="calendar-footer" @click="signIn()"
      >立即签到</view
    >
    <view v-else class="calendar-footer-finish">今日已签到</view>
  </view>
</template>

<script>
import { getCheckInsList, checkIns } from "../api/index";

export default {
  data() {
    return {
      month: "",
      weeks: [],
      show: false,
      nowDate: "",
      checkInDateList: {},
      totalDays: 0,
      todaySingFlag: false,
      todaytotalpoint: 0,
      todayDate: "",
      currentMonthFlag: false,
      nowMonth: "",
    };
  },
  watch: {
    searchMonth: {
      handler(newVal, oldVal) {
        console.log("searchMonth", newVal);
        console.log("searchMonth", this.nowMonth);
        if (newVal.getTime() === this.nowMonth.getTime()) {
          this.currentMonthFlag = true;
        } else {
          this.currentMonthFlag = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    this.todayDate =
      "" +
      year +
      (month < 10 ? "0" + month : month) +
      (date < 10 ? "0" + date : date);

    this.searchMonth = nowDate;
    this.nowMonth = new Date(year, month - 1, 1);
    this.getSignInList();
    this.init(this.searchMonth);
  },
  methods: {
    init(searchMonth) {
      const year = searchMonth.getFullYear();
      const month = searchMonth.getMonth() + 1;
      const date = new Date().getDate();
      this.month = month;

      //   计算星期
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      const startDay = start.getDay();
      const endDay = end.getDay();
      const days = [];
      for (let i = 0; i < startDay; i++) {
        days.push({
          date: "",
        });
      }
      for (let i = 1; i <= end.getDate(); i++) {
        days.push({
          date: month + "." + i,
          isToday: i === date,
          value:
            year +
            "" +
            (month > 9 ? month : "0" + month) +
            "" +
            (i > 9 ? i : "0" + i),
        });
      }
      for (let i = 0; i < 6 - endDay; i++) {
        days.push({
          date: "",
        });
      }
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        const values = days.slice(i, i + 7);
        weeks.push({
          days: values,
          currentWeek: values.some((day) => day.isToday),
        });
      }
      console.log(weeks);
      this.weeks = weeks;
    },
    prep() {
      console.log("prep", this.searchMonth);
      let year = this.searchMonth.getFullYear();
      let month = this.searchMonth.getMonth() + 1;
      if (month === 1) {
        year--;
        month = 12;
      } else {
        month--;
      }
      const searchMonth = new Date(year, month - 1, 1);
      this.searchMonth = searchMonth;
      this.getSignInList();
      this.init(searchMonth);
    },
    next() {
      console.log("next", this.searchMonth);
      let year = this.searchMonth.getFullYear();
      let month = this.searchMonth.getMonth() + 1;
      console.log(
        month,
        year,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      );
      if (
        year > new Date().getFullYear() ||
        (year === new Date().getFullYear() &&
          month >= new Date().getMonth() + 1)
      ) {
        uni.showToast({
          title: "已是最新月份",
          icon: "none",
          duration: 1000,
        });
        this.searchMonth = new Date();
        return;
      }
      if (month === 12) {
        year++;
        month = 1;
      } else {
        month++;
      }
      const searchMonth = new Date(year, month - 1, 1);
      this.searchMonth = searchMonth;
      this.getSignInList();
      this.init(searchMonth);
    },
    showMore() {
      this.show = !this.show;
    },
    signIn() {
      // 判断今日是否签到
      console.log("signIn", this.checkInDateList);
      console.log("signIn", this.todayDate);
      if (this.todaySingFlag) {
        uni.showToast({
          title: "今日已签到",
          icon: "none",
          duration: 1000,
        });
        return;
      }
      let params = {
        type: "DAILY",
        // rewardValue: this.rewardValue,
        rewardRuleId: this.rewardRuleId,
        rewardType: this.rewardType,
      };
      if (this.rewardValue) params.rewardValue = this.rewardValue;
      if (this.magnification) params.magnification = this.magnification;

      checkIns(params).then((res) => {
        console.log("checkIns", res);
        this.todaySingFlag = true;
        this.totalDays = Number(this.totalDays) + 1;
        this.getSignInList();
        this.$emit("signInCallback", {
          continueFlag:
            this.extraPoint && this.extraPoint !== "0" ? true : false,
          score: this.todaytotalpoint,
        });
      });
    },
    getSignInList() {
      // const nowDate = new Date();
      const year = this.searchMonth.getFullYear();
      const month = this.searchMonth.getMonth() + 1;
      this.month = month;
      const checkInDate = "" + year + "" + (month > 9 ? month : "0" + month);
      getCheckInsList({ checkInDate: checkInDate }).then((res) => {
        console.log("getCheckInsList", res);
        if (res && res.length > 0) {
          let checkInDateList = {};
          res.forEach((item, index) => {
            let key = item.date.replace(/-/g, "");
            if (this.todayDate === key) {
              this.todaySingFlag = item.checked;
              this.todaytotalpoint = item.rewardValue;
              this.rewardValue = item.rewardValue;
              this.magnification = item.magnification;
              this.rewardRuleId = item.rewardRuleId;
              this.rewardType = item.rewardType;
              this.extraPoint = item.extraPoint;

              if (item.checked) {
                this.totalDays = item.continuous;
              } else {
                if (index > 0) {
                  this.totalDays = res[index - 1].continuous;
                } else {
                  this.totalDays = 0;
                }
              }
            }
            checkInDateList[key] = {
              basePoint: item.basePoint,
              extraPoint: item.extraPoint,
              extraType: item.rewardType,
              signed: item.checked,
              date: key,
            };
          });
          // this.checkInDateList = res.calendar;
          // this.totalDays = res.totalDays;
          this.$nextTick(() => {
            this.checkInDateList = checkInDateList;
            console.log(this.weeks);
            console.log(this.checkInDateList);
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.checkinCalendar {
  width: 700rpx;
  margin: auto;
  border-radius: 14rpx;
  background: #ffffff;
  overflow: hidden;

  .checkinCalendar-header {
    // padding: 0 40rpx 20rpx;
    // font-weight: bold;
    // font-size: 28rpx;
    // color: #333333;
    // line-height: 40rpx;
    width: 100%;
    height: 90rpx;
    background: #25231d;
    color: #fbe5cb;
    box-sizing: border-box;
    padding: 14rpx 30rpx;
    display: flex;
    align-items: center;
  }
  .checkinCalendar-header2 {
    // padding: 0 40rpx 20rpx;
    font-weight: bold;
    font-size: 34rpx;
    color: #fbe5cb;
    line-height: 40rpx;
    vertical-align: bottom;
    .checkinCalendar-header2-text {
      font-size: 44rpx;
      // color: #E4955A;
      line-height: 40rpx;
    }
  }
  .checkinCalendar-header3 {
    padding: 0 40rpx 20rpx;
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
  }

  .calendar-title {
    width: 100%;
    box-sizing: border-box;
    padding: 0 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;

    .calendar-title-right {
      width: 34rpx;
      height: 34rpx;

      .calendar-title-right-img {
        width: 34rpx;
        height: 34rpx;
      }
    }

    .calendar-title-left {
      width: 34rpx;
      height: 34rpx;

      .calendar-title-left-img {
        width: 34rpx;
        height: 34rpx;
      }
    }

    .calendar-title-center {
      width: 400rpx;
      text-align: center;
      font-weight: 600;
      font-size: 36rpx;
      color: #222222;
      line-height: 50rpx;
    }
  }

  .calendar-week {
    width: 100%;

    .calendar-week-item {
      width: 100%;

      .calendar-week-item-container {
        width: 100%;
        padding: 14rpx 20rpx 14rpx 20rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .calendar-day-box {
          width: 94rpx;
          display: flex;
          flex-direction: column;
          align-items: center;

          .calendar-day-box-tip {
            width: 94rpx;
            height: 36rpx;
            position: relative;
            top: -10rpx;
          }

          .calendar-day-box-tip2 {
            background: linear-gradient(270deg, #f3c793 0%, #e4955a 100%),
              #6d707c;
            border-radius: 20rpx;
            width: 106rpx;
            height: 36rpx;
            font-weight: 600;
            font-size: 20rpx;
            text-align: center;
            color: #ffffff;
            line-height: 36rpx;
            position: absolute;
            top: 0rpx;
            left: -6rpx;
          }
          .calendar-day-box-tip2::after {
            content: "";
            position: absolute;
            bottom: -8rpx;
            left: 40%;
            border-top: 10rpx solid #ebad75;
            border-right: 10rpx solid transparent;
            border-left: 10rpx solid transparent;
          }
          .calendar-day-date {
            font-weight: 600;
            font-size: 20rpx;
            color: #595e65;
            line-height: 28rpx;
          }
          .calendar-day-item {
            width: 74rpx;
            height: 100rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 12rpx 0 10rpx 0;
            background: #e1e6ee;
            border-radius: 10rpx;

            .calendar-day-item-point {
              font-size: 28rpx;
              line-height: 40rpx;
              height: 40rpx;
            }

            .sign-status {
              width: 100%;
              // height: 36rpx;
              text-align: center;
              display: flex;
              justify-content: center;

              .sign-status-img {
                width: 36rpx;
                height: 36rpx;
              }
            }
          }
        }
      }
    }

    .calendar-more-btn {
      width: 100%;
      height: 40rpx;
      display: flex;
      justify-content: center;
      font-size: 28rpx;
      line-height: 40rpx;
    }
  }

  .calendar-footer {
    width: 672rpx;
    height: 80rpx;
    background: #ffd9ad;
    border-radius: 40rpx;
    margin: 32rpx auto;
    text-align: center;
    font-weight: 500;
    font-size: 28rpx;
    color: #7e522d;
    line-height: 80rpx;
  }
  .calendar-footer-finish {
    width: 672rpx;
    height: 80rpx;
    background: #ffd9ad;
    border-radius: 40rpx;
    margin: 32rpx auto;
    text-align: center;
    font-weight: 500;
    font-size: 28rpx;
    color: #7e522d;
    line-height: 80rpx;
    opacity: 0.6;
  }
}
</style>