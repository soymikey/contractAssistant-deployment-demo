# 合同助手 - 前端开发计划

## 项目概述

基于 Expo + React Native 的跨平台移动应用前端开发,包括 UI 组件开发、页面开发、状态管理、API 集成等。

**框架**: React Native (Expo)  
**包管理器**: pnpm (Monorepo 工作区)  
**状态管理**: Zustand  
**路由**: Expo Router  
**UI库**: React Native Paper  
**测试**: Jest + React Native Testing Library  
**预期周期**: 8-9周

---

## 前端技术栈

- **核心框架**: React Native 0.73+
- **开发框架**: Expo 51+
- **包管理器**: pnpm (支持 Monorepo 工作区)
- **路由**: Expo Router (内置)
- **状态管理**: Zustand
- **HTTP客户端**: Axios
- **UI组件库**: React Native Paper v5+
- **样式**: StyleSheet (React Native) + tailwindcss-react-native (可选)
- **表单管理**: React Hook Form
- **日期处理**: date-fns
- **图片处理**: expo-image-picker, expo-image
- **相机**: expo-camera
- **文件处理**: expo-document-picker, expo-file-system
- **本地存储**: @react-native-async-storage/async-storage
- **网络状态**: @react-native-community/netinfo
- **深链接**: Linking (React Native 内置)
- **推送通知**: expo-notifications
- **分析**: expo-analytics
- **测试**: Jest, @testing-library/react-native
- **代码质量**: ESLint, Prettier, TypeScript

---

## 第1-2周: 项目初始化与基础设置

### 1.1 项目初始化

**目标**: 建立完整的项目结构和开发环境

```
TODO List - 项目初始化
- [x] 1.1.1 使用 Expo CLI 创建新项目
  - [x] 命令: npx create-expo-app contract-assistant
  - [x] 选择 TypeScript 模板
  - [x] 验证项目可正常启动

- [x] 1.1.2 配置项目目录结构
  - [x] 创建 app/ 目录 (Expo Router 路由)
  - [x] 创建 src/ 目录结构:
    - [x] src/components/ - UI 组件
    - [x] src/screens/ - 页面组件
    - [x] src/hooks/ - 自定义 Hook
    - [x] src/stores/ - 状态管理 (Zustand)
    - [x] src/services/ - API 服务
    - [x] src/utils/ - 工具函数
    - [x] src/constants/ - 常量
    - [x] src/types/ - TypeScript 类型定义
    - [x] src/assets/ - 静态资源

- [x] 1.1.3 配置 TypeScript
  - [x] 创建 tsconfig.json
  - [x] 配置 path alias (@/*)
  - [x] 配置严格模式
  - [x] 验证 TypeScript 编译

- [x] 1.1.4 配置 ESLint 和 Prettier
  - [x] 安装 eslint 和 prettier
  - [x] 创建 .eslintrc.json
  - [x] 创建 .prettierrc
  - [x] 配置 VSCode 自动格式化

- [x] 1.1.5 配置 app.json
  - [x] 设置应用名称、版本、图标
  - [x] 配置启动屏幕
  - [x] 配置权限声明
  - [x] 配置 iOS/Android 特定设置
```

### 1.2 依赖安装和配置

```
TODO List - 依赖配置
- [x] 1.2.1 安装核心依赖
  - [x] pnpm add zustand axios @react-navigation/native
  - [x] pnpm add react-native-paper react-native-vector-icons
  - [x] pnpm add react-hook-form date-fns
  - [x] pnpm add expo-camera expo-image-picker expo-document-picker
  - [x] pnpm add expo-file-system @react-native-async-storage/async-storage
  - [x] pnpm add @react-native-community/netinfo expo-notifications

- [x] 1.2.2 安装开发依赖
  - [x] pnpm add -D @types/react-native @types/node
  - [x] pnpm add -D jest @testing-library/react-native
  - [x] pnpm add -D typescript
  - [x] pnpm add -D eslint prettier eslint-config-prettier

- [x] 1.2.3 环境变量配置
  - [x] 创建 .env 文件 (开发环境)
  - [x] 创建 .env.production 文件
  - [x] 配置 API_URL, DEBUG 等变量
  - [x] 配置 .gitignore 排除 .env 文件

- [x] 1.2.4 验证依赖安装
  - [x] 运行 pnpm start 验证
  - [x] 在 iOS 模拟器上测试
  - [x] 在 Android 模拟器上测试
  - [x] 确保没有依赖冲突
```

### 1.3 状态管理配置

```
TODO List - 状态管理
- [x] 1.3.1 配置 Zustand Store
  - [x] 创建 src/stores/ 目录
  - [x] 创建 authStore.ts (认证状态)
  - [x] 创建 contractStore.ts (合同状态)
  - [x] 创建 uiStore.ts (UI状态: loading, error, toast)
  - [x] 定义 TypeScript 类型

- [x] 1.3.2 实现 Store Hook
  - [x] useAuth hook (获取用户、登录状态)
  - [x] useContract hook (获取合同数据)
  - [x] useUI hook (管理全局UI状态)
  - [x] useAsync hook (通用异步操作)

- [x] 1.3.3 状态持久化配置
  - [x] 配置 AsyncStorage 持久化
  - [x] 保存登录 token
  - [x] 保存用户偏好设置
  - [x] 实现状态重新加载
```

