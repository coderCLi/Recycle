<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container class="main" :props-data="propsData">
        <!-- <view class="main"> -->

            <!-- <vc-navbar :props-data="propsData">
        </vc-navbar> -->
            <view class="wrapper">
                <!-- 最新设计图文档要求改造，但数据录入不支持 -->
                <!-- <u-sticky v-if="customNavHeight > 0" :customNavHeight="customNavHeight" bgColor="#fff">
                <view style="background:#fff;display:flex;" :style="{ 'display': showTabs ? 'block' : 'none' }"
                    class="tabs" id="tabs">
                    <u-tabs :current="currentTab" :list="tabs" @click="clickItem" class="tabsStyle"
                        lineColor="linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%)" :activeStyle="{
                            color: '#333333',
                            fontWeight: 'bold',
                        }" :inactiveStyle="{
                            color: '#999',
                            transform: 'scale(1)'
                        }"></u-tabs>
                </view>
            </u-sticky> -->
                <!-- <view class="section">
                <view class="section">
                    <view class="top" id="baseInfo">
                        <view class="title">学校信息</view>
                    </view>
                    <view class="md1-content">

                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>
                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>
                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>
                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>

                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>
                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>
                        <view class="item">
                            <view class='item-icon'>
                                <u-icon name="edit-pen-fill" size="20" color="#01BEB8"></u-icon>
                            </view>
                            <view class='item-score'>
                                教学规模：<text>1分</text>
                            </view>

                        </view>
                    </view>
                </view>
            </view> -->
                <view class="section">
                    <view class="section">
                        <view class="top" id="company">
                            <view class="title">学校介绍</view>
                        </view>
                        <view>
                            <u-parse lazy-load selectable scroll-table :content="bridgeSdk.addMinioPrefixToImgSrc(schoolList.schoolContent)" :previewImg="enablePreview" @imgTap="previewImage" :copyLink="false" @linkTap="bridgeSdk.hrefJump" :useAnchor="useAnchor"></u-parse>
                        </view>
                    </view>
                </view>
                <!-- <view class="section">
                <view class="section">
                    <view class="top" id="money">
                        <view class="title">招生简章</view>
                    </view>
                    <view>
                        <text>
                            该校招生简章暂未公布，详情请咨询学校官方
                        </text>
                    </view>
                </view>
            </view>
            <view class="section">
                <view class="section">
                    <view class="top" id="process">
                        <view class="title">收费介绍</view>
                    </view>
                    <view>
                        <text>
                            该校招生简章暂未公布，详情请咨询学校官方
                        </text>
                    </view>
                </view>
            </view> -->
            </view>
            <vc-safe-bottom />
        <!-- </view> -->
    </vc-container>
</template>

