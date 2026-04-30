<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">

    <view class="search-block">
      <u-search style="flex:1;position:relative;z-index:1;" :actionStyle="actionStyle" bgColor="#fff" borderColor="#fff" maxlength="20" height="40"
          placeholder="请输入关键字" placeholderColor="#999" @search="goSearch" :showAction="false" :clearabled="false"
          v-model="keywords" shape="square" @blur="inputBlur" @focus="inputFocus">
      </u-search>
      <view class="search-right">
        <view @click.stop="goSearch($event)" class="search-button">搜索</view>
      </view>
    </view>
    <view v-if="isMp" class="map-container">
      <map @click="goMap" class="map" id="map" :longitude="longitude" :latitude="latitude" scale="12"
        :show-location="true" :markers="markers" @markertap="makertap">
      </map>
    </view>
    <view v-if="isH5" class="map-container">
      <view id='container'></view>
    </view>

    <view v-if="filteredList.length > 0" class="bottom-block" :style="{ height: scrollBoxHeight }">
      <view class="search flex flex_ac">
        <u-icon :name="minioBaseUrl + '/' + list.pagePhotoUrl" size="22"></u-icon>
        <text style="flex: 1;font-weight: 600;font-size: 32rpx;color: #222222;line-height: 44rpx;margin-left:10rpx;">{{
          list.title
          }}</text>
      </view>
      <scroll-view scroll-y="true" class="scroll-block">
        <view class="scroll-item" v-for="(item, index) in filteredList" :key="index">
          <view class="flex flex_sb">
            <view style="width:80%; height: 100rpx;display: flex;flex-direction: column;justify-content: space-between;">
              <view class="ellipsis" style="font-weight: bold;font-size: 28rpx;color: #333333;line-height:40rpx;">{{
                item.locationName }}
              </view>
              <view class="ellipsis" style="font-size: 24rpx;color: #999999;">
                <text class="ellipsis">{{ item.districtName }}-{{ item.address }}</text>
              </view>
            </view>
            <div style="width: 20%;" class="point-com-right" @click.stop="goLocation(item)">
              <image
                class="point-com-right-image"
                :src="
                  staticBaseUrl +
                  '/hbdimage/main/images/package-services/luxian.png'
                "
              ></image>
            </div>
          </view>
          <view v-if="!needOpenLocation" class="flex" style="align-items: center;margin-top: 12rpx;">
            <u-icon name="map" size="16" color="#3BB3AD" />
            <view style="font-size: 24rpx;margin-left: 6rpx;">距您直线距离{{ item.distance }}{{ this.dataSourceType == 'self' ? 'km' : '' }}
            </view>
          </view>
        </view>

      </scroll-view>
    </view>

    <vc-empty v-if="filteredList.length === 0"></vc-empty>
  </vc-container>
