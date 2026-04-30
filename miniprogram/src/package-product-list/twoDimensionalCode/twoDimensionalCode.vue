<!--
 * @Description: 二维码
 * @Author: 陈保磊
 * @Date: 2025-01-15 10:00:00
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container :props-data="propsData" >
    <vc-login v-if="!isLogined" />
  <view v-else class="two-dimensional-code">
    <view class="top_title">
      <view class="dingwei">
        <view class="top_title_img">
          <image
            style="width: 100%; height: 100%;border-radius: 50%;"
            :src="this.minioBaseUrl + detailInfo.shopUrl"
            mode="aspectFill"
            lazy-load="false">
          </image>
        </view>
        <view class="" style="font-size: 35rpx; color: #fff; margin-top: 20rpx">
          {{ detailInfo.name }}
        </view>
        <view
          class=""
          style="
            font-size: 25rpx;
            color: rgba(255,255,255,0.8);
            margin-top: 20rpx;
            margin-bottom: 20rpx;">
          店铺编号:{{ detailInfo.userId }}
        </view>
      </view>
    </view>
    <view class="bottom_content">
      <view class="" style="padding: 85rpx 0; font-size: 25rpx; color: #13c2be">
        扫描下方的二维码收款
      </view>
      <view class="twoDime" style="padding-bottom: 130rpx">
        <!-- <canvas
          id="qrcode"
          canvas-id="qrcode"
          style="width: 200px; height: 200px"
        ></canvas> -->
        <u-qrcode :size="200" :val="QRcodeContent" />
      </view>
    </view>
  </view>
  </vc-container >

</template>

<script>
// import UQRCode from 'uqrcodejs'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore } from "@/store/index"

export default {
  data () {
    return {
      propsData: {
        props: {
          title: {
            value: '店铺二维码'
          },
          // fixed: {
          //   value: true,
          // },
          bgColor: {
            value: "#bcffe3",
          },
        }
      },
      detailInfo: {},
      QRcodeContent: '',
    }

  },
  onReady () {
    this.QRcodeContent = this.baseUrl+'#/package-recommend-hbd/download/download';
    // // 获取uQRCode实例
    // var qr = new UQRCode()
    // // 设置二维码内容
    // qr.data = "https://uqrcode.cn/doc"
    // // 设置二维码大小，必须与canvas设置的宽高一致
    // qr.size = 200
    // // 调用制作二维码方法
    // qr.make()
    // // 获取canvas上下文
    // var canvasContext = uni.createCanvasContext('qrcode', this) // 如果是组件，this必须传入
    // // 设置uQRCode实例的canvas上下文
    // qr.canvasContext = canvasContext
    // // 调用绘制方法将二维码图案绘制到canvas上
    // qr.drawCanvas()
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    //  await this.firstInit();   
    this.detailInfo = options.detailInfo ? JSON.parse(options.detailInfo) : "";
  },
  methods: {
    // createQrCode () {
      // const s = this.baseUrl + '#/download'
      // // 获取uQRCode实例
      // var qr = new UQRCode()
      // // 设置二维码内容
      // qr.data = "https://uqrcode.cn/doc"
      // // 设置二维码大小，必须与canvas设置的宽高一致
      // qr.size = 200
      // // 调用制作二维码方法
      // qr.make()
      // // 获取canvas元素
      // var canvas = document.getElementById("qrcode")
      // // 获取canvas上下文
      // var canvasContext = canvas.getContext("2d")
      // // 设置uQRCode实例的canvas上下文
      // qr.canvasContext = canvasContext
      // // 调用绘制方法将二维码图案绘制到canvas上
      // qr.drawCanvas()
    // },
  }
}
</script>

<style scoped lang="scss">
.two-dimensional-code {
  background: linear-gradient(to bottom, #bcffe3 0%, #dff7e8 30%, #f5f6f8 100%);
  min-height: 600rpx;
  padding: 20rpx;
}

.top_title {
  margin-top: 164rpx;
  background: linear-gradient(to right, #0cbfbc 0%, #0ffebd 100%);
  min-height: 260rpx;
  border-radius: 15rpx;
  display: flex;
  justify-content: center;
}
.dingwei {
  margin-top: -60rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.top_title_img {
  height: 100rpx;
  width: 100rpx;
  border-radius: 50%;
  padding: 10rpx;
  background: rgb(255, 255, 255, 0.4);
}
.bottom_content {
  margin-top: -60rpx;
  min-height: 100rpx;
  border-radius: 25rpx;
  background: #fff;
  text-align: center;
}
.twoDime {
  /* position: relative;
  left: 80px; */
  .u-qrcode {
    display: inline-block;
  }
}
</style>