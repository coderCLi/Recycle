<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main">

        <view style="padding: 30rpx;">
            <view class="article">
                服务标题：
                <text>{{ appraise.title }}</text>
            </view>
            <view class="article">
                服务描述：
                <text>{{ appraise.serviceContent }}</text>
            </view>
            <view class="rate" v-for="(item, index) in appraiseList" :key="index">
                <text>{{ item.name }}</text>
                <u-rate size="24" activeColor="#00BCB8" inactiveColor="#b2b2b2" v-model="item.score">
                </u-rate>
            </view>
            <view class="article fs32" style="margin-bottom: 20rpx;font-size:32rpx;">
                评价描述
            </view>
            <u--textarea height="100" class="textarea" :style="[{ background: '#F6F6F6', borderRadius: '12rpx' }]"
                :placeholderStyle="{ color: 'red' }" border="none" v-model="content" :placeholder="'说说您的感受，给大家参考'" count
                :maxlength="500"></u--textarea>


        </view>
        <view @click="subAppraise" class="bottom-btn">
            提交评价
        </view>

        <vc-safe-bottom />
    </vc-container>
</template>
<script>
import { appraiseList, subAppraise } from '../api/baseServices';
import { Toast } from '@/utils/http';
export default {
    name: "appraise",
    data() {
        return {
            evalId: '',
            propsData: {
                props: {
                    title: {
                        value: '评价信息'
                    },

                }
            },
            content1: '',
            count: 5,
            score: 0,
            content: '',
            appraiseList: [],
            appraise: {},

        }
    },
    async onLoad(options) {
        console.log(options);
        // this.bridgeSdk.setStorageSync('appToken', options.appToken);  // 已经全局处理了，不允许再写了，否则会用空值覆盖有效的值
        this.evalId = options.serviceId;

        // this.evalId = '6e76b6ee380347339ce6c57f5e383c61'
        // this.propsDataSub.props.serviceId.value = options.subId; 
        // this.propsData.props.title.value = options.title;

        this.getList()
    },
    mounted() {

    },
    methods: {
        getList() {
            let params = {
                id: this.evalId,
            }
            appraiseList(params).then(res => {
                this.appraise = res;
                let data = res.evaluateItemUserList;//评价详情列表 
                this.appraiseList = data.map(item => {
                    return {
                        itemId: item.itemId,
                        score: 0,
                        name: item.name,
                    }
                })
            })
        },
        subAppraise() {
            let params = {
                evalId: this.evalId,
                list: this.appraiseList,
                content: this.content,
            }
            let _this = this;
            console.log(params, "评价提交接口");
            subAppraise(params).then(res => {
                Toast('评价成功');
                _this.bridgeSdk.navigateBackTo({
                    delta: 1
                });
            })
        }
    },

}
</script>

<style lang="scss" scoped>
.main {
    background: #fff;
    height: 100vh;

    .article {
        margin-top: 10rpx;
        line-height: 50rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #222222;

        text {
            font-size: 28rpx;
            color: #999999;
        }
    }

    .rate {
        margin: 30rpx 0;
        display: flex;
        align-items: center;

        text {
            font-weight: bold;
            font-size: 24rpx;
            color: #999999;
            margin-right: 10rpx;
        }
    }

    .bottom-btn {
        position: fixed;
        bottom: 100rpx;
        left: 30rpx;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
        border-radius: 42rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: #FFFFFF;
        text-align: center;
        line-height: 80rpx;
        width: calc(100% - 60rpx);
    }
}

.u-textarea ::v-deep .u-textarea__count {
    background-color: #F6F6F6 !important;
}

.u-textarea ::v-deep textarea {
    font-size: 28rpx !important;
}
</style>