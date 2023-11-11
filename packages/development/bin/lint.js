#!/usr/bin/env node

const { system } = require('../vendor/system')

system`
  eslint --ext .js src/
`
