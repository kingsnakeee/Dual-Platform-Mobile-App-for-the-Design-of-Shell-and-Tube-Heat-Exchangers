import _ from 'lodash'
import fieldDefs from './fieldDefs'
import numeral from 'numeral'
import { formatNumber } from './utils'

const headRow = () => {
  return `<tr>
  <th>Parameters</th>
  <th>Value</th>
  <th>Unit</th>
</tr>`
}

const tranformSymbol = (symbol) =>
  symbol.replace(/_(.+)$/, (m, p1) => `<sub>${p1}</sub>`)

const makeLabel = (name) => {
  const fieldDef = fieldDefs[name]
  const { label = name, symbol } = fieldDef || {}
  return (
    label +
    (symbol ? ` <span class="symbol">(${tranformSymbol(symbol)})</span>` : '')
  )
}

const row = (name, value, inUnit) => {
  const fieldDef = fieldDefs[name]
  const { unit = inUnit, label = name, symbol, displayTransform } =
    fieldDef || {}

  return `<tr class="row">
    <td class="parameterNameColumn">${makeLabel(name)}</td>
    <td class="numberCell parameterValueColumn">${
      displayTransform
        ? displayTransform(value)
        : typeof value === 'number'
        ? formatNumber(unit === '%' ? value * 100 : value)
        : value
    }</td>
    <td class="parameterUnitColumn">${unit || ''}</td>
  </tr>`
}

const table = (title, fields, param) => {
  return `
  <h2 class="tableTitle">${title}</h2>
  <table class="table" cellpadding="10">
  ${headRow()}
  ${fields
    .map((name) => {
      if (typeof name === 'string') return row(name, param[name])
      return row(
        name.label,
        typeof name.value === 'function' ? name.value(param) : name.value,
        name.title,
      )
    })
    .join('')}
  </table>`
}

