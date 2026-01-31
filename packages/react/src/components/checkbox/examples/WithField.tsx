import { Field } from '~/components/field/index'
import { Checkbox } from '../index'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <Checkbox.Root>
        <Checkbox.Label>Label</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>
            +
          </Checkbox.Indicator>
          <Checkbox.Indicator indeterminate>
            _
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