### 1.4 路由配置

```
TODO List - 路由配置
- [x] 1.4.1 配置 Expo Router
  - [x] 创建 app/ 目录结构
  - [x] 配置 app/_layout.tsx (根布局)
  - [x] 配置 app/(auth)/ (认证相关)
  - [x] 配置 app/(tabs)/ (主应用 tabbar)
  - [x] 配置 app/(details)/ (详情页面)

- [x] 1.4.2 实现路由 Guard
  - [x] 创建身份验证检查
  - [x] 实现受保护路由
  - [x] 配置重定向逻辑

- [x] 1.4.3 配置深链接
  - [x] 配置 app.json linking
  - [x] 支持合同详情深链接
  - [x] 支持分析结果深链接

- [x] 1.4.4 测试路由
  - [x] 测试所有导航流程
  - [x] 测试返回按钮行为
  - [x] 测试深链接跳转
```

### 1.5 API 服务配置

```
TODO List - API 服务
- [x] 1.5.1 创建 API 客户端
  - [x] 创建 src/services/api.ts
  - [x] 配置 axios 实例
  - [x] 设置基础 URL
  - [x] 配置请求/响应拦截器
  - [x] 实现自动重试机制

- [x] 1.5.2 配置认证拦截器
  - [x] 自动添加 Authorization header
  - [x] 实现 token 刷新
  - [x] 处理认证失败重定向

- [x] 1.5.3 实现错误处理
  - [x] 统一错误响应格式
  - [x] 实现通用错误处理
  - [x] 网络错误处理

- [x] 1.5.4 创建 API 服务类
  - [x] AuthService (登录、注册、登出)
  - [x] ContractService (合同相关 API)
  - [x] AnalysisService (分析结果 API)
  - [x] UserService (用户相关 API)
```

---

## 第3-4周: 通用组件开发

### 2.1 基础 UI 组件

```
TODO List - 基础 UI 组件
- [ ] 2.1.1 创建 Button 组件
  - [ ] 文件: src/components/Button.tsx
  - [ ] 支持 primary, secondary, success, danger 等多种类型
  - [ ] 支持 loading 状态
  - [ ] 支持 disabled 状态
  - [ ] 支持自定义大小
  - [ ] 编写单元测试
  - [ ] 编写 Storybook 文档

- [ ] 2.1.2 创建 Input 组件
  - [ ] 文件: src/components/Input.tsx
  - [ ] 支持文本、密码、邮箱等类型
  - [ ] 支持错误状态
  - [ ] 支持前缀和后缀图标
  - [ ] 支持字符计数
  - [ ] 编写单元测试
  - [ ] 编写文档

- [ ] 2.1.3 创建 Card 组件
  - [ ] 文件: src/components/Card.tsx
  - [ ] 支持阴影和边框样式
  - [ ] 支持 padding 自定义
  - [ ] 支持按压效果
  - [ ] 编写单元测试

- [ ] 2.1.4 创建 Modal 组件
  - [ ] 文件: src/components/Modal.tsx
  - [ ] 支持基础 modal
  - [ ] 支持 Alert dialog
  - [ ] 支持 Confirm dialog
  - [ ] 支持动画效果
  - [ ] 编写单元测试

- [ ] 2.1.5 创建 Loading 组件
  - [ ] 文件: src/components/Loading.tsx
  - [ ] 显示加载动画
  - [ ] 显示加载文本
  - [ ] 支持多种加载动画样式
  - [ ] 编写单元测试

- [ ] 2.1.6 创建 Toast 组件
  - [ ] 文件: src/components/Toast.tsx
  - [ ] 支持 success, error, warning, info
  - [ ] 自动消失
  - [ ] 支持自定义位置
  - [ ] 集成到 UI Store
  - [ ] 编写单元测试

- [ ] 2.1.7 创建 Header 组件
  - [ ] 文件: src/components/Header.tsx
  - [ ] 显示标题
  - [ ] 支持返回按钮
  - [ ] 支持右侧操作按钮
  - [ ] 响应式设计
  - [ ] 编写单元测试

- [ ] 2.1.8 创建 TabBar 组件
  - [ ] 文件: src/components/TabBar.tsx
  - [ ] 显示 4 个 tab (首页、分析、收藏、我的)
  - [ ] 支持活跃态样式
  - [ ] 支持 badge 显示
  - [ ] 编写单元测试
```

### 2.2 表单组件