const displayFields = {
  preliminary: [
    {
      title: 'Shell side',
      fields: [
        'shellSideFluidType',
        'shellSideMassFlowRate',
        'shellSideInTemp',
        'shellSideFoulingResistance',
        'shellSideMassSpecificHeatCapacity',
      ],
    },
    {
      title: 'Tube side',
      fields: [
        'tubeSideFluidType',
        'tubeSideMassFlowRate',
        'tubeSideInTemp',
        'tubeSideOutTemp',
        'tubeSideMassSpecificHeatCapacity',
        'tubeSideHeatTransferCoeff',
      ],
    },
    {
      title: 'Physical dimension',
      fields: [
        'pitchRatio',
        'tubeLength',
        'maxTubeLength',
        'tubeLayout',
        'tubePass',
        'tubeMaterialK',
        'tubeInnerDiameter',
        'tubeOuterDiameter',
      ],
    },
    {
      title: 'Preliminary analysis result',
      fields: [
        'heatDuty',
        'shellSideOutTemp',
        'overallHeatTransferCoeff',
        'overallHeatTransferCoeffClean',
        'logMeanTempDiff',
        'shellSideHeatTransferArea',
        'shellSideHeatTransferAreaClean',
        'pitchLength',
        'tubeLength',
        'numberOfTubes',
        'shellDiameter',
        'baffleSpacing',
      ],
    },
  ],

  rating: [
    {
      title: 'Shell side',
      fields: [
        {
          label: makeLabel('dynamicViscosity'),
          value: (p) => _.get(p, 'shellSideFluidProperty.dynamicViscosity'),
          unit: fieldDefs['dynamicViscosity'].unit,
        },
        {
          label: makeLabel('density'),
          value: (p) => _.get(p, 'shellSideFluidProperty.density'),
          unit: fieldDefs['density'].unit,
        },
        {
          label: makeLabel('specificHeatCapacity'),
          value: (p) => _.get(p, 'shellSideFluidProperty.specificHeat'),
          unit: fieldDefs['specificHeatCapacity'].unit,
        },
        {
          label: makeLabel('thermalConductivity'),
          value: (p) => _.get(p, 'shellSideFluidProperty.thermalConductivity'),
          unit: fieldDefs['thermalConductivity'].unit,
        },
        {
          label: makeLabel('prandtlNumber'),
          value: (p) => _.get(p, 'shellSideFluidProperty.prandltNumber'),
          unit: fieldDefs['prandtlNumber'].unit,
        },
        {
          label: makeLabel('massVelocity'),
          value: (p) => _.get(p, 'shellMassVelocity'),
          unit: fieldDefs['massVelocity'].unit,
        },
        'shellReynold',
      ],
    },
    {
      title: 'Tube side',
      fields: [
        {
          label: makeLabel('dynamicViscosity'),
          value: (p) => _.get(p, 'tubeSideFluidProperty.dynamicViscosity'),
          unit: fieldDefs['dynamicViscosity'].unit,
        },
        {
          label: makeLabel('density'),
          value: (p) => _.get(p, 'tubeSideFluidProperty.density'),
          unit: fieldDefs['density'].unit,
        },
        {
          label: makeLabel('specificHeatCapacity'),
          value: (p) => _.get(p, 'tubeSideFluidProperty.specificHeat'),
          unit: fieldDefs['specificHeatCapacity'].unit,
        },
        {
          label: makeLabel('thermalConductivity'),
          value: (p) => _.get(p, 'tubeSideFluidProperty.thermalConductivity'),
          unit: fieldDefs['thermalConductivity'].unit,
        },
        {
          label: makeLabel('prandtlNumber'),
          value: (p) => _.get(p, 'tubeSideFluidProperty.prandltNumber'),
          unit: fieldDefs['prandtlNumber'].unit,
        },
        'fluidVelocity',
        'tubeReynold',
        'nusseltNumber',
      ],
    },
    {
      title: 'Physical dimension',
      fields: [
        'pitchRatio',
        'tubeLength',
        'maxTubeLength',
        'tubeLayout',
        'tubePass',
        'tubeMaterialK',
        'tubeInnerDiameter',
        'tubeOuterDiameter',
      ],
    },
    {
      title: 'Overall Heat Transfer Coefficient',
      fields: [
        'overallHeatTransferCoeffKern',
        'overallHeatTransferCoeffKernClean',
        'overallHeatTransferCoeffBD',
        'overallHeatTransferCoeffBDClean',
      ],
    },
    {
      title: 'Surface Overdesign',
      fields: [
        'shellSideHeatTransferArea',
        'shellSideHeatTransferAreaClean',
        'surfaceOverDesign',
      ],
    },
  ],

  sizing: [
    {
      title: 'Sizing Analysis Calculation',
      fields: [
        'surfaceOverDesign',
        'overallHeatTransferCoeff',
        'shellSideHeatTransferArea',
        'tubeLength',
        'shellDiameter',
      ],
    },
    {
      title: 'Crossflow Pressure Drop',
      fields: [
        'numberOfTubeRowCrossingBaffleTip',
        'pressureDropForIdealTubeBank',
        'pressureDropInInteriorCrossflowSection',
      ],
    },
    {
      title: 'Window Pressure Drop',
      fields: [
        'bypassChannelDiametralGap',
        'numberOfTubeRowCrossingWindowArea',
        'grossWindowFlowArea',
        'areaOccupiedByNtwTubes',
        'netFlowAreaInWindow',
        'pressureDropInWindow',
      ],
    },
    {
      title: 'First & Last Baffle Compartment Pressure Drop',
      fields: ['pressureDropInEntranceAndExit'],
    },
    {
      title: 'Total Shell-Side Pressure Drop',
      fields: ['shellSidePressureDropTotal'],
    },
    {
      title: 'Flow-Induced Vibration Check',
      fields: [
        'tubeUnsupportedLength',
        'metalMassPerUnitLength',
        'longitudinalStress',
        'momentOfInertia',
        'clipplingLoad',
        'tubeMetalCrossSectionalArea',
        'axialTubeStressMultiplier',
        'tubeFluidMassPerUnitLength',
        'tubeFluidMassDisplacedPerUnitLength',
        'hydroDynamicMassPerUnitLength',
        'effectiveTubeMass',
        'naturalFrequency',
        'dampingConstant',
        'fluidElasticParameter',
        'criticalFlowVelocityFactor',
        'criticalFlowVelocity',
      ],
    },
  ],
}

const styles = `<style>
.table {
  width: 100%;
}
.tableTitle: {
  color: red;
  margin-top: 100px;
}
.numberCell {
  text-align: right;
}
.symbol {
  color: #555;
  font-size: 0.9em;
}
.row:nth-of-type(even) {
  background-color: #eee;
}
.parameterNameColumn {
  width: 60%;
}
.parameterValueColumn {
  width: 20%;
}
.parameterUnitColumn {
  width: 20%;
}
</style>`

export const generateHTML = (name, step, param, results) => {
  const tableDef = displayFields[step]
  const html = `<div>${styles}<h1>Report ${step}</h1>${tableDef
    .map(({ title, fields }) => table(title, fields, param))
    .join('\n')}</div>`
  return html
}

export default generateHTML
