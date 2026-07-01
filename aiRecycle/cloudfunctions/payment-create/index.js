// 云函数：payment-create — 微信支付统一下单
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { orderId, amount } = event;

  const order = await db.collection("orders").doc(orderId).get();
  if (!order.data) return { code: 1, message: "订单不存在" };

  const user = await db.collection("users").doc(order.data.userId).get();

  try {
    const res = await cloud.cloudPay.unifiedOrder({
      body: `富区旧家电回收-${order.data.category}`,
      outTradeNo: `RECYCLE_${orderId}_${Date.now()}`,
      totalFee: Math.round(amount * 100), // 分
      spbillCreateIp: "127.0.0.1",
      envId: cloud.DYNAMIC_CURRENT_ENV,
      functionName: "payment-callback",
    });

    return { code: 0, data: { payment: res.payment } };
  } catch (err) {
    return { code: 3, message: `支付发起失败: ${err.message}` };
  }
};
