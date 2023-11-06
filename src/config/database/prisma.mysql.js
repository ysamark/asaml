import { PrismaClient } from '@prisma/client'

import { mysql } from '.'

export const prisma = new PrismaClient({
  datasources: {
    db: mysql
  }
})
