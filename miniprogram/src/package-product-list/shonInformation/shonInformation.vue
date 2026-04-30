<!--
 * @Description: 商户个人详情
 * @Author: 陈保磊
 * @Date: 2025-01-15 10:00:00
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container :props-data="propsData">
    <vc-login v-if="!isLogined" />
    <view v-else class="content">
      <view class="title">
        <view class="" style="width: 200rpx; height: 200rpx">
          <image
            v-if="!detailInfo.shopUrlShowUrl"
            style="width: 100%; height: 100%"
            src="../static/uploadImg.png"
            mode="aspectFill"
            lazy-load="false">
          </image>
          <image
            v-else
            style="width: 100%; height: 100%;border-radius: 10rpx"
            :src="this.minioBaseUrl + detailInfo.shopUrlShowUrl"
            mode="aspectFill"
            lazy-load="false">
          </image>
        </view>
        <view class="" style="flex: 1; margin-left: 20rpx; min-height: 200rpx">
          <view class="title_name">
            {{ detailInfo.name }}
          </view>
          <view class="title_address" v-if="detailInfo.provinceName && detailInfo.cityName">
            {{ detailInfo.provinceName }}
            {{ detailInfo.cityName }}
            {{ detailInfo.areaName }}
            {{ detailInfo.address }}
          </view>
          <!-- <view class="" style="text-align: end">
            <image
              @click="toEdit"
              style="width: 60rpx; height: 60rpx"
              src="../static/erweima.png"
              mode="aspectFill"
              lazy-load="false">
            </image>
          </view> -->
        </view>
        <!-- <up-avatar
          v-if="!detailInfo.shopUrlShowUrl"
          style="width: 100%; height: 100%"
          class="left_image"
          src="../static/uploadImg.png"
        ></up-avatar>
        <image
          v-else
          style="width: 100rpx; height: 100%; border-radius: 50%"
          :src="this.minioBaseUrl + detailInfo.shopUrlShowUrl"
          mode="aspectFill"
          lazy-load="false"
        >
        </image>
        <view class="" style="font-size: 26rpx"> 用户头像 </view> -->
      </view>
      <view class="info">
        <view class="form-item" v-if="detailInfo.mctId">
          <view class="label"> 商户编号 </view>
          <view class="value"> {{ detailInfo.mctId }} </view>
        </view>
        <!-- <view class="form-item">
          <view class="label"> 商户全称 </view>
          <view class="value"> {{ detailInfo.name }} </view>
        </view> -->
        <view class="form-item" v-if="detailInfo.shortName">
          <view class="label"> 商户简称 </view>
          <view class="value"> {{ detailInfo.shortName }} </view>
        </view>
        <view class="form-item" v-if="detailInfo.mctTypeName">
          <view class="label"> 商户类型 </view>
          <view class="value"> {{ detailInfo.mctTypeName }} </view>
        </view>
        <view class="form-item" v-if="detailInfo.categoryParentName || detailInfo.categoryName">
          <view class="label"> 行业类目 </view>
          <view class="value">
            {{ detailInfo.categoryParentName }}/{{ detailInfo.categoryName }}
          </view>
        </view>
        <view class="form-item" v-if="detailInfo.phone">
          <view class="label"> 电话 </view>
          <view class="value"> {{ detailInfo.phone }} </view>
        </view>
        <!-- <view class="form-item">
          <view class="label"> 地址信息 </view>
          <view class="value"> {{ detailInfo.address }} </view>
        </view> -->
        <view class="form-item" v-if="detailInfo.contacts">
          <view class="label"> 商务合作联系人姓名 </view>
          <view class="value"> {{ detailInfo.contacts }} </view>
        </view>
        <view class="form-item" v-if="detailInfo.contactsPhone">
          <view class="label"> 商务合作联系人电话 </view>
          <view class="value"> {{ detailInfo.contactsPhone }} </view>
        </view>
        <!-- <view class="form-item">
          <view class="label"> 负责人证件类型 </view>
          <view class="value"> {{ detailInfo.contactsCertTypeName }} </view>
        </view>
        <view class="form-item">
          <view class="label"> 负责人证件号 </view>
          <view class="value"> {{ detailInfo.contactsCertNo }} </view>
        </view>
        <view class="form-item">
          <view class="label"> 备注 </view>
          <view class="value"> {{ detailInfo.remark }} </view>
        </view> -->
      </view>
    </view>
    <vc-modal ref="modal">
      <template #title>
        <view
          class=""
          style="
            text-align: center;
            font-size: 40rpx;
            color: #333;
            margin-bottom: 20rpx;">
          店铺二维码
        </view>
      </template>
      <template #content>
        <view class="" style="text-align: -webkit-center; margin: 20rpx">
          <up-qrcode
            :size="200"
            cid="u-qrcode-canvas"
            val="https://uqrcode.cn/doc" ></up-qrcode>
        </view>
      </template>
      <template #cancelBtn>
        <view
          class=""
          style="margin-top: 20rpx; color: #333"
          @click="$refs.modal.close">
          <up-icon name="close-circle" size="28"></up-icon>
        </view>
      </template>
      <template #confirmBtn> </template>
    </vc-modal>
  </vc-container>
