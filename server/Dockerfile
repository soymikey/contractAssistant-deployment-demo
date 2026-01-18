# ... 前面 base 阶段保持不变 ...

# --- 依赖阶段 ---
FROM base AS dependencies
COPY package*.json ./
# 1. 先安装所有依赖
RUN npm install

# --- 构建阶段 ---
FROM base AS builder
# 2. 从上个阶段拷贝 node_modules
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# 3. 拷贝源码（包含 prisma 目录和 schema 文件）
COPY . .
# 4. 调用你的自定义脚本生成 Prisma Client
RUN npm run db:generate
# 5. 执行 NestJS 构建
RUN npm run build

# --- 运行阶段 ---
FROM base AS production
ENV NODE_ENV=production

# 拷贝运行所需的最简文件
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
# 关键：生产环境也需要这个，否则 node_modules 里的类型映射会失效
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]