#!/usr/bin/env node

const { system } = require('../vendor/system')

system`
  npx cross-env NODE_ENV=development DEBUG=app:root PORT=7000 nodemon src/server.development.js --trace-warnings
`
