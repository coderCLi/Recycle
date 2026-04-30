import * as bridge from '@/utils/bridge'
const { hbd, isInHiApp, getStorageSync, setStorageSync, removeStorageSync } = bridge;
import * as utils from "@/utils/utils";
import { getInitCode } from "@/api/login";
// 本地开发环境且App环境需要注册sdk初始化，否则sdk调用无权限
export default async function () {
    return new Promise(async (resolve, reject) => {
        const apisCall = () => {
            // 隐藏系统标题栏
            hi.setNavigationBarTitle({
                showNavBar: '0',
                fail: (error: any) => {
                    console.log("hi.setNavigationBarTitle error: ", error);
                }
            } as any);

            // 隐藏系统状态栏
            hi.setShowStatusBar({
                showStatusBar: '0',
                fail: (error: any) => {
                    console.log("hi.setShowStatusBar error: ", error);
                }
            } as any);
            
            // 禁止webview下拉刷新
            // @ts-ignore
            hi.setPullDownRefresh({
                pullDownRefresh: '0',
                fail: (error: any) => {
                    console.log("hi.setPullDownRefresh error: ", error);
                }
            });

            // 隐藏右上角胶囊
            hi.setCapsule({
                capsule: "0",
                // 成功，可选参数
                success: function(res) {},
                // 失败，可选参数
                fail: function(res) {
                    console.log("hi.setCapsule fail: ", res)
                },
                // 无论成功、失败都会回调，可选参数
                complete: function(res) {}
            });

            // 开启chrome远程调试，非生产环境开启调试，这样方便调试报错信息
            // if(__DEPLOY_ENV__ !== 'pro'){
                // @ts-ignore
                hi.setDebug({
                    debug: "1",
                    complete: function(res) {
                        console.log("hi.setDebug complete: ", res)
                    }
                });
            // }

            // 禁止页面回弹
            // @ts-ignore
            hi.setBounce({
                bounce: "0",
                complete: function(res) {
                    console.log("hi.setBounce complete: ", res)
                }
            });
        };

        // App环境需要初始化sdk
        if(isInHiApp() && bridge.isDev()) {
            console.log('本地开发环境且App环境需要注册sdk初始化，否则sdk调用无权限，大连海创嗨创生活体系线上不会执行此逻辑');

            let thirdInitCode = await utils.getThirdPartyInitCode();
        
            // 初始化仅重试一次，失败后不再重试
            let sdkFailRetry = false;
        
            // 大连海创嗨创生活js sdk初始化
            const sdkConfig = () => {
                hi.config({
                    debug: false,
                    appId: thirdInitCode.appid,
                    initCode: thirdInitCode.initCode,
                    authorizeApis: []
                });
                
                hi.ready({
                    success: async (res: any) => {
                        console.log("hbd sdk 初始化成功，以后就可以调用api了，否则会调用失败哦！", res); 

                        apisCall();
                        
                        resolve(res);
                    }
                })
        
                hi.error({
                    success: async (err: any) => {
                        console.log("hbd sdk 初始化失败", err);
                        removeStorageSync("thirdInitCode");
        
                        if(sdkFailRetry){
                            console.log("hbd sdk 初始化失败，且已经重试过，请检查initCode是否正确");
        
                            uni.showToast({
                                title: "初始化失败，请检查initCode",
                                icon: "none",
                                duration: 2000
                            });
        
                            resolve(err);
                            return;
                        }
                        
                        // 初始化失败，说明initCode失效，重新获取
                        thirdInitCode = await getInitCode();
                        console.log("refetch thirdInitCode: ", thirdInitCode);
                        
                        setStorageSync("thirdInitCode", thirdInitCode);
        
                        sdkFailRetry = true;
        
                        // 重新初始化
                        sdkConfig();
        
                    }
                });
        
            }
        
            sdkConfig();
        } 
        // 大连海创嗨创生活app体系内（同域名下的站点都算同一体系）可以不调用config初始化方法直接使用sdk api
        else if(isInHiApp() && !bridge.isDev()){
            apisCall();
            resolve(null);
        }
        // 非App环境不做任何处理
        else {
            resolve(null);
        }
    });
}