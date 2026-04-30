<template>
    <vc-container :props-data="propsData" class="welfarenew">
        <view class="page-main"
            :style="{ height: `calc(100vh - ${navigationBarInfo.statusBarHeight + navigationBarInfo.navigationBarHeight}px)` , overflow: 'scroll'}">
            <view class="imageBox flex_shrink position_sticky">
                <image :src="minioBaseUrl + imgUrl" class="imagePage" mode="widthFix" />
            </view>
            <scroll-view scroll-y class="flex_grow">
                <image :src="minioBaseUrl + imgUrl2" class="imagePage" mode="widthFix" v-if="imgUrl2" />
            </scroll-view>
        </view>
    </vc-container>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";
export default {
    computed: {
        ...mapState(useUserStore, {
            isLogined: "isLogined",
        }),
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            propsData: {
                props: {
                    title: {
                        value: "图片详情"
                    }
                }
            },
            imgUrl: '',
            imgUrl2: '',
            imgUrl3: '',
        }
    },
    onLoad(options) {
        console.log(options)
        this.imgUrl = options.url
        if (options.title) {
            this.propsData.props.title.value = options.title
        }
        if (options.url2) {
            this.imgUrl2 = options.url2
        }
        if (options.url3) {
            this.imgUrl3 = options.url3
        }
    }
}
</script>

<style scoped>
.page-main {
    width: 750rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.flex_shrink {
    flex-shrink: 0;
}
.flex_grow{
    flex-grow: 1;
}

.imagePage {
    width: 750rpx;
}

.position_sticky {
    position: sticky;
    top: 0;
    z-index: 1;
}
</style>