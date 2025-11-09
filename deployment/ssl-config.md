# SSL 证书和 HTTPS 配置指南

## 自动配置（推荐）

### 1. 运行 SSL 配置脚本
```bash
# 给脚本执行权限
chmod +x deployment/setup-ssl.sh

# 执行脚本（替换为你的域名）
./deployment/setup-ssl.sh your-domain.com
```

## 手动配置

### 1. 安装 Certbot
```bash
# 检查并安装 Certbot（如果尚未安装）
if ! command -v certbot &> /dev/null; then
    sudo yum install -y certbot python3-certbot-nginx
fi
```

### 2. 获取 SSL 证书
```bash
# 获取证书（自动配置 Nginx）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 或者获取证书（手动配置）
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

### 3. 更新 Nginx 配置
编辑 `/etc/nginx/sites-available/matter-touch`：
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL 安全设置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HTTP 严格传输安全 (HSTS)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 包含主要配置
    include /etc/nginx/sites-available/matter-touch-http;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. 设置自动续期
```bash
# 测试自动续期
sudo certbot renew --dry-run

# 添加定时任务
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
```

## 安全最佳实践

### 1. SSL 安全配置
```nginx
# 强加密算法
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;

# 会话缓存
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 2. 安全头配置
```nginx
# 基础安全头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# CSP（内容安全策略）
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';" always;
```

## 故障排除

### 1. 证书获取失败
```bash
# 检查域名解析
dig your-domain.com

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# 查看 Certbot 日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### 2. Nginx 配置测试
```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```