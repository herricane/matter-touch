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
  },
}

module.exports = nextConfig

