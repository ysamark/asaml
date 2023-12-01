import fs from 'fs'
import path from 'path'

export const getFileExtension = (fileName) => {
  const fileExtensionMatch = path.basename(fileName).match(/(\.(.[^.]+))$/)

  if (fileExtensionMatch) {
    return fileExtensionMatch[0].replace(/^\./, '')
  }

  return ''
}

/**
   * @returns CommandData
   *
   * @type CommandData = {
   *  command: string
   *  args: string[]
   * }
   */
export const getCommandDataByExtension = ({ extension, config }) => {
  const commandData = {
    command: 'node',
    args: []
  }

  const extensionCommandData = config.execMap[extension]

  if (typeof extensionCommandData === typeof 'str' &&
    /\S/.test(extensionCommandData)) {
    const extensionCommandDataSlices = extensionCommandData.split(/\s+/)

    commandData.command = extensionCommandDataSlices[0]
    commandData.args = extensionCommandDataSlices.slice(1)
  }

  return commandData
}

export const getCommandScriptByArgs = ({ args, rootDir, ...options }) => {
  let i = 0

  for (; i < args.length; i++) {
    const arg = args[i]
    const scriptPath = path.resolve(rootDir, arg)

    if (fs.existsSync(scriptPath)) {
      args.splice(i, 1)
      return scriptPath
    }
  }

  return options.defaultScript
}

export const serverWatchDirListMapper = ({ rootDir }) => {
  return relativePath => (
    path.resolve(rootDir, relativePath)
  )
}
