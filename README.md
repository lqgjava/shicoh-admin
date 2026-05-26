# 新思考电机 - 后台管理系统

## 项目介绍

这是新思考电机官网的后台管理系统，基于 Vue 3 + Element Plus 开发。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 请求**: Axios
- **构建工具**: Vite

## 项目结构

```
shicoh-admin/
├── src/
│   ├── api/           # API 接口
│   ├── components/    # 公共组件
│   ├── layouts/       # 布局组件
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 状态管理
│   ├── utils/         # 工具函数
│   ├── views/         # 页面视图
│   │   ├── content/   # 内容管理
│   │   └── system/    # 系统设置
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 功能模块

### 内容管理
- 轮播图管理
- 产品管理
- 新闻管理
- 企业信息管理

### 系统设置
- 网站基本信息设置
- 修改密码

## 安装和运行

### 安装依赖

```bash
cd shicoh-admin
npm install
```

### 开发环境运行

```bash
npm run dev
```

访问 http://localhost:3001

### 构建生产版本

```bash
npm run build
```

## 默认登录账号

- 用户名: `admin`
- 密码: `admin123`

## 与后端 API 对接

后端 API 运行在 http://localhost:3002

在 `vite.config.ts` 中配置了代理：
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3002',
    changeOrigin: true
  }
}
```
