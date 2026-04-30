<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main">
        <image :src="minioBaseUrl + cardList.photoUrl" mode="scaleToFill" />
        <!-- 商家详细信息卡片 -->
        <view class="bottom-block" style=" background-color: white;">
            <view class="flex main-block flex_col">
                <view>
                    <text class="fs32">{{ cardList.fromSourceName }}</text>
                </view>
                <!-- <view>
                    <text>{{ cardList.address }}</text>
                </view> -->
                <view>
                    <image :src="staticBaseUrl + '/hbdimage/baseImage/icon-dun.png'" mode="scaleToFill" />
                    <text>{{ refundDescription(cardList.refundType) }}</text>
                    <!-- <text>先囤后用</text>
                    <text>随时退</text>
                    <text>过期自动退</text>  -->

                </view>
            </view>
            <view class="flex number-block flex_sb flex_ac">
                <view>每人限购{{ cardList.getMaxNum }}份</view>
                <view class="flex flex_ac">
                    <up-number-box v-model="value" :max="cardList.getMaxNum">
                        <template #minus>
                            <view class="minus">
                                <up-icon name="minus" size="12"></up-icon>
                            </view>
                        </template>
                        <template #input>
                            <text style="width: 50px;text-align: center;" class="input">{{ value }}</text>
                        </template>
                        <template #plus>
                            <view class="plus">
                                <up-icon name="plus" color="#FFFFFF" size="12"></up-icon>
                            </view>
                        </template>
                    </up-number-box>
                </view>
            </view>
        </view>
        <div v-if="mctTotal>0" style="height: 10rpx; background: #F0F0F4;"></div>
        <view v-if="mctTotal>0" class="box-block">
            <view class="flex flex_sb">
                <view class="box-block-title">
                    券适用门店
                </view>
                <view class="box-block-right flex flex_ac ">
                    <text>全城{{ mctTotal }}家门店通用</text>
                    <u-icon name="arrow-right" color="#ACACAC" size="14"></u-icon>
                </view>
            </view>
            <view class="scroll-item">
                <view class="flex flex_ac">
                    <image :src=" minioBaseUrl+ mctInfoList.mctLogoUrl " mode="scaleToFill" />
                </view>
                <view style="width:60%; flex: 1; margin-left: 24rpx;" class="flex flex_col flex-sb">
                    <view class="flex">
                        <view
                            style="line-height:66rpx; font-size: 29rpx;font-weight: bold;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:80%">
                            {{ mctInfoList.name }}</view>
                    </view>
                    <view>
                        <view class="ellipsis" style="font-size: 24rpx;color: #999;line-height:40rpx;">地址：{{
                            mctInfoList.address }}
                        </view>
                        <view class="flex flex_ac card"
                            style="font-size: 24rpx;height:auto; flex-wrap: wrap;color:#E08B3B;">
                            <view>营业时间：{{ mctInfoList.businessHours }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <div v-if="productInfoList.length>0" style="height: 10rpx; background: #F0F0F4;"></div>
        <!-- 可使用商品 -->
        <view v-if="productInfoList.length>0" class="box-block">
            <view class="box-block-title">
                可使用商品
                <text>2选1</text>
            </view>
            <view class="flex flex_col ">
                <view class="box-block-goods flex flex_sb ">
                    <view class="flex flex_ac">
                        <view></view>
                        <text>羽衣纤体瓶</text>
                    </view>
                    <view>
                        <text>1份</text>
                        <text>¥20</text>
                    </view>
                </view>
                <view class="box-block-goods flex flex_sb ">
                    <view class="flex flex_ac">
                        <view></view>
                        <text>羽衣纤体瓶</text>
                    </view>
                    <view>
                        <text>1份</text>
                        <text>¥20</text>
                    </view>
                </view>
            </view>
        </view>

        <div style="height: 10rpx; background: #F0F0F4;"></div>
        <view class="box-block" style="margin-bottom: 100rpx;">
            <view class="box-block-title">
                购买须知
            </view>
            <!-- 购买须知 -->
            <!-- <view class="box-block-tips">
                <view>
                    <image :src="staticBaseUrl + '/hbdimage/baseImage/icon-goumaishangpinquan.png'"
                        mode="scaleToFill" />
                    <text>购买商品券</text>
                </view>
                <view>
                    <image :src="staticBaseUrl + '/hbdimage/baseImage/icon-wodegouwuquan.png'"
                        mode="scaleToFill" />
                    <text>神枪手-我团的券</text>
                </view>
                <view>
                    <image :src="staticBaseUrl + '/hbdimage/baseImage/icon-yongquandian.png'" mode="scaleToFill" />
                    <text>用券点外卖</text>
                </view>
            </view> -->
            <!-- 购买须知 -->
            <view class="flex flex_col ">
                <view class="box-block-content">
                    <view class="box-block-content-title flex flex_ac ">
                        <u-icon :name="staticBaseUrl + '/hbdimage/baseImage/icon-lx.png'" size="12"
                            color="#10C2B7"></u-icon>
                        <text>有效期限</text>
                    </view>
                    <view class="box-block-content-detail">
                        {{ cardList.useStartTime }}至{{ cardList.useEndTime }}
                    </view>
                </view>
                <view class="box-block-content">
                    <view class="box-block-content-title flex flex_ac ">
                        <u-icon :name="staticBaseUrl + '/hbdimage/baseImage/icon-lx.png'" size="12"
                            color="#10C2B7"></u-icon>
                        <text>购买及使用限制</text>
                    </view>
                    <view class="box-block-content-detail">
                        每人限领{{ cardList.getMaxNum }}张,每日发放{{ cardList.getDayNum }}张。
                    </view>
                </view>
                <view class="box-block-content">
                    <view class="box-block-content-title flex flex_ac ">
                        <u-icon :name="staticBaseUrl + '/hbdimage/baseImage/icon-lx.png'" size="12"
                            color="#10C2B7"></u-icon>
                        <text>退款规则</text>
                    </view>
                    <view class="box-block-content-detail">
                        {{ cardList.refundTypeName }}
                    </view>
                </view>
                <view class="box-block-content">
                    <view class="box-block-content-title flex flex_ac ">
                        <u-icon :name="staticBaseUrl + '/hbdimage/baseImage/icon-lx.png'" size="12"
                            color="#10C2B7"></u-icon>
                        <text>使用描述</text>
                    </view>
                    <view class="box-block-content-detail">
                        {{ cardList.useDis }}
                    </view>
                </view>

            </view>

        </view>
        <div style="height: 200rpx; background: #F0F0F4;"></div>
        <view v-if="cardList.isSell == '1'" class="btn-bottom flex flex_ac">
            <view>
                <view class="btn-num flex flex_col flex">
                    <view class="flex flex_ac">
                        <view>¥<text>{{ Number(cardList.sellAmt) * value }}</text></view>
                        <text>共{{ value }}张</text>
                    </view>
                </view>
            </view>
            <view class="submit" @click="getCoupon">立即抢券</view>
        </view>
        <view v-if="cardList.isSell == '0'" class="btn-bottom flex flex_ac ">
            <view class="submit isSell" @click="getCoupon">立即抢券</view>
        </view>

        <vc-safe-bottom />
    </vc-container>
</template>
<script>
import { getCouponInfoById, getProductInfoList, userGetCoupon, getMctInfoList } from '../api/cardApi';//详情接口
export default {
    name: "cardDetail",
    data() {
        return {
            value: 1,
            cardList: {},
            couponBaseId: '',
            merchantsNum: '',
            mctId: '',
            mctInfoList: {},
            mctTotal: 0,
            productInfoList: [],
        }
    },
    async onLoad(options) {
        await this.firstInit();
        this.couponBaseId = options.couponBaseId;
        // this.serviceId = options.serviceId;//服务池id
        this.mctId = options.mctId;//商家id
        this.getList();
    },
    computed: {

    },
    methods: {
        getList() {
            // 获取卡券详情
            getCouponInfoById({ id: this.couponBaseId }).then(res => {
                console.log(res, "resresresres");
                this.cardList = res;
                this.getMctInfoList();//商户
                this.getProductInfoList();//商品
            })
        },
        getMctInfoList() {

            let params = {
                couponBaseId: this.couponBaseId,
                page: 1,
                rows: 10
            }
            //
            getMctInfoList(params).then(res => {
                console.log(res, "getMctInfoList");
                if (res.total != 0) {
                    this.mctTotal = res.total;//适用商家个数
                    this.mctInfoList = res.list[0];//适用商家显示
                }
            })
        },
        getProductInfoList() {
            let params = {
                couponBaseId: this.couponBaseId,
                page: 1,
                rows: 10
            }
            // 商家卡券列表
            getProductInfoList(params).then(res => {
                console.log(res, 'getProductInfoList')
                this.productInfoList = res;
            })
        },
        getCoupon() {
            // 卡券领取 
            // let params = [];
            // for (let i = 0; i < this.value; i++) {
            //     params.push({
            //         couponBaseId: this.cardList.couponBaseId,//优惠券编号
            //         //couponPackId//优惠券包 id  
            //         // mctId:this.mctId, //领取商户号
            //         //buginessCategory //行业类目
            //         //areaNo //地区编号
            //         //serviceId //服务池编号
            //         //userLabelId //用户标签id
            //         //activityId //活动编号
            //         couponGetNum:this.value //优惠券数量(必填)
            //     })
            // }
            let params = {
                couponBaseId: this.cardList.couponBaseId,//优惠券编号
                couponGetNum:this.value //优惠券数量(必填)
            }

            params = JSON.stringify(params);
            userGetCoupon({ jsonList: params ,chnlFlag:'0'}).then(res => {
                console.log(res, "resresresres");
            })
        },
        refundDescription(item) {
            switch (item) {
                case '0':
                    return '不支持退款';
                case '1':
                    return '过期退';
                case '2':
                    return '随时退';
                case '9':
                    return '都支持';
                default:
                    return '未知退款类型'; // 处理未知或未来的退款类型
            }
        },

    }
}
</script>

<style lang="scss" scoped>
.main {
    background: #fff;

    height: 100vh;

    image {
        width: 100%;
        height: 360rpx;
        font-size: 0;
    }

    .bottom-block {
        padding: 30rpx;
        padding-top: 20rpx;
        line-height: 40rpx;

        .main-block {
            padding: 15rpx 0;
            justify-content: space-between;
            font-size: 26rpx;
            border-bottom: 1rpx solid #D8D8D8;

            view:first-child {
                line-height: 60rpx;
                display: flex;
                align-items: center;

                text {
                    font-weight: bold;
                    font-size: 32rpx;
                    color: #333333;
                }
            }

            view {
                margin-top: 10rpx;

                text {

                    font-weight: 500;
                    font-size: 22rpx;
                    color: #ACACAC;
                }

                image {
                    width: 20rpx;
                    height: 23rpx;
                }
            }

            view:last-child {
                padding-bottom: 10rpx;
                display: flex;
                align-items: center;

                text {
                    margin-left: 20rpx;
                    color: #CCAE34;
                    font-weight: 500;
                    font-size: 22rpx;
                }
            }
        }

        .main-block:last-child {
            padding-bottom: 0;
        }

        .number-block {
            font-size: 26rpx;
            padding: 30rpx 0 0 0;

            view:first-child {
                font-weight: bold;
                font-size: 26rpx;
                color: #333333;
            }

            view {
                .minus {
                    width: 20px;
                    height: 20px;
                    border: 1px solid #20CAB1;
                    border-radius: 50%;
                    border-width: 1px;
                    border-color: #20CAB1;
                    border-top-left-radius: 100px;
                    border-top-right-radius: 100px;
                    border-bottom-left-radius: 100px;
                    border-bottom-right-radius: 100px;
                    @include flex;
                    justify-content: center;
                    align-items: center;
                }

                .input {
                    padding: 0;
                }

                .plus {
                    width: 22px;
                    height: 22px;
                    background-color: #20CAB1;
                    border-radius: 50%;
                    /* #ifndef APP-NVUE */
                    display: flex;
                    /* #endif */
                    justify-content: center;
                    align-items: center;
                }
            }

        }
    }

    .box-block {
        padding: 30rpx;
        display: flex;
        position: relative;
        justify-content: space-between;
        flex-direction: column;

        .box-block-title {

            font-weight: bold;
            font-size: 30rpx;
            color: #333333;
            padding-left: 20rpx;
            flex: 1;
            align-items: center;

            text {
                padding-left: 30rpx;
                font-weight: 500;
                font-size: 22rpx;
                color: #ACACAC;
            }

            text::before {
                content: "";
                position: absolute;
                width: 2rpx;
                height: 28rpx;
                background: #ACACAC;
                border-radius: 6rpx;
                left: 220rpx;
                top: 37.5rpx;
            }
        }

        .box-block-title::before {
            content: "";
            position: absolute;
            width: 5rpx;
            height: 28rpx;
            background: #20CAB1;
            border-radius: 6rpx;
            left: 30rpx;
            top: 37.5rpx;
        }

        .box-block-goods {
            font-weight: 500;
            font-size: 22rpx;
            color: #333333;
            line-height: 60rpx;

            view:first-child {

                display: flex;
                align-items: center;

                view {
                    display: inline-block;
                    width: 9rpx;
                    height: 9rpx;
                    border-radius: 50%;
                    background: #ACACAC;
                }

                text {
                    margin-left: 20rpx;
                    font-weight: 500;
                    font-size: 22rpx;
                    color: #333333;
                }

            }

            view:last-child {
                text:first-child {
                    font-weight: 500;
                    font-size: 22rpx;
                    color: #ACACAC;
                    margin-right: 50rpx;
                }
            }
        }

        .box-block-goods:first-child {
            margin-top: 20rpx;
        }

        .box-block-right {
            font-weight: 500;
            font-size: 22rpx;
            color: #ACACAC;
        }

        .box-block-tips {
            border-bottom: 1rpx solid #D8D8D8;
            display: flex;
            align-items: center;
            justify-content: space-around;

            view {
                padding: 25rpx 0;
                display: flex;
                flex-direction: column;
                align-items: center;

                image {
                    height: 86rpx;
                    width: 86rpx;
                }

                text {
                    line-height: 55rpx;
                    font-weight: bold;
                    font-size: 22rpx;
                    color: #333333;
                }
            }
        }

        .box-block-content {
            padding-top: 25rpx;

            .box-block-content-title {
                text {
                    font-weight: bold;
                    font-size: 22rpx;
                    color: #333333;
                    margin-left: 12rpx;
                }
            }

            .box-block-content-detail {
                line-height: 38rpx;
                font-weight: 400;
                font-size: 22rpx;
                color: #AFAFAF;
                padding: 10rpx 35rpx 0;
            }
        }

        .scroll-item {
            background-color: white;
            margin-top: 20rpx;
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15rpx 24rpx;

            .scroll-item:first-child {
                display: flex;
                align-items: center;
            }

            image {
                width: 200rpx;
                height: 138rpx;
                border-radius: 8rpx;
            }

            .scroll-item:last-child {
                border-bottom: none;
            }
        }
    }

    .btn-bottom {
        position: fixed;
        bottom: 0;
        width: calc(100% - 80rpx);
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20rpx 20rpx 0rpx 0rpx;
        justify-content: space-between;
        padding: 40rpx;

        .btn-num {
            view {
                color: #FE3A00;

                view {
                    font-weight: bold;
                    font-size: 47rpx;
                    color: #FE3A00;

                    text {
                        font-weight: bold;
                        font-size: 62rpx;
                        color: #FE3A00;

                    }
                }

                text {
                    font-weight: bold;
                    font-size: 26rpx;
                    color: #FE3A00;
                    line-height: 30rpx;
                    margin-left: 15rpx;
                }
            }

            text {
                font-weight: 500;
                font-size: 26rpx;
                color: #A7A7A7;
            }
        }

        .submit {
            padding: 25rpx 100rpx;
            font-weight: bold;
            font-size: 26rpx;
            color: #FFFFFF;
            background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
            border-radius: 50rpx;
        }

        .isSell {
            width: 90%;
            text-align: center;
            margin: 0 auto;
        }
    }
}
</style>