import { http } from '@/utils/http'
// 图片上传
export const uploadImg = (data: any) => {
  return http(
    '/abpapp/CulturalOneCardController/uploadImg.do',
    data,
    {
      catchRes : true,
      encrypt: false,
      decrypt: false,
      login: false,
    }
  )
}