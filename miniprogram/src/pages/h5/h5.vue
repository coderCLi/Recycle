<!--
 * @Description: webview页面
 * @Author: chenyulong
 * @Date: 2024-11-01 09:25:29
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-06 09:58:08
 * @Remark: 
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <!-- #ifdef H5 -->    
    <vc-container class="h5-container" 
        :props-data="{
            props: {
                isFullScreen: {
                    value: true
                },
                title: {
                    value: title
                }
            }
        }">
        <web-view v-if="webviewUrl" :src="webviewUrl" @message="message" @load="load" @error="error" />
    </vc-container>
    <!-- #endif -->
     <!-- #ifdef MP -->
     <web-view v-if="webviewUrl" :src="webviewUrl" @message="message" @load="load" @error="error" />
     <!-- #endif -->
</template>
<script>
    export default {
        data() {
            return {
                webviewUrl: '',
                title: '',
            }
        },
        async onLoad(options) {
            await this.firstInit();
            console.log("webview页面加载", options);
            this.webviewUrl = options.url ? decodeURIComponent(options.url) : '';
            console.log("webview页面url", this.webviewUrl);
            this.title = decodeURIComponent(options.title || '');
            console.log("webview页面title", this.title);
            // 优选标题, 默认使用网页地址
            const _trackTitle = this.title || this.webviewUrl;
            console.log("埋点统计 _trackTitle: ", _trackTitle);
            this.trackReport.trackPageView(_trackTitle);
        },
        methods: {
            // 网页向应用 postMessage 时，会在特定时机（后退、组件销毁、分享）触发并收到消息
            message(event) {
                console.log("webview页面收到消息", event);
            },
            // 网页加载成功时候触发此事件
            load(event) {
                console.log("webview页面加载成功", event);
            },
            // 网页加载失败的时候触发此事件
            error(event) {
                console.log("webview页面加载失败", event);
            }
        }
    }
</script>

<style lang="scss">
    .h5-container {
        position: relative;
    }
</style>
