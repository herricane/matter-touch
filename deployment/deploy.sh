#!/bin/bash
# 生产环境部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始生产环境部署..."

# 1. 环境检查
echo "🔍 检查环境..."
if [ ! -f ".env.production" ]; then
    echo "❌ 未找到 .env.production 文件，请复制 .env.production.example 并修改配置"
    exit 1
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm ci --only=production

# 3. 数据库迁移
echo "🗄️ 执行数据库迁移..."
npx prisma migrate deploy

# 4. 生成 Prisma 客户端
echo "🔄 生成 Prisma 客户端..."
npx prisma generate

# 5. 构建应用
echo "🏗️  构建应用..."
npm run build

# 6. 启动应用（使用 PM2）
echo "🚀 启动应用..."
pm2 delete matter-touch 2>/dev/null || true
pm2 start npm --name "matter-touch" -- start -- --port 3000

# 7. 保存 PM2 配置
echo "💾 保存 PM2 配置..."
pm2 save
pm2 startup

echo "✅ 部署完成！"
echo "📋 应用状态："
pm2 status