<script lang="ts">
  import { Field } from '../index'

  let value = $state('Input is controlled')
</script>

<span>Input text: {value}</span>
<Field.Root>
  <Field.Label>Label</Field.Label>
  <Field.Input {value} oninput={(event) => (value = event.currentTarget.value)} />
  <Field.HelperText>Some additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
