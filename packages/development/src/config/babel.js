import { pathsToModuleAliases } from '..'
import { getPackageLangConfig } from '../utils'

const packageLangConfig = getPackageLangConfig()

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
        alias: pathsToModuleAliases(packageLangConfig.compilerOptions.paths, {
          prefix: packageLangConfig.compilerOptions.rootDir
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
