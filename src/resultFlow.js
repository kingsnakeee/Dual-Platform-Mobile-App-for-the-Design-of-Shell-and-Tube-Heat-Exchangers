import _ from 'lodash'
import { flow } from './utils'
import * as eq from './equations'
import meq from './memoeq'
import tubeSize from './data/tubeSize'
import { materialDefs } from './fieldDefs'

export const prelimFlow = flow(
  ['tubeMaterialK', (p) => materialDefs[p.tubeMaterial].thermalConductivity],
  ['tubeLength', (p) => Math.ceil(p.maxTubeLength / 2)],
  ['pitchLength', (p) => p.pitchRatio * p.tubeOuterDiameter],
  ['heatDuty', eq.tubeHeatDuty],
  ['shellSideOutTemp', eq.shellSideOutTemp],
  ['shellDiameter', eq.shellDiameter],
  ['shellDiameter', (p) => Number(p.shellDiameter.toPrecision(1))],
  ['logMeanTempDiff', eq.effectiveTemperatureDifference],
  ['shellSideHeatTransferArea', eq.shellSideHeatTransferAreaFoul],
  ['shellSideHeatTransferAreaClean', eq.shellSideHeatTransferAreaClean],
  ['numberOfTubes', (p) => Math.ceil(eq.numberOfTubes(p))],
  (p) => ({
    ...p,
    ..._.pick(
      eq.tubeShellLayoutCount(p),
      'shellDiameter',
      'numberOfTubes',
      'pitchLength',
    ),
  }),
  ['baffleSpacing', (p) => Number((p.shellDiameter * 0.6).toPrecision(1))],
  ['overallHeatTransferCoeff', eq.overallHeatTransferCoeff],
  [
    'overallHeatTransferCoeffClean',
    (p) => {
      const pp = _.omit(
        p,
        'shellSideFoulingResistance',
        'tubeSideFoulingResistance',
      )
      return eq.overallHeatTransferCoeff(pp)
    },
  ],
)

export const ratingFlow = flow(
  [
    'shellSideFluidProperty',
    (p) =>
      eq.fluidProperty(
        p.shellSideFluidType,
        p.shellSideInTemp,
        p.shellSideOutTemp,
      ),
  ],
  [
    'tubeSideFluidProperty',
    (p) =>
      eq.fluidProperty(
        p.tubeSideFluidType,
        p.tubeSideInTemp,
        p.tubeSideOutTemp,
      ),
  ],
  [
    'overallHeatTransferCoeff',
    (p) => p.overallHeatTransferCoeff || meq.overallHeatTransferCoeff(p),
  ],
  [
    'shellSideHeatTransferArea',
    (p) => p.shellSideHeatTransferArea || meq.shellSideHeatTransferAreaFoul(p),
  ],
  ['tubeSideHeatTransferCoeff', meq.tubeSideHeatTransferCoeff],
  // ['pitchLength', (p) => p.pitchRatio * p.tubeOuterDiameter],
  // ['shellSideOutTemp', meq.shellSideOutTemp],
  // ['shellDiameter', meq.shellDiameter],
  [
    ['shellMassVelocity', meq.shellMassVelocity],
    ['shellReynold', meq.shellReynold],

    ['tubeReynold', meq.tubeReynold],
    ['fluidVelocity', meq.tubeSideMassVelocity],
    ['nusseltNumber', meq.nusseltNumber],
    ['pressureDropForIdealTubeBank', meq.pressureDropForIdealTubeBank],
    [
      'pressureDropInInteriorCrossflowSection',
      meq.pressureDropInInteriorCrossflowSection,
    ],
    ['bypassChannelDiametralGap', meq.bypassChannelDiametralGap],
    ['numberOfTubeRowCrossingBaffleTip', meq.numberOfTubeRowCrossingBaffleTip],
    [
      'numberOfTubeRowCrossingWindowArea',
      meq.numberOfTubeRowCrossingWindowArea,
    ],
    ['grossWindowFlowArea', meq.grossWindowFlowArea],
    ['areaOccupiedByNtwTubes', meq.areaOccupiedByNtwTubes],
    ['pressureDropInWindow', meq.pressureDropInWindow],
    ['pressureDropInEntranceAndExit', meq.pressureDropInEntranceAndExit],
    ['shellSidePressureDropTotal', meq.shellSidePressureDropTotal],
  ],
  (p) => {
    const result = { ...p }
    const input = _.omit(p, 'shellSideFoulingResistance')

    const tubeSide = input.tubeSideHeatTransferCoeff

    const kernShellSide = meq.shellSideHeatTransferCoeff(p)

    result.overallHeatTransferCoeffKernClean = eq.overallHeatTransferCoeff({
      ...input,
      shellSideHeatTransferCoeff: kernShellSide,
      tubeSideHeatTransferCoeff: tubeSide,
    })
    result.overallHeatTransferCoeffKern =
      1 /
      (1 / result.overallHeatTransferCoeffKernClean +
        p.shellSideFoulingResistance)

    const bdShellSide = meq.shellSideHeatTransferCoeffBD(p)

    result.overallHeatTransferCoeffBDClean = result.overallHeatTransferCoeffClean = eq.overallHeatTransferCoeff(
      {
        ...input,
        shellSideHeatTransferCoeff: bdShellSide,
        tubeSideHeatTransferCoeff: tubeSide,
      },
    )
    result.overallHeatTransferCoeffBD = result.overallHeatTransferCoeff =
      1 /
      (1 / result.overallHeatTransferCoeffBDClean +
        p.shellSideFoulingResistance)

    result.shellSideHeatTransferArea = meq.shellSideHeatTransferAreaParam({
      ...input,
      overallHeatTransferCoeff: result.overallHeatTransferCoeffBD,
    })
    result.shellSideHeatTransferAreaClean = meq.shellSideHeatTransferAreaParam({
      ...input,
      overallHeatTransferCoeff: result.overallHeatTransferCoeffBDClean,
    })
    result.surfaceOverDesign =
      result.overallHeatTransferCoeffBDClean / result.overallHeatTransferCoeffBD
    return result
  },
)

