<template>
    <vc-modal ref="modal"></vc-modal>
    <view class="top-arc-bg" :style="{
        paddingTop: navigationBarInfo.statusBarHeight + 'px',
        height: navigationBarInfo.navigationBarHeight + 'px',
    }">
        <view class="nav-bar">
            <vc-back :props-data="{
                props: { top: { value: '10px' }, color: { value: '#fff' } },
            }" />
        </view>
    </view>
    <view class="box" :style="{ paddingTop: safeTopDistance + 'px' }">
        <image class="bg" :src="minioBaseUrl + '/common/tabbarImages/mine_bg_img.png'" mode="scaleToFill" />

        <view class="header">
            <view class="header_left">
                <image class="header_left_logo" :src="minioBaseUrl + '/common/tabbarImages/logo_small_image.png'" mode="heightFix"/>
                <view class="header_left_title">商户</view>
                <view class="header_left_desc">二维码收款</view>
            </view>
            <view class="header_right">
                <image class="header_right_img" :src="minioBaseUrl + '/common/mctImages/icon_pattern_style_img.png'"
                    mode="scaleToFill" />
            </view>
        </view>
        <view class="content">
            <view class="content_header">
                <image class="content_header_bg" :src="minioBaseUrl + '/common/mctImages/icon_pattern_style03_img.png'"
                    mode="scaleToFill" />

                <view class="content_header_body">
                    <image class="content_header_body_header" :src="minioBaseUrl + header" mode="scaleToFill" />
                    <view class="content_header_body_main">

                        <view class="content_header_body_name">{{ name }}</view>
                        <!-- <view class="content_header_body_address">
                            <up-icon name="map" color="#6D6B6B"></up-icon>
                            {{ address }}
                        </view> -->
                    </view>
                </view>
                <image class="content_header_coin"
                    :src="minioBaseUrl + '/common/mctImages/icon_pattern_style02_img.png'" mode="scaleToFill" />
            </view>
            <view class="content_qrcode">
                <image class="qrcode_image" v-show="qrcodeImaUrl" :src="qrcodeImaUrl" mode="scaleToFill" />
                <u-qrcode ref="qrcode" class="qrcode_body" cid="qrcode" size="200" :val="codeValue"
                    :showLoading="true" @result="qrcodeResult"></u-qrcode>
                <view class="content_qrcode_footer">
                    <image class="content_qrcode_img"
                        :src="minioBaseUrl + '/common/tabbarImages/huiyuanma_label_left_img.png'" mode="scaleToFill" />
                    <text class="content_qrcode_text">请用微信扫码支付</text>
                    <image class="content_qrcode_img"
                        :src="minioBaseUrl + '/common/tabbarImages/huiyuanma_label_right_img.png'" mode="scaleToFill" />
                </view>
            </view>
        </view>
        <view v-if="isCanvasReady&&showSaveBtn" class="content_footer" @tap="handleClick">
            生成动态海报
        </view>
    </view>
    <!-- 旧版Canvas（全版本兼容） -->
    <canvas canvas-id="posterCanvas" class="hidden-canvas" style="width: 750px; height: 1518px;" />
    <up-modal :show="modalShow">
        <!-- 海报预览 -->
        <view class="preview-container" v-if="posterUrl">
            <image :src="posterUrl" mode="widthFix" class="preview-img" />
        </view>
        <!-- 操作按钮 -->
        <template #confirmButton>
            <view class="btn-group">
                <button @click="cancelSavePoster" :disabled="!posterUrl" class="btn-cancel">取消</button>
                <button @click="handleSavePoster" :disabled="!posterUrl" class="btn-save">保存到相册</button>
            </view>
        </template>
    </up-modal>
</template>

<script>
// 常量配置抽离（全局）
const CANVAS_CONFIG = {
    id: 'posterCanvas',
    width: 750,
    height: 1518,
    initDelay: 300, // Canvas初始化延迟
    quality: 0.9, // 图片质量
    scale: 2 // 输出缩放比
};

