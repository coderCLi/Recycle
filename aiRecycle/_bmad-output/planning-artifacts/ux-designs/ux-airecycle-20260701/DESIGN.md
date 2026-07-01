---
status: draft
created: 2026-07-01
updated: 2026-07-01
sources: ["prds/prd-airecycle-20260701/prd.md"]
colors:
  primary-green: "#07C160"
  primary-dark: "#06AD56"
  surface-white: "#FFFFFF"
  surface-gray: "#F5F5F5"
  text-primary: "#1A1A1A"
  text-secondary: "#8C8C8C"
  accent-orange: "#FA8C16"
  accent-red: "#FF4D4F"
  success-green: "#52C41A"
  divider: "#EEEEEE"
typography:
  heading: "PingFang SC"
  body: "PingFang SC"
rounded: "12px"
spacing:
  unit: 8
components:
  - name: camera-button
    description: 首页中央大按钮，80×80px圆形，微信绿背景，白色相机图标
  - name: price-card
    description: 估价卡片，白底圆角12px，绿色价格数字，底部浅灰说明文字
  - name: time-slot
    description: 时间段选择chip，浅灰底，选中变微信绿
  - name: order-card
    description: 订单卡片，左侧状态图标，右侧时间金额，底部进度条
---

# DESIGN.md — 富区旧家电回收

## Brand & Style

微信原生风格 + 环保绿色调。不做炫技动画，不做过度设计。目标用户包含县城中老年人，一切以"看得清、点得准、不慌张"为原则。

品牌关键词：**可信、方便、本地**。

## Colors

| Token | 色值 | 用途 |
|------|------|------|
| `{colors.primary-green}` | #07C160 | 主按钮、选中态、品牌标识 |
| `{colors.surface-white}` | #FFFFFF | 卡片、页面背景 |
| `{colors.surface-gray}` | #F5F5F5 | 页面底色、禁用态 |
| `{colors.text-primary}` | #1A1A1A | 标题、重要文字 |
| `{colors.text-secondary}` | #8C8C8C | 辅助说明、时间 |
| `{colors.accent-orange}` | #FA8C16 | 价格突出、提醒 |
| `{colors.accent-red}` | #FF4D4F | 错误、偏差超标 |
| `{colors.success-green}` | #52C41A | 成功状态 |
| `{colors.divider}` | #EEEEEE | 分割线 |

## Typography

| 层级 | 字号 | 字重 | 用途 |
|:---:|------|------|------|
| H1 | 22px | Bold | 页面标题 |
| H2 | 18px | Medium | 卡片标题 |
| Body | 16px | Regular | 正文 |
| Caption | 14px | Regular | 辅助说明 |
| Price | 32px | Bold | 价格数字 |
| Mini | 12px | Regular | 极小标注 |

## Layout & Spacing

- 基础单位 8px，所有间距为 8 的倍数
- 页面左右 padding: 16px
- 卡片间距: 12px
- 卡片内 padding: 16px
- 按钮最小高度: 48px（保证手指点触）

## Elevation & Depth

单层设计。卡片无阴影，用 `{colors.divider}` 或 1px 灰色边框区分层次。不模拟物理深度——微信小程序内保持轻量。

## Shapes

- 圆角统一 12px（卡片/按钮/输入框）
- 相机按钮：圆形（80×80px）
- 标签/状态点：全圆角 pill

## Components

### 相机按钮
圆形 80×80px，`{colors.primary-green}` 背景，白色相机 SVG 图标居中。页面最显眼位置。按下缩放反馈（0.95倍）。

### 估价卡片
白底、圆角 12px、padding 16px。顶部品类图标+名称，中部价格数字（32px Bold `{colors.accent-orange}`），底部灰色说明"预估区间，上门确认最终价"。

### 时间窗选择器
横向排列的 chip 按钮。未选中：`{colors.surface-gray}` 底+灰字。选中：`{colors.primary-green}` 底+白字。不可用时灰色+划掉。

### 订单卡片
白底卡片。左侧状态图标（待确认🗓/进行中🚚/已完成✅），右侧时间+金额。底部细进度条（进行中时显示"回收员正在路上"）。

### 底部导航
仅两个 Tab：**估价**（相机图标）和 **订单**（列表图标）。居中对称布局。

## Do's and Don'ts

- ✅ 价格数字要大、要橙色、要显眼
- ✅ 按钮文字用动词（"拍照估价""预约上门"）
- ✅ 每个页面一个核心动作
- ❌ 不要渐变色、不要投影卡片
- ❌ 不要启动广告页、不要引导教程
- ❌ 不要超过 3 级页面深度
- ❌ 不要任何"高级功能"入口在首页
