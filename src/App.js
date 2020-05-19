import React from 'react'
import { Card, Text, Layout } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import theme from './theme'
import AppLayout from './components/AppLayout'

export default function App({ navigation }) {
  return (
    <AppLayout title="Home">
      <Layout level="4"style={theme.container}>
        <Card
          style={styles.card}
          onPress={() => {
            navigation.navigate('Preliminary Analysis')
          }}>
          <Text category="h6">Preliminary Analysis</Text>
        </Card>
        <Card style={[styles.card, styles.disabledCard]} disabled>
          <Text appearance="hint" category="h6">
            Rating Analysis
          </Text>
        </Card>
        <Card style={[styles.card, styles.disabledCard]} disabled>
          <Text appearance="hint" category="h6">
            Sizing Analysis
          </Text>
        </Card>
        <Card
          style={styles.card}
          onPress={() => {
            navigation.navigate('Saved')
          }}>
          <Text category="h6">Saved document</Text>
        </Card>
      </Layout>
    </AppLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  card: {
    marginTop: 16,
    marginBottom: 8,
    elevation: 8,
  },
  disabledCard: {
    backgroundColor: '#f7f7f7',
    shadowOpacity: 0.3,
  },
})
