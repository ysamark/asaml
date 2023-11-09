import { RouteSource, Route } from '@asa'

import { usePathPrefix } from '@asa/utils'

const store = Symbol('store')

export class RouterContext {
  [store] = []

  constructor (props) {
    Object.assign(this, props)

    const methods = 'get post group put delete patch'.split(/\s+/)

    methods
      .filter(method => typeof this[method] === 'function')
      .forEach(method => {
        this[method] = this[method].bind(this)
      })
  }

  get () {
    this.factory('get', arguments)
  }

  post () {
    this.factory('post', arguments)
  }

  put () {
    this.factory('put', arguments)
  }

  delete () {
    this.factory('delete', arguments)
  }

  patch () {
    this.factory('patch', arguments)
  }

  get sourcePrefixProps () {
    return this.sourcePrefix && this.sourcePrefix.props
  }

  factory (httpVerb, args) {
    let [routePath, source] = args

    if (typeof this.pathPrefix === typeof 'str') {
      routePath = usePathPrefix([this.pathPrefix, routePath])
    }

    source = RouteSource.merge({
      prefix: this.sourcePrefixProps,
      source
    })

    // console.log('\n\n\n\nThis.sourcePrefix => \n', this.sourcePrefix, '\n\n\n')
    // console.log('\n\n\n\nMerged routeSourceStr(' + routePath + ') => \n', routeSourceStr, '\n\n\n')

    // const routeSource = new RouteSource(source)
    // verb, path, source
    const route = new Route({
      verb: httpVerb,
      path: routePath,
      source
    })

    this[store].push(route)
  }

  group (pathPrefix, ...args) {
    const groupBody = args.length >= 1 ? args[-1 + args.length] : null

    if (typeof groupBody === 'function') {
      let sourcePrefix

      if (typeof 'str' === typeof args[0]) {
        sourcePrefix = args[0]
      }

      pathPrefix = usePathPrefix([this.pathPrefix || '', pathPrefix])

      sourcePrefix = RouteSource.merge({
        prefix: this.sourcePrefixProps,
        source: sourcePrefix,
        group: true
      })

      // console.log('\n\n\n\nsourcePrefix(' + pathPrefix + ') => \n', sourcePrefix, '\n\n\n\n\n')

      const routerContext = new RouterContext({ pathPrefix, sourcePrefix })

      groupBody(routerContext)

      if (routerContext.store instanceof Array) {
        routerContext.store.forEach(route => this[store].push(route))
      }
    }
  }

  get store () {
    return Array.from(this[store])
  }
}
