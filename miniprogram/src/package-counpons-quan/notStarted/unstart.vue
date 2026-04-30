<!-- 
 Description:领券活动未开始页  
 createdTime：2024/11/04 09:20:00
 -->
 <template>
  <vc-modal ref="modal"></vc-modal>
 <vc-container ref="unstartContainer" :props-data="{ props: { title: { value: list.name ? list.name : '领券'  } } }">
   <view class="unstart">
     <view
       class="coupon-container"
       :style="{ backgroundImage: `url(${url})` }"
     >
     
       <view
         class="coupon-content"
         :style="{ backgroundImage: `url(${this.staticBaseUrl}/minio/common/fiveAct/unstartCard.png)` }"
       >
         <view class="time-title">
           消费券领取时间:{{ beginDate }}-{{ endDate }}
         </view>
         <view class="bottom-text">
          <!-- 未开始情况 -->
          <template v-if="nowStatus == 'unstart'">
            <view class="btitle">本活动于{{ bottomDate }}开始</view>
            <view class="wait">敬请期待</view>
          </template>
          <!-- 已结束情况 -->
          <template v-else-if="nowStatus == 'finished'">
            <view class="btitle">本活动已于{{ bottomDate }}结束</view>
            <view class="wait">敬请期待下次活动</view>
          </template>
         </view>
       </view>


     </view>
   </view>
 </vc-container>
 </template>
 
 <script>
import { getCouponActivPage } from '../api/activity'
 import { formatActivDate } from '../components/time'
 export default {
   name: 'unstart',
   components: {},
   data () {
     return {
      propsData: {
        props: {
          title: {
            value: "领券",
          }
        },
      },
       beginDate: '',
       endDate: '',
       bottomDate: '',
       activityId: '',
       url: '',
       list: [],
       userInfo: {},
       userId: '',
       nowStatus: 'unstart',//当前状态 unstart-未开始，started-活动中（重定向至活动页），finished-已结束
     }
   },
   watch: {},
   async onLoad (options) {
     this.activityId = options.activeId
     if(!this.bridgeSdk.isTokenValid()){
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
   },

   methods: {
   async __loadData__(){
      this.userInfo = this.bridgeSdk.getUserInfo()
      if(!this.userInfo){
        this.bridgeSdk.toLogin()
      }else{
        this.userId = this.userInfo.userInfo.userId
        this.getCouponList()
      }
    },
    // 获取优惠券列表
     getCouponList() {
      getCouponActivPage({
        activId: this.activityId,
        _userId: this.userId
      }).then((res) => {
        console.log("活动信息--", res);
        let flag = false; // 判断活动是否存在
        if (res.length > 0) {
          res.forEach(item => {
            if (item.id == this.activityId) {
              flag = true
              this.list = item
              this.beginDate = formatActivDate(item.beginTime).topDate
              this.endDate = formatActivDate(item.endTime).topDate
              this.bottomDate = formatActivDate(item.endTime).bottomDate

              //activStatus  0 未开始 1 进行中 2 已结束
              if(this.list.activStatus == '0') {
                this.nowStatus = 'unstart'
              }
              // 活动开始
              else if(this.list.activStatus == '1'){ 
                this.bridgeSdk.jumpPage({
                  url: `/package-counpons-quan/alreadyStarted/index?activeId=${this.activityId}`,
                  openType: 'redirectTo'
                })
                this.nowStatus = 'started'
              }
              //活动已结束
              else{
                this.nowStatus = 'finished'
              } 
            }
          })

        }
        if (!flag) {
          this.bridgeSdk.showAlert({
            content: '活动不存在或活动已结束',
            confirmText: '确定',
            confirmCallback: () => {
              this.bridgeSdk.navigateBackTo({
                delta: 1
              });
            }
          })
          return
        }
        console.log('优惠券数据', this.list);
        this.url = this.minioBaseUrl + this.list.pageCover.picUrl
      }).catch(error => {
        uni.showToast({
          title: `${error.message}`,
          icon: 'none',
          duration: 2000
        });
      })
    },
   },
 }
 </script>
 
 <style lang='scss' scoped>
 .coupon-container {
   width: 100%;
   min-height: 100vh;
   background-size: 100% auto;
   background-color: #BD0D0D;
   background-repeat: no-repeat;
   position: relative;
   overflow: hidden;
 }
 .coupon-content {
   width: 96%;
   height: 780rpx;
   margin: 0 auto;
   margin-top: 790rpx;
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
     color: #AF0606;
     text-align: center;
   }
   .wait {
     font-weight: 800;
     font-size: 54rpx;
     color: #AF0606;
     text-align: center;
   }
 }
 </style>