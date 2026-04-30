/*
 * @Description: 组件属性配置
 * @Author: chenyulong
 * @Date: 2024-09-26 13:11:13
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-04 15:31:21
 * @label: 
 */
export default {
  path: {
    label: "页面路径",
    value: ""
  },
  title: {
    priority: 1,
    label: "标题",
    value: ""
  },
  fixed: {
    priority: 2,
    label: "是否固定在顶部",
    value: false
  },
  border: {
    priority: 3,
    label: "底部是否显示下边框",
    value: true
  },
  bgColor: {
    priority: 4,
    label: "底部是否显示下边框",
    value: "#ffffff"
  },
  titleColor: {
    priority: 5,
    label: "标题颜色",
    value: "#333333"
  },
  rightText: {
    priority: 5,
    label: "右侧展示文字",
    value: ""
  },
  buttonType:{
    priority: 6,
    label: "返回类型",
    value: "back"
  },
  height: {
    priority: 7,
    label: "高度",
    value: ""
  },
  showMore: {
    priority: 8,
    label: "是否显示更多按钮",
    value: false
  },
  customLeftBack: {
    priority: 9,
    label: "自定义左侧按钮返回事件",
    value: false
  }
}