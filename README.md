# Matter Touch - 个人品牌服饰网站

Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL + Prisma

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
DATABASE_URL="postgresql://mattertouch:mattertouch123@localhost:5432/matter_touch?schema=public"
```

### 3. 启动 PostgreSQL

```bash
# 使用 Homebrew
brew services start postgresql@14

# 或使用脚本
./scripts/postgres.sh start
```

### 4. 初始化数据库

```bash
npm run db:generate
npm run db:push -- --accept-data-loss
npm run db:seed  # 开发环境（会清空数据）
# 或
npm run db:init  # 生产环境（不会清空数据）
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 常用命令

### 开发

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 数据库

```bash
npm run db:generate  # 生成 Prisma Client
npm run db:push      # 推送 schema（开发）
npm run db:migrate   # 创建迁移（生产）
npm run db:studio    # 打开 Prisma Studio
npm run db:seed      # 填充种子数据（会清空数据）
npm run db:init      # 初始化数据（不会清空数据）
```

### PostgreSQL 服务

```bash
./scripts/postgres.sh start    # 启动
./scripts/postgres.sh stop     # 停止
./scripts/postgres.sh status   # 状态
./scripts/postgres.sh restart  # 重启
```

## 数据管理

### 静态配置

- **主视觉图片**：`app/config/heroImages.ts`
- **系列信息**：`app/config/collections.ts`

### 产品数据格式

```typescript
{
  name: string          // 必填：产品名称
  description?: string  // 可选：产品描述
  price?: number       // 可选：价格
  imageUrl?: string    // 可选：默认图片路径
  hoverImageUrl?: string // 可选：悬停图片路径
  category: string     // 必填：'clothings' 或 'accessories'
}
```

### 管理方式

#### 1. Prisma Studio（图形界面）

```bash
npm run db:studio
```

访问 `http://localhost:5555`

#### 2. REST API

**创建产品**
```bash
POST /api/products
Content-Type: application/json

{
  "name": "产品名称",
  "description": "产品描述",
  "price": 1299.0,
  "imageUrl": "/images/collections/clothings/products/product-1.jpg",
  "hoverImageUrl": "/images/collections/clothings/products/product-1-hover.jpg",
  "category": "clothings"
}
```

**更新产品**
```bash
PATCH /api/products/{id}
Content-Type: application/json

{
  "price": 1499.0,
  "hoverImageUrl": "/images/collections/clothings/products/product-1-hover-new.jpg"
}
```

**其他操作**
```bash
GET    /api/products              # 获取所有产品
GET    /api/products?category=clothings  # 按分类筛选
GET    /api/products/{id}         # 获取单个产品
DELETE /api/products/{id}         # 删除产品
```

## 图片路径规则

- **主视觉图片**：`public/images/hero/hero-{编号}.jpg`
- **系列封面**：`public/images/collections/{系列slug}/cover.jpg`
- **产品默认图片**：`/images/collections/{系列slug}/products/product-{编号}.jpg`
- **产品悬停图片**：`/images/collections/{系列slug}/products/product-{编号}-hover.jpg`

## 部署

### 构建生产版本

```bash
npm run build
npm run start
```

### 数据库迁移（生产环境）

```bash
npm run db:migrate
npx prisma migrate deploy
```

### 环境变量

确保生产环境设置了正确的 `DATABASE_URL`。

⚠️ **注意**：
- `db:seed` 会清空所有数据，仅用于开发环境
- 生产环境使用 `db:init` 或 API 管理数据
- 当前 API 未实现身份验证，生产环境需要添加
