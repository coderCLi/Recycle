<!--
 * @Description: 订单详情
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->

<template>
  <vc-container :props-data="propsData">
    <vc-login v-if="!isLogined" />
    <view v-else class="product-detail">
      <view class="product-status"> {{ productItem.orderStatusName }} </view>
      <view class="row">
        <view>
          <text class="row-title" style="font-weight: bold">
            订单编号:
            <text class="row-text">{{ productItem.orderId }}</text>
          </text>
        </view>
        <view v-if="productItem.orderStatusName == '退款中'">
          <text class="row-title" >
            原支付单号:
            <text class="row-text">{{ productItem.orOrderId }}</text>
          </text>
        </view>
        <view>
          <text
            class="row-title"
            v-if="productItem.mallScene == 'mall'">
            商城单号:
            <text class="row-text">{{
              productItem.shoppingOrderId
            }}</text></text>
        </view>
        <view>
          <text class="row-title">
            下单时间:
            <text class="row-text">
              {{ dataFamte(productItem.payDate, "yyyy-mm-dd") }}
              {{ dataFamte(productItem?.payTime, "hh:mm:ss") }}
            </text>
          </text>
        </view>
        <view
          class="row-title"
          v-if="productItem.orderStatusName == '付款完成'">
          支付完成时间:
          <text class="row-text">
            {{
            dataFamte(productItem.payEndTime, "yyyy-mm-dd hh:mm:ss")
          }}
          </text>
        </view>
      </view>
      <view class="row">
        <view v-for="item in subOrderInfo" :key="item.id">
          <view class="card-item-zi">
            <!-- <up-row justify="space-between" gutter="10">
      <up-col span="4"> -->
            <view class="left-box">
              <image
                v-if="!item.listPicUrl"
                style="height: 160rpx; widht: 160rpx"
                src="../static/uploadImg.png"
              />
              <up-lazy-load
                v-else
                :height="80"
                style="height: 160rpx; widht: 160rpx"
                border-radius="15"
                :error-img="errorImg"
                img-mode="scaleTiFill"
                :image="pickerUrl(item.listPicUrl)"></up-lazy-load>
            </view>
            <!-- </up-col>
      <up-col span="8"> -->
            <view class="demo-layout bg-purple-light right-box">
              <text class="right-text title"> {{ item.spuName }}</text>
              <view
                class="right-text"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;">
                <view class="">
                  <text class="paidAmount" style="font-size: 28rpx">¥ {{ item.subPayAmt }}</text>
                  <text
                    class="productAmount"
                    style="text-decoration-line: line-through">
                    ¥ {{ item.subOrderAmt }}</text>
                </view>
                <!-- <view class="productAmount" style="text-align: right"
                  >x{{ item.number }}</view
                >
                 -->
                </view>
              <view class="">
                {{ item.mctName }}
              </view>
            </view>
            <!-- </up-col>
    </up-row> -->
          </view>
        </view>

        <view class="">
          <!-- 订单描述:{{ getOrderDetail(this.subOrderInfo) }} -->
          <view class="" v-for="item in orderList" :key="item.name">
            <up-cell
              v-if="item.name != '商品图片'"
              size="large"
              :title="item.name"
              :value="item.value"></up-cell>
            <view class="" v-else>
              <image
                v-if="!item.value"
                src="../static/uploadImg.png"
              />
              <image
                v-else
                style="height: 160rpx; widht: 160rpx"
                :src="pickerUrl(item.value)"
              />
            </view>
          </view>
        </view>

        <view style="text-align: right" class="">
          <view class="price">
            <view style="margin-right: 10rpx">需付款</view>
            <view style="margin-right: 10rpx; color: #ff1f1f">
              ¥ {{ productItem.sumPayAmt }}</view>
            <view style="margin-right: 10rpx" class="triangle-down"></view>
          </view>
        </view>
      </view>
      <view class="row">
        <view class="row-title"
          ><text>{{ productItem.consignee }}</text>
          {{ productItem.mobile }}</view>

        <view class="row-text"> {{ getOrderProvince(productItem) }}</view>
        <view class=""> </view>
      </view>
    </view>
  </vc-container>
</template>

