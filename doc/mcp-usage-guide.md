# Tauri Template MCP 使用指南

本文档介绍如何使用 Tauri Template MCP (Model Context Protocol) 服务器来管理和开发 Tauri 项目。

## 什么是 MCP？

MCP (Model Context Protocol) 是一个标准化协议，允许 AI 工具（如 Claude Desktop）与外部服务器进行通信，从而访问各种工具和资源。

## 功能特性

### 可用工具

1. **create-tauri-project** - 从模板创建新的 Tauri 项目
2. **run-tauri-dev** - 启动 Tauri 开发服务器
3. **build-tauri-project** - 构建 Tauri 项目
4. **get-project-info** - 获取 Tauri 项目信息
5. **check-environment** - 检查开发环境
6. **install-dependencies** - 安装项目依赖
7. **run-linting** - 运行代码检查

### 可用资源

1. **tauri-config** - Tauri 配置信息
2. **project-structure** - 项目目录结构
3. **build-status** - 构建状态和信息
4. **environment-info** - 开发环境信息
5. **template-info** - 模板信息和结构
6. **scripts-info** - 可用的 npm 脚本
7. **dependencies-info** - 项目依赖信息

## 安装和设置

### 1. 安装依赖

```bash
# 在项目根目录
pnpm mcp:install
```

### 2. 构建 MCP 服务器

```bash
pnpm mcp:build
```

### 3. 启动 MCP 服务器

```bash
# 开发模式
pnpm mcp:dev

# 生产模式
pnpm mcp:start
```

## 配置 AI 工具

### Claude Desktop 配置

在 Claude Desktop 的配置文件中添加以下配置：

```json
{
  "mcpServers": {
    "tauri-template": {
      "command": "node",
      "args": ["/path/to/tauri-template/mcp-server/dist/index.js"],
      "cwd": "/path/to/tauri-template"
    }
  }
}
```

### 环境变量配置

```bash
# MCP 服务器配置
export MCP_PORT=3000
export MCP_HOST=localhost
export MCP_DEBUG=true
export TAURI_TEMPLATE_PATH=/path/to/tauri-template
```

## 使用示例

### 创建新项目

在 AI 助手中，你可以这样请求：

```
请帮我创建一个名为 "my-app" 的 Tauri 项目
```

AI 助手会使用 `create-tauri-project` 工具来创建项目。

### 启动开发服务器

```
请启动 my-app 项目的开发服务器
```

AI 助手会使用 `run-tauri-dev` 工具来启动开发服务器。

### 检查环境

```
请检查我的开发环境是否满足 Tauri 开发要求
```

AI 助手会使用 `check-environment` 工具来检查环境。

### 获取项目信息

```
请告诉我当前项目的配置信息
```

AI 助手会使用 `get-project-info` 工具来获取项目信息。

## API 参考

### HTTP API 端点

- `GET /health` - 健康检查
- `GET /tools` - 列出可用工具
- `GET /resources` - 列出可用资源
- `POST /invoke` - 调用工具
- `GET /resource/:resourceName` - 获取资源内容

### WebSocket 连接

连接到 `ws://localhost:3000` 进行实时通信。

## 工具详细说明

### create-tauri-project

**参数：**

- `projectName` (必需): 项目名称
- `targetPath` (可选): 目标路径
- `force` (可选): 是否覆盖已存在的目录
- `templatePath` (可选): 模板路径

**示例：**

```json
{
  "toolName": "create-tauri-project",
  "params": {
    "projectName": "my-app",
    "force": false
  }
}
```

### run-tauri-dev

**参数：**

- `projectPath` (必需): 项目路径
- `port` (可选): 端口号

**示例：**

```json
{
  "toolName": "run-tauri-dev",
  "params": {
    "projectPath": "/path/to/my-app",
    "port": 1420
  }
}
```

### build-tauri-project

**参数：**

- `projectPath` (必需): 项目路径
- `target` (可选): 构建目标 (all, appimage, msi, dmg)

**示例：**

```json
{
  "toolName": "build-tauri-project",
  "params": {
    "projectPath": "/path/to/my-app",
    "target": "all"
  }
}
```

## 故障排除

### 常见问题

1. **MCP 服务器无法启动**
   - 检查端口是否被占用
   - 确认依赖已正确安装
   - 查看错误日志

2. **AI 工具无法连接到 MCP 服务器**
   - 检查配置文件路径是否正确
   - 确认服务器正在运行
   - 检查防火墙设置

3. **工具执行失败**
   - 检查项目路径是否正确
   - 确认项目是有效的 Tauri 项目
   - 检查环境是否满足要求

### 调试模式

启用调试模式以获取更详细的日志：

```bash
export MCP_DEBUG=true
pnpm mcp:dev
```

## 开发

### 项目结构

```
mcp-server/
├── src/
│   ├── server/
│   │   ├── McpServer.ts     # 主服务器类
│   │   ├── tools/           # 工具实现
│   │   └── resources/       # 资源实现
│   ├── types/              # TypeScript 类型
│   ├── utils/              # 工具函数
│   └── index.ts            # 入口点
├── package.json
├── tsconfig.json
└── README.md
```

### 添加新工具

1. 在 `src/server/tools/` 目录下创建新的工具类
2. 在 `McpServer.ts` 中注册工具
3. 更新工具处理程序

### 添加新资源

1. 在 `src/server/resources/` 目录下创建新的资源类
2. 在 `McpServer.ts` 中注册资源
3. 更新资源处理程序

## 许可证

MIT License
