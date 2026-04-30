/*
 * @Description: 惠多多状态管理用
 * @Autor: TF
 * @Date: 2025-08-27 11:05:13
 * @LastEditors: TF
 * @LastEditTime: 2025-08-27 11:08:18
 */
import { defineStore } from 'pinia'

export default defineStore('hdd', {
        state: () => ({
            hddDetail: {},// 当前选中惠多多信息
        }),
        actions: {
            updateHddDetail(val: any) {
                this.hddDetail = {...val}
            }
        },
        persist: true,
    }
)
