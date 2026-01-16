# Apple 登录 & Apple 支付实现指南

## 📋 项目现状分析

### ✅ 已完成
- ✅ 依赖已安装：`expo-apple-authentication`、`@invertase/react-native-apple-authentication`
- ✅ iOS/Web 组件已存在于 `client/components/social-auth-buttons/apple/`
- ✅ Supabase 认证集成已完成
- ✅ Bundle ID 已配置：`com.contractassistant.app`

### ❌ 待完成
- ❌ Apple 登录未配置（缺少 App ID、Service ID、回调地址等）
- ❌ Apple 支付尚未实现
- ❌ 支付处理后端未搭建

---

## 🍎 第一部分：Apple 登录（Sign in with Apple）

### 一、从 Apple Developer 账户准备资料

#### 1. App ID 配置

**位置**：[Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list) → Certificates, Identifiers & Profiles → Identifiers

**操作步骤**：
1. 登录 Apple Developer 账户
2. 进入 Identifiers 页面
3. 找到或创建 App ID：`com.contractassistant.app`
4. 编辑 App ID，勾选 **"Sign in with Apple"** 功能
5. 配置为 **Primary App ID**（主应用 ID）
6. 保存设置

**注意事项**：
- App ID 必须与 `client/app.json` 中的 `bundleIdentifier` 一致
- 确保选择 "Enable as a primary App ID"

---

#### 2. Services ID（用于 Web/Android）

**位置**：Apple Developer Console → Identifiers → Services IDs

**操作步骤**：
1. 点击 "+" 创建新的 Identifier
2. 选择 **Services IDs**
3. 填写信息：
   - **Description**: Contract Assistant Auth Service
   - **Identifier**: `com.contractassistant.auth`（建议命名）
4. 勾选 **"Sign in with Apple"**
5. 点击 "Configure" 配置：
   - **Primary App ID**: 选择 `com.contractassistant.app`
   - **Website URLs** 部分：
     - **Domains and Subdomains**: `svsfknesniyjtoylrjsi.supabase.co`
     - **Return URLs**: `https://svsfknesniyjtoylrjsi.supabase.co/auth/v1/callback`
6. 保存配置

**需要记录的信息**：
- ✏️ Services ID: `com.contractassistant.auth`

---

#### 3. 私钥文件（.p8 文件）

**位置**：Apple Developer Console → Keys

**操作步骤**：
1. 点击 "+" 创建新密钥
2. 填写密钥名称：`Contract Assistant Sign in with Apple Key`
3. 勾选 **"Sign in with Apple"** 权限
4. 点击 "Configure"，选择 Primary App ID: `com.contractassistant.app`
5. 点击 "Continue" 和 "Register"
6. **⚠️ 重要**：下载 `.p8` 私钥文件（只能下载一次，请妥善保存！）
7. 记录 **Key ID**（10 位字符串，如：`AB12CD34EF`）

**需要记录的信息**：
- ✏️ Key ID: `__________`（10 位字符）
- ✏️ 下载的 `.p8` 文件路径

---

#### 4. Team ID

**位置**：Apple Developer Console → Membership

**操作步骤**：
1. 进入 Membership 页面
2. 找到 **Team ID**（10 位字符串）
3. 复制保存

**需要记录的信息**：
- ✏️ Team ID: `__________`（10 位字符）

---

### 二、配置 Supabase

#### 1. 登录 Supabase Dashboard

访问：https://supabase.com/dashboard/project/svsfknesniyjtoylrjsi

#### 2. 配置 Apple Provider

**位置**：Authentication → Providers → Apple

**配置项**：
```
Services ID: com.contractassistant.auth
Team ID: [您的 Team ID]
Key ID: [您的 Key ID]
Private Key: [粘贴 .p8 文件的完整内容]
Authorized Client IDs: com.contractassistant.app
```

