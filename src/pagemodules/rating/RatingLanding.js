import * as React from 'react'
import _ from 'lodash'
import { StyleSheet } from 'react-native'
import { Button, Text, Layout } from '@ui-kitten/components'
import SaveButton from '../../components/SaveButton'
import ResultDisplay from './ResultDisplay'
import { Formik, useFormikContext } from 'formik'
import { ScrollView } from 'react-native-gesture-handler'
import AppLayout from '../../components/AppLayout'
import theme from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { defaultInput } from '../../defualtValues'
import renderIcon from '../../components/renderIcon'
import ErrorBoundary from '../../components/ErrorBoundary'

const NextStepButton = ({ style }) => {
  const formik = useFormikContext()
  const navigation = useNavigation()
  const handleClick = () => {
    navigation.navigate({
      name: 'Sizing Analysis',
      params: { values: formik.values, savedName: '', time: Date.now() },
    })
  }

  return (
    <Button
      style={style}
      onPress={handleClick}
      icon={renderIcon('arrowhead-right')}>
      To Sizing Analysis
    </Button>
  )
}

export const RatingLanding = ({
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
    <AppLayout title="Rating Analysis">
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
                step="rating"
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

export default RatingLanding
