<!--
 * @Description: 通用模态窗
 * @Author: yulongchen
 * @Date: 2024-12-26 17:22:54
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-08 11:15:49
 * @Remark: 
-->
<template>
    <view class="component modal">
        <template v-if="type == 'alert'">
            <u-overlay :show="show">
                <view class="modal-box">
                    <view class="modal-content-container">
                        <!-- 首选slot形式标题 -->
                        <slot v-if="$slots.title" name="title"></slot>
                        <!-- 备选title字段标题 -->
                        <view v-else-if="title.value" class="modal-title">
                            {{title.value}}
                        </view>

                        <!-- 首选slot形式内容 -->
                        <slot v-if="$slots.content" name="content"></slot>
                        <!-- 备选content字段内容 -->
                        <view v-else class="modal-content">
                            <view class="custom-html-string" v-if="htmlString.value" v-html="htmlString.value"></view>
                            <template v-else>{{content.value}}</template>
                        </view>

                        <view class="modal-footer">
                            <template v-if="showCancel.value">                        
                                <slot v-if="$slots.cancelBtn" name="cancelBtn"></slot>
                                <view v-else class="modal-btn-cancel" @click="onCancel">{{cancelText.value}}</view>
                            </template>

                            <slot v-if="$slots.confirmBtn" name="confirmBtn"></slot>
                            <view v-else class="modal-btn-confirm" @click="onConfirm">{{confirmText.value}}</view>
                        </view>
                    </view>
                </view>
            </u-overlay>
        </template>
        <template v-else-if="type == 'toast'">
            <template v-if="show">
                <u-overlay :show="show" zIndex="11070" opacity="0.0">
                    <view class="toast-box">
                        <view class="toast-content-container">
                            <!-- 首选slot形式标题 -->
                            <slot v-if="$slots.title" name="title"></slot>
                            <!-- 备选title字段标题 -->
                            <view v-else-if="title.value" class="toast-title">
                                {{title.value}}
                            </view>
                        </view>
                    </view>
                </u-overlay>
            </template>
        </template>
    </view>
</template>

<script>
    /**
     * 使用示例
     * title、content字段都是可选的，可以直接使用propsData传入，也可以使用slot形式传入，slot形式优先级最高
     * 简洁方式：
     * <vc-modal :props-data="{ props: { title: { value: '提示' }, content: { value: '广告提示' }, confirmText: { value: '知道了' }, cancelText: { value: '稍后提醒' }, showCancel: { value: false }, confirmCallback: () => { console.log('确定回调') }, cancelCallback: () => { console.log('取消回调') } }"></vc-modal>
     * slot形式：
     <vc-modal>
        <template #title>
            title
        </template>
        <template #content>
            content
        </template>
        <template #cancelBtn>
            cancelBtn
        </template>
        <template #confirmBtn>
            confirmBtn
        </template>
     </vc-modal>
     */
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "通用模态窗",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                show: false
            }
        },
        mounted() {

        },
        methods: {
            open({
                type = 'alert',
                duration = 2000,
                title = '温馨提示',
                content = '这是一段默认提示文本内容',
                htmlString = '',
                confirmText = '确定',
                cancelText = '取消',
                showCancel = true,
                confirmCallback = () => {},
                cancelCallback = () => {},
             }){
                this.type = type;
                this.duration = duration;
                this.title.value = title;
                this.content.value = content;
                this.htmlString.value = htmlString;
                this.confirmText.value = confirmText;
                this.cancelText.value = cancelText;
                this.showCancel.value = showCancel;
                this.confirmCallback = confirmCallback;
                this.cancelCallback = cancelCallback;
                this.show = true;
                if (this.type == 'toast') {
                    console.log("-----modal toast " + title);
                    setTimeout(()=> {
                        this.show = false;
                    }, duration);
                }
            },
            close(){
                this.show = false;
            },
            onCancel(){
                this.cancelCallback && this.cancelCallback();
                this.show = false;
            },
            onConfirm(){
                this.confirmCallback && this.confirmCallback();
                this.show = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-box {
        display: flex;
        align-items: center;
        height: calc(100vh);
    }
    .toast-box {
        display: flex;
        align-items: center;
        height: calc(100vh);
        justify-content: center;
    }
    .toast-content-container {
        background-color: rgba(0,0,0,.6);
        padding: 24rpx 40rpx;
        border-radius: 10rpx;
        color: #fff;
        max-width: 63%;
        font-size: 26rpx;
        box-sizing: border-box;
    }

    .modal-content-container {
        width: 74%;
        background: #FFFFFF;
        border-radius: 20rpx;
        padding: 30rpx 40rpx;
        box-sizing: border-box;
        margin: 0 auto;

        .modal-title {
            padding-bottom: 12px;
            font-size: 30rpx;
            color: #333;
            font-weight: 500;
            text-align: center;
        }

        .modal-content {
            font-size: 30rpx;
            line-height: 44rpx;
            margin-bottom: 40rpx;
            // padding-top: 20rpx;
            text-align: center;
            
            max-height: 60vh;
            overflow-y: auto;
        }


        .modal-footer {
            display: flex;
            justify-content: center;

        }

        .modal-btn-cancel, .modal-btn-confirm {
            width: 280rpx;
            line-height: 64rpx;
            border-radius: 20rpx;
            font-weight: 600;
            font-size: 28rpx;
            text-align: center;

            &:active {
                opacity: 0.72;
            }

        }

        .modal-footer {
            display: flex;
            justify-content: center;
        }

        .modal-btn-cancel {
            color: #222222;
            margin-right: 40rpx;
            border: 2rpx solid #AAAAAA;
        }

        .modal-btn-confirm {
            background: linear-gradient( 132deg,  #58A1F6 0%, #6FA9F7 100%), #FF5871;
            color: #FFFFFF;
        }

    }
</style>
