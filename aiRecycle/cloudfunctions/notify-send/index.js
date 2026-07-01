// 云函数：notify-send — 发送订阅消息
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { type, openId, data, templateId } = event;

  const templates = {
    recycler_departure: "__RECYCLER_DEPARTURE_TMPL__",
    order_complete: "__ORDER_COMPLETE_TMPL__",
    admin_notify: "__ADMIN_NOTIFY_TMPL__",
    dormant_wake: "__DORMANT_WAKE_TMPL__",
  };

  const tmplId = templateId || templates[type];
  if (!tmplId) return { code: 1, message: "模板ID未配置" };

  try {
    await cloud.openapi.subscribeMessage.send({
      touser: openId,
      templateId: tmplId,
      data: data || {},
      miniprogramState: "formal",
    });
    return { code: 0 };
  } catch (err) {
    return { code: 3, message: err.message };
  }
};
