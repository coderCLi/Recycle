<!--
 * @Description: 消息中心
 * @Author: chenyulong
 * @Date: 2024-12-19 13:49:45
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-27 16:03:08
 * @Remark: 
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <div class="messagePage">
    <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: -1;">
      <view class="top-bg2"></view>
    </view>
    <view class="messageHeader">
      <vc-status-bar />
      <vc-navbar :props-data="propsData">
        <template #centerIcon>
          <image :src="staticBaseUrl + '/hbdimage/main/images/mine/zidongqingli.png'" class="navbarCenterImg"
            @click="allReaded"></image>
        </template>
        <!-- <template #right>
          <view>
            <image
              :src="staticBaseUrl + '/hbdimage/main/images/mine/kefu.png'"
              class="navbarRightImg"
              @click="jumpService"
            ></image>
            <image
              :src="staticBaseUrl + '/hbdimage/main/images/mine/shezhi.png'"
              class="navbarRightImg"
              @click="jumpSetting"
            ></image>
          </view>
        </template> -->
      </vc-navbar>
    </view>
    <view class="messageMain" :style="{ paddingTop: mainTop + 'px' }">
      <vc-login v-if="!isLogined" />
      <template v-else>
        <view class="messageTabbar">
          <view class="messageTabbarBox">
            <view v-for="(item, index) in tabbarList" :key="index" class="messageTabbarBoxItem">
              <view class="content" style="position: relative;" :class="{ active: activeIndex === index }" @click="tabChange(index,item)">
                {{ item.messageTypeIdName}}
                <!--注释 <text v-if="item.noReadCount > 0" class="dot">{{item.noReadCount}}</text> -->
                 <!-- <text v-if="item.noReadCount > 0">{{item.noReadCount}}</text> -->
                  <view v-if="item.noReadCount > 0" class="dot">
                    <!-- {{item.noReadCount>99?'99+':item.noReadCount }} -->
                    {{item.noReadCount>99?'99+':item.noReadCount }}
                    <!-- <up-badge  max="99" :absolute="true"  :value="item.noReadCount"></up-badge> -->
                  </view>
              </view>
             
              <view v-if="activeIndex === index" class="activeLine"></view>
            </view>
          </view>
        </view>
        <view v-if="dataList.length" class="messageContent">
          <view v-for="(item, index) in dataList" :key="index">
            <view class="messageContentItem" @click="detail(index, item)">
              <view class="time">{{ showTime(item.pushTime) }}</view>
              <view class="title">
                <text v-if="item.readStatus != '1' && isRead.indexOf(index) == -1" class="dot"></text>
                {{ item.title }}
              </view>
              <view class="content">
                <view v-html="bridgeSdk.addMinioPrefixToImgSrc(item.content)"></view>
                <!-- <rich-text class="content" :nodes="bridgeSdk.addMinioPrefixToImgSrc(item.content)"></rich-text> -->
              </view>
            </view>
          </view>
        </view>
        <vc-empty v-else />
      </template>
    </view>
  </div>

    <view class="u-sub" @click="toIntelService">
        <u-icon :name="minioBaseUrl+'hbdbucket/message/kefu.png'" size="60" ></u-icon>
    </view>
    <view class="u-setting" @click="jumpSetting">
       <u-icon :name="minioBaseUrl+'hbdbucket/message/setting.png'" size="60" ></u-icon>
    </view>
    
</template>

