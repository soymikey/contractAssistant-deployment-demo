# --- 第一阶段：构建 ---
FROM node:20-alpine AS builder

WORKDIR /app

# 1. 复制依赖描述文件
COPY package*.json ./
COPY prisma ./prisma/

# 2. 安装所有依赖
RUN npm install

# 3. 生成 Prisma Client (这一步是解决你报错的关键)
# 它会根据 ./prisma/schema.prisma 生成类型文件到 node_modules 中
RUN npx prisma generate

# 4. 复制源码并构建
COPY . .
RUN npm run build

# --- 第二阶段：运行 ---
FROM node:20-alpine AS runner

WORKDIR /app

# 设置生产环境
ENV NODE_ENV=production

# 5. 只复制运行必需的文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 暴露 NestJS 默认端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/src/main"]