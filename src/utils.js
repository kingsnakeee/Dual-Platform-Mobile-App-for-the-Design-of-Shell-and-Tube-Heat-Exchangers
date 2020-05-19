import _ from 'lodash'
import fieldDefs from './fieldDefs'

const INCH2METER = 0.0254
const METER2INCH = 1 / 0.0254

export const formatNumber = (x) => {
  const exp = Math.floor(Math.log10(Math.abs(x)))

  const round = Math.round(x * Math.pow(10, -exp + 5)) * Math.pow(10, exp - 5)
  const prec = x.toPrecision(6)
  if (prec.length > 9) return round.toExponential(5)

  // const [integer, decimal] = ('' + round).split('.')
  // const avialableFloat = 6 - integer.length

  return prec

  // return (
  //   integer +
  //   (decimal
  //     ? '.' +
  //       decimal
  //         .substring(0, 10)
  //         .substring(0, avialableFloat)
  //         .replace(/0+$/, '0')
  //     : '')
  // )
}

const stringFields = new Set([
  'shellSideFluidType',
  'tubeSideFluidType',
  'mechanicalDesign',
  'tubeMaterial',
])
const inchToMeterFields = {
  tubeOuterDiameterInch: 'tubeOuterDiameter',
  tubeInnerDiameterInch: 'tubeInnerDiameter',
}
const percentFields = new Set(['baffleCutPercent', 'surfaceOverDesign', 'maxSurfaceOverDesign'])

export const prepareInput = (keyvalues) =>
  _.transform(
    keyvalues,
    (acc, v, k) => {
      if (stringFields.has(k)) {
        return
      }

      const num = Number(v)
      if (k in inchToMeterFields) {
        acc[k] = num
        const t = inchToMeterFields[k]
        // console.log(t, num * INCH2METER)

        acc[t] = num * INCH2METER
        // console.log(acc)
        return
      }
      if (percentFields.has(k)) {
        acc[k] = num / 100
        return
      }
      acc[k] = num
    },
    { ...keyvalues },
  )

export const outputTransform = (keyvalues) =>
  _.mapValues(keyvalues, (v, k) => {
    const def = fieldDefs[k]
    if (!def) return v
    if (def) {
      if (def.displayTransform) {
        return def.displayTransform(v)
      }
    }
    if (percentFields.has(k)) return v * 100
    return v
  })

export const flow = (...flowlist) => (param) => {
  return flowlist.reduce(
    (acc, vv) => {
      if (!vv) {
        throw new Error(`flow error ${vv}`)
      }
      if (typeof vv === 'function') {
        return vv(acc)
      }

      if (typeof vv[0] === 'string') {
        const [key, fn] = vv
        if (!fn) throw new Error('fn-undefined:' + key)
        return { ...acc, [key]: fn(acc) }
      }

      return {
        ...acc,
        ...vv.reduce(
          (accc, vvv) => {
            if (typeof vvv === 'function') {
              return vvv(accc)
            }
            const [k, fn] = vvv
            accc[k] = fn(acc)
            return accc
          },
          { ...acc },
        ),
      }
    },
    { ...param },
  )
}
