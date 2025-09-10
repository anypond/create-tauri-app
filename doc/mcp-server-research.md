# MCP Server Implementation Research for Node.js

## Overview

This document provides research findings on implementing an MCP (Model Context Protocol) server in Node.js for a Tauri template project. MCP is an open-source standard that enables seamless integration between AI applications and external data sources and tools.

## 1. MCP Server Implementation Patterns in Node.js

### Core Architecture Pattern

MCP servers in Node.js typically follow this pattern:

```javascript
// Basic MCP Server Structure
class MCPServer {
  constructor(config) {
    this.config = config
    this.tools = new Map()
    this.resources = new Map()
    this.server = null
  }

  async initialize() {
    // Initialize server with MCP protocol
    this.server = createMCPServer({
      name: this.config.name,
      version: this.config.version,
      protocol: 'mcp-v1',
    })

    await this.registerTools()
    await this.registerResources()
    await this.start()
  }

  async registerTools() {
    // Register available tools
  }

  async registerResources() {
    // Register available resources
  }

  async start() {
    // Start the server
  }
}
```

### Common Implementation Patterns

1. **Tool-based Architecture**: Expose functionality as discrete tools
2. **Resource-based Architecture**: Provide access to data sources
3. **Hybrid Approach**: Combine both tools and resources
4. **Event-driven Architecture**: Use event emitters for real-time updates

## 2. Required Dependencies and Packages

### Core MCP Packages

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@modelcontextprotocol/server": "^1.0.0",
    "@modelcontextprotocol/types": "^1.0.0"
  }
}
```

### Additional Recommended Packages

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "zod": "^3.22.4",
    "uuid": "^9.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/ws": "^8.5.8",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.1"
  }
}
```

### Package Installation

```bash
npm install @modelcontextprotocol/sdk @modelcontextprotocol/server @modelcontextprotocol/types
npm install express ws zod uuid cors helmet
npm install --save-dev @types/node @types/express @types/ws typescript ts-node
```

## 3. Server Structure and API Endpoints

### Basic Server Structure

```typescript
// src/server.ts
import { MCPServer, Tool, Resource } from '@modelcontextprotocol/server'
import express from 'express'
import { WebSocketServer } from 'ws'

interface ServerConfig {
  name: string
  version: string
  port: number
  host: string
}

class TauriMCPServer extends MCPServer {
  private app: express.Application
  private wsServer: WebSocketServer
  private config: ServerConfig

  constructor(config: ServerConfig) {
    super()
    this.config = config
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware(): void {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(helmet())
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    // MCP protocol endpoint
    this.app.post('/mcp', this.handleMCPRequest.bind(this))

    // Server info endpoint
    this.app.get('/info', (req, res) => {
      res.json({
        name: this.config.name,
        version: this.config.version,
        protocol: 'mcp-v1',
      })
    })
  }

  private async handleMCPRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { method, params } = req.body

      switch (method) {
        case 'tools/list':
          res.json({ tools: this.listTools() })
          break
        case 'tools/call':
          const toolResult = await this.callTool(params.name, params.arguments)
          res.json({ result: toolResult })
          break
        case 'resources/list':
          res.json({ resources: this.listResources() })
          break
        case 'resources/read':
          const resourceData = await this.readResource(params.uri)
          res.json({ content: resourceData })
          break
        default:
          res.status(400).json({ error: 'Unknown method' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async start(): Promise<void> {
    this.app.listen(this.config.port, this.config.host, () => {
      console.log(`MCP Server running at http://${this.config.host}:${this.config.port}`)
    })
  }
}
```

### WebSocket Support

```typescript
// src/websocket-server.ts
import { WebSocketServer } from 'ws'

export class MCPWebSocketServer {
  private wss: WebSocketServer
  private mcpServer: TauriMCPServer

  constructor(server: any, mcpServer: TauriMCPServer) {
    this.wss = new WebSocketServer({ server })
    this.mcpServer = mcpServer
    this.setupWebSocketHandlers()
  }

  private setupWebSocketHandlers(): void {
    this.wss.on('connection', ws => {
      console.log('New MCP WebSocket connection established')

      ws.on('message', async data => {
        try {
          const message = JSON.parse(data.toString())
          const response = await this.handleMCPMessage(message)
          ws.send(JSON.stringify(response))
        } catch (error) {
          ws.send(JSON.stringify({ error: error.message }))
        }
      })

      ws.on('close', () => {
        console.log('MCP WebSocket connection closed')
      })
    })
  }

  private async handleMCPMessage(message: any): Promise<any> {
    // Handle MCP protocol messages
    const { method, params, id } = message

    switch (method) {
      case 'tools/list':
        return { id, result: { tools: this.mcpServer.listTools() } }
      case 'tools/call':
        const toolResult = await this.mcpServer.callTool(params.name, params.arguments)
        return { id, result: { content: toolResult } }
      case 'resources/list':
        return { id, result: { resources: this.mcpServer.listResources() } }
      case 'resources/read':
        const resourceData = await this.mcpServer.readResource(params.uri)
        return { id, result: { content: resourceData } }
      default:
        return { id, error: 'Unknown method' }
    }
  }
}
```

## 4. Exposing Tools and Resources Through MCP

### Tool Implementation

```typescript
// src/tools/index.ts
import { Tool } from '@modelcontextprotocol/server'

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: any
  handler: (params: any) => Promise<any>
}

