import { defineStore } from 'pinia'

export default defineStore('points', {
    state: () => ({
        pointsOrderRes: {},// 积分商城预下单结果

        afterSaleInfo: {},// 售后商品信息
        apprealInfo: {},// 申述信息
    }),
    actions: {
        // 存储积分商城预下单结果
        setPointsOrderRes(val: any) {
            this.pointsOrderRes = Object.assign(this.pointsOrderRes, val);
        },
        // 存储售后商品信息
        setAfterSaleInfo(val: any) {
            this.afterSaleInfo = Object.assign(this.afterSaleInfo, val);
        },
        // 存储售后商品信息
        setApprealInfo(val: any) {
            this.apprealInfo = Object.assign(this.apprealInfo, val);
        },
    },
    persist: true,
})