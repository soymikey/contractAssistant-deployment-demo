# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim AS base
WORKDIR /usr/src/app

# --- 依赖阶段 ---
FROM base AS dependencies
COPY package*.json ./
# 只安装依赖，这层会被缓存
RUN npm install

# --- 构建阶段 ---
FROM base AS builder
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run db:generate
# 在构建镜像时就完成编译！
RUN npm run build

# --- 生产运行阶段 ---
FROM base AS production
ENV NODE_ENV=production

# 从前面的阶段拷贝必要文件，不拷贝源码
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./

# 暴露端口
EXPOSE 3000

# 此时 dist/main 已经确定存在于镜像中了
CMD ["node", "dist/main"]