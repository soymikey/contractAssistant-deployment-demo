# 合同助手 - 后端开发计划

## 项目概述

基于 Node.js + NestJS 和 PostgreSQL 的企业级 RESTful API 后端，包括用户认证、文件管理、OCR 集成、AI 分析、数据存储等功能。

**框架**: NestJS 10+ (基于 Node.js 18+)  
**数据库**: PostgreSQL 14+  
**ORM**: Prisma  
**认证**: JWT + Passport.js (NestJS 集成)  
**文件存储**: AWS S3 或本地存储  
**任务队列**: Bull (Redis) via @nestjs/bull  
**API 文档**: Swagger/OpenAPI (自动生成)  
**预期周期**: 8-9周 (相比 Express 提前 1-2周)

**框架选择理由**: 详见 express-vs-nestjs.md 分析报告

---

## 后端技术栈

### 核心框架
- **运行时**: Node.js 18+
- **框架**: NestJS 10+
- **NestJS 核心包**:
  - `@nestjs/common` - 核心装饰器和工具
  - `@nestjs/core` - 核心功能
  - `@nestjs/platform-express` - Express 适配器
  - `@nestjs/config` - 配置管理

### 数据层
- **ORM**: Prisma 5+
- **数据库**: PostgreSQL 14+
- **缓存**: Redis 7+
- **任务队列**: `@nestjs/bull` + Bull 4+

### 认证与安全
- **认证**: `@nestjs/jwt` + `@nestjs/passport`
- **Passport 策略**: passport-jwt, passport-local
- **密码加密**: bcryptjs
- **安全中间件**: helmet
- **速率限制**: `@nestjs/throttler`

### 文件处理
- **文件上传**: multer (via @nestjs/platform-express)
- **文件存储**: aws-sdk (S3) 或 fs (本地)
- **文件处理**: pdf-parse, tesseract.js, sharp

### API 与验证
- **API 文档**: `@nestjs/swagger` (自动生成)
- **验证**: class-validator, class-transformer
- **序列化**: 内置 Interceptors

### 其他服务
- **邮件服务**: `@nestjs/mailer` + nodemailer
- **日志**: 内置 Logger + winston (可选)
- **错误跟踪**: Sentry
- **HTTP 客户端**: `@nestjs/axios` + axios
- **测试**: Jest, supertest (NestJS 内置支持)
- **代码质量**: ESLint, Prettier (NestJS CLI 预配置)

---

## 第1-2周: 项目初始化与基础设施 (NestJS)

### 1.1 项目初始化 (快速脚手架)

```
TODO List - 项目初始化
- [ ] 1.1.1 使用 NestJS CLI 创建项目 (5分钟)
  - [ ] 安装 NestJS CLI: npm i -g @nestjs/cli
  - [ ] 创建项目: nest new contract-assistant-api
  - [ ] 选择包管理器: npm
  - [ ] 自动生成完整项目结构

- [ ] 1.1.2 验证项目结构 (自动生成)
  - [ ] src/ 目录结构已创建
  - [ ] src/app.module.ts - 根模块
  - [ ] src/app.controller.ts - 根控制器
  - [ ] src/app.service.ts - 根服务
  - [ ] src/main.ts - 应用入口
  - [ ] test/ - 测试目录
  - [ ] TypeScript 已配置
  - [ ] ESLint + Prettier 已配置

- [ ] 1.1.3 安装额外依赖
  - [ ] npm install @nestjs/config - 配置管理
  - [ ] npm install @nestjs/swagger - API 文档
  - [ ] npm install class-validator class-transformer - 验证
  - [ ] npm install helmet - 安全

- [ ] 1.1.4 配置环境变量
  - [ ] 创建 .env (开发环境)
  - [ ] 创建 .env.production (生产环境)
  - [ ] 创建 .env.test (测试环境)
  - [ ] 创建 .env.example (示例)
  - [ ] 在 app.module.ts 中集成 ConfigModule

- [ ] 1.1.5 Git 初始化
  - [ ] git init (如果未初始化)
  - [ ] 验证 .gitignore (NestJS 已生成)
  - [ ] 创建初始提交
```

### 1.2 NestJS 应用配置

```
TODO List - NestJS 核心配置
- [ ] 1.2.1 配置应用入口 (main.ts)
  - [ ] 配置全局前缀: app.setGlobalPrefix('api/v1')
  - [ ] 启用 CORS: app.enableCors()
  - [ ] 配置 helmet 安全头
  - [ ] 配置全局验证管道 (ValidationPipe)
  - [ ] 配置 Swagger 文档
  - [ ] 设置端口和启动日志

- [ ] 1.2.2 配置全局模块
  - [ ] 配置 ConfigModule (全局)
  - [ ] 配置日志模块
  - [ ] 配置异常过滤器
  - [ ] 配置拦截器

- [ ] 1.2.3 创建统一响应格式
  - [ ] 创建 src/common/interceptors/transform.interceptor.ts
  - [ ] 定义标准响应结构
    ```typescript
    {
      statusCode: number,
      message: string,
      data: any,
      timestamp: string
    }
    ```

- [ ] 1.2.4 创建统一错误处理
  - [ ] 创建 src/common/filters/http-exception.filter.ts
  - [ ] 创建自定义异常类
  - [ ] 处理验证错误
  - [ ] 处理数据库错误
  - [ ] 处理未知错误

- [ ] 1.2.5 配置健康检查
  - [ ] npm install @nestjs/terminus
  - [ ] 创建 HealthModule
  - [ ] 创建 /health 端点
  - [ ] 检查数据库连接
  - [ ] 检查 Redis 连接
```

### 1.3 数据库设置

```
TODO List - 数据库设置
- [ ] 1.3.1 安装和配置 Prisma
  - [ ] npm install @prisma/client
  - [ ] npm install --save-dev prisma
  - [ ] npx prisma init
  - [ ] 配置 .env DATABASE_URL

- [ ] 1.3.2 设计数据库表
  - [ ] 创建 schema.prisma
  - [ ] 定义 User 模型 (id, email, password, name, avatar, createdAt, updatedAt)
  - [ ] 定义 Contract 模型 (id, userId, fileName, fileUrl, fileType, status, createdAt, updatedAt)
  - [ ] 定义 ContractAnalysis 模型 (id, contractId, type, overviewData, riskData, suggestionsData, createdAt)
  - [ ] 定义 RiskItem 模型 (id, analysisId, title, description, level, suggestion)
  - [ ] 定义 Favorite 模型 (id, userId, contractId, createdAt)
  - [ ] 定义 AnalysisLog 模型 (id, userId, contractId, status, progress, error, startedAt, completedAt)
  - [ ] 定义 User Preferences 模型
  - [ ] 设置关系和约束

- [ ] 1.3.3 创建数据库迁移
  - [ ] npx prisma migrate dev --name init
  - [ ] 验证数据库表创建
  - [ ] 创建必要的索引

- [ ] 1.3.4 配置数据库连接池
  - [ ] 在 .env 中配置连接池参数
  - [ ] 配置超时时间
  - [ ] 配置最大连接数

- [ ] 1.3.5 配置数据库备份和恢复
  - [ ] 创建备份脚本
  - [ ] 创建恢复脚本
  - [ ] 配置定期备份
```

### 1.4 Redis 和任务队列设置

