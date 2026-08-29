<script module lang="ts">
  import type { NumberInputRootProps } from '../index'

  export interface WithFieldProps extends NumberInputRootProps {}
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { NumberInput } from '../index'

  const {
    invalid,
    disabled,
    readOnly,
    required,
    ...numberInputProps
  }: WithFieldProps = $props()
</script>

<Field.Root {invalid} {disabled} {readOnly} {required}>
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
