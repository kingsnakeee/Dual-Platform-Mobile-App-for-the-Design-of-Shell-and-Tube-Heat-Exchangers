import _ from 'lodash'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Text, Card, Icon } from '@ui-kitten/components'
import { useFormikContext } from 'formik'
import LabeledText from '../../components/LabeledText'
import * as eq from '../../equations'
import fieldDefs, { materialDefs } from '../../fieldDefs'
import makeHTMLReport from '../../makeHTMLReport'
import { formatNumber, flow, prepareInput } from '../../utils'
import theme from '../../theme'
import { printPDF, sharePDF } from '../../makePDF'
import { prelimFlow } from '../../resultFlow'

export const ResultDisplay = () => {
  const formik = useFormikContext()

  const parsedData = React.useMemo(() => {
    const input = prepareInput(formik.values)
    return prelimFlow(input)
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
    const html = makeHTMLReport('test', 'preliminary', parsedData)
    await printPDF(html)
  }

  const handleSharePDF = async () => {
    const html = makeHTMLReport('test', 'preliminary', parsedData)
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
      <LabeledText {...makeProps('heatDuty')} />
      <LabeledText {...makeProps('shellSideOutTemp')} />

      <LabeledText {...makeProps('overallHeatTransferCoeff')} />
      <LabeledText {...makeProps('overallHeatTransferCoeffClean')} />
      <LabeledText {...makeProps('logMeanTempDiff')} />
      <LabeledText {...makeProps('shellSideHeatTransferArea')} />
      <LabeledText {...makeProps('shellSideHeatTransferAreaClean')} />

      <LabeledText {...makeProps('pitchLength')} />
      <LabeledText {...makeProps('tubeLength')} />

      <LabeledText {...makeProps('numberOfTubes')} />

      <LabeledText {...makeProps('shellDiameter')} />

      <LabeledText {...makeProps('baffleSpacing')} />
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
