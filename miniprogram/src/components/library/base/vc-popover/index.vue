<!--
 * @Description: 气泡弹窗
 * @Author: chenyulong
 * @Date: 2024-11-25 15:58:19
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-21 14:32:49
 * @Remark: 
-->
<template>
  <view class="component">
    <!-- 触发弹窗的文本 -->
    <view @click.stop="togglePopover">
      <slot></slot>
    </view>
    <!-- 弹出框 -->
    <transition name="scale">
      <view v-if="visible" class="popover">
        <view class="popover-arrow"></view>
        <view class="popover-content">
          <view class="popover-wrapper">
            <view 
              v-for="(action, index) in actions" 
              :key="index"
              class="item"
              @click="selectAction(action)">
              <view style="display: inline-block; position: relative; height: 69rpx; line-height: 69rpx; position: relative; font-size: 28rpx; text-align: center; color: #333333;">
                {{ action.name }}
                <view style="position: absolute; top: 0px; right: 0px;">
                  <view class="dot" v-if="action.messageCount && action.messageCount > 0">{{ action.messageCount > 99 ? "99" :  action.messageCount }}</view>
                </view>
              </view>
              <view class="line"></view>
            </view>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    uni.$on('pageScroll', () => {
      this.visible = false;
    });
  },
  methods: {
    togglePopover() {
      this.visible = !this.visible;
    },
    selectAction(action) {
      this.visible = !this.visible;
      this.$emit('select', action);
    },
    close() {
      this.visible = false;
    }
  },
};
</script>

<style scoped lang="scss">
.dot {
  background: #EE0032;
  position: absolute;
  top: 9rpx;
  left: -3rpx;
  font-weight: 500;
  font-size: 14rpx;
  height: 18rpx;
  border-radius: 9rpx;
  min-width: 18rpx;
  text-align: center;
  line-height: 18rpx;
  color: #FFFFFF;
}

.component {
  position: relative;
}

.popover {
  position: absolute;
  left: -250%;
  top: 60rpx;
  z-index: 1000;
  background-color: white;
  /* border: 1px solid #ccc; */
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  transform-origin: right top;
}

.popover-content {
  padding: 10rpx 22rpx;
  box-sizing: border-box;
  min-width: 200rpx;
  text-align: center;
  line-height: 66rpx;
  font-size: 28rpx;
  color: #333;
  position: relative;
  z-index: 2;
  .item {
    position: relative;
    .line {
      position: absolute;
      left: 0px;
      right: 6rpx;
      bottom: 0px;
      height: 1rpx;
      background: #D8D8D8;
    }
    &:last-child .line {
      display: none;
    }
  }
}

.popover-arrow {
  width: 0;
  height: 0;
  border-left: 26rpx solid transparent;
  border-right: 26rpx solid transparent;
  border-bottom: 26rpx solid white;
  position: absolute;
  /* 将箭头放在弹出框的顶部 */
  top: -10rpx; 
  /* 调整右侧间距 */
  right: 10px; 
  z-index: 1;
}

/* 缩放动画 */
.scale-enter-active, .scale-leave-active {
  /* transform-origin: right top; */
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* .scale-leave-active 在版本 <2.1.8 */
.scale-enter, .scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

.scale-enter-to, .scale-leave {
  transform: scale(1);
  opacity: 1;
}

</style>
