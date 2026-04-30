<!--
 * @Description: 积分商城-下单页面
 * @Autor: TF
 * @Date: 2025-06-26 19:28:27
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-25 13:56:33
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container>
        <!-- 地址选择(实物订单才展示) -->
        <view class="address" v-if="isVirtualProduct != '1'" :style="{padding: bridgeSdk.checkIsEmpty(addressInfo) ? '30rpx' : '52rpx 30rpx 52rpx 30rpx' }" @click="getAddress()">
            <image :src="staticBaseUrl + '/hbdimage/package-intergral-mall/dingwei.png'" mode="aspectFill"/>
            <template v-if="bridgeSdk.checkIsEmpty(addressInfo)">
                <view style="flex: 1;width: 50%;">
                    <view class="address-top" style="display: flex;">
                        <view>{{ addressInfo.name }}</view>
                        <view style="font-size: 30rpx;margin-left: 10rpx;">{{ addressInfo.mobile }}</view>
                    </view>
                    <view class="address-btm muti-overflow">
                        {{ addressInfo.provinceName }}
                        {{ addressInfo.cityName }}
                        {{ addressInfo.areaName }}
                        {{ addressInfo.address }}
                    </view>
                </view>
            </template>
            <template v-else>
                <view style="flex: 1;width: 50%;">请选择收货人信息及收货地址</view>
            </template>
            <up-icon name="arrow-right" size="12" style="margin-left: 20rpx;"/>
        </view>
        <!-- 商品信息 -->
        <view class="product">
            <view class="product-item" v-for="(item, index) in productList" :key="index">
                <image :src="minioBaseUrl + item.mediaUrl[0].mediaUrl" mode="aspectFill"/>
                <view style="flex: 1;width: 60%;">
                    <view class="product-item_title text-overflow">{{ item.spuName||'---' }}</view>
                    <view class="product-item_text text-overflow" style="margin-top: 3rpx;">商品参数：{{ item.skuName }}</view>
                    <view class="product-item_text text-overflow" style="margin-top: 19rpx;">数量：{{ item.num }}</view>
                </view>
            </view>
        </view>
        <!-- 下单信息 -->
        <view class="order">
            <!-- 商品原价 * 商品个数 -->
            <view class="order-item">
                <view>商品价格</view>
                <view>¥{{ Number(toFixed(orderInfo.allProductPrice, 2)) }}</view>
            </view>
            <!-- 积分>0 -->
            <view class="order-item" v-if="Number(orderInfo.sumExchangePoints) > 0">
                <view>积分抵扣</view>
                <view>{{ orderInfo.sumExchangePoints }}会员分抵 ¥{{ plus( minus(orderInfo.allProductPrice, orderInfo.sumPayAmt), orderInfo.sumExpressFee ) }}</view>
            </view>
            <!-- 积分==0 && 原价-支付金额=0 -->
            <view class="order-item" v-if="plus(minus(orderInfo.allProductPrice || '0', orderInfo.sumPayAmt || '0'), orderInfo.sumExpressFee || '0') > 0 && Number(orderInfo.sumExchangePoints) <= 0 && (!orderInfo.subPrice || Number(orderInfo.subPrice) <= 0)">
                <view>商家补贴</view>
                <view>-¥{{ Number(plus(minus(orderInfo.allProductPrice || '0', orderInfo.sumPayAmt || '0'), orderInfo.sumExpressFee || '0')).toFixed(2) }}</view>
            </view>
            <!-- 商家补贴和平台补贴 -->
            <template v-else-if="plus(minus(orderInfo.allProductPrice || '0', orderInfo.sumPayAmt || '0'), orderInfo.sumExpressFee || '0') > 0 && Number(orderInfo.sumExchangePoints) <= 0 && orderInfo.subPrice && Number(orderInfo.subPrice) > 0">
                <!-- 商家补贴 -->
                <view class="order-item">
                    <view>商家补贴</view>
                    <view>-¥{{ Number(plus(minus(orderInfo.allProductPrice || '0', orderInfo.sumPayAmt || '0'), orderInfo.sumExpressFee || '0') - Number(orderInfo.subPrice || 0)).toFixed(2) }}</view>
                </view>
                <!-- 平台补贴 -->
                <view class="order-item">
                    <view>平台补贴</view>
                    <view>-¥{{ Number(orderInfo.subPrice || 0).toFixed(2) }}</view>
                </view>
            </template>
            <!-- 运费（非虚拟商品） -->
            <view class="order-item" v-if="isVirtualProduct != '1'">
                <view>运费</view>
                <view>¥{{ toFixed(orderInfo.sumExpressFee, 2) }}</view>
            </view>
            <!-- 实付金额（支付金额+运费） -->
            <view class="order-item">
                <view>付款金额</view>
                <view>
                    <text v-if="Number(orderInfo.sumPayAmt) > 0">¥{{ Number(orderInfo.sumPayAmt)  }}</text>
                    <text style="margin: 0 10rpx;" v-if="Number(orderInfo.sumPayAmt) > 0 && Number(orderInfo.sumExchangePoints) > 0">+</text>
                    <text v-if="Number(orderInfo.sumExchangePoints) > 0">{{ orderInfo.sumExchangePoints }}会员分</text>
                </view>
            </view>
            <view class="order-item" v-if="payType == 'hiPay' && discountRate && discountRate != 100">
                <view>商户折扣率</view>
                <view>
                    <text v-if="discountRate&&discountRate!=100">{{ formatDiscount(discountRate) }}</text>
                </view>
            </view>
            <view class="order-item" v-if="payType == 'hiPay' && discountRate && discountRate != 100">
                <view>实际付款金额</view>
                <view>
                    <text>{{ discountAmt }}</text>
                </view>
            </view>
            <view class="order-last">
                <view>备注信息</view>
                <input v-model="remark" placeholder="选填，请填写备注信息内容…" placeholder-style="font-size: 24rpx;"/>
            </view>
        </view>

         <view class="main" v-if="orderPayType == 'CASH'">
                <view class="main_title">请选择支付方式</view>
                <view class="main_list">
                    <!-- <view class="main_list_tips">
                        还需支付：<text class="red_col">￥<text class="font_42">{{ amount }}</text></text>
                    </view> -->
                    <view class="main_list_item" @click="choosePay('wxPay')">
                        <view class="main_list_item_left">
                            <image class="main_list_item_img" :src="minioBaseUrl + 'common/mctImages/yuemingxi_icon_weixinpayment_img.png'" mode="heightFix" />
                        </view>
                        <view class="main_list_content" style="border-bottom: 1px solid #F4F4F4;">
                            <view class="main_list_content_left">
                                <view class="main_list_content_title">微信支付</view>
                                <view class="main_list_content_desc">
                                    亿万用户的选择, 更快更安全
                                </view>
                            </view>
                            <view class="main_list_content_right">
                                <view v-if="payType == 'wxPay'" class="main_list_right_select">
                                    <u-icon name="checkbox-mark" size="32rpx" color="#ffffff"
                                        class="checkbox-mark"></u-icon>
                                </view>
                                <view v-else class="main_list_right_unselect"></view>
                            </view>
                        </view>
                    </view>
                    <view class="main_list_item" @click="choosePay('hiPay')">
                        <view class="main_list_item_left">
                            <image class="main_list_item_img" :src="minioBaseUrl + 'common/mctImages/yuemingxi_icon_hipayment_img.png'" mode="heightFix" />
                        </view>
                        <view class="main_list_content">
                            <view class="main_list_content_left">
                                <view class="main_list_content_title">余额支付<text class="main_list_content_balance">账户余额： {{ balance }}元</text></view>
                                 <view v-if="discountRate&&discountRate!=100" style="font-size: 24rpx;">商户余额支付折扣: {{ formatDiscount(discountRate) }}</view> 
                                <view class="main_list_content_desc">
                                    <view class="" v-for="(item, index) in rechargeRulesList"
                                        :key="index">
                                        <view class="main_list_content_desc_item" v-if="item.type == '1'&& item.giftAmt > 0">
                                            <text>充值{{ item.rcgAmt }}元赠送{{ item.giftAmt }}元</text>
                                        </view>
                                        <view class="main_list_content_desc_item" v-if="item.type == '2' && item.couponNum > 0">
                                            <text>充值{{ item.rcgAmt }}元赠送优惠券x{{ item.couponNum}}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="main_list_content_right">
                                <view v-if="payType == 'hiPay'" class="main_list_right_select">
                                    <u-icon name="checkbox-mark" size="24rpx" color="#ffffff"
                                        class="checkbox-mark"></u-icon>
                                </view>
                                <view v-else class="main_list_right_unselect"></view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 底部占位 -->
        <view style="width: 750rpx;height: 80rpx;"></view>
        <!-- 底部区域 -->
        <view class="bottom">
            <view class="bottom-text muti-overflow">
                共计：
                <text style="color: red;" v-if="Number(orderInfo.sumPayAmt) > 0 && discountRate && payType == 'hiPay'">¥{{ discountAmt }}</text>
                <text style="color: red;" v-else-if="Number(orderInfo.sumPayAmt) > 0">¥{{ orderInfo.sumPayAmt }}</text>
                <text style="color: red;margin: 0 10rpx;" v-if="Number(orderInfo.sumPayAmt) > 0 && Number(orderInfo.sumExchangePoints) > 0">+</text>
                <text style="color: red;" v-if="Number(orderInfo.sumExchangePoints) > 0">{{ orderInfo.sumExchangePoints }}会员分</text>
            </view>
            <view :class="['bottom-btn', (Number(usePoints) < Number(orderInfo.sumExchangePoints) && Number(orderInfo.sumExchangePoints) > 0) ? 'disabled' : '']" @click="doPay">
                {{ btnText }}
            </view>
        </view>
    </vc-container>


    <!-- 收货地址选择 -->
    <up-popup :pwdModalShow="addressShow" mode="bottom" round="20" closeable @close="addressShow = false">
        <view style="font-size: 34rpx;font-weight: bold;text-align: center;margin: 20rpx 0;">选择地址</view>
        <scroll-view scroll-y class="pop-address">
            <template v-if="addressList.length > 0">
                <view class="pop-address_item" v-for="(item, index) in addressList" :key="index" @click="setAddress(item)">
                    <view>
                        <view class="flex" style="align-items: center;font-size: 32rpx;color: #333;font-weight: bolder;">
                            <view>{{ item.name }}</view>
                            <view style="margin-left: 10rpx;">{{ item.mobile }}</view>
                        </view>
                        <view style="font-size: 28rpx;color: #999;">
                            {{ item.provinceName }}
                            {{ item.cityName }}
                            {{ item.areaName }}
                            {{ item.address }}
                        </view>
                    </view>

                    <up-icon style="float: right;" v-if="item.id == addressInfo.id" name="checkbox-mark" size="20" color="#00BCB8"></up-icon>
                </view>
            </template>
            <template v-else>
                <vc-empty  :props-data="emptyProps"></vc-empty>
            </template>
        </scroll-view>
        <view @click="addAddress" class="button">新增收货地址</view>
    </up-popup>

    <up-modal :show="pwdModalShow" title="嗨创生活余额支付">
        <view class="modal-content">
            <view class="password_manage_input_item">
                <input class="form-control" :password="!showP" placeholder="请输入密码" maxlength="16"
                    v-model="password" />
                <view class="password_manage_input_item_eye" @click="showP = !showP">
                    <image v-if="showP" class="visible_img"
                        :src="minioBaseUrl + '/common/mctImages/icon_visible_img.png'" mode="scaleToFill" />
                    <image v-else class="visible_img"
                        :src="minioBaseUrl + '/common/mctImages/icon_unvisible_img.png'" mode="scaleToFill" />
                </view>
            </view>
        </view>
        <template #confirmButton>
            <view class="modal-footer">
                <view class="cancel-btn" @click="cancel">取消支付</view>
                <view class="confirm-btn" @click="confirm">确认支付</view>
            </view>
        </template>
    </up-modal>

