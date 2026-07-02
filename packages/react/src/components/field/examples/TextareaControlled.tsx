import { useState } from 'react'
import { Field } from '../index'

export interface TextareaControlledProps extends Field.RootProps {}

export function TextareaControlled(props: TextareaControlledProps) {
  const [value, setValue] = useState('This is some text\nthen more text')

  return (
    <>
      <span>Textarea value: {value}</span>
      <Field.Root {...props}>
        <Field.Label>Label</Field.Label>
        <Field.Textarea value={value} onChange={e => setValue(e.target.value)} />
        <Field.HelperText>Some additional Info</Field.HelperText>
        <Field.ErrorText>Error Info</Field.ErrorText>
      </Field.Root>
    </>
  )
}