<script>
import { mapState } from 'pinia';
import { useBaseStore } from "@/store/index";
import { getSchoolinfo } from '../api/baseServices';
export default {
    data() {
        return {
            propsData: {
                props: {
                    title: {
                        value: '学校详情'
                    },
                    // statusBar: {
                    //     value: false
                    // },
                    // navigationBar: {
                    //     value: false
                    // }
                }
            },
            safeTopDistance: 0,
            useAnchor: 1,
            enablePreview: true,
            customNavHeight: '',
            showTabs: false, // 默认吸顶的tab不显示
            currentTab: -1, // 由于初始化的uview的代码有bug，所以默认是-1，在第一次显示的时候，设置0，自动复位，防止错误
            distanceArr: [], // 每一个ID对应的scrollTop值
            tabs: [
                {
                    id: '#baseInfo',
                    name: '学校信息',
                },
                {
                    id: '#company',
                    name: '学校介绍',
                },
                {
                    id: '#money',
                    name: '招生简章',
                },
                {
                    id: '#process',
                    name: '收费介绍',
                },

            ],
            schoolList: {},
            isTabChange: false, // 防止在点击tab的时候，页面的滚动导致重复计算、抖动问题
        };
    },
    computed: {
        ...mapState(useBaseStore, {
            navigationBarInfo: "navigationBarInfo"
        }),
    },
    async onLoad(options) {
        // #ifdef H5
        // this.enablePreview = false;
        // this.copyLink = false;
        // #endif
        this.id = options.id;
        this.getList();
    },
    mounted() {
        let safeTopDistance = this.navigationBarInfo.statusBarHeight;
        safeTopDistance += this.navigationBarInfo.navigationBarHeight;
        this.safeTopDistance = safeTopDistance;
        this.useAnchor = -safeTopDistance;
    },
    // 监听页面滚动
    onPageScroll(event) {
        const _this = this
        if (this.isTabChange) {
            return
        }
        const { scrollTop } = event;
        const skewY = 100 // 偏移量，由于吸顶的tab、头部的显示信息也有高度，素以做了偏移量
        if (scrollTop >= skewY) {
            if (!this.showTabs && this.currentTab <= 0) { // 在未显示tab并且 currentTab <= 0时，防止uview ui抖动bug，设置默认复位值
                this.currentTab = 0
            }
            this.showTabs = true
            this.$nextTick(() => {
                const length = this.distanceArr.length
                const index = this.distanceArr.findIndex(el => el - skewY - scrollTop > 0)
                // 当index  == -1 的时候，实际当前滚动的距离超出了最大值，也就是在最后一个tab显示的内容
                // 当index > 0 的时候，说明能在当前的scrollTop值找到，即index的前一位
                this.currentTab = index > 0 ? index - 1 : length - 1
            })
        } else {
            this.showTabs = false
        }
    },
    onShow() {
        this.getDistanceArr()
        this.getElementDistance();
    },
    methods: {
        getList() {
            let params = {
                id: this.id,
            }

            getSchoolinfo(params).then(res => {
                console.log("getSchoolinfo: ", res);
                this.schoolList = res;
            })

        },
        getElementDistance() {
            const query = uni.createSelectorQuery().in(this);
            query.select('.wrapper').boundingClientRect(data => {
                if (data) {
                    // 获取元素到页面顶部的距离
                    this.customNavHeight = data.top - 5;
                }
            }).exec();
        },
        // 获取所有元素在当前页面所处的位置信息
        getDistanceArr() {
            const _this = this
            _this.tabs.map(el => {
                uni.createSelectorQuery().select(el.id).boundingClientRect(data => {
                    // 获取当前ID距离顶部的top值
                    _this.distanceArr.push(data.top)
                }).exec()
            })
        },
        clickItem(item, index) {
            this.isTabChange = true
            const _this = this
            // this.$nextTick 保证当前isTabChange 为true后执行代码
            // 避免在istabChange变为true的时候，执行代码，监听事件还是会继续执行重新计算currenTab值
            this.$nextTick(() => {
                _this.currentTab = item.index
                uni.createSelectorQuery().select(item.id).boundingClientRect(data => {

                    uni.createSelectorQuery().select('.wrapper').boundingClientRect(res => {
                        const scrollTop = data.top - res.top // 获取差值
                        const skewY = 60 // 偏移
                        // 页面开始进行滚动到目标位置
                        uni.pageScrollTo({
                            scrollTop: scrollTop > 0 ? scrollTop - skewY : scrollTop + skewY,
                            duration: 300,
                            complete: function () {
                                const timer = setTimeout(() => {
                                    _this.isTabChange = false // 关闭
                                    clearTimeout(timer)
                                }, 500) // 解决ios和安卓、鸿蒙系统兼容性问题
                            }
                        });
                    }).exec()
                }).exec()
            })
        },
        // 长图展示，有bug，先进行隐藏
        previewImage(e) {
            let url = e.src;
            console.log("预览图片", url);
            let isHttp = (url || "").indexOf("http://") == 0 || (url || "").indexOf("https://") == 0
            if (isHttp) {
                uni.previewImage({
                    // 预览时，默认显示图片的索引
                    current: 0,
                    // 所有图片 url 地址的数组
                    urls: [url]
                })
            }
        }
    }
}
</script>