<script>
import { getNotifyList, getNotifyCount, readAllNotify, getReadInfo ,pushConfigurationQuery} from "@/api/mine";
import { mapState } from "pinia";
import { useBaseStore, useUserStore } from "@/store/index";
export default {
  name: "message",
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: "消息中心",
          },
        },
      },
      tabbarList: [
        // {
        //   messageTypeId: "1",
        //   messageTypeIdName: "通知消息",
        //   noReadCount: 0,
          
        // },
      ],
      activeIndex: 0,
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      dataList: [],
      status: "loading",
      isRead: [], //已经阅读过的消息
      messageTypeId:'',
      // mainTop: 0,
    };
  },
  async onLoad(options) {
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onShow() {
    this.pageCurrent = 1;
    this.activeIndex = 0;
    this.__loadData__();
  },
  onReachBottom() {
    let allTotal = this.pageCurrent * this.pageSize;
    if (allTotal < this.total) {
      this.status = "loading";
      this.pageCurrent++;
      this.getList();
    } else {
      this.status = "nomore";
    }
  },
  onPullDownRefresh() {
    this.pageCurrent = 1;
    //调用获取数据方法
    this.tabbarList();
    setTimeout(() => {
      //结束下拉刷新
      uni.stopPullDownRefresh();
    }, 1000);
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
    ...mapState(useUserStore, {
      isLogined: "isLogined",
    }),
    mainTop() {
      let mainTop = 0;getNotifyList.do
      // mainTop = this.safeTopDistance;
      mainTop += this.navigationBarInfo.statusBarHeight;
      mainTop += this.navigationBarInfo.navigationBarHeight;
      // this.mainTop = mainTop;
      return mainTop;
    },
  },
  methods: {
    onBack(index) {
      console.log(index,'index')
      this.activeIndex = index;
      this.pageCurrent = 1;
      this.pageSize = 10;
      this.getNotifyCount();
    },
    toIntelService() {
      console.log("点击了客服");
      this.bridgeSdk.toIntelligentService();
    },
    reset() {
      this.pageCurrent = 1;
      this.activeIndex = 0;
    },
    __loadData__() {
      this.getNotifyCount();
    },
    showTime(v) {
      return v;
    },
    tabChange(index,item) {
      this.messageTypeId = item.messageTypeId;
      this.pageCurrent = 1;
      this.pageSize = 10;
      // alert('1451')
      this.activeIndex = index;
      this.getList();
    },
    getList() {
      // if (new Date().getTime() - this.time < 1000) { return; }
      // this.time = new Date().getTime();
      getNotifyList({
        page: this.pageCurrent,
        rows: this.pageSize,
        messageTypeId:this.messageTypeId
      }).then((res) => {
        
        // this.pageCurrent = 1;
        if (this.pageCurrent == 1) {
          this.dataList = [];
        }
        console.log("getNotifyList rrrrrrrrrrrrrrrrrrrrrrrr", res);
        this.dataList = this.dataList.concat(res.list);
        this.total = res.total;
        let allTotal = this.pageCurrent * this.pageSize;
        if (allTotal < this.total) {
          this.status = "loadmore";
        } else {
          this.status = "nomore";
        }
      });
    },
    getNotifyCount() {
      if (new Date().getTime() - this.time1 < 1000) { return; }
      this.time1 = new Date().getTime();
      getNotifyCount({messageTypeId:'all'}).then((res) => {
        console.log("getNotifyCount ", res);
         this.tabbarList = res.messageTypeNoReadCount;

         // 默认
         if (!res || !res.messageTypeNoReadCount || res.messageTypeNoReadCount.length == 0) {
          console.log('默认')
          this.tabbarList = JSON.parse(`[{"messageTypeId":"JG000","messageTypeIdName":"通知消息","noReadCount":"0"},{"messageTypeId":"JG001","messageTypeIdName":"订单消息","noReadCount":"0"},{"messageTypeId":"JG003","messageTypeIdName":"活动消息","noReadCount":"0"},{"messageTypeId":"JG004","messageTypeIdName":"促销优惠","noReadCount":"0"},{"messageTypeId":"JG005","messageTypeIdName":"我的订阅","noReadCount":"0"}]`)
         }

         this.messageTypeId = this.tabbarList[this.activeIndex].messageTypeId;
        let count =res.totalNoReadCount>99?'99+':res.totalNoReadCount;
        this.propsData.props.title.value = res.totalNoReadCount >0? "消息中心（" + count + "）" : "消息中心";
        this.getList();
      });
    },
    allReaded() {
      this.$refs.modal.open({
        content: "确定所有未读消息标记为已读？",
        confirmCallback: (res) => {

          this.trackReport.trackCustom("消息清理");
          
          readAllNotify({}).then((res) => {
            this.activeIndex =0;
            this.pageCurrent = 1;
            this.pageSize = 10;
            this.getNotifyCount();
            this.getTabList();
          });
        },
      });
    },
    // jumpService() {
    //   this.bridgeSdk.toIntelligentService();
    // },
    jumpSetting() {
      this.bridgeSdk.jumpPage({
        url: "/pages/message/setMessage",
      });
    },
    detail(index, item) {
      console.log("detail", index, item);
      
      let msgId = {
        notifyId: this.dataList[index].id,
        readTranceId: this.dataList[index].readTranceId,


      }

      if (item.type == '2') {
        this.haveRead(msgId);

        let url = item.content;
        if(this.bridgeSdk.isHbdDomain(url)){
          url = url.indexOf("appToken") > -1 ? url : url += "&appToken=" + this.bridgeSdk.getStorageSync('appToken');
        }

        this.bridgeSdk.jumpPage({
          title: this.propsData.props.title.value + '-' + item.title,
          index:this.activeIndex,
          url: url,
        })
      } else if (item.type == '1' || !item.type) {
        this.bridgeSdk.jumpPage({
          title: this.propsData.props.title.value + '-' + item.title,
          url: `/pages/message/detail?id=${this.dataList[index].id}&readTranceId=${this.dataList[index].readTranceId}&activeIndex=${this.activeIndex}` ,
        });
      }
      //标识该消息已经被点击阅读过
      // if (this.isRead.indexOf(index) == -1 && item.readStatus != '1') {
      //   this.isRead.push(index);
      // }
    },
    haveRead(msgId) {
      getReadInfo(msgId).then(res => {
        console.log(res);
        // this.info = res;
      });
    }
  },
};
</script>

