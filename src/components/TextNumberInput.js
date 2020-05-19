import React from 'react'
import { Input, Select } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
  marginDense: {
    marginTop: 8,
    marginBottom: 4,
  },
  marginNormal: {
    marginTop: 16,
    marginBottom: 8,
  },
})

export const TextNumberInput = props => {
  const {
    style: inStyle = {},
    field,
    label,
    form,
    placeholder,
    optional,
    select,
    children,
    data,
    margin = 'none',
  } = props
  const { value, onChange, onBlur, name } = field || props

  const handleChange = React.useCallback(
    (e, c) => {
      const handler = (form && form.handleChange(name)) || onChange
      if (select) {
        return handler('value' in e ? e.value : e.text)
      }
      handler(e)
    },
    [select, (form && form.handleChange(name)) || onChange],
  )
  const meta = (form && form.getFieldMeta(name)) || {}
  const handleBlur = (form && form.handleBlur(name)) || onBlur
  const error = optional
    ? value !== '' && Number.isNaN(Number(value))
    : meta.touched && Number.isNaN(Number(value))

  const totalStyle = React.useMemo(
    () => [
      margin === 'normal' && style.marginNormal,
      margin === 'dense' && style.marginDense,
      inStyle,
    ],
    [margin, inStyle],
  )

  return select ? (
    <Select
      style={totalStyle}
      label={label}
      placeholder={placeholder}
      selectedOption={
        (select instanceof Array &&
          select.find(d =>
            'value' in d ? d.value === value : d.text === value,
          )) ||
        value
      }
      keyExtractor={d => d.value || d.text}
      onSelect={handleChange}
      // onBlur={handleBlur}
      status={error ? 'warning' : 'basic'}
      data={data || select}
    />
  ) : (
    <Input
      style={totalStyle}
      label={label}
      keyboardType="numeric"
      placeholder={placeholder}
      value={value}
      onChangeText={handleChange}
      onBlur={handleBlur}
      status={error ? 'warning' : 'basic'}
    />
  )

  // return (
  //   <Item stackedLabel={!picker} error={error}>
  //     {label && <Label key="label">{label}</Label>}
  //     {picker ? (
  //       <Picker
  //         key="picker"
  //         mode="dropdown"
  //         iosIcon={<Icon name="arrow-down" />}
  //         placeholder="Select fluid type"
  //         placeholderStyle={{ color: '#bfc6ea' }}
  //         placeholderIconColor="#007aff"
  //         selectedValue={value}
  //         onBlur={handleBlur}
  //         onValueChange={handleChange}>
  //         {children}
  //       </Picker>
  //     ) : (
  //       <Input
  //         key="input"
  //         keyboardType="numeric"
  //         value={value}
  //         onChangeText={handleChange}
  //         onBlur={handleBlur}
  //         name={name}
  //       />
  //     )}
  //     {error && <Icon key="erroricon" name="close-circle" />}
  //   </Item>
}

export default TextNumberInput
