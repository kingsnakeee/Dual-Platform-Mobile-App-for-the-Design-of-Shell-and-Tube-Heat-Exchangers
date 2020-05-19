import * as React from 'react'
import Dialog from 'react-native-dialog'

const refresher = new Set()
const promptList = []

export const DialogPrompt = () => {
  const [, refresh] = React.useReducer(s => !s)
  const [textInput, setText] = React.useState(false)
  const lastPrompt = React.useRef()
  const inputRef = React.useRef()
  refresher.add(refresh)
  React.useEffect(() => () => refresher.delete(refresh), [])

  lastPrompt.current = promptList[0] || lastPrompt.current
  const currentPrompt = lastPrompt.current

  const handleUnstack = () => {
    promptList.shift()
    setText(false)
    refresher.forEach(f => f())
  }
  const handleConfirm = () => {
    currentPrompt.resolve(
      currentPrompt.textInput
        ? textInput === false
          ? (currentPrompt.textInput && currentPrompt.textInput.initialValue) ||
            ''
          : textInput
        : true,
    )
    handleUnstack()
  }
  const handleCancel = () => {
    currentPrompt.resolve(false)
    handleUnstack()
  }

  return (
    (currentPrompt && (
      <Dialog.Container visible={promptList.length > 0}>
        <Dialog.Title>{currentPrompt.title}</Dialog.Title>
        <Dialog.Description>{currentPrompt.description}</Dialog.Description>
        {currentPrompt.textInput && (
          <Dialog.Input
            ref={inputRef}
            label={currentPrompt.textInput.label}
            value={
              textInput === false
                ? currentPrompt.textInput.initialValue || ''
                : textInput
            }
            onChangeText={setText}
          />
        )}
        <Dialog.Button
          label={currentPrompt.cancelLabel || 'Cancel'}
          onPress={handleCancel}
        />
        <Dialog.Button
          label={currentPrompt.confirmLabel || 'OK'}
          onPress={handleConfirm}
          disabled={
            currentPrompt.textInput &&
            currentPrompt.textInput.isRequired &&
            !textInput
          }
        />
      </Dialog.Container>
    )) ||
    null
  )
}

/**
 * @param param.title {string}
 * @param param.description {string}
 * @param param.cancelLabel {string}
 * @param param.confirmLabel {string}
 */
DialogPrompt.openDialog = param => {
  return new Promise(resolve => {
    promptList.push({ ...param, resolve })
    refresher.forEach(f => f())
  })
}

export default DialogPrompt
