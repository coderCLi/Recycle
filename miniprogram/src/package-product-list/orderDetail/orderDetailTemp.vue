<!--
 * @Description: 订单详情
 * @Autor: TF
 * @Date: 2025-06-12 19:58:09
 * @LastEditors: TF
 * @LastEditTime: 2025-08-20 16:41:50
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

    <view class="main">
        <view class="topbg" :style="{marginTop: `-${navigationBarInfo.navigationBarHeight + navigationBarInfo.statusBarHeight}px`, height: tallerHeight ? '422rpx' : '356rpx'}">

            <view class="topbg-text" :style="{bottom: tallerHeight ? '164rpx' : '98rpx'}">{{ info.statusName }}</view>
            <!-- 已取消时取消原因 -->
            <view class="topbg-tip" v-if="info.status == 'CANCELLED'">取消原因：{{ info.remark }}</view>
            <!-- 待付款时倒计时 -->
            <view class="topbg-count" v-if="info.status == 'PENDING_PAYMENT'">
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
                过期自动取消
            </view>
        </view>
        <!-- sku信息 -->
        <view class="info">
            <up-skeleton style="padding-top: 26rpx;" rowsHeight="24rpx" rows="2" :title="false" avatar avatarSize="108rpx" avatarShape="square" :loading="info.subList == 0">
                <view class="info-top" v-for="(item, index) in info.subList" :key="index">
                    <image :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
                    <view style="flex: 1;">
                        <view class="item_flex" style="font-size: 28rpx;color: #333;line-height: 40rpx;">
                            <view class="text-overflow" style="width: 80%;font-weight: bold;">{{ item.spuName }}</view>
                            <view style="color: #999999;">¥{{ item.price }}</view>
                        </view>
                        <view class="item_flex" style="font-size: 24rpx;color: #999999;line-height: 33rpx;margin-top: 4rpx;">
                            <view>{{ item.useDesc }}</view>
                            <view>x{{ item.number }}</view>
                        </view>
                        <view v-if="(index == info.subList.length - 1) && ['PENDING_PAYMENT', 'COMPLETED', 'PENDING_RECEIPT_USE', 'PENDING_USE', 'CANCELLED'].includes(info.status)" class="item_flex" style="font-size: 24rpx;color: #FF5871;line-height: 33rpx;margin-top: 6rpx;justify-content: flex-end;">
                            <!-- 待使用、已取消 -->
                            <template v-if="info.status == 'CANCELLED' || info.status == 'PENDING_RECEIPT_USE' || info.status == 'PENDING_USE'">
                                <view @click="buyAgain">再买一单</view>
                            </template>
                            <!-- 交易成功 -->
                            <!-- <template v-if="info.status == 'COMPLETED'">
                                <view @click="doRate">去评价</view>
                            </template> -->
                            <!-- 待支付 -->
                            <template v-if="info.status == 'PENDING_PAYMENT'">
                                <view @click="doPay">在线支付</view>
                            </template>

                            <view>¥{{ info.payPrice }}</view>
                            <up-icon v-if="['CANCELLED', 'PENDING_RECEIPT_USE', 'PENDING_USE', 'PENDING_PAYMENT'].includes(info.status)" name="arrow-right" color="#FF5871" size="12"/>
                        </view>

                        <view v-else class="item_flex" style="justify-content: flex-end;font-size: 26rpx;margin-top: 10rpx;">
                            ¥{{ item.subPayAmt }}
                        </view>
                    </view>
                </view>
                <view class="info-bottom" @click="doUseDetail" v-if="virtualProductSource == 'cop'">
                    <view style="margin-right: 5rpx;">使用规则</view>
                    <up-icon name="arrow-right" color="#333333" size="12"/>
                </view>
            </up-skeleton>
        </view>

        <!-- 券码展示（虚拟商品+cop来源） -->
        <view class="coupon" v-if="isVirtualProduct == '1' && virtualProductSource == 'cop' && !['CANCELLED', 'PENDING_PAYMENT'].includes(info.status) && info.status">
            <view class="coupon-title" v-if="waitUseCopList.length > 0">
                待使用券码
                <text style="color: red;">{{ waitUseCopList.length }}</text>
                张
            </view>
            <view class="coupon-title" v-else>券码信息</view>
            <view style="position: relative;" v-if="waitUseCopList.length > 0">
                <up-icon v-if="nowCop != 0" @click="changeCop('prev')" name="arrow-left" style="position: absolute;left: 30rpx;top: 50%;transform: translateY(-50%);"/>
                <u-qrcode @click="refreshCoupon" :size="150" :val="QRcodeContent" class="qrCode"/>
                <up-icon v-if="nowCop != waitUseCopList.length - 1" @click="changeCop('next')" name="arrow-right" style="position: absolute;right: 30rpx;top: 50%;transform: translateY(-50%);"/>
            </view>
            <view class="coupon-info" :style="{borderTop: waitUseCopList.length > 0 ? '1px solid #F5F5F5;' : 'none'}">
                <view  v-for="(item, index) in info.subOrderList" :key="index" class="item">
                    <view>
                        券码：{{ item.virtualProductHoldId }} 
                        <!-- <text style="color: rgb(0, 188, 184);" @click="doCopy(item.virtualProductHoldId)">复制</text> -->
                    </view>
                    <!-- 待使用（状态为待使用，并且券状态为未使用） -->
                    <view v-if="['PENDING_USE', 'PENDING_RECEIPT_USE'].includes(item.status) && item.virtualProductIsWhetherUse == '0'">
                        {{ item.statusName }}
                    </view>
                    <!-- 已使用（状态为交易完成或者券状态为已使用） -->
                    <view v-else-if="['COMPLETED'].includes(item.status) || item.virtualProductIsWhetherUse == '1'" class="gray flex" @click="goUseDetail(item)">
                        已使用
                        <up-icon name="arrow-right" color="#999999" size="12"/>
                    </view>
                    <!-- 退款完成状态 -->
                    <view v-else-if="['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'EXPIRED_REFUND'].includes(item.status)" class="gray flex" @click="goRefundDetail(item)">
                        {{ item.statusName }}
                        <up-icon name="arrow-right" color="#999999" size="12"/>
                    </view>
                    <!-- 退款中状态 -->
                    <view v-else-if="['EXPIRED_REFUNDING_PROCESSING', 'REFUND_REVIEWING', 'REFUND_PROCESSING', 'PART_REFUND_PROCESSING'].includes(item.status)" class="yellow flex" @click="goRefundDetail(item)">
                        {{ item.statusName }}
                        <up-icon name="arrow-right" color="#999999" size="12"/>
                    </view>
                </view>
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
                <!-- <view class="item">
                    <view>手机号</view>
                    <view>{{ ellipsisPhone(info.mobile) }}</view>
                </view> -->
                <view class="item">
                    <view>下单时间</view>
                    <view>{{ info.payDateTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payEndTime)">
                    <view>支付时间</view>
                    <view>{{ info.payEndTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.productCodeName)">
                    <view>支付方式</view>
                    <view>{{ info.productCodeName }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payDecoderTime)">
                    <view>发货时间</view>
                    <view>{{ info.payDecoderTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payReceiverTime)">
                    <view>签收时间</view>
                    <view>{{ info.payReceiverTime }}</view>
                </view>
            </view>
        </view>

        <!-- 底部按钮操作区 -->
        <view class="bottom" v-if="info.status">
            <!-- 待付款 -->
            <view class="bottom-content" v-if="info.status == 'PENDING_PAYMENT'">
                <view class="default" @click="cancelOrder">取消订单</view>
                <view class="confirm" @click="doPay">
                    ¥{{ info.payPrice }}<text style="margin-left: 5rpx;">去支付</text>
                </view>
            </view>
            <!-- 待使用 -->
            <template v-if="info.status == 'PENDING_RECEIPT_USE' || info.status == 'PENDING_USE'">
                <view class="bottom-content">
                    <view class="confirm" @click="buyAgain">再买一单</view>
                </view>
            </template>
            <!-- 交易完成 -->
            <view class="bottom-content" v-if="info.status == 'COMPLETED'">
                <view class="confirm" @click="buyAgain">再买一单</view>
            </view>
            <!-- 已取消 -->
            <view class="bottom-content" v-if="info.status == 'CANCELLED'">
                <view class="confirm" @click="buyAgain">再买一单</view>
            </view>
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
    
    <!-- 使用规则 -->
    <up-popup :show="useShow" id="use" :round="10" :safeAreaInsetBottom="false" closeable mode="center" @close="useShow = false">
        <view class="use">
            <view class="use-title">使用规则</view>
            <u-parse :content="couponInfo.remark"></u-parse>
        </view>
    </up-popup>
</template>

<script>
    import { mapState } from 'pinia';
    import { usermOrderDetailsNew, keepPayOrder, getStore, closeInner, removeStoreOrder  } from '../api/index'
    import { useBaseStore } from "@/store/index.ts";
    import { toIntelligentService } from '@/utils/static.jump.ts'
    import { minus, plus, divide, multiply, toFixed } from '@/utils/decimal.ts'
    import { ellipsisPhone } from '@/utils/business'
    // 售后状态列表
    const REFUND_STATUS = [
        'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
        'REFUND_REVIEWING', // 退款审核中
        'REFUND_PROCESSING', // 退款中
        'PART_REFUND_PROCESSING', // 部分退款中
        'REFUND_SUCCESS', // 已退款
        'EXPIRED_REFUNDED_SUCCESS', // 过期退款成功
        'EXPIRED_REFUND',// 过期退款
        'AFTER_SALE_PROCESSING', // 售后中
        'MERCHANT_REFUSED', // 商家拒绝售后
        'RETURN_REVIEWING',// 退货审核中
        'RETURN_PROCESING',// 退货处理中
        'PART_RETURN_PROCESING',// 部分退货处理中
        'RETURN_PENDING_RETURN_SHIPMENT',// 待退货
        'RETURN_PENDING_SELLER_RECEIPT',// 待商家收货
        'RETURN_PENDING_CHECKING',// 退货验货中
        'RETURN_PENDING_REFUNDING',// 退货退款中
        'RETURN_PENDING_SUCCESS',// 退货成功
    ]
    export default{
        name: 'orderDetailNew',
        data() {
            return {
                ellipsisPhone,// 手机号脱敏
                toIntelligentService, // 客服
                REFUND_STATUS,

                orderNo: '',// 订单号
                info: {
                    status: '00',
                    subOrderList: [],
                    subList: []
                },// 订单信息
                countTime: 15 * 60 * 1000,// 倒计时
                timeData: {},// 倒计时对象

                storeInfo: {},// 商家信息
                couponInfo: {},// 卡券对象
                phone: '',// 手机号
                userId: '',// userId

                isVirtualProduct: '',// 是否虚拟商品 1-是 0-否
                virtualProductSource: '',// 商品来源 cop-卡券平台 hbb-文旅一卡通

                hasUse: false,// 卡券是否已使用
                QRcodeContent: '',// 券码内容
                waitUseCopList: [],// 待使用卡券列表
                nowCop: 0,// 当前展示券码索引
                hasStoreInfo: false,// 是否已有商家信息展示

                useShow: false,// 使用规则弹窗

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

                showMenu: false,// menu展示/关闭
            }
        },
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
            tallerHeight() {
                return this.info.status == 'PENDING_PAYMENT' || (this.info.status == 'CANCELLED' && this.info.remark)
            }
        },
        onPullDownRefresh() {
            this.getOrderInfo()
            setTimeout(() => {
                //结束下拉刷新
                uni.stopPullDownRefresh();
            }, 500);
        },
        onLoad(options) {
            this.orderNo = options.orderId
        },
        async onShow() {
            await this.getOrderInfo()
            // 该接口只做一次获取，避免重复加载导致页面观感问题
            !this.hasStoreInfo && this.isVirtualProduct == '1' && this.getStoreDetail()

            // 获取用户手机号
            let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            const { userId, mobile } = userInfo;
            this.phone = mobile;
            this.userId = userId;
            // 左侧扩展菜单状态重置
            this.showMenu = false
        },
        methods: {
            // 获取订单详情
            async getOrderInfo() {
                let res = await usermOrderDetailsNew({
                    orderId: this.orderNo
                })
                
                this.info = { ...res, subList: res.subOrderList }
                // 是否是虚拟商品
                this.isVirtualProduct = res.isVirtualProduct
                // 虚拟商品来源(cop-卡券，hbb-文旅一卡通)
                this.virtualProductSource = res.virtualProductSource ? res.virtualProductSource.toLowerCase() : ''
                if(this.isVirtualProduct == '1' ) {
                    // 虚拟商品合并subOrderList
                    this.info.subList = [
                        {
                            ...this.info.subOrderList[0],
                            number: this.info.subOrderList.map(e => e.number).reduce((sum, current) => plus(sum, current), 0),
                            subPayAmt: this.info.subOrderList.map(e => e.subPayAmt).reduce((sum, current) => plus(sum, current), 0)
                        }
                    ]
                    if(this.virtualProductSource == 'cop') {
                        // 虚拟商品为卡券时，券码展示（默认第1张券码）
                        const subList = this.info.subOrderList
                        // 状态为待使用并且券状态为未使用
                        this.waitUseCopList = subList.filter(e => e.status == 'PENDING_USE' && e.virtualProductIsWhetherUse == '0')
                        if(this.waitUseCopList.length > 0) {
                            this.nowCop = 0
                            this.$nextTick(_=>{
                                this.QRcodeContent = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," +  this.userId + ',' + Date.now();
                            })
                        }
                        // 使用规则
                        let attr = JSON.parse(res.subOrderList[0].attributes)
                        if(!attr) return
                        this.couponInfo = attr
                    }
                }
                
                this.info.payPrice =  this.info.subOrderList.map(e => e.subPayAmt).reduce((sum, current) => plus(sum, current), 0)
                // 待付款倒计时
                if(this.info.status == 'PENDING_PAYMENT') this.countTime = new Date(res.failTime.replace(/-/g,'/')).getTime() - new Date().getTime()
            },
            // 获取商家详情
            getStoreDetail() {
                getStore({
                    storeId: this.info.subOrderList[0].shopsId
                }).then(res=>{
                    this.storeInfo = {...res}
                    this.storeInfo.storeTime = JSON.parse(res.storeTime)
                    this.storeInfo.storeTimeText = this.storeInfo.storeTime.map(e => e.start + '-' + e.end).join(' ')
                    this.hasStoreInfo = true
                })
            },
            // 倒计时
            onChange(e) {
                this.timeData = e
            },
            //倒计时结束
            onFinish() {
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
            // 刷新券码
            refreshCoupon() {
                this.QRcodeContent = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," +  this.userId + ',' + Date.now();
            },
            // 卡券切换
            changeCop(type) {
                if(type == 'prev') {
                    this.nowCop -= 1
                } else {
                    this.nowCop += 1
                }
                this.QRcodeContent = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," +  this.userId + ',' + Date.now();
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
                        location.replace(res.payUrl + _q + '_needH5Head=1&appToken=' + this.bridgeSdk.getStorageSync('appToken'))
                        // #endif
                    }
                })
            },
            // 使用规则
            doUseDetail() {
                this.useShow = true
            },
            // 跳转评价
            doRate() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/ratePage/doRatePage?orderNo=${ this.orderNo }&spuName=${ this.info.subOrderList[0].spuName }`
                })
            },
            // 催发货
            doHurry() {
                this.bridgeSdk.showToast({
                    title: '商家已收到您的催发货申请，将加快处理'
                });
            },
            // 退款
            doRefund() {
                let doType;
                 // 虚拟商品待发货/待使用（虚拟商品退款）
                if((this.info.status == 'PENDING_RECEIPT_USE' || this.info.status == 'PENDING_USE' || this.info.status == 'PENDING_SHIPMENT') && this.isVirtualProduct == '1') {
                    doType = 'VIRTUAL_REFUND_REASON'
                } 
                // 虚拟商品待收货（虚拟商品退货退款）
                else if(this.info.status == 'PENDING_RECEIPT' && this.isVirtualProduct == '1') {
                    doType = 'VIRTUAL_RETURNED_REASON'
                }
                // 实体商品待发货（实体商品退款）
                else if(this.info.status == 'PENDING_SHIPMENT' && this.isVirtualProduct == '0') {
                    doType = 'ENTITY_REFUND_REASON'
                }
                // 实体商品待收货（实体商品退货退款）
                else if(this.info.status == 'PENDING_RECEIPT' && this.isVirtualProduct == '0') {
                    doType = 'ENTITY_RETURNED_REASON'
                } 
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/orderDetail/orderRefund?orderId=${ this.orderNo }&doType=${doType}`
                })
            },
            // 删除订单
            doDelete() {
                this.bridgeSdk.showConfirm({
                    title: "删除订单",
                    content: "确定删除该订单吗？删除后将不再展示该订单",
                    confirmText: '确定',
                    cancelText: '取消',
                    confirmCallback: (res) => {
                        removeStoreOrder({
                            orderId: this.orderNo
                        }).then(res=>{
                            this.bridgeSdk.showToast({title: '删除成功'})
                            this.bridgeSdk.navigateBackTo({
                                delta: 1,
                                success: page=>{
                                    page && page._getList && page._getList()
                                }
                            })
                        })
                    },
                });
            },
            // 申请售后
            doAfterSale() {
                
            },
            // 确认收货
            doConfirm() {
                this.bridgeSdk.showConfirm({
                    title: '请确认已收到货物',
                    content: '确认收货后，平台仍将保障您的权益',
                    confirmText: '取消',
                    confirmText: '确认收货',
                    confirmCallback: (res) => {
                        console.log("点击确认", res);
                    }
                });
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
            // 再买一单
            buyAgain() {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/productDetail/productDetailCoupon?mctId=${this.storeInfo.mctId}&storeId=${this.storeInfo.storeId}&spuId=${this.info.subOrderList[0].spuId}&virtualProductType=${this.couponInfo.couponBaseType}&rebuy=1`
                })
            },
            // 查看使用记录
            goUseDetail(e) {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/orderDetail/copUseFlow?couponBaseId=${e.virtualProductId}`
                })
            },
            // 查看退款详情
            goRefundDetail(e) {
                this.bridgeSdk.jumpPage({
                    url: `/package-product-list/orderDetail/afterSaleDetail?afterSalesId=${e.afterSalesId}`
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
#use ::v-deep .u-popup__content {
    width: 80%;
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
.main {
    height: auto;
    background-color: #f8f8f8;
    padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
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
        bottom: 108rpx;
        left: 68rpx;
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
        align-items: flex-start;
        border-bottom: 1rpx solid #D8D8D8;
        padding-bottom: 18rpx;
        padding-top: 26rpx;
        &:first-of-type {
            padding-top: 0;
        }
        image {
            width: 120rpx;
            height: 108rpx;
            margin-right: 12rpx;
            border-radius: 12rpx;
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
.coupon {
    width: calc(670rpx - 2 * 20rpx);
    padding: 24rpx 20rpx 24rpx;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    border-radius: 20rpx;
    background-color: white;
    margin: 0 auto 24rpx;
    &-title {
        font-size: 32rpx;
        font-weight: bold;
        text-align: left;
    }
    &-info {
        padding: 20rpx 0 0;
        border-top: 1rpx dashed #D8D8D8;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 24rpx;
            line-height: 50rpx;
            .gray {
                color: #999999;
            }
            .yellow {
                color: #FFB800;
            }
            .flex {
                display: flex;
            }
        }
    }
    .qrCode {
        width: 150px;
        height: 150px;
        margin: 40rpx auto;
        z-index: 1;
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    padding: 30rpx 20rpx calc(26rpx + constant(safe-area-inset-bottom));
    padding: 30rpx 20rpx calc(26rpx + env(safe-area-inset-bottom));
    .menu {
        min-width: 100rpx;
        background-color: white;
        box-shadow: 0 2rpx 1rpx 1rpx rgba(0, 0, 0, 0.1),
                    2rpx 0 1rpx 1rpx rgba(0, 0, 0, 0.1);
        border-radius: 10rpx;
        padding: 0rpx 30rpx;
        font-size: 26rpx;
        color: #333;
        text-align: center;
        line-height: 60rpx;
        z-index: 5;
        view {
            border-bottom: 1rpx solid #d0d0d0;
            &:last-of-type {
                border-bottom: none;
            }
        }
    }
    &-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
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
            font-size: 26rpx;
            line-height: 34rpx;
            color: #666666;
            text-align: center;
            padding: 12rpx 40rpx;
            margin-left: 20rpx;
        }
        .confirm {
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
            border-radius: 42rpx;
            font-size: 26rpx;
            line-height: 38rpx;
            color: white;
            text-align: center;
            padding: 12rpx 40rpx;
            margin-left: 20rpx;
        }
    }
}
.use {
    padding: 20rpx 30rpx;
    font-size: 24rpx;
    &-title {
        font-size: 28rpx;
        font-weight: bold;
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