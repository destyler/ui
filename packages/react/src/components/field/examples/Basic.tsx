import { Field } from '../index'

export interface BasicProps extends Field.RootProps {}

export function Basic(props: BasicProps) {
  return (
    <Field.Root invalid required {...props}>
      <Field.Label>
        Label
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
