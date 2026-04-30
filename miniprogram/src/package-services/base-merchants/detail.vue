<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="main" :props-data="propsData">
    <view class="top-bg2" style="z-index: 0; background-color: #fff;"></view>
    <view style="position: relative;">
          <!-- banner 定制样式+点击预览大图组件统一处理 -->
          <view style="background: #f5f5f5;">
            <vc-banner :props-data="bannerData" @toPage="toPreview"></vc-banner>
          </view>
          <!-- 商家详细信息卡片 -->
          <view class="bottom-block" style=" background-color: white;">
            <view class="flex main-block flex_col">
              <view>
                <text class="fs32 ellipsis-line2">{{ articleDetail.mctName }}</text>
              </view>
              <view class="scroll-item-card" v-if="articleDetail.labelName">
                <!-- 标签 -->
                <text v-for="item in articleDetail.labelName.split(',')" :key="item">{{ item }}</text>
                
              </view>
              <view>
                <view class="flex flex_ac flex_sb" style="line-height:60rpx;">
                  <view class="bold" style="font-size: 28rpx;color:#10C2B7">{{ (articleDetail.timeName || "") + " "  }}</view>
                  <view style="margin-left: 10rpx;font-size:26rpx;color:#333; flex:1;position: relative;" @click="viewModal">
                    &nbsp;
                    <view style="display: block; position: absolute; top: 0; left: 0; width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                      {{  articleDetail.timeValue }}
                    </view>
                  </view>
                  <u-icon name="arrow-right" :size="14" @click="viewModal"></u-icon>
                </view>
              </view>
            </view>
            <view class="flex main-block" style="border-bottom:none">
              <view class="flex flex_ac" style="padding-right:50rpx;">
                <text>{{ articleDetail.address }}</text>
              </view>
              <view class="flex">
                <view class="flex flex_col" style="align-items: center;justify-content: center;margin-right: 20rpx;"
                  @click=goLocation(articleDetail)>
                  <!-- <u-icon name="car" size="28"></u-icon> -->
                  <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/location.png'"
                        mode="scaleToFill" />
                  <view style="font-size: 24rpx;color: #333333;">导航</view>
                </view>
                <view @click.stop="phoneClick" class="flex flex_col" style="align-items: center;justify-content: center;">
                  <!-- <u-icon name="phone" size="28"></u-icon> -->
                  <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'"
                        mode="scaleToFill" />
                  <view style="font-size: 24rpx;color: #333333;">电话</view>
                </view>
              </view>
            </view>

          </view>

          <div style="height: 10rpx; background: #F0F0F4;"></div>
          <!-- 商家资质box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.1); -->
          <view v-if="mctEntryInfoBOList.length > 0" style="padding:0 15rpx 15rpx;background:#fff;margin-top:15rpx;">
            <u-tabs @click="handleClick" :list="mctEntryInfoBOList" :keyName="'mctEntryName'" lineWidth="30"
              lineColor="linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%)" :activeStyle="{
                color: '#00BCB8',
                fontWeight: 'bold',
              }" :inactiveStyle="{
                color: '#333333',
                transform: 'scale(1)'
              }" :current="current"></u-tabs>
            <!-- </u-sticky> -->
          </view>
          <view v-if="mctEntryInfoBOList.length > 0" class="z-blocks">
            <view class="flex" style="background-color:#fff;">
              <view
                style="border-radius: 4rpx;width: 8rpx;height: 25rpx;background-color: rgba(51, 51, 51, 1);margin: 4rpx 0 4rpx 0"
                class="flex_col"></view>
              <text style="font-size: 24rpx;margin-left:10rpx;">{{ mctEntryName }}</text>
            </view>
            <view style="padding:10rpx 0;" v-if="mctEntryInfoBOList.length > 0">
              <!-- keyName -->
              <u-album singleMode="scaleToFill" :singleSize="240" :urls="urls2" :previewFullImage="enablePreview"></u-album>
            </view>
          </view>
          
          <!-- 菜单tabbar -->
          <view class="tabbar-box">
            <tabbar :list="tabbarList" @change="tabbarChange"></tabbar>
          </view>
          <!-- 优惠套餐 discountPackages -->
          <!-- <view v-if="activeIndex == 0" class="discountPackages">
            <vc-empty v-if="discountPackages.length == 0"></vc-empty>
            <view v-if="discountPackages.length > 0" class=" flex flex_ac flex_col">
              <discountPackageItem v-for="(item, index) in discountPackages" :key="index" :info="item"></discountPackageItem>
            </view>
          </view> -->
          <!-- 机构简介 agencyProfile -->
          <!-- <view v-if="activeIndex == 1" class="agencyProfile flex flex_ac flex_col">
            <view v-html="agencyProfile"></view>
          </view> -->
          <!-- 由于数据是从一个list获取 所以需要修改数据从对象中获取 -->
            <view class="scroll-box" style="position: relative; z-index: 2;">
              <vc-empty v-if="entryListObj[mctEntryId] && entryListObj[mctEntryId].length == 0"></vc-empty>
              <view v-else>
              <vc-filter v-show="typeId == '1'"
                ref="filterRef"
                :startType="startType"
                :otherConfig="otherConfig"
                @resetClick="resetClick"
                @completeClick="completeClick"
              ></vc-filter>
                <view v-if="typeId == '1'" class="discountPackages flex flex_ac flex_col">
                  <view v-for="(item, index) in entryListObj[mctEntryId]" :key="index"  @click="toPage(item)">
                    <discountPackageItem :info="item"></discountPackageItem>
                  </view>
                </view>
                <view v-if="typeId == '2'">
                  <view v-for="(item, index) in entryListObj[mctEntryId]" :key="index" class="richItem">
                    <view>
                      <rich-text class="rich-text-box" :nodes="bridgeSdk.addMinioPrefixToImgSrc(item.content)"></rich-text>
                    </view>
                  </view>
                </view>
              </view>
              <vc-safe-bottom />

            </view>
    </view>


    <!-- 电话以及营业时间弹框 -->
    <vc-popup-pop @close="close" :props-data="popPropsData" />

  </vc-container>
