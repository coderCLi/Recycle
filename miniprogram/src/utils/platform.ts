// 只能判断编译到的平台，不能判断真实运行的环境，咱们项目编译出的只会是h5、微信小程序
export const platform = __UNI_PLATFORM__
export const isH5 = __UNI_PLATFORM__ === 'h5'
export const isApp = __UNI_PLATFORM__ === 'app'
export const isMp = __UNI_PLATFORM__.startsWith('mp-')
const PLATFORM = {
  platform,
  isH5,
  isApp,
  isMp,
}
// console.log('PLATFORM', PLATFORM)
export default PLATFORM;
