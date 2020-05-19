import _ from 'lodash'
import React from 'react'
import { Button, Card, Icon, Text } from '@ui-kitten/components'
import { useFormikContext } from 'formik'
import LabeledText from '../../components/LabeledText'
import fieldDefs from '../../fieldDefs'
import makeHTMLReport from '../../makeHTMLReport'
import { formatNumber, prepareInput, outputTransform } from '../../utils'
import theme from '../../theme'
import { StyleSheet, View } from 'react-native'
import { printPDF, sharePDF } from '../../makePDF'
import { prelimFlow, ratingFlow } from '../../resultFlow'

export const ResultDisplay = () => {
  const formik = useFormikContext()

  const result = React.useMemo(() => {
    const input = { ...prepareInput(formik.values), recalculation: 0 }

    let result = prelimFlow(input)
    result = ratingFlow(result)

    return result
  }, [formik.values])

  const displayResult = React.useMemo(() => outputTransform(result), [result])

  const makeLabel = (fieldDefName) => {
    const fieldDef = fieldDefs[fieldDefName]
    return fieldDef
      ? (fieldDef.label || fieldDefName) +
          (fieldDef.unit ? ` (${fieldDef.unit})` : '')
      : fieldDefName
  }

  const makeChildValue = (name) => {
    const data = _.get(result, name)
    const fieldDef = fieldDefs[name]
    return typeof data === 'undefined'
      ? 'None'
      : typeof data === 'number' && fieldDef && fieldDef.unit
      ? formatNumber(data)
      : data
  }

  const makeProps = (name) => {
    return {
      label: makeLabel(name),
      children: makeChildValue(name),
    }
  }

  const handlePrintPDF = async () => {
    const html = makeHTMLReport('test', 'rating', result)
    await printPDF(html)
  }

  const handleSharePDF = async () => {
    const html = makeHTMLReport('test', 'rating', result)
    await sharePDF(html)
  }

  const acceptable = result.surfaceOverDesign <= 1 + result.maxSurfaceOverDesign

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
      <Text category="h5">Shell-Side</Text>
      <LabeledText label={makeLabel('dynamicViscosity')}>
        {makeChildValue('shellSideFluidProperty.dynamicViscosity')}
      </LabeledText>
      <LabeledText label={makeLabel('density')}>
        {makeChildValue('shellSideFluidProperty.density')}
      </LabeledText>
      <LabeledText label={makeLabel('specificHeatCapacity')}>
        {makeChildValue('shellSideFluidProperty.specificHeat')}
      </LabeledText>
      <LabeledText label={makeLabel('thermalConductivity')}>
        {makeChildValue('shellSideFluidProperty.thermalConductivity')}
      </LabeledText>
      <LabeledText label={makeLabel('prandtlNumber')}>
        {makeChildValue('shellSideFluidProperty.prandltNumber')}
      </LabeledText>
      <LabeledText label={makeLabel('massVelocity')}>
        {makeChildValue('shellMassVelocity')}
      </LabeledText>

      <LabeledText {...makeProps('shellReynold')} />

      <Text category="h5">Tube-Side</Text>
      <LabeledText label={makeLabel('dynamicViscosity')}>
        {makeChildValue('tubeSideFluidProperty.dynamicViscosity')}
      </LabeledText>
      <LabeledText label={makeLabel('density')}>
        {makeChildValue('tubeSideFluidProperty.density')}
      </LabeledText>
      <LabeledText label={makeLabel('specificHeatCapacity')}>
        {makeChildValue('tubeSideFluidProperty.specificHeat')}
      </LabeledText>
      <LabeledText label={makeLabel('thermalConductivity')}>
        {makeChildValue('tubeSideFluidProperty.thermalConductivity')}
      </LabeledText>
      <LabeledText label={makeLabel('prandtlNumber')}>
        {makeChildValue('tubeSideFluidProperty.prandltNumber')}
      </LabeledText>
      <LabeledText label={makeLabel('fluidVelocity')}>
        {makeChildValue('fluidVelocity')}
      </LabeledText>

      <LabeledText {...makeProps('tubeReynold')} />
      <LabeledText {...makeProps('nusseltNumber')} />

      <Text category="h5">Overall Heat Transfer Coefficient</Text>
      <LabeledText {...makeProps('overallHeatTransferCoeffKern')} />
      <LabeledText {...makeProps('overallHeatTransferCoeffKernClean')} />
      <LabeledText {...makeProps('overallHeatTransferCoeffBD')} />
      <LabeledText {...makeProps('overallHeatTransferCoeffBDClean')} />

      <Text category="h5">Surface Overdesign</Text>

      <LabeledText {...makeProps('shellSideHeatTransferArea')} />
      <LabeledText {...makeProps('shellSideHeatTransferAreaClean')} />
      <LabeledText {...makeProps('surfaceOverDesign')} />

      <Text appearance="hint">Result:</Text>
      {acceptable ? (
        <Text status="success">Acceptable</Text>
      ) : (
        <Text status="danger">Unacceptable</Text>
      )}
      {!acceptable && <Text>Surface Overdesign exceed max value</Text>}
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
