<!--
 * @Description: 关于我们
 * @Author: chenyulong
 * @Date: 2024-12-19 13:49:45
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-29 18:03:53
 * @Remark: 
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container>
        <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;">
            <view class="top-bg2"></view>
        </view>
        <view class="true-content" style="position: relative; width: 100%; height: 100%;">
            <!-- <vc-status-bar />
        <vc-navbar :props-data="propsData" /> -->
            <view style="width: 90%;margin: 40rpx auto;text-align: center;">
                <image style="border-color: #13c3b9;margin-top: 40rpx;height: 200rpx;" :src="imgLogo" mode="heightFix">
                </image>
                <view style="font-size: 40rpx;font-weight: bold;margin-top: 40rpx;">大连海创嗨创生活</view>
            </view>
            <view class="list">
                <up-cell-group style="text-align: left">
                    <up-cell isLink @click="contact()" title="联系我们">
                    </up-cell>
                </up-cell-group>
                <up-cell-group style="text-align: left">
                    <up-cell isLink @click="toprivacy()" title="隐私政策">
                    </up-cell>
                </up-cell-group>
                <up-cell-group style="text-align: left">
                    <up-cell isLink @click="toxieyi()" title="用户协议">
                    </up-cell>
                </up-cell-group>
                <up-cell-group style="text-align: left">
                    <up-cell isLink @click="toCustomIntro()" title="消费者权益保障措施说明">
                    </up-cell>
                </up-cell-group>
                <up-cell-group style="text-align: left">
                    <up-cell @click="toDownload()" :value="curAppVersion" title="版本信息">
                    </up-cell>
                </up-cell-group>
            </view>

            <!-- <view class="footer">
            <view>Copyright@-2023 保定珩臻数字科技有限公司</view>
            <view>All Rights Reserved.</view>
        </view> -->
            <vc-safe-bottom />
        </view>
    </vc-container>
</template>

<script>
import vcContainer from '@/components/library/base/vc-container/vc-container.vue'
import { getPublishVersion } from '../api/index'
export default {
    components: { vcContainer },
    name: 'about',
    data() {
        return {
            propsData: {
                props: {
                    title: {
                        value: '关于我们',
                    },
                }
            },
            curAppVersion: '1.0.0',
            imgLogo: this.minioBaseUrl + 'common/tabbarImages/logo_small_image.png',
            channelType: ''
        }
    },
    async onLoad(options) {
        this.channelType = await this.bridgeSdk.getChannel()
        console.log('channelType',this.channelType);
        this.getVersion();
    },
    computed: {

    },
    methods: {
        toprivacy() {
            // if (this.channelType == 'mini') {
                this.bridgeSdk.jumpPage({
                    url: this.minioBaseUrl+ 'hbdbucket/home/micro/hbd/agreement/privacy-mini.html',
                    title: '隐私政策'
                })
            // } else {
            //     this.bridgeSdk.openOuterPage({
            //         url: this.minioBaseUrl+ 'hbdbucket/home/micro/hbd/agreement/privacy-app.html?title=隐私政策',
            //         title: '隐私政策'
            //     })
            //     // this.bridgeSdk.jumpPage({
            //     //     url: this.minioBaseUrl+ 'hbdbucket/home/micro/hbd/agreement/privacy-app.html?title=隐私政策'
            //     // })
            // }

        },
        toxieyi() {
                this.bridgeSdk.jumpPage({
                    url: this.minioBaseUrl+ 'hbdbucket//home/micro/hbd/agreement/user_agree-mini.html',
                    title: '用户服务协议'
                })
        },
        toCustomIntro(){
            this.bridgeSdk.openOuterPage({
                url: this.minioBaseUrl+ 'hbdbucket//home/micro/hbd/agreement/consumer-rights-mini.html',
                title: '消费者权益保障措施说明'
            })
        },
        async getVersion() {
            this.curAppVersion = await this.bridgeSdk.getAppVersion();
            // getPublishVersion().then(res => {
            //     console.log("getVersion", res);
            //     if(res.respcode === "0000") {
            //         this.curAppVersion = res.result.appVersionDetail.versionNum
            //     } else {
            //         console.log("getVersion error", res);
            //     }
            // })
        },
        toDownload() { },
        contact() {
            this.bridgeSdk.jumpPage({
                url: "/pages/contact-us/index"
            })
        }
    }
}
</script>

<style scoped>
.footer {
    position: fixed;
    bottom: 60rpx;
    width: 100%;
    border: 0rpx;
    font-size: 24rpx;
    color: #8d8d8d;
    text-align: center;
}

.list {
    background-color: #ffffff;
    width: 700rpx;
    margin: 80rpx auto;
    border-radius: 20rpx;
}
</style>