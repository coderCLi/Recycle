<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container ref="container" :props-data="propsData" class="main">

    <!-- 搜索框 border-bottom: 10px solid #eee; -->
    <view style="position: relative;width:100%;height: 130rpx; ">
      <view :style="{'border-bottom':list1.length > 0?'10px solid #eee':''}" style="position: fixed;z-index: 1;width: 750rpx;box-sizing: border-box; "
        class="search-box">
        <u-search maxlength="20" height="40" placeholder="请输入" placeholderColor="#999" @search="getSearch" @blur="inputBlur"
          :showAction="false" v-model="keywords" shape="square">
        </u-search>
      </view>
    </view>


    <view v-if="list1.length > 0" style="position: relative;width:100%;height: 104rpx;">
      <!-- 定制tab -->
      <view
        style="position: fixed;z-index: 1;width:750rpx;padding:0 15rpx 15rpx;box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.1);background:#fff;display:flex;">
        <view style="width: 83%;">
          <u-tabs @click="handleClick" :list="list1" lineWidth="30"
            lineColor="linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%)" :activeStyle="{
              color: '#333333',
              fontWeight: 'bold',
            }" :inactiveStyle="{
            color: '#999',
            transform: 'scale(1)'
          }" :current="current">

          </u-tabs>
        </view>

        <view slot="right" style="flex:1;padding-left: 4px;" class="flex flex_ac" @click="goMore">
          <u-icon name="list-dot" :size="23" bold color="#000000"></u-icon>

          <text style="font-weight: bold;font-size: 28rpx;color: #333333;">
            更多
          </text>
        </view>

      </view>
    </view>
    <!-- 弹出框 -->
    <u-popup zIndex="999" style="width:100%" :show="show" mode="right" :safeAreaInsetTop="false"
      :customStyle="{ width: '100vw' }" @close="close" @open="open">
      <vc-container :props-data="propsDataPop" @navBack="popBack">

        <view class="sub-list">
          <view @click="handlePop(item, index)" class="sub-item" v-for="(item, index) in list1" :key="item.id">
            {{ item.name }}
          </view>
        </view>
      </vc-container>
    </u-popup>
    <!-- filteredList渲染内容 -->
    <view style="padding: 30rpx;">
      <view v-for="(item, index) in filteredList" @click="goDetail(item)" :key="index"
        class="home-list flex flex_sb flex_ac">
        <view class="home-list-left">
          <view class="ellipsis home-list-title" style="width: 580rpx;font-size: 30rpx;">
            {{ item.title }}
          </view>
          <view class="ellipsis-line2">{{ item.childTitle }} </view>
          <view>{{ item.publishDate }}<text>{{ item.author }}</text></view>
        </view>
      </view>
      <view v-if="filteredList.length > 0">
        <u-loadmore marginTop="30" :status="status"></u-loadmore>
      </view>
      <vc-empty v-if="filteredList.length === 0"></vc-empty>
    </view>
    <!-- 订阅通用组件 -->
    <!-- <vc-sub :props-data="propsDataSub" /> -->
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import vcSub from '@/components/library/base/vc-sub/index.vue'//订阅示例局部引入订阅组件 按需加载
import { getNavigationList, getInfoList } from '../api/baseServices';//接口
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
export default {
  name: "infoIndex",
  components: {
    vcSub
  },
  data() {
    return {
      propsDataPop: {
        props: {
          title: {
            value: '更多资讯'
          },
          buttonType: {
            value: 'pop'
          },

        },
      },
      // 订阅服务id 
      propsDataSub: {
        props: {
          serviceId: {
            value: ''
          },
          title: {
            value: ''
          }
        }
      },
      propsData: {
        props: {
          title: {
            value: ''
          }
        }
      },
      current: 0,//当前点击值
      keywords: '',
      show: false,
      list1: [],
      selectedItem: '',
      navId: '',
      page: 1,
      rows: 10,
      total: 0,
      status: 'loadmore',
      filteredList: [],//渲染list
    }
  },
  computed: {
    ...mapState(useBaseStore, {
      safeTopDistance: 'safeTopDistance'
    })
  },
  watch: {
    'propsDataEmpty.props.list.value'(newVal) {
      this.filteredList = newVal;
    }
  },
  async onLoad(options) {
    this.propsData.props.title.value = options.title;

    // 通用服务跳转参数 appToken app跳转过来的token serviceId 查询通用服务serviceId  订阅subId 标题 title 
    // this.bridgeSdk.setStorageSync('appToken', options.appToken);  // 已经全局处理了，不允许再写了，否则会用空值覆盖有效的值
    this.navId = options.serviceId;
    this.propsDataSub.props.serviceId.value = options.subId;//订阅服务id 
    this.propsDataSub.props.title.value = options.title;

    // console.log("title: ", this.propsData.props.title.value);

    // // 更新标题
    // this.$refs.container.setNavPropsData({
    //   title: {
    //     value: options.title
    //   }
    // });

    this.getList()
  },
  onReachBottom() {
    if ((this.filteredList.length < this.total) && (this.filteredList.length > 0)) {
      this.status = 'loading'
      this.page = (+this.page + 1).toString()
      this.getListDetail()
    } else if (this.filteredList.length == this.total) {
      this.status = 'nomore'
    }
  },
  // onPullDownRefresh() {
  //   this.keywords = '';
  //   this.page = 1;
  //   this.filteredList = [];
  //   this.getListDetail()
  //   uni.stopPullDownRefresh()
  // },
  methods: {
    popBack() {
      this.show = false;
    },
    getList() {
      let params = {
        navId: this.navId,
        page: this.page,
        rows: this.rows
      }
      try {
        getNavigationList(params).then(res => {
          this.list1 = res;
          if (this.list1.length > 0) {
            this.navId = res[0].id;

          } else {
            this.filteredList = []
          }
          this.getListDetail();
        })
      } catch (e) {
        console.log(e)
      }
    },
    getListDetail() {
      let params = {
        navId: this.navId,
        page: this.page,
        rows: this.rows,
        keywords: this.keywords
      }

      getInfoList(params).then(res => {
        console.log(res, "rerwerererer")
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
    getSearch(keywords) {
      if(this.time && new Date().getTime() - this.time < 1000){
        return
      }
      this.time = new Date().getTime();
      this.page = 1;
      this.filteredList = [];
      this.keywords = keywords;
      this.getListDetail();
    },
    inputBlur() {
      if (!this.bridgeSdk.checkIsEmpty(this.keywords)) {
        this.getSearch(this.keywords);
      }
    },
    handleClick(e) {
      this.current = e.index;
      this.selectedItem = e.name; // 更新当前选中的标签 
      this.navId = e.id;
      this.keywords = '';
      this.filteredList = [];
      this.getListDetail();
    },
    handlePop(e, i) {
      this.filteredList = [];
      this.show = false;
      this.current = i;
      this.selectedItem = e.name; // 更新当前选中的标签 
      this.navId = e.id;
      this.keywords = '';
      this.getListDetail();
    },
    goDetail(item) {
      // 页面跳转
      this.bridgeSdk.jumpPage({
        title: `${this.propsData.props.title.value}-${item.title}`,
        url: '/package-general-services/information/detail?id=' + item.id + "&title=" + item.title, // 目标页面的路径  
      })
    },
    goMore(item) {
      this.show = true;
    },
  }
}
</script>
<style scoped lang="scss">
.main {
  background: #F0F0F4;
  height: auto;
  min-height: 100vh;
}

.sub-list {
  margin-top: 30rpx;
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  align-items: center;
  text-align: center;

  .sub-item {
    position: relative;
    background: #F1F1F1;
    border-radius: 12rpx;
    width: calc(39% - 60rpx);
    text-align: center;
    padding: 30rpx 0;
    margin-left: 30rpx;
    margin-bottom: 30rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
  }

  .sub-item:nth-child(3n-2) {
    margin-left: 0;
  }
}

.search-box {
  background: white;
  padding: 20rpx 40rpx;
  margin-bottom: 18rpx;

}

.home-list {
  padding: 24rpx;
  border-bottom: 1rpx solid #eee;
  background-color: #fff;
  margin-top: 24rpx;
  background: #FFFFFF;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  border-radius: 20rpx;

  .home-list-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .home-list-title {
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 50rpx;
      text-align: left;
    }

    view:nth-child(2) {
      margin: 10rpx 0;
    }

    view {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 40rpx;
      text-align: left;

      text {
        margin-left: 10rpx;
      }
    }

  }

  .home-list-img {
    image {
      height: 150rpx;
      width: 150rpx;
    }
  }
}

.home-list:nth-last-child(1) {
  border: none;
}
</style>