export function notResolvedControllerAction ({ action, controller, module }) {
  return ({ response }) => {
    const message = '\n\n\n\nNot resolved action (' + action + ') ' + controller + ' controller in module ' + module + '\n\n\n\n'

    return response.send(message)
  }
}
