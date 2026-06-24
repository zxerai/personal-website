# 1Panel 部署指南

本文档介绍如何用 [1Panel](https://1panel.cn) 把这个 Next.js 14 个人作品集网站部署到自己的服务器上。

## 前置条件

| 需求 | 说明 |
|---|---|
| 服务器 | VPS / 云服务器，最低 1 核 CPU + 1GB RAM + 10GB 磁盘 |
| 操作系统 | Ubuntu 20.04+ / Debian 11+ / CentOS 8+ |
| 1Panel | 已安装最新版（[安装文档](https://1panel.cn/docs/installation/online_installation/)） |
| 域名 | 已购买并解析到服务器 IP（A 记录） |
| SSH | 能 SSH 到服务器 |

## 方法 1：Docker Compose（推荐 ✅）

### 优势

- 1Panel 内置 Docker + Compose 支持，点点鼠标就部署
- 镜像小（< 200MB），启动快
- 自动健康检查 + 自动重启
- 资源隔离，不污染宿主机

### 步骤

#### 1. 在 1Panel 创建网站 + 反向代理

进入 1Panel → **网站** → **创建网站**：

| 字段 | 值 |
|---|---|
| 主域名 | `your-domain.com` |
| 备注 | 个人作品集 |
| 协议 | HTTP（先不上 SSL，1Panel 自动申请） |
| 代理端口 | **3000** |
| 其他 | 默认 |

创建后 1Panel 会自动生成 Nginx 反向代理配置，把外部 80/443 转到容器 3000。

#### 2. 创建应用（Docker Compose）

进入 1Panel → **应用商店** → 顶部搜索 "自定义" 或 **容器** → **创建容器**：

**方式 A：直接用预构建镜像（推荐）**

仓库：`ghcr.io/zxerai/personal-website:latest`

如果你的 GitHub Actions 配置了自动构建镜像（详见后文），这里填 GHCR 镜像地址。

**方式 B：本地构建**

如果服务器上 git clone 了仓库，进入 1Panel 的"应用商店 → 自定义 Compose"，粘贴 `docker-compose.yml` 内容（或上传文件），然后启动。

#### 3. 配置环境变量

| 变量 | 值 | 必填 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | ✅ |
| `NODE_ENV` | `production` | ✅ |
| `PORT` | `3000` | ✅（与反代端口一致） |
| `HOSTNAME` | `0.0.0.0` | ✅ |

#### 4. 配置域名 + SSL

1Panel → **网站** → 你的网站 → **HTTPS** → **申请 Let's Encrypt 证书** → 启用 HSTS。

#### 5. 验证

```bash
# SSH 到服务器
ssh user@your-server

# 查看容器状态
docker ps | grep personal-website

# 查看日志
docker logs personal-website --tail 50

# 访问测试
curl -I https://your-domain.com
```

---

## 方法 2：直接 Node.js + PM2（备选）

适合不想用 Docker 的场景（资源更小、启动更快）。

### 步骤

#### 1. 在 1Panel 安装 Node.js 运行时

1Panel → **应用商店** → 搜索 "Node.js" → 安装。

推荐 Node.js 20+。

#### 2. SSH 上传代码并构建

```bash
ssh user@your-server

# 安装 pnpm
npm install -g pnpm@9

# 克隆代码
cd /opt
git clone https://github.com/zxerai/personal-website.git
cd personal-website

# 安装依赖
pnpm install --frozen-lockfile

# 构建（输出 standalone 到 .next/standalone/）
pnpm build

# 复制 public 和 .next/static 到 standalone（standalone 输出不含这些）
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

#### 3. 用 PM2 启动

```bash
# 全局安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js --env production

# 保存进程列表（开机自启）
pm2 save
pm2 startup  # 按提示执行返回的命令
```

#### 4. 配置反向代理

1Panel → **网站** → 你的网站 → 设置代理端口 = 3000。

---

## 自动构建 Docker 镜像（GitHub Actions）

如果你想让 GitHub 在每次 push 时自动构建 Docker 镜像并推送到 GHCR，可以加 `.github/workflows/docker.yml`：

```yaml
name: Docker Build & Push

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/zxerai/personal-website:latest
            ghcr.io/zxerai/personal-website:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

1Panel 容器配置里把 image 设为 `ghcr.io/zxerai/personal-website:latest` 即可。

> GHCR 包默认是私有的。要公开：在 GitHub 仓库页面 → Packages → 权限 → Change visibility → Public。

---

## 1Panel 常用操作

| 操作 | 路径 |
|---|---|
| 看容器日志 | 容器列表 → 容器名 → 日志 |
| 重启容器 | 容器列表 → 操作 → 重启 |
| 进入容器 shell | 容器列表 → 操作 → 终端 |
| 看资源占用 | 容器列表 → 资源列 |
| 申请 SSL | 网站 → 你的网站 → HTTPS → 申请 |
| 配置防火墙 | 防火墙 → 放行 80/443 |
| 看访问日志 | 网站 → 你的网站 → 日志 |

---

## 常见问题

### 容器启动后 502

- 检查端口：容器内 3000，1Panel 反代端口是否一致
- 检查环境变量 `NEXT_PUBLIC_SITE_URL` 必须用 HTTPS（影响 sitemap）

### 域名访问 404

- 1Panel 反代检查：网站 → 设置 → 代理地址 `http://127.0.0.1:3000`
- 容器内 curl `http://127.0.0.1:3000/zh` 看是否 200

### 内存不够

- 调小 docker-compose.yml 的 `deploy.resources.limits.memory: 256M`
- 或换 PM2 单实例模式（`instances: 1`）

### 更新部署

```bash
# 拉新镜像
docker pull ghcr.io/zxerai/personal-website:latest

# 重启容器
docker compose up -d
```

或 1Panel → 容器 → 重启。

---

## 推荐服务器配置

| 场景 | CPU | RAM | 磁盘 | 带宽 | 月成本估算 |
|---|---|---|---|---|---|
| 个人站（< 1 万 PV/月） | 1 核 | 1GB | 20GB | 1Mbps | ¥30-50 |
| 中等流量（1-10 万 PV） | 2 核 | 2GB | 40GB | 5Mbps | ¥80-150 |
| 高流量（> 10 万 PV） | 4 核 | 4GB | 80GB | 10Mbps | ¥200-400 |

国内云厂商推荐：阿里云、腾讯云、华为云 都支持 1Panel 镜像。轻量应用服务器 + 1Panel 镜像 = 10 分钟部署完成。