</template>

<script>
import { mapState } from 'pinia'
import { useBaseStore, useUserStore,useMctStore } from "@/store/index"
export default {
  data () {
    return {
      propsData: {
        props: {
          title: {
            value: '店铺信息'
          },
          // fixed: {
          //   value: true,
          // },
          bgColor: {
            value: "#fff",
          },
          barBgColor: {
            value: "#fff",
          },
        }
      },
      detailInfo: {}
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    // await this.firstInit();
    console.log(options, '__________________________________')
    this.detailInfo = useMctStore().detailInfo
    console.log(this.detailInfo, 'provinceNameprovinceName')

  },
  methods: {
    async toEdit () {
      // this.createQrCode()
      console.log('toEdit')
      //  暂无店铺二维码信息
      return
      await this.$refs.modal.open({
        duration: 2000,
        showCancel: true,
      })
    },
    // createQrCode () {
    //   const s = this.baseUrl + '#/download'
    //   // 获取uQRCode实例
    //   var qr = new UQRCode()
    //   // 设置二维码内容
    //   qr.data = "https://uqrcode.cn/doc"
    //   // 设置二维码大小，必须与canvas设置的宽高一致
    //   qr.size = 200
    //   // 调用制作二维码方法
    //   qr.make()
    //   // 获取canvas元素
    //   var canvas = document.getElementById("qrcode")
    //   // var canvas = this.$refs.qrcode
    //   console.log(canvas, 'canvas', this.$refs)

    //   // 获取canvas上下文
    //   var canvasContext = canvas.getContext('2d', {alpha: false})
    //   // 设置uQRCode实例的canvas上下文
    //   qr.canvasContext = canvasContext
    //   // 调用绘制方法将二维码图案绘制到canvas上
    //   qr.drawCanvas()
    // },
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
  height: 100%;
  /* background: #f5f6f8; */
  background: linear-gradient(180deg, #baffe1 0%, #d8f7e3 45%, #f5f6f8 100%);
}
.title {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-radius: 20rpx;
  align-items: flex-start;
}
.info {
  margin-top: 30rpx;
  background-color: #fff;
  min-height: 300rpx;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
}
.form-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}
.label {
  width: auto;
  font-size: 25rpx;
  margin-right: 30rpx;
  color: #020000;
}
.value {
  flex: 1;
  word-wrap: break-word;
  font-size: 25rpx;
  text-align: right;
  color: #34495e;
}
.title_name {
  font-weight: bold;
  font-size: 30rpx;
}
.title_address {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}
/* 关闭组件二维码预览 */
/deep/ #u-a-p {
  display: none;
}
</style>