```
TODO List - Redis 和 Bull 队列
- [ ] 1.4.1 安装 NestJS Bull 依赖
  - [ ] npm install @nestjs/bull bull
  - [ ] npm install --save-dev @types/bull

- [ ] 1.4.2 配置 Bull 模块
  - [ ] 在 app.module.ts 中导入 BullModule
  - [ ] 配置 Redis 连接
    ```typescript
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    })
    ```

- [ ] 1.4.3 创建队列模块
  - [ ] nest g module queues
  - [ ] 创建分析队列配置
  - [ ] 创建上传处理队列配置
  - [ ] 配置重试策略
  - [ ] 配置并发处理

- [ ] 1.4.4 实现队列处理器
  - [ ] 使用 @Processor 装饰器创建处理器
  - [ ] 使用 @Process 装饰器处理任务
  - [ ] 实现任务监听 (completed, failed, progress)
  - [ ] 记录队列日志
```

### 1.5 API 文档配置 (Swagger 自动生成)

```
TODO List - Swagger 文档
- [ ] 1.5.1 配置 Swagger (已安装)
  - [ ] 在 main.ts 中配置 SwaggerModule
  - [ ] 设置文档标题、版本、描述
  - [ ] 设置 API 路径: /api-docs
  - [ ] 配置 JWT Bearer 认证

- [ ] 1.5.2 配置文档装饰器
  - [ ] 使用 @ApiTags 标记控制器
  - [ ] 使用 @ApiOperation 描述操作
  - [ ] 使用 @ApiResponse 定义响应
  - [ ] 使用 @ApiProperty 标记 DTO 属性
  - [ ] 使用 @ApiBearerAuth 标记需要认证的端点

- [ ] 1.5.3 验证文档
  - [ ] 启动应用
  - [ ] 访问 http://localhost:3000/api-docs
  - [ ] 验证 UI 可访问
```

---

## 第2-3周: 认证和用户模块 (NestJS 方式)

### 2.1 用户模块生成和配置

```
TODO List - 用户模块
- [ ] 2.1.1 使用 CLI 生成模块
  - [ ] nest g module user - 生成用户模块
  - [ ] nest g controller user - 生成用户控制器
  - [ ] nest g service user - 生成用户服务
  - [ ] 验证模块自动注册到 app.module.ts

- [ ] 2.1.2 创建 DTO (Data Transfer Objects)
  - [ ] 创建 src/user/dto/create-user.dto.ts
    ```typescript
    import { IsEmail, IsString, MinLength } from 'class-validator';
    import { ApiProperty } from '@nestjs/swagger';
    
    export class CreateUserDto {
      @ApiProperty()
      @IsEmail()
      email: string;
      
      @ApiProperty()
      @IsString()
      @MinLength(8)
      password: string;
      
      @ApiProperty()
      @IsString()
      name: string;
    }
    ```
  - [ ] 创建 LoginDto
  - [ ] 创建 UpdateUserDto
  - [ ] 创建 ChangePasswordDto

- [ ] 2.1.3 创建实体和接口
  - [ ] 创建 src/user/entities/user.entity.ts
  - [ ] 定义用户接口
  - [ ] 排除敏感字段 (password) 的序列化
```

### 2.2 认证模块实现

```
TODO List - 认证模块
- [ ] 2.2.1 安装认证依赖
  - [ ] npm install @nestjs/passport passport
  - [ ] npm install @nestjs/jwt passport-jwt
  - [ ] npm install passport-local
  - [ ] npm install bcryptjs
  - [ ] npm install --save-dev @types/passport-jwt @types/passport-local @types/bcryptjs

- [ ] 2.2.2 生成认证模块
  - [ ] nest g module auth
  - [ ] nest g service auth
  - [ ] nest g controller auth

- [ ] 2.2.3 配置 JWT 模块
  - [ ] 在 auth.module.ts 中导入 JwtModule
    ```typescript
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    })
    ```
  - [ ] 在 auth.module.ts 中导入 PassportModule

- [ ] 2.2.4 实现认证策略
  - [ ] 创建 src/auth/strategies/local.strategy.ts
    ```typescript
    @Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy) {
      constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
      }
      
      async validate(email: string, password: string) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      }
    }
    ```
  
  - [ ] 创建 src/auth/strategies/jwt.strategy.ts
    ```typescript
    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
      constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET,
        });
      }
      
      async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
      }
    }
    ```

- [ ] 2.2.5 创建守卫 (Guards)
  - [ ] 创建 src/auth/guards/local-auth.guard.ts
  - [ ] 创建 src/auth/guards/jwt-auth.guard.ts
  - [ ] 创建可选认证守卫 (optional-auth.guard.ts)

- [ ] 2.2.6 实现认证服务
  - [ ] 在 AuthService 中实现:
    - [ ] validateUser(email, password) - 验证用户凭证
    - [ ] login(user) - 生成 JWT token
    - [ ] register(createUserDto) - 注册新用户
    - [ ] refreshToken(user) - 刷新 token
```

### 2.3 认证控制器和路由

```
TODO List - 认证 API
- [ ] 2.3.1 实现 AuthController
  - [ ] 文件: src/auth/auth.controller.ts
    ```typescript
    @Controller('auth')
    @ApiTags('Authentication')
    export class AuthController {
      constructor(private authService: AuthService) {}
      
      @Post('register')
      @ApiOperation({ summary: '用户注册' })
      async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
      }
      
      @UseGuards(LocalAuthGuard)
      @Post('login')
      @ApiOperation({ summary: '用户登录' })
      async login(@Request() req) {
        return this.authService.login(req.user);
      }
      
      @UseGuards(JwtAuthGuard)
      @Post('logout')
      @ApiOperation({ summary: '用户登出' })
      async logout(@Request() req) {
        // 实现登出逻辑
      }
      
      @UseGuards(JwtAuthGuard)
      @Get('me')
      @ApiOperation({ summary: '获取当前用户信息' })
      async getProfile(@Request() req) {
        return req.user;
      }
      
      @UseGuards(JwtAuthGuard)
      @Post('refresh')
      @ApiOperation({ summary: '刷新 token' })
      async refresh(@Request() req) {
        return this.authService.refreshToken(req.user);
      }
    }
    ```

- [ ] 2.3.2 实现用户管理控制器
  - [ ] 文件: src/user/user.controller.ts
    ```typescript
    @Controller('users')
    @ApiTags('Users')
    @UseGuards(JwtAuthGuard)
    export class UserController {
      constructor(private userService: UserService) {}
      
      @Put(':id')
      @ApiOperation({ summary: '更新用户信息' })
      async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req
      ) {
        return this.userService.update(id, updateUserDto, req.user);
      }
      
      @Post(':id/change-password')
      @ApiOperation({ summary: '修改密码' })
      async changePassword(
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
        @Request() req
      ) {
        return this.userService.changePassword(id, changePasswordDto, req.user);
      }
    }
    ```

- [ ] 2.3.3 实现数据验证
  - [ ] class-validator 自动验证 DTO
  - [ ] 在 main.ts 中配置全局 ValidationPipe
  - [ ] 自定义验证装饰器 (如需要)

- [ ] 2.3.4 编写认证模块测试
  - [ ] 注册成功测试
  - [ ] 登录成功测试
  - [ ] 登录失败测试 (错误密码)
  - [ ] JWT 守卫测试
  - [ ] token 刷新测试
  - [ ] 获取用户信息测试
```

