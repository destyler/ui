<script module lang="ts">
  import type { FieldRootProps } from '../index'

  export interface InputProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../index'

  const props: InputProps = $props()
</script>

<Field.Root {...props}>
  <Field.Label>Label</Field.Label>
  <Field.Input />
  <Field.HelperText>Some additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
