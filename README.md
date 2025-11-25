# Matter Touch - 个人品牌服饰网站

Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL + Prisma

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/matter_touch?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"  # 使用 openssl rand -base64 32 生成
SUPABASE_URL="https://xxxxx.supabase.co"  # 可选
SUPABASE_SERVICE_ROLE="service-role-key"  # 可选
```

### 3. 初始化数据库

```bash
npm run db:generate  # 生成 Prisma Client
npm run db:push      # 推送 schema 到数据库
npm run db:init      # 初始化数据（不会清空已有数据）
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 关键命令

### 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 数据库命令

```bash
npm run db:generate  # 生成 Prisma Client
npm run db:push      # 推送 schema 到数据库（开发环境）
npm run db:migrate   # 创建数据库迁移（生产环境）
npm run db:studio    # 打开 Prisma Studio（可视化数据库管理）
npm run db:seed      # 填充种子数据（会清空现有数据）
npm run db:init      # 初始化数据（不会清空已有数据）
```

## 管理后台

### 设置管理员账户

1. **更新数据库 schema**（如果还未更新）：
   ```bash
   npm run db:push
   ```
   这会为 `User` 表添加 `role` 字段（默认值为 "user"）。

2. **创建管理员账户**：

   方法 1：使用 Prisma Studio（推荐）
   ```bash
   npm run db:studio
   ```
   找到 `User` 表，将某个用户的 `role` 字段设置为 `"admin"`。

   方法 2：通过 SQL
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

### 访问管理后台

```bash
npm run dev
```

访问 http://localhost:3000/admin，使用管理员账户登录。

### 功能说明

- **店铺管理** (`/admin/shop`)：产品和系列的增删改查
  - 产品管理：添加、编辑、删除产品（删除需密码验证）
  - 系列管理：添加、编辑、删除系列（删除需密码验证，会级联删除该系列下的所有产品）
- **订单管理** (`/admin/orders`)：占位页面，后续拓展
