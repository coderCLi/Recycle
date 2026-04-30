<template>
    <vc-modal></vc-modal>
    <view class="password_manage">
        <image class="password_manage_bg" :src="minioBaseUrl + '/common/mctImages/bg_img_style02.png'"
            mode="scaleToFill" />
        <psd-header class="password_manage_header" title="密码管理" desc="密码管理，保障资金安全" iconUrl="/common/mctImages/mimaguanli_top_icon_style01_img.png"></psd-header>
        <view class="function_item bg1" @click="passwordModify">
            <image class="function_item_img" :src="minioBaseUrl + '/common/mctImages/mimaguanli_icon_wangjimima_img.png'"
                mode="scaleToFill" />
            <view class="function_item_btn">
                修改密码
            </view>
        </view>
        <view class="function_item bg2" @click="passwordForget">
            <image class="function_item_img" :src="minioBaseUrl + '/common/mctImages/mimaguanli_icon_xiugaimima_img.png'"
                mode="scaleToFill" />
            <view class="function_item_btn">
                忘记密码
            </view>
        </view>
    </view>

</template>

<script>
import psdHeader from '../components/psdHeader.vue';
export default {
  components: { psdHeader },
    name: "passwordManage",
    methods: {
        passwordModify(){
            uni.navigateTo({
                url: '/package-money-transactions/password/changePassword'
            });
        },
        passwordForget(){
            uni.navigateTo({
                url: '/package-money-transactions/password/setPassword'
            });
        }
    }
}
</script>

<style scoped lang="scss">
.password_manage {
    width: 750rpx;
    height: 100vh;
    background: linear-gradient(to bottom, #f5f5f5 0%, #fff 40%, #fff 100%);
    position: relative;
}
.password_manage_header{
    position: relative;
}
.password_manage_bg {
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 0;
}
.function_item {
    width: 669rpx;
    height: 220rpx;
    box-sizing: border-box;
    padding: 26rpx 62rpx 30rpx 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 64rpx auto 0;
    border-radius: 20rpx;
    position: relative;

    .function_item_img {
        width: 164rpx;
        height: 164rpx;
    }

    .function_item_btn {
        width: 180rpx;
        height: 50rpx;
        background: #ffffff;
        border-radius: 50rpx;
        font-size: 24rpx;
        font-weight: bold;
        text-align: center;
        line-height: 50rpx;
    }
}

.bg1 {
    background: linear-gradient(226deg, #E0E7FF 0%, #CDD9FF 100%);
}

.bg2 {
    background: linear-gradient(225deg, #D9ECFF 0%, #ADD4FE 100%);
}
</style>