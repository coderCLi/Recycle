<!--
 * @Description: 售后申诉页面
 * @Autor: TF
 * @Date: 2025-08-08 10:33:11
 * @LastEditors: TF
 * @LastEditTime: 2025-08-12 19:18:17
-->
<template>
    <vc-modal ref="modal"/>
    <vc-container ref="container">
        <view class="form">
            <!-- 退款原因为其他时需要输入退款说明 -->
            <view style="padding: 20rpx 0;font-size: 24rpx;">
                <view :class="['title', refundReason.optCode == '99' ? 'required' : '']">申诉说明</view>
                <up-textarea style="margin-top: 20rpx;font-size: 24rpx;" v-model="description" placeholderStyle="font-size: 24rpx" placeholder="补充退款原因详情" maxlength="100" count></up-textarea>
            </view>

            <!-- 退款凭证 -->
            <view style="padding: 20rpx 0;font-size: 24rpx;">
                <view class="title" style="margin-bottom: 20rpx;">申诉凭证</view>
                <vc-upload :props-data="{
                        props: {
                            previewFullImage: {
                                value: true
                            },
                            fileList: {
                                value: this.picList 
                            },
                            maxSize: {
                                value: 5 * 1024 * 1024
                            },
                            maxCount: {
                                value: 3
                            },
                            deletable: {
                                value: true
                            }
                        }
                    }" @delete="deletePic" @complete="upComplete">
                    <image :src="staticBaseUrl + '/hbdimage/package-product-list/shangchuan.png'" style="width: 160rpx; height: 160rpx;border: 2rpx dashed #f8f8f8"></image>
                </vc-upload>
            </view>
        </view>

        <view class="return-btn" @click="doAppreal">提交</view>
    </vc-container>
</template>

<script>
    import {
        afterSaleApply,// 售后申请
    } from '../api/index'
    import { usePointsStore } from "@/store/index"
    import vcUpLoad from '@/components/library/base/vc-upload/index.vue';
    export default {
        name: 'apprealPage',
        components: {
            'vc-upload': vcUpLoad
        },
        data() {
            return {
                afterSaleInfo: {},
                refundReason: {},// 申诉原因
                description: '',// 申诉说明
                picList: [],
            }
        },
        onLoad(options) {
            this.afterSaleInfo = usePointsStore().apprealInfo
        },
        methods: {
            // 设置理由
            setReason(e) {
                this.refundReason = {...e}
                this.$forceUpdate()
                console.log(this.refundReason)
            },
            //删除图片
            deletePic(event) {
                console.log(event)
                this.picList.splice(event.index, 1);
            },
            //获取完成上传后图片id
            upComplete(imageData) {
                let index = imageData.index;
                this.picList.splice(index, 1, { ...imageData, url: this.minioBaseUrl + imageData.showUrl });
            },
            // 申诉提交
            doAppreal() {
                if(!this.bridgeSdk.checkIsEmpty(this.description)) {
                    this.bridgeSdk.showToast({title: '请填写申诉说明'})
                    return
                }
                let itemIds = this.afterSaleInfo.afterSaleResqBos.map(e =>({
                        itemId: e.orderItemId,
                        afterSaleNum: e.applyNum
                    }))

                afterSaleApply({
                    afterSalesId: this.afterSaleInfo.afterSalesId,
                    orderId: this.afterSaleInfo.pointsOrderId,
                    pointsShopOrderId: this.afterSaleInfo.pointsShopOrderId || '',
                    itemIds: itemIds,
                    mallScene: 'POINTS_MALL',
                    afterSaleType: this.afterSaleInfo.serviceType,
                    afterSaleDealType: this.afterSaleInfo.service,
                    reason: this.afterSaleInfo.reason,
                    
                    images: this.picList.map(e => e.id) || [],
                    description: this.description,
                }).then(res=>{
                    this.bridgeSdk.showToast({title: '提交成功'})
                    this.bridgeSdk.navigateBackTo({
                        delta: 1,
                        success:page => {
                            page && page.getAfterSaleDetail && page.getAfterSaleDetail()
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
:deep(.u-textarea) {
    padding-bottom: 40rpx;
}
.form {
    width: calc(690rpx - 60rpx);
    margin: 20rpx auto 0;
    padding: 10rpx 30rpx;
    border-radius: 20rpx;
    background: #fff;
    &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #f8f8f8;
        padding: 20rpx 0;
        font-size: 24rpx;
        &:last-child {
            border-bottom: none;
        }
    }
}

.return-btn {
    position: absolute;
    bottom: 50rpx;
    left: 0;
    right: 0;
    margin: 20rpx auto;
    width: calc(670rpx - 80rpx);
    padding:0rpx 40rpx;
    color: white;
    background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #D8D8D8;
    font-size: 28rpx;
    line-height: 84rpx;
    text-align: center;
    border-radius: 42rpx;
}
</style>