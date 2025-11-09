#!/bin/bash
# SSL 证书配置脚本

set -e

# 检查参数
if [ $# -ne 1 ]; then
    echo "用法: $0 your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "🔒 开始配置 SSL 证书..."

# 检查 Certbot 是否已安装
if ! command -v certbot &> /dev/null; then
    echo "📦 安装 Certbot..."
    sudo yum install -y certbot python3-certbot-nginx
fi

# 停止 Nginx
echo "🛑 停止 Nginx..."
sudo systemctl stop nginx

# 获取 SSL 证书
echo "📜 获取 SSL 证书..."
sudo certbot certonly --standalone \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# 4. 检查证书是否成功获取
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "❌ SSL 证书获取失败"
    exit 1
fi

# 5. 更新 Nginx 配置
echo "🔧 更新 Nginx 配置..."
sudo sed -i "s/your_actual_domain.com/$DOMAIN/g" /etc/nginx/sites-available/matter-touch

# 6. 创建 SSL 配置的 include 文件
echo "📄 创建 SSL 配置..."
sudo tee /etc/nginx/snippets/ssl-$DOMAIN.conf > /dev/null <<EOF
ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
EOF

# 7. 启动 Nginx
echo "🚀 启动 Nginx..."
sudo systemctl start nginx

# 8. 设置自动续期
echo "🔄 设置自动续期..."
echo "0 2 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'" | sudo tee -a /etc/crontab

# 9. 测试 HTTPS
echo "🧪 测试 HTTPS..."
sleep 5
curl -I https://$DOMAIN

echo "✅ SSL 证书配置完成！"
echo "📋 证书信息："
echo "   域名: $DOMAIN"
echo "   证书路径: /etc/letsencrypt/live/$DOMAIN/"
echo "   自动续期: 已配置"
echo "   测试: https://$DOMAIN"