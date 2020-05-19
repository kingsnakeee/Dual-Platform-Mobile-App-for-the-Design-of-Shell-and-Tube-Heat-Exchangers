import React from 'react'
import { Icon } from '@ui-kitten/components'

const cache = new Map()

export default name => {
  if (!cache.has(name)) {
    cache.set(name, props => <Icon {...props} name={name} />)
  }
  return cache.get(name)
}
