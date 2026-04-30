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
                  :src="minioBaseUrl + item.shopUrlShowUrl" />
                <view class="">
                  <view class="dian" v-if=" !bridgeSdk.checkIsEmpty(userId) && item.type == '000' || item.userId == userId">
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
                <view class="" style="font-size: 32rpx">
                  {{ userName }}{{ item.name || userMenu[item.type] }}
                </view>
                <view class="">
                  {{item.storeName}}
                </view>
              </view>
              <view class="bottom-box">
                <view class="dianpu">
                  {{ name }} :{{ item.mctId || item.phone }}
                </view>

                <view>
                  <view class="login" v-if="isDis(item)">
                    当前登录
                  </view>
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
import { getMctInfoList, getUserInfoList } from '../api/index'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore,useMctStore } from "@/store/index"
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
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    // await this.firstInit() 
    this.mctId = useMctStore().mctInfo.mctId
    this.name = '手机号'
    this.userName = ''
    this.userId = useMctStore().mctUserId
    console.log(this.userId,'this.userId');
    
    this.getUserList()
  },
  mounted () {

  },
  methods: {
    isDis(item){
      let isDis = false 
    // {{bridgeSdk.checkIsEmpty(userId) }}{{item.userId == userId}}{{item.type == '000'}}
    if(this.bridgeSdk.checkIsEmpty(this.userId)){
      console.log(1111,item.userId , this.userId);
      if(item.userId == this.userId){
        console.log(2222,item.userId , this.userId);
         isDis = true
      }
    }else if(item.type == '000'){
      console.log(33333);
      
     isDis = true
    }else {
      console.log(44444);

    isDis =  false
    }

    return isDis
    },
    jumpToAdd () {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/commercial/commercial`
      })
    },
    async getUserList () {
      let res = await getUserInfoList({ userId: this.bridgeSdk.getUserInfo().userInfo.userId, mctId: this.mctId })
      this.list = res
      this.list.forEach(item => {
        item.shopUrlShowUrl = `/hbdimage/charm/${item.type}.png`
      })
    },
    Toggle (row) {
      useMctStore().setMctUserId(row.userId)
      toast('切换成功')
      if (row.mctId) {
        this.mctId = row.mctId
      } else {
        this.userId = row.userId
      }
       this.bridgeSdk.navigateBackTo({
        delta: 1,
        success: function (res) {
          console.log(res)
          res.userTypeChange(row.type)
        },
      })
      // this.bridgeSdk.jumpPage({
      //   url: `/package-product-list/commercialDetail/commercialDetail?userType=${row.type}`
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
  background: #fff;
  border-radius: 15rpx;
  height: 80rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
}
</style>