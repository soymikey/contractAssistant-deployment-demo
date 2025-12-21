# NestJS 服务端完整初始化指南

## 快速开始

### 第1步：全局安装 NestJS CLI

```bash
npm install -g @nestjs/cli
```

### 第2步：在 server 目录创建 NestJS 项目

```bash
cd H:\Projects\ContractAssistant\server
nest new . --strict --package-manager npm
```

选择项目时的提示：
- Package manager: npm ✅
- Skip git: No (保留 git)

---

## 项目初始化完成后的操作

### 第3步：安装所有依赖包

```bash
cd H:\Projects\ContractAssistant\server

# 核心依赖
npm install @nestjs/common @nestjs/core @nestjs/platform-express
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install @nestjs/config dotenv
npm install @prisma/client
npm install bcryptjs
npm install redis bull @nestjs/bull
npm install axios
npm install swagger-jsdoc @nestjs/swagger @nestjs/openapi
npm install nodemailer
npm install aws-sdk
npm install multer
npm install sharp
npm install tesseract.js
npm install express-rate-limit helmet cors compression

# 开发依赖
npm install --save-dev @types/node @types/express @types/multer
npm install --save-dev @types/bcryptjs @types/nodemailer
npm install --save-dev prisma @prisma/cli
npm install --save-dev eslint prettier @typescript-eslint/eslint-plugin
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @nestjs/testing supertest @types/supertest
npm install --save-dev typescript ts-loader
```

### 第4步：Prisma 初始化

```bash
# 初始化 Prisma
npx prisma init

# 配置数据库 URL 在 .env 中
# DATABASE_URL="postgresql://user:password@localhost:5432/contract_assistant"
```

---

## 完整的目录结构

创建以下目录和文件：

