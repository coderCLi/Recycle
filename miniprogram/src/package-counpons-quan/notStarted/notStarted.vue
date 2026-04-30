<!-- 
 Description:领券活动未开始页 
 createdTime：2024/11/04 09:20:00
 -->
<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-status-bar />
  <vc-navbar :props-data="propsData" />
  <div class="unstart">
    <div
      class="coupon-container"
      :style="{ backgroundImage: `url(${this.staticBaseUrl}/hbdimage/counponsQuan/beijing.png)` }"
    >
      <div
        class="coupon-content"
        :style="{ backgroundImage: `url(${this.staticBaseUrl}/hbdimage/counponsQuan/unstart01.png)` }"
      >
        <div class="time-title">
          消费券领取时间:{{ beginDate }}-{{ endDate }}
        </div>
        <div class="bottom-text">
          <div class="btitle">本活动于{{ bottomDate }}开始</div>
          <div class="wait">敬请期待</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivityRules, getActivityState } from '../api/activity'
import { formatDate } from '../components/time'
import { toast } from '@/uni_modules/uview-plus'
export default {
  name: 'notStarted',
  components: {},
  data () {
    return {
      propsData:{
            props: {
                title: {
                  value: '活动未开始'
                },
                // fixed: {
                //   value: true
                // },
            }
        },  
      beginDate: '',
      endDate: '',
      bottomDate: '',
      activityId: ''
    }
  },
  watch: {},
  async onLoad (options) {
    this.activityId = options.activityId
    await this.getRules()

  },
  async mounted () {
    // await this.redirectUrlFun()
    await this.getRules()
  },
  methods: {
    async redirectUrlFun () {
      let { data } = await getActivityState({ "activityId": this.activityId })
      if (data.respcode != '0002') {
        this.bridgeSdk.jumpPage({
          contentType: 3,
          url: '/package-counpons-quan/alreadyStarted/alreadyStarted?needLogin=false&activityId=' + this.activityId,
        })
      } else {
        await this.getRules()
      }
    },
    async getRules () {
      try {
        const { data } = await getActivityRules({ id: this.activityId })
        const { beginTime, endTime } = data.result
        this.beginDate = formatDate(beginTime)
        this.endDate = formatDate(endTime)
        this.bottomDate = formatDate(beginTime, 'MMDD')
      } catch (error) {
        console.error('获取规则错误:', error)
        toast('获取活动信息失败，请稍后重试')
      }
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
  margin-top: 780rpx;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  .time-title {
    height: 100rpx;
    line-height: 110rpx;
    font-weight: 700;
    color: #ff331c;
    text-align: center;
    font-size: 28rpx;
  }
}
.bottom-text {
  margin-top: 400rpx;
  .btitle {
    font-weight: 800;
    font-size: 32rpx;
    color: #891700;
    text-align: center;
  }
  .wait {
    font-weight: 800;
    font-size: 54rpx;
    color: #891700;
    text-align: center;
  }
}
</style>