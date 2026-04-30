<!--
 * @Author: chilei gchilei0815@gmail.com
 * @Date: 2026-04-29 14:49:55
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-30 09:43:13
 * @FilePath: /Recycle/miniprogram/src/pages/memberCode/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
<view>
    <vc-container :props-data="{ props: { title: { value: '回收' }, isFullScreen: { value: true } } }" class="memberCode">
        <view class="member-code-container">
            <view class="member-code-box">
                <view class="member-code-body">
                    <view class="member-code-body-title">
                        添加微信，了解更多回收信息
                    </view>
                    <view class="member-code-body-code">
                        <image class="member-code-body-code-image" :src="qrCodeUrl" mode="aspectFit">
                        </image>
                    </view>
                    <view class="member-code-body-desc">
                        <text>联系人微信二维码</text>
                    </view>
                </view>
            </view>
        </view>
        <vc-safe-bottom />
    </vc-container>
</view>
</template>
<script>
export default {
    data() {
        return {
            qrCodeUrl: this.staticBaseUrl + '/minio/common/mctImages/icon-weixin.png',
        }
    },
    onLoad() {
        console.log(this.staticBaseUrl + '/minio/common/mctImages/icon-weixin.png')
        // try {
        //     this.qrCodeUrl = this.bridgeSdk?.getMinioUrl?.() + '/common/mctImages/icon-weixin.png' || '/static/images/default-qrcode.png';
        // } catch (e) {
        //     this.qrCodeUrl = '/static/images/default-qrcode.png';
        // }
    }
}
</script>
<style scoped lang="scss">
.memberCode {
    background: linear-gradient(180deg, #aae1f5 0%, #ffffff 100%);
    min-height: 100vh;
}

.member-code-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40rpx;
}

.member-code-box {
    width: 658rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0rpx 8rpx 24rpx rgba(0, 0, 0, 0.1);
    padding: 40rpx;

    .member-code-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .member-code-body-title {
            font-size: 28rpx;
            color: #333333;
            font-weight: 500;
            margin-bottom: 30rpx;
        }

        .member-code-body-code {
            width: 300rpx;
            height: 300rpx;
            background: #f5f5f5;
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20rpx;

            .member-code-body-code-image {
                width: 100%;
                height: 100%;
                border-radius: 16rpx;
            }
        }

        .member-code-body-desc {
            font-size: 24rpx;
            color: #999999;
        }
    }
}
</style>