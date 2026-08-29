<script lang="ts">
  import { Checkbox } from '../index'
</script>

<Checkbox.Group name="group-defaults">
  <Checkbox.Root value="individual-true" name="individual-true" disabled invalid>
    <Checkbox.Label>Individual true</Checkbox.Label>
    <Checkbox.Control />
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</Checkbox.Group>

<Checkbox.Group name="group-state" disabled invalid>
  <Checkbox.Root value="individual-false" name="individual-false" disabled={false} invalid={false}>
    <Checkbox.Label>Individual false</Checkbox.Label>
    <Checkbox.Control />
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</Checkbox.Group>
