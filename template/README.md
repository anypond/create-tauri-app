# Tauri 2 + React + TypeScript Template

现代化的桌面应用开发模板，基于 Tauri 2、React 19、TypeScript 和 Tailwind CSS v4 构建。

## ✨ 特性

- 🚀 **Tauri 2** - 轻量级、安全的桌面应用框架
- ⚛️ **React 19** - 最新的 React 框架
- 📝 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS v4** - 现代化的 CSS 框架
- 🌙 **深色模式** - 内置主题切换功能
- 🧩 **Radix UI** - 无障碍的 UI 组件库
- 🔧 **Vite** - 快速的构建工具
- 📦 **pnpm** - 高效的包管理器

## 🛠️ 技术栈

### 前端
- **React 19.1.0** - UI 框架
- **TypeScript 5.8.3** - 类型系统
- **Vite 7.0.4** - 构建工具
- **Tailwind CSS 4.1.13** - CSS 框架
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

### Tailwind CSS v4

项目使用 Tailwind CSS v4，具有以下特点：

- **零配置** - 不需要 `tailwind.config.js` 文件
- **CSS 内配置** - 使用 `@theme` 指令在 CSS 中配置
- **主题系统** - 内置深色/浅色模式支持

### 主题变量

所有颜色和样式变量都定义在 `src/index.css` 中：

```css
@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(221.2 83.2% 53.3%);
  /* 更多变量... */
}

.dark {
  --color-background: hsl(222.2 84% 4.9%);
  --color-foreground: hsl(210 40% 98%);
  /* 深色模式变量... */
}
```

### 组件样式

所有组件都使用自定义 CSS 类，避免 `@apply` 指令的兼容性问题：

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 更多样式... */
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}
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
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("greet", { name: "World" });
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

### 推荐的 IDE 设置

- **VS Code** + **Tauri 扩展** + **rust-analyzer**
- **Tailwind CSS IntelliSense** 扩展
- **TypeScript Vue Plugin (Volar)**

### 有用的扩展

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **GitLens** - Git 增强功能

## 📝 脚本命令

```bash
# 开发模式
pnpm tauri dev

# 构建应用
pnpm tauri build

# 类型检查
tsc --noEmit

# 预览构建结果
pnpm preview
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