import * as React from 'react'
import _ from 'lodash'
import { Button, Icon } from '@ui-kitten/components'
import { useFormikContext } from 'formik'
import * as FileSystem from 'expo-file-system'
import * as configs from '../configs'
import DialogPrompt from './DialogPrompt'

export const SaveButton = ({ step, initialName = 'anrm', onSaved, style }) => {
  const { values } = useFormikContext()

  const [savedName, setName] = React.useState(initialName)

  const handleSave = React.useCallback(async () => {
    const dirPath = FileSystem.documentDirectory + configs.saveDir + '/'

    const fileName = await DialogPrompt.openDialog({
      title: 'Enter save name',
      description: 'Please enter save name',
      textInput: {
        label: 'Save name',
        initialValue: savedName,
        isRequired: true,
      },
    })

    if (!fileName) return

    const filepath = dirPath + step + '_' + fileName + '.json'

    const dirInfo = await FileSystem.getInfoAsync(dirPath)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath)
    }

    if (fileName !== savedName) {
      const oldFile = await FileSystem.getInfoAsync(filepath)

      if (oldFile.exists) {
        const result = await DialogPrompt.openDialog({
          title: 'Overwrite the save',
          description: 'Confirm overwriting to ' + fileName,
        })

        if (!result) return
      }
    }

    await FileSystem.writeAsStringAsync(
      filepath,
      JSON.stringify(values, null, 2),
    )
    setName(fileName)
    onSaved && onSaved(fileName)
  }, [step, values, savedName, onSaved])

  return (
    <Button
      style={style}
      onPress={handleSave}
      icon={s => <Icon name="save" {...s} />}>
      Save
    </Button>
  )
}

export default SaveButton
