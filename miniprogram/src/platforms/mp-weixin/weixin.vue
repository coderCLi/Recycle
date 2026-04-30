<!--
 * @Description: 微信小程序环境专用页面示例
 * @Author: yulongchen
 * @Date: 2024-12-06 15:42:33
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-24 10:58:33
 * @Remark: 
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="main" :style="{ 'padding-top': navH + 'px' }">
      <vc-status-bar />
      <vc-navbar :props-data="propsData" />

      <!-- 多语言自动适配：{{ t('home.title') }} -->

      <vc-safe-bottom />
    </view>
</template>

<script>
  import { mapState } from 'pinia'
  import { useBaseStore } from "@/store/index";
  // import { testCustomHeader } from '@/api/demo'
  export default {
    name: "weixin",
    data() {
      return { 
        // 层级是固定写法
        propsData: {
            props: {
                title: {
                  value: '微信小程序环境专用页面示例'
                },
                // fixed: {
                //   value: true
                // },
            }
        }
      }
    },  
    computed: {
      ...mapState(useBaseStore, ['navH'])
    },
    async onLoad(options) {
      await this.firstInit();
      // console.log('mounted', this.appConfig, this.reg, this.bridgeSdk);
      // const environment = await this.bridgeSdk.getEnvironment();
      // console.log('当前环境是：', environment);

      // // 监听登录成功事件，这里可以执行因登录被拦截掉的逻辑
      // uni.on('loginSuccess', res => {
      //   console.log('loginSuccess', res);
        
      // });
      
      // try {
      //   const res = await testCustomHeader();
      //   console.log('res', res);
      // } catch (error) {
      //   console.log('res error', error);
      // }

    },
    onUnload() {
      // uni.off('update')
    },
    methods: {
      // ...mapActions(useBaseStore, ['setNavH']),
      // jumpToH5(){
      //   this.bridgeSdk.jumpPage({
      //     url: '/pages/h5/h5?url=https://www.baidu.com&needLogin=flase'
      //   });
      // }   
    }
  } 
</script>

<style lang="scss" scoped>

</style>
