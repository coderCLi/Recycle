---
status: final
created: 2026-07-01
updated: 2026-07-01
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - prds/prd-airecycle-20260701/prd.md
  - architecture/spine-airecycle-20260701/ARCHITECTURE-SPINE.md
  - ux-designs/ux-airecycle-20260701/DESIGN.md
  - ux-designs/ux-airecycle-20260701/EXPERIENCE.md
---

# epics.md — aiRecycle

## Requirements

### Functional Requirements (FRs)
FR-1: 拍照识别物品（相机/相册 → 百度AI → 品类+品牌）
FR-2: 生成预估报价（本地价格表 → 估价区间）
FR-3: 价格表后管可配置
FR-4: 选择时间窗预约
FR-5: 免注册下单（微信手机号授权）
FR-6: 订单状态追踪
FR-7: 微信搜一搜可达
FR-8: 订阅消息推送
FR-9: 分享裂变（减碳报告海报）
FR-10: 全渠道订单列表
FR-11: 订单状态流转
FR-12: 手动录入线下回收单
FR-13: 线上vs线下对比看板
FR-14: 回收员列表与状态
FR-15: 回收员积分排行
FR-16: 结算管理
FR-17: 品类库管理
FR-18: 估价偏差监控
FR-19: 用户列表
FR-20: 零单用户唤醒
FR-21: 竞品报价录入
FR-22: 回收员订单列表
FR-23: 导航到用户地址
FR-24: 现场确认与签收
FR-25: 微信支付收款
FR-26: 数据导出
FR-27: 管理员鉴权

### Non-Functional Requirements (NFRs)
NFR-1: MVP部署成本 ≤ ¥100/月
NFR-2: 拍照识别 ≤ 3秒
NFR-3: 下单漏斗 < 30秒
NFR-4: 页面深度 ≤ 3级
NFR-5: 触控区域 ≥ 44px
NFR-6: 文字对比度 ≥ 4.5:1 (WCAG AA)

### Additional Requirements (Architecture)
- uni-app CLI 启动模板（npx degit dcloudio/uni-preset-vue#vite-ts），禁用HBuilderX专有模板
- 云函数约定 { code, data }
- 百度AI仅识别不定价
- 线上线下统一 orders 表
- 微信支付云函数侧发起
- 一键发布：后管集成 miniprogram-ci 自动上传/提交审核

### UX Design Requirements
- UX-DR1: 相机优先首页，底部2Tab
- UX-DR2: 微信绿 #07C160 + 橙色价格 32px Bold
- UX-DR3: 估价卡片组件（品类图标+价格区间+预约入口）
- UX-DR4: 时间窗 chip 选择器（选中变绿）
- UX-DR5: 订单状态进度条 + 5种状态模式
- UX-DR6: 14页 IA 实施
- UX-DR7: 圆角12px / 卡片间距12px / 按钮48px高

---

## Epic List

### Epic 1: 拍照估价
用户能拍张照就知道旧东西值多少钱。
**FRs covered:** FR-1, FR-2, FR-3, FR-25
**Foundation:** uni-app CLI scaffold · 云开发环境 · 微信 AppID · 微信支付

### Epic 2: 预约上门
用户估价后能约时间，回收员准时上门。
**FRs covered:** FR-4, FR-5, FR-6, FR-7

### Epic 3: 后管运营平台
管理员能看订单、管回收员、调价格、看数据、一键发布小程序。
**FRs covered:** FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16, FR-17, FR-18, FR-19, FR-20, FR-21, FR-26, FR-27

### Epic 4: 回收员接单
回收员手机看单、导航、现场签收。
**FRs covered:** FR-22, FR-23, FR-24

### Epic 5: 增长闭环
用户分享裂变，系统主动唤醒沉默用户。
**FRs covered:** FR-8, FR-9, FR-13, FR-15, FR-18, FR-20

---

## FR Coverage Map

