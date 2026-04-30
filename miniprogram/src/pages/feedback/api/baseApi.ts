// 基础服务api 资讯 商家 地图 地址 
import { http } from '@/utils/http'

//  这些是之前模版的类型 自己不动
export const testDefaultParam = (data : any) => {
	// 默认自动加密请求报文，解密响应报文，不验证登录状态，POST请求
	return http('/foo1', data)
}

export const testCustomParam = (data : any) => {
	// 加密请求报文，响应报文不解密，验证登录，POST请求
	return http('/foo2', data, { encrypt: true, decrypt: false, login: true })
}

export const testCustomHeader = (data : any) => {
	// 请求报文不加密，响应报文不解密，验证登录，POST请求，自定义请求头
	return http('/foo3', data, { encrypt: false, decrypt: false, login: true, headers: { 'X-Custom-Header': 'custom-value' } })
}
//  一直到这刘


// 不验证登录状态 不走加解密 

//getNavigationList.do 通过查询下面子栏目 
export const getNavigationList = (data : any) => {
	return http('/abpapp/NavigationController/getNavigationList.do', data,)
};

// 上面的一个是模版
// 现在 才是 开始写代码

// 反馈意见新增
export const insertFeedBackInfo = (data : any) => {
	return http('/abpapp/FeedBackController/insertFeedBackInfo.do',data)
};
// 获取下拉框选项
export const getDataDic = (data:any) => {
	return http('/abpapp/CommonController/getDataDicList.do', data)
}

//  获取长者模式数据
export const getElderlyModeList = (data:any) => {
	return http('/abpapp/ThemeManageController/getElderlyModeList.do',data)
}


//  放心消费大类查询
export const fangxinshifanbigType = (data:any) => {
	return http('/abpapp/ConsumptionController/fangxinshifanbigType.do',data)
}

// 根据大类获取放心示范单位  
export const getFangxinListByType = (data:any) => {
	return http('/abpapp/ConsumptionController/getFangxinListByType.do',data)
}

// 放心消费单位查询明细 
export const getFangxinListBySearch = (data:any) => {
	return http('/abpapp/ConsumptionController/getFangxinListBySearch.do',data)
}


//    消费维权和无理由
export const getxiaofeiUnit = (data:any) => {
	return http('/abpapp/ConsumptionController/getxiaofeiUnit.do',data)
}


// 
export const getFeedBackList = (data:any) => {
	return http('/abpapp/FeedBackController/getFeedBackList.do',data)
}
