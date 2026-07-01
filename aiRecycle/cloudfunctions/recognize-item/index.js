// 云函数：recognize-item — 拍照识别物品品类和品牌
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { fileID } = event;

  // 获取云存储文件临时链接
  const fileRes = await cloud.getTempFileURL({ fileList: [fileID] });
  const imageUrl = fileRes.fileList[0].tempFileURL;

  // 调用百度AI通用物体识别
  const response = await cloud.callFunction({
    name: "baidu-ai-recognize",
    data: { imageUrl },
  });

  const baiduResult = response.result;
  if (baiduResult.code !== 0) {
    return {
      code: 1,
      message: baiduResult.message || "AI 识别服务暂不可用",
    };
  }

  return {
    code: 0,
    data: {
      category: baiduResult.result?.result?.[0]?.keyword || "未知品类",
      brand: baiduResult.result?.result?.[1]?.keyword || "",
      confidence: baiduResult.result?.result?.[0]?.score || 0,
    },
  };
};
