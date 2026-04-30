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
      class="page-content"
      :style="
        'height: calc(100vh - ' +
        (navigationBarInfo.statusBarHeight +
          navigationBarInfo.navigationBarHeight) +
        'px);overflow: auto;'
      "
    >
      <view
        class="page-content-header"
        :style="{
          background:
            'url(' +
            minioBaseUrl +
            'common/memberCenter/member-header-bg.png) no-repeat 0 0 / 750rpx 830rpx',
        }"
      >
        <!-- <view
          style="position: absolute; z-index: 5; width: 100%"
          :style="{
            top:
              navigationBarInfo.statusBarHeight +
              navigationBarInfo.navigationBarHeight +
              'px',
          }"
        > -->
        <!-- 头部 -->
        <view class="upgrade-wrap">
          <view class="upgrade-title">
            <text class="upgrade">{{ upgrade }}</text>
            <view class="date-box" @click="showInfo">
              <text class="date">{{ limitDate }}到期</text>
              <up-icon
                name="info-circle"
                color="#FFD9AD"
                size="20rpx"
              ></up-icon>
            </view>
            <view class="points-box" @click="goPoints">
              <text class="points">{{ points }}</text
              >积分
              <up-icon
                name="arrow-right"
                color="#FFD9AD"
                size="25rpx"
              ></up-icon>
            </view>
          </view>
          <view class="question_box" @click="goQuestion">
            <up-icon
              name="question-circle-fill"
              color="#FFD9AD"
              size="28rpx"
            ></up-icon>
            <text class="question-text">常见问题</text>
          </view>
        </view>
      </view>
      <!-- 升级提醒 -->
      <view class="reminder-wrap">
        <text class="title">升级提醒</text>
        <view
          :style="{
            background: `url(${minioBaseUrl}common/memberCenter/upgrade-bg.png) no-repeat 0 0/100% 100%`,
          }"
          class="reminder-box"
        >
          <view class="now-upgrade">
            <!-- <image
                            :src="staticBaseUrl+'/minio/common/upgrade/xxhy.png'"
                            mode="widthFix"
                            class="now-upgrade-img"
                        /> -->
            <image :src="currentUrl" mode="widthFix" class="now-upgrade-img" />
            <up-text
              :color="currentTxtColor"
              size="30rpx"
              bold
              :lines="1"
              :text="upgrade"
              style="justify-content: center"
            ></up-text>
            <!-- <image
                            :src="staticBaseUrl+'/minio/common/upgrade/xxhy-title.png'"
                            mode="widthFix"
                            class="now-upgrade-title"
                        /> -->
          </view>
          <view class="sj">
            <view class="sj-box">
              <image
                :src="minioBaseUrl + 'common/memberCenter/sj.png'"
                mode="widthFix"
                class="sjimg"
              />
              <text class="sj-text" v-if="nextUrl"
                >距离升级还需{{ growthDifference }}积分</text
              >
              <text class="sj-text" v-else>当前等级最高级</text>
            </view>
          </view>
          <view class="next-upgrade" v-if="nextUrl">
            <!-- <image
                            :src="staticBaseUrl+'/minio/common/upgrade/qthy.png'"
                            mode="widthFix"
                            class="next-upgrade-img"
                        /> -->
            <image :src="nextUrl" mode="widthFix" class="next-upgrade-img" />
            <up-text
              :color="nextTxtColor"
              size="30rpx"
              bold
              :lines="1"
              :text="nextTxt"
              style="justify-content: center"
            ></up-text>
            <!-- <text :style="{color:nextTxtColor,fontSize:'30rpx',fontWeight:'bold'}">{{nextTxt}}</text> -->
            <!-- <image
                            :src="staticBaseUrl+'/minio/common/upgrade/qthy-title.png'"
                            mode="widthFix"
                            class="next-upgrade-title"
                        /> -->
          </view>
        </view>
      </view>
      <!-- 如何获取等级分 -->
      <image
        :src="`${minioBaseUrl}common/memberCenter/memberRules.png?v=${new Date().getTime()}`"
        mode="widthFix"
        style="width: 100%"
      />
      <!-- </view> -->
    </view>
  </view>

  <!-- </vc-container> -->
</template>

