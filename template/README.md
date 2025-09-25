# Tauri 2 + React + TypeScript Template

现代化的桌面应用开发模板，基于"开箱即用"和"最佳实践"的设计理念构建。

## 🎯 设计理念

本项目遵循以下核心原则：

1. **开箱即用** - 包含所有必要的配置和工具，克隆后即可开始开发
2. **最佳实践** - 集成了业界公认的最佳实践工具和流程
3. **开发体验优先** - 优化开发者的日常使用体验
4. **自动化** - 自动化代码检查、格式化和提交规范
5. **可维护性** - 清晰的项目结构和文档

## ✨ 特性

- 🚀 **Tauri 2** - 轻量级、安全的桌面应用框架
- ⚛️ **React 19** - 最新的 React 框架
- 📝 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS v3** - 成熟的 CSS 框架，完全兼容 macOS Big Sur
- 🌙 **深色模式** - 内置主题切换功能
- 🧩 **DaisyUI** - 美观的 UI 组件库
- 🔧 **Vite** - 快速的构建工具
- 📦 **pnpm** - 高效的包管理器
- ✅ **ESLint + Prettier** - 代码质量和格式化
- 📝 **Conventional Commits** - 规范的提交信息（支持 emoji）
- 🔒 **Git Hooks** - 自动化的代码检查

## 🛠️ 技术栈

### 前端

- **React 19.1.0** - UI 框架
- **TypeScript 5.8.3** - 类型系统
- **Vite 7.0.4** - 构建工具
- **Tailwind CSS 3.4.17** - CSS 框架
- **DaisyUI** - UI 组件库
- **Lucide React** - 图标库

### 后端

- **Tauri 2.0.0** - 桌面应用框架
- **Rust 1.89.0** - 系统编程语言

## 🚀 快速开始

### 环境要求

- **Node.js** 22.19.0 LTS (推荐使用 nvm 管理)
- **pnpm** 10.15.1+
- **Rust** 1.89.0+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm tauri dev
```

### 构建应用

```bash
pnpm tauri build
```

## 📁 项目结构

```
├── src/                    # React 前端源码
│   ├── components/         # 组件目录
│   │   └── ui/            # UI 基础组件
│   ├── lib/               # 工具函数
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── src-tauri/             # Tauri 后端源码
│   ├── src/               # Rust 源码
│   ├── capabilities/       # Tauri 能力配置
│   ├── icons/             # 应用图标
│   └── tauri.conf.json    # Tauri 配置
├── .husky/                # Git hooks（自动安装）
├── .vscode/                # VS Code 配置
├── COMMIT_GUIDE.md        # Git 提交规范
├── package.json           # 项目配置
└── dist/                  # 构建输出
```

### 设计考虑

1. **扁平结构** - 避免过深的嵌套目录，提高可读性
2. **职责分离** - 前后端代码明确分离，便于团队协作
3. **配置集中** - 所有配置文件放在根目录，便于维护
4. **文档驱动** - 完善的文档系统，包括 SOP 和设计说明

## 🏗️ 架构设计

### 技术选型理由

#### 前端技术栈

- **React 19** - 最新的 React 版本，提供最佳的性能和开发体验
- **TypeScript** - 提供类型安全，减少运行时错误
- **Vite** - 极快的构建速度和开发服务器热更新
- **Tailwind CSS v3** - 成熟稳定的 CSS 框架，完全兼容旧系统
- **DaisyUI** - 美观、易用的 UI 组件库

#### 后端技术栈

- **Tauri 2** - 轻量、安全的桌面应用框架，比 Electron 更节省资源
- **Rust** - 系统级编程语言，提供内存安全和极致性能

#### 开发工具

- **pnpm** - 高效的包管理器，节省磁盘空间和提高安装速度
- **ESLint + Prettier** - 代码质量和格式化的黄金组合
- **Husky + lint-staged** - 自动化的 Git hooks
- **Commitizen + commitlint** - 规范化的提交信息管理

## 🎨 样式系统

### Tailwind CSS v3

项目使用 Tailwind CSS v3，具有以下特点：

- **成熟稳定** - 完全兼容 macOS Big Sur 和其他旧版本系统
- **配置文件** - 使用 `tailwind.config.js` 进行配置
- **主题系统** - 内置深色/浅色模式支持
- **语义化命名** - 使用语义化的颜色名称

### 配置文件

**tailwind.config.js** - 主题配置：

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // 更多颜色...
      },
    },
  },
}
```

**Tailwind 配置** - 在 `tailwind.config.js` 中配置：

```javascript
export default {
  darkMode: 'class',
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
  },
}
```

