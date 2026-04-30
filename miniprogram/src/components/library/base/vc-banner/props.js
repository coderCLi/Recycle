import value from "@/uni_modules/uview-plus/components/u-text/value";

/*
 * @Description: 组件属性配置
 * @Author: chenyulong
 * @Date: 2024-09-26 13:11:13
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-11-25 10:29:46
 * @label: 
 */
export default {
  height: {
    label: "高度",
    value: 288
  },
  width: {
    label: "宽度",
    value: 750
  },
  // 组件属性配置
  list: {
    label: "数据源",
    value: []   
  },
  type: {
    label: "展示类型",//新增数字显示
    value: 'dots'
  },
  borderRadius:{
    label: "borderRadius",//图片有无圆角 默认有圆角 
    value: 'none'
  },
  preview:{
    label: "预览",//预览
    value: false
  },
  nextMargin:{
    label: "后边距",
    value: 0
  },
  swiperType: {
    label: "滑动模块类型", // banner 轮播图   swiper 普通滑块
    value: ""
  }
}