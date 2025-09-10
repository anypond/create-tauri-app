export interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
}

export interface MCPResource {
  name: string
  description: string
  uri: string
  mimeType: string
}

export interface MCPRequest {
  id: string
  method: string
  params: any
}

export interface MCPResponse {
  id: string
  result?: any
  error?: {
    code: number
    message: string
  }
}

export interface TauriProjectConfig {
  name: string
  path: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  scripts: Record<string, string>
}

export interface EnvironmentInfo {
  nodeVersion: string
  pnpmVersion: string
  rustVersion: string
  tauriVersion: string
  platform: string
  arch: string
  timestamp?: string
}

export interface BuildStatus {
  status: 'idle' | 'building' | 'success' | 'failed'
  startTime?: Date
  endTime?: Date
  output?: string
  error?: string
  hasBuildOutput?: boolean
  buildInfo?: any
  timestamp?: string
}

export interface ToolResult {
  success: boolean
  data?: any
  error?: string
  message?: string
}
