<!--
 * @Description: 订单详情
 * @Autor: TF
 * @Date: 2025-06-12 19:58:09
 * @LastEditors: TF
 * @LastEditTime: 2025-08-20 16:41:54
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-status-bar :props-data="{
        props: {
            barBgColor: {
                value: 'transparent'
            }
        }
    }"/>
    <up-navbar
        :safeAreaInsetTop="false"
        :border="false"
        :fixed="false"
        bgColor="transparent"
        :height="`${navigationBarInfo.navigationBarHeight}px`"
        class="custom-navbar">
        <template #left>
            <up-icon name="arrow-left" size="19" color="white" @click="navBack()"></up-icon>
        </template>
        <template #center>
            <view class="title ellipsis">订单详情</view>
        </template>
        <template #right>
            <up-icon name="kefu-ermai" size="19" color="white" @click="toIntelligentService()"></up-icon>
        </template>
    </up-navbar>

    <view>
        <view class="topbg" :style="{marginTop: `-${navigationBarInfo.navigationBarHeight + navigationBarInfo.statusBarHeight}px`, height: info.orderStatus == '00' || info.orderStatus == '01' || (info.orderStatus == '04' && info.remark) ? '422rpx' : '356rpx'}">
            <!-- 交易完成且未使用优惠券 -->
            <view class="topbg-text" v-if="!hasUse && info.orderStatus == '02'">待使用</view>
            <!-- 交易完成且已使用优惠券 -->
            <view class="topbg-text" v-else-if="hasUse && info.orderStatus == '02'">交易成功</view>
            <!-- 其他情况 -->
            <view class="topbg-text" v-else :style="{bottom: info.orderStatus == '00' || info.orderStatus == '01' || (info.orderStatus == '04' && info.remark) ? '164rpx' : '98rpx'}">{{ orderStatusMap[info.orderStatus] }}</view>


            <!-- 待付款时倒计时 -->
            <view class="topbg-count" v-if="info.orderStatus == '00' || info.orderStatus == '01'">
                交易剩余时间
                <up-count-down
                    :time="countTime"
                    format="HH:mm:ss"
                    autoStart
                    @change="onChange"
                    @finish="onFinish">
                    <view class="time">
                        <view class="time__custom">
                            <text class="time__custom__item">{{ timeData.minutes >= 10 ? timeData.minutes : '0' + timeData.minutes }}</text>
                        </view>
                        <text class="time__doc">:</text>
                        <view class="time__custom">
                            <text class="time__custom__item">{{ timeData.seconds >= 10 ? timeData.seconds : '0' + timeData.seconds }}</text>
                        </view>
                    </view>
                </up-count-down>
            </view>
            <!-- 已取消时取消原因 -->
            <view class="topbg-tip" v-if="info.orderStatus == '04' && info.remark">{{ info.remark }}</view>
        </view>
        <!-- sku信息 -->
        <view class="info">
            <view class="info-top" v-for="(item, index) in info.productInfo" :key="index">
                <image :src="minioBaseUrl + item.listPicUrl" mode="scaleToFill"/>
                <view style="flex: 1;">
                    <view class="item_flex" style="font-size: 28rpx;color: #333;line-height: 40rpx;">
                        <view class="text-overflow" style="width: 80%;font-weight: bold;">{{ item.spuName }}</view>
                        <view style="color: #999999;">¥{{ item.subOrderAmt }}</view>
                    </view>
                    <view class="item_flex" style="font-size: 24rpx;color: #999999;line-height: 33rpx;margin-top: 4rpx;justify-content: flex-end;">
                        <view>x{{ item.number }}</view>
                    </view>
                    
                    <view v-if="index == info.productInfo.length - 1" class="item_flex" style="font-size: 24rpx;color: #FF5871;line-height: 33rpx;margin-top: 6rpx;justify-content: flex-end;">
                        <!-- 待使用、已取消 -->
                        <template v-if="!hasUse && info.orderStatus == '02' || info.orderStatus == '04'">
                            <view @click="buyAgain">再次购买</view>
                        </template>
                        <!-- 交易成功 -->
                        <template v-if="hasUse && info.orderStatus == '02'">
                            <view @click="doRate">去评价</view>
                        </template>
                        <!-- 待支付 -->
                        <template v-if="info.orderStatus == '00' || info.orderStatus == '01'">
                            <view @click="doPay">在线支付</view>
                        </template>

                        <view>¥{{ info.payPrice }}</view>
                        <up-icon name="arrow-right" color="#FF5871" size="12"/>
                    </view>
                </view>
            </view>
            <view class="info-bottom" @click="doUseDetail">
                <view style="margin-right: 5rpx;">使用规则</view>
                <up-icon name="arrow-right" color="#333333" size="12"/>
            </view>
        </view>
        <!-- 商家信息 -->
        <view class="store" v-if="bridgeSdk.checkIsEmpty(storeInfo)">
            <view class="store-title">商家信息</view>
            <view class="store-name muti-overflow">{{ storeInfo.storeName }}</view>
            <view class="store-info">
                <view class="store-info_content">
                    <view class="item">
                        <image :src="staticBaseUrl + '/hbdimage/package-product-list/shijian.png'" mode="scaleToFill"/>
                        <view>营业时间：{{ storeInfo.storeTimeText }}</view>
                    </view>
                    <view class="item">
                        <image style="width: 18rpx;height: 23rpx;" :src="staticBaseUrl + '/hbdimage/package-product-list/dingwei.png'" mode="scaleToFill"/>
                        <view class="text-overflow">{{ storeInfo.provinceName }}{{ storeInfo.cityName }}{{ storeInfo.areaName }}{{ storeInfo.storeAddress }}</view>
                    </view>
                </view>
                <view class="store-info_icon">
                    <view class="flex flex_col" style="align-items: center;justify-content: center;margin-right: 28rpx;" @click="goMap">
                        <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/location.png'" mode="scaleToFill" />
                        <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">导航</view>
                    </view>
                    <view class="flex flex_col" style="align-items: center;justify-content: center;" @click="goPhone">
                        <image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'" mode="scaleToFill" />
                        <view style="font-weight: 400; font-size: 24rpx;color: #333333;white-space: nowrap;">电话</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 订单信息 -->
        <view class="order">
            <view class="order-title">订单信息</view>
            <view class="order-content">
                <view class="item">
                    <view>订单号</view>
                    <view style="display: flex;align-items: center;">
                        {{ orderNo }}
                        <image @click="doCopy(orderNo)" :src="staticBaseUrl + '/hbdimage/examination/fuzhi1.png'"/>
                    </view>
                </view>
                <view class="item">
                    <view>手机号</view>
                    <view>{{ ellipsisPhone(phone) }}</view>
                </view>
                <view class="item">
                    <view>下单时间</view>
                    <view>{{ info.payTimeFmt }}</view>
                </view>
                <!--  -->
                <view class="item" v-if="info.orderStatus == '02'">
                    <view>支付时间</view>
                    <view>{{ info.payEndTimeFmt }}</view>
                </view>
                <!-- 退款中 -->
                <view class="item" v-if="['01'].includes(info.refundStatus)">
                    <view>申请退款时间</view>
                    <view>{{ info.refundDate }}</view>
                </view>
                <!-- 退款成功 -->
                <view class="item" v-if="['02'].includes(info.refundStatus)">
                    <view>退款时间</view>
                    <view>{{ info.refundDate }}</view>
                </view>
            </view>
        </view>

        <!-- 底部按钮操作区 -->
        <view class="bottom">
            <!-- 可使用、已取消 -->
            <template v-if="!hasUse && info.orderStatus == '02' || info.orderStatus == '04'">
                <view class="bottom-content">
                    <view class="primary" @click="buyAgain">再次购买</view>
                </view>
            </template>
            <!-- 交易完成 -->
            <template v-if="hasUse && info.orderStatus == '02'">
                <view class="bottom-content">
                    <view class="default" @click="buyAgain">再次购买</view>
                    <view class="confirm">评价</view>
                </view>
            </template>
            <!-- 待付款 -->
            <template v-if="info.orderStatus == '00' || info.orderStatus == '01'">
                <view class="bottom-content">
                    <view class="default" @click="cancelOrder">取消订单</view>
                    <view class="confirm" @click="doPay">
                        ¥{{ info.payPrice }}<text style="margin-left: 5rpx;">继续支付</text>
                    </view>
                </view>
            </template>
        </view>
    </view>
    <!-- 取消弹窗 -->
    <up-popup :show="cancelShow" :round="20" closeable :safeAreaInsetBottom="false" mode="bottom" @close="cancelShow = false">
        <view class="cancel">
            <view class="cancel-title">取消订单</view>
            <view class="cancel-content">
                    <up-radio-group v-model="cancelKey" iconPlacement="right" @change="radioChange">
                        <view style="display: flex;flex-direction: column;align-items: center;gap: 24rpx;width: 100%;padding: 0 30rpx;">
                                <view v-for="(item, index) in cancelReasonList" :key="index" class="cancel-content_item">
                                    <up-radio :name="item.key" :label="item.text"></up-radio>
                                </view>
                        </view>
                    </up-radio-group>
                <textarea v-if="cancelKey == '4'" v-model="cancelReason" placeholder-style="{font-size: 24rpx}" placeholder="请输入取消原因"></textarea>
                <view class="cancel-content_tips">
                    订单取消后优惠券和红包可退回，请选择取消原因
                </view>
                <view class="cancel-content_btns">
                    <view class="item default" @click.stop="cancelShow = false">
                        我再想想
                    </view>
                    <view class="item confirm" @click.stop="doCancel">
                        确认取消
                    </view>
                </view>
            </view>
        </view>
    </up-popup>
    
