#!/bin/bash
# 一键部署脚本 - 完整部署流程

set -e

echo "🚀 开始完整部署流程..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：输出信息
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# 函数：检查软件是否已安装
check_and_install() {
    local cmd=$1
    local install_cmd=$2
    local package_name=$3
    
    if ! command -v $cmd &> /dev/null; then
        info "安装 $package_name..."
        eval $install_cmd
    else
        info "$package_name 已安装"
    fi
}

# 检查参数
if [ $# -ne 1 ]; then
    error "请提供域名参数"
    echo "用法: $0 your-domain.com"
    exit 1
fi

DOMAIN=$1

# 检查是否为 root 用户
if [ "$EUID" -eq 0 ]; then
    error "请不要以 root 用户运行此脚本"
fi

info "部署域名: $DOMAIN"

# 尝试加载 nvm（如果存在），确保 node/npm 在当前会话 PATH 中
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    info "检测到 nvm，加载 Node 环境..."
    . "$HOME/.nvm/nvm.sh"
fi

# 1. 系统更新和基础安装（适配 Alibaba Cloud Linux 3）
info "📦 系统更新和基础安装..."
sudo yum update -y

# 基础工具检查安装
check_and_install "curl" "sudo yum install -y curl" "curl"
check_and_install "wget" "sudo yum install -y wget" "wget"
check_and_install "git" "sudo yum install -y git" "git"
check_and_install "vim" "sudo yum install -y vim" "vim"
check_and_install "nginx" "sudo yum install -y nginx" "nginx"
check_and_install "gcc" "sudo yum install -y gcc" "gcc"
check_and_install "make" "sudo yum install -y make" "make"
check_and_install "firewall-cmd" "sudo yum install -y firewalld" "firewalld"

# 2. 安装 Node.js（使用 Nodesource）
info "📦 安装 Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
else
    info "Node.js 已安装"
fi

# 3. 安装 PostgreSQL（使用官方仓库）
info "🗄️ 安装 PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    sudo yum install -y postgresql-server postgresql-contrib
else
    info "PostgreSQL 已安装"
fi

# 4. 安装其他工具（在当前用户环境安装，避免 sudo 环境缺失 npm）
info "🔧 安装其他工具..."

# 统一获取 npm 二进制路径
NPM_BIN=$(command -v npm || true)
if [ -z "$NPM_BIN" ]; then
    warn "未检测到 npm。若使用 nvm，请先加载: source \$HOME/.nvm/nvm.sh"
fi

# 安装 pm2（优先使用当前用户 npm，全局安装失败则回退使用 sudo 并保留 PATH）
if ! command -v pm2 &> /dev/null; then
    if [ -n "$NPM_BIN" ]; then
        info "安装 pm2..."
        "$NPM_BIN" install -g pm2 || sudo env "PATH=$PATH" "$NPM_BIN" install -g pm2
    else
        error "找不到 npm，无法安装 pm2。请确保 Node.js/npm 已可用后重试"
    fi
else
    info "pm2 已安装"
fi

# 安装 tsx
if ! command -v tsx &> /dev/null; then
    if [ -n "$NPM_BIN" ]; then
        info "安装 tsx..."
        "$NPM_BIN" install -g tsx || sudo env "PATH=$PATH" "$NPM_BIN" install -g tsx
    else
        error "找不到 npm，无法安装 tsx。请确保 Node.js/npm 已可用后重试"
    fi
else
    info "tsx 已安装"
fi

check_and_install "certbot" "sudo yum install -y certbot python3-certbot-nginx" "Certbot"

# 5. 配置防火墙（使用 firewalld）
info "🔥 配置防火墙..."
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 6. 初始化 PostgreSQL 数据库
info "🗄️ 初始化 PostgreSQL 数据库..."
# 检查是否已初始化
if [ ! -f "/var/lib/pgsql/data/postgresql.conf" ]; then
    sudo postgresql-setup initdb
fi
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 配置 PostgreSQL
info "🔧 配置 PostgreSQL..."
read -p "请输入数据库密码: " DB_PASSWORD
sudo -u postgres psql << EOF
CREATE USER mattertouch WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE matter_touch OWNER mattertouch;
GRANT ALL PRIVILEGES ON DATABASE matter_touch TO mattertouch;
\c matter_touch;
GRANT ALL ON SCHEMA public TO mattertouch;
ALTER SCHEMA public OWNER TO mattertouch;
EOF

# 7. 创建环境变量文件
info "⚙️ 创建环境变量文件..."
cp .env.production.example .env.production
sed -i "s/your_secure_password/$DB_PASSWORD/g" .env.production
sed -i "s/your-domain.com/$DOMAIN/g" .env.production
sed -i "s/your-secure-jwt-secret/$(openssl rand -base64 32)/g" .env.production
sed -i "s/your-secure-session-secret/$(openssl rand -base64 32)/g" .env.production

# 为 Prisma CLI 提供环境文件（Prisma 默认读取 .env）
if [ ! -f ".env" ]; then
    cp .env.production .env
    info ".env 不存在，已从 .env.production 复制"
else
    info ".env 已存在，跳过复制"
fi

# 8. 安装项目依赖
info "📦 安装项目依赖..."
npm ci

# 9. 数据库迁移
info "🔄 数据库迁移..."
npx prisma migrate deploy
npx prisma generate

# 9.5 数据库初始化（仅在数据库为空时执行）
info "🌱 使用 Prisma 初始化数据库初始数据..."
npm run db:init || warn "Prisma 初始化脚本执行失败，请检查数据库连接与日志"

# 10. 构建应用
info "🏗️ 构建应用..."
npm run build

# 11. 配置 Nginx
info "🌐 配置 Nginx..."
sudo cp deployment/nginx-config.conf /etc/nginx/sites-available/matter-touch
sudo sed -i "s/your-user/$USER/g" /etc/nginx/sites-available/matter-touch
sudo sed -i "s/your_actual_domain.com/$DOMAIN/g" /etc/nginx/sites-available/matter-touch
sudo ln -sf /etc/nginx/sites-available/matter-touch /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 12. 配置 PM2
info "🔧 配置 PM2..."
mkdir -p logs
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u $USER --hp $HOME

# 13. 配置 SSL 证书
info "🔒 配置 SSL 证书..."
sudo systemctl stop nginx
sudo certbot certonly --standalone \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# 更新 Nginx SSL 配置
sudo sed -i "/listen 443 ssl http2;/a\\    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;" /etc/nginx/sites-available/matter-touch
sudo sed -i "/ssl_certificate.*fullchain.pem;/a\\    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;" /etc/nginx/sites-available/matter-touch
sudo nginx -t && sudo systemctl restart nginx

# 14. 设置自动续期
echo "0 2 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'" | sudo tee -a /etc/crontab

# 15. 创建备份脚本
info "💾 创建备份脚本..."
mkdir -p ~/backups/postgresql
cat > ~/backups/postgresql/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/$(whoami)/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/matter_touch_backup_$DATE.sql"
sudo -u postgres pg_dump matter_touch > "$BACKUP_FILE"
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF
chmod +x ~/backups/postgresql/backup.sh
echo "0 2 * * * ~/backups/postgresql/backup.sh" | crontab -

# 16. 最终检查
info "🔍 最终检查..."
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

info "🎉 部署完成！"
echo ""
echo "📋 部署信息："
echo "   应用地址: https://$DOMAIN"
echo "   PM2 管理: pm2 status"
echo "   日志查看: pm2 logs"
echo "   应用管理: ./deployment/pm2-manager.sh"
echo ""
echo "🔧 常用命令："
echo "   重启应用: pm2 restart matter-touch"
echo "   查看状态: pm2 status"
echo "   查看日志: pm2 logs"
echo "   备份数据库: ~/backups/postgresql/backup.sh"
echo ""
echo "⚠️  重要提醒："
echo "   1. 请妥善保存 .env.production 文件"
echo "   2. 定期备份数据库"
echo "   3. 监控服务器资源使用情况"
echo "   4. 及时更新系统和软件包"