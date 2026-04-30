<!--
 * @Description: 通知公告
 * @Author: yulongchen
 * @Date: 2024-11-25 10:05:23
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-02-08 16:32:36
 * @Remark: 
-->
<template>
    <view class="component">
      <view class="notice">
        <image
          :src="staticBaseUrl + '/hbdimage/main/images/home/today-read-icon.png'"
          class="notice-img"
          mode="widthFix"
        ></image>
        <view class="text-big-box" :style="`padding-right:${moreContent ? '' : '10rpx'}`">
          <view class="notice-text" :animation="animationData">
            <view class="notice-item" v-for="(item, index) in dataList" @click="toPage(item)" :key="index">
              <view class="notice-type" :class="`${'政策' == item.tag ? 'policy' : 'info'}`">{{ item.tag }}</view>
              <view class="notice-content">
                {{ item.name }}
              </view>
               <view v-if="item.isTips == '1'" class="tip-card2">{{ item.tipText }}</view>
            </view>
          </view>
        </view>
        <view class="right-box" v-if="moreContent" @click.stop="toPage(moreContent)">
          <image
          :src="minioBaseUrl + 'common/pages-home/right-arrow.png'"
          class="right-img"
          mode="widthFix"
        ></image>
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
        title: "通知公告",
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                zxTimer: null,
                itemHeight: 0,
                currentIndex: 0,
                dataList: [],
                noticeY: 0,
                animationData: {}
            }
        },
        computed: {
          moreContent() {
            return this.list.value.find((e)=> {
              return e.orderFlag == 0 || e.orderFlag == '0'
            })
          }
        },
        watch: {
          'list.value': {
              handler(newVal) {
                let _arr = [];
                if (newVal) {
                  _arr = newVal.filter((e)=> {
                    return e.orderFlag != 0 && e.orderFlag != '0'
                  })
                }
                console.log('------------资讯--', _arr)
                let count = _arr.length;
                if (count > 2) {
                  this.dataList = [..._arr, _arr[0], _arr[1],  _arr[2]];
                } else {
                  this.dataList = [..._arr]
                }
                this.handleScroll();
              },
              deep: true,
              immediate: true
          }
        },
        mounted() {
          this.handleScroll();
            // console.log("propsData: ", this.toRaw(this.propsData), this.type.value, JSON.parse(JSON.stringify(props)));
        },
        methods: {
          handleScroll() {
            let list = this.list.value;
            if (list) {
              list = list.filter((e)=> {
                return e.orderFlag != 0 && e.orderFlag != '0'
              })
            }
            let count = list.length;
            if (count == 0) {
              this.clearTimer();
            } else {
              setTimeout(() => {
                this.calcBoxHeight().then(res => {
                  let boxHeight = res
                  this.itemHeight = boxHeight / this.dataList.length;
                  // console.dir(this.itemHeight);
                  if (boxHeight) {
                    if (list.length > 2) {
                      this.dataList = [...list, list[0], list[1], list[2]];
                      this.addTimer();
                    } else {
                      this.dataList = [...list];
                      this.clearTimer();
                    }
                  } else {
                    this.clearTimer();
                  }
                });
              }, 10);
            }
          },
          calcBoxHeight() {
            let that = this;
            return new Promise(async (resolve) => {
                this.$nextTick(()=> {
                  setTimeout(() => {
                    let query = uni.createSelectorQuery().in(that);
                    query
                      .select(".notice-text")
                      .boundingClientRect((data) => {
                        resolve(data?.height || data?.dataset?.height || 0);
                      })
                      .exec();
                  }, 10);
                })
            });
          },
          toPage(item){
            console.log("toPage: ", item);
            this.$emit("toPage", item);
          },
          addTimer() {
            if (!this.zxTimer) {
              this.currentIndex = 0;
              this.zxTimer = setInterval(() => {
                if (!this.itemHeight || this.itemHeight == 0) {
                  return;
                }
                // console.log('当前下标 ' + this.currentIndex);
                this.currentIndex = this.currentIndex + 1;
                this.noticeY = - this.currentIndex * this.itemHeight;

                let animation = uni.createAnimation({
                  duration: 600,
                  timingFunction: 'ease'
                })
                animation.translate(0, this.noticeY).step()
                this.animationData = animation.export()
                if (this.currentIndex > this.list.value.length - 1) {
                  setTimeout(() => {
                    this.currentIndex = 0
                    this.noticeY = - this.currentIndex * this.itemHeight;
                    let animation = uni.createAnimation({
                      duration: 0,
                      timingFunction: 'ease'
                    })
                    animation.translate(0, this.noticeY).step()
                    this.animationData = animation.export()
                  }, 600)
                }
              }, 5000);
            }
          },
          clearTimer() {
            clearInterval(this.zxTimer);
            this.zxTimer = null;
          }
        },
    }
</script>

<style lang="scss" scoped>
.notice {
  display: flex;
  margin: 0 auto 0;
  padding: 24rpx 0 24rpx 24rpx;
  border-radius: 20rpx;
  background: #fff;
  box-sizing: border-box;
  width: 100%;
}
.notice-img {
  width: 64rpx;
  margin-right: 24rpx;
  align-self: center;
  flex-shrink: 0;
}
.right-box {
  width: 60rpx;
  align-self: stretch;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .right-img {
    width: 10rpx;
    height: 18rpx;
  }
}

.notice-type {
  overflow: hidden;
  width: 72rpx;
  line-height: 32rpx;
  height: 32rpx;
  text-align: center;
  font-size: 22rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.notice-type.info {
  background: #f2fcfb;
  border: 2rpx solid #3ccdc8;
}

.notice-type.policy {
  background: #fef2f2;
  border: 2rpx solid #ff3d3e;
}
.notice-item {
  display: flex;
  align-items: center;
  padding: 6rpx 0;
}

.text-big-box {
  width: 88.5%;
  max-height: 96rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  overflow-y: hidden;
  .notice-text {
    position: relative;
    font-size: 24rpx;
    color: #37495f;
    width: 100%;
  }
}

.notice-content {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tip-card2 {
  margin-left: 3.5px;
  flex-shrink: 0;

  font-size: 7px;
  height: 12px;
  line-height: 12px;
  min-width: 12px;
  text-align: center;
  border-radius: 2px;
  overflow: hidden;
  background-color: red;
  color: rgba(255, 255, 255, 0.85);
}
</style>
