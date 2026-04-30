<!--
 * @Description: 商户列表
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container style="background-color: #f8f8f8;">
        <!-- 搜索框 -->
        <view style="text-align: center;padding-left: 20rpx">
            <u-input ref="input" class="input" height="80rpx" v-model="value" clearable placeholder="请输入商品名称"
            prefix-icon="search" @change="onChange">
                <template #suffix>
                    <text style="color: #d8d8d8;float: left;font-size: 38rpx;padding-right: 30rpx;">|</text>
                    <text @click="doSearch({ goodName: value })"
                    style="color: #00bcb8;font-size: 28rpx;line-height: 54rpx;font-weight: bold;margin-right: 20rpx;">
                    搜索
                    </text>
                </template>
            </u-input>
        </view>
        <!-- 商户列表 -->
        <scroll-view scroll-y  @scrolltolower="onScrollToLower" :style="{ height: height + 'rpx' }">
            <view v-for="item in merchantList" :key="item.storeId" @click="toDetail(item)">
                <merchant-item :item="item"></merchant-item>
            </view>
        </scroll-view>
    </vc-container>
</template>
<script>
import merchantItem from "../components/merchantItem.vue";
import { getStoreList } from "../api";
import { mapState } from "pinia";
import { useUserStore, useMctStore } from "@/store/index";
export default {
    data() {
        return {
            value: "",//搜索值
            height: 0,//scroll-view高度
            page: 1,//分页-页
            rows: 10,//分页-行
            total: 0,//总数
            latitude: "",// 纬度
            longitude: "",// 经度
            merchantList: [],//商户列表
            clock: null,//定时器对象
        };
    },
    components: { merchantItem },
    computed: {
        ...mapState(useUserStore, {
            isLogined: "isLogined",
        }),
    },
    async mounted() {
        this.merchantList = [];
        await this.getLat();
        const res = await this.bridgeSdk.getWindowInfo();
        const { statusBarHeight, navBarHeight, height } = await this.bridgeSdk.getDeviceInfo();
        console.log(res, this.$refs.input.$el.offsetHeight, "res");
        //scroll-view高度 = 屏幕高度 - 状态栏高度 - 导航栏高度 - 搜索框高度
        this.height = this.px2rpx(height - statusBarHeight - navBarHeight - this.$refs.input.$el.offsetHeight - 30);
        console.log(height, statusBarHeight, navBarHeight, this.$refs.input.$el.offsetHeight, this.height, "height");
        this.getMerchantList();

        uni.login({
            success:res=>{
                console.warn(res)
            }
        })
    },
    methods: {
        //px换算rpx
        px2rpx(px) {
            let scale = uni.upx2px(100) / 100;
            return px / scale - 40;
        },
        //获取经纬度
        getLat() {
            return new Promise((resolve, reject) => {
                this.bridgeSdk.getLocation(res => {
                    console.log(res, 'getLocation')
                    this.longitude = Number(res.lng)
                    this.latitude = Number(res.lat)
                    resolve(res)
                })
            })
        },
        //获取门店列表
        async getMerchantList() {
            let res = await getStoreList({
                storeName: this.value,
                page: this.page,
                rows: this.rows,
                latitude: this.latitude,
                longitude: this.longitude,
                loginFlag: 0,
            });
            console.log(res, "res");
            this.merchantList = [...this.merchantList, ...res.list.map(e=>({
                ...e,
                distance: (Number(e.distance) / 1000).toFixed(1)
            }))]
            this.total = res.total;
        },
        //触底加载
        onScrollToLower() {
            if(this.total > this.merchantList.length) {
                this.page += 1;
                this.getMerchantList();
            }
        },
        //输入框改变
        onChange(value) {
            if(this.clock) clearTimeout(this.clock);
            this.clock = setTimeout(() => {
                this.page = 1;
                this.merchantList = [];
                this.getMerchantList();
            }, 500);
        },
        //搜索
        doSearch() {
            this.page = 1;
            this.merchantList = [];
            this.getMerchantList();
        },
        //门店详情
        toDetail(item) {
            useMctStore().clearCartList()
            this.bridgeSdk.jumpPage({
                url: `/package-product-list/merchantDetail/merchantDetailCoupon?storeId=${item.storeId}&mctId=${item.mctId}`,
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.merchant {
    height: 100%;
}
.input {
    margin-top: 24rpx;
    margin-bottom: 24rpx;
    background: #fff;
    border-radius: 42rpx;
    width: 670rpx;
}
</style>