**私钥格式示例**：
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
[完整的私钥内容]
-----END PRIVATE KEY-----
```

**操作步骤**：
1. 打开下载的 `.p8` 文件（使用文本编辑器）
2. 复制完整内容（包括 BEGIN 和 END 行）
3. 粘贴到 Supabase 的 "Private Key" 字段
4. 填写其他字段
5. 点击 "Save" 保存

---

### 三、配置客户端（React Native/Expo）

#### 1. 更新环境变量

**文件路径**：`client/.env`

**添加配置**：
```env
# Apple Sign In Configuration
EXPO_PUBLIC_APPLE_AUTH_SERVICE_ID="com.contractassistant.auth"
EXPO_PUBLIC_APPLE_AUTH_REDIRECT_URI="https://svsfknesniyjtoylrjsi.supabase.co/auth/v1/callback"
```

#### 2. 更新 app.json

**文件路径**：`client/app.json`

**关键变更**：
- 添加 `"usesAppleSignIn": true`
- 在 `associatedDomains` 中添加 Supabase 域名

---

### 四、重新构建应用

#### iOS 构建

```bash
cd client

# 清理缓存
pnpm start --clear

# 重新生成原生代码
npx expo prebuild --clean

# iOS 构建
pnpm ios
```

---

### 五、测试 Apple 登录

#### 测试环境要求
- ✅ 真实 iOS 设备（模拟器不支持 Apple 登录）
- ✅ 登录了 Apple ID 的设备
- ✅ iOS 13.0 或更高版本

#### 测试步骤
1. 在真实 iOS 设备上安装应用
2. 点击 "Sign in with Apple" 按钮
3. 系统会弹出 Apple 登录面板
4. 选择 "Continue with Apple ID" 或 "Create New Email"
5. 完成 Face ID/Touch ID 验证
6. 检查是否成功跳转到应用主页

---

### 六、常见问题排查

#### 问题 1：点击按钮无反应
**可能原因**：
- Services ID 未正确配置
- Return URL 不匹配
- 未在真实设备上测试

**解决方案**：
1. 检查 Apple Developer Console 中的 Services ID 配置
2. 确认 Return URL 完全一致（包括协议和路径）
3. 使用真实 iOS 设备测试

#### 问题 2：提示 "invalid_client"
**可能原因**：
- Supabase 中的 Services ID 填写错误
- Team ID 或 Key ID 不正确

**解决方案**：
1. 重新检查 Supabase 配置中的所有 ID
2. 确认 `.p8` 私钥完整复制

---

## 💳 第二部分：Apple Pay（应用内支付）

### 一、从 Apple Developer 账户准备资料

#### 1. Merchant ID（商户 ID）

**位置**：Apple Developer Console → Identifiers → Merchant IDs

**操作步骤**：
1. 点击 "+" 创建新的 Identifier
2. 选择 **Merchant IDs**
3. 填写信息：
   - **Description**: Contract Assistant Payments
   - **Identifier**: `merchant.com.contractassistant.payments`
4. 点击 "Continue" 和 "Register"

**需要记录的信息**：
- ✏️ Merchant ID: `merchant.com.contractassistant.payments`

---

#### 2. Merchant Identity Certificate（商户身份证书）

**步骤 A：生成 CSR（Certificate Signing Request）**
1. 在 Mac 上打开 **钥匙串访问**（Keychain Access）
2. 菜单栏：钥匙串访问 → 证书助理 → 从证书颁发机构请求证书
3. 填写信息：
   - **用户电子邮件地址**：您的邮箱
   - **常用名称**：Contract Assistant Merchant Certificate
   - **CA 电子邮件地址**：留空
   - 选择：**存储到磁盘**
4. 保存 CSR 文件（如：`MerchantCertificate.certSigningRequest`）

**步骤 B：在 Apple Developer Console 创建证书**
1. 进入 Certificates 页面
2. 点击 "+" 创建新证书
3. 选择 **Merchant Identity Certificate**
4. 选择您的 Merchant ID：`merchant.com.contractassistant.payments`
5. 上传刚才生成的 CSR 文件
6. 点击 "Continue"
7. 下载生成的证书（`.cer` 文件）
8. 双击 `.cer` 文件安装到钥匙串

---

#### 3. App ID 配置

**位置**：Apple Developer Console → Identifiers → App IDs

**操作步骤**：
1. 找到您的 App ID：`com.contractassistant.app`
2. 点击编辑
3. 勾选 **"Apple Pay Payment Processing"** 功能
4. 点击 "Edit" 配置：
   - 选择您的 Merchant IDs：`merchant.com.contractassistant.payments`
5. 保存设置

---

### 二、注册支付服务提供商

推荐使用 **Stripe**（最易集成）

#### 1. 注册 Stripe 账户

访问：https://dashboard.stripe.com/register

**操作步骤**：
1. 注册账户
2. 完成身份验证（KYC）
3. 切换到测试模式（Test Mode）

#### 2. 获取 API 密钥

**位置**：Stripe Dashboard → Developers → API keys

**需要记录的信息**：
- ✏️ Publishable Key (Test): `pk_test_...`
- ✏️ Secret Key (Test): `sk_test_...`

---

### 三、实现支付功能

#### 1. 安装依赖

**客户端**：
```bash
cd client
pnpm add @stripe/stripe-react-native
```

**服务端**：
```bash
cd server
pnpm add stripe
pnpm add -D @types/stripe
```

#### 2. 配置环境变量

**客户端** (`client/.env`)：
```env
# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
```

**服务端** (`server/.env`)：
```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

