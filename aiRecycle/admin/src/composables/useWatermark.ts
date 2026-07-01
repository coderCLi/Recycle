// 全局水印 composable
import { onMounted, onUnmounted, ref } from "vue";

const defaultText = ref("admin");

export function useWatermark() {
  let container: HTMLDivElement | null = null;
  let observer: MutationObserver | null = null;

  function getText() {
    // 优先从 localStorage 读取登录用户名/手机号
    return localStorage.getItem("admin_user") || defaultText.value;
  }

  function create() {
    const text = getText();
    if (container) destroy();

    container = document.createElement("div");
    container.setAttribute("data-watermark", "");
    const style = container.style;
    style.position = "fixed";
    style.top = "0";
    style.left = "0";
    style.width = "100%";
    style.height = "100%";
    style.pointerEvents = "none";
    style.zIndex = "9999";
    style.overflow = "hidden";

    // 用 Canvas 绘制水印图
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    const w = 260;
    const h = 180;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.font = "14px -apple-system, sans-serif";
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.textAlign = "center";
    // 画多行文字形成密集水印
    for (let row = -1; row < 4; row++) {
      for (let col = -1; col < 5; col++) {
        ctx.fillText(text, col * 150, row * 120);
      }
    }

    container.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
    document.body.appendChild(container);

    // 防止被删除
    observer = new MutationObserver(() => {
      if (!document.body.contains(container)) {
        document.body.appendChild(container);
      }
    });
    observer.observe(document.body, { childList: true });
  }

  function destroy() {
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
    if (observer) observer.disconnect();
    container = null;
    observer = null;
  }

  function update(text?: string) {
    if (text) {
      localStorage.setItem("admin_user", text);
      defaultText.value = text;
    }
    create();
  }

  onMounted(create);
  onUnmounted(destroy);

  return { update, destroy };
}
