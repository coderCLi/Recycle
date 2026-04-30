<!--
 * @Description: sub 订阅组件 
-->
<template>
    <view class="u-sub" @click="doDub">
        <u-icon name="plus-circle" size="22" color="#656565"></u-icon>
        <text>订阅</text>
    </view>
</template>

<script>
    import { doDub  } from '@/api/index';//订阅接口
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    import { Toast } from '@/utils/http';
    export default {
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
            doDub(){

                if(this.serviceId.value.length === 0){
                    return;
                }
                console.log(this.serviceId.value)
                console.log(this.title.value)

                this.trackReport.trackCustom("订阅-" + this.title.value);

                doDub({
                    serviceId: this.serviceId.value,
                    subType: '1'/* 订阅类型，1：订阅，0：取消订阅 */
                }).then(res => {
                    console.log(res,'订阅成功');
                    Toast('订阅成功');
                    this.$emit('success')
                })

            },
        },
    }
</script>

<style lang="scss" scoped>
    .u-sub {
        z-index: 991;
        position: fixed;
        right: 30rpx;
        bottom: 20%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 98rpx;
        height: 98rpx;
        border-radius: 50%;
        background: #FFFFFF;
        box-shadow: 0rpx 4rpx 18rpx 0rpx rgba(0,0,0,0.16);
        text {
            font-weight: bold;
            font-size: 20rpx;
            color: #656565;
        }
    }
</style>