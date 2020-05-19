import * as React from 'react'
import theme from '../theme'
import { Card, CardHeader, Icon, Layout } from '@ui-kitten/components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'

const ExpansionPanel = ({ children, open, head, ...props }) => {
  const [internalOpen, setOpen] = React.useState(open)

  const finalOpen = typeof open === 'undefined' ? internalOpen : open

  const handleHeadPress = () => {
    setOpen(s => !s)
  }

  const Header = () => {
    return (
      <TouchableOpacity onPress={handleHeadPress} style={styles.head}>
        <View style={[styles.headContent, finalOpen ? null : styles.closed]}>
          {head}
        </View>
        <View style={[styles.headButton, finalOpen ? null : styles.closed]}>
          <Icon
            width={32}
            height={32}
            fill="#3366FF"
            name={finalOpen ? 'chevron-up' : 'chevron-down'}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Card
      {...props}
      style={[finalOpen ? null : styles.closed]}
      disabled
      header={finalOpen ? Header : undefined}>
      {finalOpen ? children : <Header />}
    </Card>
  )
}

const styles = StyleSheet.create({
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headContent: {
    padding: 24,
    flexGrow: 1,
  },
  headButton: {
    paddingRight: 24,
  },
  closed: {
    padding: 0,
    paddingRight: 0,
  },
})

ExpansionPanel.Body = ({ children }) => {
  return <>{children}</>
}

export default ExpansionPanel
