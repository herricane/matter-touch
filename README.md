# Matter Touch - 个人品牌服饰网站

Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL + Prisma

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

**本地开发：**
```bash
# 复制示例文件并重命名为 .env.local（不会被 git 跟踪）
cp .env.local.example .env.local

# 然后编辑 .env.local，填入你的实际配置
# DATABASE_URL="postgresql://user:pass@localhost:5432/matter_touch?schema=public"
# SUPABASE_URL="https://xxxxx.supabase.co"  # 可选
# SUPABASE_SERVICE_ROLE="service-role-key"  # 可选
```

**生产环境（Vercel）：**
- 在 Vercel 项目 Settings → Environment Variables 中配置
- 参考 `.env.production.example` 中的变量列表

### 3. 初始化数据库（本地）

```bash
npm run db:generate
npm run db:push -- --accept-data-loss
npm run db:seed  # 开发环境（会清空数据）
# 或
npm run db:init  # 生产初始化（不会清空数据）
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 数据管理

- 主视觉图片：`app/config/imageAssets.ts`
- 系列信息：存储于数据库（`Collection` 表），通过 Prisma 读取
- 产品数据在数据库（Prisma + Postgres）。图片字段可存相对路径（本地 public）或 https（Supabase Storage）。

### 产品数据格式（简）

```ts
{
  name: string,
  description?: string,
  price?: number,
  imageUrl?: string,          // 主图
  hoverImageUrl?: string,     // 悬停图
  category: 'clothings' | 'accessories',
  // 详情
  colors?: string,            // JSON: ["黑色", "白色"]
  sizes?: string,             // JSON: ["S","M","L"]
  composition?: string,
  care?: string,
  galleryImages?: string,     // JSON: string[]
  detailImages?: string,      // JSON: string[]
  detailTexts?: string,       // JSON: string[]
  colorImages?: string        // JSON: { [color: string]: string } - 每个颜色对应单个图片
}
```

## 上传图片（Supabase Storage）

- 服务端 API：`POST /api/upload`
- Body（JSON）：
```json
{
  "filename": "clothings/product-9/main.webp",
  "contentType": "image/webp",
  "data": "<base64>"
}
```
- 返回：`{ url: "https://.../storage/v1/object/public/images/clothings/product-9/main.webp" }`
- 将该 url 写入数据库字段（如 imageUrl / galleryImages / colorImages 等）。

## 部署到 Vercel（使用 Supabase 作为数据库与存储）

1) 在 Vercel 连接本仓库后，配置环境变量（Production/Preview 都需）：
- `DATABASE_URL`：Supabase Postgres 连接串
- `SUPABASE_URL`：Supabase 项目 URL
- `SUPABASE_SERVICE_ROLE`：Service role key（仅服务端使用，不暴露到客户端）
- 可选 `SUPABASE_BUCKET`：默认为 `images`

2) Supabase 控制台：
- 创建 `images` bucket（可设为 public，或用私有 + 签名 URL）。
- 确保 Storage Policies 允许 service role 上传。

3) 构建与数据：
- **首次部署前，需要创建数据库表**：
  - 方法 1（推荐）：在本地运行 `npm run db:push`（需要配置 DATABASE_URL 环境变量）
  - 方法 2：通过 Supabase Studio 的 SQL Editor 手动创建表
  - 方法 3：部署后通过 API 端点创建（见下方）
- **首次部署后，需要初始化数据**：
  - 方法 1（推荐）：访问 `POST https://your-domain.vercel.app/api/init-db?secret=YOUR_SECRET`
    - 在 Vercel 环境变量中设置 `DB_INIT_SECRET`（可选，但建议设置）
    - 使用 curl 或 Postman 发送 POST 请求：
      ```bash
      curl -X POST "https://your-domain.vercel.app/api/init-db?secret=YOUR_SECRET"
      ```
  - 方法 2：使用 Vercel CLI 本地运行（需要配置 DATABASE_URL）：
    ```bash
    npx vercel env pull .env.local
    npm run db:init
    ```
  - 方法 3：通过 Supabase Studio 手动添加数据

4) 运行与兼容：
- `lib/prisma.ts` 已在检测到 `PRISMA_ACCELERATE_URL` 时启用 Accelerate，Serverless 更稳，本地不影响。
- `app/api/upload/route.ts` 使用 Supabase Storage 上传；未配置相关环境变量时，会返回 400，不影响本地使用 public 静态图片。

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

npm run db:generate  # 生成 Prisma Client
npm run db:push      # 推送 schema（开发）
npm run db:migrate   # 创建迁移（生产）
npm run db:studio    # 打开 Prisma Studio
npm run db:seed      # 开发填充（会清空数据）
npm run db:init      # 生产初始化（不会清空数据）
```

## 说明
- 本地：可继续使用 public/images 相对路径；也可配置 Supabase 变量直接使用云存储上传。
- 生产（Vercel）：数据库与图片均走 Supabase；前端 Image 组件已允许 https 源，无需改动。
