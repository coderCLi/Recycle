<!--
 * @Descripttion: 引导用户从系统自带浏览器跳转app指令h5页面
 * @Author: 陈玉龙
 * @Date: 2025-04-30 09:37:52
 * @LastEditors: 陈玉龙
 * @LastEditTime: 2025-05-06 14:08:03
-->
<template>
  <vc-modal ref="modal"></vc-modal>
  <!-- <vc-container :props-data="propsData"> -->
    <view class="announcement">
        <image :src="minioBaseUrl+'/common/hbdimg-20250430/browser-app.png'" class="bg-img" mode="widthFix"></image>
        <view class="scan-btn" @click="jumpApp"></view>
    </view>
    <!-- </vc-container>    -->
    <!-- 微信环境下，下载提示遮罩层 -->
    <up-overlay :show="show">
        <view class="wrapper">
            <!-- <image :src="staticBaseUrl+'/hbdimage/recommendHbd/download/close.png'" class="close img-css" @click="show = false" mode="widthFix"></image> -->
            <image :src="staticBaseUrl+'/hbdimage/recommendHbd/download/jian_tou.png'" class="img-css jt" mode="widthFix"></image>
            <view class="desc-box">
                <image :src="staticBaseUrl+'/hbdimage/recommendHbd/download/sort-one.png'" mode="widthFix" class="index-img"></image>点击右上角的
                <image :src="staticBaseUrl+'/hbdimage/recommendHbd/download/shu-saindian-1.png'" mode="widthFix" class="desc1-img"></image>按钮
            </view>
            <view class="desc-box">
                <image :src="staticBaseUrl+'/hbdimage/recommendHbd/download/sort-two.png'" mode="widthFix" class="index-img"></image>选择在
                <image :src="staticBaseUrl+'/hbdimage/recommendHbd/download/browser-1.png'" mode="widthFix" class="desc2-img"></image>
            </view>
        </view>
    </up-overlay>
</template>

<script>
import { getApkUrl } from '@/api/index'
export default {
    data() {
        return {
            // propsData: {
            //     props: {
            //         bgColor: {
            //             value: "#CFF3F3",
            //         },
            //         barBgColor: {
            //             value: "#CFF3F3",
            //         },
            //         border: {
            //             value: false
            //         }
            //     }
            // },
            show: false
        }
    },
    async mounted() {
        this.environment = await this.bridgeSdk.getEnvironment();
        // officialAccount微信公众号h5环境
        if(this.environment == "officialAccount"){
            this.show = true;
        }
        this.initCode();
    },
    onLoad(options) {
        console.log("options: ", options);
        if(!options.url){
            uni.showToast({
                icon: 'none',
                title: '跳转地址不能为空'
            });
            return;
        }
        this.jump_title = options.title ? encodeURIComponent(decodeURIComponent(options.title)) : "";
        this.jump_url = options.url ? encodeURIComponent(decodeURIComponent(options.url)) : "";
        this.openApp();
    },
    methods: {
        // 跳转app
        openApp(){
            // 打开大连海创嗨创生活app指定h5页面
            // const url = "huibaoding://openapp.withurl/params?title=%e5%85%b3%e4%ba%8e%e6%88%91%e4%bb%ac&url=package-my-about%2fpages%2fabout%3fchannelType%3dapp"
            const url = `huibaoding://openapp.withurl/params?title=${this.jump_title}&url=${this.jump_url}`;
            console.log("url: ", url);
            window.open(url, "_self");
        },
        jumpApp(){
            if(!this.apkUrl){
                uni.showToast({
                    icon: 'none',
                    title: '下载地址不能为空'
                });
                return;
            }
            window.open(this.apkUrl, "_self");
        },
        initCode(){
            if(this.environment == 'android'){
                getApkUrl({}).then(res=>{
                    console.log("apkUrl: ", res);
                    let apkUrl = res.apkUrl;
                    this.apkUrl = this.minioBaseUrl + apkUrl;
                })
            }
            else if(this.environment == 'ios'){
                this.apkUrl="https://itunes.apple.com/cn/app/6450086664";
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .bg-img {
        width: 100%;
        float: left;
    }

    .announcement {
        position: relative;
    }

    .wrapper {
        align-items: center;
        justify-content: center;
        height: 100%;
        font-weight: bold;
        font-size: 48rpx;
        color: #FFFFFF;
        padding: 50rpx;
        padding-top: 220rpx;
        .img-css{
            position: absolute;
        }
        .close{
            position: absolute;
            top:16rpx;
            width:60rpx;
        }
        .jt{
            top:10rpx;
            right: 10rpx;
            width:100rpx;
        }
        .desc-box{
            display: flex;
            align-items: center;
            .index-img{
                width: 54rpx;
                margin-right: 10rpx;
            }
            .desc1-img{
                width: 80rpx;
                margin: 0 10rpx;
            }
            .desc2-img{
                width: 290rpx;
                margin-left: 10rpx;
            }
            &:last-child{
                margin-top: 16rpx;
            }
        }
    }

    .scan-btn {
        position: absolute;
        top: 1460rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 600rpx;
        height: 100rpx;
        // background: red;
        border-radius: 100rpx;
    }
</style>