</template>
<script>
import vcPopupPop from "@/components/library/base/vc-popup-pop/index.vue";
import { getMctProDetailList, selFilterCategoryById, selBusCodeAndDisCode } from '../api/base-services';//商家详情接口
import vcBanner from "@/components/library/base/vc-banner/index.vue";//banner
import tabbar from "../components/tabbar.vue";
import discountPackageItem from "../components/discountPackageItem.vue";
import vcFilter from '@/components/library/base/vc-filter/index';
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";

export default {
  emits: ['close'],
  name: "merchantDetail",
  components: {
    vcBanner,
    vcPopupPop,
    tabbar,
    discountPackageItem,
    vcFilter
  },
  data() {
    return {
      needOpenLocation: true,
      propsData: {
        props: {
          title: {
            value: '详情'
          },
        }
      },
      popPropsData: {
        props: {
          show: {
            label: "类型",
            value: 'showTime',// showPhone 电话
          },
          showPop: {
            label: "显示状态",
            value: false,
          },
          content: {
            label: "显示内容",
            value: [],
          },
          list: {
            label: "显示状态",
            value: [],
          },
          color:{
            label: "颜色",
            value: "#01bfb8",
          },
          size:{
            label: "字体大小",
            value: "32rpx",
          }
        }
      },
      enablePreview: true,
      bannerData: {
        props: {
          list: {
            value: []
          },
          height: {
            value: 360
          },
          type: {
            value: 'indicator'
          },
          borderRadius: {
            value: 'border-radius'
          },
          preview: {
            value: true
          }
        }
      },
      albumWidth: 0,
      urls2: [],
      articleDetail: {},//信息
      current: '0',//当前标签页
      mctEntryInfoBOList: [],
      mctEntryName: '',
      latitude: "",//纬度
      longitude: "",//经度
      show: false,
      showPhone: false,

      // 下半部分tabbar数据
      tabbarList: [
        // {
        //   name: '优惠套餐',
        //   id: '0',
        // },
        // {
        //   name: '机构简介',
        //   id: '1',
        // },
      ],
      // 优惠套餐数据
      discountPackages: [],
      // 机构简介
      agencyProfile: "",
      activeIndex: 0,
      entryListObj: {},
      mctEntryId: '',
      typeId: '',

      // 筛选条件入参
      filterOptionsId: "",
      // 筛选配置
      startType: [
      {
					type: 'other',
					id: 'M4_1'
				},
				{
					type: 'other',
					id: 'M4_2'
				}
			],
      otherConfig: [
				{
					value: 'M4_1',
					id: 'M4_1',
					// title: '套餐类型',
					// type: 'checkox', // 多选
					// key: 'checkoxM4', // 返回参数名
					options: []
				},
				{
					value: 'M4_2',
					id: 'M4_2',
					// title: '适用人群',
					// type: 'radio', // 单选
					// key: 'radioM4', // 返回参数名
					options: []
				}
			]
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
      return "calc(100vh - " + val + "px - 928rpx)";
    },
  },
  async onLoad(options) {
    // #ifdef H5
    // this.enablePreview = false;
    // #endif
    // await this.firstInit();  
    this.mctId = options.mctId;
    this.propsData.props.title.value = options.title;
    this.initFilter()
    this.getList();
  },
  methods: {
    close() {
      this.popPropsData.props.showPop.value = false;
    },
    closePhone() {
      this.showPhone = false
    },
    viewModal() {//查看营业时间
      this.popPropsData.props.show.value = 'showTime';//
      this.popPropsData.props.content.value = this.articleDetail.timeName + this.articleDetail.timeValue
      this.popPropsData.props.showPop.value = true;
    },
    phoneClick() {//电话
      console.log("phone ", this.articleDetail.phone.split(","));
      this.popPropsData.props.show.value = 'showPhone';//
      this.popPropsData.props.content.value = this.articleDetail.phone.split(",").map(phoneNumber=>({title: this.articleDetail.mctName, phoneNumber: phoneNumber}));
      this.popPropsData.props.showPop.value = true;
    },
    // 预览模式 
    toPreview(){
      uni.previewImage({
        // 预览时，默认显示图片的索引
        current: this.bannerData.props.list.value.length,
        // 所有图片 url 地址的数组
        urls: this.bannerData.props.list.value.map(x => x.imgurl)
      })
    },
    toPage(info) {
      console.log(info)
      this.bridgeSdk.jumpPage({
        url: '/package-services/base-merchants/packageDetail?id=' + info.packageId + '&title=' + this.propsData.props.title.value + '&phone=' + this.articleDetail.phone, // 目标页面的路径  
      })
    },

    getList() {
      let params = {
        mctId: this.mctId,
        filterOptionsId: this.filterOptionsId
      }
      console.log(params)
      getMctProDetailList(params).then(res => {
        console.log("getMctProDetailList",res)
        this.bannerData.props.list.value = res.mctProDetailBannerList.map(item=> {
          item.imgurl = this.minioBaseUrl + item.photoUrl;
          return item
        });
        this.articleDetail = res.mctProResp;
        // this.mctEntryInfoBOList = res.mctEntryInfoBOList;
        this.discountPackages =  []
        this.agencyProfile = []
        this.entryListObj = {}
        this.tabbarList = []
        if(res.entryList && res.entryList.length > 0){
          res.entryList.forEach((item,index)=> {
            if(index == 0){
              this.mctEntryId = item.mctEntryId;
              this.typeId = item.typeId;
            }
            this.entryListObj[item.mctEntryId] = item.detailList
            this.tabbarList.push({
              name: item.mctEntryName,
              id: item.mctEntryId,
              typeId: item.typeId,
            })
          })
        }
        
        // if (this.mctEntryInfoBOList.length > 0) {
        //   let urlList = this.mctEntryInfoBOList[0].mctShowInfoBOList
        //   this.mctEntryName = this.mctEntryInfoBOList[0].mctEntryName;
        //   urlList.map(item => this.urls2.push(this.minioBaseUrl + item.mctEntryTypeUrl));
        // }
      })
    },

    makePhoneCall() {
      this.bridgeSdk.jumpPage({
        url: `tel://${item}`
      })
    },
    handleClick(e) {
      this.current = e.index;
      this.mctEntryName = e.mctEntryName;
      this.urls2 = [];//清空前置数据 
      let urlList = this.mctEntryInfoBOList[e.index].mctShowInfoBOList;
      urlList.map(item => this.urls2.push(this.minioBaseUrl + item.mctEntryTypeUrl));
    },
    goLocation(item) {
      console.log("这是导航", item);

      this.bridgeSdk.getLocation(res=> {
        this.needOpenLocation = res.locationFail === true;
        this.bridgeSdk.routePlan(res.lng + "," + res.lat, item.longitude+ ","+ item.latitude, item.mctName, item.address);
      }, "showModal")

    },
    // 
    tabbarChange(i,e){
      console.log(i,e)
      this.activeIndex = i;
      this.mctEntryId = e.id;
      this.typeId = e.typeId;
    },

    // 初始化筛选配置
    initFilter() {
      // 筛选条件
      selFilterCategoryById({id: this.mctId}).then(res => {
				console.log("selFilterCategoryById", res)
        this.otherConfig = res.map((item,index) => {
          return {
            value: item.key,
            id: "M4_" + (index+1),
            title: item.title,
            type: item.type,
            key: item.key,
            options: item.list
          }
        })
        this.$refs.filterRef.setM4(this.otherConfig)
      })


    },
		// 滚动菜单：重置按钮事件
		resetClick(e) {
			console.log("resetClick",e);
      // if(e.type == "nearby"){
      //   this.districtCode = ""
      //   this.bussinessCode = ""
      // }
      // if(e.type == "select"){
      //   this.filterOptionsId = ""
      // }
		},
		// 滚动菜单：确认按钮事件
		completeClick(e) {
			console.log("completeClick",e); // 参数说明: 根据定义key值返回

      if(e.type == "other"){
        console.log("other",e)
        let val = "";
        this.otherConfig.forEach(item => {
          if(e[item.key]){
            if(item.type == "1"){
              val += e[item.key].join(",") + ","
            }
          }
        })
        this.filterOptionsId = val.slice(0,-1)
        this.getList();
      }
		},
  }

}
</script>

