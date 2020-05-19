export const fieldNames = [
  'shellSideFluidType',
  'shellSideFluidProperty',
  'shellSideMassFlowRate',
  'shellDiameter',
  'shellSideInTemp',
  'shellSideOutTemp',
  'shellSideFoulingResistance',
  'tubeSideFluidType',
  'tubeSideMassFlowRate',
  'tubeSideInTemp',
  'tubeSideOutTemp',
  'tubeSideFoulingResistance',
  'numberOfTubes',
  'tubeLength',
  'maxTubeLength',
  'tubeOuterDiameter',
  'tubeInnerDiameter',
  'pitchLength',
  'tubePass',
  'tubeLayout',
  'baffleSpacing',
  'baffleCutPercent',
  'bundleCrossflowArea',
  'areaOfBaffleWindow',
  'tubeMaterialK',
  'overallHeatTransferCoeff',
  'requiredNumberOfTubes',
  'shellSidePressureDrop',
  'tubeSidePressureDrop',
]
export const fluidTypeDisplayTransform = (type) => {
  switch (type) {
    case 'water':
      return 'Raw Water'
    case 'saturatedwater':
      return 'Condensed Pure Water'
    default:
      return type
  }
}
const units = { squereMeter: 'm²' }
export const mechanicalDesignLabel = {
  bothEndSupported: 'Both end supported',
  oneFixedOneSupported: 'One end fixed and one end supported',
  bothEndFixed: 'Both end fixed',
}

export const materialDefs = {
  carbonSteel: {
    label: 'Carbon Steel',
    thermalConductivity: 60,
  },
}

