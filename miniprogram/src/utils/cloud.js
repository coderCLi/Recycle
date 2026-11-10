/**
 * 微信云开发封装（客户端直连数据库方案）
 * 不需要部署云函数，只需在云开发控制台创建 appointments 集合并设为「仅创建者可读写」。
 * 客户在小程序内只能看到自己的预约；你在云开发控制台（管理员视角）能看到全部预约。
 * H5 端不支持云开发，由调用方降级为本地逻辑。
 */

// 云开发环境 ID
const CLOUD_ENV = 'cloudbase-d3grlc95lbad62753'

let inited = false

/** 是否处于支持云开发的小程序环境 */
export const isCloudAvailable = () => {
  // #ifdef MP-WEIXIN
  return typeof wx !== 'undefined' && wx.cloud
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}

/** 初始化云开发（幂等，失败不影响基础功能） */
export const initCloud = () => {
  if (inited || !isCloudAvailable()) return
  try {
    wx.cloud.init({
      env: CLOUD_ENV || undefined,
      traceUser: true,
    })
    inited = true
  } catch (e) {
    console.warn("云开发初始化失败（不影响基础功能）", e)
  }
}

/** 获取云数据库实例 */
const getDB = () => {
  if (!isCloudAvailable()) {
    throw new Error('云开发不可用')
  }
  return wx.cloud.database()
}

/** 提交预约单（直接写云数据库，_openid 自动写入）—— 内置 loading */
export const submitAppointment = async (order) => {
  return withLoading(async () => {
    const db = getDB()
    const res = await db.collection('appointments').add({
      data: {
        ...order,
        status: 'pending',
        createTime: db.serverDate(),
      },
    })
    return { success: true, id: res._id }
  }, '提交中...')
}

/**
 * 下发「预约回收通知」一次性订阅消息
 * 需要用户已在点击提交时授权（order.subscribeAccepted === true），失败不影响预约单
 */
export const sendAppointmentNotice = async (order) => {
  if (!isCloudAvailable()) {
    throw new Error('云开发不可用')
  }
  const res = await wx.cloud.callFunction({
    name: 'sendAppointmentNotice',
    data: { order },
  })
  return res.result || {}
}

/** 查询当前用户的预约记录（数据库权限自动按 _openid 隔离） */
export const getAppointments = async () => {
  const db = getDB()
  const res = await db
    .collection('appointments')
    .orderBy('createTime', 'desc')
    .limit(50)
    .get()
  return { success: true, list: res.data || [] }
}

/** 管理端：查询全部预约（需要在控制台把集合权限设为「所有用户可读」） */
export const adminListAppointments = async () => {
  const db = getDB()
  const res = await db
    .collection('appointments')
    .orderBy('createTime', 'desc')
    .limit(100)
    .get()
  return { success: true, list: res.data || [] }
}

/** 管理端：更新预约状态（集合权限需允许写；仅创建者可写时非创建者会失败）—— 内置 loading */
export const adminUpdateStatus = async (id, status) => {
  return withLoading(async () => {
    const db = getDB()
    await db.collection('appointments').doc(id).update({ data: { status } })
    return { success: true }
  }, '处理中...')
}

/**
 * 带全局 loading 的异步操作（提交、删除、改状态等）
 * 用法：await withLoading(() => callFunction(...), '提交中...')
 */
export const withLoading = async (fn, title = '处理中...') => {
  uni.showLoading({ title, mask: true })
  try {
    return await fn()
  } finally {
    uni.hideLoading()
  }
}

/** ---------- 管理端写操作（内置 loading，页面直接调用即可）---------- */

/** 删除单条预约 */
export const adminRemoveAppointment = (id) =>
  withLoading(() => callFunction('adminGetAppointments', { action: 'remove', id }), '删除中...')

/** 批量删除预约 */
export const adminBatchRemoveAppointments = (ids) =>
  withLoading(() => callFunction('adminGetAppointments', { action: 'batchRemove', ids }), '删除中...')

/** 从回收站恢复单条 */
export const adminRestoreAppointment = (id) =>
  withLoading(() => callFunction('adminGetAppointments', { action: 'restore', id }), '恢复中...')

/** 批量恢复 */
export const adminBatchRestoreAppointments = (ids) =>
  withLoading(() => callFunction('adminGetAppointments', { action: 'batchRestore', ids }), '恢复中...')

