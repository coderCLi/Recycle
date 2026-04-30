import { http } from '@/utils/http'

// 获取文明资讯列表接口
export const getPublishVersion = () => {
  return http('/abpapp/AppVersionController/getPublishVersion.do', {}, {
    catchRes: true
  })
}
