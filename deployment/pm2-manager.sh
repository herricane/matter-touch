#!/bin/bash
# PM2 管理脚本

case "$1" in
    start)
        echo "🚀 启动应用..."
        pm2 start ecosystem.config.js --env production
        ;;
    stop)
        echo "⏹️  停止应用..."
        pm2 stop matter-touch
        ;;
    restart)
        echo "🔄 重启应用..."
        pm2 restart matter-touch
        ;;
    reload)
        echo "🔄 重载应用（零停机）..."
        pm2 reload matter-touch
        ;;
    status)
        echo "📊 应用状态："
        pm2 status
        ;;
    logs)
        echo "📋 查看日志："
        pm2 logs matter-touch
        ;;
    monitor)
        echo "📈 监控面板："
        pm2 monit
        ;;
    backup)
        echo "💾 备份 PM2 配置..."
        pm2 save
        echo "✅ 备份完成"
        ;;
    *)
        echo "用法: $0 {start|stop|restart|reload|status|logs|monitor|backup}"
        echo ""
        echo "命令说明："
        echo "  start    - 启动应用"
        echo "  stop     - 停止应用"
        echo "  restart  - 重启应用"
        echo "  reload   - 零停机重载"
        echo "  status   - 查看状态"
        echo "  logs     - 查看日志"
        echo "  monitor  - 监控面板"
        echo "  backup   - 备份配置"
        exit 1
        ;;
esac