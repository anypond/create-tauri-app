# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tauri 2 + React + TypeScript template project designed to serve as a foundation for multiple desktop applications. The project features a flat structure for simplicity and includes comprehensive automation scripts, code quality tools, and Git commit conventions.

## Project Structure

```
tauri-template/
├── src/                    # React frontend source code
│   ├── components/         # Reusable React components
│   │   └── ui/            # UI components with Radix UI
│   ├── lib/               # Utility functions
│   └── assets/            # Static assets
├── src-tauri/              # Tauri backend (Rust)
│   ├── src/               # Rust source code
│   ├── capabilities/       # Tauri capabilities
│   └── icons/             # Application icons
├── scripts/                # Automation scripts
│   ├── tauri-starter.sh    # Main launcher script
│   ├── create-tauri-project.sh
│   ├── verify-environment.sh
│   └── check-wsl2-deps.sh
├── doc/                    # Documentation and SOPs
├── .husky/                 # Git hooks (auto-installed)
├── .vscode/                # VS Code configuration
├── package.json            # Project dependencies and scripts
├── README.md              # Project documentation
├── COMMIT_GUIDE.md        # Git commit conventions guide
└── ...                    # Configuration files
```

## Development Commands

### Primary Development Workflow

**Using the main launcher script (recommended):**

```bash
# Show help and all options
./scripts/tauri-starter.sh --help

# Check environment setup
./scripts/tauri-starter.sh --env

# Test GUI environment (WSL2)
./scripts/tauri-starter.sh --gui

# Create new project
./scripts/tauri-starter.sh --create my-app

# Start development server
./scripts/tauri-starter.sh --dev

# Build project
./scripts/tauri-starter.sh --build
```

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

### Environment Management

**Verify environment setup:**

```bash
./scripts/verify-environment.sh
```

**Check WSL2 dependencies:**

```bash
./scripts/check-wsl2-deps.sh
```

## Architecture Overview

### Frontend (React + TypeScript)

- **Framework**: React 19.1.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Location**: `src/`
- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Styling**: Tailwind CSS v3 with custom component system in `src/index.css`
- **UI Components**: Radix UI with custom styling
- **Theme System**: Built-in dark/light mode with CSS variables

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

## SOP Documents

The project includes comprehensive SOP documents:

1. **sop-1-environment-setup.md**: Complete environment setup including nvm, Node.js, pnpm, Rust, and WSL2 configuration
2. **sop-2-project-creation.md**: Step-by-step project creation following standardized patterns
3. **README.md**: Contains detailed project design information including architecture, workflow, and best practices

## Important Notes

- **Always use pnpm** - this is the mandated package manager for all projects
- **Environment variables** are automatically set by the launcher scripts
- **WSL2 GUI support** is configured for Windows development environments
- **Template projects** should be created using the automation scripts to ensure consistency

## Tailwind CSS v3 Implementation Notes

### Critical Configuration Requirements

**Tailwind CSS v3 Configuration**:

- Uses `tailwind.config.js` file for configuration
- PostCSS configuration uses `tailwindcss` and `autoprefixer` plugins
- CSS structure uses `@tailwind` directives and `@apply` syntax

**Configuration Files**:

- `tailwind.config.js` - Main configuration with theme extensions
- `postcss.config.js` - PostCSS plugin configuration
- `src/index.css` - Custom styles and theme variables

**CSS Structure in `template/src/index.css`**:

- `@tailwind base;` - Tailwind base styles
- `@tailwind components;` - Component styles
- `@tailwind utilities;` - Utility classes
- `:root` and `.dark` selectors for theme variables
- Custom component classes using `@apply` directives

### Theme System

**Configuration**:

- Theme variables defined in `tailwind.config.js` using HSL format
- CSS variables mapped to semantic names (`primary`, `secondary`, etc.)
- Component variants use theme-configured colors

**Key Implementation Details**:

- Colors: `bg-primary`, `text-primary-foreground`, `bg-secondary`
- States: `hover:bg-primary/90`, `disabled:opacity-50`
- Components follow consistent theming patterns

### Component Styling Approach

**CVA (Class Variance Authority)**:

- Button components use CVA for variant management
- Consistent styling across all UI components
- Full theme integration with semantic color names

**Component Examples**:

- `Button` variants: `default`, `secondary`, `outline`, `ghost`, `link`
- `Card` components: `bg-card`, `text-card-foreground`
- `Input` components: `border-input`, `bg-background`, `placeholder:text-muted-foreground`

### Theme Configuration Structure

**Color System**:

```javascript
// tailwind.config.js
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... more colors
}
```

**CSS Variables**:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  // ... more variables
}
```

### Common Development Patterns

**Using Theme Colors**:

- `bg-primary` for primary backgrounds
- `text-primary-foreground` for contrasting text
- `border-input` for input field borders
- `bg-muted` for subtle backgrounds

**Component Variants**:

- Use semantic names, not hardcoded colors
- Support hover, focus, and disabled states
- Maintain consistent spacing and typography

### macOS Big Sur Compatibility

**Browser Support**:

- Tailwind CSS v3 fully supports macOS Big Sur WebView
- No issues with CSS variables or modern features
- Compatible with Safari WebView and system WebViews

**Performance Benefits**:

- Smaller CSS bundle size compared to v4
- Better build performance and compatibility
- Reliable PurgeCSS optimization

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

The project uses conventional commits with emoji support and automated enforcement:

### Commit Format

The project supports three commit message formats:

1. **With emoji (recommended)**: `✨feat: 添加新功能`
2. **With emoji and scope**: `🐛fix(ui): 修复按钮样式`
3. **Without emoji**: `fix: 简单修复`

### Supported Commit Types

| Emoji | Type     | Description    |
| ----- | -------- | -------------- |
| ✨    | feat     | 新功能         |
| 🐛    | fix      | 修复 bug       |
| 📚    | docs     | 文档更新       |
| 💎    | style    | 代码格式调整   |
| 📦    | refactor | 重构           |
| 🚨    | test     | 增加测试       |
| 🛠    | build    | 构建相关变动   |
| ⚙️    | ci       | CI/CD 配置变动 |
| ♻️    | chore    | 其他修改       |
| 🗑    | revert   | 回滚           |

### Usage

```bash
# Interactive commit with emoji support (recommended)
pnpm commit

# Manual commit (must follow format)
git commit -m "✨feat: add new feature"
git commit -m "🐛fix(auth): fix login issue"

# The prepare script automatically installs Git hooks
pnpm install
```

### Hook Configuration

- **pre-commit**: Runs lint-staged to check and format staged files
- **commit-msg**: Validates commit message format with commitlint
- **Auto-install**: Hooks are automatically installed via `prepare` script
- **Scope support**: Optional scope in parentheses (e.g., `(ui)`, `(auth)`)

### Commitlint Configuration

The project uses custom commitlint configuration to support emoji format:

- Parser pattern: `^(?:(\p{Emoji})\s*)?(\w+)(?:\(([^)]+)\))?: (.+)$/u`
- Header correspondence: `['emoji', 'type', 'scope', 'subject']`
- Maximum header length: 100 characters (including emoji)

### Commitizen Configuration

Custom commitizen configuration (`cz-config.js`) provides:

- Interactive prompts for commit type, scope, and message
- Automatic emoji insertion based on selected type
- Optional scope field for better change tracking
- Proper formatting with no space between emoji and type
