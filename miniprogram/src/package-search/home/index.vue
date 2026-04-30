<template>
  <vc-modal ref="modal"></vc-modal>
  <view class="main">
    <!-- 全局组件： -->
    <view style="flex-shrink: 0; overflow: hidden;" id="navbar-search" :style="{paddingTop: `${safeTopDistance + 20}px`}">
      <!-- #ifdef MP-WEIXIN -->
      <!-- <vc-navbar
        :props-data="propsData"
        :class="keyword.length &gt; 0 ? 'hidden-search' : ''"
        @navBack="navBack"
      >
      </vc-navbar> -->
      <!-- <view
        style="
          display: flex;
          height: 80rpx;
          flex-shrink: 0;
          padding: 0rpx 40rpx;
          margin-top: 12rpx;
        "
      >
        <up-search
          :placeholder="placeholderText"
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
        >
        </up-search>
      </view> -->
      <!-- #endif -->

      <vc-navbar
        :props-data="propsData"
        :class="keyword.length &gt; 0 ? 'hidden-search' : ''"
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
              @blur="clickSearch('blur')"
              @clear="clickSearch"
            >
            </up-search>
          </view>
        </template>
      </vc-navbar>

    </view>
    <view class="content-box" v-if="showResult === false">
      <scroll-view
            :style="`height: ${contentBoxHeight}`"
            :scroll-top="scrollTop"
            scroll-y="true"
            class="scroll-y"
          >
        <!-- 搜索记录 -->
        <view class="title-box" v-if="recordList.length > 0">
          搜索记录
          <image
            class="delete-btn"
            @click="clickDelete"
            style="width: 26rpx; height: 30rpx"
            :src="deletepng"
            model="aspectFit"
          />
        </view>
        <view class="search-record" v-if="recordList.length > 0">
          <template v-if="recordList.length &gt; 0">
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
        <!-- 推荐 -->
        <view class="title-box">推荐</view>
        <view class="recommend">
          <template v-if="recommendList.length &gt; 0">
            <view
              class="item"
              v-for="(item, index) of recommendList"
              :key="index"
              @click="clickRecommend(item)"
            >
              {{ item }}
            </view>
          </template>
          <view v-else class="no-data"> 暂无推荐 </view>
        </view>
      </scroll-view>
    </view>
    <!-- 结果展示 -->
    <view class="content-box result-box" v-else>
      <view class="result-content" >
        <view class="theme-box" v-if="themeList.length &gt; 0">
          <view class="theme-item" v-for="(item, index) in themeList" :class="`${item.dsId === selectTheme.dsId ? 'select': ''}`" @click="clickTheme(item)" :key="index">
            <image class="img" style="width: 33rpx; height: 33rpx;" :src="item.dsId === selectTheme.dsId ? item.image_select : item.image" model="aspectFit" />
            <text class="txt">{{ item.text }}</text>
          </view>
          <view class="theme-item"></view>
          <view class="theme-item"></view>
        </view>
        <view class="theme-line" v-if="themeList.length &gt; 0"></view>
        <template v-if="resultList.length === 0 && switchThemeStatus === 1">
          <view class="title-box"> 为您找到0{{ selectTheme.text == "资讯" ? "条" : "个" }}{{ selectTheme.text }} </view>
          <view class="no-result">
            <image
              class="img"
              style="width: 260rpx; height: 248rpx"
              :src="wupng"
              model="aspectFit"
            />
            <text class="txt">您换个词再试试?</text>
          </view>
        </template>
        <template v-else>
          <scroll-view
            :style="`height: ${resultBoxHeight}`"
            :scroll-top="scrollTop"
            scroll-y="true"
            class="scroll-y"
            @scrolltolower="lowerReachBottom"
          >
            <view class="result-item-box">
              <view
                class="result-item"
                v-for="(item, index) of resultList"
                :key="index"
                @click="clickResult(item)"
              >
                <view class="txt-box">
                  <view class="txt ellipsis">{{ item.title }}</view>
                  <!-- <rich-text class="txt" :nodes="bridgeSdk.addMinioPrefixToImgSrc(item.title)"></rich-text> -->
                </view>
                <view class="hori-line"></view>
              </view>
            </view>
          </scroll-view>
        </template>
      </view>
    </view>
    <view style="flex-shrink: 0">
      <vc-safe-bottom />
    </view>
  </view>
