# Tauri 2 + React + TypeScript Template Creator

一个用于创建 Tauri 2 桌面应用程序的命令行工具，提供开箱即用的开发模板。

## 🎯 项目概述

这个项目是一个模板创建工具，用于生成基于 Tauri 2 + React + TypeScript 的桌面应用程序模板。模板包含了最佳实践的配置和工具链。

### 主要特性

- 🚀 **Tauri 2** - 轻量级、安全的桌面应用框架
- ⚛️ **React 19** - 最新的 React 框架
- 📝 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS v3** - 实用优先的 CSS 框架
- 🌙 **深色模式** - 内置主题切换功能
- 🧩 **Radix UI** - 无障碍的 UI 组件库
- 🔧 **Vite** - 快速的构建工具
- 📦 **pnpm** - 高效的包管理器
- ✅ **ESLint + Prettier** - 代码质量和格式化
- 📝 **Conventional Commits** - 规范的提交信息（支持 emoji）
- 🔒 **Git Hooks** - 自动化的代码检查

## 🚀 快速开始

### 全局安装

```bash
# 全局安装模板创建工具
npm install -g tauri-template

# 或使用 npx
npx tauri-template
```

### 直接使用（推荐）

```bash
# 克隆仓库
git clone https://github.com/anypond/tauri-template.git
cd tauri-template

# 安装依赖
pnpm install

# 创建新项目
pnpm create my-app

# 进入项目目录
cd my-app

# 开始开发
pnpm tauri dev
```

## 📖 使用方法

### 1. 创建新项目

```bash
# 使用 pnpm create（推荐）
pnpm create my-app

# 或使用全局安装的命令
create-tauri-template my-app
```

### 2. 交互式配置

创建项目时会提示您输入以下信息：

- **项目名称** - 默认使用目录名
- **项目描述** - 项目的基本描述
- **作者** - 作者名称
- **许可证** - 默认 MIT
- **包管理器** - 默认 pnpm
- **初始化 Git** - 默认 true

### 3. 项目结构

创建的项目将包含以下结构：

```
my-app/
├── src/                    # React 前端源码
│   ├── components/         # 组件目录
│   │   └── ui/            # UI 基础组件
│   ├── lib/               # 工具函数
│   └── assets/            # 静态资产
├── src-tauri/             # Tauri 后端源码
├── public/                # 静态文件
├── .husky/                # Git hooks（自动安装）
├── .vscode/               # VS Code 配置
├── package.json           # 项目配置
├── README.md              # 项目文档
└── ...                    # 其他配置文件
```

## 🔧 开发指南

### 开发模板项目

如果您需要修改模板：

1. **模板文件位置**：`template/` 目录
2. **测试模板**：在 `template/` 目录中运行 `pnpm tauri dev`
3. **更新配置**：修改模板中的配置文件后，确保通过 `pnpm lint` 检查

### 主要命令

```bash
# 创建新项目
pnpm create <project-name>

# 检查代码质量
pnpm lint

# 修复代码问题
pnpm lint:fix

# 格式化代码
pnpm format

# 提交代码（遵循规范）
pnpm commit
```

## 📁 项目结构

```
tauri-template/
├── create.js              # 主创建脚本
├── package.json           # 工具项目配置
├── eslint.config.js       # ESLint 配置（支持主项目和模板）
├── cz-config.js           # Commitizen 配置
├── commitlint.config.js   # 提交信息验证
├── .husky/                # Git hooks
├── template/              # 模板项目
│   ├── src/               # React 源码
│   ├── src-tauri/         # Tauri 源码
│   ├── public/            # 静态文件
│   └── ...                # 模板配置文件
└── doc/                   # 文档
```

## 🛠️ 技术栈

### 模板项目

- **前端**: React 19, TypeScript 5.8, Vite 7.0
- **样式**: Tailwind CSS v3, Radix UI
- **后端**: Tauri 2.0, Rust 1.89
- **工具**: pnpm, ESLint, Prettier, Husky

### 创建工具

- **运行时**: Node.js 22+
- **依赖**: Commander, Inquirer, Chalk, Ora
- **包管理**: pnpm（推荐）

## 📝 开发流程

### 1. 修改模板

```bash
# 进入模板目录
cd template

# 开发模式
pnpm tauri dev

# 修改代码和配置
# ...

# 测试构建
pnpm tauri build
```

### 2. 测试创建

```bash
# 返回根目录
cd ..

# 创建测试项目
node create.js my-test-app

# 验证创建的项目
cd my-test-app
pnpm install
pnpm tauri dev
```

### 3. 提交更改

```bash
# 返回根目录
cd ..

# 使用规范提交
pnpm commit

# 或手动提交
git commit -m "✨feat: update template dependencies"
```

## 🔒 代码质量

项目使用以下工具确保代码质量：

- **ESLint** - 代码检查，支持 React 和 TypeScript
- **Prettier** - 代码格式化
- **Commitlint** - 提交信息验证
- **lint-staged** - 仅检查暂存的文件

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改（使用 Conventional Commits）
4. 推送到分支
5. 创建 Pull Request

## 📚 相关文档

- [Tauri 文档](https://tauri.app/)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [pnpm 文档](https://pnpm.io/)

## 🔄 版本历史

### v1.0.0

- 初始版本发布
- 支持 Tauri 2 + React 19 + TypeScript
- 完整的开发工具链
- 代码质量和 Git 提交规范
- 支持深色模式
- Radix UI 组件集成
