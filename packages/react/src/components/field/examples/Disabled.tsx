import { Field } from '../index'

export interface DisabledProps extends Field.RootProps {}

export function Disabled(props: DisabledProps) {
  return (
    <Field.Root data-testid="root" disabled {...props}>
      <Field.Label>Label</Field.Label>
      <Field.Input />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
