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

- 主视觉图片：存储于数据库（`HeroImage` 表），通过 Prisma 读取
- 系列信息：存储于数据库（`Collection` 表），通过 Prisma 读取
- 产品数据：存储于数据库（`Product` 表），通过 Prisma 读取
- 图片字段可存相对路径（本地 public）或 https（Supabase Storage）

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

  **方法 1：通过 Supabase Studio SQL Editor（推荐，最简单）**
  
  1. 登录 [Supabase 控制台](https://app.supabase.com)，进入你的项目
  2. 在左侧菜单找到 **SQL Editor**（SQL 编辑器）
  3. 点击 **New query**（新建查询）
  4. 复制并执行以下 SQL 语句：
  
  ```sql
  -- 创建 Collection 表
  CREATE TABLE "Collection" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "coverImageUrl" TEXT,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
  );
  
  -- 创建 Product 表
  CREATE TABLE "Product" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "price" DOUBLE PRECISION,
      "imageUrl" TEXT,
      "hoverImageUrl" TEXT,
      "colors" TEXT,
      "sizes" TEXT,
      "composition" TEXT,
      "care" TEXT,
      "galleryImages" TEXT,
      "detailTexts" TEXT,
      "detailImages" TEXT,
      "colorImages" TEXT,
      "collectionId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
  );
  
  -- 创建唯一索引（Collection 的 slug 字段）
  CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");
  
  -- 创建外键约束（Product 关联到 Collection）
  ALTER TABLE "Product" ADD CONSTRAINT "Product_collectionId_fkey" 
      FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE;
  ```
  
  5. 点击 **Run**（运行）按钮执行 SQL
  6. 确认执行成功（应该看到 "Success. No rows returned" 或类似的成功消息）

  **方法 2：通过本地运行 Prisma 命令（需要配置 DATABASE_URL）**
  
  1. **获取 Supabase 数据库连接字符串**：
     - 在 Supabase 项目设置中找到 **Settings** → **Database**
     - 找到 **Connection string** 部分
     - 选择 **URI** 格式，复制连接字符串
     - 格式类似：`postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
     - ⚠️ 注意：Supabase 提供了两种连接方式：
       - **Session mode**（会话模式）：端口 `5432`，适合直接连接
       - **Transaction mode**（事务模式）：端口 `6543`，适合连接池，推荐用于 Prisma
  
  2. **在项目根目录配置环境变量**：
     ```bash
     # 创建或编辑 .env 文件
     DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
     ```
     ⚠️ 注意：
     - 将 `[PROJECT-REF]` 替换为你的项目引用 ID（在 Supabase 项目 URL 中可以找到，格式类似 `abcdefghijklmnop`）
     - 将 `[YOUR-PASSWORD]` 替换为你的数据库密码（如果忘记，可以在 Supabase 设置中重置）
     - 将 `[REGION]` 替换为你的区域（如 `ap-northeast-1`、`us-east-1` 等）
     - 如果密码包含特殊字符，需要进行 URL 编码（如 `@` 编码为 `%40`）
  
  3. **运行 Prisma 命令创建表**：
     ```bash
     npm run db:push -- --accept-data-loss
     ```
  
  4. **确认执行成功**：
     - 应该看到 "The database is now in sync with your schema" 或类似的成功消息
     - 如果表已存在，会显示 "The database is already in sync with your schema"
- **初始化数据（将 data.ts 中的数据填入数据库）**：

  **方法 1：在本地初始化（推荐，部署前后都可以）**
  
  1. **确保已配置 DATABASE_URL 环境变量**（指向 Supabase）：
     ```bash
     # 在 .env 文件中配置（参考上面的"方法 2"步骤）
     DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
     ```
  
  2. **运行初始化脚本**：
     ```bash
     npm run db:init
     ```
     这个命令会：
     - 读取 `prisma/data.ts` 中的数据
     - 检查数据库是否已有数据（如果有则跳过）
     - 如果数据库为空，则填充初始数据（2 个系列：成衣、配饰，共 4 个产品）
  
  3. **确认执行成功**：
     - 应该看到 "✅ 初始化完成！已创建 X 个产品。" 的消息
     - 可以在 Supabase Studio 的 Table Editor 中查看数据

  **方法 2：部署后通过 API 初始化（需要先部署）**
  
  1. **先部署到 Vercel**（如果还没部署）：
     - 在 Vercel 中连接 GitHub 仓库
     - 配置环境变量（DATABASE_URL、SUPABASE_URL 等）
     - 等待部署完成
  
  2. **（可选）设置安全密钥**：
     - 在 Vercel 环境变量中添加 `DB_INIT_SECRET`（例如：`your-secret-key-123`）
  
  3. **调用初始化 API**：
     ```bash
     # 如果设置了 DB_INIT_SECRET
     curl -X POST "https://your-domain.vercel.app/api/init-db?secret=your-secret-key-123"
     
     # 如果没有设置 DB_INIT_SECRET，可以不传 secret 参数
     curl -X POST "https://your-domain.vercel.app/api/init-db"
     ```
  
  4. **确认执行成功**：
     - 应该收到 JSON 响应：`{"success": true, "message": "数据库初始化完成", ...}`
     - 可以在 Supabase Studio 的 Table Editor 中查看数据

  **方法 3：通过 Supabase Studio 手动添加数据**
  
  - 在 Supabase Studio 的 Table Editor 中手动添加系列和产品数据
  - 不推荐，因为需要手动输入所有字段

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
