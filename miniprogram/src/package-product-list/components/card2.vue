<template>
    <view class="card-item">
        <view class="card-start-line">
            <view class="amt"> </view>
            <view class="gray" v-if="item.refundStatus == '02'">已退款</view>
            <view  v-else :class="item.status == '成功' ? 'green' : (item.status == '失败' ? 'red' : 'blue')">{{ item.status }}</view>
        </view>
        <view class="card-first-line">
            <view class="amt">{{ item.payAmt }}</view>
            <view class="time">{{ item.createTime }}</view>
        </view>
        <view class="card-first-line">
            <view class="amt">{{ item.goodsName }}</view>
            <view class="time">{{ item.bizSceneName }}</view>
        </view>
        <view class="card-second-line">
            <view class="type">{{ item.payChnl }}</view>
            <view class="line">{{ item.payMthd }}</view>
        </view>
    </view>
</template>

<script>

export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    }
}
</script>

<style scoped lang="scss">
.card-item {
    width: 100%;
    margin: 10rpx auto;
    background-color: #fff;
    border-radius: 10rpx;
    // box-shadow: 0 0 10rpx rgba(0,0,0,0.1);
    padding: 20rpx 30rpx;
    box-sizing: border-box;

    .card-start-line {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 10rpx;

        .status {
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }

        .red {
            color: #f00;
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }
        
        .gray {
            color: #999;
            font-size: 36rpx;
            font-weight: bold;
        }

        .green {
            color: #0f0;
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }

        .blue {
            color: #00f;
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }
    }

    .card-first-line {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .amt {
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }

        .time {
            font-size: 24rpx;
            color: #999;
        }
    }

    .card-second-line {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .type {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
        }

        .line {
            font-size: 24rpx;
            color: #999;
        }
    }
}
</style>