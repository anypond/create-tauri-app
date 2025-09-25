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
6. **Claude Code Integration**: Project-level MCP server configuration for enhanced AI assistance

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

## Claude Code MCP Configuration

The template includes project-level MCP (Model Context Protocol) server configuration for enhanced Claude Code capabilities.

### MCP Servers Configuration

The `.mcp.json` file in the template contains project-scoped MCP server configurations:

**Playwright MCP Server** (`playwright`):

- Provides browser automation and testing capabilities
- Enables web scraping, UI testing, and interaction with web pages
- Tools: `mcp__playwright__browser_*` for browser control

**Context7 MCP Server** (`context7`):

- Provides access to up-to-date library documentation
- Enables retrieving code examples and API references
- Tools: `mcp__context7__*` for documentation queries
- **API Key Required**: To enable Context7, modify `.mcp.json` to add your API key:
  ```json
  "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
  ```
- Get API key from: https://context7.com

### Usage

When working with generated projects in Claude Code, the MCP servers are automatically available:

```bash
# Check MCP server status (within Claude Code)
/mcp

# List available MCP tools
# MCP tools will be available as: mcp__playwright__* and mcp__context7__*
```

### Project-Scoped Configuration

The MCP configuration is project-scoped, meaning:

- Configuration is stored in `.mcp.json` in the project root
- Settings are checked into version control
- Available to all team members working on the project
- Claude Code will prompt for approval before using these servers

## MCP Usage Requirements and Workflow

When working with Claude Code on this project, follow these MCP usage requirements to ensure high-quality, accurate code implementation.

### Mandatory Documentation Research (Context7 MCP)

**Before implementing any code changes**, you must use the Context7 MCP to research relevant documentation:

**Documentation Research Workflow:**

1. **Identify Dependencies**: Determine which libraries/frameworks are relevant to the task
2. **Query Context7**: Use Context7 MCP tools to get up-to-date documentation
3. **Study Examples**: Review code examples and API references from official documentation
4. **Verify Best Practices**: Ensure implementation follows current best practices
5. **Proceed with Implementation**: Only start coding after thorough documentation research

**Required Research Scenarios:**

- **New Features**: Research all involved libraries before implementation
- **Bug Fixes**: Understand the expected behavior through documentation
- **Refactoring**: Verify new approaches and patterns
- **Library Updates**: Research changes in new versions
- **API Integration**: Study external API documentation

### Mandatory Web-Related Testing (Playwright MCP)

**After making any web-related changes**, you must use the Playwright MCP to verify the implementation:

**Web Testing Workflow:**

1. **Start Development Server**: Ensure the app is running (`pnpm tauri dev`)
2. **Navigate to Relevant Page**: Use browser navigation to reach the affected area
3. **Take Snapshot**: Capture the current state for visual verification
4. **Test Interactions**: Click buttons, fill forms, test functionality
5. **Verify Expected Behavior**: Confirm changes work as intended
6. **Test Edge Cases**: Verify error handling and edge cases
7. **Document Results**: Ensure testing results are documented

**Required Testing Scenarios:**

- **UI Changes**: Test visual appearance and user interactions
- **Form Modifications**: Verify form validation and submission
- **Navigation Updates**: Test routing and page transitions
- **Component Updates**: Verify component rendering and state management
- **API Integration**: Test data fetching and error handling
- **Theme Changes**: Verify dark/light mode functionality
- **Responsive Design**: Test different screen sizes

### Quality Assurance Process

**Complete MCP-Powered Development Cycle:**

1. **Planning Phase**:
   - Use Context7 to research all requirements
   - Document implementation approach
   - Identify potential pitfalls

2. **Implementation Phase**:
   - Code implementation based on documentation research
   - Follow established patterns and best practices
   - Maintain code quality standards

3. **Verification Phase**:
   - Use Playwright to test web-related changes
   - Verify functionality meets requirements
   - Test edge cases and error conditions

4. **Documentation Phase**:
   - Update relevant documentation
   - Add code comments where necessary
   - Document any breaking changes

### MCP Tool Usage Guidelines

**Context7 MCP Best Practices:**

- Always resolve library ID before getting documentation
- Use specific topics to narrow down search results
- Review multiple code examples when available
- Check for version-specific documentation
- Cross-reference information across multiple sources

**Playwright MCP Best Practices:**

- Always start from a clean browser state
- Use descriptive element references
- Take snapshots before and after changes
- Test both successful and failure scenarios
- Verify accessibility where applicable
- Clean up after testing sessions

### Example Workflow: Adding a New Feature

**Step 1: Research with Context7**

- Research React component patterns and best practices
- Study Tauri API documentation for backend integration
- Review Tailwind CSS and DaisyUI documentation for styling

**Step 2: Implementation**

- Write code based on researched documentation
- Follow established patterns
- Maintain code quality standards

**Step 3: Testing with Playwright**

```bash
# Start the development server
pnpm tauri dev

# Test the new feature
# Navigate to the application
# Take snapshots before and after changes
# Test user interactions
# Verify functionality works as expected
```

**Step 4: Verification**

- Compare before/after snapshots
- Verify all functionality works as expected
- Test edge cases and error conditions
- Update documentation as needed

## Troubleshooting

### Common Issues

1. **Template creation fails**: Check disk permissions and available space
2. **Dependency installation fails**: Ensure pnpm is installed and updated
3. **ESLint errors**: Run `pnpm lint:fix` to auto-fix issues
4. **Template doesn't work**: Test template directory directly with `pnpm tauri dev`
5. **MCP servers not working**: Verify Claude Code has approved the project-level MCP servers

### Debug Mode

The create.js script includes debug logging:

```bash
# Enable debug output
DEBUG=@anypond/create-tauri-app:* node create.js my-app
```
