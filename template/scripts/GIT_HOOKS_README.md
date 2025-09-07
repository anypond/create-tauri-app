# Git Hooks 初始化说明

## 模板项目说明

本模板项目包含了完整的 Git hooks 配置（使用 husky + commitlint），但由于模板项目的特殊性，Git hooks 需要在创建新项目后手动初始化。

## 使用方法

### 1. 从模板创建新项目后

```bash
# 进入项目目录
cd your-new-project

# 初始化 Git 仓库（如果还没有）
git init

# 运行初始化脚本
./scripts/setup-git-hooks.sh
```

### 2. 或手动初始化

```bash
# 安装 husky hooks
pnpm exec husky install

# 确保权限
chmod +x .husky/*
```

## 为什么需要这样做？

1. **Git hooks 的特性**：Git hooks 必须存储在 `.git/hooks/` 目录中
2. **模板限制**：模板项目本身不能包含 `.git` 目录
3. **安全性**：避免模板中的 hooks 影响其他项目

## 自动化方案

如果你使用项目创建脚本（如 `create-tauri-project.sh`），脚本会自动执行这些初始化步骤。

## 验证安装

安装完成后，可以通过以下方式验证：

```bash
# 尝试一个不符合规范的提交
git commit -m "bad commit"
# 应该会看到 commitlint 错误

# 使用规范的提交
pnpm commit
# 应该会打开 Commitizen 交互界面
```