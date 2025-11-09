#!/bin/bash
# PostgreSQL 生产环境配置脚本（适配 Alibaba Cloud Linux 3）

echo "🗄️  PostgreSQL 生产环境配置开始..."

# 检查是否已初始化
if [ ! -f "/var/lib/pgsql/data/postgresql.conf" ]; then
    echo "🔧 初始化 PostgreSQL 数据库..."
    sudo postgresql-setup initdb
fi

# 启动并启用 PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql << EOF
-- 创建新用户
CREATE USER mattertouch WITH PASSWORD 'your_secure_password_here';

-- 创建数据库
CREATE DATABASE matter_touch OWNER mattertouch;

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE matter_touch TO mattertouch;

-- 连接到数据库并设置 schema 权限
\c matter_touch;
GRANT ALL ON SCHEMA public TO mattertouch;
ALTER SCHEMA public OWNER TO mattertouch;

-- 显示创建结果
\du
\l
EOF

# 配置 PostgreSQL 监听地址
echo "🔧 配置 PostgreSQL 监听地址..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/'" /var/lib/pgsql/data/postgresql.conf

# 配置访问权限
echo "🔒 配置访问权限..."
echo "host    matter_touch    mattertouch    0.0.0.0/0    md5" | sudo tee -a /var/lib/pgsql/data/pg_hba.conf

# 重启 PostgreSQL 服务
echo "🔄 重启 PostgreSQL 服务..."
sudo systemctl restart postgresql

# 设置自动备份
echo "💾 设置自动备份..."
mkdir -p ~/backups/postgresql
cat > ~/backups/postgresql/backup.sh << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="/home/$(whoami)/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/matter_touch_backup_$DATE.sql"

# 创建备份
sudo -u postgres pg_dump matter_touch > "$BACKUP_FILE"

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "备份完成: $BACKUP_FILE"
BACKUP_EOF

chmod +x ~/backups/postgresql/backup.sh

# 添加定时任务（每天凌晨 2 点备份）
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backups/postgresql/backup.sh") | crontab -

echo "✅ PostgreSQL 生产环境配置完成！"
echo "📋 重要信息："
echo "   - 数据库: matter_touch"
echo "   - 用户: mattertouch"
echo "   - 备份目录: ~/backups/postgresql"
echo "   - 备份时间: 每天凌晨 2 点"
echo "⚠️  请修改脚本中的默认密码！"