# 源码目录树

```
miniprogram/
├── package.json          # 脚本、uni-app 多环境 scripts、依赖
├── vite.config.ts        # Vite + uni 插件、define、压缩等
├── shell/                # H5 发布后处理（generate-h5.js）
├── docs/                 # 项目知识库（本文档）
├── _bmad/                # BMad Method 配置与脚本
├── _bmad-output/         # BMad 规划/实施产物（待生成）
└── src/
    ├── main.ts           # 入口：Pinia、拦截器、全局工具、uview
    ├── App.vue           # 应用生命周期、launchInit
    ├── pages.json        # 路由、tabBar、分包、easycom
    ├── manifest.json     # 应用名、微信 appid、权限
    ├── uni.scss          # 全局 SCSS 变量
    │
    ├── pages/            # 主包页面（home、mine、login、message…）
    ├── package-*/        # 分包（每包含 pages/，部分含 api/、components/）
    │
    ├── api/              # 主包 API 模块
    ├── components/       # 全局公共组件
    ├── store/            # Pinia stores
    ├── interceptors/     # request | route | api | prototype
    ├── utils/            # http、bridge、business、track、跳转等
    ├── constant/         # app.config 等常量
    ├── types/            # TS 类型
    ├── mixins/           # 全局 mixin
    ├── lang/             # 国际化（若启用）
    ├── style/            # 全局样式
    ├── static/           # 图片、tabBar 图标等
    ├── platforms/        # 平台差异
    └── uni_modules/      # uview-plus 等
```

## 主包 `src/pages/`（节选）

| 目录 | 说明 |
|------|------|
| `home/` | 首页 Tab |
| `memberCode/` | 回收价 Tab |
| `mine/` | 我的 Tab |
| `login/`、`password/`、`phone/` | 账户与认证 |
| `message/`、`setting/`、`personInfo/` | 用户设置与消息 |
| `life/`、`building/`、`enterprise/` | 生活/楼宇/企业相关 |
| `app-h5/`、`browser-to-app/`、`h5/` | H5 与引流 |
| `identity-auth/`、`reservation/`、`feedback/` | 认证、预约、反馈 |

## 分包一览

| 目录 | pages.json root |
|------|-----------------|
| `package-more` | `package-more` |
| `package-counpons-quan` | `package-counpons-quan` |
| `package-general-services` | `package-general-services` |
| `package-intergral-mall` | `package-intergral-mall` |
| `package-search` | `package-search` |
| `package-my-about` | `package-my-about` |
| `package-address` | `package-address` |
| `package-cards-platform` | `package-cards-platform` |
| `package-product-list` | `package-product-list` |
| `package-services` | `package-services` |
| `package-member-center` | `package-member-center` |
| `package-money-transactions` | `package-money-transactions` |

## `src/utils/` 关键文件

| 文件 | 职责 |
|------|------|
| `http.ts` | 统一请求、加解密选项、错误与 loading |
| `bridge.ts` | 存储、环境、App 内 H5 适配 |
| `utils.ts` | 通用工具、页面跳转 |
| `business.ts` | 业务工具函数 |
| `beans.ts` | 业务实体/渠道标记 |
| `static.jump.ts` | 静态跳转配置 |
| `whitelist.ts` | 白名单 |
| `launchInit.ts` | 启动初始化 |
| `track.ts` | 埋点 |
| `platform.ts` | 平台标识 |

## 新增功能放置建议

| 场景 | 建议位置 |
|------|----------|
| 新 Tab 页 | `src/pages/` + 更新 `pages.json` tabBar |
| 独立业务域、页面多 | 新建 `package-xxx/` 分包 |
| 接口 | 主包 `src/api/` 或分包 `package-xxx/api/` |
| 跨页组件 | `src/components/` 或分包 `components/` |
| 全局状态 | `src/store/` 新 module + `store/index.ts` 导出 |
