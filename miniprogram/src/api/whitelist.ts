import { http } from '@/utils/http'

// 白名单检测
export const checkWhiteList = (data: any) => {
  return http('/abpapp/mobile/getAppVersion', data, { encrypt: false, decrypt: false, catchRes: true })
}