| FR | Epic |
|:---|:---:|
| FR-1 拍照识别 | Epic 1 |
| FR-2 估价计算 | Epic 1 |
| FR-3 价格配置 | Epic 1 |
| FR-4 时间窗预约 | Epic 2 |
| FR-5 免注册下单 | Epic 2 |
| FR-6 订单追踪 | Epic 2 |
| FR-7 搜一搜 | Epic 2 |
| FR-8 订阅消息 | Epic 5 |
| FR-9 分享裂变 | Epic 5 |
| FR-10~FR-21 后管全功能 | Epic 3 |
| FR-22~FR-24 回收员端 | Epic 4 |
| FR-25 微信支付 | Epic 1 |
| FR-26 数据导出 | Epic 3 |
| FR-27 管理员鉴权 | Epic 3 |

---

## Stories

### Epic 1: 拍照估价

#### Story 1.1: 项目脚手架 + 云环境初始化

As a 开发者,
I want 用 CLI 创建 uni-app 项目并连接微信云开发,
So that 后续所有功能有可运行的骨架。

**Acceptance Criteria:**
- **Given** Node.js 18+ 已安装 **When** 执行 `npx degit dcloudio/uni-preset-vue#vite-ts airecycle` **Then** 项目创建成功，可通过 `npm run dev:mp-weixin` 在微信开发者工具中预览
- 模板为 CLI 驱动（Vite），不依赖 HBuilderX
- 微信云开发环境已创建，`wx.cloud.init()` 在 `App.vue` 中配置
- 微信 AppID 已填入 `manifest.json`

#### Story 1.2: 拍照识别物品

As a 用户,
I want 拍摄旧家电照片并获得 AI 识别结果,
So that 我知道它是什么品类，不用手动选择。

**Acceptance Criteria:**
- **Given** 用户在小程序首页 **When** 点击相机按钮 **Then** 唤起系统相机，拍完后照片显示
- **Given** 照片已拍摄 **When** 调用百度 AI **Then** 3秒内返回品类+品牌
- 识别失败时显示"没拍清楚，换个角度再试一次？" + 重拍按钮
- 支持从相册选择照片
- 照片上传云存储，fileID 存入 items 集合

#### Story 1.3: 估价计算

As a 用户,
I want 看到旧家电的回收估价,
So that 我决定值不值得卖。

**Acceptance Criteria:**
- **Given** AI 已识别品类 **When** 查询价格配置表 **Then** 展示估价区间（32px橙色大字）
- 估价结果页显示品类图标+品牌+区间+灰色提示文字
- 无价格配置时显示默认区间并标记"待确认"
- 底部"预约上门回收"按钮

#### Story 1.4: 品类价格导入+后管配置

As a 管理员,
I want 导入和管理回收价格表,
So that 估价有准确数据基础。

**Acceptance Criteria:**
- 品类列表页：品类名/基准价/单位/折旧系数/启用状态
- 支持新增/编辑/禁用
- 支持 Excel 批量导入磊哥现有价格表
- 修改即时生效

#### Story 1.5: 微信支付+回调+退款

As a 用户,
I want 回收完成后即时收款,
So that 我信任这个平台。

**Acceptance Criteria:**
- 云函数 `payment-create` 发起支付，前端仅调收银台
- 支付成功回调更新订单状态
- 支付失败 → 订单状态不变，后管可重试
- 取消已支付订单 → 自动退款

#### Story 1.6: 小程序审核配置

As a 开发者,
I want 配置审核所需信息,
So that 顺利通过微信审核上架。

**Acceptance Criteria:**
- manifest.json 配置正确类目
- 隐私协议说明收集数据的用途
- 小程序名称可注册
- AppID + 云环境ID 关联正确

---

### Epic 2: 预约上门

#### Story 2.1: 时间窗预约

As a 用户,
I want 选择上门回收时间段,
So that 不用等一整天。