<style lang="scss" scoped>
.main {
  // background: #fff;

  // height: 100vh;

  .icon-img {
    height: 50rpx;
    width: 50rpx;
  }

  image {
    width: 100%;
    height: 360rpx;
    font-size: 0;
  }

  .bottom-block {
    padding: 30rpx;
    padding-top: 20rpx;
    line-height: 40rpx;

    .main-block {
      padding: 15rpx 0;
      justify-content: space-between;
      font-size: 26rpx;
      border-bottom: 1rpx solid #D8D8D8;

      view {
        text {
          font-size: 28rpx;
          color: #333;
          line-height: 45rpx;
          font-weight: bold;
        }
      }

      .scroll-item-card {

        text {
          line-height: 50rpx;
          background: rgba(0, 189, 184, 0.1);
          border-radius: 6rpx;
          font-weight: 400;
          font-size: 20rpx;
          color: #00BCB8;
          margin-left: 16rpx;
          padding: 2rpx 10rpx;
        }

        text:first-child {
          margin-left: 0 !important;
        }
      }
    }

    .main-block:last-child {
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
          background: linear-gradient(90deg, #FD744E 0%, #FB432D 100%);
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
          border: 1rpx solid #E53D34;
          font-weight: bold;
          font-size: 26rpx;
          color: #E53D34;
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
        color: #10C2B7;
        position: relative;

        .active:after {
          border-bottom: 2rpx solid #10C2B7;
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }

    .btnStyle {
      border: 1rpx solid #10C2B7;
      border-radius: 50rpx;
      background-color: aquamarine;
      color: #10C2B7;
      width: 45%;
      font-weight: bold;
      font-size: 50rpx;
      height: 70rpx;
    }
  }

  .z-blocks {
    padding: 30rpx;
    background-color: #fff;
  }

  .btn-block-mini {
    width: 92%;
    margin: auto;
    position: fixed;
    left: 4%;
    bottom: 80rpx;
    background: #FFFFFF;
    border-radius: 45rpx;
    border: 1rpx solid #979797;
    line-height: 84rpx;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 30rpx;
    color: #17181A;
    justify-content: center;
  }

  .pop-title {
    margin-top: 30rpx;
    line-height: 80rpx;
    justify-content: center;
    text-align: center;
    width: 100%;
    font-weight: 600;
    font-size: 32rpx;
    color: #222222;
    line-height: 53rpx;
  }

  .card-list {
    padding: 40rpx 60rpx 60rpx 60rpx;
    border-radius: 28rpx;

    text {
      font-weight: 400;
      font-size: 28rpx;
      color: #222222;
    }

    .card-item {
      width: 100%;
      display: flex;
      margin-bottom: 30rpx;

      .card-item-left {
        padding: 10rpx 0;
        border-radius: 20rpx 0 0 20rpx;
        display: flex;
        width: 25%;
        background-color: #FFF3F3;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .card-item-left-top {
          font-size: 27rpx;
          color: #FF1E00;

          text {

            font-size: 50rpx;
            font-weight: bold;
          }
        }

        .card-item-left-bottom {
          text {
            color: #FF1E00;
            border-radius: 6rpx 6rpx 6rpx 6rpx;
            border: 1rpx solid #FF1E00;
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

  .phone-list {
    padding: 40rpx 60rpx 60rpx 60rpx;
    border-radius: 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text {
      line-height: 50rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #222222;
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


  .tabbar-box{
    width: 100%;
    box-sizing: border-box;
    padding: 40rpx 30rpx 10rpx;
    background: #fff;
  }

  .discountPackages{
    // padding-top: 20rpx;
    padding-bottom: 20rpx;
    // background: #f0f0f4;
  }
  .richItem{
    background: #FFFFFF;
    width: 100%;
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 0 30rpx;
    margin-bottom: 20rpx;
    .rich-text-box{
      width: 100%;
      font-size: 28rpx;
    }
  }
  .agencyProfile{
    width: 100%;
    background: #fff;
    padding: 20rpx 30rpx;
    color: #999;
    font-size: 24rpx;
    line-height: 40rpx;
  }

}
</style>