```
TODO List - 表单组件
- [ ] 2.2.1 创建 Form 容器组件
  - [ ] 文件: src/components/Form.tsx
  - [ ] 集成 React Hook Form
  - [ ] 处理表单提交
  - [ ] 显示全局错误消息
  - [ ] 编写单元测试

- [ ] 2.2.2 创建 FormField 组件
  - [ ] 文件: src/components/FormField.tsx
  - [ ] 包装输入框
  - [ ] 显示标签和错误
  - [ ] 支持多种字段类型
  - [ ] 编写单元测试

- [ ] 2.2.3 创建 Select 组件
  - [ ] 文件: src/components/Select.tsx
  - [ ] Picker 样式
  - [ ] 支持单选和多选
  - [ ] 显示选中值
  - [ ] 编写单元测试

- [ ] 2.2.4 创建 Checkbox 组件
  - [ ] 文件: src/components/Checkbox.tsx
  - [ ] 支持单个和多个 checkbox
  - [ ] 受控组件实现
  - [ ] 编写单元测试

- [ ] 2.2.5 创建 DatePicker 组件
  - [ ] 文件: src/components/DatePicker.tsx
  - [ ] 支持日期选择
  - [ ] 支持日期范围选择
  - [ ] 使用 date-fns
  - [ ] 编写单元测试

- [ ] 2.2.6 创建 Radio 组件
  - [ ] 文件: src/components/Radio.tsx
  - [ ] 支持单选
  - [ ] 编写单元测试
```

### 2.3 展示组件

```
TODO List - 展示组件
- [ ] 2.3.1 创建 Avatar 组件
  - [ ] 文件: src/components/Avatar.tsx
  - [ ] 显示用户头像
  - [ ] 支持默认头像
  - [ ] 支持首字母显示
  - [ ] 编写单元测试

- [ ] 2.3.2 创建 Badge 组件
  - [ ] 文件: src/components/Badge.tsx
  - [ ] 显示标签/徽章
  - [ ] 支持多种样式
  - [ ] 编写单元测试

- [ ] 2.3.3 创建 Empty 组件
  - [ ] 文件: src/components/Empty.tsx
  - [ ] 显示空状态
  - [ ] 支持自定义图标和文本
  - [ ] 编写单元测试

- [ ] 2.3.4 创建 Error 组件
  - [ ] 文件: src/components/Error.tsx
  - [ ] 显示错误状态
  - [ ] 支持重试按钮
  - [ ] 编写单元测试

- [ ] 2.3.5 创建 List 组件
  - [ ] 文件: src/components/List.tsx
  - [ ] 显示列表项
  - [ ] 支持可点击列表项
  - [ ] 编写单元测试

- [ ] 2.3.6 创建 Divider 组件
  - [ ] 文件: src/components/Divider.tsx
  - [ ] 显示分割线
  - [ ] 编写单元测试
```

---

## 第5周: 认证页面开发

### 3.1 认证相关 Hook

```
TODO List - 认证 Hook
- [x] 3.1.1 创建 useAuth hook
  - [x] 文件: src/hooks/useAuth.ts
  - [x] 获取当前用户信息
  - [x] 获取登录状态
  - [x] 获取 token
  - [x] 登出操作
  - [x] 刷新 token

- [x] 3.1.2 创建 useLogin hook
  - [x] 文件: src/hooks/useLogin.ts
  - [x] 处理登录逻辑
  - [x] 错误处理
  - [x] 状态管理

- [x] 3.1.3 创建 useRegister hook
  - [x] 文件: src/hooks/useRegister.ts
  - [x] 处理注册逻辑
  - [x] 邮箱验证
  - [x] 错误处理

- [x] 3.1.4 创建 usePasswordReset hook
  - [x] 文件: src/hooks/usePasswordReset.ts
  - [x] 处理密码重置逻辑
  - [x] 验证码发送
  - [x] 错误处理
```

### 3.2 登录页面

```
TODO List - 登录页面
- [ ] 3.2.1 创建 LoginScreen
  - [ ] 文件: src/screens/LoginScreen.tsx
  - [ ] 邮箱输入框
  - [ ] 密码输入框
  - [ ] 登录按钮
  - [ ] 忘记密码链接
  - [ ] 没有账户跳转注册

- [ ] 3.2.2 实现登录表单
  - [ ] 使用 React Hook Form
  - [ ] 邮箱格式验证
  - [ ] 密码验证
  - [ ] 表单提交

- [ ] 3.2.3 实现错误处理
  - [ ] 显示错误消息
  - [ ] 网络错误处理
  - [ ] 无效凭证处理

- [ ] 3.2.4 测试登录页面
  - [ ] 单元测试
  - [ ] UI 测试
  - [ ] 集成测试
```

### 3.3 注册页面

```
TODO List - 注册页面
- [ ] 3.3.1 创建 RegisterScreen
  - [ ] 文件: src/screens/RegisterScreen.tsx
  - [ ] 邮箱输入框
  - [ ] 密码输入框
  - [ ] 密码确认框
  - [ ] 服务条款同意复选框
  - [ ] 注册按钮

- [ ] 3.3.2 实现注册表单
  - [ ] 使用 React Hook Form
  - [ ] 邮箱格式验证
  - [ ] 密码强度验证
  - [ ] 密码一致性验证
  - [ ] 表单提交

- [ ] 3.3.3 实现邮箱验证
  - [ ] 发送验证码
  - [ ] 验证码输入框
  - [ ] 验证码验证
  - [ ] 重新发送验证码

- [ ] 3.3.4 测试注册页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 3.4 忘记密码页面

```
TODO List - 忘记密码页面
- [ ] 3.4.1 创建 ForgotPasswordScreen
  - [ ] 文件: src/screens/ForgotPasswordScreen.tsx
  - [ ] 邮箱输入框
  - [ ] 发送重置链接按钮
  - [ ] 成功提示

