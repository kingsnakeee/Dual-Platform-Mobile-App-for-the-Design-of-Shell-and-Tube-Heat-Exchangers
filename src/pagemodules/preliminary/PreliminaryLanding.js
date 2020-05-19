import * as React from 'react'
import _ from 'lodash'
import { StyleSheet } from 'react-native'
import { Text, Button, Layout, Icon } from '@ui-kitten/components'
import SaveButton from '../../components/SaveButton'
import InputForm from './InputForm'
import ResultDisplay from './ResultDisplay'
import { Formik, useFormikContext } from 'formik'
import { ScrollView } from 'react-native-gesture-handler'
import AppLayout from '../../components/AppLayout'
import theme from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { defaultInput } from '../../defualtValues'
import ErrorBoundary from '../../components/ErrorBoundary'
const NextStepButton = ({ style }) => {
  const formik = useFormikContext()
  const navigation = useNavigation()
  const handleClick = () => {
    navigation.navigate({
      name: 'Rating Analysis',
      params: { values: formik.values, savedName: '', time: Date.now() },
    })
  }

  return (
    <Button
      style={style}
      onPress={handleClick}
      icon={(s) => <Icon name="arrowhead-right" {...s} />}>
      To Rating Analysis
    </Button>
  )
}

export const PreliminaryLanding = ({
  savedName = '',
  route,
  initialValues = defaultInput,
}) => {
  if (route && route.params && route.params.loadedData) {
    initialValues = route.params.loadedData
    savedName = route.params.savedName
  }

  const cleanValues = React.useMemo(
    () => ({ ...defaultInput, ...initialValues }),
    [initialValues],
  )

  return (
    <AppLayout title="Preliminary Analysis">
      <Formik key={savedName} initialValues={cleanValues}>
        <ScrollView>
          <Layout style={theme.container} level="4">
            <ErrorBoundary>
              <InputForm />
            </ErrorBoundary>
            <Text style={theme.marginVertical} appearance="hint" category="h5">
              Result
            </Text>
            <ErrorBoundary>
              <ResultDisplay />
            </ErrorBoundary>
            <ErrorBoundary>
              <SaveButton
                style={theme.marginVertical}
                step="preliminary"
                initialName={savedName}
              />
            </ErrorBoundary>
            <NextStepButton style={theme.marginVertical} />
          </Layout>
        </ScrollView>
      </Formik>
    </AppLayout>
  )
}

const styles = StyleSheet.create({
  layout: {
    // height: 400
  },
})

export default PreliminaryLanding
