#!/bin/bash

# Tauri 2 + React + TypeScript 环境验证脚本

set -e

echo "开始验证 Tauri 2 开发环境..."
echo "=================================="

# 检查操作系统
echo "1. 检查操作系统..."
if grep -q Microsoft /proc/version; then
    echo "✅ WSL环境检测正常"
    WSL_VERSION=$(wsl.exe --version 2>/dev/null | head -1 | cut -d' ' -f1 || echo "无法检测WSL版本")
    echo "   WSL版本: $WSL_VERSION"
else
    echo "✅ Linux环境检测正常"
fi

# 检查Node.js版本
echo ""
echo "2. 检查Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js版本: $NODE_VERSION"
    
    # 检查是否为v22.x LTS
    if [[ $NODE_VERSION == v22.* ]]; then
        echo "✅ Node.js版本符合要求 (v22.x LTS)"
    else
        echo "⚠️  建议升级到Node.js v22.x LTS"
        echo "   运行: nvm install 22 && nvm use 22"
    fi
else
    echo "❌ Node.js未安装"
fi

# 检查pnpm
echo ""
echo "3. 检查pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo "✅ pnpm版本: $PNPM_VERSION"
    
    if [[ $(echo "$PNPM_VERSION" | cut -d'.' -f1) -ge 8 ]]; then
        echo "✅ pnpm版本符合要求 (v8.0.0+)"
    else
        echo "⚠️  pnpm版本过低，建议升级"
    fi
else
    echo "❌ pnpm未安装"
fi

# 检查nvm
echo ""
echo "4. 检查nvm..."
if command -v nvm &> /dev/null; then
    NVM_VERSION=$(nvm --version)
    echo "✅ nvm版本: $NVM_VERSION"
else
    echo "❌ nvm未安装"
fi

# 检查Rust
echo ""
echo "5. 检查Rust..."
if command -v cargo &> /dev/null; then
    CARGO_VERSION=$(cargo --version)
    echo "✅ Cargo版本: $CARGO_VERSION"
    
    RUSTC_VERSION=$(rustc --version 2>/dev/null || echo "rustc不可用")
    echo "✅ Rustc版本: $RUSTC_VERSION"
else
    echo "❌ Rust未安装"
fi

# 检查系统依赖
echo ""
echo "6. 检查系统依赖..."
DEPS_CHECKED=0
DEPS_MISSING=0

# 检查关键依赖
for dep in libwebkit2gtk-4.1-dev build-essential libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev; do
    if dpkg -l | grep -q "^ii  $dep"; then
        echo "✅ $dep 已安装"
        ((DEPS_CHECKED++))
    else
        echo "❌ $dep 未安装"
        ((DEPS_MISSING++))
    fi
done

if [ $DEPS_MISSING -eq 0 ]; then
    echo "✅ 所有关键依赖已安装 ($DEPS_CHECKED/$DEPS_CHECKED)"
else
    echo "⚠️  发现 $DEPS_MISSING 个缺失依赖，需要安装"
fi

# 检查WSL2 GUI支持
echo ""
echo "7. 检查WSL2 GUI支持..."
if [ -n "$DISPLAY" ]; then
    echo "✅ DISPLAY环境变量: $DISPLAY"
else
    echo "❌ DISPLAY环境变量未设置"
fi

if [ -n "$WAYLAND_DISPLAY" ]; then
    echo "✅ WAYLAND_DISPLAY环境变量: $WAYLAND_DISPLAY"
else
    echo "⚠️  WAYLAND_DISPLAY环境变量未设置"
fi

# 测试X11连接
echo ""
echo "8. 测试X11连接..."
if command -v xeyes &> /dev/null; then
    echo "ℹ️  xeyes命令可用，可以测试X11连接"
    echo "   运行: xeyes"
else
    echo "⚠️  xeyes命令不可用，需要安装x11-apps"
    echo "   运行: sudo apt-get install x11-apps"
fi

# 创建测试项目
echo ""
echo "9. 测试项目创建..."
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

if pnpm create tauri-app@latest --help &> /dev/null; then
    echo "✅ create-tauri-app命令可用"
else
    echo "❌ create-tauri-app命令不可用"
fi

# 清理
cd - > /dev/null
rm -rf "$TEMP_DIR"

# 生成报告
echo ""
echo "=================================="
echo "环境验证完成！"
echo ""
echo "总结："
echo "- Node.js: $([ -n "$NODE_VERSION" ] && echo "✅ $NODE_VERSION" || echo "❌ 未安装")"
echo "- pnpm: $([ -n "$PNPM_VERSION" ] && echo "✅ $PNPM_VERSION" || echo "❌ 未安装")"
echo "- Rust: $([ -n "$CARGO_VERSION" ] && echo "✅ 已安装" || echo "❌ 未安装")"
echo "- 系统依赖: $([ $DEPS_MISSING -eq 0 ] && echo "✅ 已安装" || echo "❌ 有缺失")"
echo "- WSL2 GUI: $([ -n "$DISPLAY" ] && echo "✅ 已配置" || echo "❌ 未配置")"
echo ""
echo "下一步："
if [ $DEPS_MISSING -gt 0 ]; then
    echo "1. 运行 ./install-wsl2-deps.sh 安装系统依赖"
fi
if [ -z "$DISPLAY" ]; then
    echo "2. 运行 ./config-wsl2-gui.sh 配置GUI环境"
fi
echo "3. 运行 ./test-gui.sh 测试GUI支持"
echo "4. 开始创建Tauri项目"