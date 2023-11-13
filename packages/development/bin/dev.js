#!/usr/bin/env node

const path = require('path')
const { system } = require('../vendor/system')

const nodemonBootstrapFile = path.join(__dirname, '..', 'vendor', 'nodemon.js')

system`
  npx cross-env NODE_ENV=development DEBUG=app:root PORT=7000 node ${nodemonBootstrapFile} src/server.development.js --trace-warnings
`
