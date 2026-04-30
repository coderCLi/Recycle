<!--
 * @Description: 进入商户中转页
 * @Author: 陈保磊
 * @Date: 2025-01-15 10:00:00
-->
<template>
  <vc-container ref="container" :props-data="propsData">
    <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;">
      <view class="top-bg2"></view>
    </view>
    <view class="true-content" style="position: relative; width: 100%; height: 100%;">
      <vc-login v-if="!isLogined" />
      <view v-else class="content">
        <view class="content-item" v-for="(item, index) in list" :key="index" @click="Toggle(item)">
          <up-row justify="space-between" style="height: 100%" gutter="10">
            <up-col span="3" align="center">
              <view class="leftCol">
                <view class="image-box">
                  <image class="image" mode="aspectFill" lazy-load="false" :src="minioBaseUrl + item.shopUrlShowUrl" />
                </view>
              </view>
            </up-col>
            <up-col span="9">
              <view class="demo-layout bg-purple-light rightCol">
                <view class="textName" style="font-size: 32rpx">
                  {{ userName }}{{ item.name }}
                </view>
                <view class="" style="display:flex;margin:12rpx 0">
                  <view class="tagClass" v-if="item.checkStatus != '03'"
                    :style="{ backgroundColor: tagList[item.checkStatus] }">
                    {{ item.checkStatusName }}
                  </view>
                  <view class="tagClass" style="background:#ed706c" v-if="item.cashierType == '000'">
                    {{ userMenu[item.cashierType] }}
                  </view>
                  <view class="tagClass" style="background:#ed706c" v-else>
                    {{ item.storeName }}- {{ userMenu[item.cashierType] }}
                  </view>
                </view>
                <view class="bottom-box">
                  <view class="dianpu"> 商户编码 :{{ item.mctId }} </view>
                  <view class="">

                  </view>
                </view>
              </view>
            </up-col>
          </up-row>
        </view>
        <view class="content-add" @click="jumpToAdd" v-if="!loading">
          <up-icon name="plus" color="#394d62" size="20"></up-icon>
          <text class="" style="margin-left: 30rpx; font-size: 28rpx">
            添加商户
          </text>
        </view>
      </view>
    </view>

    <up-loading-page :loading="loading" loading-text=" " loading-mode=" ">
    </up-loading-page>
  </vc-container>
</template>

<script>
import { getMctUserList } from '../api/index'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore, useMctStore } from "@/store/index"
export default {
  data() {
    return {
      userInfo: {},
      list: [],
      loading: true,
      userMenu: {
        '000': '管理员',
        '001': '店长',
        '002': '店员',
      },
      tagList: {
        "01": '#00BCB8',
        "02": '#BCBCBC',
      }
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  onLoad() {
    console.log('00000')
    if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
      return
    }
    this.__loadData__()
  },

  methods: {
    // 该方法在登录完成（App或小程序登录完成）后会被回调，初始化逻辑都放这里，以确保逻辑正常
    async __loadData__() {
      // 获取用户信息，可能为空
      this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
      // 用户信息为空时，不执行后续逻辑，组件vc-login会提示登录
      if (!this.userInfo) {
        return
      }
      this.init(this.userInfo)
    },
    init(userInfo) {
      console.log('init__', useMctStore())
      getMctUserList({
        userId: userInfo.userId,
        mobile: userInfo.mobile,
        phone: userInfo.mobile
      }).then(res => {
        this.loading = false
        // 只有状态 是正常或者未生效d的可以进行跳转
        this.list = res.filter(item => item.status == '0' || item.status == '1')
        console.log('list__', this.list)
      })
    },
    Toggle(item) {
      // checkStatus	审核状态 00：待审核 01:审核中 02：审核不通过 03：审核通过
      // status   	状态 0-正常（可交易） 1-未生效 2-冻结 3-待第三方确认 9-注销
      if (item.checkStatus == '03') {
        useMctStore().setMctInfo({ ...item })
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/commercialDetail/commercialDetail`
        })
      } else if (item.checkStatus == '02') {
        useMctStore().setMctId(item.mctId)
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/commercial/commercial?isdisabled=2`
        })
      } else {
        useMctStore().setMctId(item.mctId)
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/commercial/commercial?isdisabled=1`
        })
      }
    },
    jumpToAdd() {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/commercial/commercial`
      })
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
  /* height: 180rpx; */
  padding: 20rpx 30rpx;
  /* padding-bottom: 40rpx; */
  margin-bottom: 20rpx;
}

.image-box {
  position: relative;
  height: 160rpx;
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
  width: 160rpx;
  height: 160rpx;
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
  /* height: 170rpx; */
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

/deep/ .container {
  background: #f5f6f8;
}

.tagClass {
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  color: #fff;
  margin-right: 10rpx;
}

.textName {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 这里设置你想显示的行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>