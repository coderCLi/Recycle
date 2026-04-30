<!--
 * @Description: 应用启动时的开屏页
 * @Author: yulongchen
 * @Date: 2024-12-19 13:08:12
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-02-11 09:49:29
 * @Remark: 
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="main" v-if="visible">
        <view class="count-down" :style="{ top: (safeTopDistance || 20) + 'px' }">
            <text class="count-down-text">{{ time || '' }} </text>
            <text @click="jumpAdPage"> 跳过广告</text> 
        </view>
        <swiper class="swiper" circular indicator-dots autoplay>
            <swiper-item v-for="item in swiperList" :key="item.id">
                <image
                    :src="minioBaseUrl + item.picUrl"
                    class="image"
                    mode="scaleToFill"
                    @click="jumpToPage(item)"
                />
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
  import { mapState } from "pinia";
  import { useBaseStore, useUserStore } from "@/store/index";
  import { adList } from "@/api/home";
  export default {
    name: "fullscreen",
    data() {
      return {
        time: 5,
        swiperList: [],
        visible: false,
      }
    },  
    async onLoad(options) {
      await this.firstInit();

      console.log("应用启动时的开屏页: ", options);
      
      // #ifdef MP
      adList({
        // adType 广告类型：1-弹窗广告；3-全屏广告
        adType: 3
      }).then(res=> {
        console.log("adList({adType: 3}).then(res=> {  ---------")
        console.dir(res);

        this.swiperList = res || [];
        console.log("swiperList: ", this.swiperList);

        // 有广告数据才开始倒计时
        if(this.swiperList.length > 0) {
            this.visible = true;
            this.countDown();
        } 
        // 无广告数据直接跳转到首页
        else {
            this.bridgeSdk.toUniAppFirstPage();
        }
      }).catch(err => { 
        console.log("adList({adType: 3}).catch(err => {  ---------", err)
        this.bridgeSdk.toUniAppFirstPage();
      });
      // #endif

      // #ifdef H5
      this.bridgeSdk.toUniAppFirstPage();
      // #endif

    },
    computed: {
        ...mapState(useBaseStore, {
            navigationBarInfo: 'navigationBarInfo',
            safeTopDistance: 'safeTopDistance'
        })
    },
    methods: {
        jumpAdPage(){
            clearTimeout(this.timer);
            this.bridgeSdk.toUniAppFirstPage();
        },
        jumpToPage(item) {
            // clearTimeout(this.timer);
            this.jumpPageClicked = true;
            this.bridgeSdk.jumpPage(item);
        },
        // 指定时间倒计时
        countDown() {
            if(this.time > 0) {
                this.timer && clearTimeout(this.timer);

                this.timer = setTimeout(() => {
                    this.time--;

                    this.countDown();

                }, 1000);
            } 
            // 点击过广告时，倒计时结束后停在广告页
            else if(!this.jumpPageClicked){
                this.bridgeSdk.toUniAppFirstPage();
            }
        }
    }
  } 
</script>

<style lang="scss" scoped>
    .image,
    .swiper {
        width: calc(100vw);
        height: calc(100vh);
        // padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
        // padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
        // box-sizing: border-box;
    }

    .count-down {
        width: 160rpx;
        line-height: 40rpx;
        text-align: center;
        position: absolute;
        right: 40rpx;
        top: 20rpx;
        color: #fff;
        font-size: 24rpx;
        z-index: 1;
        background: rgb(0 0 0 / 26%);
        // padding: 10rpx 16rpx;
        border-radius: 32rpx;

        .count-down-text {
            font-size: 24rpx;
        }
    }
</style>
