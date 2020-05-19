import _ from 'lodash'
import React from 'react'
import { Button, Card, Icon, Text } from '@ui-kitten/components'
import { useFormikContext } from 'formik'
import LabeledText from '../../components/LabeledText'
import * as eq from '../../equations'
import meq from '../../memoeq'
import fieldDefs from '../../fieldDefs'
import makeHTMLReport from '../../makeHTMLReport'
import { formatNumber, prepareInput, outputTransform } from '../../utils'
import theme from '../../theme'
import { StyleSheet, View } from 'react-native'
import { printPDF, sharePDF } from '../../makePDF'
import {
  prelimFlow,
  ratingFlow,
  sizingFlow,
  odReflow,
  pressureDropReflow,
} from '../../resultFlow'

export const ResultDisplay = () => {
  const formik = useFormikContext()

  const parsedData = React.useMemo(() => {
    const input = { ...prepareInput(formik.values), recalculation: 0 }

    let result = prelimFlow(input)
    result = ratingFlow(result)
    if (result.surfaceOverDesign > 1 + input.maxSurfaceOverDesign) {
      result = odReflow(result)
    }
    result = sizingFlow(result)

    if (
      !Number.isNaN(input.maxPressureDrop) &&
      meq.shellSidePressureDropTotal(result) > input.maxPressureDrop
    ) {
      result = pressureDropReflow(result)
    }

    return outputTransform(result)
  }, [formik.values])

  const makeProps = (name) => {
    const data = parsedData[name]
    const fieldDef = fieldDefs[name]
    return {
      label: fieldDef
        ? (fieldDef.label || name) +
          (fieldDef.unit ? ` (${fieldDef.unit})` : '')
        : name,
      children:
        typeof parsedData[name] === 'undefined'
          ? 'None'
          : typeof parsedData[name] === 'number' && fieldDef && fieldDef.unit
          ? formatNumber(data)
          : data,
    }
  }

  const handlePrintPDF = async () => {
    const html = makeHTMLReport('test', 'sizing', parsedData)
    await printPDF(html)
  }

  const handleSharePDF = async () => {
    const html = makeHTMLReport('test', 'sizing', parsedData)
    await sharePDF(html)
  }

  return (
    <Card
      style={[theme.cardShadow, theme.marginVertical]}
      footer={() => (
        <View style={styles.resultCardFooter}>
          <Button
            onPress={handlePrintPDF}
            icon={(s) => <Icon name="printer" {...s} />}>
            Print
          </Button>
          <Button
            onPress={handleSharePDF}
            icon={(s) => <Icon name="share" {...s} />}>
            Share
          </Button>
        </View>
      )}>
      <LabeledText {...makeProps('surfaceOverDesign')} />
      <LabeledText {...makeProps('overallHeatTransferCoeff')} />
      <LabeledText {...makeProps('shellSideHeatTransferArea')} />
      <LabeledText {...makeProps('tubeLength')} />
      <LabeledText {...makeProps('shellDiameter')} />
      <LabeledText {...makeProps('shellMassVelocity')} />
      <LabeledText {...makeProps('shellReynold')} />

      <Text category="h5">Shell-Side Pressure Drop</Text>

      <Text category="h6">Crossflow Pressure Drop</Text>
      <LabeledText {...makeProps('numberOfTubeRowCrossingBaffleTip')} />
      <LabeledText {...makeProps('pressureDropForIdealTubeBank')} />
      <LabeledText {...makeProps('pressureDropInInteriorCrossflowSection')} />

      <Text category="h6">Window Pressure Drop</Text>
      <LabeledText {...makeProps('bypassChannelDiametralGap')} />
      <LabeledText {...makeProps('numberOfTubeRowCrossingWindowArea')} />
      <LabeledText {...makeProps('grossWindowFlowArea')} />
      <LabeledText {...makeProps('areaOccupiedByNtwTubes')} />
      <LabeledText {...makeProps('netFlowAreaInWindow')} />
      <LabeledText {...makeProps('pressureDropInWindow')} />

      <Text category="h6">First & Last Baffle Compartment Pressure Drop</Text>
      <LabeledText {...makeProps('pressureDropInEntranceAndExit')} />

      <Text category="h6">Total Shell-Side Pressure Drop</Text>
      <LabeledText {...makeProps('shellSidePressureDropTotal')} />

      <Text category="h5">Flow-Induced Vibration Check</Text>
      <LabeledText {...makeProps('tubeUnsupportedLength')} />
      <LabeledText {...makeProps('metalMassPerUnitLength')} />
      <LabeledText {...makeProps('longitudinalStress')} />
      <LabeledText {...makeProps('momentOfInertia')} />
      <LabeledText {...makeProps('clipplingLoad')} />
      <LabeledText {...makeProps('tubeMetalCrossSectionalArea')} />
      <LabeledText {...makeProps('axialTubeStressMultiplier')} />
      <LabeledText {...makeProps('tubeFluidMassPerUnitLength')} />
      <LabeledText {...makeProps('tubeFluidMassDisplacedPerUnitLength')} />
      <LabeledText {...makeProps('hydroDynamicMassPerUnitLength')} />
      <LabeledText {...makeProps('effectiveTubeMass')} />
      <LabeledText {...makeProps('naturalFrequency')} />
      <LabeledText {...makeProps('dampingConstant')} />
      <LabeledText {...makeProps('fluidElasticParameter')} />
      <LabeledText {...makeProps('criticalFlowVelocityFactor')} />
      <LabeledText {...makeProps('criticalFlowVelocity')} />
    </Card>
  )
}

const styles = StyleSheet.create({
  resultCardFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
})

export default ResultDisplay