<script>
import product from '../components/product.vue'
import { mapState } from 'pinia'
import { getSubOrderInfo } from '../api/index'
import { useBaseStore, useUserStore } from "@/store/index"
export default {
  components: { product },
  data () {
    return {
      orderList: [],
      propsData: {
        props: {
          title: {
            value: '商品详情'
          },
          // fixed: {
          //   value: true,
          // },
          bgColor: {
            value: "#bcffe3",
          },
          barBgColor: {
            value: "#bcffe3",
          },

        }
      },
      subOrderInfo: [],
      productItem: {},
      isMct: false
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined"
    })
  },
  async onLoad (options) {
    //  await this.firstInit();   
    console.log('onLoad', options.productItem)
    this.productItem = await JSON.parse(options.productItem)
    console.log('productItem', this.productItem)
    await this.getOrder()
    this.isMct = options.isMctId
    this.getOrderDetail(this.subOrderInfo)
  },
  methods: {
    getOrderProvince (item) {
      if (item.mallScene == 'mall') {
        return item.province + item.city + item.district + item.address
      } else {
        return item.provinceName + item.cityName + item.districtName + item.addressName
      }
    },
    getOrderDetail (item) {
      item.forEach(i => {
        i.description.split(';').forEach(j => {
          console.log(j, item, i, 'j')
          this.orderList.push({
            name: j.split(':')[0],
            value: j.split(':')[1]
          })
        })
      })
      console.log(this.orderList)

    },
    onScrollToLower (e) {
      console.log('onScrollToLower')

    },
    async getOrder () {
      let res = await getSubOrderInfo({ orderId: this.productItem.orderId })
      this.subOrderInfo = res
      console.log(res, 'res')

    },
    pickerUrl (item) {
      if (item.includes('http://') || item.includes('https://')) return item
      return this.minioBaseUrl + item
    },
    dataFamte (item, type) {
      if (!item) return ''
      let data = ''
      if (type == 'yyyy-mm-dd') {
        let y = item.slice(0, 4)
        let m = item.slice(4, 6)
        let d = item.slice(6)
        data = y + '-' + m + '-' + d
      } else if (type == 'hh:mm:ss') {
        let h = item.slice(0, 2)
        let m = item.slice(2, 4)
        let s = item.slice(4)
        data = h + ':' + m + ':' + s
      } else if (type == 'yyyy-mm-dd hh:mm:ss') {
        let y = item.slice(0, 4)
        let m = item.slice(4, 6)
        let d = item.slice(6, 8)
        let h = item.slice(8, 10)
        let mm = item.slice(10, 12)
        let s = item.slice(12)
        data = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
      }
      return data
    },
  }
}
</script>

<style scoped lang="scss">
.product-detail {
  height: 100%;
  background: linear-gradient(180deg, #baffe1 0%, #d8f7e3 45%, #f5f6f8 100%);
  padding: 30rpx 40rpx;
  .product-status {
    font-size: 36rpx;
    color: #333;
    line-height: 50rpx;
    font-weight: bold;
  }
  .row {
    margin-top: 30rpx;
    background: #fff;
    border-radius: 20rpx;
    min-height: 100rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .row-title {
      color: #222;
      font-size: 30rpx;
    }
    .row-text {
      color: #777;
      font-size: 28rpx;
      line-height: 40rpx;
    }
    .price {
      font-weight: 600;
      font-size: 28rpx;
      color: #222222;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      display: flex;
      justify-content: end;
      align-items: center;
    }
  }
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent; /* 左边的透明边框 */
  border-right: 10rpx solid transparent; /* 右边的透明边框 */
  border-top: 15rpx solid #aaa;
}
.card-item-zi {
  margin: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
}
.left-box {
  position: relative;
  width: 160rpx;
  margin-right: 12rpx;
}
.left-icon {
  position: absolute;
  right: 0;
  top: 0;
}
.right-box {
  display: flex;
  height: 160rpx;
  flex-direction: column;
  justify-content: space-between;
}
.right-text {
  padding-left: 20rpx;
}
.title {
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 16px;
  font-weight: 600;
  font-size: 32rpx;
  color: #222222;
  line-height: 44rpx;
  text-align: left;
  font-style: normal;
}
.right-tag {
  border-radius: 10rpx;
  font-size: 24rpx;
  padding: 5rpx;
  background: #ccc;
  margin-right: 20rpx;
}
.right-price {
  color: red;
}
.right-sales {
  color: #999;
  font-size: 24rpx;
}
.card-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  padding: 20rpx 0;
}
.paidAmount {
  font-weight: bold;
  font-size: 24rpx;
  color: #ff1f1f;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
}
.productAmount {
  margin-left: 30rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #aaaaaa;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  /* text-decoration-line: line-through; */
}
</style>