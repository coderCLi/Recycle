<!--
 * @Description: 天气区域组件
 * @Author: yulongchen
 * @Date: 2024-11-25 11:48:39
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-18 17:16:54
 * @Remark: 
-->
<template>
    <view class="component" :style="{ 'padding-top': (safeTopDistance === undefined ? defaultSafeTopDistance : safeTopDistance) - 9 + 'px' }">
        <view class="cpa-flex cpa-row cpa-justify-between cpa-align-center cpa-px-12-5 space-v-10">
            <view class="cpa-flex cpa-row  cpa-align-center same-width">
                <!-- 位置 -->
                <view class="cpa-flex cpa-row cpa-align-center">
                    <!-- <uni-icons type="location" size="20" style="color: #457f76"></uni-icons> -->
                    <image style="width: 24rpx; height: 22rpx;" :src="minioBaseUrl + dingweipng" mode="aspectFit" />
                    <view id="cityName" class="cpa-ml-5 cpa-font-12">{{cityName.value}}</view>
                </view>
                <!-- 天气 -->
                <view v-if="showWeather.value" @click="toOpenWeather" class="cpa-font-12 cpa-ml-10">
                    {{ weatherInfo.weather }} {{ weatherInfo.temperature }}°C
                </view>
            </view>
            <slot></slot>
            <view class="cpa-flex cpa-row cpa-align-center cpa-font-12 same-width flex-end">
                <!-- 快捷入口,客服 -->
                <!-- 小程序端，不支持打开此https -->
                <!-- #ifd ef H5 -->
                <!-- <image
                    class="service-icon"
                    :src="staticBaseUrl + '/hbdimage/main/images/home/kefu.png'"
                    mode="widthFix"
                    @click="toIntelService"
                ></image> -->
                <view class="menus flex">
                    <view class="icon-box">
                        <image
                            class="img"
                            :src="minioBaseUrl + 'common/pages-home/message.png'"
                            @click="bridgeSdk.jumpPage({ url: '/pages/message/message', title: '消息中心', needLogin: true })"
                            mode="widthFix"
                        ></image>
                        <!-- <text class="dot" v-if="messageCount.value > 0"></text> -->
                        <slot name="message"></slot>
                    </view>
                    <view class="icon-box">
                        <image
                        class="img"
                        :src="minioBaseUrl  + 'common/pages-home/saoma.png'"
                        @click="scanCode"
                        mode="widthFix"
                        ></image>
                    </view>
                </view>
                <!-- #e ndif -->
                <!-- 快捷菜单弹窗 -->
                <!-- <view class="cpa-ml-10 relative">
                    <vc-popover ref="popover" :actions="actions" @select="handleSelect">
                        <image
                            class="service-icon"
                            mode="widthFix"
                            :src="staticBaseUrl + '/hbdimage/main/images/home/展开.png'"
                        ></image>
                    </vc-popover>
                    <slot name="message"></slot>
                </view> -->
            </view>
        </view>        
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    import vcPopover from "../vc-popover/index.vue";
    import { mapState } from 'pinia'
    import { useBaseStore } from "@/store/index";
    export default {
        components: {
            vcPopover
        },
        belong,
        mixins: [mixins],
        title: "天气区域组件",
        data() {
            return {
                showPopover: false,
                // , { name: '收藏', _method: 'collect' }
                quickPopupVisible: false,
                dingweipng: 'common/hbdbucket/static/dingwei.png',
                ...JSON.parse(JSON.stringify(props)),
                // 小程序端初次进入时，由于状态管理获取的值慢，有时候会出现safeTopDistance获取不到值的情况，这里定义一个默认值，防止高度塌陷
                defaultSafeTopDistance: 85
            }
        },
        computed: {
            ...mapState(useBaseStore, {
                safeTopDistance: 'safeTopDistance',
                weatherInfo: "weatherInfo"
            }),
            actions() {
                return [{ name: '消息', _method: 'messageCenter', messageCount:  this.messageCount.value}, { name: '扫一扫', _method: 'scanCode' }, { name: '便民电话', _method: 'conveniencePhone' }]
            }
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },

        methods: {
            toggle() {
                console.log("toggle");  
                this.$refs.popover && this.$refs.popover.close();
            },
            handleSelect(item){
                console.log("选择了：", item);
                this[item._method] && this[item._method]();
            },
            scanCode(){
                this.bridgeSdk.scanCode(res=> {
                    console.log("扫码成功：", res);
                    // #ifdef H5
                    this.bridgeSdk.jumpPage({
                        url: res.data.code
                    }); 
                    // #endif
                });
            },
            collect(){
                this.bridgeSdk.jumpPage({
                    isBuilding: true
                }); 
            },
            messageCenter(){
                // this.bridgeSdk.jumpPage({ url: this.getRealUrl('/pages/message/message'), title: '消息中心', needLogin: true, extra_config: { showNavBar: "0", showStatusBar: "0", setCapsule: "0" } });
                this.bridgeSdk.jumpPage({ url: '/pages/message/message', title: '消息中心', needLogin: true});
            },
            conveniencePhone() {
                // this.bridgeSdk.jumpPage({ url: this.getRealUrl('/pages/convenienceTel/convenienceTel'), title: '便民电话', needLogin: false, extra_config: { showNavBar: "0", showStatusBar: "0", setCapsule: "0" } });
                this.bridgeSdk.jumpPage({ url: '/pages/convenienceTel/convenienceTel', title: '便民电话', needLogin: false });
            },
            getRealUrl(url) {
                // #ifdef H5
                const _q = url.indexOf("?") > -1 ? "&" : "?";
                // h5端拼接完整地址(为了打开新窗口跳转第三方), 小程序端返回原地址   -- locationPath后直接拼接#
                let locationPath = location.origin + location.pathname;
                url = (locationPath.slice(-1) == '/' ? locationPath.slice(0, -1) : locationPath) + "#" + url + _q + "appToken=" + this.bridgeSdk.getStorageSync("appToken");
                // #endif
                return url;
            },
            toOpenWeather() {
                // 只有h5跳转到天气预报页面
                // #ifdef H5              
                let path = 'http://bj.weweather.net/Home/MultiArea?location=2&m=54602&city=%E4%BF%9D%E5%AE%9A%E5%B8%82&county=%E7%AB%9E%E7%A7%80%E5%8C%BA'
                this.bridgeSdk.jumpPage({
                    contentType: '2',
                    url: path,
                    title: '天气',
                });
                // #endif
            },
            toIntelService() {
                console.log("点击了客服");
                this.bridgeSdk.toIntelligentService();
            }
        },
    }
</script>

<style lang="scss" scoped>
.service-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 16rpx;
  float: left;
}
.relative {
    position: relative;
}
.space-v-10 {
    padding-top: 10rpx;
    padding-bottom: 20rpx;
}
.same-width {
    width: 230rpx;
}
.flex-end {
    justify-content: flex-end;
}
.menus {
    .icon-box {
        position: relative;
        &:last-child {
            margin-left: 28rpx;
        }
        .img {
            width: 40rpx;
            height: 40rpx;
        }
        .dot {
            position: absolute;
            top: -6rpx;
            left: 22rpx;
            width: 16rpx;
            height: 16rpx;
            background: red;
            display: block;
            z-index: 1;
            border-radius: 20rpx;
        }
    }
}
</style>
