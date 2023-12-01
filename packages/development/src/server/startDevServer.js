// import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

import chokidar from 'chokidar'

import { AsaDevServer } from '.'
import { defineEnvVars } from './env'
import { defaultServerConfig } from './config'
import { getServerConfig } from './getServerConfig'
import { getFileExtension, getCommandDataByExtension, getCommandScriptByArgs, serverWatchDirListMapper } from './utils'

export function startDevServer () {
  const rootDir = process.cwd()
  const config = getServerConfig(rootDir, defaultServerConfig)

  defineEnvVars(config.env)

  const scriptFileAbsolutePath = path.resolve(rootDir, config.entrypoint)

  config.watch = config.watch
    .map(serverWatchDirListMapper({ rootDir }))

  console.log(`Watching file: ${scriptFileAbsolutePath}`)

  let server = new AsaDevServer(null)

  const fileWatcher = chokidar.watch(config.watch, {
    cwd: rootDir,
    ignored: config.ignore
  })

  const changeFileHandler = (changedFile) => {
    const commandData = getCommandDataByExtension({
      extension: getFileExtension(changedFile),
      config
    })

    const commandScript = getCommandScriptByArgs({
      rootDir,
      args: commandData.args,
      defaultScript: scriptFileAbsolutePath
    })

    const commandArgs = [
      commandScript,
      ...commandData.args
    ]

    const childProcess = spawn(commandData.command, commandArgs, {
      stdio: 'inherit',
      cwd: rootDir,
      shell: true
    })

    server = new AsaDevServer(childProcess)

    server.on('close', (exitCode) => {
      if (exitCode !== 0) {
        return console.error(`The process exited with error code: ${exitCode}`)
      }

      console.log('The process was finished successfully')
    })
  }

  changeFileHandler(config.entrypoint)

  fileWatcher.on('change', (changedFile) => {
    server.kill(() => {
      changeFileHandler(changedFile)
    })
  })

  process.on('SIGINT', () => {
    console.log('Finishing task... Bye!!')
    fileWatcher.close()
    server.kill()
    process.exit(0)
  })
}
