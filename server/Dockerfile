# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim AS development

# 连接数据库 如果是https 需要安装
# RUN apt-get update -y \
#     && apt-get install -y openssl libssl1.1 \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

COPY package.json  ./

COPY . .

RUN npm i

EXPOSE 3000

CMD ["sh", "-c", "npm run build && npm run start"]

FROM development as production
CMD ["sh", "-c", "npm run build && npm run start:prod"]

# FROM development as dev-envs
# RUN <<EOF
# apt-get update
# apt-get install -y --no-install-recommends git
# EOF

# RUN <<EOF
# useradd -s /bin/bash -m vscode
# groupadd docker
# usermod -aG docker vscode
# EOF
# # install Docker tools (cli, buildx, compose)
# COPY --from=gloursdocker/docker / /
# CMD [ "npm", "run", "dev" ]