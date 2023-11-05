import { notResolvedControllerAction } from '@asa/errors'

export const routeActionResolver = ({ route }) => {
  if (!(route.source.action &&
    typeof route.source.action === typeof 'str' &&
    /\S/.test(route.source.action))) {
    route.source.action = 'index'
  }

  let action = typeof route.source.controller === 'function'
    ? route.source.controller
    : null

  const controllerHasValidAction = Boolean(
    typeof 'str' === typeof route.source.action &&
    typeof route.source.controller === 'object' &&
    !!route.source.controller &&
    typeof route.source.controller[
      route.source.action
    ] === 'function'
  )

  if (controllerHasValidAction) {
    action = route.source.controller[route.source.action]
  }

  action = (typeof action === 'function')
    ? action
    : notResolvedControllerAction({
      action: route.source.action,
      controller: route.source.controllerName,
      module: route.source.module
    })

  return action
}
