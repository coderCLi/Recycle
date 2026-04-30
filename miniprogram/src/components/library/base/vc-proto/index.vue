<!--
 * @Description: 协议组件
 * @Author: yulongchen
 * @Date: 2024-11-26 14:47:54
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-30 15:04:40
 * @Remark: 
-->
<template>
    <view class="component">
        <view class="proto-box">
          <view class="proto" 
            :class="{active: modelValue}" 
            :style="`background: url(${staticBaseUrl}/hbdimage/main/images/login/${modelValue ? 'proto-checked.png' : 'proto-default.png'}) no-repeat left top; background-size: 32rpx 32rpx`"
            @click="protoClick">我已同意 
            <text @click.stop="checkUserProtocol">《用户协议》</text><text @click.stop="checkPrivacyProtocol">《隐私政策》</text>
          </view>
        </view>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "协议",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props))
            }
        },
        props: {
            modelValue: Boolean,
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },
        methods: {
            protoClick(){
                this.$emit("update:modelValue", !this.modelValue);
            },
            checkUserProtocol() {
              this.bridgeSdk.jumpPage({
                url: this.minioBaseUrl + 'hbdbucket//home/micro/hbd/agreement/user_agree-mini.html',
                title: '用户服务协议'
              })

            },
            checkPrivacyProtocol() {
              this.bridgeSdk.jumpPage({
                url: this.minioBaseUrl + 'hbdbucket/home/micro/hbd/agreement/privacy-mini.html',
                title: '隐私政策'
              })
            },
        },
    }
</script>

<style lang="scss" scoped>
  .proto-box {
    display: flex;
    justify-content: center;
    padding-bottom: 40rpx;
    // margin-top: 246rpx;
    margin-top: 50rpx;
  }
  
  .proto {
    font-weight: 400;
    font-size: 24rpx;
    color: #666666;
    line-height: 36rpx;
    padding-left: 44rpx;
    // background: url("@/static/images/login/proto-default.png") no-repeat left top;
    // background-size: 32rpx 32rpx;

    &.active {
      // background: url("@/static/images/login/proto-checked.png") no-repeat left top;
      // background-size: 32rpx 32rpx;
    }

  }    
</style>