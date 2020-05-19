import * as React from 'react'
import { Text, styled } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'

const themed = source => {
  return {
    label: {
      color: source.labelColor,
      fontSize: source.labelFontSize,
      lineHeight: source.labelLineHeight,
      marginBottom: source.labelMarginBottom,
      fontWeight: source.labelFontWeight,
    },
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
    // padding: 16,
  },
  label: {
    marginBottom: 4,
    color: 'rgba(0,0,0,0.6)',
  },
})

const LabeledText = ({ label, children, themedStyle }) => {
  const themeds = themed(themedStyle)

  return (
    <View style={styles.container}>
      <Text style={[styles.label, themeds.label]}>{label}</Text>
      <Text>{children}</Text>
    </View>
  )
}
LabeledText.styledComponentName = 'Input'

const StyledLabeledText = styled(LabeledText)

export default StyledLabeledText
