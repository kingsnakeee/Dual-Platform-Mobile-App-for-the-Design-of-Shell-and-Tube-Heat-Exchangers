import _ from 'lodash'
import * as eq from './equations'

const cache = new WeakMap()

export default _.mapValues(eq, (fn, k) => {
  const c = new WeakMap()
  cache.set(fn, c)
  return param => {
    const result = c.get(param)
    if (!c.has(param)) {
      const r = fn(param)
      c.set(param, r)
      return r
    }
    return result
  }
})
