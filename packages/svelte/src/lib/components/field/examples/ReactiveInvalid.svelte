<script lang="ts">
  import { Field } from '../index'

  let errorMessage = $state('')
  const invalid = $derived(Boolean(errorMessage))
</script>

<input bind:value={errorMessage} placeholder="Type an error message" aria-label="Error message" />
<Field.Root {invalid}>
  <span>IsInvalid? {String(invalid)}</span>
  <Field.ErrorText style="color: red">{errorMessage}</Field.ErrorText>
</Field.Root>
