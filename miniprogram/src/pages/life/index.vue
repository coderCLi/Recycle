<!--
 * @Description: 生活模块, 从商家服务迁移过来的功能
 * @Author: yulongchen
 * @Date: 2025-09-28 10:46:14
 * @LastEditors: yulongchen
 * @LastEditTime: 2025-09-28 13:45:45
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view style="position: relative;width: 100%;height:0px;z-index: 0;">
      <view class="top-bg2" :style="`height: ${scrollBoxHeight}; background-color:#F0F0F4`"></view>
    </view>
    <view class="true-content" style="position: relative;">

      <view class="search-box" :style="`height: ${searchBoxHeight}rpx`">
        <view class=search-main :style="`height: ${searchBoxHeight}rpx`">

          <!-- 搜索框 -->
          <view style="box-sizing: border-box; width: 100%; margin-bottom: 34rpx;">
            <u-search maxlength="20" height="40" :placeholder="placeholderText" placeholderColor="#999" :showAction="false"
              @search="getSearch" @clear="inputBlur" @blur="inputBlur" v-model="keywords" :clearabled="true" shape="square"></u-search>
          </view>

          <!-- banner区 -->
          <vc-banner v-if="bannerDataMaster.props.list.value && bannerDataMaster.props.list.value.length > 0"
            :props-data="bannerDataMaster" @toPage="toPage"></vc-banner>

          <!-- 金刚区 -->
          <view v-if="isChildShowPic" class="btn-blocks menus">
            <scroll-view scroll-x="true" class="btn-blocks-scroll" style="width: 100%;" v-if="serviceList.length < 8">
              <view class="flex" :style="{ 'justify-content': serviceList.length < 5 ? 'space-around' : 'flex-start' }">
                <view class="btn-blocks-wrap" v-for="(item, index) in serviceList" :key="index">
                  <view @click="tabClick(item, index)"
                    :class="[current == index ? 'active' : '', 'item', 'btn-blocks-item']">
                    <image class="btn-blocks-item-image" :src="baseUrl + item.iconPhotoUrl" mode="scaleToFill" />
                    <text class="btn-blocks-item-text" :class="[current == index ? 'active' : '']">
                      {{ item.mctTypeName }}
                    </text>
                  </view>
                </view>
              </view>
            </scroll-view>
            <view class="flextwo" v-if="serviceList.length == 8">
              <view class="btn-blocks-wrap" v-for="(item, index) in serviceList" :key="index">
                <view @click="tabClick(item, index)"
                  :class="[current == index ? 'active' : '', 'item', 'btn-blocks-item']">
                  <image class="btn-blocks-item-image" :src="baseUrl + item.iconPhotoUrl" mode="scaleToFill" />
                  <text class="btn-blocks-item-text" :class="[current == index ? 'active' : '']">
                    {{ item.mctTypeName }}
                  </text>
                </view>
              </view>
            </view>
          </view>
          
           <!-- 卡片区 -->
          <view class="isDiscountBox" v-if="isDisBoxShow">
            <view v-for="(item, index) in isDiscountbox" :key="index" class="isDiscount"
              :style="`background-image: url(${item.imgurl})`">
            </view>
          </view>

          <!-- 轻banner -->
          <vc-banner v-if="bannerData.props.list.value && bannerData.props.list.value.length > 0"
            :props-data="bannerData" @toPage="toPage"></vc-banner>

        </view>
      </view>

      <!-- 吸顶区域 -->
      <u-sticky :offsetTop="scrollBoxHeight1" :customNavHeight="0">
        <!-- 菜单tabbar -->
        <view class="tabbar-box" v-if="isChildShowText" style="padding-top: 15rpx; background: #fff;">
          <view class="tabbar-main">
            <tabbar :list="tabbarList" @change="tabbarChange"></tabbar>
          </view>
        </view>
        <!-- 筛选 -->
        <view class="filter-box">
          <view class="filter-main">
            <vc-filter ref="filterRef" :startType="startType" :nearbyConfig="nearbyConfig"
              :dropdownConfig="dropdownConfig"  @locationClick="locationClick"
              @resetClick="resetClick" @completeClick="completeClick" @dropdownClick="dropdownClick"
              @getLocation="getLocation" @subMenuClick="subMenuClick"></vc-filter>
          </view>
        </view>
      </u-sticky>

      <!-- 底部列表 -->
      <view class="scroll-block">
        <vc-empty v-if="filteredList.length === 0" :props-data="propsDatatext"></vc-empty>
        <!-- 商家和商品的显示隐藏 -->
        <template v-else> 
          <view v-if="commodityShow" class="scroll-item" v-for="(item, index) in filteredList" @click="goDirection(item)" :key="index">
            <mctCom :info="item" :isLocationFail="isLocationFail"></mctCom>
          </view>
        </template>
        <view v-if="filteredList.length > 0">
          <u-loadmore marginTop="30" marginBottom="50" :status="status"></u-loadmore>
        </view>
      </view>
      <vc-safe-bottom />
    </view>
  </vc-container>
