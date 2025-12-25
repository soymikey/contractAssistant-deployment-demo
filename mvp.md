# Contract Assistant MVP 实现规划

## 核心功能
拍照 → Google AI 分析 → 展示结果

## 技术栈
- **Frontend**: React Native (Expo)
- **Backend**: NestJS
- **AI Service**: Google Gemini API
- **Image**: Expo Camera + Expo ImagePicker

---

## 实现步骤

### Phase 1: 环境准备与依赖安装
**目标**: 配置开发环境，安装必要依赖

#### 1.1 Client 端依赖
```bash
cd client
npx expo install expo-camera expo-image-picker
npm install axios
```

#### 1.2 Server 端依赖
```bash
cd server
pnpm add @google/generative-ai
pnpm add -D @types/multer
```

#### 1.3 配置文件
- [ ] Server: 创建 `.env` 文件，添加 `GOOGLE_AI_API_KEY`
- [ ] Client: 验证 `src/constants/config.ts` 中的 API 地址

---

### Phase 2: Server 端实现
**目标**: 创建 AI 分析接口

#### 2.1 创建 AI 分析模块
```
server/src/
  ├── ai-analysis/
      ├── ai-analysis.module.ts
      ├── ai-analysis.controller.ts
      ├── ai-analysis.service.ts
      └── dto/
          └── analyze-contract.dto.ts
```

**功能**:
- [ ] POST `/api/ai-analysis/analyze` - 接收图片（base64 或 multipart）
- [ ] 调用 Google Gemini Vision API 分析合同内容
- [ ] 返回结构化分析结果（风险点、关键条款、建议）

#### 2.2 实现要点
```typescript
// ai-analysis.service.ts
- initializeGeminiClient() // 初始化 Google AI 客户端
- analyzeContract(imageData: string) // 核心分析逻辑
  - 构建 Prompt: "分析这份合同，识别风险点、关键条款和法律建议"
  - 调用 Gemini API
  - 解析并格式化返回结果
```

#### 2.3 测试验证
```bash
cd server
npm test -- ai-analysis.service.spec.ts
npm run start:dev
```

---

### Phase 3: Client 端实现
**目标**: 实现拍照、上传、结果展示 UI

#### 3.1 核心页面修改 - `app/(tabs)/index.tsx`
**Home Screen 功能**:
- [ ] "Take Photo" 按钮 - 调用相机拍照
- [ ] "Choose from Gallery" 按钮（可选）- 从相册选择
- [ ] 权限请求处理（Camera + Media Library）

#### 3.2 Loading State - `app/(tabs)/analysis.tsx`
**分析中界面**:
- [ ] 显示上传的图片预览
- [ ] Loading 动画/进度条
- [ ] "正在分析合同..." 提示文字

#### 3.3 结果展示页面
**Analysis Results Screen**:
- [ ] 创建新组件或扩展现有 `analysis.tsx`
- [ ] 展示分析结果卡片:
  - 总体评分/风险等级
  - 风险点列表（红色标注）
  - 关键条款列表（黄色标注）
  - AI 建议（绿色标注）
- [ ] "重新分析" 按钮
- [ ] "保存到收藏" 按钮（可选，MVP 可暂缓）

#### 3.4 API 集成
```typescript
// 新增 client/src/services/aiService.ts
- analyzeImage(imageUri: string): Promise<AnalysisResult>
  - 转换图片为 base64
  - POST 到 server 端 /api/ai-analysis/analyze
  - 处理响应和错误
```

#### 3.5 State 管理
```typescript
// client/src/stores/analysisStore.ts (新建)
interface AnalysisStore {
  currentImage: string | null;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  
  setImage: (uri: string) => void;
  analyzeImage: (uri: string) => Promise<void>;
  clearAnalysis: () => void;
}
```

---

### Phase 4: 集成测试
**目标**: 端到端功能验证

#### 4.1 Server 端启动
```bash
cd server
npm run start:dev  # 默认端口: http://localhost:3000
```