---

### 四、测试 Apple Pay

#### 测试环境要求
- ✅ 真实 iOS 设备（模拟器支持有限）
- ✅ 添加了测试卡的 Wallet 应用
- ✅ iOS 12.0 或更高版本

#### Stripe 测试卡

在 iOS 设备的 Wallet 应用中，添加以下测试卡：

- **卡号**: 4242 4242 4242 4242
- **过期日期**: 任意未来日期
- **CVV**: 任意 3 位数字
- **邮编**: 任意邮编

**注意**：在沙盒环境下，这些测试卡不会产生真实扣款。

---

## 🎯 实施时间表建议

### 第 1 周：Apple 登录
- Day 1-2: 配置 Apple Developer Console
- Day 3-4: 配置 Supabase 和客户端
- Day 5: 测试和调试

### 第 2-3 周：Apple Pay
- Day 1-3: 配置支付账户和证书
- Day 4-7: 实现后端支付模块
- Day 8-10: 实现客户端支付 UI
- Day 11-14: 集成测试和优化

### 第 4 周：上线准备
- Day 1-3: 全面测试
- Day 4-5: 文档和代码审查
- Day 6-7: 准备上线和监控

---

## ⚠️ 重要注意事项

### 安全建议
1. **永远不要**在客户端存储 Stripe Secret Key
2. **永远不要**在客户端处理支付确认逻辑
3. 使用 HTTPS 传输所有支付数据
4. 实现支付金额验证（服务端验证）
5. 记录所有支付事件用于审计

### 成本说明
- **Apple Developer**: $99/年（已支付）
- **Stripe 交易费**: 2.9% + $0.30/笔
- **Apple 不收取** Apple Pay 的额外费用

### 用户体验建议
1. 支付前显示清晰的金额和商品描述
2. 提供支付加载状态提示
3. 支付成功后显示确认页面
4. 提供支付历史记录查询
5. 实现支付失败重试机制

---

## 📚 参考文档

### Apple 官方文档
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Apple Pay](https://developer.apple.com/apple-pay/)
- [Apple Pay HIG](https://developer.apple.com/design/human-interface-guidelines/apple-pay)

### Expo 文档
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Expo Build Guide](https://docs.expo.dev/build/introduction/)

### Supabase 文档
- [Supabase Apple Login](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-signinwithidtoken)

### Stripe 文档
- [Stripe Apple Pay](https://stripe.com/docs/apple-pay)
- [Stripe React Native](https://stripe.com/docs/payments/accept-a-payment?platform=react-native)
- [Stripe Test Cards](https://stripe.com/docs/testing)

---

## ✅ 上线前检查清单

### Apple 登录
- [ ] 在 Apple Developer Console 配置完整
- [ ] Supabase Provider 配置正确
- [ ] 环境变量已配置
- [ ] 在真实设备上测试成功
- [ ] 处理登录错误情况
- [ ] 实现退出登录功能

### Apple Pay
- [ ] Merchant ID 已创建并配置
- [ ] 支付证书已生成
- [ ] Stripe 账户已验证（完成 KYC）
- [ ] 支付流程测试成功
- [ ] 处理支付失败情况
- [ ] 实现退款功能（如需要）
- [ ] 配置 Webhook 接收支付事件
- [ ] 切换到生产环境的 API 密钥

### 合规要求
- [ ] 遵守 Apple Pay 人机界面指南
- [ ] 在支付前显示清晰的金额和条款
- [ ] 提供支付收据
- [ ] 实现隐私政策和用户协议
- [ ] HTTPS 生产环境部署

---

**文档创建时间**: 2026-01-16  
**项目版本**: 1.0.0  
**维护者**: Contract Assistant Team
