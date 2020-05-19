import * as React from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Image, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, Icon } from '@ui-kitten/components'
export const ImageView = ({ route, navigation }) => {
  const { images } = route.params

  return (
    <View style={styles.root}>
      <ImageViewer
        enableSwipeDown
        onCancel={navigation.goBack}
        imageUrls={images}
        renderIndicator={images.length > 1 ? undefined : () => null}
      />
      <Button
        onPress={navigation.goBack}
        style={styles.closeButton}
        icon={(s) => <Icon {...s} name="close" />}
        status="basic"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#111',
    height: '100%',
    display: 'flex',
    position: 'relative',
  },
  zoom: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.5,
  },
})

export default ImageView
