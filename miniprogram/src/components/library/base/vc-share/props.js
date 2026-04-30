/*
 * @Description: 组件属性配置
 * @Author: chenyulong
 * @Date: 2024-09-26 13:11:13
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-05-21 13:42:39
 * @label:
 */
export default {
    title: {
        label: "分享标题",
        Value: "",
    },
    type: {
        label: "分享类型",
        Value: "",
    },
    content: {
        label: "分享内容",
        Value: "",
    },
    path: {
        label: "分享路径",
        Value: "",
    },
    imageUrl: {
        label: "分享图片",
        describe: "app调用微信分享卡片显示的图片，展示的比例为5：4，小程序卡片尺寸为： 210 x 168, 不能超过128kb, 建议控制在100k以内, 越小越好",
        Value: "",
    },
    miniAPPID: {
        label: "小程序miniAPPID",
        Value: "",
    },
    miniAPPPath: {
        label: "小程序页面路径",
        Value: "",
    },
    shareType: {
        label: "分享类型",
        Value: "miniCard",
    },
    capturePage: {
        label: "截屏分享",
        Value: false,
    },  
};
