import debug from 'debug'
import 'express-async-errors'
import express, { Application, RequestHandler } from 'express'

import { Router } from '@asa/router/Router'
import { requireAppFile } from '@utils/requireAppFile'
import { initApplicationConfig } from '@utils/initApplicationConfig'

import { middlewares, errorMiddlewares } from '~/config/middlewares'

type MiddlewareList = RequestHandler[]
type AppFunctionHandler = ({ app }: { app: Application }) => void
type AppHandler = MiddlewareList | AppFunctionHandler

type AppProps = {
  key?: string
  app?: Application
}

export class App {
  private app: Application = express()
  private key: string

  constructor(props: AppProps) {
    this.key = props.key ?? null
  }

  async listen(): Promise<void> {
    const setup = requireAppFile('config/setup')
    const middlewaresModule = requireAppFile('config/middlewares')

    const middlewaresList = [
      ...middlewares,
      ...(middlewaresModule && middlewaresModule.__esModule
        ? middlewaresModule.middlewares
        : [])
    ]

    const errorMiddlewaresList = [
      ...errorMiddlewares,
      ...(middlewaresModule && middlewaresModule.__esModule
        ? middlewaresModule.errorMiddlewares
        : [])
    ]

    if (setup instanceof Array) {
      await Promise.all([...setup, initApplicationConfig()])
    }

    const log = debug('app')

    const PORT = process.env.PORT || 3000

    const appHandlers: AppHandler[] = [
      /**
       * A list of router middleware
       *
       * It should contain middlewares such
       * as 'cors', 'body-parser' and others...
       */
      middlewaresList,

      /**
       * Application router handler
       */
      ({ app }) => {
        Router.draw(app)
      },

      /**
       * Application router handler
       */
      errorMiddlewaresList
    ]

    this.applyAppHandlers(appHandlers)

    this.app.listen(PORT, () => {
      log(`Server running at port ${PORT}`)
    })
  }

  use(middleware: RequestHandler): Application {
    this.app.use(middleware)

    return this.app
  }

  private applyAppHandlers(appHandlers: AppHandler[]): void {
    appHandlers.forEach(appHandler => {
      /**
       * Map and apply each middleware
       * if the current handler object is an array
       */
      if (appHandler instanceof Array) {
        return appHandler
          .filter(appHandler => Boolean(appHandler))
          .forEach(middleware => this.app.use(middleware))
      }

      /**
       * execute
       */
      if (typeof appHandler === 'function') {
        return appHandler({ app: this.app })
      }
    })
  }
}
