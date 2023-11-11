#!/usr/bin/env node

const { system } = require('../vendor/system')

system`
  npx cross-env NODE_ENV=production DEBUG=app:root PORT=7000 node -r dotenv/config dist/server.js
`
