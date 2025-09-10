import fs from 'fs-extra'
import path from 'path'
import { EnvironmentInfo, BuildStatus } from '../../types/index.js'
import { getEnvironmentInfo, validateProjectPath, logInfo, logError } from '../../utils/index.js'

export class TauriResources {
  private rootPath: string
  private buildStatus: BuildStatus = { status: 'idle' }

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  async getTauriConfig(projectPath?: string): Promise<any> {
    try {
      const targetPath = projectPath || this.rootPath

      if (!(await validateProjectPath(targetPath))) {
        throw new Error('Invalid Tauri project path')
      }

      const tauriConfPath = path.join(targetPath, 'src-tauri', 'tauri.conf.json')
      const packageJsonPath = path.join(targetPath, 'package.json')

      const [tauriConf, packageJson] = await Promise.all([
        fs.readJson(tauriConfPath),
        fs.readJson(packageJsonPath),
      ])

      return {
        package: packageJson,
        tauri: tauriConf,
        projectPath: targetPath,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get Tauri config: ${errorMessage}`)
      throw error
    }
  }

  async getProjectStructure(projectPath?: string): Promise<any> {
    try {
      const targetPath = projectPath || this.rootPath

      if (!(await validateProjectPath(targetPath))) {
        throw new Error('Invalid Tauri project path')
      }

      const structure = await this.buildDirectoryStructure(targetPath)

      return {
        structure,
        projectPath: targetPath,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get project structure: ${errorMessage}`)
      throw error
    }
  }

  async getBuildStatus(projectPath?: string): Promise<BuildStatus> {
    try {
      const targetPath = projectPath || this.rootPath

      if (!(await validateProjectPath(targetPath))) {
        throw new Error('Invalid Tauri project path')
      }

      const distPath = path.join(targetPath, 'src-tauri', 'target', 'release')
      const buildDir = path.join(targetPath, 'dist')

      const hasDist = await fs.pathExists(distPath)
      const hasBuildDir = await fs.pathExists(buildDir)

      let buildInfo = {}
      if (hasDist) {
        const files = await fs.readdir(distPath)
        buildInfo = {
          distFiles: files,
          buildTime: (await fs.stat(distPath)).mtime,
        }
      }

      const result: BuildStatus = {
        ...this.buildStatus,
        hasBuildOutput: hasDist || hasBuildDir,
        buildInfo,
        timestamp: new Date().toISOString(),
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get build status: ${errorMessage}`)
      throw error
    }
  }

  async getEnvironmentInfo(): Promise<EnvironmentInfo> {
    try {
      const envInfo = await getEnvironmentInfo()

      const result: EnvironmentInfo = {
        ...envInfo,
        timestamp: new Date().toISOString(),
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get environment info: ${errorMessage}`)
      throw error
    }
  }

  async getTemplateInfo(): Promise<any> {
    try {
      const templatePath = path.join(this.rootPath, 'template')

      if (!(await fs.pathExists(templatePath))) {
        throw new Error('Template directory not found')
      }

      const packageJsonPath = path.join(templatePath, 'package.json')
      const packageJson = await fs.readJson(packageJsonPath)

      const structure = await this.buildDirectoryStructure(templatePath)

      return {
        template: {
          name: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          dependencies: packageJson.dependencies,
          devDependencies: packageJson.devDependencies,
          scripts: packageJson.scripts,
        },
        structure,
        templatePath,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get template info: ${errorMessage}`)
      throw error
    }
  }

  async getScriptsInfo(projectPath?: string): Promise<any> {
    try {
      const targetPath = projectPath || this.rootPath

      if (!(await validateProjectPath(targetPath))) {
        throw new Error('Invalid Tauri project path')
      }

      const packageJsonPath = path.join(targetPath, 'package.json')
      const packageJson = await fs.readJson(packageJsonPath)

      const scripts = packageJson.scripts || {}
      const categorizedScripts = {
        development: {},
        build: {},
        test: {},
        lint: {},
        other: {},
      }

      for (const [name, command] of Object.entries(scripts)) {
        if (name.includes('dev') || name.includes('start')) {
          ;(categorizedScripts.development as any)[name] = command
        } else if (name.includes('build')) {
          ;(categorizedScripts.build as any)[name] = command
        } else if (name.includes('test')) {
          ;(categorizedScripts.test as any)[name] = command
        } else if (name.includes('lint') || name.includes('format')) {
          ;(categorizedScripts.lint as any)[name] = command
        } else {
          ;(categorizedScripts.other as any)[name] = command
        }
      }

      return {
        scripts: categorizedScripts,
        projectPath: targetPath,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get scripts info: ${errorMessage}`)
      throw error
    }
  }

  async getDependenciesInfo(projectPath?: string): Promise<any> {
    try {
      const targetPath = projectPath || this.rootPath

      if (!(await validateProjectPath(targetPath))) {
        throw new Error('Invalid Tauri project path')
      }

      const packageJsonPath = path.join(targetPath, 'package.json')
      const packageJson = await fs.readJson(packageJsonPath)

      const cargoPath = path.join(targetPath, 'src-tauri', 'Cargo.toml')
      let cargoDependencies = {}

      if (await fs.pathExists(cargoPath)) {
        const cargoContent = await fs.readFile(cargoPath, 'utf8')
        cargoDependencies = this.parseCargoToml(cargoContent)
      }

      return {
        npm: {
          dependencies: packageJson.dependencies || {},
          devDependencies: packageJson.devDependencies || {},
        },
        cargo: cargoDependencies,
        projectPath: targetPath,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get dependencies info: ${errorMessage}`)
      throw error
    }
  }

  private async buildDirectoryStructure(dirPath: string, maxDepth: number = 3): Promise<any> {
    const items = await fs.readdir(dirPath)
    const result: any = {}

    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const stat = await fs.stat(itemPath)

      if (item.startsWith('.') || item === 'node_modules' || item === 'dist' || item === 'target') {
        continue
      }

      if (stat.isDirectory()) {
        if (maxDepth > 0) {
          result[item] = {
            type: 'directory',
            children: await this.buildDirectoryStructure(itemPath, maxDepth - 1),
          }
        } else {
          result[item] = {
            type: 'directory',
            children: '[truncated]',
          }
        }
      } else {
        result[item] = {
          type: 'file',
          size: stat.size,
          modified: stat.mtime,
        }
      }
    }

    return result
  }

  private parseCargoToml(content: string): Record<string, string> {
    const dependencies: Record<string, string> = {}
    const lines = content.split('\n')
    let inDependencies = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed === '[dependencies]') {
        inDependencies = true
        continue
      } else if (trimmed.startsWith('[') && trimmed !== '[dependencies]') {
        inDependencies = false
        continue
      }

      if (inDependencies && trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^(\w+(?:-\w+)*)\s*=\s*"([^"]+)"/)
        if (match && match[1] && match[2]) {
          dependencies[match[1]] = match[2]
        }
      }
    }

    return dependencies
  }

  updateBuildStatus(status: BuildStatus): void {
    this.buildStatus = status
    logInfo(`Build status updated: ${status.status}`)
  }
}
