/*
 * @Description: 调试工具
 * @Author: chenyulong
 * @Date: 2025-01-17 10:09:30
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-01-23 08:41:21
 * @Remark: 
 */
import { loadScript } from "./bridge";
export default async function loadDebug() {
  await loadScript("https://cdn.jsdelivr.net/npm/eruda");
  (window as any).eruda.init();
}