<script>
import { upgradeData } from "../api/upgrade";
import { mapState } from "pinia";
import { useBaseStore, useUserStore } from "@/store/index";
import { title } from "process";
export default {
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: "",
          },
        },
      },
      upgrade: "--", //会员等级
      limitDate: "--", //到期日期
      points: "--", //积分
      growthDifference: "--", //所差积分
      currentUrl: "", //当前会员图标
      nextUrl: "", //下一个会员图标
      nextTxt: "--", //下一个会员等级文字
      nextTxtColor: "", //下一个会员等级文字颜色
      currentTxtColor: "", //当前会员等级文字颜色
    };
  },
  computed: {
    ...mapState(useBaseStore, {
      navigationBarInfo: "navigationBarInfo",
    }),
  },
  mounted() {
    this.getUpgradeData();
  },
  methods: {
    async getUpgradeData() {
      const res = await upgradeData({});
      console.log(res);
      this.upgrade = res.vipLevelCurrent.levelName;
      this.limitDate = this.formatActivDate(res.vipUserMapping.expiredTime);
      this.points = res.pointsUser.totalPoints;
      this.growthDifference = res.growthDifference;
      this.currentUrl =
        this.staticBaseUrl + "/minio/" + res.vipLevelCurrent.vipIconUrl;
      this.currentTxtColor = res.vipLevelCurrent.fontColor1;
      this.nextTxt = res.vipLevelgoal.levelName;
      this.nextTxtColor = res.vipLevelgoal.fontColor1;
      this.nextUrl = this.staticBaseUrl + "/minio/" + res.vipLevelgoal.vipIconUrl;
      console.log(this.staticBaseUrl + "/minio/" + res.vipLevelgoal.vipIconUrl);
    },
    //日期格式化
    formatActivDate(str) {
      if (str == null || str == "") {
        return "";
      }
      let date = str.replace(/[-: ]/g, "");

      // 提取各个部分
      let year = date.substring(0, 4);
      let month = date.substring(4, 6);
      let day = date.substring(6, 8);
      console.log(`${year}-${month}-${day}`);
      let data = `${year}-${month}-${day}`;
      // 返回格式化的日期字符串
      return data;
    },
    //跳转常见问题
    goQuestion() {
      this.bridgeSdk.jumpPage({
        url: `/package-member-center/common-problem/common-problem`,
      });
    },
    //跳转积分页面
    goPoints() {
      this.bridgeSdk.jumpPage({
        url: `/package-member-center/memberPointDetail/memberPointDetail`,
      });
    },
    showInfo() {
      let content =
        "当前会员等级将于" +
        this.limitDate +
        "到期，届时将根据您的积分重新评定";
      this.$refs.modal.open({
        title: this.upgrade,
        content: content,
        showCancel: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.upgrade-wrap {
  // padding: 30rpx 25rpx 84rpx 67rpx;
  padding: 15rpx 25rpx 84rpx 67rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .upgrade {
    font-weight: bold;
    font-size: 27rpx;
    color: #ffd9ad;
  }
  .date-box {
    display: flex;
    align-items: baseline;
    .date {
      font-weight: 300;
      font-size: 20rpx;
      color: #ffd9ad;
      margin-right: 14rpx;
    }
  }
  .points-box {
    display: flex;
    align-items: baseline;
    font-weight: 600;
    font-size: 28rpx;
    color: #ffd9ad;
    position: relative;
    z-index: 99;
    .points {
      font-weight: bold;
      font-size: 70rpx;
      color: #ffd9ad;
    }
  }
  .question_box {
    display: flex;
    align-items: baseline;
    .question-text {
      font-weight: bold;
      font-size: 27rpx;
      color: #ffd9ad;
      margin-left: 6rpx;
    }
  }
}
.reminder-wrap {
  padding: 27rpx 25rpx;
  box-sizing: border-box;
  background: #f5f7fb;
  border-radius: 41rpx 41rpx 0 0;
  margin-top: -71rpx;
  .title {
    font-weight: bold;
    font-size: 32rpx;
    color: #333333;
    margin-left: 26rpx;
  }
  .reminder-box {
    margin-top: 14rpx;
    height: 307rpx;
    // padding:0 29rpx 27rpx 70rpx;
    // display: flex;
    // align-items: flex-end;
    // justify-content: space-between;
    position: relative;
    .now-upgrade {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      left: 41rpx;
      bottom: 32rpx;
      width: 239rpx;
      .now-upgrade-img {
        width: 239rpx;
        margin-bottom: -40rpx;
        // position: absolute;
        // left: 71rpx;
        // bottom: 72rpx;
      }
      // .now-upgrade-title{
      // width: 120rpx;
      // margin-top: -24rpx;
      // position: absolute;
      // bottom: 27rpx;
      // }
    }
    .sj {
      // padding-bottom: 11rpx;
      position: absolute;
      //left: 280rpx;
      left: 50%;
      transform: translateX(-50%);
      bottom: 38rpx;
      .sj-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .sjimg {
          width: 63rpx;
          margin-bottom: 9rpx;
        }
        .sj-text {
          font-size: 20rpx;
          color: #ffd9ad;
        }
      }
    }
    .next-upgrade {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      right: 15rpx;
      bottom: 32rpx;
      width: 305rpx;
      .next-upgrade-img {
        width: 305rpx;
        margin-bottom: -45rpx;
      }
      // .next-upgrade-title{
      //     width: 120rpx;
      // margin-top: -24rpx;
      // }
    }
  }
}
</style>