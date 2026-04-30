<!--
 * @Description: 我的
 * @Author: chenyulong
 * @Date: 2024-09-24 13:09:23
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-30 10:55:01
 * @Remark: 
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <view class="main">
    <!--  背景  -->
    <view class="top-bg"></view>
     <!-- <image
     class="top-bg"
      :src="minioBaseUrl + 'common/tabbarImages/mine_bg_img.png'"
      mode="scaleToFill"
     /> -->
    <vc-header-logo></vc-header-logo>
    <!--未登录-->
    <view class="login-box">
      <view v-if="!isLogined" class="no-login" @click="bridgeSdk.toLogin">
        <image class="headImg" style="width: 150rpx; height: 150rpx" :src="minioBaseUrl + noHeadPng" mode="aspectFit" />
        <view class="login-info-box">
          <text class="tit">未登录</text>
          <text class="content">欢迎登录衣回收，点击登录</text>
        </view>
      </view>
      <view v-else class="login-container">
        <view class="user-icon">
          <image class="user-icon-img" v-if="userInfo.head" :src="`${minioBaseUrl}${userInfo.head}`"></image>
          <image class="user-icon-img" v-else :src="minioBaseUrl + '/common/tabbarImages/huiyuanma_weixintouxiang_default_img.png'"
            mode="widthFix"></image>
        </view>
        <view class="login-container-info">
          <view class="login-container-info-name" v-if="userInfo.isRealname == '1' && userInfo.desUserName">{{
            userInfo.desUserName }}</view>
          <view class="login-container-info-name" v-else-if="nickName">{{
            nickName
          }}</view>
          <view class="login-container-info-level"  @click="checkIdentityAuth(userInfo.isRealname == '1')">
             <image class="level-icon" :src="minioBaseUrl + memberInfo.backclothUrl" mode="scaleToFill" />
            <!-- 实名 -->
           <view class="real_box">
             <image v-if="userInfo.isRealname == '1'" class="real_name_icon" :src="minioBaseUrl + 'common/tabbarImages/is_real_name.png'" mode="scaleToFill" />
            <image v-else class="real_name_icon" :src="minioBaseUrl + 'common/tabbarImages/no_real_name.png'" mode="scaleToFill" />
          
            {{ userInfo.isRealname == "1" ? "已实名认证" : "未实名认证" }}
           </view>
          </view>
        </view>
      </view>
    </view>


    <view class="point_card">
      <view class="point_card_item">
        <view class="point_card_content">
          <text class="point_card_num">{{ fbfNumber }}</text>
          <text class="point_card_title">会员积分</text>
        </view>
      </view>
      <view class="gray_line"></view>
      <view class="point_card_item" @click="jumpKQPage">
        <view class="point_card_content">
          <text class="point_card_num">{{ kqNumber }}</text>
          <text class="point_card_title">我的卡券</text>
        </view>
      </view>
      <view class="gray_line"></view>
      <view class="point_card_item">
        <view class="point_card_content">
          <text class="point_card_num">{{ pointBalance }}</text>
          <text class="point_card_title">钱包余额（元）</text>
        </view>
      </view>
    </view>

    <!-- 去充值 -->
    <view class="toRechargeBox" v-if="isLogined">
      <image class="toRechargeImg" :src="minioBaseUrl + '/common/tabbarImages/mine_title_font_img.png'" mode="heightFix" />
      <!-- <image class="toRechargeTitleImg" :src="minioBaseUrl + '/common/tabbarImages/mine_font_dangqianyue_img.png'" mode="scaleToFill" /> -->
      <!-- <text class="toRechargeTitle">当前余额：</text> -->
      <!-- <text class="toRechargeText">{{ pointBalance }}元</text> -->
      <view class="toRechargeBtn" @click="toRecharge">
        <text class="toRechargeBtnText">去充值</text>
        <u-icon name="arrow-right" size="24rpx" color="#fff" class="arrow-right"></u-icon>
      </view>
    </view>

    <view class="member-box" v-if="isLogined" @click="jumpFBPage">
      <view class="current-title" >当前等级</view>
      <member-card class="member-card" :info="memberInfo"></member-card>
    </view>
    <view class="my-order">
      <view class="my-order-title">
        <image class="my-order-title-icon" :src="minioBaseUrl + '/common/tabbarImages/mine_titlefont_wodedingdan_img.png'"
          mode="scaleToFill" />
      </view>
      <view class="my-order-content">
        <view class="my-order-item" @click="jumpToMyOrder">
          <image class="my-order-icon" :src="minioBaseUrl + '/common/tabbarImages/icon_wodedingdan_img.png'"
            mode="scaleToFill" />
          <view class="my-order-name">我的订单</view>
        </view>
        <view class="gray_line"></view>
        <view class="my-order-item" @click="jumppointMall">
          <image class="my-order-icon" :src="minioBaseUrl + '/common/tabbarImages/icon_jifenshangcheng_img.png'"
            mode="scaleToFill" />
          <view class="my-order-name">在线商城</view>
        </view>
      </view>
    </view>

    <view class="more-service">
      <view class="more-service-title">
        <image class="more-service-title-icon" :src="minioBaseUrl + '/common/tabbarImages/mine_titlefont_gengduoyingyong_img.png'"
          mode="scaleToFill" />
      </view>
      <view class="more-service-content">
        <view v-for="(item, index) in serviceList" :key="index" class="more-service-item" @click="toPage(item)">
          <image class="more-service-icon" :src="minioBaseUrl + item.img" mode="scaleToFill"></image>
          <text class="more-service-name">{{ item.title }}</text>
        </view>
      </view>
    </view>
        <vc-safe-bottom />
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useBaseStore, useUserStore } from "@/store/index";
import {
  getUserFubaoPointsAndMemberLevel,
  getGlobalCode,
  getCouponListSec
} from "@/api/mine";
import {
  getBalanceAndScore
} from "@/api/memberCode"
import vcHeaderLogo from "@/components/library/base/vc-header-logo/index.vue";
import memberCard from "@/pages/mine/memberCard.vue"
export default {
  name: "mine",
  components: {
    memberCard,
    vcHeaderLogo
  },
  data() {
    return {
      nickName: "",

      noHeadPng: "common/tabbarImages/huiyuanma_weixintouxiang_default_img.png",
      messageList: [
        // #ifdef H5
        {
          title: "我的证照",
          img: "/hbdimage/main/images/home/kaquan.png",
          needLogin: true,
          isBuilding: true,
        },
        // #endif
        {
          title: "我的卡券",
          url: "/package-cards-platform/card/cardList",
          needLogin: true,
          img: "/hbdimage/main/images/home/quanbao.png",
        },
        // #ifdef H5
        {
          title: "我的订单",
          img: "/hbdimage/main/images/home/dingdan.png",
          needLogin: true,
          url: "/package-product-list/shopList/shopList?needLogin=true",
          // isBuilding: true,
        },
        {
          title: "我的收藏",
          img: "/hbdimage/examination/shoucang.png",
          needLogin: true,
          url: "/package-testHelper/collect/index",
          // isBuilding: true,
        },
        // #endif
      ],
      serviceList: [
        // // #ifdef H5
        // {
        //   title: "我是商户",
        //   img: "/hbdimage/main/images/home/我是商户.png",
        //   url: "/package-product-list/transit/transit",
        //   needLogin: true,
        // },
        // // #endif
        // // #ifdef H5
        // {
        //   title: "收货地址",
        //   img: "/hbdimage/main/images/home/收货地址.png",
        //   url: "/package-address/pages/addressList",
        //   needLogin: true,
        //   // isBuilding: true,
        // },
        // // #endif
        // {
        //   title: "推荐",
        //   img: "/hbdimage/main/images/home/推荐惠保定.png",
        //   url: "/package-recommend-hbd/recommendHbd/recommendHbd",
        // },
        {
          title: "我是商户",
          img: "/common/tabbarImages/icon_woshishanghu_img.png",
          url: "/package-product-list/transit/transit",
          needLogin: true,
        },
        {
          title: "收货地址",
          img: "/common/tabbarImages/icon_shouhuodizhi_img.png",
          url: "/package-address/pages/addressList",
          needLogin: true,
          // isBuilding: true,
        },
        {
          title: "帮助与反馈",
          img: "/common/tabbarImages/icon_bangzhuyufankui_img.png",
          url: "/pages/feedback/feedback",
          needLogin: true,
        },
        // #ifdef H5
        // {
        //   title: "智能客服",
        //   img: "/hbdimage/main/images/home/kefu.png",
        //   method: "toService",
        // },
        // #endif
        {
          title: "设置",
          img: "/common/tabbarImages/setting.png",
          // url: "/package-my-about/pages/about?channelType=mini",
          url: "/pages/setting/setting",
          needLogin: true,
        },
        {
          title: "关于我们",
          img: "/common/tabbarImages/icon_aboutus_img.png",
          // url: "/package-my-about/pages/about?channelType=mini",
          url: "/package-my-about/pages/about",
        },
        // {
        //   title: "我的订阅",
        //   img: "/hbdimage/main/images/home/dingyueguanli.png",
        //   url: "/package-general-services/subscribe/index",
        //   needLogin: true,
        // },
        // {
        //   title: "老兵码",
        //   img: "/hbdimage/main/images/mine/laomingma.png",
        //   url: "/page-elderl-mode/veteran/veteran",
        //   needLogin: true,
        // },
      ],

      // 钱包余额
      pointBalance: "--",

      // 会员分
      fbMemberLevel: "",
      fbfNumber: "--", // 会员分数量
      kqNumber: "--", // 卡券数量
      memberInfo: {}, // 会员信息
      mineInfoList: [
        {
          name: "我的证照",
          imgUrl: "common/mineImg/wodezhengzhao.png",
        },
        {
          name: "五险一金",
          imgUrl: "common/mineImg/wuxianyijin.png",
        },
      ],
      isSignIn: false,
      pointOpenFlag: '0', // 积分会员启用状态
    };
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
    ...mapState(useUserStore, {
      isLogined: "isLogined",
      userInfo: "userInfo",
    }),
  },
  watch: {
    isLogined(newVal) {
      this.__loadData__();
      console.log("userInfo", this.userInfo);
      if (
        newVal &&
        (!this.userInfo.head ||
          (this.userInfo.isRealname == "1" &&
            (this.userInfo.desUserName || "").length == 0))
      ) {
        this.bridgeSdk.updateUserInfo();
      }
    },
  },
  onShow() {
    this.bridgeSdk.beans.setGlobalThis(this);
    this.__loadShow__();
  },
  onHide() {
    this.bridgeSdk.beans.removeGlobalThis(this);
  },
  async onLoad(options) {
    // await this.firstInit();
    this.trackReport.trackPageView("我的");

    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  methods: {
    __loadData__() {
      this.selUserPoints();
      getGlobalCode({ code: "pointsOnOff" }, { mask: false, catchError: true, encrypt: false, decrypt: false }).then(res => {
        console.log("getGlobalCode", res)
        this.pointOpenFlag = res.param
      })
    },
    __loadShow__() {
      if (
        this.isLogined &&
        (!this.userInfo.head ||
          (this.userInfo.isRealname == "1" &&
            (this.userInfo.desUserName || "").length == 0))
      ) {
        this.bridgeSdk.updateUserInfo();
      }
      if (this.isLogined) {
        let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
        console.log("mine userInfo", userInfo)
        const { nickName } = userInfo;
        this.nickName = nickName;
        // isCheckIns({}, { mask: false }).then((res) => {
        //   console.log("isCheckIns", res);
        //   this.isSignIn = res;
        // })
        this.getBalanceAndScore()
        this.getCouponListSec()
        getUserFubaoPointsAndMemberLevel({ privilegeType: "FB" }, { mask: false, catchError: true }).then(res => {
          console.log("getUserFubaoPointsAndMemberLevel", res)
          this.fbfNumber = res.points.totalPoints
          this.memberInfo = res.vip
          this.memberInfo.totalPoints = res.points.totalPoints
          // 获取福保登记
          // this.fbMemberLevel = res.levelName
          // this.fbfNumber = res.points.totalPoints
          // this.fbBenefit = []
          // if(res.vipTipTexts&&res.vipTipTexts.length){
          //   this.fbBenefit = res.vipTipTexts.map(item=> {
          //     return {
          //       name: item.hintText,
          //       imgUrl: item.iconUrl
          //     }
          //   })
          // }
        })
      }
    },
    selUserPoints(){
      if(!this.isLogined){
        this.pointBalance = "--"
        this.fbfNumber = "--"
        this.kqNumber = "--"
      }
    },
    getCouponListSec(){
      getCouponListSec({ 
          getStatus: "0",
          userId: this.userInfo.userId,
          page: 1,
          rows: 10
        }).then(res => {
          console.log("res", res);
          this.kqNumber = res.total;
      })
    },
    getBalanceAndScore() {
       getBalanceAndScore({}).then(res => {
          console.log("获取用户余额和积分", res);
          this.pointBalance = res.balance;
          this.score = res.score;
      })
    },

    toPage(item) {
      console.log("mine item", item);

      if (this[item.method]) {
        this[item.method]();
        return;
      }
      if(item.url == '/package-product-list/transit/transit'){
        wx.navigateToMiniProgram({
          appId: 'wx4152021ea617a1f5',
          path: 'pages/income/index',
          envVersion: 'release', // release(正式版)、trial(体验版)
          success(res) {
            console.log('跳转成功', res);
          },
          fail(err) {
            console.error('跳转失败', err);
            wx.showToast({ title: '跳转失败', icon: 'none', duration: 2000 });
          }
        })
        return;
      }
      this.bridgeSdk.jumpPage(item);
    },
    toService() {
      this.bridgeSdk.toIntelligentService();
    },
    checkIdentityAuth(state) {
      // false，未实名
      if (!state) {
        this.bridgeSdk.checkIdentityAuth();
      }
    },
    goSignIn() {
      // q去签到
      if (this.isLogined) {
        uni.navigateTo({
          url: "/package-member-center/memberSignIn/memberSignIn"
        })
      }
    },
    jumpKQPage(){
      this.bridgeSdk.jumpPage({
        url: "/package-cards-platform/card/cardList",
        needLogin: true,
        title: "我的卡券"
      })
    },

    // 跳转福保首页
    jumpFBPage() {
      // if (this.pointOpenFlag == '0') return
      this.bridgeSdk.jumpPage({
        url: "/package-member-center/memberCenter/memberCenter",
        needLogin: true,
        title: "会员中心"
      })
    },
    // 去充值
    toRecharge() {
      this.bridgeSdk.jumpPage({
        url: "/package-money-transactions/recharge/index",
        needLogin: true,
        title: "充值"
      })
    },

    // 积分商城
    jumppointMall(){
      this.bridgeSdk.jumpPage({
        url: "/package-intergral-mall/index/index",
        // needLogin: true,
        title: "在线商城"
      })
    },
    jumpToMyOrder(){
      this.bridgeSdk.jumpPage({
        url: "/package-money-transactions/payment/record",
        needLogin: true,
        title: "我的订单"
      })
    },
  },
};
</script>

<style lang="scss" scoped>
#demoDiv {
  // padding-top: 50rpx;
  // min-height: calc(100vh);
  box-sizing: border-box;
}

