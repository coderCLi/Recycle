// 云函数：order-complete — 回收员签收完成，触发支付+通知
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { orderId, finalPrice, note, recyclerId } = event;

  await db.collection("orders").doc(orderId).update({
    data: {
      finalPrice,
      recyclerId,
      status: "completed",
      note: note || "",
      completedAt: new Date(),
      updated: new Date(),
    },
  });

  // 触发支付
  const paymentRes = await cloud.callFunction({
    name: "payment-create",
    data: { orderId, amount: finalPrice },
  });

  // 通知管理员
  const order = await db.collection("orders").doc(orderId).get();
  const recycler = await db.collection("recyclers").doc(recyclerId).get();

  try {
    await cloud.openapi.subscribeMessage.send({
      touser: "__ADMIN_OPENID__", // 需替换为磊哥的openId
      templateId: "__NOTIFY_TEMPLATE_ID__",
      data: {
        thing1: { value: recycler.data.name },
        thing2: { value: order.data.category },
        amount3: { value: `¥${finalPrice}` },
        time4: { value: new Date().toLocaleString() },
      },
    });
  } catch (e) {
    // 推送失败不影响主流程
    console.log("Notify admin failed:", e.message);
  }

  return {
    code: 0,
    data: { payment: paymentRes.result?.data?.payment },
  };
};
