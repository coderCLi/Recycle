<template>
  <view class="license-plate-input">
    <!-- 车牌展示区域 -->
    <view class="plate-display">
      <view class="display-container">
        <!-- 省份显示（可点击选择） -->
        <view 
          class="display-province"
          :class="{ 'display-province-active': !selectedProvince }"
          @click="showProvinceSelect = true"
        >
          <text>{{ selectedProvince || '省' }}</text>
        </view>
        
        <!-- 车牌号码输入框（单个格子） -->
        <view class="plate-input-container">
          <input
            ref="plateInputRef"
            v-model="plateNumberInput"
            class="plate-input"
            :class="{
              'plate-input-active': isInputFocused
            }"
            placeholder="请输入车牌号"
            :maxlength="maxLength"
            :disabled="!selectedProvince"
            @input="onPlateNumberInput"
            @focus="onInputFocus"
            @blur="onInputBlur"
            type="text"
            :adjust-position="false"
          />
          <!-- 输入提示 -->
          <text v-if="!plateNumberInput" class="input-placeholder">
            <!-- {{ getInputPlaceholder() }} -->
          </text>
        </view>
      </view>
      
      <!-- 删除按钮 -->
      <view 
        class="delete-btn" 
        @click="clearInput"
        :class="{ 'delete-btn-disabled': !plateNumberInput }"
      >
        <text>删除</text>
      </view>
    </view>

    <!-- 省份选择弹窗 -->
    <view v-if="showProvinceSelect" class="province-modal">
      <view class="modal-mask" @click="showProvinceSelect = false"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">选择省份</text>
          <view class="modal-close" @click="showProvinceSelect = false">
            <text>×</text>
          </view>
        </view>
        <view class="province-grid">
          <view 
            v-for="province in provinceList" 
            :key="province"
            class="province-grid-item"
            :class="{ 'province-grid-item-active': selectedProvince === province }"
            @click="selectProvince(province)"
          >
            <text>{{ province }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 车牌类型选择 -->
    <view class="type-section" v-if="showTypeSelect && selectedProvince">
      <text class="section-title">车牌类型</text>
      <view class="type-list">
        <view 
          v-for="type in plateTypes" 
          :key="type.value"
          class="type-item"
          :class="{ 'type-item-active': plateType === type.value }"
          @click="selectPlateType(type.value)"
        >
          <text>{{ type.label }}</text>
        </view>
      </view>
    </view>

    <!-- 自定义键盘 -->
    <view class="keyboard-section" v-if="showKeyboard && selectedProvince">
      <!-- 数字行 -->
      <view class="keyboard-row">
        <view 
          v-for="num in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']"
          :key="num"
          class="keyboard-key"
          @touchstart="onKeyTouchStart(num)"
          @touchend="onKeyTouchEnd"
          @click="onKeyboardInput(num)"
        >
          <text>{{ num }}</text>
        </view>
        <view 
          class="keyboard-key keyboard-key-delete"
          @touchstart="onDeleteTouchStart"
          @touchend="onKeyTouchEnd"
          @click="onDelete"
        >
          <text>删</text>
        </view>
      </view>
      
      <!-- 字母行1（Q-P，I/O置灰） -->
      <view class="keyboard-row">
        <view 
          v-for="char in keyboardRow1"
          :key="char"
          class="keyboard-key"
          :class="{ 'keyboard-key-disabled': char === 'I' || char === 'O' }"
          @touchstart="onKeyTouchStart(char)"
          @touchend="onKeyTouchEnd"
          @click="onKeyboardInput(char)"
          :data-char="char"
        >
          <text>{{ char }}</text>
        </view>
      </view>
      
      <!-- 字母行2（A-L） -->
      <view class="keyboard-row">
        <view 
          v-for="char in keyboardRow2"
          :key="char"
          class="keyboard-key"
          @touchstart="onKeyTouchStart(char)"
          @touchend="onKeyTouchEnd"
          @click="onKeyboardInput(char)"
        >
          <text>{{ char }}</text>
        </view>
      </view>
      
      <!-- 字母行3（Z-M） + 完成按钮 -->
      <view class="keyboard-row">
        <view 
          v-for="char in keyboardRow3"
          :key="char"
          class="keyboard-key"
          @touchstart="onKeyTouchStart(char)"
          @touchend="onKeyTouchEnd"
          @click="onKeyboardInput(char)"
        >
          <text>{{ char }}</text>
        </view>
        <view 
          class="keyboard-key keyboard-key-complete"
          @touchstart="onCompleteTouchStart"
          @touchend="onKeyTouchEnd"
          @click="completeInput"
        >
          <text>完成</text>
        </view>
      </view>
    </view>

    <!-- 输入提示 -->
    <view v-if="showInputTips && selectedProvince" class="input-tips">
      <text class="tips-text">{{ getInputTips() }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LicensePlateInput',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    showNewEnergy: {
      type: Boolean,
      default: true
    },
    autoShowTypeSelect: {
      type: Boolean,
      default: true
    },
    autoFocus: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'complete', 'focus', 'blur'],
  
  data() {
    return {
      provinceList: [
        '京', '津', '冀', '晋', '蒙', '辽', '吉', '黑',
        '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫',
        '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵',
        '云', '藏', '陕', '甘', '青', '宁', '新', '台',
        '港', '澳'
      ],
      
      plateTypes: [
        { value: 'normal', label: '普通车牌' },
        { value: 'newEnergy', label: '新能源车牌' }
      ],
      
      // 数据
      selectedProvince: '',
      plateType: 'normal',
      plateNumberInput: '',
      
      // 状态
      showProvinceSelect: false,
      showTypeSelect: true,
      showKeyboard: false,
      isInputFocused: false,
      showInputTips: true,
      
      // 键盘布局 - I和O字母将在数组中保留但通过样式置灰
      keyboardRow1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      keyboardRow2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      keyboardRow3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      
      // 禁用字符列表
      disabledChars: ['I', 'O'],
      
      // 触摸状态
      touchActive: false,
      touchValue: '',
      
      // 输入状态
      isCompleted: false
    }
  },
  
  computed: {
    maxLength() {
      return this.plateType === 'newEnergy' ? 8 : 7
    },
    
    plateValue() {
      if (!this.selectedProvince) return ''
      return `${this.selectedProvince}${this.plateNumberInput}`
    },
    
    inputLength() {
      return this.plateNumberInput.length
    },
    
    isInputComplete() {
      return this.inputLength === this.maxLength
    }
  },
  
  watch: {
    modelValue: {
      handler(newVal) {
        this.parseValue(newVal)
      },
      immediate: true
    },
    
    selectedProvince(newVal) {
      if (newVal) {
        this.showProvinceSelect = false
        this.showTypeSelect = this.autoShowTypeSelect
        if (!this.showTypeSelect) {
          this.focusInput()
        }
      }
      this.emitUpdate()
    },
    
    plateType() {
      this.emitUpdate()
    },
    
    plateNumberInput(newVal, oldVal) {
      this.emitUpdate()
      
      // 检查是否完成输入
      if (newVal.length === this.maxLength && !this.isCompleted) {
        this.autoComplete()
      }
    },
    
    showTypeSelect(newVal) {
      if (!newVal && this.selectedProvince) {
        this.focusInput()
      }
    }
  },
  
  mounted() {
    if (this.autoFocus && this.selectedProvince) {
      this.focusInput()
    }
  },
  
  methods: {
    parseValue(value) {
      if (!value) {
        this.reset()
        return
      }
      
      // 提取省份
      const province = value.charAt(0)
      if (this.provinceList.includes(province)) {
        this.selectedProvince = province
      }
      
      // 提取车牌号码部分
      const plateNumber = value.substring(1).toUpperCase()
      
      // 判断车牌类型
      if (plateNumber.length === 8) {
        this.plateType = 'newEnergy'
      } else {
        this.plateType = 'normal'
      }
      
      // 设置输入值
      this.plateNumberInput = plateNumber
      
      // 更新状态
      this.showTypeSelect = false
      this.isCompleted = true
    },
    
    selectProvince(province) {
      this.selectedProvince = province
      this.isCompleted = false
    },
    
    selectPlateType(type) {
      this.plateType = type
      this.showTypeSelect = false
      this.focusInput()
      this.isCompleted = false
    },
    
    focusInput() {
      this.showKeyboard = true
      this.isInputFocused = true
      this.$emit('focus')
    },
    
    onInputFocus() {
      if (!this.selectedProvince) {
        this.showProvinceSelect = true
        return
      }
      
      this.focusInput()
    },
    
    onInputBlur() {
      this.isInputFocused = false
      this.showKeyboard = false
      this.$emit('blur')
    },
    
    onPlateNumberInput(event) {
      const value = event.detail ? event.detail.value : event.target.value
      const processedValue = this.processInput(value)
      
      // 更新输入值
      this.plateNumberInput = processedValue
    },
    
    processInput(value) {
      // 转换为大写，过滤非法字符（保留数字和字母，但过滤I和O）
      let processed = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
      
      // 过滤掉I和O字符
      processed = processed.replace(/[IO]/g, '')
      
      // 根据车牌类型限制长度
      if (processed.length > this.maxLength) {
        processed = processed.substring(0, this.maxLength)
      }
      
      return processed
    },
    
    onKeyboardInput(value) {
      if (!this.selectedProvince) {
        this.showProvinceSelect = true
        return
      }
      
      // 检查是否为禁用字符
      if (this.disabledChars.includes(value.toUpperCase())) {
        return
      }
      
      // 获取当前输入值
      const current = this.plateNumberInput || ''
      let newInput = current + value.toUpperCase()
      
      // 限制长度
      if (newInput.length > this.maxLength) {
        newInput = newInput.substring(0, this.maxLength)
      }
      
      this.plateNumberInput = newInput
    },
    
    onDelete() {
      const current = this.plateNumberInput || ''
      if (current.length > 0) {
        this.plateNumberInput = current.substring(0, current.length - 1)
      }
    },
    
    clearInput() {
      this.plateNumberInput = ''
      this.isCompleted = false
      this.focusInput()
    },
    
    completeInput() {
      this.isCompleted = true
      this.showKeyboard = false
      this.$emit('complete', this.plateValue)
    },
    
    autoComplete() {
      // 延迟触发完成事件
      setTimeout(() => {
        if (this.isInputComplete) {
          this.isCompleted = true
          this.showKeyboard = false
          this.$emit('complete', this.plateValue)
        }
      }, 300)
    },
    
    getInputPlaceholder() {
      if (!this.selectedProvince) return '请先选择省份'
      
      if (this.plateType === 'newEnergy') {
        return '新能源车牌：8位'
      } else {
        return '普通车牌：7位'
      }
    },
    
    getInputTips() {
      if (!this.selectedProvince) return ''
      
      const currentLength = this.plateNumberInput.length
      const remaining = this.maxLength - currentLength
      
      if (remaining > 0) {
        return `还需要输入${remaining}位`
      } else if (currentLength === this.maxLength) {
        return '输入完成，可点击"完成"按钮'
      }
      
      return ''
    },
    
    emitUpdate() {
      this.$emit('update:modelValue', this.plateValue)
    },
    
    reset() {
      this.selectedProvince = ''
      this.plateType = 'normal'
      this.plateNumberInput = ''
      this.showTypeSelect = true
      this.showKeyboard = false
      this.isInputFocused = false
      this.isCompleted = false
      this.emitUpdate()
    },
    
    // 供外部调用的方法
    getPlateNumber() {
      return this.plateValue
    },
    
    focus() {
      if (this.selectedProvince) {
        this.focusInput()
      } else {
        this.showProvinceSelect = true
      }
    },
    
    // 检查是否输入完整
    isInputValid() {
      return this.selectedProvince && this.plateNumberInput.length === this.maxLength
    },
    
    // 触摸反馈
    onKeyTouchStart(value) {
      // 如果按键是禁用字符，不进行触摸反馈
      if (this.disabledChars.includes(value.toUpperCase())) {
        return
      }
      this.touchActive = true
      this.touchValue = value
    },
    
    onDeleteTouchStart() {
      this.touchActive = true
      this.touchValue = 'delete'
    },
    
    onCompleteTouchStart() {
      this.touchActive = true
      this.touchValue = 'complete'
    },
    
    onKeyTouchEnd() {
      this.touchActive = false
      this.touchValue = ''
    }
  },
  
  // 暴露给外部的方法
  exposed() {
    return {
      getPlateNumber: this.getPlateNumber,
      reset: this.reset,
      focus: this.focus,
      isInputValid: this.isInputValid
    }
  }
}
</script>