### 2.4 密码重置功能

```
TODO List - 密码重置
- [ ] 2.4.1 在 AuthService 中实现密码重置
  - [ ] forgotPassword(email) - 生成重置令牌
  - [ ] resetPassword(token, newPassword) - 重置密码
  - [ ] 集成邮件服务发送重置链接

- [ ] 2.4.2 在 AuthController 中添加路由
  - [ ] POST /auth/forgot-password - 请求重置
  - [ ] POST /auth/reset-password - 执行重置

- [ ] 2.4.3 编写测试
  - [ ] 密码重置流程测试
  - [ ] 无效令牌测试
```

---

## 第3-4周: 文件处理模块 (NestJS 集成)

### 3.1 文件上传服务

```
TODO List - 文件上传模块
- [ ] 3.1.1 生成上传模块
  - [ ] nest g module upload
  - [ ] nest g controller upload
  - [ ] nest g service upload

- [ ] 3.1.2 配置文件存储
  - [ ] 选择存储方案 (AWS S3 或本地存储)
  - [ ] 如果使用 S3:
    - [ ] npm install aws-sdk
    - [ ] 配置 AWS 凭证 (.env)
    - [ ] 创建 S3Service
  - [ ] 如果使用本地存储:
    - [ ] 创建 uploads/ 目录
    - [ ] 配置静态文件服务

- [ ] 3.1.3 配置 Multer (通过 @nestjs/platform-express)
  - [ ] 创建 src/upload/multer.config.ts
  - [ ] 配置文件大小限制 (50MB)
  - [ ] 配置允许的文件类型 (jpg, png, pdf, docx)
  - [ ] 创建文件过滤器
    ```typescript
    export const fileFilter = (req, file, callback) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Invalid file type'), false);
      }
    };
    ```

- [ ] 3.1.4 实现上传控制器
  - [ ] 文件: src/upload/upload.controller.ts
    ```typescript
    @Controller('upload')
    @ApiTags('Upload')
    @UseGuards(JwtAuthGuard)
    export class UploadController {
      constructor(private uploadService: UploadService) {}
      
      @Post()
      @ApiOperation({ summary: '上传文件' })
      @UseInterceptors(FileInterceptor('file', multerConfig))
      async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Request() req
      ) {
        return this.uploadService.uploadFile(file, req.user);
      }
      
      @Post('multiple')
      @ApiOperation({ summary: '上传多个文件' })
      @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
      async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Request() req
      ) {
        return this.uploadService.uploadMultipleFiles(files, req.user);
      }
      
      @Delete(':id')
      @ApiOperation({ summary: '删除文件' })
      async deleteFile(@Param('id') id: string, @Request() req) {
        return this.uploadService.deleteFile(id, req.user);
      }
      
      @Get(':id')
      @ApiOperation({ summary: '获取文件信息' })
      async getFile(@Param('id') id: string, @Request() req) {
        return this.uploadService.getFile(id, req.user);
      }
    }
    ```

- [ ] 3.1.5 实现存储服务
  - [ ] 文件: src/upload/storage.service.ts
  - [ ] uploadToS3(file) - S3 上传
  - [ ] uploadToLocal(file) - 本地上传
  - [ ] deleteFile(fileUrl) - 删除文件
  - [ ] getSignedUrl(fileKey) - 获取签名 URL

- [ ] 3.1.6 编写上传测试
  - [ ] 单个文件上传测试
  - [ ] 多个文件上传测试
  - [ ] 文件大小限制测试
  - [ ] 文件类型限制测试
  - [ ] 未授权上传测试
```

### 3.2 OCR 集成

```
TODO List - OCR 服务
- [ ] 3.2.1 生成 OCR 模块
  - [ ] nest g module ocr
  - [ ] nest g service ocr

- [ ] 3.2.2 选择并配置 OCR 方案
  - [ ] 评测 Tesseract, PaddleOCR, Google Vision
  - [ ] 如果使用 Tesseract:
    - [ ] npm install tesseract.js
  - [ ] 如果使用 Google Vision:
    - [ ] npm install @google-cloud/vision
    - [ ] 配置 Google Cloud 凭证

- [ ] 3.2.3 实现 OCR 服务
  - [ ] 文件: src/ocr/ocr.service.ts
    ```typescript
    @Injectable()
    export class OcrService {
      async recognizeImage(file: Express.Multer.File): Promise<string> {
        // 图片 OCR 识别
      }
      
      async recognizePdf(file: Express.Multer.File): Promise<string> {
        // PDF OCR 识别
      }
      
      async structureText(text: string): Promise<any> {
        // 文本结构化
      }
    }
    ```

- [ ] 3.2.4 集成队列处理 OCR
  - [ ] 创建 OCR 队列处理器
    ```typescript
    @Processor('ocr-queue')
    export class OcrProcessor {
      @Process('recognize')
      async handleRecognition(job: Job) {
        // 异步 OCR 处理
      }
    }
    ```
  - [ ] 实现进度跟踪
  - [ ] 实现结果缓存

- [ ] 3.2.5 添加 OCR 端点
  - [ ] 在 UploadController 或单独的 OcrController 中
  - [ ] POST /api/v1/ocr - 提交 OCR 任务
  - [ ] GET /api/v1/ocr/:id/status - 获取 OCR 状态
  - [ ] GET /api/v1/ocr/:id/result - 获取 OCR 结果

- [ ] 3.2.6 编写 OCR 测试
  - [ ] 图片识别测试
  - [ ] PDF 识别测试
  - [ ] 中文识别测试
  - [ ] 异步处理测试
```

### 3.3 文档处理

```
TODO List - 文档处理
- [ ] 3.3.1 生成文档处理模块
  - [ ] nest g module document
  - [ ] nest g service document

- [ ] 3.3.2 安装文档处理依赖
  - [ ] npm install pdf-parse pdfjs-dist
  - [ ] npm install docx (用于 docx 处理)

- [ ] 3.3.3 实现 PDF 处理服务
  - [ ] 创建 PdfService
  - [ ] extractText(file) - 提取文本
  - [ ] extractMetadata(file) - 提取元数据
  - [ ] convertToImages(file) - 转换为图片

- [ ] 3.3.4 实现 Word 处理服务
  - [ ] 创建 DocxService
  - [ ] extractText(file) - 提取文本
  - [ ] extractMetadata(file) - 提取元数据

- [ ] 3.3.5 实现通用文档服务
  - [ ] 在 DocumentService 中:
    ```typescript
    @Injectable()
    export class DocumentService {
      constructor(
        private pdfService: PdfService,
        private docxService: DocxService,
      ) {}
      
      async processDocument(file: Express.Multer.File) {
        const fileType = this.detectFileType(file);
        switch (fileType) {
          case 'pdf':
            return this.pdfService.extractText(file);
          case 'docx':
            return this.docxService.extractText(file);
          default:
            throw new BadRequestException('Unsupported file type');
        }
      }
    }
    ```

- [ ] 3.3.6 编写文档处理测试
  - [ ] PDF 处理测试
  - [ ] Word 处理测试
  - [ ] 文件类型检测测试
```

---

## 第4-5周: 合同管理和 AI 分析 (NestJS 模块化)

### 4.1 合同管理模块

