<!--
 * @Description: 大连海创嗨创生活app拉起微信小程序卡片分享、网页分享
 * @Author: yulongchen
 * @Date: 2024-12-18 08:44:20
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-05-21 11:40:06
 * @Remark: 
-->
<template>
    <button class="component share-btn" open-type="share" @click="handleShare">
        <slot />
    </button>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";

    // #ifdef H5
    import html2canvas from 'html2canvas'
    // #endif

    export default {
        belong,
        mixins: [mixins],
        title: "通用分享",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.propsData);
            // // #ifdef MP
            // if(this.propsData){
            //     console.log("小程序分享时自动调用mixins中onShareAppMessage分享方法", {
            //         title: this.title.value,
            //         content: this.content.value,
            //         // 使用默认图片
            //         imageUrl: this.imageUrl.value
            //     });
            //     // 更新分享数据
            //     this.bridgeSdk.beans.setShareInfo({
            //         title: this.title.value || this.shareTitle,
            //         content: this.content.value || this.shareContent,
            //         // 使用默认图片
            //         imageUrl: this.imageUrl.value || this.logoUrl,
            //     });
            // }
            // // #endif
        },

        methods: {
            // App分享
            async handleShare(){
                // 首选当前页面的分享信息
                const { route, fullPath, currRouter, pageConf } = this.bridgeSdk.getCurrentRouter();
                let onShareAppMessageData = currRouter.onShareAppMessageData || {};
                console.log("onShareAppMessageData: ", onShareAppMessageData);

                // 是否使用页面截图, app调用微信分享时限制卡片图在128k以下, 否则会报错超出限制
                const capturePage = this.capturePage.value || onShareAppMessageData.capturePage;

                // 分享图片, 优先使用默认配置的数据，其次使用页面分享配置信息
                const imageUrl = this.imageUrl.value || onShareAppMessageData.imageUrl;

                // 小程序版本
                const mini_version = onShareAppMessageData.VITE_ENV_VERSION;

                // 组件自定义数据
                const propsData = {
                    title: this.title.value,
                    path: this.path.value,
                    imageUrl: imageUrl,
                    content: this.content.value,
                    shareType: this.shareType.value,
                    url: this.url.value,
                    miniAPPID: this.miniAPPID.value,
                    miniAPPPath: this.miniAPPPath.value,
                    type: this.type.value
                };
                const existConfig = Object.keys(propsData).some(key => propsData[key]);
                // 如果组件有自定义数据时，则使用自定义数据的值，否则使用页面分享配置信息，否则使用默认值
                if(existConfig){
                    onShareAppMessageData = propsData;
                    console.log("propsData custom: ", onShareAppMessageData);
                }

                // #ifdef H5          
                // 网络地址转base64图片
                if(propsData.imageUrl && (propsData.imageUrl.startsWith("http://") || propsData.imageUrl.startsWith("https://"))){
                    try {
                        // 转换为base64字符串
                        this.shareDefaultBase64 = await this.bridgeSdk.convertImageUrlToBase64(imageUrl);
                        console.log("shareDefaultBase64: ", this.shareDefaultBase64);
                    } catch (error) {
                        this.shareDefaultBase64 = "";
                    }
                }
                // base64图片
                else if(propsData.imageUrl && propsData.imageUrl.startsWith("data:image/")) {
                    this.shareDefaultBase64 = propsData.imageUrl;
                }
                // 指定使用页面截图
                else if(capturePage){
                    const pageCaptureBase64 = await new Promise(resolve => {
                        setTimeout(() => {
                            html2canvas(document.querySelector('#app'), {
                                backgroundColor: null,// null 表示设置背景为透明色
                                useCORS: true, // 是否尝试使用CORS从服务器加载图像
                                allowTaint: true, // 允许跨域（图片跨域相关），服务器也需要做相应的图片跨域处理
                                taintTest: true, // 是否在渲染前测试图片
                                // 太小不清晰, 太大的话又造成图片超过128k限制分享无反应, 安卓客户端日志报错超过128k限制, 苹果客户端日志都不打印, 像是被webview拦截了
                                scale: 0.3, // dpr比列
                                scrollY: 0 // 截屏时页面滚动，造成截屏图片不全或空白
                            })
                            .then(canvas => {
                                let dataURL = canvas.toDataURL("image/png");
                                console.log(dataURL)
                                resolve(dataURL);
                            })
                            .catch(e => {
                                console.log(e)
                                resolve(null);
                            });
                        }, 1000);
                    });
                    this.shareDefaultBase64 = pageCaptureBase64;
                }

                const options = {
                    title: onShareAppMessageData.title || this.shareTitle,
                    content: onShareAppMessageData.content || this.shareContent,
                    // 图片base64字符串，优选自定义图片，默认logo图
                    logo: this.shareDefaultBase64 || this.logoBase64,
                };
                let share = null;
                // 分享类型
                // 小程序卡片，点击跳转小程序，默认此项
                if(onShareAppMessageData.shareType == "miniCard" || !onShareAppMessageData.shareType) {
                    console.log("小程序卡片，点击跳转小程序，默认此项")
                    share = this.bridgeSdk.hi.miniShare;
                    // 默认跳转大连海创嗨创生活小程序
                    options.miniAPPID = onShareAppMessageData.miniAPPID || this.huiMiniOriginId;
                    options.miniAPPPath = onShareAppMessageData.miniAPPPath || onShareAppMessageData.path || (options.miniAPPID === this.huiMiniOriginId? "/pages/home/home" : "");
                    // 优先使用功能的自定义版本类型(打开小程序的版本类型), 其次使用全局的版本类型
                    options.type = mini_version || __VITE_ENV_VERSION__;
                    // 备用地址，微信兼容低版本
                    options.url = this.baseUrl + "#/package-recommend-hbd/download/download";
                }
                // 小程序卡片，点击跳转网页
                else if(this.shareType.value == "url") {
                    console.log("小程序卡片，点击跳转网页")
                    share = this.bridgeSdk.hi.thirdShare;
                    options.url = onShareAppMessageData.path || this.baseUrl + "#/package-recommend-hbd/download/download";
                    // 类型 0：好友列表，1：朋友圈，2：收藏
                    options.type = onShareAppMessageData.type || "0";
                }

                // 分享微信
                if(options.type === "0") {
                    this.trackReport.trackCustom("分享微信-" + options.title);
                } 
                // 分享朋友圈
                else if(options.type === "1") {
                    this.trackReport.trackCustom("分享朋友圈-" + options.title);
                } 
                // 收藏
                else if(options.type === "2") {
                    this.trackReport.trackCustom("收藏-" + options.title);
                }

                console.log("H5分享", options);
                let _this = this;
                share({
                    ...options,
                    // 成功，可选参数
                    success: function(res) {
                        console.log(res);
                        _this.bridgeSdk.shareTrack({
                            title:options.title?options.title:"APP分享",
                            content: options.content?options.content:"APP分享内容",
                        })
                    },
                    // 失败，可选参数
                    fail: function(res) {
                        console.log(res);
                    },
                    // 无论成功、失败都会回调，可选参数
                    complete: function(res) {
                        // 成功
                        if (res.errCode === "1") {

                        }
                        // 失败
                        else {
                            
                        }
                    }
                });
                // #endif
                // // #ifdef MP
                // console.log("小程序分享时自动调用mixins中onShareAppMessage分享方法", {
                //     title: this.title.value,
                //     content: this.content.value,
                //     // 使用默认图片
                //     imageUrl: this.imageUrl.value
                // });
                // // 更新分享数据
                // this.bridgeSdk.beans.setShareInfo({
                //     title: this.title.value || this.shareTitle,
                //     content: this.content.value || this.shareContent,
                //     // 使用默认图片
                //     imageUrl: this.imageUrl.value || this.logoUrl,
                // });
                // // #endif
            }
        }
    }
</script>

<style lang="scss" scoped>
    .share-btn {
        background-color: transparent;
        line-height: 1;
        
        &::after{
            border: none;
        }
    }
</style>
