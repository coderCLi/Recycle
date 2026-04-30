/*
 * @Description: 
 * @Author: chenyulong
 * @Date: 2024-12-09 19:49:10
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-25 13:23:52
 * @Remark: 
 */
import { defineStore } from 'pinia'

export default defineStore('user', {
    state: () => ({
      // 仅存储基础非敏感用户信息，完整的用户信息请使用utils.ts中getUserInfo方法获取
      userInfo: {
        isFace: "",
        isRealname: "",
        isLogin: "0",
        sex: "",
        head: "",
        desMobile: "",
        desUserName: "",
        desIdCard: "",
        desNickName: "",
      },
      isLogined: false,
    }),
    getters: {
      // customUserInfo: state => state.userInfo,
      // customIsLogined: state => state.isLogined,
    },
    actions: {
      // 更新用户信息
      setUserInfo(val: any) {
        console.log('userStore setUserInfo', JSON.stringify(val));
        this.userInfo = Object.assign(this.userInfo, val);
        console.log('userStore userInfo', JSON.stringify(this.userInfo));
        this.isLogined = val.isLogin == '1';
      },
      // 清空用户信息
      clearUserInfo() {
        this.userInfo = {
          isFace: "",
          isRealname: "",
          isLogin: "0",
          sex: "",
          head: "",
          desMobile: "",
          desUserName: "",
          desIdCard: "",
          desNickName: "",
        };
        this.isLogined = false;
      }
    },
    persist: true,
  }
)