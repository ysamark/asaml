import { Route } from './Route'
import { RouteSource } from './RouteSource'
import { RouterContext } from './RouterContext'
import { middlewareFactory } from './middlewareFactory'
import { routeActionResolver } from './routeActionResolver'
import { routerHandlerArguments } from './routerHandlerArguments'

const store = []

export class Router {
  static get () {
    return Router.factory('get', arguments)
  }

  static post () {
    return Router.factory('post', arguments)
  }

  static patch () {
    return Router.factory('patch', arguments)
  }

  static delete () {
    return Router.factory('delete', arguments)
  }

  static put () {
    return Router.factory('put', arguments)
  }

  static group (pathPrefix, ...args) {
    const groupBody = args.length >= 1 ? args[-1 + args.length] : null

    if (typeof groupBody === 'function') {
      let sourcePrefix

      if (typeof 'str' === typeof args[0]) {
        sourcePrefix = new RouteSource({ source: args[0] })
      }

      const routerContext = new RouterContext({
        pathPrefix,
        sourcePrefix
      })

      groupBody(routerContext)

      if (routerContext.store instanceof Array) {
        routerContext.store.forEach((route) => {
          store.push(route)
        })
      }
    }
  }

  static factory (routeHttpVerb, args) {
    const [routePath, routeSource] = args

    const source = new RouteSource({ source: routeSource })

    const route = new Route({
      verb: routeHttpVerb,
      path: routePath,
      source
    })

    store.push(route)

    return route
  }

  static draw (app) {
    store.forEach(route => {
      const routeArgs = [route.path]

      const routeMiddlewares = []

      // route.source.resolveProps()

      // console.log('\n\n\nroute.source.middlewares(' + route.path + ') => ', route.source.middlewares, '\n\n\n\n')

      route.source.middlewares
        ?.filter(middleware => typeof middleware === 'function')
        ?.forEach(middleware => {
          routeMiddlewares.push(middlewareFactory({ middleware }))
        })

      routeArgs.push(routeMiddlewares)

      const action = routeActionResolver({ route })

      routeArgs.push((...args) => {
        return action(routerHandlerArguments(...args))
      })

      app[route.verb].apply(app, routeArgs)
    })
  }
}
