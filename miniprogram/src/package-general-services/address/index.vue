<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view style="position: relative;width:100%;height: 130rpx; ">
      <view class="search-box flex" style="position: fixed;z-index: 1;width: 750rpx;box-sizing: border-box; ">
        <view style="margin-right: 20rpx;width: 90%;">
          <u-search maxlength="20" height="40" placeholder="请输入" placeholderColor="#999" @search="getSearch" @blur="inputBlur"
            :showAction="false" v-model="keywords" shape="square"></u-search>
        </view>
        <u-icon v-if="!showMap" size="32" :name="staticBaseUrl + '/hbdimage/baseImage/icon-dw.png'" @click="goMapChange"></u-icon>
        <u-icon v-if="showMap" size="32" :name="staticBaseUrl + '/hbdimage/baseImage/liebiao.png'" @click="showMap = !showMap"></u-icon>
      </view>
    </view>
    <view v-if="showMap && isMp" class="map-container" style="height: calc(100vh - 300rpx);">
      <map @click="goMap" class="map" id="map" :longitude="longitude" :latitude="latitude" scale="12"
        :show-location="true" :markers="markers" @markertap="makertap">
      </map>
    </view>
    <!-- :class="[showMap ? 'active' : '']" -->
    <view v-if="showMap && isH5" class="map-container" :style="{height: maxAviHeightWithNav - 74 + 'px'}">
      <view id='container'></view>
    </view>
    <!-- <view v-if="isH5" class="map-container">
      <view id='container'></view>
    </view> -->
    <view v-if="list1.length > 0 && !showMap"
      style="padding:0 15rpx 15rpx;box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.1);background:#fff;">
      <u-tabs @click="handleClick" :list="list1" lineWidth="20"
        lineColor="linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%)" :activeStyle="{
          color: '#333333',
          fontWeight: 'bold',
        }" :inactiveStyle="{
          color: '#999',
          transform: 'scale(1)'
        }" :current="current" :keyName="'addrTypeName'"></u-tabs>
    </view>
    <view v-if="!showMap" class="scroll-block">
      <vc-empty v-if="filteredList.length === 0"></vc-empty>
      <template v-else>
        <view class="scroll-item" v-for="(item, index) in filteredList" :key="index">
          <view class="flex flex_sb">
            <view style="width: 80%;">
              <view
                style="font-size: 28rpx;font-weight: bold;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                {{ item.addrName }}</view>
              <view style="font-size: 24rpx;color: #999999; line-height:45rpx;">地址：<text >{{ item.address }}</text> </view>
            </view>
            <div style="width: 20%;" class="point-com-right" @click.stop="goDirection(item)">
              <image
                class="point-com-right-image"
                :src="
                  staticBaseUrl +
                  '/hbdimage/main/images/package-services/luxian.png'
                "
              ></image>
            </div>
          </view>
          <view v-if="!needOpenLocation" class="flex" @click="goDirection(item)" style="align-items: center;margin-top: 12rpx;">
            <u-icon name="map" size="16" color="#3BB3AD" />
            <!-- {{ getDisKm({ lat:Number(item.latitude), lng: Number(item.longitude) }) }} -->
            <view style="font-size: 24rpx;margin-left: 6rpx;">距您直线距离{{item.distance}}km</view>
          </view>
        </view>
      </template>
    </view>
    <!-- <vc-sub :props-data="propsDataSub" /> -->
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import { platform, isH5, isApp, isMp } from "@/utils/platform";
import { getAddrServiceList, getAddrInfoList } from '../api/baseServices';
let hbd = null;
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
export default {
  name: "address",
  data() {
    return {
      isH5: isH5,
      isMp: isMp,
      needOpenLocation: true,
      propsData: {
        props: {
          title: {
            value: '地址'
          },
        }
      },
      // 订阅服务id 
      propsDataSub: {
        props: {
          serviceId: {
            value: ''
          }
        }
      },
      keywords: '',
      latitude: '',
      longitude: '',
      // markers: [],
      list1: [],//列表
      addrTypeName: '',
      page: 1,
      rows: 10,
      total: 0,
      status: 'loadmore',

      addrTypeId: '',
      addrServiceId: '',
      showMap: false,
      filteredList: [],
      current: 0,
      startPoint: {
        lat: '',
        lng: ''
      },
      endPoint: {
        lat: '',
        lng: ''
      },
      markerpoints:[]
    }
  },
  async onLoad(options) {
    this.propsData.props.title.value = options.title;
    hbd = this.bridgeSdk.hbd;
    this.addrServiceId = options.serviceId;
    this.propsDataSub.props.serviceId.value = options.subId;//订阅服务id

    // 每个页面必须这么写
    if(!this.bridgeSdk.isTokenValid()){
        this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
        return;
    }
    this.__loadData__();
    
  },
  onShow() {

  },
  async mounted() {
    console.log("mounted", this.maxAviHeightWithNav);
  },
  computed: {
    // 小程序标记点
    markers() {
      return this.filteredList.map((item, index) => {
        // console.log("这是marker", item, this.minioBaseUrl);
        let marker = {};
        if(item.iconPhotoUrl){
          marker = {
            height: 32,
            width: 32,
            // icon图标
            iconPath: item.iconPhotoUrl ? this.minioBaseUrl + item.iconPhotoUrl : ''
          }
        }
        else {
          marker = {
            height: 35,
            width: 25
          }
        }
        return {
          ...marker,
          id: Number(item.locationId) || index + 1,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude)
        };
      });
    },
    ...mapState(useBaseStore, {
      maxAviHeightWithNav: 'maxAviHeightWithNav'
    }),
  },
  onReachBottom() {
    if (this.status != 'nomore') {
      this.getListDetail(this.page + 1);
    }
  },
  methods: {
    __loadData__(){
      this.bridgeSdk.getLocation(res => {
        this.needOpenLocation = res.locationFail === true;
        this.longitude = Number(res.lng);
        this.latitude = Number(res.lat);
        this.startPoint.lng = Number(res.lng);
        this.startPoint.lat = Number(res.lat)
        console.log('lng:',this.longitude,'lat:',this.latitude);
        this.getList();
      });
    },
    handleClick(e) {
      this.filteredList = []
      this.page = 1;
      this.current = e.index;
      this.addrTypeName = e.addrTypeName; // 更新当前选中的标签 
      this.addrTypeId = e.addrTypeId;
      this.getListDetail(1)
    },
    getSearch(keywords) {
      if(this.time && new Date().getTime() - this.time < 1000){
        return
      }
      this.time = new Date().getTime();
      this.keywords = keywords;
      this.page = 1;
      this.filteredList = []
      this.getListDetail(1)
    },
    inputBlur(){
      // if (!this.bridgeSdk.checkIsEmpty(this.keywords)){
      //     this.getSearch(this.keywords);
      //   }
    },
    //地图切换
    goMapChange() {
      this.showMap = !this.showMap;
      this.$nextTick(async () => {
        // this.bridgeSdk.InitBaiduMap(Number(this.longitude), Number(this.latitude));
        // this.showMarker();
        // if(this.markerAdded){
        //   return;
        // }
        // // 初始化marker点
        // this.bridgeSdk.showMarker({
        //   markerpoints: this.markerpoints,
        //   lng: Number(this.longitude),
        //   lat: Number(this.latitude),
        // });
        // 防止重复初始化
        // if(!this.markerAdded){
          await this.bridgeSdk.InitBaiduMap();
          // this.markerAdded = true;
        // }
        // 初始化marker点
        this.bridgeSdk.renderMarker({
          markerpoints: this.markerpoints || [],
          lng: Number(this.longitude),
          lat: Number(this.latitude),
        });
      })
    },
    makertap(e) {
      // this.makertap1(this.markerpoints,e.markerId)
      console.log("这是标记点的点击事件", e);
    },
    // makertap1(data,i){
    //   let sendlongitude, sendlatitude;//参数提取
    //   for (let c = 0; c < data.length; c++) {
    //     if (data[c].id == i) {
    //       console.log("这是标记点的点击事件", data[c]);
    //       sendlongitude = data[c].longitude
    //       sendlatitude = data[c].latitude
    //     }
    //   }
    //   // 调用sdk 
    //   let s = `${Number(this.longitude)},${Number(this.latitude)}`;
    //   let e = `${Number(sendlongitude)},${Number(sendlatitude)}`;
    //   this.bridgeSdk.routePlan(s, e);
    // },
    getList() {
      let params = {
        addrServiceId: this.addrServiceId,
        longitude: this.longitude,
        latitude: this.latitude,
      }
      getAddrServiceList(params).then(res => {
        this.list1 = res.addrTypeListBoList;
        if (res.addrTypeListBoList.length > 0) {
          this.addrTypeId = res.addrTypeListBoList[0].addrTypeId;
          this.addrTypeName = res.addrTypeListBoList[0].addrTypeName;
          if (res.addrTypeListBoList.length > 0) {

          } else {
            this.filteredList = []
          }
        }
        this.getListDetail(1);
      })

    },

    getListDetail(currentPage) {

      let params = {
        addrTypeId: this.addrTypeId,
        page: currentPage,
        rows: this.rows,
        keywords: this.keywords,
        addrServiceId: this.addrServiceId,
        longitude: this.longitude,
        latitude: this.latitude,
      }

      getAddrInfoList(params).then(res => {
        this.page = currentPage;
        if (this.page <= 1) {
          this.status = 'loadmore';
          this.filteredList = [];
        }
        this.total = res.total;

        this.filteredList = [...this.filteredList, ...res.list];
        console.log("列表数据：", this.filteredList);
        this.markerpoints = this.filteredList.map(item => {
          return {
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            height: 35,//高度
            width: 25,//宽度
            title: item.addrName,//标题
            address: item.address,//地址
            // icon图标
            iconPhotoUrl: item.iconPhotoUrl ? this.minioBaseUrl + item.iconPhotoUrl : ''
          }
        })
        // this.showMarker(this.markerpoints);
        if (this.total > this.filteredList.length) {
          this.status = 'loadmore'
        } else {
          this.status = 'nomore'
        }
        return;
      })

    },
    // showMarker(){
    //   if(this.markerAdded){
    //     return;
    //   }
    //   this.bridgeSdk.showMarker(this.markerpoints);//调用sdk 
    // },
    //导航
    goDirection(item) {
      console.log("这是导航", item);
      let s = `${Number(this.longitude)},${Number(this.latitude)}`;
      let e = `${Number(item.longitude)},${Number(item.latitude)}`;
      console.log("开始坐标：",s,"终点坐标：",e);
      // 调用sdk 
      this.bridgeSdk.routePlan(s,e,item.addrName,item.address);
    },
  }
}
</script>

<style lang="scss" scoped>
.flex_col {
  flex-direction: column;
}

.map-container {
  width: 100%;
  height: calc(100vh - 395rpx);
  
  #container {
    width: 100%;
    // height: calc(100vh - 200rpx);
    height: 100%;
  }
}

.map {
  height: 100%;
  width: 100%;

}

.main {
  background: #F0F0F4;
  height: auto;
  min-height: 100vh;
}

.flex {
  display: flex;
}

.search-box {
  background: white;
  padding: 20rpx 40rpx;
  box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
}

.scroll-block {
  //height: calc(100vh - 100rpx - 2rpx - 40rpx);
  width: 90%;
  margin: 30rpx auto;
  padding: 0 20rpx;

  .scroll-item {
    background-color: white;
    margin-top: 24rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    padding: 24rpx;
    line-height: 60rpx;
    //&:last-child{
    // border-bottom: none;
    //}
  }
}

.active {
  position: relative;
  left: -10000 !important;
}

.point-com-right {
  width: 120rpx;
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
</style>