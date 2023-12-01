import path from 'path'

import { ServerConfig } from './ServerConfig'

export function getServerConfig (rootDir, defaultConfig = {}) {
  const configFilePath = path.resolve(rootDir, 'asa.json')

  const serverConfig = new ServerConfig(defaultConfig)

  try {
    const serverCustomConfigs = require(configFilePath)

    if (typeof serverCustomConfigs === 'object') {
      serverConfig.setProps(serverCustomConfigs)
    }
  } catch (err) {
    // pass
  }

  return serverConfig.props
}
