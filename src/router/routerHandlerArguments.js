export const routerHandlerArguments = (request, response, next) => {
  const { body, headers } = request

  return {
    request,
    response,
    headers,
    next,
    body
  }
}
