#!/usr/bin/env node
// Custom lint-staged script to exclude template directory
import { execSync } from 'child_process'

// Get staged files
const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
  .trim()
  .split('\n')

// Filter out template directory files
const filteredFiles = stagedFiles.filter(file => {
  return !file.startsWith('template/')
})

// Group by extension
const jsFiles = filteredFiles.filter(file => /\.(js|jsx|ts|tsx)$/.test(file))
const otherFiles = filteredFiles.filter(file => /\.(json|md|yml|yaml)$/.test(file))

// Run ESLint on JS/TS files
if (jsFiles.length > 0) {
  try {
    execSync(`eslint --fix ${jsFiles.join(' ')}`, { stdio: 'inherit' })
  } catch {
    process.exit(1)
  }
}

// Run Prettier on all files
const allFormatFiles = [...jsFiles, ...otherFiles]
if (allFormatFiles.length > 0) {
  try {
    execSync(`prettier --write ${allFormatFiles.join(' ')}`, { stdio: 'inherit' })
  } catch {
    process.exit(1)
  }
}

console.log('Linting completed successfully')