- [ ] 3.4.2 创建 ResetPasswordScreen
  - [ ] 文件: src/screens/ResetPasswordScreen.tsx
  - [ ] 密码输入框
  - [ ] 密码确认框
  - [ ] 重置按钮
  - [ ] token 验证

- [ ] 3.4.3 测试密码重置流程
  - [ ] 单元测试
  - [ ] UI 测试
```

---

## 第6周: 首页和文件上传开发

### 4.1 首页相关 Hook

```
TODO List - 首页 Hook
- [ ] 4.1.1 创建 useContractHistory hook
  - [ ] 文件: src/hooks/useContractHistory.ts
  - [ ] 获取历史合同列表
  - [ ] 分页加载
  - [ ] 刷新数据
  - [ ] 删除历史记录

- [ ] 4.1.2 创建 useUpload hook
  - [ ] 文件: src/hooks/useUpload.ts
  - [ ] 处理文件上传
  - [ ] 上传进度
  - [ ] 取消上传
  - [ ] 错误处理

- [ ] 4.1.3 创建 useCamera hook
  - [ ] 文件: src/hooks/useCamera.ts
  - [ ] 调用相机
  - [ ] 保存照片
  - [ ] 权限检查
```

### 4.2 首页页面

```
TODO List - 首页页面
- [ ] 4.2.1 创建 HomeScreen
  - [ ] 文件: src/screens/HomeScreen.tsx
  - [ ] 页面布局
  - [ ] 包含上传区域、快捷按钮、历史列表

- [ ] 4.2.2 实现上传区域组件
  - [ ] 文件: src/components/UploadArea.tsx
  - [ ] 显示上传提示
  - [ ] 点击触发上传
  - [ ] 拖拽上传（Web）

- [ ] 4.2.3 实现快捷按钮
  - [ ] 拍照按钮 - 调用相机
  - [ ] 选择文件按钮 - 打开文件选择器
  - [ ] 按钮样式和交互

- [ ] 4.2.4 实现历史合同列表
  - [ ] 文件: src/components/ContractList.tsx
  - [ ] 显示合同项目
  - [ ] 点击跳转详情
  - [ ] 删除功能
  - [ ] 下拉刷新
  - [ ] 无限滚动加载

- [ ] 4.2.5 测试首页
  - [ ] 单元测试
  - [ ] UI 测试
  - [ ] 交互测试
```

### 4.3 文件上传服务

```
TODO List - 文件上传服务
- [ ] 4.3.1 创建上传服务
  - [ ] 文件: src/services/uploadService.ts
  - [ ] 选择文件处理
  - [ ] 照片上传处理
  - [ ] 文件验证
  - [ ] 上传 API 调用
  - [ ] 上传进度计算

- [ ] 4.3.2 实现文件选择器
  - [ ] 支持选择图片
  - [ ] 支持选择 PDF
  - [ ] 支持选择 Word 文档
  - [ ] 文件大小限制检查

- [ ] 4.3.3 实现相机功能
  - [ ] 请求相机权限
  - [ ] 打开相机
  - [ ] 拍照后处理
  - [ ] 权限拒绝处理

- [ ] 4.3.4 实现上传进度
  - [ ] 显示上传百分比
  - [ ] 显示上传速度
  - [ ] 取消上传功能

- [ ] 4.3.5 测试上传功能
  - [ ] 单元测试
  - [ ] 集成测试
```

### 4.4 上传状态管理

```
TODO List - 上传状态
- [ ] 4.4.1 创建 uploadStore
  - [ ] 文件: src/stores/uploadStore.ts
  - [ ] 存储上传文件信息
  - [ ] 存储上传进度
  - [ ] 存储上传错误

- [ ] 4.4.2 创建 useUploadState hook
  - [ ] 获取上传状态
  - [ ] 更新上传进度
  - [ ] 清空上传状态
```

---

## 第7-8周: 分析结果页面开发

### 5.1 分析相关 Hook

```
TODO List - 分析 Hook
- [ ] 5.1.1 创建 useAnalysis hook
  - [ ] 文件: src/hooks/useAnalysis.ts
  - [ ] 提交合同进行分析
  - [ ] 轮询获取分析状态
  - [ ] 获取分析结果
  - [ ] 取消分析

- [ ] 5.1.2 创建 useAnalysisResult hook
  - [ ] 文件: src/hooks/useAnalysisResult.ts
  - [ ] 获取分析详细结果
  - [ ] 获取风险项详情
  - [ ] 获取建议方案

- [ ] 5.1.3 创建 useContractDetail hook
  - [ ] 文件: src/hooks/useContractDetail.ts
  - [ ] 获取合同详细信息
  - [ ] 获取合同原文
