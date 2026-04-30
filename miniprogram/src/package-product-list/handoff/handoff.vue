<!--
 * @Description: 切换角色商户
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
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
        @click="Toggle(item)">
        <up-row justify="space-between" style="height: 100%" gutter="10">
          <up-col span="2" align="center">
            <view class="leftCol">
              <view class="image-box">
                <image
                  class="image"
                  mode="aspectFill"
                  lazy-load="false"
                  :src="minioBaseUrl + item.shopUrlShowUrl"/>
                <view class="">
                  <view class="dian" v-if="item.mctId == mctId">
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
                  width: 100%;">
                <view class="" style="font-size: 32rpx"
                  >{{ userName }}{{ item.name || userMenu[item.type] }}
                </view>
                <view class="">
                  <!-- <up-tag
                    :text="item.statusName"
                    type="success"
                    shape="circle">
                  </up-tag> -->
                </view>
              </view>
              <view class="bottom-box">
                <view class="dianpu">
                  {{ name }} :{{ item.mctId || item.phone }}
                </view>
                <view class="">
                  <view class="login" v-if="item.mctId == mctId">
                    当前登录
                  </view>
                </view>
              </view>
            </view>
          </up-col>
        </up-row>
      </view>
      <view class="content-add" @click="jumpToAdd">
        <up-icon name="plus" color="#394d62" size="20"></up-icon>
        <text class="" style="margin-left: 30rpx; font-size: 28rpx">
          添加商户
        </text>
      </view>
    </view>

  </vc-container>
</template>

<script>
import { toast } from '@/uni_modules/uview-plus'
import { getMctInfoList, getUserInfoList,getMctUserList } from '../api/index'
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
      userId: '',
      type: '',
      tabbarName: '',
      userMenu: {
        '000': '店铺管理员',
        '001': '店长',
        '002': '店员',
      },
      storeId:'',
      userInfo:{}
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    this.storeId = useMctStore().mctInfo.storeId
    this.mctId = useMctStore().mctInfo.mctId
    this.name = '店铺编号'
    this.userName = '商户全称:'
     if (!this.bridgeSdk.isTokenValid()) {
      this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
      return
    }
    this.__loadData__()
    this.getMctList()
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
      this.getMctList()
    },
    jumpToAdd () {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/commercial/commercial`
      })
    },
    async getMctList () {
      let res = await getMctUserList({storeId: this.storeId, userId: this.userInfo.userId, checkStatus: '03' ,status: '0',
        mobile: this.userInfo.mobile,
        phone:  this.userInfo.mobile
      })
      console.log(res, 'res')
      // checkStatus	审核状态 00：待审核 01:审核中 02：审核不通过 03：审核通过
      // status   	状态 0-正常（可交易） 1-未生效 2-冻结 3-待第三方确认 9-注销
      // 只有状态 是正常或者未生效d的可以进行跳转
      let resData = res.filter(item => item.status == '0' || item.status == '1')
      console.log(resData, 'resData')

      this.list = resData
    },
    Toggle (row) {
      console.log(useMctStore(), 'row')
      toast('切换成功')
      if (row.mctId) {
        this.mctId = row.mctId
      } else {
        this.userId = row.userId
      }
      console.log(row, 'item')
      if (row.status == '0' || this.name != '店铺编号') {
      useMctStore().setMctInfo({ ...row})
      useMctStore().setMctUserId(null)
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/commercialDetail/commercialDetail`,
          openType:'redirectTo'
        })
      } else {
        useMctStore().setMctId(row.mctId)
        this.bridgeSdk.jumpPage({
          url: `/package-product-list/commercial/commercial?isdisabled=1`
        })
      }

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
  height: 150rpx;
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
  height: 170rpx;
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
  text-align: center;
  background: #fff;
  border-radius: 15rpx;
  height: 80rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
}
</style>