export const odReflow = flow(
  (p) => ({
    ...p,
    ...meq.surfaceOverDesignRecalculate({
      surfaceOverDesign: p.maxSurfaceOverDesign,
      ...p,
      recalculation: p.recalculation + 1,
    }),
  }),
  ['shellMassVelocity', meq.shellMassVelocity],
  ['shellReynold', meq.shellReynoldTubeOuterDiameter],
)

export const pressureDropReflow = flow((result) => {
  let lo = 1
  let hi = result.surfaceOverDesign
  let step = 10
  let pressureDrop = meq.shellSidePressureDropTotal(result)
  while (step > 0) {
    const newOd = (hi + lo) / 2
    result = {
      ...result,
      ...meq.surfaceOverDesignRecalculate({
        ...result,
        surfaceOverDesign: newOd,
      }),
    }

    result = ratingFlow({ surfaceOverDesign: newOd, ...result })
    pressureDrop = meq.shellSidePressureDropTotal(result)

    if (pressureDrop < input.maxPressureDrop) {
      lo = newOd
    } else {
      hi = newOd
    }
    step--
  }
  return result
})

export const sizingFlow = flow(
  ['pressureDropForIdealTubeBank', meq.pressureDropForIdealTubeBank],
  [
    'pressureDropInInteriorCrossflowSection',
    meq.pressureDropInInteriorCrossflowSection,
  ],
  ['bypassChannelDiametralGap', meq.bypassChannelDiametralGap],
  ['numberOfTubeRowCrossingBaffleTip', meq.numberOfTubeRowCrossingBaffleTip],
  ['numberOfTubeRowCrossingWindowArea', meq.numberOfTubeRowCrossingWindowArea],
  ['grossWindowFlowArea', meq.grossWindowFlowArea],
  ['areaOccupiedByNtwTubes', meq.areaOccupiedByNtwTubes],
  ['pressureDropInWindow', meq.pressureDropInWindow],
  ['pressureDropInEntranceAndExit', meq.pressureDropInEntranceAndExit],
  ['netFlowAreaInWindow', meq.netFlowAreaInWindow],
  ['shellSidePressureDropTotal', meq.shellSidePressureDropTotal],
  ['tubeUnsupportedLength', meq.tubeUnsupportedLength],
  ['axialTubeStressMultiplier', meq.axialTubeStressMultiplier],
  ['metalMassPerUnitLength', (param) => tubeSize(param).massPerLengthSteel],
  [
    ['longitudinalStress', meq.longitudinalStress],
    ['momentOfInertia', meq.momentOfInertia],
    ['clipplingLoad', meq.clipplingLoad],
    ['tubeMetalCrossSectionalArea', meq.tubeMetalCrossSectionalArea],
    ['tubeFluidMassPerUnitLength', meq.tubeFluidMassPerUnitLength],
    [
      'tubeFluidMassDisplacedPerUnitLength',
      meq.tubeFluidMassDisplacedPerUnitLength,
    ],
    ['hydroDynamicMassPerUnitLength', meq.hydroDynamicMassPerUnitLength],
    ['effectiveTubeMass', meq.effectiveTubeMass],
    ['naturalFrequency', meq.naturalFrequency],
    ['dampingConstant', meq.dampingConstant],
    ['fluidElasticParameter', meq.fluidElasticParameter],
    ['criticalFlowVelocityFactor', meq.criticalFlowVelocityFactor],
    ['criticalFlowVelocity', meq.criticalFlowVelocity],
  ],
)
