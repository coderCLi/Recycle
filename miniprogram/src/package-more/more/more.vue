<!--
 * @Description: 更多服务
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container ref="container" :props-data="propsData" class="main" @navBack="navBack">
    <!-- 全局组件： -->
    <view style="flex-shrink: 0;height: 52px;padding-bottom: 16px;">
      <!-- <vc-navbar :props-data="propsData" @navBack="navBack"/> -->
      <!-- <vc-serach /> -->
      <view style="
          display: flex;
          height: 52px;
          flex-shrink: 0;
          padding: 16px 40rpx 0;
        ">
        <!-- 搜索 -->
        <vc-search-box class="more-search-box" v-if="showResult == false" @toSearch="toResultPage"
          :props-data="searchPropsData"></vc-search-box>

        <up-search v-if="showResult == true" :actionStyle="searchActionStyle" :placeholder="placeholderText"
          :searchIcon="searchpng" searchIconSize="31.2rpx" v-model="keyword" height="80rpx" bgColor="#EFEEF3"
          placeholderColor="#999999" color="#333333" :focus="true" :clearabled="trueValue" shape="square"
          @custom="clickSearch" @search="clickSearch" @change="inputChange" @blur="blurAction">
        </up-search>
      </view>
    </view>
    <view class="tabs-more-box" v-if="showResult == false">
      <view class="tabs-more">
        <uv-vtabs :chain="trueValue" :list="dataList" keyName="serviceTypeName" :hdHeight="topDistance"
          barWidth="165rpx" :height="tabsHeight" @change="change" @scrolltolower="scrolltolower">
          <template v-for="(item, index) in dataList" :key="index">
            <uv-vtabs-item :index="index">
              <view class="type-item" :class="{ 'flashing': active == index ? true : false }">
                <view class="type-title">
                  <text>{{ item.serviceTypeName }}</text>
                </view>
                <view class="type-content">
                  <view class="item" v-for="(itemSub, index2) in item.operateServiceExampleInfos" :key="index2"
                    :data-item="item" :data-itemsub="itemSub" @click="clickService">
                    <view class="image-box" style="width: 72rpx; height: 72rpx;">
                      <u-image :src="itemSub.imgurl" :showMenuByLongpress="falseValue" width="72rpx" height="72rpx" />
                      <view v-if="itemSub.isTips == '1'" class="tip-card">{{ itemSub.tipText }}</view>
                    </view>
                    <text class="name">{{ itemSub.serviceName }}</text>
                  </view>
                </view>
              </view>
              <view class="item-gap"></view>
            </uv-vtabs-item>
          </template>
          <vc-safe-bottom />
        </uv-vtabs>
      </view>
    </view>
    <!-- 结果展示 -->
    <view class="tabs-more-box result-box" v-else>
      <view class="result-content">
        <template v-if="resultList.length === 0 && canShowEmpty === true && keyword.length == 0">
        </template>
        <view class="empty-box" v-else-if="resultList.length === 0 && canShowEmpty === true">
          <view class="title-box"> 为您找到0个服务 </view>
          <vc-empty></vc-empty>
        </view>
        <template v-else>
          <scroll-view :style="`height: ${tabsHeight}`" :scroll-top="scrollTop" scroll-y="true" class="scroll-y"
            @scrolltolower="lowerReachBottom">
            <view class="result-item-box">
              <view class="result-item" v-for="(item, index) of resultList" :key="index" @click="clickResult(item)">
                <view class="txt-box">
                  <view class="txt-box ellipsis">{{ item.title }}</view>
                  <!-- <rich-text class="txt" :nodes="bridgeSdk.addMinioPrefixToImgSrc(item.title)"></rich-text> -->
                </view>
                <view class="hori-line"></view>
              </view>
              <vc-safe-bottom />
            </view>
          </scroll-view>
        </template>
      </view>
    </view>

  </vc-container>
