<script lang="ts">
  import { Field } from '../index'

  let value = $state('This is some text\nthen more text')
</script>

<span>Textarea value: {value}</span>
<Field.Root>
  <Field.Label>Label</Field.Label>
  <Field.Textarea {value} oninput={(event) => (value = event.currentTarget.value)} />
  <Field.HelperText>Some additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
