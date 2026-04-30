<!--
  User: songjuncheng
  Date: 2025-05-23 18:34:56
  Description:地图服务展示卡片组件
  Lasteditors:songjuncheng
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <!-- 列表页展示卡片 -->
   <view class="cardbox" v-if="dataSourceType !== 'baidu'">
       <view class="point-com">
        <view class="point-com-cardImg" v-if="photoShow">
            <image :src="minioBaseUrl + info.pagePhotoUrl" alt="" style="width: 100%;height: 100%;"/>
        </view>
      <view class="point-com-left" :style="{ width: photoShow ? '284rpx' : '444rpx' }">
        <view class="point-com-title text-overflow">
            {{ info.addrName || "" }}
        </view>
        <view class="point-com-content">
            {{ (info.districtCodeName ? info.districtCodeName + "-" : "") + (info.address || "") }}
        </view>
        <view class="map-com-bottom" v-if="info.businessHours && info.businessHours != ''">
                <view class="map-com-bottom-left span-close" v-if="info.businessHoursChange == '休息中'">{{ info.businessHoursChange }}</view>
                <view class="map-com-bottom-left span-open" v-if="info.businessHoursChange == ''">营业中</view>
                <view class="map-com-bottom-text text-open" :style="{ width: photoShow ? '230rpx' : '410rpx' }"
                  v-if="info.businessHoursChange == '' || info.businessHoursChange == '休息中'">
                    {{ info.businessHours }}</view>
                <view class="map-com-bottom-text" v-else>
                    {{ info.businessHoursChange }}</view>
        </view>
            <!-- 标签 -->
            <!-- :class="info.label.length > 20 ? 'tagOver' : ''" -->
          <view class="tagbox"
            v-if="info.labelList.length > 0">
            <!-- <view v-for="(item, index) in info.labelList" :key="index" class="tag-title">{{ item }}</view> -->
            <template v-for="(item, index) in info.labelList" :key="index">{{ item }}{{ `${(index + 1 < info.labelList.length) ? '&nbsp;&nbsp;|&nbsp;&nbsp;' : ''}` }}</template>
          </view>

          <view class="point-com-footer" v-if="isneedOpenLocation">
                <image class="point-com-footer-image" mode="widthFix" :src="staticBaseUrl +
                '/hbdimage/main/images/package-services/dingwei.png'
                "></image>
                <text>距市中心{{ bridgeSdk.convertDistance(info.distance) }}</text>
          </view>
        </view>
      <view>
        
      </view>
        <view class="point-com-right" @click.stop="makePhoneCall(info.phoneList)" v-if="info.phoneList.length > 0">
          <image class="point-com-right-image" :src="minioBaseUrl +
              '/hbdbucket/images/mapmobile.png'
              "></image>
          <view class="point-com-bot-text" v-if="!isneedOpenLocation">电话</view>
          <view class="point-com-bot-text" v-else></view>
        </view>

        <view class="point-com-right" @click.stop="toNav">
        <image class="point-com-right-image" :src="staticBaseUrl +
            '/hbdimage/main/images/package-services/luxian.png'
            "></image>
        <view class="point-com-bot-text" style="width: 100rpx;" v-if="!isneedOpenLocation">{{ bridgeSdk.convertDistance(info.distance) }}</view>
        <view class="point-com-bot-text" v-else></view>
        </view>
      </view>

          <!-- <view class="mobileBox" v-if="info.phoneList.length > 0">
            <view class="mobile-title">电话:</view>
            <view class="mobile-content">
              <view class="mobile-text" @click="makePhoneCall(phone)" v-for="(phone,index) in info.phoneList" :key="index">{{ phone }}</view>
            </view>
        </view> -->
   </view>
   <!-- 百度地图展示卡片 -->
   <view class="cardbox" v-else>
       <view class="point-com">
        <view class="point-com-cardImg" v-if="photoShow">
            <image :src="minioBaseUrl + info.pagePhotoUrl" alt="" style="width: 100%;height: 100%;"/>
        </view>
      <view class="point-com-left" :style="{ width: photoShow ? '360rpx' : '508rpx' }">
        <view class="point-com-title text-overflow">
            {{ info.locationName || "" }}
        </view>
        <view class="point-com-content">
            {{ (info.districtName?info.districtName + "-" : "") + (info.address || "") }}
        </view>
          <view class="point-com-footer" v-if="isneedOpenLocation">
                <image class="point-com-footer-image" mode="widthFix" :src="staticBaseUrl +
                '/hbdimage/main/images/package-services/dingwei.png'
                "></image>
                <text>距市中心{{ info.distance }}</text>
          </view>
        </view>
        <view class="point-com-right" @click.stop="toNav">
        <image class="point-com-right-image" :src="staticBaseUrl +
            '/hbdimage/main/images/package-services/luxian.png'
            "></image>
        <view class="point-com-bot-text" v-if="!isneedOpenLocation">{{ info.distance }}</view>
        </view>
  </view>    
   </view>
</template>