```

### 5.2 分析加载页面

```
TODO List - 分析加载页面
- [ ] 5.2.1 创建 AnalyzingScreen
  - [ ] 文件: src/screens/AnalyzingScreen.tsx
  - [ ] 显示加载动画
  - [ ] 显示分析进度文本
  - [ ] 显示进度百分比（如果可用）
  - [ ] 取消按钮

- [ ] 5.2.2 实现轮询逻辑
  - [ ] 定期检查分析状态
  - [ ] 当完成时跳转结果页面
  - [ ] 处理超时情况

- [ ] 5.2.3 测试分析页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 5.3 分析结果汇总页面

```
TODO List - 分析结果页面
- [ ] 5.3.1 创建 AnalysisResultScreen
  - [ ] 文件: src/screens/AnalysisResultScreen.tsx
  - [ ] 显示合同概览
  - [ ] 显示风险汇总
  - [ ] 显示建议预览

- [ ] 5.3.2 实现合同概览卡片
  - [ ] 文件: src/components/ContractOverviewCard.tsx
  - [ ] 显示合同类型
  - [ ] 显示当事人信息
  - [ ] 显示合同期限
  - [ ] 显示页数

- [ ] 5.3.3 实现风险汇总卡片
  - [ ] 文件: src/components/RiskSummaryCard.tsx
  - [ ] 显示风险等级（高/中/低）
  - [ ] 显示风险数量
  - [ ] 风险项预览（前2项）
  - [ ] 跳转详细风险按钮

- [ ] 5.3.4 实现建议卡片
  - [ ] 文件: src/components/SuggestionCard.tsx
  - [ ] 显示关键建议
  - [ ] 支持扩展查看全部

- [ ] 5.3.5 测试结果页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 5.4 详细分析页面

```
TODO List - 详细分析页面
- [ ] 5.4.1 创建 ContractDetailScreen
  - [ ] 文件: src/screens/ContractDetailScreen.tsx
  - [ ] 页面布局
  - [ ] 选项卡切换 (概览、详情、风险、原文)

- [ ] 5.4.2 实现概览 Tab
  - [ ] 文件: src/components/OverviewTab.tsx
  - [ ] 基本信息展示
  - [ ] 当事人信息展示
  - [ ] 关键日期展示

- [ ] 5.4.3 实现详情 Tab
  - [ ] 文件: src/components/DetailTab.tsx
  - [ ] 基本信息列表
  - [ ] 当事人信息列表
  - [ ] 关键条款列表

- [ ] 5.4.4 实现风险 Tab
  - [ ] 文件: src/components/RiskTab.tsx
  - [ ] 风险按等级分组
  - [ ] 显示风险详情
  - [ ] 显示改进建议

- [ ] 5.4.5 实现原文 Tab
  - [ ] 文件: src/components/OriginalTab.tsx
  - [ ] 显示合同原文
  - [ ] 支持搜索和标记

- [ ] 5.4.6 测试详细页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 5.5 风险分析页面

```
TODO List - 风险分析页面
- [ ] 5.5.1 创建 RiskAnalysisScreen
  - [ ] 文件: src/screens/RiskAnalysisScreen.tsx
  - [ ] 风险等级总结
  - [ ] 风险项列表

- [ ] 5.5.2 实现风险项组件
  - [ ] 文件: src/components/RiskItem.tsx
  - [ ] 显示风险标题
  - [ ] 显示风险描述
  - [ ] 显示风险等级和图标
  - [ ] 可点击展开详情

- [ ] 5.5.3 实现风险详情模态框
  - [ ] 文件: src/components/RiskDetailModal.tsx
  - [ ] 风险完整描述
  - [ ] 相关法律条款
  - [ ] 改进建议
  - [ ] 案例参考

- [ ] 5.5.4 测试风险页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 5.6 报告导出功能

```
TODO List - 报告导出
- [ ] 5.6.1 创建导出服务
  - [ ] 文件: src/services/exportService.ts
  - [ ] PDF 导出
  - [ ] Excel 导出
  - [ ] 文本导出

- [ ] 5.6.2 实现 PDF 导出
  - [ ] 生成 PDF 报告
  - [ ] 包含所有关键信息
  - [ ] 格式化布局
  - [ ] 文件保存

- [ ] 5.6.3 实现分享功能
  - [ ] 分享到社交媒体
  - [ ] 分享分析报告链接
  - [ ] 复制分享链接

- [ ] 5.6.4 测试导出功能
  - [ ] 单元测试
  - [ ] 导出测试
```

---

## 第9周: 个人中心和设置页面

### 6.1 个人中心页面

```
TODO List - 个人中心
- [ ] 6.1.1 创建 ProfileScreen
  - [ ] 文件: src/screens/ProfileScreen.tsx
  - [ ] 用户头像展示
  - [ ] 用户名和邮箱
  - [ ] 账户统计信息

- [ ] 6.1.2 实现用户信息组件
  - [ ] 文件: src/components/UserInfo.tsx
  - [ ] 显示用户头像
  - [ ] 显示用户名
  - [ ] 显示邮箱

