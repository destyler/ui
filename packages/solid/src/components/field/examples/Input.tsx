import { Field } from '@destyler-ui/solid/field'

export function Input() {
  return (
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <Field.Input />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
