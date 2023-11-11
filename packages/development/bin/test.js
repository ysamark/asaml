#!/usr/bin/env node

const { system } = require('../vendor/system')

system`
  npx cross-env NODE_ENV=test jest
`
