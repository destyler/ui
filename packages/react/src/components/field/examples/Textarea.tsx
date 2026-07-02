import { Field } from '../index'

export interface TextareaProps extends Field.RootProps {}

export function Textarea(props: TextareaProps) {
  return (
    <Field.Root {...props}>
      <Field.Label>Label</Field.Label>
      <Field.Textarea />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