<style scoped>
.license-plate-input {
  width: 750rpx;
  position: absolute;
  z-index: 9999;
  padding-bottom: 40rpx;
  bottom: 0;
  left: 0;
}

/* 车牌展示区域 */
.plate-display {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.display-container {
  display: flex;
  align-items: center;
  flex: 1;
}

.display-province {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 52rpx;
  font-weight: bold;
  color: #333;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.display-province-active {
  background: rgba(255, 255, 255, 0.6);
  color: #999;
  border: 4rpx dashed rgba(255, 255, 255, 0.3);
}

.display-province:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.8);
}

/* 车牌输入容器 */
.plate-input-container {
  flex: 1;
  position: relative;
  /* height: 140rpx; */
}

.plate-input {
  width: auto;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12rpx;
  padding: 0 30rpx;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
  text-align: left;
  letter-spacing: 8rpx;
  flex-grow: 1;
}

.plate-input-active {
  border-color: #ff9500;
  background: #fff;
  animation: inputFocus 0.3s ease;
}

@keyframes inputFocus {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.plate-input:disabled {
  background: rgba(255, 255, 255, 0.6);
  color: #999;
}

.input-placeholder {
  position: absolute;
  top: 50%;
  left: 30rpx;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: #999;
  pointer-events: none;
  letter-spacing: normal;
}

/* 删除按钮 */
.delete-btn {
  width: 140rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  font-size: 32rpx;
  color: #ff3b30;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.delete-btn:active {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(0.95);
}

.delete-btn-disabled {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.6);
}

