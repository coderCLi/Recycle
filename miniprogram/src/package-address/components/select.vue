<template>
  <view class="tui-cascade-selection">
    <!-- 头部导航栏 -->
    <!-- <scroll-view
			scroll-x
			scroll-with-animation
			:scroll-into-view="scrollViewId"
			:style="{ backgroundColor: headerBgColor }"
			class="tui-bottom-line"
			:class="{ 'tui-btm-none': !headerLine }"
		> -->
    <view
      class="tui-selection-header"
      :style="{ height: tabsHeight, backgroundColor: backgroundColor }"
    >
      <view
        class="tui-header-item"
        :class="{ 'tui-font-bold': idx === currentTab && bold }"
        :style="{
          color: idx === currentTab ? getActiveColor : color,
          fontSize: size + 'rpx',
        }"
        :id="`id_${idx}`"
        @tap.stop="swichNav"
        :data-current="idx"
        v-for="(item, idx) in selectedArr"
        style="flex: 1"
        :key="idx"
      >
        <view class="tui-header-item-text">
          {{ item.cityName || "请选择" }}
          <view
            class="tui-active-line"
            :style="{ backgroundColor: getLineColor }"
            v-if="idx === currentTab && showLine"
          ></view>
        </view>
      </view>
    </view>
    <!-- </scroll-view> -->
    <!-- 视图切换器 -->
    <swiper
      class="tui-selection-list"
      :current="defTab"
      duration="300"
      @change="switchTab"
      :style="{ height: height, backgroundColor: backgroundColor }"
    >
      <swiper-item v-for="(item, index) in selectedArr" :key="index">
        <scroll-view
          scroll-y
          :scroll-into-view="item.scrollViewId"
          class="tui-selection-item"
          :style="{ height: height }"
        >
          <view class="tui-first-item" ref="firstItem" :style="{ height: firstItemTop }"></view>
          <view
            class="tui-selection-cell"
            :style="{ padding: padding, backgroundColor: backgroundColor }"
            :id="`id_${subIndex}`"
            v-for="(subItem, subIndex) in item.list"
            :key="subIndex"
            @tap.stop="change(index, subIndex, subItem)"
          >
            <icon
              type="success_no_circle"
              v-if="item.index === subIndex"
              :color="getCkMarkColor"
              :size="checkMarkSize"
              class="tui-icon-success"
            ></icon>
            <image
              :src="subItem.src"
              v-if="subItem.src"
              class="tui-cell-img"
              :style="{
                width: imgWidth,
                height: imgHeight,
                borderRadius: radius,
              }"
            ></image>
            <view
              class="tui-cell-title"
              :class="{
                'tui-font-bold': item.index === subIndex && textBold,
                'tui-flex-shrink': nowrap,
              }"
              :style="{
                color: item.index === subIndex ? textActiveColor : textColor,
                fontSize: textSize + 'rpx',
              }"
            >
              {{ subItem.cityName }}
            </view>
            <view
              class="tui-cell-sub_title"
              :style="{ color: subTextColor, fontSize: subTextSize + 'rpx' }"
              v-if="subItem.subText"
              >{{ subItem.subText }}</view
            >
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: {
    /**
           * 如果下一级是请求返回，则为第一级数据，否则所有数据
           * 数据格式
            [{
              src: "",
              text: "",
              subText: "",
              value: 0,
              children:[{
                text: "",
                subText: "",
                value: 0,
                children:[]
             }]
            }]
           * */
    itemList: {
      type: Array,
      default: () => {
        return []
      }
    },
    /*
           初始化默认选中数据
           [{
          text: "",//选中text
          subText: '',//选中subText
          value: '',//选中value
          src: '', //选中src，没有则传空或不传
          index: 0, //选中数据在当前layer索引
          list: [{src: "", text: "", subText: "", value: 101}] //当前layer下所有数据集合
          }];

           */
    defaultItemList: {
      type: Array,
      default () {
        return []
      }
    },
    defaultKey: {
      type: String,
      default: 'text'
    },
    //是否显示header底部细线
    headerLine: {
      type: Boolean,
      default: true
    },
    //header背景颜色
    headerBgColor: {
      type: String,
      default: '#FFFFFF'
    },
    //顶部标签栏高度
    tabsHeight: {
      type: String,
      default: '88rpx'
    },
    //默认显示文字
    text: {
      type: String,
      default: '请选择'
    },
    //tabs 文字大小
    size: {
      type: Number,
      default: 28
    },
    //tabs 文字颜色
    color: {
      type: String,
      default: '#555'
    },
    //选中颜色
    activeColor: {
      type: String,
      default: ''
    },
    //选中后文字加粗
    bold: {
      type: Boolean,
      default: true
    },
    //选中后是否显示底部线条
    showLine: {
      type: Boolean,
      default: true
    },
    //线条颜色
    lineColor: {
      type: String,
      default: ''
    },
    //icon 大小
    checkMarkSize: {
      type: Number,
      default: 15
    },
    //icon 颜色
    checkMarkColor: {
      type: String,
      default: ''
    },
    //item 图片宽度
    imgWidth: {
      type: String,
      default: '40rpx'
    },
    //item 图片高度
    imgHeight: {
      type: String,
      default: '40rpx'
    },
    //图片圆角
    radius: {
      type: String,
      default: '50%'
    },
    //item text颜色
    textColor: {
      type: String,
      default: '#333'
    },
    textActiveColor: {
      type: String,
      default: '#333'
    },
    //选中后字体是否加粗
    textBold: {
      type: Boolean,
      default: true
    },
    //item text字体大小
    textSize: {
      type: Number,
      default: 28
    },
    //text 是否不换行
    nowrap: {
      type: Boolean,
      default: false
    },
    //item subText颜色
    subTextColor: {
      type: String,
      default: '#999'
    },
    //item subText字体大小
    subTextSize: {
      type: Number,
      default: 24
    },
    // item padding
    padding: {
      type: String,
      default: '20rpx 30rpx'
    },
    //占位高度，第一条数据距离顶部距离
    firstItemTop: {
      type: String,
      default: '20rpx'
    },
    //swiper 高度
    // height: {
    //   type: String,
    //   default: '300px'
    // },
    //item  swiper 内容部分背景颜色
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    //子集数据是否请求返回（默认false，一次性返回所有数据）
    request: {
      type: Boolean,
      default: false
    },
    //子级数据（当有改变时，默认当前选中项新增子级数据，request=true时生效）
    receiveData: {
      type: Array,
      default: () => {
        return []
      }
    },
    //改变值则重置数据
    reset: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getActiveColor () {
      return this.activeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc'
    },
    getLineColor () {
      return this.lineColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc'
    },
    getCkMarkColor () {
      return this.checkMarkColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc'
    }
  },
  watch: {
    itemList (val) {
      this.initData(val, -1)
    },
    receiveData (val) {
      this.subLevelData(val, this.currentTab)
    },
    reset () {
      this.initData(this.itemList, -1)
    },
    defaultItemList (val) {
      this.setDefaultData(val)
    }
  },
  data () {
    return {
      currentTab: 0, //滚动的索引
      defTab: 0,
      //tab栏scrollview滚动的位置
      scrollViewId: 'id__1',
      selectedArr: [], //可以选择的数组,
      height:"300px"
    }
  },

  created () {
    this.setDefaultData(this.defaultItemList)
  },
  methods: {
    heightChange(height){
      this.height = height
    },
    clear: function () {
      this.initData(this.itemList, -1)
    },

    /**
     * 切换当前激活的标签页
     * @param {Object} e 事件对象，携带切换后的当前标签页信息
     * @returns 无返回值
     */
    switchTab: function (e) {
      // 更新当前激活的标签页
      this.currentTab = e.detail.current
      // 检查并处理可能的错误或状态变化
      this.checkCor()
    },
    /**
     * 检查并更新当前选项卡的滚动视图ID。
     * 该函数首先根据当前选中的选项卡索引，更新一个指定对象的scrollViewId属性，
     * 然后根据选项卡的索引调整全局的scrollViewId。
     * 此函数不接受参数，并且没有返回值。
     */
    checkCor: function () {
      // 获取当前选项卡对应的项，并设置其scrollViewId为一个固定的初始值
      let item = this.selectedArr[this.currentTab]
      item.scrollViewId = 'id__1'

      // 使用$nextTick确保DOM更新后，设置一个延时操作来更新item的scrollViewId
      this.$nextTick(() => {
        setTimeout(() => {
          // 根据item的index值计算新的scrollViewId，并更新item的scrollViewId
          let val = item.index < 2 ? 0 : Number(item.index - 2)
          item.scrollViewId = `id_${val}`
        }, 20)
      })

      // 根据当前Tab的索引，更新全局的scrollViewId
      if (this.currentTab > 1) {
        this.scrollViewId = `id_${this.currentTab - 1}`
      } else {
        this.scrollViewId = `id_0`
      }
    },
    /**
     * 初始化数据函数
     * @param {Array} data 要初始化的数据数组
     * @param {Number} layer 数据所在的层级
     * @description 根据传入的数据和层级，对数据进行初始化处理。如果数据为空或不存在，则不执行任何操作。
     *              如果已有请求，则处理第一级数据；否则，根据选定的值或默认条件来处理数据。
     */
    initData (data, layer) {
      // 检查数据是否为空，若为空则不执行后续操作
      if (!data || data.length === 0) return
      if (this.request) {
        // 当已有请求时，处理第一级数据
        this.subLevelData(data, layer)
      } else {
        let selectedValue = this.selectedValue || {}

        // 检查是否有选定的类型，若有则设置默认数据
        if (selectedValue.type) {
          this.setDefaultData(selectedValue)
        } else {
          // 无选定类型时，根据层级获取并处理数据列表
          this.subLevelData(this.getItemList(layer, -1), layer)
        }
      }
    },
    /**
     * 处理子级数据选择逻辑
     * @param {Array} data - 提供选择的数据数组
     * @param {number} layer - 当前选择的层级
     * 完成选择时，会通过$emit发送选择结果；重置数据时，更新selectedArr以备下次选择。
     */
    subLevelData (data, layer) {
      // 当数据为空或不存在时，处理完成选择或重置数据的逻辑
      if (!data || data.length === 0) {
        if (layer == -1) return
        // 完成选择逻辑，根据当前层级更新selectedArr，并删除不需要的属性
        let arr = this.selectedArr
        if (layer < arr.length - 1) {
          let newArr = arr.slice(0, layer + 1)
          this.selectedArr = newArr
        }
        let result = JSON.parse(JSON.stringify(this.selectedArr))
        let lastItem = result[result.length - 1] || {}
        let text = ''
        result.map((item) => {
          text += item.cityName
          delete item['list']
          // 清理不需要传递的属性
          delete item['scrollViewId']
          return item
        })
        // 发送选择完成的事件
        this.$emit('complete', {
          result: result,
          value: lastItem.cityNo,
          cityName: text,
          subText: lastItem.subText,
          src: lastItem.src
        })
      } else {
        // 重置数据逻辑，根据当前层级更新selectedArr，并设置默认选项
        let item = [
          {
            cityName: this.cityName,
            subText: '',
            cityNo: '',
            src: '',
            index: -1,
            scrollViewId: 'id__1',
            list: data
          }
        ]
        if (layer == -1) {
          this.selectedArr = item
        } else {
          let retainArr = this.selectedArr.slice(0, layer + 1) || []
          this.selectedArr = retainArr.concat(item)
        }
        // 更新当前选项卡与滚动视图ID，以适应界面显示
        let current = this.selectedArr.length - 1
        if (current >= this.currentTab) {
          this.defTab = this.currentTab
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.defTab = current
            this.currentTab = current
            // 更新滚动视图ID，用于定位当前选项卡
            this.scrollViewId = `id_${this.currentTab > 1 ? this.currentTab - 1 : 0}`
          }, 50)
        })
      }
    },
    /**
     * 从数据中移除所有子项属性
     * @param {Array} data - 包含具有子项属性的对象的数组
     * @returns {Array} 返回一个移除了子项属性的新数组
     */
    removeChildren (data) {
      // 遍历数据数组，移除每个对象中的子项属性，并返回新数组
      let list = data.map((item) => {
        delete item['children']
        return item
      })
      return list
    },
    /**
     * 根据指定层号和索引获取项目列表。
     * @param {number} layer - 层号，用于指定要获取的项目列表所在的层级。
     * @param {number} index - 当前层的索引值，用于指定要获取的具体项目。
     * @param {Array} selectedArr - 已选择的项目数组，用于在多层选择时追踪已选择的项。
     * @returns {Array} 返回一个项目列表数组。
     */
    getItemList (layer, index, selectedArr) {
      let list = []
      let arr = JSON.parse(JSON.stringify(this.itemList)) // 创建itemList的深拷贝。
      selectedArr = selectedArr || this.selectedArr // 如果未提供selectedArr，则使用默认的selectedArr。
      if (layer == -1) {
        // 如果layer为-1，移除所有子项，返回最顶层的项目列表。
        list = this.removeChildren(arr)
      } else {
        // 根据提供的layer和index，获取对应层的项目列表。
        let value = selectedArr[0].index
        value = value === undefined || value == -1 ? index : value
        if (arr[value] && arr[value].children) {
          list = arr[value].children
        }
        // 如果layer大于0，则继续深入层级获取更具体的项目列表。
        if (layer > 0) {
          for (let i = 1; i < layer + 1; i++) {
            let val = layer === i ? index : selectedArr[i].index
            list = val === -1 ? [] : list[val].children || []
            if (list.length === 0) break // 如果获取的列表为空，则终止循环。
          }
        }
        // 移除list中的所有子项，确保返回的列表不包含子级项目。
        list = this.removeChildren(list)
      }
      return list
    },
    /**
     * 设置默认数据
     * @param val 可以是数组，用于设置默认选中的项目。如果为空或未定义，则不执行任何操作。
     */
    setDefaultData (val) {
      // 创建一个与传入值（如果存在）相同的数组，用于后续处理
      let defaultItemList = JSON.parse(JSON.stringify(val || []))

      // 当默认项目列表不为空时
      if (defaultItemList.length > 0) {
        // 检查默认列表的首元素是否为字符串或数字，并且没有发起请求
        if ((typeof defaultItemList[0] === 'string' || typeof defaultItemList[0] === 'number') && !this.request) {
          // 初始化变量用于记录子项索引和已选择的数组
          let subi = -1
          let selectedArr = []
          // 遍历默认项目列表
          for (let j = 0, len = defaultItemList.length; j < len; j++) {
            let item = defaultItemList[j]
            let list = []
            let obj = {}
            // 对于第一个元素，获取初始项目列表；对于其他元素，基于前一个元素的子项索引和已选择数组获取项目列表
            if (j === 0) {
              list = this.getItemList(-1)
            } else {
              list = this.getItemList(j - 1, subi, selectedArr)
            }
            // 获取当前项目在列表中的默认索引
            subi = this.getDefaultIndex(list, item)
            // 如果找到了当前项目的索引，则将其相关信息添加到已选择数组中
            if (subi !== -1) {
              obj = list[subi]
              selectedArr.push({
                cityName: obj.cityName || this.cityName,
                cityNo: obj.cityNo || '',
                src: obj.src || '',
                subText: obj.subText || '',
                index: subi,
                scrollViewId: `id_${subi}`,
                list: list
              })
            }

            // 如果找不到当前项目的索引，跳出循环
            if (subi === -1) break
          }
          // 更新已选择数组和默认标签
          this.selectedArr = selectedArr
          this.defTab = this.currentTab
          // 使用$nextTick确保DOM更新后，设置当前标签并校正位置
          this.$nextTick(() => {
            setTimeout(() => {
              this.currentTab = selectedArr.length - 1
              this.defTab = this.currentTab
              this.checkCor()
            }, 20)
          })
        } else {
          // 如果默认列表的首元素不是字符串或数字，或已发起请求，则直接使用默认列表生成已选择数组
          defaultItemList.map((item) => {
            item.scrollViewId = `id_${item.index}`
          })
          this.selectedArr = defaultItemList
          this.defTab = this.currentTab
          // 同样，在DOM更新后设置当前标签并校正位置
          this.$nextTick(() => {
            setTimeout(() => {
              this.currentTab = defaultItemList.length - 1
              this.defTab = this.currentTab
              this.checkCor()
            }, 20)
          })
        }
      } else {
        // 如果默认项目列表为空，则使用初始化数据
        this.initData(this.itemList, -1)
      }
    },
    /**
     * 点击标题切换当前选项卡
     * @param {Object} e 事件对象，包含了触发事件的元素信息
     * 无返回值
     */
    swichNav: function (e) {
      // 获取当前点击元素的数据当前索引
      let cur = e.currentTarget.dataset.current
      // 如果当前选项卡不是点击的选项卡
      if (this.currentTab != cur) {
        // 先将当前选项卡保存为默认选项卡
        this.defTab = this.currentTab
        // 使用setTimeout延时20毫秒后，切换到点击的选项卡，并更新默认选项卡
        setTimeout(() => {
          this.currentTab = cur
          this.defTab = this.currentTab
        }, 20)
      }
    },
    /**
     * 处理选项更改事件。
     * @param {number} index 主选项索引。
     * @param {number} subIndex 子选项索引。
     * @param {Object} subItem 子选项对象，包含文本、值、子文本和图片源等属性。
     * 此函数更新当前选定项的索引和属性，并根据条件触发数据更新或事件emit。
     */
    change (index, subIndex, subItem) {
      let item = this.selectedArr[index] // 获取当前选定的主选项对象

      // 如果选定的子选项索引未改变，则不进行任何操作
      if (item.index == subIndex) return

      // 更新选定项的索引和属性
      item.index = subIndex
      item.cityName = subItem.cityName
      item.cityNo = subItem.cityNo
      item.subText = subItem.subText || '' // 如果存在子文本则更新，否则设为空字符串
      item.src = subItem.src || '' // 如果存在图片源则更新，否则设为空字符串

      // 发出选项更改事件，包含当前层索引、子选项索引和子选项详细信息
      this.$emit('change', {
        layer: index,
        subIndex: subIndex, //layer=> Array index
        ...subItem
      })

      // 如果未进行异步请求，则根据当前索引和子索引获取下级选项列表并更新
      if (!this.request) {
        let data = this.getItemList(index, subIndex)
        this.subLevelData(data, index)
      }
    },
    /**
     * 获取给定数组中与指定值匹配的默认索引。
     * @param {Array} arr - 待搜索的数组。
     * @param {any} val - 要在数组中查找的值。
     * @returns {number} 如果找到匹配项，则返回匹配项的索引；如果没有找到或输入数组为空、undefined，或指定值未定义，则返回-1。
     */
    getDefaultIndex (arr, val) {
      // 当数组不存在、为空，或指定值未定义时，直接返回-1
      if (!arr || arr.length === 0 || val === undefined) return -1
      let index = -1 // 默认索引值初始化为-1
      let key = this.defaultKey || 'text' // 使用defaultKey属性定义的键名，若不存在则默认使用'text'
      // 遍历数组，寻找与指定值匹配的项
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i][key] == val) {
          index = i // 找到匹配项，更新索引值
          break // 找到一个匹配项后即停止遍历
        }
      }
      return index // 返回最终的索引值
    }
  }
};
</script>

