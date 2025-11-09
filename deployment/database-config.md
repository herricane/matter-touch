# 生产环境数据库配置

## 数据库连接字符串格式
```
postgresql://mattertouch:your_secure_password@localhost:5432/matter_touch?schema=public
```

## 生产环境 .env 文件配置
```env
# 数据库连接
DATABASE_URL="postgresql://mattertouch:your_secure_password@localhost:5432/matter_touch?schema=public"

# 应用配置
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"

# 安全配置（可选）
JWT_SECRET="your_jwt_secret_here"
SESSION_SECRET="your_session_secret_here"
```

## 数据库初始化步骤

### 1. 在 ECS 上执行数据库脚本
```bash
# 给脚本执行权限
chmod +x deployment/setup-postgresql.sh

# 执行脚本（记得修改密码）
./deployment/setup-postgresql.sh
```

### 2. 本地数据库迁移到生产环境
```bash
# 在本地导出数据
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > migration.sql

# 或者使用 Prisma Studio 导出数据
npx prisma studio
```

### 3. 在生产环境执行迁移
```bash
# 连接生产数据库
psql $DATABASE_URL < migration.sql

# 或者使用 Prisma 迁移
npx prisma migrate deploy
```

## 数据库性能优化

### 1. PostgreSQL 配置优化
编辑 `/var/lib/pgsql/data/postgresql.conf`：
```
# 内存配置
shared_buffers = 256MB
work_mem = 4MB
maintenance_work_mem = 64MB

# 连接配置
max_connections = 100

# 查询优化
effective_cache_size = 1GB
random_page_cost = 1.1
```

### 2. 索引优化
```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
```

## 数据库监控

### 1. 查询性能监控
```sql
-- 查看慢查询
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC;
```

### 2. 连接数监控
```sql
-- 查看当前连接数
SELECT count(*) FROM pg_stat_activity;

-- 查看连接详情
SELECT datname, usename, application_name, client_addr, state
FROM pg_stat_activity;
```