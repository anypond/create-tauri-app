# 发布指南

## 本地测试

在发布之前，确保所有功能正常工作：

```bash
# 测试创建脚本
node create.js test-project

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

**推荐使用标准版本管理：**

```bash
# 使用 standard-version (推荐，会自动生成变更日志)
pnpm version patch    # 或 minor/major

# 或者使用 npm version (仅更新版本号)
npm version patch     # 或 minor/major
```

**使用 standard-version 的优势：**

- 自动生成符合规范的提交消息
- 自动更新 CHANGELOG.md
- 支持语义化版本控制
- 遵循项目的提交规范

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

## 系统要求

### 开发环境要求

- **Node.js**: >= 18.0.0 (推荐 v22.19.0 LTS)
- **pnpm**: >= 10.15.1 (必须使用)
- **Rust**: 1.89.0 (仅模板项目需要)
- **操作系统**: Windows、macOS、Linux

### 依赖要求

- **前端**: React 19.1.0+、TypeScript 5.8.3+、Vite 7.0.4+
- **后端**: Tauri 2.0.0+、Rust 1.89.0+
- **样式**: Tailwind CSS 3.4.1+、DaisyUI 5.0.38+

## 注意事项

1. **包管理器**: 必须使用 pnpm，不支持 npm 或 yarn
2. **模板完整性**: 确保 `template/` 目录包含所有必要的模板文件
3. **依赖版本**: 确保 Tauri 2.0.0+ 和 React 19.1.0+ 版本兼容性
4. **文件包含**: package.json 中的 `files` 字段必须包含 `create.js` 和 `template/**/*`
5. **平台兼容性**: 测试 Windows、macOS、Linux 平台的兼容性
6. **文档更新**: 更新 README.md 中的版本信息和使用说明
7. **依赖安全**: 确保所有依赖都是最新的稳定版本，无安全漏洞
