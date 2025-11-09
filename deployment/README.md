# 🚀 部署简明指南（Deployment README）

本文件整合了所有部署说明，保留最核心的脚本与配置，帮助你在阿里云 ECS（或任意 RHEL/CentOS 系）快速上线。

## 目录结构（保留项）
- `deployment/deploy-all.sh` 一键完整部署脚本（核心）
- `deployment/nginx-config.conf` Nginx 反向代理配置模板
- `deployment/pm2-manager.sh` PM2 管理辅助脚本

其余文档与冗余脚本已移除，说明合并于本文档。

## 使用场景与用法
- 全新服务器部署（推荐）
  - 适用：首次在 ECS 上线，或环境损坏需要重建
  - 用法：
    ```bash
    chmod +x deployment/*.sh
    ./deployment/deploy-all.sh your-domain.com
    ```
- 半途失败后继续部署
  - 适用：上次执行中断（比如网络/证书问题），再次运行自动跳过已完成步骤
  - 用法：
    ```bash
    ./deployment/deploy-all.sh your-domain.com
    ```
- 管理与排障（PM2/Nginx）
  - 用法：
    ```bash
    # PM2 管理
    ./deployment/pm2-manager.sh status
    ./deployment/pm2-manager.sh logs
    ./deployment/pm2-manager.sh restart

    # 检查 Nginx 与端口监听
    sudo nginx -t && sudo systemctl restart nginx
    sudo ss -ltnp | grep -E ':80|:443'
    ```

- 快速刷新（代码或数据库更新后）
  - 用法：
    ```bash
    # 仅重载 PM2 与 Nginx
    ./deployment/refresh.sh

    # 应用最新数据库迁移（Prisma）后重载
    ./deployment/refresh.sh --migrate

    # 重新安装依赖并构建后重载（适合前端代码更新）
    ./deployment/refresh.sh --build

    # 组合使用（数据库迁移 + 构建 + 重载）
    ./deployment/refresh.sh --migrate --build
    ```

## 环境前提
- 系统：Alibaba Cloud Linux/CentOS/RHEL（yum 系统）
- 用户：非 root 用户执行脚本（脚本中使用 sudo）
- 端口：安全组与防火墙放行 `80/443`
- 域名：解析到 ECS 公网 IP，脚本会申请并配置 SSL

## 一键部署会做什么
- 安装 Node.js、Nginx、PostgreSQL、PM2、Certbot（按需）
- 自动配置 PostgreSQL（pg_hba、密码算法、用户密码与权限、data 目录检测）
- 同步 Prisma Schema：有迁移文件则 `migrate deploy`，否则自动 `db push`
- 生成 Prisma 客户端并初始化数据（存在性检查，避免 P2021）
- 构建 Next.js，配置 Nginx 到 `conf.d` 并开放防火墙 `http/https`
- 配置 PM2 自启动（注入 Node PATH；失败不阻塞）
- 验证端口监听与证书文件存在性

## 常用检查与排障
- 数据库
  ```bash
  sudo -u postgres psql -d matter_touch -c "\\dt '"Product"'""
  sudo -u postgres psql -d matter_touch -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='Product');"
  ```
- 端口与服务
  ```bash
  pm2 status
  sudo systemctl status nginx postgresql
  sudo ss -ltnp | grep -E ':80|:443'
  ```
- 证书
  ```bash
  sudo ls -l /etc/letsencrypt/live/your-domain.com/{fullchain.pem,privkey.pem}
  ```

## Nginx 配置模板说明（`deployment/nginx-config.conf`）
- 脚本会自动替换 `your-domain.com` 与 `your-user`，并安装到 `/etc/nginx/conf.d/matter-touch.conf`
- 统一通过 `127.0.0.1:3000` 代理到应用，避免 IPv6 解析造成的 502
- 已移除本地 alias，静态资源由上游 Next.js 提供，避免路径不一致导致样式缺失

## 注意事项
- `.env.production` 会由脚本生成并同步到 `.env`；确保 `DATABASE_URL` 指向 `matter_touch` 数据库且用户为 `mattertouch`
- 首次部署可能因证书签发导致 Nginx 重启后短暂无 443 监听；修复后再执行脚本可自动恢复
- 若使用 nvm，脚本会尝试加载；`pm2 startup` 已通过 sudo 注入 Node PATH；失败不阻塞，可按提示手工执行

## 需要你做的最少操作
- 克隆代码，准备域名解析到 ECS
- 执行：`./deployment/deploy-all.sh your-domain.com`
- 打开浏览器访问你的域名

若仍遇到问题，请收集以下输出反馈：
- `sudo nginx -t` 与 `/var/log/nginx/matter-touch-error.log` 最近 50 行
- `pm2 logs matter-touch --lines 200`
- `sudo ss -ltnp | grep -E ':80|:443'`