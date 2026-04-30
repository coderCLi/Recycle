<template>
  <view class="poster-container">
    <!-- 海报预览 -->
    <image :src="posterImg" mode="widthFix" class="poster-preview" v-if="posterImg" />

    <!-- 隐藏的 Canvas 2D 容器（绘制核心） -->
    <canvas type="2d" id="posterCanvas" class="canvas-hidden"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />

    <!-- 操作按钮 -->
    <view class="btn-group">
      <button @click="generatePoster" class="btn-generate">生成海报</button>
      <button @click="savePoster" class="btn-save" :disabled="!posterImg">保存海报</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      posterImg: '', // 生成的海报临时地址
      canvasWidth: 750, // 海报宽度（px，建议按 2x 设计避免模糊）
      canvasHeight: 1518, // 海报高度（px）
      dpr: 1, // 设备像素比（适配高清屏）
      // 海报所需资源（实际项目可从接口获取）
      posterConfig: {
        bgImg: '/static/poster-bg.png', // 海报背景图（本地静态资源）
        avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLkiciaibiawibiaCnDibT4siciawiciaCnDibT4siciawiciaCnDibT4s/132', // 头像
        nickname: '豆包编程助手', // 用户名
        title: 'UniApp 海报生成教程', // 海报标题
        desc: '使用 Canvas 2D 快速实现多端海报', // 描述文字
        qrcode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://uniapp.dcloud.io', // 二维码地址（可替换为之前生成的小程序二维码）
        logo: '/static/logo.png' // 品牌 logo
      }
    };
  },
  onLoad() {
    // 获取设备像素比（适配高清屏）
    this.dpr = uni.getSystemInfoSync().pixelRatio || 1;
  },
  methods: {
    /**
     * 1. 生成海报核心方法
     */
    async generatePoster() {
      try {
        uni.showLoading({ title: '生成中...' });
        // 步骤1：获取 Canvas 2D 上下文
        const ctx = await this.getCanvasContext();
        if (!ctx) throw new Error('获取画布失败');

        // 步骤2：清空画布（避免重复绘制）
        ctx.clearRect(0, 0, this.canvasWidth * this.dpr, this.canvasHeight * this.dpr);

        // 步骤3：逐元素绘制海报（按层级顺序）
        await this.drawBackground(ctx); // 绘制背景图
        await this.drawAvatar(ctx); // 绘制头像
        await this.drawText(ctx); // 绘制文字（昵称、标题、描述）
        await this.drawQrcode(ctx); // 绘制二维码
        await this.drawLogo(ctx); // 绘制品牌 logo

        // 步骤4：Canvas 转为临时图片
        this.posterImg = await this.canvasToTempImage(ctx.canvas);

        uni.hideLoading();
        uni.showToast({ title: '海报生成成功' });
      } catch (err) {
        uni.hideLoading();
        console.error('海报生成失败：', err);
        uni.showToast({ title: '生成失败，请重试', icon: 'none' });
      }
    },

    /**
     * 2. 获取 Canvas 2D 上下文（关键：适配多端）
     */
    getCanvasContext() {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('#posterCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            // 适配高清屏：放大 dpr 倍绘制，避免模糊
            const { width, height } = res[0];
            canvas.width = width * this.dpr;
            canvas.height = height * this.dpr;
            ctx.scale(this.dpr, this.dpr); // 缩放上下文
            resolve(ctx);
          });
      });
    },

    /**
     * 3. 绘制背景图
     */
    drawBackground(ctx) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        // 本地静态资源需用 require 引入（UniApp 特有）
        img.src = this.posterConfig.bgImg.startsWith('/static')
          ? require('@/static/poster-bg.png')
          : this.posterConfig.bgImg;

        img.onload = () => {
          // 绘制背景图（填充整个画布）
          ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
          resolve();
        };
        img.onerror = (err) => reject(`背景图加载失败：${err}`);
      });
    },

    /**
     * 4. 绘制圆形头像
     */
    drawAvatar(ctx) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = this.posterConfig.avatar;
        // 跨域图片需设置（若二维码/头像为网络图片）
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          const avatarSize = 80; // 头像尺寸
          const x = 30; // 头像x坐标
          const y = 30; // 头像y坐标

          // 绘制圆形裁剪区域
          ctx.beginPath();
          ctx.arc(
            x + avatarSize / 2, // 圆心x
            y + avatarSize / 2, // 圆心y
            avatarSize / 2, // 半径
            0,
            Math.PI * 2
          );
          ctx.clip(); // 裁剪为圆形

          // 绘制头像（填充裁剪区域）
          ctx.drawImage(img, x, y, avatarSize, avatarSize);

          // 绘制头像边框（可选）
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.restore(); // 恢复裁剪状态
          resolve();
        };
        img.onerror = (err) => reject(`头像加载失败：${err}`);
      });
    },

    /**
     * 5. 绘制文字（昵称、标题、描述）
     */
    drawText(ctx) {
      // 绘制昵称
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#333';
      ctx.fillText(this.posterConfig.nickname, 130, 60); // x=130（头像右侧）

      // 绘制标题（自动换行处理）
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = '#222';
      const title = this.posterConfig.title;
      const titleX = 30;
      const titleY = 150;
      const lineHeight = 40;
      const maxWidth = this.canvasWidth - 60; // 最大宽度（左右留30px边距）
      this.wrapText(ctx, title, titleX, titleY, maxWidth, lineHeight);

      // 绘制描述文字
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#666';
      const desc = this.posterConfig.desc;
      const descY = titleY + lineHeight * 2 + 20; // 标题下方20px
      this.wrapText(ctx, desc, titleX, descY, maxWidth, 30);
    },

    /**
     * 辅助方法：文字自动换行
     * @param ctx Canvas 2D 上下文
     * @param text 需换行的文字
     * @param x 起始x坐标
     * @param y 起始y坐标
     * @param maxWidth 最大宽度
     * @param lineHeight 行高
     */
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      let currentText = '';
      const textArr = text.split('');

      for (let i = 0; i < textArr.length; i++) {
        const tempText = currentText + textArr[i];
        const textWidth = ctx.measureText(tempText).width;
        if (textWidth > maxWidth && i > 0) {
          ctx.fillText(currentText, x, y);
          currentText = textArr[i];
          y += lineHeight;
        } else {
          currentText = tempText;
        }
      }
      // 绘制最后一行
      ctx.fillText(currentText, x, y);
    },

    /**
     * 6. 绘制二维码
     */
    drawQrcode(ctx) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = this.posterConfig.qrcode;
        img.crossOrigin = 'anonymous'; // 跨域处理

        img.onload = () => {
          const qrSize = 150; // 二维码尺寸
          const x = this.canvasWidth - qrSize - 30; // 右侧30px
          const y = this.canvasHeight - qrSize - 30; // 底部30px

          // 绘制二维码背景（可选）
          ctx.fillStyle = '#fff';
          ctx.fillRect(x - 10, y - 10, qrSize + 20, qrSize + 20);

          // 绘制二维码
          ctx.drawImage(img, x, y, qrSize, qrSize);

          // 绘制二维码下方文字
          ctx.font = '16px sans-serif';
          ctx.fillStyle = '#666';
          ctx.textAlign = 'center';
          ctx.fillText('扫码查看详情', x + qrSize / 2, y + qrSize + 30);
          ctx.textAlign = 'left'; // 恢复默认

          resolve();
        };
        img.onerror = (err) => reject(`二维码加载失败：${err}`);
      });
    },

    /**
     * 7. 绘制品牌 Logo
     */
    drawLogo(ctx) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = this.posterConfig.logo.startsWith('/static')
          ? require('@/static/logo.png')
          : this.posterConfig.logo;

        img.onload = () => {
          const logoSize = 60; // Logo尺寸
          const x = 30; // 左侧30px
          const y = this.canvasHeight - logoSize - 30; // 底部30px

          // 绘制Logo（保持宽高比，避免拉伸）
          ctx.drawImage(img, x, y, logoSize, logoSize);
          resolve();
        };
        img.onerror = (err) => reject(`Logo加载失败：${err}`);
      });
    },

    /**
     * 8. Canvas 转为临时图片
     */
    canvasToTempImage(canvas) {
      return new Promise((resolve, reject) => {
        uni.canvasToTempFilePath({
          canvasId: 'posterCanvas',
          canvas: canvas, // Canvas 2D 必须传 canvas 实例
          x: 0,
          y: 0,
          width: this.canvasWidth,
          height: this.canvasHeight,
          destWidth: this.canvasWidth * this.dpr, // 输出宽度（高清）
          destHeight: this.canvasHeight * this.dpr, // 输出高度（高清）
          success: (res) => resolve(res.tempFilePath),
          fail: (err) => reject(`画布转图片失败：${err}`)
        }, this);
      });
    },

    /**
     * 9. 保存海报到本地相册
     */
    async savePoster() {
      if (!this.posterImg) {
        uni.showToast({ title: '请先生成海报', icon: 'none' });
        return;
      }

      try {
        // 检查相册授权
        const setting = await uni.getSetting();
        if (!setting.authSetting['scope.writePhotosAlbum']) {
          // 未授权，发起授权请求
          const authRes = await uni.authorize({ scope: 'scope.writePhotosAlbum' });
          if (authRes.errMsg !== 'authorize:ok') {
            uni.showToast({ title: '请允许保存图片到相册', icon: 'none' });
            return;
          }
        }

        // 保存图片
        await uni.saveImageToPhotosAlbum({ filePath: this.posterImg });
        uni.showToast({ title: '已保存到相册' });
      } catch (err) {
        console.error('保存海报失败：', err);
        uni.showToast({ title: '保存失败，请重试', icon: 'none' });
      }
    }
  }
};
</script>

<style scoped>
.poster-container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-preview {
  width: 600rpx;
  height: 900rpx;
  margin-bottom: 30rpx;
  border: 1px solid #eee;
}

.canvas-hidden {
  position: absolute;
  left: -9999px;
  top: -9999px;
  z-index: -1;
}

.btn-group {
  display: flex;
  gap: 20rpx;
}

.btn-generate,
.btn-save {
  width: 280rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
}

.btn-generate {
  background: #007aff;
  color: #fff;
}

.btn-save {
  background: #f5f5f5;
  color: #333;
}

.btn-save:disabled {
  background: #eee;
  color: #999;
}
</style>