/* 省份选择弹窗 */
.province-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  padding: 40rpx;
  max-height: 70vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #999;
  transition: all 0.2s ease;
  cursor: pointer;
}

.modal-close:active {
  background: #e0e0e0;
}

.province-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20rpx;
}

.province-grid-item {
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #333;
  background: #f9f9f9;
  transition: all 0.2s ease;
  cursor: pointer;
}

.province-grid-item:active {
  background: #f0f0f0;
  transform: scale(0.95);
}

.province-grid-item-active {
  border-color: #007aff;
  background: #e6f2ff;
  color: #007aff;
}

/* 车牌类型选择 */
.type-section {
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
  font-weight: 500;
}

.type-list {
  display: flex;
  justify-content: space-around;
  gap: 20rpx;
}

.type-item {
  flex: 1;
  padding: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #666;
  background: #fff;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.type-item:active {
  background: #f5f5f5;
  transform: scale(0.98);
}

.type-item-active {
  border-color: #007aff;
  background: #e6f2ff;
  color: #007aff;
  font-weight: bold;
}

/* 键盘样式 */
.keyboard-section {
  background: #f0f0f0;
  border-top: 2rpx solid #e0e0e0;
  padding: 20rpx 10rpx;
  animation: keyboardSlideUp 0.3s ease;
}

