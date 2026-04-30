<!--
 * @Description: 商品瀑布流
 * @Author: yulongchen
 * @Date: 2024-11-25 21:07:28
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-04 10:14:02
 * @Remark: 
-->
<template>
  <view class="component">
    <up-waterfall v-model="flowList" ref="uWaterfallRef">
      <template v-slot:left="{leftList}">
        <view class="food-list">
          <view 
            class="food-item left-item" 
            v-for="(item, index) in leftList" 
            :key="index">
              <!-- <up-lazy-load
                class="food-item-img"
                threshold="-450" 
                border-radius="10" 
                :image="importMainStatic(item.imgurl)" 
                :loading-img="importMainStatic('home/rank/lazy-load.png')"
                :index="index">
              </up-lazy-load> -->
              <up-lazy-load
                class="food-item-img"
                threshold="-450" 
                border-radius="10" 
                :image="staticBaseUrl + item.imgurl" 
                :loading-img="staticBaseUrl + '/static/images/home/rank/lazy-load.png'"
                :index="index">
              </up-lazy-load>
            <view class="food-text food-title">{{item.title}}</view>
            <view class="food-text food-info">{{item.desc}}</view>
          </view>
        </view>
      </template>
      <template v-slot:right="{rightList}">
        <view class="food-list">
          <view class="food-item right-item" 
            v-for="(item, index) in rightList" 
            :key="index">
            <!-- <up-lazy-load
              class="food-item-img"
              threshold="-450" 
              border-radius="10" 
              :image="importMainStatic(item.imgurl)" 
              :loading-img="importMainStatic('home/rank/lazy-load.png')"
              :index="index">
            </up-lazy-load> -->
            <up-lazy-load
              class="food-item-img"
              threshold="-450" 
              border-radius="10" 
              :image="staticBaseUrl + item.imgurl" 
              :loading-img="staticBaseUrl + '/static/images/home/rank/lazy-load.png'"
              :index="index">
            </up-lazy-load>
              <!-- 商品排行榜 -->
              <view v-if="item.rank" class="rank-list">
                <view class="rank-list-item" 
                  v-for="(rankItem, rankIndex) in rightList.slice(1, 4)" 
                  :key="rankIndex">
                  <image class="rank-icon" :src="staticBaseUrl + rankItem.imgurl" mode="contain"></image>
                  <view class="rank-text">
                    <view class="rank-text-title">{{rankItem.title}}</view>
                    <view class="rank-text-info">{{rankItem.desc}}</view>
                  </view>
              </view>
            </view>
            <!-- 商品描述 -->
            <template v-else>
              <view class="food-text food-title">{{item.title}}</view>
              <view class="food-text food-info">{{item.desc}}</view>
            </template>
          </view>
        </view>
      </template>
    </up-waterfall>
    <up-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></up-loadmore>
  </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    export default {
        belong,
        mixins: [mixins],
        title: "商品瀑布流",
        data() {
            return {
              ...JSON.parse(JSON.stringify(props)),
              flowList: [],
				      loadStatus: 'loadmore',
            }
        },
        
        mounted() {
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
            this.page = 1;
            this.addRandomData();
        },

        methods: {
          loadMore(){
            this.loadStatus = 'loading';
            // 模拟数据加载
            setTimeout(() => {
                this.addRandomData();
                this.loadStatus = 'loadmore';
                this.page++;
            }, 1000)
          },
          addRandomData() {
				    for(let i = 0; i < 10; i++) {
                // let index = this.$u.random(1, 3);
                // console.log('index', index);
                // 	// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
                // 	let item = JSON.parse(JSON.stringify(this.list[index]))
                const item = {
                    imgurl: `/static/images/home/rank/food-1.png`,
                    title: `美食推荐-${i + 1}`,
                    desc: `吃得开心，才是真的开心-${i + 1}`,
                };
                // console.log('item', item);
                item.id = this.$u.guid();
                this.flowList.push(item);
            }
            if(this.page == 1){
                this.flowList.splice(1, 0, {
                    imgurl: `/static/images/home/rank/rank.png`,
                    rank: 1,
                });
            }
			    }
        }
    }
</script>

<style lang="scss" scoped>
.u-loadmore {
  background-color: transparent !important;
}

.food-list {
  padding-top: 24rpx;
  
  .food-item {
    margin-bottom: 24rpx;
    border-radius: 20rpx;
    background: white;
    padding-bottom: 20rpx;
    position: relative;

    &.left-item {
      margin-right: 8rpx;
    }

    &.right-item {
      margin-left: 8rpx;
    }
    
    .food-item-img {
      width: 100%;
    }

    .food-text {
      padding: 0 24rpx;
      line-height: 44rpx;
      padding-top: 12rpx;
    }

    .food-title {
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
      line-height: 40rpx;
    }
    
    .food-info {
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 33rpx;
    }

    .rank-list {
      position: absolute;
      top: 60px;
      left: 10px;
      right: 10px;
      z-index: 1;
    }

    .rank-list-item {
      display: flex;
      align-items: center;
      padding: 10rpx;
      border-radius: 16rpx;
      background-color: white;
      margin-bottom: 8rpx;
    }

    .rank-icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 10rpx;
      align-self: flex-start;
      border-radius: 14rpx;
    }

    .rank-text-title {
      font-weight: 600;
      font-size: 24rpx;
      line-height: 33rpx;
    }

    .rank-text-info {
      font-weight: 400;
      font-size: 18rpx;
      color: #666666;
      line-height: 25rpx;
    }
  }
}    
</style>