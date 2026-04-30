<template>
  <vc-modal ref="modal"></vc-modal>
  <view class="main">
    <!-- 顶部背景和导航栏https://test.hihihi.com.cn/minio/hbdbucket/ce/icon-ceshi2.png-->
    <view
      class="top-arc-bg"
      :style="{
        paddingTop: '88rpx',
        background:
          'url(' +
          (articleDetail.mctPhotoUrls && articleDetail.mctPhotoUrls.length > 0 ? minioBaseUrl + articleDetail.mctPhotoUrls[0] : minioBaseUrl + 'hbdbucket/ce/icon-ceshi2.png') +
          ') no-repeat center center / cover',
      }"
    >
      <view class="top-bg-mask"></view>
      <view class="nav-bar">
        <vc-back
          :props-data="{
            props: { color: { value: '#fff' }, top: { value: '20px'  }
          }
          }"
        />
        <!-- :style="{ lineHeight: navigationBarInfo.navigationBarHeight + 'px' }" -->
        <view
          class="page-title"
          
          >详情</view
        >
      </view>
    </view>
    <view class="main-content">
        <!-- <image-slider :image-list="imgList" /> -->
         <image-slider :image-list="articleDetail.mctPhotoUrls" />
       <!-- <swiper v-if="articleDetail.mctPhotoUrls && articleDetail.mctPhotoUrls.length > 0" class="mct_image_box"
      indicator-dots="false" autoplay circular>
      <swiper-item v-for="(item, index) in articleDetail.mctPhotoUrls" :key="index">
        <view class="swiperItem">
          <image class="mct_image" :src="minioBaseUrl + item" mode="heightFix" />
        </view>
      </swiper-item>
    </swiper> -->
    <!-- 商家详细信息卡片 -->
    <view class="bottom-block">
      <!-- <view class="flex main-block flex_col">
        <view>
          <text class="fs32">{{ articleDetail.mctName }}</text>
          <image v-if="articleDetail.isSafeConsumption === '1'" :src="fxxflogoPng"
            style="width: 84rpx; height: 76rpx; position: absolute; right: 30rpx;" mode="widthFix" />
        </view>
      </view> -->
      <view class="scroll-box">

        <view class="scroll-info-title">
          <view class="scroll-info-title-text">{{ articleDetail.mctName }}</view>
        </view>
      <!-- 评价 甄选商家  -->
        <view class="scroll-info-pingjia">
          <view v-if="false" class="flex flex_ac">
            <image :src="`${minioBaseUrl}common/mctImages/icon-zhenxuan.png`"
              mode="scaleToFill" style="width: 172rpx;height: 32rpx;margin-right: 10rpx;" />
          </view>
          <!-- 星星评价逻辑 -->
          <view class="flex flex_ac" style="margin-right: 10rpx;">
            <image 
              v-for="star in stars" 
              :key="star"
              :src="star <= Math.floor(articleDetail.score || 5) ? `${minioBaseUrl}common/mctImages/icon-star.png` : `${minioBaseUrl}common/mctImages/icon-dark.png`"
              mode="scaleToFill" 
              style="width: 24rpx;height: 24rpx; margin-right: 4rpx;" 
            />
            <text style="font-size: 24rpx; color: #FF6634; margin-left: 8rpx;font-weight: 600;">{{ articleDetail.score || '5.0' }}</text>
          </view>
          <view v-if="articleDetail.commentCount" class="scroll-info-pingjia-open">
            {{ articleDetail.commentCount || '' }}条
          </view>
        </view>
        <view class="scroll-info-category" v-if="isAllDay">
          <view v-if=" isOpen" class="yingye">营业中</view>
          <view v-if=" !isOpen" class="xiuxi">休息中</view>
          <view class="scroll-info-category-open" v-if="articleDetail.mctTypeName">
            {{ articleDetail.mctTypeName }}
          </view>
          <view class="scroll-info-category-open">
            {{ articleDetail.businessHours }}
          </view>
        </view>

        <view class="scroll-info-category" v-else>
          <view v-if=" isOpen" class="yingye">营业中</view>
          <view v-if=" !isOpen" class="xiuxi">休息中</view>
          <view :class="`scroll-info-category-${isOpen ? 'open' : 'close'}`" v-if="articleDetail.mctTypeName">
            {{ articleDetail.mctTypeName }}
          </view>
          <view :class="`scroll-info-category-${isOpen ? 'open' : 'close'}`"
            v-for="(item, index) in (articleDetail.businessHours ? articleDetail.businessHours.split('|') : [])" :key="index">
            {{ item }}
          </view>
        </view>
    </view>
      <view class="flex main-block" style="border-bottom:none">
        <view class="flex flex_ac" style="padding-right:50rpx;line-height: 40rpx;">
          <text>{{ articleDetail.address }}</text>
        </view>
        <view class="flex flex_ac">
          <view class="flex flex_col" style="align-items: center;justify-content: center;margin-right: 28rpx;"
            @click=goLocation(articleDetail)>
            <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/location.png'"
              mode="scaleToFill" />
            <view style="font-weight: 400; font-size: 24rpx;color: #666;white-space: nowrap;">导航</view>
          </view>
          <view v-if="articleDetail.phone" @click="makePhoneCall(articleDetail.phone)" class="flex flex_col"
            style="align-items: center;justify-content: center;">
            <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'"
              mode="scaleToFill" />
            <view style="font-weight: 400; font-size: 24rpx;color: #666;white-space: nowrap;">电话</view>
          </view>
        </view>
      </view>
    </view>

    <!-- <div style="height: 10rpx; background: #F7F7F7;"></div> -->
    <!-- 商家资质box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.1); -->
     <!--  <view v-if="tabsList.length > 0" style="justify-content: space-around;padding:5rpx 00rpx 15rpx 50rpx;background:#F7F7F7;" class="flex "> -->
    <view v-if="tabsList.length > 0" style="justify-content: space-around;background:#F7F7F7;" class="flex ">
      <view style="width: 100%;"> 
        <u-tabs :scrollable="false" @click="handleClick" :list="tabsList" :keyName="'mctEntryName'" lineHeight="6.5" lineWidth="49"
          lineColor="#FF6634" :activeStyle="{
            color: '#FF6634',
            fontWeight: '600',
          }" :inactiveStyle="{
            color: '#000000',
            transform: 'scale(1)',
            fontWeight: '600'
          }" :current="current"></u-tabs>
        </view>
    </view>
     <view style="padding:10rpx 30rpx;border-radius: 30rpx;background-color: #fff;">
      <view style="margin-bottom: 20rpx; width: 690rpx;" v-if="sellSecuritiesList.length == 0 || current != '0'">
        <view class="story" v-if="story && mctEntryType == '3'">
          <image :src="staticBaseUrl + '/hbdimage/package-general-services/title.png'"
            style=" width: 164rpx;height: 52rpx;position: absolute;top: 0; left: 0;"></image>
          <image :src="staticBaseUrl + '/hbdimage/package-general-services/story.png'"
            style="width: 110rpx; height: 110rpx;position: absolute;top: 10rpx; right: 20rpx;z-index: -1;"></image>
          <view class="content">
            <text class="contentStory">{{ story }}</text>
          </view>
        </view>
      </view>
      <view v-if="sellSecuritiesList.length > 0 && current == '0'" class="productList">
        <view v-for="(item, index) in sellSecuritiesList" :key="index" class="productItem" @click="goDetail(item)">
              <image class="productImg" :src="minioBaseUrl + item.listPicUrl" mode="" />
              <view class="productInfo">
                  <view class="ellipsis" style="display:flex;align-items: center;">
                      <image
                      v-if="item.subPrice !=0"
                      :src="`${minioBaseUrl}common/mctImages/icon-ptbt.png`"
                      mode="scaleToFill"
                      style="width: 96rpx; height: 30rpx;margin-right:10rpx;"
                    ></image>
                     <text class="productName ellipsis"> {{ item.spuName }}</text>
                    </view>
                  <view class="mctName">{{ item.mctName }}</view>
                  <view class="productPrice">
                    <view class="productPriceItem red_col">
                        ￥<text class="salePrice">{{ (Number(item.price) - Number(item.subPrice || 0)).toFixed(2) }}</text>
                        <text class="orgPrice">￥{{ item.originalPrice }}</text>
                    </view>
                  </view>
              </view>
              <view class="buyBtn">去抢购</view>
          </view>
      </view>
      <view v-else-if="mctEntryInfoBOList.length > 0" class="z-blocks">
        <view v-for="(item, index) in mctShowInfoBOList" :key="index">
          <!-- <view class="flex" style="background-color:#fff;" v-if="nowEnrty.mctEntryType != '1'">
            <view
              style="border-radius: 4rpx;width: 8rpx;height: 25rpx;background-color: rgba(51, 51, 51, 1);margin: 4rpx 0 4rpx 0"
              class="flex_col"></view>
            <text style="font-size: 24rpx;margin-left:10rpx;">{{ item[0].mctEntryName ? item[0].mctEntryName :
              mctEntryName }}</text>
          </view> -->

          <!-- <view v-if="mctEntryInfoBOList.length > 0"> -->
          <!-- 券类型（领券） -->
          <template v-if="mctEntryInfoBOList.length > 0 && nowEnrty.mctEntryType == '1'">
            <view style="padding-bottom: 180rpx;">
              <scroll-view scroll-y style="height: 650rpx;">
                <view class="item" v-for="(item, index) in couponList" :key="index" @click="toPage(item)">
                  <!-- 展示 -->
                  <view class="item-left" style="display: flex;align-items: center;">
                    <image v-if="bridgeSdk.checkIsEmpty(item.photoUrl)" :src="minioBaseUrl + item.photoUrl"
                      style="width: 90rpx;height: 90rpx;border-radius: 5rpx;margin-right: 15rpx;" />
                    <image v-else :src="minioBaseUrl + '/common/mctCoupon/coupon.png'"
                      style="width: 90rpx;height: 90rpx;border-radius: 5rpx;margin-right: 15rpx;" />

                    <view style="flex: 1;">
                      <view style="color: #333;font-size: 30rpx;font-weight: bold;">{{ item.couponBaseName || '--' }}
                      </view>
                      <!-- 相对时间 -->
                      <view style="color: gray;font-size: 24rpx;" v-if="item.useTimeMode == '1'">自领取日起{{ item.useTimeout
                      }}天有效</view>
                      <!-- 时间区间 -->
                      <view style="color: gray;font-size: 24rpx;line-height: 30rpx;" v-if="item.useTimeMode == '2'">{{
                        dateFormat(new Date(item.useStartTime), 'yyyy-MM-dd') }} 至 {{ dateFormat(new
                          Date(item.useEndTime), 'yyyy-MM-dd') }} 可用</view>
                      <!-- 时间区间 -->
                      <!-- <view class="item-left_amt">¥{{ item.disAmt }}</view> -->
                    </view>
                  </view>
                  <!-- 抢购 -->
                  <view class="item-btn">领取</view>
                </view>
              </scroll-view>
            </view>
          </template>
        </view>
        <!-- 普通类型 -->
        <view v-if="mctEntryInfoBOList.length > 0 && nowEnrty.mctEntryType !== '1'">
          <view v-if="mctEntryInfoBOList.length > 0"
            style="box-sizing:border-box;margin: 0;padding: 0;line-height: 0; font-size: 0;width: 100%;">
          
            <view style="width: 100%;box-sizing:border-box;" v-for="(im, ix) in urls2" :key="ix">
              <image v-if="mctEntryName =='商家介绍'" :src="im" @click="previewImages(urls2, ix)" mode="widthFix"
                style="width: 100%;display: inline-block;vertical-align: bottom; " />
              <image v-else :src="im" @click="previewImages(urls2, ix)" mode="widthFix"
                style="width: 100%;display: inline-block;vertical-align: bottom; " />
            </view>
          </view>
        </view>
      </view>
      </view>

    <!-- 4.25良哥隐藏 -->
    <!-- <view class="jumpMallModal" @click="jumpMall">
      更多优惠
    </view> -->
    </view>
   
  </view>
  <vc-popup-pop @close="close" :props-data="popPropsData" />
