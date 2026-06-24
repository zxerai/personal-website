# =============================================================================
# Personal Website - Next.js 14 Multi-stage Docker Build
# 镜像目标：< 200MB（基于 node:20-alpine + standalone output）
# =============================================================================

# ---------- Stage 1: deps（依赖安装）----------
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# 先复制 lockfile 利用 Docker 缓存
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---------- Stage 2: builder（构建 Next.js）----------
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 跳过 next-intl 的 lint（构建期），构建 standalone 输出
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- Stage 3: runner（运行时镜像）----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# 复制 standalone 输出（已包含最小运行时）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 复制静态资源（standalone 不含这些）
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 复制 public 目录
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# standalone 输出的入口
CMD ["node", "server.js"]