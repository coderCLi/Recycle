// 云函数：order-cancel — 取消订单
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { orderId, reason } = event;

  const order = await db.collection("orders").doc(orderId).get();
  if (!order.data) return { code: 1, message: "订单不存在" };

  if (!["pending", "assigned"].includes(order.data.status)) {
    return { code: 3, message: "当前状态不可取消" };
  }

  // 如果已支付，发起退款
  if (order.data.paid && order.data.finalPrice) {
    await cloud.callFunction({
      name: "payment-refund",
      data: { orderId, amount: order.data.finalPrice },
    });
  }

  await db.collection("orders").doc(orderId).update({
    data: {
      status: "cancelled",
      cancelReason: reason || "用户取消",
      cancelledAt: new Date(),
      updated: new Date(),
    },
  });

  return { code: 0 };
};
