# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY api/package.json api/package.json

RUN npm ci -w api

COPY api/tsconfig.json api/
COPY api/src api/src

WORKDIR /app/api
RUN npm run build

# ---- Run stage ----
FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json ./
COPY api/package.json api/package.json

RUN npm ci -w api --omit=dev

COPY --from=builder /app/api/dist api/dist

USER node
EXPOSE 3000

WORKDIR /app/api
CMD ["node", "dist/index.js"]