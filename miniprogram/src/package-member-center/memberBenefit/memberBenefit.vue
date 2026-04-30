<!-- 会员权益 -->
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
          >会员权益</view
        >
      </view>
    </view>
    <view
      v-if="benefitList&&benefitList.length"
      class="member-benefit-container"
      :style="
        'height: calc(100vh - ' +
        (navigationBarInfo.statusBarHeight +
          navigationBarInfo.navigationBarHeight) +
        'px);overflow-y: scroll;'
      "
    >
      <view
        class="member-benefit-header"
        :style="{
          background:
            'url(' +
            minioBaseUrl +
            'common/memberCenter/member-header-bg.png) no-repeat 0 0 / 750rpx 830rpx',
        }"
      >
        <view class="member-benefit-header-title" @click="jumpHasPage">
          已领取权益<up-icon
            name="arrow-right"
            color="#ffd9ad"
            size="28rpx"
          ></up-icon>
        </view>
        <scroll-view
          class="member-benefit-header-box"
          scroll-x
          :scroll-into-view="scrollIntoViewId"
          :enable-flex="true"
          v-if="benefitList.length"
        >
          <!-- <view class="member-benefit-header-box"> -->
          <view
            class="member-benefit-header-item-box"
            v-for="(item, index) in benefitList"
            :key="item.id"
            :id="'benefit-' + item.id"
          >
            <benefit-tab-item :info="item" @changeActive="changeActive" :actived="actived" :index="index"></benefit-tab-item>
          </view>
          <!-- </view> -->
        </scroll-view>
      </view>
      <view class="member-benefit-content">
        <member-title
          :big-text="benefitList[actived].privilegeName"
          small-text="每月1日零点更新"
          style="width: 100%"
        ></member-title>
        <view
          class="member-benefit-content-item"
          v-for="item in goodsList"
          :key="item.id"
        >
          <benefit-card-item
            :info="item"
            @showInfo="showModalInfo"
            @handleClick="getBenefit"
          ></benefit-card-item>
        </view>
        <view class="member-benefit-content-rules-title" v-if="benefitRules"
          >权益规则</view
        >
        <view class="member-benefit-content-rules" v-if="benefitRules">
          <rich-text
            :nodes="bridgeSdk.addMinioPrefixToImgSrc(benefitRules)"
          ></rich-text>
        </view>
      </view>
    </view>
    <view v-else-if="requestSuccess" class="no-data-container">
      <image
        class="no-data-container-img"
        :src="staticBaseUrl + '/hbdimage/baseImage/icon-noDy.png'"
        mode="scaleToFill"
      />
      <view class="no-data-container-text">当前会员等级暂无权益</view>
      <view class="no-data-container-text">请升级会员等级领取权益</view>
    </view>
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";

import benefitCardItem from "../components/benefitCardItem.vue";
import benefitTabItem from "../components/benefitTabItem.vue";
import memberTitle from "../components/memberTitle.vue";

