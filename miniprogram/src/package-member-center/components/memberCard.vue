<template>
  <view
    class="member-card"
    :style="
      'background: url(' +
      minioBaseUrl +
      info.exhibitionUrl +
      ') no-repeat center center / cover;'
    "
  >
    <view class="member-card-main" :style="'color: ' + info.fontColor2 + ';'">
      <view class="member-card-main-container">
        <!-- <view class="member-card-title">
          <image
            class="member-card-title-icon"
            :src="minioBaseUrl + info.backclothUrl"
            mode="scaleToFill"
          />
        </view> -->
        <view
          class="member-card-expiredTime"
          @click="showInfo"
          v-if="memberIndex == currentMemberIndex"
        >
          {{ formatTime(info.expiredTime) }}到期
          <up-icon
            name="info-circle"
            :color="info.fontColor2"
            size="20rpx"
            style="padding-left: 10rpx"
          ></up-icon>
        </view>
        <view
          class="member-card-expiredTime"
          v-else-if="memberIndex < currentMemberIndex"
        >
          当前已高于该等级
        </view>
        <view class="member-card-expiredTime-block" v-else></view>
        <view class="member-card-level-point" @click="jumpPage">
          {{ info.totalPoints }}积分
          <up-icon
            name="arrow-right"
            :color="info.fontColor2"
            size="24rpx"
            style="margin-left: 10rpx"
          ></up-icon>
        </view>
        <view class="member-card-progress-box">
          <view class="member-card-progress-left">
            <view class="member-card-progress-line">
              <view
                v-if="memberIndex < currentMemberIndex"
                :style="
                  'width: 100%;height: 10rpx;  background: ' +
                  themeBG +
                  ' border-radius: 5px;'
                "
              >
              </view>
              <view
                v-else
                :style="
                  'width: ' +
                  (info.totalPoints / info.growthMax) * 100 +
                  '%;height: 10rpx;  background: ' +
                  themeBG +
                  ' border-radius: 5px;'
                "
              ></view>
            </view>
            <view
              class="member-card-progress-title"
              v-if="memberIndex >= currentMemberIndex"
            >
              {{ info.totalPoints + "/" + info.growthMax
              }}<text
                v-if="
                  memberIndex >= currentMemberIndex&&
                  info.totalPoints < info.growthMax
                "
                >还差{{ info.growthMax - info.totalPoints }}积分可{{currentMemberIndex < allLevel - 1 ? "升级": "满级"}}</text
              >
            </view>
            <view v-else class="member-card-progress-title-block"></view>
            
          </view>
          <view
            v-if=" memberIndex == currentMemberIndex && currentMemberIndex < allLevel - 1"
            class="member-card-progress-right"
            @click="goUp"
          >
            去升级
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "memberCard",
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    memberIndex: {
      type: Number,
      default: 0,
    },
    currentMemberIndex: {
      type: Number,
      default: 0,
    },
    allLevel: {
      type: Number,
      default: 0,
    }
  },
  watch: {
    info: {
      handler(newVal, oldVal) {},
      deep: true,
    },
  },
  mounted() {
    let isCurrent = this.currentMemberIndex == this.memberIndex;
  },
  data() {
    return {
      progress: 0,
    };
  },
  computed: {
    themeBG() {
      return (
        "linear-gradient(to right, " +
        this.info.fontColor1 +
        " 0%, " +
        this.info.fontColor2 +
        " 100%);"
      );
    },
  },
  methods: {
    showInfo() {
      if (this.info.isUserVip == "1") {
        let info = {};
        info.title = this.info.levelName;
        info.content =
          "当前会员等级将于" +
          this.formatTime(this.info.expiredTime) +
          "到期，届时将根据您的积分重新评定";
        this.$emit("showInfo", info);
      }
    },
    jumpPage() {
      uni.navigateTo({
        url: "/package-member-center/memberPointDetail/memberPointDetail",
      });
    },
    formatTime(time) {
      if (time) {
        return (
          time.substring(0, 4) +
          "-" +
          time.substring(4, 6) +
          "-" +
          time.substring(6, 8)
        );
      }
    },
    goUp() {
      uni.navigateTo({
        url: "/package-member-center/upgrade/upgrade",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.member-card {
  width: 750rpx;
  height: 300rpx;

  // background-color: #fff;
  // border-radius: 20rpx;
  box-sizing: border-box;
  padding: 96rpx 90rpx 66rpx 84rpx;

  .member-card-main {
    width: 100%;
    // width: 674rpx;
    // height: 324rpx;
    // height: 290rpx;
    // height: 328rpx;
    // background-size: cover;
    // background-position: center;

    .member-card-main-container {
      // padding: 60rpx 70rpx 30rpx 40rpx;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .member-card-title {
      .member-card-title-icon {
        width: 160rpx;
        height: 40rpx;
      }
    }

    .member-card-expiredTime-block {
      margin-top: 16rpx;
      width: 100rpx;
      height: 20rpx;
    }

    .member-card-expiredTime {
      font-weight: bold;
      font-size: 20rpx;
      line-height: 20rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-top: 32rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .member-card-expiredTime-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 18rpx;
        height: 18rox;
        border-radius: 20rpx;
        border: 1px solid;
        margin-left: 4rpx;

        .member-card-expiredTime-icon-top {
          width: 2rpx;
          height: 2rpx;
        }

        .member-card-expiredTime-icon-bottom {
          width: 2rpx;
          height: 10rpx;
        }
      }
    }

    .member-card-level-point {
      font-weight: 500;
      font-size: 24rpx;
      line-height: 24rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-top: 32rpx;
      display: flex;
      align-items: center;
    }

    .member-card-progress-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18rpx;

      .member-card-progress-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .member-card-progress-title {
          font-weight: 500;
          font-size: 18rpx;
          line-height: 20rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 8rpx;
          margin-top: 12rpx;
        }
        .member-card-progress-title-block {
          height: 20rpx;
          width: 100%;
          margin-bottom: 8rpx;
        }

        .member-card-progress-line {
          width: 400rpx;
          height: 10rpx;
          border-radius: 10rpx;
          transition: width 0.3s ease-in-out;
          background: rgba(255, 255, 255, 0.4);
          overflow: hidden;
        }
      }

      .member-card-progress-right {
        width: 130rpx;
        height: 50rpx;
        border-radius: 50rpx;
        border: 2px solid;
        font-weight: 500;
        font-size: 24rpx;
        text-align: center;
        line-height: 50rpx;
        position: relative;
        top: -10rpx;
      }
    }
  }
}
</style>