```
TODO List - 合同管理
- [ ] 4.1.1 生成合同模块
  - [ ] nest g module contract
  - [ ] nest g controller contract
  - [ ] nest g service contract

- [ ] 4.1.2 创建合同 DTO
  - [ ] CreateContractDto
  - [ ] UpdateContractDto
  - [ ] ContractFilterDto (查询过滤)
  - [ ] ContractResponseDto
  - [ ] 使用 class-validator 添加验证

- [ ] 4.1.3 实现合同控制器
  - [ ] 文件: src/contract/contract.controller.ts
    ```typescript
    @Controller('contracts')
    @ApiTags('Contracts')
    @UseGuards(JwtAuthGuard)
    export class ContractController {
      constructor(private contractService: ContractService) {}
      
      @Post()
      @ApiOperation({ summary: '创建合同' })
      async create(
        @Body() createContractDto: CreateContractDto,
        @Request() req
      ) {
        return this.contractService.create(createContractDto, req.user.userId);
      }
      
      @Get()
      @ApiOperation({ summary: '获取合同列表' })
      async findAll(
        @Query() filterDto: ContractFilterDto,
        @Request() req
      ) {
        return this.contractService.findAll(filterDto, req.user.userId);
      }
      
      @Get(':id')
      @ApiOperation({ summary: '获取合同详情' })
      async findOne(@Param('id') id: string, @Request() req) {
        return this.contractService.findOne(id, req.user.userId);
      }
      
      @Put(':id')
      @ApiOperation({ summary: '更新合同' })
      async update(
        @Param('id') id: string,
        @Body() updateContractDto: UpdateContractDto,
        @Request() req
      ) {
        return this.contractService.update(id, updateContractDto, req.user.userId);
      }
      
      @Delete(':id')
      @ApiOperation({ summary: '删除合同' })
      async remove(@Param('id') id: string, @Request() req) {
        return this.contractService.remove(id, req.user.userId);
      }
    }
    ```

- [ ] 4.1.4 实现合同服务
  - [ ] 在 ContractService 中实现业务逻辑
  - [ ] 集成 Prisma 进行数据库操作
  - [ ] 实现分页、排序、筛选
  - [ ] 实现权限检查

- [ ] 4.1.5 编写合同 API 测试
  - [ ] 创建合同测试
  - [ ] 查询合同列表测试
  - [ ] 更新合同测试
  - [ ] 删除合同测试
  - [ ] 权限测试
```

### 4.2 AI 分析集成

```
TODO List - AI 分析模块
- [ ] 4.2.1 生成 AI 分析模块
  - [ ] nest g module analysis
  - [ ] nest g controller analysis
  - [ ] nest g service analysis
  - [ ] nest g service ai

- [ ] 4.2.2 选择并配置 AI 服务
  - [ ] 如果使用 OpenAI:
    - [ ] npm install openai
    - [ ] 配置 API key (.env)
    - [ ] 使用 ConfigModule 管理配置

- [ ] 4.2.3 实现 AI 服务
  - [ ] 文件: src/analysis/ai.service.ts
    ```typescript
    @Injectable()
    export class AiService {
      private openai: OpenAI;
      
      constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
          apiKey: this.configService.get('OPENAI_API_KEY'),
        });
      }
      
      async generateOverview(contractText: string): Promise<any> {
        // 生成合同概览
      }
      
      async identifyRisks(contractText: string): Promise<any> {
        // 识别风险
      }
      
      async generateSuggestions(contractText: string): Promise<any> {
        // 生成建议
      }
    }
    ```

- [ ] 4.2.4 实现分析服务
  - [ ] 文件: src/analysis/analysis.service.ts
    ```typescript
    @Injectable()
    export class AnalysisService {
      constructor(
        private aiService: AiService,
        private prisma: PrismaService,
        @InjectQueue('analysis-queue') private analysisQueue: Queue,
      ) {}
      
      async submitAnalysis(contractId: string, userId: string) {
        // 提交到队列
        const job = await this.analysisQueue.add('analyze', {
          contractId,
          userId,
        });
        return { jobId: job.id, status: 'pending' };
      }
      
      async getAnalysisResult(analysisId: string, userId: string) {
        // 获取分析结果
      }
    }
    ```

- [ ] 4.2.5 实现分析队列处理器
  - [ ] 创建 src/analysis/analysis.processor.ts
    ```typescript
    @Processor('analysis-queue')
    export class AnalysisProcessor {
      constructor(
        private aiService: AiService,
        private prisma: PrismaService,
      ) {}
      
      @Process('analyze')
      async handleAnalysis(job: Job) {
        const { contractId, userId } = job.data;
        
        // 1. 获取合同文本
        // 2. 调用 AI 分析
        // 3. 存储结果
        // 4. 更新进度
        
        await job.progress(100);
      }
    }
    ```

- [ ] 4.2.6 实现成本控制
  - [ ] 使用 @nestjs/throttler 限制请求频率
  - [ ] 实现 Token 计算
  - [ ] 实现结果缓存
  - [ ] 实现批量分析

- [ ] 4.2.7 编写 AI 分析测试
  - [ ] 提交分析测试
  - [ ] 队列处理测试
  - [ ] AI 调用测试 (mock)
  - [ ] 错误处理测试
```

### 4.3 分析数据结构

```
TODO List - 分析数据
- [ ] 4.3.1 定义分析结果数据模型
  - [ ] 合同概览数据结构
    - [ ] 合同类型
    - [ ] 当事人信息
    - [ ] 合同日期和期限
    - [ ] 金额
    - [ ] 页数
  
  - [ ] 风险数据结构
    - [ ] 风险 ID
    - [ ] 风险标题
    - [ ] 风险描述
    - [ ] 风险等级 (高/中/低)
    - [ ] 相关法律条款
    - [ ] 改进建议
  
  - [ ] 建议数据结构
    - [ ] 建议内容
    - [ ] 关键条款建议
    - [ ] 风险防范建议

- [ ] 4.3.2 在数据库中存储分析结果
  - [ ] 存储在 ContractAnalysis 表
  - [ ] 存储在 RiskItem 表
  - [ ] 建立关系
```

### 4.4 分析结果 API

```
TODO List - 分析结果 API
- [ ] 4.4.1 实现分析控制器
  - [ ] 文件: src/analysis/analysis.controller.ts
    ```typescript
    @Controller('analyses')
    @ApiTags('Analysis')
    @UseGuards(JwtAuthGuard)
    export class AnalysisController {
      constructor(private analysisService: AnalysisService) {}
      
      @Post()
      @ApiOperation({ summary: '提交合同分析' })
      async submit(
        @Body() submitDto: SubmitAnalysisDto,
        @Request() req
      ) {
        return this.analysisService.submitAnalysis(
          submitDto.contractId,
          req.user.userId
        );
      }
      
      @Get(':id')
      @ApiOperation({ summary: '获取分析结果' })
      async getResult(@Param('id') id: string, @Request() req) {
        return this.analysisService.getAnalysisResult(id, req.user.userId);
      }
      
      @Get(':id/status')
      @ApiOperation({ summary: '获取分析状态' })
      async getStatus(@Param('id') id: string, @Request() req) {
        return this.analysisService.getAnalysisStatus(id, req.user.userId);
      }
      
      @Get(':id/risks')
      @ApiOperation({ summary: '获取风险列表' })
      async getRisks(@Param('id') id: string, @Request() req) {
        return this.analysisService.getRisks(id, req.user.userId);
      }
    }
    ```

- [ ] 4.4.2 实现进度跟踪
  - [ ] 在数据库中记录分析状态
  - [ ] 使用 WebSocket 或 SSE 实时推送进度 (可选)
  - [ ] 记录分析日志

- [ ] 4.4.3 编写分析 API 测试
  - [ ] 提交分析测试
  - [ ] 获取状态测试
  - [ ] 获取结果测试
  - [ ] 获取风险测试
```

