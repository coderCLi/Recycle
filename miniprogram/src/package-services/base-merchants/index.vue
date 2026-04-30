<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view style="position: relative;width: 100%;height:0px;z-index: 0;">
      <view class="top-bg2" :style="`height: ${scrollBoxHeight}; background-color:#F0F0F4`"></view>
    </view>
    <view class="true-content" style="position: relative;">
      <!-- 搜索框 -->
      <view class="search-box" :style="`height: ${searchBoxHeight}rpx`">
        <view class=search-main :style="`height: ${searchBoxHeight}rpx`">
          <u-search maxlength="20" height="40" :disabled="trueValue" :placeholder="placeholderText" placeholderColor="#999" @click="getSearch"
            :showAction="false" v-model="mctName" shape="round"></u-search>
          <!-- 二级分类切换 -->
          <view v-if="serviceList.length > 0" class="btn-blocks">
            <scroll-view scroll-x="true" class="btn-blocks-scroll" style="width: 100%;">
              <view class="flex">
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
          </view>
          <!-- 轻banner -->
          <view v-if="bannerData.props.list.value && bannerData.props.list.value.length > 0" style="height: 20rpx;">
          </view>
          <vc-banner v-if="bannerData.props.list.value && bannerData.props.list.value.length > 0"
            :props-data="bannerData" @toPage="toPage"></vc-banner>
        </view>
      </view>

      <!-- 筛选 -->
      <view class="filter-box">
        <view class="filter-main">
          <!-- <filterCom :propsData="mctServiceId" ></filterCom> -->
          <vc-filter ref="filterRef" :startType="startType" :nearbyConfig="nearbyConfig"
            :dropdownConfig="dropdownConfig" :selectConfig="selectConfig" @locationClick="locationClick"
            @resetClick="resetClick" @completeClick="completeClick" @dropdownClick="dropdownClick"
            @getLocation="getLocation"></vc-filter>
        </view>
      </view>

      <!-- 底部列表 -->
      <!-- :style="{ height: scrollBoxHeight }" -->
      <view class="scroll-block">
        <vc-empty v-if="filteredList.length === 0"></vc-empty>

        <template v-else>
          <view class="scroll-item" v-for="(item, index) in filteredList" @click="goDirection(item)" :key="index">
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
  getMctProTypeList, getMctProList, getMctProServiceBannerList,
  selFilterCategoryById, selBusCodeAndDisCode, selBusCodeAndDisCodeByCity
} from '../api/base-services';
import vcBanner from "@/components/library/base/vc-banner/index.vue";//banner
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
// import filterCom from "../components/filterCom.vue"
import vcFilter from '@/components/library/base/vc-filter/index';
import mctCom from '../components/mctCom'

