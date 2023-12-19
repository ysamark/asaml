import morgan from 'morgan'

import { RequestHandler } from 'express'
import { urlencoded } from 'body-parser'
import { json } from 'express'

export const middlewares: RequestHandler[] = [
  json(),
  urlencoded({ extended: false }),
  morgan('combined')
]

export const errorMiddlewares: RequestHandler[] = [
  (request, response, next) => {
    next()
  }
]