import {
  aPPgetUserMemberPrivilegesDetails,
  receivePrivileges,
} from "../api/index";
export default {
  name: "MemberBenefit",
  components: {
    memberTitle,
    benefitCardItem,
    benefitTabItem
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
      actived: -1,
      benefitList: [],
      goodsList: [],
      benefitRules: "",
      scrollIntoViewId: "",
      // activedId: "",
      requestSuccess: false,
    };
  },
  onLoad(options) {
    console.log("onLoad", options);
    this.activedId = options.activedId;
    console.log("this.activedId", this.activedId);
    this.aPPgetUserMemberPrivilegesDetails();
  },
  methods: {
    aPPgetUserMemberPrivilegesDetails() {
      this.requestSuccess = false
      this.benefitRules = "";
      aPPgetUserMemberPrivilegesDetails({}).then((res) => {
        console.log("aPPgetUserMemberPrivilegesDetails", res);
        if (res && res.length > 0) {
          let indexVal = res.findIndex((item) => item.id == this.activedId);
          if (indexVal > -1) {
            this.actived = indexVal;
          } else {
            this.actived = 0;
          }
          this.benefitList = res;

          console.log("this.scrollIntoViewId", this.scrollIntoViewId);
          this.goodsList = this.benefitList[this.actived].vipPrivilegesDetails;
          if(this.benefitList[this.actived].equityRules){
            this.benefitRules = "<div style='text-align:left;font-size:14px;color:#333333;line-height:20px;word-wrap: break-word;word-break: break-all;'>" + this.benefitList[this.actived].equityRules + "</div>";
          }
          // this.benefitList[this.actived].equityRules;
          this.$nextTick(() => {
            this.scrollIntoViewId = "benefit-" + this.benefitList[this.actived].id;
          });
        }else{
          this.requestSuccess = true
        }
      });
    },
    jumpHasPage() {
      uni.navigateTo({
        url: "/package-member-center/memberHasBenefit/memberHasBenefit",
      });
    },
    changeActive(index) {
      if(this.actived == index)return
      this.actived = index;
      this.activedId = this.benefitList[index].id;
      this.goodsList = this.benefitList[index].vipPrivilegesDetails;
      if(this.benefitList[index].equityRules){
       this.benefitRules = "<div style='text-align:left;font-size:14px;color:#333333;line-height:20px;word-wrap: break-word;word-break: break-all;'>" + this.benefitList[index].equityRules + "</div>";
      }else{
        this.benefitRules = "";
      }
      // this.benefitList[index].equityRules;
    },
    showModalInfo(info) {
      console.log("showModalInfo", info);
      this.$refs.modal.open({
        title: info.title,
        htmlString: info.description,
        confirmText: "确认",
        showCancel: false,
      });
    },
    getBenefit(info) {
      let goodsList = [].concat(this.goodsList);
      receivePrivileges({
        vipPrivilegesDetailsId: info.vipPrivilegesDetailsId,
        vipPrivilegesId: info.vipPrivilegesId,
      },{catchError: true}).then((res) => {
        console.log("receivePrivileges", res);
        this.$refs.modal.open({
          title: "领取成功",
          htmlString: "领取权益成功",
          confirmText: "确认",
          showCancel: false,
          confirmCallback: () => {
            let index = goodsList.findIndex((item) => item.vipPrivilegesDetailsId == info.vipPrivilegesDetailsId);
            if (index > -1) {
              let im = goodsList[index];
              im.isGet = "1";
              goodsList.splice(index, 1, im);
              this.benefitList[this.actived].vipPrivilegesDetails = goodsList;
              this.$nextTick(() => {
                this.goodsList = goodsList
                this.$forceUpdate();
              })
            }
          }
        })
        // uni.showToast({
        //   title: "领取成功",
        //   icon: "none",
        //   duration: 2000,
        // });
            
      }).catch((err) => {
        if(err.code == "0055"){
          uni.showToast({
            title: "领取失败，您已领取过该权益",
            icon: "none",
            duration: 2000,
          })
          this.aPPgetUserMemberPrivilegesDetails()
        }
        else{
          uni.showToast({
            title: err.message,
            icon: "none",
            duration: 2000,
          })
        }
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
  .member-benefit-container{
    box-sizing: border-box;
    padding-bottom: 40rpx;
  }
  .member-benefit-header {
    width: 100%;
    background: #000;
    color: #ffd9ad;
    font-size: 28rpx;
    padding: 20rpx 34rpx 60rpx 68rpx;
    box-sizing: border-box;

    .member-benefit-header-title {
      font-weight: bold;
      font-size: 28rpx;
      color: #ffd9ad;
      line-height: 40rpx;
      margin-bottom: 22rpx;
      display: flex;
      align-items: center;
    }

    .member-benefit-header-box {
      width: 100%;
      // height: 146rpx;
      padding-top: 24rpx;
      display: flex;
      align-items: flex-start;
      // flex-wrap: nowrap;
      // justify-content: flex-start;
      // overflow-x: scroll;
      white-space: nowrap;

      .member-benefit-header-item-box {
        width: 160rpx;
        flex-shrink: 0;
        display: inline-block;
      }
      
    }
  }

  .member-benefit-content {
    width: 100%;
    border-radius: 40rpx 40rpx 0 0;
    background: #f5f5f5;
    padding-top: 36rpx;
    margin-top: -40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .member-benefit-content-item {
      width: 100%;
      box-sizing: border-box;
      padding: 0 40rpx;
      margin-top: 24rpx;
    }

    .member-benefit-content-rules-title {
      width: 100%;
      padding: 48rpx 40rpx 14rpx;
      box-sizing: border-box;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
    }

    .member-benefit-content-rules {
      width: 670rpx;
      background: #dce2ed8f;
      border-radius: 24rpx;
      padding: 20rpx;
    }
  }
  .no-data-container{
    width: 100%;
    padding: 280rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    .no-data-container-img{
      width: 260rpx;
      height: 250rpx;
      margin-bottom: 20rpx;
    }
    .no-data-container-text{
      font-size: 28rpx;
      color: #999999;
    }
  }
}
</style>