# 开发指南

## 前置条件

- Node.js（项目使用 TypeScript 4.9、Vite 5）
- 微信开发者工具（开发 `mp-weixin` 时）
- 可选：HBuilderX（团队亦可通过其「自定义运行/发行」选择环境）

## 安装

```bash
cd miniprogram
npm install
```

## 运行（必须使用自定义环境脚本）

项目**不要**单独使用裸 `uni` 默认 dev，应使用 `package.json` 中 `uni-app.scripts` 对应命令。直接 `npm run dev` 会走 `dev:h5-dev`。

### 微信小程序

```bash
# 开发环境
npm run dev:mp-weixin-dev

# 测试环境
npm run dev:mp-weixin-test

# 生产环境
npm run dev:mp-weixin-pro
```

### H5

```bash
npm run dev:h5-dev
npm run dev:h5-test
npm run dev:h5-pro
```

`vite.config.ts` 在缺少 `UNI_CUSTOM_DEFINE` 时会打印可用自定义指令提示。

### 类型检查

```bash
npm run type-check
```

## 构建

```bash
# 微信小程序
npm run build:mp-weixin-dev
npm run build:mp-weixin-test
npm run build:mp-weixin-pro

# H5
npm run build:h5-dev
npm run build:h5-test
npm run build:h5-pro

# H5 构建后自动生成部署目录（带 shell 脚本）
npm run build:h5-dev-auto
npm run build:h5-test-auto
npm run build:h5-pro-auto
```

## 环境变量（构建时注入）

| 变量 | 用途 |
|------|------|
| `VITE_SERVER_BASEURL` | API 主域名 |
| `VITE_SERVER_OTHERURL` | 备用/其他服务域名 |
| `VITE_ENV_VERSION` | 环境版本标识（0/1/2） |
| `DEPLOY_ENV` | dev / test / pro |
| `UNI_PLATFORM` | mp-weixin / h5 等 |

运行时还可使用 `__DEPLOY_ENV__`、`__VITE_APP_ID__` 等（见 `vite.config.ts` define）。

## 调试

- **H5**：非 production 且 test 环境，或开发态且在 Hi App 内时，会加载 `@/utils/debug` 调试能力（见 `main.ts`）。
- **微信小程序**：集成百度移动统计 `mtj-wx-sdk`（`main.ts` 条件编译 `#ifdef MP_WEIXIN`）。

## 代码规范（观察到的约定）

- 文件头 JSDoc：`@Description` / `@Author` / `@LastEditors`
- API 按域拆分：`src/api/*.ts`，统一经 `http()` 调用
- 分包内 API 可放在 `package-*/api/`
- 路径别名：`@/` → `src/`
- 组件 easycom：`uni-*`、`u-*` / `up-*`（uview-plus）

## 常见问题

1. **启动后 API 404**  
   确认使用了正确的 `dev:mp-weixin-*` 或 `dev:h5-*`，检查 `VITE_SERVER_BASEURL`。

2. **登录态**  
   Token 存于 `bridge` 封装的 storage，键名 `app_jw_token`；请求头由 `interceptors/request.ts` 注入。

3. **自定义导航**  
   全局 `navigationStyle: custom`，页面需自行处理顶栏或使用项目内公共组件。
