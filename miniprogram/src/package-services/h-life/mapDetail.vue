<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container ref="container" :props-data="propsData" class="h-life-detail">
  <view v-if="!pageShow" style="position: relative;overflow: auto;height: 100%;">
       <view class="h-life-detail-banner" v-if="dataInfo.pagePhotoUrl">
      <image
        :src="minioBaseUrl + dataInfo.pagePhotoUrl"
        class="h-life-detail-banner-img"
      ></image>
    </view>
    <!-- 地图详细信息卡片 -->
    <view class="bottom-block" style=" background-color: white;">
      <view class="flex main-block flex_col">
        <view>
          <text class="fs32">{{ dataInfo.locationName }}</text>
        </view>
        <!-- 标签 -->
        <view class="tag-box" v-if="labelLst.length > 0">
          <view class="tag-item" v-for="(item, index) in labelLst" :key="index">{{ item }}</view>
        </view>
        <view>
          <view style="line-height:60rpx;" v-if="dataInfo.timeValue">
            <text class="bold" style="font-size: 28rpx;color:#10C2B7">营业时间</text>
            <text style="margin-left: 10rpx;font-size:26rpx;color:#333;">
              {{ dataInfo.timeName }} {{ dataInfo.timeValue }}
            </text>
          </view>
        </view>
      </view>
      <view class="flex main-block" style="border-bottom:none">
        <view class="flex flex_ac" style="padding-right:50rpx;">
          <view class="adress-box text-container">{{dataInfo.districtCodeName ? (dataInfo.districtCodeName + ' | ' + dataInfo.address) : dataInfo.address}}</view>
        </view>
        <view class="flex">
          <view class="flex flex_col" style="align-items: center;justify-content: center;margin-right: 28rpx;"
            @click=goLocation(dataInfo)>
            <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/location.png'"
                  mode="scaleToFill" />
            <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">导航</view>
          </view>
          <view v-if="dataInfo.phone" @click="makePhoneCall(dataInfo.phone)" class="flex flex_col"
            style="align-items: center;justify-content: center;">
            <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'"
                  mode="scaleToFill" />
            <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">电话</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 设施展示 -->
    <view style="margin-bottom: 20rpx;" v-if="dataInfo.showBoList?.length > 0">
      <view
        class="h-life-detail-box"
        v-for="(item, index) in dataInfo.showBoList"
        :key="index"
      >
        <view class="h-life-detail-title">{{ item.markersName }}</view>
        <view class="h-life-detail-content" v-if="item.showType === '0'">
          <view
            v-for="(im, ix) in item.termList"
            :key="ix"
            class="h-life-detail-item"
          >
            <image class="h-life-detail-item-img"
              :src="minioBaseUrl + im.pic"
              mode="aspectFill"
            ></image>
            <view>{{ im.termName }}</view>
          </view>
        </view>
        <view class="h-life-detail-content" v-if="item.showType === '1'">
          <!-- <view
            class="h-life-detail-item"
            v-for="(im, ix) in item.termList"
            :key="ix"
          >
            <view class="h-life-detail-item_num">{{ computedNum(im.termNum) }}</view>
            <view>{{ im.termName }}</view>
          </view> -->
          <view class="h-life-detail-itemNum" v-for="(im, ix) in item.termList" :key="ix">
               <view class="num-imgbox">
                 <image class="h-life-detail-itemNum-img"
                    :src="minioBaseUrl + im.pic"
                    mode="aspectFill"
                  ></image>
                  <view>{{ im.termName }}</view>
               </view>
               <view class="h-life-detail-itemNum-num">{{ computedNum(im.termNum) }}</view>
          </view>
          <view>
            <view></view>
          </view>
        </view>
      </view>
    </view>
<!-- 设施展示结束 -->
    <!-- 父子类tab切换 -->
    <u-sticky :offsetTop="0" :customNavHeight="0">
     <view style="padding:0 15rpx 15rpx;background:#fff;margin-top: 10rpx;" v-if="mapInfoBOList.length > 0">
        <u-tabs @click="handleClick" :list="mapInfoBOList" lineWidth="30"
          style="width: 720rpx;"
          lineColor="linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%)" 
          :activeStyle="{color: '#333333',fontWeight: 'bold',}" 
          :inactiveStyle="{color: '#333333',transform: 'scale(1)'}" 
          :current="current">
        </u-tabs>
      </view>
    </u-sticky>
  <!-- 栏目详情 -->
      <view v-if="cloumnInfo.length > 0">
        <view class="z-blocks" v-for="(item, index) in cloumnInfo" :key="index">
          <view class="flex" style="background-color:#fff;" v-if="item.title">
            <view class="bf-line flex_col"></view>
            <text style="font-size: 24rpx;margin-left:10rpx;margin-bottom: 4rpx;">{{ item.title }}</text>
          </view>
            <view>
              <u-parse lazy-load :content="bridgeSdk.addMinioPrefixToImgSrc(item.content, maxWidthV)" :copyLink="false" @linkTap="bridgeSdk.hrefJump"></u-parse>
            <!-- <view v-html="bridgeSdk.addMinioPrefixToImgSrc(item.content)"></view> -->
            </view>
        </view>
      </view>
  </view>
  <up-loading-page :loading="pageShow" loading-text="" loading-mode=" "></up-loading-page>
  </vc-container>