**CSS 样式** - 在 `src/index.css` 中定义：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义渐变工具类 */
@layer utilities {
  .bg-gradient-to-br {
    background: linear-gradient(135deg, theme('colors.primary'), theme('colors.primary') / 80);
  }
}
```

### DaisyUI 组件使用

DaisyUI 直接使用语义化类名，无需额外配置：

```html
<!-- 按钮组件 -->
<button className="btn btn-primary">主要按钮</button>
<button className="btn btn-outline">轮廓按钮</button>
<button className="btn btn-ghost">幽灵按钮</button>

<!-- 卡片组件 -->
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">卡片标题</h2>
    <p>卡片内容</p>
  </div>
</div>

<!-- 表单组件 -->
<div className="form-control">
  <label className="label">
    <span className="label-text">用户名</span>
  </label>
  <input type="text" className="input input-bordered" />
</div>
```

## 🔧 Tauri 命令

### 定义 Rust 命令

在 `src-tauri/src/lib.rs` 中定义命令：

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

### 注册命令

在 Tauri 构建器中注册命令：

```rust
.invoke_handler(tauri::generate_handler![greet])
```

### 调用命令

在 React 中调用 Rust 命令：

```typescript
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('greet', { name: 'World' })
```

## 🌙 主题系统

### 主题切换

项目包含完整的主题切换系统：

```typescript
import { ThemeToggle } from "./components/theme-toggle";

// 在组件中使用
<ThemeToggle />
```

### 主题状态管理

主题状态通过 CSS 类控制：

- 浅色模式：`<html>` 元素移除 `.dark` 类
- 深色模式：`<html>` 元素添加 `.dark` 类
- 自动检测系统 `prefers-color-scheme` 偏好
- 使用 localStorage 持久化用户选择

## 📱 组件示例

### 按钮组件

```typescript
import { Button } from "./components/ui/button";

<Button variant="primary" onClick={handleClick}>
  点击我
</Button>
```

### 输入框组件

```typescript
import { Input } from "./components/ui/input";

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="请输入内容..."
/>
```

### 卡片组件

```typescript
import { Card, CardHeader, CardContent } from "./components/ui/card";

<Card>
  <CardHeader>
    <h3 className="heading-3">标题</h3>
  </CardHeader>
  <CardContent>
    <p>内容区域</p>
  </CardContent>
</Card>
```

## 🛠️ 开发工具

### 代码质量与格式化

项目使用 ESLint 和 Prettier 来确保代码质量和一致的代码风格。

#### ESLint 配置

ESLint 配置文件 `eslint.config.js` 包含以下规则和插件：

- **基础配置**: JavaScript 推荐规则
- **TypeScript 支持**: @typescript-eslint 插件和规则
- **React 支持**: React 和 React Hooks 规则
- **Prettier 集成**: eslint-config-prettier 确保与 Prettier 兼容

**主要规则**:

- React 最佳实践（JSX 语法、组件规则）
- TypeScript 类型检查和最佳实践
- 代码质量规则（未使用变量、代码可达性等）
- 自定义全局变量（浏览器 API、Node.js API）

**使用 ESLint**:

```bash
# 检查代码问题
pnpm lint

# 自动修复问题
pnpm lint:fix
```

#### Prettier 配置

Prettier 配置文件 `.prettierrc` 定义代码格式化规则：

```json
{
  "semi": false, // 不使用分号
  "singleQuote": true, // 使用单引号
  "tabWidth": 2, // 缩进 2 个空格
  "trailingComma": "es5", // ES5 允许的尾随逗号
  "printWidth": 100, // 每行最多 100 字符
  "bracketSpacing": true, // 对象字面量中的括号之间添加空格
  "arrowParens": "avoid", // 箭头函数参数尽可能省略括号
  "endOfLine": "lf", // 使用 LF 作为换行符
  "bracketSameLine": false, // JSX 标签的 > 放在最后一行的末尾
  "quoteProps": "as-needed" // 对象属性仅在必要时使用引号
}
```

**使用 Prettier**:

```bash
# 格式化所有文件
pnpm format

