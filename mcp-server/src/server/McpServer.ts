import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import cors from 'cors'
import helmet from 'helmet'
import { MCPTool, MCPResource, MCPRequest, MCPResponse, ToolResult } from '../types/index.js'
import { logInfo, logError, logSuccess } from '../utils/index.js'
import { TauriTools } from './tools/TauriTools.js'
import { TauriResources } from './resources/TauriResources.js'

export class McpServer {
  private app: express.Application
  private server: ReturnType<typeof createServer>
  private wss: WebSocketServer
  private tools: Map<string, MCPTool> = new Map()
  private resources: Map<string, MCPResource> = new Map()
  private tauriTools: TauriTools
  private tauriResources: TauriResources
  private port: number
  private host: string

  constructor(port: number = 3000, host: string = 'localhost', rootPath?: string) {
    this.port = port
    this.host = host
    this.app = express()
    this.server = createServer(this.app)
    this.wss = new WebSocketServer({ server: this.server })

    this.tauriTools = new TauriTools(rootPath)
    this.tauriResources = new TauriResources(rootPath)

    this.setupMiddleware()
    this.setupRoutes()
    this.setupWebSocket()
    this.registerDefaultTools()
    this.registerDefaultResources()
  }

  private setupMiddleware(): void {
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))

    this.app.use((req, _, next) => {
      logInfo(`${req.method} ${req.path}`)
      next()
    })
  }

  private setupRoutes(): void {
    this.app.get('/health', (_, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    this.app.get('/tools', (_, res) => {
      const toolsArray = Array.from(this.tools.values())
      res.json({ tools: toolsArray })
    })

    this.app.get('/resources', (_, res) => {
      const resourcesArray = Array.from(this.resources.values())
      res.json({ resources: resourcesArray })
    })

    this.app.post('/invoke', async (req, res) => {
      try {
        const { toolName, params } = req.body

        if (!toolName) {
          return res.status(400).json({ error: 'Tool name is required' })
        }

        const tool = this.tools.get(toolName)
        if (!tool) {
          return res.status(404).json({ error: `Tool '${toolName}' not found` })
        }

        const result = await this.invokeTool(toolName, params)
        res.json(result)
        return
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logError(`Error invoking tool: ${errorMessage}`)
        res.status(500).json({ error: errorMessage })
        return
      }
    })

    this.app.get('/resource/:resourceName', async (req, res) => {
      try {
        const { resourceName } = req.params
        const resource = this.resources.get(resourceName)

        if (!resource) {
          return res.status(404).json({ error: `Resource '${resourceName}' not found` })
        }

        const content = await this.getResourceContent(resourceName)
        res.json({ resource, content })
        return
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logError(`Error getting resource: ${errorMessage}`)
        res.status(500).json({ error: errorMessage })
        return
      }
    })

    this.app.use((_, res) => {
      res.status(404).json({ error: 'Not found' })
    })

    this.app.use(
      (error: any, _: express.Request, res: express.Response, _next: express.NextFunction) => {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logError(`Server error: ${errorMessage}`)
        res.status(500).json({ error: 'Internal server error' })
      }
    )
  }

  private setupWebSocket(): void {
    this.wss.on('connection', ws => {
      logInfo('WebSocket client connected')

      ws.on('message', async data => {
        try {
          const request: MCPRequest = JSON.parse(data.toString())
          const response = await this.handleRequest(request)
          ws.send(JSON.stringify(response))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          const errorResponse: MCPResponse = {
            id: 'unknown',
            error: {
              code: -1,
              message: errorMessage,
            },
          }
          ws.send(JSON.stringify(errorResponse))
        }
      })

      ws.on('close', () => {
        logInfo('WebSocket client disconnected')
      })

      ws.on('error', error => {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logError(`WebSocket error: ${errorMessage}`)
      })
    })
  }

  private async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      switch (request.method) {
        case 'tools/list':
          return {
            id: request.id,
            result: { tools: Array.from(this.tools.values()) },
          }

        case 'resources/list':
          return {
            id: request.id,
            result: { resources: Array.from(this.resources.values()) },
          }

        case 'tools/call': {
          const result = await this.invokeTool(request.params.name, request.params.arguments)
          return {
            id: request.id,
            result,
          }
        }

        case 'resources/read': {
          const content = await this.getResourceContent(request.params.name)
          return {
            id: request.id,
            result: { content },
          }
        }

        default:
          return {
            id: request.id,
            error: {
              code: -32601,
              message: 'Method not found',
            },
          }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {
        id: request.id,
        error: {
          code: -32603,
          message: errorMessage,
        },
      }
    }
  }

  private async invokeTool(toolName: string, params: any): Promise<ToolResult> {
    const tool = this.tools.get(toolName)
    if (!tool) {
      throw new Error(`Tool '${toolName}' not found`)
    }

    logInfo(`Invoking tool: ${toolName}`)

    try {
      const toolHandler = this.getToolHandler(toolName)
      const result = await toolHandler(params)
      logSuccess(`Tool ${toolName} executed successfully`)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Tool ${toolName} failed: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  private async getResourceContent(resourceName: string): Promise<any> {
    const resource = this.resources.get(resourceName)
    if (!resource) {
      throw new Error(`Resource '${resourceName}' not found`)
    }

    const resourceHandler = this.getResourceHandler(resourceName)
    return await resourceHandler()
  }

  private getToolHandler(toolName: string): (_params: any) => Promise<ToolResult> {
    const toolHandlers: Record<string, (_params: any) => Promise<ToolResult>> = {
      'create-tauri-project': this.handleCreateProject.bind(this),
      'run-tauri-dev': this.handleRunDev.bind(this),
      'build-tauri-project': this.handleBuildProject.bind(this),
      'get-project-info': this.handleGetProjectInfo.bind(this),
      'check-environment': this.handleCheckEnvironment.bind(this),
      'install-dependencies': this.handleInstallDependencies.bind(this),
      'run-linting': this.handleRunLinting.bind(this),
    }

    const handler = toolHandlers[toolName]
    if (!handler) {
      throw new Error(`No handler found for tool: ${toolName}`)
    }
    return handler
  }

  private getResourceHandler(resourceName: string): () => Promise<any> {
    const resourceHandlers: Record<string, () => Promise<any>> = {
      'tauri-config': this.handleGetTauriConfig.bind(this),
      'project-structure': this.handleGetProjectStructure.bind(this),
      'build-status': this.handleGetBuildStatus.bind(this),
      'environment-info': this.handleGetEnvironmentInfo.bind(this),
      'template-info': this.handleGetTemplateInfo.bind(this),
      'scripts-info': this.handleGetScriptsInfo.bind(this),
      'dependencies-info': this.handleGetDependenciesInfo.bind(this),
    }

    const handler = resourceHandlers[resourceName]
    if (!handler) {
      throw new Error(`No handler found for resource: ${resourceName}`)
    }
    return handler
  }

  registerTool(tool: MCPTool): void {
    this.tools.set(tool.name, tool)
    logInfo(`Tool registered: ${tool.name}`)
  }

  registerResource(resource: MCPResource): void {
    this.resources.set(resource.name, resource)
    logInfo(`Resource registered: ${resource.name}`)
  }

  async start(): Promise<void> {
    return new Promise(resolve => {
      this.server.listen(this.port, this.host, () => {
        logSuccess(`MCP Server started on http://${this.host}:${this.port}`)
        logSuccess(`WebSocket server started on ws://${this.host}:${this.port}`)
        resolve()
      })
    })
  }

  async stop(): Promise<void> {
    return new Promise(resolve => {
      this.server.close(() => {
        logInfo('MCP Server stopped')
        resolve()
      })
    })
  }

  private registerDefaultTools(): void {
    const tools: MCPTool[] = [
      {
        name: 'create-tauri-project',
        description: 'Create a new Tauri project from template',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Name of the project' },
            targetPath: { type: 'string', description: 'Target path (optional)' },
            force: { type: 'boolean', description: 'Overwrite if exists' },
            templatePath: { type: 'string', description: 'Template path (optional)' },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'run-tauri-dev',
        description: 'Start Tauri development server',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to project' },
            port: { type: 'number', description: 'Port number (optional)' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'build-tauri-project',
        description: 'Build Tauri project',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to project' },
            target: {
              type: 'string',
              enum: ['all', 'appimage', 'msi', 'dmg'],
              description: 'Build target',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'get-project-info',
        description: 'Get Tauri project information',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to project' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'check-environment',
        description: 'Check development environment',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'install-dependencies',
        description: 'Install project dependencies',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to project' },
            dependencies: { type: 'array', items: { type: 'string' } },
            devDependencies: { type: 'array', items: { type: 'string' } },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'run-linting',
        description: 'Run code linting',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to project' },
            fix: { type: 'boolean', description: 'Auto-fix issues' },
          },
          required: ['projectPath'],
        },
      },
    ]

    tools.forEach(tool => this.registerTool(tool))
  }

  private registerDefaultResources(): void {
    const resources: MCPResource[] = [
      {
        name: 'tauri-config',
        description: 'Tauri configuration information',
        uri: 'tauri://config',
        mimeType: 'application/json',
      },
      {
        name: 'project-structure',
        description: 'Project directory structure',
        uri: 'tauri://project-structure',
        mimeType: 'application/json',
      },
      {
        name: 'build-status',
        description: 'Build status and information',
        uri: 'tauri://build-status',
        mimeType: 'application/json',
      },
      {
        name: 'environment-info',
        description: 'Development environment information',
        uri: 'tauri://environment-info',
        mimeType: 'application/json',
      },
      {
        name: 'template-info',
        description: 'Template information and structure',
        uri: 'tauri://template-info',
        mimeType: 'application/json',
      },
      {
        name: 'scripts-info',
        description: 'Available npm scripts',
        uri: 'tauri://scripts-info',
        mimeType: 'application/json',
      },
      {
        name: 'dependencies-info',
        description: 'Project dependencies information',
        uri: 'tauri://dependencies-info',
        mimeType: 'application/json',
      },
    ]

    resources.forEach(resource => this.registerResource(resource))
  }

  // Tool handlers
  private async handleCreateProject(params: any): Promise<ToolResult> {
    return await this.tauriTools.createProject(params)
  }

  private async handleRunDev(params: any): Promise<ToolResult> {
    return await this.tauriTools.runDev(params)
  }

  private async handleBuildProject(params: any): Promise<ToolResult> {
    return await this.tauriTools.buildProject(params)
  }

  private async handleGetProjectInfo(params: any): Promise<ToolResult> {
    return await this.tauriTools.getProjectInfo(params)
  }

  private async handleCheckEnvironment(): Promise<ToolResult> {
    return await this.tauriTools.checkEnvironment()
  }

  private async handleInstallDependencies(params: any): Promise<ToolResult> {
    return await this.tauriTools.installDependencies(params)
  }

  private async handleRunLinting(params: any): Promise<ToolResult> {
    return await this.tauriTools.runLinting(params)
  }

  // Resource handlers
  private async handleGetTauriConfig(): Promise<any> {
    return await this.tauriResources.getTauriConfig()
  }

  private async handleGetProjectStructure(): Promise<any> {
    return await this.tauriResources.getProjectStructure()
  }

  private async handleGetBuildStatus(): Promise<any> {
    return await this.tauriResources.getBuildStatus()
  }

  private async handleGetEnvironmentInfo(): Promise<any> {
    return await this.tauriResources.getEnvironmentInfo()
  }

  private async handleGetTemplateInfo(): Promise<any> {
    return await this.tauriResources.getTemplateInfo()
  }

  private async handleGetScriptsInfo(): Promise<any> {
    return await this.tauriResources.getScriptsInfo()
  }

  private async handleGetDependenciesInfo(): Promise<any> {
    return await this.tauriResources.getDependenciesInfo()
  }
}
