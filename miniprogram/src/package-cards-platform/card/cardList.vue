<!--
 * @Description: 卡券 列表
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-verification-detail ref="verificationDetail" />
    <vc-container class="main">
        <view style="position: fixed;width: 100%;height:0px;z-index: 0;">
            <view class="top-bg2" :style="`background-color:#F0F0F4;`"></view>
        </view>
        <!-- 顶部菜单 -->
        <view class="menus" :style="{ top: navigationBarInfo.totalHeight + 'px' }">
            <view class="menu-item" v-for="(item, index) in menus" :class="[activeIndex == index ? 'active' : '']"
                :key="item.id" @click="toggle(index, item.id)">
                {{ item.name }}
                <view v-if="activeIndex === index" class="line"></view>
            </view>
        </view>

        <!-- 列表 -->
        <view class="card-list" :style="{ paddingTop: '72px' }">
            <view v-for="(item, index) in cardList" :key="index" class="card-box">
                <view class="card-item">
                    <!-- 礼品券展示样式 -->
                    <view v-if="item.couponBaseType == '01'" class="lp-card-left"
                        :class="[item.getStatus == '0' ? '' : 'F5 ']" >
                         <!-- <image class="icon-left"
                                :src="item.getStatus == '0' ? staticBaseUrl + '/minio/hbdbucket/baseImage/icon-lpq.png' : staticBaseUrl + '/minio/hbdbucket/baseImage/icon-lpj-off.png'" mode="scaleToFill" /> -->
                        <image class="icon-left" :src="item.getStatus == '0' ? minioBaseUrl  + 'common/mctImages/icon-lpq.png' : minioBaseUrl  + 'common/mctImages/icon-lpj-off.png'" mode="scaleToFill" />
                        <view class="lp-text" :class="[item.getStatus == '0' ? '' : 'c52']" >礼品券</view>
                    </view>
                    <!-- 充电桩展示样式 -->
                    <!-- <view v-if="item.couponBaseType == '01'" class="lp-card-left-cdzq"
                        :class="[item.getStatus == '0' ? '' : 'F5 ']" >
                         <image class="icon-left"
                                :src="staticBaseUrl + '/minio/hbdbucket/baseImage/icon-cdzq.png'" mode="scaleToFill" />
                        <view class="lp-text" :class="[item.getStatus == '0' ? '' : 'c52']" >充电桩券</view>
                    </view> -->
                    <!-- 停车券展示样式 -->
                    <view v-else-if="item.couponBaseType == '04'" class="lp-card-left-tcq"
                        :class="[item.getStatus == '0' ? '' : 'F5 ']" >
                         <image class="icon-left"
                                :src="item.getStatus == '0' ? minioBaseUrl + 'common/mctImages/icon-tcq.png' : minioBaseUrl + 'common/mctImages/icon-tcq-off.png'" mode="scaleToFill" />
                        <view class="lp-text" :class="[item.getStatus == '0' ? '' : 'c52']" >停车券</view>
                    </view>
                    <!-- 非礼品券展示样式 -->
                    <view v-else class="card-item-left" :class="[item.getStatus == '0' ? '' : 'F5']">
                        <view class="card-item-left-top" :class="[item.getStatus == '0' ? '' : 'c52']">
                            <!-- 满减券 v-if="item.couponBaseType == '00'"-->
                            <text  v-if="item.couponBaseType == '00'" :class="[item.getStatus == '0' ? '' : ' c52']" class="mjq"><text class="icon-text mjq" :class="[item.getStatus == '0' ? '' : 'c52']" >￥</text><text style="font-size: 50rpx;">{{item.disAmt.split('.')[0] }}</text>.<text style="font-size: 20rpx;">{{item.disAmt.split('.')[1] }}</text></text>
                            <!-- 代金券 -->
                            <text v-if="item.couponBaseType == '03'" :class="[item.getStatus == '0' ? '' : ' c52']" class="djq"><text class="icon-text djq" :class="[item.getStatus == '0' ? '' : ' c52']">￥</text>{{
                                item.disAmt }}</text>
                            <!-- 折扣券 -->
                            <text v-if="item.couponBaseType == '02'" style="font-size: 50rpx;" class="zkq" :class="[item.getStatus == '0' ? '' : ' c52']" >{{
                                removeTrailingZeros(Number(item.disAmt)) }}<text class="icon-text zkq" :class="[item.getStatus == '0' ? '' : ' c52']"  >折</text></text>
                        </view>
                        <view class="card-item-left-bottom">
                            <!-- <text :class="[item.getStatus == '0' ? '' : 'b52 c52']">{{ item.disAmt }}{{ item.couponBaseType
                            == '02' ? 折 : '' }}</text> -->
                            <!-- zkq mjq djq -->
                            <text :class="[item.getStatus == '0' ? item.couponBaseType == '00' ? 'mj' : item.couponBaseType == '02' ? 'zkq' : 'djq' : 'b52 c52']">{{ item.couponBaseTypeName }}</text>
                        </view>
                    </view>
                    <view :class="item.couponBaseType == '01' ? 'lp-card-right' : 'card-item-right'" class="flex">
                        <view class="flex flex_col" style="align-items: flex-start;margin-left: 40rpx;"
                            :class="[item.getStatus == '3' ? 'langWidth' : 'comWidth']">
                            <view style="font-weight: 600;font-size: 30rpx;color: #000000;line-height:50rpx; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;">
                                {{ item.couponBaseName }}</view>
                            <view class="lineH40">
                                <text>有效期:{{ item.useStartTime }}至{{ item.useEndTime }}</text>
                            </view>
                            <view class="flex bottx" v-if="item.getStatus === '0'" @click="viewDetail(item)">使用说明
                                <up-icon v-if="!item.showDetail" name="arrow-down" size="14"
                                    style="margin-left: 4rpx;"></up-icon>
                                <up-icon v-else name="arrow-up" size="14" style="margin-left: 4rpx;"></up-icon>
                            </view>
                        </view>
                        <view style="width: 34%;justify-content: space-evenly;position:relative; "
                            class="flex flex_ac flex_col">
                            <!-- <view>半年售 7.1万+</view> 后台暂未支持 -->
                            <view v-if=" (item.getStatus === '0' && item.flag == '1') && item.couponBaseType !== '00' " @click="toPage(item)"
                                class="card-item-btn btnone">去使用</view>
                            <view
                                v-else-if="item.getStatus === '0' && (item.flag == '0' || !bridgeSdk.checkIsEmpty(item.flag))"
                                class="card-item-btn btntwo">不可使用</view>
                            <!-- 查看核销详情 -->
                            <!-- <view v-if="item.getStatus === '1' && item.couponBaseType == '04'"
                                class="card-item-btn plateNumberBox">
                                <view class="plateNumber">{{ item.plateNumber }}</view>
                                <view class="plateNumberDesc">需停车场二次核销</view>
                            </view> -->
                            <view v-if="item.getStatus === '1'" @click="goViewDetail(item)"
                                class="card-item-btn btntwo">查看</view>
                            <!--
                             <image v-if="item.getStatus === '0'" class="icon-image"
                            :src="staticBaseUrl + '/hbdimage/baseImage/icon-received.png'" mode="scaleToFill" />
                       -->
                            <image v-if="item.getStatus === '1'" class="icon-image"
                                :src="minioBaseUrl + 'common/mctImages/icon-ysy.png'" mode="scaleToFill" />
                            <image v-if="item.getStatus === '3'" class="icon-image"
                                :src="minioBaseUrl + 'common/mctImages/icon-ygq.png'" mode="scaleToFill" />
                        </view>
                    </view>
                </view>
                <!-- 详细说明 -->
                <view class="detail-cont" v-if="item.showDetail">
                    <view class="flex flex_col" style="align-items: flex-start;margin-left: 30rpx;">
                        <!-- item.couponBaseType == '00' -->
                         <view class="det-tx" v-if="item.couponBaseType == '00'">
                            <view>1、{{content}}</view>
                            <view>2、{{ item.useChannelName }}</view>
                        </view>
                        <view class="det-tx" v-else>
                            <!-- <view>1、{{ item.isSuperposition == 0
                                ? '不可叠加使用' : '最多可叠加' + item.superpositionMaxNum }}{{ item.isSuperposition == 0 ? '' : '张'
                                }}</view> -->
                            <view>1、{{ item.isUseMax == 0
                                ? '单日不限制使用张数' : '单日最多可使用' + item.useMaxNum }}{{ item.isUseMax == 0 ? '' : '张'
                                }}</view>
                            <view>2、{{ item.useChannelName }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <vc-empty v-if="cardList.length === 0"></vc-empty>
            <u-loadmore :status="status" v-if="cardList.length !== 0"></u-loadmore>
        </view>
        <vc-safe-bottom />
        <!-- <up-modal :show="parkUseShow" title="停车券激活绑定">
            <view class="">
                <input class="carNumberInput" v-model="carNumber" placeholder="请输入车牌号"></input>
            </view>
            <template #confirmButton>
                <view class="btn-group">
                    <button @click="cancelUsePark" class="btn-cancel">取消</button>
                    <button @click="confirmUsePark" class="btn-save">确认</button>
                </view>
            </template>
</up-modal> -->
        <view class="park-use-modal" v-if="parkUseShow">
            <view class="park-use-modal-box">
                <image class="park-use-modal-box-bg"
                    :src="minioBaseUrl + 'common/tabbarImages/alert_tingchequanjihuobangding_img.png'" />
                <view class="park-use-modal-box-content">
                    <view class="park-use-modal-box-content-input">
                        <image class="park-use-modal-box-content-input-icon"
                            :src="minioBaseUrl + 'common/tabbarImages/icon_carcard_img.png'" />
                        <input type="text" :disabled="true" v-model="carNumber" placeholder="请输入车牌号"
                            @click="licensePlateInputShow = true">
                    </view>
                    <view class="park-use-modal-box-content-row">
                        <image class="park-use-modal-box-content-row-icon"
                            :src="minioBaseUrl + 'common/tabbarImages/icon_nub01_img.png'" />
                        <view class="park-use-modal-box-content-row-text">车牌绑定后无法更改，请核实输入无误 ；</view>
                    </view>
                    <view class="park-use-modal-box-content-row">
                        <image class="park-use-modal-box-content-row-icon"
                            :src="minioBaseUrl + 'common/tabbarImages/icon_nub02_img.png'" />
                        <view class="park-use-modal-box-content-row-text">绑定后此券自动核销，停车出场支付时请按照 海创慧停平台要求操作；</view>
                    </view>
                    <view class="park-use-modal-box-content-col">
                        说明：
                        <view class="park-use-modal-box-content-col-text">本券仅限抵扣停车时长，不可折现、找零及兑换现金。</view>
                        <view class="park-use-modal-box-content-col-text">停车费按减免后时长计费，达单日封顶价则本券失效。</view>
                        <view class="park-use-modal-box-content-col-text">本券最终解释权归本停车场所有。</view>
                    </view>
                </view>
                <view class="park-use-modal-box-btn" @click="confirmUsePark">确定</view>
            </view>
            <view class="park-use-modal-close" @click="cancelUsePark">
                <up-icon name="close-circle" size="69rpx" color="#ffffff"></up-icon>
            </view>
        </view>
        <!-- <licensePlateInput v-if="licensePlateInputShow" v-model="carNumber" @complete="onComplete" @error="onError" /> -->
        <carNumberKeyboard v-if="licensePlateInputShow" @change="handleCarNumChange" @complete="handleCarNumComplete" />
    </vc-container>
</template>

<script>
import { getCouponListSec, userCouponForParking ,getJsonDetailById} from '../api/cardApi'
import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";

import licensePlateInput from "../components/licensePlateInput.vue"
import carNumberKeyboard from '../components/carNumberKeyboard.vue'
import vcVerificationDetail from '@/components/library/base/vc-verification-detail/index.vue'
export default {
    name: "cardList",
    components: {
        licensePlateInput,
        carNumberKeyboard,
        vcVerificationDetail
    },
    data() {
        return {
            list: [],
            activeIndex: 0,
            propsData: {
                props: {
                    title: {
                        value: '我的卡券'
                    },
                }
            },
            menus: [
                {
                    name: "待使用",
                    id: 0
                },
                {
                    name: "已使用",
                    id: 1
                },
                {
                    name: "已过期",
                    id: 3
                }
            ],

            searchStickTop: 0,
            cardId: 0,
            cardList: [],
            // couponBaseType 
            // 00 满减券
            // 01 立减券
            // 02 折扣券
            // 03 裂变券
            // 04 代金券
            userInfo: {},
            pageCurrent: 1,
            pageSize: 10,
            status: 'loadmore',
            needRefresh: false,

            parkUseShow: false, // 使用停车券弹窗显示状态
            carNumber: "", // 车牌号
            licensePlateInputShow: false,
            json_data_id: 'cardList-name',
            content:'',
        }
    },
    computed: {
        ...mapState(useBaseStore, {
            navigationBarInfo: "navigationBarInfo"
        })
    },
    async onLoad(options) {
        this.getAgreementDetail()
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__)
            return
        }
        this.__loadData__()
        // this.getList();
    },
    onShow() {
        // 检查是否需要刷新
        if (this.needRefresh) {
            this.pageCurrent = 1;
            this.status = 'loadmore';
            this.cardList = [];
            this.getList();

            // 刷新后重置标志，避免每次返回都刷新
            this.needRefresh = false;
        }
    },
    mounted() {

    },
    onReady() {
    },
    onUnload() {

    },
    onPullDownRefresh() {
        this.pageCurrent = 1;
        //调用获取数据方法
        this.getList()
        setTimeout(() => {
            //结束下拉刷新
            uni.stopPullDownRefresh();
        }, 1000);
    },
    onReachBottom() {
        let allTotal = this.pageCurrent * this.pageSize
        if (allTotal < this.total) {
            this.status = 'loading';
            this.pageCurrent++;
            this.getList()
        } else {
            // console.log('已加载全部数据')
            this.status = 'nomore';
        }
    },
    methods: {
        // 获取协议详情（JSON数据源）
        getAgreementDetail() {
            getJsonDetailById({
                id: this.json_data_id
            }).then(res=>{
                this.content = JSON.parse(res.content).content
            })
        },
        async __loadData__() {

            this.pageCurrent = 1;
            // 获取用户信息，可能为空
            this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
            // 用户信息为空时，不执行后续逻辑，组件vc-login会提示登录
            if (this.userInfo) {
                this.getList();
            }
        },
        //数字精度处理  100.00 -> 100 , 7.90 -> 7.9
        removeTrailingZeros(num) {
            let str = parseFloat(num.toFixed(10)).toString();
            let result = str.replace(/\.0+$/, '');
            // 如果结果中没有小数点，则转换为Number类型
            return result.includes('.') ? result : parseFloat(result);
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
        //根据分类id查条目列表
        getList() {
            getCouponListSec({
                getStatus: this.cardId,
                userId: this.userInfo.userId,
                page: this.pageCurrent,
                rows: this.pageSize
            }).then(res => {
                console.log("res", res);
                res.list.forEach(item => {
                    item.showDetail = false; // 详细说明默认隐藏
                })
                if (this.pageCurrent === 1) {
                    this.cardList = res.list || [];
                } else {
                    this.cardList = [...this.cardList, ...res.list]
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
        toggle(index, id) {
            this.activeIndex = index;
            this.cardId = id;
            this.pageCurrent = 1;
            this.status = 'loadmore';
            this.cardList = [];
            this.getList();
        },
        // 详细说明
        viewDetail(item) {
            item.showDetail = !item.showDetail;
        },
        toPage(item) { //跳转页面
            // 停车券输入车牌号使用
            if (item.couponBaseType == '04') {
                this.userGetId = item.userGetId;
                this.couponBaseId = item.couponBaseId;
                if (item.plateNumber) {
                    this.carNumber = item.plateNumber
                }
                this.parkUseShow = true
                return
            }
            // 其余跳转页面
            this.bridgeSdk.jumpPage({
                url: `/package-cards-platform/card/cardVerification?couponBaseId=${item.couponBaseId}&userGetId=${item.userGetId}`
            });
        },
        goViewDetail(item) { //查看核销详情
            // 打开核销详情弹框
            let detailItems = [
                { label: '核销类型', value: "核销" },
                { label: '核销时间', value: item.verificationTime || '' }
            ];
            // 只有当item.storeName存在时才添加核销门店
            if (item.storeName) {
                detailItems.push({ label: '核销门店', value: item.storeName });
            }
            detailItems.push(
                { label: '领取时间', value: item.getTime || '' },
                { label: '优惠券类型', value: item.couponBaseTypeName || '' },
                { label: '优惠券核销数量', value: '1张' },
                { label: '优惠券来源', value: item.fromSourceName }
            );
            // 只有当item.isSellName存在时才添加领取方式
            if (item.isSellName) {
                detailItems.push({ label: '领取方式', value: item.isSellName });
            }
            this.$refs.verificationDetail.open({
                productName: item.couponBaseName,
                detailItems: detailItems
            });
        },
        onComplete(value) {
            console.log('车牌输入完成:', value)
            uni.showToast({
                title: '车牌输入完成',
                icon: 'success'
            })
            this.licensePlateInputShow = false
        },

        onError(error) {
            console.log('输入错误:', error)
            uni.showToast({
                title: error.message,
                icon: 'error'
            })
            this.licensePlateInputShow = false
        },

        handleCarNumChange(val) {
            this.carNum = val
            console.log('车牌号实时更新：', val)
        },
        // 接收车牌号输入完成事件
        handleCarNumComplete(val) {
            console.log('车牌号输入完成：', val)
            // 可在此处做后续逻辑（如提交表单、校验格式等）
            // uni.showToast({
            //     title: `车牌号：${val}`,
            //     icon: 'success'
            // })
            this.carNumber = val
            this.licensePlateInputShow = false
        },
        confirmUsePark() {
            console.log(this.carNumber)
            this.carNumber = this.carNumber.toUpperCase().trim().replace(/\s+/g, '');
            if (!this.carNumber) {
                uni.showToast({
                    title: '请输入车牌号',
                    duration: 2000,
                    icon: "none"
                });
                return
            }
            // 中国大陆车牌号正则（普通+新能源，支持所有省份简称和发牌机关）
            // const licensePlateReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][ABCDEFGHJKLMNPQRSTUVWXYZ][0-9ABCDEFGHJKLMNPQRSTUVWXYZ]{5,6}$/;
            const licensePlateReg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5,6}$/;
            if (!licensePlateReg.test(this.carNumber)) {
                uni.showToast({
                    title: '请输入正确车牌号',
                    duration: 2000,
                    icon: "none"
                })
                return
            }
            userCouponForParking({
                userGetId: this.userGetId,
                couponBaseId: this.couponBaseId,
                userId: this.userInfo.userId,
                goodsId: '',
                sceneId: '',
                countNum: '1',
                couponType: "04",
                plateNumber: this.carNumber,
            }).then(res => {
                this.parkUseShow = false
                this.carNumber = ""
                this.pageCurrent = 1
                this.getList()
            })

        },
        cancelUsePark() {
            this.parkUseShow = false
            this.carNumber = ""
        }
    }
} 
</script>

<style lang="scss" scoped>
.main {
    background: #F0F0F4;
    height: 100vh;

    .menus {
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        font-size: 30rpx;
        color: #999999;
        line-height: 88rpx;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;

        .active {
            font-weight: bold;
            color: #FF6634;
        }

        .menu-item {
            position: relative;

            .line {
                display: block;
                width: 50rpx;
                height: 6rpx;
                background: #FF6634;
                position: absolute;
                bottom: 0rpx;
                left: 50%;
                z-index: 1;
                transform: translateX(-50%);
                border-radius: 10rpx;
            }
        }
    }

    .F5 {
        background-color: #DCDCDC !important;
    }

   

    .card-list {
        padding: 30rpx;
        position: relative;
        z-index: 1;

        .card-box {
            margin-bottom: 30rpx;
            border-radius: 20rpx;
            overflow: hidden;
        }

        .card-item {
            width: 100%;
            min-height: 182rpx;
            display: flex;
           .lp-card-left-cdzq{
                padding: 22rpx 46rpx;
                display: flex;
                width: 17%;
                background: rgba(41,187,242,0.1);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .icon-left{
                    width: 88rpx;
                    height: 88rpx;
                }
                .lp-text {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #29A5F2;
                }
           }
           .lp-card-left-tcq{
                padding: 22rpx 46rpx;
                display: flex;
                width: 15%;
                background: rgba(41,187,242,0.1);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .icon-left{
                    width: 88rpx;
                    height: 88rpx;
                }
                .lp-text {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #03C379;
                }

           }
            .lp-card-left {
                padding: 22rpx 46rpx;
                display: flex;
                width: 17%;
                background: rgba(252,80,65,0.1);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .icon-left{
                    width: 88rpx;
                    height: 88rpx;
                }
                .lp-text {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #FC5041;
                    /* 文字从上到下竖向排列 */
                    /* 文字保持直立 */
                    //    letter-spacing: 20rpx;
                }
                .cdzq{
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #29A5F2;
                }
            }

            .card-item-left {
                padding: 10rpx 0;
                // border-radius: 20rpx 0 0 20rpx;
                display: flex;
                width: 29%;
                background-color: #FFF3F3;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .card-item-left-top {
                    font-size: 27rpx;
                    color: #FF1E00;

                    .icon-text {
                        font-size: 27rpx;
                        color: #FF1E00;
                    }

                    text {

                        font-size: 40rpx;
                        font-weight: bold;
                    }
                }

                .card-item-left-bottom {
                    text {
                        color: #FF1E00;
                       // border-radius: 6rpx 6rpx 6rpx 6rpx;
                       // border: 1px solid #FF1E00;
                        font-weight: bold;
                        font-size: 27rpx;
                        padding: 4rpx 12rpx;
                    }
                    .zkq{
                        color: #FFA400 !important;
                    }
                    .mjq{
                        color: #FF3F00 !important;
                    }
                    .djq{
                        color: #FF6C00 !important;
                    }
                }
            }

            .card-item-right {
                padding: 20rpx 0;
                // border-radius: 0 20rpx 20rpx 0;
                width: 75%;
                background-color: #fff;
                font-size: 20rpx;
            }

            .lp-card-right {
                padding: 20rpx 0;
                // border-radius: 0 20rpx 20rpx 0;
                width: 85%;
                background-color: #fff;
                font-size: 20rpx;
            }

            .langWidth {
                width: 420rpx;
            }

            .comWidth {
                width: 330rpx;
                flex: 1;
            }

            .card-item-btn {
                position: absolute;
                right: 20rpx;
                top: 50%;
                transform: translateY(-50%);
            }

            .plateNumberBox {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .btnone {
                padding: 8rpx 20rpx;
                border: 1px solid #FF6634;
                border-radius: 50rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #FF6634;
                margin-right: 10rpx;
            }

            .btntwo {
                padding: 10rpx 20rpx;
                border: 1px solid #939494;
                border-radius: 32rpx;
                font-weight: bold;
                font-size: 22rpx;
                color: #939494;
            }
        }

        .detail-cont {
            width: 100%;
            border-radius: 0 0 20rpx 20rpx;
            background: #FFF9F7;

            .det-tx {
                color: #FF6C00;
                font-size: 24rpx;
                padding: 20rpx 0;
                line-height: 35rpx;
            }
        }
    }

    .lineH40 {
        line-height: 40rpx;
        font-weight: 400;
        font-size: 20rpx;
        color: #666666;
    }

    .bottx {
        font-size: 24rpx;
        margin-top: 10rpx;
        font-weight: 400;
        color: #333333;
    }

    .icon-image {
        height: 80rpx;
        width: 80rpx;
        position: absolute;
        right: 0;
        top: -20rpx;
    }

    .carNumberInput {
        height: 60rpx;
        font-size: 36rpx;
        // font-weight: 700;
        width: 480rpx;
        padding: 10rpx 20rpx;
        border: 1px solid #e1e1e1;
        border-radius: 4rpx;
    }

    .btn-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn-cancel {
        width: 260rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 32rpx;
        color: #666;
        background: #fafafa;
        border-radius: 40rpx;
    }

    .btn-save {
        width: 260rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 32rpx;
        color: #fff;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
        border-radius: 40rpx;
    }

    .park-use-modal {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.42);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .park-use-modal-box {
            width: 730rpx;
            height: 860rpx;
            position: relative;
            box-sizing: border-box;
            padding: 284rpx 104rpx 0;

            .park-use-modal-box-bg {
                width: 730rpx;
                height: 860rpx;
                position: absolute;
                z-index: 0;
                top: 0;
                left: 0;
            }

            .park-use-modal-box-content {
                width: 100%;
                position: relative;
                top: 16rpx;

                .park-use-modal-box-content-input {
                    width: 100%;
                    height: 84rpx;
                    background: #EFF9FE;

                    border-radius: 16rpx;
                    border: 2rpx solid #3FBEFF;
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                    padding: 0 28rpx;
                    margin-bottom: 30rpx;
                    font-size: 26rpx;

                    .park-use-modal-box-content-input-icon {
                        width: 48rpx;
                        height: 32rpx;
                        margin-right: 22rpx;

                    }
                }

                .park-use-modal-box-content-row {
                    width: 100%;
                    display: flex;
                    align-items: flex-start;

                    .park-use-modal-box-content-row-icon {
                        width: 28rpx;
                        height: 28rpx;
                        flex-shrink: 0;
                        margin-right: 16rpx;
                    }

                    .park-use-modal-box-content-row-text {
                        width: 480rpx;
                        font-weight: bold;
                        font-size: 24rpx;
                        color: #0A5094;
                        line-height: 40rpx;
                        text-align: left;
                    }
                }
                .park-use-modal-box-content-col{
                    width: 100%;
                    font-size: 22rpx;
                    color: #0A5094;
                    font-weight: bold;
                    .park-use-modal-box-content-col-text {
                        font-weight: bold;
                        font-size: 22rpx;
                        color: #0A5094;
                        text-align: left;
                        width: 103%;
                        line-height: 40rpx;
                    }
                }
            }

            .park-use-modal-box-btn {
                width: 318rpx;
                height: 84rpx;
                background: linear-gradient(90deg, #5587FA 0%, #37B1F7 100%);
                font-weight: 800;
                font-size: 32rpx;
                color: #FFFFFF;
                line-height: 84rpx;
                margin: 38rpx auto;
                text-align: center;
                border-radius: 42rpx;
                position: relative;

            }

        }

        .park-use-modal-close {
            margin-top: 44rpx;
        }
    }
}
.zkq{
   color: #FFA400 !important;
}
.mjq{
    color: #FF3F00 !important;
}
.djq{
    color: #FF6C00 !important;
}
 .c52 {
        color: #fff !important;
    }

    .b52 {
        //border: 1px solid #525252 !important;
        color: #fff !important;
    }
</style>
