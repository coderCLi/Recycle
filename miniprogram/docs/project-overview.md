# 项目概览

## 产品定位

**大连海创嗨创生活** 是一款面向本地生活的综合服务小程序/H5 应用，作为「全市统一综合服务入口」。从代码结构可见业务覆盖：

- 首页与生活服务入口
- **回收价**（Tab「会员码」路径 `pages/memberCode`）
- 积分商城、优惠券、卡券平台
- 会员中心、资金/交易相关
- 地址、搜索、商品列表、通用服务（学校、商户、地图、订阅等）
- 登录、个人中心、设置、反馈等账户能力

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | uni-app 3.x（`@dcloudio/uni-app`） |
| UI | Vue 3.4 + **uview-plus** + `@dcloudio/uni-ui` |
| 语言 | TypeScript 4.9 |
| 构建 | Vite 5.2 + `@dcloudio/vite-plugin-uni` |
| 状态 | Pinia 2 + `pinia-plugin-persistedstate`（`uni` 存储持久化） |
| 工具库 | dayjs、big.js、html2canvas（H5 场景） |
| 样式 | SCSS（`src/style/index.scss`、`uni.scss`） |

## 平台与 AppID

- **微信小程序** `appid`: `wx1666b148380cd848`
- **H5**：支持独立部署与 App 内 WebView（`bridge.isInHiApp()`）
- 全局导航：**custom**（自定义导航栏）

## 环境与域名

通过 `package.json` → `uni-app.scripts` 注入环境变量：

| 脚本键 | 平台 | 主 API（`VITE_SERVER_BASEURL`） |
|--------|------|--------------------------------|
| `mp-weixin-dev` | 微信 dev | `http://128.128.2.65:29210` |
| `mp-weixin-test` | 微信 test | `https://test.hihihi.com.cn` |
| `mp-weixin-pro` | 微信 pro | `https://life.hihihi.com.cn` |
| `h5-dev` / `h5-test` / `h5-pro` | H5 | 对应 dev/test/pro 域名 |

另有 `VITE_SERVER_OTHERURL`、`VITE_ENV_VERSION`、`DEPLOY_ENV`（dev/test/pro）。

## 业务分包（subPackages）

主包 `src/pages/` + 12 个分包，降低主包体积：

| 分包 root | 典型能力 |
|-----------|----------|
| `package-more` | 更多 |
| `package-counpons-quan` | 优惠券（进行中/未开始） |
| `package-general-services` | 通用服务（学校、商户、地图、课后服务等） |
| `package-intergral-mall` | 积分商城 |
| `package-search` | 搜索 |
| `package-my-about` | 关于 |
| `package-address` | 地址 |
| `package-cards-platform` | 卡券平台 |
| `package-product-list` | 商品列表（体量最大） |
| `package-services` | 服务 |
| `package-member-center` | 会员中心 |
| `package-money-transactions` | 资金/交易 |

完整路由见 `src/pages.json`（约 1100+ 行）。

## Tab 栏

| Tab | 页面路径 |
|-----|----------|
| 首页 | `pages/home/home` |
| 回收价 | `pages/memberCode/index` |
| 我的 | `pages/mine/mine` |

## 相关仓库路径

- 源码：`src/`
- 静态资源：`src/static/`
- 构建产物：`dist/`（按平台分子目录，构建后生成）
- H5 发布脚本：`shell/generate-h5.js`
- BMad 输出（规划/实施）：`_bmad-output/`（当前为空）
