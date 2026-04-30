<!-- 
 Description:领券活动页 
 createdTime：2024/11/01 14:20:00
 -->
<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-status-bar /> 
  <vc-navbar :props-data="propsData" />
  <div>
    <div class="coupon-container" :style="{ backgroundImage: `url(${this.staticBaseUrl}/hbdimage/counponsQuan/beijing.png)` }">
      <div
        class="coupon-content"
        :style="{ backgroundImage: `url(${this.staticBaseUrl}/hbdimage/counponsQuan/lingqu-03.png)` }"
      >
        <div class="time-title">
          消费券领取时间:{{ beginDate }}-{{ endDate }}
        </div>
        <div class="contBox">
          <div
            class="card-item"
            :style="{ backgroundImage: `url(${this.staticBaseUrl}/hbdimage/counponsQuan/jiangquan-01.png)` }"
            v-for="(item, index) in prizeList"
            :key="index"
          >
            <div class="left_img">
              <img :src="item.prizeRealUrl" alt="" class="img_style" />
            </div>
            <div class="cen_text">
              <div class="text_top">{{ item.prizeName }}</div>
              <!-- <div class="text_bot">{{ item.prizeRemark }}</div> -->
            </div>
            <div
              class="right_img"
              @click="toGet(item, index)"
              v-if="item.status == 0"
            >
              <img :src="this.staticBaseUrl + '/hbdimage/counponsQuan/lingqu2.png'" alt="" class="img_style" />
            </div>
            <div class="right_img" @click="toViewOwern" v-if="item.status == 1">
              <img :src="this.staticBaseUrl + '/hbdimage/counponsQuan/yilingqu.png'" alt="" class="img_style" />
            </div>
            <div class="right_img" v-if="item.status == 2">
              <img :src="this.staticBaseUrl  + '/hbdimage/counponsQuan/yiqiangguang.png'" alt="" class="img_style" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <up-modal
    :show="show"
    :title="title"
    :content="content"
    :showCancelButton="true"
    @confirm="confirm"
    @cancel="cancel"
  >
    <view class="slot-content">
      <test style="test-align: center">{{ content }} </test>
    </view>
  </up-modal>
</template>

<script>
import { formatDate } from '../components/time'
import { receiveRewards, getReceiveRewardsInfo, getActivityRules } from '../api/activity'
import { toast } from '@/uni_modules/uview-plus'

export default {
  name: 'alreadyStarted',
  data () {
    return {
        propsData:{
            props: {
                title: {
                  value: '活动开始'
                },
                // fixed: {
                //   value: true
                // },
            }
        }, 
      baseUrl: this.minioBaseUrl,
      prizeList: [],
      beginDate: '',
      endDate: '',
      activityId: '',
      userId: '',
      userInfo: {},
      // id:'147d80c5-79a0-11ef-86c8-0242ac110003'
      show: false,
      title: '',
      content: ''
    }
  },
  async onLoad (options) {
    this.activityId = options.activityId
    this.getLoginInfo()
    await Promise.all([this.getRewards(), this.getRules()]) // 并行获取数据
  },
  methods: {
    getLoginInfo () {
      this.userInfo = this.bridgeSdk.getUserInfo()
      if (!this.userInfo) {
        this.show = true
        this.title = '提示'
        this.content = '当前未登录，是否前往登录'
      } else {
        this.userId = this.userInfo.id
      }
    },
    confirm () {
      this.show = false
      bridgeSdk.toLogin()
    },
    cancel () {
      this.show = false
    },
    async getRules () {
      try {
        const { data } = await getActivityRules({ id: this.activityId })
        this.beginDate = formatDate(data.result.beginTime)
        this.endDate = formatDate(data.result.endTime)
      } catch (e) {
        console.error('获取活动规则失败:', e)
        toast('获取活动规则失败，请稍后重试')
      }
    },
    async getRewards () {
      try {
        const { data: { beans } } = await receiveRewards({ activityId: this.activityId })
        this.prizeList = beans.map(item => ({
          ...item,
          prizeRealUrl: `${this.baseUrl}${item.prizeUrl}`,
          status: 0
        }))
      } catch (e) {
        console.error('获取优惠券失败:', e)
        toast('获取优惠券失败，请稍后重试')
      }
    },
    async toGet (item, index) {
      if (this.userInfo == undefined || this.userInfo == null || this.userInfo.id == undefined) {
        this.getLoginInfo()
        return
      }
      try {
        const { data: { respcode, respmsg } } = await getReceiveRewardsInfo({
          activityId: this.activityId,
          userId: this.userId,
          prizeId: item.prizeId
        })

        if (respcode == '0000') {
          //领取成功
          toast('领取成功')
          this.$set(this.prizeList[index], 'status', 1)

        } else if (respcode == '0003') {
          //重复参与，已抢到
          toast(respmsg)
          this.$set(this.prizeList[index], 'status', 1)

        } else if (respcode == '0004') {
          //抢光了
          toast('当前券已抢光，明日再来哦')
          this.$set(this.prizeList[index], 'status', 2)
        }
      } catch (e) {
        console.error('领取优惠券失败:', e)
        toast('领取优惠券失败，请稍后重试')
      }
    },
    //查看我的奖券
    toViewOwern () {
      //     Dialog.confirm({
      //        title: '温馨提示',
      //        message: '确定前去查看奖券吗?',
      //    }).then(()=>{
      //        this.toPage({name:'我的券包',path: "/couponfxxf"})
      //    }).catch(()=>{

      //    })
    }
  },
}
</script>

<style lang='scss' scoped>
.coupon-container {
  width: 100%;
  min-height: 100vh;
  background-size: 100% auto;
  background-color: #ff331c;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}
.coupon-content {
  width: 96%;
  height: 780rpx;
  margin: 0 auto;
  margin-top: 710rpx;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  .time-title {
    height: 100rpx;
    line-height: 110rpx;
    font-weight: 700;
    color: #ff331c;
    font-size: 28rpx;

    text-align: center;
  }
}
.contBox {
  width: 89%;
  height: 590rpx;
  margin: 0 auto;
  margin-top: 40rpx;
  overflow-y: scroll;
}
/* 隐藏滚动条 */
.contBox::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}
.card-item {
  width: 95%;
  height: 140rpx;
  margin: 0 auto 8rpx;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 30rpx;
  padding-right: 10rpx;
  box-sizing: border-box;
  overflow: hidden;
  .left_img {
    width: 80rpx;
    height: 80rpx;
    .img_style {
      width: 80rpx;
      height:  80rpx;
    }
  }
  .cen_text {
    width: 320rpx;
    .text_top {
      font-size: 28rpx;
      font-weight: 600;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 显示的行数 */
      overflow: hidden;
      text-overflow: ellipsis;
      max-height:96rpx ;
    }
    .text_bot {
      font-size: 24rpx;
      color: #ccc;
      // overflow: hidden;
      // text-overflow:ellipsis;
      // white-space: nowrap;
    }
  }
  .right_img {
    width: 120rpx;
    height: 80rpx;
    .img_style {
      width: 110rpx;
      height: 50rpx;
      margin-top: 14rpx;
    }
  }
}
</style>