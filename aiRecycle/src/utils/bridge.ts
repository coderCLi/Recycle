export const bridgeSdk = {
  switchTab: (options: { url: string; success?: () => void; fail?: () => void }) => {
    uni.switchTab({
      url: options.url,
      success: options.success,
      fail: options.fail
    })
  },

  navigateTo: (options: { url: string; success?: () => void; fail?: () => void }) => {
    uni.navigateTo({
      url: options.url,
      success: options.success,
      fail: options.fail
    })
  },

  navigateBack: (options: { delta?: number; success?: () => void; fail?: () => void } = {}) => {
    uni.navigateBack({
      delta: options.delta || 1,
      success: options.success,
      fail: options.fail
    })
  },

  getStorageSync: (key: string) => {
    return uni.getStorageSync(key)
  },

  setStorageSync: (key: string, value: any) => {
    uni.setStorageSync(key, value)
  },

  removeStorageSync: (key: string) => {
    uni.removeStorageSync(key)
  },

  showToast: (options: { title: string; icon?: string; duration?: number }) => {
    uni.showToast({
      title: options.title,
      icon: options.icon || 'none',
      duration: options.duration || 2000
    })
  },

  showModal: (options: { 
    title?: string; 
    content?: string; 
    showCancel?: boolean; 
    cancelText?: string; 
    confirmText?: string;
    success?: (res: { confirm: boolean; cancel: boolean }) => void 
  }) => {
    uni.showModal({
      title: options.title || '',
      content: options.content || '',
      showCancel: options.showCancel !== undefined ? options.showCancel : true,
      cancelText: options.cancelText || '取消',
      confirmText: options.confirmText || '确定',
      success: options.success
    })
  },

  chooseImage: (options: { 
    count?: number; 
    sizeType?: string[]; 
    sourceType?: string[];
    success?: (res: { tempFilePaths: string[] }) => void;
    fail?: () => void 
  }) => {
    uni.chooseImage({
      count: options.count || 1,
      sizeType: options.sizeType || ['compressed'],
      sourceType: options.sourceType || ['album', 'camera'],
      success: options.success,
      fail: options.fail
    })
  },

  makePhoneCall: (options: { phoneNumber: string }) => {
    uni.makePhoneCall({
      phoneNumber: options.phoneNumber
    })
  },

  getSystemInfoSync: () => {
    return uni.getSystemInfoSync()
  }
}

export default bridgeSdk