</template>
<script>
import vcSearchBox from "@/components/library/base/vc-search-box/index.vue";
import uvVtabs from "@/uni_modules/uv-ui/uv-vtabs/components/uv-vtabs/uv-vtabs.vue";
import uvVtabsItem from "@/uni_modules/uv-ui/uv-vtabs/components/uv-vtabs-item/uv-vtabs-item.vue";
import { getSubjectList, getServiceList, getSearchInit, getSearchList, getOperateServiceVersion } from "../api/more";
import UText from "@/uni_modules/uview-plus/components/u--text/u--text.vue";
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
export default {
  name: "consumption",
  components: {
    UText,
    uvVtabs,
    uvVtabsItem,
    vcSearchBox
  },
  data() {
    return {
      // 层级是固定写法
      propsData: {
        props: {
          title: {
            value: "更多服务",
          },
          buttonType: {
            value: "pop"
          }
        },
      },
      searchPropsData: {
        props: {
          placeholder: {
            value: '搜索服务'
          }
        }
      },
      baseUrl: __VITE_SERVER_BASEURL__,
      trueValue: true,
      falseValue: false,
      windowHeight: 0,
      // tabsHeight: "0px",
      dataList: [],
      subjectId: "",
      searchpng: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/search.png",
      wupng: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/wu.png",
      keyword: "",
      showResult: false,
      canShowEmpty: false,
      resultList: [],
      countlimit: 20,
      currentpage: 0,
      // 没有更多
      nomore: false,
      orderFlag: "1", // 便民、生活，左面1，右面2
      type: "2", // 主页1 更多2
      placeholderText: "搜索服务",
      selectTheme: {},
      serviceThemeImages: {
        image_select: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/service_select.png",
        image: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/service.png",
        text: "服务",
        type: ["local_index_02", "local_index_04", "local_index_06", "local_index_08", "local_index_10", "local_index_12"]
      },
      localversionKey: "moreversion",
      localSaveData: {
        newVersion: 0,
        subjectId: '',
        data: {}
      },
      active: -1,
    };
  },
  async onLoad(options) {
    // this.onShareAppMessageData = {
    //   // 转发标题，当前小程序名称	
    //   title: "更多服务",
    //   // 转发路径，当前页面 path ，必须是以 / 开头的完整路径	
    //   path: "/pages/more/more?subjectId=" + this.subjectId + "&orderFlag=" + this.orderFlag + "&pageType=" + this.type,
    //   // 自定义图片路径，支持PNG及JPG，显示图片长宽比是 5:4，小程序使用页面默认截图，h5使用logo图base64
    //   imageUrl: "https://life.hihihi.com.cn/hbdbucket/2024/12/16/09/wx241216093202395001616.png",
    //   // 如下为App专用参数
    //   content: "更多服务，让生活更美好！",
    //   // 值为miniCard或无该字段时，点击卡片跳转小程序，值为url时，点击卡片跳转如下url对应的网站
    //   shareType: "miniCard",
    //   // shareType为url时，跳转到该网站，否则字段留做备用，仅当shareType为miniCard且微信不支持小程序跳转时，才会跳转到该网站
    //   url: "https://www.baidu.com",
    //   // 值为miniCard或无该字段时，点击卡片跳转的微信小程序原始id
    //   miniAPPID: "",
    //   // 值为miniCard或无该字段时，点击卡片跳转的微信小程序页面路径
    //   miniAPPPath: "",
    //   // 分享类型 0：好友列表，1：朋友圈，2：收藏
    //   type: "0"
    // };

    // await this.firstInit();
    console.log("async onLoad(options) { 搜索更多 --------")
    console.dir(options);
    this.options = options;
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onReady() {

  },
  computed: {
    ...mapState(useBaseStore, {
      windowInfo: "windowInfo",
      navigationBarInfo: "navigationBarInfo",
    }),
    searchActionStyle() {
      return this.keyword.length > 0 ? {} : { "color": "#999999" };
    },
    tabsHeight() {
      const searchBoxHeight = 68;
      const topDistance = 0;
      // 屏幕总高度 - 状态栏高度 - 导航栏高度 - tab顶部间距
      return this.windowInfo.screenHeight - this.navigationBarInfo.statusBarHeight - this.navigationBarInfo.navigationBarHeight - topDistance - searchBoxHeight + "px";
    },
    topDistance() {
      const searchBoxHeight = 68;
      const topDistance = 0;
      return this.navigationBarInfo.statusBarHeight + this.navigationBarInfo.navigationBarHeight + topDistance + searchBoxHeight + "px";
    }
  },
  onUnload() { },
  methods: {
    async __loadData__() {
      console.log("async __loadData__() {");
      this.subjectId = this.options.subjectId || "";
      this.orderFlag = this.options.orderFlag ? this.options.orderFlag + "" : ""
      this.type = this.options.pageType ? this.options.pageType + "" : this.type;

      await this.getVersion();
      this.getRecommendList();
    },
    navBack() {
      console.log('llllll');

      if (this.showResult) {
        this.showResult = false;
        this.resultList = [];
        this.keyword = "";
      } else {
        this.bridgeSdk.navigateBackTo({ delta: 1 });
      }
    },
    async getVersion() {
      return new Promise((resolve, reject) => {
        getOperateServiceVersion().then((res) => {
          console.log('-------版本号 ---', res);

          const vKey = this.localversionKey + '-' + this.subjectId;
          let localData = this.bridgeSdk.getStorageSync(vKey) ? JSON.parse(this.bridgeSdk.getStorageSync(vKey)) : null;
          let comparisonVersion = localData && localData && localData.newVersion && res && res.newVersion && (parseInt(res.newVersion) == parseInt(localData.newVersion))
          let comparisonParam = localData && localData.subjectId && localData.subjectId.length > 0 && localData.subjectId == this.subjectId;
          let haveData = localData && localData.data && localData.data.length > 0;
          if (comparisonParam && comparisonVersion && haveData) {
            console.log('本地数据', localData.data)
            // 本地版本和网上版本 一致
            this.handleServiceList(localData.data)
          } else {
            this.localSaveData.newVersion = parseInt(res.newVersion || 0)
            this.localSaveData.subjectId = this.subjectId || ''

            this.getList({ subjectId: this.subjectId });
          }
          resolve();
        })
          .catch(async () => {
            this.localSaveData.newVersion = parseInt(0)
            this.localSaveData.subjectId = this.subjectId || ''

            await this.getList({ subjectId: this.subjectId });
            reject();
          });
      })
    },
    getList(dic) {
      return new Promise((resolve, reject) => {
        getServiceList({ ...dic })
          .then((res) => {
            console.log("--getServiceList");
            console.dir(res);
            const vKey = this.localversionKey + '-' + this.subjectId;
            this.localSaveData.data = res;
            this.bridgeSdk.setStorageSync(vKey, JSON.stringify(this.localSaveData));

            this.handleServiceList(res)

            resolve();
          })
          .catch(() => {
            const vKey = this.localversionKey + '-' + this.subjectId;
            let localData = this.bridgeSdk.getStorageSync(vKey) ? JSON.parse(this.bridgeSdk.getStorageSync(vKey)) : null;
            let haveData = localData && localData.data && localData.data.length > 0;
            if (haveData) {
              console.log('都失败，本地数据', localData.data)
              // 本地版本和网上版本 一致
              this.handleServiceList(localData.data)
            }

            // Toast.clear();
            // Toast("网络异常，请稍后重试");
            reject();
          });
      });
    },
    handleServiceList(res) {
      // Toast.clear();
      if (Object.prototype.toString.call(res) === "[object Array]") {
        this.dataList = res;
        this.dataList.forEach((e1) => {
          e1.operateServiceExampleInfos = e1.operateServiceExampleInfos.map((element) => {
            element.imgurl = this.minioBaseUrl + element[`smallPhotoUrl`];
            element.staticUrl = this.minioBaseUrl + element[`smallPhotoUrl`];
            element.name = element.serviceName;
            element.id = element.selfServiceId;
            // console.log("element.url ---- " + element.url);
            return element;
          });
        });
      } else {
        // Toast(res.msg);
      }
    },
    change(index) {
      console.log("选项改变：", index);
      this.active = index;
    },
    scrolltolower(index) {
      console.log("内容滚动到底部触发：", index);
    },
    clickService(e) {
      console.log(
        e.currentTarget.dataset.item.serviceTypeName +
        "-" +
        e.currentTarget.dataset.itemsub.serviceName
      );
      let itemsub = e.currentTarget.dataset.itemsub;
      let path = itemsub.url + "";
      this.bridgeSdk.toServicePage(path, itemsub, itemsub.subjectId);
    },
    toResultPage() {
      if (this.showResult) { return }
      this.showResult = true
      this.getRecommendList(true);
    },
    clickSearch() {
      this.keyword = (this.keyword || "").trim();
      if (this.keyword.length < 1) {
        return;
      }
      console.log("点击搜索，开始搜索" + this.keyword);
      console.dir(this.keyword);
      this.showResult = true;
      this.resultList = [];
      this.getSearchFirstPage();
    },
    inputChange(string) {
      console.log("输入改变 " + this.keyword);
      this.canShowEmpty = false;
      this.resultList = [];
    },
    blurAction() {
      if (!this.keyword || this.keyword.length == 0) {
        this.resultList = [];
      }
    },
    getRecommendList(mask = false) {
      let isThemeNo = !this.selectTheme || !this.selectTheme.dsId || this.selectTheme.dsId.length == 0;
      if (!isThemeNo) { // 主题存在
        console.log('------主题存在，跳过')
        return;
      }
      console.log('------主题不存在，请求接口')
      // 网络请求，开始搜索
      let data = {
        orderFlag: this.orderFlag,
        type: this.type,
      };
      // uni.showLoading();
      getSearchInit(data, mask)
        .then((res) => {
          // uni.hideLoading();
          if (res) {
            console.info(res);
            this.placeholderText = res.searchText;
            this.searchPropsData.props.placeholder.value = res.searchText;
            this.$set(this, "searchPropsData", this.searchPropsData);
            let themeList = res.themeList || [];
            themeList = themeList.filter((item) => {
              console.log("let dsId = item.dsId;");
              console.dir(item);
              let dsId = item.dsId;
              if (dsId && dsId.length > 0) {
                if (this.serviceThemeImages.type.includes(dsId)) {
                  return true;
                }
              }
            });
            this.selectTheme = {};
            if (themeList.length > 0) {
              this.selectTheme = themeList[0];
              console.log("----------------");
              console.dir(this.selectTheme);
            }
          } else {
            this.selectTheme = {};
          }
          this.$set(this, "selectTheme", this.selectTheme);
        })
        .catch(() => {
          // uni.hideLoading();
        });
    },
    scrollTop() { },
    // 从第一页开始查询
    getSearchFirstPage() {
      this.nomore = false;
      this.currentpage = 0;
      this.getSearchList("" + this.keyword, 0);
    },
    lowerReachBottom() {
      console.log("触底");
      if (this.nomore) { return };
      console.log("触底1");
      this.getSearchList("" + this.keyword, this.currentpage + 1);
    },
    getSearchList(wordStr, page) {
      if (!this.selectTheme || !this.selectTheme.dsId || this.selectTheme.dsId.length == 0) {
        uni.showToast({
          icon: 'none',
          title: "缺少主题id，请退出重进"
        });
        return;
      }
      wordStr = (wordStr || "").trim();
      let _page = page;
      let dic = {
        page: "" + _page,
        keyword: wordStr || "",
        rows: "" + this.countlimit,
      };
      let themeObject = { ...this.selectTheme, ...dic };
      themeObject.image_select = undefined;
      themeObject.image = undefined;
      themeObject.type = undefined;
      let data = { data: [themeObject] };
      uni.showLoading();
      this.canShowEmpty = false;
      getSearchList(data, { catchError: true })
        .then((res) => {
          this.currentpage = _page;
          this.showResult = true;
          uni.hideLoading();
          this.canShowEmpty = true;
          console.log("getSearchList");
          console.dir(res);
          if (res) {
            let tempArr = [];
            // 外层循环遍历外层数组
            for (let i = 0; i < res.length; i++) {
              let firstItem = res[i];
              let list = firstItem.list || [];
              // firstItem.list = null;
              let tempItemArr = [];
              // 处理title显示
              list.forEach((dic) => {
                // if (dic.title.length > 0 && wordStr.length > 0) {
                //   let str = dic.title;
                //   var index = str.indexOf(wordStr);
                //   if (index > -1) {
                //     dic.title = dic.title;
                //     let start = str.slice(0, index);
                //     let end = str.slice(index + wordStr.length);
                //     let _title =
                //       start +
                //       `<span style='color: #00BCB8;'>${wordStr}</span>` +
                //       end;
                //     dic.title = `<div style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>${_title}</div>`;
                //   }
                // }
                // console.dir(dic);
                tempItemArr.push({ ...firstItem, ...dic });
                // console.dir(tempItemArr);
              });
              if (tempItemArr.length > 0) {
                tempItemArr.forEach((item) => {
                  tempArr.push(item);
                });
              }
            }
            this.nomore = tempArr.length < this.countlimit
            if (_page === 0) {
              this.resultList = tempArr;
            } else if (tempArr.length > 0) {
              this.resultList.push(...tempArr);
            }
          }
          console.log("resultList");
          console.dir(this.resultList);
        })
        .catch((data) => {
          console.dir(data);
          this.showResult = true;
          uni.hideLoading();
          this.canShowEmpty = true;
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: data.message || ""
            })
          }, 300);
        });
    },
    clickResult(item) {
      console.log("点击结果" + item.url + item.id);
      console.info(item);
      let path = item.url;
      this.bridgeSdk.toServicePage(path, item, item.subjectId);
      // this.showResult = false;
      // this.resultList = [];
      // this.keyword = "";
    },
  },
  // onShareAppMessage(res) {
  //   console.log("onShareAppMessage", res, this.onShareAppMessageData);
  //   this.trackReport.trackCustom("分享微信-" + this.onShareAppMessageData.title);
  //   return this.onShareAppMessageData;
  // }
};
</script>

