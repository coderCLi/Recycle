<!--
 * @Description: 广告弹窗组件
 * @Author: yulongchen
 * @Date: 2024-11-27 14:05:15
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-19 12:34:58
 * @Remark: 
-->
<template>
    <view class="component">
        <up-popup
            :show="show"
            zIndex="2"
            mode="center"
            @close="close" 
            round="20rpx"
            @open="open"
            :customStyle="popCustomStyle"
            >
            <view class="ad" :style="`margin-left: ${bannerPropsData.props.nextMargin.value}rpx`">
                <view class="ad-banner">
                    <vc-banner :props-data="bannerPropsData" @toPage="toPage"></vc-banner>
                </view>
                <uni-icons type="closeempty" class="close" size="32rpx" color="#aec2db" @click="close"></uni-icons>
            </view>
        </up-popup>
    </view>
</template>

<script>
    import vcBanner from "../vc-banneropen/index.vue";
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        components: {
            vcBanner
        },
        belong,
        mixins: [mixins],
        title: "广告弹窗",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                show: false,
                bannerPropsData: {
                    props: {
                        list: {
                            value: [
                                // {
                                //     imgurl: 'https://www.huibaoding.com/admin/sys-file/upload/4ac7736368674170b78e44a525144480.png',
                                //     name: "数字标注大赛",
                                //     ghId: "gh_d2fbd779dcc2",
                                //     page: "/packageB/pages/activity/dataAnnotation/dataCentre/dataCentre"
                                // },
                                // {
                                //     imgurl: 'https://www.huibaoding.com/admin/sys-file/upload/4ac7736368674170b78e44a525144480.png',
                                //     name: "数字标注大赛",
                                //     ghId: "gh_d2fbd779dcc2",
                                //     page: "/packageB/pages/activity/dataAnnotation/dataCentre/dataCentre"
                                // },
                            ]
                        },
                        height: {
                            value: 685
                        },
                        width: {
                            value: 483
                        },
                        nextMargin: {
                            value: 16
                        }
                    }
                },
                popCustomStyle: {
                    backgroundColor: "transparent",
                }
            }
        },
        watch: {
            'list': {
                handler(newVal, oldVal) {
                    console.log("广告--------------------")
                    console.dir(newVal)
                    let listValue = newVal.value;
                    listValue = listValue.map(element => {
                        let item = {
                                    imgurl: this.minioBaseUrl + element.picUrl,
                                    name: element.title || title.content,
                                    ghId: element.picId,
                                    page: element.url
                                }
                        return {...element, ...item}
                    });
                                
                    this.bannerPropsData.props.list.value = listValue;
                    this.bannerPropsData.props = {...this.bannerPropsData.props}
                    console.log("广告--------------------11")
                    console.dir(this.bannerPropsData)
                },
                deep: true,
                immediate: true 
            }
        },
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },

        methods: {
            open(){
                console.log("显示广告");
                this.show = true;
            },
            close() {
                this.show = false;
                this.$emit("close")
            },
            toPage(item) {
                this.$emit("toPage", item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ad {
        width: 483rpx;
        height: 685rpx;
        text-align: center;
        
        .ad-banner {
            overflow: hidden;
            border-radius: 20rpx;
        }
    }
    .close {
        border: 3rpx solid #b1c4df;
        border-radius: 50%;
        display: inline-block;
        margin-top: 26rpx;
        width: 48rpx;
        height: 48rpx;
        line-height: 48rpx;
    }
</style>
