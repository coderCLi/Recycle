<!--
 * @Description: 应用主页，也用于管理端配置小程序首页时可视化展示用
 * @Author: yulongchen
 * @Date: 2024-11-23 17:13:38
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-07-29 14:26:03
 * @Remark: 
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  
  <view class="main" @click="togglePopover">

    <!-- <view :style="`position: fixed; top: ${0}px; left: ${0}px; width: 60px; height: 40px; z-index: 1001; background: green;`" @click="showMaskMethod(showMaskIndex)"></view> -->
    <vc-guide-mask ref="guideMask" v-show="maskShow[0] && maskShow[1] && maskShow[2]" :props-data="maskPropsData" @updateServiceIndexForMask="updateServiceIndexForMask" @getEleThat="getEleThat"></vc-guide-mask>

    <!-- 状态栏 -->
    <!-- <vc-status-bar /> -->

    <!-- <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/1.doc')">1.doc</button>
    <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/2.png')">2.png</button>
    <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/3.pptx')">3.pptx</button>
    <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/4.docx')">4.docx</button>
    <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/5.xlsx')">5.xlsx</button>
    <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/6.pdf')">6.pdf</button>
    <button @click="download('https://izhuzi.top/hbd-uniapp-static/docs/7.zip')">7.zip</button> -->

    <view
      class="" 
      style="z-index: 1"
    >
      <!-- 背景 -->
      <!-- <view class="top-bg"></view> -->

      <!-- <weather-area ref="weatherArea" id="weatherArea" class="sticky-top" style="z-index: 2" :props-data="weatherPropsData">
        <view class="service-type">
          <template v-if="serviceTypeList.length &gt; 1">
            <text
              class="service-type-text"
              v-for="(item, index) in serviceTypeList"
              :key="index"
              :class="`${serviceIndex === index ? 'serviceActive' : ''} ${item.tagClass ? item.tagClass: ''}`"
              @click="toggleServiceType(item, index)"
              >{{ item.subjectName }}
            </text>
          </template>
        </view>
        <template v-slot:message>
          <view class="dot" v-if="messageCount > 0">{{ messageCount > 99 ? "99" : messageCount }}</view>
        </template>
      </weather-area> -->

      <!-- 顶部logo -->
      <!-- <view class="sticky-top header-logo" :style="'padding-top:' + navigationBarInfo.safeAreaTop + 'px;'">
        <image
          class="header-logo"
          :src="staticBaseUrl + '/hbdimage/main/images/home/logo.png'"
          mode="scaleToFill"
        />
      </view> -->

      <vc-header-logo></vc-header-logo>

      <!-- 搜索 -->
      <!-- <vc-search-box
        class="sticky-top"
        :style="{ top: searchStickTop + 'px' }"
        @toSearch="toSearch"
        :props-data="searchPropsData"
      ></vc-search-box> -->
      <view class="home_main" :style="{height: 'calc(100vh - ' + (navigationBarInfo.statusBarHeight + navigationBarInfo.navigationBarHeight) + 'px)'}">
        <!-- <image class="home_main_bg"
          :src="minioBaseUrl + 'common/tabbarImages/home_bgimg_pattern_img.png'"
          mode="scaleToFill"
        /> -->
        <!-- class="cpa-relative cpa-px-12-5" -->

        <!-- 轮播图 -->
          <!-- <vc-banner v-if="serviceData.isShowBanner && serviceData.isShowBanner == '1' " :props-data="ba.value" @toPage="toPage"></vc-banner> -->

          <!-- 黄金区 -->
          <!-- <vc-gold v-if="serviceData.isShowGolden && serviceData.isShowGolden == '1' " :props-data="goldDataInfo.value" @toPage="toPage"></vc-gold> -->

          <!-- 金刚区 -->
          <!-- <vc-menus ref="kongKim" v-if="serviceData.isShowKong && serviceData.isShowKong == '1'" :props-data="kongKimDataInfo.value" @toPage="toPage"></vc-menus> -->
        
        <view class="home_main_item" v-for="(item, index) in dataList" :key="index">
          <!-- 轮播图 -->
          <!-- 生活与便民服务数据源不同 -->
          <vc-banner v-if="serviceData.isShowBanner && serviceData.isShowBanner == '1' && item.showType == 'banner'" :props-data="item.value" @toPage="toPage" style="width: 690rpx; height: 288rpx; margin-left: 30rpx;"></vc-banner>
          
          <!-- 黄金区 -->
          <vc-gold v-if="serviceData.isShowGolden && serviceData.isShowGolden == '1' && item.showType == 'golden'" :props-data="item.value" @toPage="toPage"></vc-gold>
          
          <!-- 金刚区 -->
          <vc-menus ref="kongKim" v-if="serviceData.isShowKong && serviceData.isShowKong == '1' && item.showType == 'kongKim'" :props-data="item.value" @toPage="toPage"></vc-menus>
          <view class="space-top"></view>
          <!-- 特色专区 -->
          <!-- v-if="serviceData.isShowGolden && serviceData.isShowGolden == '1'" -->
          <vc-special ref="TSBK" v-if="item.showType == 'TSBK'" :props-data="item.value" @toPage="toPage"></vc-special>

          <!-- v-if="serviceData.isShowGolden && serviceData.isShowGolden == '1'" -->
          <!-- <view v-if="item.showType == 'TSBK'" class="space-top"></view> -->

          <!-- 轻banner -->
           <view class="hf-title-box" v-if="item.showType == 'HF'">
            <!-- <image
            class="hf-title-img"
              :src="minioBaseUrl + 'common/tabbarImages/home_title_label_img.png'"
              mode="scaleToFill"
            /> -->
            <text class="hf-title-img"></text>
            <text class="hf-title-text">领券中心</text>
           </view>
          <vc-banner v-if="item.showType == 'HF'" :props-data="item.value" @toPage="toPage" style="width: 690rpx; height: 180rpx; border-radius: 90rpx !important;"></vc-banner>
          <!-- <view v-if="item.showType == 'HF'" class="space-top"></view> -->

          <!-- 活动专区 -->
          <vc-activity v-if="item.showType == 'HDBK'" :props-data="item.value" @toPage="toPage"></vc-activity>
          <!-- <view v-if="item.showType == 'HDBK'" class="space-top"></view> -->

          <!-- 通知公告、资讯 -->
          <vc-notice v-if="item.showType == 'ZX'" :props-data="item.value" @toPage="toPage"></vc-notice> 
          <!-- <view v-if="item.showType == 'ZX'" class="space-top"></view> -->

          <!-- 区县专区 -->
          <vc-distinct v-if="item.showType == 'ZQ'" :props-data="item.value" @toPage="toPage"></vc-distinct>
          <view v-if="item.showType == 'ZQ'" class="safe-space"></view>
        </view>


        <!-- 特色专区 -->
        <!-- v-if="serviceData.isShowGolden && serviceData.isShowGolden == '1'" -->
        <!-- <vc-special :props-data="specialZonePropsData" @toPage="toPage"></vc-special> -->

        <!-- v-if="serviceData.isShowGolden && serviceData.isShowGolden == '1'" -->
        <!-- <view class="safe-space"></view> -->

        <!-- 轻banner -->
        <!-- <template v-if="this.adListPropsData.props.list.value && this.adListPropsData.props.list.value.length &gt; 0">
          <vc-banner :props-data="adListPropsData" @toPage="toPage"></vc-banner>
          <view class="safe-space"></view>
        </template> -->

        <!-- 活动专区 -->
        <!-- <vc-activity :props-data="activityZonePropsData"></vc-activity>

        <view class="safe-space"></view> -->

        <!--- 生活与便民区分服务 -->
        <!-- 便民服务 -->
        <!-- <template v-if="serviceType == '便民'">
          通知公告
          <vc-notice :props-data="noticePropsData"></vc-notice>

          区县专区
          <vc-distinct :props-data="distinctPropsData"></vc-distinct>
        </template> -->
        <!--- 生活服务 -->
       <!-- <template v-if="serviceType == '生活'">
          <view class="service-type service-type-life">
            <text
              class="service-type-text"
              :class="{ serviceActive: lifeServiceType === item.value }"
              v-for="(item, index) in lifeServiceTypeList"
              :key="index"
              @click="toggleLifeServiceType(item)"
              >{{ item.name }}</text
            >
          </view>
          <vc-waterfall ref="uWaterfallRef"></vc-waterfall>
        </template> -->


      </view>
    </view>

    <!-- <image
      :src="staticBaseUrl + '/hbdimage/main/images/home/zhangzhe.png'"
      class="parentMode"
      @click="toOpenNewWin('/oldman')"
      mode="widthFix"
    ></image> -->

    <!-- <vc-safe-bottom /> -->

	  <!--广告提示-->
    <template v-if="adPropsData.props.list.value.length > 0">
      <vc-ad ref="ad" :props-data="adPropsData" @toPage="toPage" @close="adClose"></vc-ad>
    </template>

  </view>
