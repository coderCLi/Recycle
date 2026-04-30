<!--
 * @Description: 订单详情
 * @Autor: TF
 * @Date: 2025-06-12 19:58:09
 * @LastEditors: chilei gchilei0815@gmail.com
 * @LastEditTime: 2026-04-25 14:20:13
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
            <!-- <up-icon name="kefu-ermai" size="19" color="white" @click="goKefu"></up-icon> -->
        </template>
    </up-navbar>

    <view class="main">
        <view class="topbg" :style="{marginTop: `-${navigationBarInfo.navigationBarHeight + navigationBarInfo.statusBarHeight}px`, height: tallerHeight ? '422rpx' : '356rpx'}">

            <view class="topbg-text" :style="{bottom: tallerHeight ? '164rpx' : '98rpx'}">{{ info.statusName }}</view>
            <!-- 已取消时取消原因 -->
            <view class="topbg-tip text-overflow" v-if="info.status == 'CANCELLED' && bridgeSdk.checkIsEmpty(info.cancelReason)">取消原因：{{ info.cancelReason }}</view>
            <!-- 待付款时倒计时 -->
            <view class="topbg-count" v-if="info.status == 'PENDING_PAYMENT'">
                请在
                <up-count-down
                    :time="countTime"
                    autoStart
                    @change="onChange"
                    @finish="onFinish">
                    <view class="time">
                        <view class="time__custom">
                            <text class="time__custom__item">{{ timeData.minutes >= 10 ? timeData.minutes : '0' + timeData.minutes }}</text>
                        </view>
                        <text class="time__doc">分</text>
                        <view class="time__custom">
                            <text class="time__custom__item">{{ timeData.seconds >= 10 ? timeData.seconds : '0' + timeData.seconds }}</text>
                        </view>
                        <text class="time__doc">秒</text>
                    </view>
                </up-count-down>
                内完成交易，
                过期自动取消
            </view>
            <!-- 待使用 -->
            <view class="topbg-tip" v-if="info.status == 'PENDING_USE'">
                {{ pendingUseText }}
            </view>
            <!-- 待发货 -->
            <view class="topbg-tip" v-if="info.status == 'PENDING_SHIPMENT'">
                商家正在准备发货...
            </view>
            <!-- 部分退货时 -->
            <view class="topbg-tip" v-if="info.status == 'PART_RETURN_PROCESSING'">
                {{ partReturnText }}
            </view>
            <!-- 部分退款中 -->
            <view class="topbg-tip" v-if="info.status == 'PART_REFUND_PROCESSING'">
                退款申请处理中，请耐心等待
            </view>
        </view>
        <!-- 物流信息展示 -->
        <view class="delivery" v-if="info.status == 'PENDING_RECEIPT' || (info.status == 'COMPLETED' && isVirtualProduct != '1')">
            <image v-if="info.status == 'PENDING_RECEIPT'" :src="staticBaseUrl + '/hbdimage/package-intergral-mall/fahuo.png'"/>
            <image v-else-if="(info.status == 'COMPLETED' && isVirtualProduct != '1')" :src="staticBaseUrl + '/hbdimage/package-intergral-mall/qianshou.png'"/>

            <view class="delivery-content">
                <view style="font-weight: bold;" v-if="info.status == 'PENDING_RECEIPT'">商家已发货</view>
                <view style="font-weight: bold;" v-else-if="info.status == 'COMPLETED' && isVirtualProduct != '1'">用户已签收</view>
                <view style="display: flex;align-items: center;font-size: 24rpx;color: #999999;margin-top: 20rpx;">
                    物流单号：{{ info.shippingNo }}
                    <image class="url-img" :src="staticBaseUrl + '/hbdimage/examination/fuzhi1.png'" @click="doCopy(info.shippingNo)"/>
                </view>
            </view>
        </view>
        <!-- 地址信息(实物订单) -->
        <view class="address" 
            :style="{marginTop:info.status == 'PENDING_RECEIPT' || (info.status == 'COMPLETED' && isVirtualProduct != '1') ? '27rpx' : '-68rpx'}" 
            v-if="isVirtualProduct != '1'">
            
            <image :src="staticBaseUrl + '/hbdimage/package-intergral-mall/dingwei.png'" mode="aspectFill"/>
            <view style="flex: 1;width: 50%;">
                <view class="address-top" style="display: flex;font-weight: bold;">
                    <view>{{ info.consignee }}</view>
                    <view style="font-size: 30rpx;margin-left: 10rpx;">{{ ellipsisPhone(info.mobile) }}</view>
                </view>
                <view class="address-btm muti-overflow" style="color: #777777;">
                    {{ info.provinceName }}
                    {{ info.cityName }}
                    {{ info.districtName }}
                    {{ info.address }}
                </view>
            </view>
            <!-- 暂时关闭修改地址操作 -->
            <!-- <view v-if="info.status == 'PENDING_PAYMENT'" style="margin-left: 10rpx;color: #00BCB8;font-size: 28rpx;" @click="chooseAddress">
                修改
            </view> -->
        </view>
        <!-- sku信息 -->
        <view class="info" :style="{marginTop: isVirtualProduct != '1' ? '20rpx' : '-68rpx'}">
            <up-skeleton style="padding-top: 26rpx;padding-bottom: 18rpx;" rowsHeight="24rpx" rows="2" :title="false" avatar avatarSize="108rpx" avatarShape="square" :loading="info.subList == 0">
                <view class="info-title">
                    <!-- <image :src="staticBaseUrl + '/hbdimage/package-product-list/mct-logo.png'"/>
                    <view style="max-width: 60%;" class="text-overflow">
                        {{ info.mallScene }}
                    </view> -->
                </view>
                <view class="info-top" style="display: block;" v-for="(item, index) in info.subList" :key="index">
                    <!-- 商品信息 -->
                    <view style="display: flex;align-items: flex-start;">
                        <image :src="minioBaseUrl + item.listPicUrl" mode="aspectFill"/>
                        <view style="flex: 1;margin-left: 10rpx;">
                            <view class="item_flex" style="font-size: 24rpx;color: #333;line-height: 33rpx;justify-content: flex-start;" @click="goGoodsDetail(item)">
                                <view class="text-overflow" style="max-width: 80%;font-weight: bold;">{{ item.spuName }}</view>
                                <up-icon name="arrow-right" size="10" color="#999"/>
                            </view>
                            
                            <view class="item_flex" v-if="isVirtualProduct != '1'" style="font-size: 20rpx;color: #999999;line-height: 33rpx;margin-top: 4rpx;">
                                <view>{{ item.skuName }}</view>
                            </view>
                            <view class="item_flex" v-if="isVirtualProduct == '1'" style="font-size: 20rpx;color: #999999;line-height: 33rpx;margin-top: 4rpx;">
                                <view>{{ item.useDesc }}</view>
                            </view>

                            <view class="item_flex" style="font-size: 24rpx;color: #333;line-height: 33rpx;margin-top: 12rpx;align-items: flex-end;">
                                <view style="flex: 1;width: 50%;margin-right: 30rpx;">
                                    <view>
                                        共 {{ item.quantity }} 件｜
                                        <!-- {{ ['CANCELLED','PENDING_PAYMENT'].includes(info.status) ? '待付款' : '实付款'}} -->
                                        <!-- <text v-if="item.payAmt > 0">¥ {{ item.payAmt }}</text> -->
                                        <text v-if="plus(info.totalFreight||'0', info.payAmt||'0') > 0">¥ {{ plus(info.totalFreight||'0', info.payAmt||'0') }}</text>
                                        
                                        <text v-else-if="item.subPayAmt > 0">¥ {{ item.subPayAmt }}</text>
                                        <text v-else-if="item.subOrderPonints > 0 && item.subPayAmt > 0" style="margin: 0 10rpx;">+</text>
                                        <text v-else-if="item.subOrderPonints > 0"> {{ item.subOrderPonints }} 会员分</text>
                                    </view>

                                    <view v-if="item.refundOverSize > 0" style="font-size: 22rpx;color: #999;line-height: 28rpx;margin-top: 4rpx;">
                                        <text>{{ item.afterSalesType == 'REFUND' || item.afterSalesType == 'AUTO_REFUND' ? '退款' : '退货' }} {{ item.refundOverSize }} 件</text>
                                        已退款 
                                        <text v-if="Number(item.refundOverAmt) > 0">¥ {{ item.refundOverAmt }}</text>
                                        <text v-if="Number(item.refundOverAmt) > 0 && Number(item.refundOverPoints) > 0">+</text>
                                        <text v-if="Number(item.refundOverPoints) > 0">{{ item.refundOverPoints }} 会员分</text>
                                    </view>
                                </view>
                                <!-- <view style="display: flex;align-items: center;justify-content: flex-end;" @click="doUseDetail" v-if="virtualProductSource == 'cop'">
                                    <view style="margin-right: 5rpx;">使用规则</view>
                                    <up-icon name="arrow-right" color="#333333" size="12"/>
                                </view> -->
                            </view>

                        </view>
                    </view>
                    <!-- 售后信息提示区(存在部分退款或退款情况) -->
                    <view class="info-tip" v-if="item.refundSize > 0 || item.refundOverSize > 0" @click="goAfterDetail(item)">
                        <view class="info-tip--block" :style="{backgroundColor: item.refundSize > 0 ? '#FFE7E7' : '#f0e6cc', color: item.refundSize > 0 ? '#FF1A1A' : '#f7b656'}">
                            
                            <!-- 全部售后中 -->
                            <template v-if="item.refundSize > 0 && item.refundSize == item.quantity">
                                <up-icon name="clock" color="#FF1A1A" size="12"/>
                                <text>{{ item.afterSalesType == 'REFUND' || item.afterSalesType == 'AUTO_REFUND' ? '退款中' : '退货中' }} {{ item.refundSize }} 件</text>
                                预计退款
                                <text v-if="Number(item.refundAmt) > 0">¥ {{ item.refundAmt }}</text>
                                <text v-if="Number(item.refundPoints) > 0 && Number(item.refundAmt) > 0">+</text>
                                <text v-if="Number(item.refundPoints) > 0">{{ item.refundPoints }} 会员分</text>
                            </template>
                            <!-- 部分退款中 -->
                            <template v-else-if="item.refundSize > 0 && item.refundSize < item.quantity">
                                <up-icon name="clock" color="#FF1A1A" size="12"/>
                                <text>{{ item.afterSalesType == 'REFUND' || item.afterSalesType == 'AUTO_REFUND' ? '退款中' : '退货中' }} {{ item.refundSize }} 件</text>
                                预计退款
                                <text v-if="Number(item.refundAmt) > 0">¥ {{ item.refundAmt }}</text>
                                <text v-if="Number(item.refundPoints) > 0 && Number(item.refundAmt) > 0">+</text>
                                <text v-if="Number(item.refundPoints) > 0">{{ item.refundPoints }} 会员分</text>
                            </template>
                            <!-- 部分退款成功 -->
                            <template v-else-if="item.refundOverSize < item.quantity">
                                <up-icon name="checkmark-circle" color="#f7b656" size="12"/>
                                <text>{{ item.afterSalesType == 'REFUND' || item.afterSalesType == 'AUTO_REFUND' ? '退款成功' : '退货成功' }} {{ item.refundOverSize }} 件</text>
                                原路退款
                                <text v-if="Number(item.refundOverAmt) > 0">¥ {{ item.refundOverAmt }}</text>
                                <text v-if="Number(item.refundOverPoints) > 0 && Number(item.refundOverAmt) > 0">+</text>
                                <text v-if="Number(item.refundOverPoints) > 0">{{ item.refundOverPoints }} 会员分</text>
                            </template>
                            <!-- 全部退款完成 -->
                            <template v-else-if="item.refundOverSize == item.quantity">
                                <up-icon name="checkmark-circle" color="#f7b656" size="12"/>
                                <text>{{ item.afterSalesType == 'REFUND' || item.afterSalesType == 'AUTO_REFUND' ? '退款成功' : '退货成功' }} {{ item.refundOverSize }} 件</text>
                                原路退款
                                <text v-if="Number(item.refundOverAmt) > 0">¥ {{ item.refundOverAmt }}</text>
                                <text v-if="Number(item.refundOverPoints) > 0 && Number(item.refundOverAmt) > 0">+</text>
                                <text v-if="Number(item.refundOverPoints) > 0">{{ item.refundOverPoints }} 会员分</text>
                            </template>

                            <up-icon style="position: absolute;right: 20rpx;top: 50%;transform: translateY(-50%);" name="arrow-right" :color="item.refundSize > 0 ? '#FF1A1A' : '#f7b656'" size="12"/>
                        </view>
                    </view>
                </view>
            </up-skeleton>

            <view style="padding-top: 26rpx;border-top: 1rpx solid #D8D8D8;">
                <template v-if="isPop">
                    <view class="info-item">
                        <view>商品原价</view>
                        <view>¥ {{ toFixed(info.allProductPrice || '0', 2) }}</view>
                    </view>
                    <view class="info-item" v-if="orderAmt">
                        <view>兑换价格</view>
                        <view>¥ {{ toFixed(info.orderAmt || '0', 2) }}</view>
                    </view>
                    <template  v-if="Number(minus(info.allProductPrice || '0', info.payAmt || '0')) > 0 && Number(info.totalPoints) == 0">
                        <view class="info-item">
                            <view style="display: flex;align-items: center;" @click="isYhPop = !isYhPop">
                                优惠信息
                                <up-icon style="margin-left: 10rpx;" :name="isYhPop ? 'arrow-up' : 'arrow-down'" size="12"/>
                            </view>
                            <view style="color: #FF5871;">-¥ {{ minus(info.allProductPrice || '0', info.payAmt || '0') }}</view>
                        </view>
                        <view class="info-gray" v-if="isYhPop">
                            <view class="item">
                                <view>平台优惠</view>
                                <view>-¥ {{ minus(info.allProductPrice, info.orderAmt) }}</view>
                            </view>
                            <view class="item" v-if="info.discountRate&&info.discountRate!=100">
                                <view>商户折扣率</view>
                                <view>{{ formatDiscount(info.discountRate) }}</view>
                            </view>
                        </view>
                    </template>
                    <view class="info-item" v-if="Number(info.totalPoints) > 0">
                        <view>积分抵扣</view>
                        <view>{{ info.totalPoints }}会员分抵 ¥{{ minus(info.allProductPrice||'0', info.payAmt||'0') }}</view>
                    </view>
                    <view class="info-item" v-if="isVirtualProduct != '1'">
                        <view>运费</view>
                        <view>¥ {{ toFixed(info.totalFreight || '0', 2) }}</view>
                    </view>
                </template>
                <view class="info-item">
                    <view style="display: flex;align-items: center;" @click="isPop = !isPop">
                        {{ ['CANCELLED','PENDING_PAYMENT'].includes(info.status) ? '需付款' : '实付款'}}
                        <up-icon style="margin-left: 10rpx;" :name="isPop ? 'arrow-up' : 'arrow-down'" size="12"/>
                    </view>
                    <view>
                        <text v-if="Number(plus(info.totalFreight||'0', info.payAmt||'0')) > 0">
                            ¥ {{ plus(info.totalFreight||'0', info.payAmt||'0') }}
                        </text>
                        <text v-if="Number(plus(info.totalFreight||'0', info.payAmt||'0')) > 0 && Number(info.totalPoints) > 0"> + </text>
                        <text v-if="info.totalPoints > 0">{{ info.totalPoints }} 会员分 </text>
                    </view>
                </view>
            </view>
        </view>
        <!-- 券码展示（虚拟商品+cop来源） -->
        <view class="coupon" v-if="isVirtualProduct == '1' && virtualProductSource == 'cop' && !['CANCELLED', 'PENDING_PAYMENT'].includes(info.status)">
            <view class="coupon-title" style="display: flex;align-items: center;justify-content: space-between;" v-if="waitUseCopList.length > 0">
                <view>
                    待使用券码
                    <text style="color: red;">{{ waitUseCopList.length }}</text>
                    张
                </view>
                <view style="display: flex;align-items: center;justify-content: flex-end;font-size: 24rpx;color: #999;font-weight: normal;" @click="doUseDetail" v-if="virtualProductSource == 'cop'">
                    <view style="margin-right: 5rpx;">使用规则</view>
                    <up-icon name="arrow-right" color="#333333" size="12"/>
                </view>
            </view>
            <view class="coupon-title" style="display: flex;align-items: center;justify-content: space-between;" v-else>
                <view>券码信息</view>
                <view style="display: flex;align-items: center;justify-content: flex-end;font-size: 24rpx;color: #999;font-weight: normal;" @click="doUseDetail" v-if="virtualProductSource == 'cop'">
                    <view style="margin-right: 5rpx;">使用规则</view>
                    <up-icon name="arrow-right" color="#333333" size="12"/>
                </view>
            </view>
            <view style="position: relative;display: flex;" v-if="waitUseCopList.length > 0">
                <up-icon v-if="nowCop != 0" @click="changeCop('prev')" name="arrow-left" style="position: absolute;left: 30rpx;top: 50%;transform: translateY(-50%);"/>
                <image v-if="codeUrl"
                    :src="codeUrl"
                    mode="scaleToFill"
                    class="qrCode"
                />
                <u-qrcode v-else @click="refreshCoupon" :size="150" :val="QRcodeContent" class="qrCode"  @result="codeLoadResult"/>
                <up-icon v-if="nowCop != waitUseCopList.length - 1" @click="changeCop('next')" name="arrow-right" style="position: absolute;right: 30rpx;top: 50%;transform: translateY(-50%);"/>
            </view>
            <view class="coupon-info" :style="{borderTop: waitUseCopList.length > 0 ? '1px solid #F5F5F5;' : 'none'}">
                <view  v-for="(item, index) in info.pointsOrderItems" :key="index" class="item">
                    <view style="display: flex;align-items: center;">
                        <up-copy :content="item.virtualProductHoldId">
                            券码：{{ item.virtualProductHoldId }} 
                        </up-copy>
                        <text style="color: #f7b656;margin-left: 10rpx;" @click="doCopy(item.virtualProductHoldId)">复制</text>
                    </view>
                    <!-- 待使用（状态为待使用，并且券状态为未使用） -->
                    <view v-if="['PENDING_USE', 'PENDING_RECEIPT_USE', 'PENDING_SHIPMENT'].includes(item.status) && item.virtualProductIsWhetherUse == '0'">
                        {{ item.statusName }}
                    </view>
                    <!-- 已使用（状态为交易完成或者券状态为已使用） -->
                    <view v-else-if="item.virtualProductIsWhetherUse == '4'||['COMPLETED'].includes(item.status) " class="gray flex" @click="goUseDetail(item)">
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
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payCancelTime)">
                    <view>取消时间</view>
                    <view>{{ info.payCancelTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payEndTime)">
                    <view>付款时间</view>
                    <view>{{ info.payEndTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.productCodeName)">
                    <view>付款方式</view>
                    <view>{{ info.productCodeName }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payDecoderTime)">
                    <view>发货时间</view>
                    <view>{{ info.payDecoderTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.payReceiverTime) && isVirtualProduct != '1'">
                    <view>签收时间</view>
                    <view>{{ info.payReceiverTime }}</view>
                </view>
                <view class="item" v-if="bridgeSdk.checkIsEmpty(info.remark)">
                    <view>备注</view>
                    <view>{{ info.remark }}</view>
                </view>
            </view>
        </view>

        <!-- 底部按钮操作区 -->
        <view class="bottom" v-if="info.status">
            <!-- 左侧扩展按钮（退款、申请售后、删除订单） -->
            <!--  (info.status == 'PENDING_PAYMENT' && info.isVirtualProduct != '1') -->
            <view  v-if="([
                // 'PENDING_RECEIPT_USE',
                // 'PENDING_USE',
                // 'PENDING_SHIPMENT',
                // 'PENDING_RECEIPT',
                'COMPLETED',
                'CANCELLED',
                // 'REFUND_SUCCESS',
                // 'EXPIRED_REFUNDED_SUCCESS',
                // 'RETURN_PENDING_SUCCESS'
            ].includes(info.status)) && !noAfterSale" 
                style="position: absolute;left: 40rpx;top: calc(50% - constant(safe-area-inset-bottom) / 2);top: calc(50% - env(safe-area-inset-bottom) / 2);transform: translateY(-50%);"
                @click.stop="showMenu = !showMenu">
                <up-icon name="more-circle" size="22" color="gray"/>
            </view>
            <view class="menu" v-if="showMenu" style="position: absolute;left: 40rpx;bottom: calc(90rpx + constant(safe-area-inset-bottom));bottom: calc(90rpx + env(safe-area-inset-bottom));">
                <!-- <view v-if="['PENDING_RECEIPT_USE', 'PENDING_USE', 'PENDING_SHIPMENT'].includes(info.status) && !noAfterSale" @click.stop="doRefund">退款</view> -->
                <!-- 实物商品（交易成功、待收货可以售后） -->
                <!-- <view v-if="info.isVirtualProduct != '1' 
                            && ( (info.status == 'PENDING_RECEIPT' && !noAfterSale) || (info.status == 'COMPLETED' && !noAfterSale && !completeOutTime) )" @click.stop="doAfterSale">申请售后</view> -->
                <view v-if="['REFUND_SUCCESS', 'EXPIRED_REFUNDED_SUCCESS', 'RETURN_PENDING_SUCCESS', 'CANCELLED', 'COMPLETED'].includes(info.status)" @click.stop="doDelete">删除订单</view>

                <!-- <view v-if="info.status == 'PENDING_PAYMENT' && info.isVirtualProduct != '1'" @click.stop="chooseAddress">修改地址</view> -->
            </view>
            <!-- 待付款 -->
            <!-- <view class="bottom-content" v-if="info.status == 'PENDING_PAYMENT'">
                <view class="default" @click="cancelOrder">取消订单</view>
                <view class="confirm" @click="doPay">
                    ¥ {{ info.payPrice }}<text style="margin-left: 5rpx;">去支付</text>
                </view>
            </view> -->
            <!-- 待使用 -->
            <!-- <template v-if="['PENDING_USE', 'PENDING_RECEIPT_USE'].includes(info.status)">
                <view class="bottom-content">
                    <view class="confirm" @click="buyAgain">再买一单</view>
                </view>
            </template> -->
            <!-- 待发货 -->
            <!-- <view class="bottom-content" v-if="info.status == 'PENDING_SHIPMENT'">
                <view class="default" @click="buyAgain">再买一单</view>
                <view class="confirm" @click="doHurry">催发货</view>
            </view> -->
            <!-- 待收货 -->
            <!-- <view class="bottom-content" v-if="info.status == 'PENDING_RECEIPT'">
                <view class="default" @click="buyAgain">再买一单</view>
                <view class="confirm" @click="doConfirm">确认收货</view>
            </view> -->
            <!-- 交易完成 -->
            <!-- <view class="bottom-content" v-if="info.status == 'COMPLETED'">
                <view class="confirm" @click="buyAgain">再买一单</view>
            </view> -->
            <!-- 已取消 -->
            <!-- <view class="bottom-content" v-if="info.status == 'CANCELLED'">
                <view class="confirm" @click="buyAgain">再买一单</view>
            </view> -->

            <!-- 售后相关状态 -->
            <!-- <view class="bottom-content" v-if="REFUND_STATUS.includes(info.status)">
                <view class="confirm" @click="buyAgain">再买一单</view>
            </view> -->
        </view>
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
    import { 
        pointsUserOrderDetail,// 订单详情
        keepPayOrder,// 去支付
        pointsCancel,// 取消订单
        removeOrder,// 删除订单
        pointsMallRecipt,// 确认收货
        getDataDicList,// 数据字典
    } from '../api/index'
    import { useBaseStore } from "@/store/index.ts";
    import { toIntelligentService } from '@/utils/static.jump.ts'
    import { plus, toFixed, minus, multiply } from '@/utils/decimal.ts'
    import { ellipsisPhone } from '@/utils/business'
    import dayjs from 'dayjs/esm/index';
    // 售后状态列表
    const REFUND_STATUS = [
        'EXPIRED_REFUNDING_PROCESSING', // 过期退款中
        'REFUND_REVIEWING', // 退款审核中
        'REFUND_PROCESSING', // 退款中
        'PART_REFUND_PROCESSING', // 部分退款中
        'PART_RETURN_PROCESSING',// 部分退货中
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
                REFUND_STATUS,
                ellipsisPhone,// 手机号脱敏
                toIntelligentService, // 客服
                toFixed,
                minus,
                multiply,
                plus,

                isPop: false,// 是否展开
                isYhPop: false,// 是否展开优惠信息
                orderNo: '',// 订单号
                pointsShopOrderId: '',// 分单订单号
                info: {
                    status: '00',
                    pointsOrderItems: [],
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
                cancelReasonList: [],// 取消原因List

                pendingUseText: '',// 待使用文案

                showMenu: false,// menu展示/关闭

                userInfo: {},

                codeUrl: "", // 二维码图片地址
            }
        },
        computed: {
            // 只读状态
            ...mapState(useBaseStore, ['navigationBarInfo']),
            tallerHeight() {
                return this.info.status == 'PENDING_PAYMENT' 
                    || (this.info.status == 'CANCELLED' && this.info.cancelReason) 
                    || this.info.status == 'PENDING_RECEIPT' 
                    || (this.info.status == 'COMPLETED' && this.isVirtualProduct != '1') 
                    || (this.info.status == 'PENDING_USE' && this.info.isVirtualProduct == '1')
                    || this.info.status == 'PART_RETURN_PROCESSING'
                    || this.info.status == 'PART_REFUND_PROCESSING'
                    || this.info.status == 'PENDING_SHIPMENT'
            },
            // 是否所有子订单全部已售后
            noAfterSale() {
                return this.info.subList.every(e => e.refundOverSize == e.quantity) || (this.info.isVirtualProduct != '1' && this.info.subList.every(e => Number(e.afterSalesNum) > 0 && e.onAfterSales != '3'))
            },
            // 是否交易完成超过售后窗口期
            completeOutTime() {
                return (this.info.isVirtualProduct == '1' && this.info.subList[0].isSupportRefund == '0')
                || (this.info.isVirtualProduct != '1' && this.info.subList.every(e => e.isSupportRefund == '0'))
            },
            // 部分退货时，文案
            partReturnText() {
                // 退货审核中
                if (this.info.subList[0].status == 'RETURN_REVIEWING') {
                    return '退货申请处理中，请耐心等待'
                } 
                // 待买家退货
                else if(this.info.subList[0].status == 'RETURN_PENDING_RETURN_SHIPMENT') {
                    return '待买家寄回退货商品'
                }
                // 待商家收货
                else if(this.info.subList[0].status == 'RETURN_PENDING_SELLER_RECEIPT') {
                    return '买家已寄回待商家收货'
                }
                // 商家已收货
                else if(this.info.subList[0].status == 'RETURN_PENDING_CHECKING') {
                    return '商家已收货待退款'
                }
                // 退货退款中
                else if(this.info.subList[0].status == 'RETURN_PENDING_REFUNDING') {
                    return '退款中'
                }
                else {
                    return ''
                }
            },
        },
        onPullDownRefresh() {
            this.getOrderInfo()
            setTimeout(() => {
                //结束下拉刷新
                uni.stopPullDownRefresh();
            }, 500);
        },
       async onLoad(options) {
            
            this.orderNo = options.orderId
            this.pointsShopOrderId = options.pointsShopOrderId
            this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            await this.getOrderInfo()
        },
         onShow() {
            // // 解决安卓机从智能客服回退时出现app头问题
            // this.bridgeSdk.hi.setNavigationBarTitle({
            //     showNavBar: '0'
            // })
            // this.bridgeSdk.hi.setShowStatusBar({
            //     showStatusBar: '0'
            // })
            
            if(!this.bridgeSdk.checkIsEmpty(this.cancelReasonList)){
                // 获取取消订单原因
                this.getCancelReasonList(this.isVirtualProduct == '1' ? 'VIRTUAL_CANCEL_REASON' : 'ENTITY_CANCEL_REASON')
            }
            // 获取用户手机号
            let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            const { userId, mobile } = userInfo;
            this.phone = mobile;
            this.userId = userId;
            // 左侧扩展菜单状态重置
            this.showMenu = false
        },
        methods: {
            // 获取取消原因列表
            getCancelReasonList(code = 'VIRTUAL_CANCEL_REASON') {
                getDataDicList({
                    code: code
                },{mask: false}).then(res=>{
                    this.cancelReasonList = res.map(e => ({
                        key: e.optCode,
                        text: e.optName
                    }))
                })
            },
            // 获取订单详情
            async getOrderInfo() {
                let res = await pointsUserOrderDetail({
                    pointsOrderId: this.orderNo,
                    pointsShopOrderId: this.pointsShopOrderId
                })
                // 订单详情
                this.info = { ...res, subList: res.pointsOrderItems }
                // 是否是虚拟商品
                this.isVirtualProduct = res.isVirtualProduct
                // 虚拟商品来源(cop-卡券)
                this.virtualProductSource = res.virtualProductSource?.toLowerCase()
                let pointsOrderItems;
                // 虚拟商品进行子单信息合并以及卡券相关信息处理
                if(this.isVirtualProduct == '1' ) {
                    let refundSize = this.info.pointsOrderItems.filter( e => e.onAfterSales == '1' ).length// 售后中数量
                    let refundOverSize = this.info.pointsOrderItems.filter( e => e.onAfterSales == '2' ).length// 售后完成数量
                    let refundingObj = this.info.pointsOrderItems.find(e => e.onAfterSales == '1') || {}
                    let refundOverObj = this.info.pointsOrderItems.find(e => e.onAfterSales == '2') || {}
                    pointsOrderItems = [
                        {
                            ...this.info.pointsOrderItems[0],
                            quantity: this.info.pointsOrderItems.map(e => e.quantity).reduce((sum, current) => plus(sum, current), 0),// 子订单数量
                            afterSalesNum: this.info.pointsOrderItems.map(e => e.afterSalesNum || 0).reduce((sum, current) => plus(sum, current), 0),// 子单售后数量
                            subPayAmt: this.info.pointsOrderItems.map(e => e.subPayAmt).reduce((sum, current) => plus(sum, current), 0),// 子订单实付金额   
                            subOrderPonints: this.info.pointsOrderItems.map(e => e.subOrderPonints).reduce((sum, current) => plus(sum, current), 0),// 子订单实付积分
                            // 虚拟订单同时仅可能有一个售后中状态，故优先取售后中的afterSaleId，无售后中则取售后完成的afterSaleId
                            afterSalesId: this.info.pointsOrderItems.find(e => e.onAfterSales == '1' )?.afterSalesId || this.info.pointsOrderItems.find(e => e.onAfterSales == '2' )?.afterSalesId,
                            hasUseNum: this.info.pointsOrderItems.filter(e => e.virtualProductIsWhetherUse == '1').length,
                            afterSalesType: this.info.pointsOrderItems.find(e => this.bridgeSdk.checkIsEmpty(e.afterSalesType))?.afterSalesType || '',

                            refundSize: refundSize,// 售后中数量
                            refundOverSize: refundOverSize,// 售后完成数量
                            refundAmt: multiply(refundSize, refundingObj.expectedRefundAmount || '0'),// 售后中金额
                            refundOverAmt: multiply(refundOverSize, refundOverObj.expectedRefundAmount || '0'),// 售后完成金额
                            refundPoints: multiply(refundSize, refundingObj.expectedRefundPoints || '0'),// 售后中积分
                            refundOverPoints: multiply(refundOverSize, refundOverObj.expectedRefundPoints || '0'),// 售后完成积分
                        }
                    ]
                    // 虚拟商品合并pointsOrderItems
                    this.info.subList = [ ...pointsOrderItems ]

                    if(this.virtualProductSource == 'cop') {
                        // 虚拟商品为卡券时，券码展示（默认第1张券码）
                        const subList = this.info.pointsOrderItems
                        // 状态为待使用并且券状态为未使用
                        this.waitUseCopList = subList.filter(e => ['PENDING_USE', 'PENDING_RECEIPT_USE', 'PENDING_SHIPMENT'].includes(e.status) && e.virtualProductIsWhetherUse != '1')
                        console.warn('待使用券码列表：', this.waitUseCopList)
                        if(this.waitUseCopList.length > 0) {
                            this.nowCop = 0
                            this.$nextTick(_=>{
                                this.QRcodeContent = this.waitUseCopList[this.nowCop].virtualProductId + "," + this.waitUseCopList[this.nowCop].virtualProductHoldId + "," +  this.userId + ',' + Date.now();
                            })
                        }
                        // 使用规则
                        let attr = JSON.parse(res.pointsOrderItems[0].attributes)
                        if(!attr) return
                        this.couponInfo = attr
                    }
                } 
                // 实物商品子单信息处理
                else {
                    pointsOrderItems = this.info.pointsOrderItems.map(e => {
                        let refundSize = e.onAfterSales == '1' ? e.afterSalesNum || 0 : 0// 售后中数量
                        let refundOverSize = e.onAfterSales == '2' ? e.afterSalesNum || 0 : 0// 售后完成数量
                        //售后中金额、售后完成金额取值相同原因：目前的流程设置为实物商品仅可售后一次，故实物订单的售后状态不会同时出现两种，取值为统一即可（后续流程调整再改动）
                        return {
                            ...e,
                            refundSize: refundSize,// 售后中子单数量
                            refundOverSize: refundOverSize,// 售后完成子单数量
                            refundAmt: e.expectedRefundAmount,// 售后中金额
                            refundOverAmt: e.expectedRefundAmount,// 售后完成金额
                            refundPoints: e.expectedRefundPoints,// 售后中积分
                            refundOverPoints: e.expectedRefundPoints,// 售后完成积分
                        }
                    })
                    // 虚拟商品合并pointsOrderItems
                    this.info.subList = [ ...pointsOrderItems ]
                }


                // 支付金额
                this.info.payPrice =  this.info.pointsOrderItems.map(e => plus(e.subPayAmt, e.freight)).reduce((sum, current) => plus(sum, current), 0)
                // 商品总原价
                this.info.allProductPrice =  this.info.pointsOrderItems.map(e => multiply(e.oriPrice||'0', e.quantity||'0')).reduce((sum, current) => plus(sum, current), 0)
                // 待付款倒计时
                if(this.info.status == 'PENDING_PAYMENT') this.countTime = new Date(res.payActiveTime.replace(/-/g,'/')).getTime() - Date.now()
                 // 虚拟商品待使用展示过期时间
                if(this.info.status == 'PENDING_USE' && this.info.isVirtualProduct == '1') {
                    let attr = this.bridgeSdk.checkIsEmpty(this.info.subList[0].attributes) ? JSON.parse(this.info.subList[0].attributes) : {}
                    if(attr.useTimeMode == '1') {
                        this.pendingUseText = `请在${dayjs(this.info.payDateTime).add(Number(attr.useTimeout), 'day').format('YYYY-MM-DD 23:59:59')}前使用`
                    } else {
                        this.pendingUseText = `请在${attr.useEndTime}前使用`
                    }
                }
            },
            // 倒计时
            onChange(e) {
                this.timeData = e
            },
            //倒计时结束
            onFinish() {},
            
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
            },
            // 返回
            navBack() {
                this.bridgeSdk.navigateBackTo({ delta: 1 });
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
                this.codeUrl = ""
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
                    pointsOrderId: this.orderNo
                }).then(res=>{
                    console.log(res)
                    if(res) {
                        if(!res.payUrl) {
                            this.bridgeSdk.showToast({
                                title: '该订单已自动过期，请重新下单'
                            })
                            return
                        }
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
                    } else {
                        this.bridgeSdk.showToast({
                            title: '该订单已自动过期，请重新下单'
                        })
                    }
                })
            },
            // 使用规则
            doUseDetail() {
                this.useShow = true
            },
            // 催发货
            doHurry() {
                this.bridgeSdk.showToast({
                    title: '商家已收到您的催发货申请，将加快处理'
                });
            },
            // 退款(待使用、待发货时)
            doRefund() {
                // 若存在退款中的订单
                if(this.info.subList.some(e => e.refundSize > 0)) {  
                    this.bridgeSdk.showToast({
                        title: "您有一笔退款正在处理中，请完成后重新操作"
                    })
                    return
                }
                // 实物商品情况，所有子单都已经进行过售后
                if(this.isVirtualProduct != '1' && this.info.subList.every(e => e.refundOverSize > 0)) {  
                    this.bridgeSdk.showToast({
                        title: "该订单商品已进行过售后，若仍要售后请联系客服"
                    })
                    return
                }
                // 虚拟商品订单退款，如果不支持退款提示
                if(this.isVirtualProduct == '1' && this.info.subList[0].isSupportRefund == '0') {
                    this.bridgeSdk.showToast({
                        title: this.info.subList[0].isSupportRefundDesc
                    })
                    return
                }
                // 实物商品多子单，如果不支持退款提示
                if(this.isVirtualProduct != '1' && this.info.subList.every(e => e.isSupportRefund == '0')) {
                    this.bridgeSdk.showToast({
                        title: this.info.subList[0].isSupportRefundDesc
                    })
                    return
                }
                let doType;
                 // 虚拟商品待发货/待使用（虚拟商品退款）
                if((this.info.status == 'PENDING_RECEIPT_USE' || this.info.status == 'PENDING_USE' || this.info.status == 'PENDING_SHIPMENT') && this.isVirtualProduct == '1') {
                    doType = 'VIRTUAL_REFUND_REASON'
                }
                // 实体商品待发货（实体商品退款）
                else if(this.info.status == 'PENDING_SHIPMENT' && this.isVirtualProduct != '1') {
                    doType = 'ENTITY_REFUND_REASON'
                }

                // 虚拟商品直接跳转售后页面
                if(this.isVirtualProduct == '1') {
                    this.bridgeSdk.jumpPage({
                        url: `/package-intergral-mall/order/orderRefund?orderId=${ this.orderNo }&pointsShopOrderId=${this.info.pointsShopOrderId ? this.info.pointsShopOrderId : ''}&doType=${doType}`,
                        openType: 'redirectTo'
                    })
                } 
                // 实物商品跳转选择商品页面
                else {
                    this.bridgeSdk.jumpPage({
                        url: `/package-intergral-mall/order/refundCheck?orderId=${ this.orderNo }&pointsShopOrderId=${this.info.pointsShopOrderId ? this.info.pointsShopOrderId : ''}&doType=${doType}&isAfterSale=0`,
                        openType: 'redirectTo'
                    })
                }
            },
            // 跳转售后详情
            goAfterDetail(item) {
                this.bridgeSdk.jumpPage({
                    url: '/package-intergral-mall/order/afterSaleDetail?afterSalesId=' + item.afterSalesId
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
                        removeOrder({
                            pointsOrderId: this.orderNo,
                            pointsShopOrderId: this.info.pointsShopOrderId || '',
                            afterSaleId: this.info.afterSaleId || ''
                        }).then(res=>{
                            this.bridgeSdk.showToast({title: '删除成功'})
                            this.bridgeSdk.navigateBackTo({
                                delta: 1,
                                success: page => {
                                    page && page._getList && page._getList()
                                }
                            })
                        })
                    },
                });
            },
            // 申请售后
            doAfterSale() {
                // 实物商品多子单，如果不支持退款提示
                if(this.isVirtualProduct != '1' && this.info.subList.every(e => e.isSupportRefund == '0')) {
                    this.bridgeSdk.showToast({
                        title: "该订单商品不允许退款或超过退款时间"
                    })
                    return
                }
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/refundCheck?orderId=${ this.orderNo }&pointsShopOrderId=${this.info.pointsShopOrderId ? this.info.pointsShopOrderId : ''}&isAfterSale=1`
                })
            },
            // 确认收货
            doConfirm() {
                this.bridgeSdk.showConfirm({
                    title: '请确认已收到货物',
                    content: '确认收货后，平台仍保障您的权益',
                    confirmText: '取消',
                    confirmText: '确认收货',
                    confirmCallback: (res) => {
                        pointsMallRecipt({
                            orderId: this.info.pointsShopOrderId,
                            mallScene: 'POINTS_MALL',
                            itemIds: this.info.pointsOrderItems.map(e => e.pointsSubItemId)
                        }).then(res => {
                            uni.$emit('getOrderList')
                            this.bridgeSdk.showToast({
                                title: '确认收货成功'
                            })
                            this.getOrderInfo()
                        })
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
                if(!this.bridgeSdk.checkIsEmpty(this.cancelReason) && this.cancelKey == '99') {
                    uni.showToast({
                        title: '请输入取消原因',
                        icon: 'none',
                    })
                    return
                }
                let remark = this.cancelKey != '99' ? this.cancelReasonList.find(e => e.key == this.cancelKey).text : this.cancelReason
                pointsCancel({
                    pointsOrderId: this.orderNo,
                    remark: remark
                }).then(res => {
                    this.bridgeSdk.showToast({
                        title: '订单取消成功'
                    })
                    this.cancelShow = false
                    uni.$emit('getOrderList')
                    this.getOrderInfo()
                })
            },
            // 商品详情
            goGoodsDetail() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/productDetail/productDetail?spuId=${this.info.pointsOrderItems[0].spuId}`
                })
            },
            // 再买一单
            buyAgain() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/productDetail/productDetail?spuId=${this.info.pointsOrderItems[0].spuId}&skuId=${this.info.pointsOrderItems[0].skuId}&rebuy=1`
                })
            },
            // 查看使用记录
            goUseDetail(e) {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/copUseFlow?couponBaseId=${e.virtualProductId}`
                })
            },
            // 查看退款详情
            goRefundDetail(e) {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/afterSaleDetail?afterSalesId=${e.afterSalesId}`
                })
            },
            // 选择地址
            chooseAddress() {
                this.bridgeSdk.jumpPage({
                    url: `/package-intergral-mall/order/addressList?pointsOrderId=${this.orderNo}&address=${this.info.address}&mobile=${this.info.mobile}&consignee=${this.info.consignee}&district=${this.info.district}`
                })
            },
            // 跳转智能客服
            goKefu() {
                this.bridgeSdk.jumpPage({
                    // url: `/package-intel-service/intel-service/index?businessId=${this.info.mctId}&nickName=${this.userInfo.nickName}&shopUserId=${this.userInfo.userId}&isMine=false`,
                    url: `/package-intel-service/intel-service/index?businessId=444440000PM&nickName=${this.userInfo.isRealname == '1' ? this.userInfo.userName : this.userInfo.nickName}&shopUserId=${this.userInfo.userId}&isMine=false`
                })
            },
            codeLoadResult(e) {
                console.log("codeLoadResult", e)
                this.codeUrl = e;
            },
        }
    }
</script>

<style lang="scss" scoped>
:deep(.u-navbar__content) {
    z-index: 1;
}
:deep(.u-textarea) {
    background-color: #f8f8f8;
    padding-bottom: 40rpx;
}
:deep(.u-textarea__count) {
    background-color: #f8f8f8 !important;
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
    background: linear-gradient( 132deg, #e2ab59 0%, #f0e6cc 100%), #f7b656;
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
        width: 85%;
    }
}
.delivery {
    width: calc(670rpx - 40rpx);
    margin: -124rpx auto 0;
    padding: 30rpx 20rpx;
    background: #fff;
    border-radius: 20rpx;
    z-index: 3;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    image {
        width: 120rpx;
        height: 108rpx;
        margin-right: 31rpx;
    }
    &-content {
        flex: 1;
        width: 40%;
        font-size: 28rpx;
        color: #222222;
        margin-bottom: 20rpx;
        .url-img {
            width: 22rpx;
            height: 24rpx;
            margin-left: 5rpx;
            border-radius: 0;
        }
    }
}
.address {
    width: calc(670rpx - 60rpx);
    padding: 30rpx 30rpx;
    margin: -68rpx auto 0;
    border-radius: 20rpx;
    background-color: white;
    font-size: 28rpx;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 3;
    position: relative;
    box-shadow: 0rpx 8rpx 16rpx 4rpx rgba(133,133,133,0.09);
    image {
        width: 48rpx;
        height: 48rpx;
        margin-right: 17rpx;
    }
    &-top {
        font-size: 28rpx;
        color: #222222;
    }
    &-btm {
        font-size: 25rpx;
        color: #777777;
        margin-top: 11rpx;
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
    &-title {
        flex: 1;
        width: 60%;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #222;
        image {
            width: 50rpx;
            height: 50rpx;
            margin-right: 13rpx;
        }
    }
    &-top {
        display: flex;
        align-items: flex-start;
        padding-bottom: 0rpx;
        padding-top: 26rpx;
        width: 100%;
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
    &-tip {
        margin-top: 25rpx;
        &--block {
            color: #FF1A1A;
            font-size: 24rpx;
            line-height: 33rpx;
            border-radius: 8rpx;
            font-weight: bold;
            padding: 10rpx 30rpx 10rpx 20rpx;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10rpx;
            flex-wrap: wrap;
        }
    }
    &-bottom {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #333333;
        font-size: 24rpx;
        padding-top: 13rpx;
        border-top: 1rpx solid #D8D8D8;
    }
    &-item {
        width: 100%;
        font-size: 24rpx;
        color: #222222;
        line-height: 33rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 31rpx;
        &:last-of-type {
            margin-bottom: 0;
            padding-bottom: 23rpx;
        }
        view:first-of-type {
            font-weight: bold;
            font-size: 26rpx;
        }
        view:last-of-type {
            color: #999999;
            font-size: 26rpx;
        }
    }

    &-gray {
        background-color: #F5F5F5;
        border-radius: 12rpx;
        padding: 23rpx;
        width: calc(100% - 46rpx);
        margin: -17rpx auto 22rpx;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #999999;
            font-size: 24rpx;
            width: 100%;
        }
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
            align-items: flex-start;
            justify-content: space-between;
            font-size: 22rpx;
            line-height: 45rpx;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    &-title {
        width: 450rpx;
        text-align: center;
        margin-bottom: 20rpx;
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