export default {
  name: "merchant",
  components: {
    vcBanner,
    vcFilter,
    mctCom
  },
  data() {
    return {
      placeholderText: '搜索机构名称或服务项',
      propsData: {
        props: {
          title: {
            value: '详情'
          },
          overflowY: {
            value: 'unset'
          }
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
      ordr: "0",//排序 0-级别优先 1-距离优先
      filterOptionsId: "",//筛选条件id 多个以逗号分隔

      // 筛选配置
      startType: [
        {
          type: 'nearby'
        },
        {
          type: 'dropdown',
          id: 'M2_1'
        },
        {
          type: 'select'
        },
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
          defaultIndex: 0, // 默认值，options索引，不配置默认0
          title: '级别优先', // 初始化显示内容，防止空白。
          options: [
            {
              label: '级别优先',
              value: '0'
            },
            {
              label: '距离优先',
              value: '1'
            },
          ]
        }
      ],
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
          menuList: []
        }
      },
      // 修改排序功能
      cateId: ''
    }
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: 'safeTopDistance',
      navigationBarInfo: "navigationBarInfo",
    }),
    // 页面高度
    scrollBoxHeight() {
      let val =
        this.navigationBarInfo.statusBarHeight +
        this.navigationBarInfo.navigationBarHeight;
      // let valRpx = this.bridgeSdk.px2rpx(val) + 80 + this.searchBoxHeight;
      // let valRpx = this.bridgeSdk.px2rpx(val) + 80 + this.searchBoxHeight;
      let valRpx = this.bridgeSdk.px2rpx(val);
      return "calc(100vh - " + valRpx + "rpx)";
    },
    searchBoxHeight() {
      let originHeight = 420 - 170 - 121; //单位rpx
      if (this.serviceList.length > 0) {
        originHeight = originHeight + 190;
      }
      if (this.bannerData.props.list.value && this.bannerData.props.list.value.length > 0) {
        originHeight = originHeight + this.bannerData.props.height.value;
      }
      return originHeight;
    }
  },
  async onLoad(options) {
    // await this.firstInit();   
    this.baseUrl = this.minioBaseUrl
    // this.bridgeSdk.setStorageSync('appToken', options.appToken);  // 已经全局处理了，不允许再写了，否则会用空值覆盖有效的值
    this.mctServiceId = options.serviceId;
    this.propsData.props.title.value = options.title;
    if ('保定医院' == this.propsData.props.title.value) {
      this.placeholderText = '请输入医院名称或地址信息';
    } else if ('体检服务' == this.propsData.props.title.value) {
      this.placeholderText = '请输入体检机构名称或地址信息';
    }
    this.getList();
    // this.initFilter();
  },
  onPullDownRefresh() {
    this.mctName = '';
    this.page = 1;
    this.getListDetail();
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    if ((this.filteredList.length < this.total) && (this.filteredList.length > 0)) {
      this.status = 'loading'
      this.page = (+this.page + 1).toString()
      this.getListDetail();
    } else if (this.filteredList.length == this.total) {
      this.status = 'nomore'
    }
  },
  methods: {
    tabClick(e, i) {
      if (this.current == i) {
        this.current = null;
        this.mctTypeId = '';
        this.getListDetail()
        // 重新加载全部接口 
        return;
      }
      this.page = 1;
      this.current = i
      this.mctTypeId = e.mctTypeId;
      this.filteredList = [];
      this.getListDetail()
    },
    getList() {
      let params = {
        mctServiceId: this.mctServiceId,
      }
      getMctProTypeList(params).then(res => {
        console.log('服务项', res,)
        this.serviceList = res;
        // if (this.serviceList.length > 0) {
        //   this.getListDetail();
        // } else {
        //   this.filteredList = []
        // }

      })
      getMctProServiceBannerList({ mctServiceId: this.mctServiceId }).then(res => {
        console.log('banner', res)
        res.forEach(item => {
          item.imgurl = this.minioBaseUrl + item.photoUrl;
        });
        this.bannerData.props.list.value = res;
      })
    },
    getListDetail() {
      let params = {
        page: this.page,
        rows: this.rows,
        mctServiceId: this.mctServiceId,//商户服务id,系统生成
        longitude: this.longitude,//经度
        latitude: this.latitude,//纬度
        mctName: this.mctName,//商户分类名称
        mctTypeId: this.mctTypeId,//商户类型id

        districtCode: this.districtCode,//行政区划编号
        businessCode: this.businessCode,//商圈编号
        distance: this.distance || "",//距离 500米 0.5  1000米 1  2000米 2    附近传-1
        ordr: this.ordr,//排序 0-级别优先 1-距离优先
        // 修改排序功能
        cateId:this.cateId,
        filterOptionsId: this.filterOptionsId,//筛选条件id 多个以逗号分隔
      }
      console.log("-------params-------", params)
      getMctProList(params).then(res => {
        console.log('列表', res,)
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
        url: '/package-services/base-merchants/detail?mctId=' + e.mctId + '&title=' + this.propsData.props.title.value, // 目标页面的路径  
      })
    },
    getSearch() {
      this.bridgeSdk.jumpPage({
        url: '/package-services/base-search/index?serviceId=' + this.mctServiceId + '&title=' + this.propsData.props.title.value + '&type=mct' + '&latitude=' + this.latitude + '&longitude=' + this.longitude + '&cateId=' + this.cateId + '&ordr=' + this.ordr, // 目标页面的路径  
      })
    },
    toPage(item) {
      console.log(item, 'itemitemitemitem')
      // this.bridgeSdk.jumpPage({
      //   url: '/package-services/base-search/index', // 目标页面的路径  
      // })
    },
    // 初始化筛选配置
    initFilter() {
      // 筛选条件
      selFilterCategoryById({ id: this.mctServiceId }).then(res => {
        console.log("selFilterCategoryById", res)
        let menuListM3 = [];
        res.forEach(item => {
          if(item.title == '医院级别') {
            this.cateId = item.key
            console.log('医院级别哈哈哈哈哈哈哈1112222',this.cateId);
            
          }
          menuListM3.push({
            label: item.title,
            value: item.key,
          })
        })
        this.$refs['filterRef'].setM3('select', res);
        this.$refs['filterRef'].setM3('menu', menuListM3);
        
        // 
        setTimeout(() => {
          this.getListDetail()
        }, 100)

      })
      // 省市区
      selBusCodeAndDisCode({
        id: '130600'
      }).then(res => {
        console.log("selBusCodeAndDisCode", res)
        this.$refs['filterRef'].setM1('menu', res);
      })
    },
    locationClick(e) {
      console.log("locationClick", e);
    },
    // 滚动菜单：右侧点击事件
    subMenuClick(e) {
      console.log("subMenuClick", e);
    },
    // 滚动菜单：重置按钮事件
    resetClick(e) {
      console.log("resetClick", e);
      // if(e.type == "nearby"){
      //   this.districtCode = ""
      //   this.businessCode = ""
      // }
      // if(e.type == "select"){
      //   this.filterOptionsId = ""
      // }
    },
    // 滚动菜单：确认按钮事件
    completeClick(e) {
      console.log("completeClick", e); // 参数说明: 根据定义key值返回
      this.distance = e.location;
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
        this.page = 1;
        this.getListDetail();
      }
      if (e.type == "select") {
        // 筛选条件
        let arr = []
        for (let key in e) {
          if (key !== "type" && key !== "menuIndex") {
            arr.push(e[key])
          }
        }
        this.filterOptionsId = arr.join(",")
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
      // this.getListDetail();
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

  //height: 100%;
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
    position: fixed;
    width: 750rpx;
    height: 80rpx;
    box-sizing: border-box;
    // height: 420rpx;
    background: white;
    padding: 20rpx 40rpx;
    // margin-bottom: 18rpx;
    box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
  }
}

.btn-blocks {
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 90%;
  margin: 20rpx auto 0rpx;

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

      }

      .btn-blocks-item-text {
        white-space: nowrap;
        word-break: keep-all;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 40rpx;

      }
    }
  }


}

// 筛选
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

.scroll-block {

  width: 90%;
  margin: 0 auto;
  padding: 30rpx 0;
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
</style>