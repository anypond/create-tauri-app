#!/bin/bash

# Template 项目初始化脚本
# 用于在新创建的项目中设置 Git hooks

set -e

echo "🔧 Setting up Git hooks for the new project..."

# 检查是否在 Git 仓库中
if [ ! -d ".git" ]; then
    echo "⚠️  Not in a Git repository. Please run 'git init' first."
    exit 1
fi

# 设置 husky
echo "📦 Installing husky hooks..."
pnpm exec husky install

# 确保 hooks 有执行权限
chmod +x .husky/*

echo "✅ Git hooks setup complete!"
echo ""
echo "Usage:"
echo "  pnpm commit    - Make a commit with Commitizen"
echo "  pnpm release   - Create a new release"
echo ""