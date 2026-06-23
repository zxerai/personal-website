# 个人网站设计文档

**日期**：2026-06-23
**作者**：老金 + Claude
**状态**：草案 v1.0
**目标站点**：参考 [aiking.dev](https://www.aiking.dev/) 风格的 AI 工程师个人站

---

## 1. 项目背景与目标

### 1.1 用户画像

- **身份**：AI/LLM 应用工程师，高级水平，专注 Agent 编排
- **目标**：建立个人品牌，作为作品集 + 博客 + 简历的统一入口
- **受众**：潜在雇主、合作伙伴、技术社区

### 1.2 设计目标

- **视觉档次**：对标 aiking.dev 的"精致感"
- **核心特征**：暗色主题 + 大面积动效 + 简洁留白 + 特殊字体
- **形态**：综合型（项目 + 博客 + 简历 + 关于）
- **语言**：中英双语，默认中文
- **部署**：Vercel

### 1.3 非目标（Out of Scope）

- ❌ 评论区 / 用户登录 / CMS 后台（用 MDX 文件进 Git 管理）
- ❌ 复杂搜索（先不做，后期可加 Algolia）
- ❌ Newsletter 订阅（暂不需要）
- ❌ 多用户协同编辑
- ❌ 复杂动画（如 3D 模型、WebGL 粒子效果）

---

## 2. 技术栈

| 类别 | 选型 | 理由 |
|---|---|---|
| 框架 | Next.js 14+ (App Router) | 路由级 i18n、ISR、SEO 友好 |
| 语言 | TypeScript | 强类型，AI 工程师友好 |
| 内容 | MDX (gray-matter + next-mdx-remote) | Markdown + React 组件 |
| 样式 | Tailwind CSS + CSS Variables | 暗色主题 token + 快速迭代 |
| 动画 | @darkroom.engineering/lenis + Framer Motion + GSAP | 平滑滚动 + 组件动画 + 时间线 |
| 国际化 | next-intl | App Router 原生支持 |
| 校验 | Zod | 内容 schema 强校验 |
| 测试 | Vitest + Playwright + axe-core | 单元 + E2E + 可访问性 |
| 部署 | Vercel | 零配置、CDN、ISR |
| 包管理 | pnpm | 速度快、节省磁盘 |

---

## 3. 目录结构

```
agent/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # 根布局（字体/主题/i18n provider）
│   │   ├── page.tsx            # 首页
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── about/page.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── api/
│   │   └── og/route.ts         # OG 图片生成
│   ├── global-error.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx              # 根 layout（无 locale）
├── content/
│   ├── projects/
│   │   ├── zh/*.mdx
│   │   └── en/*.mdx
│   ├── blog/
│   │   ├── zh/*.mdx
│   │   └── en/*.mdx
│   ├── resume/
│   │   ├── zh.mdx
│   │   └── en.mdx
│   └── about/
│       ├── zh.mdx
│       └── en.mdx
├── components/
│   ├── ui/                     # 通用组件（Button、Card、Badge）
│   ├── motion/                 # 动画封装（FadeIn、Magnetic、Cursor）
│   ├── layout/                 # Navbar、Footer、LanguageSwitcher
│   └── mdx/                    # MDX 自定义组件映射
├── lib/
│   ├── mdx.ts                  # MDX 加载/解析
│   ├── i18n.ts                 # next-intl 配置
│   ├── schemas/
│   │   ├── project.ts          # Zod schemas
│   │   └── blog.ts
│   └── utils.ts
├── messages/
│   ├── zh.json                 # UI 文案翻译
│   └── en.json
├── styles/
│   ├── globals.css
│   └── tokens.css              # 颜色/字体 CSS 变量
├── scripts/
│   └── validate-content.ts     # 内容校验脚本
├── public/
│   ├── avatar.jpg
│   ├── og-default.png
│   └── projects/               # 项目封面图
├── tests/
│   ├── e2e/                    # Playwright
│   └── unit/                   # Vitest
├── .github/
│   └── workflows/ci.yml
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── playwright.config.ts
└── README.md
```

---

## 4. 路由与页面

### 4.1 路由策略

- **默认语言**：中文（`/` 自动 302 → `/zh`）
- **语言切换**：导航栏右上角按钮，URL 切换时保留当前路径
- **静态生成**：所有项目/博客页面编译期生成（SSG）

### 4.2 页面清单

| 路由 | 名称 | 说明 |
|---|---|---|
| `/zh` `/en` | 首页 | Hero + 精选项目 + 最新博客 + 联系方式 |
| `/zh/projects` `/en/projects` | 项目列表 | 筛选条 + 项目卡片网格 |
| `/zh/projects/[slug]` `/en/projects/[slug]` | 项目详情 | 封面图 + 元信息 + 正文 + 相邻导航 |
| `/zh/blog` `/en/blog` | 博客列表 | 时间倒序 + 标签筛选 |
| `/zh/blog/[slug]` `/en/blog/[slug]` | 博客详情 | TOC + MDX 正文 + 代码高亮 |
| `/zh/resume` `/en/resume` | 简历 | 时间线 + 下载 PDF 按钮 |
| `/zh/about` `/en/about` | 关于我 | 头像 + 个人故事 + 技能 |

### 4.3 404 页面

居中布局：超大号 404 数字（强调色）、简短文案、"回到首页" CTA 按钮。复用主页布局的 Navbar 和 Footer，保持视觉一致。

---

## 5. 内容模型

### 5.1 项目 MDX Schema（Zod）

```typescript
const projectSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(200),
  cover: z.string().optional(),
  tags: z.array(z.string()).min(1),
  date: z.string(),  // ISO 8601
  featured: z.boolean().default(false),
  external: z.string().url().optional(),
  order: z.number().optional(),
})
```

**Frontmatter 示例**：

```yaml
---
title: LangChain RAG 助手
slug: langchain-rag
description: 基于 LangChain + pgvector 构建的私有知识库问答系统
cover: /projects/langchain-rag/cover.png
tags: [LangChain, RAG, pgvector, TypeScript]
date: 2025-03-15
featured: true
external: https://github.com/jiaiiac/xxx
order: 1
---
```

### 5.2 博客 MDX Schema

```typescript
const blogSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(300),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
})
```

### 5.3 简历/关于我

单文件 MDX，无需 frontmatter，使用 MDX 组件表达时间线。

---

## 6. 设计系统

### 6.1 配色（暗色主题）

```css
:root {
  /* 背景层级 */
  --bg-base:        #0a0a0b;
  --bg-elevated:    #131316;
  --bg-overlay:     #1c1c21;

  /* 文字层级 */
  --text-primary:   #ededee;
  --text-secondary: #a0a0a8;
  --text-muted:     #6b6b73;

  /* 边框 */
  --border-subtle:  #1f1f24;
  --border-default: #2a2a30;

  /* 强调色（单一品牌色）*/
  --accent:         #6366f1;
  --accent-hover:   #818cf8;
  --accent-glow:    rgba(99, 102, 241, 0.15);
}
```

**配色哲学**：
- 多层级暗灰营造空间感
- 强调色仅用在 CTA、链接、关键高亮
- 不用纯黑（避免与 OLED 屏幕像素边界冲突）

### 6.2 字体策略

| 用途 | 英文 | 中文 |
|---|---|---|
| 标题 | Geist / Satoshi（开源免费替代 Cal Sans） | 思源黑体 / HarmonyOS Sans |
| 正文 | Inter | 思源黑体 |
| 代码 | JetBrains Mono | JetBrains Mono |

**加载方式**：
- 字体走 fontsource（自托管）
- 子集化减小体积
- `next/font` 自动 preload
- 注：Cal Sans 是商业字体，如需使用需从 calsans.com 获取授权；默认采用 Geist（Vercel 出品，开源免费），如确需 Cal Sans 风格，再单独采购

### 6.3 视觉细节

- **圆角**：`--radius: 12px`（卡片）、`--radius-sm: 6px`（按钮）
- **阴影**：`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)`（低饱和暗影）
- **玻璃拟态**：导航栏 `backdrop-filter: blur(12px)` + 半透明背景
- **网格底纹**：Hero 区域 SVG 网格点阵
- **噪点纹理**：1% 透明度 SVG 噪点叠加，避免纯色平

---

## 7. 动画系统

### 7.1 三件套组合

| 工具 | 场景 |
|---|---|
| Lenis | 全局平滑滚动 |
| Framer Motion | 组件级动画（入场、悬停、过渡） |
| GSAP | 时间线动画（Hero 文字、视差、SVG 路径） |

### 7.2 关键动效清单

| 优先级 | 动效 | 场景 | 实现 |
|---|---|---|---|
| P0 | 滚动渐入 | 所有页面 | Framer Motion `whileInView` |
| P0 | 页面切换过渡 | 路由切换 | `AnimatePresence` + `template.tsx` |
| P0 | Lenis 平滑滚动 | 全局 | Lenis 实例 |
| P1 | Hero 标题动效 | 首页 | GSAP split text + timeline |
| P1 | 项目卡片 hover | 项目页 | Framer Motion scale + border glow |
| P1 | 链接下划线动画 | 全局 | CSS transition + pseudo-element |
| P2 | 自定义光标 | 全局 | 自定义 cursor + magnetic effect |
| P2 | 磁性 CTA 按钮 | 首页 | Framer Motion follow |
| P2 | 数字滚动 | 简历页 | GSAP counter plugin |
| P3 | 视差滚动 | Hero | GSAP scrollTrigger |
| P3 | 图片模糊揭示 | 滚动入场 | Framer Motion filter |

### 7.3 性能与降级

- **`prefers-reduced-motion: reduce`**：所有动画 duration 设为 0
- **移动端简化**：禁用光标跟随、复杂时间线，仅保留基础渐入
- **`will-change`** 谨慎使用，仅在动画进行中设置

### 7.4 动画封装组件

```tsx
// components/motion/FadeIn.tsx
'use client'
import { motion } from 'framer-motion'

export function FadeIn({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

---

## 8. 国际化（i18n）

### 8.1 配置

- **库**：next-intl
- **支持语言**：zh（默认）、en
- **路由前缀**：`/zh/*`、`/en/*`
- **根路径**：自动重定向到 `/zh`

### 8.2 内容组织

```
content/
├── projects/
│   ├── zh/langchain-rag.mdx
│   └── en/langchain-rag.mdx
└── blog/
    ├── zh/llm-app-design.mdx
    └── en/llm-app-design.mdx
```

每个内容独立 MDX 文件，slug 跨 locale 一致。

### 8.3 翻译文件结构

```json
// messages/zh.json
{
  "nav": {
    "home": "首页",
    "projects": "项目",
    "blog": "博客",
    "resume": "简历",
    "about": "关于"
  },
  "home": {
    "hero_greeting": "你好，我是",
    "hero_tagline": "AI 工程师 / 构建智能应用",
    "cta_projects": "查看项目",
    "cta_blog": "读读博客"
  }
}
```

### 8.4 内容回退

英文版缺失某个 slug 时，自动回退到中文版并显示提示"暂无英文版本"。

### 8.5 SEO

- `hreflang` 标签：中英版本互相指向
- `sitemap.xml` 包含所有 locale 的所有页面
- `og:locale` 设为对应语言

---

## 9. 数据流

### 9.1 内容加载管线

```
MDX 文件
  ↓
gray-matter 解析 frontmatter
  ↓
Zod schema 校验
  ↓
remark/rehype 处理（代码高亮、GFM、自动标题 ID）
  ↓
next-mdx-remote 编译
  ↓
<MDXRemote components={mdxComponents} />
  ↓
React 渲染
```

### 9.2 核心 lib 函数

```typescript
// lib/mdx.ts
export async function getProjects(locale: string): Promise<Project[]> { ... }
export async function getProject(slug: string, locale: string) { ... }
export async function getBlogPosts(locale: string): Promise<BlogPost[]> { ... }
export async function getBlogPost(slug: string, locale: string) { ... }
```

### 9.3 缓存策略

```typescript
// app/[locale]/projects/[slug]/page.tsx
export const revalidate = 3600  // ISR：每小时重新生成

export async function generateStaticParams() {
  const locales = ['zh', 'en']
  const params = []
  for (const locale of locales) {
    const projects = await getProjects(locale)
    params.push(...projects.map(p => ({ locale, slug: p.slug })))
  }
  return params
}
```

### 9.4 MDX 组件映射

```typescript
// components/mdx/MDXComponents.tsx
export const mdxComponents = {
  pre: CodeBlock,           // 自定义代码块（复制按钮 + 文件名）
  a: SmartLink,             // 外部链接新窗口
  h2: (props) => <Heading level={2} {...props} />,
  Note: (props) => <Callout type="info" {...props} />,
  Warning: (props) => <Callout type="warning" {...props} />,
}
```

### 9.5 内容校验（CI）

```json
{
  "scripts": {
    "content:check": "tsx scripts/validate-content.ts",
    "prebuild": "npm run content:check"
  }
}
```

`validate-content.ts` 扫描所有 MDX 文件，frontmatter 不符合 schema 则报错。

---

## 10. 错误处理

### 10.1 错误层级

| 文件 | 范围 | 行为 |
|---|---|---|
| `app/[locale]/error.tsx` | 路由段错误 | 显示友好错误页 + 重试按钮 |
| `app/[locale]/global-error.tsx` | 根布局错误 | 兜底 HTML 错误页 |
| `app/[locale]/not-found.tsx` | 404 | 显示 404 + 回首页 CTA |

### 10.2 内容缺失处理

| 场景 | 行为 |
|---|---|
| 访问不存在的 slug | `not-found.tsx` 渲染 |
| frontmatter 不合法 | 构建期 `content:check` 失败 |
| 英文版缺失 | 回退中文 + 提示"暂无英文版本" |
| 封面图缺失 | 显示渐变占位图 |

### 10.3 动效降级

- **`prefers-reduced-motion: reduce`**：所有动效 duration 设为 0
- **JS 加载失败**：Next.js 默认静态渲染兜底
- **图片加载失败**：alt 文本 + 占位背景

### 10.4 构建期检查

```bash
npm run build
```

执行检查：
1. TypeScript 类型检查
2. 内容 MDX frontmatter 校验
3. 路由可访问性（404 测试）
4. Lighthouse CI（性能/SEO/可访问性）

任何失败 → 构建失败 → Vercel 部署阻止。

---

## 11. 测试策略

### 11.1 测试分层

| 层级 | 工具 | 覆盖 |
|---|---|---|
| 类型检查 | TypeScript `tsc --noEmit` | 全量代码 |
| 单元测试 | Vitest | lib 函数、Zod schema |
| 组件测试 | Vitest + Testing Library | 关键组件 |
| 视觉回归 | Playwright + 截图对比 | 首页、项目详情、博客详情 |
| 可访问性 | axe-core（Playwright） | 所有页面 |
| E2E | Playwright | 关键路径 |
| Lighthouse | `@lhci/cli` | 性能/SEO/可访问性 |

### 11.2 E2E 关键路径

```typescript
// e2e/critical-paths.spec.ts
test('homepage renders', ...)
test('language switcher works', ...)
test('project detail page renders', ...)
test('blog post navigation', ...)
test('404 page', ...)
```

### 11.3 Lighthouse 目标

| 指标 | 目标 |
|---|---|
| Performance | ≥ 95 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

### 11.4 CI 流水线（GitHub Actions）

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    steps:
      - npm ci
      - npm run lint
      - npm run typecheck
      - npm run test:unit
      - npm run test:e2e
      - npm run build
```

---

## 12. 性能优化

- **`next/image`** 自动优化图片（WebP、响应式）
- **`next/font`** 字体子集 + preload
- **代码分割**：路由级自动分割
- **MDX 编译产物缓存**：构建期一次编译
- **静态优先**：所有页面 SSG，必要时 ISR
- **关键 CSS 内联**：Next.js 自动

---

## 13. 部署

### 13.1 Vercel 配置

- **构建命令**：`npm run build`
- **输出目录**：`.next`（Next.js 默认）
- **环境变量**：`NEXT_PUBLIC_SITE_URL`
- **域名**：自动分配 `*.vercel.app`，可绑定自定义域名

### 13.2 域名建议

- **首选**：用户已有域名（如 `jiaiiac.dev`）→ 在 Vercel 控制台配置 CNAME 指向 `cname.vercel-dns.com`
- **备选**：Vercel 自动分配的子域名，格式为 `<vercel-account-username>.vercel.app`（例如账号名 `jiaiiac` 则为 `jiaiiac.vercel.app`）
- **待办**：实施前用户需在 Vercel 控制台确认账号用户名，并决定是否使用自定义域名

### 13.3 部署触发

- `git push origin main` → 自动部署到生产
- PR → 预览部署到独立 URL

---

## 14. 验收标准

### 14.1 功能验收

- [ ] 5 个核心页面（首页、项目列表/详情、博客列表/详情、简历、关于）正常渲染
- [ ] 中英双语切换正常，URL 同步
- [ ] MDX 内容正确解析，代码块语法高亮 + 复制按钮
- [ ] 项目/博客筛选功能正常
- [ ] 404 页面正常显示
- [ ] OG 图片生成正常（社交分享卡片）

### 14.2 视觉验收

- [ ] 暗色主题色调统一（与设计 token 一致）
- [ ] 字体加载完整，无 FOUC（Flash of Unstyled Content）
- [ ] 动画流畅（60fps），移动端简化版正常
- [ ] 响应式：手机/平板/桌面三端断点正确
- [ ] 可访问性：键盘导航 + 屏幕阅读器友好

### 14.3 性能验收

- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] 首屏加载 ≤ 1.5s（Vercel CDN）

### 14.4 工程验收

- [ ] TypeScript 严格模式无错误
- [ ] CI 全绿（lint / typecheck / unit / e2e / build）
- [ ] 内容校验脚本阻止非法 frontmatter
- [ ] `.env.example` 完整

---

## 15. 待办与开放问题

> 以下事项不影响 v1 实现，可在实施过程中逐步推进。

**实施前必须完成（前置条件）**：

- [ ] **初始化 Git 仓库**：当前目录 `/Users/jiaiiac/Desktop/agent` 不是 git 仓库，第一步需执行 `git init` 并创建初始 commit，CI（GitHub Actions）才能生效
- [ ] **创建 GitHub 仓库**：推送到 GitHub 后才能启用 Vercel 自动部署
- [ ] **准备真实素材**：头像、Logo、项目封面图（如暂无，可先用占位渐变图）
- [ ] **确认 Vercel 账号用户名**：用于生成 vercel.app 子域名

**v1 可选功能（v2 考虑）**：

- [ ] 简历 PDF 生成（用 `@react-pdf/renderer` 或静态生成）
- [ ] OG 图片动态生成（已有 `app/api/og/route.ts` 框架，实现细节待定）
- [ ] RSS Feed（`app/feed.xml/route.ts`）
- [ ] Algolia 搜索
- [ ] 暗/亮主题切换（目前锁定暗色）
- [ ] Cal Sans 等商业字体授权（如需）

---

## 16. 风险与缓解

| 风险 | 缓解措施 |
|---|---|
| 内容缺失导致页面空洞 | 提供 starter 内容模板 + 占位数据，骨架先好看 |
| 动画导致性能问题 | `prefers-reduced-motion` + 移动端简化 + Lighthouse 监控 |
| 双语维护成本高 | 英文版允许引用中文版（明示） |
| Vercel 部署失败 | 本地 `npm run build` 先验证，CI 二次校验 |
| 字体加载慢 | fontsource 子集化 + `next/font` preload |

---

**文档版本**：v1.0
**下一步**：用户审阅 → 批准后调用 writing-plans 创建实施计划