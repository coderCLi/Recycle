<template>
    <view class="psd-header">
        <!-- 顶部圆弧渐变背景和导航栏 -->
        <view class="top-arc-bg" :style="{
            paddingTop: navigationBarInfo.statusBarHeight + 'px',
            height: navigationBarInfo.navigationBarHeight + 'px',
        }">
            <view class="nav-bar">
                <vc-back :props-data="{
                    props: { top: { value: '10px' } },
                }" />
            </view>
        </view>
        <!-- 密码管理卡片 -->
        <view class="password_manage_card">
            <view class="password_manage_card_left">
                <view class="password_manage_card_left_title">{{ title }}</view>
                <view class="password_manage_card_left_desc">{{ desc }}</view>
            </view>
            <view class="password_manage_card_right">
                <image class="password_manage_card_right_img" :src="minioBaseUrl + iconUrl" mode="scaleToFill" />
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
export default {
    name: "passwordManage",
    computed: {
        ...mapState(useUserStore, {
            isLogined: "isLogined",
        }),
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    props: {
        title: {
            type: String,
            default: "密码管理"
        },
        desc: {
            type: String,
            default: "管理交易密码，保障资金安全"
        },
        iconUrl: {
            type: String,
            default: "/common/mctImages/mimaguanli_icon_wangjimima_img.png"
        }
    }
}
</script>

<style scoped lang="scss">
.top-arc-bg {
    // position: relative;
    width: 100vw;
    // height: 360rpx;
    // background: linear-gradient(135deg, #19e2c2 0%, #00c6b1 100%);
    // border-bottom-left-radius: 60rpx;
    // border-bottom-right-radius: 60rpx;
    // margin-bottom: 120rpx;

    // z-index: 1;
    // overflow: visible;

    .nav-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        // height: 100rpx;
        // padding: 0 30rpx;
        // padding-top: 44rpx; // 适配状态栏
        position: relative;
        z-index: 2;

        .page-title {
            flex: 1;
            text-align: center;
            color: #fff;
            font-size: 38rpx;
            font-weight: bold;
            // margin-left: -44rpx; // 让标题居中
            letter-spacing: 2rpx;
        }
    }

    .resume-summary-card {
        // position: absolute;
        // left: 50%;
        // top: 150rpx;
        // transform: translateX(-50%);
        width: 690rpx;
        background: #fff;
        border-radius: 32rpx;
        background: linear-gradient(136deg, #ffffff 0%, #f5fffe 100%);
        box-shadow: 0px 4rpx 28rpx 0px rgba(1, 192, 185, 0.5);
        border-radius: 28rpx;
        display: flex;
        // flex-direction: column;
        align-items: flex-start;
        padding: 36rpx 32rpx 28rpx 28rpx;
        box-sizing: border-box;
        margin: 40rpx auto 40rpx;

        .resume-main {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;

            .resume-header {
                display: flex;
                align-items: center;
                margin-bottom: 12rpx;

                .resume-username {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #222;
                    margin-right: 16rpx;
                    max-width: 260rpx;
                    word-break: break-word;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .identity-tag {
                    display: flex;
                    align-items: center;
                    border: 2rpx solid #00c6b1;
                    color: #00c6b1;
                    font-size: 22rpx;
                    border-radius: 10rpx;
                    padding: 0 12rpx;
                    height: 36rpx;
                    margin-top: 2rpx;
                    margin-right: 8rpx;
                    background: #e6f9f7;
                }
            }
        }
    }
}

.password_manage_card {
    width: 100%;
    box-sizing: border-box;
    padding: 40rpx 0 0 56rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60rpx;

    .password_manage_card_left {
        flex-grow: 1;
        margin-right: 10rpx;
        text-align: left;

        .password_manage_card_left_title {
            font-size: 72rpx;
            font-weight: bold;
            color: #343434;
        }

        .password_manage_card_left_desc {
            font-weight: bold;
            font-size: 26rpx;
            color: #949494;
            line-height: 36rpx;
            margin-top: 42rpx;
        }
    }

    .password_manage_card_right {
        width: 320rpx;
        height: 308rpx;
        flex-shrink: 0;

        .password_manage_card_right_img {
            width: 320rpx;
            height: 308rpx;
        }
    }
}
</style>