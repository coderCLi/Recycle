// 云函数：order-detail — 获取订单详情
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { orderId } = event;
  const order = await db.collection("orders").doc(orderId).get();

  if (!order.data) return { code: 1, message: "订单不存在" };

  // 填充回收员信息
  if (order.data.recyclerId) {
    const rec = await db.collection("recyclers").doc(order.data.recyclerId).get();
    if (rec.data) order.data.recyclerName = rec.data.name;
  }

  return { code: 0, data: order.data };
};
