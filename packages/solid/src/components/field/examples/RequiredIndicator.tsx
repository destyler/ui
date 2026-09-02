import { Field } from '@destyler-ui/solid/field'

export function RequiredIndicator() {
  return (
    <Field.Root required>
      <Field.Label>
        Username
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input />
    </Field.Root>
  )
}