<style lang="scss" scoped>
.main {
  box-sizing: border-box;
  background: rgb(245, 246, 248);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::v-deep .container {
    .page-content {
      height: 100vh;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
}

.tabs-more-box {
  // margin-top: 10px;
  flex: 1;
  display: flex;
  align-items: stretch;

  .tabs-more {
    display: flex;
    flex-direction: row;
    flex: 1;
  }
}

.type-item.flashing {
  animation: flashBorder 1s ;
}

@keyframes flashBorder {
  0% {
    border-color: #00bcb9;
  }

  100% {
    border-color: #ffffff;
  }
}

.type-item {
  background-color: #ffffff;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  border: 2px solid #ffffff;

  .type-title {
    padding-left: 24rpx;
    padding-top: 24rpx;
    font-weight: 700;
    font-size: 28rpx;
    color: #000000;
  }

  .type-content {
    padding: 20rpx 24rpx 27rpx;
    display: flex;
    flex-wrap: wrap;

    .item {
      flex: 0 0 25%;
      padding: 10rpx 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .image-box {
        position: relative;
      }

      .tip-card {
        font-size: 7px;
        position: absolute;
        right: -3.5px;
        top: -4px;
        height: 12px;
        line-height: 12px;
        width: 12px;
        text-align: center;
        border-radius: 6px;
        overflow: hidden;
        background-color: red;
        color: rgba(255, 255, 255, 0.85);
      }

      .name {
        margin-top: 8rpx;
        color: #000000;
        text-align: center;
        font-size: 24rpx;
        line-height: 34rpx;
      }
    }
  }
}

.item-gap {
  height: 18rpx;
  background-color: rgb(245, 246, 248);
}

.result-content {
  width: 100%;

  .title-box {
    box-sizing: border-box;
    width: 100%;
    padding-left: 40rpx;
    padding-right: 38rpx;
  }

  .empty-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
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
        color: #00BCB8;
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
    background: #F4F4F4;
  }

  .result-item-box {
    &:first-child {
      margin-top: 22rpx;
    }
  }

  .result-item {
    padding-left: 40rpx;
    padding-right: 38rpx;
    height: 80rpx;
    position: relative;
    display: flex;
    align-items: center;

    &:last-child {
      .hori-line {
        display: none;
      }
    }

    .hori-line {
      height: 1rpx;
      background-color: #dadada;
      position: absolute;
      bottom: 0rpx;
      left: 40rpx;
      right: 38rpx;
    }

    .txt-box {
      flex: 1;
      overflow: hidden;

      .txt {
        width: 100%;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
      }
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

.more-search-box {
  width: 100%;
  background-color: rgb(245, 246, 248);
}

.txt-box {
  padding-left: 30rpx;
}

.main ::v-deep .container {
  overflow: hidden;
}

::v-deep {
  .component {
    width: 100%;

    .search-box {
      background-color: rgb(245, 246, 248);
      padding-left: 0rpx;
      padding-right: 0rpx;
    }
  }

  .uv-vtabs {
    display: flex;
    flex-direction: row;
    flex: 1;

    .uv-vtabs__bar-item-active {
      background-color: rgb(245, 246, 248);
    }

    .uv-vtabs__bar {
      background-color: rgb(245, 246, 248);
    }

    .uv-vtabs__content {
      background-color: rgb(245, 246, 248);
    }

    .uv-vtabs-item {
      background-color: rgb(245, 246, 248);
      padding-right: 26rpx;
    }
  }

  .uv-vtabs .uv-vtabs__bar-item-active {
    background-color: rgba(0, 0, 0, 0);
  }

  .uv-vtabs .uv-vtabs__bar-item {
    padding-left: 22rpx;
    padding-right: 0rpx;
    padding-top: 10rpx;
    padding-bottom: 50rpx;

    .uv-vtabs__bar-item--line {
      background-color: #00bcb9;
      width: 6.6rpx;
      height: 28.5rpx;
      top: 14rpx;
    }

    .uv-vtabs__bar-item--value {
      font-size: 28rpx;
      color: #34495e;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .uv-vtabs__bar-item-active--value {
      font-weight: 700;
      color: #00bcb9;
    }
  }
}
</style>
