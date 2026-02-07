import type { UseNumberInputProps } from '../hooks/use-number-input'
import { Field } from '~/components/field'
import { NumberInput } from '../index'

export interface WithFieldProps extends UseNumberInputProps {
  invalid?: boolean
}

export function WithField(props: WithFieldProps) {
  const { invalid, ...numberInputProps } = props

  return (
    <Field.Root invalid={invalid}>
      <NumberInput.Root {...numberInputProps}>
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
