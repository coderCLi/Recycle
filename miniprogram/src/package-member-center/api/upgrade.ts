import { http } from '@/utils/http'  // 导入http服务

export const upgradeData = (data:any) => {
  return http('/abpapp/PointsUserController/upgradeVipLevels.do',data)
}