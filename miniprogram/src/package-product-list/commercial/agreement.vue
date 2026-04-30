<template>
    <vc-modal ref="modal"/>
    <vc-container ref="container" :props-data="containerProps">
        <view class="content">
            <u-parse :content="bridgeSdk.addMinioPrefixToImgSrc(content)"></u-parse>
             <!-- <web-view :src="minioBaseUrl + 'hbdbucket//home/micro/hbd/agreement/merchant_apply-mini.html'" /> -->
        </view>
        <view v-if="!isDetail" @click="doAgree" :class="['btn', isBottom ? 'active' : '']">{{ isBottom ? '我已阅读' : '我已阅读'}}</view>
    </vc-container>
</template>

<script>
    import { getJsonDetailById } from "@/api/index";
    import uParse from '@/uni_modules/uview-plus/components/u-parse/u-parse.vue'
    export default {
        name: 'agreement',
        components: { uParse },
        data() {
            return {
                containerProps: {
                    props: {
                        containerBackground: {
                            value: 'white'
                        },
                        isFullScreen: {
                            value: false
                        }
                    }
                },
                content: '',
                isBottom: false,
                json_data_id: 'merchant_apply_agreement',
                isDetail: false,
            }
        },
        onLoad(options) {
            if(options.json_data_id) {
                this.json_data_id = options.json_data_id
            }
            this.isDetail = options.isDetail == '1'
            this.getAgreementDetail()
        },
        onReachBottom() {
            console.log('onReachBottom');
            this.isBottom = true
        },
        methods: {
            // 获取协议详情（JSON数据源）
            getAgreementDetail() {
                getJsonDetailById({
                    id: this.json_data_id
                }).then(res=>{
                    this.content = JSON.parse(res.content).content
                    this.$nextTick(() => {
                        this.$refs.container.setNavPropsData({
                            title: {
                                value: res.name
                            }
                        })
                    });
                })
            },
            // 同意协议
            doAgree() {
                this.bridgeSdk.showConfirm({
                    content: '乙方点击同意，或完成注册，或以其他任何方式使用/继续使用本协议项下服务的，即表示乙方已充分阅读、理解并自愿接受本协议，同意受本协议各项条款的约束。',
                    confirmText: '同意',
                    confirmCallback: () => {
                        this.bridgeSdk.navigateBackTo({
                            delta: 1,
                            success: page => {
                                page && page.doAgree && page.doAgree();
                            }
                        })
                    },
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.page-content) {
    background-color: white;
}
.content {
    padding:30rpx 20rpx 84rpx;
}
.btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 84rpx;
    line-height: 84rpx;
    text-align: center;
    font-size: 28rpx;
    color: white;
    background: #d0d0d0;
    z-index: 999;
}
.active {
    background: linear-gradient( 90deg, #8FBAFF 0%, #438AFB 100%);
}
</style>