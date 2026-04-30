/*
 * @Description: uni api截器
 * @Author: chenyulong
 * @Date: 2024-10-11 10:53:00
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-09 15:25:32
 * @Remark: 
 */
export const apiInterceptor = {
  install() {
    // 拦截h5图片预览api
    // #ifdef H5
    uni.addInterceptor('previewImage', {
        success(args) {
            console.log('previewImage success', args);
            setTimeout(() => {          
                // 删除预览图片关闭按钮
                const closeBtn = document.querySelector("#u-a-p uni-swiper~div");
                console.log("closeBtn", closeBtn);
                closeBtn?.remove();
            }, 5);
        }
    })
    // #endif
  }
}
