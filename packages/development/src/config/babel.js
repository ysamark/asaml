import path from 'path'

import { pathsToModuleAliases } from '..'

let packageJsConfig = {
  compilerOptions: {
    paths: {}
  }
}

const packageJsConfigFileAlternates = [
  'tsconfig.json',
  'jsconfig.json'
]

for (const packageJsConfigFile of packageJsConfigFileAlternates) {
  try {
    const packageJsConfigFilePath = path.resolve(process.cwd(), packageJsConfigFile)
    packageJsConfig = require(packageJsConfigFilePath)

    if (typeof packageJsConfig === 'object') {
      break
    }
  } catch (err) {
    continue
  }
}

const babelDefaultConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '6'
        }
      }
    ],
    [
      '@babel/preset-typescript'
    ]
  ],

  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: pathsToModuleAliases(packageJsConfig.compilerOptions.paths, {
          prefix: packageJsConfig.compilerOptions.rootDir
        })
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ],

  ignore: [
    '**/*.spec.js'
  ]
}

export default babelDefaultConfig