---

## 第5-6周: 收藏和用户偏好管理 (NestJS 快速开发)

### 5.1 收藏功能

```
TODO List - 收藏功能
- [ ] 5.1.1 生成收藏模块
  - [ ] nest g module favorite
  - [ ] nest g controller favorite
  - [ ] nest g service favorite

- [ ] 5.1.2 创建收藏 DTO
  - [ ] CreateFavoriteDto
  - [ ] FavoriteResponseDto

- [ ] 5.1.3 实现收藏控制器
  - [ ] 文件: src/favorite/favorite.controller.ts
    ```typescript
    @Controller('favorites')
    @ApiTags('Favorites')
    @UseGuards(JwtAuthGuard)
    export class FavoriteController {
      constructor(private favoriteService: FavoriteService) {}
      
      @Post()
      @ApiOperation({ summary: '添加收藏' })
      async create(@Body() createDto: CreateFavoriteDto, @Request() req) {
        return this.favoriteService.create(createDto, req.user.userId);
      }
      
      @Delete(':contractId')
      @ApiOperation({ summary: '移除收藏' })
      async remove(@Param('contractId') contractId: string, @Request() req) {
        return this.favoriteService.remove(contractId, req.user.userId);
      }
      
      @Get()
      @ApiOperation({ summary: '获取收藏列表' })
      async findAll(@Request() req) {
        return this.favoriteService.findAll(req.user.userId);
      }
      
      @Get(':contractId')
      @ApiOperation({ summary: '检查是否收藏' })
      async check(@Param('contractId') contractId: string, @Request() req) {
        return this.favoriteService.isFavorited(contractId, req.user.userId);
      }
    }
    ```

- [ ] 5.1.4 实现收藏服务
  - [ ] 在 FavoriteService 中实现业务逻辑
  - [ ] 集成 Prisma 操作

- [ ] 5.1.5 编写收藏功能测试
  - [ ] 添加收藏测试
  - [ ] 移除收藏测试
  - [ ] 获取收藏列表测试
  - [ ] 重复收藏测试
```

### 5.2 用户偏好管理

```
TODO List - 用户偏好
- [ ] 5.2.1 生成偏好模块
  - [ ] nest g module preferences
  - [ ] nest g controller preferences
  - [ ] nest g service preferences

- [ ] 5.2.2 创建偏好 DTO
  - [ ] UpdatePreferencesDto
  - [ ] PreferencesResponseDto

- [ ] 5.2.3 实现偏好控制器
  - [ ] 文件: src/preferences/preferences.controller.ts
    ```typescript
    @Controller('preferences')
    @ApiTags('Preferences')
    @UseGuards(JwtAuthGuard)
    export class PreferencesController {
      constructor(private preferencesService: PreferencesService) {}
      
      @Get()
      @ApiOperation({ summary: '获取用户偏好' })
      async get(@Request() req) {
        return this.preferencesService.get(req.user.userId);
      }
      
      @Put()
      @ApiOperation({ summary: '更新用户偏好' })
      async update(
        @Body() updateDto: UpdatePreferencesDto,
        @Request() req
      ) {
        return this.preferencesService.update(req.user.userId, updateDto);
      }
    }
    ```

- [ ] 5.2.4 编写偏好管理测试
  - [ ] 获取偏好测试
  - [ ] 更新偏好测试
  - [ ] 默认偏好测试
```

---

## 第6周: 通知和报告功能 (NestJS 集成包)

### 6.1 邮件通知

```
TODO List - 邮件通知
- [ ] 6.1.1 安装 NestJS 邮件模块
  - [ ] npm install @nestjs/mailer nodemailer
  - [ ] npm install --save-dev @types/nodemailer

- [ ] 6.1.2 配置邮件模块
  - [ ] 在 app.module.ts 中配置 MailerModule
    ```typescript
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Contract Assistant" <noreply@example.com>',
      },
    })
    ```

- [ ] 6.1.3 生成邮件模块
  - [ ] nest g module mail
  - [ ] nest g service mail

- [ ] 6.1.4 创建邮件服务
  - [ ] 文件: src/mail/mail.service.ts
    ```typescript
    @Injectable()
    export class MailService {
      constructor(private mailerService: MailerService) {}
      
      async sendVerificationEmail(to: string, code: string) {
        await this.mailerService.sendMail({
          to,
          subject: '验证您的邮箱',
          template: 'verification',
          context: { code },
        });
      }
      
      async sendPasswordResetEmail(to: string, resetLink: string) {
        // 发送重置密码邮件
      }
      
      async sendAnalysisCompleteEmail(to: string, contractName: string) {
        // 发送分析完成通知
      }
    }
    ```

- [ ] 6.1.5 创建邮件模板
  - [ ] 创建 templates/ 目录
  - [ ] 验证码邮件模板 (verification.hbs)
  - [ ] 密码重置邮件模板 (password-reset.hbs)
  - [ ] 分析完成邮件模板 (analysis-complete.hbs)

- [ ] 6.1.6 集成到业务流程
  - [ ] 在注册时发送验证邮件
  - [ ] 在分析完成时发送通知
  - [ ] 在队列处理器中调用邮件服务

- [ ] 6.1.7 编写邮件发送测试
  - [ ] 邮件发送测试 (mock SMTP)
  - [ ] 模板渲染测试
```

### 6.2 推送通知 (可选)

```
TODO List - 推送通知
- [ ] 6.2.1 配置推送服务
  - [ ] 选择推送服务 (Firebase Cloud Messaging)
  - [ ] npm install firebase-admin
  - [ ] 配置 Firebase 凭证
  - [ ] 创建 src/config/firebase.ts

- [ ] 6.2.2 创建推送 Service
  - [ ] 文件: src/services/notificationService.ts
  - [ ] 发送推送通知方法
  - [ ] 管理用户设备令牌

- [ ] 6.2.3 实现通知场景
  - [ ] 分析完成时推送通知
  - [ ] 新功能推送
```

### 6.3 报告导出

