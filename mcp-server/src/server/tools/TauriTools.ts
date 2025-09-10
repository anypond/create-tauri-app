import fs from 'fs-extra'
import path from 'path'
import { z } from 'zod'
import { ToolResult } from '../../types/index.js'
import {
  executeCommand,
  getEnvironmentInfo,
  validateProjectPath,
  logInfo,
  logSuccess,
  logError,
} from '../../utils/index.js'

async function getProjectConfig(projectPath: string) {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const tauriConfPath = path.join(projectPath, 'src-tauri', 'tauri.conf.json')

  const [packageJson] = await Promise.all([
    fs.readJson(packageJsonPath),
    fs.readJson(tauriConfPath),
  ])

  return {
    name: packageJson.name,
    path: projectPath,
    version: packageJson.version,
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    scripts: packageJson.scripts || {},
  }
}

const createProjectSchema = z.object({
  projectName: z.string().min(1).max(50),
  targetPath: z.string().optional(),
  force: z.boolean().default(false),
  templatePath: z.string().optional(),
})

const runDevSchema = z.object({
  projectPath: z.string().min(1),
  port: z.number().min(1024).max(65535).optional(),
})

const buildProjectSchema = z.object({
  projectPath: z.string().min(1),
  target: z.enum(['all', 'appimage', 'msi', 'dmg']).optional().default('all'),
})

const getProjectInfoSchema = z.object({
  projectPath: z.string().min(1),
})

const installDependenciesSchema = z.object({
  projectPath: z.string().min(1),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
})

const runLintingSchema = z.object({
  projectPath: z.string().min(1),
  fix: z.boolean().default(false),
})

export class TauriTools {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  async createProject(params: any): Promise<ToolResult> {
    try {
      const validated = createProjectSchema.parse(params)
      const { projectName, targetPath, force, templatePath } = validated

      const projectDir = targetPath || path.join(process.cwd(), projectName)
      const templateDir = templatePath || path.join(this.rootPath, 'template')

      logInfo(`Creating Tauri project: ${projectName}`)

      if (await fs.pathExists(projectDir)) {
        if (!force) {
          return {
            success: false,
            error: `Directory already exists: ${projectDir}. Use force: true to overwrite.`,
          }
        }
        await fs.remove(projectDir)
      }

      await fs.ensureDir(projectDir)

      if (!(await fs.pathExists(templateDir))) {
        return {
          success: false,
          error: `Template directory not found: ${templateDir}`,
        }
      }

      await fs.copy(templateDir, projectDir, {
        filter: src => {
          const basename = path.basename(src)
          return basename !== 'node_modules' && basename !== '.git' && basename !== 'dist'
        },
      })

      const packageJsonPath = path.join(projectDir, 'package.json')
      const packageJson = await fs.readJson(packageJsonPath)
      packageJson.name = projectName
      packageJson.version = '0.1.0'
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })

      const tauriConfPath = path.join(projectDir, 'src-tauri', 'tauri.conf.json')
      const tauriConf = await fs.readJson(tauriConfPath)
      tauriConf.productName = projectName
      tauriConf.version = '0.1.0'
      tauriConf.identifier = `com.${projectName.toLowerCase()}.${projectName.toLowerCase()}`
      tauriConf.app.windows[0].title = projectName
      await fs.writeJson(tauriConfPath, tauriConf, { spaces: 2 })

      const cargoPath = path.join(projectDir, 'src-tauri', 'Cargo.toml')
      let cargoContent = await fs.readFile(cargoPath, 'utf8')
      cargoContent = cargoContent.replace(
        /name = "tauri-app"/,
        `name = "${projectName.replace(/-/g, '_')}"`
      )
      await fs.writeFile(cargoPath, cargoContent)

      await executeCommand('git', ['init'], { cwd: projectDir, silent: true })
      await executeCommand('pnpm', ['install'], { cwd: projectDir, silent: true })

      logSuccess(`Project created successfully: ${projectName}`)

