<script module lang="ts">
  import type { FieldsetRootProps } from '../index'

  export interface WithCheckboxProps extends FieldsetRootProps {}
</script>

<script lang="ts">
  import { Checkbox } from '../../checkbox'
  import { Field } from '../../field'
  import { Fieldset } from '../index'

  const props: WithCheckboxProps = $props()
</script>

<Fieldset.Root {...props}>
  <Fieldset.Legend>Legend</Fieldset.Legend>
  <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
  <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
  <Field.Root>
    <Checkbox.Root>
      <Checkbox.Label>Checkbox</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>✔️</Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
    <Field.HelperText>Field Helper Text</Field.HelperText>
    <Field.ErrorText>Field Error Text</Field.ErrorText>
  </Field.Root>
</Fieldset.Root>
