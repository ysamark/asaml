/**
 * middlewares path list
 *
 * Array (
 *  { path: String, data: string }
 * )
 *
 * map all the items in the array creating a new one by splitting the
 * data property of each element assuming each slice as a data of a new
 * middleware object with the sane path
 */
export function splitSourceMiddlewaresPathList ({ middlewaresPathList }) {
  const newMiddlewaresPathList = []

  for (const middlewarePath of middlewaresPathList) {
    const { data, path = null } = middlewarePath

    if (typeof data === typeof 'str') {
      const middlewarePathSlices = data.split(/\s*\+\s*/)

      for (const middlewarePathSlice of middlewarePathSlices) {
        newMiddlewaresPathList.push({ data: middlewarePathSlice, path })
      }
    }
  }

  return newMiddlewaresPathList
}
