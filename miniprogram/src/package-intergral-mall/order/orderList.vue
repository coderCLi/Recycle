<!--
 * @Description: 订单列表（新）
 * @Autor: TF
 * @Date: 2025-07-02 14:22:44
 * @LastEditors: TF
 * @LastEditTime: 2025-08-29 09:16:43
-->
<template>
    <vc-modal ref="modal"/>
    <vc-container ref="conatainer" :props-data="propsData" :style="{overflow: filterShow ? 'hidden' : ''}">
        <!-- 搜索块 -->
        <view class="search" style="z-index: 5;position: relative;">
            <up-search placeholder="搜索订单号" height="80rpx" :showAction="false" v-model="keyword" @clear="doSearch" @search="doSearch"></up-search>
            <view class="search-right" @click="showFilter">
                <image :src="staticBaseUrl + '/hbdimage/package-product-list/fenlei.png'"/>
                <view>筛选</view>
            </view>
        </view>
        <!-- tab页签 -->
        <!-- <up-sticky  bgColor="#fff" :zIndex="2" :style="{top: offsetTop + 'px'}">
            <up-tabs 
                :list="tabs" keyName="name"
                lineColor="linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #00BCB9" 
                lineHeight="8rpx" lineWidth="60rpx" :scrollable="true"
                :itemStyle="{width: 'auto', padding: '0 40rpx'}"
                :inactiveStyle="{fontSize: '28rpx', color: '#333333', marginBottom: '14rpx'}"
                :activeStyle="{fontSize: '28rpx', color: '#333333', marginBottom: '14rpx'}"
                @click="doTab"></up-tabs>
        </up-sticky> -->
        <!-- 列表 -->
        <view class="list">
            <template v-if="orderList.length > 0">
                <template v-if="nowTab == 'refund'">
                    <aftersaleBlock v-for="(item, index) in orderList" :key="index" :info="item"></aftersaleBlock>
                </template>
                <template v-else>
                    <orderBlock v-for="(item, index) in orderList" :key="index" :item="item"></orderBlock>
                </template>
            </template>
            <vc-empty :props-data="{props: {text: {value: emptyText}}}" v-else/>
            <up-loadmore style="margin-top: 10rpx;" v-if="orderList.length > 0" :nomoreText="nomoreText" :status="loadingStatus" />
        </view>
        
        <!-- 取消弹窗 -->
        <up-popup :show="cancelShow" :round="20" closeable :safeAreaInsetBottom="false" mode="bottom" @close="cancelShow = false">
            <view class="cancel">
                <view class="cancel-title">取消订单</view>
                <view class="cancel-content">
                    <up-radio-group v-model="cancelKey" activeColor="#00BCB8" iconPlacement="right" @change="radioChange">
                        <view style="display: flex;flex-direction: column;align-items: center;gap: 24rpx;width: 100%;padding: 0 30rpx;">
                                <view v-for="(item, index) in cancelReasonList" :key="index" class="cancel-content_item">
                                    <up-radio :name="item.key" :label="item.text"></up-radio>
                                </view>
                        </view>
                    </up-radio-group>
                    <view class="cancel-content_textarea" v-if="cancelKey == '99'">
                        <up-textarea v-model="cancelReason" maxlength="200" count placeholderStyle="font-size: 24rpx;" placeholder="请输入取消原因"></up-textarea>
                    </view>
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
        <!-- 筛选弹窗 -->
        <up-popup @touchmove.prevent :show="filterShow" :zIndex="3" :safeAreaInsetBottom="false" :overlayStyle="{
            top: `calc(${navigationBarInfo.navigationBarHeight + 'px'} + 220rpx)`
        }" :customStyle="{
            top: `calc(${navigationBarInfo.navigationBarHeight + 'px'} + 219rpx)`
        }" :duration="100" round="20rpx" @close="filterShow = false" mode="top">
            <view class="filter">
                <view class="filter-title">时间选择</view>
                <view class="filter-times">
                    <view v-for="(item, index) in timeList" :class="['item', nowTimeType == item.optCode ? 'active' : '']" :key="index" @click="(nowTimeType = item.optCode)">{{ item.optName }}</view>
                </view>
                <template v-if="nowTimeType == 'diy'">
                    <view class="filter-title">自定义时间</view>
                    <view class="filter-timepicker">
                        <view class="item" @click="getTimePicker('startDate')" :style="{color: startDate ? '#333' : 'gray' }">
                            {{ startDate ? startDate : '开始时间' }}
                        </view>
                        -
                        <view class="item" @click="getTimePicker('endDate')" :style="{color: endDate ? '#333' : 'gray' }">
                            {{ endDate ? endDate : '结束时间' }}
                        </view>
                    </view>
                </template>
                <view class="filter-btns">
                    <view class="btn-normal" @click="doReset">重置</view>
                    <view class="btn" @click="doFilter">确认</view>
                </view>
            </view>
        </up-popup>
        <!-- 日期选择 -->
        <up-datetime-picker
            :show="timePicker"
            v-model="nowDate"
            :maxDate="maxDate"
            :minDate="minDate"
            mode="date"
            @confirm="confirmDate"
            @cancel="timePicker = false"
        ></up-datetime-picker>
    </vc-container>
