<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="main packageDetail">
    <!-- banner 定制样式+点击预览大图组件统一处理 -->
    <!-- <vc-banner :props-data="bannerData"></vc-banner> -->
     <view class="header-image">
      <image class="header-image" :src="minioBaseUrl + info.picUrl"></image>
     </view>
    <view class="box-padding title">
      {{ info.title }}
    </view>
    <view class="box-padding desc">
      <text class="desc_left">限购说明</text>
      <text class="desc_right">{{ info.limitationsDesc }}</text>
    </view>
    <view class="box-padding desc">
      <text class="desc_left">使用须知</text>
      <text class="desc_right">{{ info.useDesc }}</text>
    </view>
    <view class="box-padding desc" style="padding-bottom: 30rpx">
      <text class="desc_left">退款说明</text>
      <text class="desc_right" @click="showRefundDesc">{{ info.refundDesc }} {{  ">" }}</text>
      <view class="price">
        <view class="discount">
          {{ info.newPrice }}
        </view>
        <view class="original">
          {{ info.oldPrice }}
        </view>
      </view>
    </view>

    <div style="height: 10rpx; background: #f0f0f4"></div>

    <view class="box-padding title">团购详情</view>
    <view class="tabbar-box">
      <tabbar :list="tabbarList" @change="tabbarChange"></tabbar>
    </view>
    <view class="box-padding" style="background-color: #fff">
      <!-- 套餐详情 -->
      <!-- <view v-if="activeIndex === 0" class="package-content">
        <view class="package-content-head">
          <view class="package-content-head-demo"> </view>
          <view class="package-content-head-title" :style="{backgroundImage: url(staticBaseUrl + '/hbdimage/main/images/package-services/title_bg.png')}">包含项目</view>
          <view class="package-content-head-demo"
            >共计<text class="font16">{{ 99 }}</text
            >项</view
          >
        </view>
        <view class="package-content-item">
          <view class="package-content-item-head">
            <image :src="staticBaseUrl + '/hbdimage/main/images/package-services/title_left.png'" />
            科室检查
            <image :src="staticBaseUrl + '/hbdimage/main/images/package-services/title_right.png'" />
          </view>
          <view
            class="package-content-child-item"
            :class="{ borderBottom: true }"
          >
            <view class="package-content-child-item-head">
              <text class="package-content-child-item-title">项目名称</text>
              <image
                class="package-content-child-item-img"
                :src="staticBaseUrl + '/hbdimage/main/images/package-services/warning.png'"
              />
            </view>
            <view class="package-content-child-item-body">
              包含项目 1、项目名称 2、项目名称 3、项目名称 4、项目名称
              5、项目名称 6、项目名称 7、项目名称 8、项目名称 9、项目名称 10
            </view>
          </view>
        </view>
      </view> -->

      <!-- 服务流程 -->
      <!-- <view v-if="activeIndex === 1" class="service-process">
        <view class="flex flex_ac">
          <view class="dot bg_00BCB8"></view>
          <view>
            <view class="bold">标题</view>
            <view>内容</view>
          </view>
        </view>
      </view> -->

      <!-- 体检须知 -->
      <!-- <view v-if="activeIndex === 2" class="health-notice">
        <view class="flex flex_ac">
          <view class="dot bg_00BCB8"></view>
          <view>
            体检须知
          </view>
        </view>
      </view> -->

      <!-- 团购详情  富文本 -->
      <view class="health-notice">
        <rich-text class="rich-text-box" :nodes="bridgeSdk.addMinioPrefixToImgSrc(info.detailList[activeIndex].richTextContent)"></rich-text>
      </view>
    </view>
    <view class="bottomBox" v-if="phone">
      <up-button
        class="confirmbtn"
        type="primary"
        text="电话预约"
        @click="phoneClick"
        shape="circle"
      ></up-button>
    </view>


    <vc-popup-pop @close="close" :props-data="popPropsData" />

  </vc-container>
</template>

<script>
import tabbar from "../components/tabbar.vue";
import vcBanner from "@/components/library/base/vc-banner/index.vue"; //banner
import vcPopupPop from "@/components/library/base/vc-popup-pop/index.vue";

