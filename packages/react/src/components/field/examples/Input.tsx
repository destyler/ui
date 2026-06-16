import { Field } from '../index'

export interface InputProps extends Field.RootProps {}

export function Input(props: InputProps) {
  return (
    <Field.Root {...props}>
      <Field.Label>Label</Field.Label>
      <Field.Input />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
