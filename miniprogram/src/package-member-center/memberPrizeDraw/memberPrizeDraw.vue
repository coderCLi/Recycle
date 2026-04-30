<template>
  <vc-modal ref="modal"></vc-modal>
  <!-- <vc-login v-if="!isLogined" /> -->
  <view class="page-container">
    <image
      class="all-page-bg-img"
      :src="minioBaseUrl + allPageBg"
      mode="scaleToFill"
    />
    <!-- 顶部圆弧渐变背景和导航栏 -->
    <view
      class="top-arc-bg"
      :style="{
        paddingTop: navigationBarInfo.statusBarHeight + 'px',
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
          >积分抽奖</view
        >
      </view>
    </view>
    <view
      class="member-prize-draw-container"
      :style="{
        height:
          'calc(100vh - ' +
          (navigationBarInfo.statusBarHeight +
            navigationBarInfo.navigationBarHeight) +
          'px)',
        overflowY: 'scroll',
      }"
    >
      <view class="member-prize-draw-header">
        <view class="member-prize-draw-header-item" @click="jumpMyPoint">
          <view>{{ availablePoints }}</view>
          <view class="member-prize-draw-header-item-flex"
            >可用积分<up-icon name="arrow-right" color="#ffffff"></up-icon>
          </view>
        </view>
        <view class="member-prize-draw-header-item" @click="jumpBenefit">
          <view>{{ freePointsDraw }}</view>
          <view class="member-prize-draw-header-item-flex"
            >免积分抽奖次数<up-icon
              name="arrow-right"
              color="#ffffff"
            ></up-icon>
          </view>
        </view>
      </view>
      <view class="member-prize-draw-title">
        <image
          class="member-prize-draw-title-img"
          :src="minioBaseUrl + 'common/memberCenter/turntableTitle.png'"
          mode="scaleToFill"
        />
      </view>
      <view class="member-prize-draw-prompt" v-if="pageType == '1'">
        <view class="member-prize-draw-prompt-dot"></view>
        <view class="member-prize-draw-prompt-text"
          >你还有{{ numberOfDrawsRemaining }}次抽奖机会</view
        >
        <view class="member-prize-draw-prompt-dot"></view>
      </view>
      <view class="member-prize-draw-turntable" v-if="pageType == '1'">
        <image
          class="member-prize-draw-turntable-img"
          :src="minioBaseUrl + 'common/memberCenter/turntableBG.png'"
          mode="scaleToFill"
        />
        <view class="ldialer-container">
          <Ldialer
            :prizeList="prizes"
            size="516rpx"
            @click="startCallback"
            @done="endCallback"
            ref="dialer"
            :freeNum="freePointsDraw"
          >
          </Ldialer>
        </view>
      </view>
      <view
        class="member-prize-draw-my-prize"
        v-if="pageType == '1'"
        @click="jumpMyPrize"
      >
        <view class="member-prize-draw-my-prize-title">
          <!-- <image class="member-prize-draw-my-prize-img" :src="minioBaseUrl + '/common/memberCenter/myPrizeIcon.png'"></image> -->
          <up-icon name="gift-fill" color="#FF233D" size="36rpx"></up-icon>
          <text class="member-prize-draw-my-prize-text">我的奖品</text>
        </view>
      </view>
      <view class="member-prize-draw-rules" v-if="pageType == '1'">
        <view class="member-prize-draw-rules-header">
          <image
            class="member-prize-draw-rules-header-img"
            :src="minioBaseUrl + 'common/memberCenter/prizDrawRulsTitle.png'"
            mode="scaleToFill"
          />
        </view>
        <!-- <view class="member-prize-draw-rules-content">
          <view class="member-prize-draw-rules-content-title">1.参与资格</view>
          <view class="member-prize-draw-rules-content-desc">
            注册大连海创嗨创生活用户均可参与。
          </view>
          <view class="member-prize-draw-rules-content-title">2.参与方式</view>
          <view class="member-prize-draw-rules-content-desc">
            a.用户账户需拥有≥{{ pointsNum }}积分，单次抽奖消耗{{ pointsNum }}积分。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            b.或用户升级会员等级可获得免积分抽奖次数（具体获取规则见[积分常见问题页面]），使用免积分次数抽奖不消耗积分。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            c. 免积分抽奖次数有效期：[仅在领取当月有效]。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            d. 积分在点击抽奖确认时即时扣除，无论是否中奖。积分不足时无法参与。
          </view>
          <view class="member-prize-draw-rules-content-desc"> </view>
          <view class="member-prize-draw-rules-content-title">3.参与次数</view>
          <view class="member-prize-draw-rules-content-desc">
            不限制每位用户参与次数（满足积分或免积分次数条件即可）。
          </view>
          <view class="member-prize-draw-rules-content-title">4.奖池说明</view>
          <view class="member-prize-draw-rules-content-desc">
            a.具体奖品种类、数量、价值及中奖概率详见活动页面公示。奖品以实物或页面展示为准。不同奖品中奖概率可能不同。如一等奖：XX商品（价值XXX元），共5份，中奖概率xx%
          </view>
          <view class="member-prize-draw-rules-content-desc">
            b.奖池数量有限，抽完即止，活动方保留根据实际情况调整奖池的权利。
          </view>
          <view class="member-prize-draw-rules-content-title">5.抽奖与结果</view>
          <view class="member-prize-draw-rules-content-desc">
            a.抽奖可随机获得奖池内任意奖品。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            b.抽奖结果实时显示在页面，并以系统记录为准。
          </view>
          <view class="member-prize-draw-rules-content-title">6.奖品发放</view>
          <view class="member-prize-draw-rules-content-desc">
            a.虚拟奖品（积分、优惠券、话费券等）：系统自动发放至用户大连海创嗨创生活账户/相关账户，预计中奖后24小时内到账。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            b.实物奖品：用户需在中奖后7天内登录活动页面或通过通知链接填写/确认准确有效的收货地址。逾期视为自动放弃。奖品将在地址确认后15个工作日内寄出。
          </view>
          <view class="member-prize-draw-rules-content-title">7.其他说明</view>
          <view class="member-prize-draw-rules-content-desc">
            a.用户需确保账户及个人信息（手机号、地址）真实有效。因信息错误导致奖品无法发放，责任自负。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            b.妥善保管账户，账户内操作视为本人行为。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            c.严禁作弊。一经发现，大连海创嗨创生活有权取消资格、冻结账户、回收奖品/积分，并保留法律追究权利。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            d.大连海创嗨创生活保留在法律允许范围内调整、暂停或终止活动的权利，重大变动将提前公告。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            e.因网络、系统、不可抗力等导致的问题，大连海创嗨创生活不承担责任，但将尽力解决。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            f.未成年人建议在监护人指导下参与，相关事宜由监护人负责。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            g.对积分或结果有异议，请联系客服 [0312-3038620] 反馈。
          </view>
          <view class="member-prize-draw-rules-content-desc">
            h.大连海创嗨创生活拥有对本活动规则的最终解释权。
          </view>
        </view> -->
        <!-- 抽奖规则2 -->
        <view class="member-prize-draw-rules-content">
          <view class="member-prize-draw-rules-content-title">1.参与资格</view>
          <view class="member-prize-draw-rules-content-desc">
            大连海创嗨创生活所有注册用户均可参与本次活动。
          </view>
          <view class="member-prize-draw-rules-content-title">2.参与方式</view>
          <view class="member-prize-draw-rules-content-desc">
            （1）积分参与。用户账户需持有≥{{ pointsNum }}积分，每次抽奖将消耗{{
              pointsNum
            }}积分；
          </view>
          <view class="member-prize-draw-rules-content-desc">
            （2）会员免积分参与。用户升级会员等级后，可解锁免积分抽奖权益，享受无积分消耗的抽奖机会。
          </view>
          <view class="member-prize-draw-rules-content-title">3.参与次数</view>
          <view class="member-prize-draw-rules-content-desc">
            活动参与次数不限，用户账户积分满足单次 50 积分要求，或已解锁会员免积分抽奖资格，即可随时参与。
          </view>
          <view class="member-prize-draw-rules-content-title">4.奖池说明</view>
          <view class="member-prize-draw-rules-content-desc">
            奖品类型及中奖概率如下：
          </view>
          <view class="member-prize-draw-rules-content-desc" v-for="(item, index) in prizesList">
            <!-- （1）定瓷平安扣（中奖概率2%）； -->
             {{ index + 1 }}、{{ item.prizeName }}（中奖概率{{ item.winPrizeProbability * 100 }}%）； 
          </view>
          <!-- <view class="member-prize-draw-rules-content-desc">
            （2）月饼礼盒（中奖概率4%）；
          </view>
          <view class="member-prize-draw-rules-content-desc">
            （3）福保公仔（中奖概率6%）；
          </view>
          <view class="member-prize-draw-rules-content-desc">
            （4）高山雪蜜桃汁（中奖概率8%）；
          </view>
          <view class="member-prize-draw-rules-content-desc">
            （5）19.9元电影团购券（中奖概率20%）；
          </view>
          <view class="member-prize-draw-rules-content-desc">
            （6）25元电影团购券（中奖概率20%）；
          </view>
          <view class="member-prize-draw-rules-content-desc">
            （7）月饼礼盒优惠券（中奖概率20%）。
          </view> -->
        </view>
      </view>
    </view>

    <view class="my-Modal-box" v-if="pageType !== '1'">
      <view class="my-Modal-box-close">
        <up-icon
          name="close"
          size="40rpx"
          color="#fff"
          @click="pageType = '1'"
        ></up-icon>
      </view>

      <view class="member-prize-draw-result" v-if="pageType == '2'">
        <view class="member-prize-draw-result-container">
          <view class="member-prize-draw-result-revolve-box">
            <view class="member-prize-draw-result-revolve-box-main"></view>
          </view>
          <view class="member-prize-draw-result-nomal-box">
            <view class="member-prize-draw-result-nomal-box-main2">
              <view class="member-prize-draw-result-nomal-box-main2-image">
                <image
                  class="member-prize-draw-result-nomal-box-main2-img"
                  :src="minioBaseUrl + 'common/memberCenter/member-lihe.png'"
                ></image>
              </view>
              <view class="member-prize-draw-result-nomal-box-main2-title">
                <view class="member-prize-draw-result-nomal-box-main2-title-a">
                  恭喜你获得奖品
                </view>
                <view class="member-prize-draw-result-nomal-box-main2-title-b">
                  {{ winContent }}
                </view>
                <view
                  v-if="isRealPrize"
                  class="member-prize-draw-result-nomal-box-main2-title-c"
                >
                  请填写收件地址，我们将为您寄送奖品填写后
                </view>
                <view
                  v-if="isRealPrize"
                  class="member-prize-draw-result-nomal-box-main2-title-c"
                >
                  48小时内客服将联系您确认信息，请保持电话畅通。
                </view>
                <view
                  v-if="isRealPrize"
                  class="member-prize-draw-result-nomal-box-footer"
                  @click="addAddress"
                  :style="{
                    background:
                      'url(' +
                      minioBaseUrl +
                      'common/memberCenter/member-addAddress.png) no-repeat center center / cover',
                  }"
                >
                  <!-- 填写地址 -->
                  <!-- <image class="member-prize-draw-result-nomal-box-footer-img"
                    :src="minioBaseUrl + 'common/memberCenter/member-addAddress.png'"></image> -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="member-prize-draw-result-no" v-if="pageType == '3'">
        <view class="member-prize-draw-result-container">
          <view class="member-prize-draw-result-revolve-box">
            <view class="member-prize-draw-result-revolve-box-main"></view>
          </view>
          <view class="member-prize-draw-result-nomal-box">
            <view class="member-prize-draw-result-nomal-box-main3">
              <view class="member-prize-draw-result-nomal-box-main3-image">
                <image
                  class="member-prize-draw-result-nomal-box-main3-img"
                  :src="
                    minioBaseUrl + 'common/memberCenter/member-baoxiang.png'
                  "
                ></image>
              </view>

              <view class="member-prize-draw-result-nomal-box-main3-title">
                <view class="member-prize-draw-result-nomal-box-main3-title-a"
                  >很遗憾没有中奖</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <up-modal
      :show="showModal1"
      :showConfirmButton="false"
      :showCancelButton="false"
    >
      <view class="prize-modal-slot">
        <view class="prize-modal-slot-close" @click="showModal1 = false">
          <up-icon name="close" size="36rpx"></up-icon>
        </view>
        <view class="prize-modal-slot-content">
          本次抽奖将消耗{{ pointsNum }}积分，
        </view>
        <view class="prize-modal-slot-content"> 确认开启幸运大转盘？ </view>
        <view class="prize-modal-slot-btn-group" @click="getChangeNum">
          <view class="prize-modal-slot-btn-group-item">立即试试手气</view>
        </view>
      </view>
    </up-modal>
    <!-- <up-modal
      :show="showModal2"
      :showConfirmButton="false"
      :showCancelButton="false"
    > -->
      <!-- <view class="prize-modal-slot">
        <view class="prize-modal-slot-close" @click="showModal2 = false">
          <up-icon name="close" size="36rpx"></up-icon>
        </view>
        <view class="prize-modal-slot-content2"> 还差一点点就能抽奖啦！ </view>
        <view class="prize-modal-slot-content2">
          本次抽奖需要{{ pointsNum }}积分，您当前积分不足，
        </view>
        <view class="prize-modal-slot-content2"> 可通过以下方式获取积分 </view>
        <view class="prize-modal-slot-btn-group2">
          <view
            class="prize-modal-slot-btn-group2-item"
            @click="jumpMemberSignIn"
          >
            <text class="prize-modal-slot-btn-group2-item-title"
              >1.完成签到</text
            >
            <up-icon name="arrow-rightward" color="#F49259 "></up-icon>
          </view>
          <view
            class="prize-modal-slot-btn-group2-item"
            @click="jumpMemberCenter"
          >
            <text class="prize-modal-slot-btn-group2-item-title"
              >2.完成任务</text
            >
            <up-icon name="arrow-rightward" color="#F49259 "></up-icon>
          </view>
          <view
            v-if="isHbd"
            class="prize-modal-slot-btn-group2-item"
            @click="jumpOrder"
          >
            <text class="prize-modal-slot-btn-group2-item-title"
              >3.下单赚积分</text
            >
            <up-icon name="arrow-rightward" color="#F49259 "></up-icon>
          </view>
        </view>
        <view class="prize-modal-slot-footer" @click="showModal2 = false">
          <view>稍后再说</view>
        </view>
      </view> -->

    <!-- </up-modal> -->
     <view class="prize-modal-few" v-if="showModal2">

       <view class="prize-modal-few-slot">
          <view class="prize-modal-few-slot-close" @click="showModal2 = false">
           <up-icon name="close" size="36rpx" color="#000"></up-icon>
         </view>
         <view class="prize-modal-few-slot-img">
           <image
           class="prize-modal-few-slot-image"
             :src="minioBaseUrl + 'common/memberCenter/member-prize-few.png'"
             mode="scaleToFill"
           />
         </view>
         <view class="prize-modal-few-slot-title">温馨提示</view>
         <view class="prize-modal-few-slot-content">您的积分不足<text class="prize-modal-few-slot-content-num">{{ pointsNum }}分</text>，无法参与抽奖，去完成任务赚取更多积分吧~</view>
         <view class="prize-modal-few-slot-btn" @click="showModal2 = false">我知道了</view>
       </view>
     </view>
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";

