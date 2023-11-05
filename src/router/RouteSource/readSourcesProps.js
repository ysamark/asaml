import { RouteSource } from '.'
import { readSourceProps } from './readSourceProps'

export function readSourcesProps (...sources) {
  // const sourceFilter = source => Boolean(
  //   ['string', 'object'].indexOf(typeof source) >= 0
  // )

  return sources
    // .filter(sourceFilter)
    .map(source => {
      if (typeof source === 'object') {
        return source instanceof RouteSource ? source.props : source
      }

      return readSourceProps({ source })
    })
}
