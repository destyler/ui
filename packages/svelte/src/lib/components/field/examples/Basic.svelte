<script module lang="ts">
  import type { FieldRootProps } from '../index'

  export interface BasicProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../index'

  const props: BasicProps = $props()
</script>

<Field.Root invalid required {...props}>
  <Field.Label>
    Label
    <Field.RequiredIndicator />
  </Field.Label>
  <Field.Input />
  <Field.HelperText>Some additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
