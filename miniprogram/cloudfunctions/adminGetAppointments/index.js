/**
 * 云函数：管理端预约管理（openid 白名单）
 *
 * 状态说明：
 *   pending   待处理
 *   done      已完成
 *   canceled  已取消
 *   deleted   已删除（回收站）
 *
 * action:
 *   'me'            查询当前身份
 *   'bind'          绑定为管理员（需绑定码）
 *   'list'          分页查列表（参数 page / pageSize / status）
 *   'updateStatus'  改状态（参数 id / status）
 *   'remove'        软删除，移入回收站（仅 done 可删）
 *   'batchRemove'   批量软删除
 *   'restore'       从回收站恢复为 done
 *   'batchRestore'  批量恢复
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/** 集合不存在时自动创建 */
async function ensureCollection(db, name) {
  try {
    await db.createCollection(name)
  } catch (e) {
    // 已存在，忽略
  }
}

/** 判断 openid 是否管理员 */
async function isAdminOpenid(db, openid) {
  try {
    const res = await db.collection('admins').where({ openid }).limit(1).get()
    return (res.data || []).length > 0
  } catch (e) {
    return false
  }
}

exports.main = async (event = {}) => {
  const { action = 'list', id, status, code, ids = [] } = event
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const openid = wxContext.OPENID

  try {
    // ---------- 身份 ----------
    if (action === 'me') {
      const admin = await isAdminOpenid(db, openid)
      return { success: true, isAdmin: admin, openid }
    }

    // ---------- 绑定管理员 ----------
    if (action === 'bind') {
      let bindCode = '8888'
      try {
        const cfg = await db.collection('config').where({ key: 'admin_password' }).get()
        if (cfg.data && cfg.data.length > 0 && cfg.data[0].value) {
          bindCode = cfg.data[0].value
        }
      } catch (e) {
        // config 不存在，用默认
      }
      if (String(code) !== String(bindCode)) {
        return { success: false, message: '绑定码错误' }
      }
      await ensureCollection(db, 'admins')
      const exist = await isAdminOpenid(db, openid)
      if (!exist) {
        await db.collection('admins').add({
          data: { openid, createTime: db.serverDate() },
        })
      }
      return { success: true, isAdmin: true, openid }
    }

    // ---------- 以下需要管理员权限 ----------
    const admin = await isAdminOpenid(db, openid)
    if (!admin) {
      return { success: false, message: '无管理权限', openid }
    }

    // ---------- 删除单条（软删除 → 回收站，仅 done）----------
    if (action === 'remove') {
      if (!id) return { success: false, message: '参数不完整' }
      try {
        const doc = await db.collection('appointments').doc(id).get()
        if (!doc || !doc.data) return { success: false, message: '预约不存在' }
        if (doc.data.status !== 'done') {
          return { success: false, message: '只能删除已完成的预约' }
        }
      } catch (e) {
        return { success: false, message: '预约不存在或已删除' }
      }
      await db.collection('appointments').doc(id).update({
        data: { status: 'deleted', deletedTime: db.serverDate() },
      })
      return { success: true }
    }

    // ---------- 批量删除（软删除，仅 done）----------
    if (action === 'batchRemove') {
      if (!Array.isArray(ids) || ids.length === 0) {
        return { success: false, message: '未选择记录' }
      }
      let count = 0
      let skipped = 0
      for (const _id of ids) {
        try {
          const doc = await db.collection('appointments').doc(_id).get()
          if (!doc || !doc.data || doc.data.status !== 'done') {
            skipped++
            continue
          }
          await db.collection('appointments').doc(_id).update({
            data: { status: 'deleted', deletedTime: db.serverDate() },
          })
          count++
        } catch (e) {
          skipped++
        }
      }
      return { success: true, count, skipped }
    }

    // ---------- 恢复单条（回收站 → 已完成）----------
    if (action === 'restore') {
      if (!id) return { success: false, message: '参数不完整' }
      try {
        const doc = await db.collection('appointments').doc(id).get()
        if (!doc || !doc.data) return { success: false, message: '预约不存在' }
        if (doc.data.status !== 'deleted') {
          return { success: false, message: '该预约不在回收站' }
        }
      } catch (e) {
        return { success: false, message: '预约不存在' }
      }
      await db.collection('appointments').doc(id).update({
        data: { status: 'done', restoreTime: db.serverDate() },
      })
      return { success: true }
    }

    // ---------- 批量恢复 ----------
    if (action === 'batchRestore') {
      if (!Array.isArray(ids) || ids.length === 0) {
        return { success: false, message: '未选择记录' }
      }
      let count = 0
      let skipped = 0
      for (const _id of ids) {
        try {
          const doc = await db.collection('appointments').doc(_id).get()
          if (!doc || !doc.data || doc.data.status !== 'deleted') {
            skipped++
            continue
          }
          await db.collection('appointments').doc(_id).update({
            data: { status: 'done', restoreTime: db.serverDate() },
          })
          count++
        } catch (e) {
          skipped++
        }
      }
      return { success: true, count, skipped }
    }

    // ---------- 改状态 ----------
    if (action === 'updateStatus') {
      if (!id || !status) {
        return { success: false, message: '参数不完整' }
      }
      await db.collection('appointments').doc(id).update({
        data: { status, updateTime: db.serverDate() },
      })
      return { success: true }
    }

    // ---------- 分页列表（status: all / pending / done / deleted）----------
    const page = Math.max(1, Number(event.page || 1))
    const pageSize = Math.min(50, Number(event.pageSize || 20))
    const statusFilter = event.status || 'all'
    const skip = (page - 1) * pageSize

    const coll = db.collection('appointments')
    let query
    if (statusFilter === 'deleted') {
      query = coll.where({ status: 'deleted' })
    } else if (statusFilter === 'all') {
      query = coll.where({ status: _.neq('deleted') })
    } else {
      query = coll.where({ status: statusFilter })
    }

    const countRes = await query.count()
    const listRes = await query.orderBy('createTime', 'desc').skip(skip).limit(pageSize).get()

    const total = countRes.total || 0
    const listData = listRes.data || []

    // 顶部标签数量
    let counts = { all: 0, pending: 0, done: 0, deleted: 0 }
    try {
      const [cAll, cPending, cDone, cDeleted] = await Promise.all([
        coll.where({ status: _.neq('deleted') }).count(),
        coll.where({ status: 'pending' }).count(),
        coll.where({ status: 'done' }).count(),
        coll.where({ status: 'deleted' }).count(),
      ])
      counts = {
        all: cAll.total || 0,
        pending: cPending.total || 0,
        done: cDone.total || 0,
        deleted: cDeleted.total || 0,
      }
    } catch (e) {
      console.warn('统计数量失败', e)
    }

    return {
      success: true,
      list: listData,
      total,
      page,
      pageSize,
      counts,
      hasMore: skip + listData.length < total,
      openid,
    }
  } catch (err) {
    console.error('adminGetAppointments error', err)
    return { success: false, message: (err && (err.errMsg || err.message)) || '操作失败' }
  }
}