- [ ] 6.1.3 实现统计卡片
  - [ ] 文件: src/components/StatsCard.tsx
  - [ ] 显示分析数量
  - [ ] 显示收藏数量
  - [ ] 显示最近访问

- [ ] 6.1.4 实现编辑按钮
  - [ ] 跳转编辑个人信息页面

- [ ] 6.1.5 测试个人中心
  - [ ] 单元测试
  - [ ] UI 测试
```

### 6.2 编辑个人信息页面

```
TODO List - 编辑个人信息
- [ ] 6.2.1 创建 EditProfileScreen
  - [ ] 文件: src/screens/EditProfileScreen.tsx
  - [ ] 用户名编辑框
  - [ ] 邮箱显示（不可编辑）
  - [ ] 保存按钮

- [ ] 6.2.2 实现头像上传
  - [ ] 选择新头像
  - [ ] 预览新头像
  - [ ] 上传头像

- [ ] 6.2.3 测试编辑页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 6.3 设置页面

```
TODO List - 设置页面
- [ ] 6.3.1 创建 SettingsScreen
  - [ ] 文件: src/screens/SettingsScreen.tsx
  - [ ] 账户设置链接
  - [ ] 通知设置链接
  - [ ] 隐私与安全链接
  - [ ] 关于链接
  - [ ] 登出按钮

- [ ] 6.3.2 创建账户设置页面
  - [ ] 文件: src/screens/AccountSettingsScreen.tsx
  - [ ] 修改密码
  - [ ] 两因素认证
  - [ ] 登出所有设备

- [ ] 6.3.3 创建通知设置页面
  - [ ] 文件: src/screens/NotificationSettingsScreen.tsx
  - [ ] 推送通知开关
  - [ ] 邮件通知选择
  - [ ] 通知类型选择

- [ ] 6.3.4 创建隐私与安全页面
  - [ ] 文件: src/screens/PrivacyScreen.tsx
  - [ ] 数据隐私政策链接
  - [ ] 数据导出功能
  - [ ] 账户删除功能

- [ ] 6.3.5 创建关于页面
  - [ ] 文件: src/screens/AboutScreen.tsx
  - [ ] 应用版本
  - [ ] 更新日志
  - [ ] 使用条款链接
  - [ ] 隐私政策链接
  - [ ] 联系我们链接

- [ ] 6.3.6 测试设置页面
  - [ ] 单元测试
  - [ ] UI 测试
```

### 6.4 收藏和历史管理

```
TODO List - 收藏和历史
- [ ] 6.4.1 创建 FavoritesScreen
  - [ ] 文件: src/screens/FavoritesScreen.tsx
  - [ ] 显示收藏合同列表
  - [ ] 点击跳转详情
  - [ ] 取消收藏功能
  - [ ] 下拉刷新
  - [ ] 无限滚动加载

- [ ] 6.4.2 创建收藏相关 Hook
  - [ ] 文件: src/hooks/useFavorites.ts
  - [ ] 获取收藏列表
  - [ ] 添加收藏
  - [ ] 移除收藏
  - [ ] 检查是否收藏

- [ ] 6.4.3 测试收藏功能
  - [ ] 单元测试
  - [ ] 集成测试
```

---

## 第10-11周: 测试和优化

### 7.1 单元测试

```
TODO List - 单元测试
- [ ] 7.1.1 为 Hook 编写单元测试
  - [ ] useAuth hook 测试
  - [ ] useContract hook 测试
  - [ ] useUpload hook 测试
  - [ ] useAnalysis hook 测试
  - [ ] 目标覆盖率: 85%+

- [ ] 7.1.2 为组件编写单元测试
  - [ ] Button 组件测试
  - [ ] Input 组件测试
  - [ ] Card 组件测试
  - [ ] Modal 组件测试
  - [ ] 所有 UI 组件测试
  - [ ] 目标覆盖率: 80%+

- [ ] 7.1.3 为工具函数编写单元测试
  - [ ] API 工具测试
  - [ ] 验证函数测试
  - [ ] 格式化函数测试
  - [ ] 目标覆盖率: 90%+

- [ ] 7.1.4 运行测试并生成覆盖率报告
  - [ ] pnpm test 运行所有测试
  - [ ] 生成覆盖率报告
  - [ ] 确保覆盖率达标
```

### 7.2 集成测试

```
TODO List - 集成测试
- [ ] 7.2.1 编写登录流程测试
  - [ ] 测试登录成功流程
  - [ ] 测试登录失败处理
  - [ ] 测试密码错误处理
  - [ ] 测试token自动刷新

- [ ] 7.2.2 编写注册流程测试
  - [ ] 测试注册成功流程
  - [ ] 测试邮箱验证流程
  - [ ] 测试密码验证失败

- [ ] 7.2.3 编写上传和分析流程测试
  - [ ] 测试文件选择上传
  - [ ] 测试照片拍照上传
  - [ ] 测试分析开始和完成
  - [ ] 测试结果展示

- [ ] 7.2.4 编写收藏和历史测试
  - [ ] 测试添加收藏
  - [ ] 测试移除收藏
  - [ ] 测试历史列表加载
  - [ ] 测试删除历史
```

