# 个人作品集网站

> AI 工程师 / 构建智能应用 · 中英双语 · 暗色主题

参考 [aiking.dev](https://www.aiking.dev/) 设计风格的个人作品集站，包含项目展示、博客、简历、关于我。

## 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS + CSS Variables
- **动画**：Lenis + Framer Motion + GSAP
- **国际化**：next-intl（中文 / 英文）
- **内容**：MDX (Markdown + React 组件)
- **校验**：Zod
- **测试**：Vitest + Playwright
- **部署**：Vercel

## 项目结构

```
agent/
├── app/                      # Next.js App Router
│   ├── [locale]/             # 本地化路由
│   │   ├── page.tsx          # 首页
│   │   ├── projects/         # 项目页面
│   │   ├── blog/             # 博客页面
│   │   ├── resume/           # 简历
│   │   ├── about/            # 关于我
│   │   └── not-found.tsx     # 404
│   ├── api/og/               # OG 图片生成
│   ├── sitemap.ts            # 站点地图
│   └── robots.ts             # 爬虫规则
├── components/
│   ├── ui/                   # 通用 UI 组件
│   ├── motion/               # 动画组件（Lenis、FadeIn、Magnetic）
│   ├── layout/               # 布局（Navbar、Footer、LanguageSwitcher）
│   ├── mdx/                  # MDX 自定义渲染
│   ├── home/                 # 首页组件
│   ├── projects/             # 项目组件
│   └── blog/                 # 博客组件
├── content/                  # MDX 内容
│   ├── projects/{zh,en}/     # 项目（中英）
│   ├── blog/{zh,en}/         # 博客文章（中英）
│   ├── resume/               # 简历
│   └── about/                # 关于我
├── lib/
│   ├── mdx.ts                # MDX 加载
│   ├── i18n.ts               # i18n 配置
│   ├── utils.ts              # 工具函数
│   └── schemas/              # Zod schemas
├── messages/                 # i18n 翻译文件
├── styles/                   # 全局样式 + tokens
├── scripts/                  # 构建脚本
└── public/                   # 静态资源
```

## 快速开始

### 环境要求

- Node.js >= 18.17.0
- pnpm >= 8.0.0（推荐）

### 安装依赖

```bash
pnpm install
```

### 开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)（自动重定向到 `/zh`）

### 构建生产版本

```bash
pnpm build
pnpm start
```

### 内容校验

```bash
pnpm content:check
```

校验所有 MDX 文件的 frontmatter 是否符合 Zod schema。

### 类型检查

```bash
pnpm typecheck
```

### 单元测试

```bash
pnpm test
```

### E2E 测试

```bash
pnpm test:e2e
```

## 内容创作

### 新增项目

在 `content/projects/zh/` 和 `content/projects/en/` 下各创建一个 `.mdx` 文件：

```markdown
---
title: 项目标题
slug: project-slug
description: 一句话描述
cover: /projects/project-slug/cover.png
tags: [Tag1, Tag2]
date: 2025-04-01
featured: true
external: https://github.com/yourname/repo
order: 1
---

## 项目介绍

正文内容，支持 Markdown + React 组件：

<Note>
  这是一个提示框
</Note>

\`\`\`typescript
const example = '代码块';
\`\`\`
```

slug 必须中英一致，文件命名 `<slug>.mdx`。

### 新增博客文章

在 `content/blog/zh/` 和 `content/blog/en/` 下各创建一个 `.mdx` 文件，结构同项目（无 `featured`、`external`、`order` 字段）。

### 修改简历 / 关于我

直接编辑 `content/resume/{zh,en}.mdx` 或 `content/about/{zh,en}.mdx`。

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 控制台导入仓库
3. 配置环境变量 `NEXT_PUBLIC_SITE_URL`
4. 部署

每次 `git push` 自动部署到生产环境，PR 自动生成预览。

### 自定义域名

在 Vercel 控制台 → Domains 添加你的域名，配置 CNAME 指向 `cname.vercel-dns.com`。

## 设计参考

- [aiking.dev](https://www.aiking.dev/) - 主要视觉参考
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Framer Motion](https://www.framer.com/motion/) - 动画
- [next-intl](https://next-intl-docs.vercel.app/) - 国际化

## 部署

### Vercel（最简）

推送代码后到 [vercel.com](https://vercel.com) 导入仓库即可。

### 1Panel（国内服务器，推荐）

仓库已配好 Docker 多阶段构建：

```bash
# 1Panel 控制台 → 应用商店 → 自定义 Compose
# 粘贴 docker-compose.yml 内容（修改 NEXT_PUBLIC_SITE_URL）
# 启动容器即可
```

详细步骤见 [docs/deploy-1panel.md](docs/deploy-1panel.md)。包含：

- Docker Compose 部署（推荐）
- PM2 + Node.js 部署（备选）
- GitHub Actions 自动构建镜像
- 反向代理 + SSL + 域名配置
- 常见问题排查

### GitHub Container Registry 自动构建

`.github/workflows/docker.yml` 可选添加，push main 后自动构建并推送到 GHCR。

## License

MIT