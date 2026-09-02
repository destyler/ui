import { Field } from '@destyler-ui/solid/field'
import { NumberInput } from '@destyler-ui/solid/number-input'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <NumberInput.Root>
        <NumberInput.Label>Label</NumberInput.Label>
        <NumberInput.Input />
        <NumberInput.Control>
          <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
          <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
        </NumberInput.Control>
      </NumberInput.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
