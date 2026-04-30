<template>
  <view class="infoDetail">
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main" :props-data="propsData">
      <view class="infoDetail-box" style="position: relative; " >
        <view class="title">{{ articleDetail.title ? articleDetail.title : '' }}</view>
        <view class="inform">
          <view class="flex flex_col">
            <view class="departMent ">
              来源：{{ articleDetail.author ? articleDetail.author : '无' }}
            </view>
            <view class="informDetail">
              <view class="time"> 
                日期：{{ articleDetail.publishDate ? articleDetail.publishDate : '无' }}
              </view>
            </view>
          </view>
          <!-- 内容 -->
          <u-skeleton style="margin-top: 0rpx;" rows="8" :loading="loading">
            <view class="content" v-if="videoUrl">
              <video :src="videoUrl" style="width: 690rpx;margin: 10rpx auto;height: 375rpx;border-radius: 20rpx;"></video>
            </view>
            <view class="content" v-if="articleDetail.content" style="padding-bottom: 120rpx">
              <u-parse lazy-load selectable scroll-table :content="bridgeSdk.addMinioPrefixToImgSrc(articleDetail.content)" :previewImg="enablePreview" @imgTap="previewImage" :copyLink="false" @linkTap="bridgeSdk.hrefJump"></u-parse>
            </view>
            <u-empty v-else width="130" height="130" text="暂无数据" :icon="staticBaseUrl + '/hbdimage/baseImage/icon-noDy.png'">
            </u-empty>
          </u-skeleton>
          <!-- 附件 -->
          <view class="file" v-if="articleDetail.goodsFiles.length > 0">
            <view style="font-size: 28rpx;color: gray;margin-bottom: 10rpx;">附件：</view>
            <view @click="downFile(item)" v-for="(item, index) in articleDetail.goodsFiles"
              style="color: #42A4FF;font-size: 28rpx;" :key="index">
              <!-- 历史文件无filename字段，取fileUrl最后一段作为文件名 -->
              {{ (index + 1) + '、' + (item.fileName || item.fileUrl.split('/').pop()) }}
            </view>
          </view>
          <!-- 底部预留距离防止上传附件时，底部按钮被遮挡 -->
          <view v-if="articleDetail.goodsFiles.length > 0" style="height:50rpx;"></view>
        </view>
        <view class="infoDetail-box-btn" @click="handleBtn">
          <image class="infoDetail-box-btn-img" :src="minioBaseUrl + '/common/active/ljcz.png'" mode="heightFix"/>
        </view>
      </view>
      <vc-safe-bottom />
    </vc-container>
  </view>
</template>
<script>
  import { getInfoDetail } from '../api/baseServices';
  import { mapState } from 'pinia'
  import { useBaseStore } from "@/store/index";
  export default {
    name: "infoDetail",
    computed: {
      ...mapState(useBaseStore, { safeTopDistance: 'safeTopDistance' })
    },
    data() {  
      return {
        propsData: {
          props: { title: { value: '详情' } }
        },
        enablePreview: true,
        articleDetail: {
          goodsFiles: [],
          content: ''
        }, //文章详情
        title: '',//标题
        navigationName: '',//栏目标题
        videoUrl: '',//视频地址 2023-08-02演示用
        coverImageUrl: '',
        loading: true,
        failMsg: '',
        id: '',
      }
    },
    async onLoad(options) {
      // #ifdef H5
      // this.enablePreview = false;
      // #endif
      this.propsData.props.title.value = options.title;
      this.id = options.id;
      this.getList();
    },
    methods: {
      getList() {
        let params = { id: this.id }
        getInfoDetail(params).then(res => {
          this.loading = false;
          this.articleDetail = res;
        })
      },
      // 下载文件
      downFile(e) {
        console.log(e)
        this.bridgeSdk.downloadFile({ url: this.minioBaseUrl + e.fileUrl });
      },
      // 长图展示，有bug，先进行隐藏
      previewImage(e) {
        let url = e.src;
        console.log("预览图片", url);
        let isHttp = (url || "").indexOf("http://") == 0 || (url || "").indexOf("https://") == 0
        if (isHttp) {
          uni.previewImage({ current: 0, urls: [url] })
        }
      },
      handleBtn(){
        // 跳转充值页面
        uni.navigateTo({
          url: '/package-money-transactions/recharge/index'
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .infoDetail-box{
    &-btn{
      line-height: 0;
      position: fixed;
      width: 100%;
      left: 0;
      bottom: 0;
      background-color: #fff;
      display: flex;
      justify-content: center;
      padding: 30rpx 0;
      &-img{
        height: 100rpx;
      }
    }
  }
</style>
<style scoped lang="scss">
  .main {
    background: #fff;
    height: 100vh;
  }
  .u-skeleton {
    margin-top: 43rpx;
  }
  button {
    background-color: transparent;
    padding: 0;
  }
  button::after {
    border: none;
  }
  .container-box {
    padding-bottom: 120rpx;
  }
  .title {
    margin: 43rpx 40rpx 0 40rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: #000000;
    line-height: 44rpx;
  }
  .inform {
    margin: 0 40rpx 100rpx 40rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 24rpx;
    padding-top: 20rpx;
    .departMent {
      display: flex;
      align-items: center;
      line-height: 35rpx;
    }
    .informDetail {
      display: flex;
      justify-content: space-between;
      line-height: 50rpx;
      .time {
        display: flex;
      }
    }
  }
  .content {
    margin-top: 43rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: #333333;
    line-height: 60rpx;
  }
  .file {
    line-height: 38rpx;
  }
  .iconStyle {
    width: 30rpx;
    height: 30rpx;
    margin-right: 10rpx;
    .departName {
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
    }
  }
  .commit {
    margin: 90rpx 0 44rpx 0rpx;
    height: 32rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 32rpx;
    text {
      margin-left: 10rpx;
    }
  }
  .commitDetail {
    padding: 40rpx 40rpx 120rpx 0rpx;
    .userInform {
      display: flex;
      image {
        width: 60rpx;
        height: 60rpx;
      }
      .name {
        height: 28rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        line-height: 28rpx;
        margin-bottom: 16rpx;
      }
      .time {
        height: 24rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
        line-height: 24rpx;
      }
    }
    .content {
      margin-top: 20rpx;
      margin-left: 80rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      line-height: 40rpx;
    }
    .reply {
      margin-top: 20rpx;
      margin-left: 80rpx;
      width: auto;
      text-align: left;
    }
  }
  .operate {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FFFFFF;
    box-shadow: 0rpx -2rpx 0rpx 0rpx #ECEDEE;
    .write {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 22rpx 0 22rpx 30rpx;
      padding-left: 30rpx;
      height: 76rpx;
      background: #F6F7F8;
      border-radius: 40rpx;
      input {
        width: 100%;
      }
    }
    .iconList {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 33rpx;
      margin-right: 30rpx;
      .iconContent {
        position: relative;
        .iconStyle {
          margin-right: 58rpx;
          width: 37.5rpx;
          height: 36rpx;
        }
        .fontStyle {
          position: absolute;
          left: 30%;
          top: -50%;
          width: 23rpx;
          height: 28rpx;
          font-size: 20rpx;
          font-weight: 400;
          color: #666666;
          line-height: 28rpx;
        }
      }
    }
  }
</style>