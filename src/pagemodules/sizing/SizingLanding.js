import * as React from 'react'
import _ from 'lodash'
import { StyleSheet } from 'react-native'
import { Text, Layout } from '@ui-kitten/components'
import SaveButton from '../../components/SaveButton'
import ResultDisplay from './ResultDisplay'
import { Formik } from 'formik'
import { ScrollView } from 'react-native-gesture-handler'
import AppLayout from '../../components/AppLayout'
import theme from '../../theme'
import { defaultInput } from '../../defualtValues'
import ErrorBoundary from '../../components/ErrorBoundary'

export const SizingLanding = ({
  savedName = '',
  route,
  initialValues = defaultInput,
}) => {
  let time = 0

  if (
    route &&
    route.params &&
    (route.params.loadedData || route.params.values)
  ) {
    initialValues = route.params.loadedData || route.params.values
    savedName = route.params.savedName
    time = route.params.time
  }

  const cleanValues = React.useMemo(
    () => ({ ...defaultInput, ...initialValues }),
    [initialValues],
  )

  return (
    <AppLayout title="Sizing Analysis">
      <Formik key={savedName + time} initialValues={cleanValues}>
        <ScrollView>
          <Layout style={theme.container} level="2">
            <Text style={theme.marginVertical} appearance="hint" category="h5">
              Result
            </Text>
            <ErrorBoundary>
              <ResultDisplay />
            </ErrorBoundary>
            <ErrorBoundary>
              <SaveButton
                style={theme.marginVertical}
                step="sizing"
                initialName={savedName}
              />
            </ErrorBoundary>
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

export default SizingLanding
