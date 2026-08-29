<script lang="ts">
  import { Checkbox, useCheckbox } from '../index'

  const id = $props.id()
  const checkbox = useCheckbox({ id })
</script>

<output>{checkbox().checked ? 'Checked' : 'UnChecked'}</output>
<button type="button" onclick={() => checkbox().toggleChecked()}>Toggle</button>

<Checkbox.RootProvider value={checkbox}>
  <Checkbox.Label>Checkbox</Checkbox.Label>
  <Checkbox.Control><Checkbox.Indicator>x</Checkbox.Indicator></Checkbox.Control>
  <Checkbox.HiddenInput />
</Checkbox.RootProvider>
