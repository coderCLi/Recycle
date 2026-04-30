/*
 * @Description: 路由拦截器
 * @Author: chenyulong
 * @Date: 2024-10-11 10:53:00
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-27 14:37:37
 * @Remark: 
 */

/**
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { getNeedLoginPages, needLoginPages as _needLoginPages } from '@/utils'

import * as utils from '@/utils/utils'
// import { getUrlObj } from "@/utils/bridge"

import * as beans from '@/utils/beans'

import * as trackReport from '@/utils/track'

const isLogined = () => {
  // const userStore = useUserStore()
  // return userStore.isLogined
  return utils.getUserInfo();
}

const isDev = import.meta.env.DEV
// console.log('env: ', import.meta.env);

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke(result: any) {
    // console.log('navigateToInterceptor invoke: ', result);
    // const currPageInstance: any = getCurrentPages()[getCurrentPages().length - 1];
    // console.warn('navigateBackInterceptor invoke currPageInstance: ', currPageInstance);

    const { url }: { url: string } = result;
    // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
    const path = url.split('?')[0]
    // console.warn('path: ', path)

    // const currPage: any = utils.getCurrentRouter();
    // console.warn('navigateToInterceptor invoke currPage: ', currPage);
    
    // const title = currPage?.pageConf?.style?.navigationBarTitleText;
    // // 记录页面名
    // trackReport.trackPageView(title);

    let needLoginPages: string[] = []
    // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
    if (isDev) {
      needLoginPages = getNeedLoginPages()
    } else {
      needLoginPages = _needLoginPages
    }
    // console.log('needLoginPages: ', needLoginPages)
    const isNeedLogin = needLoginPages.includes(path)
    console.log('isNeedLogin: ', isNeedLogin)
    if (!isNeedLogin) {
      return true
    }
    const hasLogin = isLogined()
    console.log('need login hasLogin: ', hasLogin)
    if (hasLogin) {
      return true
    }
    // const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
    // uni.navigateTo({ url: redirectRoute })
    console.log('need login to login')
    utils.toLogin();
    return false
  },
}

const navigateBackInterceptor = {
  invoke(result: any) {
    // const currPageInstance: any = getCurrentPages()[getCurrentPages().length - 1];
    // console.warn('navigateBackInterceptor invoke currPage: ', currPageInstance);
    const routes = getCurrentPages();
    const prevRoute = routes.length > 1 ? routes[routes.length - 2] : null;
    console.log("navigateBackInterceptor prevRoute", prevRoute);
    console.log("navigateBackInterceptor currentRoute", routes[routes.length - 1]);
    beans.setGlobalThis(prevRoute?.$vm);
    return true
  }
}

const switchTabInterceptor = {
  invoke(result: any) {
    // const currPageInstance: any = getCurrentPages()[getCurrentPages().length - 1];
    // console.warn('switchTabInterceptor invoke currPage: ', currPageInstance);
    let _trackTitle: string = "";
    // 埋点统计
    const name = beans.getGlobalThis()?.options?.title || utils.getCurrentRouter()?.pageConf?.style?.navigationBarTitleText;
    // console.log("_trackTitle name: ", name);

    _trackTitle = name;
    // console.log("switchTab 埋点统计 _trackTitle: ", _trackTitle);
    trackReport.trackPageView(_trackTitle);

    return true
  }
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('navigateBack', navigateBackInterceptor)
    uni.addInterceptor('switchTab', switchTabInterceptor)
  }
}