### 7.3 UI 和交互测试

```
TODO List - UI 测试
- [ ] 7.3.1 首页交互测试
  - [ ] 点击拍照跳转相机
  - [ ] 点击选择文件打开选择器
  - [ ] 点击历史项跳转详情
  - [ ] 下拉刷新功能
  - [ ] 无限滚动加载

- [ ] 7.3.2 详情页交互测试
  - [ ] 选项卡切换工作正常
  - [ ] 点击风险项显示详情
  - [ ] 分享和导出按钮工作
  - [ ] 返回按钮工作

- [ ] 7.3.3 设置页交互测试
  - [ ] 所有设置项可点击
  - [ ] 开关开闭工作
  - [ ] 登出确认工作

- [ ] 7.3.4 响应式设计测试
  - [ ] 小屏幕适配
  - [ ] 中屏幕适配
  - [ ] 大屏幕适配
  - [ ] 横竖屏切换
```

### 7.4 性能优化

```
TODO List - 性能优化
- [ ] 7.4.1 前端性能分析
  - [ ] 分析应用加载时间
  - [ ] 分析首屏时间
  - [ ] 分析内存占用
  - [ ] 分析 bundle 大小

- [ ] 7.4.2 实现代码分割
  - [ ] 按路由分割代码
  - [ ] 按组件懒加载
  - [ ] 动态导入模块

- [ ] 7.4.3 优化列表性能
  - [ ] 使用虚拟滚动
  - [ ] 优化列表项渲染
  - [ ] 实现分页加载

- [ ] 7.4.4 优化图片处理
  - [ ] 图片压缩
  - [ ] 图片格式优化
  - [ ] 懒加载图片

- [ ] 7.4.5 优化网络请求
  - [ ] 实现请求缓存
  - [ ] 合并请求
  - [ ] 减少请求大小

- [ ] 7.4.6 优化状态管理
  - [ ] 避免不必要的重新渲染
  - [ ] 优化 selector
  - [ ] 使用 memo 包装组件
```

### 7.5 安全加固

```
TODO List - 安全加固
- [ ] 7.5.1 前端安全审计
  - [ ] 检查 XSS 漏洞
  - [ ] 检查 CSRF 防护
  - [ ] 检查敏感信息泄露
  - [ ] 检查依赖安全

- [ ] 7.5.2 实现安全措施
  - [ ] 实现 XSS 防护
  - [ ] 实现输入验证
  - [ ] 实现 token 存储安全
  - [ ] 实现敏感数据脱敏

- [ ] 7.5.3 依赖安全扫描
  - [ ] pnpm audit 扫描
  - [ ] 更新已知漏洞依赖
  - [ ] 检查过期依赖

- [ ] 7.5.4 代码审查
  - [ ] 进行代码审查
  - [ ] 修复审查发现的问题
  - [ ] 确保代码质量
```

---

## 第12周: 发布准备和优化

### 8.1 最终集成测试

```
TODO List - 最终测试
- [ ] 8.1.1 完整流程测试
  - [ ] 测试整个应用流程
  - [ ] 测试所有功能点
  - [ ] 测试边界情况
  - [ ] 测试错误恢复

- [ ] 8.1.2 兼容性测试
  - [ ] iOS 12+ 兼容性
  - [ ] Android 5+ 兼容性
  - [ ] 不同屏幕尺寸测试
  - [ ] 不同网络环境测试

- [ ] 8.1.3 性能测试
  - [ ] 启动时间
  - [ ] 内存占用
  - [ ] 电池消耗
  - [ ] 网络流量

- [ ] 8.1.4 安全测试
  - [ ] 敏感数据保护
  - [ ] 权限检查
  - [ ] API 安全验证
```

### 8.2 代码质量和文档

```
TODO List - 代码质量
- [ ] 8.2.1 代码审查
  - [ ] 全代码库审查
  - [ ] 确保代码风格一致
  - [ ] 修复 ESLint 警告
  - [ ] 优化代码结构

- [ ] 8.2.2 编写文档
  - [ ] 编写项目 README
  - [ ] 编写开发指南
  - [ ] 编写 API 使用文档
  - [ ] 编写部署指南

- [ ] 8.2.3 编写变更日志
  - [ ] 列出新功能
  - [ ] 列出 Bug 修复
  - [ ] 列出改进
  - [ ] 列出破坏性变更
```

### 8.3 构建和发布准备

