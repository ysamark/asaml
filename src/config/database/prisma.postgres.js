import { PrismaClient } from '@prisma/client'

import { postgres } from '.'

export const prisma = new PrismaClient({
  datasources: {
    db: postgres
  }
})