@keyframes keyboardSlideUp {
  from {
    opacity: 0;
    transform: translateY(50rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin-bottom: 15rpx;
  padding: 0 5rpx;
}

.keyboard-key {
  flex: 1;
  height: 100rpx;
  margin: 0 5rpx;
  background: #fff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  min-width: 60rpx;
  max-width: 80rpx;
  cursor: pointer;
  user-select: none;
}

.keyboard-key:active {
  background: #e0e0e0;
  transform: scale(0.95);
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

/* 禁用按键样式 */
.keyboard-key-disabled {
  background: #f5f5f5 !important;
  color: #ccc !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}

.keyboard-key-disabled:active {
  background: #f5f5f5 !important;
  transform: none !important;
  box-shadow: none !important;
}

.keyboard-key-delete {
  flex: 1.5;
  max-width: 120rpx;
  background: #ff3b30;
  color: #fff;
  font-size: 32rpx;
}

.keyboard-key-complete {
  flex: 2;
  max-width: 200rpx;
  background: #007aff;
  color: #fff;
  font-size: 32rpx;
  margin-left: 10rpx;
}

/* 最后一行的字母键特殊处理 */
.keyboard-row:last-child .keyboard-key:not(.keyboard-key-complete) {
  flex: 1;
  max-width: 70rpx;
}

/* 输入提示 */
.input-tips {
  padding: 20rpx;
  text-align: center;
}

.tips-text {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}
</style>