#!/bin/bash
set -euo pipefail

# 用法：
#   ./deployment/refresh.sh            # 仅 reload PM2 与 Nginx
#   ./deployment/refresh.sh --migrate  # 应用数据库迁移后 reload
#   ./deployment/refresh.sh --build    # 安装依赖并构建后 reload
#   组合使用：./deployment/refresh.sh --migrate --build

info() { echo -e "\033[32m[INFO]\033[0m $*"; }
warn() { echo -e "\033[33m[WARN]\033[0m $*"; }
error() { echo -e "\033[31m[ERROR]\033[0m $*"; }

DO_MIGRATE=false
DO_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --migrate) DO_MIGRATE=true ;;
    --build) DO_BUILD=true ;;
    *) warn "未知参数: $arg" ;;
  esac
done

# 切到项目根目录（脚本位于 deployment/）
cd "$(dirname "$0")/.."

info "📦 刷新开始：migrate=$DO_MIGRATE, build=$DO_BUILD"

if $DO_MIGRATE; then
  info "🔄 应用数据库迁移..."
  npx prisma migrate deploy || error "prisma migrate deploy 执行失败"
  npx prisma generate || warn "prisma generate 失败（可忽略）"
fi

if $DO_BUILD; then
  info "🏗️ 构建 Web 应用..."
  npm ci
  npm run build
fi

info "🔧 重新加载 PM2 应用..."
if pm2 list | grep -q "matter-touch"; then
  pm2 reload matter-touch || pm2 restart matter-touch
else
  warn "未发现 matter-touch 进程，尝试按配置启动..."
  pm2 start ecosystem.config.js --env production
fi
pm2 save || warn "pm2 save 失败（可忽略）"

info "🌐 重新加载 Nginx 配置..."
if sudo nginx -t; then
  sudo systemctl reload nginx
else
  error "Nginx 配置测试失败，请检查 /etc/nginx/conf.d/matter-touch.conf"
fi

info "✅ 刷新完成，状态检查："
pm2 status || true
sudo ss -ltnp | grep -E ':80|:443' || true
info "完成"