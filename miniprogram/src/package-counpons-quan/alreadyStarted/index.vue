<!-- 
 Description:领券活动页  
 createdTime：2024/11/01 14:20:00
 -->
<template>
  <vc-modal ref="modal"></vc-modal>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container ref="startContainer" :props-data="{ props: { title: { value: list.name ? list.name : '领券'  } } }">
    <view class="coupon-container" :style="{ backgroundImage: 'url(' + url + ')' }">
      <view class="coupon-content"
        :style="{ backgroundImage: `url(${this.staticBaseUrl}/minio/common/fiveAct/couponCard.png)` }">
        <view class="time-title">
          消费券领取时间:{{ beginDate }}-{{ endDate }}
        </view>
        <view class="contBox" v-if="list.poolList">
          <view class="card-item"
            :style="{ backgroundImage: `url(${this.staticBaseUrl}/hbdimage/counponsQuan/jiangquan-01.png)` }"
            v-for="(item, index) in list.poolList[0].collectInfoList" :key="index">
            <view class="left_img">
              <!-- <view class="img_style"></view> -->
              <img :src="this.staticBaseUrl + '/hbdimage/counponsQuan/prize_ico.png'" alt="" class="img_style" />
            </view>
            <view class="cen_text">
              <view class="text_top">{{ item.prizeName }}</view>
              <!-- <view class="text_bot">{{ item.prizeName }}</view> -->
            </view>
            <view class="right_img" @click="toGet(item, index)" v-if="item.status == 0 || !item.status">
              <img :src="this.staticBaseUrl + '/hbdimage/counponsQuan/lingqu2.png'" alt="" class="img_style" />
            </view>
            <view class="right_img" @click="toViewOwern" v-if="item.status == 1">
              <img :src="this.staticBaseUrl + '/hbdimage/counponsQuan/yilingqu.png'" alt="" class="img_style" />
            </view>
            <view class="right_img" v-if="item.status == 2">
              <img :src="this.staticBaseUrl + '/hbdimage/counponsQuan/yiqiangguang.png'" alt="" class="img_style" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </vc-container>

</template>

<script>
import { formatActivDate } from '../components/time'
import { getCouponActivPage, couinitUser, doCoupon } from '../api/activity'

