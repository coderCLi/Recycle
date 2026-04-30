<template>
    <view class="header-logo" :style="`padding-top: ${navigationBarInfo.statusBarHeight}px`">
        <image :src="minioBaseUrl+logoUrl" class="header-logo__img" mode="heightFix" :style="`height: ${navigationBarInfo.navigationBarHeight}px`"></image>
    </view>
</template>

<script>
import {
    mapState
} from "pinia";
import {
    useBaseStore
} from "@/store/index";
export default {
    name: "vcHeaderLogo",
    computed: {
        ...mapState(useBaseStore, {
            navH: "navH",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            logoUrl: "/common/tabbarImages/logo_small_image.png"
        };
    },
    mounteed() {
        console.log("vcHeaderLogo mounted", this.navH, this.navigationBarInfo);
    },
}
</script>

<style scoped>
.header-logo{
    padding-left: 32rpx;
    width: 750rpx;
    box-sizing: border-box;
    background: #FEF1DE;
}</style>