```
server/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts
│   │   │   ├── auth-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── local-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── optional-jwt.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── pipes/
│   │   │   ├── validation.pipe.ts
│   │   │   └── parse-int.pipe.ts
│   │   └── types/
│   │       └── request.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── aws.config.ts
│   │   ├── redis.config.ts
│   │   ├── mail.config.ts
│   │   └── app.config.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   └── reset-password.dto.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── local.strategy.ts
│   │   │   │   └── jwt-refresh.strategy.ts
│   │   │   └── tests/
│   │   │       └── auth.controller.spec.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-profile.dto.ts
│   │   │   └── tests/
│   │   │       └── users.service.spec.ts
│   │   │
│   │   ├── contracts/
│   │   │   ├── contracts.module.ts
│   │   │   ├── contracts.controller.ts
│   │   │   ├── contracts.service.ts
│   │   │   ├── entities/
│   │   │   │   └── contract.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-contract.dto.ts
│   │   │   │   └── query-contract.dto.ts
│   │   │   └── tests/
│   │   │
│   │   ├── upload/
│   │   │   ├── upload.module.ts
│   │   │   ├── upload.controller.ts
│   │   │   ├── upload.service.ts
│   │   │   ├── dto/
│   │   │   │   └── upload-file.dto.ts
│   │   │   └── tests/
│   │   │
│   │   ├── analysis/
│   │   │   ├── analysis.module.ts
│   │   │   ├── analysis.controller.ts
│   │   │   ├── analysis.service.ts
│   │   │   ├── analysis.processor.ts
│   │   │   ├── entities/
│   │   │   │   └── analysis.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-analysis.dto.ts
│   │   │   │   └── query-analysis.dto.ts
│   │   │   └── tests/
│   │   │
│   │   ├── ocr/
│   │   │   ├── ocr.module.ts
│   │   │   ├── ocr.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── favorites/
│   │   │   ├── favorites.module.ts
│   │   │   ├── favorites.controller.ts
│   │   │   ├── favorites.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── export/
│   │   │   ├── export.module.ts
│   │   │   ├── export.controller.ts
│   │   │   ├── export.service.ts
│   │   │   └── templates/
│   │   │
│   │   └── health/
│   │       ├── health.module.ts
│   │       └── health.controller.ts
│   │
│   ├── shared/
│   │   ├── services/
│   │   │   ├── mail.service.ts
│   │   │   ├── aws-s3.service.ts
│   │   │   ├── redis.service.ts
│   │   │   └── logger.service.ts
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   └── types/
│   │       ├── api-response.ts
│   │       ├── pagination.ts
│   │       └── errors.ts
│   │
│   ├── database/
│   │   ├── prisma.service.ts
│   │   ├── seeders/
│   │   │   └── seed.ts
│   │   └── migrations/
│   │
│   ├── queue/
│   │   ├── analysis.queue.ts
│   │   ├── ocr.queue.ts
│   │   └── mail.queue.ts
│   │
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── test/
│   ├── jest-e2e.json
│   ├── app.e2e-spec.ts
│   └── fixtures/
│
├── .env
├── .env.example
├── .env.test
├── .env.production
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 关键文件内容

### 1. package.json

```json
{
  "name": "contract-assistant-api",
  "version": "1.0.0",
  "description": "AI-powered contract analysis API",
  "author": "Your Name",
  "private": true,
  "license": "MIT",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/bull": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/openapi": "^1.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@prisma/client": "^5.0.0",
    "axios": "^1.6.0",
    "aws-sdk": "^2.1500.0",
    "bcryptjs": "^2.4.3",
    "bull": "^4.11.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.0.0",
    "helmet": "^7.0.0",
    "multer": "^1.4.5",
    "nodemailer": "^6.9.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "reflect-metadata": "^0.1.13",
    "rimraf": "^5.0.0",
    "rxjs": "^7.8.0",
    "sharp": "^0.32.0",
    "tesseract.js": "^5.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.0",
    "@types/multer": "^1.4.7",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.40.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "prisma": "^5.0.0",
    "supertest": "^6.3.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.0",
    "ts-node": "^10.9.0",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. .env.example

```env
# 应用配置
NODE_ENV=development
PORT=3000
API_VERSION=v1

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/contract_assistant

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=contract-assistant

# 邮件
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@contractassistant.com

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Google Vision (可选)
GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json

# 日志
LOG_LEVEL=debug

# 前端地址 (CORS)
FRONTEND_URL=http://localhost:3001
```

### 3. main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 安全性中间件
  app.use(helmet());
  app.use(compression());

  // CORS 配置
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // API 文档
  const config = new DocumentBuilder()
    .setTitle('Contract Assistant API')
    .setDescription('AI-powered contract analysis API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
  console.log(`Swagger documentation on http://localhost:${port}/api/docs`);
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
```

### 4. app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { UploadModule } from './modules/upload/upload.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ExportModule } from './modules/export/export.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ContractsModule,
    AnalysisModule,
    UploadModule,
    FavoritesModule,
    ExportModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 5. prisma/schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String?
  avatar    String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  contracts Contract[]
  favorites Favorite[]

  @@map("users")
}

model Contract {
  id        String     @id @default(cuid())
  userId    String
  fileName  String
  fileUrl   String
  fileType  String     // 'pdf', 'image', 'docx'
  fileSize  Int
  status    String     @default("pending") // pending, processing, completed, failed
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  analysis  ContractAnalysis?
  favorites Favorite[]

  @@index([userId])
  @@map("contracts")
}

model ContractAnalysis {
  id               String     @id @default(cuid())
  contractId       String     @unique
  contractType     String?
  partyA           String?
  partyB           String?
  signDate         DateTime?
  effectiveDate    DateTime?
  expiryDate       DateTime?
  duration         String?
  amount           String?
  currency         String?
  overview         Json?      // 合同概览数据
  riskLevel        String?    // 'high', 'medium', 'low'
  riskSummary      String?
  suggestions      Json?      // 建议数据
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  contract         Contract   @relation(fields: [contractId], references: [id], onDelete: Cascade)
  riskItems        RiskItem[]
  analysisLogs     AnalysisLog[]

  @@map("contract_analyses")
}

model RiskItem {
  id               String     @id @default(cuid())
  analysisId       String
  title            String
  description      String
  level            String     // 'high', 'medium', 'low'
  legalBasis       String?
  suggestion       String?
  createdAt        DateTime   @default(now())

  analysis         ContractAnalysis @relation(fields: [analysisId], references: [id], onDelete: Cascade)

  @@index([analysisId])
  @@map("risk_items")
}

model AnalysisLog {
  id               String     @id @default(cuid())
  analysisId       String
  status           String     // 'pending', 'processing', 'completed', 'failed'
  progress         Int?       // 0-100
  error            String?
  startedAt        DateTime   @default(now())
  completedAt      DateTime?

  analysis         ContractAnalysis @relation(fields: [analysisId], references: [id], onDelete: Cascade)

  @@index([analysisId])
  @@map("analysis_logs")
}

model Favorite {
  id               String     @id @default(cuid())
  userId           String
  contractId       String
  createdAt        DateTime   @default(now())

  user             User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  contract         Contract   @relation(fields: [contractId], references: [id], onDelete: Cascade)

  @@unique([userId, contractId])
  @@index([userId])
  @@map("favorites")
}
```

---

## 快速初始化步骤总结

### 一键完成初始化（逐步执行）

```bash
# 1. 进入项目目录
cd H:\Projects\ContractAssistant\server

# 2. 初始化 NestJS 项目
nest new . --strict --package-manager npm

# 3. 安装所有依赖 (上面提供的完整列表)
npm install

# 4. 配置数据库
cp .env.example .env
# 编辑 .env，配置 DATABASE_URL

# 5. 初始化 Prisma
npx prisma init
npx prisma migrate dev --name init

# 6. 创建所有模块结构（参考下面的脚本）
```

---

## 使用 NestJS CLI 快速生成模块

```bash
# 生成认证模块
nest g module modules/auth
nest g controller modules/auth
nest g service modules/auth

# 生成用户模块
nest g module modules/users
nest g controller modules/users
nest g service modules/users

# 生成合同模块
nest g module modules/contracts
nest g controller modules/contracts
nest g service modules/contracts

# 生成上传模块
nest g module modules/upload
nest g controller modules/upload
nest g service modules/upload

# 生成分析模块
nest g module modules/analysis
nest g controller modules/analysis
nest g service modules/analysis

# 生成收藏模块
nest g module modules/favorites
nest g controller modules/favorites
nest g service modules/favorites

# 生成导出模块
nest g module modules/export
nest g controller modules/export
nest g service modules/export

# 生成健康检查模块
nest g module modules/health
nest g controller modules/health

# 生成数据库模块
nest g module database

# 生成共享模块
nest g module shared
```

---

## 接下来需要创建的关键文件

我将为你创建以下核心文件：

1. ✅ **auth.module.ts** - 认证模块（完整的 JWT 实现）
2. ✅ **auth.service.ts** - 认证业务逻辑
3. ✅ **auth.controller.ts** - 认证 API
4. ✅ **jwt.strategy.ts** - JWT 策略
5. ✅ **local.strategy.ts** - 本地认证策略
6. ✅ **common/** 下的所有 Guard、Filter、Interceptor、Decorator
7. ✅ **users.module.ts** - 用户模块
8. ✅ **contracts.module.ts** - 合同模块
9. ✅ **database/prisma.service.ts** - 数据库服务
10. ✅ **其他所有必要的共享服务和配置**

---

## 项目启动

初始化完成后，启动应用：

```bash
# 开发模式
npm run start:dev

# 应用将在 http://localhost:3000 启动
# Swagger 文档: http://localhost:3000/api/docs
```

---

准备好了吗？我现在就为你创建所有这些核心文件！ 🚀

下一步，我将为你：
1. 更新 be.md (NestJS 版本)
2. 创建完整的 Auth Module（含所有 Strategy、Guard、Service）
3. 创建 Database Module 和 Prisma Service
4. 创建所有共享的装饰器、过滤器、拦截器
5. 创建用户模块和其他核心模块