<style scoped>
.tui-cascade-selection {
  width: 100%;
  box-sizing: border-box;
}

.tui-selection-header {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.tui-bottom-line {
  position: relative;
}

.tui-bottom-line::after {
  width: 100%;
  content: "";
  position: absolute;
  border-bottom: 1rpx solid #eaeef1;
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 100%;
  bottom: 0;
  right: 0;
  left: 0;
}

.tui-btm-none::after {
  border-bottom: 0 !important;
}

.tui-header-item {
  max-width: 240rpx;
  padding: 15rpx 30rpx;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}

.tui-font-bold {
  font-weight: bold;
}

.tui-active-line {
  width: 60rpx;
  height: 6rpx;
  border-radius: 4rpx;
  /* position: absolute;
  top: 100%;
  right: 50%;
  transform: translateX(50%); */
}

.tui-selection-cell {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.tui-icon-success {
  margin-right: 12rpx;
}

.tui-cell-img {
  margin-right: 12rpx;
  flex-shrink: 0;
}

.tui-cell-title {
  word-break: break-all;
}

.tui-flex-shrink {
  flex-shrink: 0;
}

.tui-font-bold {
  font-weight: bold;
}

.tui-cell-sub_title {
  margin-left: 20rpx;
  word-break: break-all;
}

.tui-first-item {
  width: 100%;
}
.tui-header-item-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
