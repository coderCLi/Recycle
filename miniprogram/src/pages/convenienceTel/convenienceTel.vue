<!--
 * @Description: 便民电话
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="convenienceTel" :props-data="propsData">
    <view
      class="poTop"
      style="position: fixed; background: #fff; z-index: 1; width: 100%"
    >
      <view class="top">
        <image
          class=""
          style="width: 150rpx; height: 88rpx"
          :src="minioBaseUrl + '/common/callPhone/110.png'"
          mode="widhthFix"
          lazy-load="false"
          @click="call({ tel: '110' })"
        >
        </image>
        <image
          style="width: 150rpx; height: 88rpx"
          :src="minioBaseUrl + '/common/callPhone/119.png'"
          mode="widhthFix"
          lazy-load="false"
          @click="call({ tel: '119' })"
        >
        </image>
        <image
          style="width: 150rpx; height: 88rpx"
          :src="minioBaseUrl + '/common/callPhone/120.png'"
          mode="widhthFix"
          lazy-load="false"
          @click="call({ tel: '120' })"
        >
        </image>
        <image
          style="width: 150rpx; height: 88rpx"
          :src="minioBaseUrl + '/common/callPhone/122.png'"
          mode="widhthFix"
          lazy-load="false"
          @click="call({ tel: '122' })"
        >
        </image>
        <!-- <view class="top-box" @click="call({ tel: '110' })">盗警 110 </view>
        <view class="top-box" @click="call({ tel: '119' })">火警 119 </view>
        <view class="top-box" @click="call({ tel: '120' })">急救 120 </view>
        <view class="top-box" @click="call({ tel: '122' })">交通 122 </view> -->
      </view>
      <up-tabs
        style="background: #fff; padding: 0 10px 10px 10px; widht: 100%"
        :list="tabsList"
        lineWidth="30"
        :scrollable="false"
        @change="tabChange"
        :activeStyle="{
          color: '#333',
          fontWeight: 'bold',
          paddingBottom: '10px',
          fontSize: '28rpx',
        }"
        :inactiveStyle="{
          color: '#333',
          transform: 'scale(1)',
          paddingBottom: '10px',
          fontSize: '28rpx',
        }"
        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
      >
      </up-tabs>
    </view>
    <view class="phone-list" :style="{ marginTop: topHeight + 12 + 'px',paddingBottom: '24rpx' }">
      <phone-item-vue
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      ></phone-item-vue>
    </view>
    <!-- <view style="position: absolute; top: 0; left: 0; width: 100%; z-index: 0">
      <view class="top-bg2"></view>
    </view>
    <view
      class="true-content"
      style="position: relative; width: 100%; height: 100%"
    >
      <view class="tabbar">
        <view class="tabbarBox">
          <view
            v-for="(item, index) in tabbarList"
            :key="index"
            class="tabbarBoxItem"
          >
            <view
              class="content"
              :class="{ active: activeIndex === index }"
              @click="tabChange(index)"
            >
              {{ item.name }}
            </view>
            <view v-if="activeIndex === index" class="activeLine"></view>
          </view>
        </view>
      </view>
      <view class="convenience">
        <view
          class="convenience-list"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="convenience-item">
            <view class="convenience-title">{{ item.name }}</view>
            <view class="convenience-tel">{{ item.tel }}</view>
          </view>
          <view class="convenience-btn" @click="call(item)">立即拨打</view>
        </view>
      </view>
      <vc-safe-bottom />
    </view> -->
  </vc-container>
</template>

