/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 本地图片不需要配置 domains
    // 如果需要外部图片，使用 remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
    // 优化图片加载
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 优化构建性能
  experimental: {
    optimizePackageImports: ['@prisma/client'],
    outputFileTracingIncludes: {
      '/*': ['./node_modules/.prisma/client/**/*'],
    },
  },
  // 优化 webpack 配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig

