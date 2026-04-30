import { pages, subPackages, tabBar } from '@/pages.json'
import { isMp, isH5 } from './platform'
import * as bridgeSdk from './bridge'
import * as utils from './utils'

// 导出时间格式化函数
export const { formatWorkHours, parseWorkHours } = utils;

// 获取当前页路由栈
const getLastPage = (): any => {
  return utils.getCurrentRouter();
}

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  const lastPage = getLastPage()
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 判断指定页面是否是tabbar页 
 * @param currPath 指定页面路径
 * @returns 
 */
export const isTabbar = (currPath: string) => bridgeSdk.isTabbar(currPath)

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 'pages/login/index'
 * redirectPath 如 'pages/demo/base/route-interceptor'
 */
export const currRoute = () => {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  console.log('lastPage.$page:', currRoute)
  console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  console.log('lastPage.$page.options:', currRoute.options)
  console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return bridgeSdk.getUrlObj(fullPath)
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page: any) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj
    subPageObj.pages
      .filter((page: any) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * 获取接口请求基准地址
 */
export const getEvnBaseUrl = () => {
  let baseUrl = '';

  // 小程序端环境区分
  if (isMp) {
    const res = uni.getAccountInfoSync();
    console.log('uni.getAccountInfoSync:', res);
    const { miniProgram: { envVersion, appId, version } } = res;
    // develop、trial、release
    console.log('envVersion:', envVersion);
    console.log('appId:', appId);
    console.log('version:', version);
    // 小程序不支持代理，使用完整的路径
    baseUrl = __VITE_SERVER_BASEURL__;
  }
  // web环境
  else if(isH5) {
	  // 本地环境使用代理形式，其他环境使用真实地址
	  baseUrl = __VITE_USER_NODE_ENV__ === 'development' ? __VITE_APP_PROXY_PREFIX__ : __VITE_SERVER_BASEURL__;
    // baseUrl = __VITE_APP_PROXY_PREFIX__;
  } 
  // 其他环境使用完整路径 
  else {
	  baseUrl = __VITE_SERVER_BASEURL__;
  }
  // console.log(`${__VITE_USER_NODE_ENV__} baseUrl: `, baseUrl)

  return baseUrl
}

