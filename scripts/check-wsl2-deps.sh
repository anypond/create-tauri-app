#!/bin/bash

# WSL2 环境依赖检查和安装指导脚本

set -e

echo "WSL2 Tauri 2 环境依赖检查"
echo "========================="

# 检查当前环境
echo "1. 检查当前环境..."
echo "操作系统: $(uname -a)"
echo "Node.js: $(node --version 2>/dev/null || echo '未安装')"
echo "pnpm: $(pnpm --version 2>/dev/null || echo '未安装')"
echo "Rust: $(cargo --version 2>/dev/null | cut -d' ' -f1-2 || echo '未安装')"

# 检查关键依赖
echo ""
echo "2. 检查系统依赖..."
echo ""

# 定义需要检查的依赖
declare -a deps=(
    "libwebkit2gtk-4.1-dev"
    "build-essential"
    "libxdo-dev"
    "libssl-dev"
    "libayatana-appindicator3-dev"
    "librsvg2-dev"
    "dbus-x11"
    "x11-utils"
    "libxkbcommon-x11-0"
    "libxcb-icccm4"
    "libxcb-image0"
    "libxcb-keysyms1"
    "libxcb-randr0"
    "libxcb-render-util0"
    "libxcb-xinerama0"
    "libxcb-xfixes0"
)

installed_count=0
missing_count=0

for dep in "${deps[@]}"; do
    if dpkg -l | grep -q "^ii  $dep"; then
        echo "✅ $dep"
        ((installed_count++))
    else
        echo "❌ $dep"
        ((missing_count++))
    fi
done

echo ""
echo "依赖统计: $installed_count 已安装, $missing_count 缺失"

# 检查环境变量
echo ""
echo "3. 检查环境变量..."
echo "DISPLAY: ${DISPLAY:-未设置}"
echo "WAYLAND_DISPLAY: ${WAYLAND_DISPLAY:-未设置}"
echo "PULSE_SERVER: ${PULSE_SERVER:-未设置}"
echo "NVM_DIR: ${NVM_DIR:-未设置}"

# 检查nvm状态
echo ""
echo "4. 检查nvm状态..."
if [ -d "$HOME/.nvm" ]; then
    echo "✅ nvm已安装在: $HOME/.nvm"
    if [ -f "$HOME/.nvm/nvm.sh" ]; then
        echo "✅ nvm.sh存在"
    else
        echo "❌ nvm.sh不存在"
    fi
else
    echo "❌ nvm未安装"
fi

# 生成安装指导
echo ""
echo "========================="
echo "安装指导"
echo "========================="

if [ $missing_count -gt 0 ]; then
    echo ""
    echo "📦 安装缺失的系统依赖:"
    echo "sudo apt-get update"
    echo "sudo apt-get install -y \\"
    for dep in "${deps[@]}"; do
        if ! dpkg -l | grep -q "^ii  $dep"; then
            echo "  $dep \\"
        fi
    done
    echo "  fonts-liberation fonts-noto fonts-dejavu-core"
fi

echo ""
echo "🔧 配置nvm环境变量:"
echo "export NVM_DIR=\"$HOME/.nvm\""
echo "[ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\""
echo "[ -s \"\$NVM_DIR/bash_completion\" ] && \. \"\$NVM_DIR/bash_completion\""

echo ""
echo "🖥️  配置WSL2 GUI环境变量:"
echo "export DISPLAY=:0.0"
echo "export WAYLAND_DISPLAY=wayland-0"
echo "export LIBGL_ALWAYS_INDIRECT=1"
echo "export PULSE_SERVER=tcp:\$(grep nameserver /etc/resolv.conf | awk '{print \$2}'):3456"

echo ""
echo "📋 添加到 ~/.bashrc 或 ~/.zshrc:"
cat << 'EOF'
# WSL2 GUI配置
export DISPLAY=:0.0
export WAYLAND_DISPLAY=wayland-0
export LIBGL_ALWAYS_INDIRECT=1
export PULSE_SERVER=tcp:$(grep nameserver /etc/resolv.conf | awk '{print $2}'):3456

# nvm配置
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

echo ""
echo "🚀 重新加载配置:"
echo "source ~/.bashrc"

echo ""
echo "🔍 验证安装:"
echo "./verify-environment.sh"
echo "./test-gui.sh"

echo ""
echo "========================="
echo "Windows端配置 (如果需要传统X11转发):"
echo "1. 安装VcXsrv或Xming"
echo "2. 启动X11服务器"
echo "3. 配置防火墙允许X11连接"
echo ""
echo "Windows 11用户可以使用内置的WSLg，无需额外配置。"
echo "========================="

# 创建一键配置脚本
echo ""
echo "正在创建一键配置脚本..."

cat > setup-tauri-env.sh << 'EOF'
#!/bin/bash
# Tauri 2 环境一键配置脚本

set -e

echo "开始配置 Tauri 2 开发环境..."

# 更新包列表
echo "更新包列表..."
sudo apt-get update

# 安装系统依赖
echo "安装系统依赖..."
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
  libxcb-xfixes0 \
  fonts-liberation \
  fonts-noto \
  fonts-dejavu-core

# 配置环境变量
echo "配置环境变量..."
cat >> ~/.bashrc << 'BASHRC_EOF'

# WSL2 GUI配置
export DISPLAY=:0.0
export WAYLAND_DISPLAY=wayland-0
export LIBGL_ALWAYS_INDIRECT=1
export PULSE_SERVER=tcp:$(grep nameserver /etc/resolv.conf | awk '{print $2}'):3456

# nvm配置
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
BASHRC_EOF

# 重新加载配置
echo "重新加载配置..."
source ~/.bashrc

echo "配置完成！"
echo ""
echo "请运行以下命令验证安装："
echo "./verify-environment.sh"
echo "./test-gui.sh"
EOF

chmod +x setup-tauri-env.sh

echo "✅ 一键配置脚本已创建: setup-tauri-env.sh"
echo "运行命令: bash setup-tauri-env.sh"