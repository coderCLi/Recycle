// 云函数：payment-callback — 微信支付回调处理
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { outTradeNo, returnCode, resultCode } = event;

  if (returnCode !== "SUCCESS" || resultCode !== "SUCCESS") {
    return { code: 1, message: "支付失败" };
  }

  // outTradeNo 格式: RECYCLE_{orderId}_{timestamp}
  const orderId = outTradeNo.split("_")[1];
  if (!orderId) return { code: 1, message: "无效订单号" };

  await db.collection("orders").doc(orderId).update({
    data: {
      paid: true,
      paidAt: new Date(),
      updated: new Date(),
    },
  });

  return { code: 0 };
};
