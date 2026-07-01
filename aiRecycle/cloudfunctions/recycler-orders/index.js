// 云函数：recycler-orders — 回收员获取分配订单
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async () => {
  const wxContext = cloud.getWXContext();

  // 查找回收员
  const rec = await db.collection("recyclers").where({ openId: wxContext.OPENID }).get();
  if (rec.data.length === 0) return { code: 2, message: "非回收员" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await db
    .collection("orders")
    .where({
      recyclerId: rec.data[0]._id,
      status: _.in(["assigned", "en_route", "serving"]),
      "timeWindow.date": _.gte(today.toISOString().slice(0, 10)),
    })
    .orderBy("timeWindow.start", "asc")
    .get();

  return { code: 0, data: orders.data };
};
