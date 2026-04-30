<!--
 * @Description: 页面容器，默认使用页面配置中的标题，自带状态栏、导航头
 * @Author: yulongchen
 * @Date: 2024-12-16 09:22:07
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-07-04 17:22:37
 * @Remark: 
-->
<template>
    <!-- <view class="container" :class="{'full-screen': !!containerBackground.value}" :style="{background: containerBackground.value, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"> -->
    <!-- windowInfo.screenHeight 与 calc(100vh) 在某些有底部横条的安卓手机上值不一致, screenHeight是包含横条高度的真实的全屏高度, calc(100vh)高度是全屏高度 - 横条高度的剩余高度, 值偏小造成计算误差  -->
    <view class="container" :style="{background: containerBackground.value, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', height: !!containerBackground.value ? (windowInfo?.screenHeight ? windowInfo?.screenHeight + 'px' : '') : ''}">
        <!-- 默认显示状态栏和标题栏，标题栏使用pages.json中页面配置信息-->
        <view class="page-header">
            <vc-status-bar v-if="navPropsData?.props?.statusBar?.value != false" :props-data="statusBarPropsData" />
            <vc-navbar ref="navbar" v-if="navPropsData?.props?.navigationBar?.value != false" :props-data="navPropsData" @navBack="$emit('navBack', $event)" />
        </view>
        <view class="page-content" 
            :style="{
                paddingTop: safeTopDistance + 'px', 
                height: isFullScreen.value ? maxAviHeightWithNav + 'px' : 'auto',
                overflowY: overflowY.value || (disableScroll.value ? 'hidden' : 'auto')
            }">
            <slot />
        </view>
        <!-- <vc-safe-bottom /> -->
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import belong from "../intro.json";
    import props from "./props.js";
    import navProps from "../vc-navbar/props.js";
    import statusBarProps from "../vc-status-bar/props.js";
    import { mapState } from 'pinia'
    import { useBaseStore } from "@/store/index";
    const _navProps = JSON.parse(JSON.stringify({
        ...navProps,
        ...props
    }));
    export default {
        belong,
        mixins: [mixins],
        title: "外层容器",
        data() {
            return {
                ...JSON.parse(JSON.stringify(_navProps)),
                navPropsData: {
                    props: JSON.parse(JSON.stringify(_navProps))
                },

                ...JSON.parse(JSON.stringify(statusBarProps)),
                statusBarPropsData: {
                    props: JSON.parse(JSON.stringify(statusBarProps))
                },

                // safeTopDistance: 0,
            }
        },
        computed: {
            ...mapState(useBaseStore, {
                windowInfo: 'windowInfo',
                navigationBarInfo: "navigationBarInfo",
                maxAviHeightWithNav: "maxAviHeightWithNav"
            }),
            safeTopDistance(){
                let safeTopDistance = 0;
                if(this.navPropsData.props.statusBar.value != false){
                    safeTopDistance = this.navigationBarInfo.statusBarHeight;
                }
                if(this.navPropsData.props.navigationBar.value != false){
                    safeTopDistance += this.navigationBarInfo.navigationBarHeight;
                }
                return safeTopDistance;
            }
        },
        mounted(){
            // console.log("container mounted", this.propsData);
            const res = this.bridgeSdk.getCurrentRouter();
            // console.log("container res: ", res);

            // 导航头配置
            if(res.pageConf?.path){
                this.navPropsData.props.path.value = res.pageConf?.path;
            } else {
                this.navPropsData.props.path.value = this.path.value;
            }

            if(this.title.value){
                this.navPropsData.props.title.value = this.title.value;
            } else {
                this.navPropsData.props.title.value = res.pageConf?.style.navigationBarTitleText;
            }

            if(res.pageConf?.statusBar){
                this.navPropsData.props.statusBar.value = res.pageConf?.statusBar;
            } else {
                this.navPropsData.props.statusBar.value = this.statusBar.value;
            }

            if(res.pageConf?.navigationBar){
                this.navPropsData.props.navigationBar.value = res.pageConf?.navigationBar;
            } else {
                this.navPropsData.props.navigationBar.value = this.navigationBar.value;
            }

            if(res.pageConf?.navigationBarButtonType){
                this.navPropsData.props.buttonType.value = res.pageConf?.navigationBarButtonType;
            } else {
                this.navPropsData.props.buttonType.value = this.buttonType.value;
            }

            if(res.pageConf?.navigationBarRightText){
                this.navPropsData.props.rightText.value = res.pageConf?.navigationBarRightText;
            } else {
                this.navPropsData.props.rightText.value = this.rightText.value;
            }

            if(res.pageConf?.navigationBarBackgroundColor){
                this.navPropsData.props.bgColor.value = res.pageConf?.navigationBarBackgroundColor;
            } else {
                this.navPropsData.props.bgColor.value = this.bgColor.value;
            }

            if(res.pageConf?.navigationBarBorder){
                this.navPropsData.props.border.value = res.pageConf?.navigationBarBorder;
            } else {
                this.navPropsData.props.border.value = this.border.value;
            }

            if(res.pageConf?.navigationBarTitleColor){
                this.navPropsData.props.titleColor.value = res.pageConf?.navigationBarTitleColor;
            } else {
                this.navPropsData.props.titleColor.value = this.titleColor.value;
            }

            if(res.pageConf?.customLeftBack){
                this.navPropsData.props.customLeftBack.value = res.pageConf?.customLeftBack;
            } else {
                this.navPropsData.props.customLeftBack.value = this.customLeftBack.value;
            }

            // 状态栏配置
            if(res.pageConf?.statusBarBackgroundColor){
                this.statusBarPropsData.props.barBgColor.value = res.pageConf?.statusBarBackgroundColor;
            } else {
                this.statusBarPropsData.props.barBgColor.value = this.barBgColor.value;
            }

            // 优选json配置信息
            if(res.pageConf?.isFullScreen){
                this.isFullScreen.value = res.pageConf?.isFullScreen;
            }

            // 优选json配置信息
            if(res.pageConf?.containerBackground){
                this.containerBackground.value = res.pageConf?.containerBackground;
            }
            
            // let safeTopDistance = 0;
            // if(this.navPropsData.props.statusBar.value != false){
            //     safeTopDistance = this.navigationBarInfo.statusBarHeight;
            // }
            // if(this.navPropsData.props.navigationBar.value != false){
            //     safeTopDistance += this.navigationBarInfo.navigationBarHeight;
            // }
            // this.safeTopDistance = safeTopDistance;
            // console.log("safeTopDistance: ", safeTopDistance);

            // 导航头背景色非默认颜色白色时，取消底部线框显示，这种场景一般都是为了实现与页面一体化效果，所以默认取消底部边框
            if(this.navPropsData.props.bgColor.value != "#ffffff" && this.navPropsData.props.bgColor.value != "#fff" && this.navPropsData.props.bgColor.value != "white") {
                this.navPropsData.props.border.value = false;
            }
            
            // console.log("navPropsData: ", this.navPropsData.props);
            
            // console.log("statusBarPropsData: ", this.statusBarPropsData.props);

            console.log("container mounted", this.containerBackground);

        },
        methods: {
            addMenus(e){
                this.$refs.navbar.addMenus(e);
            },
            setNavPropsData(data = {}){
                this.navPropsData.props = Object.assign(this.navPropsData.props, data);
            }
        }
    }
</script>

<style lang="scss" scoped>
// .container {
//     &.full-screen {
//         height: calc(100vh);
//     }
// }
.page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    // background: red;
}
.page-content {
    // background: green;
}
</style>
