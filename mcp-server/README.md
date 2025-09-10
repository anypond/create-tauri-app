# Tauri Template MCP Server

An MCP (Model Context Protocol) server for Tauri template project management and development tools.

## Features

### Tools

- **create-tauri-project**: Create a new Tauri project from template
- **run-tauri-dev**: Start Tauri development server
- **build-tauri-project**: Build Tauri project
- **get-project-info**: Get Tauri project information
- **check-environment**: Check development environment
- **install-dependencies**: Install project dependencies
- **run-linting**: Run code linting

### Resources

- **tauri-config**: Tauri configuration information
- **project-structure**: Project directory structure
- **build-status**: Build status and information
- **environment-info**: Development environment information
- **template-info**: Template information and structure
- **scripts-info**: Available npm scripts
- **dependencies-info**: Project dependencies information

## Installation

1. Navigate to the MCP server directory:

   ```bash
   cd mcp-server
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the server:
   ```bash
   pnpm build
   ```

## Usage

### Development Mode

```bash
pnpm dev
```

### Production Mode

```bash
pnpm build
pnpm start
```

### Command Line Options

```bash
tauri-template-mcp [options]

Options:
  -p, --port <port>    Port to run the server on (default: 3000)
  -h, --host <host>    Host to bind to (default: localhost)
  -r, --root <path>    Root path for template (default: current directory)
  --dev                Run in development mode
  --help               Show help
  --version            Show version
```

## API Endpoints

### HTTP API

- `GET /health` - Health check
- `GET /tools` - List available tools
- `GET /resources` - List available resources
- `POST /invoke` - Invoke a tool
- `GET /resource/:resourceName` - Get resource content

### WebSocket

Connect to `ws://localhost:3000` for real-time communication.

## MCP Client Configuration

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "tauri-template": {
      "command": "node",
      "args": ["/path/to/tauri-template/mcp-server/dist/index.js"],
      "cwd": "/path/to/tauri-template"
    }
  }
}
```

### Environment Variables

```bash
MCP_PORT=3000
MCP_HOST=localhost
MCP_DEBUG=true
```

## Development

### Project Structure

```
mcp-server/
├── src/
│   ├── server/
│   │   ├── McpServer.ts     # Main server class
│   │   ├── tools/           # Tool implementations
│   │   └── resources/       # Resource implementations
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── index.ts            # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## License

MIT
