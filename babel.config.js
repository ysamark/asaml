const { compilerOptions } = require('./jsconfig.json')
const { pathsToModuleAliases } = require('./utils/console')

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '6'
        }
      }
    ]
  ],

  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: pathsToModuleAliases(compilerOptions.paths, { prefix: '.' })
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ],

  ignore: [
    './node_modules',
    './tests',
    '**/*.spec.js'
  ]
}
