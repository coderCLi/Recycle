<template>
	<vc-modal ref="modal"></vc-modal>
  <view class="main">
    <!-- 全局组件： -->
    <view
      style="flex-shrink: 0; overflow: hidden"
      id="navbar-search"
      :style="{ paddingTop: `${safeTopDistance + 20}px` }"
    >
      <vc-navbar
        :props-data="propsData"
        :class="keyword.length > 0 ? 'hidden-search' : ''"
        @navBack="navBack"
      >
        <template #right>
          <view style="display: flex; width: 650rpx; height: 80rpx">
            <up-search
              :placeholder="placeholderText"
              :actionStyle="searchActionStyle"
              :searchIcon="searchpng"
              searchIconSize="31.2rpx"
              v-model="keyword"
              height="80rpx"
              bgColor="#EFEEF3"
              placeholderColor="#999999"
              color="#333333"
              :focus="true"
              :clearabled="trueValue"
              shape="square"
              @custom="clickSearch"
              @search="clickSearch"
              @change="inputChange"
              @blur="inputBlur"
            >
            </up-search>
          </view>
        </template>
      </vc-navbar>
    </view>
    <view class="content-box" v-if="showResult === false">
      <!-- 搜索记录 -->
      <view class="title-box" v-if="recordList && recordList.length > 0">
        搜索记录
        <!-- v-if="recordList.length > 0" -->
        <image
          class="delete-btn"
          @click="clickDelete"
          style="width: 26rpx; height: 30rpx"
          :src="deletepng"
          model="aspectFit"
        />
      </view>
      <view class="search-record" v-if="recordList && recordList.length > 0">
        <template v-if="recordList && recordList.length > 0">
          <view
            class="item"
            v-for="(item, index) of recordList"
            :key="index"
            @click="clickRecord(item)"
          >
            {{ item }}
          </view>
        </template>
        <view v-else class="no-data"> 暂无搜索记录 </view>
      </view>
    </view>
    <!-- 结果展示 -->
    <view class="content-box result-box" v-else>
      <view class="result-content">
        <template v-if="resultList.length === 0">
          <view class="title-box"> 为您找到0个结果 </view>
          <view class="no-result">
            <image
              class="img"
              style="width: 260rpx; height: 248rpx"
              :src="wupng"
              model="aspectFit"
            />
            <text class="txt">无符合条件的内容，换个关键词试试</text>
          </view>
        </template>
        <template v-else>
          <view style="height: 8rpx; width: 100%; background: #f4f4f4"></view>
          <view class="scroll-List">
            <view v-if="type === 'mct'">
              <view
                class="scroll-item"
                v-for="(item, index) in resultList"
                @click="goDirection(item)"
                :key="index"
              >
                <mctCom :info="item" :isLocationFail="isLocationFail"></mctCom>
              </view>
            </view>
            <view v-else-if="type === 'point' || type === 'toilets' || type === 'trade-in-point'">
              <view
                v-for="(item, index) in resultList"
                :key="index"
                @click="itemClick(item)"
                class="scroll-item"
              >
                <pointCom
                  :locationInfo="locationInfo"
                  :info="item"
                  :comType="type"
                ></pointCom>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
    <view style="flex-shrink: 0">
      <vc-safe-bottom />
    </view>
  </view>