```
TODO List - 构建发布
- [ ] 8.3.1 配置生产环境
  - [ ] 配置生产 API 地址
  - [ ] 配置生产环境变量
  - [ ] 禁用调试功能
  - [ ] 配置错误追踪

- [ ] 8.3.2 生成构建版本
  - [ ] 生成 iOS 版本
    - [ ] 配置 Xcode 项目
    - [ ] 生成签名证书
    - [ ] 构建 .ipa 文件
  - [ ] 生成 Android 版本
    - [ ] 配置 Gradle
    - [ ] 生成签名密钥
    - [ ] 构建 .apk/.aab 文件

- [ ] 8.3.3 应用市场发布
  - [ ] iOS App Store 发布
    - [ ] 创建应用 ID
    - [ ] 完善应用信息
    - [ ] 准备应用截图
    - [ ] 上传 .ipa 文件
    - [ ] 提交审核
    - [ ] 等待审核通过
  - [ ] Google Play 发布
    - [ ] 创建应用
    - [ ] 完善应用信息
    - [ ] 准备应用截图
    - [ ] 上传 .aab 文件
    - [ ] 提交审核
    - [ ] 等待审核通过
  - [ ] Web 版发布
    - [ ] pnpm run build 生成构建
    - [ ] 部署到服务器
    - [ ] 配置域名
    - [ ] 验证访问

- [ ] 8.3.4 用户支持准备
  - [ ] 创建帮助文档
  - [ ] 创建常见问题 (FAQ)
  - [ ] 创建反馈渠道
  - [ ] 准备用户支持方案
```

---

## Monorepo 工作区结构

本项目使用 pnpm workspace 管理 Monorepo:

```yaml
# pnpm-workspace.yaml
packages:
  - 'client'  # React Native 前端
  - 'server'  # NestJS 后端
```

**包管理命令**:
- 在根目录安装所有依赖: `pnpm install`
- 在 client 目录工作: `cd client && pnpm <command>`
- 在 server 目录工作: `cd server && pnpm <command>`
- 运行 client 开发服务器: `cd client && pnpm start`
- 运行 server 开发服务器: `cd server && pnpm start:dev`

---

## 前端文件结构参考

```
contract-assistant/                    # Monorepo 根目录
├── pnpm-workspace.yaml                # pnpm 工作区配置
├── pnpm-lock.yaml                     # pnpm 锁定文件
├── package.json                       # 根 package.json
├── client/                            # 前端应用目录
│   ├── app/
│   │   ├── _layout.tsx                # 根布局
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       ├── index.tsx              # 首页
│   │       ├── analyze.tsx
│   │       ├── favorites.tsx
│   │       └── profile.tsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ...
│   │   │   ├── form/
│   │   │   ├── UploadArea.tsx
│   │   │   ├── ContractList.tsx
│   │   │   └── ...
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── AnalysisResultScreen.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useUpload.ts
│   │   │   ├── useAnalysis.ts
│   │   │   └── ...
│   │   ├── stores/
│   │   │   ├── authStore.ts
│   │   │   ├── contractStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── uploadStore.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── contractService.ts
│   │   │   ├── uploadService.ts
│   │   │   └── analysisService.ts
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   ├── storage.ts
│   │   │   └── ...
│   │   ├── constants/
│   │   │   ├── colors.ts
│   │   │   ├── sizes.ts
│   │   │   ├── endpoints.ts
│   │   │   └── ...
│   │   ├── types/
│   │   │   ├── models.ts
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   └── ...
│   │   └── assets/
│   │       ├── images/
│   │       └── icons/
│   ├── __tests__/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   ├── .env
│   ├── .env.production
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── app.json
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
└── server/                            # 后端应用目录
    └── ...
```

---

## 开发建议

### 开发顺序
1. **优先完成认证流程** - 这是应用的基础
2. **快速完成首页和上传** - 这是用户的第一个交互
3. **集成分析功能** - 这是应用的核心功能
4. **完善详情页面** - 提供完整的数据展示
5. **添加个人中心** - 增加应用的完整性
6. **最后进行测试和优化** - 确保质量

### 推荐的并行开发策略
- **第1-2周**: 基础设施，可独立进行
- **第3-4周**: UI 组件，可独立开发，不依赖后端
- **第5周**: 认证页面，依赖后端认证 API
- **第6周**: 首页和上传，可与后端并行
- **第7-8周**: 分析页面，需要等待后端分析 API
- **第9周**: 个人中心，可独立开发
- **第10-12周**: 测试和发布

### 与后端的协作
- **第2周**: 与后端讨论并确定 API 文档
- **第5周开始**: 后端需要完成认证 API
- **第6周开始**: 后端需要完成文件上传和合同 API
- **第7周开始**: 后端需要完成分析 API
- **第10周**: 联合进行集成测试

---

## 关键技术点

1. **Expo Router** - 文件级路由，自动处理导航
2. **Zustand** - 轻量级状态管理，易于使用
3. **React Hook Form** - 高效的表单管理
4. **Axios 拦截器** - 自动处理 token 和认证
5. **异步图片加载** - 优化应用性能
6. **错误边界** - 捕获组件错误
7. **测试驱动开发** - 确保代码质量

---

## 常见问题和解决方案

1. **相机权限问题** - 在 app.json 中声明权限，运行时申请
2. **文件选择器不工作** - 检查权限设置
3. **上传进度不显示** - 确保后端支持 Content-Length 和 chunked 传输
4. **列表性能差** - 使用虚拟滚动或分页加载
5. **内存泄漏** - 在 useEffect cleanup 中取消请求

---

**最后更新**: 2025-12-27  
**版本**: v1.0  
**状态**: 进行中 (第1-2周已完成，已完成 1.1-1.5，准备开始第3-4周)