</template>

<script>
    import { usePointsStore } from "@/store/index"
    import {
        getDeliveryAddressPage,// 收货地址列表
        integralMallOrder,// 积分商城下单
        productOrderDetails,// 预下单更新信息用
        appgetUserFubaoPointsVip,// 获取个人积分数
        getBalanceAndScore, // 获取余额和积分
        completeOrder, // 通知订单状态
        getMctDiscountRate, // 获取商户信息
    } from '../api/index'
    import {
        divide,
        minus,
        multiply,
        plus,
        toFixed
    } from '@/utils/decimal'

    export default {
        name: 'checkout',
        data() {
            return {
                plus,
                toFixed,
                minus,
                multiply,
                
                mctId: '',// 商户ID

                addressInfo: {},// 地址信息
                isVirtualProduct: false,// 是否是虚拟商品 1-是，!1-否
                addressShow: false,//地址选择弹出层
                addressList: [],//地址选择弹出层列表

                productList: [],// 商品信息
                orderInfo: {},// 订单信息
                remark: '',// 订单备注

                usePoints: 0,// 可使用积分数
                canDelivery: true,// 
                
                emptyProps: {
                    props: {
                        marginTop: {
                            value: '50'
                        }
                    }
                },//vc-empty的props

                orderPayType: "",
                amount: 0,
                mctId: "",
                payType: "hiPay",
                rechargeRulesList: [],
                balance: "0",

                pwdModalShow: false,
                password: '',
                showP: false,
                orderId: '',
                complateOrderId: "", // 完成低昂单接口需要id
                discountRate: 100, // 余额支付折扣率
                // discountAmt: 0, // 余额支付折扣金额
            }
        },
        computed: {
            btnText() {
                if(Number(this.usePoints) < Number(this.orderInfo.sumExchangePoints) && Number(this.orderInfo.sumExchangePoints) > 0) {
                    return '积分不足'
                }
                else if(Number(this.orderInfo.sumPayAmt) > 0) {
                    return '立即购买'
                } 
                else if(Number(this.orderInfo.sumPayAmt) == 0) {
                    return '立即兑换'
                }
            },
            discountAmt() {
                //  return Math.round(Number(this.amount) * (this.discountRate )) / 100

                  // 计算折扣金额，保留两位小数且不四舍五入
                  let discountRate = Number(this.discountRate) || 100
                  let result = (Number(this.amount) * discountRate) / 100
                  // 先乘以100，取整，再除以100，实现只要小数点后两位有值就进一位
                  return Math.ceil(result * 100) / 100
            },
        },
        onLoad(options) {
            this.getPoints()
            let pointsCheckoutRes = usePointsStore().pointsOrderRes
            
            this.productList = pointsCheckoutRes.orderinfoResqList
            let allProductNum = pointsCheckoutRes.orderinfoResqList.map(e => e.num).reduce((sum, current) => plus(sum, current), 0)
            let allProductPrice = multiply(allProductNum, this.productList[0].originalPrice)
            
            // 计算平台补贴，根据数量相匹配，一件补贴跟多件补贴成正比
            let subPrice = 0
            if (pointsCheckoutRes.subPrice && Number(pointsCheckoutRes.subPrice) > 0) {
                subPrice = Number(pointsCheckoutRes.subPrice)
            }
            
            this.orderInfo = {
                ...pointsCheckoutRes,
                allProductNum: allProductNum,
                allProductPrice: allProductPrice,
                subPrice: subPrice
            }
            console.log(this.orderInfo,'this.orderInfo')
            // 地址信息(默认地址情况)
            this.addressInfo = pointsCheckoutRes.defaultAddress ? {...pointsCheckoutRes.defaultAddress} : {}
            this.isVirtualProduct = this.productList[0].isVirtualProduct
            for(let i in this.orderInfo) {
                if(typeof this.orderInfo[i] == 'number') {
                    this.orderInfo[i] = this.orderInfo[i].toString()
                }
            }
            this.mctId = options.mctId

            console.log("=====",this.orderInfo)

            this.orderPayType = (this.orderInfo.orderinfoResqList&&this.orderInfo.orderinfoResqList.length)?this.orderInfo.orderinfoResqList[0].payType:""
            // 计算实际支付金额，减去平台补贴
            let sumPayAmt = Number(this.orderInfo.sumPayAmt)
            this.amount = sumPayAmt
            this.getBalanceAndScore()
            this.getDiscountRate()
        },
        onShow() {
            if(this.addressShow) {
                this.getAddress()
            }
        },
        methods: {
            // 获取积分数
            async getPoints() {
                let res = await appgetUserFubaoPointsVip({},{mask: false})
                this.usePoints = res.points.availablePoints
                return
            },
            //打开收货地址选择
            getAddress() {
                getDeliveryAddressPage({
                    page: 1,
                    rows: 20
                }).then(res=>{
                    console.log(res)
                    this.addressList = [...res.list]
                    this.addressShow = true
                })
            },
            // 选择地址
            setAddress(e) {
                let addressInfoOld = Object.freeze(this.addressInfo)
                // 更新的地址是否跟之前的城市为一个地址，是的话则不进行后续预下单信息更新逻辑
                if(e.city == this.addressInfo.city) {
                    this.addressInfo = {...e}
                    this.addressShow = false
                    return
                }
                // 下单逻辑
                let skuList = [{
                    skuId: this.productList[0].skuId,
                    num: this.productList[0].num
                }]
                productOrderDetails({
                    mallType : 'POINTS',
                    orderinfos: skuList,
                    city: e.city,

                }, {
                    catchError: true
                }).then(res=>{ 
                    // 更新预下单信息
                    this.addressInfo = {...e}
                    this.addressShow = false
                    this.productList = res.orderinfoResqList
                    let allProductNum = res.orderinfoResqList.map(e => e.num).reduce((sum, current) => plus(sum, current), 0)
                    let allProductPrice = multiply(allProductNum, this.productList[0].originalPrice)
                    
                    // 计算平台补贴，根据数量相匹配，一件补贴跟多件补贴成正比
                    let subPrice = 0
                    if (res.subPrice && Number(res.subPrice) > 0) {
                        subPrice = Number(res.subPrice)
                    }
                    
                    this.orderInfo = {
                        ...res,
                        allProductNum: allProductNum,
                        allProductPrice: allProductPrice,
                        subPrice: subPrice
                    }
                    // 计算实际支付金额，减去平台补贴
                    // 确保sumPayAmt是正确的基础金额（商品价格 - 商家补贴）
                    let sumPayAmt = Number(this.orderInfo.sumPayAmt)
                    let subPriceValue = Number(this.orderInfo.subPrice || 0)
                    // 实际付款金额 = 商品价格 - 商家补贴 - 平台补贴
                    this.amount = sumPayAmt - subPriceValue
                    this.canDelivery = true
                }).catch(err=>{
                    this.bridgeSdk.showToast({
                        title: err.message,
                    })
                    // 更新预下单信息
                    this.addressInfo = {...addressInfoOld}
                    this.addressShow = false
                    // 0024-不支持配送问题
                    if(err.code == '0024') {
                        this.canDelivery = false
                    }
                })
            },
            // 跳转新增地址
            addAddress() {
                this.bridgeSdk.jumpPage({
                    url: `/package-address/pages/addAddress`
                })
            },
            //获取经纬度
            getLocation() {
                return new Promise((resolve, reject) => {
                    this.bridgeSdk.getLocation((res) => {
                        console.log(res, "获取定位");
                        resolve(res)
                    });
                })
            },
            // 立即购买/立即兑换
            doPay() {
                if(!this.bridgeSdk.checkIsEmpty(this.addressInfo) && this.isVirtualProduct != '1') {
                    this.bridgeSdk.showToast({
                        title: "请选择收货地址",
                        duration: 1000,
                    })
                    return;
                }
                console.log(this.orderPayType == "CASH"&&!this.payType)
                if(this.orderPayType == "CASH"&&!this.payType){
                    this.bridgeSdk.showToast({
                        title: "请选择支付方式",
                        duration: 1000,
                    })
                    return;
                }
                if(this.orderPayType == "CASH"&&this.payType=="hiPay"&&Number(this.balance)<Number(this.amount)){
                    this.bridgeSdk.showToast({
                        title: "余额不足",
                        duration: 1000,
                    })
                    return;
                }
                console.log(this.orderPayType,this.payType,this.discountRate,this.discountAmt,this.orderInfo.sumPayAmt)
                let content = '确认支付'
                if(this.orderPayType == "CASH"&&this.payType=="hiPay"){
                    if(this.discountRate!= 100){
                        content += `${Number(this.discountAmt)}`
                    }
                    if(this.discountRate == 100){
                        content += `¥${this.orderInfo.sumPayAmt}`
                    }
                }
                if(this.orderPayType == "POINTS"&&this.orderInfo.sumExchangePoints > 0){
                    content += `+${this.orderInfo.sumExchangePoints}会员分`
                }
                content += `${Number(this.orderInfo.sumPayAmt) == 0 ? '兑换' : '购买'}`
                content += '该商品吗？'

                this.$refs.modal.open({
                    title: `确认${Number(this.orderInfo.sumPayAmt) == 0 ? '兑换' : '购买'}`,
                    content: content,
                    confirmText: '确定',
                    cancelText: '取消',
                    confirmCallback:async () => {
                        if(this.orderPayType == "CASH"){
                            if(this.payType == "hiPay"){
                                let params = {
                                    payMethod: "BALANCE",//BALANCE=余额支付，WECHAT=微信支付（就是选支付方式）
                                    // token：用户的token
                                    // wxCode：微信授权code
                                }
                                if(this.discountRate!= 100){
                                    params.discountPayAmt = this.discountAmt
                                }
                                this.payReq(params)
                            }
                            if(this.payType == "wxPay"){
                                uni.login({
                                    success: (res) => {
                                        console.log(res)
                                        if (res.code) {
                                            this.payReq({
                                                payMethod: "WECHAT",//BALANCE=余额支付，WECHAT=微信支付（就是选支付方式）
                                                // token：用户的token
                                                wxCode: res.code
                                            })
                                        }
                                    },
                                    fail: (res) => {
                                        console.log(res)
                                    }
                                })
                            }
                        }else{
                            this.payReq()
                        }
                    }
                })
            },
            async payReq(otherParams={}){
                //获取经纬度
                // let locationObj = await this.getLocation()
                //获取设备信息
                let deviceObj = await this.bridgeSdk.getDeviceInfo()
                let address = {}
                if(this.isVirtualProduct == '1') {
                    address = {
                        province: '',
                        provinceName: '',
                        city: '',
                        cityName: '',
                        district: '',
                        districtName: '',
                        address: '',
                        mobile: '', 
                        postalCode: '', // 邮编
                        consignee: '',
                    }
                } else {
                    address = {
                        province: this.addressInfo.province,
                        provinceName: this.addressInfo.provinceName,
                        city: this.addressInfo.city,
                        cityName: this.addressInfo.cityName,
                        district: this.addressInfo.area,
                        districtName: this.addressInfo.areaName,
                        address: this.addressInfo.address,
                        mobile: this.addressInfo.mobile,
                        postalCode: this.addressInfo.postalCode || '', // 邮编
                        consignee: this.addressInfo.name,
                    }
                }
                let res = await integralMallOrder({
                    ...address,// 地址信息
                    shoppingAll: this.productList.map(e=>({
                        ...e,
                        shopsId: e.mctId
                    })),
                    country: '中国',
                    postscript: this.remark,
                    // lat: locationObj.lat,//经度
                    // lng: locationObj.lng,//纬度
                    lng: '115.471463',// 经度
                    lat: '38.8799877',// 纬度
                    ip: deviceObj.ip||'127.0.0.1',//ip
                    mac: deviceObj.mac||'MAC',//mac
                    deviceId: deviceObj.deviceId||'DEVICE',//设备编号
                    // #ifdef H5
                    webNotifyUrl: encodeURIComponent(this.baseUrl + '#/package-intergral-mall/order/orderDetail'),//订单完成回调页面
                    // #endif
                    // #ifdef MP-WEIXIN
                    webNotifyUrl: 'nojump',//订单完成回调页面
                    // #endif
                    orderSource: 'ICBCAPP',
                    remark: this.remark,

                    ...otherParams
                })
                console.log(res)

                // // 有金额支付情况
                // if(res.payUrl) {
                //     let encodeUrl = encodeURIComponent(res.payUrl)
                //     // #ifdef MP-WEIXIN
                //     this.bridgeSdk.jumpPage({
                //         url: '/pages/app-h5/third-h5?scene_url=' + encodeUrl + '&title=' + encodeURIComponent('收银台')
                //     })
                //     // #endif
                //     // #ifdef H5
                //     let _q = res.payUrl.indexOf("?") > -1 ? "&" : "?";
                //     location.replace(res.payUrl + _q + '_needH5Head=1&appToken=' + this.bridgeSdk.getStorageSync('appToken'))
                //     // #endif
                // } 
                // 金额支付
                if(this.orderPayType == "CASH"){
                    // 余额支付
                    if(this.payType == "hiPay"){
                        this.completeOrderId = res.balanceResult.id
                        this.orderId = res.outOrderNo
                        if (res.balanceResult.pwdFlag == '1') {
                            // 输入支付密码
                            this.pwdModalShow = true;
                        } else if (res.balanceResult.pwdFlag == '0') {
                            this.successJump()
                        }
                    }
                    // 微信支付
                    if(this.payType == "wxPay"){
                        // this.completeOrderId = res.wechatResult.orderId
                        this.orderId = res.outOrderNo
                        this.openWxPay(res.wechatResult)
                    }
                }
                // 纯积分情况
                else {
                    this.orderId = res
                    this.successJump()
                    // this.bridgeSdk.jumpPage({
                    //     url: `/package-intergral-mall/order/exchangeSuccess?orderId=${res}`,
                    //     openType: 'redirectTo'
                    // })
                }
            },

            choosePay(type) {
            this.payType = type;
            },
            getBalanceAndScore(){
                getBalanceAndScore().then(res => {
                    console.log("getBalanceAndScore", res);
                    if (res.balance) {
                        this.balance = res.balance
                    }
                })
            },
        
            cancel() {
                this.pwdModalShow = false;
                let params = {
                    orderId: this.completeOrderId,
                    status: "2",
                }
                this.completeOrder(params)
            },
            confirm() {
                if (!this.password) {
                    uni.showToast({
                        title: '请输入密码',
                        icon: 'none',
                        duration: 2000
                    })
                    return
                }
                this.pwdModalShow = false;
                // let inputPwd = this.bridgeSdk.aesEncrypt(this.password).reqData
                let params = {
                    orderId: this.completeOrderId,
                    // inputPwd: encodeURIComponent(inputPwd),
                    inputPwd: this.password,
                    status: "1",
                }
                this.completeOrder(params)
            },
            completeOrder(params) {
                let extra = {
                    mask: false, catchError: true,
                }

                completeOrder(params, params.status == '0' ? extra : {}).then(res => {
                    console.log("completeOrder", res);
                    if(params.status == '1'){
                        this.successJump()
                    }
                })
            },
            openWxPay(info) {
                console.log("openWxPay", info)
                let that = this;
                uni.getProvider({
                    service: "payment",
                    success: function (getProviderRes) {
                        console.log("getProviderRes", getProviderRes)
                        uni.requestPayment({
                            "provider": getProviderRes.provider,
                            'timeStamp': info.timeStamp,
                            'nonceStr': info.nonceStr,
                            'package': info.packageName,
                            'signType': info.signType,
                            'paySign': info.paySign,
                            success: function (res) {
                                console.log("openWxPay success", res)
                                that.successJump()
                            },
                            fail: function (res) {
                                console.log("openWxPay fail", res)
                            }
                        })
                    }
                })

            },
            successJump(){
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/exchangeSuccess?orderId=${this.orderId}`,
                    openType: 'redirectTo'
                })
            },
            getDiscountRate(){
                getMctDiscountRate({mctId: this.mctId}).then(res=> {
                    console.log("getMctDiscountRate", res);
                    this.discountRate = Number(res)
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

<style lang="scss" scoped>
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
.address {
    width: calc(670rpx - 60rpx);
    padding: 52rpx 30rpx 52rpx 30rpx;
    margin: 42rpx auto 0;
    border-radius: 16rpx;
    background-color: white;
    font-size: 28rpx;
    color: #333333;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    image {
        width: 48rpx;
        height: 48rpx;
        margin-right: 17rpx;
    }
}
.product {
    width: calc(670rpx - 59rpx);
    padding: 24rpx 35rpx 34rpx 24rpx;
    background-color: white;
    border-radius: 16rpx;
    margin: 24rpx auto 0;
    &-item {
        display: flex;
        align-items: center;
        image {
            width: 140rpx;
            height: 135rpx;
            margin-right: 24rpx;
            border-radius: 16rpx;
        }
        &_title {
            font-size: 32rpx;
            color: #333333;
            font-weight: bold;
            line-height: 45rpx;
        }
        &_text {
            font-size: 24rpx;
            color: #666;
            line-height: 32rpx;
        }
    }
}
.order {
    width: calc(670rpx - 60rpx);
    padding: 34rpx 30rpx 42rpx;
    background-color: white;
    margin: 24rpx auto 0;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 30rpx;
    &-item {
        width: 100%;
        font-size: 24rpx;
        color: #222222;
        line-height: 33rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        view:first-of-type {
            font-weight: bold;
        }
        view:last-of-type {
            color: #999999;
        }
    }
    &-last {
        width: 100%;
        view:first-of-type {
            font-size: 24rpx;
            color: #222222;
            line-height: 33rpx;
            font-weight: bold;
        }
        input {
            margin-top: 16rpx;
            font-size: 24rpx;
        }
    }
}
.bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    padding: 30rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-text {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        flex: 1;
        width: 50%;
    }
    &-btn {
        width: 328rpx;
        height: 84rpx;
        line-height: 84rpx;
        border-radius: 42rpx;
        text-align: center;
        color: white;
        font-size: 32rpx;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
    }
    .disabled {
        opacity: 0.8;
        pointer-events: none;
        cursor: none;
    }
}

.pop-address{
    height: 500rpx;
    padding-bottom: 180rpx;
    &_item{
        line-height: 50rpx;
        padding: 20rpx 40rpx;
        border-bottom: 2rpx solid #f8f8f8;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

}

.button {
    position: fixed;
    left: 4%;
    bottom: 40rpx;
    width: 92%;
    height: 84rpx;
    background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
    border-radius: 42rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 32rpx;
    color: #FFFFFF;
    text-align: center;
    font-style: normal;
    display: flex;
    justify-content: center;
    align-items: center;
}

.main {
    width: 710rpx;
    margin: 44rpx auto 0;

    .main_title {
        font-weight: 800;
        font-size: 30rpx;
        color: #212121;
        line-height: 42rpx;
        padding-bottom: 18rpx;
    }

    .main_list {
        width: 710rpx;
        background: #FFFFFF;
        border-radius: 12rpx;

        .main_list_tips {
            padding: 30rpx 40rpx 36rpx;
            vertical-align: bottom;
            font-weight: bold;
            font-size: 26rpx;
            color: #212121;
            line-height: 36rpx;

            .red_col {
                color: #EB5149;
            }

            .font_42 {
                font-size: 42rpx;
                color: #EB5149;
                line-height: 58rpx;
            }
        }

        .main_list_item {
            width: 710rpx;
            box-sizing: border-box;
            padding: 28rpx 0 22rpx;
            display: flex;
            align-items: flex-start;

            .main_list_item_left {
                width: 115rpx;
                flex-shrink: 0;
                display: flex;
                justify-content: center;

                .main_list_item_img {
                    height: 48rpx;
                }
            }

            .main_list_content {
                width: auto;
                flex-grow: 1;
                padding-right: 56rpx;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding-bottom: 28rpx;

                .main_list_content_left {
                    flex-grow: 1;

                    .main_list_content_title {
                        font-weight: bold;
                        font-size: 28rpx;
                        color: #343434;
                        line-height: 48rpx;
                        .main_list_content_balance{
                            font-size: 24rpx;
                            color: #EB5149;
                            margin-left: 46rpx;
                            font-weight: 400;
                        }
                    }

                    .main_list_content_desc {
                        font-weight: 500;
                        font-size: 22rpx;
                        color: #C4C4CA;
                        line-height: 32rpx;
                        margin-top: 14rpx;
                        display: flex;
                        flex-wrap: wrap;

                        .main_list_content_desc_item {
                            margin-right: 10rpx;
                            margin-bottom: 10rpx;
                            font-size: 22rpx;
                            color: #E85530;
                            padding: 4rpx 14rpx;
                            border-radius: 4rpx;
                            border: 2rpx solid #E85530;
                        }
                    }
                }

                .main_list_content_right {
                    width: 44rpx;
                    height: 48rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .main_list_right_select {
                        width: 38rpx;
                        height: 38rpx;
                        border-radius: 50%;
                        background: #68D8C6;
                        border: 1px solid #68D8C6;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                    }

                    .main_list_right_unselect {
                        width: 38rpx;
                        height: 38rpx;
                        border-radius: 50%;
                        border: 2rpx solid #C4C4CA;
                        background: transparent;
                    }
                }
            }
        }
    }
}
.password_manage_input_item {
        width: 600rpx;
        height: 114rpx;
        margin: 56rpx auto 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 54rpx;
        border-radius: 110rpx;
        background: #F6F6F6;
        position: relative;
    }

    .password_manage_input_item_eye {
        padding: 20rpx;
    }

    .visible_img {
        width: 48rpx;
        height: 48rpx;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20rpx;
        padding: 0 54rpx;
    }

    .cancel-btn {
        width: 150rpx;
        height: 60rpx;
        background: #eeeeee;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #2A57EC;
        line-height: 60rpx;
        text-align: center;
    }

    .confirm-btn {
        width: 150rpx;
        height: 60rpx;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
        box-shadow: 0rpx 6rpx 12rpx 2rpx rgba(98, 168, 243, 0.35);
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #FFFFFF;
        line-height: 60rpx;
        text-align: center;
    }
</style>