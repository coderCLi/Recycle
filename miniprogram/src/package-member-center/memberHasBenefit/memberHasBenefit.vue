<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">
    <view class="tabs-box">
      <up-tabs
        :list="tabList"
        @click="tabClick"
        :activeStyle="{ color: '#333333', fontWeight: '600' }"
        :itemStyle="{ width: '33%', textAlign: 'center', padding: '30rpx 0',color: '#333333' }"
        :inactiveStyle="{ color: '#333333' }"
        lineColor="#FFD9AD"
        class="tabs"
      ></up-tabs>
    </view>
    <view class="content">
      <view class="content-header">
        <view v-if="tabId == '0'" class="content-header-left">
          仅统计已领取且待使用的权益
        </view>
        <view v-if="tabId == '1'" class="content-header-left">
          仅统计近30天已使用的权益
        </view>
        <view v-if="tabId == '2'" class="content-header-left">
          仅统计近30天已过期的权益
        </view>
        <view class="content-header-right" @click="showPicker = !showPicker">
          {{
          typeName
        }}<view class="arrow-down-box"></view>
        </view>
      </view>
      <view class="content-body" v-if="list.length" :style="{height: 'calc(100vh - '+ (navigationBarInfo.statusBarHeight +
            navigationBarInfo.navigationBarHeight) +'px - '+ (120 + 90) +'rpx)'}">
        <view
          class="content-body-item"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="content-body-item-title">{{ item.privilegeName }}</view>
          <benefit-card-item
            :info="item"
            @showInfo="showModalInfo"
            @handleClick="toUse"
            page="has"
            :tabId="tabId"
          ></benefit-card-item>
        </view>
      </view>
      <vc-empty v-else></vc-empty>
    </view>
    <up-picker
      :show="showPicker"
      :columns="columns"
      @confirm="handleSelect"
      @cancel="handleCancel"
      keyName="optName"
    ></up-picker>
  </vc-container>
</template>

<script>
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";

import benefitCardItem from "../components/benefitCardItem.vue";

import {
  getVipPrivilegesUsageLogList,
  getDataDicList,
  getCouponBaseDetails,
} from "../api/index";
export default {
  name: "memberHasBenefit",
  components: { benefitCardItem },
  computed: {    
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
  },
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: "已领取权益",
          },
        },
      },
      tabList: [
        {
          name: "待使用",
          value: "0",
        },
        {
          name: "已使用",
          value: "1",
        },
        {
          name: "已过期",
          value: "2",
        },
      ],
      showPicker: false,
      columns: [
        [
          // {
          //   text: "全部",
          //   value: "all",
          // },
          // {
          //   text: "专属券包",
          //   value: "1",
          // },
          // {
          //   text: "免积分抽奖",
          //   value: "2",
          // },
          // {
          //   text: "商城红包",
          //   value: "3",
          // },
        ],
      ],
      tabId: "0",
      tabName: "待使用",
      typeId: "all",
      typeName: "全部",
      list: [],
    };
  },
  onLoad(options) {
    if(options.typeId){
      this.typeId = options.typeId;
    }
    this.getDic();
    this.getList();
  },
  onShow(){
    this.page = 1
    this.getList();
  },
  methods: {
    tabClick(item) {
      console.log(item);
      this.tabId = item.value;
      this.tabName = item.name;
      this.getList();
    },
    handleSelect(e) {
      console.log("handleSelect", e);
      this.typeName = e.value[0].optName;
      this.typeId = e.value[0].optCode;
      this.showPicker = false;
      this.getList();
    },
    handleCancel() {
      this.showPicker = false;
    },
    showModalInfo(info) {
      console.log("showModalInfo", info);
      this.$refs.modal.open({
        title: info.title,
        htmlString: info.description,
        confirmText: "确认",
        showCancel: false,
      });
    },
    toUse(info) {
      // 去使用
      if (info.privilegeType == "3") {
        // 抽奖
        this.bridgeSdk.jumpPage({
          url: "/package-member-center/memberPrizeDraw/memberPrizeDraw",
        });
      } else if (info.privilegeType == "2") {
        getCouponBaseDetails({
          couponBaseId: info.roductId,
          couponFlowInfoById: info.productHoldId,
        }).then((res) => {
          let entime = new Date(res.useEndTime).getTime();
          let nowTime = new Date().getTime();
          if (entime < nowTime) {
            this.$refs.modal.open({
              title: "提示",
              htmlString: "所选权益已过期，请更换使用其他权益吧~",
              confirmText: "确认",
              showCancel: false,
              confirmCallback: () => {
                this.getList();
              },
            });
          } else {
            this.bridgeSdk.jumpPage({
              url: this.staticBaseUrl + "/mall/#/pages/index/index",
            });
          }
        });
      } else {
        getCouponBaseDetails({
          couponBaseId: info.roductId,
          couponFlowInfoById: info.productHoldId,
        }).then((res) => {
          let entime = new Date(res.useEndTime).getTime();
          let nowTime = new Date().getTime();
          if (entime < nowTime) {
            this.$refs.modal.open({
              title: "提示",
              htmlString: "所选权益已过期，请更换使用其他权益吧~",
              confirmText: "确认",
              showCancel: false,
              confirmCallback: () => {
                this.getList();
              },
            });
          } else {
            this.bridgeSdk.jumpPage({
              pageType: "tab",
              tabPageId: "1",
              url: "/pages/home/home",
            });
          }
        });
      }
    },
    getDic() {
      let values = [
        {
          optName: "全部",
          optCode: "all",
        },
      ];
      getDataDicList({ code: "POINTS_VIP_PRIVILEGE_TYPE" }).then((res) => {
        console.log("POINTS_VIP_PRIVILEGE_TYPE", res);
        values = values.concat(res);
        this.columns[0] = values;
        if(res&&res.length){
          res.forEach(item=>{
            if(item.optCode==this.typeId){
              this.typeName = item.optName;
            }
          })
        }
      });
    },
    getList() {
      let privilegeType = this.typeId == "all" ? "" : this.typeId;
      this.list = [];
      getVipPrivilegesUsageLogList({
        usageIs: this.tabId,
        privilegeType: privilegeType,
      }).then((res) => {
        console.log("getVipPrivilegesUsageLogList", res);
        this.list = res.list;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
position: relative;
  .tabs-box {
    width: 100%;
    height: 120rpx;
    background: #fff;
    box-sizing: border-box;
    padding: 10rpx 42rpx;
    position: sticky;
    top: 0;
  }

  .content-header {
    width: 100%;
    height: 90rpx;
    box-sizing: border-box;
    padding: 38rpx 40rpx 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .content-header-left {
      color: #999999;
      font-size: 28rpx;
      line-height: 40rpx;
      font-weight: bold;
    }
    .content-header-right{
      color: #333333;
      display: flex;
      align-items: center;
      font-size: 25rpx;
      line-height: 36rpx;
      .arrow-down-box{
        position: relative;
        margin-left: 4rpx;
        width: 16rpx;
        height: 10rpx;
      }
      .arrow-down-box::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-left: 8rpx solid transparent;
        border-right: 8rpx solid transparent;
        border-top: 10rpx solid #999999; /* 箭头颜色 */
      }
    }
  }
  .content-body {
    overflow-y: auto;
    .content-body-item {
      width: 100%;
      box-sizing: border-box;
      padding: 0 40rpx;
      margin-top: 26rpx;
      .content-body-item-title{
        font-weight: 800;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
        text-align: left;
        margin-bottom: 14rpx;
      }
    }
  }
}
</style>