</template>
<script>
import {
  getMctProList,
  selBusCodeAndDisCode, 
  // 新增接口
  getLifeMctServiceInfo,
  //banner查询
  getLifeMctServiceBannerList,
  //分类查询
  getLifeMctTypeList,
} from './api/base-services';
import vcBanner from "@/components/library/base/vc-banner/index.vue";//banner
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
import vcFilter from '@/components/library/base/vc-filter-new/index';
import mctCom from './components/mctCom';
import mctCommodity from './components/mctCommodity';
import tabbar from "./components/tabbar.vue";
export default {
  name: "merchant",
  components: {
    tabbar,
    vcBanner,
    vcFilter,
    mctCom,
    mctCommodity
  },
  data() {
    return {
      cityName:'',
      placeholderText: '搜索机构名称或服务项',
      propsData: {
        props: {
          title: {
            value: '详情'
          },
          overflowY: {
            value: 'unset'
          },
          buttonType: {
            value: "none"
          }
        }
      },
      propsDatatext: {
        props: {
          text: {
            value: '商家招募中，敬请联系0312-3038620'
          },
        }
      },
      isLocationFail: true,
      bannerData: {
        props: {
          list: {
            value: []
          },
          height: {
            value: 121
          }
        }
      },
      bannerDataMaster: {
        props: {
          list: {
            value: []
          },
          height: {
            value: 268
          }
        }
      },
      trueValue: true,
      serviceList: [],
      page: 1,
      rows: 10,
      total: 0,
      status: 'loadmore',
      current: null,//当前标签页
      filteredList: [],
      baseUrl: '',
      // 筛选配置
      longitude: "",//经度
      latitude: "",//纬度
      mctServiceId: "",//商户服务id,系统生成
      mctName: "",//商户分类名称
      mctTypeId: "",//商户类型id
      districtCode: "",//行政区划编号
      businessCode: "",//商圈编号
      distance: "",//距离 
      // 修改医院排序
      ordr: "1",//排序 0-智能排序 1-距离排序
      filterOptionsId: "",//筛选条件id 多个以逗号分隔
      // 筛选配置
      startType: [
        {
          type: 'nearby'
        },
        {
          type: 'dropdown',
          id: 'M2_1'
        }
      ],
      // 1.定位模块配置
      nearbyConfig: {
        value: 'M1',
        title: '附近', // 下拉菜单名
        options: {
          // 距离配置
          location: {
            keyName: 'optName', // 从locationList元素对象中读取的键名
            bgColor: '#fff', // 背景颜色
            key: 'location', // 返回参数名
            // 距离选项
            locationList: [{
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
            key: 'menu', // 返回参数名
            menuList: [],
            asyncSubMenuList: [] // 用于异步加载子菜单，若menuList下已包含children，无需配置。
          }
        }
      },
      // 2.下拉模块配置
      dropdownConfig: [
        {
          value: 'M2_1',
          key: 'dropdown', // 返回参数名
          id: 'M2_1', // 组件id，用于区分多次使用M2功能
          defaultIndex: 1, // 默认值，options索引，不配置默认0
          title: '距离优先', // 初始化显示内容，防止空白。
          options: [
            {
              label: '距离优先',
              value: '1'
            },
          ]
        }
      ],
      // 修改排序功能
      cateId: '',
      keywords:'',
      //横向选择标签
      tabbarList:[],
      //主Banners
      isTopBannerShow:'',
      //次Banners
      isDownBannerShow:'',
      //优惠专区
      isDiscountShow:'',
      isDiscountbox:[],
      isDisBoxShow:false,
      //是否存在分类
      isChild:'',
      isChildShowPic: false,
      isChildShowText: false,
      //分类展示类型  
      childType:'',
      //是否显示筛选
      isFilterShow:false,
      commodityShow:true,
      // 总分类查询
      labelNoList:[],
      mctServiceLabelId:"",
      //此分类参数
      mapTypeIds:''
    }
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: 'safeTopDistance',
      navigationBarInfo: "navigationBarInfo",
    }),
    scrollBoxHeight1() {
      let val =
        this.navigationBarInfo.statusBarHeight +
        this.navigationBarInfo.navigationBarHeight;
      return val
    },
    // 页面高度
    scrollBoxHeight() {
      let val =
        this.navigationBarInfo.statusBarHeight +
        this.navigationBarInfo.navigationBarHeight;
      let valRpx = this.bridgeSdk.px2rpx(val);
      return "calc(100vh - " + valRpx + "rpx)";
    },
    searchBoxHeight() {
      let originHeight = 420 - 170 - 121; //单位rpx
      if (this.serviceList.length > 0) {
        originHeight = originHeight + 170;
      }
      if (this.serviceList.length == 8) {
        originHeight = originHeight + 140;
      }
      if (this.bannerData.props.list.value && this.bannerData.props.list.value.length > 0) {
        originHeight = originHeight + this.bannerData.props.height.value;
      }
      if (this.bannerDataMaster.props.list.value && this.bannerDataMaster.props.list.value.length > 0) {
        originHeight = originHeight + this.bannerDataMaster.props.height.value;
      }
      if (this.isDiscountbox.length > 0){ //优惠专区
        originHeight = originHeight + 220;
      }
      return originHeight;
    }
  },
  async onLoad() {
    this.baseUrl = this.minioBaseUrl;
    // 配置商家服务时生成的id, 后续可以改成从动态json中读取吧
    this.mctServiceId = "MC10250617161525294521517";
    this.propsData.props.title.value = "生活";
    this.placeholderText = '请输入搜索关键词';
    this.getList();
  },
  onPullDownRefresh() {
    this.mctName = '';
    this.page = 1;
    this.labelNoList = [];
    this.getListDetail() 
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    if ((this.filteredList.length < this.total) && (this.filteredList.length > 0)) {
      this.status = 'loading'
      this.page = (+this.page + 1).toString()
      this.labelNoList = [];
      this.getListDetail() 
    } else if (this.filteredList.length == this.total) {
      this.status = 'nomore'
    }
  },
  methods: {
    tabClick(e, i) {
      console.log('点击标签', e, i)
      let path = e.jumpPath;
      this.bridgeSdk.jumpPage({
				url: path,
			})
    },
    getList() {
      let params = {
        mctServiceId: this.mctServiceId,
      }
      //新模板接口
      getLifeMctServiceInfo(params).then(res => {
        console.log('服务项123456789', res)
        this.isTopBannerShow = res.isTopBannerShow;
        this.isDownBannerShow = res.isDownBannerShow;
        this.isDiscountShow = res.isDiscountShow;
        this.isChild = res.isChild;
        this.childType = res.childType ? res.childType : '';
        this.serviceList = res;
        this.mctServiceLabelId = res.mctServiceLabelId;
        if(res.isFilterShow == '1'){
          this.isFilterShow = true;
        }else{
          this.isFilterShow = false;
        }
        if(this.isTopBannerShow=='1'){
          this.getLifeMcBannerList('0')
        };
        if(this.isDownBannerShow=='1'){
          this.getLifeMcBannerList('1')
        };
        if(this.isDiscountShow=='1'){
          this.getLifeMcBannerList('2')
        };
        if (this.isChild == '1') {
          this.getLifeMctTypeList('0'); //分类接口
        }else{
          this.isChildShowPic = false;
        }
        if (this.childType == '1') {
          this.getLifeMctTypeList('1'); //分类接口
        }else{
          this.isChildShowText = false;
        }
      })
    },
    getLifeMctTypeList(group){
      console.log('分类入参-----', group) 
      let params = {
        mctServiceId: this.mctServiceId,
        type:group
      }
      // console.log('分类入参-----', params) 
      getLifeMctTypeList(params).then(res => {
        console.log('分类返回参数-----', res)
        console.log('group-----', group) 
        if(group=='0'){
          this.serviceList = res;
          this.isChildShowPic = true;         
        }else{
          this.tabbarList = res;
          this.mapTypeIds = res[0].mctTypeLabelId;
          console.log('分类返回参数-----', this.mapTypeIds)
          this.isChildShowText = true;
        }
      })
    },
    getLifeMcBannerList(type){
      let params = {
        mctServiceId: this.mctServiceId,
        bannerType:type
      }
      console.log('banner', params) 
      getLifeMctServiceBannerList(params).then(res => {
        console.log('banner', res)
        res.forEach(item => {
          item.imgurl = this.minioBaseUrl + item.photoUrl;
        });
        if(type=='0'){ 
          this.bannerDataMaster.props.list.value = res;
        }
        if(type=='1'){
          this.bannerData.props.list.value = res;
        }
        if(type=='2'){
          this.isDiscountbox = res;
          this.isDisBoxShow = true;
        } 
      })
    },
    getListDetail() {
      if(this.mctTypeId){
        this.labelNoList.push(this.mctTypeId)
      };
      if(this.mapTypeIds){
        this.labelNoList.push(this.mapTypeIds)
      };
      if(this.filterOptionsId){
        this.labelNoList.push(...this.filterOptionsId.split(','))
      };
      this.labelNoList.push(this.mctServiceLabelId)
      if(!this.distance){
        this.distance = ""
      }
      let labelNoListNew = this.labelNoList.filter((item, index) => {
        return this.labelNoList.indexOf(item) === index;
      });
      let params = {
        // mctServiceId: this.mctServiceId,//商户服务id,系统生成
        page: this.page,
        rows: this.rows,
        storeName: this.keywords,
        lng: this.longitude,//经度
        lat: this.latitude,//纬度
        // mctName: this.mctName,//商户分类名称
        // mctTypeId: this.mctTypeId,//商户类型id
        area: this.districtCode,//行政区划编号
        businessCode: this.businessCode,//商圈编号
        distance: this.distance || "",//距离 500米 0.5  1000米 1  2000米 2    附近传-1
        sort: this.ordr,//排序 0-级别优先 1-距离优先
        // // 修改排序功能
        // cateId:this.cateId,
        labelNoList: labelNoListNew,//筛选条件id 多个以逗号分隔
        // labelNoList: this.filterOptionsId,//筛选条件id 多个以逗号分隔
      }
      console.log("-------params-------", params)
      getMctProList(params).then(res => {
        console.log('列表1234567890', res,)
        this.total = res.total;
        if (this.page == 1) {
          this.filteredList = [...res.list];
        } else {
          this.filteredList = [...this.filteredList, ...res.list];
        }
        if (this.total > this.filteredList.length) {
          this.status = 'loadmore'
        } else {
          this.status = 'nomore'
        }
        return;
      })
    },
    //跳转地图
    goMap() {

    },
    //商家列表
    goDirection(e) {
      this.bridgeSdk.jumpPage({
        title: this.propsData.props.title.value + "-" + e.mctName,
        url: '/package-product-list/merchantDetail/merchantDetailCoupon?mctId=' + e.mctId + '&storeId=' + e.storeId, // 目标页面的路径  
      })
    },
    getSearch() {
      console.log("getSearch", this.keywords); 
      this.labelNoList = [];
      this.getListDetail() 
    },
    toPage(item) {
      console.log(item, 'itemitemitemitem')
      this.bridgeSdk.jumpPage({
        url: item.bannerPhotoUrl, // 目标页面的路径  
      })
    },
    // 初始化筛选配置
    initFilter() {
      // 省市区
      selBusCodeAndDisCode({
        id: '130600'
      }).then(res => {
        console.log("selBusCodeAndDisCode", res)
        this.$refs['filterRef'].setM1('menu', res);
        setTimeout(() => {
          this.labelNoList = [];
          this.getListDetail()
        }, 500)
      })
    },
    locationClick(e) {
      console.log("locationClick", e);
    },
    // 滚动菜单：右侧点击事件
    subMenuClick(e) {
      console.log("subMenuClick", e);
      this.cityName = e.label;
    },
    // 滚动菜单：重置按钮事件
    resetClick(e) {
      console.log("resetClick", e);
      if(e.type == "nearby"){
        this.districtCode = ""
        this.businessCode = ""
        this.cityName = "附近"
      }
      if(e.type == "select"){
        this.filterOptionsId = ""
      }
    },
    // 滚动菜单：确认按钮事件
    completeClick(e) {
      console.log("completeClick", e); // 参数说明: 根据定义key值返回
      this.distance = e.location;
      if (e.type == "nearby") {
        this.labelNoList = [];
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
        if (this.current == 0) {
          this.$refs["filterRefMerchant"].setM1('title', this.cityName)
        } else {
          this.$refs["filterRef"].setM1('title', this.cityName)
        }
        this.page = 1;
        this.getListDetail();
      }
      if (e.type == "select") {
        // 筛选条件
        console.log("arr--------222", e) 
        this.filterOptionsId = "";
        let arr = []
        for (let key in e) {
          if (key !== "type" && key !== "menuIndex") {
            arr.push(e[key])
          }
        }
        const str = arr.join(",");
        this.filterOptionsId = str.split(',').filter(Boolean).join(',');
        // this.filterOptionsId = arr.join(",")
        console.log("arr--------1111", this.filterOptionsId) 
        this.labelNoList = [];
        this.page = 1;
        this.getListDetail();
      }
    },
    // 级别优先：下拉选项点击事件
    dropdownClick(e) {
      console.log("dropdownClick", e);
      // 筛选第二项 下拉选项 点击确认
      this.ordr = e.value
      this.page = 1;
      this.labelNoList = [];
      this.getListDetail();
    },
    // 定位模块：获取当前位置
    getLocation(e) {
      console.log('getLocation', e);
      console.log("定位模块：获取当前位置", e);
      this.isLocationFail = e.locationFail === true;
      this.locationInfo = e;
      this.longitude = e.lng
      this.latitude = e.lat
      this.page = 1;
      this.initFilter();
    },
    inputBlur() {
      if (!this.bridgeSdk.checkIsEmpty(this.keywords)) {
        this.getSearch();
      }
    },
    tabbarChange(i, e) {
      console.log("tabbarChange: ", i, e);
      this.mapTypeIds = e.mctTypeLabelId;
      this.page = 1;
      this.labelNoList = [];
      this.filteredList = [];
      this.getListDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
}

.main {
  background: #F0F0F4;

  &::v-deep .vc-filter {
    background-color: #fff;
  }
}


.search-box {
  position: relative;
  width: 100%;
  height: 80rpx;
  z-index: 20;
  box-sizing: border-box;
  background: white;

  .search-main {
    width: 750rpx;
    height: 80rpx;
    box-sizing: border-box;
    background: white;
    padding: 20rpx 40rpx 5rpx;
    .search-right {
      position: absolute;
      right: 50rpx;
      top: 23rpx;
      color: #999999;
      font-weight: 400;
      font-size: 28rpx;
      padding: 20rpx;
      z-index: 999;
    }
    .search-icon{
      position: absolute;
      right: 20rpx;
      top: 28rpx;
      z-index: 999;
    }

    .search-right::after {
      content: "";
      /* 伪元素需要内容来生成盒子模型，即使它是空的 */
      position: absolute;
      /* 绝对定位，相对于最近的定位祖先元素（这里是 .number-line） */
      left: -10rpx;
      /* 水平居中，需要配合 transform 来精确调整 */
      top: 50%;
      /* 垂直居中，同样需要配合 transform */
      width: 2rpx;
      /* 线条宽度 */
      height: 52rpx;
      /* 线条高度 */
      background: #D8D8D8;
      /* 线条颜色 */
      border-radius: 2rpx;
      /* 圆角 */
      transform: translate(-50%, -50%);
      /* 修正 left 和 top 的偏移，实现真正居中 */
    }
    .isDiscountBox{
      display: flex;
      // height: 118rpx;
      margin-top: 25rpx;
      margin-bottom: 34rpx;
      .isDiscount{
        flex-grow: 1;
        margin: 0 10rpx;
        height: 140rpx;
        border-radius: 20rpx;
        background-size: cover;
      }
    }
  }
}
.tabbar-box {
  width: 100%;
  height: 84rpx;
  .tabbar-main {
    width: 750rpx;
    height: 84rpx;
    box-sizing: border-box;
    padding: 10rpx 0rpx 10rpx 30rpx;
    background: #ffffff;
    z-index: 20;
  }
}
.btn-blocks {
  background: #FFFFFF;
  border-radius: 24rpx;
  margin: 20rpx auto 0rpx;
  .flextwo{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .btn-blocks-wrap {
    flex-shrink: 0;
    width: 150rpx;

    .btn-blocks-item {
      margin: 5rpx;
      border-radius: 20rpx;
      padding: 10rpx 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      width: 100rpx;

      .btn-blocks-item-image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 22rpx;
      }

      .btn-blocks-item-text {
        width: 100rpx;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 40rpx;
        white-space: nowrap; 

      }
    }
  }


}

// 筛选
.filter-box {
  width: 100%;
  height: 80rpx;

  .filter-main {
    background: #ffffff;
    width: 750rpx;
    height: 80rpx;
    box-sizing: border-box;
  }
}

.scroll-block {
  width: 90%;
  margin: 0 auto;
  padding:0 0 30rpx;
  box-sizing: border-box;
  overflow: auto;

  .scroll-item {
    background-color: white;
    margin-top: 20rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    display: flex;
    justify-content: space-between;
    padding: 26rpx 24rpx;
    display: flex;
    flex-direction: column;
  }
}

.active {
  background-color: #10C2B7;
  color: #fff !important;
}

::v-deep .u-search__content__input {
  flex-basis: 80%;
  flex-shrink: 0;
  flex-grow: 0;
}

::v-deep .u-search__content {
  justify-content: flex-start;
  border-radius:50rpx!important;
  
}
::v-deep .u-dropdown__content {
  height:  1600rpx!important;
}
</style>