<style lang="scss">
.main {
    background: #fff;

    .tabs {
        position: sticky;
        z-index: 970;
        top: 0px;
        background-color: #fff;
        width: 100vw;

        .tabsStyle {
            box-shadow: 0 2rpx 6rpx 0 rgba(153, 153, 153, 0.2);
            padding: 0 30rpx;

            ::v-deep {
                .u-tabs {
                    box-shadow: 0px 4px 6px 0 rgba(153, 153, 153, 0.2);
                }
            }
        }
    }

    .section {
        width: 100%;
        padding: 0 30rpx;
        box-sizing: border-box;

        .top {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            height: 75rpx;

            .title {
                line-height: 75rpx;
                font-size: 32rpx;
                font-weight: 600;
                color: #333333;
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    width: 128rpx;
                    height: 12rpx;
                    background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #00BCB9;
                    border-radius: 6rpx;
                    bottom: 13rpx;
                    left: 0;
                }
            }

            .right {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20rpx;

                .dots {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 33rpx;
                    width: 26rpx;
                    align-items: center;
                    padding: 10rpx 20rpx;
                    margin-right: 4rpx;

                    .dot {
                        width: 9rpx;
                        height: 9rpx;
                        background: #000000;
                        border-radius: 50%;
                    }
                }

                .more_menu {
                    position: absolute;
                    top: 70rpx;
                    right: 0;
                    z-index: 99;
                    background: white;
                    padding: 0 20rpx;
                    box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
                    border-radius: 4rpx;

                    .more_menu_item {
                        font-size: 30rpx;
                        padding: 24rpx 180rpx 24rpx 16rpx;
                        white-space: nowrap;
                    }

                    .more_menu_item:not(:last-child) {
                        border-bottom: 1rpx solid #dddddd;
                    }
                }
            }
        }

        .content {
            background: #f8f8f9;
            border-radius: 30rpx;
            padding: 32rpx;
            margin-top: 20rpx;

            &_top {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                margin-bottom: 24rpx;

                &_name {
                    font-weight: bold;
                    color: #333333;
                    font-size: 32rpx;
                }

                &_ismySelf {
                    background: #eeeeee;
                    font-weight: 500;
                    color: #999999;
                    font-size: 24rpx;
                    margin-left: 12rpx;
                    padding: 6rpx 18rpx;
                    border-radius: 10rpx;
                }
            }

            &_Info {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                padding-bottom: 20rpx;
                margin-top: 20rpx;

                &_item {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    text-align: center;

                    &_label {
                        text-align: center;
                        font-size: 24rpx;
                        font-weight: 300;
                        color: #999999;
                    }

                    &_value {
                        font-size: 34rpx;
                        font-weight: bold;
                        color: #333333;
                        margin-top: 14rpx;
                    }
                }

                &_item:not(:last-child) {
                    position: relative;

                    &::after {
                        position: absolute;
                        content: '';
                        width: 1rpx;
                        height: 70rpx;
                        top: 20rpx;
                        right: 0;
                        background: #d8d8d8;
                    }
                }
            }

            &_Info:not(:last-child) {
                border-bottom: 1rpx solid #d8d8d8;
            }

            &_remark {
                font-weight: 400;
                color: #333333;
                font-size: 24rpx;
                padding-top: 20rpx;
                text-align: justify;
                min-height: 40rpx;
            }

            &_list {
                &_item {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    padding: 20rpx 0;
                    border-bottom: 1rpx solid #d8d8d8;

                    &_label {
                        font-size: 30rpx;
                        font-weight: 500;
                        color: #00bb84;
                        white-space: nowrap;
                        width: 180rpx;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    &_value {
                        font-size: 30rpx;
                        font-weight: 400;
                        color: #666666;
                        flex: 1;
                        margin-left: 40rpx;
                        align-self: center;
                        word-break: break-all;
                        text-align: justify;
                    }
                }

                &_empty {
                    height: 180rpx;
                    background: #f8f8f9;
                    border-radius: 10rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    &_tip {
                        font-size: 20rpx;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 20rpx;
                        line-height: 30rpx;
                    }

                    image {
                        width: 64rpx;
                        height: 50rpx;
                    }
                }

                &_emptyResult {
                    height: 240rpx;

                    image {
                        width: 166rpx;
                        height: 166rpx;
                    }

                    &_tip {
                        margin-top: 0;
                    }
                }
            }

            &.reset {
                padding: 0;
            }

            &_reportList {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-gap: 20rpx;

                &_pack {
                    width: 100%;
                    height: calc(25vw - 30rpx);
                    border-radius: 20rpx;
                }

                &_addImage {
                    width: 100%;
                    height: calc(25vw - 30rpx);
                    background: #f8f8f9;
                    border-radius: 20rpx;
                    // border: 2rpx dashed #bbbbbb;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    &_icon {
                        width: 60rpx;
                        height: 48rpx;
                    }

                    &_tip {
                        font-size: 20rpx;
                        font-weight: 400;
                        line-height: 30rpx;
                        color: #999999;
                        margin-top: 14rpx;
                    }
                }
            }
        }

        .content_progress {
            background: initial;
            padding: 0 30rpx;
        }

        .content_result {
            font-size: 30rpx;
            font-weight: 400;
            color: #666666;
            word-wrap: break-word;
            word-break: normal;
            line-height: 60rpx;
            letter-spacing: 2rpx;
            text-align: justify;
        }

        .content_report {
            background: initial;
            padding: 12rpx 0;
        }
    }

    .section:not(:first-child) {
        margin-top: 20rpx;
    }

    .md1-content {
        background: #EDFFF6;
        border-radius: 24rpx;
        display: flex;
        justify-content: space-between;
        padding: 30rpx;
        flex-wrap: wrap;

        .item {
            line-height: 75rpx;
            width: 40%;
            display: flex;
            align-items: center;

            .item-icon {}

            .item-score {
                margin-left: 8rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #333333;

                text {}
            }
        }
    }
}
</style>
