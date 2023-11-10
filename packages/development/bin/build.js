#!/usr/bin/env node

const system = require('../vendor/system')

system`
  npm run babel src --config-file "./babel.config.js" --extensions ".js" --out-dir dist --copy-files --no-copy-ignored
`
