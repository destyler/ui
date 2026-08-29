<script module lang="ts">
  import type { FieldRootProps } from '../../field'

  export interface WithFieldProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { Checkbox } from '../index'

  const props: WithFieldProps = $props()
</script>

<Field.Root {...props}>
  <Checkbox.Root>
    <Checkbox.Label>Label</Checkbox.Label>
    <Checkbox.Control>
      <Checkbox.Indicator>+</Checkbox.Indicator>
      <Checkbox.Indicator indeterminate>_</Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