import { getMctProPackageInfo } from "../api/base-services"
export default {
  name: "packageDetail",
  emits: ['close'],
  components: { tabbar, vcBanner, vcPopupPop },
  data() {
    return {
      id: "",
      bannerData: {
        props: {
          list: {
            value: [],
          },
          height: {
            value: 360,
          },
          type: {
            value: "indicator",
          },
          borderRadius: {
            value: "border-radius",
          },
          preview: {
            value: true,
          },
        },
      },
      info: {},
      // 下半部分tabbar数据
      tabbarList: [],
      activeIndex: 0,
      popPropsData: {
        props: {
          show: {
            label: "类型",
            value: 'showRefundDesc',// showPhone 电话
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
    };
  },
  onLoad(options) {
    console.log(options);
    this.id = options.id;
    this.phone = options.phone;
    this.getDetail();
  },
  methods: {
    tabbarChange(i) {
      console.log(i);
      this.activeIndex = i;

    },
    getDetail(){
      getMctProPackageInfo({packageId: this.id}).then(res=> {
        console.log(res)
        this.info = res
        this.tabbarList = res.detailList.map(item=> {
          item.name = item.richTextTitle
          return item
        })
      })
    },
    close() {
      this.popPropsData.props.showPop.value = false;
    },
    closePhone() {
      this.showPhone = false
    },
    phoneClick() {//电话
      this.popPropsData.props.show.value = 'showPhone';//
      this.popPropsData.props.content.value = this.phone.split(",").map(phoneNumber=>({title: this.info.title, phoneNumber: phoneNumber}));
      this.popPropsData.props.showPop.value = true;
    },
    showRefundDesc() {//电话
      this.popPropsData.props.show.value = 'showRefundDesc';//
      this.popPropsData.props.content.value = this.info.refundRichTextContent
      this.popPropsData.props.showPop.value = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.packageDetail {
  padding-bottom: 100rpx;
  .header-image{
    width: 100%;
    height: 396rpx;
  }
  .box-padding {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
  }
  .title {
    width: 100%;
    font-weight: bold;
    font-size: 32rpx;
    color: #333333;
    line-height: 45rpx;
    background: #fff;
    padding-top: 40rpx;
    padding-bottom: 10rpx;
  }
  .desc {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #333333;
    line-height: 33rpx;
    background: #fff;
    .desc_left {
      margin-right: 20rpx;
      flex-shrink: 0;
    }
    .desc_right {
      flex: 1;
    }
  }
  .price {
    display: flex;
    align-items: center;
    .discount {
      font-weight: 600;
      font-size: 28rpx;
      color: #ff1f1f;
      line-height: 40rpx;
      margin-right: 10rpx;
    }
    .original {
      font-weight: 400;
      font-size: 20rpx;
      color: #aaaaaa;
      line-height: 28rpx;
      text-decoration-line: line-through;
    }
  }

  .tabbar-box {
    width: 100%;
    box-sizing: border-box;
    padding: 24rpx 30rpx;
    background: #fff;
  }

  .package-content {
    width: 100%;
    background-color: #fff;
    padding-bottom: 20rpx;
    .package-content-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      .package-content-head-demo {
        width: 150rpx;
        height: 33rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 33rpx;
        padding-top: 20rpx;
      }
      .package-content-head-title {
        width: 245rpx;
        height: 74rpx;
        font-weight: 600;
        font-size: 32rpx;
        text-align: center;
        line-height: 74rpx;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        // background-image: url("@/static/images/package-services/title_bg.png");
      }
    }
    .package-content-item {
      width: 100%;
      border: 1px solid #eee;
      border-radius: 10rpx;
      margin-bottom: 40rpx;
      .package-content-item-head {
        width: 100%;
        height: 70rpx;
        font-weight: 600;
        color: #666666;
        background: #f5f5f5;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        image {
          width: 24rpx;
          height: 24rpx;
          margin: 0 10rpx;
        }
      }
      .package-content-child-item {
        width: 630rpx;
        margin: auto;
        padding: 30rpx 0;
        .package-content-child-item-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 30rpx;
          color: #333333;
          margin-bottom: 30rpx;
          .package-content-child-item-img {
            width: 32rpx;
            height: 32rpx;
          }
        }
        .package-content-child-item-body {
          font-size: 28rpx;
          color: #999999;
          line-height: 36rpx;
          text-align: justify;
        }
      }
      .borderBottom {
        border-bottom: 1px solid #eee;
      }
    }
  }
  .bottomBox {
    position: fixed;
    bottom: 30rpx;
    left: 0;
    right: 0;
    width: 750rpx;
    box-sizing: border-box;
    padding: 0 40rpx;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .confirmbtn {
    width: 100%;
    background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #ff5871;
    border-radius: 84rpx;
    color: #fff;
    border: none;
  }
  .service-process,
  .health-notice {
    width: 100%;
    background-color: #fff;
    padding-bottom: 20rpx;
    .rich-text-box{
      width: 100%;
      font-size: 28rpx;
    }
    .one-line {
      display: flex;
      align-items: flex-start;
      line-height: 34rpx;
    }
    .dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 6rpx;
        margin: 10rpx 10rpx 10rpx 0;
        flex-shrink: 0;
    }
    .bold{
        font-weight: bold;
    }
    .font16{
        font-size: 32rpx;
    }
  .bg_00BCB8 {
    background: #00bcb8;
  }
  }

}
</style>
