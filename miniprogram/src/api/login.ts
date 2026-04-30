import { http } from '@/utils/http'

// 账号密码登录、手机号登录
export const accountLogin = (data: any) => {
  return http('/abpapp/LoginController/login.do', data);
}

// 获取验证码 -- 登录、忘记密码、注册
export const getCode = (data: any) => {
  return http('/abpapp/CommonController/veryCode.do', data, {login: false});
}
// 忘记密码 - 校验短信验证码
export const checkVeryCode = (data: any) => {
  return http('/abpapp/CommonController/checkVeryCode.do', data);
}

// 忘记密码
export const forgetPassword = (data: any) => {
  return http('/abpapp/LoginController/forgetPassword.do', data);
}

// 重置密码
export const resetPassword = (data: any) => {
  return http('/abpapp/LoginController/updatePassword.do', data);
}

// 注册
export const registerAccount = (data: any) => {
  return http('/abpapp/LoginController/register.do', data, {login: false});
}

// 获取token
export const getToken = (data: any) => {
  return http('/abpapp/LoginController/getToken.do', data);
}

// 授权登录
export const wxLogin = (data: any) => {
  return http('/abpapp/LoginController/wxLogin.do', data);
}
// 绑定手机号
export const wxBindPhone = (data: any) => {
  return http('/abpapp/LoginController/wxBindPhone.do', data);
}
// 注销
export const logoff = () => {
  return http('/abpapp/LoginController/cancel.do', {}, {login: false});
}
// 退出登录
export const loginOut = () => {
  return http('/abpapp/LoginController/loginOut.do', {}, {login: false, catchRes: true});
}
// 获取用户信息
export const getUserInfo = () => {
  return http('/abpapp/UserRelatedController/getUserInfo.do', {}, {login: true});
}

// 实名认证提交接口
// 
export const realName = (data:any) => {
	return http('/abpapp/UserRelatedController/realName.do',data,{catchError: true})
}

// 获取initCode，用于初始化开放平台js sdk
export const getInitCode = () => {
  return http('/abpopen/H5ExternalPermissionsController/getInitCode.do', {});
}

// 开放平台接入的第三方平台通过autoCode获取用户信息
export const getUserInfoByAuthCode = (data: any) => {
  // console.log("authCode: ", data);
	return http('/abpopen/H5ExternalPermissionsController/getUserInfoByAccessCode.do', data)
}

// /abpapp/LoginController/wxPhoneQuickLogin.do
// 手机号快捷登录
export const wxPhoneQuickLogin = (data: any, extra: any = {}) => {
  return http('/abpapp/LoginController/wxPhoneQuickLogin.do', data, extra);
}
