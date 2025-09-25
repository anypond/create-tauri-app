# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tauri 2 + React + TypeScript template project designed to serve as a foundation for multiple desktop applications. The project features a flat structure for simplicity and includes comprehensive code quality tools and Git commit conventions.

## Project Structure

```
[project-name]/
├── src/                    # React frontend source code
│   ├── components/         # Reusable React components
│   │   └── theme-toggle.tsx # Theme switching component
│   └── assets/            # Static assets
├── src-tauri/              # Tauri backend (Rust)
│   ├── src/               # Rust source code
│   ├── capabilities/       # Tauri capabilities
│   ├── icons/             # Application icons
│   └── target/            # Rust build artifacts
├── public/                 # Static assets
│   ├── tauri.svg          # Tauri icon
│   └── vite.svg           # Vite icon
├── .husky/                 # Git hooks (auto-installed)
├── .vscode/                # VS Code configuration
├── package.json            # Project dependencies and scripts
├── index.html             # HTML entry point
├── README.md              # Project documentation
├── CLAUDE.md              # Claude AI assistance guide
├── COMMIT_GUIDE.md        # Git commit conventions guide
├── .gitignore             # Git ignore rules
├── .editorconfig          # Editor configuration
├── .prettierrc            # Prettier code formatting
├── .prettierignore        # Prettier ignore rules
├── eslint.config.js       # ESLint configuration
├── commitlint.config.js   # Commit message validation
├── cz-config.js           # Commitizen configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript Node configuration
├── vite.config.ts         # Vite build configuration
└── pnpm-lock.yaml         # Dependency lock file
```

## Development Commands

### Primary Development Workflow

**Direct pnpm commands:**

```bash
# Install dependencies (auto-installs Git hooks)
pnpm install

# Development
pnpm tauri dev

# Build
pnpm tauri build

# Type checking
pnpm typecheck

# Lint and format
pnpm lint
pnpm format

# Commit with conventional format
pnpm commit

# Release new version
pnpm release
```

## Architecture Overview

### Frontend (React + TypeScript)

- **Framework**: React 19.1.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Location**: `src/`
- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Styling**: Tailwind CSS v3 with daisyUI component library in `src/index.css`
- **UI Components**: daisyUI - pre-built components with semantic class names
- **Theme System**: Built-in dark/light mode with daisyUI theme system

### Backend (Tauri + Rust)

- **Framework**: Tauri 2.0.0
- **Language**: Rust 2021 edition
- **Location**: `src-tauri/`
- **Entry Point**: `src-tauri/src/main.rs` → `src-tauri/src/lib.rs`
- **Commands**: Defined in `lib.rs` with `#[tauri::command]` macro

### Project Configuration

- **Package Manager**: pnpm (required)
- **Node.js**: v22.19.0 LTS (managed via nvm)
- **Frontend Dist**: `dist/`
- **Tauri Config**: `src-tauri/tauri.conf.json`
- **Git Hooks**: Auto-installed via `prepare` script

## Key Development Patterns

### Tauri Command Pattern

Commands are defined in Rust with the `#[tauri::command]` macro and registered in the `invoke_handler`. Example from `template/src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Register in builder
.invoke_handler(tauri::generate_handler![greet])
```

### Frontend-Backend Communication

React components call Rust commands using the `invoke` function:

```typescript
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('greet', { name: 'World' })
```

## Environment Requirements

### Development Environment

- **Node.js**: v22.19.0 LTS (via nvm)
- **pnpm**: v10.15.1 (package manager)
- **Rust**: 1.89.0 with cargo
- **WSL2**: Required for Windows development with GUI support

### System Dependencies (WSL2/Linux)

- `libwebkit2gtk-4.1-dev`
- `build-essential`
- `libxdo-dev`
- `libssl-dev`
- `libayatana-appindicator3-dev`
- `librsvg2-dev`

## Important Notes

- **Always use pnpm** - this is the mandated package manager for all projects
- **WSL2 GUI support** may be required for Windows development environments

