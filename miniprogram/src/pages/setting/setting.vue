<template>
    <vc-modal ref="modal"></vc-modal>
  <vc-container class="setting">
    <view class="setting-box">
        <view class="setting-row" @click="toPersonalInfo">
            <view class="setting-title">个人资料</view>
            <view class="setting-content">
                <up-icon name="arrow-right" size="14"></up-icon>
            </view>
        </view>
        <!-- <view class="setting-row" @click="changePassword">
            <view class="setting-title">修改密码</view>
            <view class="setting-content">
                <up-icon name="arrow-right" size="14"></up-icon>
            </view>
        </view> -->
        <!-- #ifdef H5 -->
        <view class="setting-row" @click="clearCache"> 
            <view class="setting-title">清除缓存</view>
            <view class="setting-content">
                <view>{{ tempSize }}</view>
                <up-icon name="arrow-right" size="14"></up-icon>
            </view>
        </view>
        <view class="setting-row" @click="logoff"> 
            <view class="setting-title">注销账户</view>
            <view class="setting-content">
                <view>{{ tempSize }}</view>
                <up-icon name="arrow-right" size="14"></up-icon>
            </view>
        </view>
        <!-- #endif -->
    </view>
    <up-button class="logout-btn" type="default" text="退出登录" @click="logout"></up-button>
    
  </vc-container>
</template>

<script>
import { requestToken } from "@/api/requestToken";
export default {
    name: "Setting",
    data() {
        return {
            tempSize: "",
        };
    },
    methods: {
        __loadData__() {

        },
        toPersonalInfo() {
            this.bridgeSdk.jumpPage({
                url: '/pages/personInfo/personInfo'
            })
        },
        changePassword() {
            // 用旧密码，修改
            this.bridgeSdk.jumpPage({
                url: "/pages/password/edit",
            });
        },
        clearCache() {
            this.$refs.modal.open({
                content: '确定清除缓存吗？',
                confirmCallback: (res) => {
                    uni.clearStorage()
                }
            })
        },
        logoff() {
            this.bridgeSdk.jumpPage({
              url: '/pages/logoff/logoff'
           })
        },
        logout() {
            this.$refs.modal.open({
                // title: '提示',
                content: '确定退出登录吗？',
                confirmCallback: (res) => {
                    // if (res.confirm) {
                        // uni.switchTab({
                        //     url: '/pages/mine/mine'
                        // })

                        this.trackReport.trackCustom("退出登录");

                        this.bridgeSdk.logout(() => {
                            requestToken();
                        })
                    // }
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.setting{
    width: 100%;
    height: 100vh;
    background: #ffffff;

    .setting-box{
        width: 100%;
        box-sizing: border-box;
        padding: 0 40rpx;
        // background: #fff;

        .setting-row{
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 32rpx 20rpx;         
            border-bottom: 1px solid #eee;
            .setting-title{
                font-size: 28rpx;
                color: #222;
                font-weight: 600;
            }
            .setting-content{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-grow: 1;
                min-width: 100rpx;
                font-size: 28rpx;
                color: #777;
                .up-icon{
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    color: #999;
                }
            }
        }
    }
    .logout-btn{
        width: 670rpx;
        margin: 72rpx auto 0;
        font-size: 32rpx;
        font-weight: 600;
        border-radius: 10px;
        border: 2px solid #DDDDDD;
        background: #fff;
    }
    .confirmbtn{
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
        border-radius: 10px;
        color: #fff;
    }
}
</style>