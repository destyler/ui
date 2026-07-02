import { Field } from '../index'

export interface RequiredIndicatorProps extends Field.RootProps {}

export function RequiredIndicator(props: RequiredIndicatorProps) {
  return (
    <Field.Root required {...props}>
      <Field.Label>
        Username
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input placeholder="Enter your username" />
    </Field.Root>
  )
}