import { mapState } from "pinia";
import { useBaseStore } from "@/store/index";
export default {
    name: "displayCode",
    computed: {
        ...mapState(useBaseStore, {
            safeTopDistance: "safeTopDistance",
            navigationBarInfo: "navigationBarInfo",
        }),
    },
    data() {
        return {
            mctId: '',
            header: '',
            name: '',
            address: '',
            codeValue: '',
            show: false,
            qrcodeImaUrl: "",
            // 核心状态
            posterUrl: '', // 生成的海报临时路径
            canvasCtx: null, // Canvas上下文（旧版API）
            isCanvasReady: false, // Canvas是否就绪
            showSaveBtn: false, // 展示保存按钮

            modalShow: false, // 展示弹窗

            // 动态商户数据（可从接口赋值）
            merchantData: {}
        }
    },
    onLoad(options) {
        this.mctId = options.mctId || '';
        this.header = options.header || '';
        this.name = options.name || '';
        this.address = options.address || '';
        if (this.address == "null" || this.address == "undefined") {
            this.address = ""
        }


        this.codeValue = this.staticBaseUrl + `?mctId=${this.mctId}`;
        console.log("this.codeValue", this.codeValue);
    },
    // ===== 2. 生命周期 =====
    onReady() {
        // 页面就绪后初始化Canvas
        this.initCanvas()

        let tim = setTimeout(()=>{
            this.showSaveBtn = true
            clearTimeout(tim)
        }, 1000)
    },
    methods: {
        qrcodeResult(res) {
            console.log("qrcodeResult", res)
            this.qrcodeImaUrl = res
        },
        handleClick() {
            this.isUserClick = true;
            this.saveToAlbum();
            // 延迟重置，避免重复触发
            setTimeout(() => {
                this.isUserClick = false;
            }, 1000);
        },
        saveToAlbum() {
            console.log("saveToAlbum")
            console.log("saveToAlbum 被调用", new Error().stack); // 打印调用堆栈
            // 非用户手动点击，直接返回
            if (!this.isUserClick) {
                console.log("过滤小程序误触发的点击事件");
                return;
            }
            if(this.posterUrl){
                this.modalShow = true
                return
            }
            if (this.isCanvasReady) {
                this.merchantData = {
                    avatar: this.minioBaseUrl + this.header,
                    name: this.name,
                    address: this.address,
                    qrCode: this.qrcodeImaUrl,
                    bg: this.minioBaseUrl + "common/mctImages/posterBg.png",
                }
                this.handleGeneratePoster()
            }

        },
        /********************* Canvas 初始化相关 *********************/
        /**
         * 初始化Canvas上下文（旧版API）
         */
        initCanvas() {
            //   uni.nextTick(() => {
            setTimeout(() => {
                const ctx = uni.createCanvasContext(CANVAS_CONFIG.id);
                if (ctx) {
                    this.canvasCtx = ctx;
                    this.isCanvasReady = true;
                    console.log('✅ Canvas初始化成功（旧版API）');
                } else {
                    uni.showToast({ title: 'Canvas初始化失败', icon: 'none' });
                }
            }, CANVAS_CONFIG.initDelay);
            //   });
        },

        /**
         * 清空画布
         */
        clearCanvas() {
            if (this.canvasCtx) {
                this.canvasCtx.clearRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
            }
        },

        /********************* 图片加载/绘制相关 *********************/
        /**
         * 加载图片资源（转本地路径避免跨域）
         * @param {string} url 图片地址
         * @returns {Promise<string>} 本地临时路径
         */
        loadImage(url) {
            return new Promise((resolve, reject) => {
                if (!url) {
                    reject(new Error('图片地址为空'));
                    uni.showToast({ title: '图片地址为空', icon: 'none' });
                    return;
                }

                uni.getImageInfo({
                    src: url,
                    success: (res) => resolve(res.path),
                    fail: (err) => {
                        reject(err);
                        uni.showToast({ title: '图片加载失败', icon: 'none' });
                    }
                });
            });
        },

        /**
         * 绘制圆形头像
         * @param {string} avatarPath 头像本地路径
         */
        drawCircleAvatar(avatarPath) {
            if (!this.canvasCtx || !avatarPath) return;

            // 绘制圆形裁剪区域
            this.canvasCtx.save();
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(
                118 + 58,
                470 + 58,
                58,
                0,
                2 * Math.PI
            );
            this.canvasCtx.clip();
            // 绘制头像
            this.canvasCtx.drawImage(
                avatarPath,
                118,
                470,
                116,
                116
            );
            this.canvasCtx.restore();

            // 绘制头像边框
            this.canvasCtx.save();
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(
                118 + 58,
                470 + 58,
                58,
                0,
                2 * Math.PI
            );
            this.canvasCtx.setStrokeStyle('#fff');
            this.canvasCtx.setLineWidth(4);
            this.canvasCtx.stroke();
            this.canvasCtx.restore();
        },

        /**
         * 绘制多行文字（自动换行）
         * @param {string} text 文本内容
         * @param {number} x 起始X
         * @param {number} y 起始Y
         * @param {number} maxWidth 最大宽度
         * @param {number} lineHeight 行高
         * @param {number} fontSize 字体大小
         * @param {string} color 字体颜色
         */
        drawMultilineText(text, x, y, maxWidth, lineHeight, fontSize, color) {
            if (!this.canvasCtx || !text) return;

            this.canvasCtx.save();
            this.canvasCtx.setFontSize(fontSize);
            this.canvasCtx.setFillStyle(color);
            this.canvasCtx.setTextAlign('left');

            const chr = text.split('');
            let temp = '';
            const row = [];

            // 分行处理
            for (let a = 0; a < chr.length; a++) {
                if (this.canvasCtx.measureText(temp).width < maxWidth) {
                    temp += chr[a];
                } else {
                    a--;
                    row.push(temp);
                    temp = '';
                }
            }
            row.push(temp);

            // 逐行绘制
            row.forEach((line, b) => {
                this.canvasCtx.fillText(line, x, y + b * lineHeight);
            });
            this.canvasCtx.restore();
        },

        /**
         * 核心绘制逻辑
         * @returns {Promise<string>} 海报临时路径
         */
        async drawPoster() {
            if (!this.isCanvasReady) {
                throw new Error('Canvas未就绪');
            }

            // 1. 清空画布
            this.clearCanvas();

            // 2. 加载动态图片资源
            const [avatarPath, qrCodePath, bgPath] = await Promise.all([
                this.loadImage(this.merchantData.avatar),
                this.loadImage(this.merchantData.qrCode),
                this.loadImage(this.merchantData.bg)
            ]);

            // 3. 绘制背景
            this.canvasCtx.setFillStyle('#f5f5f5');
            //   this.canvasCtx.fillRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
            this.canvasCtx.drawImage(bgPath, 0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height)

            // 4. 绘制顶部背景
            //   this.canvasCtx.setFillStyle('#42b983');
            //   this.canvasCtx.fillRect(0, 0, CANVAS_CONFIG.width, 200);

            // 5. 绘制头像
            this.drawCircleAvatar(avatarPath);

            // 6. 绘制商户名称
            this.canvasCtx.save();
            this.canvasCtx.setFontSize(32);
            // this.canvasCtx.setFont(`700 20px`);
            this.canvasCtx.setFillStyle('#000');
            this.canvasCtx.setTextAlign('left');
            // let nameY = this.merchantData.address?470:470+58
            this.canvasCtx.fillText(
                this.merchantData.name,
                278,
                470 + 58 + 16
            );
            this.canvasCtx.restore();

            // // 7. 绘制地址
            // if(this.merchantData.address){
            //     this.drawMultilineText(
            //         this.merchantData.address,
            //         278,
            //         550,
            //         CANVAS_CONFIG.width - 200,
            //         30,
            //         22,
            //         '#666'
            //     );
            // }

            // 8. 绘制二维码
            const qrSize = 400;
            const qrX = (CANVAS_CONFIG.width - qrSize) / 2;
            const qrY = 684;

            // 二维码白色背景
            // this.canvasCtx.setFillStyle('#fff');
            // this.canvasCtx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
            // 绘制二维码图片
            this.canvasCtx.drawImage(qrCodePath, qrX, qrY, qrSize, qrSize);

            // 9. 绘制提示文字
            // this.canvasCtx.save();
            // this.canvasCtx.setFontSize(24);
            // this.canvasCtx.setFillStyle('#333');
            // this.canvasCtx.setTextAlign('center');
            // this.canvasCtx.fillText(
            //     '扫码了解更多',
            //     CANVAS_CONFIG.width / 2,
            //     qrY + qrSize + 60
            // );
            // this.canvasCtx.restore();

            // 10. 完成绘制（旧版API必须调用draw）
            await new Promise((resolve) => {
                this.canvasCtx.draw(false, resolve);
            });

            // 11. 转为临时图片
            return new Promise((resolve, reject) => {
                uni.canvasToTempFilePath({
                    canvasId: CANVAS_CONFIG.id,
                    width: CANVAS_CONFIG.width,
                    height: CANVAS_CONFIG.height,
                    destWidth: CANVAS_CONFIG.width * CANVAS_CONFIG.scale,
                    destHeight: CANVAS_CONFIG.height * CANVAS_CONFIG.scale,
                    quality: CANVAS_CONFIG.quality,
                    success: (res) => resolve(res.tempFilePath),
                    fail: (err) => reject(err)
                });
            });
        },

        /********************* 保存相关 *********************/
        /**
         * 检查并申请相册权限
         * @returns {Promise<boolean>} 是否获取权限
         */
        async checkAlbumAuth() {
            const settingRes = await uni.getSetting();
            if (!settingRes.authSetting['scope.writePhotosAlbum']) {
                try {
                    await uni.authorize({ scope: 'scope.writePhotosAlbum' });
                } catch (err) {
                    // 用户拒绝授权，引导去设置页
                    return new Promise((resolve) => {
                        uni.showModal({
                            title: '权限提示',
                            content: '需要相册权限才能保存图片，请前往设置开启',
                            confirmText: '去设置',
                            cancelText: '取消',
                            success: (res) => {
                                if (res.confirm) uni.openSetting();
                                resolve(res.confirm);
                            }
                        });
                    });
                }
            }
            return true;
        },

        /**
         * 保存海报到相册
         * @param {string} filePath 海报临时路径
         * @returns {Promise<boolean>} 是否保存成功
         */
        async savePoster(filePath) {
            if (!filePath) {
                throw new Error('海报地址为空');
            }

            const hasAuth = await this.checkAlbumAuth();
            if (!hasAuth) return false;

            await uni.saveImageToPhotosAlbum({ filePath });
            return true;
        },

        /********************* 事件处理 *********************/
        /**
         * 生成海报点击事件
         */
        async handleGeneratePoster() {
            console.log("handleGeneratePoster")
            try {
                uni.showToast({ title: '生成中...', icon: 'loading', duration: 10000 });
                this.modalShow = true;
                const tempPath = await this.drawPoster();
                console.log("生成地址", tempPath)
                this.posterUrl = tempPath;
                uni.hideToast();
                uni.showToast({ title: '生成成功' });
            } catch (err) {
                uni.hideToast();
                this.modalShow = false;
                console.error('🚨 海报生成失败:', err);
                uni.showToast({ title: '生成失败，请重试', icon: 'none' });
            }
        },

        /**
         * 保存海报点击事件
         */
        async handleSavePoster() {
            if (!this.posterUrl) {
                uni.showToast({ title: '请先生成海报', icon: 'none' });
                return;
            }

            try {
                const success = await this.savePoster(this.posterUrl);
                if (success) {
                    uni.showToast({ title: '保存成功' });
                    this.modalShow = false;
                }
            } catch (err) {
                console.error('🚨 海报保存失败:', err);
                uni.showToast({ title: '保存失败，请重试', icon: 'none' });
            }
        },
        cancelSavePoster() {
            this.modalShow = false;
            this.posterUrl = "";
        },
        jumpPoster() {
            uni.navigateTo({
                url: "/package-product-list/displayCode/poster"
            })
        }
    }
}
</script>

