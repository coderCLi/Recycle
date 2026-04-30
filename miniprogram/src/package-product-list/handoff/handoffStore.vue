<!--
 * @Description: 切换门店
 * @Author: 陈保磊
 * @Date: 2025-01-22
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container ref="container" :props-data="propsData">
    <vc-login v-if="!isLogined" />
    <view v-else class="content">
      <view
        class="content-item"
        v-for="(item, index) in list"
        :key="index"
        @click="Toggle(item)"
      >
        <up-row justify="space-between" style="height: 100%" gutter="10">
          <up-col span="2" align="center">
            <view class="leftCol">
              <view class="image-box">
                <image
                  class="image"
                  mode="aspectFill"
                  lazy-load="false"
                  :src="minioBaseUrl + item.listPicUrl"
                />
                <view class="">
                  <view
                    class="dian"
                    v-if="
                      (!bridgeSdk.checkIsEmpty(userId) && item.type == '000') ||
                      item.userId == userId
                    ">
                    <view class="dian-nei"> </view>
                  </view>
                </view>
              </view>
            </view>
          </up-col>
          <up-col span="10">
            <view class="demo-layout bg-purple-light rightCol">
              <view
                class=""
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                <view class="" style="font-size: 32rpx;display: flex;align-items: center;justify-content: space-between;width: 100%;">
               <view class="">
                 {{item.storeName}}
               </view>
               <view class="" style="font-size:26rpx;color:#00BCB8" v-if="item.storeId == storeId">
                当前选择
               </view>
                </view>
              </view>
              <view class="" style="font-size: 26rpx">
                {{item.storePhone}}
                </view>
             
              <view class="bottom-box">
                <view class="dianpu">
                  {{item.provinceName + item.cityName + item.areaName + item.storeAddress}}
                </view>
              </view>
                 <view class="time" >
                  <view class="time-zi" v-for="i in item.storeTimeList" :key="i.day">
                    {{i.start + '-' + i.end}}
                  </view>
                </view>
            </view>
          </up-col>
        </up-row>
      </view>
    </view>
    <vc-empty v-if="list.length === 0"></vc-empty>
  </vc-container>
</template>

<script>
import { toast } from '@/uni_modules/uview-plus'
import { mctGetStoreList } from '../api/index'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore, useMctStore } from "@/store/index"
export default {
  data () {
    return {
      propsData: {
        props: {
          title: {
            value: ''
          },
          fixed: {
            value: false,
          },
          bgColor: {
            value: "#f5f6f8",
          },
          barBgColor: {
            value: "#f5f6f8",
          },
        }
      },
      list: [],
      name: '',
      userName: '',
      mctId: '',
      cashierType:'',
      userId: '',
      type: '',
      tabbarName: '',
      userMenu: {
        '000': '店铺管理员',
        '001': '店长',
        '002': '店员',
      },
      userInfo:{},
      storeId:''
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    console.log('00000')
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
      return
    }
    this.mctId = useMctStore().mctInfo.mctId
    this.userId = useMctStore().mctUserId
    this.cashierType = useMctStore().mctInfo.cashierType
    this.storeId = useMctStore().mctInfo.storeId
    this.__loadData__()
  },
  mounted () {

  },
  methods: {
      async __loadData__ () {
      // 获取用户信息，可能为空
      this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
      // 用户信息为空时，不执行后续逻辑，组件vc-login会提示登录
      if (!this.userInfo) {
        return
      }
      this.getUserList()
    },
    jumpToAdd () {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/commercial/commercial`
      })
    },
    async getUserList () {
      let params = {
        userId: this.userInfo.userId,
        mctId: this.mctId,
        phone: this.userInfo.mobile,
        cashierType: this.cashierType
      }
      console.log(params,'params');
      
      let res = await mctGetStoreList({...params})
      this.list = res
      this.list.forEach(item => {
        item.storeTimeList = JSON.parse(item.storeTime)
      })
    },
    Toggle (row) {
      useMctStore().setMctInfo({ storeId: row.storeId })
      toast('切换成功')
      this.bridgeSdk.navigateBackTo({
        delta: 1,
        success: function (res) {
          res.getStoreInfo()
          res.dailyOrderSummary()
        },
      })
      // this.bridgeSdk.jumpPage({
      //   url: `/package-product-list/commercialDetail/commercialDetail`,
      //    openType:'redirectTo'
      // })
    }
  }
}
</script>

<style scoped>
.content {
  height: 100%;
  background: #f5f6f8;
  padding: 40rpx 20rpx 0;
}
.content-item {
  background: #fff;
  border-radius: 15rpx;
  padding: 20rpx 30rpx;
  /* padding-bottom: 40rpx; */
  margin-bottom: 20rpx;
}
.image-box {
  position: relative;
  height: 100rpx;
}
.dian {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 10rpx;
  height: 20rpx;
  width: 20rpx;
  border-radius: 50%;
}
.image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}
.dian-nei {
  background-color: #16b61e;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.leftCol {
  display: flex;
  align-items: center;
  height: 100%;
}
.rightCol {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 20rpx;
}
.bottom-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}
.dianpu {
  color: #425569;
  font-size: 24rpx;
}
.login {
  color: #19b720;
  font-size: 26rpx;
}
.content-add {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 15rpx;
  height: 80rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
}
.time{
  font-size: 26rpx;
  color: #333;
 
  display: flex;
  flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between
}
.time-zi{
  padding: 10rpx;
 border: 1px solid #ccc;
  border-radius: 10rpx;
}
</style>