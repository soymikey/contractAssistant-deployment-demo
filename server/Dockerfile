FROM node:20-alpine As development
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npx prisma generate

FROM node:20-alpine As build
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm install --only=production && npm cache clean --force
USER node

FROM node:20-alpine As production
RUN apk add --no-cache openssl
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/public ./public
CMD ["node", "dist/src/main.js"]