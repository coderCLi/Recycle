<!--
 * @Description:组件 
-->
<template>
    <!-- 营业时间弹窗 -->
    <u-popup v-if="show.value == 'showTime'" :customStyle="{ 'max-width': '90%' }" :show="showPop.value" mode="center"
        round="15" @close="close" :closeable="true" @open="open">
        <view class="pop-title flex flex_ac flex_jc">
            营业时间
        </view>
        <view class="card-list">
            <text> {{content.value}}
            </text>
        </view>
    </u-popup>
    <!-- 电话弹窗 -->
    <u-popup v-if="show.value == 'showPhone'" :show="showPop.value"  mode="bottom" round="15" @close="close"
        :closeable="true">
        <view class="pop-title flex flex_ac flex_jc">
            医院电话
        </view>
        <view class="phone-list">
            <text v-for="item in content.value" :style="{color: color.value,fontSize: size.value}" :key="phone" @click.stop="makePhoneCall(item)">{{item.phoneNumber}}</text>
        </view>
    </u-popup>
    <!-- 限购说明 富文本 -->
    <u-popup v-if="show.value == 'showRefundDesc'" :customStyle="{ 'max-width': '90%', 'max-height': '80vh'}" :show="showPop.value" mode="center"
        round="15" @close="close" :closeable="true" @open="open">
        <view class="pop-title flex flex_ac flex_jc">
            限购说明
        </view>
        <view class="card-list">
            <rich-text :nodes="bridgeSdk.addMinioPrefixToImgSrc(content.value)"></rich-text>
        </view>
    </u-popup>
    <!-- 客服电话弹窗 -->
    <u-popup v-if="show.value == 'showArticlePhone'" :show="showPop.value"  mode="bottom" round="15" @close="close"
        :closeable="true">
        <view class="pop-title flex flex_ac flex_jc">
          服务电话
        </view>
        <view class="phone-list">
            <view class="phone-list-call flex flex_sb flex_ac" v-for="phone in content.value" :key="phone" @click.stop="makePhoneCall(phone)"><text> {{phone}}</text><image class="icon-img" :src="staticBaseUrl + '/hbdimage/package-general-services/tel.png'"
              mode="scaleToFill" /></view>
            
        </view>
    </u-popup>
    <!-- 电话弹窗 -->
    <u-popup v-if="show.value == 'showCustomPhone'" :show="showPop.value"  mode="bottom" round="15" @close="close"
        :closeable="true">
        <view class="pop-title flex flex_ac flex_jc">
          {{title.value}}
        </view>
        <view class="phone-list" style="align-items: flex-start; padding-left: 80rpx;">
            <view class="custom-phone-ele" v-for="phone in content.value" :key="phone" @click.stop="makePhoneCall({'phoneNumber': phone.phone})">{{phone.phone}}{{phone.time.length ? ` &nbsp;&nbsp;&nbsp;(${phone.time})`:'' }}</view>
             
        </view>
    </u-popup>
</template>

<script>
import mixins from "../../mixins.js"
import props from "./props.js";
import belong from "../intro.json";
export default {
    emits: ['close'],
    belong,
    mixins: [mixins],
    data() {
        return {
            ...JSON.parse(JSON.stringify(props)),
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        close() {
            this.showPop.value = false;
            this.$emit("close", this.showPop.value);
            // this.show.value = false
        },
        open(){
            // this.showPop.value = true;
        },
        makePhoneCall(item) {
            console.log("makePhoneCall ", item);
            let phoneNumber = typeof item === 'string' ? item : item.phoneNumber;
            let title = typeof item === 'string' ? '服务电话' : (item.title || '服务电话');
            this.bridgeSdk.makePhoneCall({
                title: title,
                phoneNumber: phoneNumber.toString()
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.pop-title {
    margin-top: 30rpx;
    line-height: 80rpx;
    justify-content: center;
    text-align: center;
    width: 100%;
    font-weight: 600;
    font-size: 32rpx;
    color: #222222;
    line-height: 53rpx;
}

.card-list {
    padding: 40rpx 60rpx 60rpx 60rpx;
    border-radius: 28rpx;

    text {
        font-weight: 400;
        font-size: 28rpx;
        color: #222222;
    }
}

.phone-list {
    padding: 40rpx 60rpx 60rpx 60rpx;
    border-radius: 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .phone-list-call{
        width: 100%;
        border-bottom: 2rpx solid #EDEDED;
        padding: 15rpx 0;
    }
    .phone-list-call:last-child{
         border-bottom:none;
    }
    text {
        line-height: 50rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #222222;
    }
    .custom-phone-ele {
        line-height: 66rpx;

    }
    .icon-img {
        height: 42rpx;
        width: 42rpx;
    }
}
</style>