<script>
import phoneItemVue from "./phoneItem.vue";
export default {
  name: "message",
  components: { phoneItemVue },
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: "便民电话",
          },
          // titleColor: {
          //     value: "#FFFFFF",
          // }
        },
      },
      tabbarList: [
        {
          id: "1",
          name: "便民生活",
        },
        {
          id: "2",
          name: "报警举报",
        },
      ],
      tabsList: [
        {
          id: "1",
          name: "政务咨询",
        },
        {
          id: "2",
          name: "投诉反馈",
        },
        {
          id: "3",
          name: "民生求助",
        },
        {
          id: "4",
          name: "企业服务",
        },
      ],
      activeIndex: 0,
      list: [],
      topHeight: 0,
    };
  },
  async onLoad(options) {
    // this.getList();
    await this.tabChange(this.tabsList[0]);
    this.getTopHeight();
  },
  onShow() {},
  computed: {},
  methods: {
    call({ tel, name }) {
      console.log("tel: ", tel);
      /**
       *   let arr  = this.articleDetail.phone.split(",").map(phoneNumber => ({ title: this.articleDetail.mctName, phoneNumber: phoneNumber }))
     let obj = {
      phoneList : arr,
      popTitle:'联系我们',
      showPop:true
     }
     this.$refs.callPhone.openPop(obj)
       */
      this.bridgeSdk.jumpPage({
        title: name,
        url: `tel://${tel}`,
      });
    },

    tabChange(index) {
      console.log(index, "change");
      // this.activeIndex = index;
      // this.getList();
      if (index.name == "政务咨询") {
        this.list = [
          {
            title: "政务服务热线",
            phone: "12345",
            content: "24小时服务",
          },
          {
            title: "社保咨询（全国）",
            phone: "12333",
            content: "24 小时语音服务，人工服务工作日 9:00-17:00",
          },
          {
            title: "保定人社局",
            phone: "0312-3088363、5077050",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "医保咨询（全国）",
            phone: "12393",
            content: "24 小时语音服务，人工服务工作日 9:00-12:00，13:00-17:00",
          },
          {
            title: "保定医保局",
            phone: "0312-7590234",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "异地就医备案",
            phone: "0312-5918550",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "公积金咨询（全国）",
            phone: "12329",
            content: "24 小时语音服务，人工服务时间为工作日 8:30-17:30",
          },
          {
            title: "保定市公积金管理中心",
            phone: "0312-3353301",
            content: "工作日 8:30-17:30",
          },
        ];
      } else if (index.name == "投诉反馈") {
        this.list = [
          {
            title: "事故及隐患举报",
            phone: "12350",
            content: "24小时服务",
          },
          {
            title: "市场监督投诉举报",
            phone: "12315",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "数字化城管监督",
            phone: "2036110",
            content: "周一至周日 7:00-19:00",
          },
          {
            title: "环保举报电话",
            phone: "12369",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
        ];
      } else if (index.name == "民生求助") {
        this.list = [
          {
            title: "公共交通求助",
            phone: "12328",
            content: "每日 6:30-20:00",
          },
          {
            title: "消保委",
            phone: "6785639",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "燃气公司",
            phone: "3232601",
            content: "每日 8:00-20:00",
          },
          {
            title: "天气查询",
            phone: "96121",
            content: "24小时自动语音",
          },
          {
            title: "供电服务",
            phone: "95598",
            content: "24小时服务",
          },
          {
            title: "供水服务",
            phone: "3030111",
            content: "每日 8:30-17:30",
          },
          {
            title: "客运中心",
            phone: "5972888",
            content: "每日 6:00-18:00",
          },
          {
            title: "火车站咨询",
            phone: "7942222",
            content: "每日 8:00-18:00",
          },
        ];
      } else if (index.name == "企业服务") {
        this.list = [
          {
            title: "市场监督管理局",
            phone: "0312-12315",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "税务局",
            phone: "0312-12366",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "人力资源和社会保障局",
            phone: "0312-12333",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "市民服务中心",
            phone: "0312-6788111",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
          {
            title: "公共法律服务热线",
            phone: "12348",
            content: "人工服务：工作日 8:30-12:00；13:30-17:30",
          },
        ];
      }
    },
    async getTopHeight() {
      const windowInfo = await this.bridgeSdk.getWindowInfo();
      console.log(windowInfo, "windowInfo");

      setTimeout(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(".poTop")
          .boundingClientRect((res) => {
            console.log(res, "poToppoTop");
            this.topHeight = res.height;
          })
          .exec();

        // uni
        //   .createSelectorQuery()
        //   .select(".poTop")
        //   .boundingClientRect((res) => {
        //     console.log(res, "poToppoTop");
        //     this.topHeight = res.height;
        //   })
        //   .exec();
      });
    },
    getList() {
      if (this.activeIndex === 0) {
        this.list = [
          {
            name: "政务服务热线",
            tel: "12345,9999203",
          },
          {
            name: "公积金咨询热线",
            tel: "12345",
          },
          {
            name: "消保委",
            tel: "6785639",
          },
          {
            name: "燃气公司",
            tel: "3232601",
          },
          {
            name: "天气查询",
            tel: "96121",
          },
          {
            name: "有线电话维修",
            tel: "96888",
          },
          {
            name: "供电服务",
            tel: "95598",
          },
          {
            name: "供水公司",
            tel: "3030111",
          },
          {
            name: "客运中心",
            tel: "5972888",
          },
          {
            name: "火车站咨询",
            tel: "7942222",
          },
        ];
      } else {
        this.list = [
          {
            name: "盗警",
            tel: "110",
          },
          {
            name: "火警",
            tel: "119",
          },
          {
            name: "急救中心",
            tel: "120",
          },
          {
            name: "交通事故报警",
            tel: "122",
          },
          {
            name: "高速救援报警",
            tel: "12122",
          },
          {
            name: "事故及隐患举报",
            tel: "12350",
          },
          {
            name: "市场监督投诉举报",
            tel: "12315",
          },
          {
            name: "数字化城管监督",
            tel: "2036110",
          },
          {
            name: "环保举报电话",
            tel: "12369",
          },
        ];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.convenienceTel {
  height: 100%;
  background: #f5f6f8;
  .top {
    padding: 20rpx 20rpx 30rpx;
    display: flex;
    justify-content: space-around;
    .top-box {
      background-color: #fff;
      padding: 10rpx 20rpx;
    }
  }

  .tabbar {
    width: 100%;
    height: 100rpx;
    position: relative;
    .tabbarBox {
      width: 100vw;
      height: 100rpx;
      padding: 0 60rpx;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;
      .tabbarBoxItem {
        width: 50%;
        height: 100rpx;
        display: flex;
        align-items: center;
        flex-direction: column;
        .content {
          font-weight: 400;
          font-size: 32rpx;
          color: #999999;
          line-height: 45rpx;
          padding-top: 28rpx;
          padding-bottom: 3rpx;
          position: relative;
        }
        .active {
          font-weight: 600;
          color: #333333;
        }
        .activeLine {
          width: 40rpx;
          height: 8rpx;
          background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #00bcb9;
          border-radius: 4rpx;
        }
      }
    }
  }
  .convenience {
    width: 100%;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    padding: 36rpx 0;
    height: calc(100% - 50px);
    box-sizing: border-box;
    overflow-y: auto;
    .convenience-list {
      margin: 0 auto;
      width: 670rpx;
      height: 110rpx;
      background: #ffffff;
      box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 16rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      padding: 0 30rpx;
      margin-bottom: 20rpx;
      .convenience-item {
        width: 420rpx;
        display: flex;
        height: 100%;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .convenience-title {
          width: 280rpx;
          height: 45rpx;
          font-weight: bold;
          font-size: 32rpx;
          color: #333333;
          line-height: 45rpx;
          text-align: left;
          font-style: normal;
        }
        .convenience-tel {
          width: 140rpx;
          height: 40rpx;
          font-weight: 400;
          font-size: 28rpx;
          color: #666666;
          line-height: 45rpx;
          text-align: left;
          font-style: normal;
        }
      }
      .convenience-btn {
        width: 179rpx;
        height: 65rpx;
        background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #d8d8d8;
        border-radius: 33rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #ffffff;
        line-height: 65rpx;
        text-align: center;
        font-style: normal;
      }
    }
  }
}

::v-deep .u-border-bottom,
.up-border-bottom {
  border-bottom: 0;
}
::v-deep() .u-tabs__wrapper__nav__line {
  background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #00bcb9 !important;
  border-radius: 4rpx;
}
</style>
