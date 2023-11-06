export function notResolvedController ({ controller, module }) {
  return ({ response }) => {
    const message = '\n\n\n\nNot resolved controller ' + controller + ' in module ' + module + '\n\n\n\n'

    console.log(message)

    response.send(message)
  }
}