</template>

<script>
	import {
    getHomeWeather,
		getHomeData,
		getHomeVersion,
		getSearchInit,
    getNotifyCount,
    adList,
    checkTips
	} from "@/api/home";
  import { login } from '@/utils/wxLogin';
  import pagesjson from '@/pages.json'
  
	import vcSearchBox from "@/components/library/base/vc-search-box/index.vue";
	import vcGold from "@/components/library/base/vc-gold/index.vue";
	import vcHeaderLogo from "@/components/library/base/vc-header-logo/index.vue";
	import vcBanner from "@/components/library/base/vc-banner/index.vue";
	import vcMenus from "@/components/library/base/vc-menus/index.vue";
	import vcSpecial from "@/components/library/base/vc-special/index.vue";
	import vcActivity from "@/components/library/base/vc-activity/index.vue";
	import vcNotice from "@/components/library/base/vc-notice/index.vue";
	import vcDistinct from "@/components/library/base/vc-distinct/index.vue";
	import weatherArea from "@/components/library/base/vc-weather-area/index.vue";
	import vcWaterfall from "@/components/library/base/vc-waterfall/index.vue";
	import vcAd from "@/components/library/base/vc-ad/index.vue";
  import vcGuideMask from "@/components/library/base/vc-guide-mask/index.vue";
	import {
		mapState
	} from "pinia";
	import {
		useBaseStore,
		useUserStore
	} from "@/store/index";
	export default {
		name: "home",
		components: {
			vcSearchBox,
			vcGold,
			vcBanner,
			vcMenus,
			vcSpecial,
			vcActivity,
			vcNotice,
			vcDistinct,
			weatherArea,
			vcWaterfall,
			vcAd,
      vcGuideMask,
      vcHeaderLogo,
		},
		computed: {
			...mapState(useBaseStore, {
				navH: "navH",
				navigationBarInfo: "navigationBarInfo",
			}),
			...mapState(useUserStore, {
				userInfo: "userInfo",
        isLogined: "isLogined",
			}),
		},
		data() {
			return {
        pagesjson,
        messageCount: 0,
        maskShow: [0, 0, 0],
        maskPropsData: {
					props: {
            maskRectList: {
              value: []
            }
					}
				},
        dataList: [],
        bannerDataInfo: {},
        goldDataInfo: {},
        kongKimDataInfo: {},
        weatherPropsData: {
					props: {
						// weather: {
            //   value: "" 
            // },
            // temperature: {
            //   value: "" 
            // },
            messageCount: {
              value: 0
            }
					}
				},
        adPropsData: {
					props: {
						list: {
							value: []
						}
					}
				},
				searchPropsData: {
					props: {
						placeholder: {
							value: '请输入关键字'
						}
					}
				},
				goldZonePropsData: {
					props: {
						list: {
							value: []
						}
					}
				},
				serviceData: {},
				serviceIndex: 0,
				serviceType: "",
        serviceDefaultType: "",
        serviceTypeList: [],
        lifeServiceTypeList: [
          {
            name: "精选优惠",
            value: "1",
          },
          {
            name: "特色热卖",
            value: "2",
          },
        ],
        lifeServiceType: "1",
        bannersPropsData: {
          props: {
            height: {
              value: 260,
            },
            width: {
              value: 690,
            },
            list: {
              value: [],
            },
          },
        },
        menusPropsData: {
          props: {
            list: {
              value: [],
            },
          },
        },
        adListPropsData: {
          props: {
            height: {
              value: 152,
            },
            width: {
              value: 704,
            },
            list: {
              value: [],
            },
          },
        },

        searchStickTop: "",
        moreList: [ // 更多
          { showType: 'ZX', moreType: 'ZX-MORE' },
          { showType: 'ZQ', moreType: 'ZQ-MORE' },
          { showType: 'HDBK', moreType: 'HDBK-MORE' },
        ]
      };
    },
  onShow() {
    this.bridgeSdk.beans.setGlobalThis(this);
    console.log("isLogined", this.isLogined);
    this.getNotifyCount();
  },
  onHide() {
    this.bridgeSdk.beans.removeGlobalThis(this);
  },
  onPullDownRefresh() {
    console.log("刷新");
    if(this.h5Iframe){
      uni.stopPullDownRefresh();
    } else {
      this.__loadData__();
      setTimeout(function () {
        uni.stopPullDownRefresh();
      }, 1000);
    }
	},
  async onLoad(options) {
    this.onShareAppMessageData = {
      // 转发标题，当前小程序名称	
      title: "首页",
    }

    // this.bridgeSdk.jumpPage({
    //   url: "/package-speed-park/pages/speed-park"
    // });

    // console.log("decimal plus", this.bridgeSdk.decimal.plus(0.1, 0.2));
    // console.log("decimal minus", this.bridgeSdk.decimal.minus(0.1, 0.2));
    // console.log("decimal multiply", this.bridgeSdk.decimal.multiply(0.1, 0.2));
    // console.log("decimal divide", this.bridgeSdk.decimal.divide(0.1, 0.2));
    // console.log("decimal eq", this.bridgeSdk.decimal.eq(this.bridgeSdk.decimal.plus(0.1, 0.2), 0.3));
    
    this.trackReport.trackPageView("首页");

    let that = this
    this.h5Iframe = false
    // #ifdef H5
    this.h5Iframe = location?.href?.indexOf('channel=h5Iframe') > -1
    // #endif

    // #ifdef MP
    // getHomeWeather({"cityCode":"130600"}, {mask: false}).then((res)=> {
    //   // console.log("getHomeWeather({}).then(res=> {  ---------", res)
    //   // console.dir(res);
    //   const weatherData = {
    //     weather: "",
    //     temperature: ""
    //   };
    //   if (res) {
    //     weatherData.weather = res.text || "";
    //     weatherData.temperature = res.temp || "";
    //   }
    //   const baseStore = useBaseStore();
    //   baseStore.updateWeather(weatherData);
    // });
    // #endif

    if(this.h5Iframe){
      console.log("页面来自于iframe内嵌")

      // 接受子页面发来的信息
      window.addEventListener('message', function(event) {
        console.log("h5Iframe message",event)
        var messageData = event.data;
        that.serviceTypeList = JSON.parse(messageData.data || "[]")
        let subjectId = messageData.subjectId
        let index = that.serviceTypeList.findIndex(item => item.subjectId === subjectId)
        console.log(index)
        if(index == -1){
          that.serviceIndex = 0
        }else{
          that.serviceIndex = index
        }
        that.updateServiceType();
        that.handleHomeData()
      });
      that.$nextTick(() => {
        document.addEventListener("click", function(event) {
          event.stopPropagation();
          event.preventDefault();
        }, true)
        // 移除tabbar
        const cleardom = document.querySelectorAll('.uni-tabbar-bottom')
        Array.from(cleardom).forEach((item) => {
          item.remove()
        })
      })
    }
    else{
      this.__loadData__();
      this.adList();
    }

  },
  // onReachBottom() {
    // 生活服务才触发
    // this.serviceType == "生活" && this.$refs.uWaterfallRef.loadMore();
  // },
  onReady() {
    setTimeout(() => {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#weatherArea")
        .boundingClientRect((data) => {
          console.log("得到布局位置信息：" + JSON.stringify(data));
          this.searchStickTop = data?.height;
          console.log("搜索框吸顶距离：" + this.searchStickTop);
        })
        .exec();
    }, 1000);

    if(this.h5Iframe){
      // 发送消息给父页面
      console.log("发送消息给父页面")
      window.top.postMessage("页面加载完成", location.origin)
    }

  },
  onUnload() {
    // uni.off('update')
  },
  onPageScroll(e) {
    // console.log("页面滚动", e);
    uni.$emit("pageScroll", e);
  },
  methods: {
    getEleThat(showType) {
    },
    togglePopover() {
      // this.$refs.weatherArea.toggle();
    },
    // download(url){
    //   this.bridgeSdk.downloadFile({
    //     url: url
    //   });
    // },
    async __loadData__() {
      await this.checkVersion();
      // await this.getSearchInit();
      // this.getNotifyCount();
      
      // this.getHomeWeather();
    },
    checkVersion() {
      return new Promise((resolve, reject) => {
        getHomeVersion({})
          .then(async (res) => {
            console.log("getHomeVersion ");
            console.dir(res);
            let homepageInfo = this.bridgeSdk.getStorageSync('homepageInfo');

            let oldVersion = "";
            if (homepageInfo && homepageInfo.list && homepageInfo.list.length > 0) {
              oldVersion = homepageInfo.list[0].newVersion
            }
            if (res && res.newVersion && oldVersion && res.newVersion == oldVersion) {
              let _res = homepageInfo;
              if (_res != null && _res.list != null && _res.list.length > 0) {
                this.serviceDefaultType = this.serviceType.length > 0 ? this.serviceType : _res.isDefault || "";
                console.log("this.serviceDefaultType = 11 " +  this.serviceDefaultType);
                if (Object.prototype.toString.call(_res.list) === "[object Array]") {
                  this.serviceTypeList = _res.list;
                  this.updateServiceIndex();
                  console.log("新旧版本一致，不拉取 新的数据");
                  console.log("新旧版本一致，不拉取 新的数据 this.serviceTypeList", this.serviceTypeList)
                  this.handleHomeData();
                  resolve(res);
                  return;
                }
              }
            }
            await this.getHomeData();
            resolve(res);
          })
          .catch(async (error) => {
            console.log("getHomeVersion error---1");
            // Toast.clear();
            // Toast("网络异常，请稍后重试");
            await this.getHomeData();
            reject(error);
          });
      });
    },
    getHomeData() {
      return new Promise((resolve, reject) => {
        getHomeData({queryDefault: 1})
          .then((res) => {
            console.log("getHomeData ");
            console.dir(res);
            if (res != null && res.list != null && res.list.length > 0) {
              this.serviceDefaultType = this.serviceType.length > 0 ? this.serviceType : res.isDefault || "";
              if (Object.prototype.toString.call(res.list) === "[object Array]") {
                let listData = res.list[0].showList;
                let index = listData.findIndex(item => item.showType == 'banner');
                let bannerData = {};
                if(index > -1){
                  bannerData = listData[index];
                  listData.splice(index, 1);
                  listData.unshift(bannerData);
                }
                let resData = res
                resData.list[0].showList = listData
                this.bridgeSdk.setStorageSync("homepageInfo", {...resData});
                this.serviceTypeList = resData.list;
                this.updateServiceIndex();
                this.handleHomeData();
              }
            }
            resolve(res);
          })
          .catch((e) => {
            console.dir(e);
            console.log("getHomeData error---1");
            // Toast.clear();
            // Toast("网络异常，请稍后重试");
            reject(e);
          });
      });
    },
    updateServiceType() {
      let _list = this.serviceTypeList;
      if (_list.length <= this.serviceIndex) {
        if (_list.length === 0) return;
        this.serviceIndex = 0;
      }
      // 开始处理后台数据
      let bigDic = _list[this.serviceIndex] || {};
      this.serviceType = bigDic.subjectName;
    },
    updateServiceIndex() {
      if (!this.serviceDefaultType || this.serviceDefaultType.length == 0) {
        return;
      }
      let _list = this.serviceTypeList;
      if (!_list || _list.length == 0) {
        this.serviceIndex = 0;
        return;
      }
      let str = this.serviceDefaultType;
      let index = _list.findIndex((bigDic)=> {
        return str === bigDic.subjectName
      });
      if (index < 0) {
        return;
      }
      this.serviceIndex = index;
      // 开始处理后台数据
      let bigDic = _list[this.serviceIndex] || {};
      this.serviceType = bigDic.subjectName;
    },
    updateServiceIndexForMask(subjectName) {
      this.serviceDefaultType = subjectName;
      if (Object.prototype.toString.call(this.serviceTypeList) === "[object Array]") {
        this.updateServiceIndex();
        this.handleHomeData();
      }
    },
    // 根据serviceIndex处理数据
    handleHomeData() {
      // 根据不同type，映射图片数据为photoId、photoUrl、staticUrl、跳转路径等
      let photoIdFunc = (dic, type) => {
        let bkType = dic.showType;
        dic.serviceList = dic.serviceList.map((element, index) => {
          element.showType = bkType;
          element.prefectureType = dic.prefectureType; // prefectureType 专区类型枚举： 1-区县专区
          // 如果是资讯，特殊处理
          if (bkType == "ZX") {
            element.tag = (element.tag && element.tag.length > 0) ? element.tag : element.photoUrl;
          }
          element.photoId = element.photoId ? element.photoId : element[`${type}PhotoId`];

          let tempUrl = element.photoUrl ? element.photoUrl : element[`${type}PhotoUrl`];
          tempUrl = tempUrl ? tempUrl : element[`smallPhotoUrl`];
          // 因为是相对路径，防止重复拼接根路径
          if (element.photoUrl && element.photoUrl.includes(this.minioBaseUrl)) {
            element.photoUrl = tempUrl;
          } else if (tempUrl) {
            element.photoUrl = this.minioBaseUrl + tempUrl;
          } else {
            element.photoUrl = null;
          }

          element.imgurl = element.photoUrl;
          element.staticUrl = element.photoUrl;
          element.name = element.serviceName;
          element.id = element.serviceId;
          // element.path = element.url; // 直接使用.url
          // element.isTips = element.isTips
          // element.tipText = element.tipText

          let ele = this.maskPropsData.props.maskRectList.value.find(m => m.showType === bkType && (m.index - 1) === index);
          if (ele) {
            element.tagClass = ele.tagId
          }

          return element;
        });
        return dic;
      };
      console.log("首页数据 --------------------------serviceIndex " + this.serviceIndex);
      console.log("首页数据 handleHomeData this.serviceTypeList", this.serviceTypeList);
      let res = this.serviceTypeList || [];
      if (res.length <= this.serviceIndex) {
        console.log("---if (res.length <= this.serviceIndex) {", res.length, this.serviceIndex);
        if (res.length === 0) return;
        console.log("---if (res.length === 0) return;");
        this.serviceIndex = 0;
      }
      console.log("开始处理数据1 --------------------------serviceIndex " + this.serviceIndex);
      res.forEach((item, index) => {
        let ele = this.maskPropsData.props.maskRectList.value.find(m => m.showType === 'big' && (m.index - 1) === index);
        if (ele) {
          item.tagClass = ele.tagId
        }
      });
      // 开始处理后台数据
      let bigDic = res[this.serviceIndex] || {};
      this.updateServiceType();
      this.serviceData = bigDic;
      let _list = [];
      if (
        bigDic &&
        Object.prototype.toString.call(bigDic.showList) === "[object Array]"
      ) {
        console.log("开始处理数据2 --------------------------");

        let _moreStrs = this.moreList.map(e=>e.moreType);
        let _shwTypeStrs = this.moreList.map(e=>e.showType);
        let _showList = [...bigDic.showList].filter(e => {
          return !_moreStrs.includes(e.showType)
        });
        let _moreDic = [];
        for (const mreIte of this.moreList) {
          const shwType = mreIte.showType;
          let mreType = mreIte.moreType;
          let _zxMore1 = [...bigDic.showList].find(e => {
            return e.showType == mreType;
          });
          if (_zxMore1 && _zxMore1.serviceList.length > 0) { _moreDic[shwType] = _zxMore1.serviceList[0] }
        }
        


        _showList.forEach((element) => {
          let _dic = { showType: element.showType,
            value: { props: { list: { value: [] }, height: { value: 0 },width: { value: 0 }, title: {value: ""}, moreItem: {value: {}}, swiperType: {value: {}}, } }
          }

          let picTag = "small";
          // 如果是banner数据
          if (element.showType === "banner") {
            picTag = "banner";
            // 如果是黄金区数据、金刚区数据、扩展banner
          } else if (["golden", "kongKim", "HF"].includes(element.showType)) {
            picTag = "middle";
            // 如果是特色专区、活动专区、区县
          } else if (["TSBK", "HDBK", "ZQ"].includes(element.showType)) {
            picTag = "big";
            // 如果是资讯
          } else if (["ZX"].includes(element.showType)) {
          }
          let _serviceList = photoIdFunc(element, picTag).serviceList;

          let moreEle = this.maskPropsData.props.maskRectList.value.find(m => m.showType === 'kongKim' && _dic.showType === 'kongKim' && (m.index - 1) === _dic.value.props.list.value.length);
          if (moreEle) {
            _dic.value.props.moreItem.value = {'tagClass':  moreEle.tagId }
          }
          
          let orderFlagItm = _serviceList.find((e)=>{
            return e.orderFlag == 0 || e.orderFlag == '0';
          });
          _serviceList = _serviceList.filter((e)=>{
            return e.orderFlag != 0 && e.orderFlag != '0';
          });
          if (orderFlagItm) {
            _serviceList.push(orderFlagItm);
          }

          // 处理更多
          console.log('-----------_shwTypeStrs--', _shwTypeStrs, _moreDic, element.showType)
          if (_shwTypeStrs.includes(element.showType) && _moreDic[element.showType]) {
            _dic.value.props.list.value = [..._serviceList, _moreDic[element.showType]];
          } else {
            _dic.value.props.list.value = _serviceList;
          }

          if (element.showType === "banner") {
            _dic.value.props.height.value = 260; // 单位是rpx
            _dic.value.props.width.value = 690; // 单位是rpx
            _dic.value.props.swiperType.value = "banner"
          } else if (element.showType === "HF") {
            _dic.value.props.height.value = 180;
            _dic.value.props.width.value = 690; // 单位是rpx
          }
          if (element.title && element.title.length > 0) {
            _dic.value.props.title.value = element.title;
          } else {
            _dic.value.props.title = null;
          }
          _list.push(_dic);
        });
        this.dataList = _list;
        console.log("dataList ----------", this.dataList);
        this.$set(this, "dataList", this.dataList);
        this.$set(this, "bannersPropsData", this.bannersPropsData);
        this.$set(this, "goldZonePropsData", this.goldZonePropsData);
        this.$set(this, "menusPropsData", this.menusPropsData);
        this.$set(this, "adListPropsData", this.adListPropsData);
        this.$set(this, "specialZonePropsData", this.specialZonePropsData);
        this.openMask(1);
      }
      console.log("开始处理数据3 --------------------------");
    },
    // 获取搜索框占位文字
    getSearchInit() {
      return new Promise((resolve, reject) => {
        let orderFlag = this.serviceIndex + 1 + ""; // 左面1，右面2
        let type = "1"; // 主页1    更多2  主页入口能查新闻和服务，更多服务入口只能查服务
        let data = {
          orderFlag: orderFlag,
          type: type
        };
        getSearchInit(data, {mask: false})
          .then((res) => {
            if (res.searchText && res.searchText.length > 0) {
              this.searchPropsData.props.placeholder.value = res.searchText;
              this.$set(this, "searchPropsData", this.searchPropsData);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 切换服务类型
    toggleServiceType(item, index) {
      this.serviceIndex = index;
      
      const info = this.serviceTypeList[index];
      console.log("切换服务类型", info);
      this.trackReport.trackCustom(info.subjectName);

      this.updateServiceType();
      this.handleHomeData();
    },
    // toggleLifeServiceType(item) {
    //   this.lifeServiceType = item.value;
    // },
    // ...mapActions(useBaseStore, ['setNavH']),
    // jumpToH5(){
    //   this.bridgeSdk.jumpPage({
    //     url: '/pages/h5/h5?url=https://www.baidu.com&needLogin=flase'
    //   });
    // }
    toPage(item) {
      console.log("toPage", item);
      let path = item.url;
      console.log("hoem " + path)
      
      // 处理url   --- 写死的
      // 区县专区
      // if (item.showType == 'ZQ' && item.prefectureType == 1) {permissionLevel总是为null
      if (item.showType == 'ZQ' && item.orderFlag != '0' && item.permissionLevel == 1) { // permissionLevel等于1，表示区县专区的
        path = `/package-quxian-info/pages/quxianInfo?homepagePrefectureId=${item.serviceExampleId}`
      // 资讯
      } else 
      if (item.showType == 'ZX' && !path) {
        path = `/package-general-services/information/detail?id=${item.serviceExampleId}`
      }
      if (path && path.includes("/package-more")) {
        let orderFlag = this.serviceIndex + 1 + ""; // 左面1，右面2
        let type = "2"; // 主页1    更多2  主页入口能查新闻和服务，更多服务入口只能查服务

        let fuhao = path.indexOf('?') > -1 ? '&' : '?'
        path = `${path}${fuhao}pageType=${type}&orderFlag=${orderFlag}`;
      }
      this.bridgeSdk.toServicePage(path, item, this.serviceData.subjectId);
    },
    toSearch() {
      let orderFlag = this.serviceIndex + 1 + ""; // 左面1，右面2
      let type = "1"; // 主页1    更多2  主页入口能查新闻和服务，更多服务入口只能查服务
      this.bridgeSdk.jumpPage({
        url: `/package-search/home/index?pageType=${type}&orderFlag=${orderFlag}`
      });
    },
    // 长者模式跳转
    toOpenNewWin(e) {
      this.bridgeSdk.jumpPage({
        needLogin: false,
        url: '/page-elderl-mode/elderly/elderlyMode',
    
      });
    },
    // 获取消息数据
    getNotifyCount() {
      // 如果是登录状态，则获取
      if (this.bridgeSdk.getUserInfo()) {
        console.log("去登录 --- 用户信息")
        console.dir(this.bridgeSdk.getUserInfo());
        getNotifyCount({}, {mask: false}).then(res=> {
          console.log("getNotifyCount().then(res=> {--------")
          console.dir(res);
          if (Object.prototype.toString.call(res.count) == '[object String]') {
            this.messageCount = res.count.length > 0 ? parseInt(res.count) : 0;
          } else {
            this.messageCount = res.count || 0;
          }
          this.weatherPropsData.props.messageCount.value = this.messageCount;
          
          console.log("messageCount " + this.messageCount);
        });
      } else {
        console.log("未登录home");
        this.messageCount = 0;
        this.weatherPropsData.props.messageCount.value = this.messageCount;
      }
    },
    adList() {
      // adType 广告类型：1-弹窗广告；3-全屏广告
      adList({adType: 1}).then(res=> {
        console.log("adList({adType: 1}).then(res=> {  ---------")
        console.dir(res);
        if (res && res.length > 0) {
          this.adPropsData.props.list.value = res;
          this.$nextTick(() => {
            this.$refs.ad.open();
          });
        } else {
          this.adPropsData.props.list.value = [];
          this.getCheckTips(()=>{
            this.openMask(0)
          });
          
        }
      }).catch((err)=>{
        this.getCheckTips(()=>{
          this.openMask(0)
        });
      });
    },
    openMask(index) {
      if (this.maskShow[index] == 1) {
        return;
      }
      this.maskShow[index] = 1;
      console.log('----------open Mask(index) {--' + index, this.maskShow)
      if (this.maskShow[0] && this.maskShow[1] && this.maskShow[2]) {
        setTimeout(()=>{
            console.log('开始显示引导')
            this.$refs.guideMask.showMaskMethod(0);
        },50);
      }
    },
    adClose() {
      this.getCheckTips(()=>{
        this.openMask(0)
      });
    },
    getCheckTips(successFunc) {
      // #ifdef MP
      login().then((res)=> {
        const code = res && res.code ? res.code : ''
        checkTips({code}).then((res)=> {
          if (res && res.flag == 1) {
            this.handleTipsResult(res);
            successFunc&&successFunc();
          }
        })
      })
      // #endif
      // #ifdef H5
      checkTips({}).then((res)=> {
          this.handleTipsResult(res);
          successFunc&&successFunc();
      })
      // #endif
    },
    handleTipsResult(res) {
      // if (res && res.flag == 1) {
          let _list = (res.list || []).filter(e=>{
            return e.isShow == 1 && ['index', 'button', 'kongKim', 'TSBK'].includes(e.showType);
          });
          _list.sort((a, b) => Number(a.tipsNumber) - Number(b.tipsNumber));

          _list = _list.map((e)=> {
            const _typeDic = {
              index: 'big',
              button: 'tabbar',
              kongKim: 'kongKim',
              TSBK: 'TSBK'
            }
            return {
              ...e,
              showTypeOld: e.showType,
              showType: _typeDic[e.showType],
              index: Number(e.showNumber),
              mask: true,
              tagId: 'mask' + this.bridgeSdk.generateUUID(),
              rect: {x: 0, y: 0, w: 0, h: 0},
              method: null,
              contentText: (e.tipsTitle && e.tipsTitle.length > 0 ? `<span style="color: #01BEB8; font-size: 28rpx; line-height: 36rpx; font-weight: bold;">${e.tipsTitle}</span><br/>` : '') + `${e.tipsContent}`
            }
          })

          this.maskPropsData.props.maskRectList.value = _list;
          if (_list.length > 0) {
            this.handleHomeData()
            this.openMask(2)
          }
        // }
    }
    // getHomeWeather() {
    //   getHomeWeather({"cityCode":"130600"}, {mask: false}).then(res=> {
    //     console.log("getHomeWeather({}).then(res=> {  ---------")
    //     console.dir(res);
    //     if (res) {
    //       this.weatherPropsData.props.weather.value = res.text || "";
    //       this.weatherPropsData.props.temperature.value = res.temp || "";
    //     } else {
    //       this.weatherPropsData.props.weather.value = "";
    //       this.weatherPropsData.props.temperature.value = "";
    //     }
    //     const baseStore = useBaseStore();
    //     baseStore.updateWeather({
    //       weather: this.weatherPropsData.props.weather.value,
    //       temperature: this.weatherPropsData.props.temperature
    //     });
    //   });
    // }
  },
  onShareAppMessage(res) {
    this.trackReport.trackCustom("分享微信-" + this.onShareAppMessageData.title);
    return this.bridgeSdk.onShareAppMessage(this.onShareAppMessageData);
  }
};

</script>

<style lang="scss" scoped>
.dot {
  background: #EE0032;
  position: absolute;
  top: -6rpx;
  right: -3rpx;
  font-weight: 500;
  font-size: 14rpx;
  height: 18rpx;
  border-radius: 9rpx;
  min-width: 18rpx;
  text-align: center;
  line-height: 18rpx;
  color: #FFFFFF;
}
.parentMode {
  position: fixed;
  bottom: 40%;
  right: 0;
  width: 50rpx;
  height: 140rpx;
  border-radius: 16rpx 0 0 16rpx;
  z-index: 999;
}

.main {
  background: #f5f5f5;
  position: relative;
  
}

.service-type {
  display: flex;
  align-items: center;
  width: 200rpx;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  color: #000;

  &-text {
    margin-right: 20rpx;
    position: relative;
    top: 2px;
    flex-shrink: 0;
    &::after {
      content: "";
      position: absolute;
      bottom: -12rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 8rpx;
      background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #00bcb9;
      border-radius: 4px;
      background: transparent;
    }

    &.serviceActive {
      font-weight: bolder;
      font-size: 32rpx;
      color: #000;

      &::after {
        background: #3ccdc8;
      }
    }
  }
}

.service-type-life {
  margin: 0 auto;
  width: 300rpx;
  color: #999;

  .serviceActive {
    font-weight: bolder;
    font-size: 32rpx;
    color: #333333 !important;
  }
}

.padding-left-5 {
  padding-left: 10rpx;
}

.home_main{
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #FEF1DE 0%, #FFF 30%, #FFF 100%);
  // background: linear-gradient(180deg, #FEF1DE 0%, rgba(255,245,232,0) 30%, rgba(255,245,232,0) 100%);
  position: relative;
  box-sizing: border-box;
  padding-bottom: 110rpx;
  overflow-y: auto;
}
.home_main_item{
  position: relative;
  width: 690rpx;
}
.home_main_bg{
  position: absolute;
  bottom: 0;
  right: 0;
  width: 616rpx;
  height: 478rpx;
  z-index: 0;
}

.hf-title-box{
  width: 704rpx;
  display: flex;
  align-items: center;
  // margin-top: 40rpx;
  margin-bottom: 16rpx;

  .hf-title-img{
    width: 6rpx;
    height: 29rpx;
    background: #FF6634;
    border-radius: 3rpx;
    margin-right: 16rpx;
  }
  .hf-title-text{
    color: #000;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style>
