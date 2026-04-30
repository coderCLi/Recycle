<!--
 * @Description: 
 * @Autor: TF
 * @Date: 2025-07-29 14:28:18
 * @LastEditors: TF
 * @LastEditTime: 2025-08-03 18:03:29
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container">
        <view class="pop-address">
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

                    <up-icon style="float: right;" v-if="item.id == addressInfo.id || (item.address === addressInfo.address && item.mobile === addressInfo.mobile && item.name === addressInfo.name && item.area === addressInfo.area)" name="checkbox-mark" size="20" color="#00BCB8"></up-icon>
                </view>
                <!-- <view @click="doSubmit" class="button">确认</view> -->
                <view @click="addAddress" class="button">新增收货地址</view>
            </template>
            <template v-else>
                <vc-empty  :props-data="emptyProps"></vc-empty>
                <view @click="addAddress" class="button">新增收货地址</view>
            </template>
        </view>
    </vc-container>
</template>

<script>
    import {
        getDeliveryAddressPage,// 获取收货地址列表
        modifyIntegralMallOrder,// 修改地址
    } from '../api/index'
    export default {
        name: 'addressList',
        data() {
            return {
                addressInfo: {},// 地址信息
                addressList: [],// 地址列表
                emptyProps: {
                    props: {
                        marginTop: {
                            value: '50'
                        }
                    }
                },//vc-empty的props
            }
        },
        onLoad(options) {
            this.pointsOrderId = options.pointsOrderId
            this.addressInfo = {
                address: options.address,
                mobile: options.mobile,
                name: options.consignee,
                area: options.district
            }
        },
        onShow() {
            this.getAddressList()
        },
        methods: {
            // 获取地址列表
            getAddressList() {
                getDeliveryAddressPage({
                    page: 1,
                    rows: 20
                }).then(res=>{
                    console.log(res)
                    this.addressList = [...res.list]
                })
            },
            // 新增地址
            addAddress() {
                this.bridgeSdk.jumpPage({
                    url: `/package-address/pages/addAddress`
                })
            },
            // 选择地址
            setAddress(e) {
                this.addressInfo = {...e}
                modifyIntegralMallOrder({
                    pointsOrderId: this.pointsOrderId,
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
                }).then(res=>{
                    this.bridgeSdk.showToast({
                        title: '修改成功'
                    })
                    uni.$emit('getOrderList')
                    this.bridgeSdk.navigateBackTo({
                        delta: 1
                    })
                })
            },
            // 确认
            doSubmit() {
                if(!this.bridgeSdk.checkIsEmpty(this.addressInfo)) {
                    this.bridgeSdk.showToast({
                        title: "请选择收货地址"
                    })
                    return;
                }
                modifyIntegralMallOrder({
                    pointsOrderId: this.pointsOrderId,
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
                }).then(res=>{
                    this.bridgeSdk.showToast({
                        title: '修改成功'
                    })
                    uni.$emit('getOrderList')
                    this.bridgeSdk.navigateBackTo({
                        delta: 1
                    })
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
.pop-address{
    &_item{
        line-height: 50rpx;
        padding: 20rpx 40rpx;
        border-bottom: 2rpx solid #f8f8f8;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
}
</style>