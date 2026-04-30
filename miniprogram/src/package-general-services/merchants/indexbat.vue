<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container :props-data="propsData" class="main">

    <view style="position: relative;width:100%;height: 130rpx;">
      <view class="search-box" style="position: fixed;z-index: 1;width: 750rpx;box-sizing: border-box; ">
        <u-search maxlength="20" height="40" placeholder="请输入" placeholderColor="#999" :showAction="false"
          @search="getSearch" @clear="inputBlur" @blur="inputBlur" v-model="keywords" :clearabled="true" shape="square"></u-search>
        <view @click="getSearch" class="search-right">搜索</view>
      </view>
    </view>

    <view class="tab-block" v-if="serviceList.length > 0 && showTabList">
      <view class="btn-blocks">
        <scroll-view scroll-x="true" class="btn-blocks-scroll" style="width: 100%;">
          <view class="flex" style="padding: 0 30rpx;">
            <view class="btn-blocks-wrap" v-for="(item, index) in serviceList" :key="index">
              <view @click="tabClick(item, index)" :class="[current == index ? 'active' : '', 'item', 'btn-blocks-item']">
                <image :src="minioBaseUrl + item.typeIconPhotoUrl" mode="scaleToFill" />
                <view :class="[current == index ? 'active' : '']" class="ellipsis text-item">
                  {{ item.mctTypeName }}
                </view>
                <view :class="[current != index ? 'opacity' : '', 'bor-bot']"></view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>   
    </view>

    <view class="scroll-block" :class="{ 'showTabList': serviceList.length > 0 && showTabList }">
      <vc-empty v-if="filteredList.length === 0"></vc-empty>

      <template v-else>
        <view class="scroll-item" v-for="(item, index) in filteredList" @click="goDirection(item)" :key="index">
          <view class="flex flex_ac">
            <image :src="minioBaseUrl + item.mctIconPhotoUrl" mode="scaleToFill" />
          </view>
          <view style="width:60%; flex: 1; margin-left: 24rpx;" class="flex flex_col flex-sb">
            <view class="flex flex_ac">
              <view
                style="line-height:66rpx; font-size: 29rpx;font-weight: bold;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:80%">
                {{ item.mctName }}</view>
                <image v-if="item.isSafeConsumption === '1'" :src="fxxflogoPng" mode="widthFix" style="width: 70rpx; height: 43rpx;margin-left: 20rpx;"/>
            </view>
            <view>
              <view class="ellipsis" style="font-size: 24rpx;color: #999;line-height:40rpx;">地址：{{ item.address }}
              </view>
              <view class="flex flex_ac card" style="font-size: 24rpx;height:auto; flex-wrap: wrap;color:#E08B3B;">
                <view>营业时间：{{ item.businessHours }}</view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <view v-if="filteredList.length > 0">
        <u-loadmore marginTop="30" marginBottom="50" :status="status"></u-loadmore>
      </view>
    </view>
    <!-- <vc-sub :props-data="propsDataSub" /> -->
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import { getMctServiceList, getMctBusinessTypeList } from '../api/baseServices';
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
import fxxflogoPng from "../static/fxxflogo.png"
export default {
  name: "merchant",
  data() {
    return {
      fxxflogoPng: fxxflogoPng,
      propsData: {
        props: {
          title: {
            value: '详情'
          },
          isFullScreen: {
            value: false
          },
        }
      },
      // 订阅服务id 
      propsDataSub: {
        props: {
          serviceId: {
            value: ''
          }
        }
      },
      serviceList: [],//二级分类 
      showTabList: true, // 显示当前二级分类

      selectedItem: '关注',
      page: 1,
      rows: 10,
      total: 0,
      status: 'loadmore',
      mctTypeId: '',
      current: null,//当前标签页 

      currentId: '',
      mctServiceId: '',
      keywords: '',
      filteredList: [],
      // baseUrl: ''
    }
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: 'safeTopDistance'
    })
  },
  async onLoad(options) {
    console.log("options: ", options);
    // 放心消费商家查询标识, 用于查询放心消费商家列表, 仅当放心消费商家入口才有该标志, 其他入口无
    this.isSafeConsumption = options.isSafeConsumption || "";
    this.propsData.props.title.value = options.title;
    this.mctServiceId = options.serviceId;//查询服务id 
    this.mctTypeId = this.bridgeSdk.checkIsEmpty(options.mctTypeId) ? options.mctTypeId : '';//二级分类id 匹配赋值
    this.showTabList = this.bridgeSdk.checkIsEmpty(options.mctTypeId) ? false : true;//二级分类id 隐藏tab切换
    this.propsDataSub.props.serviceId.value = options.subId;//订阅服务id
    this.getList();
  },
  onReachBottom() {
    if ((this.filteredList.length < this.total) && (this.filteredList.length > 0)) {
      this.status = 'loading'
      this.page = (+this.page + 1).toString()
      this.getListDetail();
    } else if (this.filteredList.length == this.total) {
      this.status = 'nomore'
    }
  },
  methods: {
    tabClick(e, i) {
      if (this.current == i) {
        this.current = null;
        this.mctTypeId = '';
        this.filteredList = [];
        this.getListDetail()
        // 重新加载全部接口 
        return;
      }
      this.page = 1;
      this.current = i
      this.mctTypeId = e.mctTypeId;
      this.filteredList = [];
      this.getListDetail();
    },
    getList() {
      let params = {
        // isSafeConsumption: this.isSafeConsumption,
        mctServiceId: this.mctServiceId,
      }
      getMctServiceList(params).then(res => {
        this.serviceList = res.mctTypeListBoList;
        if (this.serviceList.length > 0) {
          this.current = this.serviceList.findIndex(item => item.mctTypeId === this.mctTypeId);//匹配current
        } else {
          this.filteredList = []
        }
        this.getListDetail();
      })
    },
    getListDetail() {
      let params = {
        isSafeConsumption: this.isSafeConsumption,
        mctTypeId: this.mctTypeId,
        mctServiceId: this.mctServiceId,
        page: this.page,
        rows: this.rows,
        keywords: this.keywords
      }
      getMctBusinessTypeList(params).then(res => {
        this.total = res.total;
        this.filteredList = [...this.filteredList, ...res.list];
        if (this.total > this.filteredList.length) {
          this.status = 'loadmore'
        } else {
          this.status = 'nomore'
        }
        return;
      })
    },
    //商家列表
    goDirection(e) {
      console.log(e)
      this.bridgeSdk.jumpPage({
        title: `${this.propsData.props.title.value}-${e.mctName}`,
        url: '/package-general-services/merchants/detail?mctId=' + e.mctId + '&payMctId=' + e.payMctId + '&title=' + e.mctName, // 目标页面的路径  
      })
    },
    getSearch() {
      if (this.time && new Date().getTime() - this.time < 1000) {
        return
      }
      this.time = new Date().getTime();
      this.page = 1;
      this.filteredList = [];
      this.getListDetail();
    },
    inputBlur() {
      if (!this.bridgeSdk.checkIsEmpty(this.keywords)) {
        this.getSearch();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.text-item {
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 40rpx;
  width: 100%;
  text-align: center;
}
.map-container {
  width: 100%;
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
}

.main {
  background: #F0F0F4;
  height: auto;
  min-height: 100vh;
}


.search-box {
  background: white;
  height: 130rpx;
  padding: 20rpx 40rpx;
  margin-bottom: 18rpx;
  box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;

  ::v-deep .u-search__content__input {
    flex-basis: 68%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  ::v-deep .u-search__content {
    justify-content: flex-start;
  }

  .search-right {
    position: absolute;
    right: 40rpx;
    color: #999999;
    font-weight: 400;
    font-size: 28rpx;
    padding: 20rpx;
    z-index: 999;
  }

  .search-right::after {
    content: "";
    /* 伪元素需要内容来生成盒子模型，即使它是空的 */
    position: absolute;
    /* 绝对定位，相对于最近的定位祖先元素（这里是 .number-line） */
    left: -10rpx;
    /* 水平居中，需要配合 transform 来精确调整 */
    top: 50%;
    /* 垂直居中，同样需要配合 transform */
    width: 2rpx;
    /* 线条宽度 */
    height: 52rpx;
    /* 线条高度 */
    background: #D8D8D8;
    /* 线条颜色 */
    border-radius: 2rpx;
    /* 圆角 */
    transform: translate(-50%, -50%);
    /* 修正 left 和 top 的偏移，实现真正居中 */
  }

  .search-btn {
    width: 90rpx;
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    font-size: 24rpx;
    color: white;
    background-color: #10C2B7;
    border-radius: 40rpx;
  }

}

.tab-block {
  width: 100%;
  background-color: #f0f0f4;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 30rpx;
}

.btn-blocks {
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 90%;
  padding: 20rpx 0 5rpx 0;
  // margin: 40rpx auto;

  .btn-blocks-wrap {

    .btn-blocks-item {
      margin: 5rpx;
      border-radius: 20rpx;
      padding: 10rpx 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      width: 100rpx;

      image {
        width: 60rpx;
        height: 60rpx;

      }

      text {

        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 40rpx;

      }
    }
  }


}

.scroll-block {
  overflow: hidden;
  width: 90%;
  margin: 12rpx auto 0;
  &.showTabList{
  //   height: calc(100% - 124rpx - 162rpx - 90rpx);
  //   overflow-y: auto;
    padding-top: calc(162rpx + 30rpx);
  }

  .scroll-item {
    background-color: white;
    margin-top: 20rpx;
    box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx 24rpx;

    .scroll-item:first-child {
      display: flex;
      align-items: center;
    }

    image {
      width: 200rpx;
      height: 138rpx;
      border-radius: 8rpx;
    }

    .scroll-item:last-child {
      border-bottom: none;
    }
  }
}

.card {
  view {
    font-size: 24rpx;
  }
}

.active {
  color: #23BAAB !important;
  font-weight: 800;
}

.bor-bot {
  width: 40rpx;
  height: 8rpx;
  background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #00BCB9;
  border-radius: 4rpx;
}

.opacity {
  opacity: 0;
}
</style>