</template>
<script>
import ImageSlider from "./swiperNum.vue";
import {
  getMctBusinessInfo, //商家详情接口
  getCpnTicketList, //商家优惠券列表接口
  userGetCoupon, //领取优惠券
  searchProducts,
  
  getVisitorCount, //获取访客数
} from '../api/baseServices';
import fxxflogoPng from "../static/fxxflogo.png"
import vcPopupPop from "@/components/library/base/vc-popup-pop/index.vue";
import vcBack from "@/components/library/base/vc-back/index.vue";
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";
export default {
  name: "merchantDetail",
  emits: ['close'],
  components: { vcPopupPop ,ImageSlider, vcBack},
  data() {
    return {
      allDay: '00:00-23:59',
      needOpenLocation: true,
      fxxflogoPng: fxxflogoPng,
      urls2: [],
      articleDetail: {},//信息
      current: '0',//当前标签页
      mctEntryInfoBOList: [],
      mctShowInfoBOList: [],
      mctEntryType: "",
      mctEntryName: '',
      latitude: "",//纬度
      longitude: "",//经度
      stars: [1, 2, 3, 4, 5], // 星星数量
      isAllDay: false,
      isOpen: false,

      payMctId: '',// 商户平台商户号
      
      payStoreId: '',// 商户平台门店号
      mctId: '',//放心消费商户号
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
      // 解决图片加载时闪一下的问题
      // 0 表示未渲染时，1 表示强制更新的时机
      mctEntryInfoBOArrRender: 1,
      nowEnrty: {},  //当前选择的tab页签
      couponList: [],//优惠券列表
      // entryMap: {
      //   '超值优惠': 9,
      //   '营业执照': 8,
      //   '资质证照': 8,
      //   '承诺书': 7,
      //   '消费提醒': 6
      // },//权重
      firstLoad: true,
      story: '',
      pointMallId: "",
      sellSecurities: [], // 是否有优惠券tabs
      sellSecuritiesList: [], // 优惠券tabs列表
    }
  },
  computed: {
    ...mapState(useBaseStore, {
      navigationBarInfo: "navigationBarInfo",
    }),
    tabsList() {
      let ret = []
      if(this.sellSecurities && this.sellSecurities.length > 0){
        this.sellSecurities.map(item => {
          ret.push({
            mctEntryName: item.mctEntryName,
          })
        })
      }
      if(this.mctEntryInfoBOList && this.mctEntryInfoBOList.length > 0){  
        this.mctEntryInfoBOList.map(item => {
          ret.push(item)
        })
      }
      // console.log(ret, 'tabsList')
      return ret
    },
  },
  onLoad(options) {
    console.log(options, 'options');
    this.options = options || {};

    this.init();
  },
  onShow() {
    if (this.firstLoad) {
      this.firstLoad = false
      return
    }
    this.getStatus();
    // 当配置超值优惠时才查询卡券信息
    if (this.mctEntryInfoBOList.some(e => e.mctEntryType == '1')) {
      this.getCouponList()//查询商家关联卡券信息
    }
  },
  methods: {
    // 初始化
    init() {
      const q = this.options.q || "";
      this.payMctId = this.options.payMctId;
      console.log(q, 'query.q');
      const scanQuery = decodeURIComponent(q) || "";
      console.log(scanQuery, 'scanQuery');
      // 扫商户码进入的场景
      // 旧版商家二维码使用的是：https://www.huibaoding.com/#/fxxfshop?id=1806656402207932418
      // 新版商家二维码计划使用的是：https://life.hihihi.com.cn/#/fxxfshop?id=1806656402207932418
      if (scanQuery.startsWith('https://life.hihihi.com.cn') || scanQuery.startsWith('https://life.hihihi.com.cn')) {
        let { query: { id } } = this.bridgeSdk.getUrlObj(scanQuery);
        console.log(id, 'id');
        this.mctId = id;
        this.common()
      }
      // 普通跳转进入方式
      else {
        this.mctId = this.options.mctId;
        this.payMctId = this.options.payMctId;
        this.common();
      }
    },
    async common() {
      await this.getInfo();
      // await this.getVisitorCount()
      // 当配置超值优惠时才查询卡券信息
      if (this.mctEntryInfoBOList.some(e => e.mctEntryType == '1')) {
        this.getCouponList()//查询商家关联卡券信息
      }
    },
    // 访问人数接口
    // async getVisitorCount() {
    //   console.log('this.mctId9999999', this.payMctId,)
    //   //查询商家关联卡券信息
    //   let res = await getVisitorCount({
    //     mctId: this.payMctId,
    //   })
    //   console.log('res', res)
    // },

    // 商家卡券列表

    getCouponList() {
      console.log('this.payMctId', this.payMctId, 'this.payStoreId', this.payStoreId)
      if (!this.payMctId || !this.payStoreId) {
        return;
      }
      //查询商家关联卡券信息
      getCpnTicketList({
        mctId: this.payMctId,
        shopsId: this.payStoreId
      }).then(res => {
        console.log(res, 'this.getCpnTicketList');//商家关联卡券信息
        this.couponList = res;
      })
    },
    async getInfo() {
      let res = await getMctBusinessInfo({
        mctId: this.mctId,
      })
      console.log(res, 'this.getInfo')
      this.articleDetail = res[0];
      this.story = res[0].story
      this.pointMallId = res[0].payMctId
      this.mctEntryInfoBOList = res[0].mctEntryInfoBOList.filter((ele) => ele.mctShowInfoBOList && ele.mctShowInfoBOList.length > 0).map(e => ({
        ...e,
        // _weight: this.entryMap[e.mctEntryName] || 0 // 添加权重
      }))

      // 查询商家优惠券
      this.getSellSecurities(this.articleDetail.payMctId)

      console.log("this.mctEntryInfoBOList", this.mctEntryInfoBOList);
      if (this.mctEntryInfoBOList.length > 0) {
        let urlList = this.mctEntryInfoBOList[0].mctShowInfoBOList
        this.mctEntryName = this.mctEntryInfoBOList[0].mctEntryName;
        // urlList.map(item => this.urls2.push(this.minioBaseUrl + item.mctEntryTypeUrl));
        //当前选择的tab页签
        this.nowEnrty = { ...this.mctEntryInfoBOList[0] }

        // let urlList = this.mctEntryInfoBOList[0].mctShowInfoBOList
        this.mctShowInfoBOList = this.mctEntryInfoBOList[0].mctShowInfoBOList;
        console.log('数据-------', urlList)
        this.mctEntryType = this.mctEntryInfoBOList[0].mctEntryType;
        this.mctEntryName = this.mctEntryInfoBOList[0].mctEntryName;
        // urlList.forEach(item => item.map(item => this.urls2.push(this.minioBaseUrl + item.mctEntryTypeUrl)))

        // urlList.map(item => this.urls2.push(this.minioBaseUrl + item.mctEntryTypeUrl));
        this.urls2 = []
        let urls21 = []
        this.mctShowInfoBOList.forEach(group => {
          if (group.length === 0) return;
          const entryType = group[0].mctEntryType;
          console.log(entryType, 'entryType')
          if(this.mctEntryName == '商家介绍'){
            
           if(entryType == '3-1'){
                // this.urls21 = []
                // let list = group.map(item => this.minioBaseUrl + item.mctEntryTypeUrl);
                // this.urls21 = this.urls21.concat(list)
              } else {
                this.urls2 = []
                group.forEach(item => {
                      if (item.mctEntryTypeUrl) {
                        const urls = item.mctEntryTypeUrl.split(',');
                        urls.forEach(url => {
                          this.urls2.push(this.minioBaseUrl + url);
                        });
                      }
                    });
                console.log(this.urls2, 'this.urls2[entryType]')
              }
          } else{
            
          if(entryType == '3-1'){
            // 不需要展示3-1营业执照
          }else{
            this.urls2 = []
            group.forEach(item => {
              if (item.mctEntryTypeUrl) {
                const urls = item.mctEntryTypeUrl.split(',');
                urls.forEach(url => {
                  this.urls2.push(this.minioBaseUrl + url);
                });
              }
            });
            console.log(this.urls2, 'this.urls2[entryType]')
          }
          }
        });

      }

      this.payMctId = res[0].payMctId
      this.payStoreId = res[0].payStoreId
      
      // 计算营业状态
      this.getStatus();
    },

    //卡券详情
    toPage(item) {
      this.bridgeSdk.jumpPage({
        url: `/package-general-services/merchants/couponDetail?couponBaseId=${item.couponBaseId}&displayId=${item.displayId}&mctId=${this.mctId}`
      });
    },

    // goDiscount () {
    //   this.discountModel = true;
    //   this.getPopList();
    // },

    //打电话
    makePhoneCall(l) {
      let list = l.split(",")
      console.log(l)
      console.log(list.length)
      if (list.length > 1) {
        console.log(list)
        this.popPropsData.props.content.value = list
        this.popPropsData.props.showPop.value = true;
      } else {
        this.bridgeSdk.makePhoneCall({
          title: this.articleDetail.mctName,
          phoneNumber: l
        })
      }
    },

    //tab切换
    handleClick(e) {
      console.log(e, 'e');
      this.mctEntryInfoBOArrRender = 0;
      setTimeout(() => {
        this.mctEntryInfoBOArrRender = 1;
      }, 10);
      this.current = e.index;
      this.mctEntryName = e.mctEntryName;
      this.urls2 = [];//清空前置数据 
      if(e.mctEntryId == "sellSecurities"){
        this.mctShowInfoBOList = []
        this.mctEntryType = ""
        this.mctEntryName = "超值优惠"
        this.urls2 = []
        this.nowEnrty = {}
      } else{
        let index = this.mctEntryInfoBOList.findIndex(item => item.mctEntryId == e.mctEntryId)

        this.mctShowInfoBOList = this.mctEntryInfoBOList[index].mctShowInfoBOList
        this.mctEntryType = this.mctEntryInfoBOList[index].mctEntryType;
        this.mctShowInfoBOList.forEach(group => {
          if (group.length === 0) return;
          console.log(group, 'group')
          const entryType = group[0].mctEntryType;
          console.log(entryType, 'entryType')
          if(e.mctEntryName == '商家介绍'){
              
              if(entryType == '3-1'){
                // this.urls21 = []
                // let list = group.map(item => this.minioBaseUrl + item.mctEntryTypeUrl);
                // this.urls21 = this.urls21.concat(list)
              } else {
                this.urls2 = []
                group.forEach(item => {
                      if (item.mctEntryTypeUrl) {
                        const urls = item.mctEntryTypeUrl.split(',');
                        urls.forEach(url => {
                          this.urls2.push(this.minioBaseUrl + url);
                        });
                      }
                    });
                console.log(this.urls2, 'this.urls2[entryType]')
              }
              //  this.urls2 = []
              //   group.forEach(item => {
              //     if (item.mctEntryTypeUrl) {
              //       const urls = item.mctEntryTypeUrl.split(',');
              //       urls.forEach(url => {
              //         this.urls2.push(this.minioBaseUrl + url);
              //       });
              //     }
              //   });
              //   this.urls2.unshift(this.urls21)
          } else{
            
          if(entryType == '3-1'){
            this.urls2 = []
            let list = group.map(item => this.minioBaseUrl + item.mctEntryTypeUrl);
            this.urls2 = this.urls2.concat(list)
          }else{
            this.urls2 = []
            group.forEach(item => {
              if (item.mctEntryTypeUrl) {
                const urls = item.mctEntryTypeUrl.split(',');
                urls.forEach(url => {
                  this.urls2.push(this.minioBaseUrl + url);
                });
              }
            });
            console.log(this.urls2, 'this.urls2[entryType]')
          }
          }


          // this.urls2[entryType] = group.map(item => this.minioBaseUrl + item.mctEntryTypeUrl);
        });
  
        //当前选择的tab页签
        this.nowEnrty = { ...e }
      }


    },
    //导航
    goLocation(item) {
      this.bridgeSdk.getLocation(res => {
        this.needOpenLocation = res.locationFail === true;
        this.longitude = Number(res.lng);
        this.latitude = Number(res.lat);
        // if (this.needOpenLocation) {
        //   return
        // }
        console.log("这是导航", item);
        let s = `${Number(this.longitude)},${Number(this.latitude)}`;
        let e = `${Number(item.longitude)},${Number(item.latitude)}`;
        console.log("开始坐标：", s, "终点坐标：", e);
        // 调用sdk 
        this.bridgeSdk.routePlan(s, e, item.mctName, item.address);
      });
    },

    //维权
    toMini(appid) {
      // * @param parma.miniAppGhId app打开微信小程序，微信小程序的原始id，如：gh_123456789abcdef
    },
    // 计算营业状态
    getStatus() {
      console.log("getStatus")
      this.isAllDay = this.articleDetail.businessHours && this.articleDetail.businessHours == "00:00-23:59";
      let isOpen = false;
      if (this.isAllDay) {
        isOpen = true;
      } else if (this.articleDetail.businessHours) {
        // let businessHours = this.articleDetail.businessHours.split("|");
        // for (let i = 0; i < businessHours.length; i++) {
        //   let businessHour = businessHours[i].split("-");
        //   let start = businessHour[0].split(":")[0] + businessHour[0].split(":")[1]
        //   let end = businessHour[1].split(":")[0] + businessHour[1].split(":")[1]
        //   let now = new Date();
        //   let nowTime = (now.getHours() > 10 ? now.getHours() : "0" + now.getHours()) + ":" + (now.getMinutes() > 10 ? now.getMinutes() : "0" + now.getMinutes());
        //   console.log("businessHours", start, end, nowTime)
        //   if (start < end) {
        //     if (start < nowTime &&  nowTime < end) {
        //       isOpen = true;
        //       break;
        //     }
        //   } else {
        //     if (nowTime < end || nowTime > start) {
        //       isOpen = true;
        //       break;
        //     }
        //   }
        // }
        try {
          let businessHours = this.articleDetail.businessHours.split("|");
          let now = new Date();
          let nowHours = now.getHours();
          let nowMinutes = now.getMinutes();
          let nowTotalMinutes = nowHours * 60 + nowMinutes;

          for (let i = 0; i < businessHours.length; i++) {
            let businessHour = businessHours[i].split("-");
            if (businessHour.length === 2) {
              let [startHour, startMinute] = businessHour[0]
                .split(":")
                .map(Number);
              let [endHour, endMinute] = businessHour[1].split(":").map(Number);

              if (
                !isNaN(startHour) &&
                !isNaN(startMinute) &&
                !isNaN(endHour) &&
                !isNaN(endMinute)
              ) {
                let startTotalMinutes = startHour * 60 + startMinute;
                let endTotalMinutes = endHour * 60 + endMinute;

                if (startTotalMinutes < endTotalMinutes) {
                  // 当日营业
                  if (
                    nowTotalMinutes >= startTotalMinutes &&
                    nowTotalMinutes <= endTotalMinutes
                  ) {
                    isOpen = true;
                    break;
                  }
                } else {
                  // 跨天营业
                  if (
                    nowTotalMinutes >= startTotalMinutes ||
                    nowTotalMinutes <= endTotalMinutes
                  ) {
                    isOpen = true;
                    break;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("解析营业时间失败:", error);
        }
      }
      this.isOpen = isOpen;
    },
    // 维权
    toMini(appid) {
      // * @param parma.miniAppGhId app打开微信小程序，微信小程序的原始id，如：gh_123456789abcdef
      // * @param parma.miniAPPID 微信小程序打开第三方小程序，第三方小程序的appid，如：wx1234567890
      this.bridgeSdk.jumpPage({
        title: '我要维权' + `-${this.articleDetail.mctName}`,
        miniAppGhId: appid,
        miniAPPID: 'wxfc0908e9abf20cf8'
      });
    },
    close() {
      this.popPropsData.props.showPop.value = false;
    },

    //日期格式化
    dateFormat(date, dformat) {
      let format
      if (dformat != undefined && dformat != null) {
        format = dformat
      } else {
        format = 'yyyy-MM-dd hh:mm:ss'
      }
      if (date !== 'Invalid Date') {
        var o = {
          'M+': date.getMonth() + 1, // month
          'd+': date.getDate(), // day
          'h+': date.getHours(), // hour
          'm+': date.getMinutes(), // minute
          's+': date.getSeconds(), // second
          'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
          'S': date.getMilliseconds() // millisecond
        }
        if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1,
              RegExp.$1.length === 1 ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length))
          }
        }
        return format
      }
      return ''
    },
    previewImages(list, index) {
      console.log(list)
      uni.previewImage({
        current: index,
        urls: list
      })
    },
    jumpMall(){
      this.bridgeSdk.jumpPage({
        url: "/package-intergral-mall/sellSecurities/sellSecurities?id=" + this.pointMallId,
        openType: "reLaunch"
      })
    },
    getSellSecurities(mctId){
      searchProducts({
        page: 1,
        size: 100,
        data: {
          mctId: mctId,
          payType: "CASH"
        },
        ruleSortingList:[{ ruleSortingList: "sortOrderMct", order: "desc" }]
      }).then(res => {
        if(res&&res.total>0){
          this.sellSecurities = [{
            mctEntryName: '超值优惠',
            mctEntryId: "sellSecurities"
          }]
          this.sellSecuritiesList = res.data
          this.mctShowInfoBOList = []
          this.mctEntryType = ""
          this.mctEntryName = "超值优惠"
          this.urls2 = []
          this.nowEnrty = {}
        }
      })
    },
    // 跳转商品详情
    goDetail(e) {
        this.bridgeSdk.jumpPage({
            title: `${e.title}`,
            url: '/package-intergral-mall/productDetail/productDetail?spuId=' + e.spuId,
            needLogin: true,
        })
    }
  }
  }
</script>

<style lang="scss" scoped>
.main-content{
  position: relative;
  z-index: 2;
  top: 190rpx;
}
.top-arc-bg{
    
  position: absolute;
  width: 100%;
  height: 433rpx;
  background-size: 100% 100%;
  z-index: 1;
}
.top-bg-mask{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10rpx);
  -webkit-backdrop-filter: blur(10rpx);
  z-index: 2;
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
  padding-bottom: 20rpx;
}
.page-title {
  font-weight: 400;
  font-size: 32rpx;
  color: #fff;
  text-align: center;
  line-height: 65px;
}
.nav-bar .vc-back {
  position: absolute;
  left: 20rpx;
  top: 10px;
}
.main {
 
  position: relative;
  background: #F7F7F7;
  
  height: 100vh;

  // .mct_image_box {
  //   width: 750rpx;
  //   height: 360rpx;
  // }

  .swiperItem {
    // width: 750rpx;
    height: 360rpx;
    background: #fff;
    overflow: hidden;
    text-align: center;
  }

  .mct_image {
    margin: auto;
    height: 360rpx;
    font-size: 0;
  }

  .bottom-block {
    background: #FFFFFF;
    border-radius: 30rpx;
    padding: 30rpx 30rpx 15rpx 30rpx;
    line-height: 40rpx;

    .main-block {
      padding: 15rpx 0;
      justify-content: space-between;
      font-size: 26rpx;
      border-bottom: 3rpx solid #E5E5E5;
      view {
        text {
          font-weight: 400;
          font-size: 24rpx;
          color: #666666;
          line-height: 24rpx;
          text-align: left;
        }
      }
    }

    .main-block:last-child {
      padding-top: 15rpx;
      padding-bottom: 0;
    }

    .scroll-box {
      width: 100%;
      border-bottom: 3rpx solid #E5E5E5;
      padding-bottom: 35rpx;
      .scroll-info-title {
        display: flex;
        align-items: flex-start;

        .scroll-info-title-text {
          font-weight: 500;
          font-size: 30rpx;
          color: #000000;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 36rpx;
        }
      }

      .scroll-info-category {
        display: flex;
        font-size: 18rpx;
        color: #FF8715;
        flex-wrap: wrap;
        margin-top: 8rpx;
        min-height: 30rpx;
        width: 100%;
        align-items: center;

        .scroll-info-category-open {
          margin-right: 5rpx;
          display: flex;
          align-items: center;
          background: #fff;
          color: #333;
          line-height: 16rpx;
          margin-top: 8rpx;
          font-weight: 400;
          font-size: 24rpx;
          border-radius: 5rpx;
          margin-right: 10rpx;
          padding: 6rpx 0rpx 6rpx 12rpx;
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 24rpx;
          line-height: 24rpx;
          margin-top: 8rpx;
        }

        .scroll-info-category-close {
          margin-right: 10rpx;
          padding: 6rpx 0rpx 6rpx 12rpx;
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 24rpx;
          color: #333333;
          line-height: 24rpx;
          margin-top: 8rpx;

        }
      }
    }
  }

  .scroll-info-pingjia{
    margin-top: 8rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    .image{
      width: 172rpx;
      height: 32rpx;
    }
    .scroll-info-pingjia-open{
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      line-height: 24rpx
    }
  }

  .yingye{
    width: 80rpx;
    height: 32rpx;
    background: #FFEDDF;
    border-radius: 5rpx;
    color: #9A6A4C;
    line-height: 32rpx;
    text-align: center;
    margin-top: 8rpx;
    padding: 2rpx 3rpx;
     font-size: 22rpx;
  }
  .xiuxi{
    width: 80rpx;
    height: 32rpx;
    background: #EBEBEB;
    border-radius: 5rpx;
    color: #999999;
    line-height: 32rpx;
    text-align: center;
    margin-top: 8rpx;
    padding: 2rpx 3rpx;
    font-size: 22rpx;
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
  }

  .z-blocks {
    background-color: #fff;

    .item {
      width: 620rpx;
      margin: 20rpx auto;
      border-radius: 10rpx;
      background: radial-gradient(circle at 70% top, transparent 15rpx, rgba(255, 168, 0, 0.1) 0) center top / 100% 70% no-repeat,
        radial-gradient(circle at 70% bottom, transparent 15rpx, rgba(255, 168, 0, 0.1) 0) center bottom / 100% 30% no-repeat;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 30rpx 20rpx;

      &-left {
        line-height: 45rpx;
        max-width: 70%;

        &_amt {
          color: #00BCB8;
          font-size: 28rpx;

          &::first-letter {
            font-size: 20rpx;
            margin-right: 5rpx;
          }
        }
      }

      &-btn {
        font-size: 24rpx;
        color: white;
        width: 130rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 40rpx;
        text-align: center;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
      }
    }
  }

  .btn-block-mini {
    z-index: 2;
    width: 92%;
    margin: auto;
    position: fixed;
    left: 4%;
    bottom: 80rpx;
    background: #ffffff;
    border-radius: 45rpx;
    border: 1rpx solid #979797;
    line-height: 84rpx;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 30rpx;
    color: #17181a;
    justify-content: center;
  }

  .pop-title {
    margin-top: 20rpx;
    line-height: 80rpx;
    justify-content: center;
    text-align: center;
    width: 100%;
    font-weight: bold;
    font-size: 38rpx;
    color: #323232;
    line-height: 53rpx;
  }

  .card-list {
    padding: 30rpx;

    .card-item {
      width: 100%;
      display: flex;
      margin-bottom: 30rpx;

      .card-item-left {
        padding: 10rpx 0;
        border-radius: 20rpx 0 0 20rpx;
        display: flex;
        width: 25%;
        background-color: #fff3f3;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .card-item-left-top {
          font-size: 27rpx;
          color: #ff1e00;

          text {
            font-size: 50rpx;
            font-weight: bold;
          }
        }

        .card-item-left-bottom {
          text {
            color: #ff1e00;
            border-radius: 6rpx 6rpx 6rpx 6rpx;
            border: 1rpx solid #ff1e00;
            font-weight: bold;
            font-size: 27rpx;
            padding: 4rpx 12rpx;
          }
        }
      }

      .card-item-right {
        padding: 20rpx 0;
        border-radius: 0 20rpx 20rpx 0;
        width: 75%;
        background-color: #fff;
        font-size: 20rpx;
      }
    }
  }

  .lineH40 {
    line-height: 40rpx;

    text {
      margin-left: 10rpx;
    }
  }

  .icon-image {
    height: 80rpx;
    width: 80rpx;
    position: absolute;
    right: 0;
    top: -20rpx;
  }

  .icon-img {
    height: 42rpx;
    width: 42rpx;
    // position: absolute;
    // right: 0;
    // top: -20rpx;
  }

