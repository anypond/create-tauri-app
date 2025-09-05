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
- **Styling**: CSS modules with global styles in `src/App.css`

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