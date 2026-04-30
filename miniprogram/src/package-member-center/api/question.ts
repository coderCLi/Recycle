import { http } from '@/utils/http'  // 导入http服务

export const getQuestionList = (data:any) => {
  return http('/abpapp/PointsIssueController/appGetPointsIssueCommonProblem.do',data)
}