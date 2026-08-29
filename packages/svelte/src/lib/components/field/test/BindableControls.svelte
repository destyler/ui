<script lang="ts">
  import { Field } from '../index'

  let inputValue = $state('Initial input')
  let textareaValue = $state('Initial textarea')
  let selectValue = $state('one')
</script>

<Field.Root>
  <Field.Label>Input</Field.Label>
  <Field.Input bind:value={inputValue} />
</Field.Root>
<Field.Root>
  <Field.Label>Textarea</Field.Label>
  <Field.Textarea bind:value={textareaValue} />
</Field.Root>
<Field.Root>
  <Field.Label>Select</Field.Label>
  <Field.Select bind:value={selectValue}>
    <option value="one">One</option>
    <option value="two">Two</option>
  </Field.Select>
</Field.Root>

<output data-testid="input-value">{inputValue}</output>
<output data-testid="textarea-value">{textareaValue}</output>
<output data-testid="select-value">{selectValue}</output>
