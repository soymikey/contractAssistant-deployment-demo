# Network Error 解决方案

## 问题原因
React Native 应用无法使用 `localhost` 或 `127.0.0.1` 访问电脑上的 Server，因为这些地址指向移动设备/模拟器自己。

## 解决步骤

### 方案 1: 修改 Client 的 .env 文件（推荐）

1. 找到你电脑的局域网 IP 地址（根据你的网络）：
   - Windows: 运行 `ipconfig` 找到 IPv4 地址（通常是 192.168.x.x）
   - 从输出中选择 `192.168.100.110`（这是你的局域网 IP）

2. 编辑 `client/.env` 文件：
   ```bash
   # 将 localhost 改为你的局域网 IP
   EXPO_PUBLIC_API_URL=http://192.168.100.110:3000/api
   ```

3. **重要**: 重启 Expo 开发服务器
   ```bash
   # 停止当前运行的 expo（按 Ctrl+C）
   # 然后重新启动
   cd client
   pnpm start
   ```

### 方案 2: 使用 Android 模拟器特殊地址

如果你使用的是 **Android Emulator**，可以使用特殊地址：
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```
`10.0.2.2` 是 Android Emulator 访问主机的特殊地址。

### 方案 3: 使用 iOS 模拟器

如果你使用的是 **iOS Simulator**，可以使用 `localhost`：
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```
iOS Simulator 可以直接访问 localhost。

### 方案 4: 使用真实设备

如果使用真实手机通过 Expo Go 测试：
1. 确保手机和电脑在**同一个 WiFi 网络**
2. 使用电脑的局域网 IP（如 192.168.100.110）
3. 确保防火墙允许端口 3000 的访问

---

## 验证配置

### 1. 检查 Server 是否运行
```bash
cd server
pnpm start:dev
```
应该看到：`🚀 Application is running on: http://localhost:3000/api`

### 2. 测试 API 连通性

**从电脑测试（验证 Server 正常）**:
```bash
curl http://localhost:3000/api/ai-analysis/health -X POST
```
应该返回: `{"status":"ok","message":"AI Analysis service is running"}`

**从手机/模拟器测试（验证网络连通）**:
在浏览器中打开: `http://192.168.100.110:3000/api/ai-analysis/health`

### 3. 重启 Expo 应用

修改 `.env` 后必须重启：
```bash
# 停止当前的 expo（Ctrl+C）
cd client
pnpm start
# 按 'r' 重新加载应用
```

---

## 常见问题

### Q: 还是显示 Network Error
**A**: 检查：
1. Server 是否在运行（`pnpm start:dev`）
2. IP 地址是否正确（不要用 localhost）
3. 是否重启了 Expo
4. 防火墙是否阻止了端口 3000

### Q: 如何找到我的 IP 地址？
**A**: 
- Windows: `ipconfig` 找 IPv4 地址
- Mac/Linux: `ifconfig` 或 `ip addr`
- 选择 192.168.x.x 或 10.x.x.x 格式的地址

### Q: Android Emulator 用哪个地址？
**A**: 使用 `10.0.2.2` 代替 localhost

### Q: iOS Simulator 用哪个地址？
**A**: 可以直接使用 `localhost`

### Q: 真实设备连不上
**A**: 确保：
- 手机和电脑在同一 WiFi
- 使用局域网 IP（192.168.x.x）
- 防火墙允许端口 3000

---

## 快速修复命令

```bash
# 1. 修改 client/.env 文件
# 将 EXPO_PUBLIC_API_URL 改为你的 IP

# 2. 重启 Expo
cd client
# Ctrl+C 停止
pnpm start

# 3. 在另一个终端确保 Server 运行
cd server
pnpm start:dev
```

---

## 推荐的 .env 配置

根据你的测试环境选择：

**开发环境（电脑 + Android Emulator）:**
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

**开发环境（电脑 + iOS Simulator）:**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**开发环境（电脑 + 真实设备）:**
```env
EXPO_PUBLIC_API_URL=http://192.168.100.110:3000/api
```

替换 `192.168.100.110` 为你自己的 IP 地址。
