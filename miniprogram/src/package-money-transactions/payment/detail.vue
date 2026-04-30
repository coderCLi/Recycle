<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container :props-data="propsData">
        <view class="payment_detail">
            <view class="rows">
                <view class="title">商户编号</view>
                <view class="content">{{ info.mchId }}</view>
            </view>
            <view class="rows">
                <view class="title">商户名称</view>
                <view class="content">{{ info.mchName }}</view>
            </view>
            <view class="rows">
                <view class="title">消费时间</view>
                <view class="content">{{ info.createTime }}</view>
            </view>
            <view class="rows">
                <view class="title">支付通道</view>
                <view class="content">{{ info.payChnl }}</view>
            </view>
            <view class="rows">
                <view class="title">支付方式</view>
                <view class="content">{{ info.payMthd }}</view>
            </view>
            <view class="rows" v-if="info.bizScene == 'POINTS_MALL'">
                <view class="title">商品名称</view>
                <view class="content">{{ info.goodsName }}</view>
            </view>
            <view class="rows" v-if="info.bizScene == 'POINTS_MALL'">
                <view class="title">消费类型</view>
                <view class="content">{{ info.bizSceneName }}</view>
            </view>
            <view class="rows">
                <view class="title">订单金额(含商家补贴)</view>
                <view class="content">￥{{ info.orderAmt }}</view>
            </view>
            <view class="rows">
                <view class="title">实际支付金额</view>
                <view class="content">￥{{ info.payAmt }}</view>
            </view>
            <view class="rows">
                <view class="title">优惠金额</view>
                <view class="content">￥{{ info.discAmt||0 }}</view>
            </view>
            <!-- <view class="rows">
                <view class="title">商家补贴</view>
                <view class="content">￥{{ info.discAmt||0 }}</view>
            </view> -->
            <view class="rows" v-if="info.subPrice && info.subPrice !=0 ">
                <view class="title">平台补贴</view>
                <view class="content">￥{{ info.subPrice }}</view>
            </view>
            <view class="rows" v-if="info.discountRate&&info.discountRate!= 100">
                <view class="title">商户折扣率</view>
                <view class="content">{{formatDiscount(info.discountRate) }}</view>
            </view>
            <view class="rows">
                <view class="title">是否使用优惠券</view>
                <view class="content">{{ info.isUseCoupon||"否" }}</view>
            </view>
            <view v-if="couponBaseName" class="rows">
                <view class="title">优惠券</view>
                <view class="content">{{ couponBaseName}}</view>
            </view>
            
            <view class="rows">
                <view class="title">优惠券编号</view>
                <view class="content">{{ info.couponId }}</view>
            </view>
            <view class="rows" v-if="info.refundAmt">
                <view class="title">退款金额</view>
                <view class="content">￥{{ info.refundAmt||0 }}</view>
            </view>
            <view class="rows" v-if="info.refundAmt">
                <view class="title">退款时间</view>
                <view class="content">{{ info.refundTime || '' }}</view>
            </view>
            <view class="rows">
                <view class="title">备注</view>
                <view class="content">{{ info.remark }}</view>
            </view>
        </view>
    </vc-container>
</template>

<script>
import { getUserOrderInfo } from "../api/index";
export default {
    data() {
        return {
            propsData: {
                prop: {
                    title: {
                        value: '消费详情'
                    }
                }
            },
            info: {},
            couponDisAmt:'',// --优惠券优惠金额， 
            couponBaseName:'',//--优惠券名称
        }
    },
    onLoad(options){
        this.info = JSON.parse(options.info);
        console.log(this.info);
        this.getUserOrderInfo();
    },
    methods:{
        getUserOrderInfo(){
            getUserOrderInfo({
                id:this.info.id,
            }).then(res=>{
                // this.couponDisAmt = res.couponDisAmt;
                this.couponBaseName = res.couponBaseName;
            })
        },
        /**
             * 格式化折扣率显示
             * @param {number} rate - 折扣率（如90表示90%）
             * @returns {string} 格式化后的折扣字符串（如9折、87折）
             */
            formatDiscount(rate) {
                // 处理以0结尾的折扣率，去掉末尾的0
                let formattedRate = rate;
                if (rate % 10 === 0 && rate >= 10) {
                    formattedRate = rate / 10;
                }
                return `${formattedRate}折`;
            }
    }
}
</script>

<style scoped lang="scss">
.payment_detail {
    width: 750rpx;
    .rows {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 40rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #f0f0f0;
        background: #ffffff;
        .title {
            width: 280rpx;
            font-size: 28rpx;
            color: #333;
        }
       .content {
            font-size: 28rpx;
            color: #333;
        }
    }
}
</style>