export class TauriTools {
  private tools: Map<string, ToolDefinition> = new Map()

  constructor() {
    this.registerTools()
  }

  private registerTools(): void {
    // File system tool
    this.tools.set('read_file', {
      name: 'read_file',
      description: 'Read a file from the file system',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the file to read',
          },
        },
        required: ['path'],
      },
      handler: this.readFile.bind(this),
    })

    // Tauri command tool
    this.tools.set('execute_tauri_command', {
      name: 'execute_tauri_command',
      description: 'Execute a Tauri backend command',
      inputSchema: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'Tauri command name',
          },
          args: {
            type: 'object',
            description: 'Command arguments',
          },
        },
        required: ['command'],
      },
      handler: this.executeTauriCommand.bind(this),
    })

    // System info tool
    this.tools.set('get_system_info', {
      name: 'get_system_info',
      description: 'Get system information',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      handler: this.getSystemInfo.bind(this),
    })
  }

  private async readFile(params: { path: string }): Promise<any> {
    const fs = require('fs').promises
    try {
      const content = await fs.readFile(params.path, 'utf-8')
      return { content }
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`)
    }
  }

  private async executeTauriCommand(params: { command: string; args?: any }): Promise<any> {
    // Implement Tauri command execution
    // This would integrate with your Tauri backend
    return {
      result: `Command ${params.command} executed with args: ${JSON.stringify(params.args)}`,
    }
  }

  private async getSystemInfo(params: {}): Promise<any> {
    const os = require('os')
    return {
      platform: os.platform(),
      arch: os.arch(),
      version: os.version(),
      uptime: os.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
    }
  }

  public getTools(): Tool[] {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }))
  }

  public async callTool(name: string, params: any): Promise<any> {
    const tool = this.tools.get(name)
    if (!tool) {
      throw new Error(`Tool '${name}' not found`)
    }
    return await tool.handler(params)
  }
}
```

### Resource Implementation

```typescript
// src/resources/index.ts
import { Resource } from '@modelcontextprotocol/server'

export interface ResourceDefinition {
  uri: string
  name: string
  description: string
  mimeType: string
  handler: () => Promise<any>
}

export class TauriResources {
  private resources: Map<string, ResourceDefinition> = new Map()

  constructor() {
    this.registerResources()
  }

  private registerResources(): void {
    // Project configuration resource
    this.resources.set('tauri://config', {
      uri: 'tauri://config',
      name: 'Tauri Configuration',
      description: 'Current Tauri project configuration',
      mimeType: 'application/json',
      handler: this.getTauriConfig.bind(this),
    })

    // Build status resource
    this.resources.set('tauri://build-status', {
      uri: 'tauri://build-status',
      name: 'Build Status',
      description: 'Current build status and information',
      mimeType: 'application/json',
      handler: this.getBuildStatus.bind(this),
    })

    // Project structure resource
    this.resources.set('tauri://project-structure', {
      uri: 'tauri://project-structure',
      name: 'Project Structure',
      description: 'Current project file structure',
      mimeType: 'application/json',
      handler: this.getProjectStructure.bind(this),
    })
  }

  private async getTauriConfig(): Promise<any> {
    // Read and return Tauri configuration
    const fs = require('fs').promises
    const path = require('path')

    try {
      const configPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json')
      const config = await fs.readFile(configPath, 'utf-8')
      return JSON.parse(config)
    } catch (error) {
      return { error: 'Configuration not found' }
    }
  }

  private async getBuildStatus(): Promise<any> {
    // Return current build status
    return {
      status: 'ready',
      lastBuild: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch,
    }
  }

  private async getProjectStructure(): Promise<any> {
    // Return project structure
    const fs = require('fs').promises
    const path = require('path')

    async function getDirStructure(dirPath: string): Promise<any> {
      const items = await fs.readdir(dirPath, { withFileTypes: true })
      const result = []

      for (const item of items) {
        if (item.isDirectory()) {
          result.push({
            name: item.name,
            type: 'directory',
            children: await getDirStructure(path.join(dirPath, item.name)),
          })
        } else {
          const stats = await fs.stat(path.join(dirPath, item.name))
          result.push({
            name: item.name,
            type: 'file',
            size: stats.size,
            modified: stats.mtime.toISOString(),
          })
        }
      }

      return result
    }

    return await getDirStructure(process.cwd())
  }

  public getResources(): Resource[] {
    return Array.from(this.resources.values()).map(resource => ({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
    }))
  }

  public async readResource(uri: string): Promise<any> {
    const resource = this.resources.get(uri)
    if (!resource) {
      throw new Error(`Resource '${uri}' not found`)
    }
    return await resource.handler()
  }
}
```

## 5. Configuration Requirements for MCP Servers

### Server Configuration

```typescript
// src/config/index.ts
export interface MCPConfig {
  server: {
    name: string
    version: string
    port: number
    host: string
    protocol: 'http' | 'https' | 'ws' | 'wss'
  }
  auth?: {
    type: 'none' | 'bearer' | 'basic'
    token?: string
    username?: string
    password?: string
  }
  cors: {
    enabled: boolean
    origins: string[]
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    format: 'json' | 'text'
  }
  tools: {
    enabled: string[]
    disabled: string[]
  }
  resources: {
    enabled: string[]
    disabled: string[]
  }
}

export const defaultConfig: MCPConfig = {
  server: {
    name: 'tauri-mcp-server',
    version: '1.0.0',
    port: 3000,
    host: 'localhost',
    protocol: 'http',
  },
  cors: {
    enabled: true,
    origins: ['http://localhost:3000', 'http://localhost:1420'],
  },
  logging: {
    level: 'info',
    format: 'json',
  },
  tools: {
    enabled: ['*'],
    disabled: [],
  },
  resources: {
    enabled: ['*'],
    disabled: [],
  },
}
```

### Environment Configuration

```bash
# .env
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost
MCP_SERVER_NAME=tauri-mcp-server
MCP_SERVER_VERSION=1.0.0

# Auth Configuration
MCP_AUTH_TYPE=none
# MCP_AUTH_TYPE=bearer
# MCP_AUTH_TOKEN=your-token-here

# CORS Configuration
MCP_CORS_ENABLED=true
MCP_CORS_ORIGINS=http://localhost:3000,http://localhost:1420

# Logging Configuration
MCP_LOG_LEVEL=info
MCP_LOG_FORMAT=json
```

### Package.json Scripts

```json
{
  "scripts": {
    "mcp:dev": "ts-node src/server.ts",
    "mcp:build": "tsc",
    "mcp:start": "node dist/server.js",
    "mcp:test": "jest",
    "mcp:lint": "eslint src --ext .ts",
    "mcp:typecheck": "tsc --noEmit"
  }
}
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Integration with Tauri Template

### Main Server Entry Point

```typescript
// src/index.ts
import { TauriMCPServer } from './server'
import { TauriTools } from './tools'
import { TauriResources } from './resources'
import { defaultConfig } from './config'

async function main() {
  const config = {
    ...defaultConfig,
    server: {
      ...defaultConfig.server,
      port: parseInt(process.env.MCP_SERVER_PORT || '3000'),
      host: process.env.MCP_SERVER_HOST || 'localhost',
    },
  }

  const server = new TauriMCPServer(config.server)
  const tools = new TauriTools()
  const resources = new TauriResources()

  // Register tools and resources
  tools.getTools().forEach(tool => {
    server.registerTool(tool)
  })

  resources.getResources().forEach(resource => {
    server.registerResource(resource)
  })

  await server.start()
}

main().catch(console.error)
```

### MCP Client Integration Example

```typescript
// Example of how to use the MCP server from a Tauri app
import { invoke } from '@tauri-apps/api/core'

class MCPClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async callTool(toolName: string, args: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args,
        },
      }),
    })

    return await response.json()
  }

  async readResource(uri: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'resources/read',
        params: { uri },
      }),
    })

    return await response.json()
  }
}

