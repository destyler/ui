<script module lang="ts">
  import type { FieldsetRootProps } from '../index'

  export interface BasicProps extends FieldsetRootProps {}
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { Fieldset } from '../index'

  const props: BasicProps = $props()
</script>

<Fieldset.Root invalid {...props}>
  <Fieldset.Legend>Legend</Fieldset.Legend>
  <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
  <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
  <Field.Root>
    <Field.Label>Label</Field.Label>
    <Field.Input />
    <Field.HelperText>Field Helper Text</Field.HelperText>
    <Field.ErrorText>Field Error Text</Field.ErrorText>
  </Field.Root>
</Fieldset.Root>
