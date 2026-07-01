// 云函数：order-list — 用户查看自己的订单
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const { page = 1, pageSize = 20 } = event;

  const user = await db.collection("users").where({ openId: wxContext.OPENID }).get();
  if (user.data.length === 0) return { code: 0, data: [] };

  const res = await db
    .collection("orders")
    .where({ userId: user.data[0]._id })
    .orderBy("created", "desc")
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();

  return { code: 0, data: res.data };
};
