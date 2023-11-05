import { config } from '@asa'

export const loadSetupHandlers = (setupHandlers) => {
  if (!(setupHandlers instanceof Array)) {
    return
  }

  try {
    const environmentSetup = require(`${config.rootDir}/config/setups/${process.env.NODE_ENV}.js`)

    if (typeof environmentSetup === 'object' &&
      typeof environmentSetup.default === 'function') {
      setupHandlers.push(environmentSetup.default)
    }
  } catch (err) {
  } finally {
    setupHandlers.forEach((callback, callbackIndex) => {
      if (!(callback instanceof Promise)) {
        setupHandlers[callbackIndex] = callback()
      }
    })
  }

  return setupHandlers
}
