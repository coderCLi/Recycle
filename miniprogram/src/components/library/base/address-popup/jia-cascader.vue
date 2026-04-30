<template>
  <view class="uni-data-tree">
    <slot :data="gridText">
      <!-- 输入框 -->
      <view class="uni-data-tree-input" @click="handleInput">
        <view class="input-value" :class="{ 'input-value-border': border }">
          <!-- 展示选择的值 -->
          <scroll-view v-if="gridText" class="selected-area" scroll-x="true">
            <view class="selected-list">
              <view class="selected-item">
                <text style="color: #000">{{ gridText }}</text>
              </view>
            </view>
          </scroll-view>
          <!-- 提示信息 -->
          <text v-else class="selected-area placeholder">{{
            placeholder
          }}</text>
          <!-- 展示删除按钮 -->
          <!-- <view v-if="clearIcon && !readonly && gridText" class="icon-clear" @click.stop="clear">
						<view class="dialog-close">
							<view class="dialog-close-plus" data-id="close"></view>
							<view class="dialog-close-plus dialog-close-rotate" data-id="close"></view>
						</view>
					</view> -->
          <!-- 展示下拉图标 -->
          <view
            class="arrow-area"
            v-if="(!clearIcon || !gridText) && !readonly"
          >
            <view class="input-arrow"></view>
          </view>
        </view>
      </view>
    </slot>
    <!-- 遮罩层 -->
    <view
      class="uni-data-tree-cover"
      v-if="isOpened"
      @click="handleClose"
    ></view>
    <!-- 弹出层 -->
    <view
      ref="uni-data-tree-dialog"
      class="uni-data-tree-dialog"
      v-show="isOpened"
    >
      <view class="uni-popper__arrow"></view>
      <view class="dialog-caption">
        <view class="title-area">
          <text class="dialog-title">{{ popupTitle }}</text>
        </view>
        <view class="dialog-close" @click="handleClose">
          <view class="dialog-close-plus" data-id="close"></view>
          <view
            class="dialog-close-plus dialog-close-rotate"
            data-id="close"
          ></view>
        </view>
      </view>
      <tui-cascade-selection
      class="tui-selection-dialog"
        ref="gridSelet"
        v-bind="$attrs"
        @complete="complete"
        @change="onChange"
      ></tui-cascade-selection>
    </view>
  </view>
</template>

<script>
import tuiCascadeSelection from './select.vue'

