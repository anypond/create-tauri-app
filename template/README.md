# Tauri 2 + React + TypeScript Template

现代化的桌面应用开发模板，基于 Tauri 2、React 19、TypeScript 和 Tailwind CSS v3 构建。

## ✨ 特性

- 🚀 **Tauri 2** - 轻量级、安全的桌面应用框架
- ⚛️ **React 19** - 最新的 React 框架
- 📝 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS v3** - 成熟的 CSS 框架，完全兼容 macOS Big Sur
- 🌙 **深色模式** - 内置主题切换功能
- 🧩 **Radix UI** - 无障碍的 UI 组件库
- 🔧 **Vite** - 快速的构建工具
- 📦 **pnpm** - 高效的包管理器

## 🛠️ 技术栈

### 前端

- **React 19.1.0** - UI 框架
- **TypeScript 5.8.3** - 类型系统
- **Vite 7.0.4** - 构建工具
- **Tailwind CSS 3.4.17** - CSS 框架
- **Radix UI** - UI 组件库
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
template/
├── src/                    # React 前端源码
│   ├── components/         # 组件目录
│   │   ├── ui/            # UI 基础组件
│   │   └── theme-toggle.tsx # 主题切换组件
│   ├── lib/               # 工具函数
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── src-tauri/             # Tauri 后端源码
│   ├── src/               # Rust 源码
│   │   ├── main.rs        # 应用入口
│   │   └── lib.rs         # Tauri 命令定义
│   └── tauri.conf.json    # Tauri 配置
├── dist/                  # 构建输出
└── package.json           # 项目配置
```

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

**CSS 变量** - 在 `src/index.css` 中定义：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* 更多变量... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* 深色模式变量... */
}
```

### 组件样式

使用 CVA (Class Variance Authority) 和 `@apply` 指令：

```typescript
// Button 组件示例
const buttonVariants = cva('基础样式类', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      outline: 'border border-input bg-background',
    },
  },
})
```

### 主题颜色使用

```typescript
// 在组件中使用
<div className="bg-primary text-primary-foreground">
  主要颜色背景，前景色文字
</div>

<div className="bg-muted text-muted-foreground">
  次要颜色背景，次要文字
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

- 浅色模式：`<html>` 元素无特殊类
- 深色模式：`<html>` 元素添加 `.dark` 类

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
  "semi": false,           // 不使用分号
  "singleQuote": true,     // 使用单引号
  "tabWidth": 2,          // 缩进 2 个空格
  "trailingComma": "es5", // ES5 允许的尾随逗号
  "printWidth": 100,      // 每行最多 100 字符
  "bracketSpacing": true, // 对象字面量中的括号之间添加空格
  "arrowParens": "avoid", // 箭头函数参数尽可能省略括号
  "endOfLine": "lf",      // 使用 LF 作为换行符
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

### 推荐的 IDE 设置

- **VS Code** + **Tauri 扩展** + **rust-analyzer**
- **Tailwind CSS IntelliSense** 扩展
- **TypeScript Vue Plugin (Volar)**

### 有用的扩展

- **ESLint** - 代码质量检查
- **Prettier - Code formatter** - 代码格式化
- **GitLens** - Git 增强功能

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

- [Tauri 文档](https://tauri.app/)
- [React 文档](https://react.dev/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