## daisyUI + Tailwind CSS Implementation

### Critical Configuration Requirements

**daisyUI Configuration**:

- Uses `tailwind.config.js` file with daisyUI plugin
- PostCSS configuration uses `tailwindcss` and `autoprefixer` plugins
- CSS structure uses `@tailwind` directives

**Configuration Files**:

- `tailwind.config.js` - Main configuration with daisyUI plugin and themes
- `postcss.config.js` - PostCSS plugin configuration
- `src/index.css` - Custom styles and utilities

**daisyUI Setup in `tailwind.config.js`**:

```javascript
module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
  },
}
```

### daisyUI Component System

**Built-in Components**:

- **Buttons**: `btn`, `btn-primary`, `btn-secondary`, `btn-outline`, `btn-ghost`
- **Cards**: `card`, `card-body`, `card-title`, `card-actions`
- **Inputs**: `input`, `input-bordered`, `input-primary`
- **Forms**: `form-control`, `label`, `label-text`
- **Alerts**: `alert`, `alert-info`, `alert-success`, `alert-warning`, `alert-error`
- **Layout**: `hero`, `navbar`, `footer`, `divider`

**Key Benefits**:

- Pre-built, accessible components with consistent styling
- No need for custom React component wrappers
- Semantic class names that are easy to understand
- Built-in dark mode support
- Responsive design out of the box

### Theme System

**daisyUI Themes**:

- Light and dark themes built-in
- Theme switching via CSS `dark` class (DaisyUI v5+)
- Consistent color tokens across themes
- Easy theme customization

**Theme Implementation**:

```javascript
// Theme switching in components
const toggleTheme = () => {
  const html = document.documentElement
  if (isDark) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}
```

**Features**:

- System preference detection via `prefers-color-scheme`
- localStorage persistence
- Automatic theme initialization
- Smooth theme transitions

### Component Usage Patterns

**Button Examples**:

```html
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-outline">Outline Button</button>
<button className="btn btn-ghost">Ghost Button</button>
```

**Card Examples**:

```html
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p className="text-base-content/70">Card content</p>
    <div className="card-actions">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

**Form Examples**:

```html
<div className="form-control">
  <label className="label">
    <span className="label-text">Username</span>
  </label>
  <input type="text" className="input input-bordered" />
</div>
```

### Color System

**daisyUI Color Tokens**:

- `primary` - Primary brand color
- `secondary` - Secondary color
- `accent` - Accent color for highlights
- `neutral` - Neutral colors for text and borders
- `base-100` - Background color
- `base-content` - Text color
- `info`, `success`, `warning`, `error` - Status colors

**Usage Examples**:

```html
<div className="bg-primary text-primary-content">Primary background</div>
<div className="text-base-content/70">Muted text</div>
<div className="border-neutral">Neutral border</div>
```

### Layout and Spacing

**daisyUI Layout Classes**:

- `container` - Responsive container
- `grid` - CSS Grid layouts
- `flex` - Flexbox layouts
- `divider` - Content separators
- `mockup-code` - Code display components

**Responsive Design**:

- Built-in responsive utilities
- Mobile-first approach
- Consistent breakpoint system

### Accessibility Features

**Built-in Accessibility**:

- All components follow ARIA guidelines
- Proper focus management
- Keyboard navigation support
- Screen reader compatibility

**Theme Accessibility**:

- Sufficient color contrast ratios
- Clear visual hierarchy
- Consistent focus indicators

### Performance Benefits

**Optimized CSS**:

- Tree-shaking for unused components
- Minimal CSS footprint
- Fast build times
- Optimized runtime performance

**Development Experience**:

- Rapid prototyping with pre-built components
- Consistent design system
- Easy customization and theming
- Excellent documentation

## Tauri 2.0 macOS Compatibility

### objc2 Debug Assertions Configuration

**Critical for macOS compatibility**: Tauri 2.0 requires disabling debug assertions for the `objc2` package to support older macOS versions. Add this configuration to `Cargo.toml`:

```toml
[profile.dev.package.objc2]
debug-assertions = false
```

**Why this is needed**:

- objc2 is the Rust binding to Objective-C runtime used by Tauri on macOS
- Debug assertions in objc2 can cause runtime errors on older macOS versions
- Disabling debug assertions maintains development functionality while ensuring compatibility
- This configuration does not affect production builds (release profile)

**Location**: Add this section in the root of `Cargo.toml`, typically after the `[package]` section and before or after other profile configurations.

## ESLint and Prettier Code Quality Configuration

### ESLint Configuration

The project uses ESLint for code quality and consistency. Configuration is in `template/eslint.config.js`:

**Key Plugins and Rules**:

- **JavaScript**: Base ESLint recommended rules
- **TypeScript**: @typescript-eslint plugin with recommended rules
- **React**: React and React Hooks specific rules
- **Prettier Integration**: eslint-config-prettier to avoid conflicts

**Notable Rules**:

- React JSX best practices (no React in scope, key requirements)
- TypeScript strictness (warn on explicit any, unused vars with \_ prefix)
- Custom globals for browser and Node.js APIs
- Disabled rules that conflict with modern patterns

**Commands**:

```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

