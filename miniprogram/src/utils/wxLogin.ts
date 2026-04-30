import * as bridgeSdk from '../utils/bridge'
import { wxLogin } from '@/api/login';

// 获取用户信息
export const getUserInfo = function({ provider } = { provider: "weixin" }){
	return new Promise(async resolve=>{
		// 缓存中读取用户信息
		const userProfile = bridgeSdk.getStorageSync('userProfile');
		// 存在已授权数据
		if(userProfile){
			resolve(userProfile);
			return
		}
		// 不存在已授权数据
		const infoRes = await getUserProfile();
		resolve(infoRes);
	});
};

// 登录且获取用户信息
export const getUserInfoByLogin = async function({ provider } = { provider: "weixin" }){
	// 获取微信登录code
	const loginRes: any = await login({ provider });
	// // 获取用户信息接口返回的数据
	// const infoRes = await getUserInfo({ provider });
    console.log("用户登录信息：", loginRes);
    // 更新用户信息
    const res = updateUserinfo({ loginRes });
	return res;
};

// 获取微信登录code
export const login = function({ provider } = { provider: "weixin" }){
	return new Promise(resolve=>{
		// #ifdef MP-WEIXIN || MP-ALIPAY
		uni.login({
		  provider: provider as any,
		  success: loginRes=>{
			console.log("用户登录login code：", loginRes)
			resolve(loginRes);
		  }
		});
		// #endif
		// #ifdef H5
		// 后台重定向到项目时会拼上一个code，用于识别用户身份
		const code = bridgeSdk.getUrlObj(window.location.href)?.query?.code;
		console.log("项目进入code：", code)
		resolve({
			code
		});
		// #endif
	});
};

// 获取用户信息(getUserInfo获取的个人信息已加密，无法直接使用)
export const getUserProfile = function(){
	return new Promise(async resolve=>{
		// #ifdef MP-WEIXIN || MP-ALIPAY
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
		// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		wx.getUserProfile({
		  desc: '提供更好的服务', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
		  success: async (detail: any) => {
			 // console.log(detail);
			  // 用户主动登录后记录个人信息，防止后续重复触发弹窗影响体验
			  bridgeSdk.setStorageSync('userProfile', detail);
			  uni.showLoading({
				title: '登录中',
				mask: true
			  });
			  const loginUserInfo = await getUserInfoByLogin();
			  console.log("--11-- loginUserInfo")
			  console.dir(loginUserInfo);
			  uni.hideLoading();
			  resolve(loginUserInfo);
		  },
		  fail: (error: { errMsg: string; }) => {
			console.log(error);
			uni.showToast({
                title: error.errMsg,
                icon: 'none',
                mask: true
            });
			resolve({});
		  }	
		})
		// #endif
		// #ifdef H5
		const userInfo = await getUserInfoByCode()
		resolve(userInfo);
		// #endif
	});
}

// 使用code换取用户信息(h5)
export const getUserInfoByCode = async ()=>{
	const getUserInfoByWxCode = (params: { code: string }) => {
		return new Promise<void>(resolve=>{ resolve() });
	}
	// #ifdef H5
	// 旧code
	const oldCode = bridgeSdk.getStorageSync('oldCode');
	// 新code
	const code = bridgeSdk.getUrlObj(window.location.href).query.code;
	const userInfo = bridgeSdk.getStorageSync('userProfile');
	return new Promise(async (resolve, reject)=>{
		// code未改变时(未重新授权登录，授权登录后会生成一个新code)，缓存中存在用户信息，直接返回
		if(userInfo && oldCode===code){
			resolve(userInfo);
			return
		}
		// 缓存中不存在用户信息或code已改变(已重新授权登录，授权登录后会生成一个新code)，调用接口通过code换取用户信息
		const info: any = await getUserInfoByWxCode({
			code
		});
		bridgeSdk.setStorageSync('oldCode', code)
		// 获取成功
		if(info.code==="0000"){
			// 保存用户信息
			bridgeSdk.setStorageSync('userProfile', info.data);
			resolve(info.data)
			return
		}
		// code换取用户信息失败时，需要重新走授权登录
		location.href = __VITE_AUTHORIZE_URL__;
	})
	// #endif
}

/**
 * 更新用户信息
 * 适配：微信小程序、支付宝小程序
 */
const updateUserinfo = async function (parma?: {
  loginRes: { code: any }
}) {
  if (!parma || !parma.loginRes || !parma.loginRes.code) {
    return null;
  }
  console.log("更新用户信息");
  return new Promise(async (resolve) => {
    let deviceInfo: any = await bridgeSdk.getDeviceInfo();
    // console.info(deviceInfo);
    let res = await wxLogin({code: parma.loginRes.code || "",
      deviceType: deviceInfo.deviceType || "",
      deviceSystem: deviceInfo.system,
      deviceCode: deviceInfo.deviceId,
      loginIp: "",
      loginVersion: deviceInfo.appVersion || "",
      netType: "",
      netSupply: ""
    })
	resolve(res);
  });
};