```
TODO List - 报告导出
- [ ] 6.3.1 生成报告模块
  - [ ] nest g module report
  - [ ] nest g service report
  - [ ] nest g controller report

- [ ] 6.3.2 安装报告生成依赖
  - [ ] npm install pdfkit (PDF)
  - [ ] npm install exceljs (Excel)
  - [ ] npm install docx (Word)

- [ ] 6.3.3 实现报告生成服务
  - [ ] 文件: src/report/report.service.ts
    ```typescript
    @Injectable()
    export class ReportService {
      async generatePdf(analysisId: string, userId: string): Promise<Buffer> {
        // 生成 PDF 报告
      }
      
      async generateExcel(analysisId: string, userId: string): Promise<Buffer> {
        // 生成 Excel 报告
      }
      
      async generateWord(analysisId: string, userId: string): Promise<Buffer> {
        // 生成 Word 报告
      }
    }
    ```

- [ ] 6.3.4 实现导出控制器
  - [ ] 文件: src/report/report.controller.ts
    ```typescript
    @Controller('analyses/:id/export')
    @ApiTags('Report')
    @UseGuards(JwtAuthGuard)
    export class ReportController {
      constructor(private reportService: ReportService) {}
      
      @Get('pdf')
      @ApiOperation({ summary: '导出 PDF 报告' })
      async exportPdf(@Param('id') id: string, @Request() req, @Res() res) {
        const buffer = await this.reportService.generatePdf(id, req.user.userId);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="analysis-${id}.pdf"`,
        });
        res.send(buffer);
      }
      
      @Get('excel')
      @ApiOperation({ summary: '导出 Excel 报告' })
      async exportExcel(@Param('id') id: string, @Request() req, @Res() res) {
        // 类似 PDF
      }
    }
    ```

- [ ] 6.3.5 编写导出功能测试
  - [ ] PDF 导出测试
  - [ ] Excel 导出测试
  - [ ] 权限测试
```

---

## 第7周: 安全和性能优化 (NestJS 内置功能)

### 7.1 安全加固

```
TODO List - 安全加固
- [ ] 7.1.1 实现速率限制
  - [ ] npm install @nestjs/throttler
  - [ ] 在 app.module.ts 中配置 ThrottlerModule
    ```typescript
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    })
    ```
  - [ ] 使用 @Throttle() 装饰器保护端点
  - [ ] 为认证端点设置更严格的限制

- [ ] 7.1.2 实现请求验证
  - [ ] 全局 ValidationPipe 已配置
  - [ ] 使用 class-validator 验证所有 DTO
  - [ ] 使用 class-transformer 转换数据
  - [ ] Prisma 防止 SQL 注入
  - [ ] 输入清理防止 XSS

- [ ] 7.1.3 配置 CORS 安全
  - [ ] 在 main.ts 中配置 CORS
    ```typescript
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS.split(','),
      credentials: true,
    });
    ```

- [ ] 7.1.4 配置安全头
  - [ ] helmet 已配置
  - [ ] 设置 CSP 头
  - [ ] 设置 HSTS 头
  - [ ] 禁用不需要的头

- [ ] 7.1.5 敏感数据保护
  - [ ] 密码使用 bcryptjs 加密
  - [ ] 使用 @Exclude() 排除序列化敏感字段
  - [ ] API key 不在日志中显示
  - [ ] 环境变量管理敏感配置

- [ ] 7.1.6 实现 API 密钥管理
  - [ ] 创建 API key 生成服务
  - [ ] 创建 API key 守卫
  - [ ] 实现 API key 验证
  - [ ] 实现 API key 轮换

- [ ] 7.1.7 编写安全测试
  - [ ] SQL 注入测试 (Prisma 天然防护)
  - [ ] XSS 测试
  - [ ] 速率限制测试
  - [ ] 未授权访问测试
```

### 7.2 性能优化

```
TODO List - 性能优化
- [ ] 7.2.1 数据库优化
  - [ ] 创建适当的索引
  - [ ] 分析慢查询
  - [ ] 优化查询语句
  - [ ] 使用连接池

- [ ] 7.2.2 缓存优化
  - [ ] 实现 Redis 缓存
  - [ ] 缓存合同数据
  - [ ] 缓存分析结果
  - [ ] 设置合理的过期时间

- [ ] 7.2.3 API 优化
  - [ ] 实现 API 响应压缩
  - [ ] 分页查询优化
  - [ ] 字段选择优化
  - [ ] 批量操作优化

- [ ] 7.2.4 异步处理优化
  - [ ] 使用队列处理长时间操作
  - [ ] 实现异步文件处理
  - [ ] 实现异步 AI 调用
  - [ ] 设置合理的超时

- [ ] 7.2.5 性能测试
  - [ ] 压力测试
  - [ ] 负载测试
  - [ ] 并发测试
  - [ ] 生成性能报告
```

### 7.3 日志和监控

```
TODO List - 日志监控
- [ ] 7.3.1 使用 NestJS 内置日志系统
  - [ ] 在服务中注入 Logger
    ```typescript
    @Injectable()
    export class MyService {
      private readonly logger = new Logger(MyService.name);
      
      someMethod() {
        this.logger.log('Info message');
        this.logger.error('Error message', trace);
        this.logger.warn('Warning message');
      }
    }
    ```
  - [ ] 配置日志级别
  - [ ] 配置日志格式
  - [ ] 可选: 集成 winston 进行高级日志管理

- [ ] 7.3.2 实现错误跟踪
  - [ ] npm install @sentry/node
  - [ ] 创建 Sentry 过滤器
    ```typescript
    @Catch()
    export class SentryFilter implements ExceptionFilter {
      catch(exception: unknown, host: ArgumentsHost) {
        Sentry.captureException(exception);
        // 处理异常
      }
    }
    ```
  - [ ] 在 main.ts 中配置 Sentry
  - [ ] 捕获未处理的异常

- [ ] 7.3.3 实现应用监控
  - [ ] 使用 @nestjs/terminus 进行健康检查
  - [ ] 监控数据库连接状态
  - [ ] 监控 Redis 连接状态
  - [ ] 监控队列状态
  - [ ] 可选: 集成 Prometheus + Grafana

- [ ] 7.3.4 实现告警机制
  - [ ] 配置错误告警 (Sentry)
  - [ ] 配置性能告警
  - [ ] 配置资源告警
  - [ ] 邮件通知集成
```

---

## 第8-9周: 测试和部署 (NestJS 测试支持)

### 8.1 单元测试

```
TODO List - 单元测试
- [ ] 8.1.1 Jest 配置 (NestJS 已预配置)
  - [ ] 验证 jest.config.js 配置
  - [ ] 验证 TypeScript 支持
  - [ ] 配置测试覆盖率

- [ ] 8.1.2 编写 Service 测试
  - [ ] UserService 测试
  - [ ] ContractService 测试
  - [ ] AnalysisService 测试
  - [ ] AiService 测试 (mock)
  - [ ] 使用 NestJS Testing 模块
    ```typescript
    describe('UserService', () => {
      let service: UserService;
      
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UserService,
            { provide: PrismaService, useValue: mockPrismaService },
          ],
        }).compile();
        
        service = module.get<UserService>(UserService);
      });
      
      it('should be defined', () => {
        expect(service).toBeDefined();
      });
    });
    ```
  - [ ] 目标覆盖率: 85%+

- [ ] 8.1.3 编写 Controller 测试
  - [ ] UserController 测试
  - [ ] ContractController 测试
  - [ ] AnalysisController 测试
  - [ ] Mock 服务依赖
  - [ ] 目标覆盖率: 75%+

- [ ] 8.1.4 编写工具函数测试
  - [ ] 验证函数测试
  - [ ] 格式化函数测试
  - [ ] 加密函数测试
  - [ ] 目标覆盖率: 90%+

- [ ] 8.1.5 运行测试并生成覆盖率
  - [ ] npm test 运行所有测试
  - [ ] npm run test:cov 生成覆盖率报告
  - [ ] 确保覆盖率达标
```

### 8.2 集成测试 (E2E)

```
TODO List - E2E 测试
- [ ] 8.2.1 使用 NestJS E2E 测试框架
  - [ ] 验证 test/ 目录下的 app.e2e-spec.ts
  - [ ] 配置测试数据库

- [ ] 8.2.2 编写 API 集成测试
  - [ ] 认证流程测试
    ```typescript
    describe('AuthController (e2e)', () => {
      let app: INestApplication;
      
      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
        
        app = moduleFixture.createNestApplication();
        await app.init();
      });
      
      it('/auth/register (POST)', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({ email: 'test@example.com', password: 'password123' })
          .expect(201);
      });
    });
    ```
  - [ ] 合同管理测试
  - [ ] 分析流程测试
  - [ ] 收藏功能测试

- [ ] 8.2.3 编写完整流程测试
  - [ ] 用户注册 → 登录 → 上传 → 分析 → 查看结果
  - [ ] 收藏和取消收藏流程
  - [ ] 导出报告流程

- [ ] 8.2.4 编写错误场景测试
  - [ ] 未授权访问
  - [ ] 无效输入
  - [ ] 资源不存在
  - [ ] 权限拒绝
```

### 8.3 数据库测试

```
TODO List - 数据库测试
- [ ] 8.3.1 配置测试数据库
  - [ ] 创建测试数据库
  - [ ] 配置数据库 URL (.env.test)
  - [ ] 实现数据库重置

- [ ] 8.3.2 编写数据库测试
  - [ ] 数据模型验证
  - [ ] 关系验证
  - [ ] 约束验证
  - [ ] 索引验证

- [ ] 8.3.3 实现测试 fixtures
  - [ ] 创建测试数据生成器
  - [ ] 实现数据库清理
```

---

## 第9周: 部署和上线

### 9.1 代码质量检查

```
TODO List - 代码质量
- [ ] 9.1.1 代码审查
  - [ ] 全代码库审查
  - [ ] 运行 npm run lint 检查
  - [ ] 运行 npm run format 格式化
  - [ ] 修复所有警告

- [ ] 9.1.2 依赖安全扫描
  - [ ] npm audit 扫描
  - [ ] npm audit fix 修复漏洞
  - [ ] 更新已知漏洞依赖
  - [ ] 检查过期依赖

- [ ] 9.1.3 静态代码分析
  - [ ] 使用 SonarQube 或类似工具
  - [ ] 检查代码异味
  - [ ] 检查复杂度
  - [ ] 生成分析报告
```

### 9.2 文档完善

```
TODO List - 文档完善
- [ ] 9.2.1 API 文档
  - [ ] Swagger 文档已自动生成
  - [ ] 验证所有端点都有注释
  - [ ] 添加请求/响应示例
  - [ ] 验证 @ApiTags, @ApiOperation 完整

- [ ] 9.2.2 编写项目文档
  - [ ] 编写 README.md
  - [ ] 编写开发指南
  - [ ] 编写部署指南
  - [ ] 编写故障排除指南

- [ ] 9.2.3 编写变更日志
  - [ ] 列出新功能
  - [ ] 列出 Bug 修复
  - [ ] 列出性能改进

- [ ] 9.2.4 编写数据库文档
  - [ ] ER 图
  - [ ] 表结构说明
  - [ ] 索引说明
```

### 9.3 构建和打包

```
TODO List - 构建打包
- [ ] 9.3.1 配置生产环境
  - [ ] 配置 .env.production
  - [ ] 禁用调试功能
  - [ ] 配置 Sentry
  - [ ] 配置生产日志级别

- [ ] 9.3.2 构建应用
  - [ ] npm run build
  - [ ] 验证 dist/ 目录
  - [ ] 测试生产构建: node dist/main

- [ ] 9.3.3 创建 Docker 镜像
  - [ ] 创建 Dockerfile
    ```dockerfile
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build
    
    FROM node:18-alpine
    WORKDIR /app
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY package*.json ./
    CMD ["node", "dist/main"]
    ```
  - [ ] 创建 .dockerignore
  - [ ] 构建镜像: docker build -t contract-assistant-api .
  - [ ] 测试镜像

- [ ] 9.3.4 创建 Docker Compose
  - [ ] 创建 docker-compose.yml
  - [ ] 包含 API、PostgreSQL、Redis
  - [ ] 配置持久化存储
  - [ ] 配置网络
  - [ ] 测试: docker-compose up

- [ ] 9.3.5 创建部署脚本
  - [ ] 创建启动脚本
  - [ ] 创建停止脚本
  - [ ] 创建迁移脚本
  - [ ] 创建回滚脚本
```

### 9.4 环境配置

```
TODO List - 环境配置
- [ ] 9.4.1 生产服务器配置
  - [ ] 配置生产数据库
  - [ ] 配置生产 Redis
  - [ ] 配置生产文件存储
  - [ ] 配置 SSL 证书

- [ ] 9.4.2 配置监控和告警
  - [ ] 配置应用监控
  - [ ] 配置数据库监控
  - [ ] 配置日志聚合
  - [ ] 配置告警规则

- [ ] 9.4.3 配置备份和恢复
  - [ ] 配置数据库备份
  - [ ] 配置备份恢复测试
  - [ ] 配置文件备份 (S3)
  - [ ] 测试恢复流程
```

---

## 第9-10周: 部署和上线

### 10.1 部署前检查清单

```
TODO List - 部署检查
- [ ] 10.1.1 功能检查
  - [ ] 所有核心功能已实现
  - [ ] 所有 API 已测试
  - [ ] 所有错误情况已处理
  - [ ] 所有边界情况已测试

- [ ] 10.1.2 性能检查
  - [ ] API 响应时间达标
  - [ ] 数据库查询优化
  - [ ] 缓存策略有效
  - [ ] 内存使用正常

- [ ] 10.1.3 安全检查
  - [ ] 无已知漏洞
  - [ ] 敏感数据已加密
  - [ ] 权限检查完整
  - [ ] 安全头配置完整

- [ ] 10.1.4 监控检查
  - [ ] 日志系统正常
  - [ ] 错误追踪配置完整
  - [ ] 性能监控就位
  - [ ] 告警规则配置完整

- [ ] 10.1.5 文档检查
  - [ ] API 文档完整
  - [ ] 部署文档完整
  - [ ] 开发文档完整
  - [ ] 运维文档完整
```

### 10.2 部署执行

```
TODO List - 部署执行
- [ ] 10.2.1 测试环境部署
  - [ ] 部署到测试服务器
  - [ ] 运行所有测试
  - [ ] 验证所有功能
  - [ ] 性能测试

- [ ] 10.2.2 灰度部署 (可选)
  - [ ] 部署到 10% 生产流量
  - [ ] 监控错误率和性能
  - [ ] 验证没有问题
  - [ ] 逐步增加流量

- [ ] 10.2.3 正式部署
  - [ ] 备份现有数据
  - [ ] 部署新版本
  - [ ] 运行数据库迁移
  - [ ] 验证部署成功

- [ ] 10.2.4 部署后验证
  - [ ] 检查所有 API 是否可访问
  - [ ] 检查数据库连接
  - [ ] 检查 Redis 连接
  - [ ] 检查文件存储
  - [ ] 检查日志输出
```

### 10.3 上线后监控

```
TODO List - 监控
- [ ] 10.3.1 实时监控
  - [ ] 监控 API 错误率
  - [ ] 监控响应时间
  - [ ] 监控资源使用
  - [ ] 监控用户反馈

- [ ] 10.3.2 快速响应
  - [ ] 设置告警规则
  - [ ] 建立值班制度
  - [ ] 准备 rollback 方案
  - [ ] 准备热修复方案

- [ ] 10.3.3 问题跟踪
  - [ ] 收集用户报告的问题
  - [ ] 分析错误日志
  - [ ] 优先级排序
  - [ ] 快速修复和部署
```

---

## 后端文件结构参考 (NestJS 架构)

```
contract-assistant-api/
├── src/
│   ├── auth/                      # 认证模块
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── ...
│   │   ├── strategies/
│   │   │   ├── local.strategy.ts
│   │   │   └── jwt.strategy.ts
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── local-auth.guard.ts
│   │
│   ├── user/                      # 用户模块
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── contract/                  # 合同模块
│   │   ├── contract.module.ts
│   │   ├── contract.controller.ts
│   │   ├── contract.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── analysis/                  # 分析模块
│   │   ├── analysis.module.ts
│   │   ├── analysis.controller.ts
│   │   ├── analysis.service.ts
│   │   ├── ai.service.ts
│   │   ├── analysis.processor.ts  # 队列处理器
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── upload/                    # 上传模块
│   │   ├── upload.module.ts
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   ├── storage.service.ts
│   │   ├── multer.config.ts
│   │   └── dto/
│   │
│   ├── ocr/                       # OCR 模块
│   │   ├── ocr.module.ts
│   │   ├── ocr.service.ts
│   │   ├── ocr.processor.ts
│   │   └── dto/
│   │
│   ├── document/                  # 文档处理模块
│   │   ├── document.module.ts
│   │   ├── document.service.ts
│   │   ├── pdf.service.ts
│   │   └── docx.service.ts
│   │
│   ├── favorite/                  # 收藏模块
│   │   ├── favorite.module.ts
│   │   ├── favorite.controller.ts
│   │   ├── favorite.service.ts
│   │   └── dto/
│   │
│   ├── preferences/               # 偏好模块
│   │   ├── preferences.module.ts
│   │   ├── preferences.controller.ts
│   │   ├── preferences.service.ts
│   │   └── dto/
│   │
│   ├── mail/                      # 邮件模块
│   │   ├── mail.module.ts
│   │   ├── mail.service.ts
│   │   └── templates/
│   │
│   ├── report/                    # 报告模块
│   │   ├── report.module.ts
│   │   ├── report.controller.ts
│   │   ├── report.service.ts
│   │   └── templates/
│   │
│   ├── common/                    # 通用模块
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── sentry.filter.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── guards/
│   │   │   └── api-key.guard.ts
│   │   ├── decorators/
│   │   │   └── user.decorator.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── constants/
│   │       ├── error-codes.ts
│   │       └── messages.ts
│   │
│   ├── config/                    # 配置
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── ...
│   │
│   ├── prisma/                    # Prisma 模块
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.module.ts              # 根模块
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                    # 应用入口
│
├── prisma/
│   ├── schema.prisma              # 数据库模型
│   └── migrations/
│
├── test/                          # E2E 测试
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   └── ...
│
├── templates/                     # 邮件模板
│   ├── verification.hbs
│   └── ...
│
├── .env
├── .env.example
├── .env.production
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json                  # NestJS CLI 配置
└── README.md
```

---

## 开发建议

### 开发顺序
1. **优先完成项目初始化** - 使用 NestJS CLI 快速搭建
2. **完成用户认证** - 使用 @nestjs/jwt 和 @nestjs/passport
3. **完成文件上传和存储** - 使用 multer 集成
4. **集成 OCR 和文档处理** - 创建独立模块
5. **集成 AI 分析** - 使用 Bull 队列异步处理
6. **完成数据查询和管理 API** - 利用依赖注入
7. **添加高级功能** - 收藏、导出等
8. **测试和优化** - 使用 NestJS Testing 工具

### NestJS 优势体现
- **快速生成模块**: `nest g module/controller/service` 自动生成代码
- **依赖注入**: 通过构造函数自动注入依赖
- **装饰器编程**: 代码清晰、易读、易维护
- **内置功能**: 验证、序列化、异常处理开箱即用
- **Swagger 自动化**: API 文档自动生成
- **测试支持**: 完整的测试工具链

### 推荐的并行开发策略
- **第1周**: 项目初始化 (NestJS CLI 加速)
- **第2-3周**: 认证和用户系统
- **第3-4周**: 文件处理 (可与认证并行)
- **第4-5周**: AI 分析和合同管理
- **第5-6周**: 收藏和偏好
- **第6周**: 通知和报告
- **第7周**: 安全和优化
- **第8-9周**: 测试和部署

**预计总时间**: 8-9周 (比 Express 提前 1-2周)

### 与前端的协作
- **第1周**: 与前端讨论并确定 API 文档
- **第3周开始**: 前端需要认证 API
- **第4周开始**: 前端需要上传和合同 API
- **第5周开始**: 前端需要分析 API
- **第8周**: 联合进行集成测试

---

## 关键技术点 (NestJS 生态)

1. **NestJS 框架** - 企业级 Node.js 框架
2. **模块化架构** - Module、Controller、Service 分层
3. **依赖注入** - 通过装饰器自动管理依赖
4. **Prisma ORM** - 类型安全的数据库操作
5. **@nestjs/jwt + @nestjs/passport** - 集成认证
6. **@nestjs/bull** - 异步任务队列
7. **@nestjs/swagger** - 自动 API 文档生成
8. **@nestjs/throttler** - 内置速率限制
9. **class-validator + class-transformer** - 数据验证和转换
10. **NestJS Testing** - 完整的测试支持
11. **Docker 容器化** - 部署和扩展

## NestJS vs Express 对比总结

| 特性 | Express | NestJS | 优势 |
|------|---------|--------|------|
| **项目初始化** | 1-2周 | 1-2天 | NestJS 快 10倍 ⭐⭐⭐⭐⭐ |
| **开发效率** | 100% | 120-140% | NestJS 快 20-40% ⭐⭐⭐⭐⭐ |
| **代码组织** | 手动 | 强制规范 | NestJS 更清晰 ⭐⭐⭐⭐⭐ |
| **API 文档** | 需配置 | 自动生成 | NestJS 自动化 ⭐⭐⭐⭐⭐ |
| **依赖注入** | 无 | 内置 | NestJS 优势 ⭐⭐⭐⭐⭐ |
| **学习成本** | 低 | 中 | Express 简单 ⭐⭐⭐ |
| **长期维护** | 中 | 高 | NestJS 可维护 ⭐⭐⭐⭐⭐ |
| **性能** | 略优 | 略差 | 差异可忽略 |

**结论**: 对于本项目，NestJS 是更优选择！

---

## 常见问题和解决方案

1. **数据库连接超时** - 检查连接字符串和连接池设置
2. **ORM 查询性能差** - 添加适当的索引和使用 select 字段选择
3. **文件上传过大** - 实现分块上传或限制文件大小
4. **AI 调用超时** - 实现异步处理和超时重试
5. **内存泄漏** - 检查事件监听和定时任务是否正确清理

---

**最后更新**: 2025-12-21  
**版本**: v2.0 (NestJS)  
**状态**: 待执行  
**框架选择**: NestJS (详见 express-vs-nestjs.md 分析)
