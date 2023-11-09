// import { config } from '@asa'
import { capitalize, joinSourcePaths } from '@asa/utils'

import { readSourcesProps } from './readSourcesProps'
import { RouteSourceContext } from './RouteSourceContext'
import { splitSourceMiddlewaresPathList } from './splitSourceMiddlewaresPathList'

export class RouteSource extends RouteSourceContext {
  /**
   * Merge two route source props objects
   *
   * @param {string|object} prefix source prefix
   * @param {string|object} source source to merge with
   */
  static merge ({ prefix, source }) {
    const [sourcePrefix, sourceProps] = readSourcesProps(prefix, source)

    const mergedSourceProps = {
      ...(sourcePrefix || {})
    }

    const sourcePropsSetters = {
      setPath ({ path, target }) {
        return joinSourcePaths(target.path, path)
      },

      setAction: ({ action }) => action,

      setMiddlewaresPathList ({ middlewaresPathList, target }) {
        if (middlewaresPathList instanceof Array) {
          // for (const middlewarePath of middlewaresPathList) {
          //   newMiddlewaresPathList.push(middlewarePath)
          // }
          return [
            ...(target.middlewaresPathList || []),
            ...middlewaresPathList
          ]
        }
      }
    }

    for (const prop in sourceProps) {
      const propSetter = `set${capitalize(prop)}`
      const sourcePropSetterProps = {
        target: mergedSourceProps
      }

      if (typeof sourcePropsSetters[propSetter] === 'function') {
        sourcePropSetterProps[prop] = sourceProps[prop]

        const sourcePropValue = sourcePropsSetters[propSetter](sourcePropSetterProps)

        mergedSourceProps[prop] = sourcePropValue
      }
    }

    if (mergedSourceProps.middlewaresPathList) {
      mergedSourceProps.middlewaresPathList = splitSourceMiddlewaresPathList(mergedSourceProps)
    }

    // console.log('\n\n\n\n\nMergedSourceProps => ', mergedSourceProps, '\n\n\n\n\n\n')

    return new RouteSource({ source: mergedSourceProps })
  }
}