/** 修改预约状态 */
export const adminUpdateAppointmentStatus = (id, status) =>
  withLoading(() => callFunction('adminGetAppointments', { action: 'updateStatus', id, status }), '处理中...')

/** 绑定管理员 */
export const adminBind = (code) =>
  withLoading(() => callFunction('adminGetAppointments', { action: 'bind', code }), '绑定中...')

/** 查询当前用户是否管理员（不显示 loading） */
export const adminMe = () => callFunction('adminGetAppointments', { action: 'me' })

/** 分页查询预约列表（不显示 loading，页面用品牌 loading） */
export const adminListPage = (params = {}) =>
  callFunction('adminGetAppointments', { action: 'list', ...params })

/** 查询分类列表（level: 1 一级分类；2 二级分类） */
export const getCategories = async (level = 1, parentId = '') => {
  const db = getDB()
  const coll = db.collection('categories')
  const query =
    level === 2
      ? coll.where({ level: 2, parentId: String(parentId || '') })
      : coll.where({ level: 1 })
  const res = await query.orderBy('sort', 'asc').limit(100).get()
  return { success: true, list: res.data || [] }
}

/**
 * 新增分类（管理员）—— 内置 loading
 * @param {Object} data 分类数据
 * @param {Boolean} silent 为 true 时不显示 loading（用于批量初始化，外层自行控制）
 */
export const addCategory = async (data, silent = false) => {
  const run = async () => {
    const db = getDB()
    const res = await db.collection('categories').add({
      data: { sort: 0, ...data, createTime: db.serverDate() },
    })
    return { success: true, id: res._id }
  }
  return silent ? run() : withLoading(run, '保存中...')
}

/**
 * 修改分类（管理员）—— 内置 loading
 * @param {Boolean} silent 为 true 时不显示 loading（用于批量排序，外层自行控制）
 */
export const updateCategory = async (id, data, silent = false) => {
  const run = async () => {
    const db = getDB()
    await db.collection('categories').doc(id).update({ data })
    return { success: true }
  }
  return silent ? run() : withLoading(run, '保存中...')
}

/** 删除分类（管理员）—— 内置 loading */
export const removeCategory = async (id) => {
  return withLoading(async () => {
    const db = getDB()
    await db.collection('categories').doc(id).remove()
    return { success: true }
  }, '删除中...')
}

/** 提交意见反馈（写入 feedbacks 集合）—— 内置 loading */
export const submitFeedback = async (data) => {
  return withLoading(async () => {
    const db = getDB()
    const res = await db.collection('feedbacks').add({
      data: {
        ...data,
        createTime: db.serverDate(),
      },
    })
    return { success: true, id: res._id }
  }, '提交中...')
}

/** 读取管理口令（config 集合，key = admin_password；读取失败返回空） */
export const getAdminPassword = async () => {
  try {
    const db = getDB()
    const res = await db.collection('config').where({ key: 'admin_password' }).get()
    if (res.data && res.data.length > 0 && res.data[0].value) {
      return res.data[0].value
    }
  } catch (e) {
    console.warn('读取管理口令失败', e)
  }
  return ''
}

/**
 * 把云文件ID转成可直接打开/预览的临时链接（previewImage 不支持 cloud:// 前缀）
 * 非云文件或转换失败时原样返回
 */
export const toTempFileURLs = async (urls = []) => {
  const list = urls.filter((u) => typeof u === 'string' && u.indexOf('cloud://') === 0)
  if (list.length === 0 || !isCloudAvailable()) return urls.slice()
  try {
    const res = await wx.cloud.getTempFileURL({ fileList: list })
    const map = {}
    const fileList = res.fileList || []
    fileList.forEach((f) => {
      if (f.tempFileURL) map[f.fileID] = f.tempFileURL
    })
    return urls.map((u) => map[u] || u)
  } catch (e) {
    console.warn('获取图片临时链接失败', e)
    return urls.slice()
  }
}

/** 调用云函数（保留，后续要加企业微信通知等能力时使用） */
export const callFunction = async (name, data = {}) => {
  if (!isCloudAvailable()) {
    throw new Error('云开发不可用')
  }
  const res = await wx.cloud.callFunction({ name, data })
  return res.result
}