</template>

<script>
    import { mapState } from 'pinia';
    import { usermOrderDetails, keepPayOrder, getStore, closeInner  } from '../api/index'
    import { useBaseStore } from "@/store/index.ts";
    import { toIntelligentService } from '@/utils/static.jump.ts'
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    import { ellipsisPhone } from '@/utils/business'
    export default{
        name: 'orderDetailNew',
        data() {
            return {
                ellipsisPhone,// 手机号脱敏
                toIntelligentService, // 客服

                orderStatusMap: {
                    '00': '待付款',
                    '01': '待付款',// 原为处理中
                    '02': '交易成功',
                    '03': '交易失败',
                    '04': '已取消',
                    '05': '已撤销',
                    '90': '超时',
                    '91': '异常',
                    '98': '预下单',
                    '99': '日终失效'
                },// 订单状态码表

                orderNo: '',// 订单号
                info: {
                    orderStatus: '00',
                    productInfo: []
                },// 订单信息
                countTime: 15 * 60 * 1000,// 倒计时
                timeData: {},// 倒计时对象

                storeInfo: {},// 商家信息
                couponInfo: {},// 卡券对象
                phone: '',// 手机号

                isVirtualProduct: '',// 是否虚拟商品 1-是 0-否
                virtualProductSource: '',// 商品来源 cop-卡券（虚拟商品）

                hasUse: false,// 卡券是否已使用
                hasStoreInfo: false,// 是否已有商家信息展示

                cancelShow: false,// 取消弹窗
                cancelKey: '',// 取消原因
                cancelReason: '',// 取消原因
                cancelReasonList: [
                    {
                        key: '0',
                        text: '不想买了'
                    },
                    {
                        key: '1',
                        text: '买多了/买错了'
                    },
                    {
                        key: '2',
                        text: '商家无法接待'
                    },
                    {
                        key: '3',
                        text: '线下价格更优惠'
                    },
                    {
                        key: '4',
                        text: '其他'
                    }
                ],// 取消原因List
            }
        },
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
        },
        onLoad(options) {
            this.orderNo = options.orderId
        },
        async onShow() {
            await this.getOrderInfo()
            // 该接口只做一次获取，避免重复加载导致页面观感问题
            !this.hasStoreInfo && this.getStoreDetail()

            // 获取用户手机号
            let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            const { userId, mobile } = userInfo;
            this.phone = mobile;
        },
        methods: {
            // 获取订单详情
            async getOrderInfo() {
                let res = await usermOrderDetails({
                    orderId: this.orderNo
                })
                // 下单时间
                let time = res.payInfo.payDate.substring(0, 4) + '-' + 
                            res.payInfo.payDate.substring(4, 6) + '-' + 
                            res.payInfo.payDate.substring(6, 8) + ' ' +
                            res.payInfo.payTime.substring(0, 2) + ':' +
                            res.payInfo.payTime.substring(2, 4) + ':' +
                            res.payInfo.payTime.substring(4, 6)
                // 支付时间
                let payEndTime = res.payInfo.payEndTime ? res.payInfo.payEndTime.substring(0, 4) + '-' + 
                            res.payInfo.payEndTime.substring(4, 6) + '-' + 
                            res.payInfo.payEndTime.substring(6, 8) + ' ' +
                            res.payInfo.payEndTime.substring(8, 10) + ':' +
                            res.payInfo.payEndTime.substring(10, 12) + ':' +
                            res.payInfo.payEndTime.substring(12, 14) 
                            : ''
                let timestamp = new Date(time).getTime() + 15 * 60 * 1000 - new Date().getTime()
                console.log(timestamp)
                // 倒计时
                this.countTime = timestamp
                // 订单信息
                this.info = {
                    ...this.info,
                    ...res.payInfo,
                    payTimeFmt: time,
                    payEndTimeFmt: payEndTime,
                }
                this.isVirtualProduct = res.isVirtualProduct
                // 虚拟产品
                if(res.isVirtualProduct == '1') {
                    //商品信息
                    this.info.productInfo = [{
                        ...res.suAll[0],
                        number: res.suAll.length,
                        subOrderAmt: multiply(res.suAll[0].price, res.suAll.length)
                    }]
                    // 卡券信息
                    this.couponInfo = res.virtualProductInfo
                } 
                // 实体商品
                else {
                    this.info.productInfo = res.suAll
                }
                this.virtualProductSource = res.virtualProductSource
                
                // 全部已使用则为已核销
                this.hasUse = res.suAll.every(e => e.virtualProductIsWhetherUse == '1')
                this.info.storeId = res.suAll[0].shopsId
                // 计算订单级别总金额(暂时不用)
                this.info.totalPrice = res.suAll.map(e=>e.subOrderAmt).reduce((sum, current) => plus(sum, current), 0)
                // 计算订单级别总支付金额（暂时不用）
                this.info.payPrice = res.suAll.map(e=>e.subPayAmt).reduce((sum, current) => plus(sum, current), 0)
            },
            // 获取商家详情
            getStoreDetail() {
                getStore({
                    storeId: this.info.storeId
                }).then(res=>{
                    this.storeInfo = {...res}
                    this.storeInfo.storeTime = JSON.parse(res.storeTime)
                    this.storeInfo.storeTimeText = this.storeInfo.storeTime.map(e => e.start + '-' + e.end).join(' ')
                })
            },
            // 倒计时
            onChange(e) {
                this.timeData = e
            },
            //倒计时结束
            onFinish() {
                this.info.orderStatus = '04'
            },
            // 返回
            navBack() {
                this.bridgeSdk.navigateBackTo({ delta: 1 });
            },
            // 打开地图
            goMap() {
                this.bridgeSdk.getLocation(res => {
                    let longitude = Number(res.lng);
                    let latitude = Number(res.lat);
                    let s = `${Number(longitude)},${Number(latitude)}`;
                    let e = `${Number(this.storeInfo.longitude)},${Number(this.storeInfo.latitude)}`;
                    console.log("开始坐标：", s, "终点坐标：", e);
                    // 调用sdk 
                    this.bridgeSdk.routePlan(s, e, this.storeInfo.storeName, this.storeInfo.storeAddress);
                });
            },
            // 打电话
            goPhone() {
                this.bridgeSdk.makePhoneCall({
                    title: '商家电话',
                    phoneNumber: this.storeInfo.storePhone
                })
            },

            // 拷贝
            doCopy(text) {
                // uniapp复制方法
                uni.setClipboardData({
                    data: text,
                    success: () => {
                        uni.showToast({
                            title: '复制成功',
                            icon: 'none'
                        });
                    }
                });
            },
            // 再次支付
            doPay() {
                keepPayOrder({
                    orderId: this.orderNo
                }).then(res=>{
                    console.log(res)
                    if(res) {
                        let encodeUrl = encodeURIComponent(res.payUrl)
                        // #ifdef MP-WEIXIN
                        this.bridgeSdk.jumpPage({
                            url: '/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                        })
                        // #endif
                        // #ifdef H5
                        let _q = res.payUrl.indexOf("?") > -1 ? "&" : "?";
                        location.replace(res.payUrl + _q + '_needH5Head=1')
                        // #endif
                    }
                })
            },
            // 使用规则
            doUseDetail() {
                
            },
            // 跳转评价
            doRate() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/ratePage/doRatePage?orderNo=${ this.orderNo }&spuName=${ this.info.productInfo[0].spuName }`
                })
            },
            // 取消订单
            cancelOrder() {
                this.cancelShow = true
            },
            // tab 切换
            radioChange(e) {
                console.log(e)
                this.cancelKey = e
            },
            // 确认取消
            doCancel() {
                if(!this.bridgeSdk.checkIsEmpty(this.cancelKey)) {
                    uni.showToast({
                        title: '请选择取消原因',
                        icon: 'none',
                    })
                    return
                }
                if(!this.bridgeSdk.checkIsEmpty(this.cancelReason) && this.cancelKey == '4') {
                    uni.showToast({
                        title: '请输入取消原因',
                        icon: 'none',
                    })
                    return
                }
                let remark = this.cancelKey != '4' ? this.cancelReasonList.find(e => e.key == this.cancelKey).text : this.cancelReason
                closeInner({
                    orderId: this.orderNo,
                    remark: remark
                }).then(res=>{
                    this.bridgeSdk.showToast({
                        title: '订单取消成功'
                    })
                    this.cancelShow = false
                    this.getOrderInfo()
                })
            },
            // 再次购买
            buyAgain() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/productDetail/productDetailCoupon?mctId=${this.storeInfo.mctId}&storeId=${this.storeInfo.storeId}&spuId=${this.info.productInfo[0].spuId}&virtualProductType=${this.couponInfo.couponBaseType}&rebuy=1`,
                    openType: 'redirectTo'
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.u-navbar__content) {
    z-index: 1;
}
/* 文本超长展示 */
.text-overflow{
    overflow: hidden;
    /*禁止换行*/
    white-space: nowrap;
    /*显示省略号*/
    text-overflow: ellipsis;
}
/* 文本超长展示 */
.muti-overflow{
    /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    display: -webkit-box;
    /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
    -webkit-box-orient:vertical;
    /*要显示的行数*/
    -webkit-line-clamp: 2;
    /* 溢出部分隐藏 */
    overflow:hidden;
}
.custom-navbar ::v-deep .uicon-arrow-left {
    font-weight: 600 !important;
}
.u-nav-slot {
    display: flex;
    align-items: center;
    justify-content: center;
}

.title {
    color: white;
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
::v-deep .u-navbar {
    z-index: 1;
    position: relative;
}
.topbg {
    width: 100%;
    height: 356rpx;
    position: relative;
    margin-top: -20rpx;
    z-index: 0;
    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #00BDB8;
    &-text {
        color: white;
        position: absolute;
        bottom: 98rpx;
        left: 68rpx;
        font-size: 36rpx;
    }
    &-count {
        color: white;
        position: absolute;
        bottom: 108rpx;
        left: 68rpx;
        font-size: 32rpx;
        display: flex;
        align-items: center;
        .time {
            display: flex;
            align-items: center;
            margin: 0 10rpx;
            &__custom {
                width: 50rpx;
                height: 50rpx;
                border-radius: 8rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                &__item {
                    color: #fff;
                    font-size: 32rpx;
                    text-align: center;
                }
            }
            &__doc {
                font-size: 32rpx;
            }
        }
    }
    &-tip {
        color: white;
        position: absolute;
        bottom: 40rpx;
        left: 108rpx;
        font-size: 32rpx;
    }
}
.info {
    width: calc(670rpx - 2 * 20rpx);
    padding: 0rpx 20rpx 12rpx;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    border-radius: 20rpx;
    background-color: white;
    margin: -68rpx auto 24rpx;
    position: relative;
    z-index: 3;
    &-top {
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid #D8D8D8;
        padding-bottom: 18rpx;
        padding-top: 26rpx;
        image {
            width: 120rpx;
            height: 108rpx;
            margin-right: 12rpx;
        }
        .item_flex {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
    &-bottom {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #333333;
        font-size: 24rpx;
        padding-top: 13rpx;
    }
}
.store {
    width: calc(670rpx - 2 * 20rpx);
    padding: 24rpx 20rpx 24rpx;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    border-radius: 20rpx;
    background-color: white;
    margin: 0 auto 24rpx;
    &-title {
        font-size: 32rpx;
        color: #222222;
        font-weight: bold;
        line-height: 45rpx;
    }
    &-name {
        font-size: 28rpx;
        color: #222222;
        line-height: 40rpx;
        margin-top: 11rpx;
    }
    &-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &_content {
            flex: 1;
            width: 40%;
            margin-right: 10rpx;
            .item {
                display: flex;
                align-items: center;
                color: #333333;
                font-size: 24rpx;
                margin-top: 11rpx;
                image {
                    width: 20rpx;
                    height: 20rpx;
                    margin-right: 5rpx;
                }
            }
        }
        &_icon {
            display: flex;
            align-items: center;
            gap: 14rpx;

            .icon-img {
                height: 50rpx;
                width: 50rpx;
            }
        }
    }
}
.order {
    width: calc(670rpx - 2 * 20rpx);
    padding: 24rpx 20rpx 24rpx;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    border-radius: 20rpx;
    background-color: white;
    margin: 0 auto 24rpx;
    &-title {
        font-size: 32rpx;
        color: #222222;
        font-weight: bold;
        line-height: 45rpx;
    }
    &-content {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 14rpx;
        margin-top: 20rpx;
        .item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #222222;
            font-size: 24rpx;
            width: 100%;
            line-height: 33rpx;
            view:first-child{
                font-weight: bold;
                margin-right: 20rpx;
            }
            view:last-child{
                flex: 1;
                color: #777777;
                image {
                    width: 22rpx;
                    height: 24rpx;
                    margin-left: 5rpx;
                }
            }
        }
    }
}
.bottom{
    &-content {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: white;
        padding: 30rpx 0 calc(26rpx + constant(safe-area-inset-bottom));
        padding: 30rpx 0 calc(26rpx + env(safe-area-inset-bottom));
        display: flex;
        align-items: center;
        justify-content: space-around;
        .primary {
            width: 670rpx;
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
            border-radius: 42rpx;
            font-size: 32rpx;
            line-height: 45rpx;
            color: white;
            text-align: center;
            padding: 20rpx 0;
        }
        .default {
            background-color: white;
            border: 2rpx solid #AAAAAA;
            border-radius: 42rpx;
            font-size: 32rpx;
            line-height: 45rpx;
            color: #666666;
            text-align: center;
            padding: 20rpx 53rpx;
        }
        .confirm {
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
            border-radius: 42rpx;
            font-size: 32rpx;
            line-height: 45rpx;
            color: white;
            text-align: center;
            padding: 20rpx 53rpx;
        }
    }
}
.cancel {
    background: white;
    border-radius: 20rpx 20rpx 0 0;
    &-title {
        font-size: 32rpx;
        color: #222222;
        font-weight: bold;
        text-align: center;
        margin-bottom: 41rpx;
        margin-top: 20rpx;
    }
    &-content {
        min-height: 500rpx;
        width: 100%;
        position: relative;
        padding-bottom: calc(84rpx + 157rpx + constant(safe-area-inset-bottom));
        padding-bottom: calc(84rpx + 157rpx + env(safe-area-inset-bottom));
        &_item {
            font-size: 28rpx;
            width: 100%;
        }
        textarea {
            height: 180rpx;
            width: calc(100% - 100rpx);
            background-color: #f8f8f8;
            border-radius: 10rpx;
            padding: 10rpx 20rpx;
            margin: 20rpx 30rpx;
        }
        &_tips {
            height: 64rpx;
            line-height: 64rpx;
            background-color: #C6FFF6;
            color: #00BCB8;
            font-size: 28rpx;
            text-align: center;
            margin-top: 60rpx;
            position: absolute;
            bottom: calc(84rpx + 77rpx + constant(safe-area-inset-bottom));
            bottom: calc(84rpx + 77rpx + env(safe-area-inset-bottom));
            left: 0;
            right: 0;
        }
        &_btns{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-top: 33rpx;
            padding-bottom: calc(44rpx + constant(safe-area-inset-bottom));
            padding-bottom: calc(44rpx + env(safe-area-inset-bottom));
            .item {
                width: 327rpx;
                text-align: center;
                height: 84rpx;
                border-radius: 42rpx;
                line-height: 84rpx;
                font-size: 32rpx;
            }
            .default {
                background-color: white;
                color: #222222;
                border: 2rpx solid #AAAAAA;
            }
            .confirm {
                background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
                color: white;
            }
        }
    }
}
</style>
