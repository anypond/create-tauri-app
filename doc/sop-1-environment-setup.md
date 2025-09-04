# Tauri 2 + React + TypeScript 开发环境准备 SOP

## 概述
本SOP指导如何准备Tauri 2 + React + TypeScript项目的开发环境。

## 系统要求检查

### 1. 检查操作系统支持
- ✅ Linux (Ubuntu 18.04+, Debian 10+, Fedora 35+)
- ✅ macOS (10.15+)
- ✅ Windows (10+)
- ✅ WSL2 (Windows Subsystem for Linux 2)

### 2. 检查基础工具
```bash
# 检查Node.js版本
node --version
# 需要: v22.0.0+ (LTS)

# 检查pnpm版本
pnpm --version
# 需要: v8.0.0+
```

## 安装步骤

### 步骤1: 安装NVM (Node Version Manager)

#### Linux/macOS/WSL2
```bash
# 安装NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 配置环境变量
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 重新加载shell配置
source ~/.bashrc  # 或 source ~/.zshrc

# 验证NVM安装
nvm --version
```

#### Windows
```bash
# 使用PowerShell安装NVM for Windows
iwr -useb https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.ps1 | iex

# 验证NVM安装
nvm version
```

### 步骤2: 安装Node.js LTS版本

#### 所有平台
```bash
# 安装Node.js 22.x LTS
nvm install 22

# 使用Node.js 22.x
nvm use 22

# 设置默认版本
nvm alias default 22

# 验证安装
node --version
npm --version
```

### 步骤3: 安装pnpm

#### 所有平台
```bash
# 使用npm安装pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

#### 或者使用独立脚本安装
```bash
# Linux/macOS/WSL2
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 重新加载shell配置
source ~/.bashrc  # 或 source ~/.zshrc

# 验证安装
pnpm --version
```

### 步骤4: 安装Rust
#### 所有平台
```bash
# 安装rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 配置环境变量
source ~/.cargo/env

# 验证安装
rustc --version
cargo --version
```

#### Windows特定配置
```bash
# 确保使用MSVC工具链
rustup default stable-msvc
```

### 步骤5: 安装系统依赖

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### WSL2 (Windows Subsystem for Linux 2)
WSL2环境需要额外的配置以确保GUI应用正常工作：

##### 1. 启用WSL2的GUI支持
```bash
# 确保WSL2已正确安装
wsl --install --update

# 检查WSL版本
wsl --version
# 需要: WSL 2.0.0+
```

##### 2. 安装WSL2特定的依赖
```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  dbus-x11 \
  x11-utils \
  libxkbcommon-x11-0 \
  libxcb-icccm4 \
  libxcb-image0 \
  libxcb-keysyms1 \
  libxcb-randr0 \
  libxcb-render-util0 \
  libxcb-xinerama0 \
  libxcb-xfixes0
```

##### 3. 配置环境变量
在 `~/.bashrc` 或 `~/.zshrc` 中添加：
```bash
# 设置显示服务器为WSL2
export DISPLAY=:0.0
export WAYLAND_DISPLAY=wayland-0

# 设置音频支持
export PULSE_SERVER=tcp:$(grep nameserver /etc/resolv.conf | awk '{print $2}'):3456
```

##### 4. 安装X11服务器 (Windows端)
1. 下载并安装 [VcXsrv](https://sourceforge.net/projects/vcxsrv/) 或 [Xming](https://sourceforge.net/projects/xming/)
2. 启动X11服务器
3. 在WSL2中测试：
```bash
# 测试X11连接
xeyes
# 如果看到眼睛图形，说明X11连接正常
```

##### 5. 配置Windows Defender
在Windows防火墙中允许X11服务器通过：
- 控制面板 → 系统和安全 → Windows Defender防火墙
- 允许应用通过防火墙
- 添加VcXsrv或Xming例外

#### Linux (Fedora/CentOS)
```bash
sudo dnf install -y \
  webkit2gtk4.1-devel \
  gcc \
  gcc-c++ \
  curl \
  wget \
  file \
  libX11-devel \
  libXdo-devel \
  openssl-devel \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### macOS
```bash
# 安装Xcode Command Line Tools
xcode-select --install

# 验证安装
xcode-select -p
```

#### Windows
1. 安装 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - 选择"Desktop development with C++"
   - 确保包含MSVC编译器和Windows SDK

2. Microsoft Edge WebView2 (通常已预装)
   - 检查: `Get-AppxPackage -Name "Microsoft.WebView2"` (PowerShell)

### 步骤6: 验证环境
```bash
# 创建测试文件验证环境
echo 'console.log("Node.js working");' > test.js
node test.js

# 验证Rust
cargo --version

# 验证pnpm
pnpm --version

# 验证Node.js版本
node --version
# 预期: v22.x.x

# 验证nvm
nvm --version
```

### 步骤7: 安装代码编辑器
#### VS Code (推荐)
1. 下载 [VS Code](https://code.visualstudio.com/)
2. 安装推荐扩展:
   - `rust-analyzer`
   - `Tauri`
   - `ESLint`
   - `Prettier`
   - `TypeScript and JavaScript Language Features`

## 可选: 移动开发环境

### Android开发
1. 安装 [Android Studio](https://developer.android.com/studio)
2. 配置环境变量:
```bash
# ~/.bashrc 或 ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home)
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/$(ls $ANDROID_HOME/ndk | grep -E '^[0-9]+')
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

3. 安装Rust Android目标:
```bash
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android
```

### iOS开发 (仅macOS)
1. 安装Xcode (Mac App Store)
2. 安装Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. 安装Cocoapods:
```bash
sudo gem install cocoapods
```

4. 安装Rust iOS目标:
```bash
rustup target add aarch64-apple-ios
rustup target add x86_64-apple-ios
```

## 故障排除

### 常见问题

#### 1. Node.js版本过低
```bash
# 使用nvm升级Node.js
nvm install 22
nvm use 22
nvm alias default 22
```

#### 2. pnpm安装失败
```bash
# 清理npm缓存
npm cache clean --force

# 重新安装pnpm
npm install -g pnpm

# 或使用独立脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### 3. Rust编译失败
```bash
# 更新Rust
rustup update

# 检查工具链
rustup show
```

#### 4. WSL2 GUI问题
```bash
# 检查DISPLAY变量
echo $DISPLAY

# 测试X11连接
xeyes

# 重新启动X11服务器
# 在Windows端重启VcXsrv/Xming

# 检查WSL2版本
wsl --version
```

#### 5. Linux依赖问题
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -f

# 检查缺失依赖
sudo apt-get install -y apt-file
sudo apt-file update
```

#### 6. Windows编译问题
```bash
# 检查Visual Studio安装
Get-Module -ListAvailable -Name VSSetup

# 重新安装Visual Studio Build Tools
```

## 环境验证清单

- [ ] Node.js v22.0.0+ (LTS) 已安装
- [ ] pnpm v8.0.0+ 已安装
- [ ] nvm 已安装并配置
- [ ] Rust stable 已安装
- [ ] 系统依赖已安装
- [ ] 代码编辑器已配置
- [ ] 所有工具命令可正常执行
- [ ] (可选) 移动开发环境已配置
- [ ] WSL2 GUI支持已配置 (仅WSL2环境)

## 下一步
环境准备完成后，可以参考《Tauri 2 + React + TypeScript 项目创建 SOP》创建新项目。

---

**注意**: 确保所有工具都添加到系统PATH中，并且可以在命令行中直接访问。