</template>
<script>
import { getSearchInit, getSearchList, getDataDicList } from "../api/search.ts";
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
export default {
  name: "homesearch",
  components: {},
  data() {
    return {
      // 层级是固定写法
      propsData: {
        props: {
          title: {
            value: "搜索",
          },
          buttonType: {
            value: "pop"
          },
          showMore: {
            value: false
          }
        },
      },
      orderFlag: "1", // 便民、生活，左面1，右面2
      type: "1", // 主页1 更多2
      searchpng: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/search.png",
      xpng: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/x.png",
      wupng: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/wu.png",
      deletepng: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/delete.png",
      themeboxHeight: '0', // px
      selectTheme: {},
      trueValue: true,
      falseValue: false,
      inputStyle: {
        "border-radius": "20rpx",
      },
      saveSearchKey: "HomeSearchOldKeys",
      keyword: "",
      // 是否展示搜索结果页
      showResult: false,
      recordList: [],
      recommendList: [],
      placeholderText: "请输入关键词",
      themeList: [],
      resultList: [],
      // 1完成切换 2开始切换 0默认
      switchThemeStatus: 0,
      screenHeight: 0,
      resultBoxHeight: "0px",
      contentBoxHeight: "0px",
      countlimit: 20,
      currentpage: 0,
      // 没有更多
      nomore: false,
      // 记录请求init接口的数据
      themeArr: [],
      // 是否请求过init接口的数据
      isSearchInit: false,
      isHomepageDic: false,
      // 记录字典的数据
      themeImages: [
        // {
        //   image_select: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/service_select.png",
        //   image: this.staticBaseUrl + '/hbdimage' + "/package-search/static/images/service.png",
        //   text: "服务",
        //   themeTypeTag: "fuwu",
        //   type: ["local_index_02", "local_index_04", "local_index_06", "local_index_08", "local_index_10", "local_index_12", "app_homepage_index_01", "app_homepage_index_02", "mini_homepage_index_01", "mini_homepage_index_02"]
        // },
      ],
      searchYanchiFunc: null,
    };
  },
  computed: {
    ...mapState(useBaseStore, {
        safeTopDistance: 'safeTopDistance'
    }),
    searchActionStyle() {
      return this.keyword.length > 0 ? {} : { "color": "#999999" };
    }
  },
  async onLoad(options) {
    await this.firstInit();
    console.log("async onLoad(options) { 搜索首页 --------")
    console.dir(options);
    this.options = options;
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
      return;
    }
    this.__loadData__();
  },
  onUnload() {
    if (this.searchYanchiFunc != null) {
      this.searchYanchiFunc.clear();
      this.searchYanchiFunc = null;
    }
  },
  methods: {
    async __loadData__() {
      this.orderFlag = this.options.orderFlag ? this.options.orderFlag + "" : ""
      this.type = this.options.pageType ? this.options.pageType + "" : ""
      
      const windowInfo =await this.bridgeSdk.getWindowInfo();
      this.themeboxHeight = windowInfo.windowWidth / 750 * (88 + 8);
      await this.getDictionary();
      this.loadLocalKeyword();
      this.getRecommendList();

      let that = this;
      setTimeout(() => {
        let query = uni.createSelectorQuery().in(that);
        query
          .select(".content-box")
          .boundingClientRect((data) => {
            that.contentBoxHeight = (data.height || data.dataset.height) + "px";
            that.resultBoxHeight = (data.height || data.dataset.height) - that.themeboxHeight + "px";
            console.log(that.resultBoxHeight);
          })
          .exec();
      }, 10);
    },
    scrollTop() {},
    lowerReachBottom() {
      console.log("触底");
      if (this.nomore) { return };
      console.log("触底开始加载");
      this.getSearchList("" + this.keyword, this.currentpage + 1);
    },
    inputChange(string) {
      console.log("输入改变 " + this.keyword);
      this.showResult = false;
      this.resultList = [];
    },
    clickClear() {
      this.keyword = "";
    },
    clickSearch(type) {
      function throttle(truefunc, limit) {
        let lastFunc;
        let lastDate;

        return {
          delayAction: function() {
            const context = this;
            const args = arguments;

            if (!lastDate) {
              truefunc.apply(context, args);
              lastDate = Date.now();
            } else {
	            if (lastFunc) {
                 clearTimeout(lastFunc);
              }
              if (!lastDate) {
	              lastDate = Date.now();
              }
              lastFunc = setTimeout(function() {
                if ((Date.now() - lastDate) >= limit) {
                  truefunc.apply(context, args);
                  lastDate = Date.now();
                }
              }, limit - ((Date.now() - lastDate) > 0 ? (Date.now() - lastDate) : 0));
            }
          },
          startAction: function() {
            const context = this;
            const args = arguments;
            if (lastFunc) {
                clearTimeout(lastFunc);
            }
            if (!lastDate) {
              lastDate = Date.now();
            }
	          truefunc.apply(context, args);
          },
          clear: () => {
            if (lastFunc) {
              clearTimeout(lastFunc);
            }
            lastFunc = null;
            lastDate = null;
          }
        }
      }

      if (this.searchYanchiFunc == null) {
         this.searchYanchiFunc = throttle(()=>{
            this.trueSearch()
          }, 9)
      }

      if (type) {
        this.searchYanchiFunc.delayAction();
      } else {
        this.searchYanchiFunc.startAction();
      }
    },
    trueSearch() {
      this.keyword = (this.keyword || "").trim();
      if (this.keyword.length < 1) {
        return;
      }
      if(this.time && new Date().getTime() - this.time < 1000){
        return;
      }
      this.time = new Date().getTime();
      console.log("点击搜索框右侧" + this.keyword);
      console.dir(this.keyword);
      this.saveLocalKeyword("" + this.keyword);
      if (this.themeList.length > 0 && Object.keys(this.selectTheme) == 0) {
        this.selectTheme = this.themeList[0];
      }

      this.trackReport.trackCustom("搜索-" + this.keyword);

      this.getSearchFirstPage();
    },
    clickRecord(item) {
      console.log("点击搜索过的记录 --clickRecord");
      console.dir(item);
      this.keyword = "" + item;

      this.clickSearch();
    },
    clickRecommend(item) {
      console.log("点击推荐 --clickRecommend");
      console.dir(item);
      this.keyword = "" + item;
      
      this.clickSearch();
    },
    clickResult(item) {
      console.log("点击结果" + item.url + item.id);
      let path = item.url;
      if (item.themeTypeTag == 'zixun') {
        path = `/package-general-services/information/detail?id=${item.id}`
      }
      this.bridgeSdk.toServicePage(path, item, item.subjectId);
    },
    clickDelete() {
      console.log("点击删除，删除搜索记录");
      this.deleteLocalKeyword();
    },
    // 从第一页开始查询
    clickTheme(theme) {
      this.switchThemeStatus = 2;
      this.resultList = [];
      this.selectTheme = theme
      this.getSearchFirstPage();
    },
    // 重新从第一页开始搜素
    getSearchFirstPage() {
      this.nomore = false;
      this.currentpage = 0;
      this.getSearchList("" + this.keyword, 0);
    },
    // 获取搜索的结果列表
    getSearchList(wordStr, page) {
      if (wordStr.length < 1) {
        this.showResult = true;
        this.resultList = [];
        this.switchThemeStatus = 0;
        return;
      }
      if (!this.selectTheme || !this.selectTheme.dsId || this.selectTheme.dsId.length == 0) {
        uni.showToast({
            icon: 'none',
            title: "缺少主题id，请退出重进"
        });
        return;
      }
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
      let themeTypeTag = this.selectTheme.themeTypeTag;
      let data = {data: [themeObject]};
      console.log("let data = {data: [themeObject]};   -----");
      console.dir(data);
      uni.showLoading();
      getSearchList(data, {catchError: true})
        .then((res) => {
          this.switchThemeStatus = 1;
          this.currentpage = _page;
          this.showResult = true;
          uni.hideLoading();
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
                dic.themeTypeTag = themeTypeTag;
                // console.dir(dic);
                tempItemArr.push({ ...firstItem, ...dic });
                // console.dir(tempItemArr);
              });
              if (tempItemArr.length > 0) {
                tempItemArr.forEach((item)=> {
                  tempArr.push(item);
                });
              }
            }
            this.nomore = tempArr.length < this.countlimit
            if (_page === 0) {
              this.resultList = tempArr;
            } else if (tempArr.length > 0){
              this.resultList.push(...tempArr);
            }
          }
          console.log("resultList");
          console.dir(this.resultList);
        })
        .catch((data) => {
          this.switchThemeStatus = 1;
          // this.showResult = true;
          uni.hideLoading();
          // this.canShowEmpty = true;
          setTimeout(() => {
            uni.showToast({
                icon: 'none',
                title: data.message || ""
            })
          }, 300);
        });
    },
    // 获取推荐列表和主题
    getRecommendList() {
      let data = {
        orderFlag: this.orderFlag,
        type: this.type,
      };
      uni.showLoading();
      getSearchInit(data)
        .then((res) => {
          uni.hideLoading();
          this.isSearchInit = true
          if (res) {
            this.placeholderText = res.searchText;
            this.recommendList = res.searchHot.split(";");
            this.themeArr = res.themeList || []
            this.handleSearchThemeList();
          } else {
            this.recommendList = [];
            this.themeList = [];
            this.selectTheme = {};
            this.$set(this, "recommendList", this.recommendList);
            this.$set(this, "themeList", this.themeList);
            this.$set(this, "selectTheme", this.selectTheme);
          }
        })
        .catch(() => {
          this.isSearchInit = true
          uni.hideLoading();
        });
    },
    handleSearchThemeList() {
      if (this.isSearchInit && this.isHomepageDic) {
        // 主题列表  --- 接口
        let themeList = this.themeArr || [];
        
        // 1排序（服务、资讯、 ...）， 2 加图片
        let sortFirstList = [];
        let sortNormalList = [];
        const themeImageCount = this.themeImages.length;
        for (let i = 0; i < themeImageCount; i++) {
          let _themeImage = this.themeImages[i];
          let _index = themeList.findIndex((item) => {
            let dsId = item.dsId;
            if (dsId && dsId.length > 0) {
              return _themeImage.type.includes(dsId);
            }
            return false;
          });
          if (_index > -1 && themeList.length > _index) {
            let item = themeList[_index];
            // 匹配到  app中的主题id，新增到  sortFirstList
            sortFirstList.push({...item, ..._themeImage});
          }
        }
        themeList.forEach((item)=>{
          let dsId = item.dsId;
          let _first = false;
          if (dsId && dsId.length > 0) {
            for (const dic of this.themeImages) {
              if (dic.type.includes(dsId)) {
                _first = true;
                break;
              }
            }
          }
          if (_first == false) {
            sortNormalList.push(item);
          }
        });

        themeList = [...sortFirstList, ...sortNormalList];
        this.themeList = [];
        this.selectTheme = {};
        if (themeList.length > 0) {
          this.selectTheme = themeList[0];
          this.themeList = themeList;
        }
        this.$set(this, "recommendList", this.recommendList);
        this.$set(this, "themeList", this.themeList);
        this.$set(this, "selectTheme", this.selectTheme);
      }
      
    },
    async getDictionary() {
      let _code  = "APP_HOMEPAGE"
      // #ifdef MP
      _code = "MINI_HOMEPAGE"
      // #endif
      let res = await getDataDicList({
        code: _code
      })
      this.isHomepageDic = true;
      if (res && res.length > 0) {
        res.forEach(e=> {
          const _names = e.optName.split(",");
          if (_names && _names.length == 4) {
            const _tag = _names[0];
            const _pic = _names[1];
            const _selectpic = _names[2];
            const _ming = _names[3];
            const themeIndex = this.themeImages.findIndex(t=> {
              return t.themeTypeTag == _tag;
            })
            if (_tag && _tag.length > 0) {
              if (themeIndex > -1) {
                let themeImg = this.themeImages[themeIndex];
                themeImg.type = [...themeImg.type, _tag]
                themeImg.type = [...new Set(themeImg.type)];
              } else {
                this.themeImages = [...this.themeImages, {
                  image_select: this.minioBaseUrl + _selectpic,
                  image: this.minioBaseUrl + _pic,
                  text: _ming,
                  themeTypeTag: _tag,
                  type: [e.optCode]
                }]
              }
            }
            
          }
        })
      } else {
        this.themeImages = [];
      }
      this.handleSearchThemeList()
      console.log('数据字典', res);
    },
    // 本地保存搜索记录
    loadLocalKeyword() {
      let key = this.saveSearchKey;
      uni.getStorage({
        key,
        success: (res) => {
          var OldKeys = JSON.parse(res.data);
          this.recordList = OldKeys;
        },
      });
    },
    //清除历史搜索
    deleteLocalKeyword() {
      let key = this.saveSearchKey;
      this.bridgeSdk.showConfirm({
        content: "确定删除所有搜索记录历史吗？",
        confirmText: "确定",
        cancelText: "取消",
        confirmCallback: (res) => {
          console.log("点击确认", res);
          console.log("用户点击确定");
          this.recordList = [];
          uni.removeStorage({
            key,
          });
        },
        cancelCallback: (res) => {
          console.log("点击取消", res);
        }
      });
    },
    //保存关键字到历史记录
    saveLocalKeyword(keyword) {
      if (keyword.length === 0) {
        return;
      }
      let maxCount = 10; //最多10个纪录
      let key = this.saveSearchKey;
      uni.getStorage({
        key,
        success: (res) => {
          var OldKeys = JSON.parse(res.data);
          var findIndex = OldKeys.indexOf(keyword);
          if (findIndex == -1) {
            OldKeys.unshift(keyword);
          } else {
            OldKeys.splice(findIndex, 1);
            OldKeys.unshift(keyword);
          }
          OldKeys.length > maxCount && OldKeys.pop();
          uni.setStorage({
            key,
            data: JSON.stringify(OldKeys),
          });
          this.recordList = OldKeys; //更新历史搜索
        },
        fail: (e) => {
          var OldKeys = [keyword];
          uni.setStorage({
            key,
            data: JSON.stringify(OldKeys),
          });
          this.recordList = OldKeys; //更新历史搜索
        },
      });
    },
    navBack() {
      if (this.showResult) {
        this.showResult = false;
        this.resultList = [];
      } else {
        this.bridgeSdk.navigateBackTo({ delta: 1 });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
#navbar-search{
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
