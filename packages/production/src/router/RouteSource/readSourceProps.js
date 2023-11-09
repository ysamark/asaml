const DEFAULT_PROPS = {
  // middlewareName: 3,
  // middlewareAction: 5,
  // controller: -1,
  // module: 8,
  action: 7,
  path: 4, // old module
  middlewaresPathList: 2
}

export function readSourceProps ({ source, props = DEFAULT_PROPS }) {
  const re = /(([a-zA-Z0-9_+:]*)??(@(([a-zA-Z0-9_:]+):?)?)?(\/([a-zA-Z0-9_]+))?)?/

  if (typeof source === 'string' && re.test(source)) {
    const sourceDataMatches = source.match(re)

    const sourceProps = {}

    for (const key in props) {
      const propIndex = props[key]

      if (typeof sourceDataMatches[propIndex] !== typeof undefined) {
        sourceProps[key] = sourceDataMatches[propIndex]
      }
    }

    if (sourceProps.middlewaresPathList) {
      sourceProps.middlewaresPathList = [
        {
          path: sourceProps.path,
          data: sourceProps.middlewaresPathList
        }
      ]
    }

    return sourceProps
  }
}
