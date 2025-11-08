/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 本地图片不需要配置 domains
    // 如果需要外部图片，使用 remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 优化图片加载
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig

