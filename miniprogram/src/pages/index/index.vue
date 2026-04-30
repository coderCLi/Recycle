<!--
 * @Description: 首页
 * @Author: yulongchen
 * @Date: 2023-05-23 19:35:42
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-24 10:57:50
-->
<template>
    <vc-modal ref="modal"></vc-modal>
  <view class="main" :style="{ 'padding-top': navH + 'px' }">
	  <vc-status-bar />
	  
    {{ $t('home.title') }}
    <vc-serach />
    <button @click="tPackageA">package-a</button>
    <button @click="toPackageCalculator">package-calculator</button>
    <button @click="toPackageCharm">package-charm</button>
    <button @click="toPackageConsumption">package-consumption</button>
    <button @click="toPackageCounponsQuan">package-counpons-quan</button>
    <button @click="toPackageMore">package-more</button>
    <button @click="toPackagePublicAct">package-public-act</button>
    <button @click="toPackageQuestionAnswering">package-question-answering</button>
    <button @click="toPackageTrash">package-trash</button>
    <button @click="toPackageSupervisory">package-supervisory</button>
    <button @click="toPackageBaomingNew">package-baomingNew</button>
	<vc-safe-bottom />
  </view>
</template>
<script>
  import { mapState, mapActions } from 'pinia'
  import { useBaseStore } from "@/store/index";
  import { getBannerList } from '@/api/index';
  export default {
    name: "home",
    data() {
      return { 
        
      }
    },  
    computed: {
      ...mapState(useBaseStore, ['navH'])
    },
    async onLoad(options) {
      await this.firstInit();
      // console.log('mounted', this.appConfig, this.reg, this.bridgeSdk);
      // this.bridgeSdk.jumpPage({
      //   url: 'https://www.baidu.com?needLogin=true&userId=$id&userName=$nickname&phone=$phone&__hbd__encryptData__=true_name::$realName,phone::$phone,id_no::$idcard,encryptMode::aes,encryptKey::1234567890123456,encryptIv::567890',
      // });
	  
      getBannerList({
        rows: 5,
        page: 1,
        useState: 1
      }).then(result => {
		    console.log("getBannerList result: ", result)
		
      })
      
    },
    methods: {
      tPackageA(){
        uni.navigateTo({
          url: '/package-a/demo/index?title=分包'
        })
      },
      toPackageCalculator(){
        uni.navigateTo({
          url: '/package-calculator/personal/index'
        })
      },
      toPackageCharm(){
        uni.navigateTo({
          url: '/package-charm/charm/charm'
        })
      },
      toPackageConsumption(){
        this.bridgeSdk.jumpPage({
          url: '/package-consumption/consumption/consumption?contentType=3&title=放心消费&needLogin=flase'
        });
      },
      toPackageCounponsQuan(){
        this.bridgeSdk.jumpPage({
          url: '/package-counpons-quan/alreadyStarted/alreadyStarted'
        });
      },
      toPackageMore(){
        this.bridgeSdk.jumpPage({
          url: '/package-more/more/more?contentType=3&title=更多服务&needLogin=flase'
        });
      },
      toPackagePublicAct(){
        this.bridgeSdk.jumpPage({
          url: '/package-public-act/vote/index'
        });
      },
      toPackageQuestionAnswering(){
        this.bridgeSdk.jumpPage({
          url: '/package-question-answering/pages/index'
        });
      },
	  toPackageTrash(){
		  this.bridgeSdk.jumpPage({
		    url: '/package-trash/trash/index'
		  });
	  },
	  toPackageSupervisory(){
		  this.bridgeSdk.jumpPage({
		    url: '/package-supervisory/supervisory/index'
		  });
	  },
	  toPackageBaomingNew(){
		  this.bridgeSdk.jumpPage({
		    url: '/package-baomingNew/pages/baomingcom'
		  });
	  },
    }
  } 
</script>

<style lang="scss">

</style>