.story {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 20rpx auto 0;
  background: #FFF7F2;
  border-radius: 20rpx;
  border: 2rpx solid #D9B386;
  // border-image: linear-gradient(180deg, rgba(238, 218, 187, 1), rgba(217, 179, 134, 1)) 2 2;
}

.titleLeft {
  width: 164rpx;
  height: 52rpx;
}

.titleRight {
  width: 110rpx;
  height: 110rpx;
}

.content {
  width: 90%;
  margin: 65rpx auto 25rpx;
}

.contentStory {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #945A15;
  text-align: left;
  font-style: normal;
}
.jumpMallModal{
  position: fixed;
  bottom: 120rpx;
  right: 0;
  z-index: 10;
  padding: 30rpx 24rpx;
  width: 30rpx;
  border-radius: 10rpx 0 0 10rpx;
  background: #FE7D20;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  text-align: center;
}

.productList {
    border-radius: 30rpx;
    background-color: #fff;
    .productItem {
        display: flex;
        padding-bottom: 20rpx;
        justify-content: space-between;
        align-items: flex-start;
        box-sizing: border-box;
        padding-top: 20rpx;
        .productImg {
            height: 120rpx;
            width: 120rpx;
            margin-right: 20rpx;
            flex-shrink: 0;
            border-radius: 8rpx;
        }

        .productInfo {
          flex-grow: 1;
          width: 50%;
          position: relative;
            .productName {
              width: 90%;
                font-weight: 500;
                font-size: 30rpx;
                color: #000000;
                 -webkit-box-orient: vertical;
                -webkit-line-clamp: 1; //显示几行
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mctName {
                font-weight: 400;
                font-size: 24rpx;
                color: #666666;
                margin-top: 10rpx;
            }
            .productPrice {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .productPriceItem {
                  font-size: 24rpx;
                  color: #333333;
                  font-weight: 700;
                  margin-right: 20rpx;
                  vertical-align: bottom;
                  color: #ff5a5a;
                font-weight: 600;
              }
              .salePrice {
                 font-weight: 600;
                  font-size: 30rpx;
                  color: #FF6634;
                  margin-right: 10rpx;
              }
              .orgPrice {
                  font-weight: 400;
                  font-size: 24rpx;
                  color: #999999;
                  text-decoration: line-through;
              } 
            }
            
            &::after {
              content: '';
              position: absolute;
              bottom: -20rpx;
              left: 0;
              width: 130%;
              height: 3rpx;
              background-color: #E5E5E5;
            }
        }
        .buyBtn {
              width: 112rpx;
              height: 50rpx;
              background: linear-gradient( 90deg, #FE7D20 0%, #FF5210 100%);
              border-radius: 25rpx;
              font-weight: 400;
              font-size: 24rpx;
              color: #FFFFFF;
              line-height: 24rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 35rpx;
              margin-right: 20rpx;
            }

        &:last-child .productInfo::after {
            display: none;
        }
      
       
      
    }
    
  }
   ::v-deep .u-tabs__wrapper__nav {
    .u-tabs__wrapper__nav__item{
      //padding:10rpx 50rpx;
      .u-tabs__wrapper__nav__item__text {
      }
    }
    .u-tabs__wrapper__nav__line {
      width: 98rpx !important;
      height: 13rpx !important;
      background: #FF6634;
      opacity: 0.2;
      border-radius: 0;
      bottom: 20rpx;
    }
  }

</style>