# 检查文件是否需要格式化
pnpm format:check
```

#### 开发工作流

建议的开发流程：

1. **编写代码** → **保存时自动格式化**（配置编辑器）
2. **提交前** → **运行 lint 和 format 检查**
3. **CI/CD** → **自动化代码质量检查**

#### VS Code 集成

安装以下扩展并启用保存时自动格式化：

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🔒 Git Hooks 自动化

项目配置了自动化的 Git hooks，确保代码质量和提交规范：

### 自动安装

Git hooks 会在 `pnpm install` 时自动安装，无需手动配置。

### Pre-commit Hook

提交前自动执行：

- ESLint 检查并修复代码问题
- Prettier 格式化代码

### Commit-msg Hook

验证提交信息是否符合 Conventional Commits 规范，支持 emoji 格式。

### Git 提交规范

项目使用 Conventional Commits 规范，并支持 emoji：

#### 支持的提交格式

1. **带 emoji（推荐）**：`✨feat: 添加新功能`
2. **带 scope**：`🐛fix(ui): 修复按钮样式`
3. **不带 emoji**：`fix: 简单修复`

#### 提交类型

| Emoji | 类型     | 说明           |
| ----- | -------- | -------------- |
| ✨    | feat     | 新功能         |
| 🐛    | fix      | 修复 bug       |
| 📚    | docs     | 文档更新       |
| 💎    | style    | 代码格式调整   |
| 📦    | refactor | 重构           |
| 🚨    | test     | 增加测试       |
| 🛠    | build    | 构建相关变动   |
| ⚙️    | ci       | CI/CD 配置变动 |
| ♻️    | chore    | 其他修改       |
| 🗑    | revert   | 回滚           |

#### 使用流程

1. **开发代码**
2. **暂存更改**：`git add .`
3. **提交代码**：

   ```bash
   # 推荐：使用交互式提交（自动添加 emoji）
   pnpm commit

   # 或手动提交（需符合规范）
   git commit -m "✨feat: add new feature"
   git commit -m "🐛fix(auth): fix login issue"
   ```

4. **Hooks 自动执行**：检查代码质量和提交信息格式

#### 配置说明

- **commitlint**: 使用自定义解析器支持 emoji 格式
- **commitizen**: 交互式提交工具，自动添加 emoji
- **scope**: 可选的影响范围，如 `(ui)`、`(auth)` 等

### 推荐的 IDE 设置

- **VS Code** + **Tauri 扩展** + **rust-analyzer**
- **Tailwind CSS IntelliSense** 扩展
- **TypeScript Vue Plugin (Volar)**

### 有用的扩展

- **ESLint** - 代码质量检查
- **Prettier - Code formatter** - 代码格式化
- **GitLens** - Git 增强功能
- **Commitizen** - Conventional Commits 支持
- **Git Graph** - Git 可视化操作

## 🔄 开发工作流

### 1. 环境准备

```bash
# 安装依赖（自动配置 Git hooks）
pnpm install
```

### 2. 日常开发

```bash
# 启动开发服务器
pnpm tauri dev

# 编辑器会自动格式化代码（ESLint + Prettier）
# 享受实时热更新和类型检查
```

### 3. 代码提交

```bash
# 暂存更改
git add .

# 交互式提交（推荐，自动添加 emoji）
pnpm commit

# 或手动提交（需符合规范）
git commit -m "✨feat: add new feature"
```

### 4. 版本发布

```bash
# 自动生成版本号和更新日志
pnpm release

# 指定版本类型
pnpm release:patch   # 补丁版本
pnpm release:minor  # 次版本
pnpm release:major  # 主版本
```

## 📝 脚本命令

### 开发和构建

```bash
# 开发模式
pnpm tauri dev

# 构建应用
pnpm tauri build

# 类型检查
pnpm typecheck

# 预览构建结果
pnpm preview
```

### 代码质量和格式化

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# Prettier 格式化
pnpm format

# Prettier 检查
pnpm format:check
```

### Git 提交和版本管理

```bash
# 交互式提交（推荐）
pnpm commit

# 创建新版本
pnpm release

# 指定版本类型
pnpm release:patch   # 补丁版本 (0.0.1 → 0.0.2)
pnpm release:minor  # 次版本   (0.1.0 → 0.2.0)
pnpm release:major  # 主版本   (1.0.0 → 2.0.0)
```

## 🔧 故障排除

### 常见问题

1. **端口占用**

   ```bash
   # 查找占用 1420 端口的进程
   lsof -ti:1420 | xargs kill -9
   ```

2. **依赖问题**

   ```bash
   # 清理并重新安装依赖
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **构建失败**
   ```bash
   # 清理构建缓存
   rm -rf dist
   pnpm run build
   ```

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📚 相关文档

### 项目文档

- [Git 提交规范](./COMMIT_GUIDE.md) - 提交信息格式和最佳实践

### 技术文档

- [Tauri 文档](https://tauri.app/)
- [React 文档](https://react.dev/)
- [Tailwind CSS v3 文档](https://tailwindcss.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
