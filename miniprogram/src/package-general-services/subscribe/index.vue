<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main">
        <!-- sub-title -->
        <view class="sub-title">
            <view>已订阅频道</view>
            <text v-if="subscribeList.length > 0">点击进入频道</text>
            <view @click="addSub" v-if="subscribeList.length > 0">
                <u-icon v-if="!isEdit" :name="staticBaseUrl + '/hbdimage/baseImage/icon_bianji.png'" size="12" color="#00BCB8"></u-icon>
                <text>{{ isEdit ? '完成' : '管理' }}</text>
            </view>
        </view>
        <!-- 订阅频道列表 -->
        <view v-if="subscribeList.length > 0" class="sub-list">
            <view class="sub-item" v-for="(item, index) in subscribeList" @click="toPage(item)" :key="index">
                {{ item.serviceName }}
                <view v-if="isEdit && item.isDefault != '1'" @click="minusSub(item)" class="minus">
                    <u-icon name="minus-circle-fill" size="18" color="#999999"></u-icon>
                </view>
            </view>
        </view>
        <vc-empty :props-data="propsDataEmpty" v-if="subscribeList.length === 0"></vc-empty>
        <!-- <text v-if="subscribeList.length == 0"
            style="line-height:60rpx; margin-bottom:50rpx; font-weight: 400;font-size: 24rpx;color: #AAAAAA;line-height: 34rpx;display: flex;justify-content: center;">可以从下方频道订阅你喜欢的资讯</text> -->
        <!-- 推荐订阅功能预留 详情见设计图-->
        <!-- <view  class="sub-title">
            <view>频道推荐</view>
            <text>点击添加频道</text>
        </view>
        <view class="recommend-list">
            <view class="recommend-item" v-for="(item, index) in subscribeList" :key="index">
                <u-icon name="plus" size="12" color="#666"></u-icon><text>{{ item.text }}</text>
            </view>
        </view> -->
        <vc-safe-bottom />
    </vc-container>
</template>
<script>
import { subPage, doDub } from '../api/baseServices';
import { Toast } from '@/utils/http';
export default {
    name: "subscribe",
    data() {
        return {

            propsDataEmpty: {
                props: {
                    text: {
                        value: '暂无订阅'
                    },
                    marginTop: {
                        value: '50'
                    },
                }
            },
            propsData: {
                props: {
                    title: {
                        value: '订阅'
                    },

                }
            },
            isEdit: false,
            subscribeList: [

            ],
            list1: [],//列表
            page: 1,
            rows: 100,
            total: 0,
        }
    },
    async onLoad(options) {
        this.getList();
    },
    methods: {
        //获取订阅列表
        getList() {
            let params = {
                page: this.page,
                rows: this.rows
            }
            subPage(params).then(res => {
                this.total = res.total;
                this.subscribeList = res.list;
            })
        },
        addSub() {
            this.isEdit = !this.isEdit; // 切换编辑状态
        },
        minusSub(e) {
            this.bridgeSdk.showConfirm({
                content: "是否取消订阅？",
                confirmText: "确定",
                cancelText: "取消",
                confirmCallback: (res) => {
                    doDub({
                        serviceId: e.serviceId,
                        subType: '0'
                    }).then(res => {
                        Toast('取消订阅成功');
                        setTimeout(() => {
                            this.getList();
                        }, 1000);
                    })
                },
                cancelCallback: (res) => {
                    console.log("点击取消", res);
                }
            });

        },
        toPage(item) {

            if (this.isEdit) {
                return;
            }
            // console.log(item);
            let path = `${item.url}?serviceId=${item.selfServiceId}&title=${item.serviceName}&subId=${item.serviceId}`;
            this.bridgeSdk.toServicePage(path, item);

            // this.bridgeSdk.jumpPage({
            //     url
            // });
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    background: #fff;
    height: auto;
    min-height: 100vh;

    .sub-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx;

        view:nth-child(1) {
            font-weight: 600;
            font-size: 28rpx;
            color: #222222;
            line-height: 40rpx;
        }

        text {
            margin-left: 10rpx;
            flex: 1;
            font-weight: 400;
            font-size: 24rpx;
            color: #999999;
            line-height: 34rpx;
        }

        view:last-child {
            display: flex;
            align-items: center;

            text {
                font-weight: 400;
                font-size: 28rpx;
                color: #00BCB8;
                line-height: 40rpx;

            }
        }
    }

    .sub-list {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        padding: 0 30rpx;
        margin-bottom: 30rpx;
        align-items: center;
        text-align: center;

        .sub-item {
            position: relative;
            background: #E5F8F8;
            border-radius: 12rpx;
            width: 30%;
            text-align: center;
            padding: 30rpx 0;
            margin-left: 30rpx;
            margin-bottom: 30rpx;
            color: #00BCB8;
            font-size: 24rpx;
        }

        .minus {
            position: absolute;
            right: -18rpx;
            top: -15rpx;
            z-index: 10000;
        }

        .sub-item:nth-child(3n-2) {
            margin-left: 0;
        }
    }


    .recommend-list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 30rpx;
        margin-bottom: 30rpx;
        align-items: center;
        text-align: center;

        .recommend-item {
            display: flex;
            border: 1rpx dotted #C8C8C8;
            border-radius: 12rpx;
            width: calc(30% - 6rpx);
            align-items: center;
            padding: 25rpx 0;
            margin-left: 30rpx;
            margin-bottom: 30rpx;
            justify-content: center;
            font-size: 24rpx;

            text {
                font-weight: 400;
                font-size: 24rpx;
                color: #666666;
            }
        }

        .recommend-item:nth-child(3n-2) {
            margin-left: 0;
        }
    }
}
</style>