#### 4.2 Client 端启动
```bash
cd client
npm start
```

#### 4.3 测试流程
1. [ ] 打开 App，点击 "Take Photo"
2. [ ] 授予相机权限
3. [ ] 拍摄/选择一张合同图片
4. [ ] 验证图片上传到 Server
5. [ ] 验证 Loading 状态显示
6. [ ] 验证分析结果正确展示
7. [ ] 测试错误场景（网络失败、无效图片等）

---

### Phase 5: 优化与润色
**目标**: 提升用户体验

- [ ] 添加图片压缩（避免上传过大文件）
- [ ] 添加重试机制（网络失败时）
- [ ] 优化 Loading 动画
- [ ] 添加结果分享功能（可选）
- [ ] 错误提示友好化
- [ ] 添加基础使用引导

---

## API 接口设计

### POST `/api/ai-analysis/analyze`

**Request**:
```json
{
  "image": "base64_encoded_image_string",
  "mimeType": "image/jpeg"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": "合同总体分析摘要",
    "riskLevel": "high|medium|low",
    "risks": [
      {
        "title": "风险标题",
        "description": "详细描述",
        "severity": "high|medium|low"
      }
    ],
    "keyTerms": [
      {
        "title": "关键条款",
        "content": "条款内容",
        "importance": "critical|important|normal"
      }
    ],
    "recommendations": [
      "建议1",
      "建议2"
    ],
    "analyzedAt": "2025-12-25T10:00:00Z"
  }
}
```

---

## Google Gemini API 配置

### 获取 API Key
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新项目并生成 API Key
3. 添加到 `server/.env`:
   ```
   GOOGLE_AI_API_KEY=your_api_key_here
   ```

### 模型选择
- **推荐**: `gemini-1.5-flash` (快速、成本低)
- **备选**: `gemini-1.5-pro` (精度更高，但速度较慢)

### Prompt 模板参考
```
You are a professional contract analysis assistant. Please analyze this contract image and provide:

1. **Risk Identification**: Identify potential legal risks and unfavorable terms
2. **Key Terms**: Extract important rights and obligations clauses
3. **Professional Recommendations**: Provide precautions before signing

Please return the result in JSON format with the following fields: summary, riskLevel, risks, keyTerms, recommendations.

Note: Please respond in Chinese (Simplified) for all text content in the JSON response.
```

---

## 开发优先级

### 🔥 Must Have (MVP 核心)
1. ✅ 拍照功能
2. ✅ 图片上传到 Server
3. ✅ Google AI 分析接口
4. ✅ 结果展示页面

### 🎯 Should Have (次要功能)
5. 从相册选择图片
6. 错误处理和重试
7. 图片预览和裁剪

### 💡 Nice to Have (可延后)
8. 保存历史记录
9. 收藏功能
10. 分享分析结果
11. 多语言支持

---

## 预期时间安排

| 阶段 | 预计时间 | 输出 |
|------|---------|------|
| Phase 1: 环境准备 | 0.5h | 依赖安装完成 |
| Phase 2: Server 实现 | 2h | AI 分析 API 可调用 |
| Phase 3: Client 实现 | 3h | 完整 UI 流程 |
| Phase 4: 集成测试 | 1h | 端到端功能验证 |
| Phase 5: 优化润色 | 1h | 用户体验优化 |
| **总计** | **~7.5h** | **可用 MVP** |

---

## 后续扩展方向
- [ ] OCR 文字提取 + AI 分析（双重识别）
- [ ] 多页合同支持
- [ ] PDF 文件上传
- [ ] 合同模板库
- [ ] 用户账号系统
- [ ] 分析历史云同步

---

## 开始开发
准备好后，请告诉我从哪个阶段开始：
- `开始 Phase 1` - 安装依赖
- `开始 Phase 2` - Server 端开发
- `开始 Phase 3` - Client 端开发
- `全部开始` - 一键完成所有步骤
