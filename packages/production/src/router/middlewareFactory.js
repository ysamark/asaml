import { routerHandlerArguments } from './routerHandlerArguments'
import { internalServerErrorHandler } from './internalServerErrorHandler'

export const middlewareFactory = ({ middleware }) => {
  if (typeof middleware !== 'function') {
    return () => 0
  }

  return (...args) => {
    const [response, next] = args.slice(1)

    const fallback = {
      error: null
    }

    try {
      const middlewareDataObject = middleware(routerHandlerArguments(...args))

      if (!(middlewareDataObject instanceof Promise)) {
        return next()
      }

      middlewareDataObject
        .then(() => {
          if (!response.finished) {
            next()
          }
        })
        .catch(error => {
          Object.assign(fallback, { error })
        })

      return null
    } catch (error) {
      Object.assign(fallback, { error })
    }

    if (fallback.error) {
      internalServerErrorHandler(response, fallback.error)
    }
  }
}