export const fieldDefs = {
  shellSideFluidType: {
    label: 'Shell side fluid type',
    displayTransform: fluidTypeDisplayTransform,
  },
  shellSideMassFlowRate: {
    label: 'Shell Side Mass Flow Rate',
    unit: 'Kg/hr',
  },
  shellDiameter: {
    symbol: 'D_s',
    label: 'Shell Inner Diameter',
    unit: 'm',
  },
  shellSideInTemp: {
    label: 'Shell Side Inlet Temperature',
    unit: '°c',
  },
  shellSideOutTemp: {
    label: 'Shell Side Outlet Temperature',
    unit: '°c',
  },
  shellSideFoulingResistance: {
    label: 'Fouling Resistance',
    unit: 'm²K/W',
  },
  tubeSideFluidType: {
    label: 'Tube side fluid type',
    displayTransform: fluidTypeDisplayTransform,
  },
  tubeSideMassFlowRate: {
    label: 'Tube side mass flow rate',
    unit: 'Kg/hr',
  },
  tubeSideInTemp: {
    label: 'Tube side inlet temperature',
    unit: '°c',
  },
  tubeSideOutTemp: {
    label: 'Tube side outlet temperature',
    unit: '°c',
  },
  tubeSideFoulingResistance: {
    label: 'Tube side fouling resistance',
    unit: '%',
  },
  tubeSideFluidMaxVelocity: {
    label: 'Maximum Allowable TS Fluid Velocity',
    unit: 'm/s',
    symbol: 'V_max',
  },
  numberOfTubes: {
    symbol: 'N_t',
    label: 'Number of tubes',
  },
  numberOfTubeRowCrossingBaffleTip: {
    symbol: 'N_tec',
    label: 'Number of tube rows crossing baffle tip',
  },
  numberOfTubeRowCrossingWindowArea: {
    symbol: 'N_tcw',
    label: 'Number of tube rows crossing in the window area',
  },
  tubeLength: {
    symbol: 'L',
    label: 'Tube length',
    unit: 'm',
  },
  surfaceOverDesign: {
    symbol: 'OD',
    label: 'Surface over design',
    unit: '%',
    displayTransform: (v) => (v - 1) * 100,
  },
  maxTubeLength: {
    symbol: 'L_m',
    label: 'Maximum tube length',
    unit: 'm',
  },
  tubeOuterDiameterInch: {
    symbol: 'd_o',
    label: 'Tube outer diameter',
    unit: 'inches',
    displayTransform: (v) => `${v} (${(v * 0.0254).toPrecision(3)}m)`,
  },
  tubeOuterDiameter: {
    symbol: 'd_o',
    label: 'Tube outer diameter',
    unit: 'm',
  },
  tubeInnerDiameterInch: {
    symbol: 'd_i',
    label: 'Tube inner diameter',
    unit: 'inches',
    displayTransform: (v) => `${v} (${(v * 0.0254).toPrecision(3)}m)`,
  },
  tubeInnerDiameter: {
    symbol: 'd_i',
    label: 'Tube inner diameter',
    unit: 'm',
  },
  pitchLength: {
    symbol: 'P_t',
    label: 'Tube Pitch',
    unit: 'm',
  },
  pitchRatio: {
    symbol: 'P_R',
    label: 'Pitch Ratio',
  },
  tubePass: {
    label: 'Tube passes',
  },
  tubeLayout: {
    label: 'Tube Layout Angle',
    displayTransform: (v) => v + '°',
  },
  baffleSpacing: {
    label: 'Baffle spacing',
    unit: 'm',
  },
  baffleCutPercent: {
    label: 'Baffle cut percent',
    unit: '%',
  },
  bundleCrossflowArea: {
    symbol: 'A_s',
    label: 'Bundle cross flow area',
    unit: units.squereMeter,
  },
  areaOfBaffleWindow: {
    label: 'Area of baffle window',
    unit: units.squereMeter,
  },
  tubeMaterialK: {
    label: 'Tube thermal conductivity',
    unit: 'W/m⋅K',
  },
  overallHeatTransferCoeff: {
    symbol: 'U_f',
    label: 'Overall Heat Transfer Coefficient(Fouled)',
    unit: 'W/m²⋅K',
  },
  overallHeatTransferCoeffClean: {
    symbol: 'U_c',
    label: 'Overall heat transfer coefficient(Clean)',
    unit: 'W/m²⋅K',
  },
  overallHeatTransferCoeffKern: {
    symbol: 'U_f',
    label: 'Overall Heat Transfer Coefficient(Fouled)(Kern Method)',
    unit: 'W/m²⋅K',
  },
  overallHeatTransferCoeffKernClean: {
    symbol: 'U_c',
    label: 'Overall heat transfer coefficient(Clean)(Kern Method)',
    unit: 'W/m²⋅K',
  },
  overallHeatTransferCoeffBD: {
    symbol: 'U_f',
    label: 'Overall Heat Transfer Coefficient(Fouled)(Bell-Delaware Method)',
    unit: 'W/m²⋅K',
  },
  overallHeatTransferCoeffBDClean: {
    symbol: 'U_c',
    label: 'Overall heat transfer coefficient(Clean)(Bell-Delaware Method)',
    unit: 'W/m²⋅K',
  },
  logMeanTempDiff: {
    label: 'LMTD',
    symbol: '∆T_m',
    unit: '°c',
  },
  shellSidePressureDrop: {
    symbol: 'P_s',
    label: 'Shell side pressure drop',
    unit: 'psi',
  },
  foulingResistance: {
    symbol: 'R_ft',
    label: 'Fouling resistance',
    unit: '%',
  },
  shellSideHeatTransferArea: {
    symbol: 'A_f',
    label: 'Fouled Area of Heat Transfer',
    unit: units.squereMeter,
  },
  shellSideHeatTransferAreaClean: {
    symbol: 'A_c',
    label: 'Clean Area of Heat Transfer',
    unit: units.squereMeter,
  },
  tubeSidePressureDrop: {
    symbol: '∆P_t',
    label: 'Tube side pressure drop',
    unit: 'psi',
  },
  pressureDropInNozzles: {
    symbol: '∆P_i',
    label: 'Pressure drop in the nozzles',
    unit: 'Pa',
  },
  pressureDropForIdealTubeBank: {
    symbol: '∆P_bi',
    label: 'Ideal tube bank pressure drop',
    unit: 'Pa',
  },
  pressureDropInInteriorCrossflowSection: {
    symbol: '∆P_c',
    label: 'Pressure drop in the interior crossflow section',
    unit: 'Pa',
  },
  pressureDropInEntranceAndExit: {
    symbol: '∆P_e',
    label: 'Pressure drop in the entrance and exit section',
    unit: 'Pa',
  },
  netFlowAreaInWindow: {
    symbol: 'A_w',
    label: 'Net flow area in the window',
    unit: units.squereMeter,
  },
  pressureDropInWindow: {
    symbol: '∆P_w',
    label: 'Window pressure drop',
    unit: 'Pa',
  },
  maxPressureDrop: {
    label: 'Maximum Allowable Total Pressure Drop',
    unit: 'Pa',
  },
  grossWindowFlowArea: {
    symbol: 'A_wg',
    label: 'Gross window flow area w/o tubes',
    unit: units.squereMeter,
  },
  shellSidePressureDropTotal: {
    symbol: '∆P_total',
    label: 'Total pressure drop',
    unit: 'Pa',
  },
  bypassChannelDiametralGap: {
    symbol: 'L_bb',
    label: 'Bypass channel diametral gap',
    unit: 'm',
  },
  areaOccupiedByNtwTubes: {
    symbol: 'A_wt',
    label: 'Area occupied by N_tw tubes in the window',
    unit: units.squereMeter,
  },
  tubeUnsupportedLength: {
    label: 'Tube unsupported length',
    unit: 'm',
  },
  tubeYoungModulus: {
    label: "Tube Young's modulus",
    unit: 'N/m²',
  },
  longitudinalStress: {
    label: 'Tube longitudinal stress',
    unit: 'MPa',
  },
  addedMassCoefficient: {
    label: 'Added mass coefficient',
  },
  metalMassPerUnitLength: {
    label: 'Metal mass per unit length',
    unit: 'kg/m',
  },
  momentOfInertia: { label: 'Moment of inertia', unit: 'm⁴', symbol: 'I' },
  clipplingLoad: { label: 'Crippling load', unit: 'N', symbol: 'F_CR' },
  tubeMetalCrossSectionalArea: {
    label: 'Tube metal cross-sectional area',
    unit: units.squereMeter,
    symbol: 'A_t',
  },
  axialTubeStressMultiplier: {
    label: 'Tube axial stress multiplier(Dimentionless)',
    symbol: 'S',
  },
  tubeFluidMassPerUnitLength: {
    label: 'Tube fluid mass per unit length',
    unit: 'kg/m',
    symbol: 'm_fi',
  },
  tubeFluidMassDisplacedPerUnitLength: {
    label: 'Tube fluid mass displaced per unit length',
    unit: 'kg/m',
    symbol: 'm_fo',
  },
  hydroDynamicMassPerUnitLength: {
    label: 'Hydrodynamic mass per unit length',
    unit: 'kg/m',
    symbol: 'H_m',
  },
  effectiveTubeMass: {
    label: 'Effective tube mass per unit length',
    unit: 'kg/m',
    symbol: 'm_o',
  },
  naturalFrequency: {
    label: 'Natural frequency of heat exchanger',
    unit: 'Hz',
    symbol: 'f_n',
  },
  dampingConstant: { label: 'Damping constant', symbol: 'δ_t' },
  fluidElasticParameter: { label: 'Fluid elastic parameter', symbol: 'x' },
  criticalFlowVelocityFactor: {
    label: 'Critical flow velocity factor',
    symbol: 'D',
  },
  criticalFlowVelocity: {
    label: 'Critical flow velocity',
    unit: 'm/s',
    symbol: 'V_c',
  },
  mechanicalDesign: {
    label: 'Mechanical Design',
    displayTransform: (type) => mechanicalDesignLabel[type],
  },
  tubeMaterial: {
    label: 'Tube Material',
    displayTransform: (type) =>
      `${materialDefs[type].label} K=${materialDefs[type].thermalConductivity}`,
  },
  heatDuty: {
    label: 'Heat Duty',
    unit: 'W',
  },
  dynamicViscosity: {
    label: 'Dynamic Viscosity',
    unit: 'Pa·s',
    symbol: 'μ',
  },
  density: {
    label: 'Density',
    unit: 'kg/m³',
    symbol: 'ρ',
  },
  specificHeatCapacity: {
    label: 'Specific Heat Capacity',
    unit: 'J/kg·K',
    symbol: 'C_p',
  },
  thermalConductivity: {
    label: 'Thermal Conduc',
    unit: 'W/m·K',
    symbol: 'k',
  },
  prandtlNumber: {
    label: 'Prandtl Number',
    symbol: 'Pr',
  },
  massVelocity: {
    label: 'Mass Velocity',
    unit: 'kg/s·m²',
    symbol: 'G',
  },
  shellMassVelocity: {
    label: 'Mass Velocity',
    unit: 'kg/s·m²',
    symbol: 'G_s',
  },
  reynoldNumber: {
    label: 'Reynold Number',
    symbol: 'Re',
  },
  tubeReynold: {
    label: 'Reynold Number',
    symbol: 'Re_t',
  },
  shellReynold: {
    label: 'Reynold Number',
    symbol: 'Re_s',
  },
  fluidVelocity: {
    label: 'Fluid Velocity',
    symbol: 'V_t',
    unit: 'm/s',
  },
  nusseltNumber: {
    label: 'Nusselt Number',
    unit: 'Nu',
  },
}

export default fieldDefs
