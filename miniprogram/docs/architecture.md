# 架构说明

## 分层概览

```
┌─────────────────────────────────────────────────────────┐
│  pages / package-* / components（视图层）                  │
├─────────────────────────────────────────────────────────┤
│  store (Pinia) · mixins · 全局 $utils / $business 等     │
├─────────────────────────────────────────────────────────┤
│  api/*  →  utils/http.ts（业务 HTTP 封装）                 │
├─────────────────────────────────────────────────────────┤
│  interceptors: request · route · api · prototype         │
├─────────────────────────────────────────────────────────┤
│  utils: bridge · beans · business · track · platform …   │
└─────────────────────────────────────────────────────────┘
                          │
                    uni.request + 后端 /abpapp/*
```

## 应用启动链路

1. `main.ts` 创建 Vue SSR App，注册 Pinia、uview-plus、全局 mixin
2. 注册四类拦截器：`requestInterceptor`、`routeInterceptor`、`apiInterceptor`、`prototypeInterceptor`
3. 挂载全局工具：`reg`、`bridge`、`utils`、`map`、`business`、`decimal`、`trackReport` 等
4. `App.vue` `onLaunch`：
   - Hi App 内 H5：清理 storage、移除 tabbar、调整 html 高度
   - `launchInit()` 初始化
   - `useBaseStore` 缓存全量页面列表、运行环境

## HTTP 与 API

### 调用方式

```ts
import { http } from '@/utils/http'

export const someApi = (data: any) => {
  return http('/abpapp/SomeController/action.do', data, {
    login: true,      // 需要登录态
    encrypt: true,    // 默认加密（可关）
    catchRes: false,  // 是否自行处理响应
  })
}
```

### 请求头（`interceptors/request.ts`）

- `platform`：当前平台
- `appid`：`__VITE_APP_ID__`
- `token`：`app_jw_token`（storage）
- `uuid`：每次请求生成
- 小程序端补充 `userAgent`

### 特性

- 防重复请求 `requestingMap`
- 可选国密加解密（代码中留有 sm 相关注释/占位）
- `requestToken` 用于 token 刷新类逻辑
- 统一 Toast / Loading（`utils/http.ts`）

### API 文件分布

| 位置 | 职责 |
|------|------|
| `src/api/index.ts` | 公共接口（主题、地图、JSON、订阅等） |
| `src/api/home.ts`、`mine.ts`、`login.ts`… | 主包页面 API |
| `src/package-*/api/` | 分包域内接口 |

后端路径风格：`**/abpapp/{Controller}/{action}.do**`（历史 Java 风格）。

## 状态管理（Pinia）

| Store | 文件 | 用途（推断） |
|-------|------|----------------|
| `useBaseStore` | `store/base.ts` | 页面列表、运行环境等基础态 |
| `useUserStore` | `store/user.ts` | 用户/登录 |
| `useCustomStore` | `store/custom.ts` | 自定义配置 |
| `usePointsStore` | `store/points.ts` | 积分 |
| `useMctStore` | `store/mct.ts` | 商户/营销相关 |
| `useHddStore` | `store/hdd.ts` | 业务域扩展 |

持久化：`pinia-plugin-persistedstate` + `uni.getStorageSync` / `setStorageSync`。

## 路由与登录

- 路由表：`src/pages.json`（主包 + subPackages + tabBar）
- `interceptors/route.ts`：路由跳转拦截（登录页、白名单等，与 `utils/whitelist` 配合）
- `utils` 导出 `needLoginPages` 供请求/路由使用

## 跨端与 Bridge

`utils/bridge.ts` 为核心适配层：

- Storage、设备信息、环境判断
- `isInHiApp()`：是否在自有 App WebView
- 与原生 App 的跳转、清缓存等

H5 与小程序通过 `#ifdef H5` / `#ifdef MP` 条件编译分流。

## 埋点与统计

- `utils/track.ts`：自定义埋点
- 微信：百度统计 SDK（`utils/mtj-wx-sdk*`）

## 扩展与定制

- **BMad**：`_bmad/` 配置与脚本；定制覆盖 `_bmad/custom/`
- **uni_modules**：`uview-plus` 等本地模块，勿随意改 vendor 内代码
- **自动导入**：`unplugin-auto-import`（见 `vite.config.ts`）

## 安全注意（文档用途）

- `package.json` 内含内网/测试域名，勿提交到公开仓库的敏感密钥（当前为 API 基址，非密钥）
- 生产构建前确认 `DEPLOY_ENV=pro` 与正确 `appid`
