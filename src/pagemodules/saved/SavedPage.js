import * as React from 'react'
import { AppLoading } from 'expo'

import { Button, Icon, List, ListItem, Text } from '@ui-kitten/components'

import { formatDistanceToNow } from 'date-fns'
import * as FileSystem from 'expo-file-system'
import * as configs from '../../configs'
import DialogPrompt from '../../components/DialogPrompt'
import { useNavigation } from '@react-navigation/native'
import AppLayout from '../../components/AppLayout'
import { StyleSheet } from 'react-native'

const stepMap = {
  preliminary: 'Preliminary Analysis',
  rating: 'Rating Analysis',
  sizing: 'Sizing Analysis',
}

const dirPath = FileSystem.documentDirectory + configs.saveDir + '/'

const ThashItem = (style) => <Icon {...style} name="trash" />

const DeleteHandlerContext = React.createContext(null)

const renderItemAccessory = (style) => (
  <DeleteHandlerContext.Consumer>
    {(handleDelete) => (
      <Button
        style={style}
        status="danger"
        onPress={handleDelete}
        appearance="ghost"
        icon={ThashItem}
      />
    )}
  </DeleteHandlerContext.Consumer>
)

export const SavedItem = ({ fileName, onDelete }) => {
  const match = fileName.match('^([^_]+)_(.+).json$')
  const [, step, name] = match

  const navigation = useNavigation()
  const [fileInfo, setFileInfo] = React.useState()
  React.useEffect(() => {
    let isCurrent = true

    ;(async () => {
      const filePath = dirPath + fileName
      const fileInfo = await FileSystem.getInfoAsync(filePath)
      console.log(fileInfo)
      setFileInfo(fileInfo)
    })()
    return () => {
      isCurrent = false
    }
  }, [fileName])
  if (!match) return null

  const handlePress = async () => {
    console.log(fileName)
    const filePath = dirPath + fileName
    const json = await FileSystem.readAsStringAsync(filePath)
    const data = JSON.parse(json)

    navigation.navigate(stepMap[step], { loadedData: data, savedName: name })
  }

  const handleDelete = async () => {
    const confirm = await DialogPrompt.openDialog({
      title: 'Confirm delete',
      description: 'Are you sure you want to delete ' + name + '?',
      confirmLabel: 'Delete',
    })
    if (confirm) {
      const filePath = dirPath + fileName
      await FileSystem.deleteAsync(filePath, { idempotent: true })
      onDelete()
    }
  }

  return (
    <DeleteHandlerContext.Provider value={handleDelete}>
      <ListItem
        title={name}
        description={[
          stepMap[step] || step,
          fileInfo &&
            fileInfo.modificationTime &&
            formatDistanceToNow(fileInfo.modificationTime * 1000, {
              addSuffix: true,
            }),
        ]
          .filter(Boolean)
          .join(', ')}
        accessory={renderItemAccessory}
        onPress={handlePress}></ListItem>
    </DeleteHandlerContext.Provider>
  )
}

const refreshFileList = async () => {
  const dirData = await FileSystem.getInfoAsync(dirPath)

  if (!dirData.exists) {
    callback([])
    return
  }

  const fileList = await FileSystem.readDirectoryAsync(dirPath)

  return fileList
}

export const SavedPage = () => {
  const [savedList, setSavedList] = React.useState(null)
  const [r, refresh] = React.useReducer((s) => !s)

  React.useEffect(() => {
    let isCurrent = true

    refreshFileList().then(setSavedList)
    return () => {
      isCurrent = false
    }
  }, [r])

  const renderItem = React.useCallback(
    ({ item }) => {
      const fileName = item

      return <SavedItem key={fileName} fileName={fileName} onDelete={refresh} />
    },
    [refresh],
  )

  return (
    <AppLayout title="Saved">
      {savedList ? (
        savedList.length > 0 ? (
          <List
            data={savedList}
            keyExtractor={(s) => s}
            renderItem={renderItem}
            renderRow={renderItem}
          />
        ) : (
          <Text style={styles.noSaved}>No saved</Text>
        )
      ) : (
        <AppLoading />
      )}
    </AppLayout>
  )
}

const styles = StyleSheet.create({
  noSaved: {
    textAlign: 'center',
    margin: 24,
  },
})

export default SavedPage
