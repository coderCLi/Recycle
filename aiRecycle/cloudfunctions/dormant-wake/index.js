// 云函数：dormant-wake — 唤醒沉默用户
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async () => {
  // 查询有估价记录但无订单的用户
  const users = await db
    .collection("users")
    .where({
      orderCount: _.eq(0).or(_.exists(false)),
    })
    .get();

  const woken = [];
  for (const user of users.data) {
    // 检查7天内是否已推送
    const lastWake = user.lastWakeAt ? new Date(user.lastWakeAt) : new Date(0);
    const daysSince = (Date.now() - lastWake.getTime()) / 86400000;
    if (daysSince < 7) continue;

    try {
      await cloud.openapi.subscribeMessage.send({
        touser: user.openId,
        templateId: "__DORMANT_WAKE_TMPL__",
        data: {
          thing1: { value: "您估价过的物品" },
          thing2: { value: "今日回收加价5元" },
          thing3: { value: "限时优惠" },
        },
      });

      await db.collection("users").doc(user._id).update({
        data: { lastWakeAt: new Date(), wakeCount: db.command.inc(1) },
      });

      woken.push(user._id);
    } catch (e) {
      // 用户未授权订阅消息则跳过
    }
  }

  return { code: 0, data: { woken: woken.length } };
};
