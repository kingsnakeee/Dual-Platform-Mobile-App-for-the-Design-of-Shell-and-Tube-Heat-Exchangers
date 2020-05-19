import React from 'react'
import { AppLoading } from 'expo'
import { SafeAreaView } from 'react-native'
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import * as Font from 'expo-font'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import {
  Drawer as UIKittenDrawer,
  DrawerHeaderFooter,
} from '@ui-kitten/components'
import { Ionicons } from '@expo/vector-icons'
import App from './App'
import Preliminary from './pagemodules/preliminary/PreliminaryLanding'
import Rating from './pagemodules/rating/RatingLanding'
import Sizing from './pagemodules/sizing/SizingLanding'
import SavedPage from './pagemodules/saved/SavedPage'
import DialogPrompt from './components/DialogPrompt'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import * as eva from '@eva-design/eva'
import ImageView from './components/ImageView'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const drawerData = [
  { title: 'Home' },
  { title: 'Preliminary Analysis' },
  { title: 'Rating Analysis', disabled: true },
  { title: 'Sizing Analysis', disabled: true },
  { title: 'Saved' },
]

const DrawerHeader = () => {
  return <DrawerHeaderFooter title=" " />
}
function CustomDrawerContent(props) {
  const { navigation, state } = props

  const stackState = state.routes[0].state

  const onSelect = (index) => {
    navigation.closeDrawer()
    if (stackState && stackState.index !== index) {
      stackState.index > 0 && navigation.dispatch(StackActions.popToTop())
      index > 0 &&
        navigation.dispatch(StackActions.push(stackState.routeNames[index]))
    }
  }

  return (
    <UIKittenDrawer
      data={drawerData}
      onSelect={onSelect}
      selectedIndex={(stackState && stackState.index) || 0}
      header={DrawerHeader}
    />
  )
}

export default function AppEntry() {
  const [isReady, setReady] = React.useState(false)
  React.useEffect(() => {
    ;(async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      })
    })().then(() => setReady(true))
  }, [])
  return isReady ? (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <DialogPrompt />
        <NavigationContainer backBehavior="none">
          <Drawer.Navigator drawerContent={CustomDrawerContent}>
            <Drawer.Screen name="entry">
              {() => (
                <Stack.Navigator initialRouteName="Home" headerMode="none">
                  <Stack.Screen name="Home" component={App} />
                  <Stack.Screen
                    name="Preliminary Analysis"
                    component={Preliminary}
                  />
                  <Stack.Screen name="Rating Analysis" component={Rating} />
                  <Stack.Screen name="Sizing Analysis" component={Sizing} />
                  <Stack.Screen name="Saved" component={SavedPage} />
                  <Stack.Screen name="ImageView" component={ImageView} />
                </Stack.Navigator>
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  ) : (
    <AppLoading />
  )
}
