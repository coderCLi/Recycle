/** 
* @Description: 惠生活 缴费网点 找公厕 
* @Author: zjw 
* @Date:2025年1月7日13:39:56 
* @Last Modified by: zjw 
* @Last Modified time:2025年1月7日13:40:09 
*/
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;">
        <view class="top-bg2"></view>
    </view>
    <view class="true-content" style="position: relative; overflow: visible;">
          <view class="search-box">
            <view class="search-main">
              <u-search
                :disabled="trueValue"
                maxlength="20"
                height="40"
                :placeholder="placeholderText"
                placeholderColor="#999"
                @click="getSearch"
                :showAction="false"
                v-model="keywords"
                shape="round"
              ></u-search>
            </view>
          </view>
          <!-- 菜单tabbar -->
          <view class="tabbar-box" v-if="tabbarShow">
            <view class="tabbar-main">
              <tabbar :list="tabbarList" @change="tabbarChange"></tabbar>
            </view>
          </view>

          <view v-if="isChild">
            <!-- 地图区域 com Type === 'point'-->
            <view class="map-box" v-if="isMp">
              <view class="map-fixed-main">
                <map
                  @click="goMap"
                  class="map"
                  id="map"
                  :longitude="longitude"
                  :latitude="latitude"
                  scale="12"
                  :show-location="true"
                  :markers="markers"
                  @markertap="makertap"
                >
                </map>
              </view>
            </view>
            <!-- #ifdef H5 -->
            <view class="map-container">
              <view class="map-fixed-main">
                <view id="container"></view>
              </view>
            </view>
            <!-- #endif -->
          </view>
          <!-- :style="{ height: scrollBoxHeight }" -->
          <view class="list-box">
            <!-- 筛选区域 -->
            <view class="filter-box">
              <view class="filter-main">
                <vc-filter
                  ref="filterRef"
                  :startType="startType"
                  :nearbyConfig="nearbyConfig"
                  :dropdownConfig="dropdownConfig"
                  @locationClick="locationClick"
                  @resetClick="resetClick"
                  @completeClick="completeClick"
                  @dropdownClick="dropdownClick"
                  @getLocation="getLocation"
                ></vc-filter>
              </view>
            </view>
            <view class="list-box-desc" v-if="comType === 'toilets'">为您找到附近<text style="color: #00BBB8;">{{ total }}</text>个公厕 </view>
            <view v-if="secondTab.length > 0" class="second-tab-box">
              <view class="second-tab-main">
                <view
                  v-for="(item, index) in secondTab"
                  :key="index"
                  :class="`${
                    index === secondActive
                      ? 'second-tab-item-active'
                      : 'second-tab-item'
                  }`"
                  @click="secondTabChange(index)"
                >{{ item.mapTypeName }}</view>
              </view>
            </view>
            <!-- 列表区域 -->
            <view class="list-box-main">
              <vc-empty v-if="dataList.length === 0"></vc-empty>
              <view  v-for="(item, index) in dataList" :key="index" @click="itemClick(item)"  class="list-item">
                <pointCom :info="item" :comType="comType" :locationInfo="locationInfo"></pointCom>
              </view>
            </view> 
          </view>
    </view>
  </vc-container>
</template>

<script>
import { platform, isH5, isApp, isMp } from "@/utils/platform";
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";

import tabbar from "../components/tabbar.vue";
import vcFilter from "@/components/library/base/vc-filter/index";
import pointCom from "../components/pointCom.vue";
import {
  selBusCodeAndDisCode,
  getMapProServiceInfo,
  getMapProLocationList,
} from "../api/base-services";
let hbd = null;
export default {
  name: "HLife",
  components: {
    tabbar,
    vcFilter,
    pointCom,
  },
  data() {
    return {
      placeholderText: '搜索机构名称或服务项',
      isMp: isMp,
      propsData: {
        props: {
          title: {
            value: "",
          },
          overflowY: {
            value: 'unset'
          }
        },
      },
      trueValue: true,
      status: "loading",
      // keywords: "",
      isChild: false, // 是否存在二级分类，目前有两种布局
      tabbarShow: false,
      initCompleteForMapProServiceInfo: 0,
      tabbarList: [],
      secondTab: [],
      secondActive: -1,

      loadOptions: null,
      comType: "", // 页面类型 toilets公厕
      total: 0,
      dataList: [],
      mapServiceId: "",
      mapTypeIds: "", //   必输 多个 , 分割
      keywords: "", //     模糊查询条件  搜索时可传
      longitude: "", //  			必输 经度
      latitude: "", //				必输 纬度
      page: 1, //
      rows: 10, //
      orderType: "", //		必输 排序方式  0-智能 1-距离
      distance: "", //			距离 默认智能能排序传1000、距离筛选。  单位米 ,
      districtCode: "", //			行政区编号
      businessCode: "", //			商圈编号

      // 筛选配置
      startType: [
        {
          type: "nearby",
        },
        {
          type: "dropdown",
          id: "M2_1",
        },
      ],
      // 1.定位模块配置
      nearbyConfig: {
        value: "M1",
        title: "附近", // 下拉菜单名
        options: {
          // 距离配置
          location: {
            keyName: "optName", // 从locationList元素对象中读取的键名
            bgColor: "#fff", // 背景颜色
            key: "location", // 返回参数名
            // 距离选项
            locationList: [{
                // optCode: '1000',
                optCode: '',
                optName: '附近智能推荐'
              },
              {
                optCode: '500',
                optName: '500m内'
              },
              {
                optCode: '1000',
                optName: '1km内'
              },
              {
                optCode: '3000',
                optName: '3km内'
              },
              {
                optCode: '5000',
                optName: '5km内'
              }
            ]
          },
          // 分类菜单配置
          menu: {
            key: "menu", // 返回参数名
            menuList: [],
            asyncSubMenuList: [], // 用于异步加载子菜单，若menuList下已包含children，无需配置。
          },
        },
      },
      // 2.下拉模块配置
      dropdownConfig: [
        {
          value: "M2_1",
          key: "dropdown", // 返回参数名
          id: "M2_1", // 组件id，用于区分多次使用M2功能
          defaultIndex: 0, // 默认值，options索引，不配置默认0
          title: "智能排序", // 初始化显示内容，防止空白。
          options: [
            {
              label: "智能排序",
              value: "0",
            },
            {
              label: "距离优先",
              value: "1",
            },
          ],
        },
      ],

      // 地图
      markerpoints: [],
      startPoint: {
        lat: "",
        lng: "",
      },

      locationInfo: {}, // 定位信息
    };
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
    // 页面高度
    scrollBoxHeight() {
      let val =
        this.safeTopDistance +
        this.navigationBarInfo.statusBarHeight +
        this.navigationBarInfo.navigationBarHeight;

      const isMap = this.isChild && this.isMp;// this.com Type === 'point' && this.isMp;
      const rpxVal = this.px2rpx(val) + 124 + this.tabbarShow ? 84 : 0 + isMap ? 300 : 0;
      // return "calc(100vh - " + val + "px - 124rpx - 84rpx - 300rpx)";
      return "calc(100vh - " + rpxVal + "rpx)";
    },
    // 小程序标记点
    markers() {
      return this.dataList.map((item, index) => {
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
  },
  onLoad(options) {
    this.loadOptions = options;
    hbd = this.bridgeSdk.hbd; //引用hbdsdk资源
    this.propsData.props.title.value = options.title;
    this.mapServiceId = options.serviceId;
    if ('找公厕' == this.propsData.props.title.value) {
      this.placeholderText = '请输入公厕名称或地址信息';
    } else if ('生活缴费网点查询' == this.propsData.props.title.value) {
      this.placeholderText = '请输入网点名称或地址信息';
    } else if ('参与网点' == this.propsData.props.title.value) {
      this.placeholderText = '请输入网点名称或地址信息';
    }
    // this.mapServiceId = "MP06241225142220784780822";
  // },
  // onReady() {
    // 每个页面必须这么写
    if(!this.bridgeSdk.isTokenValid()){
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  // async mounted() {
  //   // 这里配置网友提到的 $nextTick

  //   // 按需加载地图文件
  //   this.$nextTick(() => {
  //     this.bridgeSdk.InitBaiduMap(
  //       Number(this.longitude),
  //       Number(this.latitude)
  //     ); //调用sdk
  //     // this.showMarker(this.markerpoints);
  //     // this.bridgeSdk.InitBaiduMap(Number(this.longitude), Number(this.latitude));
  //   });
  // },
  onReachBottom() {
    console.log("触底 " + this.total + " " + this.page * this.rows)
    let allTotal = this.page * this.rows;
    if (allTotal < this.total) {
      this.status = "loading";
      // this.page++;
      // this.rows = this.rows;
      this.getDataList(this.page + 1);
    } else {
      this.status = "nomore";
    }
  },
  onPullDownRefresh() {
    this.dataList = [];
    //调用获取数据方法
    this.getDataList(1);
    setTimeout(() => {
      //结束下拉刷新
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    // 该方法在登录完成（App或小程序登录完成）后会被回调，初始化逻辑都放这里，以确保逻辑正常
    __loadData__() {
      console.log("__loadData__getLocation获取经纬度");
      // 获取经纬度
      // this.bridgeSdk.getLocation((res) => {
      //   console.warn("getLocation获取经纬度", res);
        // this.locationInfo = res;
        this.initFilter();
        this.getTabbarList();
   
      // }, "showModal");

      // this.getTabba rList();
      // this.initFilter();

      // 登录后回调该方法，此时加载一次数据
      if(this.longitude && this.latitude){
        this.getDataList(1);
      }
    },
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100;
      return px / scale;
    },
    getTabbarList() {
      getMapProServiceInfo({
        mapServiceId: this.mapServiceId,
      }).then(async (res) => {
        console.log("getMapProServiceInfo", res);
        // getMapProServiceInfo 初始化请求未完成，在getMapProServiceInfo调用 请求列表
        // const requestList = this.longitude && this.initCompleteForMapProServiceInfo === 0 && !(this.com Type === "toilets" || this.mapTypeIds);

        this.initCompleteForMapProServiceInfo = 1;
        if (res.length) {
          // this.tabba rShow = true;
          this.tabbarList = res.map((item) => {
            return {
              name: item.mapTypeName,
              id: item.mapTypeId,
              children: item.childTypeBo || [],
            };
          });
          this.mapTypeIds = this.tabbarList[0].id;
          this.isChild = true;
          this.comType = "point"; // 公厕没有分类
          // await this.bridgeSdk.InitBaiduMap();

          // this.getData List();
        } else {
          this.isChild = false;
          this.comType = "toilets"; // 公厕没有分类
          // this.tabba rShow = false;
          // this.getData List();
        }

        if (this.loadOptions.comType) {
          this.comType = this.loadOptions.comType;
          if (this.comType === "trade-in-point") { // 按照生活网点进行处理
            this.comType = "point"
          }
        }

        if (this.isChild === false) {
          this.tabbarShow = false;
          this.getDataList(1);
        } else {
          this.tabbarShow = true;
        }
        console.log("this.com Type", this.comType);

        // if (requestList) {
        //   this.getDataList( 1);
        // }
        
      }).catch(()=>{
        this.initCompleteForMapProServiceInfo = 1;
      });
    },
    getDataList(currentPage) {
      console.log(
        "getDataList=======----------------=======",
        this.mapTypeIds,
        "++++",
        this.longitude,
        "++++",
        this.comType
      );
      if ((this.isChild === false || this.mapTypeIds) && this.longitude) {
        // initCompleteForMapProServiceInfo

        let params = {
          mapServiceId: this.mapServiceId, //
          mapTypeIds: this.mapTypeIds, //   必输 多个 , 分割
          keywords: this.keywords, //     模糊查询条件  搜索时可传
          longitude: this.longitude, //  			必输 经度
          latitude: this.latitude, //				必输 纬度
          page: currentPage, //
          rows: this.rows, //
          orderType: this.orderType || "0", //		必输 排序方式  0-智能1-距离
          distance: this.distance || "", //			距离 默认智能能排序传1000、距离筛选。  单位米 ,
          districtCode: this.districtCode, //			行政区编号
          businessCode: this.businessCode, //			商圈编号
        };
        console.log("params", params);

        // if (this.page === 1) {
        //   this.dataList = [];
        // }
        getMapProLocationList(params).then(async (res) => {
          console.log("getMapProLocationList", res);
          this.page = currentPage;
          if (this.page <= 1) {
            this.dataList = [];
          }
          if (res.list && res.list.length) {
            this.total = res.total;
            if (this.page === 1) {
              this.dataList = res.list;
            } else {
              this.dataList = this.dataList.concat(res.list);
            }
            console.log("this.dataList", this.dataList);
            this.markerpoints = this.dataList.map((item) => {
              return {
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                height: 35, //高度
                width: 25, //宽度
                title: item.addrName, //标题
                address: item.address, //地址
                // icon图标
                iconPhotoUrl: item.iconPhotoUrl ? this.minioBaseUrl + item.iconPhotoUrl : ''
              };
            });
            // this.showMarker(this.markerpoints);
          } else {
            this.total = 0;
            this.dataList = [];
            this.markerpoints = [];
          }

          // 网点渲染时才存在地图
          if(this.isChild){ // this.com Type === 'point'
            // 防止重复初始化
            if(!this.markerAdded){
              await this.bridgeSdk.InitBaiduMap();
              this.markerAdded = true;
            }
            // 初始化marker点
            this.bridgeSdk.renderMarker({
              markerpoints: this.markerpoints || [],
              lng: Number(this.longitude),
              lat: Number(this.latitude),
            });
          }
          
        });
      }
    },
    getSearch() {
      console.log("---life ---- 去搜索");
      if (!this.latitude || !this.longitude) { // 需要有经纬度
        return;
      }
      this.bridgeSdk.jumpPage({
        url: "/package-services/base-search/index?serviceId=" + this.mapServiceId + '&title=' + this.propsData.props.title.value + '&type=' + this.comType + '&latitude=' + this.latitude + '&longitude=' + this.longitude, // 目标页面的路径
      });
    },
    //
    tabbarChange(i, e) {
      console.log("tabbarChange: ", i, e);
      this.activeIndex = i;
      this.mapTypeIds = e.id;
      this.secondActive = -1;
      this.getDataList(1);
      // if (e.children && e.children.length) {
        this.secondTab = e.children || [];
      // }

    },
    secondTabChange(index){
      console.log("secondTabChange", index);
      
      if(this.secondActive === index){
        this.secondActive = -1
        this.mapTypeIds = this.tabbarList[this.activeIndex].id
      }else{
        this.secondActive = index;
        this.mapTypeIds = this.secondTab[this.secondActive].mapTypeId;
      }

      this.getDataList(1);
    },
    itemClick(info) {
      console.log("itemClick", info);
      if(info.isDetail == '0' ) {
        return;
      }
      this.bridgeSdk.jumpPage({
        title: this.propsData.props.title.value + "-" + info.locationName,
        url:
          "/package-services/h-life/detail?id=" +
          info.locationId +
          "&title=" +
          this.propsData.props.title.value +
          "&lat=" +
          info.latitude +
          "&lng=" +
          info.longitude +
          "&distance=" +
          info.distance
      });
    },
    // 初始化筛选配置
    initFilter() {
      // 省市区
      selBusCodeAndDisCode({
        id:'130600'
      }).then((res) => {
        console.log("selBusCodeAndDisCode", res);
        this.$refs["filterRef"].setM1("menu", res);
      });
    },
    locationClick(e) {
      console.log("locationClick", e);
      this.distance = "";
    },
    // 滚动菜单：右侧点击事件
    subMenuClick(e) {
      console.log("subMenuClick", e);
    },
    // 滚动菜单：重置按钮事件
    resetClick(e) {
      console.log("resetClick", e);
    },
    // 滚动菜单：确认按钮事件
    completeClick(e) {
      console.log("completeClick", e); // 参数说明: 根据定义key值返回
      this.distance = e.location;
      this.page = 1;
      if (e.type == "nearby") {
        // 位置
        if (e.subMenuIndex == "-1") {
          this.districtCode = "";
          this.businessCode = "";
        } else {
          if (e.menuIndex == "1") {
            this.districtCode = ""
            this.businessCode = e.subMenuType
          }
          else {
            this.districtCode = e.subMenuType
            this.businessCode = ""
          }
        }
        this.getDataList(1);
      }
      if (e.type == "select") {
        // 筛选条件
        let arr = [];
        for (let key in e) {
          if (key !== "type" && key !== "menuIndex") {
            arr.push(e[key]);
          }
        }
        this.filterOptionsId = arr.join(",");
        this.getDataList(1);
      }
    },
    // 级别优先：下拉选项点击事件
    dropdownClick(e) {
      console.log("dropdownClick", e);
      // 筛选第二项 下拉选项 点击确认
      this.orderType = e.value;
      this.getDataList(1);
    },
    // 定位模块：获取当前位置
    getLocation(e) {
      console.log("定位模块：获取当前位置", e);
      this.locationInfo = e;
      this.lanlat = e;
      this.longitude = e.lng;
      this.latitude = e.lat;
      this.startPoint = e;
      console.log("this.com Type", this.comType);
      console.log("this.mapTypeIds", this.mapTypeIds);
      if (this.isChild === false || this.mapTypeIds) {
        this.getDataList(1);
      } else if (this.initCompleteForMapProServiceInfo === 0){
        // getMapProServiceInfo 初始化请求未完成，在getMapProServiceInfo调用 请求列表
      }
      // this. bridgeSdk.InitBaiduMap(Number(this.longitude), Number(this.latitude)); //调用sdk
    },

    //地图切换
    goMapChange() {
      this.showMap = !this.showMap;
      // this.$nextTick(() => {
      //   this.showMarker(this.markerpoints);
      // });
    },
    // showMarker(markerpoints) {
    //   this.bridgeSdk.showMarker(markerpoints); //调用sdk
    // },
    makertap(e) {
      // this.makertap1(this.markerpoints,e.markerId)
      console.log("这是标记点的点击事件", e);
    },
    // makertap1(data, i) {
    //   let sendlongitude, sendlatitude; //参数提取
    //   for (let c = 0; c < data.length; c++) {
    //     if (data[c].id == i) {
    //       console.log("这是标记点的点击事件", data[c]);
    //       sendlongitude = data[c].longitude;
    //       sendlatitude = data[c].latitude;
    //     }
    //   }
    //   // 调用sdk
    //   let s = `${Number(this.longitude)},${Number(this.latitude)}`;
    //   let e = `${Number(sendlongitude)},${Number(sendlatitude)}`;
    //   this.bridgeSdk.routePlan(s, e);
    // },
    // goLocation(item) {
    //   console.log("goLocation", item);
    //   let s = `${Number(this.longitude)},${Number(this.latitude)}`;
    //   let e = `${Number(item.longitude)},${Number(item.latitude)}`;
    //   console.log("开始坐标：", s, "终点坐标：", e);
    //   // 调用sdk
    //   this.bridgeSdk.routePlan(s, e);
    // },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  position: relative;
  width: 100%;
  height: 124rpx;
  .search-main {
    width: 750rpx;
    height: 124rpx;
    box-sizing: border-box;
    background: white;
    padding: 20rpx 40rpx;
    // margin-bottom: 18rpx;
    box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    position: fixed;
    z-index: 20;
  }
}

.tabbar-box {
  width: 100%;
  height: 84rpx;
  position: relative;
  .tabbar-main {
    width: 750rpx;
    height: 84rpx;
    box-sizing: border-box;
    padding: 20rpx 0rpx 10rpx 30rpx;
    background: #ffffff;
    position: fixed;
    z-index: 20;
  }
}
.map-box {
  width: 100%;
  height: 300rpx;
  position: relative;
  .map {
    width: 100%;
    height: 100%;
  }
}
.map-container {
  width: 100%;
  height: 300rpx;
  position: relative;

  #container {
    width: 100%;
    height: 100%;
  }
}
.map-box, .map-container {
  .map-fixed-main {
    width: 100%;
    height: 300rpx;
    position: fixed;
    z-index: 1;
    background-color: #fff;
  }
}

.list-box {
  width: 100%;
  // border-radius: 10rpx 10rpx 0 0;
  // overflow: auto;
  overflow: visible;
  background-color: #f5f5f5;
  .filter-box {
    position: relative;
    width: 100%;
    height: 80rpx;
    z-index: 20;
    .filter-main {
      background: #ffffff;
      position: fixed;
      width: 750rpx;
      height: 80rpx;
      box-sizing: border-box;
    }
  }
  .list-box-desc{
    width: 100%;
    height: 40rpx;
    text-align: center;
    font-size: 24rpx;
    line-height: 40rpx;
    padding: 10rpx 0;
  }
  .second-tab-box {
    position: relative;
    width: 100%;
    height: 80rpx;
    z-index: 18;
    .second-tab-main {
      position: fixed;
      width: 750rpx;
      height: 80rpx;
      box-sizing: border-box;
      padding: 0 32rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      background: #fff;
      .second-tab-item {
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border: 1px solid #00bcb8;
        color: #00bcb8;
        text-align: center;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      .second-tab-item-active {
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        background: #00bcb8;
        border: 1rpx solid #00bcb8;
        border-radius: 10rpx;
        margin-right: 20rpx;
        color: #fff;
      }
    }
  }
  .list-box-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20rpx;
    .list-item {
      margin-bottom: 20rpx;
      &:last-child {
        margin-bottom: 40rpx;
      }
    }
  }

}
</style>