export default {
  name: 'alreadyStarted',
  data() {
    return {
      // propsData: {
      //           props: {
      //               title: {
      //                   value: '领券'
      //               },
      //           }
      //       },
      // baseUrl: this.staticBaseUrl,
      prizeList: [],
      beginDate: '',
      endDate: '',
      activityId: '',
      userId: '',
      userInfo: {},
      // id:'147d80c5-79a0-11ef-86c8-0242ac110003'
      // show: false,
      showPop: false,
      list: '',
      url: '',
      channlType: '',
      ip: ''
    }
  },
  async onLoad(options) { 
    this.activityId = options.activeId
    // this.activityId = "153dad52e778409c9fbe5fc9275152d9"
    // 每个页面必须这么写
    if(!this.bridgeSdk.isTokenValid()){
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  methods: {
    __loadData__() {
      this.getLoginInfo()
      // console.log(this.bridgeSdk.getDeviceInfo());
      this.ip = this.bridgeSdk.getDeviceInfo().ip ? this.bridgeSdk.getDeviceInfo().ip : '192.168.1.2'
    },
    async getLoginInfo() {
      this.userInfo = this.bridgeSdk.getUserInfo()
      this.channlType = await this.bridgeSdk.getChannel()
      if(!this.userInfo){
        this.bridgeSdk.toLogin()
      }else{
        this.userId = this.userInfo.userInfo.userId
        this.getCouponList()
        this.couinitUser()
      }
    },
    // 获取优惠券列表
    getCouponList() {
      getCouponActivPage({
        activId: this.activityId,
        _userId: this.userId
      }).then((res) => {
        console.log("getCouponActivPage", res);
        // if (res.respcode === "0000") {
        // this.list = res.result[2]
        let flag = false; // 判断活动是否存在
        if (res.length > 0) {
          res.forEach(item => {
            if (item.id == this.activityId) {
              flag = true
              this.list = item
              this.list.poolList[0].collectInfoList.forEach(item => {
                item.status == 0
              })
              this.beginDate = formatActivDate(item.beginTime).topDate
              this.endDate = formatActivDate(item.endTime).topDate
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
        this.url = this.minioBaseUrl + this.list.pageCover.picUrl;

        this.$refs.startContainer.setNavPropsData({
            title: {
                value: this.list.name
            }
        });

        // } else {
        //   uni.showToast({
        //     title: `${res.respmsg}`,
        //     icon: 'none',
        //     duration: 2000
        //   });
        // }
      }).catch(error => {
        uni.showToast({
          title: `${error.message}`,
          icon: 'none',
          duration: 2000
        });
      })
    },
    async toGet(item, index) {

      console.log('领取优惠券', item, index);
      console.log('userInfo', this.userInfo);
      if (this.userInfo == undefined || this.userInfo == null || this.userInfo.userInfo.userId == undefined) {
        this.bridgeSdk.toLogin()
        return
      } else {
        this.userId = this.userInfo.userInfo.userId
      }
      console.log('doCoupon');
      let params = {
        id: this.activityId,
        awardsId: item.id,
        _userId: this.userId,
        _channelType: this.channlType,
        ip: this.ip
      }
      console.log('params', params);

      doCoupon(params).then((res) => {
        console.log(res);
        item.status = 1  // 状态设置为已领取
        uni.showToast({
          title: `${this.list.content ? this.list.content : '领取成功'}`,
          icon: 'none',
          duration: 2000
        });
       
      }).catch(error => {
        console.log('领券返回的结果', error);
        if(error.code === '0001'){  //活动已结束
        // item.status = 1  // 状态设置为已领取
        }
        if(error.code === '0011'){
          item.status = 2  // 状态设置为已抢光

          uni.showToast({
            title: `今日优惠券已抢光`,
            icon: 'none',
            duration: 2000
          });
          return;

        }
        if(error.code === '0009' && this.list.activStatus == '1'){
          this.bridgeSdk.showAlert({
            content: "您已达到此优惠券领取上限，去看看其他优惠券吧!",
            confirmText: "确定",
            confirmCallback: (res) => {
              item.status = 1  // 状态设置为已领取
            }
          });
          return
        }
        let message = ''

        if (error.message.includes('[')) {
           message = error.message.replace(/\[.*?\]/g, '')  //去除返回信息的[]
        }
        console.log('error.message', message);
        
        uni.showToast({
          title: `${message}`,
          icon: 'none',
          duration: 2000
        });
      })
    },
    //查看我的奖券
    toViewOwern() {
      this.bridgeSdk.showConfirm({
      content: "确定前去查看奖券吗?",
      confirmText: "确定",
      cancelText: "取消",
      confirmCallback: (res) => {
        this.bridgeSdk.jumpPage({
          url: '/package-cards-platform/card/cardList'
        })
      },
      cancelCallback: (res) => {
        console.log("点击取消", res);
      }
    });
    },
    // 初始化用户
    async couinitUser() {
      let params = { id: this.activityId, _userId: this.userId }
      console.log('couinitUser', params);
      let res = await couinitUser(params)
      // if (res.respcode === '0000') {

      // } else {
      //   // uni.showToast({
      //   //   title: `${res.respmsg}`,
      //   //   icon: 'none',
      //   //   duration: 2000
      //   // });
      // }
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
  overflow: auto;
  }

.coupon-content {
  width: 96%;
  height: 790rpx;
  margin: 0 auto;
  margin-top: 780rpx;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  .time-title {
    // height: 100rpx;
    // line-height: 110rpx;
    padding: 36rpx 0 12rpx;
    font-weight: 700;
    color: #ff331c;
    font-size: 26rpx;
    text-align: center;
    text-shadow: 0rpx 0rpx 20rpx  #fff;
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
  display: none;
  /* 隐藏滚动条 */
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
      height: 80rpx;
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
      -webkit-line-clamp: 2;
      /* 显示的行数 */
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 96rpx;
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

.card-list {
  padding: 40rpx 100rpx 40rpx 100rpx;
  border-radius: 28rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #222222;
  text-align: center;
}

.btn-box {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 80rpx);
  margin: 0 auto;
  margin-bottom: 40rpx;

  view {
    border-radius: 42rpx;
    font-weight: 600;
    font-size: 32rpx;
    padding: 20rpx 100rpx;
  }

  .btn-cancel {
    color: #222222;
    border: 2rpx solid #aaaaaa;
    background-color: #fff;
  }

  .btn-confirm {
    color: #fff;
    background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #ff5871;
    border-radius: 42rpx;
  }
}

.one-btn {
  justify-content: center;
}
</style>