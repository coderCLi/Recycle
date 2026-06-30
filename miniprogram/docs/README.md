# 项目文档索引

> 由 BMad **Document Project（DP）** 于 2026-05-28 生成，供开发与 AI 协作参考。

| 文档 | 说明 |
|------|------|
| [project-overview.md](./project-overview.md) | 产品定位、技术栈、业务模块概览 |
| [development-guide.md](./development-guide.md) | 环境、脚本、构建与调试 |
| [architecture.md](./architecture.md) | 分层架构、请求链路、状态与路由 |
| [source-tree.md](./source-tree.md) | 目录结构与分包说明 |

## 快速事实

- **应用名**：大连海创嗨创生活 1.0（`manifest.json`）
- **形态**：uni-app + Vue 3 + TypeScript，目标平台 **微信小程序**、**H5**、可选 App
- **仓库包名**：`uni-preset-vue`（脚手架遗留名）
- **后端前缀**：`/abpapp/*`（经 `VITE_SERVER_BASEURL` 拼接）
- **主 Tab**：首页 · 回收价 · 我的

## 维护说明

棕地项目，文档基于静态扫描生成。改架构或分包后请同步更新对应章节。
