/*
 * @Description: 组件属性配置
 * @Author: chenyulong
 * @Date: 2024-09-26 13:11:13
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-26 19:30:24
 * @label: 
 */
export default {
  // 组件属性配置
  type: {
    label: '类型',
    value: "alert"
  },
  duration: {
    label: 'toast时长(毫秒)',
    value: 2000
  },
  title: {
    label: '标题',
    value: "温馨提示"
  },
  content: {
    label: '内容',
    value: "这是一段默认提示文本内容"
  },
  htmlString: {
    label: '自定义html字符串',
    value: ""
  },
  confirmText: {
    label: '确认按钮文字',
    value: '确认'
  },
  cancelText: {
    label: '取消按钮文字',
    value: '取消'
  },
  showCancel: {
    label: '是否显示取消按钮',
    value: false
  }
}
