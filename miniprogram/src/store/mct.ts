/*
 * @Description: 当前商户
 * @Author: 陈保磊
 * @Date: 2025-01-21
 * @Remark: 
 */
import { defineStore } from 'pinia'

export default defineStore('mct', {
    state: () => ({
      mctInfo: {},
      mctUserId: '',
      detailInfo:{},
      // 切换商户时当前的mctId
      mctId: '',
      order: {},
      productItem: {},
      couponInfo: {},
      couponDetailInfo:{},

      cartList: [] as any,// 购物车列表
      orderShoppingAll: [],//订单商品列表
      orderStoreId: '',//订单当前门店id
      orderMctId: '',//订单当前商户id
      orderId: '',//订单编号
      orderInfo: {},//当前订单信息
      orderAddress: {},//当前订单地址信息
      orderCoupon: {},//当前订单优惠券信息
      apprealInfo: {},// 当前申诉信息
    }),
    getters: {},
    actions: {
      setApprealInfo(val: any) {
        this.apprealInfo = Object.assign(this.apprealInfo, val);
      },
      // 更新商户信息
      setMctInfo(val: any) {
        this.mctInfo = Object.assign(this.mctInfo, val);
      },
      setMctUserId(val: string) {
        this.mctUserId = val
      },
      setDetailInfo(val: any) {
        this.detailInfo = Object.assign(this.mctInfo, val);
      },
      setMctId(val: string) {
        this.mctId = val
      },
      setOrder(val: any) {
        this.order = Object.assign(this.order, val);
      },
      setProductItem(val: any) {
        this.productItem = Object.assign(this.productItem, val);
      },
      setCouponInfo(val: any) {
        this.couponInfo = Object.assign(this.couponInfo, val);
      },
      setCouponDetailInfo(val: any) {
        this.couponDetailInfo = Object.assign(this.couponDetailInfo, val);
      },
      setDataCleaning() {
        this.mctInfo = {};
        this.mctUserId = '';
        this.detailInfo ={};
        this.mctId = '',
        this.order = {},
        this.productItem = {},
        this.couponInfo = {},
        this.couponDetailInfo={} 
      },
      //更新购物车列表
      updateCartList(val: any) {
        this.cartList = val
      },
      //添加购物车列表
      addCartList(val: any) {
        this.cartList.push(val)
      },
      //删除购物车商品
      reduceCartList(val: any) {
        this.cartList.splice(this.cartList.findIndex((e: { skuId: any; }) => e.skuId == val.skuId), 1)
      },
      //清空购物车列表
      clearCartList() {
        this.cartList = []
      },
      //更新订单商品列表
      setOrderShoppingAll(val: any) {
        this.orderShoppingAll = val
      },
      //更新订单当前门店id
      setOrderStoreId(val: any) {
        this.orderStoreId = val
      },
      //更新订单当前商户id
      setOrderMctId(val: any) {
        this.orderMctId = val
      },
      //更新当前订单信息
      setOrderInfo(val: any) {
        this.orderInfo = val;
      },
      //更新订单id
      setOrderId(val: any) {
        console.log(val)
        this.orderId = val
      },
      //更新当前订单地址信息（用于再次支付）
      setOrderAddress(val: any) {
        this.orderAddress = val
      },
      //更新当前订单优惠券信息（用于再次支付）
      setOrderCoupon(val: any) {
        this.orderCoupon = val
      },
      //清除订单信息
      clearOrderInfo() {
        this.orderInfo = {}
      },
      //清除订单商品信息
      clearOrderShoppingAll() {
        this.orderShoppingAll = []
      },
      //清除订单门店id
      clearOrderStoreId() {
        this.orderStoreId = ''
      },
      //清除订单商户id
      clearOrderMctId() {
        this.orderMctId = ''
      },
      //清除当前订单地址信息
      clearOrderAddress() {
        this.orderAddress = {}
      },
      //清除当前订单优惠券信息
      clearOrderCoupon() {
        this.orderCoupon = ''
      },
  },
  persist: true,
  }
)