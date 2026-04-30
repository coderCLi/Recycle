<!--
 * @Description: 写评价页面
 * @Autor: TF
 * @Date: 2025-06-16 09:30:24
 * @LastEditors: TF
 * @LastEditTime: 2025-06-18 10:47:27
-->
<template>
    <vc-modal ref="modal"/>
    <vc-container :props-data="propsData" style="background-color: #f8f8f8;">
        <view class="title">{{ info.spuName }}</view>
        <view class="rating">
            <view class="rating-text">
                <view v-for="(item, index) in statusList" :key="index">
                    {{ item.text }}
                </view>
            </view>
            <view class="rating-star">
                <up-rate activeColor="#FF8715" :count="5" v-model="rating" size="60" inactive-icon="star-fill"></up-rate>
            </view>
        </view>
        <view class="content">
            <textarea v-model="userReviewContent" placeholder-style="font-size: 28rpx;color: #999;word-break: break-all;" placeholder="大家都在问：菜品口味如何，服务态度好吗，环境（空间、布置）怎么样？" maxlength="300"></textarea>

            <vc-upload :props-data="uploadProps" @delete="delPic" @complete="uploadPic">
                <image :src="staticBaseUrl + '/hbdimage/package-product-list/shangchuan.png'" style="width: 160rpx;height: 160rpx;" mode="scaleToFill"/>
            </vc-upload>

            <view class="content-tip">发图能更有效地帮助他人哦～</view>
            <view class="content-radio">
                <view style="display: flex;align-items: center;">
                    <up-checkbox size="28rpx" label="匿名评价" shape="circle" name="agree" usedAlone v-model:checked="checked"></up-checkbox>
                    <view style="font-size: 24rpx;color: #999;margin-left: 11rpx;">对商家和其他用户隐藏头像和昵称</view>
                </view>

                <up-icon name="question-circle" @click="show = true" size="28rpx"></up-icon>
            </view>
        </view>

        <view class="bottom">
            <view class="bottom-btn" @click="doRate">
                发布
            </view>
        </view>
    </vc-container>

    <up-modal :show="show" title="提示" @confirm="show = false" content="当匿名评价后，评价在商家列表中展示时，将不会向商家和其他用户展示你的头像和昵称"></up-modal>
</template>

<script>
    import { addReview } from '../api/index'
    import vcUpLoad from '@/components/library/base/vc-upload/index.vue';
    export default {
        name: 'doRatePage',
        components: {
            'vc-upload': vcUpLoad
        },
        data() {
            return {
                propsData: {
                    props: {
                        
                    }
                },
                uploadProps: {
                    props: {
                        maxCount: {
                            value: 3
                        }
                    }
                },// 上传图片props
                info: {},// 商品信息
                statusList: [
                    {
                        value: 1,
                        text: '😡 很糟糕'
                    },
                    {
                        value: 2,
                        text: '😥 较差'
                    },
                    {
                        value: 3,
                        text: '🤨 一般'
                    },
                    {
                        value: 4,
                        text: '😋 还可以'
                    },
                    {
                        value: 5,
                        text: '😍 很棒'
                    }
                ],// 评分列表

                rating: 0,// 评分
                userReviewContent: '',// 评价内容
                userId: '',// 用户ID
                userName: '',// 用户名
                nickName: '',// 昵称
                imgList: [],// 图片列表
                checked: false,// 是否匿名
                
                show: false,// 评分弹窗
                
            }
        },
        onLoad(options) {
            this.info = {
                ...options
            }
            let userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            const { userId, nickName, userName } = userInfo;
            this.userId = userId;
            this.userName = userName
            this.nickName = nickName
        },
        onReady() {

        },
        methods: {
            // 评价
            doRate() {
                if(this.rating == 0) {
                    uni.showToast({
                        title: '请选择评分',
                        icon: 'none'
                    })
                    return;
                }
                if(!this.bridgeSdk.checkIsEmpty(this.userReviewContent)) {
                    uni.showToast({
                        title: '请输入评价内容',
                        icon: 'none'
                    })
                    return;
                }
                let _this = this
                addReview({
                    storeId: this.info.storeId,
                    spuid: this.info.spuId,
                    userId: this.info.userId,
                    orderId: this.info.orderId,
                    userId: this.userId,
                    userName: this.userName,
                    rating: this.rating.toString(),
                    userReviewContent: this.userReviewContent,
                    isAnonymous: this.checked ? '1' : '0',
                    anonymousName: this.nickName,
                    reviewsImagesAll: this.imgList.map((e,i)=>({
                        imageId: e.id,
                        imageUi: e.url,
                        sort: i.toString()
                    }))
                }).then(res=>{
                    this.$refs.modal.open({
                        title : '温馨提示',
                        content: '感谢您的评价，已提交成功',
                        confirmText:'确定',
                        showCancel: false,
                        confirmCallback : () => {
                            _this.bridgeSdk.navigateBackTo({
                                delta: 1
                            })
                        },
                    })
                })
            },

            // 删除图片
            delPic(e) {
                this.imgList.splice(e.index, 1);
            },
            // 上传图片
            uploadPic(e) {
                console.log('uploadPic', e)
			    this.imgList.push({
                    ...e
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
.title {
    text-align: left;
    padding: 32rpx 38rpx;
    font-size: 36rpx;
    color: #333;
    font-weight: bold; 
}
.rating {
    font-size: 24rpx;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-text {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 84%;
    }
    &-star {
    }
}
.content {
    width: calc(718rpx - 32rpx);
    background-color: white;
    padding: 32rpx 16rpx;
    border-radius: 20rpx;
    margin: 37rpx auto 0;
    textarea {
        height: 280rpx;
        width: 100%;
    }
    image {
        border: 1rpx dashed #f8f8f8;
        width: 160rpx;
        height: 160rpx;
    }
    &-tip {
        margin-top: 15rpx;
        text-align: left;
        font-size: 24rpx;
        color: #999999;
    }
    &-radio {
        margin-top: 39rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 40rpx calc(65rpx + constant(safe-area-inset-bottom));
    padding: 30rpx 40rpx calc(65rpx + env(safe-area-inset-bottom));
    background-color: white;
    &-btn {
        color: white;
        width: 670rpx;
        margin: 0 auto;
        border-radius: 42rpx;
        height: 84rpx;
        line-height: 84rpx;
        font-size: 32rpx;
        font-weight: 600;
        background: linear-gradient( 132deg, #00BCB8 0%, #11FFBC 100%), #FF5871;
        text-align: center;
    }
}
</style>