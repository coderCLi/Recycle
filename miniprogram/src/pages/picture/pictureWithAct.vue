<!--
 * @Description: 根据json配置展示图片（页面中有可点击跳转的图片按钮）, 图片上传到minio后, 在json配置管理中配置该图片路径, 跳转时拼上json配置数据的id, 可解决某些临时场景仅展示图片需求, 无需重复开发功能
 * @Author: TF
 * @Date: 2025-05-23 08:45:56
 * @LastEditors: TF
 * @LastEditTime: 2025-07-17 16:38:23
 * @Remark: 
    1. 运维管理平台 =》文件管理 =》文件管理 菜单下点击上传图片, 完成后然后列表中复制真实路径, 比如: https://life.hihihi.com.cn/minio/hbdbucket/2025/04/25/11/wx250425110712199001448.png
    2. 移动中台 =》JSON数据管理 =》JSON数据管理 菜单下点击添加, 完成后然后列表中复制ID(建议自定义有意义的名称, 如: get-picture-recruitment-2025-04-25), 前端通过url参数(首页、更多服务中配置的)的中id查询json数据, 然后解析渲染;
    3. 需要跳转该页的地方, 直接拼上id参数, 如: /pages/picture/picture?json_data_id=get-picture-recruitment-2025-04-25;
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container ref="container" :props-data="prosData" style="position: relative;">
        <image
            v-for="(img, index) in imgUrlList"
            @load="doLoaded(index)"
            :key="index"
            class="image"
            :src="img"
            mode="widthFix"
        />
        <!-- 按钮位置（单图片按钮） -->
        <template v-if="isLoaded && bridgeSdk.checkIsEmpty(content.button)">
            <image 
                mode="widthFix"
                :src="content.button.imgUrl" 
                :style="{position: content.button.positionType, ...content.button.position}" @click="goPage(content.button)"/>
        </template>
        <!-- 按钮位置（多图片按钮） -->
        <template v-else-if="isLoaded && bridgeSdk.checkIsEmpty(content.buttons)">
            <image 
                v-for="(item, index) in content.buttons" :key="index"
                mode="widthFix"
                :src="item.imgUrl" 
                :style="{position: item.positionType, ...item.position}" @click="goPage(item)"/>
        </template>
        <!-- 按钮位置（热区） -->
        <template v-else-if="isLoaded && bridgeSdk.checkIsEmpty(content.hots)">
            <view  v-for="(item, index) in content.hots" :key="index" :style="{position: item.positionType, ...item.position}" @click="goPage(item)"></view>
        </template>
    </vc-container>
</template>

<script>
import { getJsonDetailById } from "@/api/index";
export default {
    name: "pictureWithAct",
    data() {
        return {
            imgUrlList: [],
            content: {},// 内容
            prosData: {
                props: { 
                    // isFullScreen: { value: true }, 
                    title: { value: '' }
                }
            },
            loadList: [],// imgList对应图片加载状态列表
        }
    },
    computed:{
        // imgList是否全部加载完毕
        isLoaded() {
            return this.loadList.every(e => e === true)
        }
    },
    async onLoad(options) {
        console.log("json图片配置: ", options);

        // options.json_data_id = "get-picture-recruitment-2025-04-25";

        const { json_data_id } = options;

        const res = await getJsonDetailById({ id: json_data_id })
        console.log("图片配置数据: ", res);

        this.$nextTick(() => {
            this.$refs.container.setNavPropsData({
                title: {
                    value: res.name
                }
            })
        });

        const content = JSON.parse(res.content);
        console.log(content)
        this.content = content
        // 设置默认imgList对应图片加载状态列表为false
        this.loadList = content.img.map(e => false)
        this.imgUrlList = content.img;
    },
    methods: {
        // 跳转操作
        async goPage(item) {
            let res;
            // 1-无需登录 2-需要登录 3-实名认证 4-人脸识别
            switch (item.permission){
                // 无需登录等权限
                case "1":
                    this.bridgeSdk.jumpPage({
                        url: `${item.jumpUrl}`,
                        title: item.title,
                    })
                    break;
                case "2":
                    res = await this.bridgeSdk.checkLogin()
                    if(!res) return
                    this.bridgeSdk.jumpPage({
                        url: `${item.jumpUrl}`,
                        title: item.title,
                    })
                    break;
                case "3":
                    res = await this.bridgeSdk.checkIdentityAuth()
                    if(!res) return
                    this.bridgeSdk.jumpPage({
                        url: `${item.jumpUrl}`,
                        title: item.title,
                    })
                    break;
                default: 
                    this.bridgeSdk.jumpPage({
                        url: `${item.jumpUrl}`,
                        title: item.title,
                    })
                    break;
            }
        },
        // 图片加载完毕事件
        doLoaded(i) {
            // 设置imgList对应图片加载状态列表为true
            this.loadList = this.loadList.map((e, _i) => i==_i || e)
        }
    }
} 
</script>

<style lang="scss" scoped>
    .image {
        width: 100%;
        float: left;
    }
    :deep(.page-content){
        position: relative;
    }
</style>
