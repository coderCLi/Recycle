// 云函数：order-create — 创建回收订单（免注册）
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { category, brand, fileID, priceMin, priceMax, date, timeSlot, address } = event;

  // 查找或创建用户
  let user = await db.collection("users").where({ openId: wxContext.OPENID }).get();
  if (user.data.length === 0) {
    await db.collection("users").add({
      data: {
        openId: wxContext.OPENID,
        phone: event.phone || "",
        address: address,
        created: new Date(),
        updated: new Date(),
      },
    });
    user = await db.collection("users").where({ openId: wxContext.OPENID }).get();
  }

  const userId = user.data[0]._id;

  const order = {
    userId,
    category,
    brand: brand || "",
    fileID: fileID || "",
    estPriceMin: priceMin,
    estPriceMax: priceMax,
    source: "online",
    status: "pending",
    address,
    timeWindow: {
      date,
      start: timeSlot.split("-")[0],
      end: timeSlot.split("-")[1],
    },
    created: new Date(),
    updated: new Date(),
  };

  const res = await db.collection("orders").add({ data: order });

  // 更新用户最后活跃时间
  await db.collection("users").doc(userId).update({
    data: { updated: new Date(), lastOrderAt: new Date() },
  });

  return { code: 0, data: { orderId: res._id } };
};