</template>
<script>
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";
import {
  getMapProLocationList,
  getMctProList,
  getSearchRecordList,
  addSearchRecord,
  cleanSearchRecord,
} from "../api/base-services";
import pointCom from "../components/pointCom";
import mctCom from "../components/mctCom";
export default {
  name: "search",
  components: {
    pointCom,
    mctCom,
  },
  data() {
    return {
      // 层级是固定写法
      propsData: {
        props: {
          title: {
            value: "搜索",
          },
          buttonType: {
            value: "pop",
          },
        },
      },
      isLocationFail: true,
      searchpng:
        this.staticBaseUrl +
        "/hbdimage" +
        "/package-search/static/images/search.png",
      wupng:
        this.staticBaseUrl +
        "/hbdimage" +
        "/package-search/static/images/wu.png",
      deletepng:
        this.staticBaseUrl +
        "/hbdimage" +
        "/package-search/static/images/delete.png",
      themeboxHeight: "0", // px
      selectTheme: {},

      trueValue: true,

      keyword: "",
      showResult: false,
      recordList: [], // 搜索记录
      recordShow: false, // 搜索记录
      placeholderText: "请输入关键词",

      resultList: [
        // {},
        // {}
      ], // 搜索结果

      resultBoxHeight: "0px",
      showPop: false,

      type: "", // 页面类型 mct商户 point网点  toilets公厕  trade-in-point以旧换新参与网点
      serviceId: "", // 商户服务id
      title: "", // 页面标题
      latitude: "", // 纬度
      longitude: "", // 经度
      cateId: '',
      ordr: '',

      locationInfo: {}, // 定位信息
    };
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
    }),
    searchActionStyle() {
      return this.keyword.length > 0 ? {} : { color: "#999999" };
    },
  },
  async onLoad(options) {
    this.type = options.type;
    this.serviceId = options.serviceId;
    this.title = options.title;
    this.latitude = options.latitude;
    this.longitude = options.longitude;
    this.cateId = options.cateId;
    this.ordr = options.ordr;
    // 获取经纬度
    this.bridgeSdk.getLocation((res) => {
      console.log("getLocation获取经纬度", res);
      this.isLocationFail = res.locationFail === true;
      this.locationInfo = res;
      this.getSearchRecord();
    }, "showModal");
    
  },
  methods: {
    close() {
      this.showPop = false;
    },
    inputChange(string) {
      console.log("输入改变 " + this.keyword);
      this.showResult = false;
      this.resultList = [];
    },
    clickSearch() {
      console.log("-------clickSearch " + this.keyword);
      if (this.time && new Date().getTime() - this.time < 1000) {
        return;
      }
      this.time = new Date().getTime();
      this.getSearchFirstPage();
      this.addSearchRecord(this.keyword);
    },
    inputBlur(){
      console.log("------inputBlur " + this.keyword);
      // if (!this.bridgeSdk.checkIsEmpty(this.keyword)){
      //     this.clickSearch();
      //   }
    },
    clickRecord(item) {
      this.keyword = "" + item;
      this.clickSearch();
    },
    clickResult(item) {
      console.log("点击结果" + item.url + item.id);
      let path = item.url;
      this.bridgeSdk.jumpPage({
        url: path,
      });
    },
    clickDelete() {
		this.bridgeSdk.showConfirm({
			content: "确定清空搜索记录？",
			confirmCallback: (res) => {
				this.cleanSearchRecord()
			},
			cancelCallback: (res) => {
				console.log("点击取消", res);
			}
		});
    },
    getSearchFirstPage() {
      if (this.type === "mct") {
        // 商户
        console.log("商户列表入参", {
          serviceId: this.serviceId,
          keyword: this.keyword,
          latitude: this.latitude,
          longitude: this.longitude,
          pageSize: 100,
          pageIndex: 1,
          rows: 100,
          page: 1,
        });
        getMctProList({
          mctServiceId: this.serviceId,
          keyword: this.keyword,
          latitude: this.latitude,
          longitude: this.longitude,
          cateId: this.cateId,
          ordr: this.ordr,
          pageSize: 100,
          pageIndex: 1,
          rows: 100,
          page: 1,
        }).then((res) => {
          console.log("商户列表", res);
          this.resultList = res.list;
          this.showResult = true;
        });
      }
      if (this.type === "point" || this.type === "toilets" || this.type === "trade-in-point") {
        // 网点
        console.log("网点列表入参", {
          mapServiceId: this.serviceId, //
          mapTypeIds: "", //   必输 多个 , 分割
          keywords: this.keyword, //     模糊查询条件  搜索时可传
          longitude: this.longitude, //  			必输 经度
          latitude: this.latitude, //				必输 纬度
          page: 1, //
          rows: 100, //
          orderType: this.orderType || "0", //		必输 排序方式  0-智能1-距离
        });
        getMapProLocationList({
          mapServiceId: this.serviceId, //
          mapTypeIds: "", //   必输 多个 , 分割
          keywords: this.keyword, //     模糊查询条件  搜索时可传
          longitude: this.longitude, //  			必输 经度
          latitude: this.latitude, //				必输 纬度
          page: 1, //
          rows: 100, //
          orderType: '1', //		必输 排序方式  0-智能1-距离
        }).then((res) => {
          console.log("网点列表", res);
          this.resultList = res.list;
          this.showResult = true;
        });
      }
    },

    navBack() {
      if (this.showResult) {
        this.showResult = false;
        this.resultList = [];
      } else {
        this.bridgeSdk.navigateBackTo({ delta: 1 });
      }
    },

    // 获取搜索历史
    getSearchRecord() {
      getSearchRecordList({
        serviceId: this.serviceId,
      }).then((res) => {
        console.log("搜索历史", res);
        this.recordList = res;
      });
    },
    // 保存搜索记录
    addSearchRecord(keyword) {
      addSearchRecord({
        serviceId: this.serviceId,
        keyword: keyword,
      }).then((res) => {
        console.log("保存成功");
        this.getSearchRecord();
      });
    },
    // 清空搜索记录
    cleanSearchRecord() {
      cleanSearchRecord({
        serviceId: this.serviceId,
      }).then((res) => {
        console.log("清空成功");
        this.recordList = [];
      });
    },
    //商家列表
    goDirection(info) {
      if (info.isDetail == "0") {
        return;
      }
      this.bridgeSdk.jumpPage({
        url:
          "/package-services/base-merchants/detail?mctId=" +
          info.mctId +
          "&title=" +
          this.title, // 目标页面的路径
      });
    },
    itemClick(info) {
      console.log("itemClick", info);
      if (info.isDetail == "0") {
        return;
      }
      this.bridgeSdk.jumpPage({
        url:
          "/package-services/h-life/mapDetail?id=" +
          info.locationId +
          "&title=" +
          this.title +
          "&lat=" +
          info.latitude +
          "&lng=" +
          info.longitude +
          "&distance=" +
          info.distance
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#navbar-search {
  padding: 32rpx 0;

  ::v-deep .u-border-bottom {
    border-bottom: 0;
  }
}

.main {
  box-sizing: border-box;
  background: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-box {
  padding-left: 40rpx;
  padding-right: 38rpx;
  flex: 1;
}

.title-box {
  font-weight: 500;
  font-size: 28rpx;
  color: #333333;
  position: relative;
  padding: 28rpx 0rpx 16rpx;

  .delete-btn {
    position: absolute;
    right: 32rpx;
    top: 50%;
    transform: translateY(-50%);
  }
}

.search-record {
  padding-bottom: 20rpx;
}

.recommend,
.search-record {
  display: flex;
  flex-wrap: wrap;
  margin-left: -20rpx;

  .item {
    box-sizing: border-box;
    max-width: 322rpx;
    height: 66rpx;
    padding: 16rpx 28rpx;
    text-align: center;
    background: #f7f8f9;
    border-radius: 12rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 20rpx;
    margin-left: 20rpx;
  }

  .no-data {
    width: 100%;
    text-align: center;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
  }
}

.main .result-box {
  padding-left: 0rpx;
  padding-right: 0rpx;

  .title-box {
    padding-left: 40rpx;
    padding-right: 38rpx;
  }

  .no-result {
    padding-top: 122rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .txt {
      font-weight: 500;
      font-size: 28rpx;
      color: #aaaaaa;
      padding-top: 44rpx;
    }
  }

  .theme-box {
    display: flex;
    justify-content: space-between;
    padding: 0rpx 48rpx;
    height: 88rpx;

    .theme-item {
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      padding: 24rpx 10rpx;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      &.select {
        color: #00bcb8;
        font-weight: bold;
      }

      .txt {
        margin-left: 6rpx;
      }
    }
  }

  .theme-line {
    width: 100%;
    height: 8rpx;
    background: #f4f4f4;
  }

  .result-item-box {
    padding: 0 20rpx;

    &:first-child {
      margin-top: 22rpx;
    }
  }

  .scroll-List{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;

	.scroll-item {
	  width: 690rpx;
	  margin: 0 auto 20rpx;
	  background-color: white;
	  display: flex;
	  flex-direction: column;
	  border-bottom: 1px solid #f1f1f1;
	  padding: 20rpx 0
	}
  }

  .theme-name {
    padding: 24rpx 0rpx;
    padding-left: 40rpx;
    font-size: 24rpx;
    color: #979797;
    position: relative;

    .hori-line {
      height: 2rpx;
      background-color: #dadada;
      position: absolute;
      bottom: 0rpx;
      left: 0rpx;
      right: 0rpx;
    }
  }

  .more {
    padding: 24rpx 0rpx;
    font-size: 24rpx;
    color: #979797;
    text-align: center;
  }

  .gap-hori {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 12rpx;
    background-color: #eeeeee;
  }
}

.clear-btn {
  position: absolute;
  right: 0rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 84rpx;
  height: 80rpx;
}

.card-list {
  padding: 40rpx 100rpx 40rpx 100rpx;
  border-radius: 28rpx;

  text {
    font-weight: 400;
    font-size: 28rpx;
    color: #222222;
  }
}

.btn-box {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 80rpx);
  margin: 0 auto;
  margin-bottom: 40rpx;
  view {
    border-radius: 42rpx;
    font-weight: 600;
    font-size: 32rpx;
    padding: 20rpx 100rpx;
  }

  view:first-child {
    color: #222222;
    border: 2rpx solid #aaaaaa;
    background-color: #fff;
  }
  view:last-child {
    color: #fff;
    background: linear-gradient(132deg, #00bcb8 0%, #11ffbc 100%), #ff5871;
    border-radius: 42rpx;
  }
}

::v-deep {
  .u-navbar {
    .u-navbar__content__right {
      padding: 0rpx;

      .u-search__content {
        width: 528rpx;
      }
    }
  }

  .u-search {
    .u-search__content__label {
      margin: 0rpx;
    }

    .u-search__content {
      padding: 0rpx 0rpx 0rpx 34rpx;
      box-sizing: border-box;
      position: relative;
    }

    .u-search__action--active {
      box-sizing: border-box;
      margin-left: 0rpx;
      text-align: left;
      padding-left: 26rpx;
      padding-right: 40rpx;
      width: 122rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>