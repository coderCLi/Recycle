<template>
  <view class="car-keyboard-container">
    <view class="car-keyboard-content">
      <!-- 1. 车牌类型选择 -->
      <view class="car-type-select">
        <view class="type-item" v-for="type in carTypes" :key="type.value"
          :class="{ active: currentCarType === type.value }" @click="switchCarType(type.value)">
          {{ type.label }}
        </view>
      </view>

      <!-- 2. 车牌号输入展示栏 -->
      <view class="car-num-show">
        <view class="num-item" v-for="(item, index) in carNum" :key="index" :class="{ active: index === currentInput }">
          {{ item || '' }}
        </view>
        <view class="num-item" v-if="currentInput === carNum.length && carNum.length < maxCarNumLength">
          {{ '' }}
        </view>
      </view>

      <!-- 3. 地区选择面板 -->
      <view class="area-select-wrap" v-if="keyboardType === 1">
        <view class="area-item" v-for="area in areas" :key="area.value" :data-val="area.value" @click="chooseArea">
          {{ area.label }}
        </view>
      </view>

      <!-- 4. 特殊字符面板（仅特殊车牌显示，无关闭按钮，通过特殊字符按钮切换） -->
      <view class="special-char-wrap" v-if="showSpecialChar && currentCarType === 'special'">
        <view class="char-item" @click="handleKeyClick('WJ')">WJ</view>
        <view class="char-item" @click="handleKeyClick('使')">使</view>
        <view class="char-item" @click="handleKeyClick('领')">领</view>
        <view class="char-item" @click="handleKeyClick('警')">警</view>
        <view class="char-item" @click="handleKeyClick('挂')">挂</view>
        <view class="char-item" @click="handleKeyClick('学')">学</view>
        <view class="char-item" @click="handleKeyClick('港')">港</view>
        <view class="char-item" @click="handleKeyClick('澳')">澳</view>
      </view>

      <!-- 5. 数字/字母/特殊字符混合键盘（优化布局，更美观） -->
      <view class="keyboard-wrap" v-if="keyboardType === 3">
        <!-- 字母行1：A B C D E F G H I（9个按键，均匀分布） -->
        <view class="keyboard-row">
          <view class="key-item" @click="handleKeyClick('A')">A</view>
          <view class="key-item" @click="handleKeyClick('B')">B</view>
          <view class="key-item" @click="handleKeyClick('C')">C</view>
          <view class="key-item" @click="handleKeyClick('D')">D</view>
          <view class="key-item" @click="handleKeyClick('E')">E</view>
          <view class="key-item" @click="handleKeyClick('F')">F</view>
          <view class="key-item" @click="handleKeyClick('G')">G</view>
          <view class="key-item" @click="handleKeyClick('H')">H</view>
          <view class="key-item" @click="handleKeyClick('I')">I</view>
        </view>
        <!-- 字母行2：J K L M N O P Q R（9个按键，均匀分布） -->
        <view class="keyboard-row">
          <view class="key-item" @click="handleKeyClick('J')">J</view>
          <view class="key-item" @click="handleKeyClick('K')">K</view>
          <view class="key-item" @click="handleKeyClick('L')">L</view>
          <view class="key-item" @click="handleKeyClick('M')">M</view>
          <view class="key-item" @click="handleKeyClick('N')">N</view>
          <view class="key-item" @click="handleKeyClick('O')">O</view>
          <view class="key-item" @click="handleKeyClick('P')">P</view>
          <view class="key-item" @click="handleKeyClick('Q')">Q</view>
          <view class="key-item" @click="handleKeyClick('R')">R</view>
        </view>
        <!-- 字母行3：S T U V W X Y Z（8个按键，居中分布，视觉更协调） -->
        <view class="keyboard-row center-row">
          <view class="key-item" @click="handleKeyClick('S')">S</view>
          <view class="key-item" @click="handleKeyClick('T')">T</view>
          <view class="key-item" @click="handleKeyClick('U')">U</view>
          <view class="key-item" @click="handleKeyClick('V')">V</view>
          <view class="key-item" @click="handleKeyClick('W')">W</view>
          <view class="key-item" @click="handleKeyClick('X')">X</view>
          <view class="key-item" @click="handleKeyClick('Y')">Y</view>
          <view class="key-item" @click="handleKeyClick('Z')">Z</view>
        </view>
        <!-- 数字行1：1 2 3 4 5 6 7 8 9（9个按键，均匀分布） -->
        <view class="keyboard-row">
          <view class="key-item" @click="handleKeyClick('1')">1</view>
          <view class="key-item" @click="handleKeyClick('2')">2</view>
          <view class="key-item" @click="handleKeyClick('3')">3</view>
          <view class="key-item" @click="handleKeyClick('4')">4</view>
          <view class="key-item" @click="handleKeyClick('5')">5</view>
          <view class="key-item" @click="handleKeyClick('6')">6</view>
          <view class="key-item" @click="handleKeyClick('7')">7</view>
          <view class="key-item" @click="handleKeyClick('8')">8</view>
          <view class="key-item" @click="handleKeyClick('9')">9</view>
        </view>
        <!-- 底部行：特殊字符/清空 + 0 + 删除（优化比例，更美观） -->
        <view class="keyboard-row bottom-row">
          <view class="key-item special" @click="handleSpecialCharClick" v-if="currentCarType === 'special'">
            特殊字符
          </view>
          <view class="key-item clear" @click="handleClearClick" v-else>
            清空
          </view>
          <view class="key-item zero" @click="handleKeyClick('0')">0</view>
          <view class="key-item del" @click="handleDelClick">删除</view>
        </view>
      </view>

      <!-- 完成按钮 -->
      <view class="complete-btn-wrap">
        <button class="complete-btn" @click="handleCompleteClick">完成</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CarNumberKeyboard',
  emits: ['change', 'complete'],
  data() {
    return {
      carNum: [],
      currentInput: 0,
      keyboardType: 1,
      currentCarType: 'normal',
      maxCarNumLength: 7,
      showSpecialChar: false, // 特殊字符面板显隐标识（仅由特殊字符按钮控制）
      carTypes: [
        { label: '普通车牌', value: 'normal' },
        { label: '新能源车牌', value: 'newEnergy' },
        { label: '特殊车牌', value: 'special' }
      ],
      areas: [
        { label: '京', value: '京' }, { label: '沪', value: '沪' },
        { label: '津', value: '津' }, { label: '渝', value: '渝' },
        { label: '冀', value: '冀' }, { label: '晋', value: '晋' },
        { label: '蒙', value: '蒙' }, { label: '辽', value: '辽' },
        { label: '吉', value: '吉' }, { label: '黑', value: '黑' },
        { label: '苏', value: '苏' }, { label: '浙', value: '浙' },
        { label: '皖', value: '皖' }, { label: '闽', value: '闽' },
        { label: '赣', value: '赣' }, { label: '鲁', value: '鲁' },
        { label: '豫', value: '豫' }, { label: '鄂', value: '鄂' },
        { label: '湘', value: '湘' }, { label: '粤', value: '粤' },
        { label: '桂', value: '桂' }, { label: '琼', value: '琼' },
        { label: '川', value: '川' }, { label: '贵', value: '贵' },
        { label: '云', value: '云' }, { label: '藏', value: '藏' },
        { label: '陕', value: '陕' }, { label: '甘', value: '甘' },
        { label: '青', value: '青' }, { label: '宁', value: '宁' },
        { label: '新', value: '新' }, { label: '港', value: '港' },
        { label: '澳', value: '澳' }, { label: '台', value: '台' }
      ]
    }
  },
  methods: {
    /**
     * 切换车牌类型
     * @param {String} type - 车牌类型值
     */
    switchCarType(type) {
      this.currentCarType = type
      if (type === 'normal') {
        this.maxCarNumLength = 7
      } else if (type === 'newEnergy') {
        this.maxCarNumLength = 8
      } else if (type === 'special') {
        this.maxCarNumLength = 9
      }
      // 切换车牌类型时隐藏特殊字符面板
      this.showSpecialChar = false
      this.carNum = []
      this.currentInput = 0
      this.keyboardType = 1
      this.$emit('change', this.carNum.join(''))
    },

    /**
     * 选择地区
     * @param {Object} event - 点击事件对象
     */
    chooseArea(event) {
      const areaVal = event.currentTarget.dataset.val
      if (this.currentCarType === 'special' && (this.carNum[0] === 'WJ' || this.carNum[0] === '使' || this.carNum[0] === '领')) {
        this.carNum[1] = areaVal
        this.currentInput = 2
      } else {
        this.carNum[0] = areaVal
        this.currentInput = 1
      }
      this.keyboardType = 3
      this.$emit('change', this.carNum.join(''))
    },

    /**
     * 数字/字母/特殊字符按键点击事件
     */
    handleKeyClick(keyVal) {
      if (this.currentInput >= this.maxCarNumLength) return
      this.carNum[this.currentInput] = keyVal
      this.currentInput++
      // 输入特殊字符后不自动隐藏面板，保持由按钮单独控制
      this.$emit('change', this.carNum.join(''))
    },

    /**
     * 删除按键点击事件
     */
    handleDelClick() {
      if (this.currentInput <= 0) return
      this.currentInput--
      this.carNum[this.currentInput] = ''
      if (this.currentInput === 0) {
        this.keyboardType = 1
      }
      this.$emit('change', this.carNum.join(''))
    },

    /**
     * 清空按键点击事件
     */
    handleClearClick() {
      this.carNum = []
      this.currentInput = 0
      this.keyboardType = 1
      this.$emit('change', this.carNum.join(''))
    },

    /**
     * 切换特殊字符面板显隐（仅由该按钮控制，无其他关闭入口）
     */
    handleSpecialCharClick() {
      this.showSpecialChar = !this.showSpecialChar
    },

    /**
     * 完成按钮点击事件
     */
    handleCompleteClick() {
      const carNumStr = this.carNum.join('')
      this.$emit('complete', carNumStr)
      uni.showToast({
        title: '输入完成',
        icon: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style scoped>
/* 组件整体容器 */
.car-keyboard-container {
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.03);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.car-keyboard-content {
  width: 750rpx;
  padding-bottom: 40rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-top: 20rpx;
  box-sizing: border-box;
  background-color: #f8f8f8;
  border-radius: 16rpx 16rpx 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* 车牌类型选择容器 */
.car-type-select {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 10rpx 0;
}

/* 车牌类型选项 */
.type-item {
  padding: 10rpx 24rpx;
  border: 1px solid #e5e5e5;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;
}

.type-item.active {
  background-color: #2c6fff;
  color: #fff;
  border-color: #2c6fff;
}

/* 车牌号展示栏 */
.car-num-show {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 30rpx;
  padding: 20rpx 0;
  flex-wrap: wrap;
}

/* 车牌号单个输入项 */
.num-item {
  width: 60rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border: 2px solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 32rpx;
  color: #333;
  background-color: #fff;
}

.num-item.active {
  border-color: #2c6fff;
  box-shadow: 0 0 10rpx rgba(44, 111, 255, 0.3);
}

/* 地区选择面板 */
.area-select-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  justify-content: flex-start;
}

/* 地区选项样式 */
.area-item {
  padding: 16rpx 24rpx;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;
}

.area-item:active {
  background-color: #f0f7ff;
  border-color: #2c6fff;
  color: #2c6fff;
}

/* 特殊字符面板（优化布局，更美观） */
.special-char-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  justify-content: center;
  /* 居中排列，提升美观度 */
  padding: 18rpx 10rpx;
  margin-bottom: 15rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  /* 轻微阴影，增强层次感 */
}

/* 特殊字符选项 */
.char-item {
  padding: 14rpx 22rpx;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;
  min-width: 80rpx;
  text-align: center;
}

.char-item:active {
  background-color: #f0f7ff;
  border-color: #2c6fff;
  color: #2c6fff;
  transform: scale(0.98);
  /* 点击微缩效果，提升交互体验 */
}

/* 数字/字母键盘容器 */
.keyboard-wrap {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  /* 缩小行间距，更紧凑美观 */
}

/* 键盘行样式（统一9键布局，均匀分布） */
.keyboard-row {
  display: flex;
  justify-content: space-between;
  gap: 8rpx;
  /* 缩小按键间距，视觉更协调 */
}

/* 8键居中行（字母S-Z） */
.center-row {
  justify-content: center;
  /* 居中排列 */
  gap: 8rpx;
  padding: 0 20rpx;
  /* 左右内边距，让布局更对称 */
}

/* 底部行样式 */
.bottom-row {
  justify-content: space-between;
  gap: 8rpx;
}

/* 键盘按键样式（优化尺寸，提升美观度） */
.key-item {
  flex: 1;
  height: 76rpx;
  /* 微调高度，更协调 */
  line-height: 76rpx;
  text-align: center;
  border: 1px solid #e5e5e5;
  border-radius: 10rpx;
  /* 更大圆角，更美观 */
  font-size: 30rpx;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.03);
  /* 轻微阴影，增强立体感 */
}

.key-item:active {
  background-color: #f0f7ff;
  border-color: #2c6fff;
  color: #2c6fff;
  transform: scale(0.98);
  /* 点击微缩效果，提升交互体验 */
}

/* 删除按键特殊样式 */
.key-item.del {
  background-color: #f5f5f5;
  color: #666;
  flex: 1.1;
  /* 微调比例，更美观 */
}

/* 清空按键特殊样式 */
.key-item.clear {
  background-color: #f5f5f5;
  color: #666;
  flex: 1.1;
}

/* 特殊字符按键样式 */
.key-item.special {
  background-color: #f0f7ff;
  color: #2c6fff;
  flex: 1.1;
  font-size: 26rpx;
  /* 适配文字长度，不溢出 */
}

/* 0按键特殊样式 */
.key-item.zero {
  flex: 1;
  /* 统一比例，视觉更协调 */
}

/* 完成按钮容器 */
.complete-btn-wrap {
  width: 100%;
  padding: 20rpx 30rpx 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

/* 完成按钮样式 */
.complete-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #2c6fff;
  color: #fff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  padding: 0;
  margin: 0;
  box-shadow: 0 4rpx 12rpx rgba(44, 111, 255, 0.2);
  /* 阴影增强美观度 */
  transition: all 0.2s ease;
}

.complete-btn:active {
  transform: scale(0.99);
  /* 点击微缩效果 */
  background-color: #1e5ed8;
  /* 深色反馈，提升交互体验 */
}

.complete-btn::after {
  border: none;
  /* 清除uni-app button默认边框 */
}
</style>