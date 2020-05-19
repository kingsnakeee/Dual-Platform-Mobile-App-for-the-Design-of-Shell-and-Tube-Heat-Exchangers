import * as React from 'react'
import theme from '../theme'
import {
  useNavigationState,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  TopNavigation,
  Icon,
  Divider,
  Layout,
  TopNavigationAction,
} from '@ui-kitten/components'
import { SafeAreaView } from 'react-native-safe-area-context'

const MenuIcon = style => <Icon {...style} name="menu" />
const BackIcon = style => <Icon {...style} name="arrow-back" />

const AppLayout = ({ style, title, leftControl, children }) => {
  const backable = useNavigationState(
    state => (state.history && state.history.length > 1) || state.index > 0,
  )
  const navigation = useNavigation()

  return (
    <SafeAreaView style={[theme.flex1, style]}>
      <TopNavigation
        leftControl={
          backable ? (
            <TopNavigationAction onPress={navigation.goBack} icon={BackIcon} />
          ) : (
            <TopNavigationAction
              onPress={navigation.openDrawer}
              icon={MenuIcon}
            />
          )
        }
        title={title}
      />
      <Divider />
      <Layout level='4' style={[theme.flex1]}>{children}</Layout>
    </SafeAreaView>
  )
}

export default AppLayout