</template>

<script>
import vcBanner from "@/components/library/base/vc-banner/index"; //banner
import mapCom from "../components/mapCom";
import { getMapProLocationDetail,selMapProColumn,selMapProColumnDetail } from "../api/base-services";
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
export default {
  name: "mapDetail",
  components: {
    vcBanner,
    mapCom,
  },
  data() {
    return {
      pageShow:true,
      propsData: {
        props: {
          title: {
            value: "",
          },
          isFullScreen: {
            value: true
          },
          disableScroll: {
            value: true
          },
        },
      },
      bannerData: {
        props: {
          list: {
            value: [
              
            ],
          },
          height: {
            value: 360,
          },
          type: {
            value: "indicator",
          },
          borderRadius: {
            value: "border-radius",
          },
          preview: {
            value: true,
          },
        },
      },
     popPropsData: {
        props: {
          show: {
            label: "类型",
            value: 'showArticlePhone',// 服务电话
          },
          showPop: {
            label: "显示状态",
            value: false,
          },
          content: {
            label: "显示内容",
            value: "",
          },
          list: {
            label: "显示状态",
            value: [],
          },
        }
      },
      dataInfo: {},

      locationInfo: {}, // 定位信息,
      distance: "", // 距离,
      current: '0',//当前标签页
      mapInfoBOList:[],
      cloumnList:[],
      cloumnInfo:[], //栏目详情
      labelLst:[], //标签列表
      maxWidthV: '100%'
    };
  },
  async onLoad(options) {
    console.log(options);
    this.locationId = options.id;
    this.lat = options.lat;
    this.lng = options.lng;
    this.distance = options.distance;
    const windowInfo = await this.bridgeSdk.getWindowInfo();
    this.maxWidthV = (windowInfo.screenWidth - windowInfo.screenWidth / 750 * 60) + 'px';

    this.$nextTick(() => {
    this.propsData.props.title.value = options.title;
      this.$refs.container.setNavPropsData({
        title: {
          value: options.title
        }
      })
    })
    // 获取经纬度
    // this.bridgeSdk.getLocation((res) => {
    //   console.log("getLocation获取经纬度", res);
    //   this.locationInfo = res;
      this.getData();
    // }, "showModal");
      this.getMapCloumn()
  },
  methods: {
    getData() {
      getMapProLocationDetail({
        locationId: this.locationId,
        longitude: this.lng,
        latitude: this.lat,
      }).then((res) => {
        console.log(res);
        this.dataInfo = res;
        this.dataInfo.distance = res.distance || this.distance;
        if(res.label){
         this.labelLst = res.label.split(",");
        }
        this.pageShow = false
      });
    },
    // 获取栏目分类
    getMapCloumn(){
      selMapProColumn({locationId: this.locationId}).then(async res =>{
        console.log('栏目分类:',res);
        this.cloumnList = res
          if(res && res.length > 0){
            this.mapInfoBOList = res.map(item => {
              return{
                name:item.columnName
              }
            })
           await this.getCloumnDetail(res[0].columnId)
         }
      })
    },
      async getCloumnDetail(id){
        let res = await selMapProColumnDetail({columnId:id,locationId: this.locationId})
            console.log('栏目详情:',res);
            this.cloumnInfo = res
            this.pageShow = false
            
        },
    //tab切换
    handleClick(e) {

      this.current = e.index;
      this.getCloumnDetail(this.cloumnList[e.index].columnId)
    },

    // 导航
    goLocation (item) {
        this.bridgeSdk.getLocation(res => {
          console.log("这是导航", item);
          let s = `${Number(res.lng)},${Number(res.lat)}`;
          let e = `${Number(item.longitude)},${Number(item.latitude)}`;
          console.log("开始坐标：", s, "终点坐标：", e);
          // 调用sdk 
          this.bridgeSdk.routePlan(s, e, item.locationName, item.address);
        })
    },

    // 电话
     makePhoneCall (l) {
      let list = l.split(",")
      console.log(l)
      // let list = '15904248611,0411-62835629'.split(",")
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
          title: this.dataInfo.locationName,
          phoneNumber: l
        })
      }
    },
    computedNum(num){
      if(num > 9999){
        return 999 + '+'
      }else{
        return num
      }
    }
  },
   computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: 'safeTopDistance',
      navigationBarInfo: "navigationBarInfo",
    }),
    // 页面高度
    offsetTopHeight() {
      let val =
        this.navigationBarInfo.statusBarHeight +
        this.navigationBarInfo.navigationBarHeight;
      let valRpx = this.bridgeSdk.px2rpx(val)/2-15 +'rpx';
      console.log('offsetTopHeight', valRpx)
      return valRpx;
    },
  }
};
</script>

