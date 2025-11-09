#!/bin/bash
# Nginx 配置安装脚本

echo "🌐 配置 Nginx 反向代理..."

# 1. 备份默认配置
echo "📋 备份默认配置..."
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# 2. 复制配置文件
echo "📁 复制配置文件..."
sudo cp deployment/nginx-config.conf /etc/nginx/sites-available/matter-touch

# 3. 修改配置文件中的用户名和域名
echo "🔧 修改配置文件..."
sed -i "s/your-user/$USER/g" /etc/nginx/sites-available/matter-touch
sed -i "s/your-domain.com/your_actual_domain.com/g" /etc/nginx/sites-available/matter-touch

# 4. 启用站点
echo "✅ 启用站点..."
sudo ln -sf /etc/nginx/sites-available/matter-touch /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 5. 测试配置
echo "🧪 测试配置..."
sudo nginx -t

# 6. 重启 Nginx
echo "🔄 重启 Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Nginx 配置完成！"
echo "📋 下一步：配置 SSL 证书"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"