import Ldialer from "../components/lime-dialer_0.2.5/components/l-dialer/l-dialer.vue";

import {
  getNumOfPrizeDraw,
  getRaffleActivDetail,
  raffle,
  redeemNumOfActivity,
} from "../api/index";
export default {
  components: { Ldialer },
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
      isHbd: false,
      activityId: "",
      allPageBg: "",
      prizes: [],
      freePointsDraw: 0,
      availablePoints: 0,
      numberOfDrawsRemaining: 0,
      isWin: false,
      winRecordId: "",
      raffleUserId: "",
      winTitle: "",
      winContent: "",
      raffleId: "",
      isRealPrize: false, // 是否是实物奖品
      raffleIndex: 0,
      prizesList: [],
      pointsNum: 0,
      pageType: "1",
      style: "",

      showModal1: false,
      showModal2: false,
    };
  },
  async onLoad() {
    this.isHbd = this.bridgeSdk.isInHiApp();
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onShow() {
    if (this.userInfo) {
      this.initData();
    }
  },
  methods: {
    __loadData__() {
      this.getUserInfo();
    },
    getUserInfo() {
      this.userInfo = this.bridgeSdk.getUserInfo();
      console.log("用户信息", this.userInfo);

      if (!this.userInfo) {
        this.bridgeSdk.toLogin();
      } else {
        this.userId = this.userInfo.userInfo.userId;
      }
      this.initData(true);
    },
    initData(isOnLoad) {
      getNumOfPrizeDraw({}, { mask: isOnLoad }).then((res) => {
        console.log("getNumOfPrizeDraw", res);
        // raffleUserModel  -- 活动信息
        // freePointsDraw  -- 免积分抽奖次数
        // numberOfDrawsRemaining  --  剩余抽奖次数
        // availablePoints  --  剩余可用积分
        // activityId  --  活动ID
        this.numberOfDrawsRemaining = res.numberOfDrawsRemaining;
        this.freePointsDraw = res.freePointsDraw;
        this.availablePoints = res.availablePoints;
        this.activityId = res.activityId;
        this.pointsNum = res.pointsNum;
        if (isOnLoad) {
          this.getPrizeList(res.activityId);
        }
      });
    },
    getPrizeList(activityId) {
      this.prizesList = [];
      this.prizes = [];

      getRaffleActivDetail({
        _userId: this.userId,
        id: activityId,
      }).then((res) => {
        console.log("getRaffleActivDetail", res);
        let probabilityNum = 0;
        this.style = res.rafflePage.raffleStyleName;
        let prizes = [];
        this.prizesList = res.prizePool.awards;
        prizes = res.prizePool.awards.map((item) => {
          probabilityNum = probabilityNum + Number(item.winPrizeProbability);
          return {
            id: item.prizeid,
            name: item.prizeName,
          };
        });
        // this.prizes = this.prizes.concat(this.prizesList);
        if (probabilityNum < 1) {
          prizes.push({
            id: "000000000000000000",
            name: "谢谢惠顾",
          });
        }
        this.prizes = prizes;
        this.allPageBg = res.rafflePage.imageUrl;
      });
      // this.prizes = this.prizesList.map((item) => {
      //   return {
      //     id: item.id,
      //     name: item.name,
      //   };
      // });
    },
    startCallback() {
      console.log(this.numberOfDrawsRemaining, this.availablePoints);
      if (this.numberOfDrawsRemaining == 0) {
        if (Number(this.availablePoints) >= this.pointsNum) {
          this.showModal1 = true;
        } else {
          this.showModal2 = true;
        }
        // if (this.count == 0) {
        //   uni.showModal({
        //     title: "提示",
        //     content: "剩余抽奖次数为0，不可参与该活动",
        //     confirmColor: "#20a6fa",
        //     showCancel: false,
        //   });
        //   // this.noWinPrompt = '今日奖品已抽完'
        //   // this.pageType = '3';
        //   return;
        // }
        // this.getRaffle();
      } else {
        // if (this.count == 0) {
        //   uni.showModal({
        //     title: "提示",
        //     content: "剩余抽奖次数为0，请增加抽奖次数",
        //     confirmColor: "#20a6fa",
        //     showCancel: false,
        //   });
        //   // this.noWinPrompt = '今日奖品已抽完'
        //   // this.pageType = '3';
        //   return;
        // }
        this.getRaffle();
      }
      // this.$refs.myLucky.play()
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log("endCallback", prize);
      if (this.isWin) {
        // 中奖
        this.pageType = "2";
      } else {
        // 未中奖
        this.pageType = "3";
      }
    },
    getRaffle() {
      raffle({ _userId: this.userId, id: this.activityId })
        .then((res) => {
          console.log("开始抽奖", res);
          // if (res.respcode == "0000") {
          this.isWin = res.win;
          this.winRecordId = res.winRecordId;
          this.raffleUserId = res.raffleUserId;
          this.winTitle = res.title;
          this.winContent = res.title + ":" + res.content;
          this.raffleId = res.awardsId;
          if (this.raffleId && this.raffleId.length > 0) {
            this.raffleIndex = this.prizesList.findIndex(
              (item) => item.id === this.raffleId
            );
            this.isRealPrize =
              this.prizesList[this.raffleIndex].prize.prizeType == "1";
          } else {
            this.raffleIndex = this.prizesList.length;
          }
          console.log("this.raffleIndex", this.raffleIndex);
          this.initData();

          // 调用stop停止旋转并传递中奖索引
          this.$refs.dialer.run(this.raffleIndex);
          // } else {

          // }
        })
        .catch((error) => {
          uni.showToast({
            title: error.message,
            icon: "none",
            duration: 2000,
          });
        });
    },
    getChangeNum() {
      redeemNumOfActivity({
        id: this.activityId,
        pointsType: "FB",
        _userId: this.userId,
      }).then((res) => {
        console.log("redeemNumOfActivity", res);
        this.showModal1 = false;
        this.initData();
      });
    },
    // 添加地址
    addAddress() {
      this.bridgeSdk.jumpPage({
        url:
          "/package-public-act/lottery/address?winRecordId=" +
          this.winRecordId +
          "&raffleUserId=" +
          this.raffleUserId +
          "&activId=" +
          this.activId +
          "&style=" +
          this.style,
      });
    },
    // 跳转积分明细
    jumpMyPoint() {
      this.bridgeSdk.jumpPage({
        url: "/package-member-center/memberPointDetail/memberPointDetail",
      });
    },
    // 跳转权益
    jumpBenefit() {
      this.bridgeSdk.jumpPage({
        url: "/package-member-center/memberBenefit/memberBenefit",
      });
    },
    // 跳转会员中心
    jumpMemberCenter() {
      this.bridgeSdk.jumpPage({
        url: "/package-member-center/memberCenter/memberCenter?scrollTask=1",
      });
    },
    // 跳转登录页面
    jumpMemberSignIn() {
      this.bridgeSdk.jumpPage({
        url: "/package-member-center/memberSignIn/memberSignIn",
      });
    },
    jumpOrder() {
      // 跳转下单页面
      this.bridgeSdk.jumpPage({
        url: this.staticBaseUrl + "/mall/#/pages/index/index",
        // pageType: "tab",
        // tabPageId: "4"
      });
    },
    // 查看我的奖品
    jumpMyPrize() {
      this.bridgeSdk.jumpPage({
        url: `/package-member-center/memberPrizeDraw/memberMyPrize?activId=${
          this.activityId
        }&allPageBg=${encodeURIComponent(this.minioBaseUrl + this.allPageBg)}&style=${this.style}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;

  .all-page-bg-img {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .member-prize-draw-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 40rpx;
    position: relative;
    z-index: 0;

    .member-prize-draw-header {
      width: 100%;
      box-sizing: border-box;
      padding: 20rpx 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;

      .member-prize-draw-header-item {
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;

        .member-prize-draw-header-item-flex {
          display: flex;
          align-items: center;
        }
      }
    }

    .member-prize-draw-title {
      width: 620rpx;
      height: 130rpx;
      flex-shrink: 0;

      .member-prize-draw-title-img {
        width: 100%;
        height: 100%;
      }
    }

    .member-prize-draw-prompt {
      // width: 370rpx;
      height: 76rpx;
      margin-top: 22rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 25rpx;
      background: linear-gradient(to right, #ff3643, #ff716d);
      border-radius: 76rpx;
      flex-shrink: 0;

      .member-prize-draw-prompt-dot {
        width: 14rpx;
        height: 14rpx;
        border-radius: 50%;
        background-color: #ffffc6;
      }

      .member-prize-draw-prompt-text {
        color: #fff;
        font-size: 30rpx;
        font-weight: bold;
        letter-spacing: 2rpx;
      }
    }

    .member-prize-draw-turntable {
      width: 100%;
      height: 858rpx;
      position: relative;
      display: flex;
      justify-content: center;
      margin-top: 40rpx;
      flex-shrink: 0;

      .member-prize-draw-turntable-img {
        width: 100%;
        height: 858rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
      }

      .ldialer-container {
        margin-top: 50rpx;
        width: 516rpx;
        height: 516rpx;
      }
    }

    .member-prize-draw-my-prize {
      // width: 400rpx;
      // height: 40rpx;
      // width: 210rpx;
      // height: 62rpx;
      background: #ffe18d;
      box-sizing: border-box;
      padding: 6rpx 8rpx;
      border-radius: 12rpx;
      text-align: center;
      color: #fff;
      // font-size: 40rpx;
      // font-weight: bold;
      // line-height: 60rpx;
      position: relative;
      top: -230rpx;
      .member-prize-draw-my-prize-title {
        width: 194rpx;
        height: 52rpx;
        border: 2rpx solid #ff233d;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .member-prize-draw-my-prize-img {
          width: 30rpx;
          height: 28rpx;
          // margin-right: 10rpx;
        }
        .member-prize-draw-my-prize-text {
          font-size: 28rpx;
          color: #ff233d;
          // text-decoration: underline;
          line-height: 32rpx;
          border-bottom: 2rpx solid #ff233d;
          margin-left: 4rpx;
        }
      }
    }

    .member-prize-draw-rules {
      width: 622rpx;
      background: #fff7e3;
      border-radius: 20rpx;
      box-sizing: border-box;
      padding: 0 30rpx 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      position: relative;
      top: -210rpx;

      .member-prize-draw-rules-header {
        width: 404rpx;
        height: 66rpx;
        text-align: center;

        .member-prize-draw-rules-header-img {
          width: 100%;
          height: 100%;
        }
      }

      .member-prize-draw-rules-content {
        width: 100%;
        text-align: left;
        box-sizing: border-box;
        padding: 20rpx 32rpx;

        .member-prize-draw-rules-content-title {
          font-weight: bold;
          font-size: 28rpx;
          color: #333333;
          line-height: 40rpx;
        }

        .member-prize-draw-rules-content-desc {
          font-weight: bold;
          font-size: 24rpx;
          color: #333333;
          line-height: 33rpx;
          text-align: justify;
        }
      }
    }
  }

  .my-Modal-box {
    width: 750rpx;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.2);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    .my-Modal-box-close {
      width: 52rpx;
      height: 52rpx;
      border: 4rpx solid #fff;
      border-radius: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 60rpx;
    }
  }

  .member-prize-draw-result {
    width: 750rpx;
    height: 785rpx;
    padding: 38rpx 62rpx 48rpx 48rpx;
    box-sizing: border-box;
    position: relative;

    .member-prize-draw-result-container {
      width: 100%;
      height: 100%;
      position: relative;

      .member-prize-draw-result-revolve-box {
        width: 100%;
        height: 100%;
        background: #ffdcdc;
        box-shadow: 0rpx 2rpx 36rpx 0rpx #c01315,
          inset 0rpx 1rpx 49rpx 0rpx #ffffff;
        border-radius: 48rpx;
        opacity: 0.9;
        backdrop-filter: blur(10rpx);
        transform: rotate(6deg);
      }

      .member-prize-draw-result-nomal-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 48rpx;

        .member-prize-draw-result-nomal-box-main2 {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .member-prize-draw-result-nomal-box-main2-image {
            width: 240rpx;
            height: 240rpx;
            padding-top: 30rpx;

            .member-prize-draw-result-nomal-box-main2-img {
              width: 100%;
              height: 100%;
            }
          }

          .member-prize-draw-result-nomal-box-main2-title {
            width: 100%;
            box-sizing: border-box;
            padding: 0 20rpx;
            display: flex;
            flex-direction: column;
            align-items: center;

            .member-prize-draw-result-nomal-box-main2-title-a {
              font-weight: bold;
              font-size: 64rpx;
              color: #da5758;
              line-height: 79rpx;
              margin-top: 30rpx;
            }

            .member-prize-draw-result-nomal-box-main2-title-b {
              font-weight: bold;
              font-size: 32rpx;
              color: #da5758;
              line-height: 45rpx;
              margin-top: 18rpx;
            }

            .member-prize-draw-result-nomal-box-main2-title-c {
              font-weight: bold;
              font-size: 24rpx;
              color: #da5758;
              line-height: 33rpx;
              margin-top: 20rpx;
            }

            .member-prize-draw-result-nomal-box-footer {
              width: 544rpx;
              height: 98rpx;
              border-radius: 98rpx;
              margin-top: 48rpx;
              text-align: center;
              line-height: 98rpx;
              font-size: 60rpx;
              font-weight: bold;
              color: #ffffff;
              // box-shadow: 0px 2px 36px 0px rgba(0, 0, 0, 0.16),inset 0px 1px 49px 0px #ffffff;

              .member-prize-draw-result-nomal-box-footer-img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }

  .member-prize-draw-result-no {
    width: 750rpx;
    height: 673rpx;
    padding: 38rpx 62rpx 48rpx 48rpx;
    box-sizing: border-box;
    position: relative;

    .member-prize-draw-result-container {
      width: 100%;
      height: 100%;
      position: relative;

      .member-prize-draw-result-revolve-box {
        width: 100%;
        height: 100%;
        background: #ffdcdc;
        box-shadow: 0rpx 2rpx 36rpx 0rpx #c01315,
          inset 0rpx 1rpx 49rpx 0rpx #ffffff;
        border-radius: 48rpx;
        opacity: 0.9;
        backdrop-filter: blur(10rpx);
        transform: rotate(6deg);
      }

      .member-prize-draw-result-nomal-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 48rpx;

        .member-prize-draw-result-nomal-box-main3 {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .member-prize-draw-result-nomal-box-main3-image {
            width: 350rpx;
            height: 350rpx;
            padding-top: 30rpx;

            .member-prize-draw-result-nomal-box-main3-img {
              width: 100%;
              height: 100%;
            }
          }

          .member-prize-draw-result-nomal-box-main3-title {
            display: flex;
            flex-direction: column;
            align-items: center;

            .member-prize-draw-result-nomal-box-main3-title-a {
              font-weight: bold;
              font-size: 64rpx;
              color: #da5758;
              line-height: 79rpx;
              margin-top: 30rpx;
            }
          }
        }
      }
    }
  }
}

.prize-modal-slot {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  .prize-modal-slot-close {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-weight: bold;

    .prize-modal-slot-close-content {
      padding: 40rpx;
    }
  }

  .prize-modal-slot-content {
    font-weight: 600;
    font-size: 32rpx;
    color: #222222;
    line-height: 44rpx;
  }

  .prize-modal-slot-btn-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 36rpx;

    .prize-modal-slot-btn-group-item {
      font-weight: 600;
      font-size: 32rpx;
      color: #f49259;
      line-height: 44rpx;
      text-decoration-line: underline;
    }
  }

  .prize-modal-slot-content2 {
    width: 100%;
    text-align: left;
  }

  .prize-modal-slot-btn-group2 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 36rpx;

    .prize-modal-slot-btn-group2-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #f49259;
      margin-bottom: 14rpx;

      .prize-modal-slot-btn-group2-item-title {
        text-decoration-line: underline;
      }
    }
  }

  .prize-modal-slot-footer {
    width: 100%;
    margin-top: 36rpx;
    font-weight: 600;
    font-size: 32rpx;
    color: #999999;
    line-height: 44rpx;
    text-align: center;
  }
}
.prize-modal-few{
  width: 750rpx;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.6);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.prize-modal-few-slot{
  width: 516rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 36rpx;
  background: #fff;
  border-radius: 20rpx;
  .prize-modal-few-slot-close {
    width: 100%;
    box-sizing: border-box;
    padding: 0 36rpx;
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
  }
  .prize-modal-few-slot-img{
    width: 136rpx;
    height: 134rpx;
    margin-top: 5rpx;
    margin-bottom: 32rpx;
    .prize-modal-few-slot-image{
      width: 136rpx;
      height: 134rpx;
    }
  }
  .prize-modal-few-slot-title{
    font-size: 32rpx;
    font-weight: bold;
    line-height: 46rpx;
    color: #333333;
    margin-bottom: 14rpx;
  }
  .prize-modal-few-slot-content{
    width: 100%;
    box-sizing: border-box;
    color: #333333;
    padding: 0 36rpx;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 40rpx;
    text-align: center;
    margin-bottom: 34rpx;
    .prize-modal-few-slot-content-num{
      color: #FF8804;
    }
  }
  .prize-modal-few-slot-btn{
    width: 100%;
    box-sizing: border-box;
    border-top: 2rpx solid #EFEFEF;
    padding: 30rpx 0;
    text-align: center;
    font-size: 32rpx;
    line-height: 46rpx;
    font-weight: 600;
    color: #FF8804;
  }

}

.top-arc-bg {
  width: 100vw;

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    z-index: 2;

    .page-title {
      flex: 1;
      text-align: center;
      color: #fff;
      font-size: 38rpx;
      font-weight: bold;
      letter-spacing: 2rpx;
    }
  }
}
</style>