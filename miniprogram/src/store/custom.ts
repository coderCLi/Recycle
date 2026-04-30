/*
 * @Description: 非基础业务用存储
 * @Autor: TF
 * @Date: 2025-09-08 18:36:26
 * @LastEditors: TF
 * @LastEditTime: 2025-09-08 18:39:02
 */
import { defineStore } from 'pinia'

export default defineStore('custom', {
        state: () => ({
            // 创新汇-详情信息
            innovationDetail: {},
        }),
        getters: {

        },
        actions: {
            // 设置创新汇-详情信息
            setInnovationDetail(val: any) {
                this.innovationDetail = Object.assign(this.innovationDetail, val);
            }
        },
        persist: true,
    }
)