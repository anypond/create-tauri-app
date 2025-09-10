import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { EnvironmentInfo } from '../types/index.js'

export async function executeCommand(
  command: string,
  args: string[],
  options: { cwd?: string; silent?: boolean } = {}
): Promise<string> {
  const spinner = ora(options.silent ? { isSilent: true } : undefined)
  if (!options.silent) {
    spinner.start(`Executing: ${command} ${args.join(' ')}`)
  }

  try {
    const result = await execa(command, args, { cwd: options.cwd || process.cwd() })
    if (!options.silent) {
      spinner.succeed(`Command completed: ${command} ${args.join(' ')}`)
    }
    return result.stdout
  } catch (error) {
    if (!options.silent) {
      spinner.fail(`Command failed: ${command} ${args.join(' ')}`)
    }
    throw error
  }
}

export async function getEnvironmentInfo(): Promise<EnvironmentInfo> {
  try {
    const [nodeVersion, pnpmVersion, rustVersion] = await Promise.all([
      executeCommand('node', ['--version'], { silent: true }),
      executeCommand('pnpm', ['--version'], { silent: true }),
      executeCommand('rustc', ['--version'], { silent: true }),
    ])

    return {
      nodeVersion: nodeVersion.trim(),
      pnpmVersion: pnpmVersion.trim(),
      rustVersion: rustVersion.trim(),
      tauriVersion: '2.0.0',
      platform: process.platform,
      arch: process.arch,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to get environment info: ${errorMessage}`)
  }
}

export async function validateProjectPath(projectPath: string): Promise<boolean> {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json')
    const tauriConfPath = path.join(projectPath, 'src-tauri', 'tauri.conf.json')

    await Promise.all([fs.access(packageJsonPath), fs.access(tauriConfPath)])

    return true
  } catch {
    return false
  }
}

export function logInfo(message: string): void {
  console.log(chalk.blue('ℹ') + ' ' + message)
}

export function logSuccess(message: string): void {
  console.log(chalk.green('✓') + ' ' + message)
}

export function logError(message: string): void {
  console.log(chalk.red('✗') + ' ' + message)
}

export function logWarning(message: string): void {
  console.log(chalk.yellow('⚠') + ' ' + message)
}