<style scoped lang="scss">
.text-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制为2行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
}
.h-life-detail {
  display: flex;
  align-items: center;
  flex-direction: column;
  //position: relative;
  .h-life-detail-banner {
    width: 750rpx;
    height: 360rpx;
    .h-life-detail-banner-img {
      width: 100%;
      height: 100%;
     // border-radius: 20rpx;
    }
  }
  .h-life-detail-box {
    width: 690rpx;
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 24rpx 24rpx 0rpx 24rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    .h-life-detail-title {
      width: 574rpx;
      height: 40rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
    }
    .h-life-detail-content {
      width: 100%;
      margin-top: 24rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .h-life-detail-item {
        width: 20%;
        margin-bottom: 20rpx;
        font-size: 24rpx;
        text-align: center;
        // flex-grow: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        .h-life-detail-item-img {
          width: 100rpx;
          height: 100rpx;
        }
        .h-life-detail-item-title {
          max-width: 4rpx;
          font-size: 24rpx;
          color: #000000;
          line-height: 28rpx;
        }
        .h-life-detail-item_num {
          height: 45rpx;
          font-weight: 600;
          font-size: 32rpx;
          color: #23baab;
          line-height: 45rpx;
        }
      }
    }
    
    .h-life-detail-itemNum {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        margin-bottom: 20rpx;
      &-img {
        width: 48rpx;
        height: 48rpx;
      }
      &-num {
        flex: 1;
        font-weight: 600;
        font-size: 64rpx;
        color: #23BAAB;
        
      }
      
    }
    .num-imgbox{
      flex: 1;
    }

  }

   .bottom-block {
    width: 750rpx;
    padding: 20rpx 30rpx 24rpx;
    // line-height: 40rpx;
    box-sizing: border-box;
    .main-block {
      padding: 15rpx 0;
      justify-content: space-between;
      font-size: 26rpx;
      border-bottom: 1px solid #d8d8d8;

      view {
        text {
          font-size: 28rpx;
          color: #333;
          line-height: 45rpx;
          font-weight: bold;
        }
      }
    }

    .main-block:last-child {
      padding-top: 24rpx;
      padding-bottom: 0;
    }

    .card-block {
      .card-block-scroll {
        white-space: nowrap;
        width: 85%;

        .card-item {
          color: #fff;
          display: inline-block;
          width: auto;
          margin-left: 20rpx;
          background: linear-gradient(90deg, #fd744e 0%, #fb432d 100%);
          border-radius: 5rpx;

          .card-item-left {
            padding: 6rpx 15rpx;

            view:first-child {
              display: flex;
              align-items: center;
              font-size: 22rpx;

              view {
                text {
                  font-weight: bold;
                  font-size: 30rpx !important;
                }
              }
            }

            view:last-child {
              margin-left: 10rpx;
              display: flex;
              align-items: center;

              text {
                font-weight: bold;
                font-size: 22rpx;
              }
            }
          }
        }

        .card-item:first-child {
          margin-left: 0;
        }
      }

      .card-item-right {
        font-weight: bold;
        font-size: 22rpx;
        color: #333333;
        background-color: #fff;
        width: 15%;
        justify-content: space-evenly;
        line-height: 30rpx;
      }

      .card-block-dis {
        margin-top: 10rpx;

        text {
          border-radius: 10rpx 10rpx 10rpx 10rpx;
          border: 1rpx solid #e53d34;
          font-weight: bold;
          font-size: 26rpx;
          color: #e53d34;
          padding: 2rpx 5rpx;
          margin-left: 12rpx;
        }

        text:first-child {
          margin-left: 0;
        }
      }
    }

    .btn-blocks {
      background-color: #fff;
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item {
        line-height: 50rpx;
        font-size: 26rpx;
        height: 50rpx;
        padding: 0 10rpx 20rpx;
      }

      .active {
        color: #10c2b7;
        position: relative;

        .active:after {
          border-bottom: 2rpx solid #10c2b7;
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }

    .btnStyle {
      border: 1rpx solid #10c2b7;
      border-radius: 50rpx;
      background-color: aquamarine;
      color: #10c2b7;
      width: 45%;
      font-weight: bold;
      font-size: 50rpx;
      height: 70rpx;
    }
  .adress-box{

  }
  .icon-img {
    height: 50rpx;
    width: 50rpx;
  }
  .tag-box{
    display: flex;
    flex-wrap: wrap;
    .tag-item {
        background: #FFFFFF;
        border-radius: 6rpx;
        border: 1rpx solid #00BCB8;
        font-size: 20rpx;
        color: #00BCB8;
        padding: 2rpx 12rpx;
        margin: 4rpx 0;
        margin-right: 8rpx;
    }
  }
  }
  .z-blocks {
    padding: 0 30rpx 30rpx;
    background-color: #fff;
    .bf-line {
      border-radius: 4rpx;
      width: 8rpx;
      height: 25rpx;
      background-color: rgba(51, 51, 51, 1);
      margin: 4rpx 0 4rpx 0
    }
  }
}
</style>
