<!--
 * @Description: Navbar 自定义导航栏 
 * @Author: yulongchen
 * @Date: 2023-06-08 08:59:45
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-02-13 17:30:41
-->
<template>
    <up-navbar
        :safeAreaInsetTop="false"
        :border="border.value"
        :fixed="fixed.value"
        :placeholder="false"
        :bgColor="bgColor.value"
        :height="`${height.value || navigationBarInfo.navigationBarHeight}px`"
        class="custom-navbar"
    >
        <template #left>
            <view
                class="u-nav-slot"
            >
                <view v-if="buttonType.value === 'back'" class="nav-left-icon" @click="navBack('back')">
                    <up-icon
                        class="arrow-left"
                        name="arrow-left"
                        size="19"
                        :color="titleColor.value"
                        
                    ></up-icon>
                </view>
                <view  v-if="buttonType.value === 'home'" class="nav-left-icon" @click="navBack('back')">
                    <up-icon
                        name="home"
                        size="20"
                        :color="titleColor.value"
                        
                    ></up-icon>
                </view>
                <view v-if="buttonType.value === 'pop'" class="nav-left-icon" @click="navBack('pop')">
                    <up-icon
                        name="arrow-left"
                        size="20"
                        :color="titleColor.value"
                        
                    ></up-icon>
                </view>
                
                
                
            </view>
        </template>
        <template #center>
            <view class="title ellipsis" :style="{color: titleColor.value}">
                {{ title.value }}
            </view>
            <slot name="centerIcon"></slot>
        </template>
        <template #right>
            <view class="u-nav-slot">
                <slot name="right" >
                    <text style="font-size:28rpx;color:#222;" @click="rightClick" :style="{color: titleColor.value}">{{rightText.value}}</text>
                </slot>
                <!-- #ifdef H5 -->                
                <up-icon
                    v-if="showMore.value"
                    name="more-dot-fill"
                    size="20"
                    :color="titleColor.value"
                    @click="morePopVisible = true"
                ></up-icon>
                <!-- #endif -->
                <!-- <up-icon
                    name="arrow-left"
                    size="19"
                ></up-icon>
                <up-line
                    direction="column"
                    :hairline="false"
                    length="16"
                    margin="0 8px"
                ></up-line>
                <up-icon
                    name="home"
                    size="20"
                ></up-icon> -->
            </view>
        </template>
    </up-navbar>
    <u-popup class="custom-popup" :show="morePopVisible" :round="10" mode="bottom" :safeAreaInsetBottom="false" @close="morePopVisible = false">
		<view class="menu-content">
            <view class="menu-item-box">
                <template v-for="(item, index) in menus" :key="index">
                    <!-- 分享比较特殊 -->
                    <template v-if="item.type === 'share'">
                        <vc-share @click.native="morePopVisible = false" class="menu-share">
                            <view class="menu-item">
                                <uni-icons class="menu-icon" :type="item.icon" size="30"></uni-icons>
                                <text class="menu-item-text">{{ item.text }}</text>
                            </view>
                        </vc-share>
                    </template>
                    <view class="menu-item" @click="item.click" v-else>
                        <uni-icons class="menu-icon" :type="item.icon" size="30"></uni-icons>
                        <text class="menu-item-text">{{ item.text }}</text>
                    </view>
                </template>
            </view>
            <text class="cancel-text" @click="morePopVisible = false">取消</text>
		</view>
	</u-popup>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    import { mapState, mapWritableState, mapActions } from 'pinia';
    import { useBaseStore } from "@/store/index.ts";

    export default {
        emits: ['navBack'],
        belong,
        mixins: [mixins],
        title: "自定义导航栏",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                morePopVisible: false,
                menus: [
                    {
                        icon: 'home',
                        text: '返回首页',
                        click: () => {
                            this.morePopVisible = false;
                            this.bridgeSdk.toFirstPage();
                        }
                    },
                    {
                        icon: 'weixin',
                        type: "share",
                        text: '微信好友分享'
                    },
                    {
                        icon: 'trash',
                        text: '清理缓存',
                        click: () => {
                            this.morePopVisible = false;
                            uni.showLoading({
                                title: '正在清理缓存...'
                            });
                            this.bridgeSdk.hi.clearCache({
                                complete: res => {
                                    console.log("clearCache: ", res);
                                    if(res.errCode !== 0) {
                                        setTimeout(() => {
                                            uni.hideLoading();                         
                                            uni.showToast({
                                                title: '清理缓存成功',
                                                icon: 'none'
                                            });
                                        }, 300);
                                    } 
                                    else {
                                        setTimeout(() => {
                                            uni.hideLoading();                         
                                            uni.showToast({
                                                title: '清理缓存失败',
                                                icon: 'none'
                                            });
                                        }, 300);
                                    }
                                }
                            });
                        }
                    }
                ],
                // buttonType: 'back',
                isInHiApp: false,
                // shareProsData: {
                //     title: {
                //         label: "分享标题",
                //         value: "",
                //     },
                //     type: {
                //         label: "分享类型",
                //         value: "",
                //     },
                //     content: {
                //         label: "分享内容",
                //         value: "",
                //     },
                //     path: {
                //         label: "分享路径",
                //         value: "",
                //     },
                //     imageUrl: {
                //         label: "分享图片",
                //         value: "",
                //     },
                //     miniAPPID: {
                //         label: "小程序miniAPPID",
                //         value: "",
                //     },
                //     miniAPPPath: {
                //         label: "小程序页面路径",
                //         value: "",
                //     },
                //     shareType: {
                //         label: "分享类型",
                //         value: "",
                //     }
                // }
            }
        },
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
            // 可读写状态
            // ...mapWritableState(useBaseStore, {
            //     runEnv: 'runEnv',
            //     navH: 'navH',
            // })
        },
        mounted() {
            const r = this.bridgeSdk.getCurrentRouter();
            // console.log("r: ", r);
            const title = this.title.value || r?.pageConf?.style?.navigationBarTitleText;
            this.title.value = title;
            // console.log("navigationBarInfo.navigationBarHeight: ", this.navigationBarInfo.navigationBarHeight);
            this.isInHiApp = this.bridgeSdk.isInHiApp();
        },
        methods: {
            // 扩展自定义菜单
            addMenus(menus) {
                this.menus = this.menus.concat(menus);
                console.log("addMenus: ", this.menus);
                this.menus.forEach(item=>{
                    const click = item.click || function() {};
                    item.click = () => {
                        this.morePopVisible = false;
                        click();
                    }
                })
            },
            // // 设置分享菜单数据
            // setShareMenuData(data = { title: { value: "" }, type: { value: "" }, content: { value: "" }, path: { value: "" }, imageUrl: { value: "" }, miniAPPID: { value: "" }, miniAPPPath: { value: "" }, shareType: { value: "" } }) {
            //     // // 更新分享数据，小程序右上角菜单分享时需要这些数据作为页面自定义的数据
            //     // this.bridgeSdk.beans.setShareInfo({
            //     //     title: data.title.value,
            //     //     path: data.path.value,
            //     //     // 使用默认图片
            //     //     imageUrl: data.imageUrl.value
            //     // });
            //     this.shareProsData = Object.assign(this.shareProsData, data);
            // },
            navBack(e){
                // console.log("navBack: ", e, this.customLeftBack);
                if(e == 'pop'){
                    this.$emit('navBack')
                } else {
                    if(this.customLeftBack.value){
                        this.$emit('navBack');
                    }
                    else {
                        this.bridgeSdk.navigateBackTo({ delta: 1 });
                    }
                }
            },
            rightClick(){
                // 向组件传值 
                this.$emit('rightClick')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .flex {
        display: flex;
    }

    .u-nav-slot {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .nav-left-icon{
        padding: 10rpx 14rpx;
        margin-left: -14rpx;
    }

    .title {
        /* #ifdef MP */
        max-width: calc(56vw);
        /* #endif */
        /* #ifdef H5 */
        max-width: calc(76vw);
        /* #endif */
        text-align: center;
        display: inline-block;
        vertical-align: baseline;
    }

    .custom-navbar ::v-deep .uicon-arrow-left {
        font-weight: 600 !important;
    }

    .custom-popup ::v-deep .u-popup__content {
        background: transparent;
        // .u-safe-bottom {
        //     padding-bottom: 0;
        // }
    }

    .menu-content {
        background: #F0F0F0;
        border-radius: 38rpx 38rpx 0rpx 0rpx;
        padding: 60rpx 0 0;

        .menu-item-box {
            @extend .flex;
            padding: 0 40rpx;
        }

        .menu-share {
            display: inline-block;
            margin: 0;
            padding: 0;
            width: fit-content;
        }

        .menu-item {
            @extend .flex;
            flex-direction: column;
            align-items: center;
            color: #666666;
            font-weight: 400;
            font-size: 24rpx;
            margin: 0 20rpx;
            padding-bottom: 38rpx;
        }

        .menu-text {
            line-height: 40rpx;
        }

        .menu-icon {
            width: 96rpx;
            height: 96rpx;
            background: #FFFFFF;
            border-radius: 10rpx;
            margin-bottom: 12rpx;
            text-align: center;
            line-height: 96rpx;
        }

        .menu-item-text {
            display: block;
            line-height: 30rpx;
        }

        .cancel-text {
            border-top: 1rpx solid #D8D8D8;
            text-align: center;
            padding: 33rpx 0;
            font-size: 34rpx;
            color: #17181A;
            line-height: 48rpx;
            display: block;
        }
    }
</style>
