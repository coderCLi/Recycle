<!--
  User: songjuncheng
  Date: 2025-05-23 09:16:02
  Description: 地图地址类服务通用模板页
  Lasteditors:songjuncheng
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view class="true-content" style="position: relative; overflow: visible;">
          <view class="search-box">
            <view class="search-main">
              <u-search
                maxlength="20"
                height="40"
                :placeholder="placeholderText"
                placeholderColor="#999"
                @search="getSearch($event, 'search')"
                @blur="getSearch($event, 'blur')"
                @clear="getSearch($event, 'clear')"
                :showAction="false"
                v-model="keywords"
                shape="round"
              ></u-search>
            </view>
          </view>
          <!-- 菜单tabbar -->
          <view class="tabbar-box" v-if="tabbarShow && tabbarList.length > 1">
            <view class="tabbar-main">
              <tabbar :list="tabbarList" @change="tabbarChange"></tabbar>
            </view>
          </view>

          <view v-show="isShowMap">
            <!-- 地图区域 -->
            <view class="map-box" :style="{top: tabbarShow && tabbarList.length > 1 ? '104px' : '62px'}" v-if="isMp">
              <view class="map-fixed-main">
                <map
                  @click="goMap"
                  class="map"
                  id="map"
                  :longitude="longitude"
                  :latitude="latitude"
                  scale="10"
                  :show-location="true"
                  :markers="markers"
                  @markertap="makertap"
                >
                </map>
              </view>
            </view>
            <!-- #ifdef H5 -->
            <view class="map-container" :style="{top: tabbarShow && tabbarList.length > 1 ? '104px' : '62px'}">
              <view class="map-fixed-main">
                <view id="container"></view>
              </view>
            </view>
            <!-- #endif -->
          </view>
             

          <view class="list-box">
            <!-- 筛选区域 -->
              <touch-move :upDistance="-1" :downDistance="downDistance" :dropFilterStatus="dropFilterStatus" @touchEndBack="touchEndBack" :comType="comType" :isShowMap="isShowMap">
            <view class="filter-box" :style="{height: dataSourceType === 'baidu'? '36rpx' : ''}">
              <view class="filter-main" 
              :style="{height: dataSourceType === 'baidu'? '36rpx' : ''}"
              :class="(touchType == 'down' && isShowMap) ? 'filter-Down' : ''">
                <map-filter
                 v-if="dataSourceType !== 'baidu'" 
                  ref="filterRef"
                  :startType="startType"
                  :nearbyConfig="nearbyConfig"
                  :selectConfig="selectConfig"
                  :dropdownConfig="dropdownConfig"
                  :dropdownProps="dropdownProps"
                  @locationClick="locationClick"
                  @resetClick="resetClick"
                  @completeClick="completeClick"
                  @dropdownClick="dropdownClick"
                  @getLocation="getLocation"
                  @dropdownOpen="dropdownOpen"
                ></map-filter>
              </view>
            </view>
          </touch-move>
        <view style="width: 100%;background: #f4f4f4;position:relative;z-index: 10;display: flex; flex-direction: column;" :style="{height: listBoxHeight }">
        <!-- 快速筛选区域 -->
            <view v-if="mapServiceBaseInfo.isQuickFilter == '1' && secondTab.length > 0 && dataSourceType !== 'baidu'" class="second-tab-box">
                <scroll-view scroll-x="true" class="second-tab-main" style="width:100%">
               <!-- <view class="second-tab-main"> -->
                  <view
                    v-for="(item, index) in secondTab"
                    :key="index"
                    :class="`${
                      item._checked
                        ? 'second-tab-item-active'
                        : 'second-tab-item'
                    }`"
                    @click="secondTabChange(item,index)"
                  >{{ item.title }}</view>
              <!-- </view> -->
                </scroll-view>            
            </view>
            <!-- 列表区域 -->
            <view class="list-box-main" :class="(dataSourceType == 'baidu' && touchType == 'down') ? 'filter-Down' : ''">
              <scroll-view class="list-scroll-view" :scroll-y="true" @scrolltolower="onScrollToLower">
                <vc-empty v-if="dataList.length === 0"></vc-empty>
                <view  v-for="(item, index) in dataList" :key="index" class="list-item">
                  <addrCom :info="item" :comType="comType" :isneedOpenLocation="isneedOpenLocation" :dataSourceType="dataSourceType"
                           :longitude="longitude" :latitude="latitude"></addrCom>
                </view>
                <u-loadmore :status="status" v-if="dataList.length !== 0"></u-loadmore>
                <view style="height: 50rpx;"></view>
              </scroll-view>
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
import mapFilter from "../components/map-filter/map-filter.vue";
import addrCom from "../components/addrCom.vue";
import touchMove from "../components/touchMove.vue"
import {
  selBusCodeAndDisCode,
  getAddrServiceList,
  getAddrInfoList,
  getQuickFilterList,
  selFilterCategoryById,
  getMapList
} from "../api/base-services";
import { checkIsEmpty } from "@/utils/bridge";
let hbd = null;
export default {
  name: "HLife",
  components: {
    tabbar,
    mapFilter,
    addrCom,
    touchMove
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
          isFullScreen: {
            value: true,
          },
          disableScroll: {
            value: true,
          }
        },
      },
      isShowMap:true,
      status: "nomore",
      tabbarShow: false,
      tabbarList: [],
      secondTab: [],
      secondActive: -1,
      comType: "point", // 页面类型 
      total: 0,
      dataList: [],
      mapServiceId: "",
      addrTypeId: "", //   必输 多个 , 分割
      keywords: "", //     模糊查询条件  搜索时可传
      longitude: "", //  			必输 经度
      latitude: "", //				必输 纬度
      page: 1, //
      rows: 10, //
      orderType: "", //		必输 排序方式  0-智能 1-距离
      distance: "", //		距离筛选。  单位米 ,
      districtCode: "", //			行政区编号
      businessCode: "", //			商圈编号
 
      // 筛选配置
      startType: [
        {
          type: "nearby",
          sort: 1
        },
        // {
        //   type: "dropdown_select",
        //   id: "M2_2",
        // },
        {
          type: "dropdown",
          id: "M2_1",
          sort: 3
        }
        // {
        //   type: 'select',
        // },
      ],
      // 1.定位模块配置
      nearbyConfig: {
        value: "M1",
        title: "位置距离", // 下拉菜单名
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
          value: "M2_2",
          key: "dropdown_2", // 返回参数名
          type: "select",
          id: "M2_2", // 组件id，用于区分多次使用M2功能
          isNum: true, // 是否显示数字
          offset:[5,200],
          defaultIndex: '', // 默认值，options索引，不配置默认0
          title: "分类", // 初始化显示内容，防止空白。
          options: [],
        },
        {
          value: "M2_1",
          key: "dropdown", // 返回参数名
          id: "M2_1", // 组件id，用于区分多次使用M2功能
          defaultIndex: 0, // 默认值，options索引，不配置默认0
          title: "距离优先", // 初始化显示内容，防止空白。
          options: [
            {
              label: "距离优先",
              value: "1",
            },
          ],
        },
      ],
      dropdownProps:{
         activeColor: "#00BCB8", // 标题和选项卡选中的颜色 String
         nactiveColor: "#606266", // 标题和选项卡未选中的颜色 String
      },

     // 3.筛选模块配置
      selectConfig: {
        value: 'M3',
        title: '筛选', // 下拉菜单名
        isSum: true, // 是否启用筛选统计
        offset: [5, 8], // 筛选统计位置偏移，格式为 [x, y]，也即设置的为top和right的值，isSum=true时有效
        bgColor: '#00BCB9', // 筛选统计背景色
        options: {
          // 左侧菜单列表配置
          menu: [],
          // 右侧选项列表配置，menuList顺序与menu需保持一致
          menuList: [],
        },
      },
    
      // 地图
      markerpoints: [],
      startPoint: {
        lat: "",
        lng: "",
      },
      
      locationInfo: {}, // 定位信息
      listBoxHeight:'',
      touchType:'down',//滑动类型
      tabHeight:0,
      downDistance: 0, // 距顶部距离
      filterHeight: 0, // 筛选区域高度
      filterOptionsId:'',
      mapServiceBaseInfo:{},
      menuChildList:[], //筛选项数据
      saveaddrTypeId:[], // 保存的分类id
      saveFilterOptionIds:[], // 保存的筛选id
      mapTabbarId:'', //当前tabbar的id
      cityName:'',
      region: '保定',
      query: '',
      dataSourceType:'', // 数据源类型
      mapList:[],
      isneedOpenLocation:true,
      dropFilterStatus:'0', // 筛选栏展开状态

      searchYanchiFunc: null,
      offWidth: 80, // 微调
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
      
      const rpxVal = this.px2rpx(val) + 114;
      console.log("listBoxHeight03", rpxVal,this.tabbarShow);
      
      return rpxVal;

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
    // #ifdef H5
    this.offWidth = 96
    // #endif
    hbd = this.bridgeSdk.hbd; //引用hbdsdk资源
    this.propsData.props.title.value = options.title;
    this.addrServiceId = options.serviceId;
    this.dataSourceType = options.dataSourceType || '';
    this.placeholderText = '请输入搜索关键词';
    this.isShowMap = options.isShowMap || true;
    this.downDistance = this.isShowMap? '190px' : 0;
    // #ifdef H5
    this.downDistance = '190px'
    // #endif
    //默认走页面title，如果后端配置就走配置query
    this.query = !this.bridgeSdk.checkIsEmpty(options.query) ? options.title : options.query;//百度检索
    // 每个页面必须这么写
    if(!this.bridgeSdk.isTokenValid()){
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onUnload() {
    if (this.searchYanchiFunc != null) {
      this.searchYanchiFunc.clear();
      this.searchYanchiFunc = null;
    }
  },
  
  methods: {
    // 该方法在登录完成（App或小程序登录完成）后会被回调，初始化逻辑都放这里，以确保逻辑正常
  async  __loadData__() {
    // const user = await this.bridgeSdk.checkLogin();
      this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
      console.log('未登录',this.userInfo);      
          
        if(this.dataSourceType !== 'baidu'){
           console.log('非百度地图数据源');  
           if (!this.userInfo){
              // this.isShowMap = false
              // this.downDistance = 0
           }else{
              //  this.isShowMap = true
              //  this.downDistance = 690
           }
        }else{
              this.bridgeSdk.getLocation(res => {
                console.log('获取经纬度,定位信息',res);    
              this.locationInfo = res;
              this.isneedOpenLocation = res.locationFail === true
              this.longitude = Number(res.lng);
              this.latitude = Number(res.lat);
              this.startPoint.lng = Number(res.lng);
              this.startPoint.lat = Number(res.lat);
               console.log(this.longitude, this.latitude,this.locationInfo,'获取经纬度');
               this.getBaiduMapList()
             });
        }
        
        this.filterHeight = this.dataSourceType == 'baidu' ? 640 : 720

        this.getTabbarList();
      // 登录后回调该方法，此时加载一次数据
      // if(this.longitude && this.latitude){
      //   this.getListDetail(1);
      // }     
      
    },
    //筛选栏是否展开状态
    dropdownOpen(e){
      console.log('筛选栏展开状态',e);
      this.dropFilterStatus = e
    },
    touchEndBack(e){  
      console.log("touchEndBack", e);
        if(this.dataSourceType !== 'baidu'){
        console.log('筛选栏展开状态=',this.dropFilterStatus);
        
        if(this.dropFilterStatus == '1' && this.touchType == 'down'){
          this.$nextTick(() => {
          this.$refs.filterRef.refreshMask(); // 设置遮罩层高度
          })
        }
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        if(e == 'up'){
          this.touchType = 'up'
          this.calcH('up');
        }else{
          this.touchType = 'down'
          this.calcH('down');
        }
        console.log("listBoxHeight02", this.listBoxHeight);
      }, 100)
      
    },
    calcH(type) {
      // 存在上部tab列表 42px
      const existTopTab = this.tabbarShow && this.tabbarList.length > 1;
      console.log("existTopTab", existTopTab);
      // 存在下部筛选条件 40px
      const existFilter = this.isFilter == '1';
      console.log("existFilter", existFilter)

      const statusBarHeight = this.navigationBarInfo.statusBarHeight ? this.navigationBarInfo.statusBarHeight : 0;
      const navigationBarHeight = this.navigationBarInfo.navigationBarHeight ? this.navigationBarInfo.navigationBarHeight : 0;
      const sysTopDistance = statusBarHeight + navigationBarHeight + 'px';
      // 搜索栏高度
      const searchBoxHeight = '62px';
      // 上部tab列表高度
      const tabBoxHeight = existTopTab ? '42px' : "0px";
      // 筛选条件高度
      const conditionBoxHeight = existFilter ? '40px' : "0px";
      // 筛选条件距离上部tab列表底部高度
      const conditionBoxTopmargin = '190px';
      console.log("statusBarHeight", statusBarHeight);
      console.log("navigationBarHeight", navigationBarHeight);
      console.log("sysTopDistance", sysTopDistance);
      console.log("searchBoxHeight", searchBoxHeight);
      console.log("tabBoxHeight", tabBoxHeight);
      console.log("conditionBoxHeight", conditionBoxHeight);
      console.log("conditionBoxTopmargin", conditionBoxTopmargin);

      let _modify_distance = 0;
      // 向上滑动
      if(type === 'up'){
        _modify_distance = `${conditionBoxTopmargin}`
      }
      // 向下滑动
      else{
        _modify_distance = '0px'
      }
      this.listBoxHeight = `calc(100vh - ${sysTopDistance} - ${searchBoxHeight} - ${tabBoxHeight} - ${conditionBoxHeight} - ${conditionBoxTopmargin} + ${_modify_distance})`

      // 同时不存在上部tab列表、下部筛选条件
      if(!existTopTab && !existFilter) {
        console.log("同时不存在上部tab列表、下部筛选条件", this.listBoxHeight);
      }
      // 不存在上部tab列表、存在下部筛选条件
      if(!existTopTab && existFilter) {
        console.log("不存在上部tab列表、存在下部筛选条件", this.listBoxHeight);
      }
      // 存在上部tab列表、不存在下部筛选条件
      if(existTopTab && !existFilter) {
        console.log("存在上部tab列表、不存在下部筛选条件", this.listBoxHeight);
      }
      if(existTopTab && existFilter) {
        console.log("同时存在上部tab列表、下部筛选条件", this.listBoxHeight);
      }

    },
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100;
      return px / scale;
    },
    // 触底事件
    onScrollToLower() {
      console.log("触底 " + this.total + " " + this.page * this.rows)
      let allTotal = this.page * this.rows;
      if (allTotal < this.total) {
        this.status = "loading";
        // this.page++;
        // this.rows = this.rows;
        this.getListDetail(this.page + 1);
      } else {
        this.status = "nomore";
      }
    },
    getTabbarList() {
      getAddrServiceList({
        addrServiceId: this.addrServiceId,
      }).then(async (res) => {
        console.log("getMapProServiceInfo", res);
        this.mapServiceBaseInfo = res
        // 存在分类
        if (res.isChild == '1' && res.addrTypeListBoList && res.addrTypeListBoList.length > 0 && this.dataSourceType !== 'baidu') {
          this.tabbarShow = true;
          this.tabbarList =  res.addrTypeListBoList.map((item) => {
            return {
              name: item.addrTypeName,
              id: item.addrTypeId,
              children: (item.sonList || []).map((child) => ({
                label: child.addrTypeName,
                value: child.addrTypeId,
              })),
            };
          });
          if(this.tabbarList.length > 1){
            if(this.addrTypeId == ''){
              this.addrTypeId = this.tabbarList[0].id;  
            }
            this.tabHeight = 84    
          }else{
            this.addrTypeId = ''
            this.$nextTick(()=>{
            this.tabbarChange(0,this.tabbarList[0])
            })
          }
        } else {
          // 获取绑定在服务上的快筛项
          if(res.isQuickFilter == '1'){
            await this.getQuickList(this.addrServiceId)
          }
          this.tabbarShow = false;
          this.tabHeight = 0
        }
        this.comType = "point"; // 
        
        // 是否存在分类筛选
        if (res.isClassify == '1'){
           let newData = {
              type: "dropdown_select",
              id: "M2_2",
              sort: 2
            }
          if (!this.startType.some(item => item.type === "dropdown_select")) {
            // 没有分类筛选，插入分类筛选
            //  this.startType.splice(1,0,newData)
            this.startType.push(newData)
             if (res.isFilter == '1'){
                const windowInfo = await this.bridgeSdk.getWindowInfo();

                let offWidth = windowInfo.screenWidth ? ((windowInfo.screenWidth / 4.0 * 2) + (windowInfo.screenWidth / 4.0 - this.offWidth) / 2.0) : 200
                this.dropdownConfig[0].offset = [5,offWidth]
                // this.dropdownConfig[0].offset = [5,200]
              }else{
                this.dropdownConfig[0].offset = [5,150]
              }
             this.$refs["filterRef"].info('noGetLocation')  //重新初始化筛选组件，小程序端必须这么写(防止筛选组件出现重复筛选类)
          }
          this.selectConfig.offset = [5,8]
        }else{
          this.selectConfig.offset = [5,24]
        }

        this.isFilter = res.isFilter;

        // 是否存在筛选分类
        if (res.isFilter == '1'){
          console.log('勋在筛选分类');
          
          let filterData = {
            type: "select",
            sort: 4
          }  
          if (!this.startType.some(item => item.type === "select")) {
            // 没有筛选分类，插入筛选分类
              this.startType.push(filterData)
              this.$refs["filterRef"].upDateSelectData()  //重新初始化筛选组件，小程序端必须这么写
          }
          // 筛选
          let menuRes = await selFilterCategoryById({ id: this.addrServiceId })
              console.log("selFilterCategoryById", menuRes)
              let menuListM3 = [];
              menuRes.forEach(item => {
                menuListM3.push({
                  label: item.title,
                  value: item.key,
                })
              })
             this.menuChildList = menuRes

           if(this.secondTab.length > 0){
              this.secondTab.forEach(item => {
                item._checked = false
                if(this.menuChildList.length > 0){  // 有筛选时往筛选中赋值父级分类
                    this.menuChildList.forEach((menuItem,menuIndex) => {
                        menuItem.list.forEach((i,sIvndex)=>{
                          if(i.optCode == item.relationId){
                            item.parentId = menuItem.key
                            item.menuType = menuItem.type
                          }
                        }) 
                    })
                }
              })     
                       
             }
             this.$nextTick(()=>{
              this.$refs['filterRef'].setM3('select', menuRes);
              this.$refs['filterRef'].setM3('menu', menuListM3);
             })
          const windowInfo = await this.bridgeSdk.getWindowInfo();
          let offWidth = windowInfo.screenWidth ? ((windowInfo.screenWidth / 4.0 * 2) + (windowInfo.screenWidth / 4.0 - this.offWidth) / 2.0) : 200
          this.dropdownConfig[0].offset = [5,offWidth]
        }else{
          this.dropdownConfig[0].offset = [5,150]
        }

        // // 是否有地图
        // if(!this.isShowMap){
        //   this.listBoxHeight = "calc(100vh - " + (this.scrollBoxHeight + this.tabHeight) + "rpx + 391rpx)"
        // }else{
        //   this.listBoxHeight = "calc(100vh - " + (this.scrollBoxHeight + this.tabHeight + this.filterHeight) + "rpx + 391rpx)"
        // }
        // // #ifdef H5
        //  this.listBoxHeight = "calc(100vh - " + (this.scrollBoxHeight + this.tabHeight + this.filterHeight) + "rpx + 391rpx)"
        // // #endif

        this.calcH();

        console.log("tabbar所属id", this.addrTypeId,this.scrollBoxHeight,this.tabHeight,this.filterHeight,this.listBoxHeight);
        if(this.dataSourceType !== 'baidu'){
           this.getListDetail(1)
        }
      }).catch(()=>{
      });
    },
    // 获取快筛项列表
    async getQuickList(id) {
      if(this.dataSourceType !== 'baidu'){
         let res = await getQuickFilterList({serviceId: id});
         console.log('快筛项列表',res);
         this.secondTab = res
         if(this.secondTab.length > 0){
          this.secondTab.forEach(item => {
            item._checked = false
          })
         }
      }
    },
    getListDetail(currentPage) {
      console.log(
        "getListDetail=======----------------=======",
        this.addrTypeId,
        "++++",
        this.longitude,
        "++++",
        this.comType
      );
        // let needDistance = this.isneedOpenLocation ? this.distance : '-1'// 开启定位时传 -1
        let params = {
          addrServiceId: this.addrServiceId, //
          addrTypeId: this.addrTypeId, //   必输 多个 , 分割
          filterOptionsId: this.filterOptionsId, // 筛选条件id
          keywords: this.keywords, //     模糊查询条件  搜索时可传
          longitude: this.longitude, //  			必输 经度
          latitude: this.latitude, //				必输 纬度
          page: currentPage, //
          rows: this.rows, //
          orderType: this.orderType || "1", //		必输 排序方式  0-智能1-距离
          distance: this.distance || "", //			距离 默认智能能排序传1000、距离筛选。  单位米 ,
          addrDistrictCode: this.districtCode, //			行政区编号
          businessCode: this.businessCode, //			商圈编号
        };
        console.log("params", params);
     if(this.longitude && this.latitude){

        getAddrInfoList(params).then(async (res) => {
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
            this.dataList.forEach((item) => {
              if(item.label){
                 item.labelList = item.label.split(',')
              }else{
                item.labelList = []
              }
              if(item.institutionName){
                  item.labelList.unshift(item.institutionName)
              }
              if(item.phone){
                item.phoneList = item.phone.split(',')
              }else{
                item.phoneList = []
              }
            })
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
          if(this.comType === 'point'){
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
    getSearch(keywords, type) {
      function throttle(func, limit) {
        let lastFunc;
        let lastRan;

        return {
          startAction: function() {
            const context = this;
            const args = arguments;

            if (!lastRan) {
              func.apply(context, args);
              lastRan = Date.now();
            } else {
              clearTimeout(lastFunc);
              lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                  func.apply(context, args);
                  lastRan = Date.now();
                }
              }, limit - (Date.now() - lastRan));
            }
          },
          clear: () => {
            if (lastFunc) {
              clearTimeout(lastFunc);
            }
            lastFunc = null;
            lastRan = null;
          }
        }
      }

      if (this.searchYanchiFunc == null) {
         this.searchYanchiFunc = throttle((keywords, type)=>{
            if( this.time && new Date().getTime() - this.time < 1000){
                return
            }
            console.log('----------------------最终-搜索-', type)
            this.time = new Date().getTime();
            this.keywords = keywords;
            this.page = 1;
            this.dataList = []
            if(this.dataSourceType == 'baidu'){
              this.getBaiduMapList()
            }else{
              this.getListDetail(1)
            }
          }, 9)
      }
     

      this.searchYanchiFunc.startAction(keywords, type);
        
    },
    //
   async tabbarChange(i, e) {
      console.log("tabbarChange: ", i, e);
      this.activeIndex = i;
      const _oldId = this.addrTypeId;
      if(this.tabbarList.length > 1){
        this.addrTypeId = e.id;
        this.mapTabbarId = e.id;
      }else{
        this.addrTypeId = ''
        this.mapTabbarId = ''
      }
      this.secondActive = -1;
      let heightLimt = e.children.length > 5 ? 200 : ''
      let twList = []
      if(e.children.length > 0){
         twList = e.children
      }else{
         twList = []
      }
      if(this.mapServiceBaseInfo.isClassify == '1'){ //有分类时
          this.$nextTick(()=>{
          this.$refs["filterRef"].setM2Select(0, twList, heightLimt);
          // 重置筛选项
          this.$refs["filterRef"].resetClick('dropdown_select',0)
          })
      }
       console.log('有快筛项,开始执行',this.mapServiceBaseInfo.isQuickFilter);
      
      if (this.mapServiceBaseInfo.isQuickFilter == '1'){
       await this.getQuickList(e.id)
      }
      if(this.mapServiceBaseInfo.isFilter == '1'){
        this.$refs["filterRef"].resetClick('select',0)
      }
  
      if ((_oldId || '') != this.addrTypeId) {
        this.keywords = '';
        this.page = 1;
        this.dataList = []
      }
           console.log('this.secondTab',this.secondTab);
           // 有二级分类时再初始化一遍快筛项
            if(this.secondTab.length > 0){
              this.secondTab.forEach(item => {
                item._checked = false
                if(this.menuChildList.length > 0){  // 有筛选时往筛选中赋值父级分类
                    this.menuChildList.forEach((menuItem,menuIndex) => {
                        menuItem.list.forEach((i,sIvndex)=>{
                          if(i.optCode == item.relationId){
                            item.parentId = menuItem.key
                            item.menuType = menuItem.type
                          }
                        }) 
                    })
                }
              })     
                       
             }
      this.getListDetail(1);

    },
    secondTabChange(data,index){
      console.log("secondTabChange==", data);
        this.secondTab.forEach((sItem,sIndex)=>{
           if(sIndex == index){
             sItem._checked = !sItem._checked
           }else{
             if(sItem.type == '0' && data.type == '0'){
              sItem._checked = false
             }
             if(sItem.type == '1' && data.type == '1'){ // 筛选

              if(data.menuType == '0' && data.parentId == sItem.parentId){     // 单选时取消其他选中状态      
                          sItem._checked = false
              }
              
             }
           }
        })
      setTimeout(()=>{
        // 判断分类中是否有快筛项，有的话回显
       if(data.type == '0'){
          if(this.mapServiceBaseInfo.isClassify == '1'){ // 有分类时触发回显逻辑
            this.tabbarList[this.activeIndex].children.forEach((item,index) => { 
              if(item.value == data.relationId){
                console.log(item.value,'相等');         
                this.$refs['filterRef'].dropChoseClick({menuIndex:0,index:index})
              }
            })
          }
        // 单选逻辑
        if(data._checked){
          this.addrTypeId = data.relationId
        }else{
          this.addrTypeId = this.mapTabbarId // 回到默认分类
        }
        // if(!data._checked){
        //    this.saveaddrTypeId.splice(this.saveaddrTypeId.indexOf(data.relationId),1)
        // }else{
        //    this.saveaddrTypeId.push(data.relationId)
        // }
        // if(this.saveaddrTypeId.length > 0){
        //   this.addrTypeId = this.saveaddrTypeId.join(",")
        // }else{
        //   this.addrTypeId = this.mapTabbarId // 回到默认分类
        // }
       }
        if(data.type == '1'){
           if(this.mapServiceBaseInfo.isFilter == '1'){ // 有筛选时触发回显逻辑
              this.menuChildList.forEach(((menuItem,menuIndex) => {
                if(menuItem.list && menuItem.list.length > 0){
                    menuItem.list.forEach((sItem,sIndex)=>{
                      if(sItem.optCode == data.relationId){
                        if(menuItem.type == '0'){
                          this.$refs['filterRef'].radioClick({menuIndex:menuIndex,index:sIndex,optCode:data.relationId})
          }else{
                          this.$refs['filterRef'].checkboxClick({menuIndex:menuIndex,index:sIndex,optCode:data.relationId})
                        }
                      }
                    })
                }
              }))
           }
          let filterArr = []
          this.secondTab.forEach((item,index)=>{
            if(item.type == '1' && item._checked){
                filterArr.push(item.relationId)
          }
          })
          this.filterOptionsId = filterArr.join(",")
           console.log("筛选条件==",this.filterOptionsId);

      }
      console.log('分类id:',this.addrTypeId,'筛选id',this.filterOptionsId,'已选ids');
      
      this.getListDetail(1);
      },300)
    },
    // 初始化筛选配置
    initFilter() {
      // 省市区
      selBusCodeAndDisCode({
        id:'130600'
      }).then((res) => {
        console.log("selBusCodeAndDisCode", res);
        if(res){
          res[0].children.unshift({ label: "全城", value: "" })
        }
        this.$nextTick(()=>{
          console.log("menuListM1: ", res);
         this.$refs["filterRef"].setM1("menu", res);
        })
       setTimeout(() => {
          if(this.longitude){
            this.getListDetail(1);
          }
         },500)
      let needOpenLocation = this.locationInfo.locationFail===true
      if(!needOpenLocation){
        this.cityName = '附近'
        this.$refs["filterRef"].setM1('title','附近')
      }else{
        this.cityName = '位置距离'
        this.$refs["filterRef"].setM1('title','位置距离')
      }
      });
    },
    locationClick(e) {
      console.log("locationClick", e);
      this.distance = "";
    },

    // 滚动菜单：重置按钮事件
    resetClick(e) {
      if(e.type == 'dropdown_select'){
          this.mapTypeIds = this.mapTabbarId // 回到默认分类
          this.secondTab.forEach((item,index)=>{
            if(item.type == '0'){
              item._checked = false
            }
          })
      }
      if(e.type =='select'){
          this.filterOptionsId = ""
          this.secondTab.forEach((item,index)=>{
            if(item.type == '1'){
              item._checked = false
            }
          })
      }
      if(e.type == 'nearby'){
        let needOpenLocation = this.locationInfo.locationFail===true
        if(!needOpenLocation){
          this.cityName = '附近'
          this.$refs["filterRef"].setM1('title','附近')
        }else{
          this.cityName = '位置距离'
          this.$refs["filterRef"].setM1('title','位置距离')
        }
      }
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
          if(e.subMenuTypeName){
            this.$refs["filterRef"].setM1('title',e.subMenuTypeName)
          }else{
            let needOpenLocation = this.locationInfo.locationFail===true
            if(!needOpenLocation){
              this.$refs["filterRef"].setM1('title','附近')
            }else{
              this.$refs["filterRef"].setM1('title','位置距离')
            }
          }
        this.getListDetail(1);
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
        console.log('筛选条件--',this.filterOptionsId);
        this.getListDetail(1);
        
       // 如果有快速筛选，回显快筛项
        if(this.secondTab.length > 0){
         if(this.filterOptionsId){
           let filterArr = this.filterOptionsId.split(",")
           this.saveFilterOptionIds = filterArr
            // filterArr.forEach((aItem) => {
            this.secondTab.forEach((item,index)=>{
              if(item.type == '1'){
                filterArr.includes(item.relationId) ? item._checked = true : item._checked = false             
              }
            })            
         }
        }
      }
      if(e.type == "dropdown_select"){
          let arr = [];
          for (let key in e) {
            if (key !== "type") {
              arr.push(e[key]);
            }
          }
        if(arr.length > 0){
          this.addrTypeId = arr.join(",")
        }else{
          this.addrTypeId = this.mapTabbarId // 回到默认分类
        }
         this.getListDetail(1);
    //  如果有快速筛选，回显快筛项
        if(this.secondTab.length > 0){
          this.secondTab.forEach((item,index)=>{
            console.log('父级item',item,item.relationId);
              if(item.type == '0'){
                arr.indexOf(item.relationId) > -1 ? item._checked = true : item._checked = false
              }
          })
        }
      }
    },
    // 级别优先：下拉选项点击事件
    dropdownClick(e) {

      // 筛选第二项 下拉选项 点击确认
      this.orderType = e.value;
      
      this.getListDetail(1);
    },
    // 定位模块：获取当前位置
    getLocation(e) {
      console.log("定位模块：获取当前位置", e);
      this.isneedOpenLocation = e.locationFail === true
      this.locationInfo = e;
      this.lanlat = e;
      this.longitude = e.lng;
      this.latitude = e.lat;
      this.startPoint = e;
      this.initFilter();
      console.log("this.addrTypeId", this.addrTypeId);
      // this. bridgeSdk.InitBaiduMap(Number(this.longitude), Number(this.latitude)); //调用sdk
    },

   // 获取百度地图来源地址
    getBaiduMapList(){
      let params = {
        mapId: this.addrServiceId,
        keywords: this.keywords,
        longitude: this.longitude,
        latitude: this.latitude,
        dataSourceType: this.dataSourceType,
        // current:'',
        size: '100',
        query: this.query,
        region: this.region,
      }
      getMapList(params).then(async res => {
        this.mapList = res.mapLocationListBOS;
        console.log("这是地图列表", this.mapList);
        this.dataList = [...this.mapList];
        this.markerpoints = this.mapList.map(item => {
          console.log("icon图标", this.minioBaseUrl + item.iconPhotoUrl);
          return {
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            height: 35,//高度
            width: 25,//宽度
            title: item.locationName,//标题
            address: item.address,//地址
            // icon图标
            iconPhotoUrl: item.iconPhotoUrl ? this.minioBaseUrl + item.iconPhotoUrl : ''
          }
        })
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

      })
    },
    
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
  height: 62px;
  .search-main {
    width: 750rpx;
    height: 62px;
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
  height: 42px;
  position: relative;
  .tabbar-main {
    width: 750rpx;
    height: 42px;
    box-sizing: border-box;
    padding: 10px 0rpx 5px 30rpx;
    background: #ffffff;
    position: fixed;
    z-index: 20;
  }
}
.map-box {
  width: 100%;
  height: 355px;
  position: absolute;
  top: 104px;
  left: 0;
  .map {
    width: 100%;
    height: 100%;
  }
}
.map-container {
  width: 100%;
  height: 355px;
  position: absolute;
  top: 104px;
  left: 0;
  
  #container {
    width: 100%;
    height: 100%;
  }
}
.map-box, .map-container {
  .map-fixed-main {
    width: 100%;
    height: 355px;
    position: fixed;
    z-index: 1;
    background-color: #fff;
  }
}

.list-box {
  // width: 100%;
  // border-radius: 10rpx 10rpx 0 0;
  // // overflow: auto;
  // // overflow: visible;
  // background-color: #f5f5f5;
  // position:relative;
  // z-index: 5;
  .filter-box {
    position: relative;
    width: 100%;
    height: 40px;
    z-index: 20;
    overflow: hidden;
    .filter-main {
      background: #fff;
      position: fixed;
      width: 750rpx;
      height: 40px;
      box-sizing: border-box;
    }
    .filter-Down{
       background: #F4F5F7;
       border-radius: 40rpx 40rpx 0rpx 0rpx;
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
    // .second-scroll{
    //   position: fixed;

    // }
    .second-tab-main {
      // width: 100%;
      // height: 80rpx;
      box-sizing: border-box;
      padding: 16rpx 32rpx 16rpx;
      white-space: nowrap;
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      // flex-wrap: nowrap;
      background: #F4F5F7;
      margin-top: 10rpx;
      .second-tab-item {
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border: 1px solid #00bcb8;
        color: #00bcb8;
        text-align: center;
        border-radius: 10rpx;
        margin-right: 20rpx;
        white-space: nowrap;
        display: inline-block;
      }
      .second-tab-item-active {
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        background: #00bcb8;
        border: 1rpx solid #00bcb8;
        border-radius: 10rpx;
        margin-right: 20rpx;
        color: #fff;
        white-space: nowrap;
        display: inline-block;
      }
    }
  }
  .list-box-main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0 36rpx;
    background-color: #f5f5f5;
    z-index: 5;
    transition: height 0.3s ease;
    height: 100%;
    box-sizing: border-box;
    flex-grow: 1;
    padding-bottom: 14px;
    .list-item {
      width: 690rpx;
      margin: 0 auto;
      margin-bottom: 20rpx;
      &:last-child {
        margin-bottom: 40rpx;
      }
    }
  }
.list-scroll-view{
  height: 100%;
}
}
</style>
