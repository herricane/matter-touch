# 🚀 阿里云 ECS 部署完整指南

## 📋 部署概述

本指南将帮助你将 Next.js + PostgreSQL + Prisma 项目从本地开发环境部署到阿里云 ECS 生产环境。

## 🎯 快速开始（推荐）

### 一键部署
```bash
# 1. 克隆项目到 ECS
git clone <your-repo-url> matter-touch
cd matter-touch

# 2. 给脚本执行权限
chmod +x deployment/*.sh

# 3. 执行一键部署（替换 your-domain.com 为你的域名）
./deployment/deploy-all.sh your-domain.com
```

部署脚本会在数据库迁移后自动执行 Prisma 初始化脚本（`prisma/init.ts`），仅在数据库为空时创建初始条目。

## 🔧 分步部署

### 步骤 1: 系统准备
```bash
# 更新系统
sudo yum update -y

# 安装基础软件
sudo yum install -y curl wget git vim nginx gcc make firewalld
```

### 1. 系统要求
- **操作系统**: Alibaba Cloud Linux 3.2104 LTS 64位 (推荐)
- **CPU**: 2核+
- **内存**: 4GB+
- **存储**: 50GB+ SSD

### 步骤 2: 环境配置
按照以下顺序执行脚本：

1. **系统环境配置**: `./deployment/ecs-setup.md`
2. **数据库配置**: `./deployment/setup-postgresql.sh`
3. **Nginx 配置**: `./deployment/setup-nginx.sh`
4. **应用部署**: `./deployment/deploy.sh`
5. **PM2 配置**: `./deployment/setup-pm2.sh`
6. **SSL 配置**: `./deployment/setup-ssl.sh your-domain.com`

### Prisma 数据初始化（可选手动执行）
如果你未使用一键部署或需要手动初始化生产环境的初始数据，可执行：
```bash
npm run db:init
```
说明：该脚本会检测数据库中是否已有产品数据，若已有则跳过，不会覆盖现有数据。

## 📁 部署文件说明

### 配置文件
- `.env.production.example` - 生产环境变量模板
- `ecosystem.config.js` - PM2 进程管理配置
- `deployment/nginx-config.conf` - Nginx 反向代理配置

### 部署脚本
- `deployment/deploy-all.sh` - 一键完整部署
- `deployment/setup-postgresql.sh` - PostgreSQL 配置
- `deployment/setup-nginx.sh` - Nginx 配置
- `deployment/deploy.sh` - 应用部署
- `deployment/setup-pm2.sh` - PM2 配置
- `deployment/setup-ssl.sh` - SSL 证书配置
- `deployment/pm2-manager.sh` - PM2 管理工具

### 文档
- `deployment/ecs-setup.md` - ECS 环境配置清单
- `deployment/database-config.md` - 数据库配置指南
- `deployment/ssl-config.md` - SSL 证书配置指南

## 🚀 部署后操作

### 1. 验证部署
```bash
# 检查应用状态
pm2 status

# 检查服务状态
sudo systemctl status nginx
sudo systemctl status postgresql

# 测试网站
curl -I https://your-domain.com
```

### 2. 管理应用
```bash
# 使用管理脚本
./deployment/pm2-manager.sh status
./deployment/pm2-manager.sh logs
./deployment/pm2-manager.sh restart

# 或者直接使用 PM2 命令
pm2 status
pm2 logs matter-touch
pm2 restart matter-touch
```

### 3. 备份和监控
```bash
# 手动备份数据库
~/backups/postgresql/backup.sh

# 查看定时任务
crontab -l

# 查看系统日志
sudo journalctl -f
```

## 🔒 安全配置

### 1. 防火墙规则
```bash
# 查看防火墙状态
sudo firewall-cmd --state

# 只允许必要的端口
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 数据库安全
- 使用强密码
- 限制数据库访问权限
- 定期备份数据
- 监控数据库连接

### 3. SSL/TLS 配置
- 使用强加密算法
- 启用 HSTS
- 配置自动续期
- 定期更新证书

## 🐛 故障排除

### 常见问题

1. **应用无法启动**
   ```bash
   # 查看 PM2 日志
   pm2 logs matter-touch
   
   # 检查环境变量
   cat .env.production
   
   # 检查端口占用
   sudo netstat -tlnp | grep :3000
   ```

2. **Nginx 配置错误**
   ```bash
   # 测试配置
   sudo nginx -t
   
   # 查看错误日志
   sudo tail -f /var/log/nginx/error.log
   ```

3. **数据库连接失败**
   ```bash
   # 检查 PostgreSQL 状态
   sudo systemctl status postgresql

   # 检查连接字符串
   grep DATABASE_URL .env.production

   # 测试连接
   psql $DATABASE_URL -c "SELECT version();"
   ```

4. **SSL 证书问题**
   ```bash
   # 检查证书状态
   sudo certbot certificates
   
   # 手动续期测试
   sudo certbot renew --dry-run
   
   # 查看 Certbot 日志
   sudo tail -f /var/log/letsencrypt/letsencrypt.log
   ```

## 📊 性能优化

### 1. 应用优化
- 启用 Next.js 生产模式
- 使用 PM2 集群模式
- 配置适当的内存限制
- 监控内存使用情况

### 2. 数据库优化
- 创建适当的索引
- 配置连接池
- 定期清理日志
- 监控查询性能

### 3. Nginx 优化
- 启用 Gzip 压缩
- 配置静态资源缓存
- 优化代理设置
- 监控访问日志

## 🔍 监控和维护

### 1. 系统监控
```bash
# 查看系统资源
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 2. 应用监控
```bash
# PM2 监控面板
pm2 monit

# 查看应用日志
pm2 logs matter-touch --lines 50

# 查看进程信息
pm2 info matter-touch
```

### 3. 定期维护
- 更新系统包：`sudo yum update`
- 更新 Node.js：使用 NodeSource
- 备份数据库：自动备份已配置
- 清理日志：定期清理应用和系统日志

## 🆘 紧急恢复

### 1. 应用崩溃
```bash
# 重启应用
pm2 restart matter-touch

# 如果 PM2 无法工作
pm2 kill
pm2 start ecosystem.config.js --env production
```

### 2. 数据库恢复
```bash
# 从备份恢复（找到最新的备份文件）
LATEST_BACKUP=$(ls -t ~/backups/postgresql/*.sql | head -1)
psql $DATABASE_URL < $LATEST_BACKUP
```

### 3. 完整重启
```bash
# 重启所有服务
sudo systemctl restart postgresql
pm2 restart matter-touch
sudo systemctl restart nginx
```

## 📞 技术支持

如果遇到问题，请按以下顺序检查：
1. 查看应用日志：`pm2 logs matter-touch`
2. 查看系统日志：`sudo journalctl -f`
3. 检查配置文件语法
4. 验证网络连接
5. 查看本指南的故障排除部分

## 🎉 部署完成！

恭喜你！🎊 你的 Next.js 应用已经成功部署到阿里云 ECS 生产环境。

### 下一步建议：
1. 配置域名解析到你的 ECS 公网 IP
2. 测试所有功能是否正常工作
3. 设置监控告警
4. 定期备份和维护
5. 考虑使用 CDN 加速静态资源

祝你的应用运行顺利！🚀