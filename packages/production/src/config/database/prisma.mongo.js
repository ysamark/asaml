import { PrismaClient } from '@prisma/client'

import { mongo } from '.'

export const prisma = new PrismaClient({
  datasources: {
    db: mongo
  }
})