<script>
export default {
  name: "pointCom",
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    comType: {
      type: String,
      default: "", // 
    },
    isneedOpenLocation: {
      type: Boolean,
      default: true, // 是否开启定位
    },
    dataSourceType: {
      type: String,
      default: '', // 数据来源
    },
    longitude: {
      type: String,
      default: '', // 经度
    },
    latitude: {
      type: String,
      default: '', // 纬度
    }
  },
  watch: {
    info:{
     handler(newVal, oldVal) {
        console.log("info change", newVal);
        this.photoShow = this.bridgeSdk.checkIsEmpty(newVal.pagePhotoUrl);
      },
      immediate: true,
    }
  },
  data() {
    return {
      needOpenLocation: true,
      photoShow: false,
    };
  },
  methods: {
    toNav() {
      console.log('开始导航');
      
      // this.bridgeSdk.getLocation((res) => {
       let addrName = this.dataSourceType === 'baidu' ? this.info.locationName : this.info.addrName;
       console.log('导航位置',this.longitude + "," + this.latitude,addrName);
       
      this.bridgeSdk.routePlan(
        this.longitude + "," + this.latitude,
        this.info.longitude + "," + this.info.latitude,
        addrName,
        this.info.address
      );
      // }, "showModal");
    },
        // 电话
     makePhoneCall (l) {
      console.log(l)
      let list = l
      console.log(l)
      console.log(list.length)
      if (list.length > 1) {
        console.log(list)
        uni.showActionSheet({
        itemList: list,
        success: (res) => {
          console.log('电话选择', list[res.tapIndex]);
          this.bridgeSdk.makePhoneCall({
            // phoneNumber: phoneList[res.tapIndex],
            phoneNumber: list[res.tapIndex],
            success: () => {
              console.log('拨打电话成功')
            },
            fail: (err) => {
              console.error('拨打电话失败', err)
            }
          })
        }
      });
      } else {
        this.bridgeSdk.makePhoneCall({
          title: this.info.addrName,
          phoneNumber: list[0],
        })
      }
    },
  },
};
</script>

<style scoped lang="scss">
.cardbox{
  width: 690rpx;
  box-sizing: border-box;
  padding: 28rpx 24rpx;
  border-radius: 20rpx;
  background: #fff;
}
.point-com {
  display: flex;
  // align-items: center;
  justify-content: space-between;
  .point-com-cardImg{
    width: 160rpx;
    height: 160rpx;
    border-radius: 14rpx;
    // margin-right: 24rpx;
    overflow: hidden;
  }
  .point-com-left {
    // width: 400rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // overflow: hidden;
    .point-com-title {
      width: 100%;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      margin-bottom: 10rpx;

      .point-com-title-open {
        display: inline-block;
        padding: 4rpx 10rpx;
        font-size: 20rpx;
        color: #fff;
        background: #23baab;
        border-radius: 10rpx;
        margin-left: 20rpx;
      }

      .point-com-title-close {
        display: inline-block;
        padding: 4rpx 10rpx;
        font-size: 20rpx;
        color: #fff;
        background: #f1f1f1;
        border-radius: 10rpx;
        margin-left: 20rpx;
      }
    }

    .point-com-content {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      margin-bottom: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .point-com-footer {
      width: 100%;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 24rpx;
      margin-top: 10rpx;

      .point-com-footer-image {
        width: 18rpx;
        height: 24rpx;
        margin-right: 10rpx;
        flex-shrink: 0;
      }
    }
  }

  .point-com-right {
   // width: 120rpx;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #23baab;

    .point-com-right-image {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .map-com-bottom{
    max-width:100%;
    min-height: 40rpx;
    // overflow: hidden;
    position: relative;
    font-size: 24rpx;
    &-left{
        display: inline-block;
        // width: 72rpx;
        // height: 28rpx;
        border-radius: 5rpx;
        padding: 2rpx 6rpx;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
    }
    &-text{
        display: inline-block;
        width: 230rpx;
        position:absolute;
        top: 0;
        left: 0;
        max-height: 58rpx;
        padding-bottom: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .textSpan{
        display: inline-block;
        width: 10rpx;
    }
    .span-open{
        border: 1rpx solid #00BCB8;
        font-size: 18rpx;
        color: #00BCB8;
    }
    .span-close{
        border: 1rpx solid #999;
        font-size: 18rpx;
        color: #999;
    }
    .text-open{
        left: 80rpx !important;
    }
    .text-close{
        left: 88rpx !important;
        
    }
  }
  .point-com-bot-text{
    // width: 110rpx;
    height: 34rpx;
    margin-top: 2rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
    .text-overflow{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 设置行数 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
    }
}
.tagbox{
  display: -webkit-box;
  max-width: 100%;
  margin-top: 10rpx;
  display: block;
  flex-wrap: nowrap;
  overflow: hidden;
  position: relative;

  font-size: 22rpx;
  color: #828282;
  line-height: 22rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  
  .tag-title{
    display: inline-block;
    // max-width: 130rpx;
    font-size: 22rpx;
    color: #828282;
    height: 22rpx;
    line-height: 22rpx;
    padding:0 12rpx;
    box-sizing: border-box;
    border-right: 1rpx solid #828282;
    // overflow: hidden;
    white-space: nowrap;
    // text-overflow: ellipsis;
  }
  .tag-title:first-child{
    padding-left:0;
  }
  .tag-title:last-child{
    border-right: none;
  }
}
.tagOver::after{
    content: '...';
    width: 38rpx;
    font-size: 22rpx;
    background-color: #fff;
    color: #828282;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}
.mobileBox{
  // width: max-content;
  // max-width: 600rpx;
  display: flex;
  padding: 10rpx 18rpx;
  background: #EAFFFD;
  border-radius: 12rpx;
  font-size: 20rpx;
  color: #23BAAB; 
  margin-top: 18rpx;
}
.mobile-title{
  flex-shrink: 0;
}
.mobile-content{
  // max-width: 500rpx;
  display: flex;
  flex-wrap: wrap;
  margin-left: 10rpx;
}
.mobile-text{
  margin-right: 40rpx;
  text-decoration-line: underline;
  margin-bottom: 6rpx;
}
</style>
