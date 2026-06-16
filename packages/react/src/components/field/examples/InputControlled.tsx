import { useState } from 'react'
import { Field } from '../index'

export interface InputControlledProps extends Field.RootProps {}

export function InputControlled(props: InputControlledProps) {
  const [value, setValue] = useState('Input is controlled')

  return (
    <>
      <span>Input text: {value}</span>
      <Field.Root {...props}>
        <Field.Label>Label</Field.Label>
        <Field.Input value={value} onChange={e => setValue(e.target.value)} />
        <Field.HelperText>Some additional Info</Field.HelperText>
        <Field.ErrorText>Error Info</Field.ErrorText>
      </Field.Root>
    </>
  )
}
