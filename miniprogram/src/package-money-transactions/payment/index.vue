/**
* @description: 客户扫商家码付款页面
*/
<template>
    <vc-modal ref="modal"> </vc-modal>
    <!-- @navBack="navBack" , customLeftBack: { value: true }-->
    <vc-container   :props-data="{ props: { title: { value: '支付' }, isFullScreen: { value: true } } }">
        <view class="shop_name">
            {{ mctName }}
        </view>
        <view class="payment" v-if="isLogined">
            <view class="scan_get_money_box">
                <view class="scan_get_money_title">付款金额</view>
                <view class="scan_get_money_content">
                    <view class="font_60">￥</view>
                    <input class="amtInput" type="digit" placeholder="请输入金额" v-model="amount" />
                </view>
            </view>
            <view class="scan_get_money_btn" @click="nextStep">下一步</view>
        </view>
        <!-- <view class="no_login_box">
            <view class="no_login_title">请先登录</view>
        </view> -->
    </vc-container>
</template>


<script>
import { mapState } from "pinia";
import {  useBaseStore } from "@/store/index";
import { getCouponForOrder , cancelOrderInfo} from "../api/index";
export default {

    name: "payment",
    computed: {
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            isLogined: false,
            mctId: '',
            amount: "",
            userGetId:'',
            beforePayAmt:'',
            useId:'',
            mctName:'',//全记山海·海鲜
        }
    },
    onShow() {
    },
    onLoad(options) {
        console.log("payment onLoad", options);
        // 扫码进入
        if (options.q) {
            let q = decodeURIComponent(options.q);
            // this.mctId = q.split('mctId=')[1];
            // console.log(q.split('mctId=')[1])
            // 30174417022482010104&mctName=冰冰冷饮
            // this.mctName = options.mctName;
            
            // 1. 解析URL获取查询参数 const params = parseQueryString(url);
            const params = this.parseQueryString(q);
            this.mctId = params.mctId; // "30174417022482010104"
            this.mctName = params.mctName; // "冰冰冷饮"
            console.log(this.mctId,this.mctName)
        }
        // 页面跳转
        if (options.mctId) {
            this.mctId = options.mctId;
        }
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
            return;
        }
        this.__loadData__();
    },
    methods: {
        parseQueryString(url) {
            const params = {};
            const queryString = url.split('?')[1] || '';
    
            queryString.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key) {
                params[key] = decodeURIComponent(value || '');
                }
            });
            
            return params;
        },
        __loadData__() {
            this.getUserInfo();
        },
        getUserInfo() {
            let userInfo = this.bridgeSdk.getUserInfo();
            console.log("用户信息", userInfo);

            if (!userInfo||!userInfo.userInfo) {
                console.log("用户未登录");
                this.bridgeSdk.toLogin();
            } else {
                console.log("用户已登录");
                this.userInfo = userInfo.userInfo;
                this.isLogined = this.userInfo.isLogin == '1';
                this.userId = this.userInfo.userId;
            }
        },
        getCouponForOrder(){
                return new Promise((resolve,reject)=>{
                    getCouponForOrder({
                        userId: this.userId,
                        mctId: this.mctId,
                        payAmount:this.amount
                    },{
                        catchError: true
                    }).then(res=>{
                        resolve(res);
                    })
                    .catch(err=>{
                        this.show = false;
                        if(err.code == '0009'){
                            this.$refs.modal.open({
                                title: '温馨提示',
                                content: err.message,
                                confirmText: '确定',
                                cancelText: '取消',
                                index: 999999999999,
                                confirmCallback:async () => {
                                    resolve(res);
                                }
                            })
                        }
                    })
                });
            },
       async nextStep() {
            if (!this.amount) {
                uni.showToast({
                    title: '请输入金额',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            if (!this.reg.checkMoney(this.amount)) {
                uni.showToast({
                    title: '请输入正确金额',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
           let res =  await this.getCouponForOrder();
           console.log(res,'<--------卡券接口参数返回的数据');
            this.userGetId = res.userGetId;//卡券领取id
            let amt = !res.userGetId ? this.amount : res.afterPayAmt;//优惠后金额
            console.log('查看是否有传入下一个页面 this.userGetId------->'+this.userGetId)
            uni.navigateTo({
                url: '/package-money-transactions/payment/select?mctId=' + this.mctId + '&amount=' +amt+ '&userGetId='+ this.userGetId +'&disAllAmt='+res.disAllAmt+'&disAmt='+res.disAmt
            })
        },
        navBack() {
            if(this.userGetId){
                cancelOrderInfo({
                    userId: this.userId,
                    mctId: this.mctId,
                    payAmount:this.amount
                }).then(res=>{
                    console.log('调用了卡券退回接口---cancelOrderInfo')
                })
            }
        }

    }
}
</script>

<style scoped lang="scss">
.payment {
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .scan_get_money_box {
        width: 750rpx;
        height: 914rpx;
        background: #FFFFFF;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        box-sizing: border-box;
        padding: 56rpx 54rpx;

        .scan_get_money_title {
            font-weight: 800;
            font-size: 30rpx;
            color: #191919;
            line-height: 42rpx;
        }

        .scan_get_money_content {
            font-weight: bold;
            font-size: 60rpx;
            line-height: 60rpx;
            color: #111;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 46rpx;
            padding-bottom: 26rpx;
            border-bottom: 2rpx solid #E8E8E8;
            // color: crimson;


            // .font_60 {
            //     font-size: 60rpx;
            //     line-height: 60rpx;
            // }
            .amtInput{
                height: 70rpx;
                font-size: 60rpx;
                line-height: 60rpx;
                // font-weight: 400;
                color: #000;
            }
        }
    }

    .scan_get_money_btn {
        width: 660rpx;
        height: 98rpx;
        background: #41C753;
        margin-top: 116rpx;
        font-weight: normal;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 98rpx;
        text-align: center;
        border-radius: 50rpx;
    }
}
.shop_name{
    background: #FFFFFF;
    width: 650rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 40rpx;
    padding: 50rpx;
}
</style>