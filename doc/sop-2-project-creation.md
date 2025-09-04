# Tauri 2 + React + TypeScript 项目创建 SOP

## 概述
本SOP指导如何创建Tauri 2 + React + TypeScript项目。

## 前置条件
- 已完成《开发环境准备 SOP》
- 确保所有开发工具已安装并可用

## 项目创建步骤

### 步骤1: 选择项目位置
```bash
# 创建项目目录
mkdir tauri-projects
cd tauri-projects
```

### 步骤2: 运行create-tauri-app
```bash
# 使用pnpm创建项目
pnpm create tauri-app@latest
```

### 步骤3: 交互式配置
按照提示输入以下信息：

1. **What is your app name?**
   - 输入应用名称（例如：`my-tauri-app`）
   - 建议：使用小写字母和连字符

2. **What should the window title be?**
   - 输入窗口标题（例如：`My Tauri App`）
   - 建议：使用可读性好的标题

3. **Choose frontend framework:**
   - 选择 `react`

4. **Choose template:**
   - 选择 `react-ts` (React + TypeScript)

5. **Choose package manager:**
   - 选择 `pnpm`
   - 标准：使用pnpm作为项目包管理器

### 步骤4: 进入项目目录
```bash
cd my-tauri-app
```

### 步骤5: 安装依赖
```bash
# 使用pnpm安装依赖
pnpm install
```

### 步骤6: 验证项目结构
检查以下文件和目录是否存在：
```
my-tauri-app/
├── src/                    # React前端源码
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── styles.css         # 样式文件
├── src-tauri/             # Tauri后端源码
│   ├── Cargo.toml         # Rust项目配置
│   ├── tauri.conf.json    # Tauri配置文件
│   └── src/               # Rust源码
│       └── main.rs        # Rust入口文件
├── package.json           # Node.js项目配置
├── tsconfig.json          # TypeScript配置
├── index.html             # HTML入口文件
└── README.md              # 项目说明
```

### 步骤7: 启动开发服务器
```bash
# 启动开发模式
pnpm tauri dev
```

预期结果：
- 开发服务器启动
- 应用窗口打开
- 显示"Welcome to Tauri!"页面

## 项目配置

### 修改基础配置

#### 1. 更新应用信息
编辑 `src-tauri/tauri.conf.json`：
```json
{
  "package": {
    "productName": "My App",
    "version": "1.0.0"
  },
  "tauri": {
    "windows": [
      {
        "title": "My App",
        "width": 1024,
        "height": 768,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

#### 2. 配置TypeScript
检查 `tsconfig.json` 配置：
```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020", "dom", "dom.iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### 添加开发工具

#### 1. 安装ESLint
```bash
pnpm add -D eslint eslint-config-react-app @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 2. 配置ESLint
创建 `.eslintrc.json`：
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

#### 3. 安装Prettier
```bash
pnpm add -D prettier @typescript-eslint/eslint-plugin-prettier eslint-config-prettier eslint-plugin-prettier
```

#### 4. 配置Prettier
创建 `.prettierrc`：
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 开发工作流

### 1. 开发模式
```bash
# 启动开发服务器
pnpm tauri dev
```

### 2. 构建项目
```bash
# 构建生产版本
pnpm tauri build
```

### 3. 测试
```bash
# 运行前端测试
pnpm test

# 运行Tauri测试
pnpm tauri test
```

### 4. 代码检查
```bash
# ESLint检查
pnpm run lint

# TypeScript检查
npx tsc --noEmit
```

## 常用开发任务

### 1. 添加新的Tauri命令

#### 后端 (Rust)
在 `src-tauri/src/main.rs` 中添加：
```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Tauri!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 前端 (TypeScript)
在React组件中使用：
```typescript
import { invoke } from '@tauri-apps/api/tauri';

const App = () => {
  const [message, setMessage] = useState('');

  const handleGreet = async () => {
    const result = await invoke('greet', { name: 'World' });
    setMessage(result);
  };

  return (
    <div>
      <button onClick={handleGreet}>Greet</button>
      <p>{message}</p>
    </div>
  );
};
```

### 2. 添加依赖

#### 前端依赖
```bash
pnpm add axios react-router-dom
```

#### 后端依赖
编辑 `src-tauri/Cargo.toml`：
```toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
reqwest = { version = "0.11", features = ["json"] }
```

### 3. 配置构建选项
编辑 `src-tauri/tauri.conf.json`：
```json
{
  "tauri": {
    "bundle": {
      "identifier": "com.example.my-app",
      "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
    }
  }
}
```

## 故障排除

### 常见问题

#### 1. 开发服务器启动失败
```bash
# 清理缓存
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. 编译错误
```bash
# 更新依赖
pnpm update

# 检查Rust版本
rustup update
```

#### 3. TypeScript错误
```bash
# 重新生成类型
pnpm tauri info
```

#### 4. 权限问题
```bash
# Linux/macOS
chmod +x src-tauri/target/debug/my-app

# Windows
# 以管理员权限运行命令提示符
```

## 项目验证清单

- [ ] 项目结构完整
- [ ] 开发服务器正常启动
- [ ] 应用窗口正常显示
- [ ] TypeScript编译通过
- [ ] 热重载功能正常
- [ ] 构建功能正常
- [ ] 测试框架配置完成
- [ ] 代码检查工具配置完成

## 下一步

项目创建完成后，可以：
1. 开始开发应用功能
2. 配置CI/CD流水线
3. 准备发布版本
4. 添加测试用例

---

**注意**: 定期更新依赖和Tauri版本以确保安全性和功能完整性。