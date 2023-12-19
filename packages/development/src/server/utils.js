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

export const getProjectDefaultLang = (props = {}) => {
  const langConfigFile = getPackageLangConfigFile(props)
  const defaultLang = 'js'

  if (langConfigFile) {
    const langConfigFileName = path.basename(langConfigFile)
    const langNameRe = /^(((j|t)s)config\.json)$/

    if (langNameRe.test(langConfigFileName)) {
      const [lang] = langConfigFileName.match(langNameRe).slice(2)

      if (typeof lang === typeof 'str') {
        return lang
      }
    }
  }

  return defaultLang
}

export const getPackageLangConfigFile = (props = {}) => {
  const rootDir = props.rootDir || process.cwd()

  const packageConfigFileNameAlternates = [
    'tsconfig.json',
    'jsconfig.json'
  ]

  for (const packageConfigFile of packageConfigFileNameAlternates) {
    const packageConfigFilePath = path.resolve(rootDir, packageConfigFile)

    if (fs.existsSync(packageConfigFilePath)) {
      return packageConfigFilePath
    }
  }
}

export const getPackageLangConfig = () => {
  const packagePackageLangConfigFile = getPackageLangConfigFile()

  if (packagePackageLangConfigFile) {
    try {
      const packageLangConfig = require(packagePackageLangConfigFile)

      return packageLangConfig
    } catch (err) {}
  }

  return {
    compilerOptions: {
      paths: {}
    }
  }
}
