# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tauri 2 + React + TypeScript template project designed to serve as a foundation for multiple desktop applications. The project follows a standardized development workflow using pnpm as the package manager and includes comprehensive automation scripts for environment setup and project creation.

## Project Structure

```
tauri-template/
├── doc/                    # Documentation and SOPs
│   ├── sop-1-environment-setup.md
│   ├── sop-2-project-creation.md
│   └── 快速开始指南.md
├── scripts/                # Automation scripts
│   ├── tauri-starter.sh    # Main launcher script
│   ├── create-tauri-project.sh
│   ├── verify-environment.sh
│   └── check-wsl2-deps.sh
└── template/               # Base template project
    ├── src/                # React frontend
    ├── src-tauri/          # Tauri backend (Rust)
    └── package.json
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

**Direct pnpm commands (when working in template/ directory):**
```bash
# Development
cd template
pnpm tauri dev

# Build
pnpm tauri build

# Install dependencies
pnpm install
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
- **Location**: `template/src/`
- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Styling**: Tailwind CSS v4 with custom component system in `src/index.css`
- **UI Components**: Radix UI with custom styling
- **Theme System**: Built-in dark/light mode with CSS variables

### Backend (Tauri + Rust)
- **Framework**: Tauri 2.0.0
- **Language**: Rust 2021 edition
- **Location**: `template/src-tauri/`
- **Entry Point**: `src-tauri/src/main.rs` → `src-tauri/src/lib.rs`
- **Commands**: Defined in `lib.rs` with `#[tauri::command]` macro

### Project Configuration
- **Package Manager**: pnpm (required)
- **Node.js**: v22.19.0 LTS (managed via nvm)
- **Frontend Dist**: `template/dist/`
- **Tauri Config**: `template/src-tauri/tauri.conf.json`

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
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("greet", { name: "World" });
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

The project includes two comprehensive SOP documents:

1. **sop-1-environment-setup.md**: Complete environment setup including nvm, Node.js, pnpm, Rust, and WSL2 configuration
2. **sop-2-project-creation.md**: Step-by-step project creation following standardized patterns

## Important Notes

- **Always use pnpm** - this is the mandated package manager for all projects
- **Environment variables** are automatically set by the launcher scripts
- **WSL2 GUI support** is configured for Windows development environments
- **Template projects** should be created using the automation scripts to ensure consistency

## Tailwind CSS v4 Implementation Notes

### Critical Configuration Requirements

**Tailwind CSS v4 does not require a config file** - The project uses zero-configuration approach with all settings defined in CSS via `@theme` directive.

**PostCSS Configuration**: 
- Only requires `postcss.config.js` with `@tailwindcss/postcss` plugin
- No `tailwind.config.js` file needed (was removed for v4 compatibility)

**CSS Structure in `template/src/index.css`**:
- `@theme` block defines light mode color variables
- `.dark` selector defines dark mode color variables
- Custom component classes instead of `@apply` directives (v4 compatibility)
- Gradient variables for theme switching: `--gradient-from` and `--gradient-to`

### Dark Mode Implementation

**Theme Switching**: 
- Uses class-based strategy (`darkMode: "class"` in CSS)
- Theme toggle component adds/removes `.dark` class from `<html>` element
- CSS variables automatically switch between light and dark themes

**Key Implementation Details**:
- Background gradient switches from light (`#eff6ff` to `#e0e7ff`) to dark (`#111827` to `#1f2937`)
- All component colors use CSS variables that change with theme
- No JavaScript required for color transitions beyond class toggling

### Component Styling Approach

**Avoid `@apply` in v4**: 
- Tailwind CSS v4 has limited `@apply` support
- Use custom CSS classes with direct property definitions
- Reference CSS variables for theming: `var(--color-primary)`, `var(--color-background)`, etc.

**Component Classes**:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` for buttons
- `.input` for form inputs
- `.card`, `.card-header`, `.card-content`, `.card-title`, `.card-description` for cards
- Typography classes: `.heading-1`, `.heading-2`, `.heading-3`, `.text-large`, `.text-small`

### Common Development Issues and Solutions

**Build Errors with `@theme`**:
- Ensure `@theme` blocks only contain custom properties, not selectors
- Move selector-based dark mode variables to separate `.dark` rule
- Use `@layer` directives for component organization

**Dark Mode Not Working**:
- Verify theme toggle component properly adds/removes `.dark` class
- Check that CSS variables are defined in both `:root` and `.dark` selectors
- Ensure gradient variables are properly scoped for theme switching

**PostCSS Configuration Issues**:
- Use `'@tailwindcss/postcss'` plugin, not `tailwindcss`
- Ensure `autoprefixer` is included after Tailwind plugin
- No additional configuration needed for v4