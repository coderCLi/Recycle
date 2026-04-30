<template>
  <view class="firstInModal">
    <view class="modal-content">
      <view class="modal-content-header">
        <image
          class="modal-content-header-img"
          :src="minioBaseUrl + 'common/memberCenter/member-bei.png'"
          mode="scaleToFill"
        />
      </view>
      <view class="modal-content-container">
        <view class="modal-content-container-title">叮！！！</view>
        <view class="modal-content-container-desc"
          >恭喜开启「签到赢积分」任务！</view
        >
        <view class="modal-content-container-welcom"
          >欢迎加入每日签到，轻松赚取积分！</view
        >
        <view class="modal-content-container-main">
          <view class="modal-content-container-main-title">签到规则</view>
          <view class="modal-content-container-main-desc" v-for="(item, index) in rules">
            {{ index + 1 }}. {{ item }}
          </view>
          <!-- <view class="modal-content-container-main-desc">
            1、每自然月为一个签到周期；
          </view>
          <view class="modal-content-container-main-desc">
            2、每天签到得1积分；
          </view>
          <view class="modal-content-container-main-desc">
            3、连续签到7天和14天，各额外奖励5积分；
          </view>
          <view class="modal-content-container-main-desc">
            4、若签到中断了，很可惜，只能重新计算签到 天数。
          </view>
          <view class="modal-content-container-main-desc">
            5、签到积分可在积拿商城兑换好礼、还能参与 积分抽奖活动！
          </view> -->
        </view>
      </view>
      <view class="modal-content-footer" @click="close"
        >积分等你拿，快来签到吧！</view
      >
    </view>
  </view>
</template>

<script>

export default {
  name: "firstInModal",
  props: {
    ruleList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rules:[
        "每自然月为一个签到周期",
        "每天签到得1积分",
        // "连续签到额外奖励积分",
        // "若签到中断了，很可惜，只能重新计算签到天数",
        "签到积分可在积分商城兑换好礼、还能参与积分抽奖活动！"
      ]
    }
  },
  watch: {
    ruleList: {
      handler(newVal, oldVal) {
        console.log(newVal)
        // if(newVal.length > 0){
        //   let content = ""
        //   newVal.forEach(item => {
        //     content += item.ruleTypeName + item.triggerDays + "天," + "额外奖励" + (item.rewardType == "MAGNIFICATION"? item.magnificationValue : item.rewardValue) + item.rewardTypeName
        //   })
        //   this.rules.splice(2, 1, content)
        // }
      },
      deep: true,
    },
    rules: {
      handler(newVal, oldVal) {},
      deep: true,
    }
  },
  mounted(){
    console.log(this.ruleList)
    if(this.ruleList.length > 0){
      let content = ""
      this.ruleList.forEach(item => {
        content += item.ruleTypeName + item.triggerDays + "天," + "额外奖励"+ (item.rewardType == "MAGNIFICATION" ? item.magnificationValue : item.rewardValue) + item.rewardTypeName + ";";
      })
      this.rules.splice(2, 1, content)
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss">
.firstInModal {
  width: 100vw;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.4);
  position: absolute;
  top: 0;
  .modal-content {
    position: absolute;
    top: 20%;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    .modal-content-header {
      width: 510rpx;
      height: 290rpx;
      margin-bottom: -40rpx;
      .modal-content-header-img {
        width: 100%;
        height: 100%;
      }
    }
    .modal-content-container {
      width: 616rpx;
      box-sizing: border-box;
      padding: 26rpx 20rpx 40rpx;
      background: #fff;
      border-radius: 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .modal-content-container-welcom {
        font-weight: 400;
        font-size: 24rpx;
        color: #bb782a;
        line-height: 44rpx;
        margin-top: 12rpx;
      }
      .modal-content-container-main {
        width: 100%;
        padding: 12rpx 24rpx;
        box-sizing: border-box;
        margin-top: 40rpx;
        background: #dce2ed;
        border-radius: 20rpx;
        opacity: 0.61;
        .modal-content-container-main-title {
          width: 100%;
          text-align: center;
          font-weight: 600;
          font-size: 24rpx;
          color: #333333;
          line-height: 44rpx;
        }
        .modal-content-container-main-desc {
          font-weight: 400;
          font-size: 20rpx;
          color: #666666;
          line-height: 28rpx;
        }
      }
    }
  }
  .modal-content-footer {
    width: 512rpx;
    height: 80rpx;
    background: #ffd9ad;
    border-radius: 40rpx;
    border: 1px solid #7e522d;
    font-weight: 500;
    font-size: 28rpx;
    color: #7e522d;
    line-height: 80rpx;
    text-align: center;
    margin-top: 40rpx;
  }
}
</style>