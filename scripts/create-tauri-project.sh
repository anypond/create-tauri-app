#!/bin/bash

# Tauri 2 + React + TypeScript 完整项目创建和测试脚本

set -e

echo "🚀 Tauri 2 + React + TypeScript 项目创建流程"
echo "================================================"

# 设置环境变量
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22

echo "✅ 环境变量设置完成"
echo "   Node.js: $(node --version)"
echo "   pnpm: $(pnpm --version)"
echo "   Rust: $(cargo --version | cut -d' ' -f1-2)"

# 检查依赖
echo ""
echo "🔍 检查系统依赖..."

missing_deps=()

for dep in libwebkit2gtk-4.1-dev build-essential libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev; do
    if ! dpkg -l | grep -q "^ii  $dep"; then
        missing_deps+=("$dep")
    fi
done

if [ ${#missing_deps[@]} -gt 0 ]; then
    echo "⚠️  发现缺失依赖，请手动安装："
    printf '%s\n' "${missing_deps[@]}"
    echo ""
    echo "安装命令："
    echo "sudo apt-get update"
    echo "sudo apt-get install -y \\"
    for dep in "${missing_deps[@]}"; do
        echo "  $dep \\"
    done
    echo "  dbus-x11 x11-utils libxkbcommon-x11-0"
    echo ""
    read -p "按Enter继续，或Ctrl+C取消安装依赖..."
fi

# 创建项目目录
echo ""
echo "📁 创建项目目录..."
PROJECT_DIR="$HOME/tauri-projects"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
echo "✅ 项目目录: $PROJECT_DIR"

# 获取项目名称
echo ""
echo "📝 项目配置"
read -p "请输入项目名称 (默认: my-tauri-app): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-my-tauri-app}

read -p "请输入窗口标题 (默认: My Tauri App): " WINDOW_TITLE
WINDOW_TITLE=${WINDOW_TITLE:-My Tauri App}

# 创建项目
echo ""
echo "🏗️  创建Tauri项目..."
echo "项目名称: $PROJECT_NAME"
echo "窗口标题: $WINDOW_TITLE"

# 使用create-tauri-app创建项目
if pnpm create tauri-app@latest "$PROJECT_NAME" -- \
    --name "$PROJECT_NAME" \
    --window-title "$WINDOW_TITLE" \
    --frontend react \
    --template react-ts \
    --package-manager pnpm; then
    echo "✅ 项目创建成功"
else
    echo "❌ 项目创建失败，尝试手动创建..."
    
    # 手动创建项目结构
    mkdir -p "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    
    # 初始化pnpm项目
    pnpm init
    
    # 安装React依赖
    pnpm add react react-dom @types/react @types/react-dom typescript
    
    # 安装Tauri CLI
    pnpm add -D @tauri-apps/cli
    
    # 初始化Tauri
    pnpm tauri init --name "$PROJECT_NAME" --window-title "$WINDOW_TITLE" --dist-dir ../dist --dev-url http://localhost:3000 --before-dev-command pnpm dev --before-build-command pnpm build
    
    echo "✅ 手动项目创建完成"
fi

cd "$PROJECT_NAME"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
pnpm install

# 创建开发工具配置
echo ""
echo "🛠️  配置开发工具..."

# 创建TypeScript配置
cat > tsconfig.json << 'EOF'
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
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# 创建ESLint配置
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
EOF

# 创建Prettier配置
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

# 安装开发工具
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# 创建启动脚本
echo ""
echo "📜 创建启动脚本..."

# 开发启动脚本
cat > dev.sh << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
pnpm tauri dev
EOF

# 构建脚本
cat > build.sh << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
pnpm tauri build
EOF

# 测试脚本
cat > test.sh << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
pnpm test
EOF

chmod +x dev.sh build.sh test.sh

# 创建README
cat > README.md << EOF
# $PROJECT_NAME

Tauri 2 + React + TypeScript 应用程序

## 开发环境

- Node.js: $(node --version)
- pnpm: $(pnpm --version)
- Rust: $(cargo --version | cut -d' ' -f1-2)

## 快速开始

### 安装依赖
\`\`\`bash
pnpm install
\`\`\`

### 开发模式
\`\`\`bash
./dev.sh
# 或
pnpm tauri dev
\`\`\`

### 构建应用
\`\`\`bash
./build.sh
# 或
pnpm tauri build
\`\`\`

### 运行测试
\`\`\`bash
./test.sh
# 或
pnpm test
\`\`\`

## 项目结构

\`\`\`
$PROJECT_NAME/
├── src/                    # React前端源码
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── styles.css         # 样式文件
├── src-tauri/             # Tauri后端源码
│   ├── Cargo.toml         # Rust项目配置
│   ├── tauri.conf.json    # Tauri配置文件
│   └── src/               # Rust源码
├── package.json           # Node.js项目配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目说明
\`\`\`

## 开发工具

- ESLint: 代码检查
- Prettier: 代码格式化
- TypeScript: 类型检查
- React: 前端框架
- Tauri: 桌面应用框架

## 构建

构建后的应用位于 \`src-tauri/target/release/bundle/\` 目录下。

## 许可证

MIT
EOF

# 创建简单的Tauri命令示例
echo ""
echo "🔧 创建Tauri命令示例..."

# 创建Rust命令示例
mkdir -p src-tauri/src
cat > src-tauri/src/commands.rs << 'EOF'
use tauri::command;

#[command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Tauri!", name)
}

#[command]
pub fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "version": env!("CARGO_PKG_VERSION")
    })
}
EOF

# 更新main.rs以包含commands
if [ -f src-tauri/src/main.rs ]; then
    cp src-tauri/src/main.rs src-tauri/src/main.rs.backup
    cat > src-tauri/src/main.rs << 'EOF'
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{greet, get_system_info};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_system_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
EOF
fi

# 创建React组件示例
mkdir -p src
cat > src/App.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
}

function App() {
  const [message, setMessage] = useState('');
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [name, setName] = useState('Tauri');

  const handleGreet = async () => {
    try {
      const result = await invoke<string>('greet', { name });
      setMessage(result);
    } catch (error) {
      setMessage('Error: ' + error);
    }
  };

  const handleGetSystemInfo = async () => {
    try {
      const info = await invoke<SystemInfo>('get_system_info');
      setSystemInfo(info);
    } catch (error) {
      console.error('Error getting system info:', error);
    }
  };

  useEffect(() => {
    handleGetSystemInfo();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      
      <div className="row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button onClick={handleGreet}>Greet</button>
      </div>

      {message && <p className="message">{message}</p>}

      {systemInfo && (
        <div className="system-info">
          <h2>System Information</h2>
          <p><strong>Platform:</strong> {systemInfo.platform}</p>
          <p><strong>Architecture:</strong> {systemInfo.arch}</p>
          <p><strong>Version:</strong> {systemInfo.version}</p>
        </div>
      )}
    </div>
  );
}

export default App;
EOF

cat > src/styles.css << 'EOF'
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #005a9e;
}

.message {
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
}

.system-info {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}

.system-info h2 {
  margin-top: 0;
  color: #555;
}

.system-info p {
  margin: 5px 0;
}
EOF

# 验证项目
echo ""
echo "🔍 验证项目配置..."

if [ -f "package.json" ] && [ -d "src-tauri" ]; then
    echo "✅ 项目结构正确"
    
    # 检查关键文件
    files=("package.json" "src-tauri/Cargo.toml" "src-tauri/tauri.conf.json" "src/App.tsx")
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file 存在"
        else
            echo "⚠️  $file 不存在"
        fi
    done
else
    echo "❌ 项目结构不完整"
fi

# 创建项目信息文件
cat > project-info.txt << EOF
项目名称: $PROJECT_NAME
窗口标题: $WINDOW_TITLE
项目路径: $(pwd)
创建时间: $(date)
Node.js版本: $(node --version)
pnpm版本: $(pnpm --version)
Rust版本: $(cargo --version | cut -d' ' -f1-2)

启动命令:
  开发模式: ./dev.sh 或 pnpm tauri dev
  构建应用: ./build.sh 或 pnpm tauri build
  运行测试: ./test.sh 或 pnpm test

项目特点:
  ✅ React + TypeScript 配置
  ✅ ESLint + Prettier 代码规范
  ✅ Tauri 后端命令示例
  ✅ 系统信息获取功能
  ✅ 响应式UI组件
  ✅ 完整的项目结构
EOF

echo ""
echo "🎉 项目创建完成！"
echo ""
echo "📁 项目位置: $(pwd)"
echo "🚀 启动开发: ./dev.sh"
echo "📦 构建应用: ./build.sh"
echo ""
echo "📋 下一步:"
echo "1. 运行 './dev.sh' 启动开发服务器"
echo "2. 在弹出的应用窗口中测试功能"
echo "3. 编辑 src/App.tsx 开发你的应用"
echo "4. 运行 './build.sh' 构建生产版本"
echo ""
echo "📖 查看项目信息: cat project-info.txt"
echo "📖 查看README: cat README.md"