**Acceptance Criteria:**
- 未来3天日期 + 每30分钟一个时间窗
- 已占用（≥2单）时间窗灰色不可选
- 选中变绿，底部确认按钮
- 预约成功显示确认页

#### Story 2.2: 免注册下单+地址管理

As a 用户,
I want 不用填资料就能下单,
So that 从拍照到下单元<30秒。

**Acceptance Criteria:**
- 微信手机号一键授权，无需输入
- 地址默认微信定位，支持手动修改
- 再次下单自动填充上次信息

#### Story 2.3: 订单状态追踪

As a 用户,
I want 实时看到订单状态,
So that 不用担心回收员来不来。

**Acceptance Criteria:**
- 订单列表按时间倒序，显示状态图标+时间+金额
- 进行中订单显示进度条+回收员+预计到达
- 支持下拉刷新

#### Story 2.4: 回收员手动分配

As a 管理员,
I want 在后管分配订单给回收员,
So that 回收员知道要跑哪些单。

**Acceptance Criteria:**
- 新订单可选择在岗回收员派单
- 派单后status→assigned，回收员端可见
- 显示每人今日已分配单数

#### Story 2.5: 微信搜一搜可达

As a 用户,
I want 微信搜一搜能找到小程序,
So that 不用扫码或找链接。

**Acceptance Criteria:**
- 搜索关键词配置正确
- 搜索结果展示名称+简介+图标

---

### Epic 3: 后管运营平台

#### Story 3.1: 后管脚手架+管理员鉴权

As a 管理员,
I want Web浏览器打开后管+微信扫码登录,
So that 只有我能操作后台。

**Acceptance Criteria:**
- Vue3+Vite+NaiveUI 创建成功
- CloudBase 静态托管部署
- 微信扫码登录鉴权（云函数生成二维码→扫码→验证）

#### Story 3.2: 订单管理

As a 管理员,
I want 查看和管理所有订单,
So that 掌握每天业务情况。

**Acceptance Criteria:**
- 订单列表：时间倒序，来源/品类/金额/回收员/状态
- 按状态/回收员/品类/日期筛选
- 详情可手动流转状态
- 取消须填原因

#### Story 3.3: 线下数据录入

As a 管理员,
I want 手动录入门店/电话来的线下单,
So that 线上线下数据统一。

**Acceptance Criteria:**
- 录入表单：品类/重量/金额/来源/回收员/日期
- 写入 orders（source=offline）
- 支持 Excel 批量导入

#### Story 3.4: 回收员管理+准入

As a 管理员,
I want 添加回收员并管理其状态,
So that 团队有清晰组织结构。

**Acceptance Criteria:**
- 列表：姓名/手机号/区域/状态/今日单量
- 新增回收员（姓名+手机号+区域）
- 启用/停用
- 写入 recyclers 集合

#### Story 3.4a: 回收员结算管理

As a 管理员,
I want 查看和结算回收员的待结款项,
So that 发工资有据可查、公平透明。

**Acceptance Criteria:**
- 每个回收员显示：待结算金额、已结算总额、待结算单数
- 结算金额 = 已完成订单金额 × 回收员分成比例
- 支持按周/月批量结算，结算后标记"已结算"并记录日期
- 结算历史可追溯，按月份查看
- 支持导出结算报表（Excel）

#### Story 3.5: 品类定价配置+偏差监控

As a 管理员,
I want 随时调整价格并监控估价准确率,
So that 估价越来越准。

**Acceptance Criteria:**
- 完整品类管理（基准价/折旧系数/成色系数/本地调整）
- 估价偏差面板：预估vs实际偏差率，>20%标红
- 修改即时生效

#### Story 3.6: 多端数据对比

As a 管理员,
I want 线上vs线下数据对比,
So that 知道小程序带来的增量。

**Acceptance Criteria:**
- 折线图+柱状图：日/周/月 线上vs线下单量/金额
- 按品类/回收员下钻

#### Story 3.7: 用户管理

