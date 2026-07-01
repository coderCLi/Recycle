// 云函数：share-poster — 生成减碳分享海报
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { orderId, category, amount, carbonSaved } = event;

  // 生成小程序码
  const qrcode = await cloud.openapi.wxacode.getUnlimited({
    scene: "share",
    page: "pages/index/index",
    width: 280,
  });

  // 上传二维码到云存储
  const qrRes = await cloud.uploadFile({
    cloudPath: `posters/qr-${orderId}.png`,
    fileContent: qrcode.buffer,
  });

  // 存储海报元数据
  await cloud.database().collection("posters").add({
    data: {
      orderId,
      category,
      amount,
      carbonSaved: carbonSaved || Math.round(amount * 0.5),
      qrCode: qrRes.fileID,
      created: new Date(),
    },
  });

  return {
    code: 0,
    data: {
      posterId: orderId,
      carbonSaved: carbonSaved || Math.round(amount * 0.5),
      qrCode: qrRes.fileID,
    },
  };
};
