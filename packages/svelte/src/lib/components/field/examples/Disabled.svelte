<script module lang="ts">
  import type { FieldRootProps } from '../index'

  export interface DisabledProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../index'

  const props: DisabledProps = $props()
</script>

<Field.Root data-testid="root" disabled {...props}>
  <Field.Label>Label</Field.Label>
  <Field.Input />
  <Field.HelperText>Some additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
