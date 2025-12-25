# Payload Too Large Error - 已修复

## 问题原因
上传的 base64 编码图片超过了默认的请求体大小限制（100KB）。

## 已实施的解决方案

### ✅ 方案 1: 增加 Server 端请求体限制
**文件**: `server/src/main.ts`

增加了请求体大小限制到 50MB：
```typescript
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true, limit: '50mb' }));
```

### 📝 方案 2: 图片压缩功能（已禁用，保留代码）

**当前状态**: 默认**不压缩**图片，使用原图上传以确保 AI 识别准确性。

**文件**: `client/app/(tabs)/index.tsx`
```typescript
// Use original image without compression for best AI accuracy
await analyzeImage(imageUri);
```

**压缩功能已保留**: 如果后续发现文件太大或需要优化性能，可以轻松启用压缩：
```typescript
// Uncomment these lines to enable compression:
// const compressedUri = await compressImage(imageUri, 1536, 0.8);
// await analyzeImage(compressedUri);
```

**工具函数**: `client/src/utils/imageUtils.ts`
- ✅ `compressImage()` - 基础压缩
- ✅ `compressImageSmart()` - 智能压缩（自动调整质量）
- ✅ `estimateBase64Size()` - 估算文件大小

---

## 当前配置总结

### Server 端
- ✅ 请求体限制: **50MB**
- ✅ 支持大型原图上传
- ✅ CORS 已配置

### Client 端  
- ✅ 使用**原图**上传（不压缩）
- ✅ 保留压缩功能代码（可随时启用）
- ✅ ImagePicker quality: 0.5（初步优化）

---

## 如何启用图片压缩（可选）

如果遇到以下情况，可以考虑启用压缩：
1. 上传速度太慢
2. 文件仍然超过 50MB
3. 网络环境较差

### 启用步骤：

**编辑** `client/app/(tabs)/index.tsx`：

找到两处（拍照和选择图片）的代码：
```typescript
// Use original image without compression for best AI accuracy
// To enable compression, uncomment the line below:
// const compressedUri = await compressImage(imageUri, 1536, 0.8);
// await analyzeImage(compressedUri);

// Start analysis with original image
await analyzeImage(imageUri);
```

**修改为**：
```typescript
// Enable compression for faster upload
const compressedUri = await compressImage(imageUri, 1536, 0.8);
await analyzeImage(compressedUri);
```

**取消注释** import：
```typescript
import { compressImage } from '@/src/utils/imageUtils';
```

---

## 压缩参数说明（如果启用）

### 推荐配置
```typescript
compressImage(imageUri, 1536, 0.8)
```
- `1536`: 最大宽度 1536px（适合文字识别）
- `0.8`: 压缩质量 80%（高质量，适合 OCR）
- 格式: JPEG
- 预期大小: 约 500KB - 1MB

### 其他配置选项

**高精度（合同文档）**:
```typescript
compressImage(imageUri, 2048, 0.9)  // 更大、更清晰
```

**平衡模式**:
```typescript
compressImage(imageUri, 1280, 0.7)  // 中等大小和质量
```

**快速上传**:
```typescript
compressImage(imageUri, 1024, 0.6)  // 更小、更快
```

### 智能压缩（自动调整）
```typescript
import { compressImageSmart } from '@/src/utils/imageUtils';
const compressedUri = await compressImageSmart(imageUri, 800); // 目标 800KB
```

---

## 重启服务（必须）

### 重启 Server
```bash
cd server
# 停止当前运行的 server (Ctrl+C)
pnpm start:dev
```

Server 端的修改（增加 50MB 限制）需要重启才能生效！

### 重启 Client（可选）
```bash
cd client
# 停止当前运行的 expo (Ctrl+C)
pnpm start
```

---

## 验证修复

1. **启动 Server**:
   ```bash
   cd server
   pnpm start:dev
   ```

2. **启动 Client**:
   ```bash
   cd client
   pnpm start
   ```

3. **测试上传**:
   - 打开 App
   - 拍照或选择图片
   - 应该成功上传（即使是大图片）

---

## 常见问题

### Q: 为什么不默认压缩？
**A**: 为了确保 AI 识别的最高准确性。合同中的小字和细节非常重要，压缩可能导致识别错误。

### Q: 什么时候应该启用压缩？
**A**: 
- 网络速度慢（<1Mbps）
- 经常上传高分辨率照片（>4000px）
- 遇到上传超时问题

### Q: 压缩会影响 AI 识别吗？
**A**: 轻微压缩（quality >= 0.8, width >= 1536px）通常不会显著影响识别准确性。但为了保险，默认使用原图。

### Q: 50MB 够用吗？
**A**: 
- 手机照片（12MP）: 约 3-5MB ✅
- Base64 编码后: 约 4-7MB ✅
- 非常高分辨率照片: 可能超过 50MB ⚠️

如果需要支持更大的文件，可以在 `server/src/main.ts` 中增加限制：
```typescript
app.use(json({ limit: '100mb' }));
```

---

## 性能对比

### 不压缩（当前）
- 原始图片: 3-5MB
- Base64 后: 4-7MB
- 上传时间: 5-10秒（取决于网络）
- AI 准确性: ⭐⭐⭐⭐⭐

### 压缩（可选启用）
- 压缩后: 500KB-1MB
- Base64 后: 700KB-1.3MB
- 上传时间: 1-3秒
- AI 准确性: ⭐⭐⭐⭐ (轻微影响)

---

## 建议

1. **优先使用原图**（当前配置）- 确保最高准确性
2. **测试压缩效果** - 对比压缩前后的 AI 分析结果
3. **根据需求调整** - 如果准确性足够，可启用压缩提升性能
4. **监控文件大小** - 如果经常遇到超大文件，考虑启用智能压缩