.top-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  min-height: 100vh;
  // background: linear-gradient(180deg, #FEF1DE 0%, #FFF 30%, #FFF 100%);
  background: linear-gradient( 180deg, #FEF1DE 0%, rgba(255,245,232,0) 100%);
  // background: linear-gradient( 180deg, #FEF1DE 0%, rgba(255,245,232,0) 100%);
  z-index: -1;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.login-box {
  width: 702rpx;
  box-sizing: border-box;
  padding: 68rpx 46rpx 54rpx;

  .no-login {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    .headImg {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      flex-shrink: 0;
      margin-right: 30rpx;
      overflow: hidden;
    }

    .login-info-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .tit {
        font-weight: 800;
        font-size: 36rpx;
        color: #060000;
        line-height: 50rpx;
        letter-spacing: 1px;
        margin-bottom: 18rpx;
      }

      .content {
        height: 62rpx;
        font-size: 24rpx;
        color: #333333;
        font-weight: 700;
      }
    }
  }

  .login-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    .user-icon {
      width: 150rpx;
      height: 150rpx;
      margin-right: 30rpx;

      .user-icon-img {
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
        flex-shrink: 0;
        // margin-right: 30rpx;
        overflow: hidden;
      }
    }

    .login-container-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .login-container-info-name {
        font-weight: 800;
        font-size: 36rpx;
        color: #060000;
        line-height: 50rpx;
        letter-spacing: 1px;
        margin-bottom: 18rpx;
        width: 450rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .login-container-info-level {
          height: 62rpx;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .level-icon {
            width: 176rpx;
            height: 62rpx;
            margin-right: 22rpx;
          }
          .real_box{
             width: 160rpx;
            height: 42rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient( 92deg, #1D85F0 0%, #56A5F8 100%);
            border-radius: 22rpx;
            font-weight: bold;
            font-size: 16rpx;
            color: #FFFFFF;
            .real_name_icon {
              width: 28rpx;
              height: 28rpx;
              margin-right: 8rpx;
            }
          }


        .level-num {
          font-weight: bold;
          font-size: 16rpx;
          color: #FFFFFF;
        }
      }
    }
  }
}

