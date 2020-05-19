import React from 'react'
import { Icon, TopNavigationAction } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'

const BackIcon = style => <Icon {...style} name="arrow-back" />

const BackButton = () => {
  const navigation = useNavigation()

  return <TopNavigationAction onPress={navigation.goBack} icon={BackIcon} />
}

export default BackButton
