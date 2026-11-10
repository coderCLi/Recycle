/**
 * 云函数：查询当前用户的预约记录
 * 按 openid 自动隔离，只返回自己的预约
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  try {
    const res = await db
      .collection('appointments')
      .where({ openid: wxContext.OPENID })
      .orderBy('createTime', 'desc')
      .limit(50)
      .get()

    return { success: true, list: res.data || [] }
  } catch (err) {
    console.error('getAppointments error', err)
    return { success: false, message: '查询失败', list: [] }
  }
}