      return {
        success: true,
        data: {
          projectName,
          projectPath: projectDir,
          message: `Tauri project '${projectName}' created successfully`,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to create project: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async runDev(params: any): Promise<ToolResult> {
    try {
      const validated = runDevSchema.parse(params)
      const { projectPath, port } = validated

      if (!(await validateProjectPath(projectPath))) {
        return {
          success: false,
          error: 'Invalid Tauri project path',
        }
      }

      logInfo(`Starting development server for: ${projectPath}`)

      const args = ['tauri', 'dev']
      if (port) {
        args.push('--port', port.toString())
      }

      const result = await executeCommand('pnpm', args, { cwd: projectPath || process.cwd() })

      return {
        success: true,
        data: {
          output: result,
          message: 'Development server started successfully',
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to start dev server: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async buildProject(params: any): Promise<ToolResult> {
    try {
      const validated = buildProjectSchema.parse(params)
      const { projectPath, target } = validated

      if (!(await validateProjectPath(projectPath))) {
        return {
          success: false,
          error: 'Invalid Tauri project path',
        }
      }

      logInfo(`Building Tauri project: ${projectPath}`)

      const args = ['tauri', 'build']
      if (target !== 'all') {
        args.push('--target', target)
      }

      const result = await executeCommand('pnpm', args, { cwd: projectPath || process.cwd() })

      return {
        success: true,
        data: {
          output: result,
          target,
          message: 'Project built successfully',
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to build project: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async getProjectInfo(params: any): Promise<ToolResult> {
    try {
      const validated = getProjectInfoSchema.parse(params)
      const { projectPath } = validated

      if (!(await validateProjectPath(projectPath))) {
        return {
          success: false,
          error: 'Invalid Tauri project path',
        }
      }

      const config = await getProjectConfig(projectPath)

      return {
        success: true,
        data: {
          config,
          message: 'Project information retrieved successfully',
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to get project info: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async checkEnvironment(): Promise<ToolResult> {
    try {
      logInfo('Checking development environment')

      const envInfo = await getEnvironmentInfo()

      const requirements = {
        node: { required: '>=18.0.0', current: envInfo.nodeVersion },
        pnpm: { required: '>=8.0.0', current: envInfo.pnpmVersion },
        rust: { required: '>=1.70.0', current: envInfo.rustVersion },
        tauri: { required: '2.0.0', current: envInfo.tauriVersion },
      }

      const issues: string[] = []

      for (const [tool, info] of Object.entries(requirements)) {
        if (tool === 'node') {
          const version = info.current.replace('v', '')
          const major = parseInt(version?.split('.')[0] || '0', 10)
          if (major < 18) {
            issues.push(`${tool}: version ${info.current} is below required ${info.required}`)
          }
        }
      }

      return {
        success: issues.length === 0,
        data: {
          environment: envInfo,
          requirements,
          issues,
          message: issues.length === 0 ? 'Environment check passed' : 'Environment has issues',
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to check environment: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async installDependencies(params: any): Promise<ToolResult> {
    try {
      const validated = installDependenciesSchema.parse(params)
      const { projectPath, dependencies, devDependencies } = validated

      if (!(await validateProjectPath(projectPath))) {
        return {
          success: false,
          error: 'Invalid Tauri project path',
        }
      }

      logInfo(`Installing dependencies for: ${projectPath}`)

      const results: string[] = []

      if (dependencies && dependencies.length > 0) {
        await executeCommand('pnpm', ['add', ...dependencies], {
          cwd: projectPath || process.cwd(),
        })
        results.push(`Dependencies installed: ${dependencies.join(', ')}`)
      }

      if (devDependencies && devDependencies.length > 0) {
        await executeCommand('pnpm', ['add', '-D', ...devDependencies], {
          cwd: projectPath || process.cwd(),
        })
        results.push(`Dev dependencies installed: ${devDependencies.join(', ')}`)
      }

      if (!dependencies && !devDependencies) {
        await executeCommand('pnpm', ['install'], { cwd: projectPath || process.cwd() })
        results.push('All dependencies installed')
      }

      return {
        success: true,
        data: {
          results,
          message: 'Dependencies installed successfully',
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to install dependencies: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async runLinting(params: any): Promise<ToolResult> {
    try {
      const validated = runLintingSchema.parse(params)
      const { projectPath, fix } = validated

      if (!(await validateProjectPath(projectPath))) {
        return {
          success: false,
          error: 'Invalid Tauri project path',
        }
      }

      logInfo(`Running linting for: ${projectPath}`)

      const args = ['lint']
      if (fix) {
        args.push('fix')
      }

      const result = await executeCommand('pnpm', args, { cwd: projectPath })

      return {
        success: true,
        data: {
          output: result,
          fix,
          message: `Linting completed${fix ? ' with auto-fix' : ''}`,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to run linting: ${errorMessage}`)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}
