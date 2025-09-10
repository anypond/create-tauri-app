#!/usr/bin/env node

import { program } from 'commander'
import { McpServer } from './server/McpServer.js'
import { logInfo, logError } from './utils/index.js'

program
  .name('tauri-template-mcp')
  .description('MCP server for Tauri template project management')
  .version('1.0.0')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-h, --host <host>', 'Host to bind to', 'localhost')
  .option('-r, --root <path>', 'Root path for template', process.cwd())
  .option('--dev', 'Run in development mode', false)
  .action(async options => {
    try {
      const port = parseInt(options.port, 10)
      const host = options.host
      const rootPath = options.root
      const isDev = options.dev

      logInfo(`Starting Tauri Template MCP Server...`)
      logInfo(`Port: ${port}`)
      logInfo(`Host: ${host}`)
      logInfo(`Root path: ${rootPath}`)
      logInfo(`Mode: ${isDev ? 'Development' : 'Production'}`)

      const server = new McpServer(port, host, rootPath || process.cwd())

      process.on('SIGINT', async () => {
        logInfo('Received SIGINT, shutting down gracefully...')
        await server.stop()
        process.exit(0)
      })

      process.on('SIGTERM', async () => {
        logInfo('Received SIGTERM, shutting down gracefully...')
        await server.stop()
        process.exit(0)
      })

      process.on('uncaughtException', error => {
        logError(`Uncaught Exception: ${error instanceof Error ? error.message : String(error)}`)
        if (error instanceof Error && error.stack) {
          logError(error.stack)
        }
        process.exit(1)
      })

      process.on('unhandledRejection', (reason, promise) => {
        logError(`Unhandled Rejection at: ${promise}`)
        logError(`Reason: ${reason instanceof Error ? reason.message : String(reason)}`)
        process.exit(1)
      })

      await server.start()

      if (isDev) {
        logInfo('Development mode: watching for changes...')
        logInfo('Press Ctrl+C to stop the server')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logError(`Failed to start MCP server: ${errorMessage}`)
      process.exit(1)
    }
  })

program.parse()