.point_card {
  width: 702rpx;
  height: 162rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 26rpx;

  .point_card_item {
    width: 45%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .point_card_icon {
      width: 66rpx;
      height: 66rpx;
    }

    .point_card_content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .point_card_title {
        font-weight: 800;
        font-size: 30rpx;
        color: #090000;
        line-height: 42rpx;
        text-align: center;
      }

      .point_card_num {
        font-weight: bold;
        font-size: 36rpx;
        color: #090000;
        line-height: 50rpx;
        text-align: center;
      }
    }
  }

  .gray_line {
    width: 1px;
    height: 40rpx;
    background: #e5e5e5;
  }
}

.toRechargeBox {
  width: 700rpx;
  height: 76rpx;
  padding-left: 14rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(252, 225, 189, 0.86);
  border-radius: 12rpx;

  .toRechargeImg {
    height: 76rpx;
    flex-shrink: 0;
    margin-right: 20rpx;
  }

  .toRechargeTitleImg {
    width: 148rpx;
    height: 30rpx;
    flex-shrink: 0;
    margin-right: 10rpx;
  }
  .toRechargeTitle{
    font-size: 24rpx;
    color: #d4830b;
    line-height: 40rpx;
  }

  .toRechargeText {
    font-weight: 900;
    font-size: 30rpx;
    color: #d4830b;
    line-height: 40rpx;
    flex-grow: 1;
  }

  .toRechargeBtn {
    width: 165rpx;
    height: 76rpx;
    border-radius: 0 12rpx 12rpx 0;
    background: linear-gradient( 270deg, #FBBD67 0%, #F29515 100%);
    // background: #F29515;
    font-weight: bold;
    font-size: 30rpx;
    color: #FFFFFF;
    line-height: 42rpx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  
  }
}

.member-box {
  width: 750rpx;
  position: relative;
  margin-top: 22rpx;

  .current-title {
    position: absolute;
    top: 0;
    left: 24rpx;
    z-index: 1;
    width: 150rpx;
    height: 40rpx;
    background: rgba(255, 255, 255, 0.5);
    border-top-left-radius: 40rpx;
    border-bottom-right-radius: 40rpx;
    text-align: center;
    line-height: 40rpx;
    font-size: 22rpx;
    color: #ffffff;
  }

  .member-card {
    width: 100%;
    height: 300rpx;
  }

  .member-un-login {
    width: 100%;
    height: 288rpx;

    .member-un-login-img {
      width: 100%;
      height: 100%;
    }
  }
}

.my-order {
  width: 704rpx;
  margin-top: 20rpx;
  // position: relative;
  // top: -40rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-sizing: border-box;

  .my-order-title {
    width: 126rpx;
    height: 30rpx;
    padding-left: 38rpx;
    padding-top: 32rpx;

    .my-order-title-icon {
      width: 126rpx;
      height: 30rpx;
    }
  }

  .my-order-content {
    width: 100%;
    padding: 38rpx 120rpx 48rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .my-order-item {
      width: 120rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .my-order-icon {
        width: 74rpx;
        height: 74rpx;
        margin-bottom: 26rpx;
      }

      .my-order-name {
        width: 120rpx;
        font-weight: 800;
        font-size: 26rpx;
        color: #060000;
        line-height: 36rpx;
        letter-spacing: 1px;
        text-align: center;
      }
    }

    .gray_line {
      width: 1px;
      height: 40rpx;
      background: #e5e5e5;
    }
  }
}

.more-service {
  width: 702rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  margin-top: 40rpx;

  .more-service-title {
    width: 126rpx;
    height: 30rpx;
    padding-left: 38rpx;
    padding-top: 32rpx;

    .more-service-title-icon {
      width: 126rpx;
      height: 30rpx;
    }
  }

  .more-service-content {
    width: 100%;
    box-sizing: border-box;
    padding: 56rpx 10rpx 32rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .more-service-item {
      width: 25%;
      padding: 10rpx 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .more-service-icon {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 24rpx;
      }

      .more-service-name {
        width: 100%;
        font-weight: 800;
        font-size: 22rpx;
        color: #060000;
        line-height: 32rpx;
        letter-spacing: 1px;
        text-align: center;
      }
    }
  }
}
</style>