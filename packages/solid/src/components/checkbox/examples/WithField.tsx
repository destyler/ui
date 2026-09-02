import { Checkbox } from '@destyler-ui/solid/checkbox'
import { Field } from '@destyler-ui/solid/field'
import { CheckIcon, MinusIcon } from 'lucide-solid'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <Checkbox.Root>
        <Checkbox.Label>Label</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
          <Checkbox.Indicator indeterminate>
            <MinusIcon />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
