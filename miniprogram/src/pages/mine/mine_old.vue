<!--
 * @Description: 我的
 * @Author: chenyulong
 * @Date: 2024-09-24 13:09:23
 * @LastEditors: yulongchen
 * @LastEditTime: 2025-09-24 09:48:55
 * @Remark: 
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-xyfen-agree ref="xyfen" @agree="xyfenAgreenAction"></vc-xyfen-agree>
  <view
    id="demoDiv"
    class="safe-space cpa-flex cpa-column cpa-px-12-5 cpa-relative footer"
    :style="{
      paddingTop: (safeTopDistance > 25 ? safeTopDistance - 15 : 10) + 'px',
      zIndex: 1,
    }"
  >
    <!--  背景  -->
    <view class="top-bg" :style="`background-image: url(${minioBaseUrl}/common/mineImg/mine_bg_img.jpg)`"></view>
    <!--未登录-->
    <view v-if="!isLogined" class="login-box" @click="bridgeSdk.toLogin">
      <view class="no-login">
        <image
          class="headImg"
          style="width: 150rpx; height: 150rpx"
          :src="minioBaseUrl + noHeadPng"
          mode="aspectFit"
        />
        <view class="login-info-box">
          <text class="tit">未登录</text>
          <text class="content">欢迎登录大连海创嗨创生活，点击登录</text>
        </view>
      </view>
    </view>
    <view v-else class="login-container flex" style="padding-bottom: 36rpx">
      <view class="user-icon">
        <image
          class="img"
          v-if="userInfo.head"
          :src="`${minioBaseUrl}${userInfo.head}`"
        ></image>
        <image
          class="img"
          v-else
          :src="staticBaseUrl + '/hbdimage/main/images/home/touxiang.png'"
          mode="widthFix"
        ></image>
      </view>
      <view class="flex-column">
        <view
          class="name"
          v-if="userInfo.isRealname == '1' && userInfo.desUserName"
          >{{ userInfo.desUserName }}</view
        >
        <view class="name" v-else-if="nickName">{{
          nickName
        }}</view>
        <view class="flex">
          <!-- 会员等级 -->
           <image
            :src="minioBaseUrl + '/common/mineImg/vip.png'"
            mode="scaleToFill"
           />
          <!--未认证-->
          <!-- <view
            class="authorize-icon"
            :style="`background-image: url(${staticBaseUrl}/hbdimage/mine/${
              userInfo.isRealname == '1' ? '已认证.png' : '未认证.png'
            })`"
            @click="checkIdentityAuth(userInfo.isRealname == '1')"
          >
            {{ userInfo.isRealname == "1" ? "已实名" : "未认证" }}
          </view> -->
          <!-- 是否签到 -->
          <!-- <view
            v-if="pointOpenFlag=='1'&&isSignIn"
            class="signInBtn"
            @click="goSignIn()"
          ><image class="signInBtn-img" :src="minioBaseUrl + '/common/mineImg/hasSignIn.png'" mode="heightFix"></image></view>
          <view v-else-if="pointOpenFlag=='1'&&!isSignIn" class="signInBtn"  @click="goSignIn()"><image class="signInBtn-img" :src="minioBaseUrl + '/common/mineImg/notSignIn.png'" mode="heightFix"></image></view>
           -->
        </view>
        <!-- <view v-else class="phone">{{
          userInfo.desMobile
        }}</view> -->
      </view>
      <!-- <view class="menus flex">
        <view class="message-icon">
          <view class="message-icon-box">
            <image
              class="img"
              :src="staticBaseUrl + '/hbdimage/main/images/home/xiaoxi.png'"
              @click="
                bridgeSdk.jumpPage({
                  url: '/pages/message/message',
                  title: '消息中心',
                  needLogin: true,
                })
              "
              mode="scaleToFill"
            ></image>
            <view class="message-text">消息</view>
          </view>
          <text class="dot" v-if="messageCount > 0"></text>
        </view>
        <view class="message-icon">
          <view class="message-icon-box">
            <image
              class="img"
              :src="staticBaseUrl + '/hbdimage/main/images/home/shezhi.png'"
              @click="
                bridgeSdk.jumpPage({
                  url: '/pages/setting/setting',
                  title: '我的设置',
                })
              "
              mode="scaleToFill"
            ></image>
            <view class="message-text">设置</view>
          </view>
        </view>
      </view> -->
    </view>

    <view class="qrCode-box">
      <view
        class="flex info-box"
        :style="`background-image: url(${staticBaseUrl}/hbdimage/main/images/home/fubaofen.jpg)`"
          @click="jumpFBPage"
      >
        <view class="score_info">{{ fbMemberLevel }}</view>
        <view class="score_num" v-if="pointOpenFlag=='1'">会员中心<up-icon name="arrow-right" size="24rpx" color="#fff" bold="true" style="margin-left: 14rpx;"></up-icon></view>
        <!-- <view class="score_num">{{ fbfNumber ? fbfNumber : 0 }}福保分</view> -->
      </view>
      <!-- <view class="fbBenefit" v-if="fbBenefit&&fbBenefit.length">
        <view
          class="fbBenefitItem"
          v-for="(item, index) in fbBenefit"
          :key="index"
        >
          <image
            class="fbBenefitItemImg"
            :src="minioBaseUrl + item.imgUrl"
          ></image>
          <text class="fbBenefitItemText">{{ item.name }}</text>
        </view>
      </view> -->
      <view class="qrCode-corner">
        <view class="menu-item" @click="jumpFBPage">
          <text class="jifen-num">{{ fbfNumber }}</text>
          <text class="text">会员分</text>
        </view>
        <view class="menu-item" @click.stop="xyfAction">
          <text class="jifen-num" v-if="!isLogined || xyfAgreeProtocol == '-1'">--</text>
          <text class="jifen-num no-agree" v-else-if="isLogined && xyfAgreeProtocol != '1'">开通</text>
          <text class="jifen-num" v-else>{{ xyfen }}</text>
          <text class="text">信用分</text>
        </view>
        <view class="menu-item">
          <text class="jifen-num">{{ tjfen }}</text>
          <text class="text">碳积分</text>
        </view>
      </view>
    </view>
    <!-- 开通信用分提示 -->
    <view class="xyfPrompt" v-if="isLogined && xyfAgreeProtocol != '1'">
      <image
        class="xyfPromptImg"
        :src="minioBaseUrl + 'common/mineImg/xinyongfen.png'"
      ></image>
      <text class="xyfPromptTitle">信用分</text>
      <text class="xyfPromptDesc">开信用分，会员分福利加倍</text>
      <view class="xyfPromptBtn" @click.stop="xyfAction">去开通</view>
    </view>
    <!-- 我的订单 -->
    <!-- <view class="title">我的订单</view> -->
    <!-- <view class="myOrder">
      <view class="myOrderHeader">
        <view v-for="(item, index) in orderMenuList" :key="index">
          <view class="myOrderHeaderItem" @click="bridgeSdk.jumpPage(item)">
            <image
              class="myOrderHeaderItemImg"
              :src="minioBaseUrl + item.imgUrl"
            ></image>
            <text
              class="myOrderHeaderItemText"
              :style="{ color: item.color }"
              >{{ item.name }}</text
            >
          </view>
        </view>
      </view>
    </view> -->
    <view class="title">我的信息</view>
    <view class="myOrderFooter">
      <view class="myOrderFooterItemBox" v-for="(item, index) in orderFooterList" :key="index">
        <view class="myOrderFooterItem" @click="bridgeSdk.jumpPage(item)">
          <image
            class="myOrderFooterItemImg"
            :src="minioBaseUrl + item.imgUrl"
          ></image>
          <text class="myOrderFooterItemText">{{ item.name }}</text>
        </view>
      </view>
    </view>
    <!-- <view class="title">个人信息舱</view>
    <view class="mineInfoBox">
      <view v-for="(item, index) in mineInfoList" :key="index">
        <view class="mineInfoBoxItem">
          <image
            class="mineInfoBoxItemImg"
            :src="minioBaseUrl + item.imgUrl"
          ></image>
          <text class="mineInfoBoxItemText">{{ item.name }}</text>
        </view>
      </view>
    </view> -->

    <!-- <view class="jfListBox">
      <view class="jfListItemBox">
        <view class="jfListItem">
          <image
            class="jfListItemImg"
            :src="minioBaseUrl + 'common/mineImg/dkw_jifen.png'"
          ></image>
          <text class="jfListItemTitle">碳积分</text>
          <text class="jfListItemText">{{ tjfen }}</text>
        </view>
      </view>
      <view class="jfListItemBox">
        <view class="jfListItem" @click.stop="xyfAction">
          <image
            class="jfListItemImg"
            :src="minioBaseUrl + 'common/mineImg/jianqu-copy.png'"
          ></image>
          <text class="jfListItemTitle">信用分</text>
          <text class="jfListItemText" v-if="!isLogined || xyfAgreeProtocol == '-1'"
            >--</text
          >
          <text
            class="jfListItemNoOpen"
            v-else-if="isLogined && xyfAgreeProtocol != '1'"
            >未开通</text
          >
          <text class="jfListItemText" v-else>{{ xyfen }}</text>
        </view>
      </view>
      
    </view> -->

    <!-- <view class="title">我的信息</view>
    <view class="message-list">
      <view
        v-for="(item, index) in messageList"
        :key="index"
        class="message-item"
        @click="bridgeSdk.jumpPage(item)"
      >
        <image class="img" :src="staticBaseUrl + item.img" mode="widthFix"></image>
        <text class="text">{{ item.title }}</text>
      </view>
    </view> -->
    <view class="title">其他服务</view>
    <view class="service-list-box">
      <view class="service-list">
        <view
          v-for="(item, index) in serviceList"
          :key="index"
          class="message-item message-space"
          @click="toPage(item)"
        >
          <image
            class="img"
            :src="staticBaseUrl + item.img"
            mode="heightFix"
          ></image>
          <text class="text">{{ item.title }}</text>
        </view>
      </view>
    </view>
    <!-- <view class="bottom-image">
      <image
        class="bottom-img"
        :src="minioBaseUrl + 'common/mineImg/bottomImg.png'"
        mode="scaleToFill"
      />
    </view> -->
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useBaseStore, useUserStore } from "@/store/index";
// import { getUserInfo } from "@/api/login";
import { getNotifyCount } from "@/api/home";
import { selUserPoints, updAgreeProtocol, isCheckIns, appgetUserFubaoPointsVip,getGlobalCode} from "@/api/mine";
// import { importMainStatic } from "@/utils/bridge";
import vcXyfenAgree from "@/components/library/base/vc-xyfen-agree/index.vue";

export default {
  name: "mine",
  components: {
    vcXyfenAgree,
  },
  data() {
    return {
      nickName: "",
      messageCount: 0,
      // scoreNum: "--",
      // 信用开通后并且请求接口成功为 2；请求接口成功为1；请求接口失败为0；请求接口中 为3
      isRequestUserPoints: 0,
      xyfAgreeProtocol: "-1",
      xyfen: "--",
      tjfen: "--",
      hlfen: "--",
      xyfName: "",
      tjfName: "",
      hlfName: "",
      noHeadPng: "common/static/mine/mine-nologin-head.png",
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
        // #ifdef H5
        {
          title: "收货地址",
          img: "/hbdimage/main/images/home/收货地址.png",
          url: "/package-address/pages/addressList",
          needLogin: true,
          // isBuilding: true,
        },
        // #endif
        {
          title: "推荐",
          img: "/hbdimage/main/images/home/推荐惠保定.png",
          url: "/package-recommend-hbd/recommendHbd/recommendHbd",
        },
        // #ifdef H5
        {
          title: "我是商户",
          img: "/hbdimage/main/images/home/我是商户.png",
          url: "/package-product-list/transit/transit",
          needLogin: true,
        },
        // #endif
        {
          title: "帮助与反馈",
          img: "/hbdimage/main/images/home/帮助与反馈.png",
          url: "/pages/feedback/feedback",
          needLogin: true,
        },
        // #ifdef H5
        {
          title: "智能客服",
          img: "/hbdimage/main/images/home/kefu.png",
          method: "toService",
        },
        // #endif
        {
          title: "关于我们",
          img: "/hbdimage/main/images/home/关于我们.png",
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

      // 福保分
      fbMemberLevel: "新星会员",
      fbfNumber: "--",
      fbBenefit: [],
      orderMenuList: [
      ],
      orderFooterList: [
        {
          name: "我的卡券",
          imgUrl: "common/mineImg/my_kq.png",
          needLogin: true,
          url: "/package-cards-platform/card/cardList",
        },
        {
          name: "我的收藏",
          imgUrl: "common/mineImg/my_sc.png",
          needLogin: true,
          url: "/package-testHelper/collect/index",
        },
        {
          name: "我的活动",
          imgUrl: "common/mineImg/my_hd.png",
          needLogin: true,
          url: "/package-special-activities/specialRecruit/activList",
        },
        {
          name: "我的订阅",
          imgUrl: "common/mineImg/my_dy.png",
          needLogin: true,
          url: "/package-general-services/subscribe/index",
        },
        // {
        //   name: "评价",
        //   imgUrl: "common/mineImg/daipingjia.png",
        // },
      ],
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
    // userInfo(){
    //   if(!this.isLogined){
    //     return {};
    //   }
    //   return this.bridgeSdk.getUserInfo().userInfo;
    // }
  },
  watch: {
    isLogined(newVal) {
      this.isRequestUserPoints = 0;
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

    this.orderMenuList = [
        {
          name: "商城订单",
          imgUrl: "common/mineImg/shop_list_bg1.png",
          color: "#B21C1C",
          url: this.staticBaseUrl + "/mall/#/pages/ucenter/order/order",
        },
        {
          name: "本地生活",
          imgUrl: "common/mineImg/shop_list_bg2.png",
          color: "#446E55",
          url: "/package-product-list/shopList/shopListNew"
        },
        {
          name: "积分商城",
          imgUrl: "common/mineImg/shop_list_bg3.png",
          color: "#34495E",
          url: "/package-intergral-mall/order/orderList",
        },
    ]
    this.__loadData__();
  },
  methods: {
    __loadData__() {
      this.selUserPoints();
      getGlobalCode({code: "pointsOnOff"},{mask:false,catchError: true,encrypt: false,decrypt: false}).then(res => {
          console.log("getGlobalCode", res)
          this.pointOpenFlag = res.param
        })
    },
    __loadShow__() {
      this.getNotifyCount();
      if (
        this.isLogined &&
        (!this.userInfo.head ||
          (this.userInfo.isRealname == "1" &&
            (this.userInfo.desUserName || "").length == 0))
      ) {
        this.bridgeSdk.updateUserInfo();
      }
      if(this.isLogined){
        let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
        console.log("mine userInfo", userInfo)
            const {  nickName } = userInfo;
            this.nickName = nickName;
        isCheckIns({}, { mask: false }).then((res) => {
          console.log("isCheckIns", res);
          this.isSignIn = res;
        })
        appgetUserFubaoPointsVip({},{mask:false,catchError: true}).then(res=> {
          console.log("appgetUserFubaoPointsVip",res)
          // 获取福保登记
          this.fbMemberLevel = res.levelName
          this.fbfNumber = res.points.totalPoints
          this.fbBenefit = []
          if(res.vipTipTexts&&res.vipTipTexts.length){
            this.fbBenefit = res.vipTipTexts.map(item=> {
              return {
                name: item.hintText,
                imgUrl: item.iconUrl
              }
            })
          }
        })
      }
    },
    // 获取积分
    selUserPoints(func) {
      if (!this.isLogined) {
        this.xyfAgreeProtocol = "-1";
        this.xyfen = "--";
        this.tjfen = "--";
        this.hlfen = "--";
        this.xyfName = "";
        this.tjfName = "";
        this.hlfName = "";
        this.fbfNumber = "--";
        this.fbMemberLevel = "新星会员";
        return;
      }
      if (this.isRequestUserPoints == 3) {
        // 请求接口中，直接返回
        return;
      }
      this.isRequestUserPoints = 3; // 请求接口中
      selUserPoints({})
        .then((res) => {
          console.log("获取积分");
          console.dir(res);
          this.xyfAgreeProtocol = "";
          this.xyfen = "--";
          this.tjfen = "--";
          this.hlfen = "--";
          this.xyfName = "";
          this.tjfName = "";
          this.hlfName = "";
          if (Object.prototype.toString.call(res) === "[object Array]") {
            res.forEach((element) => {
              if (element.pointsType == "HLF") {
                this.hlfen = element.availablePoints;
                this.hlfName = element.pointsTypeName;
              } else if (element.pointsType == "TJF") {
                this.tjfen = element.availablePoints;
                this.tjfName = element.pointsTypeName;
              } else if (element.pointsType == "XYF") {
                this.xyfAgreeProtocol = element.agreeProtocol;
                this.xyfen = element.availablePoints;
                this.xyfName = element.pointsTypeName;
              }
            });
          }
          this.isRequestUserPoints = 1;
          if (this.xyfAgreeProtocol == "1" && this.userInfo.isRealname == "1") {
            this.isRequestUserPoints = 2;
          }
          func && func();
        })
        .catch(() => {
          console.log("获取积分，失败 0");
          this.isRequestUserPoints = 0;
        });
    },
    // 获取消息数据
    getNotifyCount() {
      // 如果是登录状态，则获取
      if (this.bridgeSdk.getUserInfo()) {
        console.log("去登录 --- 用户信息");
        console.dir(this.bridgeSdk.getUserInfo());
        getNotifyCount({}, { mask: false }).then((res) => {
          console.log("getNotifyCount().then(res=> {--------");
          console.dir(res);
          if (Object.prototype.toString.call(res.count) == "[object String]") {
            this.messageCount = res.count.length > 0 ? parseInt(res.count) : 0;
          } else {
            this.messageCount = res.count || 0;
          }

          console.log("messageCount " + this.messageCount);
        });
      } else {
        console.log("未登录mine");
        this.messageCount = 0;
      }
    },
    toPage(item) {
      console.log("mine item", item);

      if (this[item.method]) {
        this[item.method]();
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
    xyfAction() {
      if (this.isRequestUserPoints == 3) {
        // 请求接口中，直接返回
        // this.bridgeSdk.showToast({ title: '查询中，请耐心等待', duration: 1500 })
        return;
      } else if (this.isRequestUserPoints == 0) {
        // 请求失败
        this.selUserPoints(() => {
          if (this.isRequestUserPoints == 1) {
            // 未开通
            this.xyfAction();
          }
        });
        return;
      } else if (this.isRequestUserPoints == 2) {
        // 已经同意过
        this.selUserPoints(); // 更新信用分
        return;
      }
      console.log("去开通");
      if (this.xyfAgreeProtocol == "1") {
        return;
      }
      if (!this.isLogined) {
        // this.bridgeSdk.toLogin();
        return;
      }
      if (this.userInfo.isRealname != "1") {
        this.bridgeSdk.showConfirm({
          // title: '温馨提示',
          content: "您还未实名认证，是否去实名认证？",
          confirmText: "去实名认证",
          cancelText: "否",
          confirmCallback: (res) => {
            this.bridgeSdk.checkIdentityAuth();
          },
        });
        return;
      }
      this.$refs.xyfen.open();
    },
    xyfenAgreenAction() {
      this.trackReport.trackCustom("开通信用分");

      updAgreeProtocol({}).then((res) => {
        this.selUserPoints();
        setTimeout(() => {
          uni.showToast({ title: "授权成功", icon: "none" });
        }, 500);
      });
    },
    // 跳转福保首页
    jumpFBPage(){
      if(this.pointOpenFlag == '0') return
      this.bridgeSdk.jumpPage({
        url: "/package-member-center/memberCenter/memberCenter",
        needLogin: true,
        title: "会员中心"
      })
    }
  },
};
</script>

<style lang="scss" scoped>
#demoDiv {
  padding-top: 50rpx;
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
  // background: linear-gradient(#baffe1, #f5f6f8);
  z-index: -1;
}

.name,
.phone {
  color: #040000;
  line-height: 1;
}

.name {
  font-size: 36rpx;
  margin-bottom: 22rpx;
  // padding-left: 14rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 480rpx;
}

.phone {
  font-size: 28rpx;
}

.login-box {
  padding-top: 42rpx;
  padding-bottom: 48rpx;
  .no-login {
    // padding-left: 188rpx;
    width: 100%;
    box-sizing: border-box;
    padding-left: 46rpx;
    display: flex;
    // flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    .headImg {
      margin-right: 32rpx;
      flex-shrink: 0;
    //   position: absolute;
    //   left: 30rpx;
    }
    .login-info-box{
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .tit {
      font-weight: bold;
      font-size: 36rpx;
      color: #020000;
    }
    .content {
      margin-top: 9rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
    }
  }
}

.login-container {
  // padding-top: 42rpx;
  width: 100%;
  box-sizing: border-box;
  padding-left: 46rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.flex {
  display: flex;
  align-items: center;
}

.flex-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.user-icon {
  width: 150rpx;
  height: 150rpx;
  // margin-left: 24rpx;
  margin-right: 32rpx;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  // border: 8rpx solid #65fbb2;
  flex-shrink: 0;
  .img {
    width: 150rpx;
    height: 150rpx;
  }
}

.authorize-icon {
  width: 152rpx;
  height: 40rpx;
  background: no-repeat center center;
  background-size: 100% 100%;
  font-size: 22rpx;
  text-indent: 52rpx;
  color: #8e4604;
  line-height: 40rpx;
  margin-right: 20rpx;
}

.signInBtn{
  width: 138rpx;
  height: 42rpx;
  .signInBtn-img{
    height: 100%;
    width: auto;
  }
}

.authorize-icon .img {
  width: 100%;
}

.qrCode-box {
  border-radius: 20rpx;
  background: linear-gradient(to right, #00bcb9, #11ffbd);

  .info-box {
    padding: 22rpx 38rpx 22rpx 30rpx;
    justify-content: space-between;
    align-items: center;
    color: white;
    // background: url("@/static/images/home/fubaofen.jpg") no-repeat 100% 0;
    background-size: 152rpx;
    background-repeat: no-repeat;
    background-position: 100% 0;
    // padding-top: 20rpx;

    .score_info {
      font-size: 40rpx;
      font-weight: bold;
      line-height: 56rpx;
    }

    .score_num {
      font-size: 32rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
  }

  .fbBenefit {
    width: 100%;
    height: 106rpx;
    box-sizing: border-box;
    padding: 0 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    border-radius: 20rpx 20rpx 0 0;
    background: #ffffff;
    .fbBenefitItem {
      width: 33%;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      .fbBenefitItemImg {
        width: 44rpx;
        height: 44rpx;
        margin-right: 12rpx;
      }
      .fbBenefitItemText {
        font-size: 24rpx;
        color: #34495e;
        line-height: 33rpx;
        margin-right: 10rpx;
      }
    }
  }
}
.xyfPrompt {
  width: 696rpx;
  height: 77rpx;
  background: #f7dfc1;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  padding: 0 16rpx 0 23rpx;
  box-sizing: border-box;
  margin-top: 32rpx;
  .xyfPromptImg {
    width: 36rpx;
    height: 36rpx;
    margin-right: 6rpx;
  }
  .xyfPromptTitle {
    font-weight: bold;
    font-size: 28rpx;
    color: #c27013;
    line-height: 40rpx;
    margin-right: 18rpx;
  }
  .xyfPromptDesc {
    font-weight: bold;
    font-size: 24rpx;
    color: #e59338;
    line-height: 33rpx;
    flex-grow: 1;
  }
  .xyfPromptBtn {
    width: 124rpx;
    height: 54rpx;
    background: linear-gradient(90deg, #bd6a0d 0%, #f2a146 100%), #d8d8d8;
    border-radius: 27rpx;
    text-align: center;
    font-weight: bold;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 54rpx;
  }
}

.myOrder {
  width: 696rpx;
  // height: 240rpx;
  // background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
  padding: 24rpx 18rpx 18rpx;
  margin-top: 32rpx;
  .myOrderHeader {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28rpx;
    .myOrderHeaderItem {
      width: 212rpx;
      height: 86rpx;
      position: relative;
      .myOrderHeaderItemImg {
        width: 212rpx;
        height: 86rpx;
      }
      .myOrderHeaderItemText {
        position: absolute;
        top: 14rpx;
        left: 14rpx;
        font-weight: normal;
        font-size: 26rpx;
        // color: #b21c1c;
        color: #ffffff;
        line-height: 35rpx;
        // margin-top: 14rpx;
        // margin-left: 14rpx;
      }
    }
  }
}
.myOrderFooter {
  width: 100%;
  margin-top: 14rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  // .myOrderFooterItemBox{
  //   padding: 2rpx;
  //   background: linear-gradient(163deg, rgba(1, 192, 185, 0.25), rgba(2, 225, 221, 0));
  //   border-radius: 12rpx;
  // }
  .myOrderFooterItem {
    width: 160rpx;
    height: 148rpx;
    box-sizing: border-box;
    padding: 28rpx 0 0 0;
    background: #FBFBFC;
    border-radius: 12rpx;
    // border: 2rpx solid;
    // border-image: linear-gradient(163deg, rgba(1, 192, 185, 0.25), rgba(2, 225, 221, 0)) 2 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    .myOrderFooterItemImg {
      width: 48rpx;
      height: 48rpx;
    }
    .myOrderFooterItemText {
      font-weight: 400;
      font-size: 24rpx;
      color: #34495e;
      line-height: 34rpx;
      margin-top: 10rpx;
    }
  }
}

.mineInfoBox {
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx 30rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .mineInfoBoxItem {
    width: 305rpx;
    height: 110rpx;
    background: #e0f7e9;
    border-radius: 14rpx;
    display: flex;
    padding: 32rpx;
    box-sizing: border-box;
    align-items: center;
    .mineInfoBoxItemImg {
      width: 80rpx;
      height: 80rpx;
      margin-right: 40rpx;
    }
    .mineInfoBoxItemText {
      font-weight: 800;
      font-size: 28rpx;
      color: #02c1b9;
      line-height: 40rpx;
    }
  }
}
.jfListBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 42rpx;
  // .jfListItemBox{
  //   padding: 2rpx;
  //   background: linear-gradient(163deg, rgba(1, 192, 185, 0.25), rgba(2, 225, 221, 0));
  //   border-radius: 16rpx;
  // }
  .jfListItem {
    width: 331rpx;
    height: 104rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    padding: 26rpx 30rpx;
    box-sizing: border-box;
    background: #FBFBFC;
    .jfListItemImg {
      width: 52rpx;
      height: 52rpx;
      margin-right: 24rpx;
    }
    .jfListItemTitle {
      font-weight: 800;
      font-size: 28rpx;
      color: #222429;
      line-height: 40rpx;
      flex-grow: 1;
    }
    .jfListItemText {
      font-weight: bold;
      font-size: 32rpx;
      color: #222429;
      line-height: 45rpx;
      flex-shrink: 0;
    }
    .jfListItemNoOpen {
      font-weight: 400;
      font-size: 24rpx;
      color: #222429;
      line-height: 33rpx;
      flex-shrink: 0;
    }

  }
}

.qrCode-corner {
  padding: 14rpx 0 18rpx;
  box-sizing: border-box;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 20rpx;
  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .jifen-num{
    font-weight: bold;
    font-size: 44rpx;
    color: #333333;
    line-height: 62rpx;
    margin-bottom: 4rpx;
  }
  .menu-item .jifen-num.no-agree {
    font-size: 28rpx;
    color: #02c0b9;
    font-weight: bold;
  }
  .text {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #34495E;
    line-height: 34rpx;
    &:nth-child(1) {
      font-size: 40rpx;
      margin-bottom: 20rpx;
      font-weight: bold;
    }

    &:nth-child(2) {
      font-size: 28rpx;
      color: #34495e;
    }
  }
}

.menus {
  .img {
    width: 40rpx;
    height: 40rpx;
    // float: left;

    // &:nth-child(1) {
    //   margin-right: 24rpx;
    // }

    // &:nth-child(2) {
    //   margin-right: 10rpx;
    // }
  }

  .message-icon {
    position: relative;
    .message-icon-box{
      width: 48rpx;
      height: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      &:nth-child(1) {
        margin-right: 24rpx;
      }
  
      &:nth-child(2) {
        margin-right: 10rpx;
      }
      .message-text{
        margin-top: 4rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 34rpx;
      }
    }
  }

  .dot {
    position: absolute;
    top: -10rpx;
    left: 22rpx;
    width: 16rpx;
    height: 16rpx;
    background: red;
    display: block;
    z-index: 1;
    border-radius: 20rpx;
  }
}

.title {
  padding: 42rpx 0 22rpx;
  font-weight: bold;
  font-size: 36rpx;
  color: #222429;
  line-height: 50rpx;
}

.message-list {
  display: flex;
  .message-item {
    flex-grow: 0;
    flex-basis: 25%;
  }
}

.message-item {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 20rpx;
  padding-top: 20rpx;
  padding-bottom: 12rpx;
  margin: 0 10rpx;

  .img {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 14rpx;
  }
  .img + .text {
    font-size: 24rpx;
    color: #34495e;
  }
}
.message-space {
  flex-grow: 0 !important;
}

// .service-list-box{
//   padding: 2rpx;
//   background: linear-gradient(163deg, rgba(1, 192, 185, 0.25), rgba(2, 225, 221, 0));
//   border-radius: 20px;
// }
.service-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
  justify-content: flex-start;
  background: #FBFBFC;
  border-radius: 20px;
}

.service-list .message-item {
  width: 30.33%;
  margin: 0 10rpx;
  background: transparent;

  .img {
    width: 48rpx;
    height: 48rpx;
  }

  .text {
    font-size: 28rpx;
  }
}
.bottom-image{
  margin-top: 30rpx;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .bottom-img{
    width: 304rpx;
    height: 60rpx;
  }
}
</style>