</template>

<script>
    import { mapState } from 'pinia';
    import { plus, multiply } from '@/utils/decimal'
    import { useBaseStore } from "@/store/index.ts";
    import { 
        pointsUserOrders,
        afterSaleOrder,
        pointsCancel,
        getDataDicList
    } from '../api/index'
    import orderBlock from '../components/order-block.vue'
    import aftersaleBlock from '../components/aftersale-block.vue';
    const MAX_DATE = new Date().getTime()
    const MIN_DATE = new Date(new Date().getTime() - 3 * 365 * 24 * 60 * 60 * 1000).getTime()
    export default {
        name: 'orderList',
        components: {
            orderBlock,
            aftersaleBlock
        },
        data() {
            return {
                propsData: {
                    props: {
                        isFullScreen: {
                            value: false
                        },
                        containerBackground: {
                            value: '#f5f6f8'
                        },
                        title: {
                            value: "购买记录"
                        }
                    }
                }, //container的props
                offsetTop: 0,// stikcy吸顶高度
                keyword: '',// 搜索关键词
                from: 'mct',// 来源 mall-商城，mct-本地生活，point-积分商城

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
                }, // 订单状态
                tabs: [
                    {
                        name: '全部',
                        key: 'all'
                    },
                    {
                        name: '待支付',
                        key: 'obl'
                    },
                    {
                        name: '待收货/使用',
                        key: 'pay'
                    },
                    {
                        name: '退款/售后',
                        key: 'refund'
                    }
                ], // tabs页签
                nowTab: 'all',// 当前页签
                page: 1,// 分页-页
                rows: 10,// 分页-行
                orderList: [],// 列表
                total: 0,// 总数
                loadingStatus: 'loadmore',// 加载状态

                userId: '',// userId

                statusColorMap: {
                    'PENDING_PAYMENT': '#FF5871',// 待付款
                    'PENDING_RECEIPT_USE': '#00BCB8',// 可使用
                    'PENDING_USE': '#00BCB8',// 可使用
                    'PENDING_SHIPMENT': '#00BCB8',// 待发货
                    'PENDING_RECEIPT': '#00BCB8',// 待收货
                    'COMPLETED': '#999999',// 交易成功
                    'CANCELLED': '#999999',// 已取消
                    // 退款、售后相关状态
                    'EXPIRED_REFUNDING_PROCESSING': '#FF583A',// 过期退款中
                    'REFUND_REVIEWING': '#FF583A',// 退款审核中
                    'REFUND_PROCESSING': '#FF583A',// 退款中
                    'PART_REFUND_PROCESSING': '#FF583A',// 部分退款中
                    
                    'REFUND_SUCCESS': '#999999',// 已退款
                    'EXPIRED_REFUNDED_SUCCESS': '#999999',// 过期退款成功
                    'EXPIRED_REFUND': '#999999',// 过期退款
                    
                    'AFTER_SALE_PROCESSING': '#FF583A',// 售后中
                    'MERCHANT_REFUSED': '#FF5871',// 商家拒绝售后
                    // 退货相关状态
                    'RETURN_REVIEWING': '#FF583A',// 退货审核中
                    'RETURN_PROCESING': '#FF583A',// 退货处理中
                    'PART_RETURN_PROCESING': '#FF583A',// 部分退货处理中
                    'RETURN_PENDING_RETURN_SHIPMENT': '#FF583A',// 待退货
                    'RETURN_PENDING_SELLER_RECEIPT': '#FF583A',// 待商家收货
                    'RETURN_PENDING_CHECKING': '#FF583A',// 退货验货中
                    'RETURN_PENDING_REFUNDING': '#FF583A',// 退货退款中
                    'RETURN_PENDING_SUCCESS': '#999999',// 退货完成
                    // 换货相关状态
                    'EXCHANGE_REVIEWING': '#FF583A',// 换货审核中
                    'EXCHANGE_PROCESSING': '#FF583A',// 换货处理中
                    'PART_EXCHANGE_PROCESSING': '#FF583A',// 部分换货处理中
                    'EXCHANGE_CHECKING_PROCESSING': '#FF583A',// 换货验货中
                    'EXCHANGE_SENDED': '#FF583A',// 换货已发货
                    'EXCHANGE_SUCCESS': '#999999',// 换货完成
                },// 订单状态颜色

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
                cancelOrderId: '',// 取消订单ID

                filterShow: false,// 筛选弹窗   
                timeList: [
                    {
                        optName: '近一个月',
                        optCode: 'month',
                    },
                    {
                        optName: '近三个月',
                        optCode: 'season',
                    },
                    {
                        optName: '近六个月',
                        optCode: 'harfyear',
                    },
                    {
                        optName: '近一年',
                        optCode: 'year',
                    },
                    {
                        optName: '自定义',
                        optCode: 'diy',
                    }
                ],//时间选择 month/season/harfyear/year/diy
                nowTimeType: 'year',// 时间选择当前类型
                trueTimeType: 'year',// 时间选择当前类型
                nowDate: Date.now(),// 当前时间 
                maxDate: MAX_DATE,// 最大时间
                minDate: MIN_DATE,// 最小时间
                timePicker: false,// 时间选择弹出
                timeType: '',// 时间选择类型
                maxRange: 3 * 30 * 24 * 60 * 60 * 1000,// 三个月周期
                startDate: '',
                endDate: '',
                lastId: '',
                lastShopId: '',

                canPullUp: true,// 是否可上拉刷新
            }
        },
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
            // 无更多文字
            nomoreText() {
                if(this.trueTimeType != 'diy') {
                    return this.timeList.find(e => e.optCode == this.trueTimeType).optName + '内无更多订单'
                } else {
                    return this.startDate + '至' + this.endDate + '范围内无更多订单'
                }
            },
            // 空状态文本提示
            emptyText() {
                if(this.trueTimeType != 'diy') {
                    return this.timeList.find(e => e.optCode == this.trueTimeType).optName + '内暂无订单'
                } else {
                    return this.startDate + '至' + this.endDate + '暂无订单'
                }
            },
        },     
        onLoad(options) {
            this.offsetTop = this.navigationBarInfo.statusBarHeight + this.navigationBarInfo.navigationBarHeight
            this.clearStatus()
            if(this.nowTab == 'refund') {
                this.getAfterSaleOrder()
                return;
            }
            this.getOrderList()
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.clearStatus()
            //调用获取数据方法
            if(this.nowTab == 'refund') {
                this.getAfterSaleOrder()
            }
            else {
                this.getOrderList()
            }
            //结束下拉刷新
            uni.stopPullDownRefresh();

        },
        onReachBottom() {
            console.log('onReachBottom')
            if(this.total <= this.orderList.length) {
                this.loadingStatus = 'nomore'
                return
            }
            this.loadingStatus = 'loading'
            this.page += 1;
            if(this.nowTab == 'refund') {
                this.getAfterSaleOrder()
                return;
            }
            this.getOrderList()
        },
        onShow() {
            uni.$on('orderCancel', async data => {
                await this.getCancelReasonList(data.isVirtualProduct == '1' ? 'VIRTUAL_CANCEL_REASON' : 'ENTITY_CANCEL_REASON')
                this.cancelShow = true
                this.cancelKey = ''
                this.cancelReason = ''
                this.cancelOrderId = data.pointsOrderId
            })

            uni.$off('getOrderList')
            uni.$on('getOrderList', data => {
                this.canPullUp = false// 增加限制避免目前安卓上在蒙版时上拉仍出发onReachBottom问题
                this.clearStatus()
                if(this.nowTab == 'refund') {
                    this.getAfterSaleOrder()
                    return;
                }
                this.getOrderList()
                this.canPullUp = true
            })
        },
        onHide() {
            uni.$off('orderCancel')
            // uni.$off('getOrderList')
        },
        methods: {
            // 恢复初态
            clearStatus() {

                this.page = 1
                this.orderList = []
                this.total = 0
                this.lastShopId = ''
                this.lastId = ''
            },
            // 获取取消原因列表
            async getCancelReasonList(code = 'VIRTUAL_CANCEL_REASON') {
                let res = await getDataDicList({
                    code: code
                })
                this.cancelReasonList = res.map(e => ({
                    key: e.optCode,
                    text: e.optName
                }))
            },
            // 获取订单列表
            getOrderList() {
                pointsUserOrders({
                    page: this.page,
                    rows: this.rows,
                    lastShopId: this.lastShopId,
                    lastId: this.lastId,
                    key: this.keyword,
                    dateType: this.trueTimeType,
                    startDate: this.startDate ? this.dateFormat(new Date(this.startDate), 'yyyyMMdd') : '',
                    endDate: this.endDate ? this.dateFormat(new Date(this.endDate), 'yyyyMMdd') : '',
                    type: this.nowTab,
                    mallScene: 'POINTS_MALL',
                }).then(res=>{
                    this.orderList = [...this.orderList, ...res.list.map(e=>{
                        let pointsOrderItems;
                        // 虚拟商品
                        if(e.isVirtualProduct == '1') {
                            let refundSize = e.pointsOrderItems.filter( e => e.onAfterSales == '1' ).length// 售后中数量
                            let refundOverSize = e.pointsOrderItems.filter( e => e.onAfterSales == '2' ).length// 售后完成数量
                            let refundingObj = e.pointsOrderItems.find(e => e.onAfterSales == '1') || {}
                            let refundOverObj = e.pointsOrderItems.find(e => e.onAfterSales == '2') || {}
                            pointsOrderItems = [
                                {
                                    ...e.pointsOrderItems[0],
                                    quantity: e.pointsOrderItems.map(e => e.quantity).reduce((sum, current) => plus(sum, current), 0),// 子订单数量
                                    afterSalesNum: e.pointsOrderItems.map(e => e.afterSalesNum || 0).reduce((sum, current) => plus(sum, current), 0),// 子单售后数量
                                    subPayAmt: e.pointsOrderItems.map(e => e.subPayAmt).reduce((sum, current) => plus(sum, current), 0),// 子订单实付金额
                                    subOrderPonints: e.pointsOrderItems.map(e => e.subOrderPonints).reduce((sum, current) => plus(sum, current), 0),// 子订单实付积分
                                    // 虚拟订单同时仅可能有一个售后中状态，故优先取售后中的afterSaleId，无售后中则取售后完成的afterSaleId
                                    afterSalesId: e.pointsOrderItems.find(e => e.onAfterSales == '1' )?.afterSalesId || e.pointsOrderItems.find(e => e.onAfterSales == '2' )?.afterSalesId,
                                    afterSalesType: e.pointsOrderItems.find(e => this.bridgeSdk.checkIsEmpty(e.afterSalesType))?.afterSalesType || '',
                                    hasUseNum: e.pointsOrderItems.filter(e => e.virtualProductIsWhetherUse == '1').length,

                                    refundSize: refundSize,// 售后中数量
                                    refundOverSize: refundOverSize,// 售后完成数量
                                    refundAmt: multiply(refundSize, refundingObj.expectedRefundAmount || '0'),// 售后中金额
                                    refundOverAmt: multiply(refundOverSize, refundOverObj.expectedRefundAmount || '0'),// 售后完成金额
                                    refundPoints: multiply(refundSize, refundingObj.expectedRefundPoints || '0'),// 售后中积分
                                    refundOverPoints: multiply(refundOverSize, refundOverObj.expectedRefundPoints || '0'),// 售后完成积分
                                }
                            ]
                        } else {
                            pointsOrderItems = e.pointsOrderItems.map(e => {
                                let refundSize = e.onAfterSales == '1' ? e.afterSalesNum || 0 : 0// 售后中数量
                                let refundOverSize = e.onAfterSales == '2' ? e.afterSalesNum || 0 : 0// 售后完成数量
                                return {
                                    ...e,
                                    refundSize: refundSize,
                                    refundOverSize: refundOverSize,
                                    refundAmt: e.expectedRefundAmount,// 售后中金额
                                    refundOverAmt: e.expectedRefundAmount,// 售后完成金额
                                    refundPoints: e.expectedRefundPoints,// 售后中积分
                                    refundOverPoints: e.expectedRefundPoints,// 售后完成积分
                                }
                            })
                        }
                        // onAfterSale：0 未售后 1 售后中 2 售后完成 3 售后驳回
                        console.log('pointsOrderItems', e.pointsOrderItems)
                        return {
                            ...e,
                            statusColor: this.statusColorMap[e.status],
                            shopsName: (e.pointsOrderItems&&e.pointsOrderItems[0]) ? e.pointsOrderItems[0].shopsName : "",
                            pointsOrderItems: pointsOrderItems
                        }
                    })]
                    console.log('this.orderList', this.orderList)
                    this.total = res.total
                    this.lastShopId = res.lastShopId
                    this.lastId = res.lastId

                    if(this.total <= this.orderList.length) {
                        this.loadingStatus = 'nomore'
                        return
                    }
                })
            },
            // 售后订单列表
            getAfterSaleOrder() {
                afterSaleOrder({
                    page: this.page,
                    rows: this.rows,
                    key: this.keyword,
                    type: this.nowTab,
                    dateType: this.trueTimeType,
                    startDate: this.startDate ? this.dateFormat(new Date(this.startDate), 'yyyyMMdd') : '',
                    endDate: this.endDate ? this.dateFormat(new Date(this.endDate), 'yyyyMMdd') : '',
                    mallScene: 'POINTS_MALL',
                }).then(res=>{
                    this.orderList = [...this.orderList, ...res.list.map(e=>{
                        let afterSaleResqBos = e.afterSaleResqBos
                        if(e.isVirtualProduct == '1') {
                            afterSaleResqBos = [
                                {
                                    ...e.afterSaleResqBos[0],
                                    applyNum: e.afterSaleResqBos.map(e => e.applyNum).reduce((sum, current) => plus(sum, current), 0),
                                }
                            ]
                        }

                        return {
                            ...e,
                            afterSaleResqBos: afterSaleResqBos
                        }
                    })]
                    this.total = res.total
                    if(this.total <= this.orderList.length) {
                        this.loadingStatus = 'nomore'
                        return
                    }
                })
            },
            //页签切换
            doTab(e) {
                console.log(e)
                this.nowTab = e.key
                this.clearStatus()
                // 售后列表
                if(this.nowTab == 'refund') {
                    this.getAfterSaleOrder()
                    return
                }
                // 订单列表
                this.getOrderList()
            },
            // tab 切换
            radioChange(e) {
                console.log(e)
                this.cancelKey = e
            },
            // 取消
            doCancel() {
                if(!this.bridgeSdk.checkIsEmpty(this.cancelKey)) {
                    uni.showToast({
                        title: '请选择取消原因',
                        icon: 'none',
                    })
                    return
                }
                if(!this.bridgeSdk.checkIsEmpty(this.cancelReason) && this.cancelKey == '99') {
                    uni.showToast({
                        title: '请输入取消原因',
                        icon: 'none',
                    })
                    return
                }
                let remark = this.cancelKey != '99' ? this.cancelReasonList.find(e => e.key == this.cancelKey).text : this.cancelReason
                pointsCancel({
                    pointsOrderId: this.cancelOrderId,
                    remark: remark
                }).then(res=>{
                    this.bridgeSdk.showToast({
                        title: '订单取消成功'
                    })
                    this.cancelShow = false
                    this.clearStatus()
                    // 售后列表
                    if(this.nowTab == 'refund') {
                        this.getAfterSaleOrder()
                        return
                    }
                    // 订单列表
                    this.getOrderList()
                })
            },
            // 搜索
            doSearch() {
                this.clearStatus()
                // 售后列表
                if(this.nowTab == 'refund') {
                    this.getAfterSaleOrder()
                    return
                }
                // 订单列表
                this.getOrderList()
            },
            // 主动获取订单列表
            _getList() {
                this.clearStatus()
                this.key = ''
                // 售后列表
                if(this.nowTab == 'refund') {
                    this.getAfterSaleOrder()
                    return
                }
                // 订单列表
                this.getOrderList()
            },
            // 筛选
            showFilter() {
                this.filterShow = true
                this.nowTimeType = this.trueTimeType
            },
            // 自定义时间
            getTimePicker(e) {
                this.timeType = e
                this.timePicker = true
            },
            // 选择日期
            confirmDate(e) {
                let value = new Date(this.dateFormat(new Date(e.value), 'yyyy-MM-dd')).getTime()
                if(this.startDate && this.timeType == 'endDate' && value < new Date(this.startDate).getTime()) {
                    this.bridgeSdk.showToast({
                        title: "结束日期不得小于开始日期",
                        duration: 1000,
                    });
                    return
                }
                if(this.endDate && this.timeType == 'startDate' && value > new Date(this.endDate).getTime()) {
                    this.bridgeSdk.showToast({
                        title: "开始日期不得大于结束日期",
                        duration: 1000,
                    });
                    return
                }
                if(this.endDate && this.timeType == 'startDate' && new Date(this.endDate).getTime() - value > 3 * 30 * 24 * 60 * 60 * 1000) {
                    this.bridgeSdk.showToast({
                        title: "起止周期不可大于3个月",
                        duration: 1000,
                    });
                    return
                }
                if(this.startDate && this.timeType == 'endDate' && value - new Date(this.startDate).getTime() > 3 * 30 * 24 * 60 * 60 * 1000) {
                    this.bridgeSdk.showToast({
                        title: "起止周期不可大于3个月",
                        duration: 1000,
                    });
                    return
                }
                if(this.timeType == 'startDate') {
                    this.startDate = this.dateFormat(new Date(value), 'yyyy-MM-dd')
                }
                else {
                    this.endDate = this.dateFormat(new Date(value), 'yyyy-MM-dd')
                }
                this.timePicker = false
            },
            // 重置
            doReset() {
                this.startDate = ''
                this.endDate = ''
                this.nowTimeType = 'year'
                this.trueTimeType = 'year'
            },
            // 筛选确认
            doFilter() {
                if(this.nowTimeType == 'diy' && (!this.bridgeSdk.checkIsEmpty(this.startDate) || !this.bridgeSdk.checkIsEmpty(this.endDate))){
                    this.bridgeSdk.showToast({
                        title: "请选择起止区间",
                        duration: 1000,
                    });
                    return
                }
                if(this.nowTimeType != 'diy') {
                    this.startDate = ''
                    this.endDate = ''
                }
                this.clearStatus()
                this.trueTimeType = this.nowTimeType
                // 售后列表
                if(this.nowTab == 'refund') {
                    this.getAfterSaleOrder()
                    this.filterShow = false
                    return
                }
                // 订单列表
                this.getOrderList()
                this.filterShow = false
            },
            // 日期格式化
            dateFormat(date,dformat) {
                let format
                if(dformat != undefined && dformat != null) {
                    format = dformat
                }else {
                    format = 'yyyy-MM-dd hh:mm:ss'
                }
                if (date !== 'Invalid Date') {
                    var o = {
                    'M+': date.getMonth() + 1, // month
                    'd+': date.getDate(), // day
                    'h+': date.getHours(), // hour
                    'm+': date.getMinutes(), // minute
                    's+': date.getSeconds(), // second
                    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
                    'S': date.getMilliseconds() // millisecond
                    }
                    if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1,
                        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
                    }
                    for (var k in o) {
                    if (new RegExp('(' + k + ')').test(format)) {
                        format = format.replace(RegExp.$1,
                        RegExp.$1.length === 1 ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length))
                    }
                    }
                    return format
                }
                return ''
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.page-content) {
    background-color: #f5f6f8;
    overflow-y: inherit !important;
}
:deep(.u-sticky) {
    padding: 20rpx 0 28rpx;
    background-color: #fff;
}
:deep(.u-textarea) {
    background-color: #f8f8f8;
    padding-bottom: 40rpx;
}
:deep(.u-textarea__count) {
    background-color: #f8f8f8 !important;
}
:deep(.u-tabs__wrapper__nav__item) {
    flex: none !important;
    height: 44px;
}
:deep(.u-tabs__wrapper__nav) {
    padding: 0 10rpx;
}
.search {
    display: flex;
    padding: 20rpx 30rpx;
    align-items: center;
    gap: 49rpx;
    background-color: white;
    &-right {
        image {
            width: 30rpx;
            height: 25rpx;
            margin-bottom: 8rpx;
            margin-top: 20rpx;
        }
        font-size: 24rpx;
        color: #333333;
        text-align: center;
    }
}
.list {
    padding-top: 35rpx;
    padding-bottom: 20rpx;
}
.filter {
    background-color: white;
    border-radius: 0  0 20rpx 20rpx;
    padding: 20rpx 40rpx;
    &-title {
        font-size: 30rpx;
        color: #333333;
        font-weight: bold;
        margin-bottom: 20rpx;
    }
    &-times {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 20rpx;
        margin-bottom: 20rpx;
        .item {
            padding: 10rpx 20rpx;
            font-size: 24rpx;
            color: gray;
            background: white;
            border: 1rpx solid #d0d0d0;
            border-radius: 8rpx;
        }
        .active {
            color: #00BCB8;
            background: rgba(0,188,184, .4);
            border: none;
        }
    }
    &-timepicker {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
            border: 1rpx solid #d0d0d0;
            text-align: left;
            padding: 15rpx 30rpx;
            border-radius: 8rpx;
            color: #d0d0d0;
            width: 220rpx;
            font-size: 24rpx;
        }
    }
    &-btns {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 50rpx;
        .btn {
            color: white;
            background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
            border-radius: 42rpx;
            line-height: 84rpx;
            width: 300rpx;
            text-align: center;
        }
        .btn-normal {
            background: white;
            color: #333333;
            border: 1rpx solid gray;
            border-radius: 42rpx;
            line-height: 84rpx;
            width: 300rpx;
            text-align: center;
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
        &_textarea {
            height: 180rpx;
            width: calc(100% - 60rpx);
            // background-color: #f8f8f8;
            border-radius: 10rpx;
            padding: 10rpx 20rpx;
            margin: 20rpx auto;
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