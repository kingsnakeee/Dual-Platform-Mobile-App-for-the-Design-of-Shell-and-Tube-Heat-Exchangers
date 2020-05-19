import React from 'react'
import { View } from 'react-native'
import { Text, Button } from '@ui-kitten/components'
import { Field, useFormikContext } from 'formik'
import TextNumberInput from '../../components/TextNumberInput'
import ExpansionPanel from '../../components/ExpansionPanel'
import { data as tubeData } from '../../data/tubeSize'
import addedmasscoeff from '../../../assets/addedmasscoeff.jpg'
import fieldDefs, {
  fluidTypeDisplayTransform,
  mechanicalDesignLabel,
  materialDefs,
} from '../../fieldDefs'
import { formatNumber } from '../../utils'
import { useNavigation } from '@react-navigation/native'

const fluidTypeItems = [
  { value: 'water', text: fluidTypeDisplayTransform('water') },
  {
    value: 'saturatedwater',
    text: fluidTypeDisplayTransform('saturatedwater'),
  },
]

const outerDiameterSet = new Set()
const fractionReplaceMap = {
  '.25': '¼',
  '.5': '½',
  '.75': '¾',
}
const outerTubeDiameterItems = tubeData
  .filter((o) => {
    if (!outerDiameterSet.has(o.outerDiameterInch)) {
      outerDiameterSet.add(o.outerDiameterInch)
      return true
    }
  })
  .map((o) => ({
    text:
      String(o.outerDiameterInch).replace(
        /(\.(25|5|75))$/,
        (m, p) => fractionReplaceMap[p],
      ) + ` (${formatNumber(o.outerDiameterInch * 0.254)}m)`,
    value: String(o.outerDiameterInch),
  }))

const tubeMaterialItems = Object.keys(materialDefs).map((t) => ({
  text: fieldDefs.tubeMaterial.displayTransform(t),
  value: t,
}))

export const InputForm = () => {
  const formik = useFormikContext()

  const navigation = useNavigation()

  const innerTubeDiameterItems = React.useMemo(() => {
    return tubeData
      .filter(
        (o) => '' + o.outerDiameterInch === formik.values.tubeOuterDiameterInch,
      )
      .map((o) => ({
        text:
          String(o.innerDiameterInch).replace(
            /(\.(25|5|75))$/,
            (m, p) => fractionReplaceMap[p],
          ) + ` (${formatNumber(o.innerDiameterInch * 0.254)}m)`,
        value: String(o.innerDiameterInch),
      }))
  }, [formik.values.tubeOuterDiameterInch])

  const makeProps = (name) => {
    const fieldDef = fieldDefs[name]
    return {
      label: fieldDef
        ? (fieldDef.label || name) +
          (fieldDef.unit ? ` (${fieldDef.unit})` : '')
        : name,
      name,
    }
  }

  return (
    <View>
      <ExpansionPanel head={<Text>Shell-Side</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideFluidType')}
          select={fluidTypeItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideMassFlowRate')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideInTemp')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideFoulingResistance')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          optional
          {...makeProps('maxPressureDrop')}
        />
      </ExpansionPanel>
      <ExpansionPanel head={<Text>Tube-Side</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideFluidType')}
          select={fluidTypeItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideMassFlowRate')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideInTemp')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideOutTemp')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideFluidMaxVelocity')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeMaterial')}
          select={tubeMaterialItems}
        />
      </ExpansionPanel>
      <ExpansionPanel head={<Text>Physical Dimensions</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('pitchRatio')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeLayout')}
          select={[
            { text: '30°', value: '30' },
            { text: '45°', value: '45' },
            { text: '90°', value: '90' },
          ]}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('maxTubeLength')}
        />

        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubePass')}
          select={[
            { text: '1', value: '1' },
            { text: '2', value: '2' },
            { text: '4', value: '4' },
            { text: '6', value: '6' },
            { text: '8', value: '8' },
          ]}
        />

        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeOuterDiameterInch')}
          label={makeProps('tubeOuterDiameterInch').label}
          select={outerTubeDiameterItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeInnerDiameterInch')}
          label={makeProps('tubeInnerDiameterInch').label}
          select={innerTubeDiameterItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('baffleCutPercent')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideFoulingResistance')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('maxSurfaceOverDesign')}
        />
      </ExpansionPanel>
      <ExpansionPanel head={<Text>Flow-Induced Vibration Checks</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('mechanicalDesign')}
          select={[
            {
              value: 'bothEndSupported',
              text: mechanicalDesignLabel['bothEndSupported'],
            },
            {
              value: 'oneFixedOneSupported',
              text: mechanicalDesignLabel['oneFixedOneSupported'],
            },

            {
              value: 'bothEndFixed',
              text: mechanicalDesignLabel['bothEndFixed'],
            },
          ]}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeYoungModulus')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('addedMassCoefficient')}
        />
        <Button
          onPress={() =>
            navigation.navigate('ImageView', {
              images: [
                {
                  url: '',
                  props: {
                    // Or you can set source directory.
                    source: addedmasscoeff,
                  },
                },
              ],
            })
          }
          appearance="outline">
          View Graph Reference
        </Button>
      </ExpansionPanel>
    </View>
  )
}

export default InputForm