// Usage in Tauri React component
const mcpClient = new MCPClient('http://localhost:3000')

// Call a tool
const result = await mcpClient.callTool('get_system_info', {})

// Read a resource
const config = await mcpClient.readResource('tauri://config')
```

## Best Practices

1. **Security**: Always validate input parameters and implement proper authentication
2. **Error Handling**: Implement comprehensive error handling and logging
3. **Performance**: Use caching for frequently accessed resources
4. **Testing**: Write unit tests for all tools and resources
5. **Documentation**: Document all tools and resources with clear descriptions
6. **Versioning**: Use semantic versioning for your MCP server
7. **Monitoring**: Implement health checks and monitoring endpoints

## Testing

```typescript
// tests/server.test.ts
import { TauriMCPServer } from '../src/server'
import { TauriTools } from '../src/tools'

describe('MCP Server', () => {
  let server: TauriMCPServer
  let tools: TauriTools

  beforeAll(async () => {
    server = new TauriMCPServer({
      name: 'test-mcp-server',
      version: '1.0.0',
      port: 3001,
      host: 'localhost',
    })
    tools = new TauriTools()

    tools.getTools().forEach(tool => {
      server.registerTool(tool)
    })

    await server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('should list available tools', async () => {
    const response = await fetch('http://localhost:3001/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'tools/list' }),
    })

    const data = await response.json()
    expect(data.tools).toBeDefined()
    expect(data.tools.length).toBeGreaterThan(0)
  })

  test('should call get_system_info tool', async () => {
    const response = await fetch('http://localhost:3001/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'tools/call',
        params: {
          name: 'get_system_info',
          arguments: {},
        },
      }),
    })

    const data = await response.json()
    expect(data.result).toBeDefined()
    expect(data.result.platform).toBeDefined()
  })
})
```

This comprehensive research document provides the foundation for implementing an MCP server in Node.js that can integrate with your Tauri template project. The implementation includes proper tool and resource management, WebSocket support, and comprehensive configuration options.
