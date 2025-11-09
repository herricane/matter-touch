# 阿里云 ECS 环境配置清单

## 系统要求
- **操作系统**: Alibaba Cloud Linux 3.2104 LTS 64位 (推荐)
- **CPU**: 2核+
- **内存**: 4GB+
- **存储**: 50GB+ SSD

## 需要安装的软件

### 1. 系统更新和基础工具
```bash
sudo yum update -y
sudo yum install -y curl wget git vim nginx gcc make
```

### 2. Node.js LTS
```bash
# 安装 Node.js（如果尚未安装）
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi
node -v  # 验证安装
npm -v   # 验证安装
```

### 3. PostgreSQL
```bash
# 安装 PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib

# 初始化数据库（如果尚未初始化）
if [ ! -f "/var/lib/pgsql/data/postgresql.conf" ]; then
    sudo postgresql-setup initdb
fi

sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c "SELECT version();"  # 验证安装
```

### 4. PM2 (进程管理)
```bash
sudo npm install -g pm2
pm2 -v  # 验证安装
```

### 5. 其他必要工具
```bash
# 安装 PM2（如果尚未安装）
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# 安装 tsx（如果尚未安装）
if ! command -v tsx &> /dev/null; then
    sudo npm install -g tsx
fi

# 安装 Certbot（如果尚未安装）
if ! command -v certbot &> /dev/null; then
    sudo yum install -y certbot python3-certbot-nginx
fi
```

## 防火墙配置
```bash
# 使用 firewalld（Alibaba Cloud Linux 默认）
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 目录结构
```
/home/your-user/
├── matter-touch/          # 项目代码
├── logs/                  # 应用日志
├── backups/              # 数据库备份
└── ssl/                  # SSL 证书
```