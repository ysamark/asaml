export function notResolvedMiddleware ({ middleware, module }) {
  return function notResolvedMiddleware ({ response }) {
    const message = 'Not resolved middleware ' + middleware + ' in module ' + module

    response.json({ message })
  }
}
