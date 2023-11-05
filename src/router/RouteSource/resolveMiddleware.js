import fs from 'fs'
import path from 'path'

import { config } from '@asa'
import { capitalize, isClass } from '@asa/utils'
import { notResolvedMiddleware } from '@asa/errors'

export function resolveMiddleware ({ middlewaresStr, middlewareModule = null }) {
  if (!/\S/.test(middlewaresStr.toString())) {
    return
  }

  const middlewares = []

  middlewaresStr.split(/\+/).forEach(middlewareStr => {
    const [middlewareName, middlewareAction] = middlewareStr.split(/\s*:\s*/)

    const middlewareClassName = `${capitalize(middlewareName)}Middleware`

    if (!(typeof middlewareModule === typeof 'str' && /\S/.test(middlewareModule))) {
      middlewareModule = config.module
    }

    try {
      const middlewarePath = path.resolve(
        config.middlewaresPathByModule(middlewareModule),
      `${middlewareClassName}.js`
      )

      if (fs.existsSync(middlewarePath)) {
        const middlewareModuleObject = require(middlewarePath)

        if (isClass(middlewareModuleObject[middlewareClassName])) {
          const MiddlewareDataObject = middlewareModuleObject[middlewareClassName]

          const middleware = new MiddlewareDataObject()

          if (typeof middleware[middlewareAction] === 'function') {
            return middlewares.push(middleware[middlewareAction])
          }
        }
      }
    } catch (err) {
    }

    middlewares.push(notResolvedMiddleware({
      middleware: middlewareStr,
      module: middlewareModule
    }))
  })

  return middlewares
}
