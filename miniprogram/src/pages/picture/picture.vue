<!--
 * @Description: 根据json配置展示图片, 图片上传到minio后, 在json配置管理中配置该图片路径, 跳转时拼上json配置数据的id, 可解决某些临时场景仅展示图片需求, 无需重复开发功能
 * @Author: yulongchen
 * @Date: 2024-12-19 13:08:12
 * @LastEditors: 陈玉龙
 * @LastEditTime: 2025-04-25 11:54:39
 * @Remark: 
    1. 运维管理平台 =》文件管理 =》文件管理 菜单下点击上传图片, 完成后然后列表中复制真实路径, 比如: https://life.hihihi.com.cn/minio/hbdbucket/2025/04/25/11/wx250425110712199001448.png
    2. 移动中台 =》JSON数据管理 =》JSON数据管理 菜单下点击添加, 完成后然后列表中复制ID(建议自定义有意义的名称, 如: get-picture-recruitment-2025-04-25), 前端通过url参数(首页、更多服务中配置的)的中id查询json数据, 然后解析渲染;
    3. 需要跳转该页的地方, 直接拼上id参数, 如: /pages/picture/picture?json_data_id=get-picture-recruitment-2025-04-25;
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container" :props-data="prosData">
        <image
          v-for="(img, index) in imgUrlList"
          class="image"
          :src="img"
          mode="widthFix"
        />
    </vc-container>
</template>

<script>
  import { getJsonDetailById } from "@/api/index";
  export default {
    name: "picture",
    data() {
      return {
        imgUrlList: [],
        prosData: {
            props: { 
                isFullScreen: { value: true }, 
                title: { value: '' }
             }
        }
      }
    },  
    async onLoad(options) {
      console.log("json图片配置: ", options);

      // options.json_data_id = "get-picture-recruitment-2025-04-25";

      const { json_data_id } = options;

      const res = await getJsonDetailById({ id: json_data_id });
      console.log("图片配置数据: ", res);

      this.$nextTick(() => {
        this.$refs.container.setNavPropsData({
            title: {
                value: res.name
            }
        })
      });

      const content = JSON.parse(res.content);
      this.imgUrlList = content.img;

    },
    methods: {

    }
  } 
</script>

<style lang="scss" scoped>
    .image {
        width: 100%;
        float: left;
    }
</style>
