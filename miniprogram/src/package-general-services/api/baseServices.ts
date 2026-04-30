// 基础服务api 资讯 商家 地图 地址 
import { http } from '@/utils/http'
 

// 获取下拉框选项
export const getDataDic = (data:any) => {
	return http('/abpapp/CommonController/getDataDicList.do',data)
}



// 不验证登录状态 不走加解密 

//getNavigationList.do 通过查询下面子栏目 
export const getNavigationList =(data: any) => {
    return http('/abpapp/NavigationController/getNavigationList.do',data,{ login: false })
  };
  
  
  //通过子栏目id查询资讯列表 navId  
  export const getInfoList =(data: any) => {
      return http('/abpapp/NavigationController/getList.do',data,{ login: false})
    };
  
  //通过资讯id查询资讯详情 
    export const getInfoDetail =(data: any) => {
      return http('/abpapp/NavigationController/detail.do',data,{  login: false})
    };
    
    // 记录访问人数
    export const getVisitorCount =(data: any) => {
      return http('/abpapp/RevenueStatsController/visitorCount.do',data,{ login: false})
    };
  
    // 1.分类列表
    export const getMctServiceList =(data: any) => {
      return http('/abpapp/MctServiceController/getMctServiceList',data,{ login: false})
    };
    
    // 2.分类商户列表
    
    export const getMctBusinessTypeList =(data: any) => {
      return http('/abpapp/MctServiceController/getMctBusinessTypeList',data,{ login: false})
    };
    // 3.商户详情
  
    export const getMctBusinessInfo =(data: any) => {
        return http('/abpapp/MctServiceController/getMctBusinessInfo',data,{  login: false})
    };
  
    // 服务信息及地址列表
    export const getMapList =(data: any) => {
        return http('/abpapp/MctServiceController/getMapList',data,{  login: false})
    };
  
    // /getAddrServiceList
    // 1.服务信息列表
    export const getAddrServiceList =(data: any) => {
        return http('/abpapp/MctServiceController/getAddrServiceList',data,{  login: false})
    };
  
    // /getAddrInfoList
    // 2.地址列表（分页）
    export const getAddrInfoList =(data: any) => {
        return http('/abpapp/MctServiceController/getAddrInfoList',data,{ login: false})
    };


//  验证登录状态 加解密报文 
  // /abpapp/SubscriptionController/subPage.do 我的-查询订阅列表
  export const subPage =(data: any) => {
    return http('/abpapp/SubscriptionController/subPage.do',data,{login: true })
  };
  //   /abpapp/SubscriptionController/subCheck.do  检查订阅状态
  export const subCheck =(data: any) => {
    return http('/abpapp/SubscriptionController/subCheck.do',data,{login: true })
  };

  //   订阅操作
  export const doDub =(data: any) => {
    return http('/abpapp/SubscriptionController/sub.do',data,{login: true })
  };

  // 评价信息详情 
  
  export const appraiseList =(data: any) => {
    return http('/abpapp/EvaluateAuditController/auditList.do',data,{login: true })
  };

  // 评价提交接口 
  

  export const subAppraise =(data: any) => {
    return http('/abpapp/EvaluateAuditController/ins.do',data,{login: true })
  };


  //  获取学校列表 
  export const getSchoolinfoPage =(data: any) => {
    return http('/abpapp/BdSchoolController/getSchoolinfoPage.do',data,{login: false })
  };
  // 获取学校详情
  export const getSchoolinfo =(data: any) => {
    return http('/abpapp/BdSchoolController/getSchoolinfo.do',data,{login: false })
  };
// 数据字典
  export const getDataDicList =(data: any) => {
    return http('/abpapp/CommonController/getDataDicList.do',data,{ login: false })
  };

// 卡券关联信息

export const getCouponBaseBuffById = (data:any) => {
  return http('/abpapp/CouponController/getCouponBaseBuffById.do',data)
}

// 我的卡券
export const getCouponList = (data:any) => {
  return http('/abpapp/CouponController/getCouponInfoByUserId.do',data)
}

// 查询地图信息
export const selFilterCategoryById = (data:any) => {
  return http('/abpapp/AddressByStoreProController/selFilterCategoryById.do',data)
}
// 查询地址信息
export const selBusCodeAndDisCode = (data:any) => {
  return http('/abpapp/AddressByStoreProController/selBusCodeAndDisCode.do',data)
}

// 商家卡券列表getCpnTicketList
export const getCpnTicketList = (data: any) => {
  return http('/mctapi/CpnTicketController/getCpnTicketList.do',data)
}
// 获取卡券详情
export const getComponentBaseInfo = (data: any, ajaxSet: any) => {
  return http('/mctapi/CouponController/getComponentBaseInfo.do',data , ajaxSet)
}
// 领取优惠券
export const receiveCpnTicket = (data: any) => {
  return http('/mctapi/CpnTicketController/receiveCpnTicket.do',data)
}


// 领取优惠券
export const userGetCoupon = (data: any) => {
  return http('/abpapp/CouponController/userGetCoupon.do', data)
}
// 卡券详情
export const getCouponInfoById = (data:any) => {
  return http('/abpapp/CouponController/getCouponBaseInfoById.do',data)
}

// 积分商城-搜索 获取商品列表
export const searchProducts =(data: any, ajaxSet: any) => {
    return http('/mctapi/PointProductController/searchProducts.do', data, ajaxSet)
};
