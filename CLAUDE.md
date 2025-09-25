# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tauri 2 + React + TypeScript template creator project. It provides a command-line tool for generating desktop application templates with comprehensive development tooling and best practices.

## Project Structure

```
@anypond/create-tauri-app/
├── create.js              # Main CLI script for creating projects
├── package.json           # Tool project dependencies and scripts
├── eslint.config.js       # ESLint configuration (supports both main and template projects)
├── cz-config.js           # Commitizen configuration for conventional commits
├── commitlint.config.js   # Commit message validation
├── .husky/                # Git hooks (auto-installed)
└── template/              # Template project structure
    ├── src/               # React frontend source code
    │   ├── components/    # Reusable React components
    │   │   └── theme-toggle.tsx # Theme switching component
    │   └── assets/       # Static assets
    ├── src-tauri/         # Tauri backend (Rust)
    │   ├── src/          # Rust source code
    │   ├── capabilities/  # Tauri capabilities
    │   ├── icons/        # Application icons
    │   └── target/       # Rust build artifacts
    ├── public/            # Static assets
    ├── .husky/           # Git hooks (auto-installed in created projects)
    ├── .vscode/          # VS Code configuration
    ├── package.json       # Template project dependencies
    ├── README.md         # Template project documentation
    ├── CLAUDE.md         # Template project Claude guidance
    └── ...               # Other configuration files
```

## Development Commands

### Primary Development Workflow

**For the template creator (main project):**

```bash
# Install dependencies
pnpm install

# Create a new project from template
pnpm create my-app

# Lint the main project code
pnpm lint

# Format code
pnpm format

# Commit with conventional format
pnpm commit
```

**For testing the template:**

```bash
# Navigate to template directory
cd template

# Install template dependencies
pnpm install

# Start development server
pnpm tauri dev

# Build template
pnpm tauri build
```

## Architecture Overview

### Template Creator (Main Project)

- **Purpose**: CLI tool for creating Tauri projects from template
- **Entry Point**: `create.js` - Command-line interface using Commander.js
- **Package Manager**: pnpm (required)
- **Node.js**: v22.19.0 LTS or later
- **Features**: Interactive prompts, project configuration, dependency installation

### Template Project

- **Framework**: React 19.1.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Backend**: Tauri 2.0.0 with Rust 1.89.0
- **Styling**: Tailwind CSS v3 with DaisyUI component library
- **UI Components**: DaisyUI - pre-built components with semantic class names
- **Theme System**: Built-in dark/light mode with DaisyUI theme system

## Key Development Patterns

### Template Creation Process

1. **User Input**: Interactive prompts collect project configuration
2. **Directory Creation**: Creates project directory with standardized structure
3. **File Copying**: Copies template files while preserving directory structure
4. **Configuration Update**: Updates package.json, README.md, and other config files
5. **Dependency Installation**: Runs `pnpm install` in the created project
6. **Git Initialization**: Initializes Git repository if requested

### ESLint Configuration

The project uses a dual ESLint configuration:

- **Main Project**: Node.js scripts with JavaScript/ESM rules
- **Template Project**: React/TypeScript rules for template files
- **Shared Rules**: Common formatting and quality rules across both

### File Handling in create.js

```javascript
// Example of directory creation and file copying
async function createProject(projectName, options) {
  // Create project directory
  await fs.ensureDir(projectName)

  // Copy template files
  await fs.copy('template', projectName, {
    filter: src => {
      // Skip certain files and directories
      return !shouldSkip(src)
    },
  })

  // Update package.json
  const pkgJson = await fs.readJson(`${projectName}/package.json`)
  pkgJson.name = projectName
  // ... other updates
  await fs.writeJson(`${projectName}/package.json`, pkgJson, { spaces: 2 })
}
```

## Environment Requirements

### Development Environment

- **Node.js**: v22.19.0 LTS (via nvm)
- **pnpm**: v10.15.1 (package manager)
- **Rust**: 1.89.0 with cargo (for template testing)
- **WSL2**: Required for Windows development with GUI support

### System Dependencies (WSL2/Linux)

- `libwebkit2gtk-4.1-dev`
- `build-essential`
- `libxdo-dev`
- `libssl-dev`
- `libayatana-appindicator3-dev`
- `librsvg2-dev`

## Template Configuration

### Package.json Structure

The template's package.json includes:

- **Dependencies**: React, TypeScript, Tauri, Tailwind CSS, DaisyUI
- **Dev Dependencies**: ESLint, Prettier, Husky, Commitizen
- **Scripts**: Development, build, lint, and format commands
- **Husky Configuration**: Auto-installs Git hooks

### Key Template Features

1. **Code Quality**: ESLint + Prettier with React/TypeScript support
2. **Git Conventions**: Conventional commits with emoji support
3. **Theme System**: Dark/light mode with daisyUI theme system
4. **Component Library**: Pre-built UI components with DaisyUI
5. **Build Optimization**: Vite with fast refresh and optimized builds

## Important Notes

- **Always use pnpm** - this is the mandated package manager
- **Template Testing**: Always test the template after making changes
- **ESLint Configuration**: The main project's ESLint config handles both main and template files
- **File Filtering**: Some files are excluded from template copying (node_modules, dist, etc.)
- **Git Hooks**: Husky hooks are auto-installed in both main and created projects

## Common Development Tasks

### Updating the Template

1. Make changes in the `template/` directory
2. Test changes by running `pnpm tauri dev` in template directory
3. Verify linting passes: `pnpm lint` (from root)
4. Create a test project to verify the template works
5. Commit changes using conventional commit format

### Adding New Dependencies

1. Add to main project if needed for the CLI tool
2. Add to template project if needed for generated applications
3. Update any relevant configuration files
4. Test both the CLI and template functionality

### Testing Template Creation

```bash
# From project root
node create.js test-project

# Verify the created project
cd test-project
pnpm install
pnpm tauri dev

# Clean up
cd ..
rm -rf test-project
```

## Git Commit Conventions

The project uses conventional commits:

### Commit Format

1. **Basic format**: `feat: 添加新功能`
2. **With scope**: `fix(template): 修复按钮样式`
3. **Optional emoji**: `✨feat: 添加新功能` (emoji is optional but supported)

### Usage

```bash
# Interactive commit (recommended)
pnpm commit

# Manual commit
git commit -m "feat: update template dependencies"
git commit -m "fix(template): resolve UI issues"
```

## Troubleshooting

### Common Issues

1. **Template creation fails**: Check disk permissions and available space
2. **Dependency installation fails**: Ensure pnpm is installed and updated
3. **ESLint errors**: Run `pnpm lint:fix` to auto-fix issues
4. **Template doesn't work**: Test template directory directly with `pnpm tauri dev`

### Debug Mode

The create.js script includes debug logging:

```bash
# Enable debug output
DEBUG=@anypond/create-tauri-app:* node create.js my-app
```
