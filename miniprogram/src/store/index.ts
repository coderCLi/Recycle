import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)


// 模块统一导出
import useBaseStore from './base'
import useCustomStore from './custom'
import useUserStore from './user'
import usePointsStore from './points'
import useMctStore from './mct'
import useHddStore from './hdd'

export { 
  useBaseStore, 
  useCustomStore,
  useUserStore,
  usePointsStore,
  useMctStore,
  useHddStore
 }
 
 export default store
