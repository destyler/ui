import { Field } from '../index'

export interface TextareaAutoresizeProps extends Field.RootProps {}

export function TextareaAutoresize(props: TextareaAutoresizeProps) {
  return (
    <Field.Root {...props}>
      <Field.Label>Label</Field.Label>
      <Field.Textarea autoresize />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
