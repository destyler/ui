<script module lang="ts">
  export interface WithFieldProps {
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
  }
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { Edit } from '../index'

  const props: WithFieldProps = $props()
</script>

<Field.Root invalid={props.invalid}>
  <Edit.Root placeholder="Placeholder" activationMode="dblclick" {...props}>
    <Edit.Label>Label</Edit.Label>
    <Edit.Area>
      <Edit.Input aria-label="editable input" />
      <Edit.Preview />
    </Edit.Area>
  </Edit.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
