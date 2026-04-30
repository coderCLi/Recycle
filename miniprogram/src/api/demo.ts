/*
 * @Description: api配置文件
 * @Author: chenyulong
 * @Date: 2024-10-11 10:52:52
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-11-04 21:51:23
 * @Remark: 
 */
import { http } from '@/utils/http'

export const testDefaultParam = (data: any) => {
  // 默认自动加密请求报文，解密响应报文，不验证登录状态，POST请求
  return http('/foo1', data)
}

export const testCustomParam = (data: any) => {
  // 加密请求报文，响应报文不解密，验证登录，POST请求
  return http('/foo2', data, { encrypt: true, decrypt: false, login: true })
}

export const testCustomHeader = (data: any) => {
  // 请求报文不加密，响应报文不解密，验证登录，POST请求，自定义请求头
  return http('/foo3', data, { encrypt: false, decrypt: false, login: true, headers: { 'X-Custom-Header': 'custom-value' } })
}