### Prettier Configuration

Prettier ensures consistent code formatting. Configuration is in `template/.prettierrc`:

**Formatting Rules**:

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 2-space indentation (`tabWidth: 2`)
- ES5 trailing commas (`trailingComma: "es5"`)
- 100 character line length (`printWidth: 100`)
- LF line endings (`endOfLine: "lf"`)

**Commands**:

```bash
pnpm format        # Format all files
pnpm format:check  # Check if formatting is needed
```

### Development Workflow

**Recommended Process**:

1. Configure editor for format-on-save
2. Run `pnpm lint` and `pnpm format:check` before commits
3. Use `pnpm lint:fix` and `pnpm format` to fix issues

**VS Code Settings** (in `.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Package Scripts

The template includes these quality scripts in `package.json`:

- `"lint": "eslint ."`
- `"lint:fix": "eslint . --fix"`
- `"format": "prettier --write ."`
- `"format:check": "prettier --check ."`
- `"typecheck": "tsc --noEmit"`

## Git Commit Conventions

The project uses conventional commits with automated enforcement:

### Commit Format

The project supports standard conventional commit format:

1. **Basic format**: `feat: 添加新功能`
2. **With scope**: `fix(ui): 修复按钮样式`
3. **Optional emoji**: `✨feat: 添加新功能` (emoji is optional but supported)

### Supported Commit Types

| Type     | Description    |
| -------- | -------------- |
| feat     | 新功能         |
| fix      | 修复 bug       |
| docs     | 文档更新       |
| style    | 代码格式调整   |
| refactor | 重构           |
| test     | 增加测试       |
| build    | 构建相关变动   |
| ci       | CI/CD 配置变动 |
| chore    | 其他修改       |
| revert   | 回滚           |

### Usage

```bash
# Interactive commit (recommended)
pnpm commit

# Manual commit (must follow format)
git commit -m "feat: add new feature"
git commit -m "fix(auth): fix login issue"
git commit -m "docs: update API documentation"

# The prepare script automatically installs Git hooks
pnpm install
```

### Hook Configuration

- **pre-commit**: Runs lint-staged to check and format staged files
- **commit-msg**: Validates commit message format with commitlint
- **Auto-install**: Hooks are automatically installed via `prepare` script
- **Scope support**: Optional scope in parentheses (e.g., `(ui)`, `(auth)`)

### Commitlint Configuration

The project uses standard commitlint configuration:

- Follows conventional commit format: `type(scope): subject`
- Maximum header length: 100 characters
- Enforces proper commit types and formatting

### Commitizen Configuration

Custom commitizen configuration (`cz-config.js`) provides:

- Interactive prompts for commit type, scope, and message
- Optional scope field for better change tracking
- Proper formatting according to conventional commits
