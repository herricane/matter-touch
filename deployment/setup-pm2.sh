#!/bin/bash
# PM2 进程管理配置脚本

echo "🔧 配置 PM2 进程管理..."

# 1. 创建日志目录
echo "📁 创建日志目录..."
mkdir -p logs

# 2. 启动应用
echo "🚀 启动应用..."
pm2 start ecosystem.config.js --env production

# 3. 保存配置
echo "💾 保存 PM2 配置..."
pm2 save

# 4. 设置开机启动
echo "🔄 设置开机启动..."
pm2 startup systemd -u $USER --hp $HOME

# 5. 显示状态
echo "📊 应用状态："
pm2 status

echo "✅ PM2 配置完成！"
echo "📋 常用命令："
echo "   pm2 status          # 查看状态"
echo "   pm2 logs            # 查看日志"
echo "   pm2 restart matter-touch  # 重启应用"
echo "   pm2 stop matter-touch     # 停止应用"
echo "   pm2 monit           # 监控面板"