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

#### 1. SSH 到服务器并拉代码

```bash
ssh root@your-server

# 安装 git（如未装）
apt update && apt install -y git  # Ubuntu/Debian
# 或 yum install -y git  # CentOS

# 拉代码
cd /opt
git clone https://github.com/zxerai/personal-website.git
cd personal-website
```

#### 2. 在 1Panel 创建网站 + 反向代理

进入 1Panel → **网站** → **创建网站**：

| 字段 | 值 |
|---|---|
| 主域名 | `your-domain.com` |
| 备注 | 个人作品集 |
| 协议 | HTTP（先不上 SSL，1Panel 自动申请） |
| 代理端口 | **3000** |
| 其他 | 默认 |

创建后 1Panel 会自动生成 Nginx 反向代理配置，把外部 80/443 转到容器 3000。

#### 3. 修改 docker-compose.yml 的 `NEXT_PUBLIC_SITE_URL`

```bash
# 编辑环境变量
sed -i 's|NEXT_PUBLIC_SITE_URL=https://your-domain.com|NEXT_PUBLIC_SITE_URL=https://你的域名.com|' docker-compose.yml

# 验证
grep NEXT_PUBLIC_SITE_URL docker-compose.yml
```

#### 4. 构建并启动容器（本地构建，默认方式）

**方式 A：本地构建（默认 ✅）**

`docker-compose.yml` 默认配置 `build: .`，会在服务器上本地构建镜像：

```bash
cd /opt/personal-website

# 构建并后台启动
docker compose up -d --build

# 查看进度（首次构建约 3-5 分钟）
docker compose logs -f
```

输出成功示例：
```
[+] Building 65.2s (15/15) FINISHED
[+] Running 2/2
 ✔ Network personal-website_default  Created
 ✔ Container personal-website        Started
```

**方式 B：拉预构建镜像（进阶，需要先配置 GH Actions）**

如果之前已经配置了 `.github/workflows/docker.yml` 并成功推送镜像到 GHCR，可以编辑 `docker-compose.yml`：

```yaml
services:
  personal-website:
    image: ghcr.io/zxerai/personal-website:latest  # 取消注释
    # build:  # 注释掉
    #   context: .
    #   dockerfile: Dockerfile
```

然后：
```bash
docker compose pull
docker compose up -d
```

> 镜像 GHCR 默认是私有的。要公开：在 GitHub 仓库页面 → 右上 Packages → 点击 personal-website → Package settings → Change visibility → Public。

#### 5. 配置域名 + SSL

1Panel → **网站** → 你的网站 → **HTTPS** → **申请 Let's Encrypt 证书** → 启用 HSTS。

#### 6. 验证

```bash
# SSH 到服务器
ssh root@your-server

# 查看容器状态
docker ps | grep personal-website
# 应该看到 personal-website Up X minutes (healthy)

# 查看日志
docker logs personal-website --tail 50

# 容器内测试
docker exec personal-website wget -q --spider http://localhost:3000/zh
echo "OK"  # 应该输出 OK

# 外部测试
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

## 自动构建 Docker 镜像（GitHub Actions，已预置 ✅）

仓库已包含 `.github/workflows/docker.yml`：每次 push 到 main 自动构建并推送镜像到 GHCR（`ghcr.io/zxerai/personal-website:latest`）。

**使用步骤**：

1. 第一次 push 触发 workflow 后，等待 Actions 跑完（约 3-5 分钟）
2. 在 GitHub 仓库 → Actions 页面确认 workflow 成功
3. 第一次推镜像后 GHCR 包默认是**私有**。要公开访问：
   - GitHub 仓库 → 右上角头像 → **Your packages**
   - 点 `personal-website` → **Package settings** → **Change visibility** → **Public**
   - 或者在仓库 Settings → Packages → 设置默认 visibility
4. 在服务器上编辑 `docker-compose.yml`，把 `build:` 段注释掉、取消 `image:` 注释
5. 后续更新只要 `git pull` + `docker compose pull && docker compose up -d`

> **首次部署建议**：直接用本地 build（方式 A），不需要等 GitHub Actions。Actions 是后续更新优化用。

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