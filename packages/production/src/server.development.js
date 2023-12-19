import 'dotenv/config'
import './utils/setupModuleAliases/config'

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

import { config } from '.'

const envDotEnvFilePath = path.join(config.rootDir, '.env.' + (process.env.NODE_ENV || 'development'))

if (fs.exitsSync(envDotEnvFilePath)) {
  dotenv.config({ path: envDotEnvFilePath })
}
