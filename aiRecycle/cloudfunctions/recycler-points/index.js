// 云函数：recycler-points — 计算回收员积分
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async () => {
  const recyclers = await db.collection("recyclers").where({ status: "在岗" }).get();

  const rankings = await Promise.all(
    recyclers.data.map(async (rec) => {
      // 当月订单
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const orders = await db
        .collection("orders")
        .where({
          recyclerId: rec._id,
          status: "completed",
          completedAt: _.gte(monthStart),
        })
        .get();

      const totalOrders = orders.data.length;
      const avgRating = 4.5; // 需要从评价表获取，MVP用默认值
      const avgResponse = 15; // 分钟，需要从时间戳计算

      // 积分 = 单量分(40%) + 满意度分(30%) + 响应分(15%) + 准时率分(15%)
      const orderScore = Math.min(totalOrders * 2, 40);
      const satScore = avgRating * 6;
      const responseScore = Math.max(0, 15 - avgResponse / 2);
      const ontimeScore = 13; // MVP默认

      const totalScore = Math.round(orderScore + satScore + responseScore + ontimeScore);

      let medal = "";
      if (totalScore >= 90) medal = "🥇";
      else if (totalScore >= 75) medal = "🥈";
      else if (totalScore >= 60) medal = "🥉";

      return {
        recyclerId: rec._id,
        name: rec.name,
        points: totalScore,
        medal,
        orders: totalOrders,
        rating: avgRating,
        response: `${avgResponse}min`,
      };
    })
  );

  rankings.sort((a, b) => b.points - a.points);

  return { code: 0, data: rankings };
};
