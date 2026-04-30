<!--
 * @Description: 收货地址列表
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container>
        <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;">
            <view class="top-bg2" style="background-color: #fff;"></view>
        </view>
        <view class="main" style="overflow: hidden;" v-if="addressList.length === 0">
            <vc-empty></vc-empty>
        </view>
        <view class="main" v-else>
            <!-- <vc-status-bar />
        <vc-navbar :props-data="propsData" /> -->
            <view>
                <up-cell-group v-for="(item, index) in addressList" :key="index" class="list" :border="falseValue">
                    <up-cell center @click="toEditor(item.id)">
                        <template #title>
                            <view :style="`width: ${item.isDefault == '1' ? 'calc(96% - 20rpx);' : '96%;'}`">
                                <view style="width: 100%; position: relative;">
                                    <view>&nbsp; </view>
                                    <view :class="[item.isDefault == '1' ? 'default-style' : 'no-default-style']"
                                        style="position: absolute; top: 0px; max-width: 100%;">
                                        <view v-if="item.isDefault == '1'" class="default">默认</view>
                                        <text class="name">{{ item.name }}</text>
                                        <text class="mobile">{{ item.mobile }}</text>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <template #label>
                            <view class="label">
                                <!-- <up-image :src="isDefaultImge" width="40rpx" height="40rpx"
                                    v-if="item.isDefault == '1'"></up-image> -->
                                <text :class="['address', item.isDefault == '1' ? 'address-value' : '']">
                                    {{ item.provinceName + item.cityName + item.areaName + item.address }}
                                </text>
                            </view>
                        </template>
                        <template #icon>
                            <view class="icon">
                                <up-image :src="isDefaultImge" width="40rpx" height="40rpx"
                                    v-if="item.isDefault == '1'"></up-image>
                            </view>
                        </template>
                        <template #value>
                            <view class="u-slot-title">
                                <up-image :src="editorImge" width="28rpx" height="28rpx"></up-image>
                            </view>
                        </template>
                    </up-cell>
                </up-cell-group>
            </view>
            <view style="position: relative; z-index: 0;">
                <u-loadmore :status="status" v-if="addressList.length !== 0"></u-loadmore>
            </view>
            <view style="flex-shrink: 0">
                <view class="btn-bottom"></view>
                <!-- <vc-safe-bottom /> -->
            </view>
        </view>
        <view class="button-bottom"></view>
        <view class="button" @click="toAdd">
            <view class="box">添加新地址</view>
        </view>
    </vc-container>
</template>
<script>
import vcContainer from '@/components/library/base/vc-container/vc-container.vue'
import { getDeliveryAddressPage } from '../api/index'
export default {
    components: { vcContainer },
    name: "addressList",
    data() {
        return {
            propsData: {
                props: {
                    title: {
                        value: '选择收货地址',
                    },
                }
            },
            falseValue: false,
            addressList: [],
            total: null,
            pageCurrent: 1,
            pageSize: 20,
            status: 'loadmore',
            isDefaultImge: this.staticBaseUrl + '/hbdimage/address/default.png',
            editorImge: this.staticBaseUrl + '/hbdimage/address/editor.png'
        }
    },
    onShow(options) {
        this.getList(1)
    },
    // mounted() {
    //     this.getList()
    // },
    onReachBottom() {
        console.log("触底");
        let allTotal = this.pageCurrent * this.pageSize
        if (allTotal < this.total) {
            this.status = 'loading';
            this.getList(this.pageCurrent + 1)
        } else {
            // console.log('已加载全部数据')
            this.status = 'nomore';
        }
    },
    onPullDownRefresh() {
        this.pageCurrent = 1
        //调用获取数据方法
        this.getList(1);
        setTimeout(() => {
            //结束下拉刷新
            uni.stopPullDownRefresh();
        }, 1000);
    },
    computed: {

    },
    methods: {
        ReturnToUpperLevel(item) {
            console.log(item, 'trigger back');
            this.bridgeSdk.navigateBackTo({
                delta: 1
            });
            uni.$emit('updateData', { ...item })

        },
        getList(currentPage) {
            getDeliveryAddressPage({
                page: currentPage,
                rows: this.pageSize
            }).then(res => {
                this.pageCurrent = currentPage;
                if (this.pageCurrent === 1) {
                    this.addressList = res.list;
                } else {
                    this.addressList = [...this.addressList, ...res.list]
                }
                this.total = res.total;
                let allTotal = this.pageCurrent * this.pageSize
                if (allTotal < this.total) {
                    this.status = 'loadmore';
                } else {
                    this.status = 'nomore';
                }
            })
        },
        toEditor(id) {
            this.bridgeSdk.jumpPage({
                url: `/package-address/pages/editorAddress?id=${id}`,
                title: '编辑收货地址'
            })
        },
        toAdd() {
            this.bridgeSdk.jumpPage({
                url: `/package-address/pages/addAddress`,
                title: '添加收货地址'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    background-color: #fff;
    // height: 100vh;
}

.list {
    width: 670rpx;
    margin: 0 40rpx;
}

.default-style {
    margin-bottom: 8rpx;
    margin-left: 20rpx;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
}

.no-default-style {
    margin-bottom: 8rpx;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
}

.default {
    width: 68rpx;
    height: 32rpx;
    background: #00BCB8;
    border-radius: 4rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 20rpx;
    color: #FFFFFF;
    line-height: 32rpx;
    text-align: center;
    font-style: normal;
    margin-right: 12rpx;
    flex-shrink: 0;
}

.name {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #222222;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-right: 24rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #222222;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
}

.label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.address {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 28rpx;
    color: #777777;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-right: 38rpx;
}

.address-value {
    margin-left: 20rpx;
}

.button-bottom,
.btn-bottom {
    height: 200rpx;
    background-color: #fff;
}

.button-bottom {
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100%;
}

.button {
    margin: auto;
    position: fixed;
    left: 4%;
    bottom: 96rpx;
    width: 92%;
    height: 84rpx;
    background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
    border-radius: 42rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 32rpx;
    color: #FFFFFF;
    // line-height: 84rpx;
    text-align: center;
    font-style: normal;
    display: flex;
    justify-content: center;
    align-items: center;

    // .box {
    //     width: 100%;
    //     height: 84rpx;
    //     text-align: center;
    // }

}
</style>