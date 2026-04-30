<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">

    <view style="position: relative;width:100%;height: 130rpx;">
      <view class="search-box" style="position: fixed;z-index: 1;width: 750rpx;box-sizing: border-box; ">
        <u-search  maxlength="20" height="40" placeholder="请输入搜索关键词" bgColor="#fff" borderColor="#FF6634" placeholderColor="#999" :showAction="false"
          @search="getSearch" searchIconSize="36" @clear="inputBlur" @blur="inputBlur" v-model="keywords" :clearabled="true" shape="round"></u-search>
        <view @click="getSearch" class="search-right">搜索</view>
      </view>
    </view>
    
    <view class="tab-block" v-if="serviceList.length > 0 && showTabList">
      <view class="btn-blocks">
        <scroll-view scroll-x="true" class="btn-blocks-scroll" style="width: 100%;">
          <view class="flex" style="padding: 0 30rpx;">
            <view class="btn-blocks-wrap" v-for="(item, index) in serviceList" :key="index">
              <view @click="tabClick(item, index)" :class="[current == index ? 'active' : '', 'item', 'btn-blocks-item']">
                <image :src="minioBaseUrl + item.typeIconPhotoUrl" mode="scaleToFill" />
                <view :class="[current == index ? 'active' : '']" class="ellipsis text-item">
                  {{ item.mctTypeName }}
                </view>
                <view :class="[current != index ? 'opacity' : '', 'bor-bot']"></view>
              </view>
            </view>
          </view>
        </scroll-view> 
      </view>
      <!-- 筛选 -->
      <!-- <view class="filter-box">
        <view class="filter-main">
          <vc-speciafilter ref="filterRef" :startType="startType" :nearbyConfig="nearbyConfig"
            :dropdownConfig="dropdownConfig" :selectConfig="selectConfig" @locationClick="locationClick"
            @subMenuClick="subMenuClick"
            @resetClick="resetClick" @completeClick="completeClick" @dropdownClick="dropdownClick"
            @getLocation="getLocation"></vc-speciafilter>
        </view>
      </view> -->
    </view>

    <!-- <view class="flex flex_ac">
            <image :src="minioBaseUrl + item.mctIconPhotoUrl" mode="scaleToFill" />
          </view>
          <view style="width:60%; flex: 1; margin-left: 24rpx;" class="flex flex_col flex-sb">
            <view class="flex flex_ac">
              <view
                style="line-height:66rpx; font-size: 29rpx;font-weight: bold;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:80%">
                {{ item.mctName }}</view>
                <image v-if="item.isSafeConsumption === '1'" :src="fxxflogoPng" mode="widthFix" style="width: 70rpx; height: 43rpx;margin-left: 20rpx;"/>
            </view>
            <view>
              <view class="ellipsis" style="font-size: 24rpx;color: #999;line-height:40rpx;">地址：{{ item.address }}
              </view>
              <view class="flex flex_ac card" style="font-size: 24rpx;height:auto; flex-wrap: wrap;color:#E08B3B;" v-if="item.isTimeShow == '1'">
                <view>{{ item.alertWord }}</view>
              </view>
            </view>
          </view> -->
    
    <view class="scroll-block" :class="{ 'showTabList': serviceList.length > 0 && showTabList }">
      <vc-empty v-if="filteredList.length === 0"></vc-empty>

      <template v-else>
        <view class="scroll-item" v-for="(item, index) in filteredList" @click="goDirection(item)" :key="index">
          <mct-com :info="item" :isLocationFail="isLocationFail" :pageHide="pageHide" :pageShow="pageShow"></mct-com>
        </view>
      </template>
      <view v-if="filteredList.length > 0">
        <u-loadmore marginTop="30" marginBottom="50" :status="status" nomore-text="更多商家陆续入驻中"></u-loadmore>
      </view>
    </view>
    <!-- <vc-sub :props-data="propsDataSub" /> -->
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import { getVisitorCount ,getMctServiceList, getMctBusinessTypeList, selFilterCategoryById, selBusCodeAndDisCode  } from '../api/baseServices';
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
import fxxflogoPng from "../static/fxxflogo.png"
import vcSpeciafilter from '@/components/library/base/vc-specialfilter/index';
import mctCom from '../components/mctCom.vue';
export default {
  name: "merchant",
  components: {
    vcSpeciafilter,
    mctCom
  },
  data() {
    return {
      isLocationFail: true,
      fxxflogoPng: fxxflogoPng,
      propsData: {
        props: {
          title: {
            value: '详情'
          },
          isFullScreen: {
            value: false
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
      serviceList: [],//二级分类 
      showTabList: true, // 显示当前二级分类

      selectedItem: '关注',
      page: 1,
      rows: 10,
      total: 0,
      status: 'loadmore',
      mctTypeId: '',
      current: null,//当前标签页 

      currentId: '',
      mctServiceId: '',
      keywords: '',
      filteredList: [],
      // baseUrl: ''
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
      ordr: "0",//排序 0-智能排序 1-距离优先
      // filterOptionsId: "",//筛选条件id 多个以逗号分隔
      businessType: '', // 营业时间筛选条件
      activityType: '', // 超值优惠筛选条件

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
              optCode: '-1',
              optName: '附近智能推荐'
            },
            {
              optCode: '0.5',
              optName: '500m内'
            },
            {
              optCode: '1',
              optName: '1km内'
            },
            {
              optCode: '3',
              optName: '3km内'
            },
            {
              optCode: '5',
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
          title: '智能排序', // 初始化显示内容，防止空白。
          options: [
            {
              label: '智能排序',
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
      cateId: '',
      pageHide: false,
      pageShow: false,
    }
  },
  watch: {
    'isLocationFail': {
        handler(newVal, oldVal) {
            console.log("监听定位信息变化", newVal)
            this.businessType = ''
            this.activityType = ''
        },
        deep: true,
        immediate: true 
    }
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: 'safeTopDistance'
    })
  },
  async onLoad(options) {
    console.log("options: ", options);
    // 放心消费商家查询标识, 用于查询放心消费商家列表, 仅当放心消费商家入口才有该标志, 其他入口无
    this.isSafeConsumption = options.isSafeConsumption || "";
    this.propsData.props.title.value = options.title;
    this.mctServiceId = options.serviceId;//查询服务id 
    this.mctTypeId = this.bridgeSdk.checkIsEmpty(options.mctTypeId) ? options.mctTypeId : '';//二级分类id 匹配赋值
    this.showTabList = this.bridgeSdk.checkIsEmpty(options.mctTypeId) ? false : true;//二级分类id 隐藏tab切换
    this.propsDataSub.props.serviceId.value = options.subId;//订阅服务id
    this.getList();
  },
  onShow(){
    this.pageHide = false;
    this.pageShow = true
  },
  onHide(){
    this.pageHide = true;
    this.pageShow = false
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
    // 初始化筛选配置
    initFilter() {
      // 筛选条件
      selFilterCategoryById({ id: this.mctServiceId }).then(res => {
        res = [
        {
          key: '01',
          title: '营业时间',
          orderFlag: '1',
          type: '0',
          list: [
            {
              optCode: '0',
              optName: '营业中',
              orderFlag: '1'
            },
            {
              optCode: '1',
              optName: '24小时营业',
              orderFlag: '2'
            }
          ]
        },
        {
          key: '02',
          title: '优惠活动',
          orderFlag: '2',
          type: '0',
          list: [
            {
              optCode: '1',
              optName: '超值优惠',
              orderFlag: '1'
            }
          ]
        }
      ]
        console.log("selFilterCategoryById", res)
        let menuListM3 = [];
        res.forEach(item => {
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
        let code = [res[0]]
        const newCode = [{
          ...code[0],
          children: [
            {label: '全城', value: '', type: '2'},
            ...code[0].children,
          ]
        }];
        console.log("selBusCodeAndDisCode", newCode)
        this.$refs['filterRef'].setM1('menu', newCode);
        if (this.isLocationFail) {
          this.$nextTick(() => {
            this.$refs['filterRef'].seachData.nearby.subMenuIndex = 0;
            this.$refs['filterRef'].seachData.nearby[this.nearbyConfig.options.menu.key] = "";
          });
        } else {
          this.$nextTick(() => {
            this.$refs['filterRef'].seachData.nearby.subMenuIndex = -1;
            this.$refs['filterRef'].seachData.nearby[this.nearbyConfig.options.menu.key] = "";
          });
        }
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
    },
    // 滚动菜单：确认按钮事件
    completeClick(e) {
      console.log("点击了确认事件", e, this.isLocationFail); // 参数说明: 根据定义key值返回
      if (this.isLocationFail) {
        this.distance = ''
      } else {
        console.log('e.location----------', e.location);
        
        this.distance = e.location !== undefined ? e.location : this.distance
      }
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
        this.page = 1
        this.getListDetail();
      }
      if (e.type == "select") {
        // 筛选条件
        let businessType = ''
        let activityType = ''
        for (let key in e) {
          console.log('key----------',key);
          if (key == '01') {
            businessType = e[key]
          }
          if (key == '02') {
            activityType = e[key]
          }
        }
        // this.filterOptionsId = arr.join(",")
        this.businessType = businessType;
        this.activityType = activityType;
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
      if (e.locationFail) {
        this.districtCode = "";
        this.businessCode = "";
        this.$refs['filterRef'].seachData.nearby.subMenuIndex = 0; // 选中第一个选项（全城）
        this.nearbyConfig.title = '位置距离'
      } else {
        this.nearbyConfig.title = '附近'
        this.distance = '-1';
        this.$refs['filterRef'].seachData.nearby.subMenuIndex = -1;
      }
      this.page = 1;
      // this.initFilter();
      // this.getListDetail();
    },
    tabClick(e, i) {
      if (this.current == i) {
        this.current = null;
        this.mctTypeId = '';
        this.filteredList = [];
        this.getListDetail()
        // 重新加载全部接口 
        return;
      }
      this.page = 1;
      this.current = i
      this.mctTypeId = e.mctTypeId;
      this.filteredList = [];
      this.getListDetail();
    },
    getList() {
      let params = {
        // isSafeConsumption: this.isSafeConsumption,
        mctServiceId: this.mctServiceId,
      }
      getMctServiceList(params).then(res => {
        // isSafeConsumption: this.isSafeConsumption,
        if(res.isChild == 0){
          this.showTabList = false;
          this.serviceList = [];
          this.filteredList = [];
          this.total = 0;
        }else{
          this.serviceList = res.mctTypeListBoList;
          if (this.serviceList.length > 0) {
            this.current = this.serviceList.findIndex(item => item.mctTypeId === this.mctTypeId);//匹配current
          } else {
            this.filteredList = []
          }
        }
        this.getListDetail();
      })
    },
    getListDetail() {
      let params = {
        isSafeConsumption: this.isSafeConsumption,
        mctTypeId: this.mctTypeId,
        mctServiceId: this.mctServiceId,
        longitude: this.longitude,//经度
        latitude: this.latitude,//纬度
        distance: this.distance || "",//距离 500米 0.5  1000米 1  2000米 2    附近传-1
        ordr: this.ordr,//排序 0-智能排序 1-距离优先
        businessType: this.businessType,
        activityType: this.activityType,
        districtCode: this.districtCode,//行政区划编号
        page: this.page,
        rows: this.rows,
        keywords: this.keywords
      }
      console.log('查询的数据-----------',params);
      
      getMctBusinessTypeList(params).then(res => {
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
    //商家列表
    goDirection(e) {
      console.log(e,'e9999999999999')
      if(e.payMctId){
        getVisitorCount({mctId: e.payMctId}).then(res => {
          console.log('访问统计接口新增',res);
        })  
      }
      this.bridgeSdk.jumpPage({
        title: `${this.propsData.props.title.value}-${e.mctName}`,
        url: '/package-general-services/merchants/detail?mctId=' + e.mctId + '&payMctId=' + e.payMctId + '&title=' + e.mctName, // 目标页面的路径  
      })
    },
    getSearch() {
      if (this.time && new Date().getTime() - this.time < 1000) {
        return
      }
      this.time = new Date().getTime();
      this.page = 1;
      this.filteredList = [];
      this.getListDetail();
    },
    inputBlur() {
      if (!this.bridgeSdk.checkIsEmpty(this.keywords)) {
        this.getSearch();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.text-item {
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 40rpx;
  width: 100%;
  text-align: center;
}
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
  height: auto;
  min-height: 100vh;
}


.search-box {
  background: white;
  height: 130rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 18rpx;
  //box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;

  ::v-deep .u-search__content__input {
    flex-basis: 68%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  ::v-deep .u-search__content {
    justify-content: flex-start;
  }

  .search-right {
    position: absolute;
    right:38rpx;
    color: #999999;
    font-weight: 400;
    z-index: 999;
    font-weight: 400;
    font-size: 28rpx;
    color: #FFFFFF;
    background: linear-gradient( 90deg, #FE7D20 0%, #FF5210 100%);
    border-radius: 34rpx;
    width: 120rpx;
    height: 68rpx;
    line-height: 68rpx;
    text-align: center;
  }



  .search-btn {
    width: 90rpx;
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    font-size: 24rpx;
    color: white;
    background-color: #10C2B7;
    border-radius: 40rpx;
  }

}

.tab-block {
  width: 100%;
  background-color: #f0f0f4;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  
}

.btn-blocks {
  margin: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 90%;
  padding: 20rpx 0 5rpx 0;
  // margin: 40rpx auto;

  .btn-blocks-wrap {

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

      image {
        width: 60rpx;
        height: 60rpx;

      }

      text {

        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 40rpx;

      }
    }
  }


}
.filter-box {
  // padding-top: calc(162rpx + 30rpx);
}
.scroll-block {
  overflow: hidden;
  width: 100%;
  margin: 12rpx auto 0;
  &.showTabList{
  //   height: calc(100% - 124rpx - 162rpx - 90rpx);
  //   overflow-y: auto;
    padding-top: calc(180rpx );
  }

  .scroll-item {
    width: calc(100% - 60rpx);
    margin: 20rpx auto 0;
    margin-top: 20rpx;
    align-items: center;
    justify-content: space-between;
    // padding: 15rpx 24rpx;
    padding: 30rpx 30rpx 15rpx 30rpx;
    background: #FFFFFF;
    .scroll-item:first-child {
      display: flex;
      align-items: center;
    }

    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
    }

    .scroll-item:last-child {
      border-bottom: none;
    }
  }
}

.card {
  view {
    font-size: 24rpx;
  }
}

.active {
  color: #23BAAB !important;
  font-weight: 800;
}

.bor-bot {
  width: 40rpx;
  height: 8rpx;
  background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #00BCB9;
  border-radius: 4rpx;
}

.opacity {
  opacity: 0;
}
:deep(.u-border-bottom) {
    border-bottom-width:0rpx !important;
}
::v-deep .u-search {
  .u-search__content{
    .u-search__content__input{
        height: 80rpx !important;
      .uni-input-wrapper{
    .u-search__content__input--placeholder{
        font-weight: 400;
        font-size: 30rpx !important;
      }
      }
  } 
  }
  
}
</style>