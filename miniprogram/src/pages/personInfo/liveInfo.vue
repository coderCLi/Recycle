<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="liveInfo">
    <view class="liveInfo-box">
      <view class="liveInfo-row">
        <view class="liveInfo-title">常住地址</view>
        <view class="liveInfo-content">
          <jia-cascader
            ref="jiaCascader"
            style="width: 100%"
            :request="true"
            :itemList="itemList"
            :receiveData="receiveData"
            :lineColor="'#00BCB8'"
            :activeColor="'#555'"
            :defaultItemList="defaultItemList"
            @completeChange="completeChange"
            @inputChange="inputChange"
          ></jia-cascader>
        </view>
      </view>
      <view class="liveInfo-row">
        <view class="liveInfo-title">详细地址</view>
        <view class="liveInfo-content">
          <input
            class="liveInfo-input"
            type="text"
            v-model="detailAddress"
            placeholder="请输入详细地址"
            style="text-align: right; color: #333"
            placeholder-class="liveInfo-input-placeholder"
          />
        </view>
      </view>
      <up-button
        class="logout-btn"
        type="default"
        text="保存"
        @click="saveInfo"
      ></up-button>
    </view>
  </vc-container>
</template>

<script>
import {
  getLinkAgeCity,
  getResidentInfo,
  editUserSubbly,
} from "../../api/mine";
import jiaCascader from "@/components/library/base/address-popup/jia-cascader.vue";
export default {
  components: {
    jiaCascader,
  },
  data() {
    return {
      itemList: [],
      receiveData: [],
      detailAddress: "",
      province: "",
      city: "",
      area: "",
      areaName: "",
      provinceList: [],
      cityList: [],
      areaList: [],
      columns: [[], [], []],
      defaultItemList: [],
    };
  },
  async onLoad(options) {
    // await this.firstInit();
    // this.options = options;
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  methods: {
    __loadData__() {
      this.getLinkAgeCity("root", "province");
      this.getLinkAge("root").then((res) => {
        this.itemList = res;
      });
      this.getResidentInfo();
    },
    getResidentInfo() {
      getResidentInfo().then((res) => {
        console.log("获取居住信息", res);
        this.detailAddress = res.detailAddress;
        this.province = res.province;
        this.city = res.city;
        this.area = res.district;
        this.areaName = res.areaName;
        this.defaultItemList = [];
        if (this.province) {
          this.defaultItemList.push({
            cityNo: res.province,
            cityName: res.provinceName,
            level: 1,
          });
        }
        if (this.city) {
          this.defaultItemList.push({
            cityNo: res.city,
            cityName: res.cityName,
            level: 2,
          });
        }
        if (this.area) {
          this.defaultItemList.push({
            cityNo: res.district,
            cityName: res.areaName,
            level: 3,
          });
        }
      });
    },
    completeChange(e) {
      console.log("completeChange", e);
      this.province = e.result[0]["cityNo"];
      this.city = e.result[1]["cityNo"];
      this.area = e.result[2]["cityNo"];
      this.areaName = e.cityName;
    },
    inputChange(e) {
      this.getLinkAge(e.cityNo).then((res) => {
        this.receiveData = res;
      });
    },
    async getLinkAge(cityNo, index) {
      let res = await getLinkAgeCity({ parentNo: cityNo });
      return res;
    },

    getLinkAgeCity(parentNo = "root", type = "province", data = "0") {
      console.log("获取省市区数据", parentNo, type, data);
      // 获取省市区数据
      getLinkAgeCity({ parentNo }).then((res) => {
        console.log("获取数据:", res);

        if (type === "province") {
          this.provinceList = res; // 更新省的数据
          this.columns[0] = res.map((item) => item.cityName); // 更新省列

          // 获取第一个省的数据后，自动加载市
          if (res.length > 0) {
            this.province = res[data]?.cityNo; // 默认选中第一个省
            //   this.getLinkAgeCity(this.province, 'city'); // 获取市数据    不需要一开始查询第一个城市
          }

          this.cityList = []; // 清空市数据
          this.areaList = []; // 清空区数据
          this.columns[1] = []; // 清空市列
          this.columns[2] = []; // 清空区列
        } else if (type === "city") {
          this.cityList = res; // 更新市的数据
          this.columns[1] = res.map((item) => item.cityName); // 更新市列

          // 获取第一个市的数据后，自动加载区
          if (res.length > 0) {
            this.city = res[data]?.cityNo; // 默认选中第一个市
            this.getLinkAgeCity(this.city, "area"); // 获取区数据
          }

          this.areaList = []; // 清空区数据
          this.columns[2] = []; // 清空区列
        } else if (type === "area") {
          this.areaList = res; // 更新区的数据
          this.area = res[data]?.cityNo;
          this.columns[2] = res.map((item) => item.cityName); // 更新区列
        }

        // 设置默认选中的值
        if (data) {
          this[data] = res[0]?.cityNo || ""; // 默认选中第一个
        }
      });
    },

    // 处理 picker 列变化
    changeHandler(e) {
      console.log("hhhhhhhhhhhlllllll", e);

      const { columnIndex, value } = e;
      if (columnIndex === 0) {
        // 省发生变化
        const selectedProvince = this.provinceList.find(
          (item) => item.cityName === value[0]
        );
        this.province = selectedProvince?.cityNo || ""; // 记录选中的省的 cityNo
        this.cityList = []; // 清空市数据
        this.areaList = []; // 清空区数据
        this.columns[1] = []; // 清空市列
        this.columns[2] = []; // 清空区列
        // this.getLinkAgeCity(this.province, 'city', e.indexs[0]); // 获取市数据
        this.getLinkAgeCity(this.province, "city", 0); // 获取市数据
      } else if (columnIndex === 1) {
        // 市发生变化
        const selectedCity = this.cityList.find(
          (item) => item.cityName === value[1]
        );
        this.city = selectedCity?.cityNo || ""; // 记录选中的市的 cityNo
        this.areaList = []; // 清空区数据
        this.columns[2] = []; // 清空区列
        // this.getLinkAgeCity(this.city, 'area', e.indexs[1]); // 获取区数据
        this.getLinkAgeCity(this.city, "area", 0); // 获取区数据
      } else if (columnIndex === 2) {
        // 区发生变化
        const selectedArea = this.areaList.find(
          (item) => item.cityName === value[2]
        );
        this.area = selectedArea?.cityNo || ""; // 记录选中的区的 cityNo
      }
    },

    saveInfo() {
      console.log(
        "保存居住信息",
        this.province,
        this.city,
        this.area,
        this.areaName,
        this.detailAddress
      );
      editUserSubbly({
        province: this.province,
        city: this.city,
        district: this.area,
        detailAddress: this.detailAddress,
      }).then((res) => {
        console.log("保存居住信息成功", res);
        this.$refs.modal.open({
          title: "保存成功",
          content: "常住信息保存成功",
          showCancel: false,
          confirmText: "确定",
          confirmCallback: () => {
            uni.navigateBack();
          },
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.liveInfo {
  width: 100%;
  height: 100vh;
  background: #ffffff;

  .liveInfo-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 40rpx;
    // background: #fff;

    .liveInfo-row {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 20rpx;
      border-bottom: 1px solid #eee;
      .liveInfo-title {
        font-size: 28rpx;
        color: #222;
        font-weight: 600;
      }
      .liveInfo-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 100rpx;
        font-size: 28rpx;
        color: #777;
        .up-icon {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #bbb;
        }
      }
    }
    .logout-btn {
      font-size: 32rpx;
      font-weight: 600;
      border-radius: 10px;
      border: 2px solid #dddddd;
      width: 670rpx;
      margin: 72rpx auto 40rpx;
      padding: 10rpx 0;
      background: #fff;
      text-align: center;
    }
    .liveInfo-input::-webkit-input-placeholder {
      color: #bbbbbb;
    }
    // /deep/.liveInfo-input-placeholder {
    //   color: #999999;
    // }
  }
}
::v-deep .u-border-bottom,
.up-border-bottom {
  border-bottom: 0;
}
  ::v-deep .liveInfo-input-placeholder {
    color: #bbbbbb;
  }
</style>