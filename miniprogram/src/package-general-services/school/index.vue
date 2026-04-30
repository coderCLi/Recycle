<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="main">

    <!-- <vc-status-bar />
    <vc-navbar :props-data="propsData" /> -->

    <vc-search-cur-page :propsData="searchProps" @inputChange="getSearch"></vc-search-cur-page>

    <vc-tabbar v-if="list1.length > 0" :props-data="{props: {list:{value:list1}}}" @handleClick="handleClick"></vc-tabbar>

    <view style="padding: 30rpx;">
      <view v-for="(item, index) in filteredList" @click="goDetail(item)" :key="index"
        class="home-list flex flex_sb flex_ac">
        <view class="home-list-left">
          <view v-if="item.schoolName.length > 0" class="ellipsis home-list-title" style="font-size: 30rpx;">
            {{ item.schoolName }}
          </view>
          <view><view class="tag">{{ item.schoolXingzhi }}</view></view>
          <view><text>{{ item.schoolAddress }}</text> </view>
          <view v-if="item.schoolPhone.length > 0" class="ellipsis">{{item.schoolPhone}}</view>
        </view>
      </view>
      <view v-if="filteredList.length > 0">
        <u-loadmore marginTop="30" :status="status" ></u-loadmore>
      </view>
      
      <vc-empty v-if="filteredList.length === 0 " ></vc-empty>
      
    </view>
    
    <vc-safe-bottom />
  </vc-container>
</template>
<script>
import { getDataDic ,getSchoolinfoPage} from '../api/baseServices';
export default {
  name: "search",
  data() {
    return {
      propsData: {
        props: {
          title: {
            value: '保定学校'
          }
        }
      },
      searchProps: {
        props: {
          placeholder: {
            value: '可按学校名称/地址搜索'
          }
        }
      },
      current: 0,
      keywords: '',
      show: false,
      list1: [],
      optName: '',
      type: '',
      page: 1,
      rows: 10,
      total: 0,
      status: 'loadmore',
      filteredList: []
    }
  },
  async onLoad(options) {

    // this.bridgeSdk.setStorageSync('appToken',options.appToken);
    this.getList()
  },
  onReachBottom() {
    if ((this.filteredList.length < this.total) && (this.filteredList.length > 0)) {
      this.status = 'loading'
      this.page = (+this.page + 1).toString()
      this.getListDetail(this.type)
    } else if (this.filteredList.length == this.total) {
      this.status = 'nomore'
    }
  },
  computed: {

  },
  // onPullDownRefresh() {
  //   this.keywords = '';
  //   this.page = 1;
  //   this.getListDetail(this.type)
  //   uni.stopPullDownRefresh()
  // },
  mounted() {

  },
  methods: {
    
    getList() {
      let params = {
        code:'BD_SCHOOL_TYPE',
      }
      
        getDataDic(params).then(res => {
        
            this.list1 = res;
            this.type= res[0].optCode;
            if (this.list1.length > 0) {
              this.getListDetail();
            } else {
              this.filteredList = []
            }
            
        })
     

    },
    getListDetail(data) {

      let params = {
        type: data,
        page: this.page,
        rows: this.rows,
        keywords:this.keywords
      }
      getSchoolinfoPage(params).then(res => {
          console.log("-----school", res);
          this.total = res.total;
          this.filteredList = [...this.filteredList,...res.list];
          if (this.total > this.filteredList.length) {
            this.status = 'loadmore'
          } else {
            this.status = 'nomore'
          }
          return;
        
      })
    },
    getSearch(keywords) {
      console.log(keywords);
      this.keywords = keywords;
      this.filteredList =[]
      this.page = 1;
      this.getListDetail(this.type)
    },
    handleClick(e) {
      console.log(e);
      this.filteredList =[]
      this.page = 1;
      this.current = e.index;
      this.optName = e.optName; // 更新当前选中的标签 
      this.type = e.optCode;
      this.getListDetail(this.type)
    },
    goDetail(item) {
      // 页面跳转
      this.bridgeSdk.jumpPage({
        title: this.propsData.props.title.value + '-' + item.schoolName,
        url: '/package-general-services/school/detail?id=' + item.id, // 目标页面的路径  
      })
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
    width: 100%;

    .home-list-title {
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 50rpx;
      text-align: left;
    }

    .tag {
      margin-top: 6rpx;
      margin-bottom: 6rpx;
      display: inline-flex;
      padding: 0 12rpx;
      height: 32rpx;
      line-height: 32rpx;
      font-size: 10px;
      color: #00BCB8;
      background: #FFFFFF;
      border-radius: 3px;
      border: 1px solid #00BCB8;
    }

    view {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 40rpx;
      text-align: left;

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