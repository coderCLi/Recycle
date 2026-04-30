<!--
 * @Description: 关于我们
 * @Author: chenyulong
 * @Date: 2024-10-11 11:04:57
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-24 10:56:49
 * @Remark: 
-->
<template>
    <vc-modal ref="modal"></vc-modal>
  <view class="main">
	<vc-status-bar />
	
    <text>{{ $t('about.title') }}</text>
	
	<vc-safe-bottom />
  </view>
</template>
<script>
  export default {
    name: "about",
    data() {
      return {
		
      }
    },
    async onLoad(options) {
      await this.firstInit();
      // console.log('mounted', this.appConfig, this.reg);

    },
    computed: {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>

</style>
