<script module lang="ts">
  import type { FieldRootProps } from '../../field'

  export interface WithFieldProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { Switch } from '../index'

  const props: WithFieldProps = $props()
</script>

<Field.Root {...props}>
  <Switch.Root>
    <Switch.Control><Switch.Thumb /></Switch.Control>
    <Switch.Label>Label</Switch.Label>
    <Switch.HiddenInput />
  </Switch.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