<style scoped lang="scss">
.top-arc-bg {
    // position: relative;
    width: 100vw;
    // height: 360rpx;
    // background: linear-gradient(135deg, #19e2c2 0%, #00c6b1 100%);
    // border-bottom-left-radius: 60rpx;
    // border-bottom-right-radius: 60rpx;
    // margin-bottom: 120rpx;

    // z-index: 1;
    // overflow: visible;
    position: fixed;
    z-index: 2;

    .nav-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        // height: 100rpx;
        // padding: 0 30rpx;
        // padding-top: 44rpx; // 适配状态栏
        position: absolute;
        z-index: 2;
    }

}

.box {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    .bg {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;

    }

    .header {
        width: 100%;
        height: 334rpx;
        box-sizing: border-box;
        display: flex;
        padding: 0 100rpx 0 86rpx;
        justify-content: space-between;
        position: relative;

        .header_left {
            // padding-top: 56rpx;
            .header_left_logo{
                // width: 276rpx;
                height: 104rpx;
                position: relative;
                top: -20rpx;
            }

            .header_left_title {
                font-size: 80rpx;
                font-weight: bold;
                color: #FFFFFF;
                margin-bottom: 34rpx;
            }

            .header_left_desc {
                font-size: 36rpx;
                line-height: 38rpx;
                font-weight: 800;
                text-shadow: 0rpx 6rpx 12rpx 2rpx #458ED9;
                color: #FFFFFF;
            }

        }

        .header_right {
            width: 308rpx;
            height: 360rpx;

            .header_right_img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .content {
        width: 614rpx;
        border-radius: 20rpx;
        position: relative;

        .content_header {
            width: 100%;
            height: 210rpx;
            position: relative;
            border-radius: 20rpx 20rpx 0 0;

            .content_header_bg {
                width: 614rpx;
                height: 210rpx;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 0;
            }

            .content_header_body {
                width: 100%;
                height: 190rpx;
                box-sizing: border-box;
                padding: 0 50rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;

                .content_header_body_header {
                    width: 114rpx;
                    height: 114rpx;
                    flex-shrink: 0;
                    margin-right: 46rpx;
                    border-radius: 50%;
                }

                .content_header_body_main {
                    flex-grow: 1;

                    .content_header_body_name {
                        font-size: 32rpx;
                        font-weight: bold;
                        color: #230303;
                    }

                    .content_header_body_address {
                        font-weight: bold;
                        font-size: 20rpx;
                        color: #6D6B6B;
                        line-height: 28rpx;
                        margin-top: 26rpx;
                        display: flex;
                        align-items: center;
                    }
                }
            }

            .content_header_coin {
                width: 128rpx;
                height: 128rpx;
                position: absolute;
                right: -20rpx;
                top: -82rpx;
            }
        }

        .content_qrcode {
            width: 612rpx;
            height: 600rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: #fff;
            border-radius: 20rpx;
            margin-top: -20rpx;
            position: relative;

            .qrcode_body {
                pointer-events: none;
                width: 200px;
                height: 200px;
                position: absolute;
                top: -99999px;
                left: -99999px;
                z-index: -10000;
            }
            .qrcode_image {
                pointer-events: none;
                width: 200px;
                height: 200px;
            }

            .content_qrcode_footer {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 20rpx;
            }

            .content_qrcode_img {
                width: 52rpx;
                height: 38rpx
            }

            .content_qrcode_text {
                font-weight: 400;
                font-size: 32rpx;
                color: #031527;
                line-height: 44rpx;
            }

        }
    }

    .content_footer {
        width: 612rpx;
        height: 98rpx;
        background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%);
        margin-top: 116rpx;
        font-weight: normal;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 98rpx;
        text-align: center;
        border-radius: 50rpx;
        position: relative;
    }
}

.poster-page {
    padding: 20rpx;
    box-sizing: border-box;
    background: #fff;
    min-height: 100vh;
}

.preview-container {
    margin-bottom: 30rpx;
    max-height: 60vh;
    overflow: auto;
}

.preview-img {
    width: 480rpx;
    /* border-radius: 16rpx; */
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

/* 隐藏Canvas：固定尺寸避免渲染异常 */
.hidden-canvas {
    position: absolute;
  left: -9999px;
  top: -9999px;
  z-index: -1;
}

.btn-group {
    display: flex;
    gap: 20rpx;
    padding: 0 20rpx;
}

.btn-save {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background: #42b983;
    color: #fff;
    font-size: 28rpx;
    border: none;
}

.btn-cancel {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background: #fafafa;
    color: #434343;
    font-size: 28rpx;
    border: none;
}

.btn-save:disabled {
    background: #ccc;
    color: #999;
}
</style>