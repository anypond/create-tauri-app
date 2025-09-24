# 发布指南

## 本地测试

在发布之前，确保所有功能正常工作：

```bash
# 测试创建脚本
node create.js test-project --force

# 进入测试项目
cd test-project
pnpm install
pnpm tauri dev

# 清理测试项目
cd ..
rm -rf test-project
```

## 发布到 npm

### 1. 登录 npm

```bash
npm login
```

### 2. 更新版本号

```bash
# 更新 package.json 中的版本号
npm version patch  # 或 minor/major
```

### 3. 发布

```bash
npm publish --access public
```

## 使用说明

发布后，用户可以通过以下方式使用：

```bash
# 使用 pnpm create
pnpm create @anypond/create-tauri-app my-app

# 使用 npx
npx @anypond/create-tauri-app my-app

# 或使用命令行工具
create-tauri-app my-app
```

## 注意事项

1. 确保 `template/` 目录包含所有必要的模板文件
2. 测试所有平台的兼容性（Windows、macOS、Linux）
3. 更新 README.md 中的版本信息
4. 确保所有依赖都是最新的稳定版本