As a 管理员,
I want 查看用户和行为,
So that 了解谁在用、谁没下单。

**Acceptance Criteria:**
- 用户列表：头像/昵称/手机号/订单数/最后活跃
- 用户详情：订单历史+估价记录

#### Story 3.8: 数据导出+竞品监控

As a 管理员,
I want 导出Excel并跟踪竞品价格,
So that 数据不被锁在后管里。

**Acceptance Criteria:**
- 订单/用户/回收员支持导出Excel
- 竞品报价录入对比，偏离>15%标黄

#### Story 3.9: 一键发布小程序

As a 管理员,
I want 后管一键提交小程序审核和发布,
So that 不用手动打开微信开发者工具。

**Acceptance Criteria:**
- 发布管理页面：版本号+审核状态
- 点击"提交审核"→云函数执行miniprogram-ci→上传→提交
- 审核通过后"发布上线"
- 版本号自动递增
- 发布历史可查

---

### Epic 4: 回收员接单

#### Story 4.1: 回收员订单列表

As a 回收员,
I want 小程序看到今日订单,
So that 知道今天跑哪些单。

**Acceptance Criteria:**
- 底部Tab"工作台"，角色区分显示
- 今日订单：地址/品类/估价/时间窗/状态
- 按时间排序

#### Story 4.2: 导航到用户地址

As a 回收员,
I want 一键导航到用户地址,
So that 不用切出去搜地址。

**Acceptance Criteria:**
- 订单详情"导航"按钮
- 唤起微信内置地图+用户地址
- 出发前10分钟自动通知用户

#### Story 4.3: 现场确认与签收

As a 回收员,
I want 修改价格、完成签收,
So that 一单完整闭环。

**Acceptance Criteria:**
- "开始服务"→status→serving
- 填写最终价（可修改+须注明原因）
- 手机展示确认页给用户，用户点确认
- 签收→支付→status→completed
- 自动跳下一单导航

#### Story 4.4: 回收成功通知管理员

As a 管理员,
I want 回收员每完成一单都收到实时推送通知,
So that 我不用时刻盯后管也知道业务在正常运转。

**Acceptance Criteria:**
- **Given** 回收员签收完成 **When** 订单 status 变为 completed **Then** 管理员微信收到订阅消息："XXX回收员完成一单：XX品类，成交价¥XX"
- 推送包含：回收员姓名、品类、成交价、时间
- 管理员可在小程序设置中管理通知偏好（关闭/开启）
- 每日推送次数无上限，但可设置"免打扰时段"（如23:00-07:00汇总推送）
- 如管理员未授权订阅消息，引导授权弹窗

---

### Epic 5: 增长闭环

#### Story 5.1: 订阅消息推送

As a 系统,
I want 关键节点推送消息,
So that 用户不用盯着手机。

**Acceptance Criteria:**
- 回收员出发前10分钟推送
- 订单完成推送成交价+减碳数据
- 用户可关闭订阅

#### Story 5.2: 减碳分享海报

As a 用户,
I want 回收后生成分享海报,
So that 发朋友圈炫耀环保成果。

**Acceptance Criteria:**
- 海报含物品名/减碳克数/小程序码/品牌名
- 保存图片+直接分享
- 绿色调，简洁大方

#### Story 5.3: 回收员积分排行

As a 管理员,
I want 自动计算积分,
So that 激励多跑单+好服务。

**Acceptance Criteria:**
- 积分公式：单量40%+满意度30%+响应15%+准时15%
- 自动评定金牌/银牌/铜牌
- 排行每日更新
- 回收员小程序端可见自己排名

#### Story 5.4: 零单用户唤醒

As a 管理员,
I want 筛选估价但未下单用户并推送,
So that 沉默用户被激活。

**Acceptance Criteria:**
- 筛选有估价无订单的用户
- 一键推送订阅消息（模板可配置）
- 记录推送时间和3天内转化
- 每人7天内最多1次唤醒
