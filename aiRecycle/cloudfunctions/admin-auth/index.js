// 云函数：admin-auth — 后管鉴权
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const ADMIN_OPENIDS = ["__LEIGE_OPENID__"];

exports.main = async () => {
  const wxContext = cloud.getWXContext();
  const isAdmin = ADMIN_OPENIDS.includes(wxContext.OPENID);

  if (!isAdmin) return { code: 2, message: "无权访问" };

  return { code: 0, data: { openId: wxContext.OPENID } };
};
