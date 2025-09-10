#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import validatePackageName from 'validate-npm-package-name'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const spinner = ora()

program
  .name('create-anypond-tauri')
  .description('Create a new Tauri 2 + React + TypeScript project')
  .argument('[project-name]', 'Project name')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action(async (projectName, options) => {
    try {
      // If no project name provided, ask for it
      if (!projectName) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            validate: input => {
              if (!input) return 'Project name is required'
              const validation = validatePackageName(input)
              if (!validation.validForNewPackages) {
                return `Invalid project name: ${validation.errors[0]}`
              }
              return true
            },
          },
        ])
        projectName = answers.projectName
      }

      // Validate project name
      const validation = validatePackageName(projectName)
      if (!validation.validForNewPackages) {
        console.error(chalk.red(`Error: Invalid project name: ${validation.errors[0]}`))
        process.exit(1)
      }

      const targetDir = path.resolve(process.cwd(), projectName)

      // Check if directory exists
      if (fs.existsSync(targetDir)) {
        if (!options.force) {
          const { overwrite } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `Directory "${projectName}" already exists. Overwrite?`,
              default: false,
            },
          ])

          if (!overwrite) {
            console.log(chalk.yellow('Operation cancelled'))
            process.exit(0)
          }
        }

        spinner.start('Cleaning existing directory...')
        await fs.remove(targetDir)
        spinner.succeed('Directory cleaned')
      }

      // Create project directory
      spinner.start('Creating project directory...')
      await fs.ensureDir(targetDir)
      spinner.succeed('Project directory created')

      // Get template directory
      const templateDir = path.dirname(new URL(import.meta.url).pathname)
      const templatePath = path.join(templateDir, 'template')

      // Copy template files
      spinner.start('Copying template files...')
      await fs.copy(templatePath, targetDir, {
        filter: src => {
          // Skip node_modules and .git directories
          const basename = path.basename(src)
          return basename !== 'node_modules' && basename !== '.git'
        },
      })

      // Make husky hooks executable
      const huskyDir = path.join(targetDir, '.husky')
      if (await fs.pathExists(huskyDir)) {
        const hooks = await fs.readdir(huskyDir)
        for (const hook of hooks) {
          const hookPath = path.join(huskyDir, hook)
          const stat = await fs.stat(hookPath)
          if (stat.isFile()) {
            await fs.chmod(hookPath, '755')
          }
        }
      }

      spinner.succeed('Template files copied')

      // Update package.json
      spinner.start('Updating package.json...')
      const packageJsonPath = path.join(targetDir, 'package.json')
      const packageJson = await fs.readJson(packageJsonPath)
      packageJson.name = projectName
      packageJson.version = '0.1.0'
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
      spinner.succeed('package.json updated')

      // Update tauri.conf.json
      spinner.start('Updating Tauri configuration...')
      const tauriConfPath = path.join(targetDir, 'src-tauri', 'tauri.conf.json')
      const tauriConf = await fs.readJson(tauriConfPath)
      tauriConf.productName = projectName
      tauriConf.version = '0.1.0'
      tauriConf.identifier = `com.${projectName.toLowerCase()}.${projectName.toLowerCase()}`
      tauriConf.app.windows[0].title = projectName
      await fs.writeJson(tauriConfPath, tauriConf, { spaces: 2 })
      spinner.succeed('Tauri configuration updated')

      // Update Cargo.toml
      spinner.start('Updating Cargo.toml...')
      const cargoPath = path.join(targetDir, 'src-tauri', 'Cargo.toml')
      let cargoContent = await fs.readFile(cargoPath, 'utf8')
      cargoContent = cargoContent.replace(
        /name = "tauri-app"/,
        `name = "${projectName.replace(/-/g, '_')}"`
      )
      await fs.writeFile(cargoPath, cargoContent)
      spinner.succeed('Cargo.toml updated')

      // Remove template-specific files
      const filesToRemove = ['create-package.json', 'create.js']

      // Initialize git repository and install husky
      spinner.start('Initializing Git repository...')
      await fs.ensureDir(path.join(targetDir, '.git'))
      await execAsync('git init', { cwd: targetDir })
      spinner.succeed('Git repository initialized')

      // Install dependencies (this will also run husky install)
      spinner.start('Installing dependencies...')
      await execAsync('pnpm install', { cwd: targetDir })
      spinner.succeed('Dependencies installed')

      for (const file of filesToRemove) {
        const filePath = path.join(targetDir, file)
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath)
        }
      }

      console.log()
      console.log(chalk.green('✨ Project created successfully!'))
      console.log()
      console.log(chalk.cyan('Next steps:'))
      console.log()
      console.log(chalk.gray(`  cd ${projectName}`))
      console.log(chalk.gray('  pnpm tauri dev'))
      console.log()
      console.log(chalk.yellow('Happy coding! 🚀'))
    } catch (error) {
      spinner.fail('Error occurred')
      console.error(chalk.red(error.message))
      process.exit(1)
    }
  })

program.parse()