<style scoped lang="scss">
  .u-sub {
        z-index: 991;
        position: fixed;
        right: 30rpx;
        bottom: 20%;
        display: flex;
        width: 80rpx;
        height: 80rpx;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        border-radius: 50%;
        box-shadow: 0rpx 4rpx 18rpx 0rpx rgba(0,0,0,0.16);
    }
    .u-setting{
       z-index: 991;
        position: fixed;
        right: 30rpx;
        bottom: 13%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: #FFFFFF;
        box-shadow: 0rpx 4rpx 18rpx 0rpx rgba(0,0,0,0.16);
    }
.messagePage {
  text-align: left;

  .messageHeader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .messageMain {
    box-sizing: border-box;
  }

  .navbarCenterImg {
    width: 26rpx;
    height: 32rpx;
    padding-left: 8rpx;
  }

  .navbarRightImg {
    width: 36rpx;
    height: 36rpx;
    padding-left: 28rpx;
  }

  .messageTabbar {
    width: 100%;
    height: 100rpx;
    position: relative;

    .messageTabbarBox {
      width: 100vw;
      height: 100rpx;
      box-sizing: border-box;
      padding: 0 20rpx;
      overflow-x: auto;
      position: fixed;
      left: 0;
      z-index: 2;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;

      .messageTabbarBoxItem {
        width: auto;
        padding: 0 20rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        flex-direction: column;

        .content {
          font-size: 28rpx;
          line-height: 40rpx;
          padding-top: 22rpx;
          padding-bottom: 8rpx;
          color: #999;
          position: relative;
        }

        .active {
          font-weight: bold;
          color: #333;
        }

        .activeLine {
          width: 60rpx;
          height: 8rpx;
          background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #00bcb9;
          border-radius: 4rpx;
        }

        .dot {
          position: absolute;
          line-height: 26rpx;
          text-align: center;
          padding: 0 1rpx ;
          color: #fff;
          top: 12rpx;
          right: -28rpx;
          //width: 25rpx;
          min-width: 25rpx;
          font-weight: 400;
          font-size: 20rpx;
          background-color: #ff2220;
          height: 25rpx;
          z-index: 1;
          border-radius: 20rpx;
        }
      }
    }
  }

  .messageContent {
    padding-top: 36rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f6f8;

    .messageContentItem {
      width: 690rpx;
      background: #ffffff;
      box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 20rpx;
      box-sizing: border-box;
      padding: 30rpx 24rpx 28rpx;
      margin-bottom: 24rpx;

      .time {
        width: 100%;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 34rpx;
        // margin-bottom: 20rpx;
        margin-bottom: 24rpx;
      }

      .title {
        width: 100%;
        font-weight: bold;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
        position: relative;
        padding-left: 14rpx;
        // margin-bottom: 12rpx;
        margin-bottom: 20rpx;

        .dot {
          position: absolute;
          left: -4rpx;
          top: 12rpx;
          width: 14rpx;
          height: 14rpx;
          border-radius: 7rpx;
          background: #ff2220;
        }
      }

      .content {
        width: 100%;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 34rpx;
        // height: 68rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>