</template>
<script>
import { platform, isH5, isApp, isMp } from "@/utils/platform";
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";
import { getMapList } from '../api/baseServices';
let hbd = null;
export default {
  name: "mapPage",
  data() {
    return {
      isH5: isH5,
      isMp: isMp,
      needOpenLocation: true,
      propsData: {
        props: {
          title: {
            value: '地图'
          },
        },
      },
      // 订阅服务id 
      propsDataSub: {
        props: {
          serviceId: {
            value: ''
          }
        }
      },
      actionStyle: {
        color: '#999',
        position: 'absolute',
        right: '40rpx',
        zIndex: '999'
      },
      mapList: [],
      search: '',//搜索内容
      btmSearch: '',//底部搜索
      list: [],//地址列表
      latitude: '',
      longitude: '',
      startPoint: {//起点
        lat: '',
        lng: ''
      },
      endPoint: {// 终点
        lat: '',
        lng: ''
      },
      keywords: '',
      filteredList: [],//渲染list
      // markers: [],
      markerpoints: [],
      dataSourceType: 'self',
      region: '保定',
      query: '',

    }
  },
  async onLoad(options) {
    this.propsData.props.title.value = options.title;
    hbd = this.bridgeSdk.hbd;//引用hbdsdk资源
    this.mapId = options.serviceId;
    this.dataSourceType = !this.bridgeSdk.checkIsEmpty(options.dataSourceType) ? this.dataSourceType : options.dataSourceType;//百度检索
    //默认走页面title，如果后端配置就走配置query
    this.query = !this.bridgeSdk.checkIsEmpty(options.query) ? options.title : options.query;//百度检索

    this.propsDataSub.props.serviceId.value = options.subId;//订阅服务id
    this.bridgeSdk.getLocation(res => {
      this.needOpenLocation = res.locationFail === true;
      this.longitude = Number(res.lng);
      this.latitude = Number(res.lat);
      this.startPoint.lng = Number(res.lng);
      this.startPoint.lat = Number(res.lat);
      this.getList();
    });


  },
  onShow() {


  },
  computed: {
    ...mapState(useBaseStore, {
      navigationBarInfo: "navigationBarInfo",
    }),
    // 页面高度
    scrollBoxHeight() {
      let val =
        this.navigationBarInfo.statusBarHeight +
        this.navigationBarInfo.navigationBarHeight;
      return "calc(100vh - " + val + "px - 800rpx)";
    },
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
        // console.log("marker", marker);
        return {
          ...marker,
          id: Number(item.locationId) || index + 1,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude)
        };
      });
    }
  },
  watch: {

  },
  methods: {
    //小程序点击标记点时间处理
    makertap(e) {
      console.log("这是标记点的点击事件", e);
    },
    getList() {

      let params = {
        mapId: this.mapId,
        keywords: this.keywords,
        longitude: this.longitude,
        latitude: this.latitude,
        dataSourceType: this.dataSourceType,
        // current:'',
        size: '100',
        query: this.query,
        region: this.region,
        // center:`${this.latitude},${this.longitude}`,
        // industryType:'',
        // filter:''//非必选 当scope取值为2时，可以设置filter进行排序
      }
      getMapList(params).then(async res => {

        this.total = res.total;
        this.list = res;
        this.mapList = this.list.mapLocationListBOS;
        console.log("这是地图列表", this.mapList);
        this.filteredList = [...this.mapList];
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
        // if (this.markerAdded) {
        //   return;
        // }
        // 初始化marker点
        // this.bridgeSdk.showMarker({
        //   markerpoints: this.markerpoints,
        //   lng: Number(this.longitude),
        //   lat: Number(this.latitude),
        // });
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
    //返回上一级
    goBack() {
      this.bridgeSdk.navigateBackTo({
        delta: 1
      })
    },
    //搜索
    goSearch(e) {
      console.log(e);
      if (e && e.stopPropagation) { e.stopPropagation(); }
      if (this.time && new Date().getTime() - this.time < 1000) {
        return
      }
      this.time = new Date().getTime();
      this.filteredList = [];
      this.getList();
    },
    inputBlur() {
      if (!this.bridgeSdk.checkIsEmpty(this.keywords)) {
        this.goSearch();
      }
    },
    inputFocus() {
    },
    goLocation(item) {
      console.log("这是导航", item);
      let s = `${Number(this.longitude)},${Number(this.latitude)}`;
      let e = `${Number(item.longitude)},${Number(item.latitude)}`;
      console.log("开始坐标：", s, "终点坐标：", e);
      // 调用sdk 
      this.bridgeSdk.routePlan(s, e, item.districtName || item.locationName, item.address || item.locationName);
    }

  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 800rpx;

  #container {
    width: 100%;
    height: 800rpx;
  }
}

.map {
  width: 100%;
  height: 100%;

}

.search-block ::v-deep {
  .u-search__content {
    justify-content: flex-start;
    .u-search__content__input {
      width: calc(100% - 160rpx);
      flex: none !important;
    }
  }
}

.search-block {
  z-index: 99;
  position: absolute;
  background-color: transparent;
  top: 170rpx;
  width: 90%;
  margin: 0 auto;
  left: 0;
  right: 0;
  display: flex;
  // align-items: center;
  justify-content: space-between;
  padding: 10rpx 20rpx;
  padding-right: 0rpx;

  .search-right {
    position: relative;
    right: 20rpx;
    width: 0;
    color: #999999;
    font-weight: 400;
    font-size: 28rpx;
    // padding: 20rpx;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
    align-items: self-start;
    .search-button {
      flex: 0 0 100rpx;
      width: 100rpx;
      text-align: center;
      font-size: 28rpx;
      padding: 20rpx 0;
      white-space: nowrap;
      z-index: 2;
      position: relative;
    }
  }

  .search-button::after {
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

.bottom-block {
  display: flex;
  flex-direction: column;
  border-radius: 50rpx 50rpx 0 0;
  padding: 20rpx 0;
  box-sizing: border-box;
  background: linear-gradient(180deg, #C0FCF6 0%, #F6FFFF 100%);
  box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.1);
  border-radius: 40rpx 40rpx 0rpx 0rpx;

  .search {
    height: 80rpx;
    margin-bottom: 40rpx;
    padding: 10rpx 5px;
    margin: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    input {
      border-bottom: 1rpx solid #f8f8f8;
      margin-left: 20rpx;
      padding-bottom: 5rpx;
    }
  }

  .scroll-block {
    height: calc(100% - 80rpx);
    padding: 0 20rpx;
    margin: 0 auto;
    width: 92%;

    .scroll-item {
      box-shadow: 0 0 20rpx 0rpx rgba(35, 186, 171, 0.2);
      background: #FFFFFF;
      border-radius: 20rpx;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      padding: 24rpx;
      line-height: 40rpx;
      background-color: white;
      margin-bottom: 20rpx;
      float: left;
      width: 100%;
      box-sizing: border-box;
    }
  }
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

::v-deep .BMap_Marker img {
  width: 100%;
}
</style>