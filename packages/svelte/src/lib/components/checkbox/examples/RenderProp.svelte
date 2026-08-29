<script lang="ts">
  import { Checkbox } from '../index'
</script>

<Checkbox.Root>
  <Checkbox.Control><Checkbox.Indicator>x</Checkbox.Indicator></Checkbox.Control>
  <Checkbox.Context>
    {#snippet render(checkbox)}
      <Checkbox.Label>Checkbox {String(checkbox().checked)}</Checkbox.Label>
    {/snippet}
  </Checkbox.Context>
  <Checkbox.HiddenInput />
</Checkbox.Root>