export default {
  name: 'grid-cascade-selection',
  data () {
    return {
      isOpened: false,
      gridText: '',
    }
  },
  components: {
    tuiCascadeSelection
  },
  emits: ['popupopened', 'popupclosed', 'completeChange', 'inputChange'],

  props: {
    placeholder: {
      type: String,
      default: '请选择地区'
    },
    popupTitle: {
      type: String,
      default: '请选择'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearIcon: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  created () { },

  watch: {
    '$attrs.defaultItemList': {
      handler (newVal, oldVal) {
        console.log("newVal", newVal);
        console.log("oldVal", oldVal);
        if (!(newVal === oldVal)) {
          this.gridText = this.getInitValue()
          console.log("this.gridText", this.gridText);
        }
      }
    }
  },
  mounted () {
    console.log("this.$attrs.defaultItemList", this.$attrs.defaultItemList);
    this.gridText = this.getInitValue()
    console.log("this.gridText", this.gridText);
  },
  methods: {
    // 初始化默认值
    getInitValue () {
      let { defaultItemList, request } = this.$attrs
      let list = JSON.parse(JSON.stringify(defaultItemList || []))
      if ((typeof list[0] === 'string' || typeof list[0] === 'number') && !this.request) {
        return list.join('/')
      } else {
        let selsctArr = []
        list.forEach((item) => {
          selsctArr.push(item.cityName)
        })

        return selsctArr.join('/')
      }
    },
    // 选择完毕后触发
    complete (e) {
      console.log(e)
      let list = JSON.parse(JSON.stringify(e.result || []))
      let selsctArr = []
      list.forEach((item) => {
        selsctArr.push(item.cityName)
      })
      this.gridText = selsctArr.join('/')
      this.isOpened = false
      this.$emit('completeChange', e)
      this.$emit('popupclosed')
    },
    createSelector(clasName){ 
     
    },
    //展示
    show () {
      this.isOpened = true
      this.$emit('popupopened')
    },
    px2rpx (px) {
      let scale = uni.upx2px(100) / 100
      return px / scale
    },
    // 变化时触发
    onChange (e) {
      this.$emit('inputChange', e)
    },
    // 关闭
    hide () {
      this.isOpened = false
      this.$emit('popupclosed')
    },
    // 展示
    handleInput () {
      if (this.readonly) {
        return
      }
      this.show()
    },
    // 关闭
    handleClose (e) {
      this.hide()
    },
    // 删除按钮
    clear () {
      this.gridText = ''
      this.$refs.gridSelet.clear()
    }
  }
};
</script>

<style>
.uni-data-tree {
  position: relative;
  font-size: 24rpx;
}

.error-text {
  color: #dd524d;
}

.input-value {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 30rpx;
  line-height: 38px;
  padding: 0 10rpx;
  overflow: hidden;
  /* #ifdef APP-NVUE */
  height: 80rpx;
  /* #endif */
}

.input-value-border {
  /* border: 1rpx solid #e5e5e5; */
  border-radius: 5rpx;
}

.selected-area {
  flex: 1;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.load-more {
  /* #ifndef APP-NVUE */
  margin-right: auto;
  /* #endif */
  /* #ifdef APP-NVUE */
  width: 80rpx;
  /* #endif */
}

.selected-list {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: nowrap;
  /* padding: 0 10rpx; */
}

.selected-item {
  flex-direction: row;
  padding: 0 2rpx;
  /* #ifndef APP-NVUE */
  white-space: nowrap;
  /* #endif */
  display: -webkit-box; /* 将元素作为一个弹性盒子模型显示 */
    -webkit-box-orient: vertical; /* 设置弹性盒子的方向为垂直 */
    -webkit-line-clamp: 2; /* 设置最多显示两行 */
    overflow: hidden; /* 隐藏溢出的内容 */
    text-overflow: ellipsis; /* 文本溢出时显示省略号 */
    white-space: normal; /* 允许文本换行 */
    line-height: 1.2;
}

.placeholder {
  font-size: 30rpx;
  color: #bbbbbb;
}

.input-split-line {
  opacity: 0.5;
}

.arrow-area {
  position: relative;
  width: 40rpx;
  /* #ifndef APP-NVUE */
  margin-bottom: 5rpx;
  margin-left: auto;
  display: flex;
  /* #endif */
  justify-content: center;
  transform: rotate(-45deg);
  transform-origin: center;
}

.input-arrow {
  width: 14rpx;
  height: 14rpx;
  border-left: 1rpx solid #999;
  border-bottom: 1rpx solid #999;
}

.uni-data-tree-cover {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  z-index: 100;
}

.uni-data-tree-dialog {
  position: fixed;
  left: 0;
  /* top: 20%; */
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  z-index: 102;
  overflow: hidden;
  /* #ifdef APP-NVUE */
  width: 750rpx;
  /* #endif */
}

.dialog-caption {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  /* border-bottom: 1px solid #f0f0f0; */
}

.title-area {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  /* #ifndef APP-NVUE */
  margin: auto;
  /* #endif */
  padding: 0 20rpx;
}

.dialog-title {
  /* font-weight: bold; */
  line-height: 60rpx;
}

.dialog-close {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  padding: 0 30rpx;
  z-index: 999;
}

.dialog-close-plus {
  width: 16px;
  height: 2px;
  background-color: #666;
  border-radius: 2px;
  transform: rotate(45deg);
}

.dialog-close-rotate {
  position: absolute;
  transform: rotate(-45deg);
}

.picker-view {
  flex: 1;
  overflow: hidden;
}

/* #ifdef H5 */
@media all and (min-width: 768px) {
  .uni-data-tree-cover {
    background-color: transparent;
  }

  .uni-data-tree-dialog {
    position: absolute;
    top: 55px;
    /* height: auto; */
    /* min-height: 400px; */
    max-height: 50vh;
    background-color: #fff;
    /* border: 1px solid #ebeef5; */
    box-shadow: 0 2px 12px 0 rgba(134, 85, 85, 0.1);
    border-radius: 4px;
    overflow: unset;
  }

  .dialog-caption {
    display: none;
  }

  .icon-clear {
    margin-right: 5px;
  }
}

/* #endif */

/* picker 弹出层通用的指示小三角, todo：扩展至上下左右方向定位 */
/* #ifndef APP-NVUE */
.uni-popper__arrow,
.uni-popper__arrow::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
}

.uni-popper__arrow {
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  top: -6px;
  left: 10%;
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
}

.uni-popper__arrow::after {
  content: " ";
  top: 1px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: #fff;
}

/* #endif */
</style>
